"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { applyTheme, getStoredTheme, type Theme, THEME_STORAGE_KEY } from "@/lib/theme";

type ThemeSource = "init" | "manual" | "scroll";

type SetThemeOptions = {
  source?: ThemeSource;
  persist?: boolean;
};

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme, options?: SetThemeOptions) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readInitialTheme(): Theme {
  if (typeof document === "undefined") return "light";
  if (document.documentElement.classList.contains("dark")) return "dark";
  return getStoredTheme() ?? "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const scrollEnabledRef = useRef(true);

  useEffect(() => {
    const initial = readInitialTheme();
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  const setTheme = useCallback((next: Theme, options?: SetThemeOptions) => {
    const source = options?.source ?? "manual";

    if (source === "scroll" && !scrollEnabledRef.current) return;

    setThemeState(next);
    applyTheme(next);

    if (options?.persist) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const toggleTheme = useCallback(() => {
    scrollEnabledRef.current = false;
    setThemeState((current) => {
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
    window.setTimeout(() => {
      scrollEnabledRef.current = true;
    }, 1200);
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
