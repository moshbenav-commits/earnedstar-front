import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { DashboardKpiRow } from "@/components/dashboard/dashboard-kpi-row";
import { RatingDistributionChart } from "@/components/dashboard/rating-distribution";
import { ReviewsTable } from "@/components/dashboard/reviews-table";
import { WidgetsPanel } from "@/components/dashboard/widgets-panel";
import { InvitationsList } from "@/components/dashboard/invitations-list";
import { fetchDashboardOverview } from "@/lib/earnedstar-server";
import { mockReviews } from "@/lib/mock-data";

export default async function DashboardHomePage() {
  const overview = await fetchDashboardOverview("expediaparts");
  const reviews = overview?.recentReviews?.length ? overview.recentReviews : mockReviews;

  return (
    <>
      <DashboardTopbar title="Overview" />
      <main className="space-y-8 bg-bg p-4 md:p-8">
        <DashboardKpiRow stats={overview?.stats} />
        <RatingDistributionChart distribution={overview?.ratingDistribution} />
        <ReviewsTable reviews={reviews} />
        <div className="grid gap-8 lg:grid-cols-2">
          <WidgetsPanel />
          <InvitationsList />
        </div>
      </main>
    </>
  );
}
