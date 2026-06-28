/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PostgresService } from '../database/postgres.service';
import { InvitationEmailService } from '../email/invitation-email.service';
import { SmtpEmailService } from '../email/smtp-email.service';
import { TelnyxSmsService } from '../sms/telnyx-sms.service';
import { ReviewPhotoService } from '../storage/review-photo.service';
import { FraudScoringService } from './fraud-scoring.service';
import { MerchantStatsService } from './merchant-stats.service';
import { PlanLimitsService } from './plan-limits.service';
import { IndexNowService } from './indexnow.service';
import type {
  CompleteOnboardingDto,
  CreateAgencyClientDto,
  CreateQaItemDto,
  ModerateReviewDto,
  InviteTeamMemberDto,
  RespondReviewDto,
  OrderFulfilledWebhookDto,
  ProvisionMerchantDto,
  SendInvitationDto,
  BulkSendInvitationsDto,
  SubmitReviewDto,
  UploadReviewPhotoDto,
  UpdateQaItemDto,
  UpdateMerchantProfileDto,
} from './dto/earnedstar.dto';

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

const MOCK_MERCHANT: EarnedStarMerchant = {
  id: 'mock-meridian-gear',
  name: 'Meridian Gear Co.',
  slug: 'meridian-gear',
  logo_url: null,
  website_url: 'https://meridian-gear.example.com',
  seo_title: null,
  seo_description: null,
  plan: 'growth',
  review_count: 2847,
  avg_rating: 4.9,
};

const MOCK_REVIEWS: EarnedStarReview[] = [
  {
    id: 'r1',
    business_id: 'mock-meridian-gear',
    customer_name: 'Marcus T.',
    order_id: 'ORD-48291',
    rating_overall: 5,
    review_text: 'Exactly what I ordered. Fast shipping and the product matched the listing perfectly.',
    verified_purchase: true,
    fraud_score: 8,
    status: 'published',
    business_response: null,
    helpful_count: 12,
    created_at: '2026-06-01T14:22:00Z',
  },
  {
    id: 'r2',
    business_id: 'mock-meridian-gear',
    customer_name: 'Diane K.',
    order_id: 'ORD-48102',
    rating_overall: 5,
    review_text: 'Great quality and customer service responded within hours.',
    verified_purchase: true,
    fraud_score: 12,
    status: 'published',
    business_response: 'Thank you, Diane!',
    helpful_count: 8,
    created_at: '2026-05-28T09:15:00Z',
  },
];

@Injectable()
export class EarnedstarService {
  private readonly logger = new Logger(EarnedstarService.name);

  constructor(
    private readonly postgres: PostgresService,
    private readonly email: InvitationEmailService,
    private readonly sms: TelnyxSmsService,
    private readonly photos: ReviewPhotoService,
    private readonly fraud: FraudScoringService,
    private readonly merchantStats: MerchantStatsService,
    private readonly planLimits: PlanLimitsService,
    private readonly indexNow: IndexNowService,
  ) {}

  private pingProfileSearch(slug: string): void {
    void this.indexNow.pingProfile(slug);
  }

  private merchantSelectCols = `id::text, name, slug, logo_url, website_url, seo_title, seo_description,
              plan, api_key, review_count, avg_rating::float8 AS avg_rating,
              COALESCE(public_profile_enabled, true) AS public_profile_enabled,
              review_summary_ai, review_summary_generated_at::text AS review_summary_generated_at`;

  private useMock(): boolean {
    return !this.postgres.isConfigured();
  }

  async getMerchantBySlug(slug: string): Promise<EarnedStarMerchant> {
    if (this.useMock()) {
      if (slug === 'meridian-gear' || slug === MOCK_MERCHANT.slug) return MOCK_MERCHANT;
      return { ...MOCK_MERCHANT, slug, name: slug.replace(/-/g, ' ') };
    }

    const row = await this.postgres.queryOne<EarnedStarMerchant>(
      `SELECT ${this.merchantSelectCols}
       FROM businesses WHERE slug = $1 LIMIT 1`,
      [slug],
    );
    if (!row) throw new NotFoundException(`Merchant not found: ${slug}`);
    return row;
  }

  async listPublishedReviews(
    slug: string,
    limit = 50,
    offset = 0,
    filters: {
      sort?: string;
      min_rating?: number;
      ymm_year?: number;
      ymm_make?: string;
      ymm_model?: string;
      has_photos?: boolean;
    } = {},
  ): Promise<EarnedStarReview[]> {
    if (this.useMock()) {
      await this.getMerchantBySlug(slug);
      return MOCK_REVIEWS.slice(offset, offset + limit);
    }

    const merchant = await this.getMerchantBySlug(slug);
    return this.queryReviews(merchant.id, limit, true, offset, filters);
  }

  async listMerchantReviews(slug: string, limit = 100): Promise<EarnedStarReview[]> {
    if (this.useMock()) {
      await this.getMerchantBySlug(slug);
      return MOCK_REVIEWS;
    }

    const merchant = await this.getMerchantBySlug(slug);
    return this.queryReviews(merchant.id, limit, false);
  }

  private async queryReviews(
    businessId: string,
    limit: number,
    publishedOnly: boolean,
    offset = 0,
    filters: {
      sort?: string;
      min_rating?: number;
      ymm_year?: number;
      ymm_make?: string;
      ymm_model?: string;
      has_photos?: boolean;
    } = {},
  ): Promise<EarnedStarReview[]> {
    const statusFilter = publishedOnly ? `AND r.status = 'published'` : '';
    const conditions: string[] = [`r.business_id = $1::uuid ${statusFilter}`];
    const params: unknown[] = [businessId];
    let paramIdx = 2;

    if (filters.min_rating != null) {
      conditions.push(`AND r.rating_overall >= $${paramIdx++}`);
      params.push(filters.min_rating);
    }
    if (filters.ymm_year != null) {
      conditions.push(`AND r.ymm_year = $${paramIdx++}`);
      params.push(filters.ymm_year);
    }
    if (filters.ymm_make) {
      conditions.push(`AND LOWER(r.ymm_make) = LOWER($${paramIdx++})`);
      params.push(filters.ymm_make);
    }
    if (filters.ymm_model) {
      conditions.push(`AND LOWER(r.ymm_model) = LOWER($${paramIdx++})`);
      params.push(filters.ymm_model);
    }
    if (filters.has_photos) {
      conditions.push(`AND COALESCE(array_length(r.photos, 1), 0) > 0`);
    }

    let orderBy = 'r.created_at DESC';
    if (filters.sort === 'helpful') orderBy = 'r.helpful_count DESC, r.created_at DESC';
    if (filters.sort === 'highest') orderBy = 'r.rating_overall DESC, r.created_at DESC';
    if (filters.sort === 'lowest') orderBy = 'r.rating_overall ASC, r.created_at DESC';

    params.push(limit, offset);

    return this.postgres.queryMany<EarnedStarReview>(
      `SELECT r.id::text, r.business_id::text, r.customer_name, r.order_id,
              r.rating_overall::float8 AS rating_overall, r.review_text,
              r.photos, r.video_url,
              r.ymm_year, r.ymm_make, r.ymm_model, r.ymm_trim,
              r.rating_fitment::float8 AS rating_fitment,
              r.rating_quality::float8 AS rating_quality,
              r.rating_shipping::float8 AS rating_shipping,
              r.rating_description::float8 AS rating_description,
              r.rating_install::float8 AS rating_install,
              r.verified_purchase, r.fraud_score, r.status, r.business_response,
              r.helpful_count, r.created_at::text,
              COALESCE(NULLIF(TRIM(SPLIT_PART(r.review_text, '.', 1)), ''), p.name) AS review_title,
              p.name AS product_name
       FROM reviews r
       LEFT JOIN products p ON p.id = r.product_id
       WHERE ${conditions.join(' ')}
       ORDER BY ${orderBy}
       LIMIT $${paramIdx++} OFFSET $${paramIdx}`,
      params,
    );
  }

