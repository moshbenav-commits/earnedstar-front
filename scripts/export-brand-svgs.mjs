#!/usr/bin/env node
/** Export canonical EarnedStar logo/badge SVGs — see docs/branding/earnedstar-logo-spec.md */
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../public/brand/svg");
mkdirSync(OUT, { recursive: true });

const STAR_PATH = "M50.00,6.00L77.23,35.38L68.04,81.96L31.96,81.96L22.77,35.38Z";
const FACETS = `
  <path d="M50,6 L61,35 L50,65 Z" fill="rgba(255,255,255,0.10)"/>
  <path d="M50,6 L39,35 L50,65 Z" fill="rgba(0,0,0,0.10)"/>
  <path d="M91,35 L68,54 L61,35 Z" fill="rgba(255,255,255,0.12)"/>
  <path d="M9,35 L32,54 L39,35 Z" fill="rgba(0,0,0,0.08)"/>
  <path d="M77,82 L50,65 L68,54 Z" fill="rgba(255,255,255,0.07)"/>
  <path d="M23,82 L50,65 L32,54 Z" fill="rgba(0,0,0,0.07)"/>
  <path d="M50,6 L61,35 L44,26 Z" fill="rgba(255,255,255,0.22)"/>
  <line x1="50" y1="6" x2="61" y2="35" stroke="rgba(255,255,255,0.18)" stroke-width="0.7"/>
  <line x1="50" y1="6" x2="39" y2="35" stroke="rgba(0,0,0,0.18)" stroke-width="0.7"/>
  <line x1="61" y1="35" x2="50" y2="65" stroke="rgba(0,0,0,0.12)" stroke-width="0.7"/>
  <line x1="91" y1="35" x2="68" y2="54" stroke="rgba(255,255,255,0.14)" stroke-width="0.7"/>
  <line x1="9" y1="35" x2="32" y2="54" stroke="rgba(0,0,0,0.10)" stroke-width="0.7"/>
`;

const COLORS = {
  "navy-gold": { light: "#1A3566", mid: "#0F2044", dark: "#070F1E", ring: "#F59E0B" },
  "all-gold": { light: "#FDE68A", mid: "#F59E0B", dark: "#92400E", ring: "#F59E0B" },
  "all-white": { light: "#FFFFFF", mid: "#F8FAFC", dark: "#E2E8F0", ring: "#F59E0B" },
};

function centerBadge(mode, ring) {
  if (mode === "none") return "";
  const circle = `<circle cx="50" cy="50" r="17" fill="white" opacity="0.97"/>
    <circle cx="50" cy="50" r="17" fill="none" stroke="${ring}" stroke-width="1.8" opacity="0.85"/>`;
  if (mode === "check")
    return `${circle}<path d="M41 50 L47 56 L59 44" fill="none" stroke="${ring}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (mode === "logo")
    return `${circle}<text x="50" y="52" text-anchor="middle" font-family="Plus Jakarta Sans,Arial,sans-serif" font-size="7" font-weight="700" fill="#0F2044">YOUR LOGO</text>`;
  if (mode === "rating")
    return `${circle}<text x="50" y="47" text-anchor="middle" font-size="11" fill="${ring}">★★★</text><text x="50" y="57" text-anchor="middle" font-size="5.5" font-weight="700" fill="${ring}">4.9</text>`;
  return circle;
}

function markSvg(id, colorKey, center = "check") {
  const c = COLORS[colorKey];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="EarnedStar mark">
  <defs><radialGradient id="grad-${id}" cx="38%" cy="32%" r="68%">
    <stop offset="0%" stop-color="${c.light}"/><stop offset="55%" stop-color="${c.mid}"/><stop offset="100%" stop-color="${c.dark}"/>
  </radialGradient></defs>
  <path d="${STAR_PATH}" fill="url(#grad-${id})"/>${FACETS}
  <path d="${STAR_PATH}" fill="none" stroke="rgba(255,255,255,0.20)" stroke-width="0.8"/>
  ${centerBadge(center, c.ring)}
</svg>`;
}

