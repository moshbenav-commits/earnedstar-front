/** Site Forge Phase 20 — legal wire SSOT (mirrors brand/earnedstar/FORGE_LEGAL_WIRE.json) */
export const LEGAL_CONFIG = {
  siteName: "EarnedStar",
  domain: "https://earnedstar.com",
  contactEmail: "legal@earnedstar.com",
  effectiveDate: "2026-06-30",
  /** Set false after counsel SME sign-off */
  counselReviewPending: true,
} as const;

export const LEGAL_FOOTER_LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/accessibility", label: "Accessibility" },
] as const;
