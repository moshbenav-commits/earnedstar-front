import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { ReviewsTable } from "@/components/dashboard/reviews-table";
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
        <p className="text-sm text-text-muted">
          All reviews for {merchant.name} — published, pending, and flagged.
        </p>
        <ReviewsTable reviews={rows} />
      </main>
    </>
  );
}
