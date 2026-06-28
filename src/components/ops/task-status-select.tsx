/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { gtOpsClient } from "@/lib/gt-ops-client";

const STATUSES = ["backlog", "in_progress", "blocked", "in_review", "completed"] as const;

export function TaskStatusSelect({ taskId, status }: { taskId: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [busy, setBusy] = useState(false);

  async function onChange(next: string) {
    setValue(next);
    setBusy(true);
    const { ok } = await gtOpsClient(`/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    if (ok) router.refresh();
    else setValue(status);
  }

  return (
    <select
      value={value}
      disabled={busy}
      onChange={(e) => void onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      className="mt-1 w-full rounded border border-[#2a1f16] bg-[#0f0a07] px-1 py-0.5 text-xs capitalize text-[#F5EBE0]"
      aria-label="Task status"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}
