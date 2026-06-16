"use client";

import { StarRating } from "@/components/ui/star-rating";

const testimonials = [
  {
    quote: "Switched from Trustpilot because they cap invitations. EarnedStar sends 2,000/month on Growth. We went from 200 reviews to 1,800 in three months.",
    name: "Diane K.",
    store: "JDM Parts Direct",
    rating: 5,
  },
  {
    quote: "The fraud detection caught fake 1-star reviews before they published. That feature alone is worth the subscription.",
    name: "Rafael S.",
    store: "TruckParts.io",
    rating: 5,
  },
  {
    quote: "Setup took 22 minutes. Google stars showed up in our ads within 4 days. CTR on Shopping went up 18%.",
    name: "Amelia W.",
    store: "EuroParts Chicago",
    rating: 5,
  },
  {
    quote: "The agency plan lets me run reviews for 14 clients under my brand. I charge $149/month each. EarnedStar costs me $499 total.",
    name: "James L.",
    store: "Commerce Marketing Agency",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="border-y border-border bg-surface-2 py-24">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-center text-3xl font-bold text-navy">What store owners say</h2>
        <div className="marquee-mask mt-12 overflow-hidden">
          <div className="marquee-track flex gap-6">
            {[...testimonials, ...testimonials].map((t, i) => (
              <article key={`${t.name}-${i}`} className="card-surface gold-seam w-[340px] shrink-0 p-6">
                <StarRating rating={t.rating} size="sm" />
                <p className="mt-4 text-sm text-text-muted">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-4 text-sm font-semibold text-navy">{t.name}</p>
                <p className="text-xs text-text-faint">{t.store}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
