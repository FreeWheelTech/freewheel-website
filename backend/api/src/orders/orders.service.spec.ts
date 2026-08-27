import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: {
            customerProfile: { findUnique: jest.fn() },
            cart: { findUnique: jest.fn(), update: jest.fn() },
            order: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
            },
            cartItem: { deleteMany: jest.fn() },
            orderStatusHistory: {
              create: jest.fn(),
            },
            notification: {
              create: jest.fn(),
            },
            restaurantStaff: { findFirst: jest.fn() },
            $transaction: jest.fn(async (cb) => cb(prisma)),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should take historical snapshots of prices and NOT use future changed prices', async () => {
    // Mock user profile
    jest
      .spyOn(prisma.customerProfile, 'findUnique')
      .mockResolvedValue({ id: 'cp1', userId: 'user1' });

    // Mock cart containing an item and an addon
    jest.spyOn(prisma.cart, 'findUnique').mockResolvedValue({
      id: 'cart1',
      customerProfileId: 'cp1',
      restaurantId: 'rest1',
      items: [
        {
          id: 'cartItemId',
          quantity: 2,
          menuItem: {
            id: 'm1',
            name: 'Chicken Roll',
            price: 89,
            availability: true,
          },
          addons: [
            {
              menuItemAddon: {
                id: 'a1',
                name: 'Cheese',
                price: 10,
                availability: true,
              },
            },
          ],
        },
      ],
    } as any);

    // Mock order creation to capture what is being saved to the database
    let capturedOrderData: any;
    jest.spyOn(prisma.order, 'create').mockImplementation(async (args) => {
      capturedOrderData = args.data;
      return { id: 'order1' } as any;
    });

    await service.create('user1');

    // Verify subtotal is (89 + 10) * 2 = 198
    expect(capturedOrderData.subtotal).toBe(198);

    // Verify snapshots are created inside the items
    const createdItem = capturedOrderData.items.create[0];
    expect(createdItem.historicalPrice).toBe(89);
    expect(createdItem.nameSnapshot).toBe('Chicken Roll');

    const createdAddon = createdItem.addons.create[0];
    expect(createdAddon.priceSnapshot).toBe(10);
    expect(createdAddon.nameSnapshot).toBe('Cheese');
  });

  describe('Owner Order Management', () => {
    it('allows owner to fetch an order belonging to their restaurant', async () => {
      jest
        .spyOn(prisma.restaurantStaff, 'findFirst')
        .mockResolvedValue({ restaurantId: 'rest1' } as any);
      jest
        .spyOn(prisma.order, 'findFirst')
        .mockResolvedValue({ id: 'order1', restaurantId: 'rest1' } as any);

      const result = await service.findOneOwnerOrder('owner1', 'order1');
      expect(result.id).toBe('order1');
    });

    it('prevents owner from fetching order belonging to a different restaurant (IDOR)', async () => {
      jest
        .spyOn(prisma.restaurantStaff, 'findFirst')
        .mockResolvedValue({ restaurantId: 'rest1' } as any);
      // Prisma returns null because the `where: { restaurantId: 'rest1' }` doesn't match the actual order's restaurantId
      jest.spyOn(prisma.order, 'findFirst').mockResolvedValue(null);

      await expect(
        service.findOneOwnerOrder('owner1', 'order1'),
      ).rejects.toThrow('Order not found');
    });

    it('enforces valid status transitions (e.g. PREPARING to READY)', async () => {
      jest
        .spyOn(prisma.restaurantStaff, 'findFirst')
        .mockResolvedValue({ restaurantId: 'rest1' } as any);

      const txPrisma = {
        order: {
          findFirst: jest.fn().mockResolvedValue({
            id: 'order1',
            restaurantId: 'rest1',
            status: 'PREPARING',
            customerProfile: { userId: 'cust1' }
          }),
          update: jest
            .fn()
            .mockResolvedValue({ id: 'order1', status: 'READY' }),
        },
        orderStatusHistory: { create: jest.fn() },
        notification: { create: jest.fn() }
      };
      jest
        .spyOn(prisma, '$transaction')
        .mockImplementation(async (cb) => cb(txPrisma as any));

      const result = await service.updateOrderStatus(
        'owner1',
        'order1',
        'READY',
      );

      expect(result.status).toBe('READY');
      expect(txPrisma.order.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { status: 'READY' } }),
      );
      expect(txPrisma.orderStatusHistory.create).toHaveBeenCalled();
    });

    it('rejects invalid status transitions (e.g. COMPLETED to PREPARING)', async () => {
      jest
        .spyOn(prisma.restaurantStaff, 'findFirst')
        .mockResolvedValue({ restaurantId: 'rest1' } as any);

      const txPrisma = {
        order: {
          findFirst: jest.fn().mockResolvedValue({
            id: 'order1',
            restaurantId: 'rest1',
            status: 'COMPLETED',
          }),
        },
      };
      jest
        .spyOn(prisma, '$transaction')
        .mockImplementation(async (cb) => cb(txPrisma as any));

      await expect(
        service.updateOrderStatus('owner1', 'order1', 'PREPARING'),
      ).rejects.toThrow('Invalid transition from COMPLETED to PREPARING');
    });
  });
});
