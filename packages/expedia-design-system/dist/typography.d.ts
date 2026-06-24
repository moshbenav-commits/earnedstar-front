/**
 * Tailwind class bundles matching the official STYLES typography spec.
 */
/** H1 — Anton 50pt, Black (900), 120% line height */
declare const typeH1 = "font-display font-black uppercase leading-[120%] tracking-[0] text-text";
/** H2 — Bebas Neue 48pt, Black (900), 100% line height */
declare const typeH2 = "font-heading font-black uppercase leading-[100%] tracking-[0] text-text";
/** H3 — Bebas Neue 26pt, Black (900), 110% line height */
declare const typeH3 = "font-heading font-black uppercase leading-[110%] tracking-[0] text-text";
/** H4 — Inter 22pt Black */
declare const typeH4 = "font-sans text-[1.375rem] font-black leading-[1.227] tracking-[-0.03em] text-text";
/** Body Regular — Inter 16pt */
declare const typeBody = "font-sans text-base font-normal leading-[140%] tracking-[-0.03em] text-text-secondary";
/** CTAs — Inter 16pt Bold */
declare const typeCta = "font-sans text-base font-bold leading-[120%] tracking-[-0.03em]";
/** Labels Semi-bold — Inter 14pt */
declare const typeLabel = "font-sans text-sm font-semibold leading-[120%] tracking-[-0.02em]";
/** Labels Regular — Inter 14pt */
declare const typeLabelRegular = "font-sans text-sm font-normal leading-[120%] tracking-[-0.02em]";
/** Label Small — Inter 12pt (metadata; use with text-text-muted) */
declare const typeLabelSmall = "font-sans text-xs font-semibold leading-[120%] tracking-[-0.02em] text-text-muted";
/** Text links — Blueberry (STYLES) */
declare const typeLink = "font-sans text-base font-medium text-link underline-offset-4 hover:text-link/80 hover:underline";
declare const typeDismiss = "font-sans text-base text-text-secondary underline underline-offset-4 transition-colors hover:text-text";
/**
 * Typography on `[data-surface="dark"]` — no embedded dark text tokens.
 * Prefer these (or globals.css overrides) instead of typeH* / typeBody on dark shells.
 */
declare const typeH1OnDark = "font-display font-black uppercase leading-[120%] tracking-[0] text-white";
declare const typeH2OnDark = "font-heading font-black uppercase leading-[100%] tracking-[0] text-white";
declare const typeH3OnDark = "font-heading font-black uppercase leading-[110%] tracking-[0] text-white";
declare const typeH4OnDark = "font-sans text-[1.375rem] font-black leading-[1.227] tracking-[-0.03em] text-white";
declare const typeBodyOnDark = "font-sans text-base font-normal leading-[140%] tracking-[-0.03em] text-gray-200";
declare const typeLabelOnDark = "font-sans text-sm font-semibold leading-[120%] tracking-[-0.02em] text-gray-100";
/** Home marketing section titles — Bebas, scales 32px→48px */
declare const homeSectionTitleClass = "font-normal text-[clamp(2rem,8vw,3rem)] leading-[100%] tracking-[0px] text-center";
/** Home subsection / article headlines */
declare const homeSectionHeadlineClass = "font-normal text-[clamp(1.75rem,6vw,3rem)] leading-[100%] tracking-[0px] uppercase";

export { homeSectionHeadlineClass, homeSectionTitleClass, typeBody, typeBodyOnDark, typeCta, typeDismiss, typeH1, typeH1OnDark, typeH2, typeH2OnDark, typeH3, typeH3OnDark, typeH4, typeH4OnDark, typeLabel, typeLabelOnDark, typeLabelRegular, typeLabelSmall, typeLink };
