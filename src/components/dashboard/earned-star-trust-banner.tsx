"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TRUST_EYEBROW,
  TRUST_HEADLINE,
  TRUST_MIGRATION,
  TRUST_RATING_RULE,
  TRUST_STEPS,
  TRUST_SUBHEAD,
  TRUST_DASHBOARD_CTA,
} from "@/content/earnedstar-trust-copy";

const STORAGE_KEY = "earnedstar-trust-explainer-v1-dismissed";

export function EarnedStarTrustBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    try {
      setVisible(localStorage.getItem(STORAGE_KEY) !== "1");
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <section
      className="border-b border-gold/25 bg-gradient-to-br from-navy via-[#0f2044] to-[#0a1628] px-4 py-6 text-white md:px-8"
      aria-labelledby="earnedstar-trust-heading"
      data-surface="dark"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold">
            <ShieldCheck size={16} aria-hidden />
            {TRUST_EYEBROW}
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Dismiss trust explainer"
          >
            <X size={18} />
          </button>
        </div>

        <h2 id="earnedstar-trust-heading" className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {TRUST_HEADLINE}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/80 sm:text-base">{TRUST_SUBHEAD}</p>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 text-sm font-semibold text-gold underline-offset-2 hover:underline"
          aria-expanded={expanded}
        >
          {expanded ? "Hide the 5 verification stages" : "Show the 5 verification stages"}
        </button>

        {expanded ? (
          <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {TRUST_STEPS.map((step, index) => (
              <li
                key={step.id}
                className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">
                  {index + 1}
                </span>
                <p className="mt-3 text-sm font-semibold text-white">{step.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/70">{step.body}</p>
              </li>
            ))}
          </ol>
        ) : null}

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="flex items-start gap-2 text-sm text-white/90">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-400" aria-hidden />
              {TRUST_RATING_RULE}
            </p>
          </div>
          <div className="rounded-xl border border-gold/30 bg-gold/10 p-4">
            <p className="text-sm leading-relaxed text-white/90">{TRUST_MIGRATION}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button variant="gold" size="sm" onClick={dismiss}>
            {TRUST_DASHBOARD_CTA}
          </Button>
          <Link
            href="/dashboard/invitations"
            className="text-sm font-semibold text-white/80 underline-offset-2 hover:text-white hover:underline"
          >
            Send your first invitation →
          </Link>
        </div>
      </div>
    </section>
  );
}
