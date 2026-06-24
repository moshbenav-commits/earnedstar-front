/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import Image from "next/image";
import { useId } from "react";
import { cn } from "@/lib/utils";

export type LuckyStarVariant = "navy" | "gold" | "white";

const VARS: Record<
  LuckyStarVariant,
  {
    g0: string;
    g1: string;
    g2: string;
    diffColor: string;
    specK: number;
    specExp: number;
    sScale: number;
    crease0: string;
    crease1: string;
    facetDark: string;
    badge: string;
    badgeText: string;
    ringA: string;
    ringB: string;
    edge: string;
  }
> = {
  navy: {
    g0: "#3060b8",
    g1: "#0b1d58",
    g2: "#010509",
    diffColor: "#4878d0",
    specK: 3.4,
    specExp: 85,
    sScale: 9,
    crease0: "#ffe84a",
    crease1: "#8a6008",
    facetDark: "rgba(0,2,18,0.38)",
    badge: "#f0e090",
    badgeText: "#160e00",
    ringA: "#ffe448",
    ringB: "#885008",
    edge: "rgba(80,140,255,0.15)",
  },
  gold: {
    g0: "#fff080",
    g1: "#cc8e0e",
    g2: "#5c2e02",
    diffColor: "#fff0a0",
    specK: 5.2,
    specExp: 140,
    sScale: 11,
    crease0: "#ffffff",
    crease1: "#b07010",
    facetDark: "rgba(30,10,0,0.32)",
    badge: "#fffef8",
    badgeText: "#160e00",
    ringA: "#ffffff",
    ringB: "#a86c08",
    edge: "rgba(255,245,140,0.3)",
  },
  white: {
    g0: "#ffffff",
    g1: "#c4d0ec",
    g2: "#5a6280",
    diffColor: "#b0c4f0",
    specK: 2.4,
    specExp: 46,
    sScale: 6,
    crease0: "#d0dcf8",
    crease1: "#6878a0",
    facetDark: "rgba(10,14,40,0.3)",
    badge: "#f4f6fc",
    badgeText: "#2c3050",
    ringA: "#d8e4ff",
    ringB: "#7080b8",
    edge: "rgba(255,255,255,0.68)",
  },
};

function starPoints(cx: number, cy: number, R: number, r: number) {
  const outer: [number, number][] = [];
  const inner: [number, number][] = [];
  for (let i = 0; i < 5; i++) {
    const aOut = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const aIn = aOut + Math.PI / 5;
    outer.push([cx + R * Math.cos(aOut), cy + R * Math.sin(aOut)]);
    inner.push([cx + r * Math.cos(aIn), cy + r * Math.sin(aIn)]);
  }
  return { outer, inner };
}

function roundedStarPath(
  cx: number,
  cy: number,
  R: number,
  r: number,
  tipRound = 0.68,
  concaveRound = 0.26,
): string {
  const raw: [number, number][] = [];
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    raw.push([cx + (i % 2 === 0 ? R : r) * Math.cos(a), cy + (i % 2 === 0 ? R : r) * Math.sin(a)]);
  }
  let d = "";
  for (let i = 0; i < 10; i++) {
    const cur = raw[i]!;
    const prv = raw[(i + 9) % 10]!;
    const nxt = raw[(i + 1) % 10]!;
    const rnd = i % 2 === 0 ? tipRound : concaveRound;
    const sx = prv[0] + (cur[0] - prv[0]) * (1 - rnd);
    const sy = prv[1] + (cur[1] - prv[1]) * (1 - rnd);
    const ex = cur[0] + (nxt[0] - cur[0]) * rnd;
    const ey = cur[1] + (nxt[1] - cur[1]) * rnd;
    d += i === 0 ? `M${sx.toFixed(2)},${sy.toFixed(2)} ` : `L${sx.toFixed(2)},${sy.toFixed(2)} `;
    d += `Q${cur[0].toFixed(2)},${cur[1].toFixed(2)} ${ex.toFixed(2)},${ey.toFixed(2)} `;
  }
  return `${d}Z`;
}

function computeArms(cx: number, cy: number, R: number, r: number) {
  const { outer, inner } = starPoints(cx, cy, R, r);
  return outer.map((tip, i) => {
    const ai = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const leftLit = Math.max(0, Math.cos(ai + Math.PI / 4));
    const rightLit = Math.max(0, -Math.cos(ai + Math.PI / 4));
    return {
      tip,
      leftInner: inner[(i + 4) % 5]!,
      rightInner: inner[i]!,
      leftLit,
      rightLit,
      creaseMid: [(cx + tip[0]) / 2, (cy + tip[1]) / 2] as [number, number],
    };
  });
}

export interface EarnedStarLuckyStarProps {
  size?: number;
  variant?: LuckyStarVariant;
  showBadge?: boolean;
  logoUrl?: string | null;
  className?: string;
}

