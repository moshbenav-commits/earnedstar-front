import { Button } from "@/components/ui/button";
import { PLAN_LIMITS } from "@/lib/plans";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "starter" as const,
    tagline: "Perfect for stores just getting started",
    features: ["200 invitations/month", "Verified by Purchase badge", "Photo reviews", "Google rich snippets", "2 widgets", "Basic AI fraud scoring", "1 user seat"],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    id: "growth" as const,
    tagline: "The complete review stack for growing stores",
    badge: "Most Popular",
    features: ["2,000 invitations + SMS/month", "Video reviews", "AI review summaries", "Google Seller Ratings", "6 widget types", "3 user seats"],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    id: "pro" as const,
    tagline: "For high-volume stores",
    badge: "Best Value",
    features: ["15,000 invitations/month", "AI Q&A SEO module", "Multi-platform syndication", "Full analytics + API", "10 user seats", "99.9% SLA"],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    id: "agency" as const,
    tagline: "Run reviews for all your clients",
    badge: "White-Label",
    features: ["Unlimited invitations", "Full white-label branding", "25 sub-accounts", "Dedicated CSM", "Priority Slack support"],
    cta: "Talk to Sales",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-navy-light">Pricing</p>
        <h2 className="mt-3 text-center text-3xl font-bold text-navy">Simple pricing. No invite caps. No surprises.</h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-text-muted">
          Billed via Authorize.net. 14-day free trial. Cancel anytime.
        </p>
        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <div key={plan.id} className={cn("card-surface relative flex flex-col p-6", plan.popular && "glow-growth")}>
              {plan.badge && (
                <span className={cn(
                  "absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-xs font-semibold",
                  plan.popular ? "bg-gold text-white" : "border border-gold/30 bg-gold-pale text-gold-dark",
                )}>
                  {plan.badge}
                </span>
              )}
              <h3 className="text-lg font-bold capitalize text-navy">{plan.id}</h3>
              <p className="mt-1 text-3xl font-extrabold text-navy">
                ${PLAN_LIMITS[plan.id].price}<span className="text-sm font-normal text-text-faint">/mo</span>
              </p>
              <p className="mt-2 text-sm text-text-muted">{plan.tagline}</p>
              <ul className="mt-6 flex-1 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-text-muted">
                    <span className="text-green" aria-hidden>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Button variant={plan.popular ? "primary" : "ghost"} className="mt-6 w-full" href="/signup">{plan.cta}</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
