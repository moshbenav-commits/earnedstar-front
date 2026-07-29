/**
 * Pricing-page "Included Creytix tools" disclosure block.
 * Spec: docs/creytix/CREYTIX_WEBSITE_MARKETING_FUNNEL_PLAN_2026-07-29.md §3b.2,
 * Phase 1 item 1 (Stage 2e "shared, reusable piece other sites' pricing pages
 * import, not a one-off per site").
 *
 * Sibling of `PartneredWithCreytixView`: same package, same "no Next imports,
 * plain component" contract, so it can be dropped into any consuming site's
 * pricing page (EarnedStar first, per the plan's Phase 1 build order).
 *
 * Pricing note: Gate G1 is RESOLVED (2026-07-29) — $30/mo is the real,
 * Ricardo-confirmed price (`packages/creytix-billing/src/config.ts`:
 * "$30.00/month. Ricardo-confirmed self-serve price (2026-07-26)", the SSOT
 * behind the live creytix.com/pricing page). The $79/mo figure some docs
 * floated came from a stray, never-merged commit sitting on an unrelated
 * fleet-backup branch with no corroborating approval — not a real decision.
 * `suite` defaults to the confirmed `SUITE_PRICING_CONFIRMED` below.
 * `SUITE_PRICING_TBD` is kept for any future re-pricing round where a number
 * is genuinely undecided again — it is no longer the default.
 */

export type SuitePricingConfig = {
  /** Display price string, e.g. "$30/mo" — only ever a real, Ricardo-approved number. */
  price: string;
  /** Suite pricing / waitlist URL. */
  href: string;
  /** False = `price` is a placeholder, not an approved number. */
  isFinal: boolean;
};

/** Real, confirmed price — SSOT: packages/creytix-billing/src/config.ts. */
export const SUITE_PRICING_CONFIRMED: SuitePricingConfig = {
  price: "$30/mo",
  href: "https://creytix.com/pricing",
  isFinal: true,
};

/** Explicit TBD placeholder — for a future re-pricing round, not the current default. */
export const SUITE_PRICING_TBD: SuitePricingConfig = {
  price: "TBD",
  href: "https://creytix.com/pricing",
  isFinal: false,
};

export type IncludedCreytixToolsDisclosureProps = {
  /**
   * Named Creytix tools/capabilities this plan already depends on — same shape
   * as `PartnerEntry.capabilities` in `./portfolio`, e.g. pulled from
   * `getPartnerEntry("earnedstar").capabilities` or hand-picked per plan tier.
   */
  tools: string[];
  /** Suite price/link config. Defaults to the confirmed $30/mo price — see module doc. */
  suite?: SuitePricingConfig;
  /**
   * The consuming site's partner-kit slug (e.g. "earnedstar", "gotianguis") —
   * tags the suite link so click-through is attributable per-site (plan §6
   * Phase 1 item 5: "UTM-tagged links from every nudge/disclosure surface").
   * Omit only for a preview/storybook render with no real site context.
   */
  siteId?: string;
  surface?: "dark" | "light";
  className?: string;
};

function withUtm(href: string, siteId: string | undefined): string {
  if (!siteId) return href;
  try {
    const url = new URL(href);
    url.searchParams.set("utm_source", siteId);
    url.searchParams.set("utm_medium", "disclosure-block");
    url.searchParams.set("utm_campaign", "cross-sell");
    return url.toString();
  } catch {
    return href; // malformed href — fail open to the plain link rather than throw in render
  }
}

/**
 * Renders (a) an "Includes: …" line naming the specific Creytix tools a plan
 * already depends on, and (b) one ladder row pointing at the full suite.
 * Returns null when `tools` is empty — nothing to disclose.
 */
export function IncludedCreytixToolsDisclosure({
  tools,
  suite = SUITE_PRICING_CONFIRMED,
  siteId,
  surface = "light",
  className = "",
}: IncludedCreytixToolsDisclosureProps) {
  if (!tools.length) return null;
  const dark = surface === "dark";
  const taggedHref = withUtm(suite.href, siteId);

  return (
    <div
      className={[
        "mt-4 rounded-lg border p-4 text-sm",
        dark ? "border-white/15 bg-white/5 text-white/70" : "border-black/10 bg-black/[0.02] text-black/60",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-surface={surface}
    >
      <p className={dark ? "text-white/90" : "text-black/80"}>
        <span className="font-semibold">Includes:</span> {tools.join(", ")}
      </p>
      <p className="mt-2">
        Every plan runs on Creytix. The full suite — every tool, every product — is one flat
        subscription{suite.isFinal ? ` (${suite.price})` : " (price TBD)"}.{" "}
        <a
          href={taggedHref}
          className={[
            "font-semibold underline underline-offset-2",
            dark ? "text-white" : "text-[#0B1220]",
          ].join(" ")}
        >
          → creytix.com/pricing
        </a>
      </p>
    </div>
  );
}
