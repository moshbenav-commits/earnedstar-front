/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { EarnedStarLuckyStar } from "@/components/brand/earnedstar-lucky-star";
import { AmbientStars } from "@/components/marketing/ambient-stars";
import { HeroReviewCard } from "@/components/marketing/hero-review-card";
import { HERO_EYEBROW, HERO_HEADLINE_BEFORE, HERO_HEADLINE_EMPHASIS, HERO_SUBCOPY } from "@/content/earnedstar-trust-copy";

/** Figma Hero Banner — navy mesh, lucky stars, review-site copy */
export function HeroSection() {
  return (
    <section className="hero-figma relative overflow-hidden pt-10 pb-16" data-scroll-theme="dark">
      <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden>
        <div className="absolute left-1/4 top-1/3 h-80 w-80 rounded-full bg-[#3060b8]/30 blur-[100px]" />
        <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-gold/15 blur-[80px]" />
      </div>

      <AmbientStars />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[min(70vh,640px)] items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — Figma BannerHero copy block */}
          <div className="text-center lg:text-left">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 inline-flex items-center rounded-full border border-gold/35 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold"
            >
              {HERO_EYEBROW}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]"
            >
              {HERO_HEADLINE_BEFORE}{" "}
              <span className="font-display italic text-gold">{HERO_HEADLINE_EMPHASIS}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 max-w-lg text-lg text-white/70 lg:mx-0 mx-auto"
            >
              {HERO_SUBCOPY}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start"
            >
              <Button variant="gold" size="lg" href="/signup" className="min-w-[180px]">
                Start Free Trial
              </Button>
              <Button
                variant="ghost"
                size="lg"
                href="#how-it-works"
                className="border-white/20 text-white/90 hover:border-gold/50 hover:text-white"
              >
                See How It Works
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <EarnedStarLuckyStar key={i} size={14} variant="gold" showBadge={false} />
                ))}
              </div>
              <span className="text-sm font-medium text-white/60">4.9 · 2,847 verified reviews</span>
            </motion.div>
          </div>

          {/* Right — decorative stars + live review card (Figma ReviewAnimation) */}
          <div className="relative flex w-full flex-col items-center">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
              <EarnedStarLuckyStar
                size={200}
                variant="gold"
                showBadge
                className="absolute -right-4 top-0 opacity-90 drop-shadow-2xl sm:size-[240px]"
              />
              <EarnedStarLuckyStar
                size={140}
                variant="navy"
                showBadge
                className="absolute -left-6 bottom-12 opacity-80 drop-shadow-xl"
              />
            </div>

            <div className="relative z-10 w-full max-w-md pt-8 lg:pt-16">
              <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-gold/70">
                Live review
              </p>
              <h2 className="mb-6 text-center text-2xl font-bold text-white sm:text-3xl">
                See why stores trust{" "}
                <span className="font-display italic text-gold">EarnedStar</span>
              </h2>
              <HeroReviewCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
