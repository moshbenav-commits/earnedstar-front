/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import Link from "next/link";
import { EarnedStarLogo } from "@/components/brand/earnedstar-logo";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Support — EarnedStar",
  description: "Get help with review invitations, merchant setup, and EarnedStar billing.",
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-surface px-4 py-4">
        <EarnedStarLogo size={28} />
      </header>
      <main className="mx-auto max-w-lg px-4 py-16">
        <h1 className="text-3xl font-bold text-navy">Support</h1>
        <p className="mt-3 text-sm text-text-muted">
          Need help with a review link, merchant account, or billing? We respond within one business day.
        </p>

        <section className="card-surface mt-8 space-y-4 p-6">
          <div>
            <h2 className="text-sm font-semibold text-navy">Merchants</h2>
            <p className="mt-1 text-sm text-text-muted">
              Dashboard, invitations, widgets, and plan questions — email{" "}
              <a href="mailto:support@earnedstar.com" className="font-medium text-navy-light hover:text-gold">
                support@earnedstar.com
              </a>
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-navy">Reviewers</h2>
            <p className="mt-1 text-sm text-text-muted">
              Expired or broken invitation links are issued by the store you purchased from. Contact that store first;
              they can resend from their EarnedStar dashboard.
            </p>
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/login">Merchant sign in</Button>
          <Button variant="ghost" href="/">
            Go home
          </Button>
        </div>

        <Link href="/pricing" className="mt-6 inline-block text-sm text-navy-light hover:text-gold">
          View pricing →
        </Link>
      </main>
    </div>
  );
}
