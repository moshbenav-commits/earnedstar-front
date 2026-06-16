"use client";

import { useState } from "react";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import {
  EarnedStarPhotoBadge,
  EarnedStarPhotoBadgeVariants,
} from "@/components/brand/earnedstar-photo-badge";
import { BADGE_PHOTO_VARIANTS } from "@/lib/badge-photo-assets";
import { mockBusiness } from "@/lib/mock-data";

const DEMO_LOGO = "https://www.expediaparts.com/favicon.ico";

function photoEmbedSnippet(color: string, size: number, logo: string) {
  const base = "https://earnedstar.com";
  return `<!-- EarnedStar photo badge (${color}) -->
<div class="earnedstar-badge" style="position:relative;display:inline-block;width:${size}px;height:${size}px;">
  <img src="${base}/brand/badge/earnedstar-${color}-photo-logo-128.png" alt="EarnedStar badge" style="width:100%;height:100%;display:block;">
  <img src="${logo}" alt="Merchant logo" style="position:absolute;inset:50%;width:${Math.round((size * 46) / 128)}px;height:${Math.round((size * 46) / 128)}px;transform:translate(-50%,-49%);border-radius:999px;object-fit:cover;">
</div>`;
}

function scriptEmbedSnippet(color: string, size: number, logo: string) {
  return `<script src="https://earnedstar.com/badge/v1/badge.js"
  data-key="YOUR_API_KEY"
  data-style="photo"
  data-color="${color}"
  data-logo="${logo}"
  data-size="${size}"
  data-position="bottom-right"></script>`;
}

export default function WidgetsPage() {
  const [color, setColor] = useState<(typeof BADGE_PHOTO_VARIANTS)[number]>("navy");
  const [size, setSize] = useState(128);
  const logo = DEMO_LOGO;
  const htmlSnippet = photoEmbedSnippet(color, size, logo);
  const scriptSnippet = scriptEmbedSnippet(color, size, logo);

  return (
    <>
      <DashboardTopbar title="Widgets" />
      <main className="p-8">
        <p className="text-text-secondary">
          Copy embed code for your store badge. Swap navy, gold, or white and drop your logo in the center.
        </p>

        <section className="card-surface mt-8 p-6">
          <h2 className="text-lg font-bold text-navy">Photo badge — color variants</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Photoreal leather star with your logo in the center medallion.
          </p>

          <div className="mt-6">
            <EarnedStarPhotoBadgeVariants size={96} logoUrl={logo} />
          </div>

          <div className="mt-8 flex flex-wrap items-end gap-6">
            <label className="text-sm font-medium text-navy">
              Color
              <select
                className="mt-1 block rounded-md border border-border bg-surface px-3 py-2 text-sm"
                value={color}
                onChange={(e) => setColor(e.target.value as (typeof BADGE_PHOTO_VARIANTS)[number])}
              >
                {BADGE_PHOTO_VARIANTS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-navy">
              Size (px)
              <input
                type="number"
                min={64}
                max={256}
                className="mt-1 block w-24 rounded-md border border-border bg-surface px-3 py-2 text-sm"
                value={size}
                onChange={(e) => setSize(Number(e.target.value) || 128)}
              />
            </label>
            <EarnedStarPhotoBadge variant={color} size={size} logoUrl={logo} />
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-faint">HTML snippet</p>
              <pre className="mt-2 overflow-x-auto rounded-md bg-bg-elevated p-3 text-xs text-text-secondary">
                {htmlSnippet}
              </pre>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-faint">Floating script</p>
              <pre className="mt-2 overflow-x-auto rounded-md bg-bg-elevated p-3 text-xs text-text-secondary">
                {scriptSnippet}
              </pre>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {[
            { id: "carousel", name: "Carousel", desc: "Horizontal scrolling review cards" },
            { id: "grid", name: "Grid", desc: "Masonry grid of up to 9 reviews" },
            { id: "testimonial", name: "Testimonial", desc: "Single featured review, large format" },
            { id: "feed", name: "Feed", desc: "Vertical list of most recent reviews" },
          ].map((widget) => {
            const embedCode = `<script src="https://cdn.earnedstar.com/widget.js" data-key="YOUR_API_KEY" data-widget="${widget.id}" data-max="6"></script>`;
            return (
              <div key={widget.id} className="card-surface p-6">
                <h3 className="font-semibold text-text-primary">{widget.name}</h3>
                <p className="mt-1 text-sm text-text-secondary">{widget.desc}</p>
                <div className="mt-4 rounded-md border border-border bg-bg-elevated p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-star">★★★★★</span>
                    <span className="text-sm text-text-muted">
                      {mockBusiness.avg_rating} · {mockBusiness.review_count.toLocaleString()} reviews
                    </span>
                  </div>
                </div>
                <pre className="mt-4 overflow-x-auto rounded-md bg-bg-elevated p-3 text-xs text-text-secondary">
                  {embedCode}
                </pre>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
