"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MARKETING_HERO_STAR_SRC } from "@/lib/brand-assets";

export function PhotorealAdBanner() {
  return (
    <section className="relative overflow-hidden border-y border-gold/20 bg-gradient-to-r from-navy via-navy-mid to-dark-bg py-14" data-surface="dark">
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
        <div className="absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-gold/25 blur-[80px]" />
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-navy-light/30 blur-[60px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 lg:flex-row lg:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="max-w-xl text-center lg:text-left"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">The EarnedStar Badge</p>
          <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
            Trust that was <span className="font-display italic text-gold">earned</span> — not given.
          </h2>
          <p className="mt-3 text-sm text-white/65">
            Photoreal 3D leather star with gold piping. Merchants display it with pride — buyers know every
            rating passed verification.
          </p>
          <Button variant="gold" size="lg" href="/signup" className="mt-6">
            Get Your Badge Free
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="logo-shell-hero relative shrink-0 rounded-3xl p-6"
        >
          <Image
            src={MARKETING_HERO_STAR_SRC}
            alt="EarnedStar photoreal lucky star badge"
            width={220}
            height={220}
            className="h-auto w-[180px] object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.5)] sm:w-[220px]"
          />
        </motion.div>
      </div>
    </section>
  );
}
