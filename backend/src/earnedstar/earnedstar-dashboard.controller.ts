/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Body, Controller, Delete, Get, Header, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { EarnedstarService } from './earnedstar.service';
import { MerchantAuthGuard } from '../auth/merchant-auth.guard';
import type { SupabaseAuthUser } from '../auth/supabase-auth.service';

@Controller('earnedstar')
export class EarnedstarDashboardController {
  constructor(private readonly earnedstar: EarnedstarService) {}

  @Get('dashboard/overview')
  overview(@Query('slug') slug?: string) {
    return this.earnedstar.getDashboardOverview(slug ?? 'meridian-gear');
  }

  @Get('dashboard/reviews')
  reviews(@Query('slug') slug?: string, @Query('limit') limit?: string) {
    const n = limit ? Math.min(parseInt(limit, 10) || 100, 200) : 100;
    return this.earnedstar.listMerchantReviews(slug ?? 'meridian-gear', n);
  }

  @Get('dashboard/invitations')
  invitations(@Query('slug') slug?: string, @Query('limit') limit?: string) {
    const n = limit ? Math.min(parseInt(limit, 10) || 50, 100) : 50;
    return this.earnedstar.listInvitations(slug ?? 'meridian-gear', n);
  }

  @Get('dashboard/analytics')
  analytics(@Query('slug') slug?: string) {
    return this.earnedstar.getAnalyticsDashboard(slug ?? 'meridian-gear');
  }

  @Get('dashboard/export/reviews.csv')
  @UseGuards(MerchantAuthGuard)
  @Header('Content-Type', 'text/csv; charset=utf-8')
  async exportReviews(
    @Req() req: { merchantUser: SupabaseAuthUser },
    @Query('slug') slug: string | undefined,
    @Res() res: Response,
  ) {
    const payload = await this.earnedstar.exportReviewsCsvForOwner(req.merchantUser.id, slug);
    res.setHeader('Content-Disposition', `attachment; filename="${payload.filename}"`);
    res.send(payload.csv);
  }

  @Get('schema/:merchantSlug')
  publicSchema(@Param('merchantSlug') merchantSlug: string) {
    return this.earnedstar.getAggregateSchema(merchantSlug);
  }
}