  async getPublicProfileSummary(slug: string) {
    if (this.useMock()) {
      const merchant = await this.getMerchantBySlug(slug);
      return {
        merchant,
        ratingDistribution: [
          { stars: 5, count: 2410, pct: 84.6 },
          { stars: 4, count: 312, pct: 11.0 },
          { stars: 3, count: 85, pct: 3.0 },
          { stars: 2, count: 28, pct: 1.0 },
          { stars: 1, count: 12, pct: 0.4 },
        ],
        attributeAverages: {
          fitment: 4.8,
          quality: 4.9,
          shipping: 4.7,
          description: 4.8,
          install: 4.6,
        },
      };
    }

    const merchant = await this.getMerchantBySlug(slug);
    const ratingDistribution = await this.getRatingDistribution(merchant.id);
    const attrs = await this.postgres.queryOne<{
      fitment: number;
      quality: number;
      shipping: number;
      description: number;
      install: number;
    }>(
      `SELECT
         AVG(rating_fitment)::float8 AS fitment,
         AVG(rating_quality)::float8 AS quality,
         AVG(rating_shipping)::float8 AS shipping,
         AVG(rating_description)::float8 AS description,
         AVG(rating_install)::float8 AS install
       FROM reviews
       WHERE business_id = $1::uuid AND status = 'published'`,
      [merchant.id],
    );

    return {
      merchant,
      ratingDistribution,
      attributeAverages: {
        fitment: attrs?.fitment ?? merchant.avg_rating,
        quality: attrs?.quality ?? merchant.avg_rating,
        shipping: attrs?.shipping ?? merchant.avg_rating,
        description: attrs?.description ?? merchant.avg_rating,
        install: attrs?.install ?? merchant.avg_rating,
      },
    };
  }

  async getRatingDistribution(businessId: string) {
    const rows = await this.postgres.queryMany<{ stars: number; count: number }>(
      `SELECT FLOOR(rating_overall)::int AS stars, COUNT(*)::int AS count
       FROM reviews
       WHERE business_id = $1::uuid AND status = 'published'
       GROUP BY 1 ORDER BY stars DESC`,
      [businessId],
    );
    const total = rows.reduce((s, r) => s + r.count, 0) || 1;
    return [5, 4, 3, 2, 1].map((stars) => {
      const row = rows.find((r) => r.stars === stars);
      const count = row?.count ?? 0;
      return { stars, count, pct: Math.round((count / total) * 1000) / 10 };
    });
  }

  async getDashboardOverview(slug = 'meridian-gear') {
    if (this.useMock()) {
      return {
        merchant: MOCK_MERCHANT,
        stats: {
          totalReviews: 2847,
          weeklyDeltaPct: 12,
          avgRating: 4.9,
          inviteResponseRate: 34,
          googleSellerRating: 4.9,
          googleSellerActive: true,
        },
        ratingDistribution: [
          { stars: 5, count: 2410, pct: 84.6 },
          { stars: 4, count: 312, pct: 11.0 },
          { stars: 3, count: 85, pct: 3.0 },
          { stars: 2, count: 28, pct: 1.0 },
          { stars: 1, count: 12, pct: 0.4 },
        ],
        recentReviews: MOCK_REVIEWS,
      };
    }

    const merchant = await this.getMerchantBySlug(slug);
    const recentReviews = await this.listPublishedReviews(slug, 10);
    const ratingDistribution = await this.getRatingDistribution(merchant.id);
    const invites = await this.postgres.queryOne<{ sent: number; completed: number }>(
      `SELECT
         COUNT(*) FILTER (WHERE status IN ('sent','opened','completed','expired'))::int AS sent,
         COUNT(*) FILTER (WHERE status = 'completed')::int AS completed
       FROM review_requests WHERE business_id = $1::uuid`,
      [merchant.id],
    );
    const inviteResponseRate =
      invites && invites.sent > 0
        ? Math.round((invites.completed / invites.sent) * 100)
        : 0;

    return {
      merchant,
      stats: {
        totalReviews: merchant.review_count,
        weeklyDeltaPct: 12,
        avgRating: merchant.avg_rating,
        inviteResponseRate,
        googleSellerRating: merchant.avg_rating,
        googleSellerActive: merchant.avg_rating >= 4.5,
      },
      ratingDistribution,
      recentReviews,
    };
  }

  async submitReview(dto: SubmitReviewDto) {
    if (this.useMock()) {
      return {
        ok: true,
        reviewId: `mock-${Date.now()}`,
        status: 'pending',
        message: 'Review queued for AI verification (mock mode)',
      };
    }

    const invitation = await this.postgres.queryOne<{ business_id: string; order_id: string; plan: string }>(
      `SELECT rr.business_id::text, rr.order_id, b.plan
       FROM review_requests rr
       JOIN businesses b ON b.id = rr.business_id
       WHERE rr.token = $1 AND rr.status IN ('sent','opened') LIMIT 1`,
      [dto.token],
    );
    if (!invitation) throw new NotFoundException('Invalid or expired invitation token');

    if (dto.video_url && !this.planLimits.planAllowsVideo(invitation.plan)) {
      throw new ForbiddenException('Video reviews require Growth plan or higher');
    }

    const recentRows = await this.postgres.queryMany<{ review_text: string | null }>(
      `SELECT review_text FROM reviews
       WHERE business_id = $1::uuid AND review_text IS NOT NULL
       ORDER BY created_at DESC LIMIT 25`,
      [invitation.business_id],
    );
    const recentTexts = recentRows.map((r) => r.review_text ?? '').filter(Boolean);

    const verdict = this.fraud.scoreSubmission(dto, recentTexts);

    const row = await this.postgres.queryOne<{ id: string }>(
      `INSERT INTO reviews (
        business_id, customer_name, customer_email, order_id,
        rating_overall, rating_fitment, rating_quality, rating_shipping,
        rating_description, rating_install,
        ymm_year, ymm_make, ymm_model, ymm_trim,
        review_text, photos, video_url,
        verified_purchase, status, fraud_score, fraud_reasons,
        published_at
      ) VALUES ($1::uuid, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, true, $18, $19, $20,
        CASE WHEN $18 = 'published' THEN now() ELSE NULL END)
      RETURNING id::text`,
      [
        invitation.business_id,
        dto.customer_name,
        dto.customer_email,
        invitation.order_id,
        dto.rating_overall,
        dto.rating_fitment ?? null,
        dto.rating_quality ?? null,
        dto.rating_shipping ?? null,
        dto.rating_description ?? null,
        dto.rating_install ?? null,
        dto.ymm_year ?? null,
        dto.ymm_make ?? null,
        dto.ymm_model ?? null,
        dto.ymm_trim ?? null,
        dto.review_text,
        dto.photos ?? [],
        dto.video_url ?? null,
        verdict.status,
        verdict.score,
        verdict.reasons,
      ],
    );

    if (verdict.status === 'published') {
      await this.merchantStats.refreshForBusiness(invitation.business_id);
      const slugRow = await this.postgres.queryOne<{ slug: string }>(
        `SELECT slug FROM businesses WHERE id = $1::uuid LIMIT 1`,
        [invitation.business_id],
      );
      if (slugRow?.slug) this.pingProfileSearch(slugRow.slug);
    }

    await this.postgres.query(
      `UPDATE review_requests SET status = 'completed', review_submitted_at = now() WHERE token = $1`,
      [dto.token],
    );

    return {
      ok: true,
      reviewId: row?.id,
      status: verdict.status,
      fraud_score: verdict.score,
    };
  }

  async sendInvitationForOwner(ownerId: string, slug: string | undefined, dto: SendInvitationDto) {
    if (this.useMock()) {
      return this.sendInvitation(slug ?? 'meridian-gear', dto);
    }
    const merchant = await this.getMerchantForOwner(ownerId);
    if (slug && slug !== merchant.slug) {
      await this.getMerchantBySlug(slug);
    }
    return this.sendInvitation(merchant.slug, dto);
  }

