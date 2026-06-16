"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { EarnedStarMark } from "@/components/brand/earnedstar-mark";
import { HeroReviewCard } from "@/components/marketing/hero-review-card";
import { MARKETING_HERO_STAR_SRC } from "@/lib/brand-assets";

const AMBIENT_STARS = [
  { x: "8%", y: "18%", size: 28, delay: 0, variant: "photo" as const },
  { x: "84%", y: "12%", size: 22, delay: 1.2, variant: "photo" as const },
  { x: "6%", y: "72%", size: 34, delay: 2, variant: "photo" as const },
  { x: "90%", y: "68%", size: 24, delay: 0.6, variant: "photo" as const },
  { x: "50%", y: "6%", size: 20, delay: 3, variant: "photo" as const },
  { x: "18%", y: "88%", size: 26, delay: 1.8, variant: "photo" as const },
  { x: "76%", y: "85%", size: 18, delay: 2.6, variant: "photo" as const },
];

export function HeroSection() {
  return (
    <section className="hero-figma relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-16 lg:flex-row lg:items-center lg:gap-10 lg:px-8 lg:text-left">
      {AMBIENT_STARS.map((star, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute opacity-[0.16]"
          style={{ left: star.x, top: star.y }}
          animate={{ y: [0, -14, 6, -10, 0], rotate: [0, 6, -3, 4, 0] }}
          transition={{ duration: 8 + i * 0.4, delay: star.delay, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          <EarnedStarMark size={star.size} centerStyle="none" render="photo" />
        </motion.div>
      ))}

      <div className="relative z-10 max-w-xl text-center lg:flex-1 lg:text-left">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />
          Now in open beta — Join 1,200+ e-commerce stores
        </motion.span>

        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Reviews your customers{" "}
          <span className="font-display italic text-gold">actually earned.</span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg text-white/70"
        >
          Verified by purchase. Fraud-scored by AI. The photoreal lucky star badge that means your reviews
          are real.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start"
        >
          <Button variant="gold" size="lg" href="/signup">
            Start Free — No Credit Card
          </Button>
          <Button
            variant="ghost"
            size="lg"
            href="#brand"
            className="border-white/20 text-white/90 hover:border-gold/50 hover:text-white"
          >
            See the Badge →
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-xs text-white/45"
        >
          No annual contracts · Cancel anytime · Google Seller Ratings ready · Setup in under 30 minutes
        </motion.p>
      </div>

      <div className="relative z-10 mt-14 flex w-full max-w-lg flex-col items-center lg:mt-0 lg:flex-1">
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="animate-float-star relative mb-8"
        >
          <div className="logo-shell-hero rounded-3xl p-5 sm:p-8">
            <Image
              src={MARKETING_HERO_STAR_SRC}
              alt="EarnedStar photoreal 3D leather lucky star"
              width={320}
              height={320}
              className="h-auto w-[200px] object-contain drop-shadow-[0_32px_64px_rgba(0,0,0,0.55)] sm:w-[260px] lg:w-[300px]"
              priority
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{ boxShadow: "0 0 100px rgba(245,158,11,0.28)" }}
            aria-hidden
          />
        </motion.div>

        <HeroReviewCard />
      </div>
    </section>
  );
}
