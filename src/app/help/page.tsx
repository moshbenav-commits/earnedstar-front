/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import Link from "next/link";
import type { Metadata } from "next";

import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { getAllGuides } from "@/lib/guides/loader";

export const metadata: Metadata = {
  title: "Help Guides — EarnedStar",
  description: "Step-by-step guides for common EarnedStar tasks — account, billing, and setup.",
};

export default function HelpIndexPage() {
  const guides = getAllGuides();
  const previewing = guides.some((guide) => guide.isDraftPreview);

  return (
    <div className="min-h-screen bg-cream text-ink antialiased">
      <MarketingNav />
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h1 className="text-4xl font-bold text-navy">Help Guides</h1>
        <p className="mt-3 max-w-2xl text-text-muted">
          Step-by-step instructions for common EarnedStar tasks.
        </p>

        {previewing ? (
          <p className="mt-8 rounded-lg border border-gold/40 bg-gold-pale px-4 py-3 text-sm text-gold-dark">
            <strong>Draft preview (development only).</strong> These are unapproved drafts read
            straight from the content library. Nothing here is published.
          </p>
        ) : null}

        {guides.length === 0 ? (
          <p className="mt-10 text-sm text-text-muted">No published guides yet.</p>
        ) : (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {guides.map((guide) => (
              <li key={guide.slug} className="card-surface p-6">
                <div className="mb-3 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
                  <span>{guide.steps.length} steps</span>
                  {guide.isDraftPreview ? (
                    <span className="rounded bg-gold-pale px-2 py-0.5 text-gold-dark">Draft</span>
                  ) : null}
                </div>

                <h2 className="text-xl font-semibold text-navy">
                  <Link href={`/help/${guide.slug}`} className="hover:underline">
                    {guide.title}
                  </Link>
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-text-muted">{guide.description}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
      <MarketingFooter />
    </div>
  );
}
