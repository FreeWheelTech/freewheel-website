import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(restaurantId: string, customerProfileId: string, dto: CreateReviewDto) {
    // 1. Validate Order eligibility
    const order = await this.prisma.order.findFirst({
      where: {
        id: dto.orderId,
        restaurantId,
        customerProfileId,
        status: 'COMPLETED',
      },
    });

    if (!order) {
      throw new ForbiddenException('You can only review a completed order from this restaurant.');
    }

    // 2. Perform Transaction
    try {
      return await this.prisma.$transaction(async (tx) => {
        // Create the review
        const review = await tx.review.create({
          data: {
            restaurantId,
            customerProfileId,
            orderId: dto.orderId,
            rating: dto.rating,
            comment: dto.comment?.trim(),
          },
        });

        // Update aggregates
        const restaurant = await tx.restaurant.findUniqueOrThrow({
          where: { id: restaurantId },
        });

        const oldCount = restaurant.reviewCount;
        const oldAvg = Number(restaurant.averageRating);
        const newCount = oldCount + 1;
        const newAvg = (oldAvg * oldCount + dto.rating) / newCount;

        await tx.restaurant.update({
          where: { id: restaurantId },
          data: {
            reviewCount: newCount,
            averageRating: newAvg,
          },
        });

        return review;
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('You have already reviewed this order.');
      }
      throw error;
    }
  }

  async getRestaurantReviews(restaurantId: string, limit: number = 20, cursor?: string) {
    const take = limit + 1;
    
    const reviews = await this.prisma.review.findMany({
      where: { restaurantId },
      take,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        customerProfile: {
          include: { user: { select: { name: true } } }
        }
      }
    });

    let nextCursor: string | undefined = undefined;
    if (reviews.length === take) {
      const nextItem = reviews.pop();
      nextCursor = nextItem?.id;
    }

    // Map to clean format hiding user details
    const mapped = reviews.map(r => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      customerName: r.customerProfile.user.name,
    }));

    return {
      data: mapped,
      nextCursor,
    };
  }

  async updateReview(reviewId: string, customerProfileId: string, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review || review.customerProfileId !== customerProfileId) {
      throw new ForbiddenException('Review not found or unauthorized.');
    }

    return await this.prisma.$transaction(async (tx) => {
      const updatedReview = await tx.review.update({
        where: { id: reviewId },
        data: {
          rating: dto.rating,
          comment: dto.comment?.trim(),
        },
      });

      if (dto.rating !== undefined && dto.rating !== review.rating) {
        const restaurant = await tx.restaurant.findUniqueOrThrow({
          where: { id: review.restaurantId },
        });

        const count = restaurant.reviewCount;
        const oldAvg = Number(restaurant.averageRating);
        // If count is somehow 0 (shouldn't be), prevent division by zero
        if (count > 0) {
          const newAvg = (oldAvg * count - review.rating + dto.rating) / count;
          await tx.restaurant.update({
            where: { id: review.restaurantId },
            data: { averageRating: newAvg },
          });
        }
      }

      return updatedReview;
    });
  }

  async deleteReview(reviewId: string, customerProfileId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review || review.customerProfileId !== customerProfileId) {
      throw new ForbiddenException('Review not found or unauthorized.');
    }

    return await this.prisma.$transaction(async (tx) => {
      await tx.review.delete({
        where: { id: reviewId },
      });

      const restaurant = await tx.restaurant.findUniqueOrThrow({
        where: { id: review.restaurantId },
      });

      const oldCount = restaurant.reviewCount;
      const oldAvg = Number(restaurant.averageRating);
      const newCount = Math.max(0, oldCount - 1);
      const newAvg = newCount === 0 ? 0 : (oldAvg * oldCount - review.rating) / newCount;

      await tx.restaurant.update({
        where: { id: review.restaurantId },
        data: {
          reviewCount: newCount,
          averageRating: newAvg,
        },
      });

      return { success: true };
    });
  }
}
