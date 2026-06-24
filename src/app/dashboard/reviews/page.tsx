/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { ReviewsTable } from "@/components/dashboard/reviews-table";
import { Button } from "@/components/ui/button";
import { fetchMerchantReviews } from "@/lib/earnedstar-server";
import { getDashboardMerchant } from "@/lib/dashboard-merchant";
import { mockReviews } from "@/lib/mock-data";

export default async function DashboardReviewsPage() {
  const merchant = await getDashboardMerchant();
  const reviews = await fetchMerchantReviews(merchant.slug, 100);
  const rows = reviews.length ? reviews : mockReviews;

  return (
    <>
      <DashboardTopbar title="Reviews" />
      <main className="space-y-6 bg-bg p-4 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            All reviews for {merchant.name} — published, pending, and flagged.
          </p>
          <Button variant="ghost" size="sm" href={`/api/earnedstar/dashboard/export/reviews?slug=${merchant.slug}`}>
            Export CSV
          </Button>
        </div>
        <ReviewsTable reviews={rows} />
      </main>
    </>
  );
}
