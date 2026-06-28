/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { gtOpsClient } from "@/lib/gt-ops-client";

export function SeoIssueActions({ issueId, status }: { issueId: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  if (status !== "open") {
    return <span className="text-xs capitalize text-[#F5EBE0]/50">{status}</span>;
  }

  async function markFixed() {
    setBusy(true);
    await gtOpsClient(`/seo/issues/${issueId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "fixed" }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => void markFixed()}
      className="rounded-lg border border-[#C45C26]/50 px-2 py-1 text-xs text-[#E8A54B] hover:bg-[#C45C26]/10 disabled:opacity-50"
    >
      {busy ? "Saving…" : "Mark fixed"}
    </button>
  );
}
