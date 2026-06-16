import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EarnedStarLogo } from "@/components/brand/earnedstar-logo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-navy text-white">
      <section className="py-20 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-display text-3xl italic text-gold">Stop guessing if customers trust you.</h2>
          <p className="mt-4 text-white/70">Show them proof. 1,200+ stores collect verified reviews with EarnedStar.</p>
          <Button variant="gold" size="lg" href="/signup" className="mt-8">Start Your Free Trial →</Button>
        </div>
      </section>
      <div className="mx-auto max-w-7xl border-t border-white/10 px-4 py-12">
        <EarnedStarLogo variant="light" />
        <p className="mt-4 max-w-md text-sm text-white/60">Verified reviews for e-commerce stores that take trust seriously.</p>
        <p className="mt-8 text-xs text-white/40">© 2026 EarnedStar, Inc. · A product by ExpediaParts · Los Angeles, CA</p>
      </div>
    </footer>
  );
}
