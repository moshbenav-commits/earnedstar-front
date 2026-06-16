"use client";

import { useEffect } from "react";
import { useTheme } from "@/components/theme/theme-provider";
import type { Theme } from "@/lib/theme";

/** Syncs site theme to whichever marketing section is centered in the viewport. */
export function ScrollThemeSync() {
  const { setTheme } = useTheme();

  useEffect(() => {
    let frame = 0;

    const resolveTheme = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-theme]"));
      if (!sections.length) return;

      const mid = window.innerHeight * 0.42;
      let match: HTMLElement | undefined;
      let bestDistance = Number.POSITIVE_INFINITY;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - mid);

        if (rect.bottom > 0 && rect.top < window.innerHeight && distance < bestDistance) {
          bestDistance = distance;
          match = section;
        }
      }

      if (!match) return;
      const next = match.dataset.scrollTheme as Theme | undefined;
      if (next === "light" || next === "dark") {
        setTheme(next, { source: "scroll" });
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(resolveTheme);
    };

    resolveTheme();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [setTheme]);

  return null;
}
