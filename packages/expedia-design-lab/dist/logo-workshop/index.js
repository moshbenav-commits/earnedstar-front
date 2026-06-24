import {
  DesignLabCard,
  DesignLabGrid,
  DesignLabSection
} from "../chunk-3RW4MGF2.js";

// src/logo-workshop/logoWorkshop.ts
var LOGO_WORKSHOP_STORAGE_KEY = "expedia-design-lab-logo-workshop-v1";
var EARNEDSTAR_LOGO_WORKSHOP_STORAGE_KEY = "earnedstar-design-lab-logo-workshop-v1";
var BUILTIN_REFERENCE_SEEDS = [
  {
    id: "ref-target-badge-3d",
    label: "Target badge \xB7 machined depth",
    previewUrl: "/brand-logos/reference/ref-target-badge-3d.png",
    notes: "Dimensional rim + compartment depth \u2014 ET/EE chrome tier inspiration."
  },
  {
    id: "ref-stickers",
    label: "Sticker cutline family",
    previewUrl: "/brand-logos/reference/ref-stickers--9ec784b4-cf21-48c6-95e5-9f4703e4a57f.png",
    notes: "Decal edge + sticker silhouette references."
  },
  {
    id: "ref-engines",
    label: "Engines nameplate direction",
    previewUrl: "/brand-logos/reference/ref-engines--52ce236e-63a4-4fbb-9062-5430ec44dc9a.png",
    notes: "Warmer gold chamber + horizontal nameplate."
  },
  {
    id: "ref-transmissions",
    label: "Transmissions fender badge",
    previewUrl: "/brand-logos/reference/ref-22c3e08f-6b0e-4ed6-af24-450c97423499.png",
    notes: "Apache-inspired fender silhouette + REMAN block."
  }
];
var EARNEDSTAR_REFERENCE_SEEDS = [
  {
    id: "es-ref-origami-system",
    label: "Origami brand system sheet",
    previewUrl: "/brand/earnedstar-origami-logo-system.png",
    notes: "Photoreal 3D origami star \u2014 navy leather + gold piping reference."
  },
  {
    id: "es-ref-navy-gold-mark",
    label: "Navy/gold hero mark",
    previewUrl: "/brand/png/mark-3d-navy-gold.png",
    notes: "Default variant \u2014 facet depth and center medallion."
  },
  {
    id: "es-ref-horizontal-lockup",
    label: "Horizontal lockup",
    previewUrl: "/brand/png/logo-3d-horizontal-primary.png",
    notes: "Mark + EarnedStar wordmark spacing."
  }
];
function createEmptyBrief() {
  return {
    version: 1,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    brand: "transmissions",
    tier: "chrome",
    goal: "",
    mood: "",
    mustInclude: "",
    mustAvoid: "generic SaaS gradient blobs \xB7 neon glow \xB7 cartoon chrome",
    notes: "",
    references: BUILTIN_REFERENCE_SEEDS.map((seed) => ({
      id: seed.id,
      source: "builtin",
      label: seed.label,
      sourceUrl: seed.previewUrl,
      previewUrl: seed.previewUrl,
      notes: seed.notes
    }))
  };
}
function createEarnedStarBrief() {
  return {
    version: 1,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    brand: "earnedstar",
    tier: "origami",
    goal: "Refine origami lucky-star SVG fallback for small-size embeds",
    mood: "puffy paper-fold \xB7 gold piping \xB7 navy leather \xB7 trust seal",
    mustInclude: "crease facets \xB7 center medallion \xB7 navy/gold default variant",
    mustAvoid: "flat circle stars \xB7 violet gradients \xB7 legacy circle mark",
    notes: "Spec: docs/branding/earnedstar-logo-spec.md",
    references: EARNEDSTAR_REFERENCE_SEEDS.map((seed) => ({
      id: seed.id,
      source: "builtin",
      label: seed.label,
      sourceUrl: seed.previewUrl,
      previewUrl: seed.previewUrl,
      notes: seed.notes
    }))
  };
}
function createReferenceId() {
  return `ref-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
function parseReferenceInput(raw, label = "Pinterest reference") {
  const input = raw.trim();
  if (!input) return null;
  const id = createReferenceId();
  if (/i\.pinimg\.com/i.test(input) || /\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(input)) {
    return {
      id,
      source: "image-url",
      label,
      sourceUrl: input,
      previewUrl: input
    };
  }
  if (/pinterest\.com\/pin\//i.test(input) || /pinterest\.com\/.*\/pin\//i.test(input)) {
    return {
      id,
      source: "pinterest-pin",
      label,
      sourceUrl: input,
      previewUrl: "",
      notes: "Paste \u201CCopy image address\u201D from the pin if preview does not load."
    };
  }
  if (input.startsWith("http://") || input.startsWith("https://")) {
    return {
      id,
      source: "image-url",
      label,
      sourceUrl: input,
      previewUrl: input
    };
  }
  return null;
}
function buildCursorLogoPrompt(brief) {
  const refs = brief.references.map((ref, index) => {
    const preview = ref.previewUrl || ref.sourceUrl;
    return `${index + 1}. ${ref.label} \u2014 ${preview}${ref.notes ? ` (${ref.notes})` : ""}`;
  }).join("\n");
  return [
    "Logo workshop brief \u2014 code-native refinement",
    "",
    `Brand: ${brief.brand}`,
    `Tier: ${brief.tier}`,
    `Goal: ${brief.goal || "(not set)"}`,
    `Mood: ${brief.mood || "(not set)"}`,
    `Must include: ${brief.mustInclude || "(not set)"}`,
    `Must avoid: ${brief.mustAvoid || "(not set)"}`,
    brief.notes ? `Notes: ${brief.notes}` : "",
    "",
    "Reference mood board:",
    refs || "(no references)",
    "",
    "Workflow:",
    "1. Study references for silhouette, depth, and material \u2014 do not copy trademarked art.",
    "2. Update SVG masters in brand/logos/svg/ and preview in /design-lab/logo-workshop.",
    "3. Keep vector-first layers; chrome = SVG + badge-metal CSS only.",
    "4. Spec: docs/branding/EXPEDIAPARTS_LOGO_DESIGN_SYSTEM.md"
  ].filter(Boolean).join("\n");
}
function briefSlug(brief) {
  const brand = brief.brand.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const stamp = brief.updatedAt.slice(0, 10);
  return `${brand}-${brief.tier}-${stamp}`;
}

// src/logo-workshop/logoWorkshopSvg.ts
var CHROME_LAYER_CANON = [
  { id: "L6/Shadow", level: 6, label: "Shadow", required: true, note: "Whole-badge drop shadow group" },
  { id: "L5/Outer-Rim", level: 5, label: "Outer rim", required: true, note: "Chrome shell \xB7 4-stop linear gradient" },
  { id: "L4/Rim-Highlight", level: 4, label: "Rim highlight", required: true, note: "Top-edge specular strip" },
  { id: "L4/Face-Gloss", level: 4, label: "Face gloss", required: false, note: "Optional enamel gloss overlay" },
  { id: "L3/Face", level: 3, label: "Face", required: true, note: "Main navy enamel field" },
  { id: "L2/Accent-Block", level: 2, label: "Accent block", required: true, note: "REMAN panel or gold chamber" },
  { id: "L1/Typography", level: 1, label: "Typography", required: true, note: "EXPEDIA + descriptor paths" },
  { id: "L0/Navy-Ribbing", level: 0, label: "Navy ribbing", required: false, note: "Inner detail lines on face" },
  { id: "L0/Reman-Ribbing", level: 0, label: "Reman ribbing", required: false, note: "Inner detail on accent block" }
];
var ORIGAMI_SOURCE_CANON = [
  {
    id: "ES/Variant-Tokens",
    label: "Variant tokens",
    required: true,
    note: "navy \xB7 gold \xB7 white VARS map",
    pattern: /LuckyStarVariant|navy:\s*\{|gold:\s*\{|white:\s*\{/
  },
  {
    id: "ES/Facet-Creases",
    label: "Facet creases",
    required: true,
    note: "Gold crease strokes on star facets",
    pattern: /crease0|crease1|facetDark/
  },
  {
    id: "ES/Center-Medallion",
    label: "Center medallion",
    required: true,
    note: "White fill + gold ring \xB7 check / logo / stars modes",
    pattern: /badge|ringA|ringB|centerStyle/
  },
  {
    id: "ES/Radial-Body",
    label: "Radial body gradient",
    required: true,
    note: "3-stop radial gradient on star body",
    pattern: /radialGradient|diffColor|specK/
  },
  {
    id: "ES/Wordmark-Split",
    label: "Wordmark split",
    required: false,
    note: "Earned navy + Star gold in lockup components",
    pattern: /EarnedStarLogo|#0F2044|#F59E0B/
  }
];
var SVG_TARGETS = {
  transmissions: {
    chrome: {
      workspacePath: "brand/logos/svg/expedia-transmissions-emblem-chrome.svg",
      publicPath: "/brand-logos/svg/expedia-transmissions-emblem-chrome.svg",
      specSection: "AI_EXPEDIA_TRANSMISSIONS_BRAND_SPEC.md \xB7 EXPEDIAPARTS_LOGO_DESIGN_SYSTEM \xA77"
    },
    flat: {
      workspacePath: "brand/logos/svg/expedia-transmissions-emblem-flat.svg",
      publicPath: "/brand-logos/svg/expedia-transmissions-emblem-flat.svg",
      specSection: "EXPEDIAPARTS_LOGO_DESIGN_SYSTEM \xA76 T1"
    },
    sticker: {
      workspacePath: "brand/logos/svg/expedia-transmissions-sticker.svg",
      publicPath: "/brand-logos/svg/expedia-transmissions-sticker.svg",
      specSection: "EXPEDIAPARTS_LOGO_DESIGN_SYSTEM \xA78"
    },
    wordmark: {
      workspacePath: "brand/logos/svg/expedia-transmissions-wordmark.svg",
      publicPath: "/brand-logos/svg/expedia-transmissions-wordmark.svg",
      specSection: "EXPEDIAPARTS_LOGO_DESIGN_SYSTEM \xA75"
    }
  },
  engines: {
    chrome: {
      workspacePath: "brand/logos/svg/expedia-engines-emblem-chrome.svg",
      publicPath: "/brand-logos/svg/expedia-engines-emblem-chrome.svg",
      specSection: "EXPEDIAPARTS_LOGO_DESIGN_SYSTEM \xA77 (EE parity in progress)"
    },
    flat: {
      workspacePath: "brand/logos/svg/expedia-engines-emblem-flat.svg",
      publicPath: "/brand-logos/svg/expedia-engines-emblem-flat.svg",
      specSection: "EXPEDIAPARTS_LOGO_DESIGN_SYSTEM \xA76 T1"
    },
    sticker: {
      workspacePath: "brand/logos/svg/expedia-engines-sticker.svg",
      publicPath: "/brand-logos/svg/expedia-engines-sticker.svg",
      specSection: "EXPEDIAPARTS_LOGO_DESIGN_SYSTEM \xA78"
    }
  },
  parts: {
    flat: {
      workspacePath: "brand/logos/svg/expedia-ep-monogram.svg",
      publicPath: "/brand-logos/svg/expedia-ep-monogram.svg",
      specSection: "EXPEDIAPARTS_LOGO_DESIGN_SYSTEM \xA74"
    }
  },
  earnedstar: {
    origami: {
      workspacePath: "earnedstar/src/components/brand/earnedstar-lucky-star.tsx",
      publicPath: "",
      specSection: "docs/branding/earnedstar-logo-spec.md \xB7 earnedstar-svg-refinement-handoff.md"
    },
    flat: {
      workspacePath: "earnedstar/src/components/brand/earnedstar-mark.tsx",
      publicPath: "",
      specSection: "docs/branding/earnedstar-logo-spec.md"
    }
  }
};
function resolveSvgTarget(brand, tier) {
  return SVG_TARGETS[brand]?.[tier] ?? null;
}
var LAYER_ID_RE = /id="(L\d+\/[^"]+)"/g;
var ROOT_GROUP_RE = /id="(Logo\/[^"]+)"/;
function parseSvgLayerIds(svgText) {
  const seen = /* @__PURE__ */ new Set();
  const layers = [];
  for (const match of svgText.matchAll(LAYER_ID_RE)) {
    const id = match[1];
    if (seen.has(id)) continue;
    seen.add(id);
    const level = Number.parseInt(id.split("/")[0].replace("L", ""), 10);
    layers.push({
      id,
      level: Number.isFinite(level) ? level : -1,
      label: id.split("/").slice(1).join("/") || id
    });
  }
  return layers.sort((a, b) => b.level - a.level);
}
function auditBrandSource(sourceText, brand, tier, target) {
  const canon = ORIGAMI_SOURCE_CANON;
  const presentCanon = canon.filter((spec) => spec.pattern.test(sourceText)).map(
    ({ id, label, required, note }) => ({ id, label, required, note })
  );
  const missingRequired = canon.filter((spec) => spec.required && !spec.pattern.test(sourceText)).map(({ id, label, required, note }) => ({ id, label, required, note }));
  const missingOptional = canon.filter((spec) => !spec.required && !spec.pattern.test(sourceText)).map(({ id, label, required, note }) => ({ id, label, required, note }));
  const layers = presentCanon.map((spec) => ({
    id: spec.id,
    level: 0,
    label: spec.label
  }));
  const requiredTotal = canon.filter((s) => s.required).length || 1;
  const parityScore = Math.round(
    presentCanon.filter((s) => s.required).length / requiredTotal * 100
  );
  return {
    target,
    rootGroup: brand === "earnedstar" ? "Logo/EarnedStar/Origami" : null,
    layers,
    gradientCount: (sourceText.match(/radialGradient|linearGradient/g) ?? []).length,
    filterCount: (sourceText.match(/<filter|feDropShadow|feGaussianBlur/g) ?? []).length,
    pathCount: (sourceText.match(/<path|getStarPath/g) ?? []).length,
    presentCanon,
    missingRequired,
    missingOptional,
    unexpectedLayers: [],
    parityScore,
    usesCanonNaming: presentCanon.length > 0
  };
}
function auditSvgLayers(svgText, tier, target) {
  const layers = parseSvgLayerIds(svgText);
  const rootMatch = svgText.match(ROOT_GROUP_RE);
  const gradientCount = (svgText.match(/<linearGradient/g) ?? []).length;
  const filterCount = (svgText.match(/<filter/g) ?? []).length;
  const pathCount = (svgText.match(/<path/g) ?? []).length;
  const layerIds = new Set(layers.map((l) => l.id));
  const canon = tier === "chrome" ? CHROME_LAYER_CANON : [];
  const presentCanon = canon.filter((spec) => layerIds.has(spec.id));
  const missingRequired = canon.filter((spec) => spec.required && !layerIds.has(spec.id));
  const missingOptional = canon.filter((spec) => !spec.required && !layerIds.has(spec.id));
  const unexpectedLayers = layers.filter(
    (layer) => !canon.some((spec) => spec.id === layer.id)
  );
  const requiredTotal = canon.filter((s) => s.required).length || 1;
  const parityScore = tier === "chrome" ? Math.round(presentCanon.filter((s) => s.required).length / requiredTotal * 100) : layers.length > 0 ? 100 : 0;
  return {
    target,
    rootGroup: rootMatch?.[1] ?? null,
    layers,
    gradientCount,
    filterCount,
    pathCount,
    presentCanon: [...presentCanon],
    missingRequired: [...missingRequired],
    missingOptional: [...missingOptional],
    unexpectedLayers: [...unexpectedLayers],
    parityScore,
    usesCanonNaming: layers.length > 0
  };
}
function auditWorkshopSource(sourceText, brand, tier, target) {
  if (brand === "earnedstar" && (tier === "origami" || tier === "flat")) {
    return auditBrandSource(sourceText, brand, tier, target);
  }
  return auditSvgLayers(sourceText, tier, target);
}
function buildAiIterationPrompt(brief, audit, options) {
  const target = audit.target ?? resolveSvgTarget(brief.brand, brief.tier);
  const refs = brief.references.map((ref, i) => {
    const url = ref.previewUrl || ref.sourceUrl;
    return `${i + 1}. ${ref.label} \u2014 ${url}${ref.savedPath ? ` (saved: ${ref.savedPath})` : ""}`;
  }).join("\n");
  const layerLines = audit.layers.length > 0 ? audit.layers.map((l) => `- ${l.id}`).join("\n") : "- (no L6\u2013L0 layer groups detected \u2014 rename groups to canon IDs)";
  const missingRequired = audit.missingRequired.length > 0 ? audit.missingRequired.map((s) => `- ${s.id} \u2014 ${s.note}`).join("\n") : "- none";
  const missingOptional = audit.missingOptional.length > 0 ? audit.missingOptional.map((s) => `- ${s.id} \u2014 ${s.note}`).join("\n") : "- none";
  const slug = briefSlug(brief);
  return [
    "# Logo workshop \u2014 AI SVG iteration",
    "",
    "Load specs: docs/branding/EXPEDIAPARTS_LOGO_DESIGN_SYSTEM.md \xB7 ai-code-native-design-workflow",
    "",
    "## Brief",
    `Brand: ${brief.brand}`,
    `Tier: ${brief.tier}`,
    `Goal: ${brief.goal || "(set in workshop)"}`,
    `Mood: ${brief.mood || "(set in workshop)"}`,
    `Must include: ${brief.mustInclude || "(not set)"}`,
    `Must avoid: ${brief.mustAvoid || "(not set)"}`,
    brief.notes ? `Notes: ${brief.notes}` : "",
    options?.savedBriefPath ? `Saved brief: ${options.savedBriefPath}` : "",
    options?.iterationPath ? `Iteration file: ${options.iterationPath}` : "",
    "",
    "## Edit target (SSOT)",
    target ? `- Primary: \`${target.workspacePath}\`` : "- No SVG target mapped \u2014 update workshop brand/tier",
    target?.publicPath ? `- Preview: ${target.publicPath} \xB7 /design-lab/logo-workshop` : "",
    target ? `- Spec: ${target.specSection}` : "",
    "",
    "## Current SVG audit",
    `Root group: ${audit.rootGroup ?? "(missing Logo/{Brand}/Premium)"}`,
    `Layer parity: ${audit.parityScore}% \xB7 gradients ${audit.gradientCount} \xB7 filters ${audit.filterCount} \xB7 paths ${audit.pathCount}`,
    "",
    "### Present layers",
    layerLines,
    "",
    "### Missing required (vs chrome canon)",
    missingRequired,
    "",
    "### Missing optional",
    missingOptional,
    "",
    "## Reference mood board (inspiration only \u2014 do not ship unlicensed art)",
    refs || "(no references)",
    "",
    "## Iteration tasks",
    "1. Refine vector geometry to match brief goal/mood \u2014 keep SVG-first, no raster logos.",
    "2. Preserve or introduce canon layer group IDs: L6/Shadow \u2192 L5/Outer-Rim \u2192 L4/* \u2192 L3/Face \u2192 L2/Accent-Block \u2192 L1/Typography \u2192 L0/*.",
    "3. Do not collapse chrome into a single fill+stroke; minimum 4 visible layers for premium tier.",
    "4. After edits: `npm run sync:brand-logos` (expedia-parts-front) and refresh /design-lab/logo-workshop.",
    "5. Re-run layer audit in workshop; target parity \u2265 85% on required layers.",
    "",
    "## Acceptance",
    "- Vector paths editable in Figma import",
    "- WCAG-minded contrast on REMAN block and typography",
    "- No ExpediaParts orange inside subsidiary badge lockups",
    `- Workshop slug: ${slug}`
  ].filter(Boolean).join("\n");
}
function buildFigmaHandoffPrompt(brief, audit) {
  const target = audit.target ?? resolveSvgTarget(brief.brand, brief.tier);
  const slug = briefSlug(brief);
  return [
    "# Figma handoff \u2014 logo workshop iteration",
    "",
    "Figma Design Library fileKey: `cdkfJQlWK6zDxW6TpGREr2` \xB7 page `01 \u2014 ASSETS`",
    "",
    `Workshop slug: ${slug}`,
    `Brand: ${brief.brand} \xB7 Tier: ${brief.tier}`,
    `Layer parity today: ${audit.parityScore}%`,
    "",
    "## Import / sync",
    target ? `1. Import latest \`${target.workspacePath}\` into Figma (SVG paste or MCP import).` : "1. Select correct SVG from brand/logos/svg/.",
    "2. Map groups to canon IDs: L6/Shadow, L5/Outer-Rim, L4/Rim-Highlight, L3/Face, L2/Accent-Block, L1/Typography, L0/*.",
    "3. Apply brief mood without changing production web CSS sheen classes.",
    "",
    "## Brief summary",
    `Goal: ${brief.goal || "(not set)"}`,
    `Mood: ${brief.mood || "(not set)"}`,
    `Must include: ${brief.mustInclude || "(not set)"}`,
    `Must avoid: ${brief.mustAvoid || "(not set)"}`,
    "",
    "## Export back to repo",
    "- Re-export SVG to brand/logos/svg/ (same filename)",
    "- Run `npm run sync:brand-logos` in expedia-parts-front",
    "- Re-audit at /design-lab/logo-workshop",
    "",
    "Spec: docs/branding/EXPEDIAPARTS_LOGO_DESIGN_SYSTEM.md \xA77"
  ].join("\n");
}
function iterationArtifactPaths(brief) {
  const slug = briefSlug(brief);
  return {
    slug,
    workshopMd: `brand/logos/workshop/iterations/${slug}.md`,
    cursorTxt: `docs/prompts/cursor/logo-workshop-${slug}.txt`,
    figmaTxt: `docs/prompts/cursor/logo-workshop-${slug}-figma.txt`
  };
}

