/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { EarnedStarLogo } from "@/components/brand/earnedstar-logo";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Manifesto", exact: true },
  { href: "/pricing", label: "Pricing", exact: false },
  { href: "/audit", label: "The Audit", exact: false },
  { href: "/yotpo-refugees", label: "Yotpo Refugees", exact: false },
  { href: "/reviews/expedia-parts", label: "Live Store", exact: false },
  { href: "/design-lab/brand", label: "Brand", exact: false },
];

export function MarketingNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition duration-200",
        isHome
          ? "border-white/10 bg-ink/55"
          : "border-ink/10 bg-cream/75",
        scrolled && "shadow-lg",
      )}
      data-surface={isHome ? "dark" : undefined}
    >
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 sm:px-10 lg:px-14">
        <Link href="/" className="rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
          <EarnedStarLogo variant={isHome ? "light" : "default"} size={36} showBadge={false} />
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[13px] font-semibold tracking-tight transition-colors",
                isActive(link.href, link.exact)
                  ? isHome ? "text-white" : "text-ink"
                  : isHome ? "text-white/65 hover:text-white" : "text-ink/60 hover:text-ink",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <span className={cn("smallcaps hidden text-[10px] lg:inline", isHome ? "text-white/40" : "text-ink/40")}>
            Vol. 01 · 2026
          </span>
          <Link
            href="/signup"
            className="rounded-full px-4 py-2 text-[13px] font-bold text-ink shadow-sm transition-shadow gold-foil hover:shadow-md"
          >
            Start free
          </Link>
        </div>

        <button
          type="button"
          className={cn("rounded-md p-2 md:hidden", isHome ? "text-white" : "text-ink")}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className={cn("border-t px-6 py-4 md:hidden", isHome ? "border-white/10 bg-ink" : "border-ink/10 bg-cream")}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn("block py-2 text-sm font-medium", isHome ? "text-white/90" : "text-ink/90")}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/signup"
            className="mt-4 block rounded-full py-3 text-center text-sm font-bold text-ink gold-foil"
            onClick={() => setMobileOpen(false)}
          >
            Start free
          </Link>
        </div>
      )}
    </header>
  );
}
