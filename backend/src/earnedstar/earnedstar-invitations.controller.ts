/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { EarnedstarService } from './earnedstar.service';
import { BulkSendInvitationsDto, SendInvitationDto } from './dto/earnedstar.dto';
import { MerchantAuthGuard } from '../auth/merchant-auth.guard';
import type { SupabaseAuthUser } from '../auth/supabase-auth.service';

@Controller('earnedstar/invitations')
export class EarnedstarInvitationsController {
  constructor(private readonly earnedstar: EarnedstarService) {}

  @Get('lookup/:token')
  lookup(@Param('token') token: string) {
    return this.earnedstar.getInvitationByToken(token);
  }

  @Post('send')
  @UseGuards(MerchantAuthGuard)
  send(
    @Req() req: { merchantUser: SupabaseAuthUser },
    @Query('slug') slug: string | undefined,
    @Body() dto: SendInvitationDto,
  ) {
    return this.earnedstar.sendInvitationForOwner(req.merchantUser.id, slug, dto);
  }

  @Post('bulk')
  @UseGuards(MerchantAuthGuard)
  bulk(
    @Req() req: { merchantUser: SupabaseAuthUser },
    @Query('slug') slug: string | undefined,
    @Body() dto: BulkSendInvitationsDto,
  ) {
    return this.earnedstar.bulkSendInvitationsForOwner(req.merchantUser.id, slug, dto);
  }

  @Post(':id/resend')
  @UseGuards(MerchantAuthGuard)
  resend(
    @Req() req: { merchantUser: SupabaseAuthUser },
    @Param('id') id: string,
    @Query('slug') slug: string | undefined,
  ) {
    return this.earnedstar.resendInvitationForOwner(req.merchantUser.id, slug, id);
  }
}
