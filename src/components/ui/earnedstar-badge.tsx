import { EarnedStarMark } from "@/components/brand/earnedstar-mark";
import { StarRating } from "@/components/ui/star-rating";
import { cn } from "@/lib/utils";

export type EarnedStarBadgeVariant = "pill" | "card" | "stamp" | "dark";

interface EarnedStarBadgeProps {
  variant?: EarnedStarBadgeVariant;
  rating?: number;
  reviewCount?: number;
  merchantName?: string;
  className?: string;
}

export function EarnedStarBadge({
  variant = "pill",
  rating = 4.9,
  reviewCount = 2847,
  merchantName = "Verified Store",
  className,
}: EarnedStarBadgeProps) {
  const countLabel = reviewCount.toLocaleString();

  if (variant === "pill") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-gold/30 bg-navy px-4 py-2 shadow-sm",
          className,
        )}
        data-surface="dark"
      >
        <EarnedStarMark size={28} centerStyle="none" />
        <div>
          <StarRating rating={rating} size="sm" />
          <p className="text-xs text-white/70">{countLabel} verified reviews</p>
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={cn("card-surface gold-seam max-w-xs p-4", className)}>
        <div className="flex items-center gap-3">
          <EarnedStarMark size={40} centerStyle="none" />
          <div>
            <p className="font-semibold text-navy">{merchantName}</p>
            <StarRating rating={rating} size="sm" />
          </div>
        </div>
        <p className="mt-3 text-sm text-text-muted">{countLabel} purchase-verified reviews on EarnedStar</p>
      </div>
    );
  }

  if (variant === "stamp") {
    return (
      <div
        className={cn(
          "inline-flex rotate-[-2deg] flex-col items-center rounded-lg border-2 border-dashed border-gold bg-gold-pale px-5 py-4 text-center",
          className,
        )}
      >
        <EarnedStarMark size={36} centerStyle="none" />
        <p className="mt-2 text-xs font-bold uppercase tracking-wider text-navy">EarnedStar Verified</p>
        <p className="text-sm font-semibold text-gold-dark">{rating} ★ · {countLabel}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-xl bg-dark-bg px-5 py-4 text-white shadow-lg",
        className,
      )}
      data-surface="dark"
    >
      <EarnedStarMark size={44} centerStyle="none" />
      <div>
        <p className="text-sm font-semibold text-gold">EarnedStar Verified</p>
        <StarRating rating={rating} size="sm" />
        <p className="text-xs text-white/70">{countLabel} reviews actually earned</p>
      </div>
    </div>
  );
}
