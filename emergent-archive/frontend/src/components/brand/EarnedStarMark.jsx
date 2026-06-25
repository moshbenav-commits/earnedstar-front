import React from "react";
import LeatherStar from "./LeatherStar";

const LEATHER_WORDMARK = "/meshy-renders/render_76cbc33016.png"; // "EarnedStar · THE MARK OF VERIFIED TRUST"
const HERO_BADGE = "/meshy-renders/render_03ad263cd8.png"; // hero composition

/**
 * EarnedStarMark — small badge using the 3D Meshy render.
 * For tiny sizes (<48px) falls back to SVG LeatherStar.
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
      <img
        src={HERO_BADGE}
        alt="EarnedStar mark"
        className={className}
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          filter: variant === "white" ? "drop-shadow(0 2px 4px rgba(0,0,0,0.4)) brightness(1.05)" : "drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
        }}
      />
    );
  }
  return <LeatherStar size={size} variant={variant} center={center} className={className} animated={animated} showShadow={showShadow} logoUrl={logoUrl} />;
}

/**
 * EarnedStarWordmark — uses the photorealistic 3D leather wordmark render.
 */
export function EarnedStarWordmark({ variant = "navy", className = "" }) {
  const isWhite = variant === "white";
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={LEATHER_WORDMARK}
        alt="EarnedStar — The Mark of Verified Trust"
        className="h-10 md:h-12 w-auto"
        style={{
          filter: isWhite
            ? "drop-shadow(0 2px 6px rgba(0,0,0,0.5)) brightness(1.1)"
            : "drop-shadow(0 2px 6px rgba(11,26,56,0.25))",
        }}
      />
    </div>
  );
}
