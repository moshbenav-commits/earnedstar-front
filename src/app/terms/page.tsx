/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Forge Phase 20 — edit source: brand/earnedstar/wired/legal/terms-of-service.mdx
 */
import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { LEGAL_CONFIG } from "@/lib/legal/config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of the EarnedStar verified review platform.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  const { siteName, domain, contactEmail, effectiveDate } = LEGAL_CONFIG;

  return (
    <LegalPageShell bundleId="terms-of-service">
      <h1>Terms of Service</h1>
      <p className="legal-effective">
        {siteName} · Effective {effectiveDate}
      </p>
      <section>
        <h2>Agreement</h2>
        <p>
          By accessing {domain} or using services provided by {siteName}, you agree to these terms.
        </p>
      </section>
      <section>
        <h2>Services</h2>
        <p>
          We provide verified review collection, merchant dashboards, widgets, and related SaaS features described on
          our site. Features, pricing, and availability may change with notice posted on the site or by email where
          applicable.
        </p>
      </section>
      <section>
        <h2>Acceptable use</h2>
        <p>
          You agree not to misuse the site, attempt unauthorized access, submit fraudulent reviews, or interfere with
          other users or merchants.
        </p>
      </section>
      <section>
        <h2>Disclaimers</h2>
        <p>
          Services are provided &ldquo;as is&rdquo; to the extent permitted by law. We disclaim warranties not required
          by applicable law.
        </p>
      </section>
      <section>
        <h2>Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, {siteName} is not liable for indirect or consequential damages arising
          from use of the site or platform.
        </p>
      </section>
      <section>
        <h2>Changes</h2>
        <p>We may modify these terms by posting an updated version. Continued use after changes constitutes acceptance.</p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </p>
      </section>
    </LegalPageShell>
  );
}
