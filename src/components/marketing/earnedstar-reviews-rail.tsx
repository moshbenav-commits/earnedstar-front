/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { ReviewsRail } from "@expedia/creytix-sections/reviews-rail";
import { fetchMerchant, fetchPublishedReviews } from "@/lib/earnedstar-server";
import type { Review } from "@/types/review";
import type { ReviewItem } from "@expedia/creytix-sections/reviews-rail";

/**
 * Homepage social-proof rail — the fleet's `reviews` design-element floor
 * (creytix:site:site-standard, homepageExperience.reviews) — built on the
 * shared `@expedia/creytix-sections/reviews-rail` (vendored at
 * vendor/creytix-sections, mirroring vendor/creytix-partner-kit and
 * vendor/expedia-design-lab: this repo is its own deploy, not a sibling of
 * packages/creytix-sections). Repo law: never fork a second stars widget —
 * this reuses the shared fractional-fill Stars, not the dashboard's
 * rounded `StarRating` (src/components/ui/star-rating.tsx), which would
 * overstate a partial rating on the one surface where accuracy matters
 * most for an honesty-in-reviews product.
 *
 * Data comes from EarnedStar's own live API via the app's existing
 * `earnedstar-server.ts` fetchers — the same path every dashboard/public
 * profile route already uses — for "meridian-gear", the platform's own
 * long-running demo merchant (already linked publicly from this same
 * marketing site: social-proof-banner.tsx's "Read Reviews" button and
 * llms.txt both point here). Never a hardcoded quote: if the API returns
 * no published reviews, the honest empty state below renders instead,
 * matching auction-front's EarnedStarReviewsRail precedent.
 */
const DEMO_MERCHANT_SLUG = "meridian-gear";

function toReviewItems(reviews: Review[]): ReviewItem[] {
  return reviews.map((review) => ({
    id: review.id,
    rating: review.rating_overall,
    title: review.review_title ?? null,
    body: review.review_text,
    authorName: review.customer_name,
    verified: review.verified_purchase,
    createdAt: review.created_at,
  }));
}

export async function EarnedStarReviewsRail() {
  const [merchant, reviews] = await Promise.all([
    fetchMerchant(DEMO_MERCHANT_SLUG),
    fetchPublishedReviews(DEMO_MERCHANT_SLUG, 8),
  ]);

  const published = reviews.filter((r) => r.status === "published");
  const summary =
    merchant && merchant.review_count > 0
      ? { averageRating: merchant.avg_rating, reviewCount: merchant.review_count }
      : null;

  return (
    <div data-surface="dark">
      <ReviewsRail
        className="es-reviews-rail"
        items={toReviewItems(published)}
        eyebrow="Verified on EarnedStar"
        heading="Real reviews, collected by EarnedStar"
        summary={summary}
        viewAllHref={`/reviews/${DEMO_MERCHANT_SLUG}`}
        viewAllLabel="See the full public profile →"
        labels={{
          sectionLabel: "Store reviews",
          verified: "Verified buyer",
          reviewCount: (count) => `${count} verified ${count === 1 ? "review" : "reviews"}`,
        }}
        emptyState={<ReviewsOpenEmptyState slug={DEMO_MERCHANT_SLUG} />}
      />
    </div>
  );
}

function ReviewsOpenEmptyState({ slug }: { slug: string }) {
  return (
    <section className="es-reviews-rail bg-ink py-20 md:py-28" data-surface="dark" aria-label="Store reviews">
      <div className="mx-auto max-w-3xl px-6 text-center sm:px-10">
        <p className="smallcaps mb-2 text-[10px] text-gold-light">Verified on EarnedStar</p>
        <h2 className="mb-4 font-heading text-3xl text-white sm:text-4xl">Reviews open here first</h2>
        <p className="text-white/60">
          This profile (<code className="text-gold-light">{slug}</code>) collects reviews the same way every
          EarnedStar merchant does — verified purchase, AI fraud screening, published automatically. Once reviews
          are published, they show up on this rail with no fabricated placeholders in between.
        </p>
      </div>
    </section>
  );
}
