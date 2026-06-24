import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Check, Shield, ShieldCheck, Award, X, ExternalLink, Sparkles, Loader2, Truck, Wrench, Package, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MarketingNav from "../components/layout/MarketingNav";
import MarketingFooter from "../components/layout/MarketingFooter";
import { getJSON, postJSON } from "../lib/api";

const BRAND_SHEET = "https://customer-assets.emergentagent.com/job_rater-pro/artifacts/0zpntmg0_EarnedStar_3D_origami_lucky_star_logo_system_with_merchant_logo_zone.png";

function Stars({ n, size = 16 }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= n ? "fill-current" : ""}
          style={{ color: i <= n ? "#F59E0B" : "#E5E7EB" }}
          strokeWidth={1.4}
        />
      ))}
    </div>
  );
}

function IdentityBadge({ tier }) {
  const map = {
    bronze: { bg: "bg-orange-50", text: "text-orange-700", ring: "ring-orange-200" },
    silver: { bg: "bg-slate-100", text: "text-slate-700", ring: "ring-slate-200" },
    gold: { bg: "bg-amber-50", text: "text-amber-800", ring: "ring-amber-200" },
  }[tier] || { bg: "bg-slate-50", text: "text-slate-600", ring: "ring-slate-200" };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${map.bg} ${map.text} ring-1 ${map.ring}`}>
      <Shield size={10} /> {tier} verified
    </span>
  );
}

export default function StorePage() {
  const { slug } = useParams();
  const [store, setStore] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [ymmFilter, setYmmFilter] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [s, r] = await Promise.all([
          getJSON(`/stores/${slug}`),
          getJSON(`/stores/${slug}/reviews`),
        ]);
        setStore(s);
        setReviews(r);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [slug]);

  const generateSummary = async () => {
    setSummaryLoading(true);
    try {
      const data = await postJSON("/ai/store-summary", { store_slug: slug });
      setSummary(data.summary);
    } catch (e) {
      setSummary("AI summary unavailable right now.");
    } finally {
      setSummaryLoading(false);
    }
  };

  const filteredReviews = ymmFilter
    ? reviews.filter((r) => (r.ymm || "").toLowerCase().includes(ymmFilter.toLowerCase()))
    : reviews;

  if (!store) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="animate-spin text-gold-dark" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen text-navy">
      <MarketingNav />

      {/* Store header */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-body text-xs uppercase tracking-[0.22em] text-gold-dark font-bold">Verified store</span>
              {store.awards?.map((a) => (
                <span key={a} className="inline-flex items-center gap-1.5 bg-amber-50 ring-1 ring-amber-200 text-amber-800 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  <Award size={12} /> {a}
                </span>
              ))}
            </div>
            <h1 className="font-heading text-5xl sm:text-6xl mt-3 tracking-tight">{store.name}</h1>
            <p className="font-body text-base text-slate-600 mt-3 max-w-2xl leading-relaxed">{store.description}</p>
            <div className="flex flex-wrap items-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <span className="font-heading text-4xl text-navy">{store.avg_rating}</span>
                <Stars n={Math.round(store.avg_rating)} size={18} />
              </div>
              <div className="text-sm text-slate-600">
                <span className="font-bold">{store.review_count}</span> verified reviews ·
                <span className="font-bold text-emerald-700 ml-1">{store.fraud_blocks_this_month}</span> fraud attempts blocked this month
              </div>
            </div>

            {/* AI Summary box */}
            <div className="mt-8 bg-gradient-to-br from-amber-50/40 to-white border border-amber-200/50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <span className="font-body text-xs font-bold uppercase tracking-[0.22em] text-gold-dark inline-flex items-center gap-2">
                  <Sparkles size={14} /> AI Customers Say
                </span>
                {!summary && (
                  <button
                    data-testid="generate-summary-btn"
                    onClick={generateSummary}
                    disabled={summaryLoading}
                    className="text-sm font-bold text-navy hover:underline disabled:opacity-50 inline-flex items-center gap-1"
                  >
                    {summaryLoading ? <Loader2 size={14} className="animate-spin" /> : null}
                    {summaryLoading ? "Generating…" : "Generate"}
                  </button>
                )}
              </div>
              {summary ? (
                <p className="font-body text-base text-slate-700 mt-3 leading-relaxed italic">&ldquo;{summary}&rdquo;</p>
              ) : (
                <p className="font-body text-sm text-slate-500 mt-3 italic">Click Generate to summarize all {reviews.length} reviews with Claude Sonnet 4.6.</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 lg:justify-self-end">
            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-tr from-gold-dark/25 via-gold/15 to-transparent blur-3xl" />
              <div
                className="w-[320px] h-[320px] max-w-full animate-float"
                style={{
                  backgroundImage: `url(${BRAND_SHEET})`,
                  backgroundSize: "280% 280%",
                  backgroundPosition: "92% 22%",
                  backgroundRepeat: "no-repeat",
                  filter: "drop-shadow(0 24px 50px rgba(11,26,56,0.45))",
                }}
                role="img"
                aria-label="EarnedStar leather badge — verified store"
              />
            </div>
            <div className="grid grid-cols-3 gap-3 mt-6 text-center">
              {[
                { v: store.trust_score, l: "Trust Score" },
                { v: `${store.response_rate}%`, l: "Response rate" },
                { v: `${store.nps_score}`, l: "NPS" },
              ].map(({ v, l }) => (
                <div key={l} className="bg-cream border border-slate-200 rounded-xl p-4">
                  <div className="font-heading text-3xl text-navy">{v}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Reviews */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* sidebar */}
          <aside className="lg:col-span-3">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="font-body text-xs font-bold uppercase tracking-[0.22em] text-slate-500 mb-3">Filter by vehicle</div>
              <input
                data-testid="ymm-filter-input"
                placeholder="e.g., Silverado, F-150, 2007"
                value={ymmFilter}
                onChange={(e) => setYmmFilter(e.target.value)}
                className="w-full bg-cream border-2 border-slate-200 focus:border-navy outline-none rounded-lg px-3 py-2 text-sm transition-colors"
              />
              <div className="mt-4 space-y-1.5">
                {["2007 Silverado", "F-150", "Ram 2500", "BMW X5"].map((q) => (
                  <button key={q} onClick={() => setYmmFilter(q)} className="block w-full text-left text-xs text-slate-600 hover:text-navy py-1">
                    → {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 mt-4">
              <div className="font-body text-xs font-bold uppercase tracking-[0.22em] text-slate-500 mb-3">Trust</div>
              <Link to={`/store/${slug}/moderation`} data-testid="link-moderation-ledger" className="block text-sm text-navy font-bold hover:underline">
                → Moderation Ledger
              </Link>
              <p className="text-xs text-slate-500 mt-2">See every removed, restored, or flagged review with reason and decision-maker.</p>
            </div>

            <div className="bg-navy text-white rounded-xl p-5 mt-4">
              <div className="font-body text-xs font-bold uppercase tracking-[0.22em] text-gold-light mb-2">Why this matters</div>
              <p className="font-body text-sm text-white/80 leading-relaxed">
                Every review here is tied to a real fulfilled order, AI-fraud-audited, and verified human.
                Click <span className="font-bold">Verify ↗</span> on any review to see the receipt.
              </p>
            </div>
          </aside>

          {/* reviews list */}
          <div className="lg:col-span-9 space-y-5">
            {filteredReviews.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500">
                No reviews match your filter.
              </div>
            )}
            {filteredReviews.map((r, idx) => (
              <motion.article
                key={r.id}
                data-testid={`review-card-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-bold">{r.author_initial}</div>
                    <div>
                      <div className="font-body font-bold text-navy">{r.author_name}</div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                        <IdentityBadge tier={r.identity_tier} />
                        <span>· {r.days_after_delivery} days after delivery</span>
                      </div>
                    </div>
                  </div>
                  <Stars n={r.rating} />
                </div>
                <h3 className="font-heading text-2xl italic mt-4 text-navy">{r.title}</h3>
                <p className="font-body text-slate-700 mt-2 leading-relaxed">{r.body}</p>

                {r.ymm && (
                  <div className="mt-4 inline-flex items-center gap-1.5 bg-cream border border-slate-200 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700">
                    <Truck size={12} /> {r.ymm}
                  </div>
                )}

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {r.pros?.length > 0 && (
                    <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-lg p-3">
                      <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-700 mb-1.5">Pros</div>
                      <ul className="text-xs text-emerald-900 space-y-1">
                        {r.pros.map((p) => <li key={p}>+ {p}</li>)}
                      </ul>
                    </div>
                  )}
                  {r.cons?.length > 0 && (
                    <div className="bg-amber-50/60 border border-amber-200/60 rounded-lg p-3">
                      <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-700 mb-1.5">Cons</div>
                      <ul className="text-xs text-amber-900 space-y-1">
                        {r.cons.map((p) => <li key={p}>– {p}</li>)}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                    <Wrench size={12} className="text-slate-400" /> {r.product}
                  </span>
                  <button
                    data-testid={`verify-button-${idx}`}
                    onClick={() => setActiveReceipt(r)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-navy hover:text-gold-dark transition-colors"
                  >
                    <ShieldCheck size={14} /> Verify <ExternalLink size={11} />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Receipt Modal */}
      <AnimatePresence>
        {activeReceipt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => setActiveReceipt(null)}
            data-testid="trust-receipt-modal"
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden"
            >
              <div className="bg-ink text-white p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LeatherStar size={56} variant="navy" center="check" showShadow={false} />
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-gold-light font-bold">Trust Receipt</div>
                    <div className="font-heading text-xl italic">{activeReceipt.author_name}&apos;s review</div>
                  </div>
                </div>
                <button onClick={() => setActiveReceipt(null)} className="p-2 hover:bg-white/10 rounded-full">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <ReceiptRow icon={<Package size={16} />} label="Order verified" value={`Hash ${activeReceipt.order_hash}`} ok />
                <ReceiptRow icon={<Shield size={16} />} label="Identity tier" value={activeReceipt.identity_tier.toUpperCase()} ok />
                <ReceiptRow icon={<Sparkles size={16} />} label="AI fraud score" value={`${activeReceipt.fraud_score}/100 (lower is safer)`} ok />
                <ReceiptRow icon={<ShieldCheck size={16} />} label="Verified Human" value={activeReceipt.verified_human ? `Passed · AI-review probability ${(activeReceipt.ai_review_probability * 100).toFixed(1)}%` : "Failed"} ok={activeReceipt.verified_human} />
                <ReceiptRow icon={<Clock size={16} />} label="Submitted" value={`${activeReceipt.days_after_delivery} days post-delivery`} ok />
                <ReceiptRow icon={<Check size={16} />} label="Moderation status" value={`${activeReceipt.status} · merchant approved`} ok />

                <div className="bg-cream rounded-xl p-4 mt-4 text-xs text-slate-600">
                  <div className="font-bold text-navy text-sm mb-1">Fraud signals scored</div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeReceipt.fraud_signals?.map((s) => (
                      <span key={s} className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-700">
                        <Check size={10} /> {s.replaceAll("_", " ")}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-500 italic pt-2">
                  This is what &quot;earned&quot; looks like. Every review on EarnedStar ships with a receipt like this. <span className="underline">How trust works ↗</span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MarketingFooter />
    </div>
  );
}

function ReceiptRow({ icon, label, value, ok }) {
  return (
    <div className="flex items-start gap-3">
      <span className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center ${ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{icon}</span>
      <div className="flex-1">
        <div className="text-xs uppercase tracking-[0.18em] font-bold text-slate-500">{label}</div>
        <div className="font-body text-sm text-navy font-bold mt-0.5">{value}</div>
      </div>
    </div>
  );
}
