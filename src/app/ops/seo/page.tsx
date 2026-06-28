/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { gtOpsFetch } from "@/lib/gt-ops-server";

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

export default async function OpsSeoPage() {
  const { data } = await gtOpsFetch("/seo/issues");
  const issues = (Array.isArray(data) ? data : []) as SeoIssue[];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[#E8A54B]">SEO Ops</h1>
        <p className="mt-1 text-sm text-[#F5EBE0]/70">Page-level metadata and indexing issues from store scans.</p>
      </header>

      <div className="rounded-xl border border-[#2a1f16] bg-[#1A120C]">
        <ul className="divide-y divide-[#2a1f16]">
          {issues.length === 0 ? (
            <li className="p-4 text-sm text-[#F5EBE0]/60">No SEO issues yet — run a store scan first.</li>
          ) : (
            issues.map((i) => (
              <li key={i.id} className="p-4">
                <p className="text-xs uppercase text-[#F5EBE0]/50">
                  {i.page_type} · {i.issue_type.replace(/_/g, " ")}
                </p>
                <p className="mt-1 font-medium">{i.title ?? i.handle ?? "Untitled page"}</p>
                {i.recommendation && <p className="mt-1 text-sm text-[#F5EBE0]/70">{i.recommendation}</p>}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
