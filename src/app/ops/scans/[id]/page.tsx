/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import Link from "next/link";
import { gtOpsFetch } from "@/lib/gt-ops-server";
import { CategoryScoreGrid } from "@/components/ops/category-score-grid";

type ScanDetail = {
  run: {
    id: string;
    status: string;
    started_at: string | null;
    finished_at: string | null;
    created_at: string;
  };
  categoryScores: Record<string, number>;
  findingCount: number;
};

export default async function OpsScanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await gtOpsFetch(`/scans/${id}`);
  const detail = data as ScanDetail;

  if (!detail?.run) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <p className="text-[#F5EBE0]/70">Scan not found.</p>
        <Link href="/ops/scanner" className="text-[#C45C26] hover:underline">
          ← Scanner
        </Link>
      </div>
    );
  }

  const { run, categoryScores, findingCount } = detail;
  const overall =
    Object.values(categoryScores).length > 0
      ? Math.round(Object.values(categoryScores).reduce((a, b) => a + b, 0) / Object.values(categoryScores).length)
      : null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <Link href="/ops/scanner" className="text-sm text-[#C45C26] hover:underline">
          ← Scanner
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-[#E8A54B]">Scan {run.id.slice(0, 8)}…</h1>
        <p className="mt-1 text-sm capitalize text-[#F5EBE0]/70">
          {run.status} · {findingCount} findings
          {overall != null ? ` · ${overall}/100 health` : ""}
        </p>
      </header>

      <section className="rounded-xl border border-[#2a1f16] bg-[#1A120C] p-4 text-sm">
        <dl className="grid gap-2 sm:grid-cols-2">
          <div>
            <dt className="text-[#F5EBE0]/50">Started</dt>
            <dd>{run.started_at ? new Date(run.started_at).toLocaleString() : "—"}</dd>
          </div>
          <div>
            <dt className="text-[#F5EBE0]/50">Finished</dt>
            <dd>{run.finished_at ? new Date(run.finished_at).toLocaleString() : "—"}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-[#2a1f16] bg-[#1A120C] p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#E8A54B]">Category scores</h2>
        <div className="mt-4">
          <CategoryScoreGrid scores={categoryScores} />
        </div>
      </section>

      <Link
        href="/ops/scanner"
        className="inline-block rounded-lg bg-[#C45C26] px-4 py-2 text-sm font-semibold text-white hover:bg-[#a84d1f]"
      >
        View all findings
      </Link>
    </div>
  );
}
