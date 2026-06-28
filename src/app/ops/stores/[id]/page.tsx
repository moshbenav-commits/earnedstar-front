/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { gtOpsFetch } from "@/lib/gt-ops-server";
import { OpsShopifyDeferredBanner } from "@/components/ops/ops-shopify-deferred-banner";
import { SyncStoreButton } from "@/components/ops/sync-store-button";
import Link from "next/link";

type StoreDetail = {
  store: {
    id: string;
    shop: string;
    display_name: string | null;
    status: string;
    last_sync_at: string | null;
  };
  productCount: number;
  pageCount: number;
  collectionCount: number;
  installedApps: { id: string; name: string; category: string; overlap_risk: string }[];
  lastScan: { id: string; status: string; created_at: string } | null;
  demoCatalog: boolean;
};

type MePayload = { demoCatalog?: boolean; integrations?: { shopify?: { status: string; message?: string } } };

export default async function OpsStoreDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [detailRes, meRes] = await Promise.all([gtOpsFetch(`/stores/${id}`), gtOpsFetch("/me")]);
  const detail = detailRes.data as StoreDetail;
  const me = meRes.data as MePayload;

  if (!detail?.store) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <p className="text-[#F5EBE0]/70">Store not found.</p>
        <Link href="/ops/stores" className="mt-4 inline-block text-[#C45C26] hover:underline">
          ← Stores
        </Link>
      </div>
    );
  }

  const { store } = detail;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <Link href="/ops/stores" className="text-sm text-[#C45C26] hover:underline">
          ← Stores
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-[#E8A54B]">{store.display_name ?? store.shop}</h1>
        <p className="mt-1 font-mono text-sm text-[#F5EBE0]/60">{store.shop}</p>
      </header>

      <OpsShopifyDeferredBanner me={me} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Products" value={String(detail.productCount)} />
        <Stat label="Pages" value={String(detail.pageCount)} />
        <Stat label="Collections" value={String(detail.collectionCount)} />
        <Stat label="Status" value={store.status.replace(/_/g, " ")} />
      </div>

      <section className="rounded-xl border border-[#2a1f16] bg-[#1A120C] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#E8A54B]">Catalog sync</h2>
          <SyncStoreButton
            storeId={store.id}
            shop={store.shop}
            label={detail.demoCatalog ? "Reload demo" : "Sync"}
            demoCatalog={detail.demoCatalog}
          />
        </div>
        <p className="mt-2 text-sm text-[#F5EBE0]/60">
          Last sync: {store.last_sync_at ? new Date(store.last_sync_at).toLocaleString() : "Never"}
        </p>
        {detail.lastScan && (
          <p className="mt-1 text-sm text-[#F5EBE0]/60">
            Last scan:{" "}
            <Link href={`/ops/scans/${detail.lastScan.id}`} className="text-[#E8A54B] hover:underline">
              {detail.lastScan.id.slice(0, 8)}…
            </Link>{" "}
            ({detail.lastScan.status})
          </p>
        )}
      </section>

      <section className="rounded-xl border border-[#2a1f16] bg-[#1A120C] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#E8A54B]">Installed apps</h2>
        <ul className="mt-4 divide-y divide-[#2a1f16] text-sm">
          {detail.installedApps.length === 0 ? (
            <li className="py-2 text-[#F5EBE0]/60">No apps detected yet.</li>
          ) : (
            detail.installedApps.map((app) => (
              <li key={app.id} className="flex flex-wrap justify-between gap-2 py-3">
                <span className="font-medium">{app.name}</span>
                <span className="text-[#F5EBE0]/60">
                  {app.category} · overlap {app.overlap_risk}
                </span>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#2a1f16] bg-[#1A120C] p-4">
      <p className="text-xs uppercase tracking-wide text-[#F5EBE0]/60">{label}</p>
      <p className="mt-2 text-xl font-semibold capitalize text-[#F5EBE0]">{value}</p>
    </div>
  );
}
