"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Is every review actually verified to a real purchase?",
    a: "Yes — every review is tied to a confirmed order number. When a customer submits, we cross-reference the purchase record in real time. If there's no verified purchase match, the review is flagged before it ever reaches your page.",
  },
  {
    q: "How does the AI fraud detection actually work?",
    a: "Every submission runs through behavioral analysis, device fingerprinting, and NLP scoring. Each review gets a fraud score from 0–100. Under 30 publishes automatically. 31–60 enters moderation. Over 60 gets flagged with specific reason codes.",
  },
  {
    q: "Which e-commerce platforms do you support?",
    a: "Shopify (one-click app), WooCommerce, Magento, BigCommerce, and any custom platform via REST API webhook. If you can fire a POST on order fulfillment, you're connected.",
  },
  {
    q: "How long does it take for Google stars to appear?",
    a: "Schema markup is injected automatically the moment a review is published. Most stores see stars in Google Search and Shopping within 48–96 hours.",
  },
  {
    q: "What happens to my reviews if I cancel?",
    a: "Your reviews belong to you — always. Export complete review data (JSON or CSV) at any time. On cancel, you get a 30-day window to download everything.",
  },
  {
    q: "How does the Agency white-label plan work?",
    a: "On Agency, you get a fully white-labeled instance under your own domain. Your clients see your brand — EarnedStar is invisible. Manage up to 25 client accounts from one dashboard.",
  },
  {
    q: "Is there a free plan?",
    a: "Every paid plan includes a 14-day free trial with no credit card required. Full access to your chosen tier during the trial.",
  },
  {
    q: "Can I collect photo and video reviews?",
    a: "Photo reviews are included on all plans. Video reviews are available on Growth and above. Customers upload directly in the submission form.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-bg-surface py-24">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-center text-3xl font-semibold text-text-primary">
          Questions? We&apos;ve got answers.
        </h2>
        <div className="mt-12 space-y-2">
          {faqs.map((faq, i) => (
            <div key={faq.q} className="card-surface overflow-hidden">
              <button
                type="button"
                className="flex w-full items-center justify-between p-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="font-medium text-text-primary">{faq.q}</span>
                <ChevronDown
                  size={20}
                  className={cn("shrink-0 text-text-muted transition", open === i && "rotate-180")}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <p className="border-t border-border px-4 py-4 text-sm text-text-secondary">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
