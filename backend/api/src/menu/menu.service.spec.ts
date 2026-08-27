/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { MenuService } from './menu.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { DietaryType } from '@prisma/client';

describe('MenuService', () => {
  let service: MenuService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      restaurant: { findUnique: jest.fn() },
      category: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      menuItem: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      restaurantStaff: { findUnique: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [MenuService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<MenuService>(MenuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Customer API', () => {
    it('1. Menu service retrieves items', async () => {
      prisma.restaurant.findUnique.mockResolvedValue({ id: 'r1' });
      prisma.menuItem.findMany.mockResolvedValue([
        { id: 'm1', name: 'Item 1' },
      ]);
      const res = await service.getMenu('r1', {});
      expect(res.data).toEqual([{ id: 'm1', name: 'Item 1' }]);
    });

    it('2. Category filtering works', async () => {
      prisma.restaurant.findUnique.mockResolvedValue({ id: 'r1' });
      prisma.menuItem.findMany.mockResolvedValue([]);
      await service.getMenu('r1', { category: 'ROLLS' });
      expect(prisma.menuItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: {
              restaurantId: 'r1',
              name: { equals: 'ROLLS', mode: 'insensitive' },
            },
          }),
        }),
      );
    });

    it('3. Search works', async () => {
      prisma.restaurant.findUnique.mockResolvedValue({ id: 'r1' });
      prisma.menuItem.findMany.mockResolvedValue([]);
      await service.getMenu('r1', { q: 'chicken' });
      expect(prisma.menuItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            name: { contains: 'chicken', mode: 'insensitive' },
          }),
        }),
      );
    });

    it('4. Availability filtering works', async () => {
      prisma.restaurant.findUnique.mockResolvedValue({ id: 'r1' });
      prisma.menuItem.findMany.mockResolvedValue([]);
      await service.getMenu('r1', { availability: 'true' });
      expect(prisma.menuItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ availability: true }),
        }),
      );
    });

    it('5. Pagination and sorting works', async () => {
      prisma.restaurant.findUnique.mockResolvedValue({ id: 'r1' });
      prisma.menuItem.findMany.mockResolvedValue([{ id: 'm1' }, { id: 'm2' }]);
      const res = await service.getMenu('r1', { limit: 1, cursor: 'm0', sort: 'price_asc' });
      
      expect(prisma.menuItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 2,
          cursor: { id: 'm0' },
          orderBy: [{ price: 'asc' }],
        }),
      );
      expect(res.data.length).toBe(1);
      expect(res.nextCursor).toBe('m2');
    });

    it('6. Global search works with price bounds', async () => {
      prisma.menuItem.findMany.mockResolvedValue([]);
      await service.searchGlobal({ minPrice: 50, maxPrice: 150 });
      expect(prisma.menuItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            price: { gte: 50, lte: 150 },
          }),
        }),
      );
    });
  });

  describe('Owner API Validation and Auth', () => {
    it('8. Owner authorization works', async () => {
      prisma.restaurantStaff.findUnique.mockResolvedValue({
        id: 'staff1',
        userId: 'u1',
        restaurantId: 'r1',
      });
      prisma.category.findFirst.mockResolvedValue(null);
      prisma.category.create.mockResolvedValue({ id: 'c1' });

      const res = await service.createCategory('u1', 'r1', {
        name: 'New Cat',
        restaurantId: 'r1',
      });
      expect(res).toEqual({ id: 'c1' });
    });

    it('10. Owner cannot modify another restaurant', async () => {
      prisma.restaurantStaff.findUnique.mockResolvedValue(null); // Not authorized

      await expect(
        service.createCategory('u1', 'r1', {
          name: 'New Cat',
          restaurantId: 'r1',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('5. Invalid category fails', async () => {
      prisma.category.findUnique.mockResolvedValue(null); // Category not found

      await expect(
        service.updateCategory('u1', 'invalid_cat', { name: 'newName' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('6. Invalid menu item fails', async () => {
      prisma.menuItem.findUnique.mockResolvedValue(null); // Item not found

      await expect(
        service.updateMenuItem('u1', 'invalid_item', { name: 'newName' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
