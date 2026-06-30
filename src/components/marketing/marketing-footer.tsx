/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EarnedStarLogo } from "@/components/brand/earnedstar-logo";
import { LEGAL_FOOTER_LINKS } from "@/lib/legal/config";

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
        <EarnedStarLogo variant="light" size={40} showBadge={false} />
        <p className="mt-4 max-w-md text-sm text-white/60">Verified reviews for e-commerce stores that take trust seriously.</p>
        <nav aria-label="Legal" className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {LEGAL_FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-white/55 underline-offset-2 hover:text-white hover:underline">
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="mt-8 text-xs text-white/40">© 2026 EarnedStar, Inc. · Los Angeles, CA</p>
      </div>
    </footer>
  );
}
