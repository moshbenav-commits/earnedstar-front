"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { EarnedStarLogo } from "@/components/brand/earnedstar-logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#faq", label: "FAQ" },
];

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0b1d58]/95 shadow-sm backdrop-blur-md transition duration-200",
        scrolled && "shadow-lg",
      )}
      data-surface="dark"
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
          <EarnedStarLogo variant="light" size={36} showBadge={false} />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/90 transition hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle compact className="hidden lg:inline-flex" />
          <Button
            variant="ghost"
            size="sm"
            href="/login"
            className="border-white/25 bg-white/5 text-white hover:border-white/40 hover:bg-white/10 hover:text-white"
          >
            Sign In
          </Button>
          <Button variant="gold" size="sm" href="/signup">
            Start Free Trial
          </Button>
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0b1d58] px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-2 text-sm font-medium text-white/90"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="mt-4 flex flex-col gap-2">
            <Button
              variant="ghost"
              href="/login"
              className="w-full border-white/25 bg-white/5 text-white hover:bg-white/10"
            >
              Sign In
            </Button>
            <Button variant="gold" href="/signup" className="w-full">
              Start Free Trial
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
