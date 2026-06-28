/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { gtOpsFetch } from "@/lib/gt-ops-server";
import { SeoIssuesPanel } from "@/components/ops/seo-issues-panel";
import { OpsShopifyDeferredBanner } from "@/components/ops/ops-shopify-deferred-banner";

type SeoIssue = {
  id: string;
  page_type: string;
  handle: string | null;
  title: string | null;
  issue_type: string;
  severity: string;
  status: string;
  recommendation: string | null;
};

type IndexRecord = {
  id: string;
  url: string;
  index_status: string;
  last_checked_at: string | null;
  notes: string | null;
};

type MePayload = { demoCatalog?: boolean; integrations?: { shopify?: { status: string; message?: string } } };

const INDEX_STATUS_LABELS: Record<string, string> = {
  unknown: "Unknown",
  request_needed: "Request needed",
  requested: "Requested",
  indexed: "Indexed",
  excluded: "Excluded",
  error: "Error",
};

export default async function OpsSeoPage() {
  const [issuesRes, indexingRes, meRes] = await Promise.all([
    gtOpsFetch("/seo/issues"),
    gtOpsFetch("/seo/indexing"),
    gtOpsFetch("/me"),
  ]);
  const issues = (Array.isArray(issuesRes.data) ? issuesRes.data : []) as SeoIssue[];
  const indexing = (Array.isArray(indexingRes.data) ? indexingRes.data : []) as IndexRecord[];
  const me = meRes.data as MePayload;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[#E8A54B]">SEO Ops</h1>
        <p className="mt-1 text-sm text-[#F5EBE0]/70">Metadata issues and indexing visibility from store scans.</p>
      </header>

      <OpsShopifyDeferredBanner me={me} />

      <SeoIssuesPanel issues={issues} />

      <section className="rounded-xl border border-[#2a1f16] bg-[#1A120C]">
        <h2 className="border-b border-[#2a1f16] p-4 text-sm font-semibold uppercase tracking-wide text-[#E8A54B]">
          Indexing tracker ({indexing.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#2a1f16] text-[#F5EBE0]/60">
                <th className="p-4">URL</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last checked</th>
                <th className="p-4">Notes</th>
              </tr>
            </thead>
            <tbody>
              {indexing.map((row) => (
                <tr key={row.id} className="border-b border-[#2a1f16] last:border-0">
                  <td className="max-w-xs truncate p-4 font-mono text-xs text-[#F5EBE0]/80">{row.url}</td>
                  <td className="p-4">{INDEX_STATUS_LABELS[row.index_status] ?? row.index_status}</td>
                  <td className="p-4 text-[#F5EBE0]/70">
                    {row.last_checked_at ? new Date(row.last_checked_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="p-4 text-[#F5EBE0]/60">{row.notes ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
