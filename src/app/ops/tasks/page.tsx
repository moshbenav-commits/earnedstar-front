/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { gtOpsFetch } from "@/lib/gt-ops-server";

type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
  owner_email: string | null;
};

export default async function OpsTasksPage() {
  const { data } = await gtOpsFetch("/tasks");
  const tasks = (Array.isArray(data) ? data : []) as Task[];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[#E8A54B]">Action Console</h1>
        <p className="mt-1 text-sm text-[#F5EBE0]/70">Turn findings into tracked remediation work.</p>
      </header>

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
                  <td className="p-4">{t.title}</td>
                  <td className="p-4 capitalize">{t.priority}</td>
                  <td className="p-4 capitalize">{t.status.replace(/_/g, " ")}</td>
                  <td className="p-4 text-[#F5EBE0]/70">{t.owner_email ?? "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
