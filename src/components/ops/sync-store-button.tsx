/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SyncResult = {
  status: string;
  products?: number;
  collections?: number;
  pages?: number;
  error?: string;
};

export function SyncStoreButton({
  storeId,
  shop,
  label,
  thenScan = false,
  demoCatalog = false,
}: {
  storeId: string;
  shop: string;
  label?: string;
  thenScan?: boolean;
  demoCatalog?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function sync() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/gt-ops/stores/${storeId}/sync`, { method: "POST" });
      const data = (await res.json()) as SyncResult;
      if (!res.ok || data.status === "failed") {
        setMessage(data.error ?? "Sync failed");
        return;
      }
      const summary = `${data.products ?? 0} products · ${data.collections ?? 0} collections`;
      if (thenScan) {
        await fetch(`/api/gt-ops/stores/${storeId}/scans`, { method: "POST" });
        setMessage(
          demoCatalog
            ? `Demo catalog loaded (${summary}) — scan complete.`
            : `Synced (${summary}) and scan started.`,
        );
      } else {
        setMessage(demoCatalog ? `Demo catalog loaded: ${summary}` : `Synced: ${summary}`);
      }
      router.refresh();
    } catch {
      setMessage("Sync request failed");
    } finally {
      setLoading(false);
    }
  }

  const defaultLabel = demoCatalog
    ? thenScan
      ? "Load demo & scan"
      : "Load demo catalog"
    : thenScan
      ? `Sync & scan · ${shop}`
      : `Sync catalog · ${shop}`;

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => void sync()}
        disabled={loading}
        className="rounded-lg border border-[#E8A54B]/40 bg-[#E8A54B]/10 px-4 py-2 text-sm font-semibold text-[#E8A54B] hover:bg-[#E8A54B]/20 disabled:opacity-50"
      >
        {loading ? (demoCatalog ? "Loading…" : "Syncing…") : (label ?? defaultLabel)}
      </button>
      {message && <p className="text-xs text-[#F5EBE0]/70">{message}</p>}
    </div>
  );
}
