/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Module } from '@nestjs/common';
import { EarnedstarService } from './earnedstar.service';
import { EarnedstarMerchantsController } from './earnedstar-merchants.controller';
import { EarnedstarReviewsController } from './earnedstar-reviews.controller';
import { EarnedstarInvitationsController } from './earnedstar-invitations.controller';
import { EarnedstarWidgetsController } from './earnedstar-widgets.controller';
import { EarnedstarWidgetPublicController } from './earnedstar-widget-public.controller';
import { EarnedstarBillingController } from './earnedstar-billing.controller';
import { EarnedstarDashboardController } from './earnedstar-dashboard.controller';
import { EarnedstarAuthController } from './earnedstar-auth.controller';
import { EarnedstarWebhooksController } from './earnedstar-webhooks.controller';
import { EarnedstarIntegrationsController } from './earnedstar-integrations.controller';
import { EarnedstarFeedsController } from './earnedstar-feeds.controller';
import {
  EarnedstarAgencyController,
  EarnedstarOnboardingController,
} from './earnedstar-agency.controller';
import { EarnedstarQaController } from './earnedstar-qa.controller';
import { EarnedstarEmailController } from './earnedstar-email.controller';
import { EarnedstarTeamController } from './earnedstar-team.controller';
import { EarnedstarSeoController } from './earnedstar-seo.controller';
import { EarnedstarMarketingController } from './earnedstar-marketing.controller';
import { GoogleReviewsFeedService } from './google-reviews-feed.service';
import { IndexNowService } from './indexnow.service';
import { EarnedstarAiSeoService } from './earnedstar-ai-seo.service';
import { EarnedstarMarketingService } from './earnedstar-marketing.service';
import { SupabaseAuthService } from '../auth/supabase-auth.service';
import { MerchantAuthGuard } from '../auth/merchant-auth.guard';
import { InvitationEmailService } from '../email/invitation-email.service';
import { SmtpEmailService } from '../email/smtp-email.service';
import { AuthorizeNetService } from '../payments/authorize-net.service';
import { FraudScoringService } from './fraud-scoring.service';
import { MerchantStatsService } from './merchant-stats.service';
import { PlanLimitsService } from './plan-limits.service';
import { TelnyxSmsService } from '../sms/telnyx-sms.service';
import { ReviewPhotoService } from '../storage/review-photo.service';

@Module({
  controllers: [
    EarnedstarMerchantsController,
    EarnedstarReviewsController,
    EarnedstarInvitationsController,
    EarnedstarWidgetsController,
    EarnedstarWidgetPublicController,
    EarnedstarBillingController,
    EarnedstarDashboardController,
    EarnedstarAuthController,
    EarnedstarWebhooksController,
    EarnedstarIntegrationsController,
    EarnedstarFeedsController,
    EarnedstarAgencyController,
    EarnedstarOnboardingController,
    EarnedstarQaController,
    EarnedstarEmailController,
    EarnedstarTeamController,
    EarnedstarSeoController,
    EarnedstarMarketingController,
  ],
  providers: [
    EarnedstarService,
    SupabaseAuthService,
    MerchantAuthGuard,
    InvitationEmailService,
    SmtpEmailService,
    AuthorizeNetService,
    FraudScoringService,
    MerchantStatsService,
    PlanLimitsService,
    TelnyxSmsService,
    ReviewPhotoService,
    GoogleReviewsFeedService,
    IndexNowService,
    EarnedstarAiSeoService,
    EarnedstarMarketingService,
  ],
  exports: [EarnedstarService],
})
export class EarnedstarModule {}
