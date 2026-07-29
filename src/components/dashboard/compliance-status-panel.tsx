/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { AlertTriangle, ShieldCheck } from "lucide-react";
import type { ComplianceBatch, ComplianceDashboard } from "@/lib/earnedstar-server";
import { cn } from "@/lib/utils";

const SOURCE_LABEL: Record<ComplianceBatch["source"], string> = {
  single_send: "Single request",
  bulk_send: "Bulk send",
  csv_import: "CSV import",
  internal_api: "Automated integration",
  order_webhook: "Automatic (order fulfilled)",
};

const SEGMENT_LABEL: Record<ComplianceBatch["segmentType"], string> = {
  unsegmented: "Unsegmented — everyone who qualified",
  objective_exclusion: "Objective exclusion",
  manual_selection: "Manually curated subset",
};

const SEGMENT_HINT: Record<ComplianceBatch["segmentType"], string> = {
  unsegmented: "Sent to every customer who met an objective rule (e.g. order fulfilled N days ago).",
  objective_exclusion: "A subset was excluded for a stated non-sentiment reason (e.g. refunded orders).",
  manual_selection: "A hand-picked subset with no declared objective reason on file.",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function ComplianceStatusPanel({ data }: { data: ComplianceDashboard | null }) {
  const batches = data?.batches ?? [];

  return (
    <section className="card-surface gold-seam p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-navy">Review-request compliance log</h2>
          <p className="mt-1 max-w-2xl text-sm text-text-muted">
            An audit trail of how review requests were solicited, for the FTC Consumer Review Rule (effective
            Oct 2024) — which bans conditioning review compensation or incentives on sentiment, explicit or
            implied. This is a <span className="font-semibold">diagnostic tool, not a compliance seal</span> —
            it flags a structural pattern worth reviewing, it does not determine legal compliance.
          </p>
        </div>
        {data ? (
          <div
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold",
              data.flaggedCount > 0 ? "bg-amber-50 text-amber-800" : "bg-green-pale text-green-dark",
            )}
          >
            {data.flaggedCount > 0 ? <AlertTriangle size={14} /> : <ShieldCheck size={14} />}
            {data.flaggedCount > 0
              ? `${data.flaggedCount} batch${data.flaggedCount === 1 ? "" : "es"} flagged for review`
              : "No flags on recent batches"}
          </div>
        ) : null}
      </div>

      {batches.length === 0 ? (
        <p className="mt-6 text-sm text-text-muted">No invitation batches logged yet.</p>
      ) : (
        <div className="mt-5 space-y-3">
          {batches.map((batch) => (
            <div
              key={batch.batchId}
              className={cn(
                "rounded-xl border p-4",
                batch.flagged ? "border-amber-300 bg-amber-50/40" : "border-border bg-surface-2/40",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-semibold text-navy">{SOURCE_LABEL[batch.source] ?? batch.source}</span>
                  <span className="text-text-faint">·</span>
                  <span className="capitalize text-text-muted">{batch.channel}</span>
                  <span className="text-text-faint">·</span>
                  <span className="text-text-muted">
                    {batch.invitationCount} invitation{batch.invitationCount === 1 ? "" : "s"}
                  </span>
                  <span className="text-text-faint">·</span>
                  <span className="text-text-muted">{formatDate(batch.createdAt)}</span>
                </div>
                {batch.flagged ? (
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                    <AlertTriangle size={12} /> Flagged
                  </span>
                ) : (
                  <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-text-muted">
                    No flag
                  </span>
                )}
              </div>

              <dl className="mt-3 grid gap-2 text-xs text-text-muted sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-navy">Recipient selection</dt>
                  <dd>{SEGMENT_LABEL[batch.segmentType] ?? batch.segmentType}</dd>
                  <dd className="text-text-faint">{SEGMENT_HINT[batch.segmentType]}</dd>
                  {batch.segmentNote ? <dd className="italic text-text-faint">&ldquo;{batch.segmentNote}&rdquo;</dd> : null}
                </div>
                <div>
                  <dt className="font-semibold text-navy">Incentive offered</dt>
                  <dd>{batch.incentiveOffered ? batch.incentiveDescription || "Yes (no description on file)" : "None"}</dd>
                </div>
              </dl>

              {batch.flagged && batch.flagReason ? (
                <p className="mt-3 rounded-lg bg-amber-100/60 p-3 text-xs text-amber-900">
                  <span className="font-semibold">Why this was flagged: </span>
                  {batch.flagReason}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}

      <p className="mt-5 border-t border-border pt-4 text-xs text-text-faint">
        {data?.note ??
          "Diagnostic tool only — flags surface a structural pattern, not a legal compliance determination. Review flagged batches with counsel before relying on them."}
      </p>
    </section>
  );
}
