/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import Link from "next/link";
import { formatPlanLimit, isAtCap, limitsFor } from "@/lib/plan-enforcement";

export function PlanUsageBanner({
  plan,
  used,
  label = "review requests sent this month",
}: {
  plan: string;
  used: number;
  label?: string;
}) {
  const limit = limitsFor(plan).monthly_requests;
  if (limit < 0) return null;

  const atLimit = isAtCap(used, limit);

  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm ${
        atLimit ? "border-amber-300 bg-amber-50 text-amber-900" : "border-border bg-surface-2 text-text-secondary"
      }`}
    >
      <span className="font-semibold text-navy">
        {used.toLocaleString()} / {formatPlanLimit(limit)}
      </span>{" "}
      {label}
      {atLimit ? (
        <>
          {" "}
          —{" "}
          <Link href="/dashboard/settings" className="font-semibold text-navy underline">
            Upgrade your plan
          </Link>{" "}
          to send more.
        </>
      ) : null}
    </div>
  );
}
