/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { PlanUsageBanner } from "@/components/dashboard/plan-usage-banner";
import { ReviewRequestCampaigns } from "@/components/dashboard/review-request-campaigns";
import { fetchInvitations } from "@/lib/earnedstar-server";
import { getDashboardMerchant } from "@/lib/dashboard-merchant";

function invitationsThisMonth(invitations: { sent_at?: string }[]) {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  return invitations.filter((row) => {
    if (!row.sent_at) return false;
    return new Date(row.sent_at) >= start;
  }).length;
}

export default async function DashboardInvitationsPage() {
  const merchant = await getDashboardMerchant();
  const invitations = await fetchInvitations(merchant.slug, 100);
  const monthlyUsed = invitationsThisMonth(invitations);

  return (
    <>
      <DashboardTopbar title="Review requests" />
      <main className="space-y-4 bg-bg p-4 md:p-8">
        <PlanUsageBanner plan={merchant.plan} used={monthlyUsed} />
        <ReviewRequestCampaigns
          merchantSlug={merchant.slug}
          merchantName={merchant.name}
          invitations={invitations}
          plan={merchant.plan}
        />
      </main>
    </>
  );
}
