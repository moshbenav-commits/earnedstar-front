/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { gtOpsFetch } from "@/lib/gt-ops-server";

export default async function OpsJobsPage() {
  const { data } = await gtOpsFetch("/jobs");
  const jobs = Array.isArray(data) ? data : [];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[#E8A54B]">Jobs</h1>
        <p className="mt-1 text-sm text-[#F5EBE0]/70">Background scan and sync jobs (shell).</p>
      </header>
      <pre className="overflow-auto rounded-xl border border-[#2a1f16] bg-[#1A120C] p-4 text-xs text-[#F5EBE0]/80">
        {JSON.stringify(jobs, null, 2)}
      </pre>
    </div>
  );
}
