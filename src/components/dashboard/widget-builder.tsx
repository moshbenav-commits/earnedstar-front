"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";

export type SavedWidget = {
  id: string;
  name: string;
  widget_type: string;
  config?: Record<string, unknown>;
  embed_code: string;
};

const WIDGET_TYPES = [
  { id: "badge", label: "Badge" },
  { id: "carousel", label: "Carousel" },
  { id: "grid", label: "Grid" },
  { id: "testimonial", label: "Testimonial" },
  { id: "feed", label: "Feed" },
  { id: "floating", label: "Floating bubble" },
] as const;

export function WidgetBuilder({
  initialWidgets,
  apiKey,
}: {
  initialWidgets: SavedWidget[];
  apiKey?: string;
}) {
  const [widgets, setWidgets] = useState(initialWidgets);
  const [name, setName] = useState("Homepage carousel");
  const [widgetType, setWidgetType] = useState<(typeof WIDGET_TYPES)[number]["id"]>("carousel");
  const [maxReviews, setMaxReviews] = useState(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/earnedstar/widgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          widget_type: widgetType,
          config: { max: maxReviews, color: "navy", size: 128 },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error((data as { message?: string }).message ?? "Failed to create widget");
      }
      const created = (data as { widget: SavedWidget }).widget;
      setWidgets((prev) => [created, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/earnedstar/widgets/${id}`, { method: "DELETE" });
    if (res.ok) setWidgets((prev) => prev.filter((w) => w.id !== id));
  }

  async function copySnippet(code: string, id: string) {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-8">
      <section className="card-surface gold-seam p-6">
        <h2 className="text-lg font-bold text-navy">Embeddable review widgets</h2>
        <p className="mt-1 text-sm text-text-muted">
          Copy the code below and paste it anywhere on your website.
          {apiKey ? (
            <span className="mt-1 block font-mono text-xs text-text-faint">API key: {apiKey}</span>
          ) : null}
        </p>
        <form onSubmit={handleCreate} className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-navy">
            Widget name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-navy">
            Type
            <select
              value={widgetType}
              onChange={(e) => setWidgetType(e.target.value as (typeof WIDGET_TYPES)[number]["id"])}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            >
              {WIDGET_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-navy">
            Max reviews
            <input
              type="number"
              min={1}
              max={12}
              value={maxReviews}
              onChange={(e) => setMaxReviews(Number(e.target.value) || 6)}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            />
          </label>
          <div className="flex items-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Save widget"}
            </Button>
          </div>
        </form>
        {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      </section>

      <section className="card-surface p-6">
        <h2 className="text-lg font-bold text-navy">Saved widgets</h2>
        {widgets.length === 0 ? (
          <p className="mt-4 text-sm text-text-muted">No widgets yet — create your first embed above.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {widgets.map((widget) => (
              <div key={widget.id} className="rounded-xl border border-border bg-surface-2/40 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-navy">{widget.name}</p>
                    <p className="text-xs capitalize text-text-faint">{widget.widget_type}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => void copySnippet(widget.embed_code, widget.id)}
                    >
                      <Copy size={14} />
                      {copiedId === widget.id ? "Copied" : "Copy snippet"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => void handleDelete(widget.id)}
                      className="text-red-600"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                <pre className="mt-3 overflow-x-auto rounded-md bg-bg-elevated p-3 text-xs text-text-secondary">
                  {widget.embed_code}
                </pre>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
