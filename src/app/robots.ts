/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://earnedstar.com";

const PRIVATE_PATHS = ["/dashboard/", "/submit/", "/api/"];

/**
 * AI crawlers — explicitly welcomed on the public site (Ricardo 2026-09-07:
 * "we do want the chatgpt bots crawling"). Same list the EP storefronts use
 * (expedia-parts-front/src/app/robots.ts). Silence is not permission to a
 * crawler that checks for its own token, and Cloudflare's managed robots.txt
 * block — which used to Disallow all of these here — was turned off the same
 * day, so this file is now the only thing that answers them.
 */
const AI_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "PerplexityBot",
  "Bytespider",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/reviews/"],
        disallow: PRIVATE_PATHS,
      },
      ...AI_AGENTS.map((userAgent) => ({
        userAgent,
        allow: ["/", "/reviews/"],
        disallow: PRIVATE_PATHS,
      })),
    ],
    sitemap: `${siteUrl.replace(/\/$/, "")}/sitemap.xml`,
  };
}
