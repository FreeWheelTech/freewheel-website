import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
      apiVersion: '2025-01-27.acacia' as any,
    });
  }

  async createPayment(userId: string, orderId: string) {
    // 1. Fetch Order
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.customerProfileId !== (await this.getCustomerProfileId(userId))) {
      throw new BadRequestException('Unauthorized access to order');
    }

    if (order.status !== 'PENDING') {
      throw new BadRequestException(
        'Order is already being processed or completed',
      );
    }

    // 2. Check existing payment
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
    });
    if (
      payment &&
      (payment.status === 'SUCCESS' || payment.status === 'AUTHORIZED')
    ) {
      throw new BadRequestException('Order is already paid');
    }

    // 3. Amount is derived strictly from server order total. Never from client.
    // Stripe expects amount in smallest currency unit (paise for INR)
    const amountInPaise = Math.round(Number(order.total) * 100);

    // 4. Initialize or update Stripe PaymentIntent
    let clientSecret = '';

    if (payment && payment.providerPaymentId) {
      // Update existing intent
      const intent = await this.stripe.paymentIntents.update(
        payment.providerPaymentId,
        {
          amount: amountInPaise,
        },
      );
      clientSecret = intent.client_secret || '';
    } else {
      // Create new intent
      const intent = await this.stripe.paymentIntents.create({
        amount: amountInPaise,
        currency: 'inr',
        metadata: {
          orderId: order.id,
          userId: userId,
        },
      });
      clientSecret = intent.client_secret || '';

      // Upsert Payment Record
      await this.prisma.payment.upsert({
        where: { orderId: order.id },
        update: {
          providerPaymentId: intent.id,
          status: 'CREATED',
          amount: order.total,
        },
        create: {
          orderId: order.id,
          provider: 'STRIPE',
          providerPaymentId: intent.id,
          status: 'CREATED',
          amount: order.total,
          currency: 'INR',
        },
      });
    }

    return { clientSecret };
  }

  async verifyPayment(userId: string, orderId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
      include: { order: true },
    });
    if (!payment) throw new NotFoundException('Payment not found');

    if (
      payment.order.customerProfileId !==
      (await this.getCustomerProfileId(userId))
    ) {
      throw new BadRequestException('Unauthorized access to order');
    }

    // If already marked success via webhook or previous verification, return early
    if (payment.status === 'SUCCESS') {
      return { success: true, payment };
    }

    if (!payment.providerPaymentId)
      throw new BadRequestException('Payment does not have a provider ID');

    const intent = await this.stripe.paymentIntents.retrieve(
      payment.providerPaymentId,
    );

    if (intent.status === 'succeeded') {
      await this.handlePaymentSuccess(payment.orderId);
      return { success: true };
    }

    return { success: false, status: intent.status };
  }

  async handleStripeWebhook(signature: string, rawBody: Buffer) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock';
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      throw new BadRequestException(`Webhook Error: ${message}`);
    }

    // Handle idempotency and state transition
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;
      if (orderId) {
        await this.handlePaymentSuccess(orderId);
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;
      if (orderId) {
        await this.prisma.payment.update({
          where: { orderId },
          data: { status: 'FAILED' },
        });
      }
    }

    return { received: true };
  }

  private async handlePaymentSuccess(orderId: string) {
    // Idempotent database operation using transaction
    await this.prisma.$transaction(async (tx) => {
      const currentPayment = await tx.payment.findUnique({
        where: { orderId },
      });
      if (currentPayment && currentPayment.status === 'SUCCESS') {
        return; // Already processed
      }

      await tx.payment.update({
        where: { orderId },
        data: { status: 'SUCCESS' },
      });

      const order = await tx.order.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED' },
        include: {
          restaurant: true,
          customerProfile: { include: { user: true } },
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          newStatus: 'CONFIRMED',
        },
      });

      // Find all owners of the restaurant and notify them
      const owners = await tx.restaurantStaff.findMany({
        where: { restaurantId: order.restaurantId },
      });

      if (owners.length > 0) {
        await tx.notification.createMany({
          data: owners.map((staff: { userId: string }) => ({
            userId: staff.userId,
            title: 'New Order Received',
            message: `Order #${order.id.substring(0, 8)} confirmed for ₹${order.total.toString()}.`,
            type: 'NEW_ORDER',
          })),
        });
      }

      // Notify the customer as well
      await tx.notification.create({
        data: {
          userId: order.customerProfile.user.id,
          title: 'Order Confirmed',
          message: `Your payment was successful and Order #${order.id.substring(0, 8)} is confirmed!`,
          type: 'ORDER_CONFIRMED',
        },
      });
    });
  }

  private async getCustomerProfileId(userId: string) {
    const profile = await this.prisma.customerProfile.findUnique({
      where: { userId },
    });
    if (!profile) throw new NotFoundException('Customer profile not found');
    return profile.id;
  }
}
