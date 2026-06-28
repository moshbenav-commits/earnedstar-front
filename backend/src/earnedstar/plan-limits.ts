/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
export type PlanId = 'starter' | 'growth' | 'pro' | 'agency';

export const PLAN_LIMITS = {
  starter: {
    monthly_requests: 200,
    widgets: 2,
    users: 1,
    domains: 1,
    sms: false,
    video: false,
    ymm_filter: false,
    api_access: false,
    analytics: false,
    qa_module: false,
    syndication: false,
    ai_meta_suggestions: false,
    ai_review_summary: false,
    ai_qa_suggestions: false,
  },
  growth: {
    monthly_requests: 2000,
    widgets: 6,
    users: 3,
    domains: 1,
    sms: true,
    video: true,
    ymm_filter: true,
    api_access: 'read' as const,
    analytics: true,
    qa_module: false,
    syndication: false,
    ai_meta_suggestions: true,
    ai_review_summary: true,
    ai_qa_suggestions: false,
  },
  pro: {
    monthly_requests: 15000,
    widgets: 12,
    users: 10,
    domains: 3,
    sms: true,
    video: true,
    ymm_filter: true,
    api_access: 'full' as const,
    analytics: true,
    qa_module: true,
    syndication: true,
    ai_meta_suggestions: true,
    ai_review_summary: true,
    ai_qa_suggestions: true,
  },
  agency: {
    monthly_requests: -1,
    widgets: -1,
    users: -1,
    domains: -1,
    sms: true,
    video: true,
    ymm_filter: true,
    api_access: 'full' as const,
    analytics: true,
    qa_module: true,
    syndication: true,
    white_label: true,
    sub_accounts: 25,
    ai_meta_suggestions: true,
    ai_review_summary: true,
    ai_qa_suggestions: true,
  },
} as const;

export function normalizePlan(plan: string | undefined): PlanId {
  const id = (plan ?? 'starter').toLowerCase() as PlanId;
  return id in PLAN_LIMITS ? id : 'starter';
}
