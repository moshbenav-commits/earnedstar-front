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
  };
}
