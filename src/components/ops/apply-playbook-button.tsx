/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { gtOpsClient } from "@/lib/gt-ops-client";

type Playbook = {
  id: string;
  name: string;
  summary: string;
  steps: { title: string; description: string }[];
};

export function ApplyPlaybookButton({ playbook }: { playbook: Playbook }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function apply() {
    setBusy(true);
    setMessage(null);
    const { ok, data } = await gtOpsClient(`/playbooks/${playbook.id}/apply`, { method: "POST", body: "{}" });
    setBusy(false);
    if (!ok) {
      setMessage("Could not apply playbook.");
      return;
    }
    const created = (data as { tasks?: unknown[] })?.tasks?.length ?? playbook.steps.length;
    setMessage(`Created ${created} tasks — open Action Console.`);
    router.refresh();
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={busy}
        onClick={() => void apply()}
        className="rounded-lg bg-[#C45C26] px-4 py-2 text-sm font-medium text-white hover:bg-[#C45C26]/90 disabled:opacity-50"
      >
        {busy ? "Applying…" : "Apply playbook → tasks"}
      </button>
      {message && <span className="text-sm text-[#F5EBE0]/70">{message}</span>}
    </div>
  );
}
