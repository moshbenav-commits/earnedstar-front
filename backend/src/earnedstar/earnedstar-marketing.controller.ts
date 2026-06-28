/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { EarnedstarMarketingService } from './earnedstar-marketing.service';
import { ReviewAuditDto } from './dto/earnedstar.dto';

@Controller('earnedstar/marketing')
export class EarnedstarMarketingController {
  constructor(private readonly marketing: EarnedstarMarketingService) {}

  /** Public homepage live counter */
  @Get('trust-counter')
  getTrustCounter() {
    return this.marketing.getTrustCounter();
  }

  /** Public free review audit tool */
  @Post('review-audit')
  runReviewAudit(@Body() dto: ReviewAuditDto) {
    return this.marketing.runReviewAudit(dto.url);
  }
}
