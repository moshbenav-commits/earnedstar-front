/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { LoyaltyReferralsPanel } from "@/components/dashboard/loyalty-referrals-panel";
import type { PlanId } from "@/lib/plans";
import { PLAN_LIMITS } from "@/lib/plans";
import { getDashboardMerchant } from "@/lib/dashboard-merchant";

export default async function DashboardLoyaltyPage() {
  const merchant = await getDashboardMerchant();
  const plan = (merchant.plan as PlanId) || "growth";
  const planLocked = !PLAN_LIMITS[plan].referrals;

  return (
    <>
      <DashboardTopbar title="Loyalty & Referrals" />
      <main className="bg-bg p-4 md:p-8">
        <LoyaltyReferralsPanel planLocked={planLocked} />
      </main>
    </>
  );
}
