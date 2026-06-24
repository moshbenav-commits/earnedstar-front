import React from "react";
import LeatherStar from "./LeatherStar";

const LEATHER_WORDMARK = "https://customer-assets.emergentagent.com/job_rater-pro/artifacts/4wz9czmz_Photorealistic_leather_text_wordmark_for_EarnedStar_in_navy_and_gold.png";
const BRAND_SHEET = "https://customer-assets.emergentagent.com/job_rater-pro/artifacts/0zpntmg0_EarnedStar_3D_origami_lucky_star_logo_system_with_merchant_logo_zone.png";

/**
 * EarnedStarMark — small badge that crops the icon-detail quadrant of the brand sheet.
 * For tiny sizes, the SVG LeatherStar is used as fallback.
 */
export default function EarnedStarMark({
  size = 40,
  variant = "navy",
  center = "check",
  className = "",
  animated = false,
  showShadow = false,
  logoUrl = null,
}) {
  if (size < 56) {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          backgroundImage: `url(${BRAND_SHEET})`,
          backgroundSize: "320% 320%",
          backgroundPosition: "100% 0%",
          backgroundRepeat: "no-repeat",
          filter: variant === "white" ? "drop-shadow(0 2px 4px rgba(0,0,0,0.2)) brightness(1.05)" : "drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
        }}
        role="img"
        aria-label="EarnedStar mark"
      />
    );
  }
  return <LeatherStar size={size} variant={variant} center={center} className={className} animated={animated} showShadow={showShadow} logoUrl={logoUrl} />;
}

/**
 * EarnedStarWordmark — uses the photorealistic leather wordmark image (real 3D render).
 */
export function EarnedStarWordmark({ variant = "navy", className = "" }) {
  const isWhite = variant === "white";
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={LEATHER_WORDMARK}
        alt="EarnedStar"
        className="h-9 md:h-10 w-auto"
        style={{
          filter: isWhite
            ? "drop-shadow(0 2px 6px rgba(0,0,0,0.5)) brightness(1.1)"
            : "drop-shadow(0 2px 6px rgba(11,26,56,0.25))",
        }}
      />
    </div>
  );
}
