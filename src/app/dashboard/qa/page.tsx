import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { QaPanel } from "@/components/dashboard/qa-panel";
import type { PlanId } from "@/lib/plans";
import { PLAN_LIMITS } from "@/lib/plans";
import { getDashboardMerchant } from "@/lib/dashboard-merchant";

export default async function DashboardQaPage() {
  const merchant = await getDashboardMerchant();
  const plan = ((merchant.plan as PlanId) || "growth");
  const planLocked = !PLAN_LIMITS[plan].qa_module;

  return (
    <>
      <DashboardTopbar title="Q&A SEO" />
      <main className="bg-bg p-4 md:p-8">
        <QaPanel planLocked={planLocked} />
      </main>
    </>
  );
}
