/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { InvitationRow } from "@/lib/earnedstar-server";
import { recentInvitations } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const statusColor: Record<string, string> = {
  completed: "text-green-dark bg-green-pale",
  opened: "text-amber-800 bg-amber-50",
  sent: "text-navy-light bg-navy-pale",
  scheduled: "text-text-muted bg-surface-2",
  expired: "text-red-700 bg-red-50",
};

const STATUS_OPTIONS = ["all", "scheduled", "sent", "opened", "completed", "expired"] as const;
const CHANNEL_OPTIONS = ["all", "email", "sms", "link"] as const;

function formatDate(iso: string | undefined) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}

function displayEmail(email: string) {
  if (email.includes("@link.earnedstar.local")) return "Copy-link request";
  if (email.includes("@sms.earnedstar.local")) return "SMS recipient";
  return email;
}

export function SentRequestsTable({
  invitations,
  merchantSlug = "meridian-gear",
}: {
  invitations?: InvitationRow[];
  merchantSlug?: string;
}) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]>("all");
  const [channelFilter, setChannelFilter] = useState<(typeof CHANNEL_OPTIONS)[number]>("all");
  const [resendingId, setResendingId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const source =
      invitations?.length
        ? invitations.map((inv) => ({
            id: inv.id,
            email: inv.customer_email,
            name: inv.customer_name,
            orderId: inv.order_id,
            channel: inv.channel,
            sentAt: inv.sent_at,
            openedAt: inv.opened_at,
            status: inv.status,
            token: inv.token,
          }))
        : recentInvitations.map((inv) => ({
            id: inv.id,
            email: inv.email,
            name: undefined as string | undefined,
            orderId: inv.orderId,
            channel: inv.channel,
            sentAt: inv.sentAt,
            openedAt: undefined as string | undefined,
            status: inv.status,
            token: "token" in inv ? (inv as { token?: string }).token : undefined,
          }));

    return source.filter((r) => {
      const statusOk = statusFilter === "all" || r.status.toLowerCase() === statusFilter;
      const channelOk = channelFilter === "all" || r.channel.toLowerCase() === channelFilter;
      return statusOk && channelOk;
    });
  }, [invitations, statusFilter, channelFilter]);

  async function handleResend(id: string) {
    setResendingId(id);
    try {
      const res = await fetch(`/api/earnedstar/invitations/${id}/resend?slug=${merchantSlug}`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        throw new Error(data.message ?? "Resend failed");
      }
      router.refresh();
    } catch {
      /* surface via toast later */
    } finally {
      setResendingId(null);
    }
  }

  return (
    <section className="card-surface gold-seam p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-navy">Sent requests</h2>
          <p className="mt-1 text-sm text-text-muted">Track delivery, opens, and completions.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="text-xs font-medium text-text-muted">
            Status
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as (typeof STATUS_OPTIONS)[number])}
              className="mt-1 block rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-navy"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-medium text-text-muted">
            Channel
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value as (typeof CHANNEL_OPTIONS)[number])}
              className="mt-1 block rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-navy"
            >
              {CHANNEL_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All channels" : c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="mt-6 text-sm text-text-muted">No requests match these filters.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-text-faint">
                <th className="py-2 pr-3">Customer</th>
                <th className="py-2 pr-3">Order</th>
                <th className="py-2 pr-3">Channel</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Sent</th>
                <th className="py-2 pr-3">Opened</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((inv) => (
                <tr key={inv.id} className="border-b border-border/60">
                  <td className="py-3 pr-3">
                    <p className="font-medium text-navy">{inv.name ?? displayEmail(inv.email)}</p>
                    {inv.name ? <p className="text-xs text-text-faint">{displayEmail(inv.email)}</p> : null}
                  </td>
                  <td className="py-3 pr-3 text-text-muted">{inv.orderId}</td>
                  <td className="py-3 pr-3 capitalize">{inv.channel}</td>
                  <td className="py-3 pr-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-semibold capitalize",
                        statusColor[inv.status.toLowerCase()] ?? statusColor.sent,
                      )}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-text-muted">{formatDate(inv.sentAt)}</td>
                  <td className="py-3 pr-3 text-text-muted">{formatDate(inv.openedAt)}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      {inv.token ? (
                        <a
                          href={`/submit/${inv.token}`}
                          className="text-xs font-semibold text-navy-light hover:text-gold"
                        >
                          View
                        </a>
                      ) : null}
                      {inv.status.toLowerCase() === "expired" ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={resendingId === inv.id}
                          onClick={() => handleResend(inv.id)}
                        >
                          {resendingId === inv.id ? "…" : "Resend"}
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
