import { PostgresService } from '../database/postgres.service';
import { InvitationEmailService } from '../email/invitation-email.service';
import { TelnyxSmsService } from '../sms/telnyx-sms.service';
import { ReviewPhotoService } from '../storage/review-photo.service';
import { FraudScoringService } from './fraud-scoring.service';
import { MerchantStatsService } from './merchant-stats.service';
import { PlanLimitsService } from './plan-limits.service';
import { IndexNowService } from './indexnow.service';
import type { CompleteOnboardingDto, CreateAgencyClientDto, CreateQaItemDto, ModerateReviewDto, InviteTeamMemberDto, RespondReviewDto, OrderFulfilledWebhookDto, ProvisionMerchantDto, SendInvitationDto, BulkSendInvitationsDto, SubmitReviewDto, UploadReviewPhotoDto, UpdateQaItemDto, UpdateMerchantProfileDto } from './dto/earnedstar.dto';
export type EarnedStarMerchant = {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    website_url: string | null;
    seo_title: string | null;
    seo_description: string | null;
    plan: string;
    api_key?: string;
    review_count: number;
    avg_rating: number;
    public_profile_enabled?: boolean;
    review_summary_ai?: string | null;
    review_summary_generated_at?: string | null;
};
export type EarnedStarReview = {
    id: string;
    business_id: string;
    customer_name: string;
    order_id: string | null;
    rating_overall: number;
    review_text: string | null;
    review_title?: string | null;
    product_name?: string | null;
    verified_purchase: boolean;
    fraud_score: number;
    status: string;
    business_response: string | null;
    helpful_count: number;
    created_at: string;
    photos?: string[];
    video_url?: string | null;
    ymm_year?: number | null;
    ymm_make?: string | null;
    ymm_model?: string | null;
    ymm_trim?: string | null;
    rating_fitment?: number | null;
    rating_quality?: number | null;
    rating_shipping?: number | null;
    rating_description?: number | null;
    rating_install?: number | null;
};
export declare class EarnedstarService {
    private readonly postgres;
    private readonly email;
    private readonly sms;
    private readonly photos;
    private readonly fraud;
    private readonly merchantStats;
    private readonly planLimits;
    private readonly indexNow;
    private readonly logger;
    constructor(postgres: PostgresService, email: InvitationEmailService, sms: TelnyxSmsService, photos: ReviewPhotoService, fraud: FraudScoringService, merchantStats: MerchantStatsService, planLimits: PlanLimitsService, indexNow: IndexNowService);
    private pingProfileSearch;
    private merchantSelectCols;
    private useMock;
    getMerchantBySlug(slug: string): Promise<EarnedStarMerchant>;
    listPublishedReviews(slug: string, limit?: number, offset?: number, filters?: {
        sort?: string;
        min_rating?: number;
        ymm_year?: number;
        ymm_make?: string;
        ymm_model?: string;
        has_photos?: boolean;
    }): Promise<EarnedStarReview[]>;
    listMerchantReviews(slug: string, limit?: number): Promise<EarnedStarReview[]>;
    private queryReviews;
    getPublicProfileSummary(slug: string): Promise<{
        merchant: EarnedStarMerchant;
        ratingDistribution: {
            stars: number;
            count: number;
            pct: number;
        }[];
        attributeAverages: {
            fitment: number;
            quality: number;
            shipping: number;
            description: number;
            install: number;
        };
    }>;
    getRatingDistribution(businessId: string): Promise<{
        stars: number;
        count: number;
        pct: number;
    }[]>;
    getDashboardOverview(slug?: string): Promise<{
        merchant: EarnedStarMerchant;
        stats: {
            totalReviews: number;
            weeklyDeltaPct: number;
            avgRating: number;
            inviteResponseRate: number;
            googleSellerRating: number;
            googleSellerActive: boolean;
        };
        ratingDistribution: {
            stars: number;
            count: number;
            pct: number;
        }[];
        recentReviews: EarnedStarReview[];
    }>;
    submitReview(dto: SubmitReviewDto): Promise<{
        ok: boolean;
        reviewId: string;
        status: string;
        message: string;
        fraud_score?: undefined;
    } | {
        ok: boolean;
        reviewId: string | undefined;
        status: "published" | "pending" | "flagged";
        fraud_score: number;
        message?: undefined;
    }>;
    sendInvitationForOwner(ownerId: string, slug: string | undefined, dto: SendInvitationDto): Promise<{
        ok: boolean;
        invitationId: string;
        token: string;
        status: string;
        submitUrl: string;
        channel: "link" | "email" | "sms";
        scheduled?: undefined;
        send_at_days?: undefined;
    } | {
        ok: boolean;
        invitationId: string | undefined;
        token: string | undefined;
        status: string;
        submitUrl: string;
        channel: "link" | "email" | "sms";
        scheduled: boolean;
        send_at_days: number;
    }>;
    sendInvitation(slug: string, dto: SendInvitationDto): Promise<{
        ok: boolean;
        invitationId: string;
        token: string;
        status: string;
        submitUrl: string;
        channel: "link" | "email" | "sms";
        scheduled?: undefined;
        send_at_days?: undefined;
    } | {
        ok: boolean;
        invitationId: string | undefined;
        token: string | undefined;
        status: string;
        submitUrl: string;
        channel: "link" | "email" | "sms";
        scheduled: boolean;
        send_at_days: number;
    }>;
    bulkSendInvitationsForOwner(ownerId: string, slug: string | undefined, dto: BulkSendInvitationsDto): Promise<{
        ok: boolean;
        sent: number;
        failed: number;
        results: {
            order_id: string;
            ok: boolean;
            error?: string;
            submitUrl?: string;
        }[];
    }>;
    resendInvitationForOwner(ownerId: string, slug: string | undefined, invitationId: string): Promise<{
        ok: boolean;
        invitationId: string;
        token: string;
        status: string;
        submitUrl: string;
        channel: "link" | "email" | "sms";
        scheduled?: undefined;
        send_at_days?: undefined;
    } | {
        ok: boolean;
        invitationId: string | undefined;
        token: string | undefined;
        status: string;
        submitUrl: string;
        channel: "link" | "email" | "sms";
        scheduled: boolean;
        send_at_days: number;
    }>;
    private dispatchInvitationDelivery;
    private flushScheduledInvitations;
    getInvitationByToken(token: string): Promise<{
        token: string;
        status: string;
        merchant_name: string;
        merchant_slug: string;
        order_id: string;
        customer_name: string | null;
        product_name: string | null;
        purchased_at: string | null;
    } | {
        token: string;
        status: string;
        merchant_name: string;
        merchant_slug: string;
        order_id: string;
    }>;
    listInvitations(slug: string, limit?: number): Promise<import("pg").QueryResultRow[]>;
    getAggregateSchema(slug: string): {
        '@context': string;
        '@type': string;
        name: string;
        url: string;
        image: string | undefined;
        aggregateRating: {
            '@type': string;
            ratingValue: number;
            reviewCount: number;
            bestRating: number;
            worstRating: number;
        };
    } | Promise<{
        '@context': string;
        '@type': string;
        name: string;
        url: string;
        image: string | undefined;
        aggregateRating: {
            '@type': string;
            ratingValue: number;
            reviewCount: number;
            bestRating: number;
            worstRating: number;
        };
    }>;
    private buildSchema;
    slugify(name: string): string;
    private getMerchantEmailPrefs;
    provisionMerchant(dto: ProvisionMerchantDto): Promise<{
        ok: boolean;
        merchantId: string;
        slug: string;
        existing: boolean;
    } | {
        ok: boolean;
        merchantId: string | undefined;
        slug: string | undefined;
        existing?: undefined;
    }>;
    getMerchantForOwner(ownerId: string): Promise<EarnedStarMerchant>;
    updateMerchantBilling(businessId: string, patch: {
        plan: string;
        authnet_subscription_id?: string;
        authnet_customer_profile_id?: string;
    }): Promise<{
        ok: boolean;
    }>;
    handleOrderFulfilled(dto: OrderFulfilledWebhookDto): Promise<{
        success: boolean;
        request_id: string | undefined;
        status: string;
        submitUrl: string;
    }>;
    getMerchantByApiKey(apiKey: string): Promise<EarnedStarMerchant>;
    getPublicEmbedByApiKey(apiKey: string): Promise<{
        merchant: {
            name: string;
            slug: string;
            avg_rating: number;
            review_count: number;
            logo_url: string | null;
        };
        reviews: {
            id: string;
            customer_name: string;
            rating_overall: number;
            review_text: string | null;
            created_at: string;
            photos: string[];
        }[];
    }>;
    uploadReviewPhoto(dto: UploadReviewPhotoDto): Promise<{
        ok: boolean;
        url: string;
    }>;
    moderateReviewForOwner(ownerId: string, reviewId: string, dto: ModerateReviewDto): Promise<{
        ok: boolean;
        reviewId: string;
        status: "published" | "rejected";
    }>;
    respondToReviewForOwner(ownerId: string, reviewId: string, dto: RespondReviewDto): Promise<{
        ok: boolean;
        reviewId: string;
        business_response: string;
    }>;
    getPublicWidgetBySlug(slug: string, max?: number): Promise<{
        merchant: {
            name: string;
            slug: string;
            avg_rating: number;
            review_count: number;
            logo_url: string | null;
            website_url: string | null;
        };
        reviews: {
            id: string;
            customer_name: string;
            rating_overall: number;
            review_text: string | null;
            created_at: string;
            photos: string[];
            product_name: string | null | undefined;
        }[];
        embed: {
            script: string;
            api_key: string | undefined;
        };
    }>;
    getAnalyticsDashboard(slug?: string): Promise<{
        invitationTrend: {
            week: string;
            sent: number;
            completed: number;
        }[];
        reviewVelocity: {
            week: string;
            published: number;
            pending: number;
        }[];
        sentiment: {
            positive: number;
            neutral: number;
            negative: number;
        };
    }>;
    private buildWidgetEmbedCode;
    listWidgetsForOwner(ownerId: string): Promise<{
        embed_code: string;
        id: string;
        name: string;
        widget_type: string;
        config: Record<string, unknown>;
        created_at: string;
    }[] | ({
        id: string;
        name: string;
        widget_type: string;
        embed_code: string;
        config: {
            color: string;
            size: number;
            max?: undefined;
        };
    } | {
        id: string;
        name: string;
        widget_type: string;
        embed_code: string;
        config: {
            max: number;
            color?: undefined;
            size?: undefined;
        };
    })[]>;
    listWidgets(merchantId: string, apiKey?: string): Promise<{
        embed_code: string;
        id: string;
        name: string;
        widget_type: string;
        config: Record<string, unknown>;
        created_at: string;
    }[] | ({
        id: string;
        name: string;
        widget_type: string;
        embed_code: string;
        config: {
            color: string;
            size: number;
            max?: undefined;
        };
    } | {
        id: string;
        name: string;
        widget_type: string;
        embed_code: string;
        config: {
            max: number;
            color?: undefined;
            size?: undefined;
        };
    })[]>;
    createWidgetForOwner(ownerId: string, dto: {
        name: string;
        widget_type: string;
        config?: Record<string, unknown>;
    }): Promise<{
        ok: boolean;
        widget: {
            id: string | undefined;
            name: string;
            widget_type: string;
            config: Record<string, unknown>;
            embed_code: string;
        };
    }>;
    deleteWidgetForOwner(ownerId: string, widgetId: string): Promise<{
        ok: boolean;
    }>;
    getShopifyIntegration(ownerId: string): Promise<{
        connected: boolean;
        shop: null;
        webhookUrl: string;
        installSteps: string[];
        merchantSlug?: undefined;
        webhookSecretEnv?: undefined;
    } | {
        connected: boolean;
        shop: string | null;
        merchantSlug: string;
        webhookUrl: string;
        webhookSecretEnv: string;
        installSteps?: undefined;
    }>;
    connectShopifyForOwner(ownerId: string, shop: string): Promise<{
        ok: boolean;
        shop: string;
        status: string;
    }>;
    getGoogleSellerFeed(slug: string): Promise<{
        merchant: EarnedStarMerchant;
        reviews: EarnedStarReview[];
    }>;
    getTrustpilotExport(slug: string): Promise<{
        businessUnit: {
            id: string;
            displayName: string;
            score: number;
            numberOfReviews: number;
            websiteUrl: string;
        };
        reviews: {
            id: string;
            consumer: {
                displayName: string;
            };
            stars: number;
            title: string;
            text: string | null;
            createdAt: string;
            verified: boolean;
        }[];
        exportedAt: string;
        source: string;
    }>;
    exportReviewsCsvForOwner(ownerId: string, slug?: string): Promise<{
        filename: string;
        csv: string;
    }>;
    getOnboardingStatus(ownerId: string): Promise<{
        completed: boolean;
        step: number;
    }>;
    completeOnboarding(ownerId: string, dto: CompleteOnboardingDto): Promise<{
        ok: boolean;
        completed: boolean;
        slug?: undefined;
    } | {
        ok: boolean;
        completed: boolean;
        slug: string;
    }>;
    updateMerchantProfile(ownerId: string, dto: UpdateMerchantProfileDto): Promise<{
        ok: boolean;
        merchant: EarnedStarMerchant;
    }>;
    listAgencyClients(ownerId: string): Promise<import("pg").QueryResultRow[]>;
    createAgencyClient(ownerId: string, dto: CreateAgencyClientDto): Promise<{
        ok: boolean;
        slug: string;
        name: string;
        clientId?: undefined;
    } | {
        ok: boolean;
        clientId: string | undefined;
        slug: string | undefined;
        name: string;
    }>;
    listPublishedQa(slug: string): Promise<import("pg").QueryResultRow[]>;
    publicAskQa(slug: string, question: string, askedBy?: string): Promise<{
        ok: boolean;
        id: string | undefined;
    }>;
    listQaForOwner(ownerId: string): Promise<import("pg").QueryResultRow[]>;
    createQaForOwner(ownerId: string, dto: CreateQaItemDto): Promise<{
        ok: boolean;
        id: string;
        question: string;
        answer: string | null;
        published: boolean;
    } | {
        ok: boolean;
        id: string | undefined;
        published: boolean;
        question?: undefined;
        answer?: undefined;
    }>;
    updateQaForOwner(ownerId: string, id: string, dto: UpdateQaItemDto): Promise<{
        ok: boolean;
        id: string;
    }>;
    deleteQaForOwner(ownerId: string, id: string): Promise<{
        ok: boolean;
    }>;
    listTeamMembersForOwner(ownerId: string): Promise<{
        seats: {
            used: number;
            limit: 1 | 3 | 10 | -1;
        };
        members: {
            id: string;
            email: string;
            role: string;
            status: string;
        }[];
    } | {
        seats: {
            used: number;
            limit: 1 | 3 | 10 | -1;
        };
        members: {
            status: string;
        }[];
    }>;
    inviteTeamMemberForOwner(ownerId: string, dto: InviteTeamMemberDto): Promise<{
        ok: boolean;
        email: string;
        role: "admin" | "viewer";
        status: string;
        id?: undefined;
    } | {
        ok: boolean;
        id: string | undefined;
        email: string;
        role: "admin" | "viewer";
        status: string;
    }>;
    removeTeamMemberForOwner(ownerId: string, memberId: string): Promise<{
        ok: boolean;
    }>;
    getMerchantByWhiteLabelDomain(host: string): Promise<EarnedStarMerchant | null>;
    listSitemapMerchants(): Promise<{
        slug: string;
        lastModified: string;
    }[]>;
    getSeoHealthForOwner(ownerId: string): Promise<{
        profile_url: string;
        checks: {
            profile_indexable: boolean;
            meta_filled: boolean;
            faq_schema: boolean;
            syndication_available: boolean;
            review_summary_fresh: boolean;
        };
        counts: {
            published_reviews: number;
            published_qa: number;
        };
        review_summary_ai: null;
        review_summary_generated_at: null;
        indexnow_enabled: boolean;
        plan_features?: undefined;
    } | {
        profile_url: string;
        checks: {
            profile_indexable: boolean;
            meta_filled: boolean;
            faq_schema: boolean;
            syndication_available: boolean;
            review_summary_fresh: boolean;
        };
        counts: {
            published_reviews: number;
            published_qa: number;
        };
        review_summary_ai: string | null;
        review_summary_generated_at: string | null;
        indexnow_enabled: boolean;
        plan_features: {
            ai_meta_suggestions: boolean;
            ai_review_summary: boolean;
            ai_qa_suggestions: boolean;
        };
    }>;
}
