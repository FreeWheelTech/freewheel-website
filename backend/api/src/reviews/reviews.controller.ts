import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Public()
  @Get('restaurants/:restaurantId/reviews')
  getRestaurantReviews(
    @Param('restaurantId') restaurantId: string,
    @Query() query: PaginationDto
  ) {
    return this.reviewsService.getRestaurantReviews(restaurantId, query.limit, query.cursor);
  }

  @Roles(Role.CUSTOMER)
  @Post('restaurants/:restaurantId/reviews')
  createReview(
    @Request() req: any,
    @Param('restaurantId') restaurantId: string,
    @Body() createReviewDto: CreateReviewDto
  ) {
    return this.reviewsService.createReview(restaurantId, req.user.customerProfile.id, createReviewDto);
  }

  @Roles(Role.CUSTOMER)
  @Patch('reviews/:reviewId')
  updateReview(
    @Request() req: any,
    @Param('reviewId') reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto
  ) {
    return this.reviewsService.updateReview(reviewId, req.user.customerProfile.id, updateReviewDto);
  }

  @Roles(Role.CUSTOMER)
  @Delete('reviews/:reviewId')
  deleteReview(
    @Request() req: any,
    @Param('reviewId') reviewId: string
  ) {
    return this.reviewsService.deleteReview(reviewId, req.user.customerProfile.id);
  }
}