function logoHorizontal(theme = "light") {
  const markColor = theme === "reversed" ? "all-white" : "navy-gold";
  const earned = theme === "light" ? "#0F2044" : "#FFFFFF";
  const star = theme === "mono" ? "#FFFFFF" : "#F59E0B";
  const c = COLORS[markColor];
  const id = `logo-h-${theme}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 64" role="img" aria-label="EarnedStar logo">
  <defs><radialGradient id="grad-${id}" cx="38%" cy="32%" r="68%">
    <stop offset="0%" stop-color="${c.light}"/><stop offset="55%" stop-color="${c.mid}"/><stop offset="100%" stop-color="${c.dark}"/>
  </radialGradient></defs>
  <g transform="translate(0,0) scale(0.64)">
    <path d="${STAR_PATH}" fill="url(#grad-${id})"/>${FACETS}
    <path d="${STAR_PATH}" fill="none" stroke="rgba(255,255,255,0.20)" stroke-width="0.8"/>
    ${centerBadge("check", c.ring)}
  </g>
  <text x="72" y="42" font-family="Plus Jakarta Sans,Arial,sans-serif" font-size="28" font-weight="800" fill="${earned}">Earned</text>
  <text x="168" y="42" font-family="Plus Jakarta Sans,Arial,sans-serif" font-size="28" font-weight="800" fill="${star}">Star</text>
</svg>`;
}

function logoStacked(theme = "light") {
  const markColor = theme === "light" ? "navy-gold" : "all-white";
  const earned = theme === "light" ? "#0F2044" : "#FFFFFF";
  const c = COLORS[markColor];
  const id = `logo-s-${theme}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 140" role="img" aria-label="EarnedStar logo stacked">
  <defs><radialGradient id="grad-${id}" cx="38%" cy="32%" r="68%">
    <stop offset="0%" stop-color="${c.light}"/><stop offset="55%" stop-color="${c.mid}"/><stop offset="100%" stop-color="${c.dark}"/>
  </radialGradient></defs>
  <g transform="translate(30,0) scale(1)">
    <path d="${STAR_PATH}" fill="url(#grad-${id})"/>${FACETS}
    <path d="${STAR_PATH}" fill="none" stroke="rgba(255,255,255,0.20)" stroke-width="0.8"/>
    ${centerBadge("check", c.ring)}
  </g>
  <text x="80" y="118" text-anchor="middle" font-family="Plus Jakarta Sans,Arial,sans-serif" font-size="22" font-weight="800" fill="${earned}">Earned</text>
  <text x="128" y="118" text-anchor="middle" font-family="Plus Jakarta Sans,Arial,sans-serif" font-size="22" font-weight="800" fill="#F59E0B">Star</text>
</svg>`;
}

const exports = [
  ["mark-origami-navy-gold-check.svg", markSvg("ngc", "navy-gold", "check")],
  ["mark-origami-navy-gold-logo-zone.svg", markSvg("ngl", "navy-gold", "logo")],
  ["mark-origami-navy-gold-rating.svg", markSvg("ngr", "navy-gold", "rating")],
  ["mark-origami-navy-gold-empty.svg", markSvg("nge", "navy-gold", "none")],
  ["mark-origami-all-gold-check.svg", markSvg("agc", "all-gold", "check")],
  ["mark-origami-all-white-check.svg", markSvg("awc", "all-white", "check")],
  ["logo-horizontal-light.svg", logoHorizontal("light")],
  ["logo-horizontal-reversed.svg", logoHorizontal("reversed")],
  ["logo-horizontal-mono-white.svg", logoHorizontal("mono")],
  ["logo-stacked-light.svg", logoStacked("light")],
  ["logo-stacked-reversed.svg", logoStacked("reversed")],
  ["logo-wordmark-only.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40" role="img" aria-label="EarnedStar wordmark"><text x="0" y="32" font-family="Plus Jakarta Sans,Arial,sans-serif" font-size="32" font-weight="800" fill="#0F2044">Earned</text><text x="118" y="32" font-family="Plus Jakarta Sans,Arial,sans-serif" font-size="32" font-weight="800" fill="#F59E0B">Star</text></svg>`],
];

for (const [name, svg] of exports) {
  writeFileSync(join(OUT, name), svg.trim() + "\n");
  console.log("wrote", name);
}

console.log(`\n${exports.length} SVGs → ${OUT}`);
