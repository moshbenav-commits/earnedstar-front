/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { paymentsEnabled } from "@/lib/payments-enabled";

/**
 * Stripe Checkout — parallel path to BillingSubscribeForm (Authorize.net ARB).
 * Rendered instead of the ARB form when resolveBillingProvider() === "stripe"
 * (see src/lib/payments/billing-provider.ts). Redirects to a Stripe-hosted
 * Checkout Session created by earnedstar-back; no card fields live here.
 */
export function StripeSubscribeButton({ currentPlan }: { currentPlan: string }) {
  const livePayments = paymentsEnabled();
  const [plan, setPlan] = useState(currentPlan);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubscribe() {
    if (!livePayments) {
      setMessage("Payment processing is not active yet. Contact sales to subscribe.");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/earnedstar/billing/stripe/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error((data as { message?: string }).message ?? "Checkout session failed");
      const url = (data as { url?: string }).url;
      if (!url) throw new Error("Stripe did not return a checkout URL");
      window.location.href = url;
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Billing error");
      setLoading(false);
    }
  }

  return (
    <section className="card-surface gold-seam max-w-2xl p-6">
      <h2 className="text-lg font-bold text-navy">Billing — Stripe</h2>
      <p className="mt-1 text-sm text-text-muted">
        {livePayments
          ? "Subscribe via Stripe Checkout — you'll be redirected to a secure Stripe-hosted page."
          : "Payments not yet active — subscription billing opens when Stripe keys are live."}
      </p>
      {!livePayments ? (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950" role="status">
          Enrollment / checkout coming soon — contact us to register for early access.
        </p>
      ) : null}
      <div className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-navy">
          Plan
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            disabled={!livePayments}
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm disabled:opacity-60"
          >
            <option value="starter">Starter</option>
            <option value="growth">Growth</option>
            <option value="pro">Pro</option>
            <option value="agency">Agency</option>
          </select>
        </label>
        <Button type="button" onClick={handleSubscribe} disabled={loading || !livePayments}>
          {loading ? "Redirecting…" : livePayments ? "Subscribe with Stripe" : "Billing coming soon"}
        </Button>
      </div>
      {message ? <p className="mt-4 text-sm text-text-muted">{message}</p> : null}
    </section>
  );
}
