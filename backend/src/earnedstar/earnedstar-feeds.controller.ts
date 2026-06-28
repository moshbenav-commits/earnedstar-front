/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Controller, Get, Header, Param, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { EarnedstarService } from './earnedstar.service';
import { GoogleReviewsFeedService } from './google-reviews-feed.service';

@Controller('earnedstar/feeds')
export class EarnedstarFeedsController {
  constructor(
    private readonly earnedstar: EarnedstarService,
    private readonly googleFeed: GoogleReviewsFeedService,
  ) {}

  @Get('google-reviews/:slug.xml')
  @Header('Content-Type', 'application/xml; charset=utf-8')
  async googleReviewsXml(@Param('slug') slug: string, @Res() res: Response) {
    const payload = await this.earnedstar.getGoogleSellerFeed(slug);
    const xml = this.googleFeed.buildProductReviewsXml(payload.merchant, payload.reviews);
    res.send(xml);
  }

  @Get('trustpilot/:slug.json')
  async trustpilotJson(@Param('slug') slug: string) {
    return this.earnedstar.getTrustpilotExport(slug);
  }
}
