import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, BadRequestException } from '@nestjs/common';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let prisma: PrismaService;

  const mockPrisma = {
    order: { findFirst: jest.fn() },
    review: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    restaurant: {
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrisma)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('createReview', () => {
    it('1. Throws Forbidden if order is not completed or not owned by user', async () => {
      mockPrisma.order.findFirst.mockResolvedValue(null);
      await expect(service.createReview('r1', 'c1', { orderId: 'o1', rating: 5 }))
        .rejects.toThrow(ForbiddenException);
    });

    it('2. Creates review and updates restaurant aggregates', async () => {
      mockPrisma.order.findFirst.mockResolvedValue({ id: 'o1' });
      mockPrisma.review.create.mockResolvedValue({ id: 'rev1', rating: 5 });
      mockPrisma.restaurant.findUniqueOrThrow.mockResolvedValue({ id: 'r1', reviewCount: 1, averageRating: 4.0 });
      mockPrisma.restaurant.update.mockResolvedValue({});

      const result = await service.createReview('r1', 'c1', { orderId: 'o1', rating: 5 });

      expect(result).toEqual({ id: 'rev1', rating: 5 });
      expect(mockPrisma.restaurant.update).toHaveBeenCalledWith({
        where: { id: 'r1' },
        data: {
          reviewCount: 2,
          averageRating: 4.5, // (4 * 1 + 5) / 2
        }
      });
    });

    it('3. Throws BadRequest on duplicate review (P2002)', async () => {
      mockPrisma.order.findFirst.mockResolvedValue({ id: 'o1' });
      mockPrisma.$transaction.mockRejectedValueOnce({ code: 'P2002' });

      await expect(service.createReview('r1', 'c1', { orderId: 'o1', rating: 5 }))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('updateReview', () => {
    it('4. Throws Forbidden if review does not exist or user is unauthorized', async () => {
      mockPrisma.review.findUnique.mockResolvedValue(null);
      await expect(service.updateReview('rev1', 'c1', { rating: 4 }))
        .rejects.toThrow(ForbiddenException);
    });

    it('5. Updates review and recalculates aggregates properly', async () => {
      mockPrisma.review.findUnique.mockResolvedValue({ id: 'rev1', customerProfileId: 'c1', restaurantId: 'r1', rating: 3 });
      mockPrisma.review.update.mockResolvedValue({ id: 'rev1', rating: 5 });
      mockPrisma.restaurant.findUniqueOrThrow.mockResolvedValue({ id: 'r1', reviewCount: 2, averageRating: 4.0 });

      await service.updateReview('rev1', 'c1', { rating: 5 });

      expect(mockPrisma.restaurant.update).toHaveBeenCalledWith({
        where: { id: 'r1' },
        data: { averageRating: 5.0 }, // (4*2 - 3 + 5) / 2 = 5
      });
    });
  });

  describe('deleteReview', () => {
    it('6. Deletes review and updates aggregates (count > 0)', async () => {
      mockPrisma.review.findUnique.mockResolvedValue({ id: 'rev1', customerProfileId: 'c1', restaurantId: 'r1', rating: 5 });
      mockPrisma.restaurant.findUniqueOrThrow.mockResolvedValue({ id: 'r1', reviewCount: 2, averageRating: 4.5 });

      await service.deleteReview('rev1', 'c1');

      expect(mockPrisma.restaurant.update).toHaveBeenCalledWith({
        where: { id: 'r1' },
        data: { reviewCount: 1, averageRating: 4.0 }, // (4.5*2 - 5) / 1 = 4.0
      });
    });

    it('7. Deletes review and sets avg to 0 if count becomes 0', async () => {
      mockPrisma.review.findUnique.mockResolvedValue({ id: 'rev1', customerProfileId: 'c1', restaurantId: 'r1', rating: 5 });
      mockPrisma.restaurant.findUniqueOrThrow.mockResolvedValue({ id: 'r1', reviewCount: 1, averageRating: 5.0 });

      await service.deleteReview('rev1', 'c1');

      expect(mockPrisma.restaurant.update).toHaveBeenCalledWith({
        where: { id: 'r1' },
        data: { reviewCount: 0, averageRating: 0 },
      });
    });
  });
});
