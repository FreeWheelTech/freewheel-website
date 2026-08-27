import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  Patch,
  Body,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles('CUSTOMER')
  create(@Request() req: any) {
    return this.ordersService.create(req.user.id);
  }

  @Get()
  @Roles('CUSTOMER')
  findAll(@Request() req: any) {
    return this.ordersService.findAllCustomerOrders(req.user.id);
  }

  @Get('owner')
  @Roles('OWNER', 'ADMIN')
  findOwnerOrders(@Request() req: any) {
    return this.ordersService.findOwnerOrders(req.user.id);
  }

  @Get(':id')
  @Roles('CUSTOMER')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.ordersService.findOneCustomerOrder(req.user.id, id);
  }

  @Get('owner/:id')
  @Roles('OWNER', 'ADMIN')
  findOwnerOrder(@Request() req: any, @Param('id') id: string) {
    return this.ordersService.findOneOwnerOrder(req.user.id, id);
  }

  @Patch('owner/:id/status')
  @Roles('OWNER', 'ADMIN')
  updateOwnerOrderStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.ordersService.updateOrderStatus(req.user.id, id, status);
  }
}
