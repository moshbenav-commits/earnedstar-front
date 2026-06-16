const platforms = [
  "Shopify", "WooCommerce", "BigCommerce", "Magento", "Amazon",
  "eBay", "Walmart", "Squarespace", "Wix", "Custom API",
];

export function TrustBar() {
  return (
    <section className="border-y border-border bg-surface py-6">
      <div className="mx-auto max-w-7xl px-4">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-text-faint">
          Trusted by stores selling on
        </p>
        <div className="marquee-mask overflow-hidden">
          <div className="marquee-track flex gap-8 whitespace-nowrap">
            {[...platforms, ...platforms].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="inline-flex rounded-full border border-border bg-bg px-4 py-1.5 text-sm text-text-muted"
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
