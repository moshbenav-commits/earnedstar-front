/** EarnedStar mark SVG builders — ported from SVG_LOGO_BUILDER.html */

export type StarStyle = "origami" | "geometric" | "rounded" | "classic";
export type CenterStyle = "logo" | "check" | "stars" | "none";

export type MarkColors = {
  color1: string;
  color2: string;
  color3: string;
  gradient?: boolean;
};

export const DEFAULT_MARK_COLORS: MarkColors = {
  color1: "#F59E0B",
  color2: "#D97706",
  color3: "#92400E",
};

function lighten(hex: string, amt: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lr = Math.min(255, Math.round(r + (255 - r) * amt));
  const lg = Math.min(255, Math.round(g + (255 - g) * amt));
  const lb = Math.min(255, Math.round(b + (255 - b) * amt));
  return `#${[lr, lg, lb].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

export function getStarPath(style: StarStyle, roundness = 4): string {
  const cx = 50;
  const cy = 50;
  const outerR = style === "geometric" ? 45 : 44;
  const innerR = style === "geometric" ? 16 : 19;
  const points = 5;

  if (style === "rounded") {
    const coords: { x: number; y: number }[] = [];
    for (let i = 0; i < points * 2; i++) {
      const angle = (Math.PI / points) * i - Math.PI / 2;
      const rad = i % 2 === 0 ? outerR : innerR;
      coords.push({ x: cx + rad * Math.cos(angle), y: cy + rad * Math.sin(angle) });
    }
    const n = coords.length;
    let d = "";
    for (let i = 0; i < n; i++) {
      const prev = coords[(i - 1 + n) % n];
      const curr = coords[i];
      const next = coords[(i + 1) % n];
      const mx1 = (prev.x + curr.x) / 2;
      const my1 = (prev.y + curr.y) / 2;
      const mx2 = (curr.x + next.x) / 2;
      const my2 = (curr.y + next.y) / 2;
      if (i === 0) d += `M${mx1.toFixed(2)},${my1.toFixed(2)} `;
      d += `Q${curr.x.toFixed(2)},${curr.y.toFixed(2)} ${mx2.toFixed(2)},${my2.toFixed(2)} `;
    }
    return `${d}Z`;
  }

  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const angle = (Math.PI / points) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? outerR : innerR;
    const x = cx + rad * Math.cos(angle);
    const y = cy + rad * Math.sin(angle);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
  }
  return `${d}Z`;
}

export function getOrigamiFacets(): string {
  return `
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
}

export type MarkOptions = {
  id?: string;
  style?: StarStyle;
  centerStyle?: CenterStyle;
  colors?: MarkColors;
  logoUrl?: string | null;
  darkBg?: boolean;
  roundness?: number;
};

export function buildMarkSvg(options: MarkOptions = {}): {
  starPath: string;
  id: string;
  colors: MarkColors;
  style: StarStyle;
  centerStyle: CenterStyle;
  logoUrl?: string | null;
  darkBg: boolean;
} {
  const id = options.id ?? "es-mark";
  const style = options.style ?? "origami";
  const centerStyle = options.centerStyle ?? "check";
  const colors = options.colors ?? DEFAULT_MARK_COLORS;
  const darkBg = options.darkBg ?? false;
  const starPath = getStarPath(style, options.roundness);

  return { starPath, id, colors, style, centerStyle, logoUrl: options.logoUrl, darkBg };
}

export function getBodyGradientStops(colors: MarkColors) {
  return {
    light: lighten(colors.color1, 0.18),
    mid: colors.color1,
    dark: colors.color3,
  };
}
