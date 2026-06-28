/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function FindingActionButtons({ findingId }: { findingId: string }) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  async function act(action: "accept" | "ignore") {
    setLoading(action);
    await fetch(`/api/gt-ops/findings/${findingId}/${action}`, { method: "POST" });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => void act("accept")}
        disabled={loading !== null}
        className="rounded border border-green-700/40 px-2 py-1 text-xs text-green-300 hover:bg-green-900/20 disabled:opacity-50"
      >
        {loading === "accept" ? "…" : "Accept"}
      </button>
      <button
        type="button"
        onClick={() => void act("ignore")}
        disabled={loading !== null}
        className="rounded border border-[#F5EBE0]/20 px-2 py-1 text-xs text-[#F5EBE0]/70 hover:bg-[#F5EBE0]/5 disabled:opacity-50"
      >
        {loading === "ignore" ? "…" : "Ignore"}
      </button>
    </div>
  );
}
