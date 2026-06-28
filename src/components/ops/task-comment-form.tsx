/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function TaskCommentForm({ taskId }: { taskId: string }) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    await fetch(`/api/gt-ops/tasks/${taskId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: body.trim() }),
    });
    setBody("");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={(e) => void submit(e)} className="flex gap-2">
      <input
        type="text"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Add a note…"
        className="flex-1 rounded-lg border border-[#2a1f16] bg-[#0f0a07] px-3 py-2 text-sm text-[#F5EBE0] placeholder:text-[#F5EBE0]/40"
      />
      <button
        type="submit"
        disabled={loading || !body.trim()}
        className="rounded-lg border border-[#E8A54B]/40 px-3 py-2 text-sm font-medium text-[#E8A54B] hover:bg-[#E8A54B]/10 disabled:opacity-50"
      >
        {loading ? "…" : "Post"}
      </button>
    </form>
  );
}
