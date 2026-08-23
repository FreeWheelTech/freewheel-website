import {
  Controller,
  Post,
  Body,
  Headers,
  Req,
  UseGuards,
  Request,
  RawBodyRequest,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  createPayment(@Request() req: any, @Body('orderId') orderId: string) {
    return this.paymentsService.createPayment(req.user.id, orderId);
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  verifyPayment(@Request() req: any, @Body('orderId') orderId: string) {
    return this.paymentsService.verifyPayment(req.user.id, orderId);
  }

  @Post('webhook')
  handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: any, // Using any to avoid TS1272 for RawBodyRequest in decorators
  ) {
    if (!req.rawBody) {
      throw new Error('rawBody is required for stripe webhook');
    }
    // Stripe requires the raw, unparsed body to verify signatures.
    return this.paymentsService.handleStripeWebhook(signature, req.rawBody);
  }
}
