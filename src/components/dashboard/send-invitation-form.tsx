"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Channel = "email" | "sms";

export function SendInvitationForm({ merchantSlug = "meridian-gear" }: { merchantSlug?: string }) {
  const [channel, setChannel] = useState<Channel>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [orderId, setOrderId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ token?: string; error?: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/earnedstar/invitations/send?slug=${merchantSlug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_phone: channel === "sms" ? phone : undefined,
          customer_email: channel === "email" ? email : undefined,
          order_id: orderId,
          customer_name: name || undefined,
          channel,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error((data as { message?: string }).message ?? "Failed to send invitation");
      }
      setResult({ token: (data as { token?: string }).token });
      setEmail("");
      setPhone("");
      setOrderId("");
      setName("");
    } catch (err) {
      setResult({ error: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card-surface gold-seam p-6">
      <h2 className="text-lg font-bold text-navy">Send invitation</h2>
      <p className="mt-1 text-sm text-text-muted">
        Queue a post-purchase review request via email or SMS (Growth plan+).
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="flex gap-2">
          {(["email", "sms"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setChannel(c)}
              className={
                channel === c
                  ? "rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white"
                  : "rounded-lg border border-border px-4 py-2 text-sm text-text-muted hover:border-gold/40"
              }
            >
              {c === "email" ? "Email" : "SMS"}
            </button>
          ))}
        </div>
        {channel === "email" ? (
          <label className="block text-sm font-medium text-navy">
            Customer email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            />
          </label>
        ) : (
          <label className="block text-sm font-medium text-navy">
            Customer mobile
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 123 4567"
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            />
          </label>
        )}
        <label className="block text-sm font-medium text-navy">
          Order ID
          <input
            type="text"
            required
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="ORD-12345"
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-navy">
          Customer name <span className="font-normal text-text-faint">(optional)</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          />
        </label>
        <Button type="submit" disabled={loading}>
          {loading ? "Sending…" : channel === "sms" ? "Send SMS invitation" : "Send invitation"}
        </Button>
      </form>
      {result?.token ? (
        <p className="mt-4 rounded-lg bg-green-pale px-4 py-3 text-sm text-green-dark">
          Invitation queued. Review link:{" "}
          <a href={`/submit/${result.token}`} className="font-semibold underline">
            /submit/{result.token}
          </a>
        </p>
      ) : null}
      {result?.error ? (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{result.error}</p>
      ) : null}
    </section>
  );
}
