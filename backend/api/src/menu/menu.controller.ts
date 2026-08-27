import { Controller, Get, Param, Query } from '@nestjs/common';
import { MenuService } from './menu.service';
import { Public } from '../auth/decorators/public.decorator';
import { SearchMenuDto } from './dto/search-menu.dto';

@Controller()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Public()
  @Get('restaurants/:id/categories')
  getCategories(@Param('id') restaurantId: string) {
    return this.menuService.getCategories(restaurantId);
  }

  @Public()
  @Get('menu/search')
  searchGlobal(@Query() query: SearchMenuDto) {
    return this.menuService.searchGlobal(query);
  }

  @Public()
  @Get('restaurants/:id/menu')
  getMenu(
    @Param('id') restaurantId: string,
    @Query() query: SearchMenuDto
  ) {
    return this.menuService.getMenu(restaurantId, query);
  }

  @Public()
  @Get('menu-items/:id')
  getMenuItem(@Param('id') menuItemId: string) {
    return this.menuService.getMenuItem(menuItemId);
  }
}
