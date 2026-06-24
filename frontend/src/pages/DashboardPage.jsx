import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, Sparkles, ShieldCheck, Mail, MessageSquareText, Coins, BarChart3, Search, Loader2, Send, Settings as SettingsIcon, Users, Layout, ArrowUpRight, Activity, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { EarnedStarWordmark } from "../components/brand/EarnedStarMark";
import { getJSON, postJSON } from "../lib/api";

const SECTIONS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "sentiment", label: "Sentiment", icon: Activity },
  { id: "mail", label: "EarnedMail", icon: Mail },
  { id: "send", label: "EarnedSend", icon: MessageSquareText },
  { id: "loyalty", label: "EarnedLoyalty", icon: Coins },
  { id: "audience", label: "Audience", icon: Users },
  { id: "widgets", label: "Widgets", icon: Layout },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

const REV_TREND = [
  { d: "Wk 1", v: 8 }, { d: "Wk 2", v: 17 }, { d: "Wk 3", v: 26 }, { d: "Wk 4", v: 41 },
  { d: "Wk 5", v: 58 }, { d: "Wk 6", v: 79 }, { d: "Wk 7", v: 104 }, { d: "Wk 8", v: 132 },
  { d: "Wk 9", v: 158 }, { d: "Wk 10", v: 172 },
];

const RATING_DIST = [
  { rating: "5★", count: 124 }, { rating: "4★", count: 31 }, { rating: "3★", count: 9 }, { rating: "2★", count: 5 }, { rating: "1★", count: 3 },
];

const FLOWS = [
  { name: "Post-purchase invite (7d after delivery)", channel: "Email + SMS", sent: 387, opened: 71, replied: 154, status: "Active" },
  { name: "Win-back · 90 days no order", channel: "Email", sent: 218, opened: 49, replied: 31, status: "Active" },
  { name: "Low-rating recovery", channel: "Email", sent: 14, opened: 92, replied: 11, status: "Active" },
  { name: "NPS Promoter referral", channel: "SMS", sent: 92, opened: 87, replied: 22, status: "Draft" },
];

const CAMPAIGNS = [
  { name: "Spring Diesel Sale", channel: "Email", sent: "2,418", opened: "42%", clicked: "9.1%", revenue: "$18,420" },
  { name: "Powerstroke Reorder Window", channel: "SMS", sent: "612", opened: "94%", clicked: "16.4%", revenue: "$11,200" },
  { name: "Reman Q1 Leaders badge", channel: "Email", sent: "3,902", opened: "58%", clicked: "12.7%", revenue: "$3,840" },
];

