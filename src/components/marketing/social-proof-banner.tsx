/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import { motion } from "framer-motion";
import { EarnedStarLuckyStar } from "@/components/brand/earnedstar-lucky-star";
import { Button } from "@/components/ui/button";

/** Figma Social Proof Banner — verified review stats strip */
export function SocialProofBanner() {
  return (
    <section className="section-navy py-12" data-surface="dark" data-scroll-theme="dark">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-10 backdrop-blur-sm sm:px-10"
        >
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <EarnedStarLuckyStar key={i} size={44} variant="gold" showBadge={false} />
              ))}
            </div>

            <div className="text-center">
              <p className="text-5xl font-extrabold tracking-tight text-gold sm:text-6xl">4.9</p>
              <p className="text-sm text-white/55">out of 5.0</p>
            </div>

            <div className="hidden h-20 w-px bg-white/15 lg:block" aria-hidden />

            <div className="text-center lg:text-left">
              <p className="text-3xl font-bold text-white sm:text-4xl">2,847+</p>
              <p className="text-sm text-white/55">verified customer reviews</p>
              <p className="mt-3 text-2xl font-bold text-white">98%</p>
              <p className="text-sm text-white/55">would recommend to a friend</p>
            </div>

            <Button variant="gold" href="/store/meridian-gear">
              Read Reviews
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
