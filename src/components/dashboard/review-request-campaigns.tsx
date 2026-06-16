"use client";

import { useState } from "react";
import type { InvitationRow } from "@/lib/earnedstar-server";
import { SendInvitationForm } from "@/components/dashboard/send-invitation-form";
import { SentRequestsTable } from "@/components/dashboard/sent-requests-table";
import { canSendSmsInvitations } from "@/lib/plan-enforcement";
import { cn } from "@/lib/utils";

type Tab = "send" | "sent";

export function ReviewRequestCampaigns({
  merchantSlug,
  merchantName,
  invitations,
  plan = "starter",
}: {
  merchantSlug: string;
  merchantName?: string;
  invitations: InvitationRow[];
  plan?: string;
}) {
  const [tab, setTab] = useState<Tab>("send");
  const smsEnabled = canSendSmsInvitations(plan);

  return (
    <div className="space-y-6">
      <div className="flex gap-1 rounded-xl border border-border bg-surface-2 p-1">
        {(
          [
            { id: "send" as const, label: "Send new request" },
            { id: "sent" as const, label: "Sent requests" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition",
              tab === t.id ? "bg-surface text-navy shadow-sm" : "text-text-muted hover:text-navy",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "send" ? (
        <>
          {!smsEnabled ? (
            <p className="text-sm text-text-muted">
              SMS invitations unlock on Growth plan and above. Email requests are included on Starter.
            </p>
          ) : null}
          <SendInvitationForm merchantSlug={merchantSlug} merchantName={merchantName} smsEnabled={smsEnabled} />
        </>
      ) : (
        <SentRequestsTable invitations={invitations} merchantSlug={merchantSlug} />
      )}
    </div>
  );
}
