/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/app/AppShell';
import { StarRating } from '@/components/ui/star-rating';
import { VerifiedBadge } from '@/components/ui/verified-badge';
import { fetchMerchantReviews } from '@/lib/earnedstar-server';
import { getDashboardMerchant } from '@/lib/dashboard-merchant';
import { mockReviews } from '@/lib/mock-data';

export const metadata: Metadata = { title: 'Reviews' };

/** Distilled "reviews" job. Pulls the merchant's real reviews from the same
 * fetchMerchantReviews() the full /dashboard/reviews table uses (falling back to
 * the same mockReviews demo set that page already ships when a merchant has no
 * live data — never a screen-local invented review). Managing status, replying,
 * and exporting stay on /dashboard/reviews, which this screen links into. */
export default async function DistilledReviewsPage() {
  const merchant = await getDashboardMerchant();
  const liveReviews = await fetchMerchantReviews(merchant.slug, 20);
  const reviews = liveReviews.length ? liveReviews : mockReviews;

  return (
    <AppShell activePath="/app/reviews" title="Reviews">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-gold">{merchant.name}</p>
      <h1 className="mt-1 text-2xl font-semibold text-white">Order-verified reviews</h1>
      <p className="mt-2 text-sm text-gray-400">
        {merchant.review_count.toLocaleString()} total &middot; {merchant.avg_rating.toFixed(1)} average rating.
        Every star ties back to a confirmed order.
      </p>

      <Link
        href="/dashboard/invitations"
        className="mt-5 flex min-h-11 items-center justify-center rounded-full text-sm font-bold text-ink"
        style={{ backgroundColor: 'var(--gold)' }}
      >
        Send a review invitation
      </Link>

      <section className="mt-6" aria-label="Recent reviews">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Recent</h2>
        <ul className="mt-3 grid gap-3">
          {reviews.slice(0, 20).map((review) => (
            <li key={review.id} className="rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-white">{review.customer_name}</p>
                  <StarRating rating={review.rating_overall} size="sm" className="mt-1" />
                </div>
                {review.verified_purchase ? <VerifiedBadge size="sm" /> : null}
              </div>
              {review.review_title ? (
                <p className="mt-2 text-sm font-semibold text-gray-200">{review.review_title}</p>
              ) : null}
              <p className="mt-1 line-clamp-3 text-sm text-gray-400">{review.review_text}</p>
              {review.product_name ? (
                <p className="mt-2 text-xs uppercase tracking-wide text-gray-500">{review.product_name}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <nav className="mt-8 grid gap-3" aria-label="Manage reviews">
        <Link
          href="/dashboard/reviews"
          className="block min-h-11 rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-4"
        >
          <p className="font-bold text-white">Manage reviews</p>
          <p className="mt-1 text-sm text-gray-400">Approve, flag, reply, and export the full table</p>
        </Link>
        <Link
          href="/dashboard/widgets"
          className="block min-h-11 rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-4"
        >
          <p className="font-bold text-white">Widgets</p>
          <p className="mt-1 text-sm text-gray-400">Embed reviews on your storefront</p>
        </Link>
      </nav>

      <div className="mt-10 border-t border-white/10 pt-6">
        <Link href="/" className="inline-flex min-h-11 items-center text-sm font-bold text-gray-500">
          Full desktop site
        </Link>
      </div>
    </AppShell>
  );
}
