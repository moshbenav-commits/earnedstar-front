/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link2, Mail, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BulkInvitationImport } from "@/components/dashboard/bulk-invitation-import";
import { cn } from "@/lib/utils";

type Channel = "email" | "sms" | "link";
type DelayDays = 0 | 3 | 5 | 7 | 14;

const CHANNELS: { id: Channel; label: string; icon: typeof Mail }[] = [
  { id: "email", label: "Email", icon: Mail },
  { id: "sms", label: "SMS", icon: Smartphone },
  { id: "link", label: "Copy link", icon: Link2 },
];

const TIMING: { days: DelayDays; label: string }[] = [
  { days: 0, label: "Immediately" },
  { days: 3, label: "3 days" },
  { days: 5, label: "5 days" },
  { days: 7, label: "7 days" },
  { days: 14, label: "14 days after delivery" },
];

export function SendInvitationForm({
  merchantSlug = "meridian-gear",
  merchantName = "Your store",
  smsEnabled = true,
}: {
  merchantSlug?: string;
  merchantName?: string;
  smsEnabled?: boolean;
}) {
  const router = useRouter();
  const channels = CHANNELS.filter((c) => c.id !== "sms" || smsEnabled);
  const [channel, setChannel] = useState<Channel>("email");
  const [delayDays, setDelayDays] = useState<DelayDays>(0);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [orderId, setOrderId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [result, setResult] = useState<{
    token?: string;
    submitUrl?: string;
    status?: string;
    error?: string;
  } | null>(null);

  const previewSubmitUrl = `https://earnedstar.com/submit/preview-token`;
  const previewEmailSubject = `${merchantName}: How was your order?`;
  const previewEmailBody = `Hi${name ? ` ${name}` : ""},\n\nThanks for shopping with ${merchantName}. Share your verified review for order ${orderId || "ORD-12345"}:\n${previewSubmitUrl}`;
  const previewSms = `${merchantName}: Share your verified review — ${previewSubmitUrl}`;

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
          delay_days: channel === "link" ? 0 : delayDays,
        }),
      });
      const data = (await res.json()) as {
        message?: string;
        token?: string;
        submitUrl?: string;
        status?: string;
      };
      if (!res.ok) {
        throw new Error(data.message ?? "Failed to send invitation");
      }
      const submitUrl =
        data.submitUrl ?? (data.token ? `${window.location.origin}/submit/${data.token}` : undefined);
      setResult({ token: data.token, submitUrl, status: data.status });
      setEmail("");
      setPhone("");
      setOrderId("");
      setName("");
      router.refresh();
    } catch (err) {
      setResult({ error: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  async function copyLink(url: string) {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="space-y-8">
      <section className="card-surface gold-seam p-6">
        <h2 className="text-lg font-bold text-navy">Send a review request</h2>
        <p className="mt-1 text-sm text-text-muted">
          Email, SMS, or copy a verified review link for order {orderId || "…"}.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-5">
          <label className="block text-sm font-medium text-navy">
            Customer name <span className="font-normal text-text-faint">(optional)</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            />
          </label>

          {channel === "email" ? (
            <label className="block text-sm font-medium text-navy">
              Customer email *
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              />
            </label>
          ) : null}

          {channel === "sms" ? (
            <label className="block text-sm font-medium text-navy">
              Customer phone *
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 123 4567"
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              />
            </label>
          ) : null}

          <label className="block text-sm font-medium text-navy">
            Order ID *
            <input
              type="text"
              required
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="ORD-12345"
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            />
          </label>

          <div>
            <p className="text-sm font-medium text-navy">Channel</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {channels.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setChannel(c.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition",
                    channel === c.id
                      ? "border-navy bg-navy text-white"
                      : "border-border text-text-muted hover:border-gold/40",
                  )}
                >
                  <c.icon size={16} aria-hidden />
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {channel !== "link" ? (
            <div>
              <p className="text-sm font-medium text-navy">Send timing</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {TIMING.map((t) => (
                  <button
                    key={t.days}
                    type="button"
                    onClick={() => setDelayDays(t.days)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-xs font-semibold transition",
                      delayDays === t.days
                        ? "border-gold bg-gold-pale text-navy"
                        : "border-border text-text-muted hover:border-gold/40",
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={loading}>
              {loading
                ? "Sending…"
                : channel === "link"
                  ? "Generate review link"
                  : delayDays > 0
                    ? "Schedule request"
                    : "Send review request"}
            </Button>
            {channel !== "link" ? (
              <Button type="button" variant="ghost" onClick={() => setPreviewOpen(true)}>
                Preview message
              </Button>
            ) : null}
          </div>
        </form>

        {result?.submitUrl ? (
          <div className="mt-4 rounded-lg bg-green-pale px-4 py-3 text-sm text-green-dark">
            {result.status === "scheduled" ? (
              <p>Request scheduled. Review link will be sent in {delayDays} days.</p>
            ) : channel === "link" ? (
              <p>
                Review link ready:{" "}
                <a href={result.submitUrl} className="font-semibold underline">
                  {result.submitUrl}
                </a>
              </p>
            ) : (
              <p>
                Invitation {result.status === "scheduled" ? "scheduled" : "sent"}. Review link:{" "}
                <a href={result.submitUrl} className="font-semibold underline">
                  {result.submitUrl}
                </a>
              </p>
            )}
            <button
              type="button"
              onClick={() => copyLink(result.submitUrl!)}
              className="mt-2 text-xs font-semibold text-navy underline"
            >
              Copy link
            </button>
          </div>
        ) : null}
        {result?.error ? (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{result.error}</p>
        ) : null}
      </section>

      <BulkInvitationImport merchantSlug={merchantSlug} defaultChannel={channel} defaultDelayDays={delayDays} />

      {previewOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-title"
        >
          <div className="card-surface max-w-md p-6 shadow-xl">
            <h3 id="preview-title" className="text-lg font-bold text-navy">
              {channel === "sms" ? "SMS preview" : "Email preview"}
            </h3>
            {channel === "sms" ? (
              <p className="mt-4 whitespace-pre-wrap rounded-lg bg-surface-2 p-4 text-sm text-navy">{previewSms}</p>
            ) : (
              <div className="mt-4 space-y-2 rounded-lg bg-surface-2 p-4 text-sm text-navy">
                <p>
                  <span className="font-semibold">Subject:</span> {previewEmailSubject}
                </p>
                <p className="whitespace-pre-wrap">{previewEmailBody}</p>
              </div>
            )}
            <Button className="mt-6" variant="ghost" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