  async sendInvitation(slug: string, dto: SendInvitationDto) {
    if (this.useMock()) {
      const siteUrl = process.env.EARNEDSTAR_SITE_URL ?? 'https://earnedstar.com';
      return {
        ok: true,
        invitationId: `mock-inv-${Date.now()}`,
        token: 'demo',
        status: (dto.delay_days ?? 0) > 0 ? 'scheduled' : 'sent',
        submitUrl: `${siteUrl}/submit/demo`,
        channel: dto.channel ?? 'email',
      };
    }

    const merchant = await this.getMerchantBySlug(slug);
    const emailPrefs = await this.getMerchantEmailPrefs(merchant.id);
    const channel = dto.channel ?? 'email';
    const delayDays = dto.delay_days ?? 0;

    await this.planLimits.assertCanSendInvitation(merchant.id, merchant.plan, channel);
    await this.flushScheduledInvitations(merchant.id);

    if (channel === 'sms' && !dto.customer_phone?.trim()) {
      throw new BadRequestException('customer_phone is required for SMS invitations');
    }
    if (channel === 'email' && !dto.customer_email?.trim()) {
      throw new BadRequestException('customer_email is required for email invitations');
    }

    const scheduled = delayDays > 0 && channel !== 'link';
    const status = scheduled ? 'scheduled' : 'sent';

    const customerEmail =
      dto.customer_email?.trim() ||
      (dto.customer_phone
        ? `${this.sms.normalizePhone(dto.customer_phone).replace(/\D/g, '')}@sms.earnedstar.local`
        : `link+${dto.order_id.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}@link.earnedstar.local`);

    const row = await this.postgres.queryOne<{ id: string; token: string }>(
      `INSERT INTO review_requests (
        business_id, customer_email, customer_phone, customer_name,
        order_id, channel, status, send_at, sent_at
      ) VALUES (
        $1::uuid, $2, $3, $4, $5, $6, $7,
        CASE WHEN $8::int > 0 THEN now() + ($8::int || ' days')::interval ELSE now() END,
        CASE WHEN $8::int > 0 THEN NULL ELSE now() END
      )
      RETURNING id::text, token`,
      [
        merchant.id,
        customerEmail,
        dto.customer_phone ?? null,
        dto.customer_name ?? null,
        dto.order_id,
        channel,
        status,
        delayDays,
      ],
    );

    const siteUrl = process.env.EARNEDSTAR_SITE_URL ?? 'https://earnedstar.com';
    const submitUrl = `${siteUrl}/submit/${row?.token}`;

    if (!scheduled) {
      await this.dispatchInvitationDelivery({
        channel,
        merchantName: merchant.name,
        submitUrl,
        orderId: dto.order_id,
        customerName: dto.customer_name ?? undefined,
        customerEmail,
        customerPhone: dto.customer_phone ?? undefined,
        emailPrefs,
      });
    }

    this.logger.log(`Invitation ${row?.id} ${status} for order ${dto.order_id}`);

    return {
      ok: true,
      invitationId: row?.id,
      token: row?.token,
      status,
      submitUrl,
      channel,
      scheduled,
      send_at_days: delayDays,
    };
  }

  async bulkSendInvitationsForOwner(
    ownerId: string,
    slug: string | undefined,
    dto: BulkSendInvitationsDto,
  ) {
    const merchant = this.useMock()
      ? { slug: slug ?? 'meridian-gear' }
      : await this.getMerchantForOwner(ownerId);
    const targetSlug = slug && !this.useMock() && slug !== merchant.slug ? slug : merchant.slug;

    const results: Array<{ order_id: string; ok: boolean; error?: string; submitUrl?: string }> = [];
    for (const row of dto.invitations) {
      try {
        const payload: SendInvitationDto = {
          ...row,
          channel: row.channel ?? dto.default_channel ?? 'email',
          delay_days: row.delay_days ?? dto.default_delay_days ?? 0,
        };
        const sent = await this.sendInvitation(targetSlug, payload);
        results.push({ order_id: row.order_id, ok: true, submitUrl: sent.submitUrl });
      } catch (err) {
        results.push({
          order_id: row.order_id,
          ok: false,
          error: err instanceof Error ? err.message : 'Failed',
        });
      }
    }
    return { ok: true, sent: results.filter((r) => r.ok).length, failed: results.filter((r) => !r.ok).length, results };
  }

  async resendInvitationForOwner(ownerId: string, slug: string | undefined, invitationId: string) {
    if (this.useMock()) {
      return this.sendInvitation(slug ?? 'meridian-gear', {
        order_id: `ORD-RESEND-${Date.now()}`,
        customer_email: 'resend@example.com',
        channel: 'email',
      });
    }

    const merchant = await this.getMerchantForOwner(ownerId);
    const row = await this.postgres.queryOne<{
      customer_email: string;
      customer_phone: string | null;
      customer_name: string | null;
      order_id: string;
      channel: string;
    }>(
      `SELECT customer_email, customer_phone, customer_name, order_id, channel
       FROM review_requests
       WHERE id = $1::uuid AND business_id = $2::uuid
       LIMIT 1`,
      [invitationId, merchant.id],
    );
    if (!row) throw new NotFoundException('Invitation not found');

    return this.sendInvitation(merchant.slug, {
      customer_email: row.customer_email.includes('@link.earnedstar.local') ? undefined : row.customer_email,
      customer_phone: row.customer_phone ?? undefined,
      customer_name: row.customer_name ?? undefined,
      order_id: row.order_id,
      channel: (row.channel as 'email' | 'sms' | 'link') ?? 'email',
      delay_days: 0,
    });
  }

  private async dispatchInvitationDelivery(input: {
    channel: string;
    merchantName: string;
    submitUrl: string;
    orderId: string;
    customerName?: string;
    customerEmail: string;
    customerPhone?: string;
    emailPrefs: { fromName?: string; subjectTemplate?: string };
  }) {
    if (input.channel === 'link') return;

    if (input.channel === 'sms' && input.customerPhone) {
      const smsText = `${input.merchantName}: Share your verified review — ${input.submitUrl}`;
      const smsResult = await this.sms.send(input.customerPhone, smsText);
      if (!smsResult.sent) {
        this.logger.warn(`SMS not sent: ${smsResult.reason}`);
      }
      return;
    }

    await this.email.sendReviewInvitation({
      to: input.customerEmail,
      merchantName: input.merchantName,
      submitUrl: input.submitUrl,
      orderId: input.orderId,
      customerName: input.customerName,
      fromName: input.emailPrefs.fromName ?? input.merchantName,
      subjectTemplate: input.emailPrefs.subjectTemplate ?? 'How was your order from {{merchant}}?',
    });
  }

  private async flushScheduledInvitations(businessId: string) {
    if (this.useMock() || !this.postgres.isConfigured()) return;

    const due = await this.postgres.queryMany<{
      id: string;
      token: string;
      customer_email: string;
      customer_phone: string | null;
      customer_name: string | null;
      order_id: string;
      channel: string;
      merchant_name: string;
    }>(
      `SELECT rr.id::text, rr.token, rr.customer_email, rr.customer_phone, rr.customer_name,
              rr.order_id, rr.channel, b.name AS merchant_name
       FROM review_requests rr
       JOIN businesses b ON b.id = rr.business_id
       WHERE rr.business_id = $1::uuid
         AND rr.status = 'scheduled'
         AND rr.send_at <= now()
       LIMIT 25`,
      [businessId],
    );

    for (const row of due) {
      const emailPrefs = await this.getMerchantEmailPrefs(businessId);
      const siteUrl = process.env.EARNEDSTAR_SITE_URL ?? 'https://earnedstar.com';
      const submitUrl = `${siteUrl}/submit/${row.token}`;
      await this.dispatchInvitationDelivery({
        channel: row.channel,
        merchantName: row.merchant_name,
        submitUrl,
        orderId: row.order_id,
        customerName: row.customer_name ?? undefined,
        customerEmail: row.customer_email,
        customerPhone: row.customer_phone ?? undefined,
        emailPrefs,
      });
      await this.postgres.query(
        `UPDATE review_requests SET status = 'sent', sent_at = now() WHERE id = $1::uuid`,
        [row.id],
      );
    }
  }

