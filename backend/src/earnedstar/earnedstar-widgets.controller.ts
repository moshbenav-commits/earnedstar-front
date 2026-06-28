/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { EarnedstarService } from './earnedstar.service';
import { CreateWidgetDto } from './dto/earnedstar.dto';
import { MerchantAuthGuard } from '../auth/merchant-auth.guard';
import type { SupabaseAuthUser } from '../auth/supabase-auth.service';

@Controller('earnedstar/widgets')
export class EarnedstarWidgetsController {
  constructor(private readonly earnedstar: EarnedstarService) {}

  @Get()
  @UseGuards(MerchantAuthGuard)
  list(@Req() req: { merchantUser: SupabaseAuthUser }) {
    return this.earnedstar.listWidgetsForOwner(req.merchantUser.id);
  }

  @Post()
  @UseGuards(MerchantAuthGuard)
  create(@Req() req: { merchantUser: SupabaseAuthUser }, @Body() dto: CreateWidgetDto) {
    return this.earnedstar.createWidgetForOwner(req.merchantUser.id, dto);
  }

  @Delete(':widgetId')
  @UseGuards(MerchantAuthGuard)
  remove(
    @Req() req: { merchantUser: SupabaseAuthUser },
    @Param('widgetId') widgetId: string,
  ) {
    return this.earnedstar.deleteWidgetForOwner(req.merchantUser.id, widgetId);
  }
}
