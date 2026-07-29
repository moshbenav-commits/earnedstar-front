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
 *
 * UTM-tagged by default (plan §6 Phase 1 item 5 — "attributable waitlist signups" is the
 * only honest funnel metric until suite billing exists, per plan §3c/§6). Every nudge gets
 * utm_content=<id> automatically so click-through is attributable per-nudge without each
 * call site having to remember to tag its own link.
 */
function withUtm(href: string, nudgeId: string): string {
  try {
    const url = new URL(href);
    url.searchParams.set("utm_source", "earnedstar");
    url.searchParams.set("utm_medium", "nudge");
    url.searchParams.set("utm_campaign", "cross-sell");
    url.searchParams.set("utm_content", nudgeId);
    return url.toString();
  } catch {
    return href; // malformed href — fail open to the plain link rather than throw in render
  }
}

export function CreytixCrossSellNudge({
  id,
  message,
  href = "https://creytix.com/pricing",
  linkLabel = "See what's included →",
}: Props) {
  const [visible, setVisible] = useState(false);
  const enabled = crossSellNudgesEnabled();
  const storageKey = `${STORAGE_PREFIX}${id}-dismissed`;
  const taggedHref = withUtm(href, id);

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
          href={taggedHref}
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
