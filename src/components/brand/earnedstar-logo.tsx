import Image from "next/image";
import { cn } from "@/lib/utils";
import { EarnedStarMark, type EarnedStarMarkProps } from "./earnedstar-mark";
import { LOGO_3D_HORIZONTAL_SRC, LOGO_3D_LOCKUP_MIN_SIZE } from "@/lib/brand-assets";

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
  render,
  ...markProps
}: EarnedStarLogoProps) {
  const onDark = variant === "light";
  const wordmarkSize = Math.max(14, Math.round(size * 0.38));
  const useHorizontalLockup =
    showWordmark &&
    style === "origami" &&
    render !== "svg" &&
    size >= LOGO_3D_LOCKUP_MIN_SIZE &&
    !onDark;

  if (useHorizontalLockup) {
    const height = size;
    const width = Math.round(size * 3.98);
    return (
      <Image
        src={LOGO_3D_HORIZONTAL_SRC}
        alt="EarnedStar"
        width={width}
        height={height}
        className={cn("h-auto w-auto shrink-0 object-contain", className)}
        style={{ height, width: "auto", maxWidth: width }}
        priority={size >= 80}
      />
    );
  }

  return (
    <div className={cn("inline-flex items-center", className)} style={{ gap: Math.round(size * 0.12) }}>
      <EarnedStarMark
        size={size}
        style={style}
        centerStyle={centerStyle}
        darkBg={onDark}
        render={render}
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
