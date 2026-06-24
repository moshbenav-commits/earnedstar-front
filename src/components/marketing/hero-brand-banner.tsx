/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import { motion } from "framer-motion";
import {
  EarnedStarLuckyStar,
  type LuckyStarVariant,
} from "@/components/brand/earnedstar-lucky-star";
import { cn } from "@/lib/utils";

const STAR_VARIANTS: { id: LuckyStarVariant; label: string }[] = [
  { id: "navy", label: "Navy / Gold" },
  { id: "gold", label: "All Gold" },
  { id: "white", label: "All White" },
];

interface HeroBrandBannerProps {
  className?: string;
}

/** Wide horizontal brand strip — three mark options + review-trust motto. */
export function HeroBrandBanner({ className }: HeroBrandBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.6 }}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-5 backdrop-blur-sm sm:px-8 sm:py-6 lg:px-10",
        className,
      )}
      data-surface="dark"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" aria-hidden />

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8 lg:gap-12">
        <div className="flex shrink-0 items-end justify-center gap-4 sm:gap-5 lg:gap-6">
          {STAR_VARIANTS.map((variant, i) => (
            <motion.div
              key={variant.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.08 }}
              className="flex flex-col items-center gap-2"
            >
              <EarnedStarLuckyStar
                size={80}
                variant={variant.id}
                showBadge
                className="drop-shadow-[0_12px_28px_rgba(0,0,0,0.45)]"
              />
              <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40 sm:text-[10px]">
                {variant.label}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold/80">
            Verified by purchase
          </p>
          <p className="mt-2 text-xl font-extrabold leading-snug tracking-tight sm:text-2xl lg:text-[1.65rem]">
            <span className="block">
              <span className="text-white/90">No order, no </span>
              <span className="text-gold">star.</span>
            </span>
            <span className="block">
              <span className="text-white/90">Every review is </span>
              <span className="text-gold">real.</span>
            </span>
          </p>
          <p className="mt-2 max-w-xl text-sm text-white/55">
            Ratings tied to confirmed orders — so shoppers researching your store know which feedback was
            actually earned, not posted by anyone with a browser.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
