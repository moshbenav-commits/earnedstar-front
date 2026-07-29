/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const DEFAULT_COOLDOWN_DAYS = 90;

interface ReviewCadenceFormProps {
  initial: {
    review_request_cooldown_days?: number;
  };
}

/**
 * EarnedStar Bible Phase 4i — subscription/recurring-purchase-aware review
 * cadence. Lets a merchant configure how many days to wait before asking a
 * customer for a review of a product they already reviewed-requested,
 * even if they reorder it sooner (e.g. a recurring/subscription-style
 * repeat purchase). 0 disables the cooldown gate entirely.
 */
export function ReviewCadenceForm({ initial }: ReviewCadenceFormProps) {
  const [cooldownDays, setCooldownDays] = useState(
    initial.review_request_cooldown_days ?? DEFAULT_COOLDOWN_DAYS,
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
          review_request_cooldown_days: cooldownDays,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError((data as { message?: string }).message ?? "Save failed");
        return;
      }
      setMessage("Review request cadence saved.");
    } catch {
      setError("Save failed — try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="card-surface gold-seam max-w-2xl space-y-6 p-6">
      <div>
        <h2 className="text-lg font-bold text-navy">Review request cadence</h2>
        <p className="mt-1 text-sm text-text-muted">
          For subscription boxes and recurring-purchase customers: once a customer has been asked
          to review a product, EarnedStar won&apos;t ask again for that same product until this
          cooldown has passed — even if they reorder it sooner. This avoids review-request fatigue
          on repeat shipments while still asking again after a reasonable gap.
        </p>
      </div>

      <label className="block text-sm">
        <span className="font-semibold text-navy">Cooldown period</span>
        <div className="mt-1.5 flex items-center gap-3">
          <input
            type="number"
            min={0}
            max={730}
            step={1}
            className="w-32 rounded-lg border border-border bg-surface px-3 py-2 text-navy"
            value={cooldownDays}
            onChange={(e) => setCooldownDays(Math.max(0, Math.min(730, Number(e.target.value) || 0)))}
          />
          <span className="text-sm text-text-muted">days</span>
        </div>
        <p className="mt-1.5 text-xs text-text-faint">
          Default {DEFAULT_COOLDOWN_DAYS} days. Set to 0 to ask on every order (old behavior).
        </p>
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {message ? <p className="text-sm text-green-dark">{message}</p> : null}

      <div>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save cadence"}
        </Button>
      </div>
    </form>
  );
}
