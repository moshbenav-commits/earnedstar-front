import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { ReviewsTable } from "@/components/dashboard/reviews-table";
import { fetchMerchantReviews } from "@/lib/earnedstar-server";
import { mockReviews } from "@/lib/mock-data";

export default async function DashboardReviewsPage() {
  const reviews = await fetchMerchantReviews("expediaparts", 100);
  const rows = reviews.length ? reviews : mockReviews;

  return (
    <>
      <DashboardTopbar title="Reviews" />
      <main className="space-y-6 bg-bg p-4 md:p-8">
        <p className="text-sm text-text-muted">
          All reviews for your store — published, pending, and flagged.
        </p>
        <ReviewsTable reviews={rows} />
      </main>
    </>
  );
}
