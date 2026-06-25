/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import { Quote } from "lucide-react";

export function FoundersQuoteSection() {
  return (
    <section className="relative overflow-hidden bg-cream py-24 paper-grain md:py-36">
      <div className="relative mx-auto max-w-[1100px] px-6 sm:px-10 lg:px-14">
        <div className="mb-10 flex items-center gap-4">
          <span className="smallcaps text-[10px] text-gold-dark">Editor&apos;s Note</span>
          <span className="magazine-rule flex-1 text-ink/20" />
          <span className="smallcaps text-[10px] text-ink/40">Chapter 01</span>
        </div>

        <div className="relative pl-12 md:pl-20">
          <Quote className="absolute -left-2 top-2 text-gold-dark/30" size={64} strokeWidth={0.8} aria-hidden />
          <blockquote className="font-heading text-[clamp(2rem,4vw,3.4rem)] leading-[1.08] text-balance text-ink">
            Stars used to mean something. Somewhere between the affiliate marketers,
            the fake-review services, and the &ldquo;pay-to-protect&rdquo; quotas, they stopped. We
            built EarnedStar to put them back where they belong:{" "}
            <em className="not-italic font-normal gold-text">earned, audited, and yours</em>.
          </blockquote>
          <div className="mt-10 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gold-light to-gold-dark font-heading text-xl italic text-ink">
              M
            </div>
            <div>
              <div className="font-bold tracking-tight text-ink">M. Benav</div>
              <div className="text-xs text-ink/50">Founder & CEO — EarnedStar</div>
            </div>
            <div className="font-num ml-6 hidden text-[10px] text-ink/40 smallcaps tabular-nums md:block">
              № 001 · 2026
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
