/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import { useState } from "react";
import { gtOpsClient } from "@/lib/gt-ops-client";

export function ExportActionPlanButton() {
  const [busy, setBusy] = useState(false);

  async function exportPlan() {
    setBusy(true);
    const { ok, data } = await gtOpsClient("/export/action-plan");
    setBusy(false);
    if (!ok) return;
    const payload = data as { markdown?: string };
    const blob = new Blob([payload.markdown ?? ""], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gotianguis-action-plan-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => void exportPlan()}
      className="rounded-lg border border-[#E8A54B]/40 px-4 py-2 text-sm font-medium text-[#E8A54B] hover:bg-[#E8A54B]/10 disabled:opacity-50"
    >
      {busy ? "Exporting…" : "Export action plan"}
    </button>
  );
}
