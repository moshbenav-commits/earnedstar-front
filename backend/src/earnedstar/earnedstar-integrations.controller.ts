/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { EarnedstarService } from './earnedstar.service';
import { ConnectShopifyDto } from './dto/earnedstar.dto';
import { MerchantAuthGuard } from '../auth/merchant-auth.guard';
import type { SupabaseAuthUser } from '../auth/supabase-auth.service';

@Controller('earnedstar/integrations')
export class EarnedstarIntegrationsController {
  constructor(private readonly earnedstar: EarnedstarService) {}

  @Get('shopify')
  @UseGuards(MerchantAuthGuard)
  status(@Req() req: { merchantUser: SupabaseAuthUser }) {
    return this.earnedstar.getShopifyIntegration(req.merchantUser.id);
  }

  @Post('shopify/connect')
  @UseGuards(MerchantAuthGuard)
  connect(@Req() req: { merchantUser: SupabaseAuthUser }, @Body() dto: ConnectShopifyDto) {
    return this.earnedstar.connectShopifyForOwner(req.merchantUser.id, dto.shop);
  }
}
