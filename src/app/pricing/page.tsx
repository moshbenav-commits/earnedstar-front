/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { PricingPageHero } from "@/components/marketing/pricing-page-hero";
import { PricingSection } from "@/components/marketing/pricing-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { IncludedCreytixToolsDisclosure } from "@creytix/partner-kit";

export const metadata: Metadata = {
  title: "Pricing — EarnedStar Review Platform",
  description:
    "Flat pricing for verified reviews, native email and SMS, and Google Seller Ratings. 14-day free trial — no annual lock-in.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-cream text-ink antialiased">
      <MarketingNav />
      <main>
        <PricingPageHero />
        <PricingSection showHeader={false} />
        <div className="mx-auto max-w-2xl px-4">
          <IncludedCreytixToolsDisclosure
            siteId="earnedstar"
            tools={[
              "Creytix AI-SEO content engine",
              "Creytix FTC-compliance audit log",
              "Creytix review-cadence engine",
            ]}
          />
        </div>
        <FaqSection />
      </main>
      <MarketingFooter />
    </div>
  );
}
