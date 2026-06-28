/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { EarnedstarService } from './earnedstar.service';
import { EarnedstarAiSeoService } from './earnedstar-ai-seo.service';
import { SuggestQaAnswerDto } from './dto/earnedstar.dto';
import { MerchantAuthGuard } from '../auth/merchant-auth.guard';
import type { SupabaseAuthUser } from '../auth/supabase-auth.service';

@Controller('earnedstar/seo')
export class EarnedstarSeoController {
  constructor(
    private readonly earnedstar: EarnedstarService,
    private readonly aiSeo: EarnedstarAiSeoService,
  ) {}

  /** Public — used by Next.js sitemap generation */
  @Get('sitemap-merchants')
  listSitemapMerchants() {
    return this.earnedstar.listSitemapMerchants();
  }

  @Get('health')
  @UseGuards(MerchantAuthGuard)
  health(@Req() req: { merchantUser: SupabaseAuthUser }) {
    return this.earnedstar.getSeoHealthForOwner(req.merchantUser.id);
  }

  @Post('suggest-meta')
  @UseGuards(MerchantAuthGuard)
  async suggestMeta(@Req() req: { merchantUser: SupabaseAuthUser }) {
    const merchant = await this.earnedstar.getMerchantForOwner(req.merchantUser.id);
    return this.aiSeo.suggestMeta(merchant.id, merchant.plan);
  }

  @Post('regenerate-summary')
  @UseGuards(MerchantAuthGuard)
  async regenerateSummary(@Req() req: { merchantUser: SupabaseAuthUser }) {
    const merchant = await this.earnedstar.getMerchantForOwner(req.merchantUser.id);
    return this.aiSeo.regenerateReviewSummary(merchant.id, merchant.plan);
  }

  @Post('suggest-qa-answer')
  @UseGuards(MerchantAuthGuard)
  async suggestQaAnswer(
    @Req() req: { merchantUser: SupabaseAuthUser },
    @Body() dto: SuggestQaAnswerDto,
  ) {
    const merchant = await this.earnedstar.getMerchantForOwner(req.merchantUser.id);
    return this.aiSeo.suggestQaAnswer(merchant.id, merchant.plan, dto.question);
  }
}
