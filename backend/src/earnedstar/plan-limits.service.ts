/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PostgresService } from '../database/postgres.service';
import { normalizePlan, PLAN_LIMITS, type PlanId } from './plan-limits';

@Injectable()
export class PlanLimitsService {
  constructor(private readonly postgres: PostgresService) {}

  limitsFor(plan: string | undefined) {
    return PLAN_LIMITS[normalizePlan(plan)];
  }

  async assertCanSendInvitation(businessId: string, plan: string | undefined, channel?: string) {
    const limits = this.limitsFor(plan);
    if (channel === 'sms' && !limits.sms) {
      throw new ForbiddenException('SMS invitations require Growth plan or higher');
    }

    if (limits.monthly_requests < 0) return;

    if (!this.postgres.isConfigured()) return;

    const row = await this.postgres.queryOne<{ count: number }>(
      `SELECT COUNT(*)::int AS count
       FROM review_requests
       WHERE business_id = $1::uuid
         AND created_at >= date_trunc('month', now())`,
      [businessId],
    );
    const used = row?.count ?? 0;
    if (used >= limits.monthly_requests) {
      throw new ForbiddenException(
        `Monthly invitation limit reached (${limits.monthly_requests}). Upgrade your plan to send more.`,
      );
    }
  }

  planAllowsVideo(plan: string | undefined): boolean {
    return this.limitsFor(plan).video;
  }

  assertCanAccessAnalytics(plan: string | undefined) {
    if (!this.limitsFor(plan).analytics) {
      throw new ForbiddenException('Analytics require Growth plan or higher');
    }
  }

  assertCanAccessQa(plan: string | undefined) {
    const limits = this.limitsFor(plan) as { qa_module?: boolean };
    if (!limits.qa_module) {
      throw new ForbiddenException('Q&A SEO module requires Pro plan or higher');
    }
  }

  assertCanAccessSyndication(plan: string | undefined) {
    const limits = this.limitsFor(plan) as { syndication?: boolean };
    if (!limits.syndication) {
      throw new ForbiddenException('Review syndication feeds require Pro plan or higher');
    }
  }

  assertCanUseAiMeta(plan: string | undefined) {
    const limits = this.limitsFor(plan) as { ai_meta_suggestions?: boolean };
    if (!limits.ai_meta_suggestions) {
      throw new ForbiddenException('AI meta suggestions require Growth plan or higher');
    }
  }

  assertCanUseAiReviewSummary(plan: string | undefined) {
    const limits = this.limitsFor(plan) as { ai_review_summary?: boolean };
    if (!limits.ai_review_summary) {
      throw new ForbiddenException('AI review summaries require Growth plan or higher');
    }
  }

  assertCanUseAiQa(plan: string | undefined) {
    const limits = this.limitsFor(plan) as { ai_qa_suggestions?: boolean };
    if (!limits.ai_qa_suggestions) {
      throw new ForbiddenException('AI Q&A answer drafts require Pro plan or higher');
    }
  }

  async assertCanAddTeamMember(businessId: string, plan: string | undefined) {
    const limits = this.limitsFor(plan);
    if (limits.users < 0) return;

    if (!this.postgres.isConfigured()) return;

    const row = await this.postgres.queryOne<{ count: number }>(
      `SELECT COUNT(*)::int AS count FROM team_members WHERE business_id = $1::uuid`,
      [businessId],
    );
    const used = (row?.count ?? 0) + 1;
    if (used >= limits.users) {
      throw new ForbiddenException(
        `Team seat limit reached (${limits.users}). Upgrade your plan or remove a member.`,
      );
    }
  }

  async assertCanCreateWidget(businessId: string, plan: string | undefined) {
    const limits = this.limitsFor(plan);
    if (limits.widgets < 0) return;

    if (!this.postgres.isConfigured()) return;

    const row = await this.postgres.queryOne<{ count: number }>(
      `SELECT COUNT(*)::int AS count FROM review_widgets WHERE business_id = $1::uuid`,
      [businessId],
    );
    const used = row?.count ?? 0;
    if (used >= limits.widgets) {
      throw new ForbiddenException(
        `Widget limit reached (${limits.widgets}). Upgrade your plan or remove an existing widget.`,
      );
    }
  }
}
