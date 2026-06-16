#!/usr/bin/env node
/** Export canonical EarnedStar logo/badge SVGs — photoreal-refined layering — see docs/branding/earnedstar-logo-spec.md */
import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../public/brand/svg");
const PREVIEW = join(__dirname, "../public/brand/svg-preview");
mkdirSync(OUT, { recursive: true });
mkdirSync(PREVIEW, { recursive: true });

const STAR_PATH = "M50.00,6.00L77.23,35.38L68.04,81.96L31.96,81.96L22.77,35.38Z";

const FACETS = `
  <path d="M50,6 L61,35 L50,65 Z" fill="rgba(255,255,255,0.14)"/>
  <path d="M50,6 L39,35 L50,65 Z" fill="rgba(0,0,0,0.11)"/>
  <path d="M91,35 L68,54 L61,35 Z" fill="rgba(255,255,255,0.15)"/>
  <path d="M9,35 L32,54 L39,35 Z" fill="rgba(0,0,0,0.09)"/>
  <path d="M77,82 L50,65 L68,54 Z" fill="rgba(255,255,255,0.08)"/>
  <path d="M23,82 L50,65 L32,54 Z" fill="rgba(0,0,0,0.07)"/>
  <path d="M50,6 L61,35 L44,26 Z" fill="rgba(255,255,255,0.22)"/>
`;

const SEAMS = `
  <line x1="50" y1="6" x2="61" y2="35" stroke="rgba(26,53,102,0.25)" stroke-width="0.35" stroke-dasharray="0.6 1.2"/>
  <line x1="50" y1="6" x2="39" y2="35" stroke="rgba(26,53,102,0.25)" stroke-width="0.35" stroke-dasharray="0.6 1.2"/>
  <line x1="61" y1="35" x2="50" y2="65" stroke="rgba(26,53,102,0.20)" stroke-width="0.35" stroke-dasharray="0.6 1.2"/>
  <line x1="91" y1="35" x2="68" y2="54" stroke="rgba(26,53,102,0.20)" stroke-width="0.35" stroke-dasharray="0.6 1.2"/>
  <line x1="9" y1="35" x2="32" y2="54" stroke="rgba(26,53,102,0.20)" stroke-width="0.35" stroke-dasharray="0.6 1.2"/>
`;

const COLORS = {
  "navy-gold": { hi: "#1A3566", mid: "#1F3B72", shadow: "#070F1E", dark: "#050A16", ring: "#F59E0B" },
  "all-gold": { hi: "#FBBF24", mid: "#F59E0B", shadow: "#78350F", dark: "#92400E", ring: "#F59E0B" },
  "all-white": { hi: "#FFFFFF", mid: "#F8FAFC", shadow: "#CBD5E1", dark: "#E2E8F0", ring: "#F59E0B" },
};

function refinedDefs(id, colorKey) {
  const c = COLORS[colorKey];
  return `
  <defs>
    <radialGradient id="grad-core-${id}" cx="38%" cy="32%" r="68%">
      <stop offset="0%" stop-color="${c.hi}"/>
      <stop offset="45%" stop-color="${c.mid}"/>
      <stop offset="100%" stop-color="${c.shadow}"/>
    </radialGradient>
    <radialGradient id="grad-shad-${id}" cx="62%" cy="58%" r="75%">
      <stop offset="0%" stop-color="${c.dark}" stop-opacity="0"/>
      <stop offset="70%" stop-color="${c.dark}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${c.shadow}" stop-opacity="0.32"/>
    </radialGradient>
    <radialGradient id="grad-flare-${id}" cx="28%" cy="22%" r="45%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.16"/>
      <stop offset="40%" stop-color="#FFFFFF" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="grad-inset-${id}" cx="50%" cy="52.5%" r="50%">
      <stop offset="0%" stop-color="#050A16" stop-opacity="0"/>
      <stop offset="100%" stop-color="#050A16" stop-opacity="0.14"/>
    </radialGradient>
    <radialGradient id="grad-disk-${id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="55%" stop-color="#F5F5FA"/>
      <stop offset="100%" stop-color="#E5E7F0"/>
    </radialGradient>
    <radialGradient id="grad-ringhi-${id}" cx="49.8%" cy="49.2%" r="45%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="grad-goldring-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
  </defs>`;
}

function refinedBody(id, colorKey) {
  return `
  ${refinedDefs(id, colorKey)}
  <path d="${STAR_PATH}" fill="url(#grad-core-${id})"/>
  <path d="${STAR_PATH}" fill="url(#grad-shad-${id})"/>
  <path d="${STAR_PATH}" fill="url(#grad-flare-${id})"/>
  ${FACETS}
  ${SEAMS}
  <path d="${STAR_PATH}" fill="none" stroke="#B45309" stroke-width="0.14" stroke-opacity="0.34"/>
  <path d="${STAR_PATH}" fill="none" stroke="#FDE68A" stroke-width="0.09" stroke-opacity="0.58"/>`;
}

