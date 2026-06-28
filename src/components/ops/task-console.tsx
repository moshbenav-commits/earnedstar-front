/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import Link from "next/link";
import { useState } from "react";
import { TaskStatusSelect } from "@/components/ops/task-status-select";

export type TaskRow = {
  id: string;
  title: string;
  status: string;
  priority: string;
  owner_email: string | null;
};

const BOARD_COLUMNS = ["backlog", "in_progress", "blocked", "in_review", "completed"] as const;

const COLUMN_LABELS: Record<string, string> = {
  backlog: "Backlog",
  in_progress: "In progress",
  blocked: "Blocked",
  in_review: "In review",
  completed: "Done",
};

export function TaskConsole({ tasks }: { tasks: TaskRow[] }) {
  const [view, setView] = useState<"list" | "board">("list");

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setView("list")}
          className={`rounded-lg px-3 py-1.5 text-sm ${view === "list" ? "bg-[#C45C26]/30 text-[#E8A54B]" : "text-[#F5EBE0]/60 hover:text-[#F5EBE0]"}`}
        >
          List
        </button>
        <button
          type="button"
          onClick={() => setView("board")}
          className={`rounded-lg px-3 py-1.5 text-sm ${view === "board" ? "bg-[#C45C26]/30 text-[#E8A54B]" : "text-[#F5EBE0]/60 hover:text-[#F5EBE0]"}`}
        >
          Board
        </button>
      </div>

      {view === "list" ? (
        <div className="rounded-xl border border-[#2a1f16] bg-[#1A120C]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#2a1f16] text-[#F5EBE0]/60">
                <th className="p-4">Task</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Owner</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-[#F5EBE0]/60">
                    No tasks yet — create from a scanner finding.
                  </td>
                </tr>
              ) : (
                tasks.map((t) => (
                  <tr key={t.id} className="border-b border-[#2a1f16] last:border-0">
                    <td className="p-4">
                      <Link href={`/ops/tasks/${t.id}`} className="font-medium text-[#E8A54B] hover:underline">
                        {t.title}
                      </Link>
                    </td>
                    <td className="p-4 capitalize">{t.priority}</td>
                    <td className="p-4">
                      <TaskStatusSelect taskId={t.id} status={t.status} />
                    </td>
                    <td className="p-4 text-[#F5EBE0]/70">{t.owner_email ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-3 overflow-x-auto md:grid-cols-3 lg:grid-cols-5">
          {BOARD_COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col);
            return (
              <div key={col} className="min-w-[180px] rounded-xl border border-[#2a1f16] bg-[#1A120C]">
                <h3 className="border-b border-[#2a1f16] p-3 text-xs font-semibold uppercase tracking-wide text-[#E8A54B]">
                  {COLUMN_LABELS[col]} ({colTasks.length})
                </h3>
                <ul className="space-y-2 p-2">
                  {colTasks.length === 0 ? (
                    <li className="p-2 text-xs text-[#F5EBE0]/40">—</li>
                  ) : (
                    colTasks.map((t) => (
                      <li key={t.id}>
                        <Link
                          href={`/ops/tasks/${t.id}`}
                          className="block rounded-lg border border-[#2a1f16] bg-[#0f0a07] p-2 text-sm hover:border-[#E8A54B]/40"
                        >
                          <p className="font-medium leading-snug">{t.title}</p>
                          <p className="mt-1 text-xs capitalize text-[#F5EBE0]/50">{t.priority}</p>
                          <TaskStatusSelect taskId={t.id} status={t.status} />
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