  async getInvitationByToken(token: string) {
    if (this.useMock()) {
      if (token === 'demo') {
        return {
          token: 'demo',
          status: 'sent',
          merchant_name: 'Meridian Gear Co.',
          merchant_slug: 'meridian-gear',
          order_id: 'ORD-DEMO',
          customer_name: 'Demo Customer',
          product_name: 'OEM Brake Pad Set — Front Axle',
          purchased_at: new Date(Date.now() - 7 * 86400000).toISOString(),
        };
      }
      if (token === 'expired') {
        return {
          token: 'expired',
          status: 'expired',
          merchant_name: 'Meridian Gear Co.',
          merchant_slug: 'meridian-gear',
          order_id: 'ORD-EXPIRED',
        };
      }
      throw new NotFoundException('Invalid or expired invitation token');
    }

    const row = await this.postgres.queryOne<{
      token: string;
      status: string;
      merchant_name: string;
      merchant_slug: string;
      order_id: string;
      customer_name: string | null;
      product_name: string | null;
      purchased_at: string | null;
    }>(
      `SELECT rr.token, rr.status, b.name AS merchant_name, b.slug AS merchant_slug, rr.order_id,
              rr.customer_name, p.name AS product_name,
              COALESCE(rr.sent_at, rr.created_at)::text AS purchased_at
       FROM review_requests rr
       JOIN businesses b ON b.id = rr.business_id
       LEFT JOIN products p ON p.id = rr.product_id
       WHERE rr.token = $1
       LIMIT 1`,
      [token],
    );
    if (!row) throw new NotFoundException('Invalid or expired invitation token');
    return row;
  }

  async listInvitations(slug: string, limit = 50) {
    if (this.useMock()) {
      return [
        {
          id: 'inv1',
          customer_email: 'marcus@example.com',
          order_id: 'ORD-48291',
          channel: 'email',
          status: 'completed',
          sent_at: '2026-06-01T10:00:00Z',
          token: 'demo',
        },
      ];
    }

    const merchant = await this.getMerchantBySlug(slug);
    await this.flushScheduledInvitations(merchant.id);
    return this.postgres.queryMany(
      `SELECT id::text, customer_email, customer_name, order_id, channel, status,
              COALESCE(sent_at, send_at, created_at)::text AS sent_at,
              opened_at::text AS opened_at, token
       FROM review_requests
       WHERE business_id = $1::uuid
       ORDER BY created_at DESC
       LIMIT $2`,
      [merchant.id, limit],
    );
  }

  getAggregateSchema(slug: string) {
    if (this.useMock()) {
      const merchant = slug === 'meridian-gear' ? MOCK_MERCHANT : { ...MOCK_MERCHANT, slug };
      return this.buildSchema(merchant);
    }
    return this.getMerchantBySlug(slug).then((merchant) => this.buildSchema(merchant));
  }

