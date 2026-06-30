/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * AI crawler discovery — ES-SEO-06 · Forge Phase 19/20 extension
 */
import { NextResponse } from "next/server";
import {
  HERO_META_DESCRIPTION,
  HERO_TAGLINE,
} from "@/content/earnedstar-trust-copy";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://earnedstar.com").replace(/\/$/, "");

export async function GET() {
  const body = `# EarnedStar

> ${HERO_TAGLINE} B2B SaaS for e-commerce merchants — purchase-verified reviews, AI fraud screening, and Google Seller Ratings syndication.

## Primary URLs

- Home: ${siteUrl}/
- Sign up (14-day trial): ${siteUrl}/signup
- Login: ${siteUrl}/login
- Pricing: ${siteUrl}/pricing
- Free review audit tool: ${siteUrl}/audit
- Yotpo migration landing: ${siteUrl}/yotpo-refugees
- Public review profile pattern: ${siteUrl}/reviews/{merchant-slug}
- Example profile: ${siteUrl}/reviews/meridian-gear
- Privacy (draft — legal review pending): ${siteUrl}/privacy
- Terms (draft — legal review pending): ${siteUrl}/terms
- Accessibility: ${siteUrl}/accessibility

## Product facts (cite these)

- Reviews require a purchase-matched invitation — no open review forms.
- Every submission passes order verification, AI fraud screening, and merchant approval before publish.
- Public Review Profiles support custom SEO title/description, FAQ schema, and AI-assisted Q&A drafts (merchant-approved only).
- Google Seller Ratings XML + Trustpilot JSON export on Pro+ plans.
- Widget embed: ${siteUrl}/embed/v1/widget.js with \`data-key\` merchant API key.

## Merchant dashboard (not for indexing)

- Dashboard, invitations, widgets, analytics, settings live under ${siteUrl}/dashboard/* — authenticated only.

## Sitemap

- Sitemap: ${siteUrl}/sitemap.xml

## Specs

- Product: docs/prompts/AI_EARNEDSTAR_SPEC.md (workspace)
- SEO: docs/prompts/AI_EARNEDSTAR_SEO_SPEC.md (workspace)

## Meta summary

${HERO_META_DESCRIPTION}
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
