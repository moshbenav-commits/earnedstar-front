/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import { useMemo, useState } from "react";
import { SeoIssueActions } from "@/components/ops/seo-issue-actions";

export type SeoIssueRow = {
  id: string;
  page_type: string;
  handle: string | null;
  title: string | null;
  issue_type: string;
  severity: string;
  status: string;
  recommendation: string | null;
};

export function SeoIssuesPanel({ issues }: { issues: SeoIssueRow[] }) {
  const [severity, setSeverity] = useState("all");
  const [pageType, setPageType] = useState("all");
  const [status, setStatus] = useState("open");

  const pageTypes = useMemo(
    () => [...new Set(issues.map((i) => i.page_type))].sort(),
    [issues],
  );

  const filtered = issues.filter((i) => {
    if (status !== "all" && i.status !== status) return false;
    if (severity !== "all" && i.severity !== severity) return false;
    if (pageType !== "all" && i.page_type !== pageType) return false;
    return true;
  });

  return (
    <section className="rounded-xl border border-[#2a1f16] bg-[#1A120C]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2a1f16] p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#E8A54B]">
          Page issues ({filtered.length})
        </h2>
        <div className="flex flex-wrap gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-[#2a1f16] bg-[#0f0a07] px-2 py-1 text-xs text-[#F5EBE0]"
          >
            <option value="open">Open</option>
            <option value="all">All statuses</option>
            <option value="fixed">Fixed</option>
          </select>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="rounded-lg border border-[#2a1f16] bg-[#0f0a07] px-2 py-1 text-xs text-[#F5EBE0]"
          >
            <option value="all">All severities</option>
            {["critical", "high", "medium", "low", "info"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={pageType}
            onChange={(e) => setPageType(e.target.value)}
            className="rounded-lg border border-[#2a1f16] bg-[#0f0a07] px-2 py-1 text-xs text-[#F5EBE0]"
          >
            <option value="all">All page types</option>
            {pageTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
      <ul className="divide-y divide-[#2a1f16]">
        {filtered.length === 0 ? (
          <li className="p-4 text-sm text-[#F5EBE0]/60">No issues match filters.</li>
        ) : (
          filtered.map((i) => (
            <li key={i.id} className="flex flex-wrap items-start justify-between gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase text-[#F5EBE0]/50">
                  {i.page_type} · {i.issue_type.replace(/_/g, " ")} · {i.severity}
                </p>
                <p className="mt-1 font-medium">{i.title ?? i.handle ?? "Untitled page"}</p>
                {i.recommendation && <p className="mt-1 text-sm text-[#F5EBE0]/70">{i.recommendation}</p>}
              </div>
              <SeoIssueActions issueId={i.id} status={i.status} />
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
