/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ConnectStoreForm() {
  const [shop, setShop] = useState("gotianguis");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/gt-ops/stores/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shop }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Could not connect store");
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="flex flex-wrap items-end gap-3 rounded-xl border border-[#2a1f16] bg-[#1A120C] p-4">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-[#F5EBE0]/70">Shopify shop</span>
        <input
          value={shop}
          onChange={(e) => setShop(e.target.value)}
          className="rounded-lg border border-[#2a1f16] bg-[#0d1217] px-3 py-2 text-[#F5EBE0]"
          placeholder="your-store"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-[#C45C26] px-4 py-2 text-sm font-semibold text-white hover:bg-[#a84d1f] disabled:opacity-50"
      >
        {loading ? "Connecting…" : "Connect store"}
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </form>
  );
}
