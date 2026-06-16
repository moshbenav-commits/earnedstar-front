import { ratingDistribution } from "@/lib/mock-data";

export function RatingDistributionChart() {
  return (
    <section className="card-surface gold-seam p-6">
      <h2 className="text-lg font-bold text-navy">Rating distribution</h2>
      <p className="mt-1 text-sm text-text-muted">All verified reviews — last 30 days</p>
      <div className="mt-6 space-y-3">
        {ratingDistribution.map((row) => (
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
