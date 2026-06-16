"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type ShopifyStatus = {
  connected: boolean;
  shop: string | null;
  webhookUrl?: string;
  webhookSecretEnv?: string;
  merchantSlug?: string;
};

export function ShopifyConnectPanel() {
  const [status, setStatus] = useState<ShopifyStatus | null>(null);
  const [shop, setShop] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/earnedstar/integrations/shopify")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setStatus(data as ShopifyStatus);
          if ((data as ShopifyStatus).shop) setShop((data as ShopifyStatus).shop!);
        }
      })
      .catch(() => undefined);
  }, []);

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/earnedstar/integrations/shopify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error((data as { message?: string }).message ?? "Failed to connect");
      }
      setMessage(`Shop ${(data as { shop: string }).shop} registered — complete webhook setup below.`);
      setStatus((s) => ({ ...(s ?? { connected: false, shop: null }), shop: (data as { shop: string }).shop, connected: false }));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="card-surface gold-seam max-w-2xl p-6">
        <h2 className="text-lg font-bold text-navy">Connect Shopify</h2>
        <p className="mt-1 text-sm text-text-muted">
          Auto-send review invitations when orders are fulfilled. Works with any Shopify plan.
        </p>
        <form onSubmit={handleConnect} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-navy">
            Store URL
            <input
              type="text"
              required
              value={shop}
              onChange={(e) => setShop(e.target.value)}
              placeholder="your-store.myshopify.com"
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            />
          </label>
          <Button type="submit" disabled={loading}>
            {loading ? "Connecting…" : status?.connected ? "Update store" : "Connect store"}
          </Button>
        </form>
        {message ? (
          <p className="mt-4 rounded-lg bg-green-pale px-4 py-3 text-sm text-green-dark">{message}</p>
        ) : null}
      </section>

      <section className="card-surface max-w-2xl p-6">
        <h2 className="text-lg font-bold text-navy">Webhook setup</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-text-muted">
          <li>Open Shopify Admin → Settings → Notifications → Webhooks</li>
          <li>Create webhook: Event <strong>Order fulfillment</strong>, Format JSON</li>
          <li>
            URL:{" "}
            <code className="rounded bg-surface-2 px-1 text-xs">
              {status?.webhookUrl ?? "https://earnedstar-back.vercel.app/api/earnedstar/webhooks/order-fulfilled"}
            </code>
          </li>
          <li>
            Add header <code className="text-xs">x-earnedstar-secret</code> with your{" "}
            {status?.webhookSecretEnv ?? "EARNEDSTAR_WEBHOOK_SECRET"} value
          </li>
          <li>
            Include <code className="text-xs">merchant_slug</code> in the JSON body:{" "}
            <code className="text-xs">{status?.merchantSlug ?? "your-store-slug"}</code>
          </li>
        </ol>
      </section>
    </div>
  );
}
