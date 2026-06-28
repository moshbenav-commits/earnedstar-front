/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { gtOpsFetch } from "@/lib/gt-ops-server";
import { RunScanButton } from "@/components/ops/run-scan-button";
import { SyncStoreButton } from "@/components/ops/sync-store-button";
import { FindingsPanel } from "@/components/ops/findings-panel";
import { OpsShopifyDeferredBanner } from "@/components/ops/ops-shopify-deferred-banner";
import { CategoryScoreGrid } from "@/components/ops/category-score-grid";
import Link from "next/link";

type Store = { id: string; shop: string; status: string };
type MePayload = { demoCatalog?: boolean; integrations?: { shopify?: { status: string; message?: string } } };
type Scan = { id: string; status: string; created_at: string; finished_at: string | null };
type Finding = {
  id: string;
  title: string;
  severity: string;
  category: string;
  status: string;
  recommendation: string | null;
};

export default async function OpsScannerPage() {
  const [storesRes, meRes, findingsRes, dashRes] = await Promise.all([
    gtOpsFetch("/stores"),
    gtOpsFetch("/me"),
    gtOpsFetch("/findings"),
    gtOpsFetch("/dashboard"),
  ]);
  const stores = (Array.isArray(storesRes.data) ? storesRes.data : []) as Store[];
  const me = meRes.data as MePayload;
  const demoCatalog = me?.demoCatalog === true;
  const primaryStore = stores[0];

  const findings = (Array.isArray(findingsRes.data) ? findingsRes.data : []) as Finding[];
  const dash = dashRes.data as { storeScore?: number | null; categoryScores?: Record<string, number> };

  const scansRes = primaryStore
    ? await gtOpsFetch(`/stores/${primaryStore.id}/scans`)
    : { data: [] };
  const scans = (Array.isArray(scansRes.data) ? scansRes.data : []) as Scan[];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#E8A54B]">Store Gap Scanner</h1>
          <p className="mt-1 text-sm text-[#F5EBE0]/70">
            Audit SEO, content, and data completeness — prioritized findings.
          </p>
        </div>
        {primaryStore && (
          <div className="flex flex-wrap gap-3">
            <SyncStoreButton
              storeId={primaryStore.id}
              shop={primaryStore.shop}
              thenScan
              demoCatalog={demoCatalog}
            />
            <RunScanButton storeId={primaryStore.id} shop={primaryStore.shop} />
          </div>
        )}
      </header>

      <OpsShopifyDeferredBanner me={me} />

      {(dash.storeScore != null || Object.keys(dash.categoryScores ?? {}).length > 0) && (
        <section className="rounded-xl border border-[#2a1f16] bg-[#1A120C] p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#E8A54B]">Store health</h2>
            {dash.storeScore != null && (
              <span className="text-lg font-semibold text-[#F5EBE0]">{dash.storeScore}/100</span>
            )}
          </div>
          <div className="mt-3">
            <CategoryScoreGrid scores={dash.categoryScores ?? {}} />
          </div>
        </section>
      )}

      {!primaryStore && (
        <p className="rounded-lg border border-[#C45C26]/40 bg-[#C45C26]/10 p-4 text-sm">
          Demo store is initializing — refresh shortly or open{" "}
          <a href="/ops/stores" className="underline">
            Stores
          </a>
          .
        </p>
      )}

      <FindingsPanel findings={findings} />

      <div className="rounded-xl border border-[#2a1f16] bg-[#1A120C]">
        <h2 className="border-b border-[#2a1f16] p-4 text-sm font-semibold uppercase tracking-wide text-[#E8A54B]">
          Scan history ({scans.length})
        </h2>
        <ul className="divide-y divide-[#2a1f16]">
          {scans.length === 0 ? (
            <li className="p-4 text-sm text-[#F5EBE0]/60">No completed scans yet.</li>
          ) : (
            scans.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
                <Link href={`/ops/scans/${s.id}`} className="font-mono text-[#E8A54B] hover:underline">
                  {s.id.slice(0, 8)}…
                </Link>
                <span className="capitalize text-[#F5EBE0]/70">{s.status}</span>
                <span className="text-xs text-[#F5EBE0]/50">{new Date(s.created_at).toLocaleString()}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
