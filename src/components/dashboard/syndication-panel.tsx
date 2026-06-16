"use client";

import { Button } from "@/components/ui/button";
import { getApiBase } from "@/lib/api";

export function SyndicationPanel({
  merchantSlug,
  apiKey,
  canSyndicate,
}: {
  merchantSlug: string;
  apiKey?: string;
  canSyndicate: boolean;
}) {
  const apiBase = getApiBase();

  if (!canSyndicate) {
    return (
      <section className="card-surface max-w-lg p-8 text-center">
        <h2 className="text-xl font-bold text-navy">Syndication is a Pro feature</h2>
        <p className="mt-3 text-sm text-text-muted">
          Export reviews to Google Merchant Center, Trustpilot, and CSV for your marketing stack.
        </p>
        <Button className="mt-6" href="/dashboard/settings">Upgrade to Pro</Button>
      </section>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="card-surface gold-seam p-6">
        <h2 className="text-lg font-bold text-navy">Google Seller Ratings feed</h2>
        <p className="mt-2 text-sm text-text-muted">
          Submit this XML URL in Google Merchant Center → Products → Product reviews.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-bg-elevated p-3 text-xs">
          {`${apiBase}/earnedstar/feeds/google-reviews/${merchantSlug}.xml`}
        </pre>
        <Button
          variant="ghost"
          size="sm"
          className="mt-3"
          onClick={() =>
            void navigator.clipboard.writeText(
              `${apiBase}/earnedstar/feeds/google-reviews/${merchantSlug}.xml`,
            )
          }
        >
          Copy feed URL
        </Button>
      </section>

      <section className="card-surface p-6">
        <h2 className="text-lg font-bold text-navy">Trustpilot export</h2>
        <p className="mt-2 text-sm text-text-muted">JSON snapshot for manual import or partner sync.</p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-bg-elevated p-3 text-xs">
          {`${apiBase}/earnedstar/feeds/trustpilot/${merchantSlug}.json`}
        </pre>
        <a
          href={`${apiBase}/earnedstar/feeds/trustpilot/${merchantSlug}.json`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex text-sm font-semibold text-navy-light hover:text-gold"
        >
          Open JSON →
        </a>
      </section>

      <section className="card-surface p-6 lg:col-span-2">
        <h2 className="text-lg font-bold text-navy">CSV export</h2>
        <p className="mt-2 text-sm text-text-muted">Download all reviews for {merchantSlug}.</p>
        <Button className="mt-4" href={`/api/earnedstar/dashboard/export/reviews?slug=${merchantSlug}`}>
          Download reviews.csv
        </Button>
        {apiKey ? (
          <p className="mt-4 text-xs text-text-faint">API key for embeds: {apiKey}</p>
        ) : null}
      </section>
    </div>
  );
}
