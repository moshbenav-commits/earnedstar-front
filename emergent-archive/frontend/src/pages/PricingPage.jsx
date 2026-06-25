import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Star, ArrowRight, Sparkles } from "lucide-react";
import MarketingNav from "../components/layout/MarketingNav";
import MarketingFooter from "../components/layout/MarketingFooter";

const TIERS = [
  { id: "free", name: "Free", price: 0, blurb: "For brand-new stores", invites: "50/mo", email: "500 sends/mo", sms: "—", ai: "Trust Receipt", domains: "1", highlight: false },
  { id: "starter", name: "Starter", price: 29, blurb: "Get to your first 500 reviews", invites: "500/mo", email: "2K sends/mo", sms: "—", ai: "+ AI Review Summary", domains: "1", highlight: false },
  { id: "growth", name: "Growth", price: 99, blurb: "Most stores switching from Yotpo", invites: "2,500/mo", email: "10K sends/mo", sms: "500/mo", ai: "+ AI Smart-Reply, Sentiment, Q&A", domains: "3", highlight: true },
  { id: "scale", name: "Scale", price: 149, blurb: "Growing DTC brands", invites: "7,500/mo", email: "25K sends/mo", sms: "1.5K/mo", ai: "+ Loyalty Lite, Predictive CLV", domains: "5", highlight: false },
  { id: "pro", name: "Pro", price: 249, blurb: "Multi-channel scale", invites: "20K/mo", email: "75K sends/mo", sms: "5K/mo", ai: "+ Buyer Intent (50 leads), Attribution", domains: "10", highlight: false },
  { id: "business", name: "Business", price: 399, blurb: "Multi-brand retailers", invites: "50K/mo", email: "200K sends/mo", sms: "15K/mo", ai: "+ Custom Moderation, Benchmarks", domains: "25", highlight: false },
  { id: "agency", name: "Agency", price: 499, blurb: "Agencies & multi-store", invites: "Unlimited", email: "Unlimited", sms: "Unlimited", ai: "All + 25 sub-accounts, white-label", domains: "∞", highlight: false },
];

const MATRIX = [
  { group: "Trust layer", rows: [
    ["Public Trust Receipt", "all"],
    ["Public Moderation Ledger", "all"],
    ["24h dispute SLA", "all"],
    ["Verified Human (anti-AI) badge", "all"],
    ["Identity tiers (Bronze/Silver/Gold)", "growth"],
  ]},
  { group: "AI", rows: [
    ["AI Review Summary", "starter"],
    ["AI Smart-Reply", "growth"],
    ["AI Q&A auto-answer", "growth"],
    ["Sentiment topic clusters", "growth"],
    ["Custom moderation policies", "business"],
  ]},
  { group: "EarnedMail + EarnedSend", rows: [
    ["Email campaigns + flows", "starter"],
    ["Review-triggered behavioral segments", "growth"],
    ["Native SMS", "growth"],
    ["WhatsApp + Apple Business Messages", "scale"],
    ["Predictive CLV & Churn Score", "scale"],
  ]},
  { group: "Growth", rows: [
    ["Conversion attribution", "growth"],
    ["EarnedLoyalty Lite", "scale"],
    ["Buyer Intent leads", "pro"],
    ["Competitive benchmarks", "business"],
    ["Quarterly Leaders Award eligibility", "all"],
  ]},
  { group: "Enterprise", rows: [
    ["Multi-domain", "growth"],
    ["White-label sub-accounts", "agency"],
    ["EU DSA / AI Act compliance audits", "agency"],
    ["SOC 2, SAML, dedicated CSM", "enterprise"],
  ]},
];

const ORDER = ["free", "starter", "growth", "scale", "pro", "business", "agency"];

