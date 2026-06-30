/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Forge Phase 20 — edit source: brand/earnedstar/wired/legal/privacy-policy.mdx
 */
import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { LEGAL_CONFIG } from "@/lib/legal/config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How EarnedStar collects, uses, and protects merchant and reviewer information.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  const { siteName, domain, contactEmail, effectiveDate } = LEGAL_CONFIG;

  return (
    <LegalPageShell bundleId="privacy-policy">
      <h1>Privacy Policy</h1>
      <p className="legal-effective">
        {siteName} · Effective {effectiveDate}
      </p>
      <section>
        <h2>Overview</h2>
        <p>
          This privacy policy describes how {siteName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects, uses, and
          protects information when you visit {domain} or use our verified review platform.
        </p>
      </section>
      <section>
        <h2>Information we collect</h2>
        <ul>
          <li>Contact information you submit through forms (name, email, phone).</li>
          <li>Merchant account data, store integrations, and review invitation metadata.</li>
          <li>Review content submitted by verified purchasers (ratings, text, optional media).</li>
          <li>Usage data such as pages viewed, device type, and approximate location (via analytics when enabled).</li>
          <li>Cookies required for site function and, with consent, analytics.</li>
        </ul>
      </section>
      <section>
        <h2>How we use information</h2>
        <p>
          We use collected information to operate the review platform, deliver merchant services, prevent fraud,
          improve the site, and comply with legal obligations. We do not sell personal information.
        </p>
      </section>
      <section>
        <h2>Your choices</h2>
        <p>
          You may request access, correction, or deletion of personal data by contacting{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </section>
      <section>
        <h2>Updates</h2>
        <p>We may update this policy by posting a revised version on this page with a new effective date.</p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          Questions: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </p>
      </section>
    </LegalPageShell>
  );
}
