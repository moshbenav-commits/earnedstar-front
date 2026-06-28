/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import { useMemo, useState } from "react";
import { CreateTaskFromFindingButton } from "@/components/ops/create-task-from-finding-button";
import { FindingActionButtons } from "@/components/ops/finding-action-buttons";

export type FindingRow = {
  id: string;
  title: string;
  severity: string;
  category: string;
  status: string;
  recommendation: string | null;
};

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

export function FindingsPanel({ findings }: { findings: FindingRow[] }) {
  const [severity, setSeverity] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const categories = useMemo(
    () => [...new Set(findings.map((f) => f.category))].sort(),
    [findings],
  );

  const filtered = findings.filter((f) => {
    if (severity !== "all" && f.severity !== severity) return false;
    if (category !== "all" && f.category !== category) return false;
    return f.status === "open" || f.status === "accepted";
  });

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function bulkCreateTasks() {
    if (selected.size === 0) return;
    setBulkLoading(true);
    await fetch("/api/gt-ops/tasks/bulk-from-findings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ findingIds: [...selected] }),
    });
    setBulkLoading(false);
    setSelected(new Set());
    window.location.reload();
  }

  return (
    <div className="rounded-xl border border-[#2a1f16] bg-[#1A120C]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2a1f16] p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#E8A54B]">
          Open findings ({filtered.length})
        </h2>
        <div className="flex flex-wrap items-center gap-2">
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
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-[#2a1f16] bg-[#0f0a07] px-2 py-1 text-xs text-[#F5EBE0]"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          {selected.size > 0 && (
            <button
              type="button"
              onClick={() => void bulkCreateTasks()}
              disabled={bulkLoading}
              className="rounded-lg bg-[#C45C26] px-3 py-1 text-xs font-semibold text-white disabled:opacity-50"
            >
              {bulkLoading ? "Creating…" : `Create ${selected.size} tasks`}
            </button>
          )}
        </div>
      </div>
      <ul className="divide-y divide-[#2a1f16]">
        {filtered.length === 0 ? (
          <li className="p-4 text-sm text-[#F5EBE0]/60">No findings match filters — run a scan first.</li>
        ) : (
          filtered.map((f) => (
            <li key={f.id} className="p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={selected.has(f.id)}
                  onChange={() => toggle(f.id)}
                  className="mt-1"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <SeverityBadge severity={f.severity} />
                    <span className="text-xs uppercase text-[#F5EBE0]/50">{f.category}</span>
                  </div>
                  <p className="mt-1 font-medium">{f.title}</p>
                  {f.recommendation && (
                    <p className="mt-1 text-sm text-[#F5EBE0]/70">{f.recommendation}</p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <CreateTaskFromFindingButton findingId={f.id} />
                  </div>
                  <FindingActionButtons findingId={f.id} />
                </div>
              </label>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
