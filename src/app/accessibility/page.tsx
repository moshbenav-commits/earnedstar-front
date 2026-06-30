/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Forge Phase 20 — edit source: brand/earnedstar/wired/legal/accessibility-statement.mdx
 */
import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { LEGAL_CONFIG } from "@/lib/legal/config";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "EarnedStar commitment to digital accessibility and WCAG conformance.",
  robots: { index: true, follow: true },
};

export default function AccessibilityPage() {
  const { siteName, domain, contactEmail, effectiveDate } = LEGAL_CONFIG;

  return (
    <LegalPageShell bundleId="accessibility-statement">
      <h1>Accessibility Statement</h1>
      <p className="legal-effective">
        {siteName} · Last updated {effectiveDate}
      </p>
      <section>
        <h2>Commitment</h2>
        <p>
          {siteName} is committed to ensuring digital accessibility for people with disabilities. We continually improve
          the user experience for everyone and apply relevant accessibility standards.
        </p>
      </section>
      <section>
        <h2>Conformance status</h2>
        <p>
          We aim to conform to WCAG 2.1 Level AA where feasible. This site is partially conformant — some content or
          third-party embeds may not yet meet all criteria.
        </p>
      </section>
      <section>
        <h2>Measures</h2>
        <ul>
          <li>Semantic HTML and heading structure on marketing and legal pages.</li>
          <li>Sufficient color contrast on primary templates (navy on cream, gold accents).</li>
          <li>Keyboard navigation for core flows (navigation, forms, CTAs).</li>
          <li>Text alternatives for meaningful images on public marketing routes.</li>
        </ul>
      </section>
      <section>
        <h2>Feedback</h2>
        <p>
          If you encounter accessibility barriers on {domain}, contact us at{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a> with the page URL and a description of the issue. We
          respond within 5 business days.
        </p>
      </section>
      <section>
        <h2>Assessment approach</h2>
        <p>Self-assessment and pre-launch QA. Formal third-party audit recommended before regulated-industry launch.</p>
      </section>
    </LegalPageShell>
  );
}