export default function DashboardPage() {
  const [section, setSection] = useState("overview");
  const [reviews, setReviews] = useState([]);
  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [replyState, setReplyState] = useState({}); // id -> { loading, text }

  useEffect(() => {
    (async () => {
      try {
        const r = await getJSON("/stores/reman-transmissions/reviews");
        setReviews(r);
      } catch (e) { /* noop */ }
    })();
  }, []);

  const generateTopics = async () => {
    setTopicsLoading(true);
    try {
      const data = await postJSON("/ai/sentiment-topics", { store_slug: "reman-transmissions" });
      setTopics(data.topics || []);
    } finally {
      setTopicsLoading(false);
    }
  };

  const draftReply = async (reviewId) => {
    setReplyState((s) => ({ ...s, [reviewId]: { loading: true } }));
    try {
      const data = await postJSON("/ai/smart-reply", { review_id: reviewId, tone: "warm" });
      setReplyState((s) => ({ ...s, [reviewId]: { loading: false, text: data.reply } }));
    } catch (e) {
      setReplyState((s) => ({ ...s, [reviewId]: { loading: false, text: "(AI temporarily unavailable)" } }));
    }
  };

  return (
    <div className="min-h-screen bg-cream text-navy flex">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-navy text-white border-r border-white/10 shrink-0">
        <div className="px-6 py-5 border-b border-white/10">
          <EarnedStarWordmark variant="white" showTag={false} />
          <div className="mt-3 text-xs text-white/60">Reman Transmissions <span className="text-gold-light">· Growth $99</span></div>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              data-testid={`nav-${s.id}`}
              onClick={() => setSection(s.id)}
              className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${section === s.id ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
            >
              <span className="inline-flex items-center gap-2.5"><s.icon size={15} /> {s.label}</span>
              {section === s.id && <ChevronRight size={14} className="text-gold-light" />}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link to="/" className="text-xs text-white/50 hover:text-white">← Back to site</Link>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 min-w-0">
        {/* TOPBAR */}
        <header className="bg-white border-b border-slate-200 px-6 sm:px-10 py-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-body text-slate-500">Merchant dashboard</div>
            <h1 className="font-heading text-2xl tracking-tight italic">Reman Transmissions</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-cream border border-slate-200 rounded-full px-3 py-1.5 text-xs">
              <Search size={13} className="text-slate-400" />
              <input placeholder="Search reviews, customers…" className="bg-transparent outline-none text-sm w-56" />
            </div>
            <button className="px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-navy">Invite reviews</button>
          </div>
        </header>

        <div className="p-6 sm:p-10 max-w-[1200px]">
          {/* OVERVIEW */}
          {section === "overview" && (
            <div className="space-y-8">
              <KPIGrid />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-heading text-2xl italic">Verified review volume</h3>
                    <span className="text-xs text-slate-500">Past 10 weeks · cumulative</span>
                  </div>
                  <div className="h-56">
                    <ResponsiveContainer>
                      <LineChart data={REV_TREND}>
                        <CartesianGrid stroke="#F1F5F9" />
                        <XAxis dataKey="d" tickLine={false} axisLine={false} fontSize={11} stroke="#94A3B8" />
                        <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="#94A3B8" />
                        <Tooltip contentStyle={{ background: "#0F2044", color: "white", border: "none", borderRadius: 8 }} />
                        <Line type="monotone" dataKey="v" stroke="#B45309" strokeWidth={2.5} dot={{ fill: "#F59E0B", r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h3 className="font-heading text-2xl italic mb-2">Rating distribution</h3>
                  <div className="h-56">
                    <ResponsiveContainer>
                      <BarChart data={RATING_DIST}>
                        <CartesianGrid stroke="#F1F5F9" />
                        <XAxis dataKey="rating" tickLine={false} axisLine={false} fontSize={11} stroke="#94A3B8" />
                        <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="#94A3B8" />
                        <Tooltip contentStyle={{ background: "#0F2044", color: "white", border: "none", borderRadius: 8 }} />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                          {RATING_DIST.map((r, i) => <rect key={i} fill="#F59E0B" />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <ConversionAttribution />
            </div>
          )}

          {/* REVIEWS */}
          {section === "reviews" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-3xl italic">Recent reviews</h2>
                <span className="text-xs text-slate-500">AI Smart-Reply suggests personalized responses — edit and send in 1 click.</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
                {reviews.slice(0, 6).map((r, idx) => (
                  <div key={r.id} data-testid={`dash-review-${idx}`} className="p-5 hover:bg-cream/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center text-sm font-bold">{r.author_initial}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold">{r.author_name}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={12} className={i <= r.rating ? "fill-current text-amber-500" : "text-slate-200"} />)}
                          </div>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full ring-1 ring-emerald-200"><ShieldCheck size={10} /> Verified · Fraud {r.fraud_score}/100</span>
                        </div>
                        <h4 className="font-heading italic text-lg mt-1">{r.title}</h4>
                        <p className="font-body text-sm text-slate-600 mt-1 line-clamp-2">{r.body}</p>
                        {replyState[r.id]?.text && (
                          <div className="mt-3 bg-gradient-to-br from-amber-50/40 to-white border border-amber-200/40 rounded-lg p-3 text-sm text-slate-700">
                            <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-gold-dark mb-1.5 inline-flex items-center gap-1.5"><Sparkles size={11} /> AI Smart-Reply</div>
                            <textarea
                              defaultValue={replyState[r.id].text}
                              rows={3}
                              className="w-full bg-white border border-slate-200 rounded-md p-2 text-sm focus:outline-none focus:border-navy"
                            />
                            <div className="flex justify-end gap-2 mt-2">
                              <button className="text-xs text-slate-500 hover:text-navy">Edit</button>
                              <button className="text-xs font-bold inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-navy text-white hover:bg-navy-light">Send <Send size={11} /></button>
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <button
                          data-testid={`smart-reply-${idx}`}
                          disabled={replyState[r.id]?.loading}
                          onClick={() => draftReply(r.id)}
                          className="text-xs font-bold inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-navy disabled:opacity-50"
                        >
                          {replyState[r.id]?.loading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                          {replyState[r.id]?.loading ? "Drafting…" : "Smart-Reply"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SENTIMENT */}
          {section === "sentiment" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-3xl italic">Sentiment topic clusters</h2>
                  <p className="text-sm text-slate-500 mt-1">Powered by Gemini 3 Flash · auto-detected from your verified review corpus.</p>
                </div>
                <button data-testid="generate-topics" onClick={generateTopics} disabled={topicsLoading} className="px-4 py-2 rounded-full text-sm font-bold bg-navy text-white inline-flex items-center gap-2 disabled:opacity-50">
                  {topicsLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  {topicsLoading ? "Analyzing…" : "Re-analyze"}
                </button>
              </div>
              {topics.length === 0 && !topicsLoading && (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
                  <Sparkles className="mx-auto text-gold-dark mb-3" size={28} />
                  <p className="text-sm text-slate-500">Click <span className="font-bold">Re-analyze</span> to surface what customers actually talk about.</p>
                </div>
              )}
              {topics.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topics.map((t, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-heading text-2xl italic">{t.topic}</h4>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${t.sentiment === "positive" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : t.sentiment === "negative" ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200" : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"}`}>{t.sentiment}</span>
                      </div>
                      <div className="font-body text-3xl font-bold mt-2">{t.mentions}<span className="text-xs text-slate-500 ml-1 font-normal">mentions</span></div>
                      <p className="text-sm text-slate-600 italic mt-3 leading-relaxed">&quot;{t.example_quote}&quot;</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* EARNED MAIL */}
          {section === "mail" && <EarnedMailView />}
          {/* EARNED SEND */}
          {section === "send" && <EarnedSendView />}
          {/* LOYALTY */}
          {section === "loyalty" && <LoyaltyView />}
          {/* AUDIENCE */}
          {section === "audience" && <AudienceView />}
          {/* WIDGETS */}
          {section === "widgets" && <WidgetsView />}
          {/* SETTINGS */}
          {section === "settings" && <SettingsView />}
        </div>
      </div>
    </div>
  );
}

function KPIGrid() {
  const KPIS = [
    { label: "Verified reviews", v: "172", sub: "+11 this week", tone: "navy" },
    { label: "Avg rating", v: "4.8", sub: "162 · 5★ · 31 · 4★", tone: "gold" },
    { label: "Fraud blocked", v: "14", sub: "this month, AI-detected", tone: "navy" },
    { label: "Response rate", v: "96%", sub: "AI Smart-Reply helped 71%", tone: "navy" },
    { label: "Avg dispute SLA", v: "18h", sub: "well under 24h SLA", tone: "navy" },
    { label: "NPS Score", v: "74", sub: "best-in-class above 70", tone: "gold" },
    { label: "Attributed rev (Q1)", v: "$94.2K", sub: "review-view → purchase", tone: "navy" },
    { label: "Plan utilization", v: "32%", sub: "780/2,500 invites · 4,120 emails", tone: "navy" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {KPIS.map((k, i) => (
        <motion.div
          key={k.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-slate-500">{k.label}</div>
          <div className={`font-heading text-4xl mt-1 ${k.tone === "gold" ? "gold-text" : "text-navy"}`}>{k.v}</div>
          <div className="text-xs text-slate-500 mt-1">{k.sub}</div>
        </motion.div>
      ))}
    </div>
  );
}

function ConversionAttribution() {
  return (
    <div className="bg-navy text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute inset-0 grain-overlay opacity-40" />
      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] font-bold text-gold-light">Conversion attribution · this quarter</div>
          <div className="font-heading text-5xl mt-2">$94,234</div>
          <div className="text-sm text-white/70 mt-1">attributed revenue from review-view → purchase</div>
        </div>
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="font-heading text-2xl">7.4×</div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/50 mt-0.5">ROI vs $99 plan</div>
          </div>
          <div>
            <div className="font-heading text-2xl">+22%</div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/50 mt-0.5">Google CTR</div>
          </div>
          <div>
            <div className="font-heading text-2xl">+18%</div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/50 mt-0.5">Conv rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EarnedMailView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-3xl italic flex items-center gap-2"><Mail size={22} /> EarnedMail</h2>
          <p className="text-sm text-slate-500 mt-1">Email campaigns &amp; review-triggered flows. Replaces Klaviyo.</p>
        </div>
        <button className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-navy">New campaign</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          ["Sends this month", "12,840"],
          ["Open rate", "47.2%"],
          ["Click rate", "11.6%"],
        ].map(([l, v]) => (
          <div key={l} className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-slate-500">{l}</div>
            <div className="font-heading text-3xl mt-1 text-navy">{v}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-5 flex items-center justify-between border-b border-slate-200">
          <h3 className="font-heading text-2xl italic">Review-triggered flows</h3>
          <span className="text-xs text-slate-500">Behavioral segments tied to your verified review data</span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-cream">
            <tr className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              <th className="text-left p-4 font-bold">Flow</th>
              <th className="text-left p-4 font-bold">Channel</th>
              <th className="text-right p-4 font-bold">Sent</th>
              <th className="text-right p-4 font-bold">Open %</th>
              <th className="text-right p-4 font-bold">Replies</th>
              <th className="text-right p-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {FLOWS.map((f, i) => (
              <tr key={i} className="border-t border-slate-100 hover:bg-cream/40">
                <td className="p-4 font-bold text-navy">{f.name}</td>
                <td className="p-4 text-slate-600">{f.channel}</td>
                <td className="p-4 text-right">{f.sent}</td>
                <td className="p-4 text-right">{f.opened}%</td>
                <td className="p-4 text-right">{f.replied}</td>
                <td className="p-4 text-right">
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${f.status === "Active" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"}`}>{f.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-5 flex items-center justify-between border-b border-slate-200">
          <h3 className="font-heading text-2xl italic">Campaigns</h3>
          <span className="text-xs text-slate-500">Drag-drop builder · AI subject-line writer</span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-cream">
            <tr className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              <th className="text-left p-4 font-bold">Campaign</th>
              <th className="text-left p-4 font-bold">Channel</th>
              <th className="text-right p-4 font-bold">Sent</th>
              <th className="text-right p-4 font-bold">Opened</th>
              <th className="text-right p-4 font-bold">Clicked</th>
              <th className="text-right p-4 font-bold">Attributed $</th>
            </tr>
          </thead>
          <tbody>
            {CAMPAIGNS.map((c, i) => (
              <tr key={i} className="border-t border-slate-100 hover:bg-cream/40">
                <td className="p-4 font-bold text-navy">{c.name}</td>
                <td className="p-4 text-slate-600">{c.channel}</td>
                <td className="p-4 text-right">{c.sent}</td>
                <td className="p-4 text-right">{c.opened}</td>
                <td className="p-4 text-right">{c.clicked}</td>
                <td className="p-4 text-right font-bold gold-text">{c.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EarnedSendView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-3xl italic flex items-center gap-2"><MessageSquareText size={22} /> EarnedSend</h2>
          <p className="text-sm text-slate-500 mt-1">Native SMS, WhatsApp, Apple Business Messages. Replaces Attentive / Postscript.</p>
        </div>
        <button className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-navy">New SMS campaign</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          ["SMS sent (mo)", "612"],
          ["Delivery rate", "98.4%"],
          ["Click rate", "16.4%"],
          ["Avg reply time", "11m"],
        ].map(([l, v]) => (
          <div key={l} className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-slate-500">{l}</div>
            <div className="font-heading text-3xl mt-1 text-navy">{v}</div>
          </div>
        ))}
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="font-heading text-2xl italic mb-4">Recent SMS</h3>
        <div className="space-y-3">
          {[
            { to: "+1 (903) 555-0142", body: "Hi Mike — your 4L60E was delivered 7 days ago. Mind sharing a quick review? It helps fellow owners → es.gd/r/3xa2", time: "2h ago", status: "Delivered · clicked" },
            { to: "+1 (719) 555-0188", body: "Reman here. Your Ram 2500 install update — we'd love your feedback on the 68RFE. 1 minute, promise.", time: "9h ago", status: "Delivered" },
            { to: "+1 (832) 555-0123", body: "Thanks for the 5★, Brent! Here's $25 off your next order for the family: REMAN25", time: "1d ago", status: "Delivered · clicked" },
          ].map((m, i) => (
            <div key={i} className="border border-slate-200 rounded-xl p-4 bg-cream/40">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-navy">{m.to}</span>
                <span className="text-slate-500">{m.time} · {m.status}</span>
              </div>
              <p className="font-body text-sm mt-2 text-slate-700">{m.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LoyaltyView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-3xl italic flex items-center gap-2"><Coins size={22} /> EarnedLoyalty</h2>
        <span className="text-xs text-slate-500">Replaces Smile.io · tied to verified review data.</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          ["Members", "1,422"],
          ["Repeat rate", "31%"],
          ["Points issued", "184K"],
          ["Avg order lift", "+18%"],
        ].map(([l, v]) => (
          <div key={l} className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-slate-500">{l}</div>
            <div className="font-heading text-3xl mt-1 gold-text">{v}</div>
          </div>
        ))}
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="font-heading text-2xl italic mb-4">Reward rules</h3>
        <ul className="space-y-3 text-sm">
          {[
            ["Verified review submitted", "100 pts"],
            ["Photo or video review", "+50 pts"],
            ["Referral leads to order", "$25 credit"],
            ["Anniversary (1 yr customer)", "$15 credit"],
          ].map(([k, v]) => (
            <li key={k} className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-navy">{k}</span>
              <span className="text-gold-dark font-bold">{v}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AudienceView() {
  return (
    <div className="space-y-6">
      <h2 className="font-heading text-3xl italic">Audience segments</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          ["5★ promoters", "284", "NPS 9-10 · best send window: weekdays 10am"],
          ["At-risk customers", "47", "Low review rating + 60d since last order"],
          ["Photo-review uploaders", "118", "Highest CLV segment · +42% repeat rate"],
          ["YMM: F-150 owners", "412", "Cross-sell candidates for sensor kits"],
          ["First-time buyers", "92", "Most likely to review in 7-10 days"],
          ["Predicted churn (next 30d)", "23", "Trigger win-back via EarnedMail"],
        ].map(([t, n, s]) => (
          <div key={t} className="bg-white border border-slate-200 rounded-xl p-5">
            <h4 className="font-heading text-xl italic">{t}</h4>
            <div className="font-heading text-4xl mt-2 text-navy">{n}</div>
            <p className="text-xs text-slate-500 mt-2">{s}</p>
            <button className="mt-4 text-xs font-bold text-navy inline-flex items-center gap-1 hover:text-gold-dark">Target this segment <ArrowUpRight size={12} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function WidgetsView() {
  return (
    <div className="space-y-6">
      <h2 className="font-heading text-3xl italic">Widgets</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          "Floating badge",
          "Product page carousel",
          "Review list",
          "Testimonial card",
          "Grid (UGC)",
          "Footer trust bar",
        ].map((n) => (
          <div key={n} className="bg-white border border-slate-200 rounded-xl p-6">
            <Layout className="text-gold-dark" size={20} />
            <h4 className="font-heading text-xl italic mt-3">{n}</h4>
            <p className="text-xs text-slate-500 mt-2">Drop-in script · navy/gold/white colorways · responsive.</p>
            <button className="mt-4 text-xs font-bold text-navy hover:text-gold-dark inline-flex items-center gap-1">Copy embed <ArrowUpRight size={12} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="font-heading text-3xl italic">Settings</h2>
      <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
        {[
          ["Connected store", "Shopify · reman-transmissions.myshopify.com"],
          ["Domains", "remantransmissions.com · 2 of 3 used"],
          ["Plan", "Growth $99/mo · renews Feb 14, 2026"],
          ["Auto-approve threshold", "Fraud score < 30, rating ≥ 4★"],
          ["Brand colorway", "Navy / Gold"],
          ["Verified Buyer ID tier required", "Silver (email confirmed)"],
        ].map(([k, v]) => (
          <div key={k} className="p-5 flex items-center justify-between">
            <div>
              <div className="font-bold text-navy">{k}</div>
              <div className="text-sm text-slate-500 mt-0.5">{v}</div>
            </div>
            <button className="text-xs font-bold text-navy hover:text-gold-dark">Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}
