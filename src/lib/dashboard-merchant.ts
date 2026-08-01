/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { getApiBase } from "@/lib/api";
import { authHeaders } from "@/lib/auth-server";

const DEFAULT_DEMO_SLUG = "meridian-gear";

export type DashboardMerchant = {
  id: string;
  name: string;
  slug: string;
  plan: string;
  api_key?: string;
  logo_url: string | null;
  website_url: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  review_count: number;
  avg_rating: number;
  /** Bible Phase 4i — days before re-asking the same customer for a review of the same product (default 90). */
  review_request_cooldown_days?: number;
  /** Bible Phase 4h — points awarded to a customer when their review is published (0 = disabled). */
  points_per_review?: number;
  /** Bible Phase 4h — points awarded to the referrer when a referral converts (0 = disabled). */
  points_per_referral?: number;
  /** Bible Phase 4i — B2B/wholesale review collection opt-in. Off by default. */
  b2b_mode_enabled?: boolean;
  /** Bible Phase 4i — days to wait after fulfillment before requesting a review on a B2B order (default 30). */
  b2b_default_delay_days?: number;
};

export async function getDashboardMerchant(): Promise<DashboardMerchant> {
  try {
    const res = await fetch(`${getApiBase()}/earnedstar/auth/me`, {
      headers: { ...(await authHeaders()) },
      cache: "no-store",
    });
    if (res.ok) {
      return (await res.json()) as DashboardMerchant;
    }
  } catch {
    // fall through
  }

  const res = await fetch(`${getApiBase()}/earnedstar/merchants/${DEFAULT_DEMO_SLUG}`, {
    next: { revalidate: 60 },
  });
  if (res.ok) {
    return (await res.json()) as DashboardMerchant;
  }

  return {
    id: "fallback",
    name: "Meridian Gear Co.",
    slug: DEFAULT_DEMO_SLUG,
    plan: "growth",
    logo_url: null,
    website_url: "https://meridian-gear.example.com",
    seo_title: null,
    seo_description: null,
    review_count: 2847,
    avg_rating: 4.9,
    points_per_review: 10,
    points_per_referral: 50,
  };
}
