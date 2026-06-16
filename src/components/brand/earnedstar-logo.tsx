import Image from "next/image";
import { cn } from "@/lib/utils";
import { EarnedStarMark, type EarnedStarMarkProps } from "./earnedstar-mark";
import { LogoBackdrop, type LogoShell } from "./logo-backdrop";
import {
  DEMO_MERCHANT_LOGO_URL,
  LEATHER_WORDMARK_SRC,
  LOGO_3D_HORIZONTAL_SRC,
  LOGO_3D_LOCKUP_MIN_SIZE,
} from "@/lib/brand-assets";

interface EarnedStarLogoProps extends Omit<EarnedStarMarkProps, "darkBg" | "render"> {
  /** Reversed contexts: nav, footer, auth hero panel */
  variant?: "default" | "light";
  showWordmark?: boolean;
  /** Cream/stone platter behind photoreal mark — auto picks from variant */
  shell?: LogoShell;
  className?: string;
  /** Force vector fallback (favicon-sized only) */
  render?: "photo" | "svg";
}

export function EarnedStarLogo({
  showWordmark = true,
  size = 32,
  variant = "default",
  shell = "auto",
  className,
  style = "origami",
  centerStyle = "none",
  render = "photo",
  ...markProps
}: EarnedStarLogoProps) {
  const onDark = variant === "light";
  const usePhoto = render !== "svg" && style === "origami";
  const markSize = showWordmark ? Math.round(size * 0.92) : size;

  const use3dHorizontalLockup =
    showWordmark && usePhoto && !onDark && size >= LOGO_3D_LOCKUP_MIN_SIZE;

  const useLeatherWordmark = showWordmark && usePhoto && onDark && size >= 36;

  if (use3dHorizontalLockup) {
    const height = size;
    const width = Math.round(size * 3.98);
    return (
      <LogoBackdrop shell="light" onDark={false} size={size} className={className}>
        <Image
          src={LOGO_3D_HORIZONTAL_SRC}
          alt="EarnedStar"
          width={width}
          height={height}
          className="h-auto w-auto shrink-0 object-contain"
          style={{ height, width: "auto", maxWidth: width }}
          priority={size >= 80}
        />
      </LogoBackdrop>
    );
  }

  const mark = (
    <EarnedStarMark
      size={markSize}
      style={style}
      centerStyle={centerStyle}
      render={usePhoto ? "photo" : "svg"}
      {...markProps}
    />
  );

  const wordmark = showWordmark ? (
    useLeatherWordmark ? (
      <Image
        src={LEATHER_WORDMARK_SRC}
        alt="EarnedStar"
        width={Math.round(size * 2.8)}
        height={Math.round(size * 0.55)}
        className="h-auto shrink-0 object-contain"
        style={{ height: Math.max(14, Math.round(size * 0.42)), width: "auto" }}
        priority={size >= 48}
      />
    ) : (
      <span
        className="font-sans font-bold leading-none tracking-tight"
        style={{ fontSize: Math.max(13, Math.round(size * 0.36)) }}
      >
        <span className={onDark ? "text-navy" : "text-navy"}>Earned</span>
        <span className={onDark ? "text-gold-dark" : "text-gold"}>Star</span>
      </span>
    )
  ) : null;

  return (
    <LogoBackdrop shell={shell} onDark={onDark} size={size} className={cn("gap-2", className)}>
      {mark}
      {wordmark}
    </LogoBackdrop>
  );
}

export { DEMO_MERCHANT_LOGO_URL };
