import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchRestaurantDto } from './dto/search-restaurant.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: SearchRestaurantDto) {
    const { q, limit = 20, cursor } = query;

    const where: Prisma.RestaurantWhereInput = { status: 'ACTIVE' };
    if (q) {
      where.name = { contains: q, mode: 'insensitive' };
    }

    const items = await this.prisma.restaurant.findMany({
      where,
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
      },
    });

    let nextCursor: typeof cursor | undefined = undefined;
    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem?.id;
    }

    return {
      data: items,
      nextCursor,
    };
  }

  async findOne(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        status: true,
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return restaurant;
  }
}
