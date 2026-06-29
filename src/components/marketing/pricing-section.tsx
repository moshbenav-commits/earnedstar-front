/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { EarnedStarMark } from "@/components/brand/earnedstar-mark";
import { PLAN_LIMITS } from "@/lib/plans";
import { cn } from "@/lib/utils";
import { paymentsEnabled } from "@/lib/payments-enabled";

const plans = [
  {
    id: "starter" as const,
    tagline: "Perfect for stores just getting started",
    features: [
      "200 invitations/month",
      "Verified by Purchase badge",
      "Photo reviews",
      "Google rich snippets",
      "2 widgets",
      "Basic AI fraud scoring",
      "1 user seat",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    id: "growth" as const,
    tagline: "The complete review stack for growing stores",
    badge: "Most Popular",
    features: [
      "2,000 invitations + SMS/month",
      "Video reviews",
      "AI review summaries",
      "Google Seller Ratings",
      "6 widget types",
      "3 user seats",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    id: "pro" as const,
    tagline: "For high-volume stores",
    badge: "Best Value",
    features: [
      "15,000 invitations/month",
      "AI Q&A SEO module",
      "Multi-platform syndication",
      "Full analytics + API",
      "10 user seats",
      "99.9% SLA",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    id: "agency" as const,
    tagline: "Run reviews for all your clients",
    badge: "White-Label",
    features: [
      "Unlimited invitations",
      "Full white-label branding",
      "25 sub-accounts",
      "Dedicated CSM",
      "Priority Slack support",
    ],
    cta: "Talk to Sales",
    popular: false,
  },
];

export function PricingSection({ showHeader = true }: { showHeader?: boolean }) {
  return (
    <section id="pricing" className="relative overflow-hidden py-24" data-scroll-theme="light">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-surface-offset via-bg to-surface-offset" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-full max-w-4xl -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/40 to-transparent" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4">
        {showHeader ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-light">Pricing</p>
            <h2 className="mt-3 text-3xl font-bold text-navy sm:text-4xl">
              Simple plans.{" "}
              <span className="font-display italic text-gold">Earned</span> trust at every tier.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-text-muted">
              {paymentsEnabled()
                ? "Billed via Authorize.net. 14-day free trial. Cancel anytime."
                : "Pricing shown for planning — paid billing is not active yet. Contact us for early access."}
            </p>
          </motion.div>
        ) : (
          <p className="text-center text-sm text-text-muted">
            {paymentsEnabled()
              ? "Billed via Authorize.net. 14-day free trial. Cancel anytime."
              : "Pricing for reference — subscription checkout is not live yet."}
          </p>
        )}

        <div className={cn("grid gap-6 md:grid-cols-2 xl:grid-cols-4 xl:items-stretch", showHeader ? "mt-16" : "mt-8")}>
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-[0_4px_12px_rgba(15,32,68,0.08),0_16px_40px_rgba(15,32,68,0.06)]",
                plan.popular
                  ? "border-gold/40 shadow-[0_0_0_1px_rgba(245,158,11,0.2),0_20px_48px_rgba(245,158,11,0.12)] xl:-translate-y-2"
                  : "border-border",
              )}
            >
              <div
                className={cn(
                  "h-1",
                  plan.popular
                    ? "bg-gradient-to-r from-navy via-gold to-navy"
                    : "bg-gradient-to-r from-navy/20 via-border to-navy/20",
                )}
              />

              <div className="flex flex-1 flex-col p-6 pt-7">
                {plan.badge ? (
                  <span
                    className={cn(
                      "absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-xs font-semibold tracking-wide",
                      plan.popular
                        ? "bg-gold text-white shadow-md"
                        : "border border-gold/30 bg-gold-pale text-gold-dark",
                    )}
                  >
                    {plan.badge}
                  </span>
                ) : null}

                <div className="flex items-center gap-2">
                  {plan.popular ? (
                    <EarnedStarMark size={24} centerStyle="none" />
                  ) : null}
                  <h3 className="text-lg font-bold capitalize text-navy">{plan.id}</h3>
                </div>

                <p className="mt-2 text-3xl font-extrabold tracking-tight text-navy">
                  ${PLAN_LIMITS[plan.id].price}
                  <span className="text-sm font-normal text-text-faint">/mo</span>
                </p>
                <p className="mt-2 text-sm text-text-muted">{plan.tagline}</p>

                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-sm text-text-muted">
                      <span className="mt-0.5 text-gold" aria-hidden>
                        ★
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? "gold" : "primary"}
                  className="mt-8 w-full"
                  href={plan.id === "agency" ? "/contact" : paymentsEnabled() ? "/signup" : "/contact"}
                >
                  {paymentsEnabled() ? plan.cta : "Contact us"}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center text-xs text-text-faint"
        >
          Every plan includes the EarnedStar badge · Verified by Purchase on every review
        </motion.p>
      </div>
    </section>
  );
}
