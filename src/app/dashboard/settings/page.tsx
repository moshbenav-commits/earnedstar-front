import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { BillingSubscribeForm } from "@/components/dashboard/billing-subscribe-form";
import { PlanBadge } from "@/components/ui/plan-badge";
import type { PlanId } from "@/lib/plans";
import { fetchDashboardOverview } from "@/lib/earnedstar-server";
import { mockBusiness } from "@/lib/mock-data";

export default async function DashboardSettingsPage() {
  const overview = await fetchDashboardOverview("expediaparts");
  const merchant = overview?.merchant ?? mockBusiness;
  const plan = ((merchant.plan as PlanId) || "growth");

  return (
    <>
      <DashboardTopbar title="Settings" />
      <main className="space-y-8 bg-bg p-4 md:p-8">
        <section className="card-surface gold-seam max-w-2xl p-6">
          <h2 className="text-lg font-bold text-navy">Store profile</h2>
          <p className="mt-1 text-sm text-text-muted">
            Public Review Profile:{" "}
            <a href={`/store/${merchant.slug}`} className="text-navy-light hover:text-gold">
              earnedstar.com/store/{merchant.slug}
            </a>
          </p>
          <dl className="mt-6 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-navy">Business name</dt>
              <dd className="mt-1 text-text-muted">{merchant.name}</dd>
            </div>
            <div>
              <dt className="font-semibold text-navy">Website</dt>
              <dd className="mt-1 text-text-muted">{merchant.website_url ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-navy">Plan</dt>
              <dd className="mt-2">
                <PlanBadge plan={plan} />
              </dd>
            </div>
          </dl>
        </section>

        <BillingSubscribeForm currentPlan={plan} />

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
