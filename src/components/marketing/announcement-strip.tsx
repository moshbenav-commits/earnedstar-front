import Link from "next/link";
import { EarnedStarLuckyStar } from "@/components/brand/earnedstar-lucky-star";

/** Figma BannerStrip — announcement row below nav */
export function AnnouncementStrip() {
  return (
    <div
      className="mt-16 border-b border-white/10 bg-[#0b1d58]/90 backdrop-blur-sm"
      data-surface="dark"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <p className="flex items-center gap-3 text-sm text-white/80">
          <EarnedStarLuckyStar size={22} variant="white" showBadge={false} className="shrink-0" />
          <span>
            New: Google Seller Ratings on Growth plans — stars in Shopping ads within days
          </span>
        </p>
        <Link
          href="#pricing"
          className="inline-flex items-center gap-1 text-sm font-semibold text-gold hover:text-gold-light"
        >
          See plans
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
