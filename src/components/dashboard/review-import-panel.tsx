/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ImportSource = "yotpo" | "loox" | "judgeme" | "stamped";

const SOURCES: { value: ImportSource; label: string }[] = [
  { value: "yotpo", label: "Yotpo" },
  { value: "loox", label: "Loox" },
  { value: "judgeme", label: "Judge.me" },
  { value: "stamped", label: "Stamped.io" },
];

type RowResult = { row: number; ok: boolean; status?: "imported" | "duplicate"; error?: string };

type ImportSummary = {
  ok: boolean;
  source: ImportSource;
  total: number;
  imported: number;
  duplicate: number;
  failed: number;
  results: RowResult[];
};

/**
 * Phase 3f — free review-import migration UI. Merchant picks the platform
 * they're migrating away from, uploads its CSV export, and sees a
 * per-import result summary (imported / duplicate / failed with reasons).
 * Column mapping happens server-side (per-source adapters in
 * earnedstar-back/src/earnedstar/review-import/) — this panel just ships
 * the raw CSV text + chosen source.
 */
export function ReviewImportPanel({ merchantSlug = "meridian-gear" }: { merchantSlug?: string }) {
  const router = useRouter();
  const [source, setSource] = useState<ImportSource>("yotpo");
  const [fileName, setFileName] = useState<string | null>(null);
  const [csvText, setCsvText] = useState<string | null>(null);
  const [rowCount, setRowCount] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ingestFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      setCsvText(text);
      setFileName(file.name);
      setRowCount(Math.max(0, text.trim().split(/\r?\n/).filter(Boolean).length - 1));
      setSummary(null);
      setError(null);
    };
    reader.readAsText(file);
  }, []);

  async function handleImport() {
    if (!csvText) return;
    setLoading(true);
    setSummary(null);
    setError(null);
    try {
      const res = await fetch(`/api/earnedstar/reviews/import-csv?slug=${merchantSlug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, csv: csvText }),
      });
      const data = (await res.json()) as ImportSummary & { message?: string };
      if (!res.ok) throw new Error(data.message ?? "Import failed");
      setSummary(data);
      setCsvText(null);
      setFileName(null);
      setRowCount(0);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card-surface gold-seam p-6">
      <h2 className="text-lg font-bold text-navy">Migrate reviews from another platform</h2>
      <p className="mt-1 text-sm text-text-muted">
        Import your existing reviews from Yotpo, Loox, Judge.me, or Stamped.io — export a CSV from
        that platform&rsquo;s dashboard, pick the source below, and upload it here. Free on every plan.
      </p>

      <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-text-faint">
        Source platform
      </label>
      <div className="mt-2 flex flex-wrap gap-2">
        {SOURCES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => setSource(s.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-semibold transition",
              source === s.value
                ? "border-gold bg-gold-pale/40 text-navy"
                : "border-border text-text-muted hover:border-gold/50",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div
        className={cn(
          "mt-4 flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition",
          dragOver ? "border-gold bg-gold-pale/30" : "border-border bg-surface-2/50 hover:border-gold/50",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files[0];
          if (file) ingestFile(file);
        }}
        onClick={() => document.getElementById("review-import-csv-input")?.click()}
      >
        <Upload className="text-text-faint" size={28} aria-hidden />
        <p className="mt-2 text-sm font-medium text-navy">
          {fileName ? fileName : "Drop CSV here or click to browse"}
        </p>
        <p className="mt-1 text-xs text-text-faint">
          {fileName ? `${rowCount} row${rowCount === 1 ? "" : "s"} detected` : "Up to 1,000 rows per import"}
        </p>
        <input
          id="review-import-csv-input"
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) ingestFile(file);
            e.target.value = "";
          }}
        />
      </div>

      {csvText ? (
        <Button className="mt-4" onClick={handleImport} disabled={loading}>
          {loading ? "Importing…" : `Import ${rowCount} review${rowCount === 1 ? "" : "s"} from ${SOURCES.find((s) => s.value === source)?.label}`}
        </Button>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      {summary ? (
        <div className="mt-4 space-y-3">
          <p className="rounded-lg bg-green-pale px-4 py-3 text-sm text-green-dark">
            Imported {summary.imported} of {summary.total} — {summary.duplicate} already imported
            (skipped), {summary.failed} failed.
          </p>
          {summary.failed > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px] text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-text-faint">
                    <th className="py-1.5 pr-3">Row</th>
                    <th className="py-1.5">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.results
                    .filter((r) => !r.ok)
                    .slice(0, 25)
                    .map((r) => (
                      <tr key={r.row} className="border-b border-border/60">
                        <td className="py-1.5 pr-3 text-text-muted">{r.row}</td>
                        <td className="py-1.5 text-text-muted">{r.error}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {summary.failed > 25 ? (
                <p className="mt-2 text-xs text-text-faint">+ {summary.failed - 25} more failed rows</p>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
