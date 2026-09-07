/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "es-exit-intent-seen";
const COOLDOWN_MS = 21 * 24 * 60 * 60 * 1000;
const MIN_MS = 45_000;

const BLOCKED = ["/signup", "/login", "/privacy", "/terms", "/contact"];

function recentlySeen(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const seen = Number(raw);
    return Number.isFinite(seen) && Date.now() - seen < COOLDOWN_MS;
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

function isDesktopPointer(): boolean {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** Desktop pointer-exit signup CTA — revamp stamp floor for exit intent. */
export function ExitIntentPanel() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const armed = useRef(false);
  const shown = useRef(false);

  useEffect(() => {
    if (BLOCKED.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
      return undefined;
    }
    if (typeof window === "undefined" || recentlySeen() || !isDesktopPointer()) {
      return undefined;
    }

    const arm = () => {
      armed.current = true;
    };
    const timer = window.setTimeout(arm, MIN_MS);

    const onLeave = (event: MouseEvent) => {
      if (shown.current || !armed.current) return;
      if (event.clientY > 8) return;
      shown.current = true;
      markSeen();
      setOpen(true);
    };
    document.addEventListener("mouseout", onLeave);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseout", onLeave);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-navy/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-navy/10 bg-cream p-6 shadow-xl"
        data-surface="light"
      >
        <h2 id="exit-intent-title" className="font-heading text-xl font-semibold text-navy">
          Start collecting verified reviews?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          14-day free trial — order-verified stars, native email and SMS, and flat pricing. No
          annual lock-in.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/signup"
            data-cx-click="merchant-get-started"
            className="inline-flex min-h-11 items-center rounded-full gold-foil px-5 py-2 text-sm font-bold text-ink no-underline"
            onClick={() => setOpen(false)}
          >
            Start free trial
          </Link>
          <Link
            href="/pricing"
            className="inline-flex min-h-11 items-center text-sm font-semibold text-navy no-underline hover:underline"
            onClick={() => setOpen(false)}
          >
            See pricing
          </Link>
          <button
            type="button"
            className="ml-auto min-h-11 text-sm text-ink/50"
            onClick={() => setOpen(false)}
          >
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}
