"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { EarnedStarLogo } from "@/components/brand/earnedstar-logo";
import { Button } from "@/components/ui/button";
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
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition duration-200",
        scrolled ? "border-b border-border bg-surface/90 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <EarnedStarLogo />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-text-muted hover:text-navy">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" href="/login">
            Sign In
          </Button>
          <Button size="sm" href="/signup">
            Start Free Trial
          </Button>
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-text-muted md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-b border-border bg-surface px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="block py-2 text-sm text-text-muted" onClick={() => setMobileOpen(false)}>
              {link.label}
            </a>
          ))}
          <div className="mt-4 flex flex-col gap-2">
            <Button variant="ghost" href="/login" className="w-full">Sign In</Button>
            <Button href="/signup" className="w-full">Start Free Trial</Button>
          </div>
        </div>
      )}
    </header>
  );
}
