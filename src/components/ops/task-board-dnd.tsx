/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { gtOpsClient } from "@/lib/gt-ops-client";
import type { TaskRow } from "@/components/ops/task-console";

const COLUMNS = [
  { id: "backlog", label: "Backlog" },
  { id: "in_progress", label: "In progress" },
  { id: "blocked", label: "Blocked" },
  { id: "in_review", label: "In review" },
  { id: "completed", label: "Completed" },
] as const;

export function TaskBoardDnd({ initialTasks }: { initialTasks: TaskRow[] }) {
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);
  const [dragId, setDragId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const byColumn = useMemo(() => {
    const map = new Map<string, TaskRow[]>();
    for (const col of COLUMNS) map.set(col.id, []);
    for (const task of tasks) {
      const bucket = map.get(task.status) ?? map.get("backlog")!;
      bucket.push(task);
    }
    return map;
  }, [tasks]);

  async function moveTask(taskId: string, status: string) {
    const prev = tasks;
    setTasks((current) =>
      current.map((t) => (t.id === taskId ? { ...t, status } : t)),
    );
    setBusyId(taskId);
    const { ok } = await gtOpsClient(`/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    setBusyId(null);
    if (ok) router.refresh();
    else setTasks(prev);
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {COLUMNS.map((col) => (
        <div
          key={col.id}
          className="min-h-[12rem] rounded-xl border border-[#2a1f16] bg-[#1A120C] p-3"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (dragId) void moveTask(dragId, col.id);
            setDragId(null);
          }}
        >
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#F5EBE0]/60">
            {col.label}
          </h3>
          <ul className="space-y-2">
            {(byColumn.get(col.id) ?? []).map((task) => (
              <li
                key={task.id}
                draggable={busyId !== task.id}
                onDragStart={() => setDragId(task.id)}
                onDragEnd={() => setDragId(null)}
                className={`cursor-grab rounded-lg border border-[#2a1f16] bg-[#0f0a07] p-3 active:cursor-grabbing ${busyId === task.id ? "opacity-60" : ""}`}
              >
                <Link
                  href={`/ops/tasks/${task.id}`}
                  className="block text-sm font-medium text-[#E8A54B] hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {task.title}
                </Link>
                <p className="mt-1 text-xs capitalize text-[#F5EBE0]/50">{task.priority}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
