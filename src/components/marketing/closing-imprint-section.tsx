/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
export function ClosingImprintSection() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-white" data-surface="dark">
      <div className="grain-overlay absolute inset-0 opacity-50" aria-hidden />
      <div className="relative mx-auto max-w-[1100px] px-6 text-center sm:px-10 lg:px-14">
        <div className="smallcaps mb-5 text-[10px] text-gold-light">A trust manifesto</div>
        <p className="font-heading mx-auto max-w-3xl text-[clamp(1.5rem,2.6vw,2.2rem)] leading-[1.4] text-balance text-white/85 italic">
          We&apos;re not building another review widget. We&apos;re building the trust layer
          that e-commerce should have had from the start.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-gold/50" />
          <span className="smallcaps text-[10px] text-white/40">Volume I · Edition 2026</span>
          <span className="h-px w-12 bg-gold/50" />
        </div>
      </div>
    </section>
  );
}
