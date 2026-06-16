"use client";

import { useMemo, useState } from "react";
import { EarnedStarMark } from "@/components/brand/earnedstar-mark";
import { StarRating } from "@/components/ui/star-rating";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { ReviewCard } from "@/components/ui/review-card";
import { Button } from "@/components/ui/button";
import type { Review } from "@/types/review";
import type { Merchant } from "@/types/review";
import { ratingDistribution } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface StoreProfileProps {
  business: Merchant & { response_rate?: number; joined_year?: number };
  reviews: Review[];
}

export function StoreProfile({ business, reviews }: StoreProfileProps) {
  const [sort, setSort] = useState("recent");
  const [starFilter, setStarFilter] = useState<number | "all">("all");
  const [product, setProduct] = useState("all");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(4);

  const products = useMemo(() => {
    const names = reviews.map((r) => r.product_name).filter(Boolean) as string[];
    return ["all", ...Array.from(new Set(names))];
  }, [reviews]);

  const filtered = useMemo(() => {
    let list = [...reviews];
    if (starFilter !== "all") list = list.filter((r) => r.rating_overall === starFilter);
    if (product !== "all") list = list.filter((r) => r.product_name === product);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => r.review_text.toLowerCase().includes(q) || r.customer_name.toLowerCase().includes(q));
    }
    if (sort === "highest") list.sort((a, b) => b.rating_overall - a.rating_overall);
    if (sort === "lowest") list.sort((a, b) => a.rating_overall - b.rating_overall);
    return list;
  }, [reviews, sort, starFilter, product, search]);

  const shown = filtered.slice(0, visible);

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-surface py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-gold/30 bg-navy-pale text-2xl font-bold text-navy">
              {business.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-navy sm:text-3xl">{business.name}</h1>
              <div className="mt-2">
                <VerifiedBadge />
              </div>
            </div>
          </div>
          <div className="text-center lg:text-right">
            <p className="text-5xl font-extrabold text-navy">{business.avg_rating}</p>
            <StarRating rating={business.avg_rating} size="lg" className="mt-2 justify-center lg:justify-end" />
            <p className="mt-2 text-sm text-text-muted">
              {business.review_count.toLocaleString()} Verified Reviews
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-end">
              {ratingDistribution.map((d) => (
                <span key={d.stars} className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-text-muted">
                  {d.stars}★ {d.pct}%
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            aria-label="Sort reviews"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
          <div className="flex flex-wrap gap-1">
            {(["all", 5, 4, 3, 2, 1] as const).map((s) => (
              <button
                key={String(s)}
                type="button"
                onClick={() => setStarFilter(s)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold transition",
                  starFilter === s ? "bg-navy text-white" : "bg-surface-2 text-text-muted hover:text-navy",
                )}
              >
                {s === "all" ? "All" : `${s}★`}
              </button>
            ))}
          </div>
          <select
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            aria-label="Filter by product"
          >
            {products.map((p) => (
              <option key={p} value={p}>
                {p === "all" ? "All Products" : p}
              </option>
            ))}
          </select>
          <input
            type="search"
            placeholder="Search reviews…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-[140px] flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1fr_280px]">
        <main className="space-y-4">
          {shown.map((review, i) => (
            <ReviewCard key={review.id} review={review} showResponse animationDelay={i * 0.03} />
          ))}
          {visible < filtered.length ? (
            <Button variant="ghost" className="w-full" onClick={() => setVisible((v) => v + 4)}>
              Load more reviews
            </Button>
          ) : null}
        </main>

        <aside className="hidden space-y-4 lg:block">
          <div className="card-surface gold-seam p-6 text-center">
            <EarnedStarMark size={72} centerStyle="stars" className="mx-auto" />
            <p className="mt-4 text-sm font-semibold text-navy">EarnedStar Verified</p>
            <p className="text-xs text-text-muted">Reviews tied to real purchases</p>
          </div>
          <div className="card-surface space-y-3 p-6 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Avg rating</span>
              <span className="font-bold text-navy">{business.avg_rating}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Total reviews</span>
              <span className="font-bold text-navy">{business.review_count.toLocaleString()}</span>
            </div>
            {business.response_rate != null ? (
              <div className="flex justify-between">
                <span className="text-text-muted">Response rate</span>
                <span className="font-bold text-navy">{business.response_rate}%</span>
              </div>
            ) : null}
            {business.joined_year ? (
              <p className="border-t border-border pt-3 text-xs text-text-faint">
                Joined EarnedStar in {business.joined_year}
              </p>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
