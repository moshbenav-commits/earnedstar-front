"use client";

import { motion } from "framer-motion";
import { EarnedStarMark } from "@/components/brand/earnedstar-mark";
import { StarRating } from "@/components/ui/star-rating";
import { VerifiedBadge } from "@/components/ui/verified-badge";

const testimonials = [
  {
    quote:
      "Switched from Trustpilot because they cap invitations. EarnedStar sends 2,000/month on Growth. We went from 200 reviews to 1,800 in three months.",
    name: "Diane K.",
    store: "JDM Parts Direct",
    rating: 5,
    initial: "D",
  },
  {
    quote:
      "The fraud detection caught fake 1-star reviews before they published. That feature alone is worth the subscription.",
    name: "Rafael S.",
    store: "TruckParts.io",
    rating: 5,
    initial: "R",
  },
  {
    quote:
      "Setup took 22 minutes. Google stars showed up in our ads within 4 days. CTR on Shopping went up 18%.",
    name: "Amelia W.",
    store: "EuroParts Chicago",
    rating: 5,
    initial: "A",
  },
  {
    quote:
      "The agency plan lets me run reviews for 14 clients under my brand. I charge $149/month each. EarnedStar costs me $499 total.",
    name: "James L.",
    store: "Commerce Marketing Agency",
    rating: 5,
    initial: "J",
  },
];

function TestimonialCard({
  t,
}: {
  t: (typeof testimonials)[number];
}) {
  return (
    <article className="marketing-review-card w-[360px] shrink-0 overflow-hidden rounded-2xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1),0_20px_44px_rgba(0,0,6,0.12)]">
      <div className="h-1 bg-gradient-to-r from-navy via-gold to-navy" />

      <div className="p-6">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <EarnedStarMark size={22} centerStyle="none" render="photo" />
            <span className="text-xs font-bold text-navy">EarnedStar</span>
          </div>
          <VerifiedBadge size="sm" />
        </div>

        <blockquote className="border-l-[3px] border-gold pl-4 text-sm leading-relaxed text-navy">
          &ldquo;{t.quote}&rdquo;
        </blockquote>

        <div className="mt-4">
          <StarRating rating={t.rating} size="sm" />
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-navy-mid to-dark-bg text-xs font-bold text-gold">
              {t.initial}
            </div>
            <div>
              <p className="text-sm font-bold text-navy">{t.name}</p>
              <p className="text-xs text-text-faint">{t.store}</p>
            </div>
          </div>
          <p className="text-right text-xs font-semibold text-gold">{t.rating}.0 ★</p>
        </div>
      </div>
    </article>
  );
}

export function TestimonialsSection() {
  return (
    <section className="hero-figma relative overflow-hidden py-24" data-surface="dark">
      <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden>
        <div className="absolute left-1/4 top-1/3 h-64 w-64 rounded-full bg-gold/30 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold/80">Merchant stories</p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            What store owners{" "}
            <span className="font-display italic text-gold">actually say</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-white/55">
            Real verified reviews from merchants on Growth, Pro, and Agency plans.
          </p>
        </motion.div>

        <div className="marquee-mask mt-14 overflow-hidden">
          <div className="marquee-track flex gap-6 py-2">
            {[...testimonials, ...testimonials].map((t, i) => (
              <TestimonialCard key={`${t.name}-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
