/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Controller, Get, Param } from '@nestjs/common';
import { EarnedstarService } from './earnedstar.service';

@Controller('earnedstar/merchants')
export class EarnedstarMerchantsController {
  constructor(private readonly earnedstar: EarnedstarService) {}

  @Get(':slug/profile')
  profile(@Param('slug') slug: string) {
    return this.earnedstar.getPublicProfileSummary(slug);
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.earnedstar.getMerchantBySlug(slug);
  }

  @Get(':slug/schema')
  schema(@Param('slug') slug: string) {
    return this.earnedstar.getAggregateSchema(slug);
  }
}
