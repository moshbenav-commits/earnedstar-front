import { cn } from "@/lib/utils";
import { EarnedStarMark, type EarnedStarMarkProps } from "./earnedstar-mark";

interface EarnedStarLogoProps extends Omit<EarnedStarMarkProps, "darkBg"> {
  /** @deprecated name kept for footer — means reversed wordmark on dark backgrounds */
  variant?: "default" | "light";
  showWordmark?: boolean;
  className?: string;
}

export function EarnedStarLogo({
  showWordmark = true,
  size = 32,
  variant = "default",
  className,
  style = "origami",
  centerStyle = "check",
  ...markProps
}: EarnedStarLogoProps) {
  const onDark = variant === "light";
  const wordmarkSize = Math.max(14, Math.round(size * 0.38));

  return (
    <div className={cn("inline-flex items-center", className)} style={{ gap: Math.round(size * 0.12) }}>
      <EarnedStarMark
        size={size}
        style={style}
        centerStyle={centerStyle}
        darkBg={onDark}
        {...markProps}
      />
      {showWordmark ? (
        <span
          className="font-sans font-extrabold leading-none tracking-tight"
          style={{ fontSize: wordmarkSize }}
        >
          <span className={onDark ? "text-white" : "text-navy"}>Earned</span>
          <span className="text-gold">Star</span>
        </span>
      ) : null}
    </div>
  );
}
