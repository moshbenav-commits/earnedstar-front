/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { MESHY } from "@/lib/marketing-editorial-data";

export function HeroSection() {
  const [dateLabel, setDateLabel] = useState("");

  useEffect(() => {
    setDateLabel(
      new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    );
  }, []);

  return (
    <section className="relative -mt-16 overflow-hidden bg-ink pt-16 text-white" data-scroll-theme="dark" data-surface="dark">
      <div className="grain-overlay absolute inset-0" aria-hidden />
      <div className="ring-light pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="absolute -right-32 -top-40 h-[680px] w-[680px] rounded-full opacity-40"
        style={{ background: "radial-gradient(circle at 30% 30%, rgba(245,158,11,0.55) 0%, transparent 60%)" }}
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-0 h-[420px] w-[420px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, rgba(253,230,138,0.45) 0%, transparent 60%)" }}
        aria-hidden
      />

      <div className="relative border-b border-white/10">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3 text-[10px] text-white/40 sm:px-10 lg:px-14">
          <span className="smallcaps">Manifesto · Edition I</span>
          <span className="hidden sm:inline">EarnedStar — A Trust Manifesto for E-Commerce</span>
          <span className="font-num tabular-nums">{dateLabel}</span>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 py-20 md:py-32 lg:grid-cols-12 lg:gap-16 sm:px-10 lg:px-14">
        <div className="space-y-9 lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="flex items-center gap-3"
          >
            <span className="h-px w-10 bg-gold/70" />
            <span className="smallcaps text-gold-light">The Trust Stack · Post-Yotpo Era</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-tight text-balance text-white"
          >
            Reviews that{" "}
            <em className="text-gold-light underline-hand">earned</em>
            <br />
            their place — and <em className="text-gold-light underline-hand">prove</em> it.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.7 }}
            className="max-w-xl text-lg leading-[1.55] text-pretty text-white/72 sm:text-xl"
          >
            The only e-commerce review platform where every star is order-verified, AI-fraud-audited,
            and publicly provable. Bundled with native email, SMS, and loyalty — at flat prices that
            don&apos;t punish you for growing.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 font-bold text-ink shadow-[0_18px_40px_-12px_rgba(245,158,11,0.5)] transition-all gold-foil hover:shadow-[0_24px_50px_-12px_rgba(245,158,11,0.7)]"
            >
              Start free trial
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/yotpo-refugees"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/35 hover:bg-white/8"
            >
              <Sparkles size={14} className="text-gold-light" />
              Yotpo killed your email? Migrate free
            </Link>
          </motion.div>

          <div className="flex items-center gap-4 pt-6 text-[11px] text-white/40">
            <span className="smallcaps">Trusted by merchants in</span>
            <div className="font-num flex items-center gap-3 tabular-nums">
              <span>14 verticals</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>22 countries</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>1 promise</span>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center lg:col-span-5 lg:justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="animate-editorial-orbit pointer-events-none absolute -inset-16">
              <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden>
                <defs>
                  <linearGradient id="orbit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.55" />
                    <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#92400E" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <circle cx="200" cy="200" r="186" fill="none" stroke="url(#orbit-grad)" strokeWidth="1.5" strokeDasharray="3 9" />
              </svg>
            </div>
            <div className="absolute -inset-10 bg-gradient-to-tr from-gold-dark/55 via-gold/30 to-transparent blur-3xl" aria-hidden />
            <div className="animate-editorial-float relative">
              <Image
                src={MESHY.heroBadge}
                alt="EarnedStar 3D leather lucky star with verification metrics"
                width={520}
                height={520}
                priority
                className="max-w-full drop-shadow-[0_40px_80px_rgba(0,0,0,0.65)]"
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-ink/80 px-4 py-1.5 text-[10px] text-gold-light backdrop-blur-sm smallcaps">
              Hand-rendered · 3D leather
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
