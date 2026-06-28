/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { gtOpsFetch } from "@/lib/gt-ops-server";
import { OpsShopifyDeferredBanner } from "@/components/ops/ops-shopify-deferred-banner";

type MePayload = {
  email?: string;
  role?: string;
  demoCatalog?: boolean;
  integrations?: { shopify?: { status: string; message?: string } };
  organization?: { name: string; slug: string; plan: string };
  modules?: string[];
};

export default async function OpsSettingsPage() {
  const { data } = await gtOpsFetch("/me");
  const me = data as MePayload;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[#E8A54B]">Settings</h1>
        <p className="mt-1 text-sm text-[#F5EBE0]/70">Organization and module access.</p>
      </header>

      <OpsShopifyDeferredBanner me={me} />

      <section className="rounded-xl border border-[#2a1f16] bg-[#1A120C] p-4 space-y-3 text-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#E8A54B]">Integrations</h2>
        <dl className="grid gap-2 sm:grid-cols-[140px_1fr]">
          <dt className="text-[#F5EBE0]/60">Shopify</dt>
          <dd className="capitalize">{me?.integrations?.shopify?.status ?? "unknown"}</dd>
          <dt className="text-[#F5EBE0]/60">Catalog</dt>
          <dd>{me?.demoCatalog ? "Demo catalog (built-in)" : "Live Shopify Admin API"}</dd>
        </dl>
      </section>

      <section className="rounded-xl border border-[#2a1f16] bg-[#1A120C] p-4 space-y-2 text-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#E8A54B]">Organization</h2>
        <p>{me?.organization?.name ?? "—"}</p>
        <p className="text-[#F5EBE0]/60">
          {me?.email} · {me?.role?.replace(/_/g, " ")}
        </p>
        <p className="text-xs text-[#F5EBE0]/50">Modules: {(me?.modules ?? []).join(", ")}</p>
      </section>
    </div>
  );
}
