/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import Image from "next/image";
import { MESHY } from "@/lib/marketing-editorial-data";
import { Button } from "@/components/ui/button";

type DashboardEmptyStateProps = {
  merchantName?: string;
};

/** ES011 — first-review empty state for merchant dashboard */
export function DashboardEmptyState({ merchantName }: DashboardEmptyStateProps) {
  return (
    <section className="card-surface overflow-hidden">
      <div className="grid grid-cols-1 items-center gap-8 p-6 md:grid-cols-2 md:p-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-light">Getting started</p>
          <h2 className="mt-3 text-2xl font-bold text-navy sm:text-3xl">
            Your first verified review is waiting to be earned
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            {merchantName
              ? `Connect ${merchantName}'s store and send a post-purchase invitation. Every star on EarnedStar ties to a confirmed order — shoppers will know it was real.`
              : "Connect your store and send a post-purchase invitation. Every star on EarnedStar ties to a confirmed order — shoppers will know it was real."}
          </p>
          <ul className="mt-5 space-y-2 text-sm text-text-muted">
            <li className="flex gap-2">
              <span className="text-gold" aria-hidden>
                ★
              </span>
              Invite buyers after delivery — email, SMS, or QR
            </li>
            <li className="flex gap-2">
              <span className="text-gold" aria-hidden>
                ★
              </span>
              AI fraud scoring runs before anything publishes
            </li>
            <li className="flex gap-2">
              <span className="text-gold" aria-hidden>
                ★
              </span>
              Google Seller Ratings schema activates automatically
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="gold" href="/dashboard/invitations">
              Send first invitation
            </Button>
            <Button variant="ghost" href="/dashboard/integrations">
              Connect store
            </Button>
          </div>
        </div>

        <div className="flex justify-center">
          <Image
            src={MESHY.dashboardEmptyState}
            alt="Origami lucky star on pedestal — waiting for your first verified review"
            width={512}
            height={341}
            className="max-h-64 w-auto rounded-xl object-contain sm:max-h-72"
          />
        </div>
      </div>
    </section>
  );
}
