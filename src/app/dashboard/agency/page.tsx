import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { AgencyClientsPanel } from "@/components/dashboard/agency-clients-panel";
import { Button } from "@/components/ui/button";
import { getApiBase } from "@/lib/api";
import { authHeaders } from "@/lib/auth-server";
import { getDashboardMerchant } from "@/lib/dashboard-merchant";

async function fetchClients() {
  try {
    const res = await fetch(`${getApiBase()}/earnedstar/agency/clients`, {
      headers: { ...(await authHeaders()) },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as Array<{
      id: string;
      name: string;
      slug: string;
      review_count: number;
      avg_rating: number;
    }>;
  } catch {
    return [];
  }
}

export default async function AgencyPage() {
  const merchant = await getDashboardMerchant();

  if (merchant.plan !== "agency") {
    return (
      <>
        <DashboardTopbar title="Agency" />
        <main className="flex min-h-[50vh] items-center justify-center p-8">
          <section className="card-surface max-w-md p-8 text-center">
            <h2 className="text-xl font-bold text-navy">Agency white-label</h2>
            <p className="mt-3 text-sm text-text-muted">
              Manage up to 25 client stores under your brand on the Agency plan.
            </p>
            <Button className="mt-6" href="/dashboard/settings">Upgrade to Agency</Button>
          </section>
        </main>
      </>
    );
  }

  const clients = await fetchClients();

  return (
    <>
      <DashboardTopbar title="Agency clients" />
      <main className="space-y-8 bg-bg p-4 md:p-8">
        <p className="text-sm text-text-muted">White-label sub-accounts for {merchant.name}.</p>
        <AgencyClientsPanel initialClients={clients} />
      </main>
    </>
  );
}
