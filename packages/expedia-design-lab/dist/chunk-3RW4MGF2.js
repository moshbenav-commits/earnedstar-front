// src/nav.ts
var EXPEDIA_PARTS_DESIGN_LAB_NAV = [
  { href: "/design-lab", label: "Overview" },
  { href: "/design-lab/logos", label: "Logos" },
  { href: "/design-lab/logo-workshop", label: "Logo workshop" },
  { href: "/design-lab/materials", label: "Materials" },
  { href: "/design-lab/buttons", label: "Buttons" },
  { href: "/design-lab/badges", label: "Badges" },
  { href: "/design-lab/states", label: "States" },
  { href: "/design-lab/scenarios", label: "Scenarios" }
];

// src/DesignLabShell.tsx
import Link from "next/link";
import { typeH2OnDark, typeBodyOnDark, typeLabelOnDark } from "@expedia/design-system";
import { jsx, jsxs } from "react/jsx-runtime";
function DesignLabShell({
  title,
  description,
  children,
  nav = EXPEDIA_PARTS_DESIGN_LAB_NAV,
  kicker = "Code-native design system"
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "min-h-screen ds-surface-dark",
      "data-surface": "dark",
      style: { background: "var(--brand-expedia-black)" },
      children: [
        /* @__PURE__ */ jsxs("header", { className: "border-b border-[var(--border-dark)] bg-[var(--brand-expedia-navy)] px-6 py-5", children: [
          /* @__PURE__ */ jsx("p", { className: typeLabelOnDark, children: kicker }),
          /* @__PURE__ */ jsx("h1", { className: `${typeH2OnDark} mt-1 text-3xl`, children: title }),
          /* @__PURE__ */ jsx("p", { className: `${typeBodyOnDark} mt-2 max-w-3xl text-gray-300`, children: description }),
          nav.length > 0 ? /* @__PURE__ */ jsx("nav", { className: "mt-4 flex flex-wrap gap-2", "aria-label": "Design lab sections", children: nav.map((item) => /* @__PURE__ */ jsx(
            Link,
            {
              href: item.href,
              className: "rounded-full border border-[var(--border-dark)] px-3 py-1.5 text-xs font-semibold text-gray-300 transition hover:border-white/20 hover:text-white",
              children: item.label
            },
            item.href
          )) }) : null
        ] }),
        /* @__PURE__ */ jsx("main", { className: "mx-auto max-w-6xl px-6 py-8", children })
      ]
    }
  );
}
function DesignLabSection({
  title,
  description,
  children
}) {
  return /* @__PURE__ */ jsxs("section", { className: "mb-10", children: [
    /* @__PURE__ */ jsx("h2", { className: `${typeH2OnDark} mb-1 text-xl`, children: title }),
    description ? /* @__PURE__ */ jsx("p", { className: `${typeBodyOnDark} mb-4 text-sm text-gray-400`, children: description }) : null,
    children
  ] });
}
function DesignLabGrid({ children }) {
  return /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children });
}
function DesignLabCard({
  label,
  children,
  surface = "navy"
}) {
  const surfaceClass = surface === "light" ? "ds-surface-light" : surface === "checker" ? "ds-preview-checker" : surface === "hero" ? "badge-premium-plate" : "ds-surface-navy";
  return /* @__PURE__ */ jsxs("article", { className: "overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border-dark)]", children: [
    /* @__PURE__ */ jsx("div", { className: "border-b border-[var(--border-dark)] bg-white/5 px-4 py-2 text-xs font-medium text-gray-400", children: label }),
    /* @__PURE__ */ jsx("div", { className: `flex min-h-[140px] items-center justify-center p-6 ${surfaceClass}`, children })
  ] });
}

export {
  EXPEDIA_PARTS_DESIGN_LAB_NAV,
  DesignLabShell,
  DesignLabSection,
  DesignLabGrid,
  DesignLabCard
};
//# sourceMappingURL=chunk-3RW4MGF2.js.map