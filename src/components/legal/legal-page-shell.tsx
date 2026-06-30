import type { ReactNode } from "react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { LegalReviewBanner } from "@/components/legal/legal-review-banner";

type LegalPageShellProps = {
  bundleId: string;
  children: ReactNode;
};

export function LegalPageShell({ bundleId, children }: LegalPageShellProps) {
  return (
    <div className="min-h-screen bg-cream text-ink antialiased">
      <MarketingNav />
      <LegalReviewBanner />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <article className="legal-page" data-legal={bundleId}>
          {children}
        </article>
      </main>
      <MarketingFooter />
    </div>
  );
}
