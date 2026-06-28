/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import Link from "next/link";
import { gtOpsFetch } from "@/lib/gt-ops-server";
import { TaskCommentForm } from "@/components/ops/task-comment-form";
import { TaskDetailActions } from "@/components/ops/task-detail-actions";

type TaskDetail = {
  task: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    owner_email: string | null;
    due_at: string | null;
    finding_id: string | null;
    created_at: string;
    updated_at: string;
  };
  comments: Array<{ id: string; author_email: string | null; body: string; created_at: string }>;
  statusHistory: Array<{ from_status: string | null; to_status: string; created_at: string }>;
};

export default async function OpsTaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await gtOpsFetch(`/tasks/${id}`);
  const detail = data as TaskDetail;

  if (!detail?.task) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <p className="text-[#F5EBE0]/70">Task not found.</p>
        <Link href="/ops/tasks" className="mt-4 inline-block text-[#C45C26] hover:underline">
          ← Back to tasks
        </Link>
      </div>
    );
  }

  const { task, comments, statusHistory } = detail;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <Link href="/ops/tasks" className="text-sm text-[#C45C26] hover:underline">
          ← Action Console
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-[#E8A54B]">{task.title}</h1>
        {task.description && <p className="mt-2 text-sm text-[#F5EBE0]/70">{task.description}</p>}
      </header>

      <section className="rounded-xl border border-[#2a1f16] bg-[#1A120C] p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#E8A54B]">Assignment</h2>
        <div className="mt-3">
          <TaskDetailActions task={task} />
        </div>
      </section>

      <section className="rounded-xl border border-[#2a1f16] bg-[#1A120C] p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#E8A54B]">Comments</h2>
        <ul className="mt-3 space-y-3">
          {comments.length === 0 ? (
            <li className="text-sm text-[#F5EBE0]/60">No notes yet.</li>
          ) : (
            comments.map((c) => (
              <li key={c.id} className="rounded-lg bg-[#0f0a07] p-3 text-sm">
                <p className="text-xs text-[#F5EBE0]/50">
                  {c.author_email ?? "Operator"} · {new Date(c.created_at).toLocaleString()}
                </p>
                <p className="mt-1 text-[#F5EBE0]">{c.body}</p>
              </li>
            ))
          )}
        </ul>
        <div className="mt-4">
          <TaskCommentForm taskId={task.id} />
        </div>
      </section>

      {statusHistory.length > 0 && (
        <section className="rounded-xl border border-[#2a1f16] bg-[#1A120C] p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#E8A54B]">Status history</h2>
          <ul className="mt-3 space-y-2 text-sm text-[#F5EBE0]/70">
            {statusHistory.map((h, i) => (
              <li key={i}>
                {(h.from_status ?? "new").replace(/_/g, " ")} → {h.to_status.replace(/_/g, " ")} ·{" "}
                {new Date(h.created_at).toLocaleString()}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
