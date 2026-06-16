import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { DashboardKpiRow } from "@/components/dashboard/dashboard-kpi-row";
import { RatingDistributionChart } from "@/components/dashboard/rating-distribution";
import { ReviewsTable } from "@/components/dashboard/reviews-table";
import { WidgetsPanel } from "@/components/dashboard/widgets-panel";
import { InvitationsList } from "@/components/dashboard/invitations-list";
import { mockReviews } from "@/lib/mock-data";

export default function DashboardHomePage() {
  return (
    <>
      <DashboardTopbar title="Overview" />
      <main className="space-y-8 bg-bg p-4 md:p-8">
        <DashboardKpiRow />
        <RatingDistributionChart />
        <ReviewsTable reviews={mockReviews} />
        <div className="grid gap-8 lg:grid-cols-2">
          <WidgetsPanel />
          <InvitationsList />
        </div>
      </main>
    </>
  );
}
