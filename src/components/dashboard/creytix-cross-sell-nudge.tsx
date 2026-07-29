/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { crossSellNudgesEnabled } from "@/lib/feature-flags";

const STORAGE_PREFIX = "earnedstar-creytix-nudge-";

type Props = {
  /** Unique per-nudge id — used as the localStorage dismissal key. */
  id: string;
  /** The nudge copy. Names the specific thing the merchant just did (plan §3b principle). */
  message: string;
  href?: string;
  linkLabel?: string;
};

/**
 * Milestone nudge card — plan §3b.3, EarnedStar Phase 1 item 3
 * (docs/creytix/CREYTIX_WEBSITE_MARKETING_FUNNEL_PLAN_2026-07-29.md).
 * Fires on a milestone the merchant just completed, never on a timer.
 * "One dismissal is permanent for that nudge" — persisted in localStorage,
 * same mechanism as `EarnedStarTrustBanner`. Gated OFF by default behind
 * `crossSellNudgesEnabled()` (see `@/lib/feature-flags`); flipping it on in
 * production is a deploy (Gate G4 in the plan).
 */
export function CreytixCrossSellNudge({
  id,
  message,
  href = "https://creytix.com/pricing",
  linkLabel = "See what's included →",
}: Props) {
  const [visible, setVisible] = useState(false);
  const enabled = crossSellNudgesEnabled();
  const storageKey = `${STORAGE_PREFIX}${id}-dismissed`;

  useEffect(() => {
    if (!enabled) return;
    try {
      setVisible(localStorage.getItem(storageKey) !== "1");
    } catch {
      setVisible(true);
    }
  }, [enabled, storageKey]);

  if (!enabled || !visible) return null;

  function dismiss() {
    try {
      localStorage.setItem(storageKey, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  return (
    <div className="mt-4 flex items-start justify-between gap-3 rounded-lg border border-gold/30 bg-gold-pale/20 p-3 text-sm text-navy">
      <p className="flex-1">
        {message}{" "}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-2"
        >
          {linkLabel}
        </a>
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 rounded p-0.5 text-text-faint transition hover:text-navy"
      >
        <X size={16} />
      </button>
    </div>
  );
}
