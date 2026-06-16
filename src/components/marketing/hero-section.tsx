"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { EarnedStarMark } from "@/components/brand/earnedstar-mark";

export function HeroSection() {
  return (
    <section className="hero-mesh relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-16 lg:flex-row lg:gap-12 lg:px-8 lg:text-left">
      <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden>
        <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-gold/20 blur-[100px]" />
      </div>

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
          Verified by purchase. Fraud-scored by AI. The origami lucky star badge that means your reviews are real.
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
            href="#how-it-works"
            className="border-white/20 text-white/90 hover:border-gold/50 hover:text-white"
          >
            See How It Works →
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

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        className="relative z-10 mt-14 flex flex-col items-center lg:mt-0 lg:flex-1"
      >
        <div className="animate-float-star relative">
          <EarnedStarMark size={160} centerStyle="logo" darkBg className="drop-shadow-[0_24px_48px_rgba(0,0,0,0.45)]" />
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{ boxShadow: "0 0 80px rgba(245,158,11,0.35)" }}
            aria-hidden
          />
        </div>

        <div className="card-surface-dark gold-seam mt-10 w-full max-w-md p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">Merchant badge preview</p>
            <span className="rounded-full bg-green/20 px-2 py-0.5 text-xs font-semibold text-green-pale">Live</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "Reviews", value: "2,847" },
              { label: "Rating", value: "4.9 ★" },
              { label: "Response", value: "68%" },
              { label: "Fraud blocked", value: "47" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-white/10 bg-white/5 p-2.5 text-center">
                <p className="text-base font-bold text-white">{stat.value}</p>
                <p className="text-[10px] uppercase tracking-wide text-white/45">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
