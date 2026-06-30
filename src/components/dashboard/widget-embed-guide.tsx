/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const WIDGET_TYPES = [
  { id: "carousel", label: "Review carousel", max: 6 },
  { id: "badge", label: "Trust badge", max: 0 },
  { id: "grid", label: "Review grid", max: 12 },
] as const;

const THEMES = ["default", "minimal", "dark", "gold-accent"] as const;

export function WidgetEmbedGuide({ apiKey, slug }: { apiKey?: string | null; slug: string }) {
  const [widget, setWidget] = useState<(typeof WIDGET_TYPES)[number]["id"]>("carousel");
  const [theme, setTheme] = useState<(typeof THEMES)[number]>("default");
  const [copied, setCopied] = useState(false);
  const key = apiKey ?? "YOUR_API_KEY";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://earnedstar.com";
  const widgetMeta = WIDGET_TYPES.find((w) => w.id === widget)!;

  const snippet = `<script src="${siteUrl}/embed/v1/widget.js"
  data-key="${key}"
  data-slug="${slug}"
  data-widget="${widget}"
  data-theme="${theme}"${widgetMeta.max ? `\n  data-max="${widgetMeta.max}"` : ""}></script>`;

  async function handleCopy() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="card-surface space-y-4 p-6">
      <div>
        <h2 className="text-lg font-bold text-navy">Widget embed guide</h2>
        <p className="mt-1 text-sm text-text-muted">
          Paste before <code className="text-xs">&lt;/body&gt;</code> on any storefront. Uses{" "}
          <code className="text-xs">/embed/v1/widget.js</code> (CDN alias for <code className="text-xs">/widget/v1/widget.js</code>).
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <label className="text-sm">
          Widget
          <select
            value={widget}
            onChange={(e) => setWidget(e.target.value as typeof widget)}
            className="ml-2 rounded border border-border bg-surface-2 px-2 py-1 text-sm"
          >
            {WIDGET_TYPES.map((w) => (
              <option key={w.id} value={w.id}>
                {w.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Theme
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as typeof theme)}
            className="ml-2 rounded border border-border bg-surface-2 px-2 py-1 text-sm"
          >
            {THEMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      <pre className="overflow-x-auto rounded-lg bg-bg-elevated p-3 text-xs text-text-secondary">{snippet}</pre>

      <Button type="button" variant="ghost" size="sm" onClick={handleCopy}>
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? "Copied" : "Copy snippet"}
      </Button>

      <p className="text-xs text-text-muted">
        Profile URL for SEO:{" "}
        <a href={`/reviews/${slug}`} className="text-navy-light hover:text-gold">
          {siteUrl.replace(/\/$/, "")}/reviews/{slug}
        </a>
      </p>
    </section>
  );
}
