/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EarnedStarLogo } from "@/components/brand/earnedstar-logo";
import { LEGAL_FOOTER_LINKS } from "@/lib/legal/config";
import { CreytixPartnerLockup } from "@creytix/partner-kit";

/**
 * Audience-grouped footer nav — pulls from the same real routes the primary
 * nav (`marketing-nav.tsx` `navLinks`) and legal SSOT (`LEGAL_FOOTER_LINKS`)
 * already point to. No invented destinations.
 */
export const FOOTER_COLUMNS = [
  {
    heading: "Product",
    links: [
      { href: "/pricing", label: "Pricing" },
      { href: "/features", label: "Features" },
      { href: "/audit", label: "The Audit" },
      { href: "/reviews/expedia-parts", label: "Live Store" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/yotpo-refugees", label: "Yotpo Refugees" },
      { href: "/help", label: "Help Guides" },
      { href: "/support", label: "Support" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/partnered-with-creytix", label: "Partnered with Creytix" },
      { href: "/design-lab/brand", label: "Brand" },
      { href: "/signup", label: "Start free" },
    ],
  },
  {
    heading: "Legal",
    links: LEGAL_FOOTER_LINKS.map((link) => ({ href: link.href, label: link.label })),
  },
] as const;

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-navy text-white" data-scroll-theme="dark">
      <section className="py-20 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-display text-3xl italic text-gold">Stop guessing if customers trust you.</h2>
          <p className="mt-4 text-white/70">Show them proof. 1,200+ stores collect verified reviews with EarnedStar.</p>
          <Button variant="gold" size="lg" href="/signup" className="mt-8">Start Your Free Trial →</Button>
        </div>
      </section>
      <div className="mx-auto max-w-7xl border-t border-white/10 px-4 py-12">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          <div>
            <EarnedStarLogo variant="light" size={40} showBadge={false} />
            <p className="mt-4 max-w-xs text-sm text-white/60">
              Verified reviews for e-commerce stores that take trust seriously.
            </p>
          </div>
          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <p className="smallcaps text-[11px] font-semibold text-white/60">{column.heading}</p>
              <ul className="mt-4 flex flex-col gap-2 text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/55 underline-offset-2 hover:text-white hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-10 border-t border-white/10 pt-8">
          <CreytixPartnerLockup partnerName="EarnedStar" partnerInitial="E" size="sm" surface="dark" />
        </div>
        <p className="mt-4 text-xs text-white/60">© 2026 EarnedStar, Inc. · Los Angeles, CA</p>
      </div>
    </footer>
  );
}
