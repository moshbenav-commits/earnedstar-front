/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MESHY } from "@/lib/marketing-editorial-data";

/** ES010 — split editorial hero for /pricing */
export function PricingPageHero() {
  return (
    <section className="relative overflow-hidden bg-ink pt-24 text-white" data-scroll-theme="dark" data-surface="dark">
      <div className="grain-overlay absolute inset-0 opacity-50" aria-hidden />
      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-6 py-16 sm:px-10 lg:grid-cols-12 lg:gap-16 lg:px-14 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5"
        >
          <span className="smallcaps text-[10px] text-gold-light">Pricing</span>
          <h1 className="font-heading mt-4 text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Simple plans.{" "}
            <em className="text-gold-light">Earned</em> trust at every tier.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
            Flat pricing with verified reviews, native email and SMS, and multi-domain included — no
            pay-to-protect schemes or annual lock-in.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-bold text-ink shadow-xl gold-foil"
            >
              Start free trial
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/audit"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 font-semibold text-white hover:bg-white/10"
            >
              Run a free audit first
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7"
        >
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl">
            <Image
              src={MESHY.pricingHero}
              alt="EarnedStar pricing dashboard — verified review metrics and flat plan cards"
              width={1024}
              height={682}
              priority
              className="h-auto w-full"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
