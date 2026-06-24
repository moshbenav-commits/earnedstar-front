/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { WidgetBuilder, type SavedWidget } from "@/components/dashboard/widget-builder";
import {
  EarnedStarPhotoBadge,
  EarnedStarPhotoBadgeVariants,
} from "@/components/brand/earnedstar-photo-badge";
import { EarnedStarBadge } from "@/components/ui/earnedstar-badge";
import { getApiBase } from "@/lib/api";
import { authHeaders } from "@/lib/auth-server";
import { DEMO_MERCHANT_LOGO_URL } from "@/lib/brand-assets";
import { getDashboardMerchant } from "@/lib/dashboard-merchant";

async function fetchWidgets(): Promise<SavedWidget[]> {
  try {
    const res = await fetch(`${getApiBase()}/earnedstar/widgets`, {
      headers: { ...(await authHeaders()) },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as SavedWidget[];
  } catch {
    return [];
  }
}

export default async function WidgetsPage() {
  const merchant = await getDashboardMerchant();
  const widgets = await fetchWidgets();
  const previewLogo = merchant.logo_url ?? DEMO_MERCHANT_LOGO_URL;

  return (
    <>
      <DashboardTopbar title="Widgets" />
      <main className="space-y-8 bg-bg p-4 md:p-8">
        <div>
          <h1 className="text-xl font-bold text-navy">Embeddable Review Widgets</h1>
          <p className="mt-1 text-sm text-text-muted">
            Copy the code below and paste it anywhere on your website.
          </p>
        </div>

        <WidgetBuilder initialWidgets={widgets} apiKey={merchant.api_key} plan={merchant.plan} />

        <section className="card-surface p-6">
          <h2 className="text-lg font-bold text-navy">Origami badge variants (ES-AC-07)</h2>
          <div className="mt-6 flex flex-wrap gap-4">
            <EarnedStarBadge variant="pill" />
            <EarnedStarBadge variant="card" merchantName={merchant.name} />
            <EarnedStarBadge variant="stamp" />
            <EarnedStarBadge variant="dark" />
          </div>
        </section>

        <section className="card-surface p-6">
          <h2 className="text-lg font-bold text-navy">Lucky-star badge — color variants</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Navy, gold, and white lucky-star marks with your logo in the center medallion.
          </p>
          <div className="mt-6">
            <EarnedStarPhotoBadgeVariants size={96} logoUrl={previewLogo} />
          </div>
          <div className="mt-8">
            <EarnedStarPhotoBadge variant="navy" size={128} logoUrl={previewLogo} />
          </div>
        </section>
      </main>
    </>
  );
}
