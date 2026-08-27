import { Controller, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { MenuService } from './menu.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';

type UserPayload = { sub: string; role: string };

@Controller()
@Roles(Role.OWNER, Role.ADMIN)
export class OwnerMenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('restaurants/:id/categories')
  createCategory(
    @CurrentUser() user: UserPayload,
    @Param('id') restaurantId: string,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.menuService.createCategory(user.sub, restaurantId, dto);
  }

  @Patch('categories/:id')
  updateCategory(
    @CurrentUser() user: UserPayload,
    @Param('id') categoryId: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.menuService.updateCategory(user.sub, categoryId, dto);
  }

  @Delete('categories/:id')
  deleteCategory(
    @CurrentUser() user: UserPayload,
    @Param('id') categoryId: string,
  ) {
    return this.menuService.deleteCategory(user.sub, categoryId);
  }

  @Post('categories/:id/menu-items')
  createMenuItem(
    @CurrentUser() user: UserPayload,
    @Param('id') categoryId: string,
    @Body() dto: CreateMenuItemDto,
  ) {
    return this.menuService.createMenuItem(user.sub, categoryId, dto);
  }

  @Patch('menu-items/:id')
  updateMenuItem(
    @CurrentUser() user: UserPayload,
    @Param('id') menuItemId: string,
    @Body() dto: UpdateMenuItemDto,
  ) {
    return this.menuService.updateMenuItem(user.sub, menuItemId, dto);
  }

  @Patch('menu-items/:id/availability')
  updateMenuItemAvailability(
    @CurrentUser() user: UserPayload,
    @Param('id') menuItemId: string,
    @Body() dto: UpdateAvailabilityDto,
  ) {
    return this.menuService.updateMenuItemAvailability(
      user.sub,
      menuItemId,
      dto.availability,
    );
  }

  @Delete('menu-items/:id')
  deleteMenuItem(
    @CurrentUser() user: UserPayload,
    @Param('id') menuItemId: string,
  ) {
    return this.menuService.deleteMenuItem(user.sub, menuItemId);
  }
}
