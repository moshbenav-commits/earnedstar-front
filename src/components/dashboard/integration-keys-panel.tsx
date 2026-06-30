/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { canAccessAnalytics } from "@/lib/plan-enforcement";

type IntegrationKey = {
  id: string;
  label: string;
  key_prefix: string;
  created_at: string;
  plain_key?: string;
};

export function IntegrationKeysPanel({ plan, legacyApiKey }: { plan: string; legacyApiKey?: string | null }) {
  const gated = !canAccessAnalytics(plan);
  const [keys, setKeys] = useState<IntegrationKey[]>([]);
  const [label, setLabel] = useState("");
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayKey = revealedKey ?? legacyApiKey ?? keys[0]?.key_prefix ?? "es_live_…";

  useEffect(() => {
    if (gated) return;
    fetch("/api/earnedstar/integrations/api-keys")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setKeys(Array.isArray(data) ? data : []))
      .catch(() => undefined);
  }, [gated]);

  async function handleMint(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/earnedstar/integrations/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: label.trim() || "Default" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error((data as { message?: string }).message ?? "Could not create key");
      const row = data as IntegrationKey;
      if (row.plain_key) setRevealedKey(row.plain_key);
      setKeys((prev) => [...prev, row]);
      setLabel("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleRevoke(id: string) {
    setLoading(true);
    try {
      await fetch(`/api/earnedstar/integrations/api-keys/${id}`, { method: "DELETE" });
      setKeys((prev) => prev.filter((k) => k.id !== id));
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(displayKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="card-surface max-w-2xl p-6">
      <h2 className="text-lg font-bold text-navy">API keys</h2>
      <p className="mt-1 text-sm text-text-muted">
        Use in widget embeds and server-side integrations. Rotate keys from this panel (Growth+).
      </p>

      {gated ? (
        <p className="mt-4 text-sm text-text-muted">Integration API keys require Growth plan or higher.</p>
      ) : (
        <>
          {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
          <form onSubmit={handleMint} className="mt-4 flex gap-2">
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Key label (e.g. Production widget)"
              className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm"
            />
            <Button type="submit" size="sm" disabled={loading}>
              <Plus size={16} /> Mint key
            </Button>
          </form>
          {keys.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {keys.map((k) => (
                <li key={k.id} className="flex items-center justify-between rounded border border-border px-3 py-2 text-xs">
                  <span>
                    {k.label} · <code>{k.key_prefix}…</code>
                  </span>
                  <button type="button" onClick={() => handleRevoke(k.id)} className="text-red-700" disabled={loading}>
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )}

      <div className="mt-4 flex gap-2">
        <input
          readOnly
          value={displayKey}
          className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-navy"
        />
        <Button type="button" variant="ghost" size="sm" onClick={handleCopy}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </Button>
      </div>
      {revealedKey ? (
        <p className="mt-2 text-xs text-amber-800">Copy this key now — it won&apos;t be shown again.</p>
      ) : null}
    </section>
  );
}
