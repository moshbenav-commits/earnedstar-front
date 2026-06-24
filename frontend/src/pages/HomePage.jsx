import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles, Shield, FileText, Lock, Scale, Mail, MessageSquareText, Coins, Search, AlertTriangle, X, Quote } from "lucide-react";
import MarketingNav from "../components/layout/MarketingNav";
import MarketingFooter from "../components/layout/MarketingFooter";
import EarnedStarMark from "../components/brand/EarnedStarMark";
import { getJSON } from "../lib/api";

// Fixed-width animated counter
function TickingNumber({ value, prefix = "", suffix = "" }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const dur = 1600;
    const from = display;
    const to = value;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps
  return <span className="font-num tabular-nums">{prefix}{display.toLocaleString()}{suffix}</span>;
}

const PROMISES = [
  { num: "I", icon: Shield, t: "Verified", s: "Every review tied to a real, fulfilled order. Never an open form. Never an exception." },
  { num: "II", icon: FileText, t: "Auditable", s: "Every star ships with a public Trust Receipt. Order hash, identity tier, fraud signals — all readable by anyone." },
  { num: "III", icon: Lock, t: "Portable", s: "Your reviews are your data. One-click export to JSON-LD or CSV. They survive your cancellation. Forever." },
  { num: "IV", icon: Scale, t: "Fair", s: "Flat pricing. Multi-domain included. No pay-to-protect schemes. Negative reviews never bought, never buried." },
];

const COMPARE_ROWS = [
  ["Verified-by-purchase only", true, false, "partial", false],
  ["Public Trust Receipt", true, false, false, false],
  ["Public Moderation Ledger", true, false, false, false],
  ["24h dispute SLA, public counter", true, false, false, false],
  ["AI Smart-Reply on entry plan", true, "enterprise", "premium", false],
  ["Native email + SMS", true, false, "discontinued 2025", false],
  ["Multi-domain on one plan", true, "per-domain", false, false],
  ["Portable reviews — yours forever", true, false, false, false],
  ["Flat pricing, no annual lock-in", true, false, "volume-based", "limited"],
  ["Starts at", "Free / $29", "$199", "$79", "Free / $15"],
];

const PRESS = ["TechCrunch", "Modern Retail", "The Hustle", "Retail Dive", "Shopify", "Practical Ecommerce", "Inc.", "Bloomberg"];

