/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { DashboardKpiRow } from "@/components/dashboard/dashboard-kpi-row";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { RatingDistributionChart } from "@/components/dashboard/rating-distribution";
import { ReviewsTable } from "@/components/dashboard/reviews-table";
import { WidgetsPanel } from "@/components/dashboard/widgets-panel";
import { InvitationsList } from "@/components/dashboard/invitations-list";
import { fetchDashboardOverview, fetchInvitations } from "@/lib/earnedstar-server";
import { getDashboardMerchant } from "@/lib/dashboard-merchant";
import { mockReviews } from "@/lib/mock-data";

export default async function DashboardHomePage() {
  const merchant = await getDashboardMerchant();
  const [overview, invitations] = await Promise.all([
    fetchDashboardOverview(merchant.slug),
    fetchInvitations(merchant.slug, 5),
  ]);

  const hasLiveOverview = overview != null;
  const isEmpty =
    hasLiveOverview &&
    overview.stats.totalReviews === 0 &&
    overview.recentReviews.length === 0;
  const reviews = hasLiveOverview
    ? overview.recentReviews
    : mockReviews;

  return (
    <>
      <DashboardTopbar title="Overview" />
      <main className="space-y-8 bg-bg p-4 md:p-8">
        <DashboardKpiRow stats={overview?.stats} />
        {isEmpty ? (
          <DashboardEmptyState merchantName={merchant.name} />
        ) : (
          <>
            <RatingDistributionChart distribution={overview?.ratingDistribution} />
            <ReviewsTable reviews={reviews} />
          </>
        )}
        <div className="grid gap-8 lg:grid-cols-2">
          <WidgetsPanel />
          <InvitationsList invitations={invitations} />
        </div>
      </main>
    </>
  );
}
