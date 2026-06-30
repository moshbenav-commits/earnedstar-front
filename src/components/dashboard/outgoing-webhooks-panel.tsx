/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { canAccessAnalytics } from "@/lib/plan-enforcement";

type WebhookEndpoint = {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  created_at?: string;
};

type WebhookEvent = { id: string; label: string };

type Delivery = {
  id: string;
  event_type: string;
  status: string;
  response_status?: number;
  created_at: string;
};

export function OutgoingWebhooksPanel({ plan }: { plan: string }) {
  const gated = !canAccessAnalytics(plan);
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>([]);
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [url, setUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["review.published"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/earnedstar/webhooks/events")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (gated) return;
    Promise.all([
      fetch("/api/earnedstar/webhooks/outgoing").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/earnedstar/webhooks/deliveries?limit=10").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([eps, dels]) => {
        setEndpoints(Array.isArray(eps) ? eps : []);
        setDeliveries(Array.isArray(dels) ? dels : []);
      })
      .catch(() => setError("Could not load webhooks"));
  }, [gated]);

  function toggleEvent(id: string) {
    setSelectedEvents((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/earnedstar/webhooks/outgoing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, events: selectedEvents }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error((data as { message?: string }).message ?? "Failed to create webhook");
      setEndpoints((prev) => [...prev, data as WebhookEndpoint]);
      setUrl("");
      setMessage("Webhook endpoint created.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/earnedstar/webhooks/outgoing/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error((data as { message?: string }).message ?? "Delete failed");
      }
      setEndpoints((prev) => prev.filter((ep) => ep.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  if (gated) {
    return (
      <section className="card-surface p-6">
        <h2 className="text-lg font-bold text-navy">Outgoing webhooks</h2>
        <p className="mt-2 text-sm text-text-muted">
          Send <code className="text-xs">review.*</code> and <code className="text-xs">invitation.*</code> events to
          your stack. Available on Growth plan and above.
        </p>
        <Button href="/dashboard/settings" variant="ghost" className="mt-4">
          Upgrade plan
        </Button>
      </section>
    );
  }

  return (
    <section className="card-surface space-y-6 p-6">
      <div>
        <h2 className="text-lg font-bold text-navy">Outgoing webhooks</h2>
        <p className="mt-1 text-sm text-text-muted">
          HTTPS endpoints receive signed POST payloads when reviews publish or invitations change status.
        </p>
      </div>

      {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}
      {message ? <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-dark">{message}</p> : null}

      <form onSubmit={handleCreate} className="space-y-4 rounded-lg border border-border p-4">
        <label className="block text-sm font-semibold text-navy">
          Endpoint URL
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://your-app.com/webhooks/earnedstar"
            className="mt-1 w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm"
          />
        </label>
        <fieldset>
          <legend className="text-sm font-semibold text-navy">Events</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {(events.length ? events : [{ id: "review.published", label: "Review published" }]).map((ev) => (
              <label key={ev.id} className="flex cursor-pointer items-center gap-2 rounded-full border border-border px-3 py-1 text-xs">
                <input
                  type="checkbox"
                  checked={selectedEvents.includes(ev.id)}
                  onChange={() => toggleEvent(ev.id)}
                />
                {ev.label ?? ev.id}
              </label>
            ))}
          </div>
        </fieldset>
        <Button type="submit" disabled={loading || !url.trim() || selectedEvents.length === 0}>
          {loading ? "Saving…" : "Add endpoint"}
        </Button>
      </form>

      {endpoints.length > 0 ? (
        <ul className="space-y-3">
          {endpoints.map((ep) => (
            <li key={ep.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-4 py-3 text-sm">
              <div>
                <p className="font-mono text-xs text-navy">{ep.url}</p>
                <p className="mt-1 text-xs text-text-muted">{ep.events.join(", ")}</p>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => handleDelete(ep.id)} disabled={loading}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-text-muted">No webhook endpoints yet.</p>
      )}

      {deliveries.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold text-navy">Recent deliveries</h3>
          <ul className="mt-2 space-y-2 text-xs text-text-muted">
            {deliveries.map((d) => (
              <li key={d.id} className="flex justify-between rounded border border-border px-3 py-2">
                <span>{d.event_type}</span>
                <span>
                  {d.status}
                  {d.response_status ? ` · HTTP ${d.response_status}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
