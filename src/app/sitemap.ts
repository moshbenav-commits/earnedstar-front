/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import type { MetadataRoute } from "next";
import { getApiBase } from "@/lib/api";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://earnedstar.com").replace(/\/$/, "");

type SitemapMerchant = { slug: string; lastModified: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  let merchants: SitemapMerchant[] = [];
  try {
    const res = await fetch(`${getApiBase()}/earnedstar/seo/sitemap-merchants`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      merchants = (await res.json()) as SitemapMerchant[];
    }
  } catch {
    /* API unavailable at build — static home only */
  }

  const profileEntries: MetadataRoute.Sitemap = merchants.map((m) => ({
    url: `${siteUrl}/reviews/${m.slug}`,
    lastModified: new Date(m.lastModified),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  return [...staticEntries, ...profileEntries];
}
