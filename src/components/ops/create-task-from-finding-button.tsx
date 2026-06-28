/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateTaskFromFindingButton({ findingId }: { findingId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function createTask() {
    setLoading(true);
    await fetch(`/api/gt-ops/findings/${findingId}/create-task`, { method: "POST" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void createTask()}
      disabled={loading}
      className="mt-2 rounded border border-[#E8A54B]/30 px-2 py-1 text-xs font-medium text-[#E8A54B] hover:bg-[#E8A54B]/10 disabled:opacity-50"
    >
      {loading ? "Creating…" : "Create task"}
    </button>
  );
}
