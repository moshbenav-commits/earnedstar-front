"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EarnedstarModule = void 0;
const common_1 = require("@nestjs/common");
const earnedstar_service_1 = require("./earnedstar.service");
const earnedstar_merchants_controller_1 = require("./earnedstar-merchants.controller");
const earnedstar_reviews_controller_1 = require("./earnedstar-reviews.controller");
const earnedstar_invitations_controller_1 = require("./earnedstar-invitations.controller");
const earnedstar_widgets_controller_1 = require("./earnedstar-widgets.controller");
const earnedstar_widget_public_controller_1 = require("./earnedstar-widget-public.controller");
const earnedstar_billing_controller_1 = require("./earnedstar-billing.controller");
const earnedstar_dashboard_controller_1 = require("./earnedstar-dashboard.controller");
const earnedstar_auth_controller_1 = require("./earnedstar-auth.controller");
const earnedstar_webhooks_controller_1 = require("./earnedstar-webhooks.controller");
const earnedstar_integrations_controller_1 = require("./earnedstar-integrations.controller");
const earnedstar_feeds_controller_1 = require("./earnedstar-feeds.controller");
const earnedstar_agency_controller_1 = require("./earnedstar-agency.controller");
const earnedstar_qa_controller_1 = require("./earnedstar-qa.controller");
const earnedstar_email_controller_1 = require("./earnedstar-email.controller");
const earnedstar_team_controller_1 = require("./earnedstar-team.controller");
const earnedstar_seo_controller_1 = require("./earnedstar-seo.controller");
const earnedstar_marketing_controller_1 = require("./earnedstar-marketing.controller");
const google_reviews_feed_service_1 = require("./google-reviews-feed.service");
const indexnow_service_1 = require("./indexnow.service");
const earnedstar_ai_seo_service_1 = require("./earnedstar-ai-seo.service");
const earnedstar_marketing_service_1 = require("./earnedstar-marketing.service");
const supabase_auth_service_1 = require("../auth/supabase-auth.service");
const merchant_auth_guard_1 = require("../auth/merchant-auth.guard");
const invitation_email_service_1 = require("../email/invitation-email.service");
const smtp_email_service_1 = require("../email/smtp-email.service");
const authorize_net_service_1 = require("../payments/authorize-net.service");
const fraud_scoring_service_1 = require("./fraud-scoring.service");
const merchant_stats_service_1 = require("./merchant-stats.service");
const plan_limits_service_1 = require("./plan-limits.service");
const telnyx_sms_service_1 = require("../sms/telnyx-sms.service");
const review_photo_service_1 = require("../storage/review-photo.service");
let EarnedstarModule = class EarnedstarModule {
};
exports.EarnedstarModule = EarnedstarModule;
exports.EarnedstarModule = EarnedstarModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            earnedstar_merchants_controller_1.EarnedstarMerchantsController,
            earnedstar_reviews_controller_1.EarnedstarReviewsController,
            earnedstar_invitations_controller_1.EarnedstarInvitationsController,
            earnedstar_widgets_controller_1.EarnedstarWidgetsController,
            earnedstar_widget_public_controller_1.EarnedstarWidgetPublicController,
            earnedstar_billing_controller_1.EarnedstarBillingController,
            earnedstar_dashboard_controller_1.EarnedstarDashboardController,
            earnedstar_auth_controller_1.EarnedstarAuthController,
            earnedstar_webhooks_controller_1.EarnedstarWebhooksController,
            earnedstar_integrations_controller_1.EarnedstarIntegrationsController,
            earnedstar_feeds_controller_1.EarnedstarFeedsController,
            earnedstar_agency_controller_1.EarnedstarAgencyController,
            earnedstar_agency_controller_1.EarnedstarOnboardingController,
            earnedstar_qa_controller_1.EarnedstarQaController,
            earnedstar_email_controller_1.EarnedstarEmailController,
            earnedstar_team_controller_1.EarnedstarTeamController,
            earnedstar_seo_controller_1.EarnedstarSeoController,
            earnedstar_marketing_controller_1.EarnedstarMarketingController,
        ],
        providers: [
            earnedstar_service_1.EarnedstarService,
            supabase_auth_service_1.SupabaseAuthService,
            merchant_auth_guard_1.MerchantAuthGuard,
            invitation_email_service_1.InvitationEmailService,
            smtp_email_service_1.SmtpEmailService,
            authorize_net_service_1.AuthorizeNetService,
            fraud_scoring_service_1.FraudScoringService,
            merchant_stats_service_1.MerchantStatsService,
            plan_limits_service_1.PlanLimitsService,
            telnyx_sms_service_1.TelnyxSmsService,
            review_photo_service_1.ReviewPhotoService,
            google_reviews_feed_service_1.GoogleReviewsFeedService,
            indexnow_service_1.IndexNowService,
            earnedstar_ai_seo_service_1.EarnedstarAiSeoService,
            earnedstar_marketing_service_1.EarnedstarMarketingService,
        ],
        exports: [earnedstar_service_1.EarnedstarService],
    })
], EarnedstarModule);
//# sourceMappingURL=earnedstar.module.js.map