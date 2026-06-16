"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { EarnedStarLogo } from "@/components/brand/earnedstar-logo";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center bg-bg px-4 pt-24 text-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-navy-pale blur-3xl" />
        <div className="absolute -right-1/4 bottom-0 h-[300px] w-[300px] rounded-full bg-gold-pale blur-3xl" />
      </div>

      <motion.span
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-widest text-navy-light"
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />
        Now in open beta — Join 1,200+ e-commerce stores
      </motion.span>

      <h1 className="relative max-w-3xl text-4xl font-extrabold tracking-tight text-navy sm:text-5xl lg:text-6xl">
        Reviews your customers{" "}
        <span className="font-display italic text-gold">actually earned.</span>
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative mt-6 max-w-xl text-lg text-text-muted"
      >
        Verified by purchase. Fraud-scored by AI. The only badge that means your reviews are real.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative mt-10 flex flex-wrap justify-center gap-4"
      >
        <Button size="lg" href="/signup">Start Free — No Credit Card</Button>
        <Button variant="ghost" size="lg" href="#how-it-works">See How It Works →</Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="relative mt-4 text-xs text-text-faint"
      >
        No annual contracts · Cancel anytime · Google Seller Ratings ready · Setup in under 30 minutes
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative mt-16 w-full max-w-4xl"
      >
        <div className="card-surface glow-growth overflow-hidden p-2">
          <div className="rounded-xl bg-navy-pale/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <EarnedStarLogo size={24} />
              <span className="rounded-full bg-green-pale px-2 py-0.5 text-xs font-semibold text-green-dark">Live</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Total Reviews", value: "2,847" },
                { label: "Avg Rating", value: "4.9 ★" },
                { label: "Response Rate", value: "68%" },
                { label: "Fraud Blocked", value: "47" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg border border-border bg-surface p-3">
                  <p className="text-lg font-bold text-navy">{stat.value}</p>
                  <p className="text-xs text-text-faint">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
