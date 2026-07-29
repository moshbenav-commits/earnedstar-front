/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { ComplianceStatusPanel } from "@/components/dashboard/compliance-status-panel";
import { fetchComplianceDashboard } from "@/lib/earnedstar-server";
import { getDashboardMerchant } from "@/lib/dashboard-merchant";

export default async function DashboardCompliancePage() {
  const merchant = await getDashboardMerchant();
  const compliance = await fetchComplianceDashboard(merchant.slug);

  return (
    <>
      <DashboardTopbar title="Compliance log" />
      <main className="space-y-4 bg-bg p-4 md:p-8">
        <ComplianceStatusPanel data={compliance} />
      </main>
    </>
  );
}
