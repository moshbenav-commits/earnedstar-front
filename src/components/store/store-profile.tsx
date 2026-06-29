/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ClipboardList,
  Package,
  ShieldCheck,
  Star,
  Truck,
  Wrench,
} from "lucide-react";
import { EarnedStarLuckyStarBadge } from "@/components/brand/earnedstar-lucky-star-badge";
import { AttributeBar } from "@/components/ui/attribute-bar";
import { StarRating } from "@/components/ui/star-rating";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { ReviewCard } from "@/components/ui/review-card";
import { Button } from "@/components/ui/button";
import type { Review } from "@/types/review";
import type { Merchant } from "@/types/review";
import type { PublicProfileSummary, QaPublicItem } from "@/lib/earnedstar-server";
import { ratingDistribution as mockDistribution } from "@/lib/mock-data";
import { activeReviewSummary } from "@/lib/review-summary";
import { cn } from "@/lib/utils";

type ProfileTab = "reviews" | "qa";

interface StoreProfileProps {
  business: Merchant & { response_rate?: number; joined_year?: number };
  reviews: Review[];
  qaItems?: QaPublicItem[];
  profile?: PublicProfileSummary | null;
  slug: string;
}

const PAGE_SIZE = 8;

export function StoreProfile({ business, reviews, qaItems = [], profile, slug }: StoreProfileProps) {
  const [tab, setTab] = useState<ProfileTab>("reviews");
  const [sort, setSort] = useState("recent");
  const [starFilter, setStarFilter] = useState<number | "all">("all");
  const [year, setYear] = useState("all");
  const [make, setMake] = useState("all");
  const [model, setModel] = useState("all");
  const [search, setSearch] = useState("");
  const [allReviews, setAllReviews] = useState(reviews);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(reviews.length >= PAGE_SIZE);
  const [qaQuestion, setQaQuestion] = useState("");
  const [qaName, setQaName] = useState("");
  const [qaSent, setQaSent] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const distribution = profile?.ratingDistribution ?? mockDistribution;
  const attributes = profile?.attributeAverages ?? {
    fitment: business.avg_rating,
    quality: business.avg_rating,
    shipping: business.avg_rating,
    description: business.avg_rating,
    install: business.avg_rating,
  };

  const years = useMemo(() => {
    const set = new Set(allReviews.map((r) => r.ymm_year).filter(Boolean) as number[]);
    return ["all", ...Array.from(set).sort((a, b) => b - a).map(String)];
  }, [allReviews]);

  const makes = useMemo(() => {
    const set = new Set(
      allReviews
        .filter((r) => year === "all" || String(r.ymm_year) === year)
        .map((r) => r.ymm_make)
        .filter(Boolean) as string[],
    );
    return ["all", ...Array.from(set).sort()];
  }, [allReviews, year]);

  const models = useMemo(() => {
    const set = new Set(
      allReviews
        .filter(
          (r) =>
            (year === "all" || String(r.ymm_year) === year) &&
            (make === "all" || r.ymm_make === make),
        )
        .map((r) => r.ymm_model)
        .filter(Boolean) as string[],
    );
    return ["all", ...Array.from(set).sort()];
  }, [allReviews, year, make]);

  const filtered = useMemo(() => {
    let list = allReviews.filter((r) => r.status === "published");
    if (starFilter !== "all") list = list.filter((r) => r.rating_overall === starFilter);
    if (year !== "all") list = list.filter((r) => String(r.ymm_year) === year);
    if (make !== "all") list = list.filter((r) => r.ymm_make === make);
    if (model !== "all") list = list.filter((r) => r.ymm_model === model);
    if (sort === "photos") list = list.filter((r) => (r.photos?.length ?? 0) > 0);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.review_text.toLowerCase().includes(q) ||
          r.customer_name.toLowerCase().includes(q) ||
          (r.product_name?.toLowerCase().includes(q) ?? false),
      );
    }
    if (sort === "helpful") list.sort((a, b) => (b.helpful_yes ?? 0) - (a.helpful_yes ?? 0));
    if (sort === "highest") list.sort((a, b) => b.rating_overall - a.rating_overall);
    if (sort === "lowest") list.sort((a, b) => a.rating_overall - b.rating_overall);
    return list;
  }, [allReviews, sort, starFilter, year, make, model, search]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const res = await fetch(
        `/api/earnedstar/reviews/merchant/${slug}?limit=${PAGE_SIZE}&offset=${allReviews.length}`,
      );
      if (!res.ok) return;
      const rows = (await res.json()) as Review[];
      if (rows.length < PAGE_SIZE) setHasMore(false);
      if (rows.length > 0) {
        setAllReviews((prev) => {
          const ids = new Set(prev.map((r) => r.id));
          return [...prev, ...rows.filter((r) => !ids.has(r.id))];
        });
      } else {
        setHasMore(false);
      }
    } finally {
      setLoadingMore(false);
    }
  }, [allReviews.length, hasMore, loadingMore, slug]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || tab !== "reviews") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMore();
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore, tab]);

  async function submitQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (qaQuestion.trim().length < 5) return;
    const res = await fetch(`/api/earnedstar/qa/public/${slug}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: qaQuestion, asked_by: qaName || undefined }),
    });
    if (res.ok) {
      setQaSent(true);
      setQaQuestion("");
    }
  }

  const ymmLabel =
    year !== "all" && make !== "all" && model !== "all"
      ? `${year} ${make} ${model}`
      : null;

  const customerSummary = activeReviewSummary(business);

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-surface py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <EarnedStarLuckyStarBadge
                variant="navy"
                size={88}
                logoUrl={business.logo_url}
                logoFallback={business.name.charAt(0)}
                className="shrink-0"
              />
              <div>
                <h1 className="text-2xl font-extrabold text-navy sm:text-3xl">{business.name}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <VerifiedBadge />
                  <span className="rounded-full bg-green-pale px-2 py-0.5 text-xs font-semibold text-green-dark">
                    Google Seller eligible
                  </span>
                </div>
                {business.website_url ? (
                  <a
                    href={business.website_url}
                    className="mt-2 inline-block text-sm text-navy-light hover:text-gold"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit store →
                  </a>
                ) : null}
              </div>
            </div>

            <div className="text-center lg:min-w-[220px] lg:text-right">
              <p className="text-5xl font-extrabold text-navy">{business.avg_rating}</p>
              <StarRating rating={business.avg_rating} size="lg" className="mt-2 justify-center lg:justify-end" />
              <p className="mt-2 text-sm text-text-muted">
                {business.review_count.toLocaleString()} verified reviews
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <AttributeBar label="Fitment" icon={Wrench} score={attributes.fitment} />
              <AttributeBar label="Quality" icon={Star} score={attributes.quality} />
              <AttributeBar label="Shipping" icon={Truck} score={attributes.shipping} />
              <AttributeBar label="Description" icon={ClipboardList} score={attributes.description} />
              <AttributeBar label="Install" icon={Package} score={attributes.install} />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-faint">Rating breakdown</p>
              {distribution.map((d) => (
                <div key={d.stars} className="flex items-center gap-3 text-sm">
                  <span className="w-8 text-navy">{d.stars}★</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full bg-gold"
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-text-muted">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {customerSummary ? (
        <div className="border-b border-border bg-gold-pale/40 py-6">
          <div className="mx-auto max-w-6xl px-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-dark">
              What customers say
            </p>
            <p className="mt-2 max-w-3xl text-base leading-relaxed text-navy">{customerSummary}</p>
          </div>
        </div>
      ) : null}

      <div className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
            {(
              [
                { id: "reviews" as const, label: "Reviews" },
                { id: "qa" as const, label: "Q&A" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-semibold transition",
                  tab === t.id ? "bg-navy text-white" : "text-text-muted hover:text-navy",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "reviews" ? (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <select
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  setMake("all");
                  setModel("all");
                }}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                aria-label="Filter by year"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y === "all" ? "All years" : y}
                  </option>
                ))}
              </select>
              <select
                value={make}
                onChange={(e) => {
                  setMake(e.target.value);
                  setModel("all");
                }}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                aria-label="Filter by make"
              >
                {makes.map((m) => (
                  <option key={m} value={m}>
                    {m === "all" ? "All makes" : m}
                  </option>
                ))}
              </select>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                aria-label="Filter by model"
              >
                {models.map((m) => (
                  <option key={m} value={m}>
                    {m === "all" ? "All models" : m}
                  </option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                aria-label="Sort reviews"
              >
                <option value="recent">Most Recent</option>
                <option value="helpful">Most Helpful</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
                <option value="photos">With Photos</option>
              </select>
              <input
                type="search"
                placeholder="Search reviews…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="min-w-[140px] flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {tab === "reviews" ? (
          <>
            {ymmLabel ? (
              <p className="mb-4 text-sm text-text-muted">
                Showing {filtered.length} reviews from buyers with a {ymmLabel}
              </p>
            ) : (
              <p className="mb-4 text-sm text-text-muted">
                Showing {filtered.length} verified review{filtered.length === 1 ? "" : "s"}
              </p>
            )}
            <main className="space-y-4">
              {filtered.map((review, i) => (
                <ReviewCard key={review.id} review={review} showResponse animationDelay={i * 0.02} />
              ))}
              {filtered.length === 0 ? (
                <p className="rounded-lg border border-border bg-surface p-8 text-center text-sm text-text-muted">
                  No reviews match these filters yet.
                </p>
              ) : null}
              {hasMore ? (
                <div ref={loadMoreRef} className="py-6 text-center text-sm text-text-faint">
                  {loadingMore ? "Loading more reviews…" : "Scroll for more"}
                </div>
              ) : null}
            </main>
          </>
        ) : (
          <section className="card-surface gold-seam p-6">
            <h2 className="text-lg font-bold text-navy">Questions &amp; answers</h2>
            <p className="mt-1 text-sm text-text-muted">Answers from {business.name}</p>
            {qaItems.length > 0 ? (
              <dl className="mt-6 space-y-6">
                {qaItems.map((item) => (
                  <div key={item.id}>
                    <dt className="font-semibold text-navy">{item.question}</dt>
                    <dd className="mt-2 text-sm text-text-muted">{item.answer}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-6 text-sm text-text-muted">No published Q&amp;A yet.</p>
            )}

            <form onSubmit={submitQuestion} className="mt-8 max-w-lg space-y-3 border-t border-border pt-6">
              <h3 className="font-semibold text-navy">Ask a question</h3>
              <label className="block text-sm text-navy">
                Your question
                <textarea
                  required
                  minLength={5}
                  value={qaQuestion}
                  onChange={(e) => setQaQuestion(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="Ask about fitment, shipping, warranty…"
                />
              </label>
              <label className="block text-sm text-navy">
                Your name <span className="text-text-faint">(optional)</span>
                <input
                  type="text"
                  value={qaName}
                  onChange={(e) => setQaName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                />
              </label>
              <Button type="submit">Submit question</Button>
              {qaSent ? (
                <p className="text-sm text-green-dark">Thanks — the store will answer when they can.</p>
              ) : null}
            </form>
          </section>
        )}
      </div>

      <aside className="mx-auto mb-8 flex max-w-6xl justify-center px-4 lg:hidden">
        <div className="card-surface flex items-center gap-3 p-4 text-sm">
          <ShieldCheck className="text-green-dark" size={20} aria-hidden />
          <span className="text-text-muted">All reviews verified by purchase with AI fraud detection</span>
        </div>
      </aside>
    </div>
  );
}
