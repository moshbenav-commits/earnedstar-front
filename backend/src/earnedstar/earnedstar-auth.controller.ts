/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { EarnedstarService } from './earnedstar.service';
import { ProvisionMerchantDto, UpdateMerchantProfileDto } from './dto/earnedstar.dto';
import { MerchantAuthGuard } from '../auth/merchant-auth.guard';
import type { SupabaseAuthUser } from '../auth/supabase-auth.service';

@Controller('earnedstar/auth')
export class EarnedstarAuthController {
  constructor(private readonly earnedstar: EarnedstarService) {}

  @Get('me')
  @UseGuards(MerchantAuthGuard)
  me(@Req() req: { merchantUser: SupabaseAuthUser }) {
    return this.earnedstar.getMerchantForOwner(req.merchantUser.id);
  }

  @Post('provision')
  provision(@Body() dto: ProvisionMerchantDto) {
    return this.earnedstar.provisionMerchant(dto);
  }

  @Patch('profile')
  @UseGuards(MerchantAuthGuard)
  updateProfile(
    @Req() req: { merchantUser: SupabaseAuthUser },
    @Body() dto: UpdateMerchantProfileDto,
  ) {
    return this.earnedstar.updateMerchantProfile(req.merchantUser.id, dto);
  }
}
