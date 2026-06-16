import type { Review } from "@/types/review";
import type { Merchant } from "@/types/review";

const API =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "https://earnedstar-back.vercel.app/api";

const MERCHANT_SLUG = "expediaparts";

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

function mapReview(row: Record<string, unknown>): Review {
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
    created_at: String(row.created_at),
  };
}

export async function fetchMerchant(slug: string): Promise<Merchant | null> {
  try {
    const res = await fetch(`${API}/earnedstar/merchants/${slug}`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    return (await res.json()) as Merchant;
  } catch {
    return null;
  }
}

export async function fetchPublishedReviews(slug: string, limit = 50): Promise<Review[]> {
  try {
    const res = await fetch(`${API}/earnedstar/reviews/${slug}?limit=${limit}`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return [];
    const rows = (await res.json()) as Record<string, unknown>[];
    return rows.map(mapReview);
  } catch {
    return [];
  }
}

export async function fetchDashboardOverview(
  slug = MERCHANT_SLUG,
): Promise<DashboardOverview | null> {
  try {
    const res = await fetch(`${API}/earnedstar/dashboard/overview?slug=${slug}`, {
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

export async function fetchStorePageData(slug: string) {
  const [merchant, reviews] = await Promise.all([
    fetchMerchant(slug),
    fetchPublishedReviews(slug, 100),
  ]);
  return { merchant, reviews };
}
