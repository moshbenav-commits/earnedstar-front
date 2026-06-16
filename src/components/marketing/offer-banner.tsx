"use client";

import { motion } from "framer-motion";
import { EarnedStarLuckyStar } from "@/components/brand/earnedstar-lucky-star";
import { Button } from "@/components/ui/button";

/** Figma Offer / Promotional Banner — mid-page trial CTA */
export function OfferBanner() {
  return (
    <section className="py-16" data-scroll-theme="dark">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl border border-gold/25 bg-gradient-to-r from-[#0b1d58] via-navy to-[#010509] p-8 sm:p-12"
          data-surface="dark"
        >
          <div className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 opacity-20" aria-hidden>
            <EarnedStarLuckyStar size={200} variant="gold" showBadge />
          </div>

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center">
            <EarnedStarLuckyStar size={120} variant="navy" showBadge className="shrink-0 drop-shadow-lg" />

            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold/80">
                14-day free trial · No credit card
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Trust shoppers can{" "}
                <span className="font-display italic text-gold">actually verify</span>
              </h2>
              <p className="mt-3 max-w-xl text-sm text-white/65">
                Start collecting purchase-verified reviews today. Every rating ties to a real order —
                so buyers researching your store know what was earned.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Button variant="gold" size="lg" href="/signup">
                  Start Free Trial
                </Button>
                <span className="text-sm text-white/45">Setup in under 30 minutes</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
