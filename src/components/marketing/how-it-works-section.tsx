/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { HOW_IT_WORKS_STEPS } from "@/content/earnedstar-trust-copy";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-stone border-y border-border py-24" data-scroll-theme="light">
      <div className="mx-auto max-w-3xl px-4">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-navy-light">
          How reviews earn their star
        </p>
        <h2 className="mt-3 text-center text-3xl font-bold text-navy">
          No random reviews. No fake scores. Just buyers who actually ordered.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-text-muted">
          Every review passes order verification, fraud screening, and your approval before it
          publishes — or it never touches your rating.
        </p>
        <div className="relative mt-16 space-y-12">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <div key={step.number} className="card-surface relative p-6 pl-16">
              <div className="absolute left-6 top-6 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gold bg-gold-pale text-xs font-bold text-gold-dark">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-navy">{step.title}</h3>
              <p className="mt-2 text-sm text-text-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
