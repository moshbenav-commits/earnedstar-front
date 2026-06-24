/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { ShopifyConnectPanel } from "@/components/dashboard/shopify-connect-panel";

export default function IntegrationsPage() {
  return (
    <>
      <DashboardTopbar title="Integrations" />
      <main className="space-y-8 bg-bg p-4 md:p-8">
        <p className="text-sm text-text-muted">
          Connect your storefront so EarnedStar can send invitations automatically after purchase.
        </p>
        <ShopifyConnectPanel />
      </main>
    </>
  );
}
