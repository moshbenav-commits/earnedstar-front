/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const DEFAULT_POINTS_PER_REVIEW = 10;
const DEFAULT_POINTS_PER_REFERRAL = 50;

interface LoyaltySettingsFormProps {
  initial: {
    points_per_review?: number;
    points_per_referral?: number;
  };
}

/**
 * EarnedStar Bible Phase 4h — loyalty/referral competitor-parity bundle.
 * Lets a merchant configure how many points a customer earns for a published
 * review, and how many points a referrer earns when their referral converts.
 * 0 disables that award entirely. Points are accrual-only in v1 — there's no
 * redemption/spending mechanism yet (v2); this just controls how fast the
 * ledger fills up. See the Loyalty & Referrals dashboard page for the ledger.
 */
export function LoyaltySettingsForm({ initial }: LoyaltySettingsFormProps) {
  const [pointsPerReview, setPointsPerReview] = useState(
    initial.points_per_review ?? DEFAULT_POINTS_PER_REVIEW,
  );
  const [pointsPerReferral, setPointsPerReferral] = useState(
    initial.points_per_referral ?? DEFAULT_POINTS_PER_REFERRAL,
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/earnedstar/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          points_per_review: pointsPerReview,
          points_per_referral: pointsPerReferral,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError((data as { message?: string }).message ?? "Save failed");
        return;
      }
      setMessage("Loyalty point amounts saved.");
    } catch {
      setError("Save failed — try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="card-surface gold-seam max-w-2xl space-y-6 p-6">
      <div>
        <h2 className="text-lg font-bold text-navy">Loyalty points</h2>
        <p className="mt-1 text-sm text-text-muted">
          Award loyalty points automatically when a customer&apos;s review is published, and when a
          referral they made converts into an order. Points accrue on a running ledger — see{" "}
          <a href="/dashboard/loyalty" className="text-navy-light hover:text-gold">
            Loyalty &amp; Referrals
          </a>{" "}
          for the leaderboard. Redemption/spending isn&apos;t available yet.
        </p>
      </div>

      <label className="block text-sm">
        <span className="font-semibold text-navy">Points per published review</span>
        <div className="mt-1.5 flex items-center gap-3">
          <input
            type="number"
            min={0}
            max={100000}
            step={1}
            className="w-32 rounded-lg border border-border bg-surface px-3 py-2 text-navy"
            value={pointsPerReview}
            onChange={(e) => setPointsPerReview(Math.max(0, Math.min(100000, Number(e.target.value) || 0)))}
          />
          <span className="text-sm text-text-muted">points</span>
        </div>
        <p className="mt-1.5 text-xs text-text-faint">Default {DEFAULT_POINTS_PER_REVIEW}. Set to 0 to disable.</p>
      </label>

      <label className="block text-sm">
        <span className="font-semibold text-navy">Points per successful referral</span>
        <div className="mt-1.5 flex items-center gap-3">
          <input
            type="number"
            min={0}
            max={100000}
            step={1}
            className="w-32 rounded-lg border border-border bg-surface px-3 py-2 text-navy"
            value={pointsPerReferral}
            onChange={(e) => setPointsPerReferral(Math.max(0, Math.min(100000, Number(e.target.value) || 0)))}
          />
          <span className="text-sm text-text-muted">points</span>
        </div>
        <p className="mt-1.5 text-xs text-text-faint">
          Default {DEFAULT_POINTS_PER_REFERRAL}. Awarded to the referrer when the referred customer&apos;s
          first order is fulfilled. Set to 0 to disable.
        </p>
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {message ? <p className="text-sm text-green-dark">{message}</p> : null}

      <div>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save points"}
        </Button>
      </div>
    </form>
  );
}
