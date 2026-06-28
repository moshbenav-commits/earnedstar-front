/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Controller, Get, Param, Query } from '@nestjs/common';
import { EarnedstarService } from './earnedstar.service';

@Controller('earnedstar/widget')
export class EarnedstarWidgetPublicController {
  constructor(private readonly earnedstar: EarnedstarService) {}

  @Get(':slug')
  getBySlug(@Param('slug') slug: string, @Query('max') max?: string) {
    const n = max ? Math.min(parseInt(max, 10) || 12, 24) : 12;
    return this.earnedstar.getPublicWidgetBySlug(slug, n);
  }
}
