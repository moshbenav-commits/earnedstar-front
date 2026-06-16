"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  EarnedStarLuckyStar,
  type LuckyStarVariant,
} from "@/components/brand/earnedstar-lucky-star";
import { Button } from "@/components/ui/button";
import { EarnedStarBadge, type EarnedStarBadgeVariant } from "@/components/ui/earnedstar-badge";
import { DEMO_MERCHANT_LOGO_URL } from "@/lib/brand-assets";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    id: "verified",
    title: "Verified by purchase",
    body: "Every review ties to a confirmed order — no guest posts or open submissions.",
    preview: { colorway: "navy" as LuckyStarVariant, badge: "pill" as EarnedStarBadgeVariant },
  },
  {
    id: "logo",
    title: "Your logo on widgets",
    body: "Lucky-star medallion on review widgets, invitation emails, and your public store profile.",
    preview: { colorway: "gold" as LuckyStarVariant, badge: "card" as EarnedStarBadgeVariant },
  },
  {
    id: "colorways",
    title: "Three embed colorways",
    body: "Navy/Gold, All Gold, and All White — match any storefront or dark chrome.",
    preview: { colorway: "white" as LuckyStarVariant, badge: "dark" as EarnedStarBadgeVariant },
  },
] as const;

const COLORWAYS: { id: LuckyStarVariant; label: string }[] = [
  { id: "navy", label: "Navy/Gold" },
  { id: "gold", label: "All Gold" },
  { id: "white", label: "All White" },
];

const BADGE_FORMATS: { id: EarnedStarBadgeVariant; label: string }[] = [
  { id: "pill", label: "Pill" },
  { id: "card", label: "Card" },
  { id: "stamp", label: "Stamp" },
  { id: "dark", label: "Dark" },
];

function previewSurface(colorway: LuckyStarVariant) {
  if (colorway === "white") {
    return "bg-[#0a1628] border-white/15";
  }
  if (colorway === "gold") {
    return "bg-gradient-to-br from-amber-950/50 via-[#0f1a2e] to-[#010509] border-gold/25";
  }
  /* Navy/Gold star on dark chrome — no cream slab */
  return "border-white/15 bg-white/[0.06] backdrop-blur-sm";
}

/** Figma Feature Split — left panel is a live widget preview studio */
export function FeatureSplitBanner() {
  const [colorway, setColorway] = useState<LuckyStarVariant>("navy");
  const [badgeVariant, setBadgeVariant] = useState<EarnedStarBadgeVariant>("pill");
  const [activeFeature, setActiveFeature] = useState(0);

  const selectFeature = (index: number) => {
    setActiveFeature(index);
    const { preview } = FEATURES[index]!;
    setColorway(preview.colorway);
    setBadgeVariant(preview.badge);
  };

  const active = FEATURES[activeFeature]!;
  const showLogoMedallion = active.id === "logo";

  return (
    <section id="features" className="py-20" data-scroll-theme="light">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-2xl border border-border bg-surface shadow-lg"
        >
          <div className="grid lg:grid-cols-[minmax(280px,320px)_1fr]">
            {/* Left — interactive embed preview (was static star art) */}
            <div
              className="relative flex min-h-[320px] flex-col bg-gradient-to-br from-[#0b1d58] to-[#010509] p-6 sm:p-8"
              data-surface="dark"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold/80">
                Widget preview
              </p>
              <p className="mt-1 text-sm text-white/55">
                Pick a colorway and embed style — see what shoppers get on your store.
              </p>

              <div className="mt-5">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  Star colorway
                </p>
                <div className="flex gap-2">
                  {COLORWAYS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setColorway(c.id)}
                      className={cn(
                        "flex flex-1 flex-col items-center gap-1.5 rounded-lg border px-2 py-2 transition",
                        colorway === c.id
                          ? "border-gold/60 bg-white/10"
                          : "border-white/15 bg-white/5 hover:border-white/30",
                      )}
                      aria-pressed={colorway === c.id}
                    >
                      <EarnedStarLuckyStar
                        size={32}
                        variant={c.id}
                        showBadge={showLogoMedallion}
                        logoUrl={showLogoMedallion ? DEMO_MERCHANT_LOGO_URL : undefined}
                      />
                      <span className="text-[10px] font-medium text-white/70">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={cn(
                  "mt-5 flex min-h-[120px] flex-1 items-center justify-center rounded-xl border p-4 transition-colors",
                  previewSurface(colorway),
                )}
              >
                <EarnedStarBadge
                  variant={badgeVariant}
                  merchantName="Meridian Gear"
                  rating={4.9}
                  reviewCount={2847}
                />
              </div>

              <div className="mt-4">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  Embed format
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {BADGE_FORMATS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setBadgeVariant(f.id)}
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition",
                        badgeVariant === f.id
                          ? "border-gold bg-gold/20 text-gold"
                          : "border-white/20 text-white/60 hover:border-white/35 hover:text-white/90",
                      )}
                      aria-pressed={badgeVariant === f.id}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <p className="mt-4 text-[11px] leading-relaxed text-white/40">
                One script tag on Growth+ · copies in under 30 seconds from your dashboard.
              </p>
            </div>

            <div className="p-8 sm:p-10">
              <span className="inline-flex rounded-full border border-gold/30 bg-gold-pale px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold-dark">
                Why EarnedStar
              </span>
              <h2 className="mt-4 text-2xl font-bold text-navy sm:text-3xl">
                Verified reviews,
                <br />
                <span className="font-display italic text-gold">beautifully displayed</span>
              </h2>

              <ul className="mt-8 space-y-3">
                {FEATURES.map((f, i) => (
                  <li key={f.id}>
                    <button
                      type="button"
                      onClick={() => selectFeature(i)}
                      className={cn(
                        "flex w-full gap-4 rounded-xl border p-4 text-left transition",
                        activeFeature === i
                          ? "border-gold/40 bg-gold-pale/50"
                          : "border-transparent hover:border-border hover:bg-surface-2/50",
                      )}
                      aria-pressed={activeFeature === i}
                    >
                      <EarnedStarLuckyStar
                        size={32}
                        variant={f.preview.colorway}
                        showBadge={f.id === "logo"}
                        logoUrl={f.id === "logo" ? DEMO_MERCHANT_LOGO_URL : undefined}
                        className="mt-0.5 shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-navy">{f.title}</p>
                        <p className="mt-1 text-sm text-text-muted">{f.body}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="primary" href="/signup">
                  Get Started
                </Button>
                <Button variant="ghost" href="#how-it-works">
                  How it works
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
