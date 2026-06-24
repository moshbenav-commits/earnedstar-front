import React, { useState } from "react";
import { Download, Eye, Copy, Check, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import MarketingNav from "../components/layout/MarketingNav";
import MarketingFooter from "../components/layout/MarketingFooter";

const RENDERS = [
  // Hero compositions
  { f: "render_03ad263cd8.png", group: "Hero", name: "Primary Hero Composition", desc: "Padded leather star + YOUR LOGO medallion + EarnedStar wordmark + metrics (142,847 reviews · 0 ransomed · 22H SLA)", bg: "navy", featured: true },
  { f: "render_a185ca1d80.png", group: "Hero", name: "2026 Edition Hero", desc: "Editorial luxury layout with sparkling particle effect — verified reviews 2026 edition", bg: "navy" },

  // Brand systems
  { f: "render_47069cba2c.png", group: "Brand System", name: "Brand System · Edition I", desc: "Full 4-quadrant brand sheet — Primary · Icon · Dark · Variants", bg: "cream", featured: true },
  { f: "render_870bf06e3e.png", group: "Brand System", name: "Brand System · Variant", desc: "Alternate 4-quadrant brand sheet layout", bg: "cream" },

  // Wordmarks
  { f: "render_76cbc33016.png", group: "Wordmark", name: "Primary Wordmark", desc: "Leather \"EarnedStar\" + \"THE MARK OF VERIFIED TRUST\" tagline", bg: "cream", featured: true },
  { f: "render_710d111f44.png", group: "Wordmark", name: "Clean Wordmark", desc: "Standalone leather \"EarnedStar\" wordmark on white", bg: "cream" },

  // Manifesto
  { f: "render_0966455626.png", group: "Manifesto", name: "Manifesto Composition", desc: "\"No order, no star. Every review is real.\" with gold border frame", bg: "cream", featured: true },
  { f: "render_7e17e7accd.png", group: "Manifesto", name: "Manifesto · Clean", desc: "Manifesto text on plain white background", bg: "cream" },

  // Awards
  { f: "render_d0e706d76b.png", group: "Awards", name: "Q1 Leader Award · Transparent", desc: "Leather star + \"4.9 · Q1 LEADER\" gold ribbon — transparent PNG for overlays", bg: "checkered", featured: true },
  { f: "render_805e113926.png", group: "Awards", name: "Q1 Leader Award · Framed", desc: "Q1 LEADER medallion with banner ribbon on white frame", bg: "cream" },

  // Anti-AI
  { f: "render_16b7e72831.png", group: "Anti-AI", name: "Verified Human Badge", desc: "Star + shield + \"VERIFIED HUMAN\" plaque — Phase 1 anti-AI-review play", bg: "checkered", featured: true },

  // Rating
  { f: "render_c30552e25d.png", group: "Ratings", name: "Rating Badge · 4.8", desc: "Star + circular rating + \"4.8 · 2,847 REVIEWS\" bar — for dashboard / widgets", bg: "checkered", featured: true },

  // Merchant
  { f: "render_c6d95bea43.png", group: "Merchant", name: "Reman Transmissions Card", desc: "Custom merchant card · VERIFIED MERCHANT · EARNEDSTAR · EST. 2024 · 847 VERIFIED REVIEWS", bg: "navy", featured: true },

  // Standalone stars
  { f: "render_45d84d1e36.png", group: "Star", name: "Padded Leather Star · White", desc: "Studio shot with \"PADDED LEATHER · HAND-FINISHED\" footer bar", bg: "cream" },
  { f: "render_4e3dbf70de.png", group: "Star", name: "Padded Leather Star · Framed", desc: "Star with gold border frame and product caption", bg: "cream" },
  { f: "render_fd0d739951.png", group: "Star", name: "Padded Leather Star · Detail", desc: "Close-up star detail render", bg: "cream" },
  { f: "render_cc9d5d2cc6.png", group: "Star", name: "Padded Leather Star · Front", desc: "Frontal product render of the leather star", bg: "cream" },
  { f: "render_8944e3c4ad.png", group: "Star", name: "Padded Leather Star · Side", desc: "Side-angle leather star render", bg: "cream" },
  { f: "render_435d2ab62d.png", group: "Star", name: "Padded Leather Star · Studio", desc: "Studio leather star render", bg: "cream" },
  { f: "render_77e9801abd.png", group: "Star", name: "Padded Leather Star · Premium", desc: "Premium leather star variant", bg: "cream" },
  { f: "render_c787994db8.png", group: "Star", name: "Padded Leather Star · Alt", desc: "Alternate leather star render", bg: "cream" },
];

const GROUPS = ["Hero", "Brand System", "Wordmark", "Manifesto", "Awards", "Anti-AI", "Ratings", "Merchant", "Star"];

export default function BrandPage() {
  const [filter, setFilter] = useState("All");
  const [copied, setCopied] = useState(null);

  const filtered = filter === "All" ? RENDERS : RENDERS.filter((r) => r.group === filter);

  const copyUrl = (f) => {
    const url = `${window.location.origin}/meshy-renders/${f}`;
    navigator.clipboard?.writeText(url);
    setCopied(f);
    setTimeout(() => setCopied(null), 1800);
  };

  const featuredCount = RENDERS.filter((r) => r.featured).length;

  return (
    <div className="bg-cream min-h-screen text-ink">
      <MarketingNav />
      <section className="pt-20 pb-12 bg-cream relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 relative">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-px bg-gold-dark" />
            <span className="text-[10px] smallcaps text-gold-dark">Brand assets &middot; Edition I</span>
          </div>
          <h1 className="font-heading text-[clamp(3rem,6vw,5.5rem)] leading-[0.98] tracking-tight text-balance">
            The brand <em className="italic text-gold-dark underline-hand">library</em>.
          </h1>
          <p className="font-body text-lg text-ink/65 mt-6 max-w-2xl leading-[1.65] text-pretty">
            Every 3D render in the EarnedStar identity system &mdash; padded-leather stars, award medallions, the Verified Human badge,
            the manifesto typography, and merchant-specific cards. All hand-rendered in Meshy, ready to download.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2"><span className="font-num font-bold text-2xl">{RENDERS.length}</span><span className="text-ink/55">total renders</span></div>
            <div className="flex items-center gap-2"><span className="font-num font-bold text-2xl gold-text">{featuredCount}</span><span className="text-ink/55">featured</span></div>
            <div className="flex items-center gap-2"><span className="font-num font-bold text-2xl">{GROUPS.length}</span><span className="text-ink/55">categories</span></div>
          </div>

          {/* PDF Download Card */}
          <div className="mt-10 vellum-card gilded-edge rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between max-w-3xl">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl gold-foil flex items-center justify-center shrink-0">
                <Download size={22} className="text-ink" />
              </div>
              <div>
                <div className="text-[10px] smallcaps text-gold-dark">Edition I &middot; 8 pages</div>
                <h3 className="font-heading text-2xl italic mt-1">Brand Guidelines PDF</h3>
                <p className="font-body text-sm text-ink/60 mt-1 leading-[1.55] max-w-md">
                  Clear-space rules, minimum sizes, color, typography, do&apos;s &amp; don&apos;ts, and the full library &mdash; bound as a print-ready document.
                </p>
              </div>
            </div>
            <a
              href="/brand-guidelines.pdf"
              download="EarnedStar-Brand-Guidelines-Edition-I.pdf"
              data-testid="download-pdf-guidelines"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-ink text-white font-bold text-sm hover:bg-ink-soft transition-colors"
            >
              <Download size={14} /> Download PDF
            </a>
          </div>
        </div>
      </section>

      {/* Filter chips */}
      <section className="bg-cream pb-10 sticky top-16 z-30 backdrop-blur-xl border-y border-ink/8">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 py-4 flex items-center gap-2 overflow-x-auto">
          {["All", ...GROUPS].map((g) => (
            <button
              key={g}
              data-testid={`filter-${g.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setFilter(g)}
              className={`shrink-0 px-4 py-2 rounded-full text-[12px] font-bold tracking-tight transition-all ${
                filter === g
                  ? "bg-ink text-white shadow-md"
                  : "bg-white text-ink/60 hover:text-ink border border-ink/10"
              }`}
            >
              {g}
              <span className={`ml-1.5 text-[10px] ${filter === g ? "text-gold-light" : "text-ink/40"}`}>
                {g === "All" ? RENDERS.length : RENDERS.filter((r) => r.group === g).length}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="bg-cream py-12 pb-24">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((r, i) => (
              <motion.article
                key={r.f}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="vellum-card rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform"
                data-testid={`render-card-${i}`}
              >
                {/* Image bay */}
                <div
                  className={`relative aspect-[4/3] flex items-center justify-center p-6 ${
                    r.bg === "navy"
                      ? "bg-ink"
                      : r.bg === "checkered"
                      ? "bg-[length:20px_20px] bg-[linear-gradient(45deg,#eee_25%,transparent_25%),linear-gradient(-45deg,#eee_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#eee_75%),linear-gradient(-45deg,transparent_75%,#eee_75%)] bg-[position:0_0,0_10px,10px_-10px,-10px_0px]"
                      : "bg-cream-light"
                  }`}
                >
                  {r.featured && (
                    <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 bg-gold-foil gold-foil text-ink text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                      Featured
                    </span>
                  )}
                  <span className={`absolute top-3 right-3 z-10 text-[9px] smallcaps font-bold ${r.bg === "navy" ? "text-gold-light/80" : "text-gold-dark"}`}>
                    {r.group}
                  </span>
                  <img
                    src={`/meshy-renders/${r.f}`}
                    alt={r.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    style={{ filter: r.bg === "navy" ? "drop-shadow(0 20px 40px rgba(0,0,0,0.5))" : "drop-shadow(0 12px 28px rgba(11,26,56,0.18))" }}
                  />
                </div>

                {/* Card body */}
                <div className="p-5">
                  <h3 className="font-heading text-2xl italic leading-tight">{r.name}</h3>
                  <p className="font-body text-xs text-ink/55 mt-2 leading-[1.55]">{r.desc}</p>
                  <div className="flex items-center gap-2 mt-4">
                    <a
                      href={`/meshy-renders/${r.f}`}
                      download={r.f}
                      data-testid={`download-${i}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-ink text-white text-[11px] font-bold hover:bg-ink-soft transition-colors"
                    >
                      <Download size={12} /> Download PNG
                    </a>
                    <button
                      onClick={() => copyUrl(r.f)}
                      data-testid={`copy-${i}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-ink/15 text-[11px] font-bold text-ink/65 hover:text-ink hover:border-ink/30 transition-colors"
                    >
                      {copied === r.f ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      {copied === r.f ? "Copied" : "URL"}
                    </button>
                    <a
                      href={`/meshy-renders/${r.f}`}
                      target="_blank"
                      rel="noreferrer"
                      data-testid={`view-${i}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-ink/15 text-[11px] font-bold text-ink/65 hover:text-ink hover:border-ink/30 transition-colors ml-auto"
                    >
                      <Eye size={12} />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="bg-white border border-ink/10 rounded-2xl p-12 text-center text-ink/50">
              <ImageIcon size={32} className="mx-auto mb-3 text-ink/20" />
              No renders in this category yet.
            </div>
          )}
        </div>
      </section>

      {/* Usage rights */}
      <section className="bg-vellum border-t border-ink/8 py-16 relative paper-grain">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-10 lg:px-14 relative">
          <div className="text-[10px] smallcaps text-gold-dark mb-3">Usage</div>
          <h2 className="font-heading text-4xl tracking-tight">Yours to use, in <em className="italic text-gold-dark">your</em> ways.</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              ["Merchants", "Embed any badge on your storefront, emails, social, or printed packaging. Co-marketing welcome."],
              ["Press", "Use the wordmark, hero composition, and brand system sheets for editorial coverage. Please credit EarnedStar."],
              ["Agencies", "On the Agency plan, full white-label rights apply. Strip the wordmark or co-brand alongside your own mark."],
            ].map(([t, s]) => (
              <div key={t} className="bg-white border border-ink/8 rounded-xl p-6">
                <h4 className="font-heading text-xl italic">{t}</h4>
                <p className="font-body text-sm text-ink/60 mt-2 leading-[1.65]">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
