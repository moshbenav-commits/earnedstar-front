/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import { useRef, useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ApiKeyPanel({ apiKey }: { apiKey?: string | null }) {
  const [copied, setCopied] = useState(false);
  const key = apiKey ?? "demo-key-not-linked";
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      inputRef.current?.select();
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <section className="card-surface max-w-2xl p-6">
      <h2 className="text-lg font-bold text-navy">API key & embeds</h2>
      <p className="mt-1 text-sm text-text-muted">
        Use this key in badge and review widget scripts. Keep it private — it identifies your store.
      </p>
      <div className="mt-4 flex gap-2">
        <input
          ref={inputRef}
          readOnly
          value={key}
          className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-navy"
        />
        <Button type="button" variant="ghost" size="sm" onClick={handleCopy}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="mt-4 overflow-x-auto rounded-lg bg-bg-elevated p-3 text-xs text-text-secondary">
        {`<script src="https://earnedstar.com/widget/v1/widget.js"
  data-key="${key}"
  data-widget="carousel"
  data-max="6"></script>`}
      </pre>
    </section>
  );
}
