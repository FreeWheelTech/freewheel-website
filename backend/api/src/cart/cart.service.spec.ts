import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: PrismaService,
          useValue: {
            customerProfile: { findUnique: jest.fn(), create: jest.fn() },
            cart: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            menuItem: { findUnique: jest.fn() },
            menuItemAddon: { findMany: jest.fn() },
            cartItem: {
              update: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
              deleteMany: jest.fn(),
            },
            cartItemAddon: { createMany: jest.fn() },
            $transaction: jest.fn((cb) => cb(prisma)),
          },
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should calculate server prices correctly and ignore any fake client prices', async () => {
    jest
      .spyOn(prisma.customerProfile, 'findUnique')
      .mockResolvedValue({ id: 'cp1', userId: 'user1' });
    jest.spyOn(prisma.cart, 'findUnique').mockResolvedValue({
      id: 'cart1',
      customerProfileId: 'cp1',
      restaurantId: 'rest1',
      items: [
        {
          id: 'item1',
          quantity: 2,
          menuItem: { id: 'm1', name: 'Chicken Roll', price: 89 },
          addons: [{ menuItemAddon: { id: 'a1', name: 'Cheese', price: 10 } }],
        },
      ],
    } as any);

    const result = await service.getCart('user1');
    expect(result.subtotal).toBe(198); // (89+10)*2
    expect(result.items[0].lineTotal).toBe(198);
  });

  it('should reject adding an unavailable menu item', async () => {
    jest
      .spyOn(prisma.customerProfile, 'findUnique')
      .mockResolvedValue({ id: 'cp1', userId: 'user1' });
    jest
      .spyOn(prisma.cart, 'findUnique')
      .mockResolvedValue({ id: 'cart1', items: [] } as any);
    jest.spyOn(prisma.menuItem, 'findUnique').mockResolvedValue({
      id: 'm1',
      availability: false,
      category: { restaurantId: 'rest1' },
    } as any);

    await expect(
      service.addItem('user1', { menuItemId: 'm1', quantity: 1 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should reject adding an item from a different restaurant', async () => {
    jest
      .spyOn(prisma.customerProfile, 'findUnique')
      .mockResolvedValue({ id: 'cp1', userId: 'user1' });
    jest.spyOn(prisma.cart, 'findUnique').mockResolvedValue({
      id: 'cart1',
      restaurantId: 'rest1',
      items: [{ id: 'item1' }],
    } as any);
    jest.spyOn(prisma.menuItem, 'findUnique').mockResolvedValue({
      id: 'm2',
      availability: true,
      category: { restaurantId: 'rest2' },
    } as any);

    await expect(
      service.addItem('user1', { menuItemId: 'm2', quantity: 1 }),
    ).rejects.toThrow(ConflictException);
  });
});
