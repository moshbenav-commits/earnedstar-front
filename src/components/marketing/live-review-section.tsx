/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import { HeroReviewCard } from "@/components/marketing/hero-review-card";

/** Main-branch live review demo — kept from production homepage */
export function LiveReviewSection() {
  return (
    <section id="live-review" className="relative overflow-hidden bg-ink py-20 md:py-28" data-surface="dark">
      <div className="grain-overlay absolute inset-0 opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-lg px-6 sm:px-10 lg:px-14">
        <p className="smallcaps mb-2 text-center text-[10px] text-gold-light">Live review</p>
        <h2 className="mb-8 text-center font-heading text-3xl text-white sm:text-4xl">
          See why stores trust <em className="text-gold-light">EarnedStar</em>
        </h2>
        <HeroReviewCard />
      </div>
    </section>
  );
}
