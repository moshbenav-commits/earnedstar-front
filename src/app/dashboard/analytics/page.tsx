/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { RatingDistributionChart } from "@/components/dashboard/rating-distribution";
import { DashboardKpiRow } from "@/components/dashboard/dashboard-kpi-row";
import {
  InvitationTrendChart,
  ReviewVelocityChart,
  SentimentBreakdown,
} from "@/components/dashboard/analytics-charts";
import { Button } from "@/components/ui/button";
import { fetchAnalytics, fetchDashboardOverview } from "@/lib/earnedstar-server";
import { getDashboardMerchant } from "@/lib/dashboard-merchant";

export default async function AnalyticsPage() {
  const merchant = await getDashboardMerchant();
  const overview = await fetchDashboardOverview(merchant.slug);
  const isGrowth = ["growth", "pro", "agency"].includes(merchant.plan);

  if (!isGrowth) {
    return (
      <>
        <DashboardTopbar title="Analytics" />
        <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center p-8">
          <div className="glow-growth card-surface max-w-md p-8 text-center">
            <h2 className="text-xl font-semibold text-navy">Analytics are a Growth feature</h2>
            <p className="mt-4 text-sm text-text-muted">
              See exactly which products have review gaps, which reviews drive the most conversions, and how your
              sentiment score trends over time.
            </p>
            <Button className="mt-6" href="/dashboard/settings">
              Upgrade to Growth — $99/mo
            </Button>
          </div>
        </main>
      </>
    );
  }

  const analytics = await fetchAnalytics(merchant.slug);

  return (
    <>
      <DashboardTopbar title="Analytics" />
      <main className="space-y-8 bg-bg p-4 md:p-8">
        <p className="text-sm text-text-muted">Performance snapshot for {merchant.name}.</p>
        <DashboardKpiRow stats={overview?.stats} />
        {analytics ? (
          <>
            <div className="grid gap-8 lg:grid-cols-2">
              <InvitationTrendChart data={analytics.invitationTrend} />
              <ReviewVelocityChart data={analytics.reviewVelocity} />
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              <RatingDistributionChart distribution={overview?.ratingDistribution} />
              <SentimentBreakdown sentiment={analytics.sentiment} />
            </div>
          </>
        ) : (
          <RatingDistributionChart distribution={overview?.ratingDistribution} />
        )}
      </main>
    </>
  );
}
