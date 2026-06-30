/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { BillingSubscribeForm } from "@/components/dashboard/billing-subscribe-form";
import { IntegrationKeysPanel } from "@/components/dashboard/integration-keys-panel";
import { WidgetEmbedGuide } from "@/components/dashboard/widget-embed-guide";
import { EmailStatusPanel } from "@/components/dashboard/email-status-panel";
import { ProfileSeoForm } from "@/components/dashboard/profile-seo-form";
import { SeoHealthPanel } from "@/components/dashboard/seo-health-panel";
import { PlanBadge } from "@/components/ui/plan-badge";
import type { PlanId } from "@/lib/plans";
import { fetchDashboardOverview } from "@/lib/earnedstar-server";
import { getDashboardMerchant } from "@/lib/dashboard-merchant";

export default async function DashboardSettingsPage() {
  const merchant = await getDashboardMerchant();
  const overview = await fetchDashboardOverview(merchant.slug);
  const profile = overview?.merchant ?? merchant;
  const plan = ((profile.plan as PlanId) || "growth");

  return (
    <>
      <DashboardTopbar title="Settings" />
      <main className="space-y-8 bg-bg p-4 md:p-8">
        <section className="card-surface gold-seam max-w-2xl p-6">
          <h2 className="text-lg font-bold text-navy">Store profile</h2>
          <p className="mt-1 text-sm text-text-muted">
            Public Review Profile:{" "}
            <a href={`/reviews/${profile.slug}`} className="text-navy-light hover:text-gold">
              earnedstar.com/reviews/{profile.slug}
            </a>
          </p>
          <dl className="mt-6 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-navy">Business name</dt>
              <dd className="mt-1 text-text-muted">{profile.name}</dd>
            </div>
            <div>
              <dt className="font-semibold text-navy">Website</dt>
              <dd className="mt-1 text-text-muted">{profile.website_url ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-navy">Plan</dt>
              <dd className="mt-2">
                <PlanBadge plan={plan} />
              </dd>
            </div>
          </dl>
        </section>

        <SeoHealthPanel plan={plan} />

        <ProfileSeoForm
          plan={plan}
          initial={{
            name: profile.name,
            website_url: profile.website_url,
            seo_title: profile.seo_title,
            seo_description: profile.seo_description,
            slug: profile.slug,
          }}
        />

        <BillingSubscribeForm currentPlan={plan} />

        <IntegrationKeysPanel plan={plan} legacyApiKey={profile.api_key} />
        <WidgetEmbedGuide apiKey={profile.api_key} slug={profile.slug} />

        <EmailStatusPanel />

        <section className="card-surface max-w-2xl p-6">
          <h2 className="text-lg font-bold text-navy">Notifications</h2>
          <ul className="mt-4 space-y-3 text-sm text-text-muted">
            <li className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <span>New review submitted</span>
              <span className="text-xs font-semibold text-green-dark">On</span>
            </li>
            <li className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <span>Weekly digest</span>
              <span className="text-xs font-semibold text-text-faint">Coming soon</span>
            </li>
          </ul>
        </section>
      </main>
    </>
  );
}
