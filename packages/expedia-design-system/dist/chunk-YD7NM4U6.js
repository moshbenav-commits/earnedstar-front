import {
  colors
} from "./chunk-WAQEYLNI.js";
import {
  brandDisplayNames,
  resolveBrandLogoPath
} from "./chunk-OWAQSR3M.js";

// src/components/Button.tsx
import clsx from "clsx";
import { forwardRef } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var variantStyles = {
  primary: clsx(
    "bg-primary text-text",
    "hover:opacity-90 active:opacity-80",
    "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    "disabled:bg-surface-disabled disabled:text-text-muted disabled:opacity-100"
  ),
  secondary: clsx(
    "bg-secondary text-text",
    "hover:opacity-90 active:opacity-80",
    "focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
    "disabled:bg-surface-disabled disabled:text-text-muted"
  ),
  ghost: clsx(
    "bg-transparent text-white border border-[var(--border-dark)]",
    "hover:bg-white/5 active:bg-white/10",
    "focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-expedia-navy)]",
    "disabled:text-text-muted disabled:border-transparent"
  )
};
var sizeStyles = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2.5 text-base gap-2",
  lg: "px-5 py-3 text-base gap-2.5"
};
var DsButton = forwardRef(
  ({
    variant = "primary",
    size = "md",
    isLoading = false,
    leftIcon,
    rightIcon,
    className,
    disabled,
    children,
    ...props
  }, ref) => {
    const isDisabled = disabled || isLoading;
    return /* @__PURE__ */ jsx(
      "button",
      {
        ref,
        type: "button",
        disabled: isDisabled,
        className: clsx(
          "inline-flex items-center justify-center rounded-full font-bold ds-motion-fast",
          "focus-visible:outline-none disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className
        ),
        ...props,
        children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent",
              "aria-hidden": true
            }
          ),
          /* @__PURE__ */ jsx("span", { children: "Loading\u2026" })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          leftIcon ? /* @__PURE__ */ jsx("span", { className: "shrink-0", children: leftIcon }) : null,
          children,
          rightIcon ? /* @__PURE__ */ jsx("span", { className: "shrink-0", children: rightIcon }) : null
        ] })
      }
    );
  }
);
DsButton.displayName = "DsButton";

// src/components/Badge.tsx
import clsx2 from "clsx";
import { jsx as jsx2 } from "react/jsx-runtime";
var toneStyles = {
  default: "bg-surface-secondary text-text",
  transmissions: "bg-[#00306E] text-white",
  engines: "bg-[#5c3d12] text-white",
  parts: "bg-primary/15 text-text",
  success: "bg-success text-white",
  muted: "bg-gray-200 text-text-muted"
};
function DsBadge({
  variant = "flat",
  tone = "default",
  selected = false,
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx2(
    "span",
    {
      className: clsx2(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold tracking-wide",
        variant === "premium" && "badge-machined-tab border border-[var(--border-metal)]",
        toneStyles[tone],
        selected && "ring-2 ring-primary ring-offset-1",
        className
      ),
      ...props,
      children
    }
  );
}

// src/components/Tabs.tsx
import clsx3 from "clsx";
import { useState } from "react";
import { jsx as jsx3 } from "react/jsx-runtime";
function DsTabs({
  items,
  value,
  defaultValue,
  onValueChange,
  variant = "underline",
  className
}) {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.id ?? "");
  const active = value ?? internal;
  const select = (id) => {
    if (value === void 0) setInternal(id);
    onValueChange?.(id);
  };
  return /* @__PURE__ */ jsx3(
    "div",
    {
      role: "tablist",
      className: clsx3(
        "flex flex-wrap gap-1",
        variant === "plate" && "rounded-lg bg-white/5 p-1",
        className
      ),
      children: items.map((item) => {
        const isSelected = item.id === active;
        return /* @__PURE__ */ jsx3(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            disabled: item.disabled,
            onClick: () => select(item.id),
            className: clsx3(
              "ds-motion-fast rounded-md px-4 py-2 text-sm font-semibold",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
              "disabled:cursor-not-allowed disabled:opacity-40",
              variant === "underline" && (isSelected ? "border-b-2 border-primary text-white" : "border-b-2 border-transparent text-gray-400 hover:text-gray-200"),
              variant === "plate" && (isSelected ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:bg-white/5 hover:text-gray-200")
            ),
            children: item.label
          },
          item.id
        );
      })
    }
  );
}

