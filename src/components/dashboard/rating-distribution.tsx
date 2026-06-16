import { ratingDistribution as mockDistribution } from "@/lib/mock-data";

const STAR_COLORS: Record<number, string> = {
  5: "#F59E0B",
  4: "#84CC16",
  3: "#EAB308",
  2: "#F97316",
  1: "#EF4444",
};

type Row = { stars: number; count: number; pct: number; color?: string };

export function RatingDistributionChart({
  distribution,
}: {
  distribution?: { stars: number; count: number; pct: number }[] | null;
}) {
  const rows: Row[] = (distribution?.length ? distribution : mockDistribution).map((row) => ({
    ...row,
    color: STAR_COLORS[row.stars] ?? "#F59E0B",
  }));

  return (
    <section className="card-surface gold-seam p-6">
      <h2 className="text-lg font-bold text-navy">Rating distribution</h2>
      <p className="mt-1 text-sm text-text-muted">All verified reviews</p>
      <div className="mt-6 space-y-3">
        {rows.map((row) => (
          <div key={row.stars} className="flex items-center gap-3">
            <span className="w-8 shrink-0 text-sm font-semibold text-navy">{row.stars}★</span>
            <div className="relative h-7 flex-1 overflow-hidden rounded-full bg-surface-2">
              <div
                className="flex h-full items-center rounded-full px-3 text-xs font-semibold text-white transition-all"
                style={{ width: `${Math.max(row.pct, 8)}%`, backgroundColor: row.color }}
              >
                <span className="truncate">
                  {row.count.toLocaleString()} · {row.pct}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
