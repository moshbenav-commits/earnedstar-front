const steps = [
  {
    number: "01",
    title: "Connect Your Store",
    body: "Install our Shopify app or paste one API webhook. Fulfilled orders trigger invitations automatically.",
  },
  {
    number: "02",
    title: "Reviews Collect Automatically",
    body: "Customers receive a branded email or SMS. We verify the purchase, score for fraud, and publish if it passes.",
  },
  {
    number: "03",
    title: "Conversions Increase",
    body: "The EarnedStar Badge on your site tells buyers these ratings were earned — not manufactured.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-y border-border bg-surface py-24">
      <div className="mx-auto max-w-3xl px-4">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-navy-light">Setup in 3 steps</p>
        <h2 className="mt-3 text-center text-3xl font-bold text-navy">From store to stars in under 30 minutes</h2>
        <div className="relative mt-16 space-y-12">
          {steps.map((step, i) => (
            <div key={step.number} className="relative pl-12">
              <div className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gold bg-gold-pale text-xs font-bold text-gold-dark">
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
