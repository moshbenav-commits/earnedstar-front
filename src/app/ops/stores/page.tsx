/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { gtOpsFetch } from "@/lib/gt-ops-server";
import { ConnectStoreForm } from "@/components/ops/connect-store-form";

type Store = {
  id: string;
  shop: string;
  display_name: string | null;
  status: string;
  last_sync_at: string | null;
};

export default async function OpsStoresPage() {
  const { data } = await gtOpsFetch("/stores");
  const stores = (Array.isArray(data) ? data : []) as Store[];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[#E8A54B]">Stores</h1>
        <p className="mt-1 text-sm text-[#F5EBE0]/70">Connected Shopify stores for auditing.</p>
      </header>

      <ConnectStoreForm />

      <div className="rounded-xl border border-[#2a1f16] bg-[#1A120C]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#2a1f16] text-[#F5EBE0]/60">
              <th className="p-4">Shop</th>
              <th className="p-4">Status</th>
              <th className="p-4">Last sync</th>
            </tr>
          </thead>
          <tbody>
            {stores.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-[#F5EBE0]/60">
                  No stores connected yet.
                </td>
              </tr>
            ) : (
              stores.map((s) => (
                <tr key={s.id} className="border-b border-[#2a1f16] last:border-0">
                  <td className="p-4 font-medium">{s.shop}</td>
                  <td className="p-4 capitalize">{s.status.replace(/_/g, " ")}</td>
                  <td className="p-4 text-[#F5EBE0]/70">{s.last_sync_at ?? "Never"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
