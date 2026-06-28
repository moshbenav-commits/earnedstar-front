/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */

const LABELS: Record<string, string> = {
  seo_metadata: "SEO metadata",
  content_quality: "Content quality",
  product_data: "Product data",
  collection_quality: "Collections",
  store_hygiene: "Store hygiene",
  app_overlap: "App overlap",
};

export function CategoryScoreGrid({ scores }: { scores: Record<string, number> }) {
  const entries = Object.entries(scores);
  if (entries.length === 0) {
    return (
      <p className="text-sm text-[#F5EBE0]/60">
        Run a scan to see category scores.
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map(([category, score]) => (
        <div key={category} className="rounded-lg border border-[#2a1f16] bg-[#0f0a07] p-3">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="text-[#F5EBE0]/80">{LABELS[category] ?? category.replace(/_/g, " ")}</span>
            <span className="font-semibold text-[#E8A54B]">{score}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#2a1f16]">
            <div
              className="h-full rounded-full bg-[#C45C26] transition-all"
              style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
