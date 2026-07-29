/**
 * Feature flags — plan §3b.3 EarnedStar milestone nudges (Phase 1 item 3,
 * docs/creytix/CREYTIX_WEBSITE_MARKETING_FUNNEL_PLAN_2026-07-29.md).
 * Mirrors the env-var-gated pattern already used by `payments-enabled.ts`
 * (no dedicated feature-flag system exists in earnedstar-front/-back — grepped
 * both repos for FEATURE_FLAG/featureFlag/FLAGS and found none, so this
 * matches the closest existing convention instead of inventing a new one).
 * Defaults OFF. Flipping it on in production is a deploy (Gate G4).
 */

function parseFlag(raw: string | undefined): boolean {
  if (!raw) return false;
  const v = raw.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

/** Gates the EarnedStar → Creytix suite milestone nudges. Default: OFF. */
export function crossSellNudgesEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  const publicFlag = env.NEXT_PUBLIC_CREYTIX_CROSS_SELL_NUDGES;
  const serverFlag = env.CREYTIX_CROSS_SELL_NUDGES;
  return parseFlag(publicFlag) || parseFlag(serverFlag);
}
