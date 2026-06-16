import { MarketingNav } from "@/components/marketing/marketing-nav";
import { HeroSection } from "@/components/marketing/hero-section";
import { TrustBar } from "@/components/marketing/trust-bar";
import { StatsSection } from "@/components/marketing/stats-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { PricingSection } from "@/components/marketing/pricing-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function HomePage() {
  return (
    <>
      <MarketingNav />
      <main>
        <HeroSection />
        <TrustBar />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
      </main>
      <MarketingFooter />
    </>
  );
}