function included(tierIdx, threshold) {
  if (threshold === "all") return true;
  if (threshold === "enterprise") return false;
  const idx = ORDER.indexOf(threshold);
  return tierIdx >= idx;
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  return (
    <div className="bg-cream min-h-screen text-navy">
      <MarketingNav />
      <section className="pt-24 pb-12 bg-cream">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <span className="font-body text-xs uppercase tracking-[0.28em] text-gold-dark font-bold">Pricing</span>
            <h1 className="font-heading text-5xl sm:text-6xl mt-3 tracking-tight">
              Flat. Honest. <em className="italic text-gold-dark">Yours</em>.
            </h1>
            <p className="font-body text-lg text-slate-600 mt-6 leading-relaxed max-w-2xl">
              Pricing that doesn&apos;t punish you for growing or run two domains.
              Every plan ships with Public Trust Receipts, the Moderation Ledger, the 24h Dispute SLA, and Portable Reviews.
            </p>
          </div>
          <div className="lg:col-span-5 flex lg:justify-end items-start">
            <div className="bg-white border border-slate-200 rounded-2xl p-3 inline-flex">
              <button data-testid="billing-toggle-monthly" onClick={() => setAnnual(false)} className={`px-4 py-2 rounded-xl text-sm font-bold ${!annual ? "bg-navy text-white" : "text-slate-500"}`}>Monthly</button>
              <button data-testid="billing-toggle-annual" onClick={() => setAnnual(true)} className={`px-4 py-2 rounded-xl text-sm font-bold ${annual ? "bg-navy text-white" : "text-slate-500"}`}>
                Annual <span className="text-gold-light ml-1">save 20%</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TIER CARDS */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TIERS.slice(0, 4).map((t) => (
            <TierCard key={t.id} t={t} annual={annual} />
          ))}
          {TIERS.slice(4).map((t) => (
            <TierCard key={t.id} t={t} annual={annual} />
          ))}
        </div>
        <p className="text-center text-xs font-body text-slate-500 mt-8">
          Plus usage-based overage at $0.01/invite, $0.05/SMS — predictable and transparent.
          Enterprise tier available with SOC 2 + SAML + DSA audits.
        </p>
      </section>

      {/* COMPARISON MATRIX */}
      <section className="bg-white border-y border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="font-heading text-4xl tracking-tight">What&apos;s in <em className="italic text-gold-dark">each plan</em></h2>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[920px]">
              <thead>
                <tr>
                  <th className="p-3 border-b border-slate-200 text-xs uppercase tracking-[0.18em] text-slate-500 text-left w-1/3">Feature</th>
                  {TIERS.map((t) => (
                    <th key={t.id} className="p-3 border-b border-slate-200 text-center">
                      <div className="font-heading text-lg italic text-navy">{t.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">${t.price}/mo</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((group) => (
                  <React.Fragment key={group.group}>
                    <tr>
                      <td colSpan={8} className="pt-6 pb-2 text-xs font-bold uppercase tracking-[0.22em] text-gold-dark">{group.group}</td>
                    </tr>
                    {group.rows.map(([label, threshold]) => (
                      <tr key={label} className="hover:bg-slate-50/60">
                        <td className="p-3 border-b border-slate-100 text-sm text-slate-700">{label}</td>
                        {TIERS.map((t, idx) => (
                          <td key={t.id} className="p-3 border-b border-slate-100 text-center">
                            {included(idx, threshold) ? (
                              <Check size={16} className="text-gold-dark inline" />
                            ) : (
                              <span className="text-slate-300 text-sm">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* YOTPO BILL COMPARISON */}
      <section className="bg-navy text-white py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <span className="font-body text-xs uppercase tracking-[0.28em] text-gold-light font-bold">The integrated stack math</span>
          <h2 className="font-heading text-4xl sm:text-5xl mt-3 tracking-tight max-w-3xl mx-auto">
            Replace 3 tools with one. Keep <em className="italic text-gold-light">$7,188</em> a year.
          </h2>
          <Link to="/yotpo-refugees" data-testid="pricing-yotpo-cta" className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-white text-navy font-bold hover:shadow-xl transition-shadow">
            <Sparkles size={16} className="text-gold-dark" /> Migrate from Yotpo, free <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function TierCard({ t, annual }) {
  const price = annual ? Math.round(t.price * 0.8) : t.price;
  return (
    <div
      data-testid={`tier-card-${t.id}`}
      className={`rounded-2xl p-7 ${t.highlight ? "bg-navy text-white border border-gold/40 shadow-2xl scale-[1.02]" : "bg-white border border-slate-200 shadow-sm"} transition-all`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-xs font-bold uppercase tracking-[0.22em] ${t.highlight ? "text-gold-light" : "text-gold-dark"}`}>{t.name}</span>
        {t.highlight && <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-gold-light text-navy">Most popular</span>}
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-heading text-5xl">${price}</span>
        <span className={`text-sm ${t.highlight ? "text-white/60" : "text-slate-500"}`}>/mo</span>
      </div>
      <p className={`text-sm mt-2 ${t.highlight ? "text-white/70" : "text-slate-500"}`}>{t.blurb}</p>
      <ul className="mt-6 space-y-2.5 text-sm">
        <li className="flex items-start gap-2"><Star size={14} className={t.highlight ? "text-gold-light mt-0.5" : "text-gold-dark mt-0.5"} /><span>{t.invites} invites</span></li>
        <li className="flex items-start gap-2"><Star size={14} className={t.highlight ? "text-gold-light mt-0.5" : "text-gold-dark mt-0.5"} /><span>EarnedMail: {t.email}</span></li>
        <li className="flex items-start gap-2"><Star size={14} className={t.highlight ? "text-gold-light mt-0.5" : "text-gold-dark mt-0.5"} /><span>EarnedSend: {t.sms}</span></li>
        <li className="flex items-start gap-2"><Star size={14} className={t.highlight ? "text-gold-light mt-0.5" : "text-gold-dark mt-0.5"} /><span>AI: {t.ai}</span></li>
        <li className="flex items-start gap-2"><Star size={14} className={t.highlight ? "text-gold-light mt-0.5" : "text-gold-dark mt-0.5"} /><span>{t.domains} domains</span></li>
      </ul>
      <Link
        to="/dashboard"
        className={`block text-center mt-8 px-5 py-3 rounded-full font-bold ${t.highlight ? "bg-gradient-to-r from-gold-light via-gold to-gold-dark text-navy" : "bg-navy text-white hover:bg-navy-light"} transition-colors`}
      >
        {t.price === 0 ? "Start free" : "Start trial"}
      </Link>
    </div>
  );
}
