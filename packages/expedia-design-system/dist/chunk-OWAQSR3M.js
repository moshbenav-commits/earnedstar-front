// src/brandAssets.ts
var BRAND_LOGO_BASE = "/brand-logos";
var brandLogoPaths = {
  transmissions: {
    flat: `${BRAND_LOGO_BASE}/svg/expedia-transmissions-emblem-flat.svg`,
    premium: `${BRAND_LOGO_BASE}/svg/expedia-transmissions-emblem-chrome.svg`,
    photoreal: `${BRAND_LOGO_BASE}/png/expedia-transmissions-emblem-photoreal-hero.png`,
    horizontal: `${BRAND_LOGO_BASE}/svg/expedia-transmissions-primary.svg`,
    sticker: `${BRAND_LOGO_BASE}/svg/expedia-transmissions-sticker.svg`,
    wordmark: `${BRAND_LOGO_BASE}/svg/expedia-transmissions-wordmark.svg`,
    onecolor: `${BRAND_LOGO_BASE}/svg/expedia-transmissions-emblem-onecolor-white.svg`,
    icon: `${BRAND_LOGO_BASE}/svg/expedia-transmissions-icon.svg`
  },
  engines: {
    flat: `${BRAND_LOGO_BASE}/svg/expedia-engines-emblem-flat.svg`,
    premium: `${BRAND_LOGO_BASE}/svg/expedia-engines-emblem-chrome.svg`,
    photoreal: `${BRAND_LOGO_BASE}/png/expedia-engines-emblem-chrome-2x.png`,
    horizontal: `${BRAND_LOGO_BASE}/svg/expedia-engines-primary.svg`,
    sticker: `${BRAND_LOGO_BASE}/svg/expedia-engines-sticker.svg`,
    icon: `${BRAND_LOGO_BASE}/svg/expedia-engines-icon.svg`
  },
  parts: {
    horizontal: `${BRAND_LOGO_BASE}/svg/expedia-ep-monogram.svg`,
    icon: `${BRAND_LOGO_BASE}/svg/expedia-ep-icon.svg`
  }
};
function resolveBrandLogoPath(brand, variant) {
  return brandLogoPaths[brand]?.[variant];
}
var brandDisplayNames = {
  parts: "ExpediaParts",
  transmissions: "Expedia Transmissions",
  engines: "Expedia Engines"
};

export {
  BRAND_LOGO_BASE,
  brandLogoPaths,
  resolveBrandLogoPath,
  brandDisplayNames
};
//# sourceMappingURL=chunk-OWAQSR3M.js.map