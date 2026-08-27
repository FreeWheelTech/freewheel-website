import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string) {
    const profile = await this.prisma.customerProfile.findUnique({
      where: { userId },
    });
    if (!profile) throw new NotFoundException('Customer profile not found');

    const cart = await this.prisma.cart.findUnique({
      where: { customerProfileId: profile.id },
      include: {
        items: {
          include: {
            menuItem: { include: { category: true } },
            addons: { include: { menuItemAddon: true } },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    if (!cart.restaurantId) {
      throw new BadRequestException('Cart does not belong to a restaurant');
    }

    // Server-side validation and calculation
    let subtotal = 0;
    const orderItemsData: any[] = [];

    for (const item of cart.items) {
      if (!item.menuItem.availability) {
        throw new BadRequestException(
          `Menu item ${item.menuItem.name} is currently unavailable`,
        );
      }

      const itemBasePrice = Number(item.menuItem.price);
      let addonsPrice = 0;
      const addonsData = [];

      for (const addon of item.addons) {
        if (!addon.menuItemAddon.availability) {
          throw new BadRequestException(
            `Addon ${addon.menuItemAddon.name} is currently unavailable`,
          );
        }
        const addonPrice = Number(addon.menuItemAddon.price);
        addonsPrice += addonPrice;
        addonsData.push({
          menuItemAddonId: addon.menuItemAddon.id,
          nameSnapshot: addon.menuItemAddon.name,
          priceSnapshot: addonPrice,
        });
      }

      const lineTotal = (itemBasePrice + addonsPrice) * item.quantity;
      subtotal += lineTotal;

      orderItemsData.push({
        menuItemId: item.menuItem.id,
        nameSnapshot: item.menuItem.name,
        quantity: item.quantity,
        historicalPrice: itemBasePrice,
        lineTotal,
        addons: {
          create: addonsData,
        },
      });
    }

    // Execute atomic database transaction
    return this.prisma.$transaction(async (prisma) => {
      // 1. Create Order and its nested Items/Addons
      const order = await prisma.order.create({
        data: {
          customerProfileId: profile.id,
          restaurantId: cart.restaurantId!,
          subtotal,
          total: subtotal, // Total equals subtotal for now (no taxes/discounts implemented yet)
          status: 'PENDING',
          items: {
            create: orderItemsData,
          },
          statusHistory: {
            create: {
              newStatus: 'PENDING',
            },
          },
        },
        include: {
          items: {
            include: { addons: true },
          },
        },
      });

      // 2. Clear Cart Items
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      // 3. Reset Cart Restaurant
      await prisma.cart.update({
        where: { id: cart.id },
        data: { restaurantId: null },
      });

      return order;
    });
  }

  async findAllCustomerOrders(userId: string) {
    const profile = await this.prisma.customerProfile.findUnique({
      where: { userId },
    });
    if (!profile) throw new NotFoundException('Customer profile not found');

    return this.prisma.order.findMany({
      where: { customerProfileId: profile.id },
      include: {
        restaurant: { select: { name: true, address: true } },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneCustomerOrder(userId: string, orderId: string) {
    const profile = await this.prisma.customerProfile.findUnique({
      where: { userId },
    });
    if (!profile) throw new NotFoundException('Customer profile not found');

    const order = await this.prisma.order.findFirst({
      where: { id: orderId, customerProfileId: profile.id },
      include: {
        restaurant: true,
        items: {
          include: { addons: true },
        },
        statusHistory: {
          orderBy: { timestamp: 'desc' },
        },
        payment: true,
        reviews: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findOwnerOrders(userId: string) {
    const staff = await this.prisma.restaurantStaff.findFirst({
      where: { userId },
    });
    if (!staff)
      throw new NotFoundException('You are not assigned to a restaurant');

    return this.prisma.order.findMany({
      where: { restaurantId: staff.restaurantId },
      include: {
        customerProfile: {
          include: {
            user: { select: { name: true, email: true, phone: true } },
          },
        },
        items: {
          include: { addons: true },
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneOwnerOrder(userId: string, orderId: string) {
    const staff = await this.prisma.restaurantStaff.findFirst({
      where: { userId },
    });
    if (!staff)
      throw new NotFoundException('You are not assigned to a restaurant');

    const order = await this.prisma.order.findFirst({
      where: { id: orderId, restaurantId: staff.restaurantId },
      include: {
        customerProfile: {
          include: {
            user: { select: { name: true, email: true, phone: true } },
          },
        },
        items: {
          include: { addons: true },
        },
        statusHistory: {
          orderBy: { timestamp: 'desc' },
        },
        payment: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateOrderStatus(userId: string, orderId: string, newStatus: string) {
    const staff = await this.prisma.restaurantStaff.findFirst({
      where: { userId },
    });
    if (!staff)
      throw new NotFoundException('You are not assigned to a restaurant');

    const validTransitions: Record<string, string[]> = {
      PENDING: ['CONFIRMED', 'CANCELLED', 'REJECTED'],
      CONFIRMED: ['PREPARING', 'CANCELLED'],
      PREPARING: ['READY'],
      READY: ['COMPLETED'],
      COMPLETED: [],
      CANCELLED: [],
      REJECTED: [],
    };

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: { id: orderId, restaurantId: staff.restaurantId },
        include: { customerProfile: true },
      });

      if (!order) throw new NotFoundException('Order not found');

      if (!validTransitions[order.status]?.includes(newStatus)) {
        throw new BadRequestException(
          `Invalid transition from ${order.status} to ${newStatus}`,
        );
      }

      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: { status: newStatus as any },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          previousStatus: order.status,
          newStatus: newStatus as any,
          changedById: userId,
        },
      });

      // Notification logic for Customer
      const notificationContent: Record<
        string,
        { title: string; msg: string; type: string }
      > = {
        PREPARING: {
          title: 'Order Preparing',
          msg: `Your order #${order.id.substring(0, 8)} is now being prepared!`,
          type: 'ORDER_PREPARING',
        },
        READY: {
          title: 'Order Ready',
          msg: `Your order #${order.id.substring(0, 8)} is ready!`,
          type: 'ORDER_READY',
        },
        COMPLETED: {
          title: 'Order Completed',
          msg: `Your order #${order.id.substring(0, 8)} has been completed. Enjoy your meal!`,
          type: 'ORDER_COMPLETED',
        },
        CANCELLED: {
          title: 'Order Cancelled',
          msg: `Your order #${order.id.substring(0, 8)} has been cancelled.`,
          type: 'ORDER_CANCELLED',
        },
      };

      const content = notificationContent[newStatus];
      if (content) {
        await tx.notification.create({
          data: {
            userId: order.customerProfile.userId,
            title: content.title,
            message: content.msg,
            type: content.type,
          },
        });
      }

      return updatedOrder;
    });
  }
}