// src/components/SearchBar.tsx
import clsx4 from "clsx";
import { useId } from "react";
import { jsx as jsx4, jsxs as jsxs2 } from "react/jsx-runtime";
function DsSearchBar({
  size = "compact",
  label = "Search",
  className,
  id,
  ...props
}) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return /* @__PURE__ */ jsxs2(
    "label",
    {
      htmlFor: inputId,
      className: clsx4(
        "flex w-full items-center gap-3 rounded-full border ds-motion-fast",
        size === "hero" ? "border-[var(--border-metal)] bg-white px-5 py-3.5 shadow-elevated" : "border-[var(--border-light)] bg-white px-4 py-2.5 shadow-input",
        "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
        className
      ),
      children: [
        /* @__PURE__ */ jsx4("span", { className: "sr-only", children: label }),
        /* @__PURE__ */ jsxs2(
          "svg",
          {
            "aria-hidden": true,
            className: clsx4("shrink-0 text-text-muted", size === "hero" ? "h-5 w-5" : "h-4 w-4"),
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
              /* @__PURE__ */ jsx4("circle", { cx: "11", cy: "11", r: "7" }),
              /* @__PURE__ */ jsx4("path", { d: "M20 20l-3.5-3.5" })
            ]
          }
        ),
        /* @__PURE__ */ jsx4(
          "input",
          {
            id: inputId,
            type: "search",
            placeholder: props.placeholder ?? "Year, make, model, or part\u2026",
            className: clsx4(
              "w-full bg-transparent font-sans text-text outline-none placeholder:text-placeholder",
              size === "hero" ? "text-base" : "text-sm"
            ),
            ...props
          }
        )
      ]
    }
  );
}

