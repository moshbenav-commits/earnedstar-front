/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { gtOpsFetch } from "@/lib/gt-ops-server";

type AuditLog = {
  id: string;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  actor_email: string | null;
  created_at: string;
};

export default async function OpsAuditLogsPage() {
  const { data } = await gtOpsFetch("/audit-logs");
  const logs = (Array.isArray(data) ? data : []) as AuditLog[];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[#E8A54B]">Audit logs</h1>
        <p className="mt-1 text-sm text-[#F5EBE0]/70">Traceability for scans, tasks, and store actions.</p>
      </header>

      <div className="rounded-xl border border-[#2a1f16] bg-[#1A120C]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#2a1f16] text-[#F5EBE0]/60">
              <th className="p-4">When</th>
              <th className="p-4">Action</th>
              <th className="p-4">Resource</th>
              <th className="p-4">Actor</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-[#F5EBE0]/60">
                  No audit entries yet — run a scan or create a task.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-b border-[#2a1f16] last:border-0">
                  <td className="p-4 text-[#F5EBE0]/70 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="p-4 font-mono text-xs text-[#E8A54B]">{log.action}</td>
                  <td className="p-4 text-[#F5EBE0]/80">
                    {log.resource_type ?? "—"}
                    {log.resource_id ? ` · ${log.resource_id.slice(0, 8)}…` : ""}
                  </td>
                  <td className="p-4 text-[#F5EBE0]/70">{log.actor_email ?? "system"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
