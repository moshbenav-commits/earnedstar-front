/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
/**
 * Resolves which subscription billing provider is active for EarnedStar.
 * Authorize.net ARB stays the default — Stripe only activates when its
 * publishable key is set (or NEXT_PUBLIC_BILLING_PROVIDER explicitly says so).
 *
 * docs/fleet/PAYMENTS_ACTIVATION.md § EarnedStar Stripe path (added 2026-07-09)
 */
export type BillingProvider = "stripe" | "authorize_net";

function isLikelyRealKey(value: string | undefined): boolean {
  if (!value) return false;
  const v = value.trim();
  if (!v || v.length < 12) return false;
  if (v.includes("YOUR-") || v.includes("REPLACE_ME") || v.includes("xxxx")) return false;
  return true;
}

export function resolveBillingProvider(env: NodeJS.ProcessEnv = process.env): BillingProvider {
  const override = env.NEXT_PUBLIC_BILLING_PROVIDER?.trim().toLowerCase();
  if (override === "stripe" || override === "authorize_net") return override;

  if (isLikelyRealKey(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)) return "stripe";

  return "authorize_net";
}
