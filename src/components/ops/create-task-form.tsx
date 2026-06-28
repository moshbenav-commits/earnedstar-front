/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateTaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await fetch("/api/gt-ops/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), description: description.trim() || undefined, priority }),
    });
    setTitle("");
    setDescription("");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={(e) => void submit(e)} className="rounded-xl border border-[#2a1f16] bg-[#1A120C] p-4 space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[#E8A54B]">New task</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="w-full rounded-lg border border-[#2a1f16] bg-[#0f0a07] px-3 py-2 text-sm text-[#F5EBE0] placeholder:text-[#F5EBE0]/40"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className="w-full rounded-lg border border-[#2a1f16] bg-[#0f0a07] px-3 py-2 text-sm text-[#F5EBE0] placeholder:text-[#F5EBE0]/40"
      />
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="rounded-lg border border-[#2a1f16] bg-[#0f0a07] px-3 py-2 text-sm text-[#F5EBE0]"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="rounded-lg bg-[#C45C26] px-4 py-2 text-sm font-semibold text-white hover:bg-[#a84d1f] disabled:opacity-50"
        >
          {loading ? "Creating…" : "Create task"}
        </button>
      </div>
    </form>
  );
}