// src/components/Panel.tsx
import clsx5 from "clsx";
import { jsx as jsx5, jsxs as jsxs3 } from "react/jsx-runtime";
function DsPanel({
  variant = "light",
  title,
  description,
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs3(
    "section",
    {
      "data-surface": variant === "light" ? "light" : "dark",
      className: clsx5(
        "rounded-[var(--radius-panel)] border p-5",
        variant === "light" && "border-[var(--border-light)] bg-white text-text",
        variant === "dark" && "border-[var(--border-dark)] bg-[var(--brand-expedia-navy)] text-gray-200",
        variant === "glass" && "ds-panel-glass-dark text-gray-200",
        className
      ),
      ...props,
      children: [
        title ? /* @__PURE__ */ jsxs3("header", { className: "mb-3", children: [
          /* @__PURE__ */ jsx5("h3", { className: "font-sans text-sm font-bold uppercase tracking-[0.12em] text-inherit", children: title }),
          description ? /* @__PURE__ */ jsx5("p", { className: "mt-1 font-sans text-sm text-gray-400", children: description }) : null
        ] }) : null,
        children
      ]
    }
  );
}

// src/components/BrandLogo.tsx
import clsx6 from "clsx";
import { jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
function sheenClass(sheen) {
  if (sheen === "hover") return "badge-sheen badge-sheen--hover";
  if (sheen === "auto") return "badge-sheen badge-sheen--auto";
  return void 0;
}
function BrandLogo({
  brand,
  variant = "flat",
  sheen = "none",
  className,
  width = 160,
  height = 80,
  priority = false
}) {
  const src = resolveBrandLogoPath(brand, variant);
  if (!src) {
    return /* @__PURE__ */ jsxs4("span", { className: clsx6("text-sm text-text-muted", className), role: "img", children: [
      brandDisplayNames[brand],
      " \u2014 ",
      variant,
      " unavailable"
    ] });
  }
  return /* @__PURE__ */ jsx6("span", { className: clsx6("inline-flex items-center justify-center", sheenClass(sheen), className), children: /* @__PURE__ */ jsx6(
    "img",
    {
      src,
      alt: `${brandDisplayNames[brand]} ${variant} logo`,
      width,
      height,
      className: "h-auto max-w-full",
      loading: priority ? "eager" : "lazy"
    }
  ) });
}

// src/components/PremiumBrandLogo.tsx
import clsx7 from "clsx";
import { jsx as jsx7, jsxs as jsxs5 } from "react/jsx-runtime";
function sheenClass2(sheen) {
  if (sheen === "hover") return "badge-sheen badge-sheen--hover";
  if (sheen === "auto") return "badge-sheen badge-sheen--auto";
  return void 0;
}
function PremiumBrandLogo({
  brand,
  sheen = "hover",
  framed = false,
  className,
  width = 180,
  height = 100
}) {
  const src = resolveBrandLogoPath(brand, "premium");
  const metalVariant = brand === "engines" ? "badge-metal--engines" : "badge-metal--transmissions";
  if (!src) {
    return /* @__PURE__ */ jsxs5("span", { className: clsx7("text-sm text-text-muted", className), role: "img", children: [
      "Premium ",
      brandDisplayNames[brand],
      " unavailable"
    ] });
  }
  const emblem = (
    /* eslint-disable-next-line @next/next/no-img-element -- local SVG masters */
    /* @__PURE__ */ jsx7(
      "img",
      {
        src,
        alt: `${brandDisplayNames[brand]} premium chrome emblem`,
        width,
        height,
        className: "badge-raised-emblem h-auto max-w-full"
      }
    )
  );
  if (!framed) {
    return /* @__PURE__ */ jsx7(
      "span",
      {
        className: clsx7(
          "inline-flex items-center justify-center",
          sheenClass2(sheen),
          className
        ),
        children: emblem
      }
    );
  }
  return /* @__PURE__ */ jsx7(
    "span",
    {
      className: clsx7(
        "badge-metal",
        metalVariant,
        sheenClass2(sheen),
        className
      ),
      children: /* @__PURE__ */ jsx7("span", { className: "badge-metal__inner badge-bevel-inset inline-flex items-center justify-center p-3", children: emblem })
    }
  );
}

// src/components/HeroBadge.tsx
import clsx8 from "clsx";
import { jsx as jsx8 } from "react/jsx-runtime";
var heroBadgeDimensions = {
  transmissions: { width: 560, height: 90 },
  engines: { width: 480, height: 222 }
};
function HeroBadge({
  brand,
  sheen = "auto",
  glass = false,
  plate = true,
  className,
  width,
  height
}) {
  const dims = heroBadgeDimensions[brand];
  return /* @__PURE__ */ jsx8(
    "div",
    {
      className: clsx8(
        plate && "badge-premium-plate",
        glass && "brand-glass-panel",
        className
      ),
      children: /* @__PURE__ */ jsx8(
        PremiumBrandLogo,
        {
          brand,
          sheen,
          framed: false,
          width: width ?? dims.width,
          height: height ?? dims.height
        }
      )
    }
  );
}

// src/components/PhotorealHeroBadge.tsx
import clsx9 from "clsx";
import { jsx as jsx9, jsxs as jsxs6 } from "react/jsx-runtime";
var photorealDimensions = {
  transmissions: { width: 1041, height: 196 },
  engines: { width: 600, height: 277 }
};
function PhotorealHeroBadge({
  brand,
  className,
  width,
  height,
  priority = true
}) {
  const src = resolveBrandLogoPath(brand, "photoreal");
  const dims = photorealDimensions[brand];
  if (!src) {
    return /* @__PURE__ */ jsxs6("span", { className: clsx9("text-sm text-text-muted", className), role: "img", children: [
      "Photoreal ",
      brandDisplayNames[brand],
      " unavailable"
    ] });
  }
  return (
    /* eslint-disable-next-line @next/next/no-img-element -- T3 photoreal raster hero */
    /* @__PURE__ */ jsx9(
      "img",
      {
        src,
        alt: `${brandDisplayNames[brand]} premium chrome emblem`,
        width: width ?? dims.width,
        height: height ?? dims.height,
        fetchPriority: priority ? "high" : void 0,
        decoding: priority ? "sync" : "async",
        className: clsx9("photoreal-hero-emblem h-auto max-w-full", className)
      }
    )
  );
}

// src/components/StickerLogo.tsx
import clsx10 from "clsx";
import { jsx as jsx10, jsxs as jsxs7 } from "react/jsx-runtime";
function StickerLogo({
  brand,
  className,
  width = 200,
  height = 72
}) {
  const src = resolveBrandLogoPath(brand, "sticker");
  if (!src) {
    return /* @__PURE__ */ jsxs7("span", { className: clsx10("text-sm text-text-muted", className), role: "img", children: [
      "Sticker ",
      brandDisplayNames[brand],
      " unavailable"
    ] });
  }
  return /* @__PURE__ */ jsx10("span", { className: clsx10("inline-flex", className), children: /* @__PURE__ */ jsx10(
    "img",
    {
      src,
      alt: `${brandDisplayNames[brand]} sticker logo`,
      width,
      height,
      className: "h-auto max-w-full drop-shadow-md"
    }
  ) });
}

// src/components/TrustBadge.tsx
import clsx11 from "clsx";
import { FiAward, FiHeadphones, FiLock, FiShield } from "react-icons/fi";
import { jsx as jsx11, jsxs as jsxs8 } from "react/jsx-runtime";
var TRUST_META = {
  warranty: {
    label: "Warranty backed",
    compactLabel: "Warranty",
    Icon: FiAward,
    accent: colors.mayGreen
  },
  "secure-checkout": {
    label: "Secure checkout",
    compactLabel: "Secure",
    Icon: FiLock,
    accent: colors.blueberry
  },
  verified: {
    label: "Verified fitment",
    compactLabel: "Verified",
    Icon: FiShield,
    accent: colors.orange
  },
  support: {
    label: "Expert support",
    compactLabel: "Support",
    Icon: FiHeadphones,
    accent: colors.crayola
  }
};
function TrustBadge({
  kind,
  surface = "light",
  selected = false,
  compact = false,
  className,
  ...props
}) {
  const meta = TRUST_META[kind];
  const Icon = meta.Icon;
  const label = compact ? meta.compactLabel : meta.label;
  return /* @__PURE__ */ jsxs8(
    "span",
    {
      className: clsx11(
        "inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs font-semibold tracking-wide",
        surface === "dark" ? "border-white/10 bg-white/5 text-gray-100" : "border-gray-200 bg-white text-text",
        selected && "ring-2 ring-primary ring-offset-1",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx11(
          "span",
          {
            className: "h-3.5 w-0.5 shrink-0 rounded-full",
            style: { background: meta.accent },
            "aria-hidden": true
          }
        ),
        /* @__PURE__ */ jsx11(Icon, { className: "h-3.5 w-3.5 shrink-0", style: { color: meta.accent }, "aria-hidden": true }),
        /* @__PURE__ */ jsx11("span", { children: label })
      ]
    }
  );
}

export {
  DsButton,
  DsBadge,
  DsTabs,
  DsSearchBar,
  DsPanel,
  BrandLogo,
  PremiumBrandLogo,
  HeroBadge,
  PhotorealHeroBadge,
  StickerLogo,
  TrustBadge
};
//# sourceMappingURL=chunk-YD7NM4U6.js.map