import { Test, TestingModule } from '@nestjs/testing';
import { OwnerMenuController } from './owner-menu.controller';
import { MenuService } from './menu.service';

describe('OwnerMenuController', () => {
  let controller: OwnerMenuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OwnerMenuController],
      providers: [{ provide: MenuService, useValue: {} }],
    }).compile();

    controller = module.get<OwnerMenuController>(OwnerMenuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
