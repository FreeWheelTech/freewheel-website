import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

describe('Database Tests (Phase 2)', () => {
  beforeAll(async () => {
    // Clear out everything
    await prisma.notification.deleteMany();
    await prisma.review.deleteMany();
    await prisma.orderStatusHistory.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.address.deleteMany();
    await prisma.customerProfile.deleteMany();
    await prisma.restaurantStaff.deleteMany();
    await prisma.user.deleteMany();
    await prisma.menuItemAddon.deleteMany();
    await prisma.menuItem.deleteMany();
    await prisma.category.deleteMany();
    await prisma.restaurant.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Schema Tests', () => {
    it('Valid restaurant can be created', async () => {
      const rest = await prisma.restaurant.create({
        data: {
          name: 'Test Restaurant',
          address: '123 Test St',
        },
      });
      expect(rest.id).toBeDefined();
      expect(rest.name).toBe('Test Restaurant');
    });

    it('Category requires a valid restaurant', async () => {
      await expect(
        prisma.category.create({
          data: {
            name: 'Invalid Cat',
            restaurantId: 'invalid-rest-id',
          },
        }),
      ).rejects.toThrow(); // Should throw PrismaClientKnownRequestError for foreign key
    });

    it('Duplicate category within the same restaurant is rejected', async () => {
      const rest = await prisma.restaurant.create({
        data: { name: 'Rest 2', address: '456 Test St' },
      });
      await prisma.category.create({
        data: { name: 'Unique Cat', restaurantId: rest.id },
      });
      await expect(
        prisma.category.create({
          data: { name: 'Unique Cat', restaurantId: rest.id },
        }),
      ).rejects.toThrow();
    });

    it('Required fields cannot be null', async () => {
      await expect(
        prisma.user.create({
          // @ts-expect-error missing email field
          data: {
            name: 'Null Test',
            passwordHash: 'hash',
          },
        }),
      ).rejects.toThrow();
    });
  });

  describe('Relationship and Order Design Tests', () => {
    it('Order can reference customer and restaurant, and store historical price', async () => {
      const user = await prisma.user.create({
        data: {
          name: 'Customer 1',
          email: 'cust1@test.com',
          passwordHash: 'hash',
        },
      });
      const profile = await prisma.customerProfile.create({
        data: { userId: user.id },
      });
      const rest = await prisma.restaurant.create({
        data: { name: 'Order Rest', address: '123' },
      });
      const cat = await prisma.category.create({
        data: { name: 'Order Cat', restaurantId: rest.id },
      });
      const item = await prisma.menuItem.create({
        data: { name: 'Item 1', categoryId: cat.id, price: 99.99 },
      });

      const order = await prisma.order.create({
        data: {
          customerProfileId: profile.id,
          restaurantId: rest.id,
          subtotal: 99.99,
          total: 99.99,
          status: 'PENDING',
          items: {
            create: {
              menuItemId: item.id,
              quantity: 1,
              historicalPrice: 99.99,
              nameSnapshot: 'Item 1',
              lineTotal: 99.99,
            },
          },
          statusHistory: {
            create: {
              newStatus: 'PENDING',
            },
          },
        },
        include: { items: true, statusHistory: true },
      });

      expect(order.items[0].historicalPrice.toNumber()).toBe(99.99);
      expect(order.statusHistory[0].newStatus).toBe('PENDING');
    });
  });
});
