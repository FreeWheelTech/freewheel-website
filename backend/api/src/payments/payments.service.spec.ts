import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';

jest.mock('stripe');

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prisma: PrismaService;
  let stripe: jest.Mocked<Stripe>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PrismaService,
          useValue: {
            customerProfile: { findUnique: jest.fn() },
            order: { findUnique: jest.fn(), update: jest.fn() },
            payment: {
              findUnique: jest.fn(),
              upsert: jest.fn(),
              update: jest.fn(),
            },
            orderStatusHistory: { create: jest.fn() },
            restaurantStaff: {
              findMany: jest.fn().mockResolvedValue([]),
            },
            notification: {
              createMany: jest.fn(),
              create: jest.fn(),
            },
            $transaction: jest.fn(async (cb) => cb(prisma)),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    prisma = module.get<PrismaService>(PrismaService);
    stripe = (service as any).stripe;

    // Default mocks
    stripe.paymentIntents = {
      create: jest
        .fn()
        .mockResolvedValue({ id: 'pi_123', client_secret: 'secret_123' }),
      update: jest.fn(),
      retrieve: jest.fn().mockResolvedValue({ status: 'succeeded' }),
    } as any;

    (prisma.payment.findUnique as jest.Mock).mockResolvedValue({ id: 'pay-1', status: 'CREATED', orderId: 'order-123' });
    (prisma.order.update as jest.Mock).mockResolvedValue({ id: 'order-123', total: 500, restaurantId: 'r1', customerProfile: { user: { id: 'u1' } } });

    stripe.webhooks = {
      constructEvent: jest.fn().mockReturnValue({
        type: 'payment_intent.succeeded',
        data: { object: { metadata: { orderId: 'order1' } } },
      }),
    } as any;
  });

  describe('createPayment', () => {
    it('prevents amount manipulation by calculating purely from order.total', async () => {
      jest
        .spyOn(prisma.customerProfile, 'findUnique')
        .mockResolvedValue({ id: 'cp1' } as any);
      jest.spyOn(prisma.order, 'findUnique').mockResolvedValue({
        id: 'order1',
        customerProfileId: 'cp1',
        status: 'PENDING',
        total: 500,
      } as any);
      jest.spyOn(prisma.payment, 'findUnique').mockResolvedValue(null);

      await service.createPayment('user1', 'order1');

      // The client cannot pass an amount. The service must fetch it from the database (500)
      // and pass it to Stripe as 50000 paise
      expect(stripe.paymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 50000,
          currency: 'inr',
        }),
      );
    });

    it('blocks unauthorized users from creating payments for other users orders', async () => {
      jest
        .spyOn(prisma.customerProfile, 'findUnique')
        .mockResolvedValue({ id: 'cp_hacker' } as any);
      // Order belongs to cp_victim
      jest.spyOn(prisma.order, 'findUnique').mockResolvedValue({
        id: 'order1',
        customerProfileId: 'cp_victim',
        status: 'PENDING',
        total: 500,
      } as any);

      await expect(
        service.createPayment('user_hacker', 'order1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('blocks payment creation if order is already paid', async () => {
      jest
        .spyOn(prisma.customerProfile, 'findUnique')
        .mockResolvedValue({ id: 'cp1' } as any);
      jest.spyOn(prisma.order, 'findUnique').mockResolvedValue({
        id: 'order1',
        customerProfileId: 'cp1',
        status: 'PENDING',
        total: 500,
      } as any);
      // Mock existing successful payment
      jest
        .spyOn(prisma.payment, 'findUnique')
        .mockResolvedValue({ status: 'SUCCESS' } as any);

      await expect(service.createPayment('user1', 'order1')).rejects.toThrow(
        'Order is already paid',
      );
    });
  });

  describe('handleStripeWebhook', () => {
    it('verifies signature and processes payment idempotently', async () => {
      const rawBody = Buffer.from('test');
      const signature = 'sig_123';

      // Mock payment not already success
      jest.spyOn(prisma.payment, 'findUnique').mockResolvedValue({
        id: 'pay1',
        status: 'CREATED',
        orderId: 'order1',
      } as any);

      await service.handleStripeWebhook(signature, rawBody);

      expect(stripe.webhooks.constructEvent).toHaveBeenCalledWith(
        rawBody,
        signature,
        'whsec_mock',
      );
      expect(prisma.payment.update).toHaveBeenCalledWith({
        where: { orderId: 'order1' },
        data: { status: 'SUCCESS' },
      });
      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 'order1' },
        data: { status: 'CONFIRMED' },
        include: { restaurant: true, customerProfile: { include: { user: true } } }
      });
    });

    it('skips duplicate webhooks idempotently', async () => {
      // Mock payment is already SUCCESS
      jest.spyOn(prisma.payment, 'findUnique').mockResolvedValue({
        id: 'pay1',
        status: 'SUCCESS',
        orderId: 'order1',
      } as any);

      await service.handleStripeWebhook('sig_123', Buffer.from('test'));

      // The transaction finds it is already SUCCESS, so it does not update anything
      expect(prisma.payment.update).not.toHaveBeenCalled();
      expect(prisma.order.update).not.toHaveBeenCalled();
    });

    it('throws BadRequestException if signature is invalid', async () => {
      jest.spyOn(stripe.webhooks, 'constructEvent').mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      await expect(
        service.handleStripeWebhook('bad_sig', Buffer.from('test')),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
