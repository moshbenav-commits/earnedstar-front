"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SendInvitationForm() {
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ token?: string; error?: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/earnedstar/invitations/send?slug=expediaparts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_email: email,
          order_id: orderId,
          customer_name: name || undefined,
          channel: "email",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error((data as { message?: string }).message ?? "Failed to send invitation");
      }
      setResult({ token: (data as { token?: string }).token });
      setEmail("");
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
        Queue a post-purchase review request. Customer receives a link to{" "}
        <code className="text-xs">/submit/[token]</code>.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
          {loading ? "Sending…" : "Send invitation"}
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
