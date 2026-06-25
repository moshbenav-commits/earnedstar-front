import React, { useState } from "react";
import { Search, ShieldAlert, ShieldCheck, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import MarketingNav from "../components/layout/MarketingNav";
import MarketingFooter from "../components/layout/MarketingFooter";
import { postJSON } from "../lib/api";

const RISK_COLORS = {
  low: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" },
  moderate: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200" },
  high: { bg: "bg-orange-50", text: "text-orange-700", ring: "ring-orange-200" },
  critical: { bg: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-200" },
};

export default function AuditPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const run = async (e) => {
    e?.preventDefault();
    setError(""); setResult(null); setLoading(true);
    try {
      const data = await postJSON("/ai/review-audit", { url });
      setResult(data);
    } catch (err) {
      setError("Couldn't run audit. Try a different URL or check back in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const colors = result ? RISK_COLORS[result.audit?.risk_level] || RISK_COLORS.moderate : RISK_COLORS.moderate;

  return (
    <div className="bg-cream min-h-screen text-navy">
      <MarketingNav />
      <section className="pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <span className="font-body text-xs uppercase tracking-[0.28em] text-gold-dark font-bold">Free public tool</span>
          <h1 className="font-heading text-5xl sm:text-6xl mt-3 tracking-tight text-balance">
            The Review Audit — see how many reviews on <em className="italic text-gold-dark">any</em> profile are probably fake.
          </h1>
          <p className="font-body text-lg text-slate-600 mt-6 leading-relaxed max-w-3xl">
            Paste a Trustpilot, Yotpo, or G2 profile URL and we&apos;ll run an AI forensic scan — language clusters, timing
            anomalies, reviewer history patterns — and return a shareable report. We don&apos;t require an email.
            We do this free because <em className="italic">we have nothing to hide</em>.
          </p>

          <form data-testid="audit-form" onSubmit={run} className="mt-10 flex flex-col sm:flex-row gap-3">
            <input
              data-testid="audit-url-input"
              type="url"
              required
              placeholder="https://trustpilot.com/review/example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-white border-2 border-slate-200 focus:border-navy outline-none rounded-xl px-5 py-4 text-base font-body placeholder:text-slate-400 transition-colors"
            />
            <button
              data-testid="audit-submit-button"
              type="submit"
              disabled={loading}
              className="px-6 py-4 rounded-xl bg-navy text-white font-bold inline-flex items-center justify-center gap-2 disabled:opacity-60 hover:bg-navy-light transition-colors"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
              {loading ? "Scanning…" : "Run audit"}
            </button>
          </form>

          {error && <p className="mt-4 text-rose-600 text-sm">{error}</p>}

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-12 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm"
                data-testid="audit-result"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div>
                    <span className="font-body text-xs uppercase tracking-[0.22em] text-gold-dark font-bold">Audit report</span>
                    <p className="text-sm text-slate-500 mt-1 break-all">{result.url}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${colors.bg} ${colors.text} ring-1 ${colors.ring}`}>
                    {result.audit?.risk_level === "low" ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                    {result.audit?.risk_level} risk
                  </span>
                </div>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 border-l-4 border-gold-dark pl-5">
                    <div className="font-body text-xs uppercase tracking-[0.22em] text-slate-500 font-bold">Estimated fake reviews</div>
                    <div className="font-heading text-7xl mt-2 text-navy">{result.audit?.estimated_fake_review_pct}%</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="font-body text-xs uppercase tracking-[0.22em] text-slate-500 font-bold mb-3">Patterns detected</div>
                    <ul className="space-y-2.5">
                      {(result.audit?.top_patterns || []).map((p, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gold-dark flex-shrink-0" />
                          <span className="font-body text-sm text-slate-700">{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-8 bg-navy text-white p-6 rounded-xl">
                  <div className="font-body text-xs uppercase tracking-[0.22em] text-gold-light font-bold">Recommendation</div>
                  <p className="font-body text-lg mt-2 leading-relaxed">{result.audit?.recommendation}</p>
                  <Link to="/yotpo-refugees" data-testid="audit-migrate-cta" className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-navy font-bold hover:shadow-lg transition-shadow">
                    Switch to verified-only · 3 months free <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              ["Language fingerprinting", "We score perplexity & burstiness — AI-generated reviews read very differently."],
              ["Timing & velocity analysis", "Bursts of 5-star reviews in narrow windows are easy to spot if you look."],
              ["Reviewer graph signals", "Single-platform reviewers and shared device fingerprints reveal fake-review services."],
            ].map(([t, s]) => (
              <div key={t} className="bg-white border border-slate-200 rounded-xl p-6">
                <h4 className="font-heading text-2xl italic text-navy">{t}</h4>
                <p className="font-body text-sm text-slate-600 mt-2 leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
