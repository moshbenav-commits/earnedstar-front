/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const DEFAULT_B2B_DELAY_DAYS = 30;

interface B2bSettingsFormProps {
  initial: {
    b2b_mode_enabled?: boolean;
    b2b_default_delay_days?: number;
  };
}

/**
 * EarnedStar Bible Phase 4i — B2B/wholesale review collection. Off by
 * default; DTC review-request behavior is unaffected until a merchant
 * opts in here. When enabled, orders/invitations tagged account_type='b2b'
 * (e.g. from an ERP/PO-based integration) are routed to the purchasing
 * contact on the order instead of a generic order email, requested per-PO
 * rather than per order line, and given this longer default delay to match
 * Net-30-style purchasing cycles instead of the DTC delivery-based window.
 */
export function B2bSettingsForm({ initial }: B2bSettingsFormProps) {
  const [enabled, setEnabled] = useState(initial.b2b_mode_enabled ?? false);
  const [delayDays, setDelayDays] = useState(
    initial.b2b_default_delay_days ?? DEFAULT_B2B_DELAY_DAYS,
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
          b2b_mode_enabled: enabled,
          b2b_default_delay_days: delayDays,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError((data as { message?: string }).message ?? "Save failed");
        return;
      }
      setMessage("B2B/wholesale settings saved.");
    } catch {
      setError("Save failed — try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="card-surface gold-seam max-w-2xl space-y-6 p-6">
      <div>
        <h2 className="text-lg font-bold text-navy">B2B / wholesale review collection</h2>
        <p className="mt-1 text-sm text-text-muted">
          For merchants selling to multi-buyer wholesale accounts on PO-based purchasing rather
          than single-consumer checkout: orders tagged as B2B route the review request to the
          purchasing contact on file, wait for a full PO cycle before asking, and request once per
          PO instead of once per order line.
        </p>
      </div>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        <span className="font-semibold text-navy">Enable B2B/wholesale handling</span>
      </label>

      <label className="block text-sm">
        <span className="font-semibold text-navy">Default delay before requesting a review</span>
        <div className="mt-1.5 flex items-center gap-3">
          <input
            type="number"
            min={0}
            max={120}
            step={1}
            disabled={!enabled}
            className="w-32 rounded-lg border border-border bg-surface px-3 py-2 text-navy disabled:opacity-50"
            value={delayDays}
            onChange={(e) => setDelayDays(Math.max(0, Math.min(120, Number(e.target.value) || 0)))}
          />
          <span className="text-sm text-text-muted">days after fulfillment</span>
        </div>
        <p className="mt-1.5 text-xs text-text-faint">
          Default {DEFAULT_B2B_DELAY_DAYS} days (Net-30 purchasing cycle norm) — longer than the
          DTC delivery-based delay, since a wholesale buyer typically needs time to receive, use,
          and reconcile the PO before a review request is meaningful.
        </p>
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {message ? <p className="text-sm text-green-dark">{message}</p> : null}

      <div>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save B2B settings"}
        </Button>
      </div>
    </form>
  );
}
