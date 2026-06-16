import { getApiBase } from "@/lib/api";
import { authHeaders } from "@/lib/auth-server";

export type DashboardMerchant = {
  id: string;
  name: string;
  slug: string;
  plan: string;
  logo_url: string | null;
  website_url: string | null;
  review_count: number;
  avg_rating: number;
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

  const res = await fetch(`${getApiBase()}/earnedstar/merchants/expediaparts`, {
    next: { revalidate: 60 },
  });
  if (res.ok) {
    return (await res.json()) as DashboardMerchant;
  }

  return {
    id: "fallback",
    name: "ExpediaParts",
    slug: "expediaparts",
    plan: "growth",
    logo_url: null,
    website_url: "https://www.expediaparts.com",
    review_count: 2847,
    avg_rating: 4.9,
  };
}
