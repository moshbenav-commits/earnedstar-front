/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import type { LucideIcon } from "lucide-react";
import { FileText, Lock, Scale, Shield } from "lucide-react";

export const MESHY = {
  heroBadge: "/marketing/es-hero-badge.png",
  heroWordmark: "/marketing/es002-nano-banana.png",
  heroMotto: "/marketing/es003-nano-banana.png",
  brandSystem: "/marketing/es004-nano-banana.png",
  awardBadge: "/marketing/es005-nano-banana.png",
  verifiedHuman: "/marketing/es006-nano-banana.png",
  ratingBadge: "/marketing/es007-nano-banana.png",
  /** ES010 — pricing page hero */
  pricingHero: "/marketing/es-pricing-hero.png",
  /** ES011 — dashboard empty state */
  dashboardEmptyState: "/marketing/es-dashboard-empty-state.png",
} as const;

export const TRUST_COUNTERS = [
  { label: "Verified reviews", value: 47200, suffix: "", sub: "live ledger" },
  { label: "Fraud attempts blocked", value: 1847, suffix: "", sub: "this month" },
  { label: "Avg. dispute SLA", value: 18, suffix: "h", sub: "Trustpilot: 7–14 days" },
  { label: "Reviews ransomed", value: 0, suffix: "", sub: "your data, forever" },
] as const;

export const PRESS_LOGOS = [
  "TechCrunch",
  "Modern Retail",
  "The Hustle",
  "Retail Dive",
  "Shopify",
  "Practical Ecommerce",
  "Inc.",
  "Bloomberg",
] as const;

export const MANIFESTO_PROMISES: {
  num: string;
  icon: LucideIcon;
  title: string;
  body: string;
}[] = [
  {
    num: "I",
    icon: Shield,
    title: "Verified",
    body: "Every review tied to a real, fulfilled order. Never an open form. Never an exception.",
  },
  {
    num: "II",
    icon: FileText,
    title: "Auditable",
    body: "Every star ships with a public Trust Receipt. Order hash, identity tier, fraud signals — all readable by anyone.",
  },
  {
    num: "III",
    icon: Lock,
    title: "Portable",
    body: "Your reviews are your data. One-click export to JSON-LD or CSV. They survive your cancellation. Forever.",
  },
  {
    num: "IV",
    icon: Scale,
    title: "Fair",
    body: "Flat pricing. Multi-domain included. No pay-to-protect schemes. Negative reviews never bought, never buried.",
  },
];

export type CompareCell = boolean | string;

export const COMPARE_ROWS: [string, CompareCell, CompareCell, CompareCell, CompareCell][] = [
  ["Verified-by-purchase only", true, false, "partial", false],
  ["Public Trust Receipt", true, false, false, false],
  ["Public Moderation Ledger", true, false, false, false],
  ["24h dispute SLA, public counter", true, false, false, false],
  ["AI Smart-Reply on entry plan", true, "enterprise", "premium", false],
  ["Native email + SMS", true, false, "discontinued 2025", false],
  ["Multi-domain on one plan", true, "per-domain", false, false],
  ["Portable reviews — yours forever", true, false, false, false],
  ["Flat pricing, no annual lock-in", true, false, "volume-based", "limited"],
  ["Starts at", "Free / $29", "$199", "$79", "Free / $15"],
];
