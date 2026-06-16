"use client";

import { motion } from "framer-motion";
import { Shield, BadgeCheck, Search, Mail, Palette, BarChart3 } from "lucide-react";
import { EarnedStarBadge } from "@/components/ui/earnedstar-badge";

const features = [
  {
    large: true,
    title: "AI Fraud Detection",
    body: "Every submission runs behavioral scoring, device fingerprinting, and NLP analysis in under 200ms. Fake reviews never reach your product page.",
    icon: Shield,
  },
  {
    large: true,
    title: "The Origami EarnedStar Badge",
    body: "Four embed variants — Pill, Card, Stamp, and Dark — with your logo in the center medallion. Merchants display them with pride.",
    icon: BadgeCheck,
    showMark: true,
  },
  {
    title: "Verified by Purchase",
    body: "Every review ties to a confirmed order. No guest reviews. No open submissions.",
    icon: Shield,
  },
  {
    title: "Google Seller Ratings",
    body: "JSON-LD schema auto-injects. Stars appear in Search and Shopping within 72 hours.",
    icon: Search,
  },
  {
    title: "Multi-Channel Invitations",
    body: "Email, SMS, or QR code. Smart timing sends 7 days post-delivery.",
    icon: Mail,
  },
  {
    title: "White-Label for Agencies",
    body: "Custom domain, your logo in the star center, 25 sub-accounts — one Agency plan.",
    icon: Palette,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="section-warm py-24">
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-navy-light">Why EarnedStar</p>
        <h2 className="mt-3 text-center text-3xl font-bold text-navy sm:text-4xl">
          Everything generic review tools get wrong
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-text-muted">
          Open platforms let anyone post anything. EarnedStar only publishes what was earned.
        </p>

        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`card-surface gold-seam p-6 ${feature.large ? "lg:col-span-3" : "lg:col-span-2"}`}
            >
              {feature.showMark ? (
                <div className="mb-4 flex flex-wrap gap-2">
                  <EarnedStarBadge variant="pill" className="scale-90 origin-left" />
                  <EarnedStarBadge variant="dark" className="scale-90 origin-left" />
                </div>
              ) : (
                <feature.icon size={24} className="mb-4 text-gold" aria-hidden />
              )}
              <h3 className="text-lg font-bold text-navy">{feature.title}</h3>
              <p className="mt-2 text-sm text-text-muted">{feature.body}</p>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-surface gold-seam p-6 lg:col-span-2"
          >
            <BarChart3 size={24} className="mb-4 text-gold" aria-hidden />
            <h3 className="text-lg font-bold text-navy">Full Analytics</h3>
            <p className="mt-2 text-sm text-text-muted">
              Rating distribution, sentiment trends, invitation response rates, and conversion correlation.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
