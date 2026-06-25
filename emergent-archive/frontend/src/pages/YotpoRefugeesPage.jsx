import React from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight, AlertTriangle, Wallet, Combine, Mail, MessageSquareText, Coins } from "lucide-react";
import MarketingNav from "../components/layout/MarketingNav";
import MarketingFooter from "../components/layout/MarketingFooter";

export default function YotpoRefugeesPage() {
  return (
    <div className="bg-cream min-h-screen text-navy">
      <MarketingNav />
      <section className="bg-navy text-white pt-24 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 grain-overlay opacity-50" />
        <div className="absolute -top-20 -right-32 w-[520px] h-[520px] rounded-full opacity-25" style={{ background: "radial-gradient(circle, #F59E0B 0%, transparent 65%)" }} />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <span className="font-body text-xs uppercase tracking-[0.28em] text-gold-light font-bold">For Yotpo refugees</span>
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl mt-4 tracking-tight leading-[1.02] text-balance">
              Your Email and SMS just got <em className="italic text-gold-light">deleted</em>.
              <br />Move them home in one click.
            </h1>
            <p className="font-body text-lg text-white/75 mt-8 max-w-2xl leading-relaxed">
              Yotpo turned off native Email and SMS on December 31, 2025. You shouldn&apos;t have to
              rebuild your stack across Klaviyo + Attentive + Yotpo Reviews to recover. EarnedStar runs
              all of it on one $99/month plan — and ports your data in 1 click.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/dashboard" data-testid="yr-cta-primary" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-navy font-bold shadow-xl">
                Migrate in 1 click <ArrowRight size={16} />
              </Link>
              <Link to="/audit" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white font-semibold hover:bg-white/10">
                Run a free audit first
              </Link>
            </div>
            <div className="mt-12 inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 backdrop-blur-sm">
              <AlertTriangle size={14} className="text-gold-light" />
              <span className="text-xs font-body text-white/80">First 3 months free for Yotpo migrations · No setup fees</span>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-white text-navy rounded-2xl p-7 shadow-2xl">
              <div className="font-body text-xs uppercase tracking-[0.22em] text-gold-dark font-bold">Side-by-side</div>
              <h3 className="font-heading text-3xl mt-2">Then → Now</h3>
              <table className="w-full mt-5 text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    <th className="text-left py-2 font-bold">Tool</th>
                    <th className="text-right py-2 font-bold">Yotpo era</th>
                    <th className="text-right py-2 font-bold">EarnedStar</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Reviews", "$199/mo", "Included"],
                    ["Email", "$150/mo (Klaviyo)", "Included"],
                    ["SMS", "$300/mo (Attentive)", "Included"],
                    ["Loyalty", "$49/mo (Smile)", "Included"],
                    ["Vendors to manage", "4", "1"],
                    ["Annual lock-in?", "Yes", "No"],
                  ].map(([a, b, c]) => (
                    <tr key={a} className="border-t border-slate-100">
                      <td className="py-2.5 text-slate-700">{a}</td>
                      <td className="py-2.5 text-right text-slate-500">{b}</td>
                      <td className="py-2.5 text-right font-bold text-navy">{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-navy text-white -mx-7 -mb-7 mt-6 rounded-b-2xl p-6">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-gold-light font-bold">You save</div>
                    <div className="font-heading text-5xl mt-1">$7,188<span className="text-base text-white/60 font-body ml-1">/yr</span></div>
                  </div>
                  <Wallet className="text-gold-light" size={42} strokeWidth={1.3} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-STEP */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <span className="font-body text-xs uppercase tracking-[0.22em] text-gold-dark font-bold">How migration works</span>
          <h2 className="font-heading text-4xl sm:text-5xl mt-3 tracking-tight">Three steps. <em className="italic text-gold-dark">No engineer required.</em></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { i: Combine, t: "Export from Yotpo", s: "Paste your Yotpo export CSV into the importer. We auto-map fields including review-trigger flows.", n: "01" },
              { i: Mail, t: "Reconnect your store", s: "OAuth into Shopify, Woo, or BigCommerce. EarnedStar reuses order webhooks for verified-purchase flows.", n: "02" },
              { i: Coins, t: "Flip the switch", s: "Pause Klaviyo + Attentive + Yotpo. EarnedMail, EarnedSend, and EarnedLoyalty are already running. First 3 months free.", n: "03" },
            ].map(({ i: Icon, t, s, n }) => (
              <div key={t} className="bg-white border border-slate-200 rounded-2xl p-7 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <Icon className="text-gold-dark" size={26} strokeWidth={1.6} />
                  <span className="font-body text-xs font-bold tracking-[0.24em] text-slate-400">STEP · {n}</span>
                </div>
                <h3 className="font-heading text-3xl italic mt-4 text-navy">{t}</h3>
                <p className="font-body text-slate-600 mt-3 leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMISES STRIP */}
      <section className="bg-white py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            "3 months free",
            "No setup fees",
            "Field-by-field mapping",
            "Your data stays portable",
          ].map((t) => (
            <div key={t} className="flex items-center gap-3">
              <Check className="text-gold-dark" size={20} />
              <span className="font-body font-bold text-navy">{t}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-cream text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h3 className="font-heading text-4xl sm:text-5xl tracking-tight">Stop renting your stack. <em className="italic text-gold-dark">Own it.</em></h3>
          <Link to="/dashboard" data-testid="yr-cta-bottom" className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-navy text-white font-bold hover:bg-navy-light">
            Start your migration <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
