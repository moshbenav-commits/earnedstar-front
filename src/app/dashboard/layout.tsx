/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { EarnedStarTrustBanner } from "@/components/dashboard/earned-star-trust-banner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <DashboardSidebar />
      <div className="md:ml-60">
        <EarnedStarTrustBanner />
        {children}
      </div>
    </div>
  );
}
