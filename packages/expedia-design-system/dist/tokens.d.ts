/**
 * Expedia Parts design system tokens (official STYLES spec).
 * Use these values for all new UI; prefer semantic names over raw hex in components.
 */
/** Shared brand-family palette (ExpediaParts · Transmissions · Engines). */
declare const brandFamily: {
    readonly expediaBlack: "#05070D";
    readonly expediaNavy: "#0A1020";
    readonly expediaWhite: "#FFFFFF";
    readonly transNavy: "#0A1020";
    readonly transBlue: "#1769FF";
    readonly transBlueHover: "#3D84FF";
    readonly engNavy: "#0A1020";
    readonly engGold: "#F5A623";
    readonly engGoldHover: "#FFB84D";
};
declare const colors: {
    readonly black: "#000000";
    readonly darkBlue: "#0D1217";
    readonly watermelonRed: "#B43642";
    readonly spanishOrange: "#E76D0D";
    readonly orange: "#FF7F0A";
    readonly crayola: "#FFA81C";
    readonly yellow: "#FFC335";
    readonly floralWhite: "#FDF8EE";
    readonly mayGreen: "#459145";
    readonly blueberry: "#4C87F4";
    readonly grey: "#94A3B1";
    readonly grey2: "#D3DCE3";
    readonly grey3: "#F1F2F4";
    /** Warm off-white for page/card backgrounds (not pure #FFF). */
    readonly offWhite: "#FAF9F6";
    readonly white: "#FFFFFF";
};
/** Semantic aliases used across the app (map to spec colors). */
declare const semanticColors: {
    readonly primary: "#FF7F0A";
    readonly secondary: "#FFA81C";
    readonly tertiary: "#FFC335";
    readonly accent: "#B43642";
    readonly accentLight: "#E76D0D";
    readonly success: "#459145";
    readonly error: "#B43642";
    readonly warning: "#FFC335";
    readonly link: "#4C87F4";
    readonly text: "#0D1217";
    readonly textSecondary: "#000000";
    /** Decorative only — fails WCAG on white; use textMutedAccessible for UI copy */
    readonly textMuted: "#94A3B1";
    /** ~4.6:1 on white / floral white (WCAG AA body text) */
    readonly textMutedAccessible: "#5F6E7B";
    readonly placeholder: "#5F6E7B";
    readonly surface: "#FAF9F6";
    readonly surfaceSecondary: "#F1F2F4";
    readonly surfaceDisabled: "#D3DCE3";
    readonly ctaBackground: "#FDF8EE";
    readonly ctaFind: "#E76D0D";
    readonly chatHeader: "#0D1217";
    readonly chatAgentBubbleSales: "#FFE8D1";
    readonly chatAgentBubbleSupport: "#FFF0D4";
    readonly chatUserBubble: "#C8DBFA";
};
/** Solid part-type pills (Engine / Transmission / Transfer Case) — white label text. */
declare const partTypeBadgeColors: {
    readonly engine: "#B43642";
    readonly transmission: "#00306E";
    readonly transferCase: "#4F138F";
};
/**
 * Typography scale from STYLES spec.
 * Sizes are implemented in px (design doc pt values treated as px for web).
 */
declare const typography: {
    readonly h1: {
        readonly fontFamily: "var(--font-anton), Anton, sans-serif";
        readonly fontSize: "3.125rem";
        readonly fontWeight: 900;
        readonly lineHeight: "120%";
        readonly letterSpacing: "0";
    };
    readonly h2: {
        readonly fontFamily: "var(--font-bebas-neue), \"Bebas Neue\", sans-serif";
        readonly fontSize: "3rem";
        readonly fontWeight: 900;
        readonly lineHeight: "100%";
        readonly letterSpacing: "0";
    };
    readonly h3: {
        readonly fontFamily: "var(--font-bebas-neue), \"Bebas Neue\", sans-serif";
        readonly fontSize: "1.625rem";
        readonly fontWeight: 900;
        readonly lineHeight: "110%";
        readonly letterSpacing: "0";
    };
    readonly h4: {
        readonly fontFamily: "var(--font-inter), Inter, sans-serif";
        readonly fontSize: "1.375rem";
        readonly fontWeight: 900;
        readonly lineHeight: "1.227";
        readonly letterSpacing: "-0.03em";
    };
    readonly body: {
        readonly fontFamily: "var(--font-inter), Inter, sans-serif";
        readonly fontSize: "1rem";
        readonly fontWeight: 400;
        readonly lineHeight: "140%";
        readonly letterSpacing: "-0.03em";
    };
    readonly cta: {
        readonly fontFamily: "var(--font-inter), Inter, sans-serif";
        readonly fontSize: "1rem";
        readonly fontWeight: 700;
        readonly lineHeight: "120%";
        readonly letterSpacing: "-0.03em";
    };
    readonly labelSemiBold: {
        readonly fontFamily: "var(--font-inter), Inter, sans-serif";
        readonly fontSize: "0.875rem";
        readonly fontWeight: 600;
        readonly lineHeight: "120%";
        readonly letterSpacing: "-0.02em";
    };
    readonly labelRegular: {
        readonly fontFamily: "var(--font-inter), Inter, sans-serif";
        readonly fontSize: "0.875rem";
        readonly fontWeight: 400;
        readonly lineHeight: "120%";
        readonly letterSpacing: "-0.02em";
    };
    readonly labelSmall: {
        readonly fontFamily: "var(--font-inter), Inter, sans-serif";
        readonly fontSize: "0.75rem";
        readonly fontWeight: 600;
        readonly lineHeight: "120%";
        readonly letterSpacing: "-0.02em";
    };
};
/** Icon sizes from STYLES icon sheet */
declare const iconSizes: {
    readonly inline: 16;
    readonly primary: 24;
    readonly elevated: 32;
    readonly standalone: 48;
};
type BrandFamilyColor = keyof typeof brandFamily;
type DesignColor = keyof typeof colors;
type SemanticColor = keyof typeof semanticColors;

export { type BrandFamilyColor, type DesignColor, type SemanticColor, brandFamily, colors, iconSizes, partTypeBadgeColors, semanticColors, typography };
