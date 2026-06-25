/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Search, Shield } from "lucide-react";
import { runReviewAudit, type ReviewAuditResult } from "@/lib/marketing-api";

const SIGNALS = [
  "Language cluster analysis — duplicate phrasing across reviewers",
  "Timing anomalies — burst submissions after product launch",
  "Reviewer history — empty profiles, cross-store spam patterns",
  "Star distribution skew — unnatural 5-star walls",
] as const;

const RISK_STYLES: Record<string, string> = {
  low: "text-green-700 bg-green-50 border-green-200",
  moderate: "text-amber-800 bg-amber-50 border-amber-200",
  high: "text-orange-800 bg-orange-50 border-orange-200",
  critical: "text-red-800 bg-red-50 border-red-200",
};

export function AuditPageClient() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReviewAuditResult | null>(null);

  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!url.trim()) {
      setError("Paste a Trustpilot or Yotpo profile URL.");
      return;
    }
    setLoading(true);
    try {
      const data = await runReviewAudit(url.trim());
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Audit failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-24 pt-24 text-white" data-surface="dark">
        <div className="grain-overlay absolute inset-0 opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-6 text-center sm:px-10 lg:px-14">
          <span className="smallcaps text-[10px] text-gold-light">Public tool · No login</span>
          <h1 className="font-heading mt-4 text-5xl leading-[1.02] tracking-tight text-balance sm:text-6xl">
            The Review <em className="text-gold-light underline-hand">Audit</em>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/72">
            Paste a Trustpilot or Yotpo profile URL. We run an AI forensic scan and estimate
            how many reviews look manufactured.
          </p>
        </div>
      </section>

      <section className="relative -mt-16 pb-24">
        <div className="mx-auto max-w-xl px-6 sm:px-10">
          <form onSubmit={handleScan} className="vellum-card gilded-edge rounded-2xl p-8">
            <label htmlFor="audit-url" className="smallcaps text-[10px] text-gold-dark">
              Profile URL
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                id="audit-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.trustpilot.com/review/..."
                className="flex-1 rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none ring-ink/20 focus:ring-2"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-ink disabled:opacity-60 gold-foil"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                Scan
              </button>
            </div>
            {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
          </form>

          {result && (
            <div className="vellum-card gilded-edge mt-8 rounded-2xl p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="smallcaps text-[10px] text-gold-dark">Estimated fake reviews</div>
                  <div className="font-heading mt-1 text-5xl tracking-tight">
                    {result.audit.estimated_fake_review_pct}%
                  </div>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${RISK_STYLES[result.audit.risk_level] ?? RISK_STYLES.moderate}`}
                >
                  {result.audit.risk_level} risk
                </span>
              </div>
              <p className="mt-4 text-sm text-ink/55 break-all">{result.url}</p>
              <ul className="mt-6 space-y-3 border-t border-ink/8 pt-6">
                {result.audit.top_patterns.map((pattern) => (
                  <li key={pattern} className="flex gap-3 text-sm text-ink/75">
                    <span className="font-num text-gold-dark">→</span>
                    {pattern}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-relaxed text-ink/70">{result.audit.recommendation}</p>
              <Link
                href="/signup"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white hover:bg-ink-soft"
              >
                Build a verified profile instead
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-ink/8 bg-vellum py-24 paper-grain">
        <div className="mx-auto max-w-4xl px-6 sm:px-10 lg:px-14">
          <div className="flex items-center gap-3">
            <Shield className="text-gold-dark" size={22} />
            <h2 className="font-heading text-3xl italic">What we scan for</h2>
          </div>
          <ul className="mt-10 space-y-5">
            {SIGNALS.map((signal) => (
              <li key={signal} className="flex gap-4 border-b border-ink/8 pb-5 text-ink/75">
                <span className="font-num text-sm text-gold-dark">→</span>
                {signal}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