function centerBadge(mode, ring, id) {
  if (mode === "none") return "";
  const inset = `<ellipse cx="50" cy="52.5" rx="14.5" ry="14.5" fill="url(#grad-inset-${id})"/>`;
  const disk = `<circle cx="50" cy="50" r="17" fill="url(#grad-disk-${id})" opacity="0.97"/>`;
  const ringStroke = `<circle cx="50" cy="50" r="17" fill="none" stroke="url(#grad-goldring-${id})" stroke-width="1.8" opacity="0.85"/>`;
  const ringHi = `<circle cx="49.8" cy="49.2" r="15.6" fill="url(#grad-ringhi-${id})"/>`;
  const medallion = `${inset}${disk}${ringStroke}${ringHi}`;

  if (mode === "check")
    return `${medallion}<path d="M41 50 L47 56 L59 44" fill="none" stroke="${ring}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (mode === "logo")
    return `${medallion}<text x="50" y="52" text-anchor="middle" font-family="Plus Jakarta Sans,Arial,sans-serif" font-size="7" font-weight="700" fill="#0F2044">YOUR LOGO</text>`;
  if (mode === "rating")
    return `${medallion}<text x="50" y="47" text-anchor="middle" font-size="11" fill="${ring}">★★★</text><text x="50" y="57" text-anchor="middle" font-size="5.5" font-weight="700" fill="${ring}">4.9</text>`;
  return medallion;
}

function markSvg(id, colorKey, center = "check") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="EarnedStar mark">
  ${refinedBody(id, colorKey)}
  ${centerBadge(center, COLORS[colorKey].ring, id)}
</svg>`;
}

function logoHorizontal(theme = "light") {
  const markColor = theme === "reversed" ? "all-white" : "navy-gold";
  const earned = theme === "light" ? "#0F2044" : "#FFFFFF";
  const star = theme === "mono" ? "#FFFFFF" : "#F59E0B";
  const id = `logo-h-${theme}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 64" role="img" aria-label="EarnedStar logo">
  <defs>
    <radialGradient id="grad-core-${id}" cx="38%" cy="32%" r="68%">
      <stop offset="0%" stop-color="${COLORS[markColor].hi}"/>
      <stop offset="45%" stop-color="${COLORS[markColor].mid}"/>
      <stop offset="100%" stop-color="${COLORS[markColor].shadow}"/>
    </radialGradient>
  </defs>
  <g transform="translate(0,0) scale(0.64)">
    ${refinedBody(id, markColor)}
    ${centerBadge("check", COLORS[markColor].ring, id)}
  </g>
  <text x="72" y="42" font-family="Plus Jakarta Sans,Arial,sans-serif" font-size="28" font-weight="800" fill="${earned}">Earned</text>
  <text x="168" y="42" font-family="Plus Jakarta Sans,Arial,sans-serif" font-size="28" font-weight="800" fill="${star}">Star</text>
</svg>`;
}

function logoStacked(theme = "light") {
  const markColor = theme === "light" ? "navy-gold" : "all-white";
  const earned = theme === "light" ? "#0F2044" : "#FFFFFF";
  const id = `logo-s-${theme}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 140" role="img" aria-label="EarnedStar logo stacked">
  <g transform="translate(30,0) scale(1)">
    ${refinedBody(id, markColor)}
    ${centerBadge("check", COLORS[markColor].ring, id)}
  </g>
  <text x="80" y="118" text-anchor="middle" font-family="Plus Jakarta Sans,Arial,sans-serif" font-size="22" font-weight="800" fill="${earned}">Earned</text>
  <text x="128" y="118" text-anchor="middle" font-family="Plus Jakarta Sans,Arial,sans-serif" font-size="22" font-weight="800" fill="#F59E0B">Star</text>
</svg>`;
}

const exports = [
  ["earnedstar-origami-logo.svg", markSvg("origami-navy", "navy-gold", "logo")],
  ["earnedstar-origami-logo-gold.svg", markSvg("origami-gold", "all-gold", "logo")],
  ["earnedstar-origami-logo-white.svg", markSvg("origami-white", "all-white", "logo")],
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

const previewSizes = [64, 128, 256, 512];
const previewVariants = [
  ["navy", "earnedstar-origami-logo.svg"],
  ["gold", "earnedstar-origami-logo-gold.svg"],
  ["white", "earnedstar-origami-logo-white.svg"],
];

for (const [variant, file] of previewVariants) {
  const svg = readFileSync(join(OUT, file), "utf8");
  for (const size of previewSizes) {
    const outName = `earnedstar-origami-${variant}-${size}.svg`;
    const scaled = svg.replace(
      'viewBox="0 0 100 100"',
      `viewBox="0 0 100 100" width="${size}" height="${size}"`,
    );
    writeFileSync(join(PREVIEW, outName), scaled);
    console.log("wrote preview", outName);
  }
}

console.log(`\n${exports.length} SVGs → ${OUT}`);
console.log(`Preview SVGs → ${PREVIEW}`);
