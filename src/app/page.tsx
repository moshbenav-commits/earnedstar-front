/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { HeroSection } from "@/components/marketing/hero-section";
import { TrustCounterStrip } from "@/components/marketing/trust-counter-strip";
import { FoundersQuoteSection } from "@/components/marketing/founders-quote-section";
import { ManifestoPromisesSection } from "@/components/marketing/manifesto-promises-section";
import { BrandGallerySection } from "@/components/marketing/brand-gallery-section";
import { LiveReviewSection } from "@/components/marketing/live-review-section";
import { EarnedStarReviewsRail } from "@/components/marketing/earnedstar-reviews-rail";
import { FeaturesSection } from "@/components/marketing/features-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { ComparisonTableSection } from "@/components/marketing/comparison-table-section";
import { YotpoExodusSection } from "@/components/marketing/yotpo-exodus-section";
import { PricingSection } from "@/components/marketing/pricing-section";
import { AuditTeaserSection } from "@/components/marketing/audit-teaser-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { FeaturedArticles } from "@/components/marketing/featured-articles-section";
import { ClosingImprintSection } from "@/components/marketing/closing-imprint-section";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { ExitIntentPanel } from "@/components/marketing/exit-intent-panel";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream text-ink antialiased">
      <ExitIntentPanel />
      <MarketingNav />
      <main>
        <HeroSection />
        <TrustCounterStrip />
        <FoundersQuoteSection />
        <ManifestoPromisesSection />
        <BrandGallerySection />
        <LiveReviewSection />
        <EarnedStarReviewsRail />
        <FeaturesSection />
        <HowItWorksSection />
        <ComparisonTableSection />
        <YotpoExodusSection />
        <PricingSection />
        <AuditTeaserSection />
        <FaqSection />
        <FeaturedArticles />
        <ClosingImprintSection />
      </main>
      <MarketingFooter />
    </div>
  );
}
