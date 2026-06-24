/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import type { Review } from "@/types/review";
import type { Merchant } from "@/types/review";
import { getApiBase } from "@/lib/api";

const DEFAULT_DEMO_SLUG = "meridian-gear";

export type DashboardOverview = {
  merchant: Merchant;
  stats: {
    totalReviews: number;
    weeklyDeltaPct: number;
    avgRating: number;
    inviteResponseRate: number;
    googleSellerRating: number;
    googleSellerActive: boolean;
  };
  ratingDistribution: { stars: number; count: number; pct: number }[];
  recentReviews: Review[];
};

export function mapReview(row: Record<string, unknown>): Review {
  return {
    id: String(row.id),
    business_id: String(row.business_id),
    customer_name: String(row.customer_name),
    order_id: row.order_id ? String(row.order_id) : undefined,
    rating_overall: Number(row.rating_overall),
    review_title: row.review_title ? String(row.review_title) : undefined,
    review_text: String(row.review_text ?? ""),
    product_name: row.product_name ? String(row.product_name) : undefined,
    verified_purchase: Boolean(row.verified_purchase),
    fraud_score: Number(row.fraud_score ?? 0),
    status: (row.status as Review["status"]) ?? "published",
    business_response: row.business_response ? String(row.business_response) : undefined,
    helpful_yes: Number(row.helpful_count ?? 0),
    photos: Array.isArray(row.photos) ? (row.photos as string[]) : undefined,
    ymm_year: row.ymm_year != null ? Number(row.ymm_year) : undefined,
    ymm_make: row.ymm_make ? String(row.ymm_make) : undefined,
    ymm_model: row.ymm_model ? String(row.ymm_model) : undefined,
    ymm_trim: row.ymm_trim ? String(row.ymm_trim) : undefined,
    rating_fitment: row.rating_fitment != null ? Number(row.rating_fitment) : undefined,
    rating_quality: row.rating_quality != null ? Number(row.rating_quality) : undefined,
    rating_shipping: row.rating_shipping != null ? Number(row.rating_shipping) : undefined,
    rating_description: row.rating_description != null ? Number(row.rating_description) : undefined,
    rating_install: row.rating_install != null ? Number(row.rating_install) : undefined,
    created_at: String(row.created_at),
  };
}

export async function fetchMerchant(slug: string): Promise<Merchant | null> {
  try {
    const res = await fetch(`${getApiBase()}/earnedstar/merchants/${slug}`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    return (await res.json()) as Merchant;
  } catch {
    return null;
  }
}

export async function fetchPublishedReviews(slug: string, limit = 50, offset = 0): Promise<Review[]> {
  try {
    const res = await fetch(
      `${getApiBase()}/earnedstar/reviews/${slug}?limit=${limit}&offset=${offset}`,
      { next: { revalidate: 120 } },
    );
    if (!res.ok) return [];
    const rows = (await res.json()) as Record<string, unknown>[];
    return rows.map(mapReview);
  } catch {
    return [];
  }
}

export type PublicProfileSummary = {
  merchant: Merchant;
  ratingDistribution: { stars: number; count: number; pct: number }[];
  attributeAverages: {
    fitment: number;
    quality: number;
    shipping: number;
    description: number;
    install: number;
  };
};

export async function fetchPublicProfileSummary(slug: string): Promise<PublicProfileSummary | null> {
  try {
    const res = await fetch(`${getApiBase()}/earnedstar/merchants/${slug}/profile`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    return (await res.json()) as PublicProfileSummary;
  } catch {
    return null;
  }
}

export async function fetchStorePageData(slug: string) {
  const [profile, reviews, qa] = await Promise.all([
    fetchPublicProfileSummary(slug),
    fetchPublishedReviews(slug, 20, 0),
    fetchPublishedQa(slug),
  ]);
  const merchant = profile?.merchant ?? (await fetchMerchant(slug));
  return {
    merchant,
    reviews,
    qa,
    profile,
  };
}

export async function fetchDashboardOverview(
  slug = DEFAULT_DEMO_SLUG,
): Promise<DashboardOverview | null> {
  try {
    const res = await fetch(`${getApiBase()}/earnedstar/dashboard/overview?slug=${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as DashboardOverview & {
      recentReviews: Record<string, unknown>[];
    };
    return {
      ...data,
      recentReviews: data.recentReviews.map((r) =>
        mapReview(r as unknown as Record<string, unknown>),
      ),
    };
  } catch {
    return null;
  }
}

export type QaPublicItem = {
  id: string;
  question: string;
  answer: string;
  asked_by?: string;
  answered_at?: string;
};

export async function fetchPublishedQa(slug: string): Promise<QaPublicItem[]> {
  try {
    const res = await fetch(`${getApiBase()}/earnedstar/qa/public/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const rows = (await res.json()) as Record<string, unknown>[];
    return rows
      .filter((r) => r.answer)
      .map((r) => ({
        id: String(r.id),
        question: String(r.question),
        answer: String(r.answer),
        asked_by: r.asked_by ? String(r.asked_by) : undefined,
        answered_at: r.answered_at ? String(r.answered_at) : undefined,
      }));
  } catch {
    return [];
  }
}

export async function fetchMerchantReviews(slug = DEFAULT_DEMO_SLUG, limit = 100): Promise<Review[]> {
  try {
    const res = await fetch(`${getApiBase()}/earnedstar/dashboard/reviews?slug=${slug}&limit=${limit}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const rows = (await res.json()) as Record<string, unknown>[];
    return rows.map(mapReview);
  } catch {
    return [];
  }
}

export type InvitationRow = {
  id: string;
  customer_email: string;
  customer_name?: string;
  order_id: string;
  channel: string;
  status: string;
  sent_at: string;
  opened_at?: string;
  token?: string;
};

export async function fetchInvitations(slug = DEFAULT_DEMO_SLUG, limit = 50): Promise<InvitationRow[]> {
  try {
    const res = await fetch(`${getApiBase()}/earnedstar/dashboard/invitations?slug=${slug}&limit=${limit}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    return (await res.json()) as InvitationRow[];
  } catch {
    return [];
  }
}

export type InvitationLookup = {
  token: string;
  status: string;
  merchant_name: string;
  merchant_slug: string;
  order_id: string;
  customer_name?: string;
  product_name?: string;
  purchased_at?: string;
};

export type AnalyticsDashboard = {
  invitationTrend: { week: string; sent: number; completed: number }[];
  reviewVelocity: { week: string; published: number; pending: number }[];
  sentiment: { positive: number; neutral: number; negative: number };
};

export async function fetchAnalytics(slug = DEFAULT_DEMO_SLUG): Promise<AnalyticsDashboard | null> {
  try {
    const res = await fetch(`${getApiBase()}/earnedstar/dashboard/analytics?slug=${slug}`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    return (await res.json()) as AnalyticsDashboard;
  } catch {
    return null;
  }
}

export async function fetchInvitationByToken(token: string): Promise<InvitationLookup | null> {
  try {
    const res = await fetch(`${getApiBase()}/earnedstar/invitations/lookup/${encodeURIComponent(token)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as InvitationLookup;
  } catch {
    return null;
  }
}