/** Figma Make lucky star — metallic navy/gold SVG (canonical brand mark). */
export function EarnedStarLuckyStar({
  size = 32,
  variant = "navy",
  showBadge = true,
  logoUrl,
  className,
}: EarnedStarLuckyStarProps) {
  const uid = useId().replace(/:/g, "");
  const v = VARS[variant];
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.442;
  const r = size * 0.194;
  const br = size * 0.15;
  const sp = roundedStarPath(cx, cy, R, r, 0.68, 0.26);
  const arms = computeArms(cx, cy, R, r);
  const domeBlur = R * 0.36;
  const plX = cx - R * 0.44;
  const plY = cy - R * 0.58;
  const plZ = R * 2.8;
  const f = (s: string) => `${s}-${uid}`;
  const poly = (pts: [number, number][]) => pts.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ");

  return (
    <span className={cn("relative inline-block shrink-0", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} overflow="visible" aria-hidden>
        <defs>
          <filter id={f("ds")} x="-55%" y="-45%" width="210%" height="210%">
            <feGaussianBlur in="SourceAlpha" stdDeviation={R * 0.07} result="b1" />
            <feOffset in="b1" dx={R * 0.015} dy={R * 0.19} result="off1" />
            <feFlood floodColor="#00010f" floodOpacity="0.7" result="c1" />
            <feComposite in="c1" in2="off1" operator="in" result="sh1" />
            <feGaussianBlur in="SourceAlpha" stdDeviation={R * 0.2} result="b2" />
            <feOffset in="b2" dx="0" dy={R * 0.3} result="off2" />
            <feFlood floodColor="#00010f" floodOpacity="0.25" result="c2" />
            <feComposite in="c2" in2="off2" operator="in" result="sh2" />
            <feMerge>
              <feMergeNode in="sh2" />
              <feMergeNode in="sh1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id={f("bg")} cx="30%" cy="18%" r="84%" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor={v.g0} />
            <stop offset="40%" stopColor={v.g1} />
            <stop offset="100%" stopColor={v.g2} />
          </radialGradient>
          <filter id={f("df")} x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur in="SourceAlpha" stdDeviation={domeBlur * 1.1} result="dome" />
            <feDiffuseLighting in="dome" lightingColor={v.diffColor} diffuseConstant="2.0" surfaceScale={v.sScale} result="d">
              <feDistantLight azimuth="318" elevation="52" />
            </feDiffuseLighting>
            <feComposite in="d" in2="SourceAlpha" operator="in" />
          </filter>
          <filter id={f("sp")} x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur in="SourceAlpha" stdDeviation={domeBlur} result="dome" />
            <feSpecularLighting
              in="dome"
              lightingColor="white"
              specularConstant={v.specK}
              specularExponent={v.specExp}
              surfaceScale={v.sScale}
              result="s1"
            >
              <fePointLight x={plX} y={plY} z={plZ} />
            </feSpecularLighting>
            <feComposite in="s1" in2="SourceAlpha" operator="in" result="s1c" />
            <feSpecularLighting
              in="dome"
              lightingColor={v.diffColor}
              specularConstant="0.35"
              specularExponent="4"
              surfaceScale={v.sScale}
              result="s2"
            >
              <fePointLight x={cx + R * 0.6} y={cy + R * 0.4} z={R * 1.6} />
            </feSpecularLighting>
            <feComposite in="s2" in2="SourceAlpha" operator="in" result="s2c" />
            <feBlend in="s1c" in2="s2c" mode="screen" />
          </filter>
          <filter id={f("tx")} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="5" seed="23" result="n" />
            <feColorMatrix type="saturate" values="0" in="n" result="gray" />
            <feComposite in="gray" in2="SourceAlpha" operator="in" />
          </filter>
          <filter id={f("cg")} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={size * 0.011} result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {arms.map((arm, i) => (
            <g key={`grad-${i}`}>
              <linearGradient
                id={`sc-${uid}-${i}`}
                x1={cx}
                y1={cy}
                x2={arm.tip[0]}
                y2={arm.tip[1]}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor={v.crease0} stopOpacity="0.18" />
                <stop offset="28%" stopColor={v.crease0} stopOpacity="0.96" />
                <stop offset="75%" stopColor={v.crease0} stopOpacity="0.85" />
                <stop offset="100%" stopColor={v.crease1} stopOpacity="0.55" />
              </linearGradient>
              <linearGradient
                id={`lf-${uid}-${i}`}
                x1={arm.creaseMid[0]}
                y1={arm.creaseMid[1]}
                x2={arm.leftInner[0]}
                y2={arm.leftInner[1]}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor={v.facetDark} stopOpacity="0" />
                <stop offset="100%" stopColor={v.facetDark} stopOpacity={String((1 - arm.leftLit) * 0.82)} />
              </linearGradient>
              <linearGradient
                id={`rf-${uid}-${i}`}
                x1={arm.creaseMid[0]}
                y1={arm.creaseMid[1]}
                x2={arm.rightInner[0]}
                y2={arm.rightInner[1]}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor={v.facetDark} stopOpacity="0" />
                <stop offset="100%" stopColor={v.facetDark} stopOpacity={String((1 - arm.rightLit) * 0.82)} />
              </linearGradient>
            </g>
          ))}
          <linearGradient id={f("rg")} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={v.ringA} />
            <stop offset="45%" stopColor={v.crease0} />
            <stop offset="100%" stopColor={v.ringB} />
          </linearGradient>
          <clipPath id={f("cl")}>
            <path d={sp} />
          </clipPath>
          <radialGradient id={f("bdg")} cx="38%" cy="28%" r="72%">
            <stop offset="0%" stopColor={v.badge} />
            <stop offset="100%" stopColor={v.badge} stopOpacity="0.92" />
          </radialGradient>
        </defs>

        <path d={sp} fill={`url(#${f("bg")})`} filter={`url(#${f("ds")})`} />
        <path d={sp} fill="black" filter={`url(#${f("df")})`} style={{ mixBlendMode: "screen" }} opacity="0.46" />
        <g clipPath={`url(#${f("cl")})`}>
          {arms.map((arm, i) => (
            <g key={i}>
              <polygon points={poly([[cx, cy], arm.leftInner, arm.tip])} fill={`url(#lf-${uid}-${i})`} />
              <polygon points={poly([[cx, cy], arm.tip, arm.rightInner])} fill={`url(#rf-${uid}-${i})`} />
            </g>
          ))}
        </g>
        <path d={sp} fill="black" filter={`url(#${f("tx")})`} style={{ mixBlendMode: "soft-light" }} opacity="0.08" />
        <g clipPath={`url(#${f("cl")})`} filter={`url(#${f("cg")})`}>
          {arms.map((arm, i) => (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={arm.tip[0]}
              y2={arm.tip[1]}
              stroke={`url(#sc-${uid}-${i})`}
              strokeWidth={size * 0.013}
              strokeLinecap="round"
            />
          ))}
        </g>
        <path d={sp} fill="black" filter={`url(#${f("sp")})`} style={{ mixBlendMode: "screen" }} />
        <path d={sp} fill="none" stroke={v.edge} strokeWidth={size * 0.028} clipPath={`url(#${f("cl")})`} />

        {showBadge && !logoUrl ? (
          <>
            <circle cx={cx} cy={cy + size * 0.009} r={br + size * 0.022} fill="rgba(0,0,0,0.5)" />
            <circle cx={cx} cy={cy} r={br} fill={`url(#${f("bdg")})`} />
            <ellipse
              cx={cx - br * 0.18}
              cy={cy - br * 0.25}
              rx={br * 0.38}
              ry={br * 0.2}
              fill="rgba(255,255,255,0.28)"
              style={{ mixBlendMode: "screen" }}
            />
            <circle cx={cx} cy={cy} r={br + size * 0.004} fill="none" stroke={`url(#${f("rg")})`} strokeWidth={size * 0.03} />
          </>
        ) : null}
      </svg>

      {showBadge && logoUrl ? (
        <Image
          src={logoUrl}
          alt=""
          width={Math.round(br * 2)}
          height={Math.round(br * 2)}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full object-cover ring-2 ring-gold/80"
          style={{ width: br * 1.85, height: br * 1.85 }}
        />
      ) : null}
    </span>
  );
}

/** Outline star for dark nav/footer — Figma brand sheet §3. */
export function EarnedStarOutlineStar({
  size = 32,
  showBadge = true,
  className,
}: {
  size?: number;
  showBadge?: boolean;
  className?: string;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.442;
  const r = size * 0.194;
  const br = size * 0.15;
  const sp = roundedStarPath(cx, cy, R, r, 0.68, 0.26);
  const arms = computeArms(cx, cy, R, r);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      overflow="visible"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <path
        d={sp}
        fill="rgba(255,255,255,0.05)"
        stroke="rgba(255,255,255,0.78)"
        strokeWidth={size * 0.022}
        strokeLinejoin="round"
      />
      {arms.map((arm, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={arm.tip[0]}
          y2={arm.tip[1]}
          stroke="rgba(255,255,255,0.28)"
          strokeWidth={size * 0.013}
          strokeLinecap="round"
        />
      ))}
      {showBadge ? (
        <circle cx={cx} cy={cy} r={br} fill="none" stroke="rgba(255,255,255,0.44)" strokeWidth={size * 0.022} />
      ) : null}
    </svg>
  );
}

export function EarnedStarWordmark({
  size = 32,
  onDark = false,
  className,
}: {
  size?: number;
  onDark?: boolean;
  className?: string;
}) {
  const fontSize = Math.max(13, Math.round(size * 0.36));
  return (
    <span
      className={cn("font-sans font-bold leading-none tracking-tight", className)}
      style={{ fontSize }}
    >
      <span className={onDark ? "text-white" : "text-navy"}>Earned</span>
      <span className="text-gold">Star</span>
    </span>
  );
}
