/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { EarnedstarService } from './earnedstar.service';
import { InviteTeamMemberDto } from './dto/earnedstar.dto';
import { MerchantAuthGuard } from '../auth/merchant-auth.guard';
import type { SupabaseAuthUser } from '../auth/supabase-auth.service';

@Controller('earnedstar/team')
export class EarnedstarTeamController {
  constructor(private readonly earnedstar: EarnedstarService) {}

  @Get()
  @UseGuards(MerchantAuthGuard)
  list(@Req() req: { merchantUser: SupabaseAuthUser }) {
    return this.earnedstar.listTeamMembersForOwner(req.merchantUser.id);
  }

  @Post('invite')
  @UseGuards(MerchantAuthGuard)
  invite(@Req() req: { merchantUser: SupabaseAuthUser }, @Body() dto: InviteTeamMemberDto) {
    return this.earnedstar.inviteTeamMemberForOwner(req.merchantUser.id, dto);
  }

  @Delete(':id')
  @UseGuards(MerchantAuthGuard)
  remove(@Req() req: { merchantUser: SupabaseAuthUser }, @Param('id') id: string) {
    return this.earnedstar.removeTeamMemberForOwner(req.merchantUser.id, id);
  }
}
