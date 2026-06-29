/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { gtOpsClient } from "@/lib/gt-ops-client";

export type ReviewTask = {
  id: string;
  title: string;
  status: string;
  priority: string;
  owner_email: string | null;
  description: string | null;
};

export function ReviewQueuePanel({ tasks }: { tasks: ReviewTask[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function decide(taskId: string, status: "completed" | "in_progress") {
    setBusyId(taskId);
    await gtOpsClient(`/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    setBusyId(null);
    router.refresh();
  }

  if (tasks.length === 0) {
    return (
      <p className="rounded-xl border border-[#2a1f16] bg-[#1A120C] p-6 text-sm text-[#F5EBE0]/60">
        No tasks awaiting review — move work to <strong className="text-[#E8A54B]">In review</strong> on the board when
        ready for sign-off.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((t) => (
        <li key={t.id} className="rounded-xl border border-[#2a1f16] bg-[#1A120C] p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Link href={`/ops/tasks/${t.id}`} className="text-lg font-semibold text-[#E8A54B] hover:underline">
                {t.title}
              </Link>
              <p className="mt-1 text-xs capitalize text-[#F5EBE0]/50">
                {t.priority} · {t.owner_email ?? "Unassigned"}
              </p>
              {t.description && <p className="mt-2 text-sm text-[#F5EBE0]/75">{t.description}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busyId === t.id}
                onClick={() => void decide(t.id, "completed")}
                className="rounded-lg bg-[#C45C26] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#C45C26]/90 disabled:opacity-50"
              >
                Approve
              </button>
              <button
                type="button"
                disabled={busyId === t.id}
                onClick={() => void decide(t.id, "in_progress")}
                className="rounded-lg border border-[#2a1f16] px-3 py-1.5 text-sm text-[#F5EBE0]/80 hover:border-[#E8A54B]/40 disabled:opacity-50"
              >
                Send back
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
