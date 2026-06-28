/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["backlog", "in_progress", "blocked", "in_review", "completed", "archived"] as const;
const PRIORITIES = ["low", "medium", "high", "urgent"] as const;

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  owner_email: string | null;
  due_at: string | null;
};

export function TaskDetailActions({ task }: { task: Task }) {
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [ownerEmail, setOwnerEmail] = useState(task.owner_email ?? "");
  const [dueAt, setDueAt] = useState(task.due_at?.slice(0, 10) ?? "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function save() {
    setLoading(true);
    await fetch(`/api/gt-ops/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        priority,
        owner_email: ownerEmail.trim() || null,
        due_at: dueAt ? `${dueAt}T12:00:00.000Z` : null,
      }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <label className="block text-xs text-[#F5EBE0]/60">
        Status
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[#2a1f16] bg-[#0f0a07] px-3 py-2 text-sm text-[#F5EBE0]"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-xs text-[#F5EBE0]/60">
        Priority
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[#2a1f16] bg-[#0f0a07] px-3 py-2 text-sm text-[#F5EBE0]"
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-xs text-[#F5EBE0]/60">
        Owner email
        <input
          type="email"
          value={ownerEmail}
          onChange={(e) => setOwnerEmail(e.target.value)}
          placeholder="operator@store.com"
          className="mt-1 w-full rounded-lg border border-[#2a1f16] bg-[#0f0a07] px-3 py-2 text-sm text-[#F5EBE0]"
        />
      </label>
      <label className="block text-xs text-[#F5EBE0]/60">
        Due date
        <input
          type="date"
          value={dueAt}
          onChange={(e) => setDueAt(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[#2a1f16] bg-[#0f0a07] px-3 py-2 text-sm text-[#F5EBE0]"
        />
      </label>
      <div className="sm:col-span-2 lg:col-span-4">
        <button
          type="button"
          onClick={() => void save()}
          disabled={loading}
          className="rounded-lg bg-[#C45C26] px-4 py-2 text-sm font-semibold text-white hover:bg-[#a84d1f] disabled:opacity-50"
        >
          {loading ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
