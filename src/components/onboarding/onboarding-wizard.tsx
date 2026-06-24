/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { EarnedStarLogo } from "@/components/brand/earnedstar-logo";
import { Button } from "@/components/ui/button";
import { TRUST_ONBOARDING_BLURB } from "@/content/earnedstar-trust-copy";

const PLATFORMS = ["Shopify", "WooCommerce", "Magento", "BigCommerce", "Custom API"] as const;
const DELAYS = [3, 5, 7, 14] as const;

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [businessName, setBusinessName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [industry, setIndustry] = useState("Auto Parts");
  const [platform, setPlatform] = useState<(typeof PLATFORMS)[number]>("Shopify");
  const [fromName, setFromName] = useState("");
  const [subject, setSubject] = useState("How was your order from {business}?");
  const [delayDays, setDelayDays] = useState<(typeof DELAYS)[number]>(7);
  const [saving, setSaving] = useState(false);

  async function finish() {
    setSaving(true);
    try {
      await fetch("/api/earnedstar/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_name: businessName,
          website_url: websiteUrl,
          industry,
          platform,
          email_from_name: fromName || `The ${businessName} Team`,
          email_subject_template: subject,
          invite_delay_days: delayDays,
        }),
      });
      router.push("/dashboard");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  const progress = ((step + 1) / 5) * 100;

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-surface px-6 py-4">
        <EarnedStarLogo size={28} />
      </header>
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-8 h-2 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full bg-gold transition-all" style={{ width: `${progress}%` }} />
        </div>

        {step === 0 && (
          <section className="card-surface gold-seam p-8">
            <h1 className="text-2xl font-bold text-navy">Name your business</h1>
            <p className="mt-2 text-sm text-text-muted">{TRUST_ONBOARDING_BLURB}</p>
            <p className="mt-2 text-xs text-text-faint">About 3 minutes — you&apos;ll be ready to send invitations.</p>
            <div className="mt-6 space-y-4">
              <input
                placeholder="Business name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
              <input
                placeholder="Website URL"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
              <input
                placeholder="Industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlatform(p)}
                    className={
                      platform === p
                        ? "rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white"
                        : "rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted"
                    }
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <Button className="mt-8" disabled={!businessName.trim()} onClick={() => setStep(1)}>
              Continue →
            </Button>
          </section>
        )}

        {step === 1 && (
          <section className="card-surface p-8">
            <h1 className="text-2xl font-bold text-navy">Connect your store</h1>
            <p className="mt-2 text-sm text-text-muted">Orders trigger review invitations automatically.</p>
            <div className="mt-6 space-y-4 text-sm text-text-muted">
              <p>
                <strong className="text-navy">Shopify:</strong> go to{" "}
                <a href="/dashboard/integrations" className="text-navy-light underline">
                  Integrations
                </a>{" "}
                after setup.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-bg-elevated p-3 text-xs">
                {`POST https://earnedstar-back.vercel.app/api/earnedstar/webhooks/order-fulfilled
Header: x-earnedstar-secret: YOUR_SECRET
Body: { "order_id", "customer_email", "merchant_slug" }`}
              </pre>
            </div>
            <div className="mt-8 flex gap-3">
              <Button variant="ghost" onClick={() => setStep(0)}>Back</Button>
              <Button onClick={() => setStep(2)}>My store is connected →</Button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="card-surface p-8">
            <h1 className="text-2xl font-bold text-navy">Customize invitation email</h1>
            <div className="mt-6 space-y-4">
              <input
                placeholder="From name"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
              <input
                placeholder="Subject line"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
              <div className="flex flex-wrap gap-2">
                {DELAYS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDelayDays(d)}
                    className={
                      delayDays === d
                        ? "rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white"
                        : "rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted"
                    }
                  >
                    {d} days
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Save & continue →</Button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="card-surface p-8">
            <h1 className="text-2xl font-bold text-navy">Google schema & fraud detection</h1>
            <p className="mt-2 text-sm text-text-muted">
              Your Review Profile at{" "}
              <code className="text-xs">earnedstar.com/store/[slug]</code> ships with JSON-LD for Google Seller Ratings.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-text-muted">
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green" /> Verified by Purchase on every review</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green" /> AI Fraud Detection active</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green" /> Rich snippets on publish</li>
            </ul>
            <div className="mt-8 flex gap-3">
              <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={() => setStep(4)}>Continue →</Button>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="card-surface gold-seam p-8 text-center">
            <h1 className="text-2xl font-bold text-navy">EarnedStar is live for your store</h1>
            <p className="mt-2 text-sm text-text-muted">
              Invitations send {delayDays} days after fulfilled orders once your store is connected.
            </p>
            <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm text-text-muted">
              {["Store profile ready", "Email template saved", "Google schema active", "AI fraud detection ON"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green" /> {t}
                </li>
              ))}
            </ul>
            <Button className="mt-8" disabled={saving} onClick={() => void finish()}>
              {saving ? "Saving…" : "Go to dashboard →"}
            </Button>
          </section>
        )}
      </div>
    </div>
  );
}
