/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { SyndicationPanel } from "@/components/dashboard/syndication-panel";
import { PLAN_LIMITS, type PlanId } from "@/lib/plans";
import { getDashboardMerchant } from "@/lib/dashboard-merchant";

export default async function SyndicationPage() {
  const merchant = await getDashboardMerchant();
  const plan = (merchant.plan as PlanId) || "growth";
  const canSyndicate = PLAN_LIMITS[plan].syndication;

  return (
    <>
      <DashboardTopbar title="Syndication" />
      <main className="space-y-8 bg-bg p-4 md:p-8">
        <p className="text-sm text-text-muted">
          Export verified reviews to Google, Trustpilot, and CSV.
        </p>
        <SyndicationPanel
          merchantSlug={merchant.slug}
          apiKey={merchant.api_key}
          canSyndicate={canSyndicate}
        />
      </main>
    </>
  );
}
