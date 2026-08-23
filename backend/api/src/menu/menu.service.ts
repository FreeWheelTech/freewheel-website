import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { SearchMenuDto } from './dto/search-menu.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  // --------------------------------------------------------------------------
  // Public (Customer) Methods
  // --------------------------------------------------------------------------

  async getCategories(restaurantId: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    return this.prisma.category.findMany({
      where: { restaurantId },
      orderBy: { name: 'asc' },
    });
  }

  async getMenu(restaurantId: string, query: SearchMenuDto) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    const {
      q,
      category,
      minPrice,
      maxPrice,
      dietaryType,
      availability,
      sort,
      limit = 20,
      cursor,
    } = query;

    const where: Prisma.MenuItemWhereInput = {
      category: { restaurantId },
    };

    if (category) {
      where.category = {
        ...(where.category as any),
        name: { equals: category, mode: 'insensitive' },
      };
    }

    if (q) {
      where.name = { contains: q, mode: 'insensitive' };
    }

    if (availability !== undefined) {
      where.availability = availability === 'true';
    }

    if (dietaryType) {
      where.dietaryType = dietaryType as any;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    let orderBy: Prisma.MenuItemOrderByWithRelationInput[] = [
      { category: { name: 'asc' } },
      { name: 'asc' },
    ];

    if (sort) {
      switch (sort) {
        case 'price_asc':
          orderBy = [{ price: 'asc' }];
          break;
        case 'price_desc':
          orderBy = [{ price: 'desc' }];
          break;
        case 'name_asc':
          orderBy = [{ name: 'asc' }];
          break;
        case 'name_desc':
          orderBy = [{ name: 'desc' }];
          break;
      }
    }

    const items = await this.prisma.menuItem.findMany({
      where,
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      include: {
        category: true,
      },
      orderBy,
    });

    let nextCursor: string | undefined = undefined;
    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem?.id;
    }

    return { data: items, nextCursor };
  }

  async searchGlobal(query: SearchMenuDto) {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      dietaryType,
      availability,
      sort,
      limit = 20,
      cursor,
    } = query;

    const where: Prisma.MenuItemWhereInput = {};

    if (category) {
      where.category = { name: { equals: category, mode: 'insensitive' } };
    }

    if (q) {
      where.name = { contains: q, mode: 'insensitive' };
    }

    if (availability !== undefined) {
      where.availability = availability === 'true';
    }

    if (dietaryType) {
      where.dietaryType = dietaryType as any;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    let orderBy: Prisma.MenuItemOrderByWithRelationInput[] = [{ name: 'asc' }];

    if (sort) {
      switch (sort) {
        case 'price_asc':
          orderBy = [{ price: 'asc' }];
          break;
        case 'price_desc':
          orderBy = [{ price: 'desc' }];
          break;
        case 'name_asc':
          orderBy = [{ name: 'asc' }];
          break;
        case 'name_desc':
          orderBy = [{ name: 'desc' }];
          break;
      }
    }

    const items = await this.prisma.menuItem.findMany({
      where,
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      include: {
        category: { include: { restaurant: true } },
      },
      orderBy,
    });

    let nextCursor: string | undefined = undefined;
    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem?.id;
    }

    return { data: items, nextCursor };
  }

  async getMenuItem(id: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        addons: true,
        category: true,
      },
    });

    if (!item) throw new NotFoundException('Menu item not found');

    return item;
  }

  // --------------------------------------------------------------------------
  // Owner Verification
  // --------------------------------------------------------------------------
  private async verifyOwner(userId: string, restaurantId: string) {
    const assignment = await this.prisma.restaurantStaff.findUnique({
      where: {
        userId_restaurantId: { userId, restaurantId },
      },
    });

    if (!assignment) {
      throw new ForbiddenException(
        'You are not authorized to manage this restaurant',
      );
    }
  }

  // --------------------------------------------------------------------------
  // Protected (Owner) Methods
  // --------------------------------------------------------------------------

  async createCategory(
    userId: string,
    restaurantId: string,
    createDto: CreateCategoryDto,
  ) {
    await this.verifyOwner(userId, restaurantId);

    // Check for duplicate category name
    const existing = await this.prisma.category.findFirst({
      where: {
        restaurantId,
        name: { equals: createDto.name, mode: 'insensitive' },
      },
    });
    if (existing)
      throw new BadRequestException(
        'Category name already exists in this restaurant',
      );

    return this.prisma.category.create({
      data: {
        restaurantId,
        name: createDto.name,
      },
    });
  }

  async updateCategory(
    userId: string,
    categoryId: string,
    updateDto: UpdateCategoryDto,
  ) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) throw new NotFoundException('Category not found');

    await this.verifyOwner(userId, category.restaurantId);

    return this.prisma.category.update({
      where: { id: categoryId },
      data: updateDto,
    });
  }

  async deleteCategory(userId: string, categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: { menuItems: true },
    });
    if (!category) throw new NotFoundException('Category not found');

    await this.verifyOwner(userId, category.restaurantId);

    if (category.menuItems.length > 0) {
      throw new BadRequestException(
        'Cannot delete category containing menu items',
      );
    }

    await this.prisma.category.delete({ where: { id: categoryId } });
    return { success: true };
  }

  async createMenuItem(
    userId: string,
    categoryId: string,
    createDto: CreateMenuItemDto,
  ) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) throw new NotFoundException('Category not found');

    await this.verifyOwner(userId, category.restaurantId);

    return this.prisma.menuItem.create({
      data: {
        categoryId,
        name: createDto.name,
        description: createDto.description,
        price: createDto.price,
        dietaryType: createDto.dietaryType,
        availability: createDto.availability ?? true,
      },
    });
  }

  async updateMenuItem(
    userId: string,
    menuItemId: string,
    updateDto: UpdateMenuItemDto,
  ) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id: menuItemId },
      include: { category: true },
    });
    if (!item) throw new NotFoundException('Menu item not found');

    await this.verifyOwner(userId, item.category.restaurantId);

    return this.prisma.menuItem.update({
      where: { id: menuItemId },
      data: updateDto,
    });
  }

  async updateMenuItemAvailability(
    userId: string,
    menuItemId: string,
    availability: boolean,
  ) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id: menuItemId },
      include: { category: true },
    });
    if (!item) throw new NotFoundException('Menu item not found');

    await this.verifyOwner(userId, item.category.restaurantId);

    return this.prisma.menuItem.update({
      where: { id: menuItemId },
      data: { availability },
    });
  }

  async deleteMenuItem(userId: string, menuItemId: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id: menuItemId },
      include: { category: true },
    });
    if (!item) throw new NotFoundException('Menu item not found');

    await this.verifyOwner(userId, item.category.restaurantId);

    await this.prisma.menuItem.delete({ where: { id: menuItemId } });
    return { success: true };
  }
}
