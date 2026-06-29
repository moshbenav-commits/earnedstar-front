/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { PlanId } from "@/lib/plans";
import { PLAN_LABELS } from "@/lib/plans";
import { paymentsEnabled } from "@/lib/payments-enabled";

type AuthNetConfig = {
  apiLoginId: string;
  publicClientKey: string;
  env: "sandbox" | "production";
};

declare global {
  interface Window {
    Accept?: {
      dispatchData: (
        secureData: {
          authData: { clientKey: string; apiLoginID: string };
          cardData: { cardNumber: string; month: string; year: string; cardCode: string };
        },
        handler: (r: {
          opaqueData?: { dataDescriptor: string; dataValue: string };
          messages?: { resultCode?: string; message?: Array<{ text?: string }> };
        }) => void,
      ) => void;
    };
  }
}

export function BillingSubscribeForm({ currentPlan }: { currentPlan: PlanId }) {
  const livePayments = paymentsEnabled();
  const [config, setConfig] = useState<AuthNetConfig | null>(null);
  const [plan, setPlan] = useState<PlanId>(currentPlan);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/earnedstar/billing/public-config")
      .then((r) => r.json())
      .then((data) => {
        if (data.apiLoginId) setConfig(data as AuthNetConfig);
      })
      .catch(() => undefined);
  }, []);

  async function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!livePayments) {
      setMessage("Payment processing is not active yet. Contact sales to subscribe.");
      return;
    }
    setMessage(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") ?? "");
    const cardNumber = String(fd.get("cardNumber") ?? "").replace(/\s/g, "");
    const exp = String(fd.get("exp") ?? "");
    const cvv = String(fd.get("cvv") ?? "");
    const [month, year] = exp.split("/").map((s) => s.trim());

    if (!config) {
      setMessage("Authorize.net is not configured. Set AUTHNET keys on earnedstar-back.");
      return;
    }

    setLoading(true);
    try {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src =
          config.env === "sandbox"
            ? "https://jstest.authorize.net/v1/Accept.js"
            : "https://js.authorize.net/v1/Accept.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Accept.js"));
        if (!document.querySelector(`script[src="${script.src}"]`)) {
          document.body.appendChild(script);
        } else {
          resolve();
        }
      });

      const opaque = await new Promise<{ dataDescriptor: string; dataValue: string }>((resolve, reject) => {
        window.Accept?.dispatchData(
          {
            authData: { clientKey: config.publicClientKey, apiLoginID: config.apiLoginId },
            cardData: { cardNumber, month, year: year.length === 2 ? `20${year}` : year, cardCode: cvv },
          },
          (response) => {
            if (response.opaqueData) resolve(response.opaqueData);
            else reject(new Error(response.messages?.message?.[0]?.text ?? "Card tokenization failed"));
          },
        );
      });

      const res = await fetch("/api/earnedstar/billing/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          customer_email: email,
          dataDescriptor: opaque.dataDescriptor,
          dataValue: opaque.dataValue,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error((data as { message?: string }).message ?? "Subscription failed");
      setMessage(`Subscribed to ${PLAN_LABELS[plan]} — ARB ${(data as { subscriptionId?: string }).subscriptionId ?? "active"}`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Billing error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card-surface gold-seam max-w-2xl p-6">
      <h2 className="text-lg font-bold text-navy">Billing — Authorize.net</h2>
      <p className="mt-1 text-sm text-text-muted">
        {livePayments
          ? "ARB subscription per AI_EARNEDSTAR_SPEC (ES-AC-09). No Stripe."
          : "Payments not yet active — subscription billing opens when merchant keys are live."}
      </p>
      {!livePayments ? (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950" role="status">
          Enrollment / checkout coming soon — contact us to register for early access.
        </p>
      ) : null}
      <form onSubmit={handleSubscribe} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-navy">
          Plan
          <select
            name="plan"
            value={plan}
            onChange={(e) => setPlan(e.target.value as PlanId)}
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          >
            {(Object.keys(PLAN_LABELS) as PlanId[]).map((id) => (
              <option key={id} value={id}>
                {PLAN_LABELS[id]}
              </option>
            ))}
          </select>
        </label>
        <input name="email" type="email" required placeholder="Billing email" disabled={!livePayments} className="w-full rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-60" />
        <input name="cardNumber" required placeholder="Card number" disabled={!livePayments} className="w-full rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-60" />
        <div className="grid grid-cols-2 gap-3">
          <input name="exp" required placeholder="MM/YY" disabled={!livePayments} className="rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-60" />
          <input name="cvv" required placeholder="CVV" disabled={!livePayments} className="rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-60" />
        </div>
        <Button type="submit" disabled={loading || !livePayments}>{loading ? "Processing…" : livePayments ? "Subscribe" : "Billing coming soon"}</Button>
      </form>
      {message ? <p className="mt-4 text-sm text-text-muted">{message}</p> : null}
    </section>
  );
}
