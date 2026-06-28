/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { EarnedstarService } from './earnedstar.service';
import { CreateQaItemDto, PublicAskQaDto, UpdateQaItemDto } from './dto/earnedstar.dto';
import { MerchantAuthGuard } from '../auth/merchant-auth.guard';
import type { SupabaseAuthUser } from '../auth/supabase-auth.service';

@Controller('earnedstar/qa')
export class EarnedstarQaController {
  constructor(private readonly earnedstar: EarnedstarService) {}

  @Get('public/:slug')
  listPublic(@Param('slug') slug: string) {
    return this.earnedstar.listPublishedQa(slug);
  }

  @Post('public/:slug/ask')
  askPublic(@Param('slug') slug: string, @Body() dto: PublicAskQaDto) {
    return this.earnedstar.publicAskQa(slug, dto.question, dto.asked_by);
  }

  @Get()
  @UseGuards(MerchantAuthGuard)
  list(@Req() req: { merchantUser: SupabaseAuthUser }) {
    return this.earnedstar.listQaForOwner(req.merchantUser.id);
  }

  @Post()
  @UseGuards(MerchantAuthGuard)
  create(@Req() req: { merchantUser: SupabaseAuthUser }, @Body() dto: CreateQaItemDto) {
    return this.earnedstar.createQaForOwner(req.merchantUser.id, dto);
  }

  @Patch(':id')
  @UseGuards(MerchantAuthGuard)
  update(
    @Req() req: { merchantUser: SupabaseAuthUser },
    @Param('id') id: string,
    @Body() dto: UpdateQaItemDto,
  ) {
    return this.earnedstar.updateQaForOwner(req.merchantUser.id, id, dto);
  }

  @Delete(':id')
  @UseGuards(MerchantAuthGuard)
  remove(@Req() req: { merchantUser: SupabaseAuthUser }, @Param('id') id: string) {
    return this.earnedstar.deleteQaForOwner(req.merchantUser.id, id);
  }
}
