/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { gtOpsFetch } from "@/lib/gt-ops-server";
import { SyncStoreButton } from "@/components/ops/sync-store-button";
import { OpsShopifyDeferredBanner } from "@/components/ops/ops-shopify-deferred-banner";

type Store = {
  id: string;
  shop: string;
  display_name: string | null;
  status: string;
  last_sync_at: string | null;
};

type MePayload = { demoCatalog?: boolean; integrations?: { shopify?: { status: string; message?: string } } };

export default async function OpsStoresPage() {
  const [storesRes, meRes] = await Promise.all([gtOpsFetch("/stores"), gtOpsFetch("/me")]);
  const stores = (Array.isArray(storesRes.data) ? storesRes.data : []) as Store[];
  const me = meRes.data as MePayload;
  const demoCatalog = me?.demoCatalog === true;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[#E8A54B]">Stores</h1>
        <p className="mt-1 text-sm text-[#F5EBE0]/70">
          {demoCatalog
            ? "Demo catalog for scanner and SEO ops — live Shopify connects later via Go Tianguis."
            : "Connected Shopify stores for auditing."}
        </p>
      </header>

      <OpsShopifyDeferredBanner me={me} />

      <div className="rounded-xl border border-[#2a1f16] bg-[#1A120C]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#2a1f16] text-[#F5EBE0]/60">
              <th className="p-4">Shop</th>
              <th className="p-4">Status</th>
              <th className="p-4">Last sync</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-[#F5EBE0]/60">
                  Demo store will appear on first visit — load demo catalog to start.
                </td>
              </tr>
            ) : (
              stores.map((s) => (
                <tr key={s.id} className="border-b border-[#2a1f16] last:border-0">
                  <td className="p-4 font-medium">{s.display_name ?? s.shop}</td>
                  <td className="p-4 capitalize">{s.status.replace(/_/g, " ")}</td>
                  <td className="p-4 text-[#F5EBE0]/70">{s.last_sync_at ?? "Never"}</td>
                  <td className="p-4">
                    <SyncStoreButton
                      storeId={s.id}
                      shop={s.shop}
                      label={demoCatalog ? "Load demo" : "Sync"}
                      demoCatalog={demoCatalog}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
