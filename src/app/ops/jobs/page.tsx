/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { gtOpsFetch } from "@/lib/gt-ops-server";

type Job = {
  id: string;
  job_type: string;
  status: string;
  correlation_id: string | null;
  created_at: string;
  finished_at: string | null;
};

const JOB_LABELS: Record<string, string> = {
  demo_catalog_sync: "Demo catalog load",
  store_sync: "Store sync",
  store_scan: "Store scan",
};

export default async function OpsJobsPage() {
  const { data } = await gtOpsFetch("/jobs");
  const jobs = (Array.isArray(data) ? data : []) as Job[];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[#E8A54B]">Jobs</h1>
        <p className="mt-1 text-sm text-[#F5EBE0]/70">Catalog loads, scans, and scheduled work.</p>
      </header>

      <div className="rounded-xl border border-[#2a1f16] bg-[#1A120C]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#2a1f16] text-[#F5EBE0]/60">
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
              <th className="p-4">Started</th>
              <th className="p-4">Finished</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-[#F5EBE0]/60">
                  No jobs yet — load demo catalog or run a scan.
                </td>
              </tr>
            ) : (
              jobs.map((j) => (
                <tr key={j.id} className="border-b border-[#2a1f16] last:border-0">
                  <td className="p-4">{JOB_LABELS[j.job_type] ?? j.job_type.replace(/_/g, " ")}</td>
                  <td className="p-4 capitalize">{j.status.replace(/_/g, " ")}</td>
                  <td className="p-4 text-[#F5EBE0]/70">{new Date(j.created_at).toLocaleString()}</td>
                  <td className="p-4 text-[#F5EBE0]/70">
                    {j.finished_at ? new Date(j.finished_at).toLocaleString() : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
