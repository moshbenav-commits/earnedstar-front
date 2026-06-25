/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { AuditPageClient } from "@/components/marketing/audit-page-client";

export const metadata: Metadata = {
  title: "Review Audit — Free Fake Review Scanner",
  description:
    "Paste any Trustpilot or Yotpo profile URL. EarnedStar estimates fake review patterns with AI forensic analysis — free, shareable report.",
};

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-cream text-ink antialiased">
      <MarketingNav />
      <main>
        <AuditPageClient />
      </main>
      <MarketingFooter />
    </div>
  );
}