// src/logo-workshop/logoWorkshopPinterest.ts
var PINIMG_RE = /https:\/\/i\.pinimg\.com\/[^\s"'<>\\]+/i;
var OG_IMAGE_RE = /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i;
var OG_IMAGE_RE_ALT = /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i;
function decodeHtmlUrl(raw) {
  return raw.replace(/&amp;/g, "&").replace(/\\u002F/g, "/").replace(/\\\//g, "/");
}
function pickBestPinimg(candidates) {
  const normalized = candidates.map(decodeHtmlUrl).filter((u) => PINIMG_RE.test(u));
  if (normalized.length === 0) return null;
  const sorted = [...normalized].sort((a, b) => b.length - a.length);
  return sorted[0] ?? null;
}
async function resolvePinterestImageUrl(pinUrl) {
  const input = pinUrl.trim();
  if (!input) {
    return { ok: false, previewUrl: null, source: null, error: "Empty URL." };
  }
  if (PINIMG_RE.test(input)) {
    return { ok: true, previewUrl: input, source: "pinimg-scrape" };
  }
  if (!/pinterest\./i.test(input)) {
    return { ok: false, previewUrl: null, source: null, error: "Not a Pinterest pin URL." };
  }
  try {
    const res = await fetch(input, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml"
      },
      redirect: "follow",
      signal: AbortSignal.timeout(12e3)
    });
    if (!res.ok) {
      return {
        ok: false,
        previewUrl: null,
        source: null,
        error: `Pinterest returned HTTP ${res.status}.`
      };
    }
    const html = await res.text();
    const og = html.match(OG_IMAGE_RE)?.[1] ?? html.match(OG_IMAGE_RE_ALT)?.[1] ?? null;
    if (og) {
      return { ok: true, previewUrl: decodeHtmlUrl(og), source: "og:image" };
    }
    const pinimgs = html.match(/https:\/\/i\.pinimg\.com\/[^"'\\s]+/gi) ?? [];
    const best = pickBestPinimg(pinimgs);
    if (best) {
      return { ok: true, previewUrl: best, source: "pinimg-scrape" };
    }
    return {
      ok: false,
      previewUrl: null,
      source: null,
      error: "Could not extract image \u2014 copy image address from the pin manually."
    };
  } catch {
    return {
      ok: false,
      previewUrl: null,
      source: null,
      error: "Pinterest fetch failed \u2014 paste i.pinimg.com URL directly."
    };
  }
}

// src/logo-workshop/LogoWorkshopPanel.tsx
import { useCallback as useCallback2, useEffect as useEffect2, useMemo, useState as useState2 } from "react";
import {
  BrandLogo,
  PremiumBrandLogo,
  StickerLogo
} from "@expedia/design-system";

// src/logo-workshop/LogoWorkshopAiPanel.tsx
import { useCallback, useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function LayerAuditTable({ audit }) {
  if (!audit.target) {
    return /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children: "No SVG master mapped for this brand/tier. Pick ET/EE chrome or flat to audit layers." });
  }
  return /* @__PURE__ */ jsxs("div", { className: "overflow-x-auto", children: [
    /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[520px] text-left text-xs text-gray-300", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-[var(--border-dark)] text-gray-500", children: [
        /* @__PURE__ */ jsx("th", { className: "py-2 pr-3 font-semibold", children: "Layer" }),
        /* @__PURE__ */ jsx("th", { className: "py-2 pr-3 font-semibold", children: "Status" }),
        /* @__PURE__ */ jsx("th", { className: "py-2 font-semibold", children: "Note" })
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { children: [
        audit.presentCanon.map((spec) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-white/5", children: [
          /* @__PURE__ */ jsx("td", { className: "py-2 pr-3 font-mono text-emerald-200", children: spec.id }),
          /* @__PURE__ */ jsx("td", { className: "py-2 pr-3 text-emerald-300", children: "present" }),
          /* @__PURE__ */ jsx("td", { className: "py-2 text-gray-500", children: spec.note })
        ] }, spec.id)),
        audit.missingRequired.map((spec) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-white/5", children: [
          /* @__PURE__ */ jsx("td", { className: "py-2 pr-3 font-mono text-amber-200", children: spec.id }),
          /* @__PURE__ */ jsx("td", { className: "py-2 pr-3 text-amber-300", children: "missing \xB7 required" }),
          /* @__PURE__ */ jsx("td", { className: "py-2 text-gray-500", children: spec.note })
        ] }, spec.id)),
        audit.missingOptional.map((spec) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-white/5", children: [
          /* @__PURE__ */ jsx("td", { className: "py-2 pr-3 font-mono text-gray-400", children: spec.id }),
          /* @__PURE__ */ jsx("td", { className: "py-2 pr-3 text-gray-500", children: "missing \xB7 optional" }),
          /* @__PURE__ */ jsx("td", { className: "py-2 text-gray-500", children: spec.note })
        ] }, spec.id)),
        audit.unexpectedLayers.map((layer) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-white/5", children: [
          /* @__PURE__ */ jsx("td", { className: "py-2 pr-3 font-mono text-sky-200", children: layer.id }),
          /* @__PURE__ */ jsx("td", { className: "py-2 pr-3 text-sky-300", children: "extra" }),
          /* @__PURE__ */ jsx("td", { className: "py-2 text-gray-500", children: "Not in canon list \u2014 OK if intentional detail" })
        ] }, layer.id))
      ] })
    ] }),
    !audit.usesCanonNaming ? /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-amber-100/90", children: "SVG uses non-canon group names \u2014 rename to L6/Shadow \u2026 L1/Typography for Figma parity and automated diff." }) : null
  ] });
}
function LogoWorkshopAiPanel({
  apiBase = "/api/design-lab/logo-workshop",
  brief,
  onBriefLoaded,
  onStatus,
  auditTitle = "SVG chrome layer diff",
  auditDescription = "Compares production SVG group IDs against EXPEDIAPARTS_LOGO_DESIGN_SYSTEM \xA77 canon."
}) {
  const [audit, setAudit] = useState(null);
  const [auditError, setAuditError] = useState(null);
  const [savedBriefs, setSavedBriefs] = useState([]);
  const [selectedBrief, setSelectedBrief] = useState("");
  const [iterationPrompt, setIterationPrompt] = useState("");
  const [cursorRef, setCursorRef] = useState("");
  const [figmaRef, setFigmaRef] = useState("");
  const [iterations, setIterations] = useState([]);
  const [loading, setLoading] = useState(false);
  const refreshAudit = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        action: "svg-audit",
        brand: brief.brand,
        tier: brief.tier
      });
      const res = await fetch(`${apiBase}?${params}`);
      const data = await res.json();
      if (data.audit) setAudit(data.audit);
      setAuditError(data.error ?? null);
    } catch {
      setAuditError("Could not load SVG audit.");
    } finally {
      setLoading(false);
    }
  }, [brief.brand, brief.tier, apiBase]);
  const refreshBriefs = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}?action=briefs`);
      const data = await res.json();
      setSavedBriefs(data.briefs ?? []);
    } catch {
      setSavedBriefs([]);
    }
  }, [apiBase]);
  const refreshIterations = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}?action=iterations`);
      const data = await res.json();
      setIterations(data.iterations ?? []);
    } catch {
      setIterations([]);
    }
  }, [apiBase]);
  useEffect(() => {
    void refreshAudit();
  }, [refreshAudit]);
  useEffect(() => {
    void refreshBriefs();
    void refreshIterations();
  }, [refreshBriefs, refreshIterations]);
  const loadBrief2 = useCallback(async () => {
    if (!selectedBrief) return;
    const res = await fetch(
      `${apiBase}?action=brief&file=${encodeURIComponent(selectedBrief)}`
    );
    const data = await res.json();
    if (!res.ok || !data.brief) {
      onStatus(data.error ?? "Failed to load brief.");
      return;
    }
    onBriefLoaded(data.brief);
    onStatus(`Loaded ${selectedBrief}`);
  }, [onBriefLoaded, onStatus, selectedBrief, apiBase]);
  const iterateWithAi = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiBase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "iterate", brief })
      });
      const data = await res.json();
      if (!res.ok || !data.ok || !data.prompt) {
        onStatus(data.error ?? "Iterate failed.");
        return;
      }
      if (data.audit) setAudit(data.audit);
      setIterationPrompt(data.prompt);
      const atRef = data.artifacts?.cursorAtReference ?? "";
      const figmaAt = data.artifacts?.figmaAtReference ?? "";
      setCursorRef(atRef);
      setFigmaRef(figmaAt);
      try {
        await navigator.clipboard.writeText(data.prompt);
      } catch {
      }
      onStatus(
        [
          "Iteration prompt copied to clipboard.",
          data.artifacts?.cursorTxt ? `Cursor: ${atRef}` : "",
          data.artifacts?.figmaTxt ? `Figma: ${figmaAt}` : "",
          data.artifacts?.workshopMd ? `Saved ${data.artifacts.workshopMd}` : ""
        ].filter(Boolean).join(" ")
      );
      void refreshBriefs();
      void refreshIterations();
    } catch {
      onStatus("Iterate failed \u2014 dev API unavailable.");
    } finally {
      setLoading(false);
    }
  }, [brief, onStatus, refreshBriefs, refreshIterations, apiBase]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      DesignLabSection,
      {
        title: "Saved briefs",
        description: "Load a prior workshop session from brand/logos/workshop/briefs/.",
        children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: selectedBrief,
              onChange: (e) => setSelectedBrief(e.target.value),
              className: "min-w-[240px] rounded-lg border border-[var(--border-dark)] bg-white/5 px-3 py-2 text-sm text-white",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Select saved brief\u2026" }),
                savedBriefs.map((item) => /* @__PURE__ */ jsxs("option", { value: item.filename, children: [
                  item.filename,
                  item.updatedAt ? ` \xB7 ${item.updatedAt.slice(0, 10)}` : ""
                ] }, item.filename))
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => void loadBrief2(),
              disabled: !selectedBrief,
              className: "rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 disabled:opacity-40",
              children: "Load brief"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => void refreshBriefs(),
              className: "text-sm text-gray-400 underline hover:text-white",
              children: "Refresh list"
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxs(
      DesignLabSection,
      {
        title: auditTitle,
        description: auditDescription,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-400", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Target:",
              " ",
              /* @__PURE__ */ jsx("code", { className: "text-gray-200", children: audit?.target?.workspacePath ?? "\u2014" })
            ] }),
            audit ? /* @__PURE__ */ jsxs("span", { children: [
              "Parity: ",
              /* @__PURE__ */ jsxs("strong", { className: "text-white", children: [
                audit.parityScore,
                "%"
              ] }),
              " required layers"
            ] }) : null,
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => void refreshAudit(),
                className: "text-gray-400 underline hover:text-white",
                children: "Re-audit SVG"
              }
            )
          ] }),
          auditError ? /* @__PURE__ */ jsx("p", { className: "mb-3 text-sm text-amber-200/90", children: auditError }) : null,
          audit ? /* @__PURE__ */ jsx(LayerAuditTable, { audit }) : null
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      DesignLabSection,
      {
        title: "Iteration history",
        description: "Saved AI + Figma handoff prompts from prior workshop sessions.",
        children: iterations.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "No iterations saved yet \u2014 click Iterate with AI below." }) : /* @__PURE__ */ jsx("ul", { className: "space-y-2 text-sm text-gray-300", children: iterations.slice(0, 8).map((item) => /* @__PURE__ */ jsxs(
          "li",
          {
            className: "rounded-lg border border-[var(--border-dark)] bg-white/5 px-3 py-2",
            children: [
              /* @__PURE__ */ jsx("p", { className: "font-mono text-xs text-gray-400", children: item.filename }),
              /* @__PURE__ */ jsxs("p", { className: "mt-1", children: [
                /* @__PURE__ */ jsxs("code", { className: "text-gray-200", children: [
                  "@",
                  item.cursorTxt
                ] }),
                " \xB7 ",
                /* @__PURE__ */ jsxs("code", { className: "text-gray-200", children: [
                  "@",
                  item.figmaTxt
                ] })
              ] })
            ]
          },
          item.filename
        )) })
      }
    ),
    /* @__PURE__ */ jsxs(
      DesignLabSection,
      {
        title: "Iterate with AI",
        description: "Saves Cursor + Figma prompts to docs/prompts/cursor/ and brand/logos/workshop/iterations/.",
        children: [
          /* @__PURE__ */ jsx(DesignLabCard, { label: "One-click handoff", surface: "navy", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => void iterateWithAi(),
                disabled: loading,
                className: "rounded-lg bg-[var(--color-orange)] px-6 py-3 text-sm font-bold text-[var(--color-dark-blue)] disabled:opacity-50",
                children: loading ? "Preparing\u2026" : "Iterate with AI \u2192 copy prompt + save files"
              }
            ),
            cursorRef ? /* @__PURE__ */ jsxs("p", { className: "max-w-lg text-center text-xs text-gray-400", children: [
              "Cursor: ",
              /* @__PURE__ */ jsx("code", { className: "text-gray-200", children: cursorRef }),
              figmaRef ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("br", {}),
                "Figma: ",
                /* @__PURE__ */ jsx("code", { className: "text-gray-200", children: figmaRef })
              ] }) : null
            ] }) : null
          ] }) }),
          iterationPrompt ? /* @__PURE__ */ jsx("pre", { className: "mt-4 max-h-72 overflow-auto rounded-lg border border-[var(--border-dark)] bg-black/40 p-4 text-xs text-gray-300", children: iterationPrompt }) : null
        ]
      }
    )
  ] });
}

