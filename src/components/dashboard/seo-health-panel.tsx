"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLAN_LIMITS, type PlanId } from "@/lib/plans";
import { cn } from "@/lib/utils";

type SeoHealth = {
  profile_url: string;
  checks: {
    profile_indexable: boolean;
    meta_filled: boolean;
    faq_schema: boolean;
    syndication_available: boolean;
    review_summary_fresh: boolean;
  };
  counts: { published_reviews: number; published_qa: number };
  review_summary_ai: string | null;
  review_summary_generated_at: string | null;
  indexnow_enabled: boolean;
  plan_features?: {
    ai_meta_suggestions: boolean;
    ai_review_summary: boolean;
    ai_qa_suggestions: boolean;
  };
};

export function SeoHealthPanel({ plan }: { plan: PlanId }) {
  const [data, setData] = useState<SeoHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const limits = PLAN_LIMITS[plan];

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/earnedstar/seo/health");
        const json = await res.json();
        if (!res.ok) throw new Error((json as { message?: string }).message ?? "Failed to load");
        setData(json as SeoHealth);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load SEO health");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function regenerateSummary() {
    setRegenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/earnedstar/seo/regenerate-summary", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error((json as { message?: string }).message ?? "Regenerate failed");
      const healthRes = await fetch("/api/earnedstar/seo/health");
      if (healthRes.ok) setData((await healthRes.json()) as SeoHealth);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Regenerate failed");
    } finally {
      setRegenerating(false);
    }
  }

  const checks = data
    ? [
        {
          id: "profile",
          label: "Profile indexable",
          pass: data.checks.profile_indexable,
          hint: "At least one published review on a public profile",
        },
        {
          id: "meta",
          label: "SEO title & description filled",
          pass: data.checks.meta_filled,
          hint: "Custom meta in Review Profile SEO below",
        },
        {
          id: "faq",
          label: "FAQ schema ready (3+ Q&A)",
          pass: data.checks.faq_schema,
          hint: `${data.counts.published_qa} published — Pro+ Q&A module`,
        },
        {
          id: "summary",
          label: "AI review summary fresh",
          pass: data.checks.review_summary_fresh,
          hint: "Growth+ — regenerates every 30 days",
        },
      ]
    : [];

  return (
    <section className="card-surface gold-seam max-w-2xl p-6">
      <h2 className="text-lg font-bold text-navy">SEO health</h2>
      <p className="mt-1 text-sm text-text-muted">
        How discoverable your Review Profile is for Google and answer engines.
      </p>

      {loading && <p className="mt-4 text-sm text-text-muted">Loading checks…</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {data && (
        <>
          <ul className="mt-6 space-y-3">
            {checks.map((c) => (
              <li
                key={c.id}
                className={cn(
                  "flex items-start gap-3 rounded-lg border px-4 py-3 text-sm",
                  c.pass ? "border-green-200 bg-green-pale/50" : "border-border bg-bg",
                )}
              >
                {c.pass ? (
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-dark" aria-hidden />
                ) : (
                  <Circle size={18} className="mt-0.5 shrink-0 text-text-faint" aria-hidden />
                )}
                <div>
                  <p className="font-semibold text-navy">{c.label}</p>
                  <p className="text-xs text-text-muted">{c.hint}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <a
              href={data.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-navy-light hover:text-gold"
            >
              View public profile <ExternalLink size={14} />
            </a>
            {limits.syndication ? (
              <Link href="/dashboard/syndication" className="font-semibold text-navy-light hover:text-gold">
                Syndication feeds →
              </Link>
            ) : null}
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-navy-light hover:text-gold"
            >
              Search Console
            </a>
          </div>

          {limits.ai_review_summary ? (
            <div className="mt-6 rounded-lg border border-border bg-bg p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-faint">
                What customers say (AI summary)
              </p>
              <p className="mt-2 text-sm text-text-muted">
                {data.review_summary_ai ?? "Not generated yet — needs 5+ published reviews."}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3"
                disabled={regenerating || data.counts.published_reviews < 5}
                onClick={() => void regenerateSummary()}
              >
                {regenerating ? "Generating…" : "Regenerate summary"}
              </Button>
            </div>
          ) : null}

          <p className="mt-4 text-xs text-text-faint">
            IndexNow {data.indexnow_enabled ? "active" : "off"} — pings Google/Bing when reviews or SEO update.
          </p>
        </>
      )}
    </section>
  );
}