export default function HomePage() {
  const [counter, setCounter] = useState({ verified_reviews: 0, fraud_blocked_this_month: 0, avg_dispute_sla_hours: 0, reviews_ransomed: 0 });
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try { const data = await getJSON("/trust-counter"); if (mounted) setCounter(data); } catch (e) { /* noop */ }
    };
    load();
    const t = setInterval(load, 9000);
    return () => { mounted = false; clearInterval(t); };
  }, []);

  return (
    <div className="bg-cream min-h-screen text-ink antialiased">
      <MarketingNav dark={true} />

      {/* HERO --- editorial luxury, dark ink */}
      <section data-testid="hero-section" className="relative bg-ink text-white overflow-hidden -mt-16 pt-16">
        <div className="absolute inset-0 grain-overlay" />
        <div className="absolute inset-0 ring-light pointer-events-none" />
        {/* radial gold glow */}
        <div className="absolute -top-40 -right-32 w-[680px] h-[680px] rounded-full opacity-40" style={{ background: "radial-gradient(circle at 30% 30%, rgba(245,158,11,0.55) 0%, transparent 60%)" }} />
        <div className="absolute bottom-0 left-0 w-[420px] h-[420px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, rgba(253,230,138,0.45) 0%, transparent 60%)" }} />

        {/* Masthead bar */}
        <div className="relative border-b border-white/10">
          <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 py-3 flex items-center justify-between text-[10px] smallcaps text-white/40">
            <span>Manifesto · Edition I</span>
            <span className="hidden sm:inline">EarnedStar &mdash; A Trust Manifesto for E-Commerce</span>
            <span className="font-num tabular-nums">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 py-20 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative">
          <div className="lg:col-span-7 space-y-9">
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex items-center gap-3">
              <span className="w-10 h-px bg-gold/70" />
              <span className="text-[10px] smallcaps text-gold-light">The Trust Stack · Post-Yotpo Era</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-white text-[clamp(3rem,7vw,6.5rem)] tracking-tight leading-[0.95] text-balance"
            >
              Reviews that{" "}
              <em className="italic text-gold-light underline-hand">earned</em>
              <br />their place &mdash; and{" "}
              <em className="italic text-gold-light underline-hand">prove</em> it.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.7 }}
              className="font-body text-lg sm:text-xl text-white/72 max-w-xl leading-[1.55] text-pretty"
            >
              The only e&#8209;commerce review platform where every star is order&#8209;verified, AI&#8209;fraud&#8209;audited,
              and publicly provable. Bundled with native email, SMS, and loyalty &mdash; at flat prices that don&apos;t
              punish you for growing.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link
                to="/dashboard"
                data-testid="hero-cta-primary"
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-ink font-bold gold-foil shadow-[0_18px_40px_-12px_rgba(245,158,11,0.5)] hover:shadow-[0_24px_50px_-12px_rgba(245,158,11,0.7)] transition-all"
              >
                See a live merchant
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/yotpo-refugees"
                data-testid="hero-cta-secondary"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/20 text-white font-semibold hover:bg-white/8 hover:border-white/35 transition-colors backdrop-blur-sm"
              >
                <Sparkles size={14} className="text-gold-light" /> Yotpo killed your email? Migrate free
              </Link>
            </motion.div>

            <div className="pt-6 flex items-center gap-4 text-[11px] text-white/40">
              <span className="smallcaps">Trusted by merchants in</span>
              <div className="flex items-center gap-3 font-num tabular-nums">
                <span>14 verticals</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>22 countries</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>1 promise</span>
              </div>
            </div>
          </div>

          {/* Right column — origami badge with orbiting gold ring */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* outer orbiting ring */}
              <div className="absolute -inset-12 animate-orbit pointer-events-none">
                <svg viewBox="0 0 400 400" className="w-full h-full">
                  <defs>
                    <linearGradient id="orbit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.55" />
                      <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#92400E" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <circle cx="200" cy="200" r="180" fill="none" stroke="url(#orbit-grad)" strokeWidth="1.5" strokeDasharray="3 8" />
                </svg>
              </div>
              {/* inner glow */}
              <div className="absolute -inset-8 bg-gradient-to-tr from-gold-dark/50 via-gold/30 to-transparent blur-3xl" />
              <div className="relative animate-float">
                <EarnedStarMark size={360} variant="navy" center="es" />
              </div>
              {/* small notations */}
              <div className="hidden lg:block absolute -left-6 top-1/3 text-right">
                <div className="text-[10px] smallcaps text-gold-light/80">Origami Mark</div>
                <div className="font-num text-[10px] text-white/40 mt-0.5">5° fold · est. 2026</div>
              </div>
              <div className="hidden lg:block absolute -right-2 bottom-8 text-left">
                <div className="text-[10px] smallcaps text-gold-light/80">Trust Stamp</div>
                <div className="font-num text-[10px] text-white/40 mt-0.5">ES VERIFIED</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Trust receipts ticker — editorial newspaper strip */}
        <div className="relative border-t border-white/10 bg-ink-deep/40 backdrop-blur-sm">
          <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              ["Verified reviews", counter.verified_reviews, null, "live ledger"],
              ["Fraud attempts blocked", counter.fraud_blocked_this_month, null, "this month"],
              ["Avg. dispute SLA", counter.avg_dispute_sla_hours, "h", "Trustpilot: 7&ndash;14 days"],
              ["Reviews ransomed", counter.reviews_ransomed, null, "your data, forever"],
            ].map(([label, val, suffix, sub], i) => (
              <div key={i} data-testid={`counter-${i}`} className="relative">
                <div className="absolute -left-2 top-0 w-px h-full bg-gradient-to-b from-gold/0 via-gold/60 to-gold/0" />
                <div className="pl-2">
                  <div className="font-heading text-white text-[clamp(2rem,3.5vw,3rem)] leading-none tracking-tight">
                    <TickingNumber value={val} suffix={suffix || ""} />
                  </div>
                  <div className="text-[9.5px] smallcaps text-gold-light mt-2.5">{label}</div>
                  <div className="text-[10px] text-white/35 mt-1" dangerouslySetInnerHTML={{ __html: sub }} />
                </div>
              </div>
            ))}
          </div>
          {/* As-seen-in marquee */}
          <div className="border-t border-white/10">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 py-4 flex items-center gap-6 marquee-mask overflow-hidden">
              <span className="text-[10px] smallcaps text-white/45 shrink-0">As seen in</span>
              <div className="flex items-center gap-10 animate-ticker whitespace-nowrap">
                {[...PRESS, ...PRESS].map((p, i) => (
                  <span key={i} className="font-heading italic text-white/45 text-lg tracking-tight">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EDITORIAL PULL QUOTE / Founder note */}
      <section className="bg-cream py-24 md:py-36 relative overflow-hidden paper-grain">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-10 lg:px-14 relative">
          <div className="flex items-center gap-4 mb-10">
            <span className="text-[10px] smallcaps text-gold-dark">Editor&apos;s Note</span>
            <span className="flex-1 magazine-rule text-ink/20" />
            <span className="text-[10px] smallcaps text-ink/40">Chapter 01</span>
          </div>

          <div className="relative pl-12 md:pl-20">
            <Quote className="absolute -left-2 top-2 text-gold-dark/30" size={64} strokeWidth={0.8} />
            <blockquote className="font-heading text-[clamp(2rem,4vw,3.4rem)] leading-[1.08] italic text-ink text-balance">
              Stars used to mean something. Somewhere between the affiliate marketers,
              the fake-review services, and the &ldquo;pay-to-protect&rdquo; quotas, they stopped. We
              built EarnedStar to put them back where they belong: <em className="not-italic font-normal gold-text">earned, audited, and yours</em>.
            </blockquote>
            <div className="mt-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-light to-gold-dark flex items-center justify-center font-heading italic text-ink text-xl">M</div>
              <div>
                <div className="font-body font-bold text-ink tracking-tight">M. Benav</div>
                <div className="text-xs text-ink/50">Founder &amp; CEO &mdash; EarnedStar</div>
              </div>
              <div className="hidden md:block ml-6 text-[10px] smallcaps text-ink/40 font-num tabular-nums">№ 001 · 2026</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 PROMISES MANUSCRIPT */}
      <section data-testid="manifesto-section" className="py-24 md:py-32 bg-vellum relative overflow-hidden paper-grain border-y border-ink/8">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative">
          <div className="lg:col-span-4 lg:sticky lg:top-24 self-start">
            <div className="text-[10px] smallcaps text-gold-dark">The Manifesto</div>
            <h2 className="font-heading text-[clamp(2.5rem,4.5vw,4rem)] leading-[1.02] mt-4 tracking-tight text-balance">
              Four promises. <em className="italic text-gold-dark underline-hand">Publicly</em>.
            </h2>
            <p className="font-body text-base text-ink/65 mt-6 leading-[1.6] max-w-md">
              No platform in this category has ever committed to truth publicly. We are. Every promise below
              becomes a feature you can audit, share, and hold us to &mdash; in the open.
            </p>
            <div className="mt-8 flex items-center gap-3 text-[10px] smallcaps text-ink/40">
              <span className="w-8 h-px bg-ink/20" /> est. January 2026
            </div>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink/10">
            {PROMISES.map(({ num, icon: Icon, t, s }, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-cream-light p-10 relative group"
              >
                <div className="flex items-start justify-between">
                  <span className="font-heading italic text-[2.2rem] text-gold-dark/70 leading-none">{num}.</span>
                  <Icon className="text-ink/30 group-hover:text-gold-dark transition-colors" size={22} strokeWidth={1.4} />
                </div>
                <h3 className="font-heading text-4xl italic text-ink mt-6 leading-tight">{t}</h3>
                <div className="w-10 h-px bg-gold-dark/40 mt-4" />
                <p className="font-body text-ink/65 mt-4 leading-[1.65] text-pretty">{s}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON — courtroom exhibit */}
      <section data-testid="comparison-section" className="bg-cream py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-14 items-end">
            <div className="lg:col-span-7">
              <div className="text-[10px] smallcaps text-gold-dark mb-3">Receipts &mdash; vs. theirs</div>
              <h2 className="font-heading text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] tracking-tight text-balance">
                Look at the <em className="italic text-gold-dark">whole</em> table.
                <br />Not the brochure.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <p className="font-body text-sm text-ink/55 leading-[1.65] text-pretty">
                Sourced from competitor docs, G2, and merchant complaint threads on Reddit (2026).
                Updated continuously. We&apos;ll correct any line within 24 hours if you flag it &mdash; that&apos;s a public
                promise, not a button.
              </p>
            </div>
          </div>

          <div className="vellum-card rounded-2xl overflow-hidden gilded-edge">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[820px]">
                <thead>
                  <tr className="border-b-2 border-ink">
                    <th className="p-5 text-[10px] smallcaps text-ink/45 w-[34%]">Feature</th>
                    <th className="p-5 font-heading text-2xl italic text-ink tracking-tight bg-gold-light/20">EarnedStar</th>
                    <th className="p-5 font-body text-sm font-bold text-ink/65">Trustpilot</th>
                    <th className="p-5 font-body text-sm font-bold text-ink/65">Yotpo</th>
                    <th className="p-5 font-body text-sm font-bold text-ink/65">Judge.me</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row, i) => (
                    <tr key={i} className="border-b border-ink/8 hover:bg-cream-dark/30 transition-colors">
                      <td className="p-5 font-body text-sm text-ink/85 font-medium">{row[0]}</td>
                      {row.slice(1).map((cell, j) => (
                        <td key={j} className={`p-5 font-body text-sm ${j === 0 ? "bg-gold-light/10" : ""}`}>
                          {cell === true ? (
                            <span className="inline-flex items-center gap-1.5 text-ink font-bold">
                              <span className="w-5 h-5 rounded-full gold-foil flex items-center justify-center"><Check size={11} className="text-ink" strokeWidth={3} /></span>
                              Yes
                            </span>
                          ) : cell === false ? (
                            <span className="inline-flex items-center gap-1.5 text-ink/35"><X size={14} strokeWidth={1.5} /> No</span>
                          ) : (
                            <span className="text-ink/70 italic">{cell}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* YOTPO EXODUS */}
      <section className="bg-ink text-white py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 grain-overlay opacity-60" />
        <div className="absolute -top-32 right-0 w-[520px] h-[520px] opacity-30" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.55) 0%, transparent 60%)" }} />
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-gold" />
              <span className="text-[10px] smallcaps text-gold-light">The Yotpo Exodus</span>
            </div>
            <h2 className="font-heading text-[clamp(2.5rem,5vw,4.8rem)] leading-[0.98] tracking-tight text-balance">
              Yotpo killed Email &amp; SMS on <em className="italic text-gold-light underline-hand">Dec 31, 2025</em>.
              <br className="hidden sm:block" /> We built the replacement.
            </h2>
            <p className="font-body text-lg text-white/72 mt-8 max-w-2xl leading-[1.55] text-pretty">
              EarnedStar Reviews + EarnedMail + EarnedSend + EarnedLoyalty &mdash; one platform, flat price,
              fully integrated. Replace Klaviyo, Attentive, and Yotpo with a single <span className="font-num text-gold-light">$99</span>/month plan.
            </p>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/8">
              {[
                { i: Mail, t: "EarnedMail", s: "Drag-drop campaigns, review-triggered flows, behavioral segments." },
                { i: MessageSquareText, t: "EarnedSend", s: "Native SMS plus WhatsApp and Apple Business Messages." },
                { i: Coins, t: "EarnedLoyalty", s: "Points, referrals, VIP rewards &mdash; native to your review data." },
                { i: Sparkles, t: "AI Layer", s: "Smart-reply, summaries, sentiment, fraud &mdash; included." },
              ].map((m, idx) => (
                <div key={idx} className="bg-ink/40 backdrop-blur-sm p-6 border border-white/10">
                  <m.i className="text-gold-light" size={20} />
                  <div className="font-heading italic text-2xl mt-4 text-white">{m.t}</div>
                  <p className="font-body text-sm text-white/55 mt-2 leading-[1.6]">{m.s}</p>
                </div>
              ))}
            </div>
            <Link
              to="/yotpo-refugees"
              data-testid="yotpo-refugees-cta"
              className="inline-flex items-center gap-2.5 mt-12 px-6 py-3.5 rounded-full bg-white text-ink font-bold hover:shadow-2xl transition-shadow group"
            >
              Migrate from Yotpo &middot; 3 months free
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="lg:col-span-5">
            <div className="vellum-card text-ink rounded-2xl p-8 shadow-2xl gilded-edge relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full gold-foil opacity-20" />
              <div className="flex items-center gap-2 relative">
                <AlertTriangle size={14} className="text-gold-dark" />
                <span className="text-[10px] smallcaps text-gold-dark">Bill calculator</span>
              </div>
              <h3 className="font-heading text-3xl italic mt-3 relative">Your current stack</h3>
              <ul className="mt-6 space-y-3 font-body text-sm relative">
                {[
                  ["Klaviyo &middot; Email · 10K subs", "$150"],
                  ["Attentive &middot; SMS · 10K sends", "$300"],
                  ["Yotpo Reviews Pro", "$199"],
                  ["Smile.io Loyalty", "$49"],
                ].map(([l, p]) => (
                  <li key={l} className="flex justify-between items-baseline border-b border-ink/8 pb-3">
                    <span className="text-ink/65" dangerouslySetInnerHTML={{ __html: l }} />
                    <span className="font-num font-bold tabular-nums">{p}<span className="text-ink/40">/mo</span></span>
                  </li>
                ))}
                <li className="flex justify-between items-baseline pt-2">
                  <span className="font-bold">Total</span>
                  <span className="font-num font-bold text-2xl tabular-nums">$698<span className="text-ink/40 text-sm font-body">/mo</span></span>
                </li>
              </ul>
              <div className="bg-ink text-white -mx-8 -mb-8 mt-7 rounded-b-2xl p-7 relative ring-light">
                <div className="text-[10px] smallcaps text-gold-light">EarnedStar Growth</div>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="font-heading text-6xl tracking-tight">$99</span>
                  <span className="text-white/55 text-sm">/mo &middot; all-in</span>
                </div>
                <div className="mt-4 text-sm text-white/65">
                  You save{" "}
                  <span className="gold-text font-num font-bold text-base">$599/mo</span>{" "}
                  &middot; <span className="font-num text-white/50">$7,188/yr</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AUDIT TOOL TEASER */}
      <section className="bg-cream py-24 md:py-32 relative overflow-hidden paper-grain">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-10 lg:px-14 grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative">
          <div className="md:col-span-7">
            <span className="text-[10px] smallcaps text-gold-dark">A free public tool</span>
            <h3 className="font-heading text-[clamp(2.2rem,4vw,3.6rem)] mt-4 leading-[1.05] tracking-tight text-balance">
              Paste any Trustpilot or Yotpo profile.
              <br /><em className="italic text-gold-dark underline-hand">We&apos;ll estimate how many reviews are fake.</em>
            </h3>
            <p className="font-body text-ink/65 mt-6 leading-[1.65] max-w-lg text-pretty">
              The Review Audit runs an AI forensic scan and returns a shareable PDF report &mdash;
              language clusters, timing anomalies, reviewer history patterns.
              We do this free because we have nothing to hide.
            </p>
            <Link
              to="/audit"
              data-testid="audit-tool-cta"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3.5 rounded-full bg-ink text-white font-semibold hover:bg-ink-soft transition-colors group"
            >
              <Search size={16} /> Run a Review Audit
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="md:col-span-5 flex justify-center relative">
            <div className="absolute -inset-8 bg-gradient-to-tr from-gold-dark/15 via-gold/12 to-transparent blur-2xl" />
            <div className="relative animate-float">
              <EarnedStarMark size={240} variant="gold" center="check" />
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING IMPRINT */}
      <section className="bg-ink text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 grain-overlay opacity-50" />
        <div className="max-w-[1100px] mx-auto px-6 sm:px-10 lg:px-14 relative text-center">
          <div className="text-[10px] smallcaps text-gold-light mb-5">A trust manifesto</div>
          <p className="font-heading italic text-[clamp(1.5rem,2.6vw,2.2rem)] leading-[1.4] text-white/85 max-w-3xl mx-auto text-balance">
            We&apos;re not building another review widget. We&apos;re building the trust layer
            that e&#8209;commerce should have had from the start.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="w-12 h-px bg-gold/50" />
            <span className="text-[10px] smallcaps text-white/40">Volume I &middot; Edition 2026</span>
            <span className="w-12 h-px bg-gold/50" />
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