// src/logo-workshop/LogoWorkshopPanel.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var BRAND_OPTIONS = [
  { id: "transmissions", label: "Expedia Transmissions" },
  { id: "engines", label: "Expedia Engines" },
  { id: "parts", label: "ExpediaParts monogram" },
  { id: "earnedstar", label: "EarnedStar (sibling brand)" }
];
var TIER_OPTIONS = [
  { id: "chrome", label: "T2 Chrome emblem" },
  { id: "flat", label: "T1 Flat emblem" },
  { id: "sticker", label: "T3 Sticker" },
  { id: "wordmark", label: "Wordmark" },
  { id: "origami", label: "Origami lucky star" }
];
function loadBrief(storageKey, createInitialBrief) {
  if (typeof window === "undefined") return createInitialBrief();
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return createInitialBrief();
    const parsed = JSON.parse(raw);
    if (parsed.version !== 1) return createInitialBrief();
    return parsed;
  } catch {
    return createInitialBrief();
  }
}
function CurrentLogoPreview({
  brand,
  tier
}) {
  if (brand === "earnedstar") {
    return /* @__PURE__ */ jsxs2("p", { className: "max-w-sm text-center text-sm text-gray-400", children: [
      "EarnedStar lockups live in ",
      /* @__PURE__ */ jsx2("code", { className: "text-gray-200", children: "earnedstar/src/components/brand/" }),
      "\u2014 use brief export to iterate there."
    ] });
  }
  const epBrand = brand;
  if (tier === "chrome") {
    if (epBrand === "parts") {
      return /* @__PURE__ */ jsx2(BrandLogo, { brand: "parts", variant: "horizontal", width: 120, height: 48 });
    }
    return /* @__PURE__ */ jsx2(PremiumBrandLogo, { brand: epBrand, sheen: "hover", width: 260, height: 120 });
  }
  if (tier === "sticker") {
    if (epBrand === "parts") {
      return /* @__PURE__ */ jsx2("p", { className: "text-center text-sm text-gray-400", children: "Parts monogram has no sticker tier yet." });
    }
    return /* @__PURE__ */ jsx2(StickerLogo, { brand: epBrand, width: 240, height: 88 });
  }
  if (tier === "wordmark") {
    return /* @__PURE__ */ jsx2(
      BrandLogo,
      {
        brand: epBrand,
        variant: "wordmark",
        width: 240,
        height: 36
      }
    );
  }
  return /* @__PURE__ */ jsx2(BrandLogo, { brand: epBrand, variant: "flat", width: 220, height: 100 });
}
function ReferenceTile({
  reference,
  onRemove
}) {
  const [broken, setBroken] = useState2(false);
  const showImage = reference.previewUrl && !broken;
  return /* @__PURE__ */ jsxs2("article", { className: "overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border-dark)] bg-white/5", children: [
    /* @__PURE__ */ jsxs2("div", { className: "flex items-center justify-between gap-2 border-b border-[var(--border-dark)] px-3 py-2", children: [
      /* @__PURE__ */ jsxs2("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx2("p", { className: "truncate text-xs font-semibold text-gray-200", children: reference.label }),
        /* @__PURE__ */ jsx2("p", { className: "truncate text-[10px] uppercase tracking-wide text-gray-500", children: reference.source })
      ] }),
      reference.source !== "builtin" ? /* @__PURE__ */ jsx2(
        "button",
        {
          type: "button",
          onClick: () => onRemove(reference.id),
          className: "shrink-0 rounded px-2 py-1 text-[10px] font-semibold text-amber-200 hover:bg-white/10",
          children: "Remove"
        }
      ) : null
    ] }),
    /* @__PURE__ */ jsx2("div", { className: "flex min-h-[140px] items-center justify-center bg-black/20 p-3", children: showImage ? (
      // eslint-disable-next-line @next/next/no-img-element -- workshop mood board (external Pinterest URLs)
      /* @__PURE__ */ jsx2(
        "img",
        {
          src: reference.previewUrl,
          alt: reference.label,
          className: "max-h-32 max-w-full rounded object-contain",
          onError: () => setBroken(true)
        }
      )
    ) : /* @__PURE__ */ jsxs2("div", { className: "space-y-2 px-3 text-center text-xs text-gray-400", children: [
      /* @__PURE__ */ jsx2("p", { children: "Pinterest pin link saved \u2014 preview needs a direct image URL." }),
      /* @__PURE__ */ jsx2(
        "a",
        {
          href: reference.sourceUrl,
          target: "_blank",
          rel: "noreferrer",
          className: "font-semibold text-[var(--color-blueberry)] hover:underline",
          children: "Open pin \u2192"
        }
      )
    ] }) }),
    reference.notes ? /* @__PURE__ */ jsx2("p", { className: "border-t border-[var(--border-dark)] px-3 py-2 text-[11px] text-gray-500", children: reference.notes }) : null
  ] });
}
function LogoWorkshopPanel({
  apiBase = "/api/design-lab/logo-workshop",
  storageKey = "expedia-design-lab-logo-workshop-v1",
  createInitialBrief = createEmptyBrief,
  renderPreview,
  brandOptions = BRAND_OPTIONS,
  tierOptions = TIER_OPTIONS,
  auditTitle,
  auditDescription,
  siblingWorkshops
}) {
  const [brief, setBrief] = useState2(createInitialBrief);
  const [referenceInput, setReferenceInput] = useState2("");
  const [referenceLabel, setReferenceLabel] = useState2("Pinterest reference");
  const [status, setStatus] = useState2(null);
  const [hydrated, setHydrated] = useState2(false);
  useEffect2(() => {
    setBrief(loadBrief(storageKey, createInitialBrief));
    setHydrated(true);
  }, [storageKey, createInitialBrief]);
  useEffect2(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify(brief));
  }, [brief, hydrated, storageKey]);
  const cursorPrompt = useMemo(() => buildCursorLogoPrompt(brief), [brief]);
  const patchBrief = useCallback2((partial) => {
    setBrief((current) => ({
      ...current,
      ...partial,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    }));
  }, []);
  const addReference = useCallback2(() => {
    const ref = parseReferenceInput(referenceInput, referenceLabel);
    if (!ref) {
      setStatus("Paste a Pinterest pin URL or a direct image URL (i.pinimg.com).");
      return;
    }
    setBrief((current) => ({
      ...current,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      references: [...current.references, ref]
    }));
    setReferenceInput("");
    setStatus(`Added ${ref.label}.`);
  }, [referenceInput, referenceLabel]);
  const resolvePinterest = useCallback2(async () => {
    if (!referenceInput.trim()) {
      setStatus("Paste a Pinterest pin URL first.");
      return;
    }
    setStatus("Resolving Pinterest preview\u2026");
    try {
      const params = new URLSearchParams({
        action: "resolve-pinterest",
        url: referenceInput.trim()
      });
      const res = await fetch(`${apiBase}?${params}`);
      const data = await res.json();
      if (!data.ok || !data.previewUrl) {
        setStatus(data.error ?? "Could not resolve Pinterest image.");
        return;
      }
      const ref = parseReferenceInput(data.previewUrl, referenceLabel || "Pinterest pin");
      if (!ref) return;
      const enriched = {
        ...ref,
        sourceUrl: referenceInput.trim(),
        previewUrl: data.previewUrl,
        notes: `Resolved via ${data.source ?? "pinterest"}.`
      };
      setBrief((current) => ({
        ...current,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        references: [...current.references, enriched]
      }));
      setReferenceInput("");
      setStatus(`Resolved Pinterest image (${data.source}).`);
    } catch {
      setStatus("Pinterest resolve failed \u2014 paste i.pinimg.com URL directly.");
    }
  }, [referenceInput, referenceLabel]);
  const removeReference = useCallback2((id) => {
    setBrief((current) => ({
      ...current,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      references: current.references.filter((ref) => ref.id !== id)
    }));
  }, []);
  const handleUpload = useCallback2(async (file) => {
    if (!file) return;
    const form = new FormData();
    form.append("brief", JSON.stringify(brief));
    form.append("file", file);
    form.append("label", referenceLabel || file.name);
    setStatus("Uploading reference to brand/logos/reference/workshop/\u2026");
    try {
      const res = await fetch(apiBase, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok || !data.ok || !data.reference) {
        setStatus(data.error ?? "Upload failed.");
        return;
      }
      const uploaded = data.reference;
      setBrief((current) => ({
        ...current,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        references: [...current.references, uploaded]
      }));
      setStatus(`Saved ${data.reference.previewUrl}${data.savedBriefPath ? ` \xB7 brief ${data.savedBriefPath}` : ""}`);
    } catch {
      setStatus("Upload failed \u2014 is the dev server running?");
    }
  }, [brief, referenceLabel]);
  const saveBriefToRepo = useCallback2(async () => {
    setStatus("Saving brief JSON to brand/logos/workshop/briefs/\u2026");
    try {
      const res = await fetch(apiBase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus(data.error ?? "Save failed.");
        return;
      }
      setStatus(`Brief saved: ${data.savedBriefPath}`);
    } catch {
      setStatus("Save failed \u2014 dev API unavailable.");
    }
  }, [brief]);
  const copyPrompt = useCallback2(async () => {
    try {
      await navigator.clipboard.writeText(cursorPrompt);
      setStatus("Cursor prompt copied.");
    } catch {
      setStatus("Could not copy \u2014 select the prompt block manually.");
    }
  }, [cursorPrompt]);
  const resetBrief = useCallback2(() => {
    setBrief(createInitialBrief());
    setStatus("Workshop reset with built-in reference seeds.");
  }, [createInitialBrief]);
  return /* @__PURE__ */ jsxs2("div", { className: "space-y-10", children: [
    siblingWorkshops && siblingWorkshops.length > 0 ? /* @__PURE__ */ jsx2(DesignLabSection, { title: "Sibling workshops", description: "Jump between ExpediaParts chrome tiers and EarnedStar origami lab.", children: /* @__PURE__ */ jsx2("ul", { className: "flex flex-wrap gap-3", children: siblingWorkshops.map((link) => /* @__PURE__ */ jsx2("li", { children: /* @__PURE__ */ jsxs2(
      "a",
      {
        href: link.href,
        className: "inline-flex flex-col rounded-lg border border-[var(--border-dark)] bg-white/5 px-4 py-3 text-sm text-gray-200 hover:border-white/25",
        children: [
          /* @__PURE__ */ jsx2("span", { className: "font-semibold text-white", children: link.label }),
          link.note ? /* @__PURE__ */ jsx2("span", { className: "mt-1 text-xs text-gray-500", children: link.note }) : null
        ]
      }
    ) }, link.href)) }) }) : null,
    /* @__PURE__ */ jsx2(
      DesignLabSection,
      {
        title: "Creative brief",
        description: "Describe the logo you want. Pair with Pinterest references \u2014 inspiration only, never ship unlicensed art.",
        children: /* @__PURE__ */ jsxs2("div", { className: "grid gap-4 lg:grid-cols-2", children: [
          /* @__PURE__ */ jsxs2("label", { className: "space-y-1 text-sm text-gray-300", children: [
            /* @__PURE__ */ jsx2("span", { className: "text-xs font-semibold uppercase tracking-wide text-gray-500", children: "Brand" }),
            /* @__PURE__ */ jsx2(
              "select",
              {
                value: brief.brand,
                onChange: (e) => patchBrief({ brand: e.target.value }),
                className: "w-full rounded-lg border border-[var(--border-dark)] bg-white/5 px-3 py-2 text-white",
                children: brandOptions.map((opt) => /* @__PURE__ */ jsx2("option", { value: opt.id, children: opt.label }, opt.id))
              }
            )
          ] }),
          /* @__PURE__ */ jsxs2("label", { className: "space-y-1 text-sm text-gray-300", children: [
            /* @__PURE__ */ jsx2("span", { className: "text-xs font-semibold uppercase tracking-wide text-gray-500", children: "Tier" }),
            /* @__PURE__ */ jsx2(
              "select",
              {
                value: brief.tier,
                onChange: (e) => patchBrief({ tier: e.target.value }),
                className: "w-full rounded-lg border border-[var(--border-dark)] bg-white/5 px-3 py-2 text-white",
                children: tierOptions.map((opt) => /* @__PURE__ */ jsx2("option", { value: opt.id, children: opt.label }, opt.id))
              }
            )
          ] }),
          [
            ["goal", "Goal", "e.g. Sharper REMAN block legibility at 120px width"],
            ["mood", "Mood / keywords", "machined \xB7 enamel \xB7 performance badge \xB7 cold precision"],
            ["mustInclude", "Must include", "REMAN block \xB7 navy field \xB7 horizontal nameplate"],
            ["mustAvoid", "Must avoid", "neon \xB7 SaaS gradient \xB7 cartoon chrome"],
            ["notes", "Session notes", "Compare against sticker cutline references"]
          ].map(([key, label, placeholder]) => /* @__PURE__ */ jsxs2("label", { className: "space-y-1 text-sm text-gray-300 lg:col-span-2", children: [
            /* @__PURE__ */ jsx2("span", { className: "text-xs font-semibold uppercase tracking-wide text-gray-500", children: label }),
            /* @__PURE__ */ jsx2(
              "textarea",
              {
                value: brief[key],
                onChange: (e) => patchBrief({ [key]: e.target.value }),
                rows: key === "notes" ? 3 : 2,
                placeholder,
                className: "w-full rounded-lg border border-[var(--border-dark)] bg-white/5 px-3 py-2 text-white placeholder:text-gray-500"
              }
            )
          ] }, key))
        ] })
      }
    ),
    /* @__PURE__ */ jsxs2(
      DesignLabSection,
      {
        title: "Pinterest & reference board",
        description: "Paste a Pinterest pin URL or direct image link (right-click pin \u2192 Copy image address). Uploads save to brand/logos/reference/workshop/.",
        children: [
          /* @__PURE__ */ jsxs2("div", { className: "mb-4 grid gap-3 md:grid-cols-[1fr_1fr_auto_auto]", children: [
            /* @__PURE__ */ jsx2(
              "input",
              {
                value: referenceLabel,
                onChange: (e) => setReferenceLabel(e.target.value),
                placeholder: "Reference label",
                className: "rounded-lg border border-[var(--border-dark)] bg-white/5 px-3 py-2 text-sm text-white"
              }
            ),
            /* @__PURE__ */ jsx2(
              "input",
              {
                value: referenceInput,
                onChange: (e) => setReferenceInput(e.target.value),
                placeholder: "https://www.pinterest.com/pin/\u2026 or https://i.pinimg.com/\u2026",
                className: "rounded-lg border border-[var(--border-dark)] bg-white/5 px-3 py-2 text-sm text-white md:col-span-1"
              }
            ),
            /* @__PURE__ */ jsx2(
              "button",
              {
                type: "button",
                onClick: () => void resolvePinterest(),
                className: "rounded-lg border border-[var(--border-dark)] px-4 py-2 text-sm font-semibold text-gray-200 hover:bg-white/10",
                children: "Resolve Pinterest"
              }
            ),
            /* @__PURE__ */ jsx2(
              "button",
              {
                type: "button",
                onClick: addReference,
                className: "rounded-lg bg-[var(--color-orange)] px-4 py-2 text-sm font-bold text-[var(--color-dark-blue)]",
                children: "Add reference"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs2("div", { className: "mb-4 flex flex-wrap items-center gap-3", children: [
            /* @__PURE__ */ jsxs2("label", { className: "cursor-pointer rounded-lg border border-dashed border-[var(--border-dark)] px-4 py-2 text-sm text-gray-300 hover:border-white/30", children: [
              "Upload image",
              /* @__PURE__ */ jsx2(
                "input",
                {
                  type: "file",
                  accept: "image/png,image/jpeg,image/webp,image/gif",
                  className: "hidden",
                  onChange: (e) => void handleUpload(e.target.files?.[0] ?? null)
                }
              )
            ] }),
            /* @__PURE__ */ jsx2(
              "button",
              {
                type: "button",
                onClick: () => {
                  const seeds = BUILTIN_REFERENCE_SEEDS.map((seed) => ({
                    id: seed.id,
                    source: "builtin",
                    label: seed.label,
                    sourceUrl: seed.previewUrl,
                    previewUrl: seed.previewUrl,
                    notes: seed.notes
                  }));
                  patchBrief({ references: seeds });
                  setStatus("Restored built-in reference seeds.");
                },
                className: "text-sm text-gray-400 underline hover:text-white",
                children: "Restore built-in seeds"
              }
            )
          ] }),
          /* @__PURE__ */ jsx2(DesignLabGrid, { children: brief.references.map((ref) => /* @__PURE__ */ jsx2(ReferenceTile, { reference: ref, onRemove: removeReference }, ref.id)) })
        ]
      }
    ),
    /* @__PURE__ */ jsx2(DesignLabSection, { title: "Current mark vs brief", children: /* @__PURE__ */ jsxs2("div", { className: "grid gap-4 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsx2(DesignLabCard, { label: "Production SVG today", surface: "hero", children: renderPreview ? renderPreview(brief.brand, brief.tier) : /* @__PURE__ */ jsx2(CurrentLogoPreview, { brand: brief.brand, tier: brief.tier }) }),
      /* @__PURE__ */ jsx2(DesignLabCard, { label: "Brief snapshot", surface: "navy", children: /* @__PURE__ */ jsxs2("ul", { className: "max-w-sm space-y-2 text-left text-sm text-gray-300", children: [
        /* @__PURE__ */ jsxs2("li", { children: [
          /* @__PURE__ */ jsx2("span", { className: "text-gray-500", children: "Goal:" }),
          " ",
          brief.goal || "\u2014"
        ] }),
        /* @__PURE__ */ jsxs2("li", { children: [
          /* @__PURE__ */ jsx2("span", { className: "text-gray-500", children: "Mood:" }),
          " ",
          brief.mood || "\u2014"
        ] }),
        /* @__PURE__ */ jsxs2("li", { children: [
          /* @__PURE__ */ jsx2("span", { className: "text-gray-500", children: "References:" }),
          " ",
          brief.references.length
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx2(
      LogoWorkshopAiPanel,
      {
        apiBase,
        auditTitle,
        auditDescription,
        brief,
        onBriefLoaded: setBrief,
        onStatus: setStatus
      }
    ),
    /* @__PURE__ */ jsx2(DesignLabSection, { title: "Quick export", children: /* @__PURE__ */ jsxs2("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsx2("pre", { className: "max-h-64 overflow-auto rounded-lg border border-[var(--border-dark)] bg-black/40 p-4 text-xs text-gray-300", children: cursorPrompt }),
      /* @__PURE__ */ jsxs2("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsx2(
          "button",
          {
            type: "button",
            onClick: () => void copyPrompt(),
            className: "rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15",
            children: "Copy Cursor prompt"
          }
        ),
        /* @__PURE__ */ jsx2(
          "button",
          {
            type: "button",
            onClick: () => void saveBriefToRepo(),
            className: "rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15",
            children: "Save brief to repo"
          }
        ),
        /* @__PURE__ */ jsx2(
          "button",
          {
            type: "button",
            onClick: resetBrief,
            className: "rounded-lg px-4 py-2 text-sm text-gray-400 hover:text-white",
            children: "Reset workshop"
          }
        )
      ] }),
      status ? /* @__PURE__ */ jsx2("p", { className: "text-sm text-amber-100/90", children: status }) : null
    ] }) })
  ] });
}
export {
  BUILTIN_REFERENCE_SEEDS,
  CHROME_LAYER_CANON,
  EARNEDSTAR_LOGO_WORKSHOP_STORAGE_KEY,
  EARNEDSTAR_REFERENCE_SEEDS,
  LOGO_WORKSHOP_STORAGE_KEY,
  LogoWorkshopAiPanel,
  LogoWorkshopPanel,
  ORIGAMI_SOURCE_CANON,
  auditBrandSource,
  auditSvgLayers,
  auditWorkshopSource,
  briefSlug,
  buildAiIterationPrompt,
  buildCursorLogoPrompt,
  buildFigmaHandoffPrompt,
  createEarnedStarBrief,
  createEmptyBrief,
  createReferenceId,
  iterationArtifactPaths,
  parseReferenceInput,
  parseSvgLayerIds,
  resolvePinterestImageUrl,
  resolveSvgTarget
};
//# sourceMappingURL=index.js.map