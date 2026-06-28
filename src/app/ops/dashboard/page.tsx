/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { gtOpsFetch } from "@/lib/gt-ops-server";
import { CategoryScoreGrid } from "@/components/ops/category-score-grid";
import Link from "next/link";

type Dashboard = {
  storeScore: number | null;
  categoryScores?: Record<string, number>;
  openFindings: { critical: number; high: number; medium: number; low: number; info: number };
  openTasks: number;
  tasksDueSoon?: number;
  upcomingTasks?: Array<{ id: string; title: string; due_at: string; status: string }>;
  seoIssueCount: number;
  recentScans: { id: string; status: string; created_at: string }[];
};

export default async function OpsDashboardPage() {
  const { data } = await gtOpsFetch("/dashboard");
  const dash = data as Dashboard;

  const findingTotal = Object.values(dash.openFindings ?? {}).reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-[#E8A54B]">Dashboard</h1>
        <p className="mt-1 text-sm text-[#F5EBE0]/70">
          Discover and fix hidden store gaps — visibility, data quality, execution speed.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Store health" value={dash.storeScore != null ? `${dash.storeScore}/100` : "—"} />
        <StatCard label="Open findings" value={String(findingTotal)} />
        <StatCard label="Open tasks" value={String(dash.openTasks ?? 0)} />
        <StatCard label="SEO issues" value={String(dash.seoIssueCount ?? 0)} />
      </div>

      <section className="rounded-xl border border-[#2a1f16] bg-[#1A120C] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#E8A54B]">Score by category</h2>
        <div className="mt-4">
          <CategoryScoreGrid scores={dash.categoryScores ?? {}} />
        </div>
      </section>

      <section className="rounded-xl border border-[#2a1f16] bg-[#1A120C] p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#E8A54B]">
            Tasks due soon ({dash.tasksDueSoon ?? 0})
          </h2>
          <Link href="/ops/tasks" className="text-sm text-[#C45C26] hover:underline">
            Action Console →
          </Link>
        </div>
        <ul className="mt-4 space-y-2 text-sm">
          {(dash.upcomingTasks ?? []).length === 0 ? (
            <li className="text-[#F5EBE0]/60">No due dates set — assign deadlines on open tasks.</li>
          ) : (
            dash.upcomingTasks!.map((t) => (
              <li key={t.id} className="flex flex-wrap justify-between gap-2 border-b border-[#2a1f16] py-2 last:border-0">
                <Link href={`/ops/tasks/${t.id}`} className="text-[#E8A54B] hover:underline">
                  {t.title}
                </Link>
                <span className="text-[#F5EBE0]/60">
                  {new Date(t.due_at).toLocaleDateString()} · {t.status.replace(/_/g, " ")}
                </span>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="rounded-xl border border-[#2a1f16] bg-[#1A120C] p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#E8A54B]">Recent scans</h2>
          <Link href="/ops/scanner" className="text-sm text-[#C45C26] hover:underline">
            Run scan →
          </Link>
        </div>
        <ul className="mt-4 space-y-2 text-sm">
          {(dash.recentScans ?? []).length === 0 ? (
            <li className="text-[#F5EBE0]/60">No scans yet — load demo catalog and run your first audit.</li>
          ) : (
            dash.recentScans.map((s) => (
              <li key={s.id} className="flex justify-between border-b border-[#2a1f16] py-2 last:border-0">
                <Link href={`/ops/scans/${s.id}`} className="font-mono text-[#E8A54B] hover:underline">
                  {s.id.slice(0, 8)}…
                </Link>
                <span className="capitalize text-[#F5EBE0]/70">{s.status}</span>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#2a1f16] bg-[#1A120C] p-4">
      <p className="text-xs uppercase tracking-wide text-[#F5EBE0]/60">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#F5EBE0]">{value}</p>
    </div>
  );
}
