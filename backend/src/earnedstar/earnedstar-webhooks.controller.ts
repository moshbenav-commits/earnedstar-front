/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Body, Controller, Headers, Post } from '@nestjs/common';
import { EarnedstarService } from './earnedstar.service';
import { OrderFulfilledWebhookDto } from './dto/earnedstar.dto';
import { SupabaseAuthService } from '../auth/supabase-auth.service';
import { UnauthorizedException } from '@nestjs/common';

@Controller('earnedstar/webhooks')
export class EarnedstarWebhooksController {
  constructor(
    private readonly earnedstar: EarnedstarService,
    private readonly auth: SupabaseAuthService,
  ) {}

  @Post('order-fulfilled')
  async orderFulfilled(
    @Headers('x-earnedstar-webhook-secret') secret: string | undefined,
    @Body() dto: OrderFulfilledWebhookDto,
  ) {
    if (!this.auth.webhookSecretMatches(secret)) {
      throw new UnauthorizedException('Invalid webhook secret');
    }
    return this.earnedstar.handleOrderFulfilled(dto);
  }
}
