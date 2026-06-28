/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { gtOpsFetch } from "@/lib/gt-ops-server";
import { RunScanButton } from "@/components/ops/run-scan-button";

type Store = { id: string; shop: string; status: string };
type Finding = {
  id: string;
  title: string;
  severity: string;
  category: string;
  status: string;
  recommendation: string | null;
};

export default async function OpsScannerPage() {
  const storesRes = await gtOpsFetch("/stores");
  const stores = (Array.isArray(storesRes.data) ? storesRes.data : []) as Store[];
  const primaryStore = stores[0];

  const findingsRes = await gtOpsFetch("/findings");
  const findings = (Array.isArray(findingsRes.data) ? findingsRes.data : []) as Finding[];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#E8A54B]">Store Gap Scanner</h1>
          <p className="mt-1 text-sm text-[#F5EBE0]/70">
            Audit SEO, content, and data completeness — prioritized findings.
          </p>
        </div>
        {primaryStore && <RunScanButton storeId={primaryStore.id} shop={primaryStore.shop} />}
      </header>

      {!primaryStore && (
        <p className="rounded-lg border border-[#C45C26]/40 bg-[#C45C26]/10 p-4 text-sm">
          Connect a store first on the <a href="/ops/stores" className="underline">Stores</a> page.
        </p>
      )}

      <div className="rounded-xl border border-[#2a1f16] bg-[#1A120C]">
        <h2 className="border-b border-[#2a1f16] p-4 text-sm font-semibold uppercase tracking-wide text-[#E8A54B]">
          Open findings ({findings.length})
        </h2>
        <ul className="divide-y divide-[#2a1f16]">
          {findings.length === 0 ? (
            <li className="p-4 text-sm text-[#F5EBE0]/60">Run a scan to surface store gaps.</li>
          ) : (
            findings.map((f) => (
              <li key={f.id} className="p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <SeverityBadge severity={f.severity} />
                  <span className="text-xs uppercase text-[#F5EBE0]/50">{f.category}</span>
                </div>
                <p className="mt-1 font-medium">{f.title}</p>
                {f.recommendation && <p className="mt-1 text-sm text-[#F5EBE0]/70">{f.recommendation}</p>}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    critical: "bg-red-900/50 text-red-300",
    high: "bg-orange-900/40 text-orange-200",
    medium: "bg-yellow-900/30 text-yellow-200",
    low: "bg-blue-900/30 text-blue-200",
    info: "bg-gray-800 text-gray-300",
  };
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-semibold uppercase ${colors[severity] ?? colors.info}`}>
      {severity}
    </span>
  );
}
