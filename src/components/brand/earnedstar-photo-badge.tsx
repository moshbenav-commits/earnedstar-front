import {
  EarnedStarLuckyStar,
  type LuckyStarVariant,
} from "./earnedstar-lucky-star";
import { cn } from "@/lib/utils";

export type EarnedStarPhotoBadgeProps = {
  variant?: LuckyStarVariant;
  size?: number;
  logoUrl?: string | null;
  alt?: string;
  className?: string;
  logoFallback?: string;
};

/** Merchant badge — Figma Make lucky star SVG with optional logo overlay. */
export function EarnedStarPhotoBadge({
  variant = "navy",
  size = 128,
  logoUrl,
  className,
}: EarnedStarPhotoBadgeProps) {
  return (
    <EarnedStarLuckyStar
      size={size}
      variant={variant}
      showBadge
      logoUrl={logoUrl}
      className={cn("shrink-0", className)}
    />
  );
}

/** Navy, gold, and white lucky star variants — widget builder / marketing */
export function EarnedStarPhotoBadgeVariants({
  size = 96,
  logoUrl,
  className,
}: {
  size?: number;
  logoUrl?: string | null;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-center gap-6", className)}>
      {(["navy", "gold", "white"] as const).map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-2">
          <EarnedStarLuckyStar size={size} variant={variant} showBadge logoUrl={logoUrl} />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-text-faint">
            {variant}
          </span>
        </div>
      ))}
    </div>
  );
}
