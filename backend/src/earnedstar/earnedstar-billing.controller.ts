/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthorizeNetService } from '../payments/authorize-net.service';
import { EarnedstarService } from './earnedstar.service';
import { SubscribeBillingDto } from './dto/earnedstar.dto';
import { MerchantAuthGuard } from '../auth/merchant-auth.guard';
import type { SupabaseAuthUser } from '../auth/supabase-auth.service';

@Controller('earnedstar/billing')
export class EarnedstarBillingController {
  constructor(
    private readonly authorizeNet: AuthorizeNetService,
    private readonly earnedstar: EarnedstarService,
  ) {}

  @Get('status')
  status() {
    const publicConfig = this.authorizeNet.getPublicConfig();
    return {
      provider: 'authorize.net',
      mode: process.env.AUTHNET_ENV ?? 'sandbox',
      ready: this.authorizeNet.isConfigured() || process.env.EARNEDSTAR_BILLING_DEV_BYPASS === '1',
      acceptJs: Boolean(publicConfig),
      publicConfig: publicConfig ?? undefined,
    };
  }

  @Get('public-config')
  publicConfig() {
    return this.authorizeNet.getPublicConfig() ?? { configured: false };
  }

  @Post('subscribe')
  @UseGuards(MerchantAuthGuard)
  async subscribe(
    @Req() req: { merchantUser: SupabaseAuthUser },
    @Body() dto: SubscribeBillingDto,
  ) {
    const merchant = await this.earnedstar.getMerchantForOwner(req.merchantUser.id);
    const result = await this.authorizeNet.createArbSubscription({
      plan: dto.plan,
      opaqueData: { dataDescriptor: dto.dataDescriptor, dataValue: dto.dataValue },
      customerEmail: dto.customer_email,
      customerName: dto.customer_name,
      businessId: merchant.id,
    });
    await this.earnedstar.updateMerchantBilling(merchant.id, {
      plan: dto.plan,
      authnet_subscription_id: result.subscriptionId,
      authnet_customer_profile_id: result.customerProfileId ?? undefined,
    });
    return { ok: true, ...result, plan: dto.plan };
  }

  @Post('webhook')
  authorizeNetWebhook(@Body() body: Record<string, unknown>) {
    return { ok: true, received: true, event: body?.eventType ?? 'unknown' };
  }
}
