/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RunScanButton({ storeId, shop }: { storeId: string; shop: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function runScan() {
    setLoading(true);
    await fetch(`/api/gt-ops/stores/${storeId}/scans`, { method: "POST" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void runScan()}
      disabled={loading}
      className="rounded-lg bg-[#C45C26] px-4 py-2 text-sm font-semibold text-white hover:bg-[#a84d1f] disabled:opacity-50"
    >
      {loading ? "Scanning…" : `Run scan · ${shop}`}
    </button>
  );
}
