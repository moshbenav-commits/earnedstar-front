"use client";

import type { CSSProperties, ReactNode } from "react";
import { CreytixMarkIcon } from "./CreytixMarkIcon";

export type CreytixPartnerLockupSize = "sm" | "md" | "lg";

const SIZE_PX: Record<CreytixPartnerLockupSize, number> = {
  sm: 32,
  md: 44,
  lg: 80,
};

export type CreytixPartnerLockupProps = {
  /** Partner brand / app icon URL (favicon or app icon). Optional when partnerInitial set. */
  partnerIconSrc?: string;
  /** Fallback letter mark when no icon file yet */
  partnerInitial?: string;
  partnerName: string;
  /** Defaults to /partnered-with-creytix */
  href?: string;
  size?: CreytixPartnerLockupSize | number;
  showCaption?: boolean;
  caption?: string;
  /** dark = light plus + caption; light = dark plus + caption */
  surface?: "dark" | "light";
  className?: string;
  /** When false, render as a non-link group (e.g. already inside a link). */
  link?: boolean;
};

/**
 * Fleet partner lockup: [partner icon] + [Creytix icon]
 * Spec: docs/creytix/CREYTIX_PARTNER_PORTFOLIO_SPEC.md
 */
export function CreytixPartnerLockup({
  partnerIconSrc,
  partnerInitial,
  partnerName,
  href = "/partnered-with-creytix",
  size = "md",
  showCaption = true,
  caption = "Partnered with Creytix",
  surface = "dark",
  className = "",
  link = true,
}: CreytixPartnerLockupProps) {
  const px = typeof size === "number" ? size : SIZE_PX[size];
  const muted = surface === "dark" ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.5)";
  const captionColor = surface === "dark" ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.65)";
  const initial =
    (partnerInitial ?? partnerName.trim().charAt(0) ?? "?").toUpperCase();

  const rowStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: Math.round(px * 0.28),
  };

  const plusStyle: CSSProperties = {
    fontSize: Math.round(px * 0.55),
    fontWeight: 500,
    lineHeight: 1,
    color: muted,
    userSelect: "none",
    fontFamily: "system-ui, -apple-system, sans-serif",
  };

  const iconFrame: CSSProperties = {
    width: px,
    height: px,
    flexShrink: 0,
    display: "block",
    borderRadius: Math.round(px * 0.22),
    objectFit: "contain",
  };

  const fallbackFrame: CSSProperties = {
    ...iconFrame,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: surface === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
    color: surface === "dark" ? "#fff" : "#111",
    fontSize: Math.round(px * 0.42),
    fontWeight: 700,
    fontFamily: "system-ui, -apple-system, sans-serif",
  };

  const label = `${partnerName} partnered with Creytix`;

  const partnerMark = partnerIconSrc ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={partnerIconSrc} alt="" width={px} height={px} style={iconFrame} />
  ) : (
    <span style={fallbackFrame} aria-hidden="true">
      {initial}
    </span>
  );

  const pair: ReactNode = (
    <span style={rowStyle}>
      {partnerMark}
      <span style={plusStyle} aria-hidden="true">
        +
      </span>
      <CreytixMarkIcon size={px} title="Creytix" />
    </span>
  );

  const body: ReactNode = (
    <span
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 6,
      }}
    >
      {pair}
      {showCaption ? (
        <span
          style={{
            fontSize: 12,
            lineHeight: 1.3,
            color: captionColor,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {caption}
        </span>
      ) : null}
    </span>
  );

  if (!link) {
    return (
      <span className={className} role="img" aria-label={label}>
        {body}
      </span>
    );
  }

  return (
    <a
      href={href}
      className={className}
      aria-label={label}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      {body}
    </a>
  );
}
