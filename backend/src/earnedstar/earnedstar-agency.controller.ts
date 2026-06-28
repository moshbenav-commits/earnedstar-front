/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { EarnedstarService } from './earnedstar.service';
import { MerchantAuthGuard } from '../auth/merchant-auth.guard';
import type { SupabaseAuthUser } from '../auth/supabase-auth.service';
import { CompleteOnboardingDto, CreateAgencyClientDto } from './dto/earnedstar.dto';

@Controller('earnedstar/agency')
export class EarnedstarAgencyController {
  constructor(private readonly earnedstar: EarnedstarService) {}

  @Get('clients')
  @UseGuards(MerchantAuthGuard)
  list(@Req() req: { merchantUser: SupabaseAuthUser }) {
    return this.earnedstar.listAgencyClients(req.merchantUser.id);
  }

  @Post('clients')
  @UseGuards(MerchantAuthGuard)
  create(@Req() req: { merchantUser: SupabaseAuthUser }, @Body() dto: CreateAgencyClientDto) {
    return this.earnedstar.createAgencyClient(req.merchantUser.id, dto);
  }
}

@Controller('earnedstar/onboarding')
export class EarnedstarOnboardingController {
  constructor(private readonly earnedstar: EarnedstarService) {}

  @Get('status')
  @UseGuards(MerchantAuthGuard)
  status(@Req() req: { merchantUser: SupabaseAuthUser }) {
    return this.earnedstar.getOnboardingStatus(req.merchantUser.id);
  }

  @Post('complete')
  @UseGuards(MerchantAuthGuard)
  complete(@Req() req: { merchantUser: SupabaseAuthUser }, @Body() dto: CompleteOnboardingDto) {
    return this.earnedstar.completeOnboarding(req.merchantUser.id, dto);
  }
}
