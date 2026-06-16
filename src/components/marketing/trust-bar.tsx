const platforms = [
  "Shopify", "WooCommerce", "BigCommerce", "Magento", "Amazon",
  "eBay", "Walmart", "Squarespace", "Wix", "Custom API",
];

export function TrustBar() {
  return (
    <section className="border-y border-white/10 bg-navy-mid py-6" data-surface="dark" data-scroll-theme="dark">
      <div className="mx-auto max-w-7xl px-4">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-white/45">
          Trusted by stores selling on
        </p>
        <div className="marquee-mask overflow-hidden">
          <div className="marquee-track flex gap-8 whitespace-nowrap">
            {[...platforms, ...platforms].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/70"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
