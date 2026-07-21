/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { getAllArticles } from "@/lib/blog/loader";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://earnedstar.com";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  // Draft previews are a local authoring convenience. A feed is a syndication
  // surface, so unapproved drafts are excluded here even in development.
  const articles = getAllArticles().filter((article) => !article.isDraftPreview);

  const items = articles
    .map(
      (article) => `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${SITE_URL}/blog/${article.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${article.slug}</guid>
      <description>${escapeXml(article.description)}</description>
      <category>${escapeXml(article.category)}</category>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>EarnedStar — Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Notes on collecting honest reviews and building buyer trust.</description>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
