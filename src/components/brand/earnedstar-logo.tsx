import Image from "next/image";
import { cn } from "@/lib/utils";
import { LOGO_3D_HORIZONTAL } from "@/lib/brand-assets";
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
  render,
  ...markProps
}: EarnedStarLogoProps) {
  const onDark = variant === "light";
  const wordmarkSize = Math.max(14, Math.round(size * 0.38));
  const use3dLockup =
    showWordmark &&
    style === "origami" &&
    render !== "svg" &&
    !onDark &&
    size >= 100;

  if (use3dLockup) {
    const height = Math.round(size * 0.42);
    const width = Math.round(height * (517 / 130));
    return (
      <Image
        src={LOGO_3D_HORIZONTAL}
        alt="EarnedStar"
        width={width}
        height={height}
        className={cn("shrink-0 object-contain object-left", className)}
        priority={size >= 120}
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
