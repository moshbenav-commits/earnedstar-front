/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { EarnedstarService } from './earnedstar.service';
import { ModerateReviewDto, RespondReviewDto, SubmitReviewDto, UploadReviewPhotoDto } from './dto/earnedstar.dto';
import { MerchantAuthGuard } from '../auth/merchant-auth.guard';
import type { SupabaseAuthUser } from '../auth/supabase-auth.service';

@Controller('earnedstar/reviews')
export class EarnedstarReviewsController {
  constructor(private readonly earnedstar: EarnedstarService) {}

  @Get('embed/:apiKey')
  embed(@Param('apiKey') apiKey: string) {
    return this.earnedstar.getPublicEmbedByApiKey(apiKey);
  }

  @Get(':merchantSlug')
  list(
    @Param('merchantSlug') merchantSlug: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('page') page?: string,
    @Query('sort') sort?: string,
    @Query('min_rating') minRating?: string,
    @Query('ymm_year') ymmYear?: string,
    @Query('ymm_make') ymmMake?: string,
    @Query('ymm_model') ymmModel?: string,
    @Query('has_photos') hasPhotos?: string,
  ) {
    const n = limit ? Math.min(parseInt(limit, 10) || 50, 100) : 50;
    const pageNum = page ? Math.max(parseInt(page, 10) || 1, 1) : 1;
    const off = offset
      ? Math.max(parseInt(offset, 10) || 0, 0)
      : (pageNum - 1) * n;
    return this.earnedstar.listPublishedReviews(merchantSlug, n, off, {
      sort,
      min_rating: minRating ? parseInt(minRating, 10) : undefined,
      ymm_year: ymmYear ? parseInt(ymmYear, 10) : undefined,
      ymm_make: ymmMake,
      ymm_model: ymmModel,
      has_photos: hasPhotos === '1' || hasPhotos === 'true',
    });
  }

  @Post('submit')
  submit(@Body() dto: SubmitReviewDto) {
    return this.earnedstar.submitReview(dto);
  }

  @Post('upload')
  upload(@Body() dto: UploadReviewPhotoDto) {
    return this.earnedstar.uploadReviewPhoto(dto);
  }

  @Post(':reviewId/moderate')
  @UseGuards(MerchantAuthGuard)
  moderate(
    @Req() req: { merchantUser: SupabaseAuthUser },
    @Param('reviewId') reviewId: string,
    @Body() dto: ModerateReviewDto,
  ) {
    return this.earnedstar.moderateReviewForOwner(req.merchantUser.id, reviewId, dto);
  }

  @Patch(':reviewId/respond')
  @UseGuards(MerchantAuthGuard)
  respond(
    @Req() req: { merchantUser: SupabaseAuthUser },
    @Param('reviewId') reviewId: string,
    @Body() dto: RespondReviewDto,
  ) {
    return this.earnedstar.respondToReviewForOwner(req.merchantUser.id, reviewId, dto);
  }
}