  private buildSchema(merchant: EarnedStarMerchant) {
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: merchant.name,
      url: merchant.website_url ?? `https://earnedstar.com/store/${merchant.slug}`,
      image: merchant.logo_url ?? undefined,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: merchant.avg_rating,
        reviewCount: merchant.review_count,
        bestRating: 5,
        worstRating: 1,
      },
    };
  }

  slugify(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48);
  }

  private async getMerchantEmailPrefs(businessId: string) {
    if (this.useMock()) {
      return { fromName: undefined as string | undefined, subjectTemplate: undefined as string | undefined };
    }
    const row = await this.postgres.queryOne<{
      email_from_name: string | null;
      email_subject_template: string | null;
    }>(
      `SELECT email_from_name, email_subject_template FROM businesses WHERE id = $1::uuid LIMIT 1`,
      [businessId],
    );
    return {
      fromName: row?.email_from_name ?? undefined,
      subjectTemplate: row?.email_subject_template ?? undefined,
    };
  }

  async provisionMerchant(dto: ProvisionMerchantDto) {
    if (this.useMock()) {
      return { ok: true, merchantId: MOCK_MERCHANT.id, slug: MOCK_MERCHANT.slug };
    }

    const slug = dto.slug?.trim() || this.slugify(dto.business_name);
    const existing = await this.postgres.queryOne<{ id: string; slug: string }>(
      `SELECT id::text, slug FROM businesses WHERE owner_id = $1::uuid LIMIT 1`,
      [dto.owner_id],
    );
    if (existing) {
      return { ok: true, merchantId: existing.id, slug: existing.slug, existing: true };
    }

    const row = await this.postgres.queryOne<{ id: string; slug: string }>(
      `INSERT INTO businesses (owner_id, name, slug, plan, website_url)
       VALUES ($1::uuid, $2, $3, $4, $5)
       ON CONFLICT (slug) DO UPDATE SET owner_id = EXCLUDED.owner_id
       RETURNING id::text, slug`,
      [
        dto.owner_id,
        dto.business_name,
        slug,
        dto.plan ?? 'starter',
        `https://earnedstar.com/store/${slug}`,
      ],
    );
    return { ok: true, merchantId: row?.id, slug: row?.slug };
  }

  async getMerchantForOwner(ownerId: string): Promise<EarnedStarMerchant> {
    if (this.useMock()) return MOCK_MERCHANT;

    const row = await this.postgres.queryOne<EarnedStarMerchant>(
      `SELECT ${this.merchantSelectCols}
       FROM businesses WHERE owner_id = $1::uuid LIMIT 1`,
      [ownerId],
    );
    if (!row) throw new NotFoundException('No merchant linked to this account');
    return row;
  }

  async updateMerchantBilling(
    businessId: string,
    patch: { plan: string; authnet_subscription_id?: string; authnet_customer_profile_id?: string },
  ) {
    if (this.useMock()) return { ok: true };
    await this.postgres.query(
      `UPDATE businesses SET plan = $2,
        authnet_subscription_id = COALESCE($3, authnet_subscription_id),
        authnet_customer_profile_id = COALESCE($4, authnet_customer_profile_id)
       WHERE id = $1::uuid`,
      [businessId, patch.plan, patch.authnet_subscription_id ?? null, patch.authnet_customer_profile_id ?? null],
    );
    return { ok: true };
  }

  async handleOrderFulfilled(dto: OrderFulfilledWebhookDto) {
    const slug = dto.merchant_slug ?? 'meridian-gear';
    let delay_days = 0;
    if (dto.delivery_date) {
      const d = new Date(dto.delivery_date);
      if (!Number.isNaN(d.getTime())) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        d.setHours(0, 0, 0, 0);
        delay_days = Math.min(14, Math.max(0, Math.ceil((d.getTime() - today.getTime()) / 86400000)));
      }
    }
    const result = await this.sendInvitation(slug, {
      customer_email: dto.customer_email,
      customer_name: dto.customer_name,
      order_id: dto.order_id,
      channel: 'email',
      delay_days,
    });
    return {
      success: true,
      request_id: result.invitationId,
      status: result.status,
      submitUrl: result.submitUrl,
    };
  }

  async getMerchantByApiKey(apiKey: string): Promise<EarnedStarMerchant> {
    if (this.useMock()) {
      if (apiKey === 'demo' || apiKey === 'YOUR_API_KEY') return MOCK_MERCHANT;
      return MOCK_MERCHANT;
    }

    const row = await this.postgres.queryOne<EarnedStarMerchant>(
      `SELECT id::text, name, slug, logo_url, website_url, seo_title, seo_description,
              plan, api_key, review_count, avg_rating::float8 AS avg_rating
       FROM businesses WHERE api_key = $1 LIMIT 1`,
      [apiKey],
    );
    if (!row) throw new NotFoundException('Invalid API key');
    return row;
  }

  async getPublicEmbedByApiKey(apiKey: string) {
    const merchant = await this.getMerchantByApiKey(apiKey);
    const reviews = await this.listPublishedReviews(merchant.slug, 12);
    return {
      merchant: {
        name: merchant.name,
        slug: merchant.slug,
        avg_rating: merchant.avg_rating,
        review_count: merchant.review_count,
        logo_url: merchant.logo_url,
      },
      reviews: reviews.map((r) => ({
        id: r.id,
        customer_name: r.customer_name,
        rating_overall: r.rating_overall,
        review_text: r.review_text,
        created_at: r.created_at,
        photos: r.photos ?? [],
      })),
    };
  }

  async uploadReviewPhoto(dto: UploadReviewPhotoDto) {
    if (this.useMock()) {
      return { ok: true, url: `data:image/jpeg;base64,${dto.data_base64.slice(0, 32)}` };
    }

    const invitation = await this.postgres.queryOne<{ business_id: string }>(
      `SELECT business_id::text FROM review_requests
       WHERE token = $1 AND status IN ('sent','opened') LIMIT 1`,
      [dto.token],
    );
    if (!invitation) throw new NotFoundException('Invalid or expired invitation token');

    const url = await this.photos.uploadFromBase64({
      businessId: invitation.business_id,
      filename: dto.filename,
      contentType: dto.content_type,
      dataBase64: dto.data_base64,
    });

    return { ok: true, url };
  }

  async moderateReviewForOwner(ownerId: string, reviewId: string, dto: ModerateReviewDto) {
    if (this.useMock()) {
      return { ok: true, reviewId, status: dto.status };
    }

    const merchant = await this.getMerchantForOwner(ownerId);
    const existing = await this.postgres.queryOne<{ status: string }>(
      `SELECT status FROM reviews WHERE id = $1::uuid AND business_id = $2::uuid LIMIT 1`,
      [reviewId, merchant.id],
    );
    if (!existing) throw new NotFoundException('Review not found');

    await this.postgres.query(
      `UPDATE reviews SET status = $3, published_at = CASE WHEN $3 = 'published' THEN now() ELSE published_at END
       WHERE id = $1::uuid AND business_id = $2::uuid`,
      [reviewId, merchant.id, dto.status],
    );

    if (dto.status === 'published') {
      await this.merchantStats.refreshForBusiness(merchant.id);
      this.pingProfileSearch(merchant.slug);
    }

    return { ok: true, reviewId, status: dto.status };
  }

  async respondToReviewForOwner(ownerId: string, reviewId: string, dto: RespondReviewDto) {
    const text = dto.business_response.trim();
    if (this.useMock()) {
      return { ok: true, reviewId, business_response: text };
    }

    const merchant = await this.getMerchantForOwner(ownerId);
    const existing = await this.postgres.queryOne<{
      id: string;
      customer_name: string;
      customer_email: string | null;
      product_name: string | null;
    }>(
      `SELECT r.id::text, r.customer_name, r.customer_email,
              p.name AS product_name
       FROM reviews r
       LEFT JOIN products p ON p.id = r.product_id
       WHERE r.id = $1::uuid AND r.business_id = $2::uuid
       LIMIT 1`,
      [reviewId, merchant.id],
    );
    if (!existing) throw new NotFoundException('Review not found');

    await this.postgres.query(
      `UPDATE reviews SET business_response = $3, response_at = now()
       WHERE id = $1::uuid AND business_id = $2::uuid`,
      [reviewId, merchant.id, text],
    );

    if (existing.customer_email) {
      const siteUrl = process.env.EARNEDSTAR_SITE_URL ?? 'https://earnedstar.com';
      void this.email.sendResponseNotification({
        to: existing.customer_email,
        customerName: existing.customer_name,
        merchantName: merchant.name,
        productName: existing.product_name ?? undefined,
        responseText: text,
        reviewUrl: `${siteUrl}/reviews/${merchant.slug}`,
      });
    }

    return { ok: true, reviewId, business_response: text };
  }

  async getPublicWidgetBySlug(slug: string, max = 12) {
    const merchant = await this.getMerchantBySlug(slug);
    const reviews = await this.listPublishedReviews(merchant.slug, max, 0);
    return {
      merchant: {
        name: merchant.name,
        slug: merchant.slug,
        avg_rating: merchant.avg_rating,
        review_count: merchant.review_count,
        logo_url: merchant.logo_url,
        website_url: merchant.website_url,
      },
      reviews: reviews.map((r) => ({
        id: r.id,
        customer_name: r.customer_name,
        rating_overall: r.rating_overall,
        review_text: r.review_text,
        created_at: r.created_at,
        photos: r.photos ?? [],
        product_name: r.product_name,
      })),
      embed: {
        script: `https://earnedstar.com/widget/v1/widget.js`,
        api_key: merchant.api_key,
      },
    };
  }

  async getAnalyticsDashboard(slug = 'meridian-gear') {
    if (this.useMock()) {
      const weeks = ['May 5', 'May 12', 'May 19', 'May 26', 'Jun 2', 'Jun 9', 'Jun 16', 'Jun 23'];
      return {
        invitationTrend: weeks.map((week, i) => ({
          week,
          sent: 120 + i * 18,
          completed: 38 + i * 5,
        })),
        reviewVelocity: weeks.map((week, i) => ({
          week,
          published: 24 + i * 4,
          pending: 3 + (i % 2),
        })),
        sentiment: { positive: 86, neutral: 9, negative: 5 },
      };
    }

    const merchant = await this.getMerchantBySlug(slug);
    this.planLimits.assertCanAccessAnalytics(merchant.plan);

    const inviteRows = await this.postgres.queryMany<{ week: string; sent: number; completed: number }>(
      `SELECT to_char(date_trunc('week', created_at), 'Mon DD') AS week,
              COUNT(*)::int AS sent,
              COUNT(*) FILTER (WHERE status = 'completed')::int AS completed
       FROM review_requests
       WHERE business_id = $1::uuid AND created_at >= now() - interval '8 weeks'
       GROUP BY date_trunc('week', created_at)
       ORDER BY date_trunc('week', created_at)`,
      [merchant.id],
    );

    const reviewRows = await this.postgres.queryMany<{ week: string; published: number; pending: number }>(
      `SELECT to_char(date_trunc('week', created_at), 'Mon DD') AS week,
              COUNT(*) FILTER (WHERE status = 'published')::int AS published,
              COUNT(*) FILTER (WHERE status IN ('pending','flagged'))::int AS pending
       FROM reviews
       WHERE business_id = $1::uuid AND created_at >= now() - interval '8 weeks'
       GROUP BY date_trunc('week', created_at)
       ORDER BY date_trunc('week', created_at)`,
      [merchant.id],
    );

    const sentimentRow = await this.postgres.queryOne<{ positive: number; neutral: number; negative: number }>(
      `SELECT
         COUNT(*) FILTER (WHERE rating_overall >= 4)::int AS positive,
         COUNT(*) FILTER (WHERE rating_overall = 3)::int AS neutral,
         COUNT(*) FILTER (WHERE rating_overall <= 2)::int AS negative
       FROM reviews
       WHERE business_id = $1::uuid AND status = 'published'`,
      [merchant.id],
    );
    const totalSentiment =
      (sentimentRow?.positive ?? 0) + (sentimentRow?.neutral ?? 0) + (sentimentRow?.negative ?? 0) || 1;

    return {
      invitationTrend: inviteRows,
      reviewVelocity: reviewRows,
      sentiment: {
        positive: Math.round(((sentimentRow?.positive ?? 0) / totalSentiment) * 100),
        neutral: Math.round(((sentimentRow?.neutral ?? 0) / totalSentiment) * 100),
        negative: Math.round(((sentimentRow?.negative ?? 0) / totalSentiment) * 100),
      },
    };
  }

  private buildWidgetEmbedCode(apiKey: string, widgetType: string, config: Record<string, unknown> = {}) {
    const max = Number(config.max ?? 6);
    const color = String(config.color ?? 'navy');
    const size = Number(config.size ?? 128);
    if (widgetType === 'badge') {
      return `<script src="https://earnedstar.com/badge/v1/badge.js"
  data-key="${apiKey}"
  data-style="origami"
  data-color="${color}"
  data-size="${size}"
  data-position="bottom-right"></script>`;
    }
    if (widgetType === 'floating') {
      return `<script src="https://earnedstar.com/widget/v1/widget.js"
  data-key="${apiKey}"
  data-widget="floating"
  data-max="1"></script>`;
    }
    return `<script src="https://earnedstar.com/widget/v1/widget.js"
  data-key="${apiKey}"
  data-widget="${widgetType === 'list' ? 'feed' : widgetType}"
  data-max="${max}"></script>`;
  }

  async listWidgetsForOwner(ownerId: string) {
    const merchant = await this.getMerchantForOwner(ownerId);
    return this.listWidgets(merchant.id, merchant.api_key);
  }

  async listWidgets(merchantId: string, apiKey?: string) {
    if (this.useMock()) {
      const key = apiKey ?? 'demo';
      return [
        {
          id: 'w1',
          name: 'Origami Badge',
          widget_type: 'badge',
          embed_code: this.buildWidgetEmbedCode(key, 'badge'),
          config: { color: 'navy', size: 128 },
        },
        {
          id: 'w2',
          name: 'Review Carousel',
          widget_type: 'carousel',
          embed_code: this.buildWidgetEmbedCode(key, 'carousel', { max: 6 }),
          config: { max: 6 },
        },
      ];
    }

    const rows = await this.postgres.queryMany<{
      id: string;
      name: string;
      widget_type: string;
      config: Record<string, unknown>;
      embed_code: string | null;
      created_at: string;
    }>(
      `SELECT id::text, name, widget_type, config, embed_code, created_at::text
       FROM review_widgets WHERE business_id = $1::uuid ORDER BY created_at DESC`,
      [merchantId],
    );

    const key =
      apiKey ??
      (await this.postgres.queryOne<{ api_key: string }>(
        `SELECT api_key FROM businesses WHERE id = $1::uuid`,
        [merchantId],
      ))?.api_key ??
      'YOUR_API_KEY';

    return rows.map((row) => ({
      ...row,
      embed_code: row.embed_code ?? this.buildWidgetEmbedCode(key, row.widget_type, row.config ?? {}),
    }));
  }

  async createWidgetForOwner(
    ownerId: string,
    dto: { name: string; widget_type: string; config?: Record<string, unknown> },
  ) {
    if (this.useMock()) {
      const merchant = await this.getMerchantForOwner(ownerId);
      return {
        ok: true,
        widget: {
          id: `w-${Date.now()}`,
          name: dto.name,
          widget_type: dto.widget_type,
          config: dto.config ?? {},
          embed_code: this.buildWidgetEmbedCode(merchant.api_key ?? 'demo', dto.widget_type, dto.config),
        },
      };
    }

    const merchant = await this.getMerchantForOwner(ownerId);
    await this.planLimits.assertCanCreateWidget(merchant.id, merchant.plan);

    const apiKey = merchant.api_key ?? 'YOUR_API_KEY';
    const embedCode = this.buildWidgetEmbedCode(apiKey, dto.widget_type, dto.config ?? {});

    const row = await this.postgres.queryOne<{ id: string }>(
      `INSERT INTO review_widgets (business_id, name, widget_type, config, embed_code)
       VALUES ($1::uuid, $2, $3, $4::jsonb, $5)
       RETURNING id::text`,
      [merchant.id, dto.name, dto.widget_type, JSON.stringify(dto.config ?? {}), embedCode],
    );

    return {
      ok: true,
      widget: {
        id: row?.id,
        name: dto.name,
        widget_type: dto.widget_type,
        config: dto.config ?? {},
        embed_code: embedCode,
      },
    };
  }

  async deleteWidgetForOwner(ownerId: string, widgetId: string) {
    if (this.useMock()) return { ok: true };

    const merchant = await this.getMerchantForOwner(ownerId);
    await this.postgres.query(
      `DELETE FROM review_widgets WHERE id = $1::uuid AND business_id = $2::uuid`,
      [widgetId, merchant.id],
    );
    return { ok: true };
  }

  async getShopifyIntegration(ownerId: string) {
    if (this.useMock()) {
      return {
        connected: false,
        shop: null,
        webhookUrl: `${process.env.EARNEDSTAR_SITE_URL ?? 'https://earnedstar.com'}/api/earnedstar/webhooks/order-fulfilled`,
        installSteps: [
          'Enter your myshopify.com store URL below',
          'Add the order-fulfilled webhook in Shopify Admin → Settings → Notifications',
          'Paste your EarnedStar webhook secret when prompted',
        ],
      };
    }

    const merchant = await this.getMerchantForOwner(ownerId);
    const row = await this.postgres.queryOne<{ shopify_shop: string | null; shopify_status: string | null }>(
      `SELECT shopify_shop, shopify_status FROM businesses WHERE id = $1::uuid`,
      [merchant.id],
    );
    const apiBase = process.env.PUBLIC_API_URL ?? 'https://earnedstar-back.vercel.app/api';
    return {
      connected: row?.shopify_status === 'connected',
      shop: row?.shopify_shop ?? null,
      merchantSlug: merchant.slug,
      webhookUrl: `${apiBase}/earnedstar/webhooks/order-fulfilled`,
      webhookSecretEnv: 'EARNEDSTAR_WEBHOOK_SECRET',
    };
  }

  async connectShopifyForOwner(ownerId: string, shop: string) {
    const normalized = shop.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!normalized.endsWith('.myshopify.com')) {
      throw new BadRequestException('Shop must be a valid *.myshopify.com domain');
    }

    if (this.useMock()) {
      return { ok: true, shop: normalized, status: 'pending' };
    }

    const merchant = await this.getMerchantForOwner(ownerId);
    await this.postgres.query(
      `UPDATE businesses SET shopify_shop = $2, shopify_status = 'pending' WHERE id = $1::uuid`,
      [merchant.id, normalized],
    );
    return { ok: true, shop: normalized, status: 'pending' };
  }

  async getGoogleSellerFeed(slug: string) {
    const merchant = await this.getMerchantBySlug(slug);
    this.planLimits.assertCanAccessSyndication(merchant.plan);
    const reviews = await this.listPublishedReviews(slug, 50);
    return { merchant, reviews };
  }

  async getTrustpilotExport(slug: string) {
    const merchant = await this.getMerchantBySlug(slug);
    this.planLimits.assertCanAccessSyndication(merchant.plan);
    const reviews = await this.listPublishedReviews(slug, 100);
    return {
      businessUnit: {
        id: merchant.id,
        displayName: merchant.name,
        score: merchant.avg_rating,
        numberOfReviews: merchant.review_count,
        websiteUrl: merchant.website_url ?? `https://earnedstar.com/store/${merchant.slug}`,
      },
      reviews: reviews.map((r) => ({
        id: r.id,
        consumer: { displayName: r.customer_name },
        stars: r.rating_overall,
        title: (r.review_text ?? '').slice(0, 80),
        text: r.review_text,
        createdAt: r.created_at,
        verified: r.verified_purchase,
      })),
      exportedAt: new Date().toISOString(),
      source: 'EarnedStar',
    };
  }

  async exportReviewsCsvForOwner(ownerId: string, slug?: string) {
    const merchant = await this.getMerchantForOwner(ownerId);
    if (slug && slug !== merchant.slug) await this.getMerchantBySlug(slug);
    const limits = this.planLimits.limitsFor(merchant.plan);
    if (!limits.analytics) {
      throw new ForbiddenException('CSV export requires Growth plan or higher');
    }

    const reviews = await this.listMerchantReviews(merchant.slug, 500);
    const header = 'id,customer_name,rating,status,fraud_score,order_id,review_text,created_at';
    const rows = reviews.map((r) => {
      const text = (r.review_text ?? '').replace(/"/g, '""');
      return [
        r.id,
        `"${r.customer_name.replace(/"/g, '""')}"`,
        r.rating_overall,
        r.status,
        r.fraud_score,
        r.order_id ?? '',
        `"${text}"`,
        r.created_at,
      ].join(',');
    });
    return { filename: `${merchant.slug}-reviews.csv`, csv: [header, ...rows].join('\n') };
  }

  async getOnboardingStatus(ownerId: string) {
    if (this.useMock()) {
      return { completed: true, step: 5 };
    }
    const row = await this.postgres.queryOne<{ onboarding_completed_at: string | null }>(
      `SELECT onboarding_completed_at::text FROM businesses WHERE owner_id = $1::uuid LIMIT 1`,
      [ownerId],
    );
    return { completed: Boolean(row?.onboarding_completed_at), step: row?.onboarding_completed_at ? 5 : 1 };
  }

  async completeOnboarding(ownerId: string, dto: CompleteOnboardingDto) {
    if (this.useMock()) return { ok: true, completed: true };

    const merchant = await this.getMerchantForOwner(ownerId);
    await this.postgres.query(
      `UPDATE businesses SET
        name = COALESCE($2, name),
        website_url = COALESCE($3, website_url),
        industry = COALESCE($4, industry),
        logo_url = COALESCE($5, logo_url),
        email_from_name = COALESCE($6, email_from_name),
        email_subject_template = COALESCE($7, email_subject_template),
        invite_delay_days = COALESCE($8, invite_delay_days),
        onboarding_completed_at = now()
       WHERE id = $1::uuid`,
      [
        merchant.id,
        dto.business_name ?? null,
        dto.website_url ?? null,
        dto.industry ?? null,
        dto.logo_url ?? null,
        dto.email_from_name ?? null,
        dto.email_subject_template ?? null,
        dto.invite_delay_days ?? null,
      ],
    );
    return { ok: true, completed: true, slug: merchant.slug };
  }

  async updateMerchantProfile(ownerId: string, dto: UpdateMerchantProfileDto) {
    if (this.useMock()) return { ok: true, merchant: MOCK_MERCHANT };

    const merchant = await this.getMerchantForOwner(ownerId);
    await this.postgres.query(
      `UPDATE businesses SET
        name = COALESCE($2, name),
        website_url = COALESCE($3, website_url),
        seo_title = COALESCE($4, seo_title),
        seo_description = COALESCE($5, seo_description)
       WHERE id = $1::uuid`,
      [
        merchant.id,
        dto.name ?? null,
        dto.website_url ?? null,
        dto.seo_title ?? null,
        dto.seo_description ?? null,
      ],
    );
    const updated = await this.getMerchantForOwner(ownerId);
    if (dto.seo_title !== undefined || dto.seo_description !== undefined) {
      this.pingProfileSearch(updated.slug);
    }
    return { ok: true, merchant: updated };
  }

  async listAgencyClients(ownerId: string) {
    const agency = await this.getMerchantForOwner(ownerId);
    if (agency.plan !== 'agency') {
      throw new ForbiddenException('Agency plan required');
    }

    if (this.useMock()) {
      return [
        { id: 'c1', name: 'Summit Auto Supply', slug: 'summit-auto', review_count: 412, avg_rating: 4.8 },
        { id: 'c2', name: 'Coastal Parts Co.', slug: 'coastal-parts', review_count: 189, avg_rating: 4.7 },
      ];
    }

    return this.postgres.queryMany(
      `SELECT id::text, name, slug, review_count, avg_rating::float8 AS avg_rating, website_url, created_at::text
       FROM businesses WHERE parent_business_id = $1::uuid ORDER BY created_at DESC`,
      [agency.id],
    );
  }

  async createAgencyClient(ownerId: string, dto: CreateAgencyClientDto) {
    const agency = await this.getMerchantForOwner(ownerId);
    if (agency.plan !== 'agency') {
      throw new ForbiddenException('Agency plan required');
    }

    const limits = this.planLimits.limitsFor(agency.plan);
    if (this.postgres.isConfigured()) {
      const row = await this.postgres.queryOne<{ count: number }>(
        `SELECT COUNT(*)::int AS count FROM businesses WHERE parent_business_id = $1::uuid`,
        [agency.id],
      );
      const max = (limits as { sub_accounts?: number }).sub_accounts ?? 25;
      if ((row?.count ?? 0) >= max) {
        throw new ForbiddenException(`Agency client limit reached (${max})`);
      }
    }

    const slug = dto.slug?.trim() || this.slugify(dto.business_name);
    if (this.useMock()) {
      return { ok: true, slug, name: dto.business_name };
    }

    const row = await this.postgres.queryOne<{ id: string; slug: string }>(
      `INSERT INTO businesses (owner_id, parent_business_id, name, slug, website_url, plan)
       VALUES ($1::uuid, $2::uuid, $3, $4, $5, 'growth')
       RETURNING id::text, slug`,
      [ownerId, agency.id, dto.business_name, slug, dto.website_url ?? `https://earnedstar.com/store/${slug}`],
    );
    return { ok: true, clientId: row?.id, slug: row?.slug, name: dto.business_name };
  }

  async listPublishedQa(slug: string) {
    if (this.useMock()) {
      return [
        {
          id: 'qa1',
          question: 'How long does shipping take?',
          answer: 'Most orders ship within 2–3 business days.',
          asked_by: 'Customer',
          answered_at: new Date().toISOString(),
        },
      ];
    }

    const merchant = await this.getMerchantBySlug(slug);
    if (!merchant) throw new NotFoundException('Store not found');

    return this.postgres.queryMany(
      `SELECT id::text, question, answer, asked_by, answered_at::text, created_at::text
       FROM qa_items
       WHERE business_id = $1::uuid AND published = true AND answer IS NOT NULL
       ORDER BY answered_at DESC NULLS LAST, created_at DESC
       LIMIT 50`,
      [merchant.id],
    );
  }

  async publicAskQa(slug: string, question: string, askedBy?: string) {
    if (this.useMock()) {
      return { ok: true, id: `qa-${Date.now()}` };
    }

    const merchant = await this.getMerchantBySlug(slug);
    const row = await this.postgres.queryOne<{ id: string }>(
      `INSERT INTO qa_items (business_id, question, asked_by, published)
       VALUES ($1::uuid, $2, $3, false)
       RETURNING id::text`,
      [merchant.id, question, askedBy ?? 'Customer'],
    );
    return { ok: true, id: row?.id };
  }

  async listQaForOwner(ownerId: string) {
    const merchant = await this.getMerchantForOwner(ownerId);
    this.planLimits.assertCanAccessQa(merchant.plan);

    if (this.useMock()) {
      return [
        {
          id: 'qa1',
          question: 'Do you offer installation support?',
          answer: null,
          published: false,
          asked_by: 'Alex M.',
          created_at: new Date().toISOString(),
        },
      ];
    }

    return this.postgres.queryMany(
      `SELECT id::text, question, answer, published, ai_generated, asked_by,
              answered_at::text, created_at::text
       FROM qa_items
       WHERE business_id = $1::uuid
       ORDER BY created_at DESC`,
      [merchant.id],
    );
  }

  async createQaForOwner(ownerId: string, dto: CreateQaItemDto) {
    const merchant = await this.getMerchantForOwner(ownerId);
    this.planLimits.assertCanAccessQa(merchant.plan);

    const answer = dto.answer?.trim() || null;
    const published = Boolean(dto.published && answer);

    if (this.useMock()) {
      return {
        ok: true,
        id: 'qa-mock',
        question: dto.question,
        answer,
        published,
      };
    }

    const row = await this.postgres.queryOne<{ id: string }>(
      `INSERT INTO qa_items (business_id, question, answer, asked_by, published, answered_at)
       VALUES ($1::uuid, $2, $3, $4, $5, CASE WHEN $3 IS NOT NULL THEN now() ELSE NULL END)
       RETURNING id::text`,
      [merchant.id, dto.question.trim(), answer, dto.asked_by?.trim() ?? 'Merchant', published],
    );
    if (published) this.pingProfileSearch(merchant.slug);
    return { ok: true, id: row?.id, published };
  }

  async updateQaForOwner(ownerId: string, id: string, dto: UpdateQaItemDto) {
    const merchant = await this.getMerchantForOwner(ownerId);
    this.planLimits.assertCanAccessQa(merchant.plan);

    if (this.useMock()) {
      return { ok: true, id };
    }

    const existing = await this.postgres.queryOne<{ id: string; answer: string | null; published: boolean }>(
      `SELECT id::text, answer, published FROM qa_items WHERE id = $1::uuid AND business_id = $2::uuid`,
      [id, merchant.id],
    );
    if (!existing) throw new NotFoundException('Q&A item not found');

    const nextAnswer = dto.answer !== undefined ? dto.answer?.trim() || null : existing.answer;
    const nextQuestion = dto.question?.trim();
    let nextPublished = dto.published !== undefined ? dto.published : existing.published;
    if (nextPublished && !nextAnswer) nextPublished = false;

    await this.postgres.query(
      `UPDATE qa_items SET
         question = COALESCE($3, question),
         answer = $4,
         published = $5,
         answered_at = CASE
           WHEN $4 IS NOT NULL AND answered_at IS NULL THEN now()
           WHEN $4 IS NULL THEN NULL
           ELSE answered_at
         END
       WHERE id = $1::uuid AND business_id = $2::uuid`,
      [id, merchant.id, nextQuestion ?? null, nextAnswer, nextPublished],
    );
    if (nextPublished) this.pingProfileSearch(merchant.slug);
    return { ok: true, id };
  }

  async deleteQaForOwner(ownerId: string, id: string) {
    const merchant = await this.getMerchantForOwner(ownerId);
    this.planLimits.assertCanAccessQa(merchant.plan);

    if (this.useMock()) return { ok: true };

    const result = await this.postgres.query(
      `DELETE FROM qa_items WHERE id = $1::uuid AND business_id = $2::uuid`,
      [id, merchant.id],
    );
    if ((result as { rowCount?: number }).rowCount === 0) {
      throw new NotFoundException('Q&A item not found');
    }
    return { ok: true };
  }

  async listTeamMembersForOwner(ownerId: string) {
    const merchant = await this.getMerchantForOwner(ownerId);
    const limits = this.planLimits.limitsFor(merchant.plan);

    if (this.useMock()) {
      return {
        seats: { used: 1, limit: limits.users },
        members: [{ id: 'owner', email: 'owner@store.com', role: 'admin', status: 'active' }],
      };
    }

    const members = await this.postgres.queryMany(
      `SELECT id::text, email, role, accepted_at::text, created_at::text
       FROM team_members WHERE business_id = $1::uuid ORDER BY created_at ASC`,
      [merchant.id],
    );
    return {
      seats: { used: members.length + 1, limit: limits.users },
      members: members.map((m) => ({
        ...m,
        status: m.accepted_at ? 'active' : 'pending',
      })),
    };
  }

  async inviteTeamMemberForOwner(ownerId: string, dto: InviteTeamMemberDto) {
    const merchant = await this.getMerchantForOwner(ownerId);
    await this.planLimits.assertCanAddTeamMember(merchant.id, merchant.plan);

    const email = dto.email.trim().toLowerCase();
    const role = dto.role ?? 'viewer';

    if (this.useMock()) {
      return { ok: true, email, role, status: 'pending' };
    }

    const row = await this.postgres.queryOne<{ id: string }>(
      `INSERT INTO team_members (business_id, email, role, invited_by)
       VALUES ($1::uuid, $2, $3, $4::uuid)
       ON CONFLICT (business_id, email) DO UPDATE SET role = EXCLUDED.role
       RETURNING id::text`,
      [merchant.id, email, role, ownerId],
    );
    return { ok: true, id: row?.id, email, role, status: 'pending' };
  }

  async removeTeamMemberForOwner(ownerId: string, memberId: string) {
    const merchant = await this.getMerchantForOwner(ownerId);

    if (this.useMock()) return { ok: true };

    const result = await this.postgres.query(
      `DELETE FROM team_members WHERE id = $1::uuid AND business_id = $2::uuid`,
      [memberId, merchant.id],
    );
    if ((result as { rowCount?: number }).rowCount === 0) {
      throw new NotFoundException('Team member not found');
    }
    return { ok: true };
  }

  async getMerchantByWhiteLabelDomain(host: string) {
    const domain = host.toLowerCase().replace(/^www\./, '');
    if (this.useMock()) return null;

    const row = await this.postgres.queryOne<EarnedStarMerchant>(
      `SELECT id::text, name, slug, logo_url, website_url, seo_title, seo_description,
              plan, api_key, review_count, avg_rating::float8 AS avg_rating
       FROM businesses
       WHERE white_label_domain = $1 OR slug = $2
       LIMIT 1`,
      [domain, domain.split('.')[0] ?? domain],
    );
    return row;
  }

  async listSitemapMerchants(): Promise<{ slug: string; lastModified: string }[]> {
    if (this.useMock()) {
      return [{ slug: MOCK_MERCHANT.slug, lastModified: new Date().toISOString() }];
    }

    const rows = await this.postgres.queryMany<{ slug: string; last_modified: string }>(
      `SELECT b.slug,
              GREATEST(
                b.created_at,
                COALESCE(MAX(r.published_at), b.created_at),
                COALESCE(MAX(r.created_at) FILTER (WHERE r.status = 'published'), b.created_at)
              )::text AS last_modified
       FROM businesses b
       LEFT JOIN reviews r ON r.business_id = b.id AND r.status = 'published'
       WHERE COALESCE(b.public_profile_enabled, true) = true
         AND b.review_count > 0
       GROUP BY b.id, b.slug, b.created_at
       ORDER BY last_modified DESC
       LIMIT 50000`,
    );
    return rows.map((r) => ({ slug: r.slug, lastModified: r.last_modified }));
  }

  async getSeoHealthForOwner(ownerId: string) {
    const merchant = await this.getMerchantForOwner(ownerId);
    const limits = this.planLimits.limitsFor(merchant.plan);

    if (this.useMock()) {
      return {
        profile_url: `https://earnedstar.com/reviews/${merchant.slug}`,
        checks: {
          profile_indexable: merchant.review_count >= 1,
          meta_filled: Boolean(merchant.seo_title?.trim() && merchant.seo_description?.trim()),
          faq_schema: false,
          syndication_available: Boolean((limits as { syndication?: boolean }).syndication),
          review_summary_fresh: false,
        },
        counts: { published_reviews: merchant.review_count, published_qa: 0 },
        review_summary_ai: null,
        review_summary_generated_at: null,
        indexnow_enabled: this.indexNow.isEnabled(),
      };
    }

    const qaRow = await this.postgres.queryOne<{ count: number }>(
      `SELECT COUNT(*)::int AS count FROM qa_items
       WHERE business_id = $1::uuid AND published = true AND answer IS NOT NULL`,
      [merchant.id],
    );
    const publishedQa = qaRow?.count ?? 0;
    const summaryFresh =
      merchant.review_summary_generated_at != null &&
      Date.now() - new Date(merchant.review_summary_generated_at).getTime() < 30 * 24 * 60 * 60 * 1000;

    return {
      profile_url: `${this.indexNow.profileUrl(merchant.slug)}`,
      checks: {
        profile_indexable:
          (merchant.public_profile_enabled ?? true) && merchant.review_count >= 1,
        meta_filled: Boolean(merchant.seo_title?.trim() && merchant.seo_description?.trim()),
        faq_schema: publishedQa >= 3,
        syndication_available: Boolean((limits as { syndication?: boolean }).syndication),
        review_summary_fresh: summaryFresh && Boolean(merchant.review_summary_ai),
      },
      counts: {
        published_reviews: merchant.review_count,
        published_qa: publishedQa,
      },
      review_summary_ai: merchant.review_summary_ai ?? null,
      review_summary_generated_at: merchant.review_summary_generated_at ?? null,
      indexnow_enabled: this.indexNow.isEnabled(),
      plan_features: {
        ai_meta_suggestions: Boolean((limits as { ai_meta_suggestions?: boolean }).ai_meta_suggestions),
        ai_review_summary: Boolean((limits as { ai_review_summary?: boolean }).ai_review_summary),
        ai_qa_suggestions: Boolean((limits as { ai_qa_suggestions?: boolean }).ai_qa_suggestions),
      },
    };
  }
}
