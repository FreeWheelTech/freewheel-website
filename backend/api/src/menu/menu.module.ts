import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { OwnerMenuController } from './owner-menu.controller';

@Module({
  providers: [MenuService],
  controllers: [MenuController, OwnerMenuController],
})
export class MenuModule {}
