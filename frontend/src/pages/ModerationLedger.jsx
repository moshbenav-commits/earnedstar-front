import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShieldOff, ShieldCheck, AlertTriangle, ArrowLeft } from "lucide-react";
import MarketingNav from "../components/layout/MarketingNav";
import MarketingFooter from "../components/layout/MarketingFooter";
import { getJSON } from "../lib/api";

const ACTION_STYLES = {
  removed: { bg: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-200", icon: ShieldOff },
  restored: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200", icon: ShieldCheck },
  flagged: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200", icon: AlertTriangle },
};

export default function ModerationLedger() {
  const { slug } = useParams();
  const [entries, setEntries] = useState([]);
  const [store, setStore] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [s, m] = await Promise.all([
          getJSON(`/stores/${slug}`),
          getJSON(`/stores/${slug}/moderation`),
        ]);
        setStore(s);
        setEntries(m);
      } catch (e) { /* noop */ }
    })();
  }, [slug]);

  return (
    <div className="bg-cream min-h-screen text-navy">
      <MarketingNav />
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <Link to={`/store/${slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-navy hover:text-gold-dark"><ArrowLeft size={14} /> Back to store</Link>
          <div className="mt-6">
            <span className="font-body text-xs uppercase tracking-[0.28em] text-gold-dark font-bold">Moderation Ledger</span>
            <h1 className="font-heading text-5xl mt-3 tracking-tight">Every decision, <em className="italic text-gold-dark">in the open</em>.</h1>
            <p className="font-body text-base text-slate-600 mt-4 max-w-2xl leading-relaxed">
              Every review removed, restored, or flagged on {store?.name || "this store"} is logged here — with reason, decision-maker, and appeal status.
              No platform in the review industry does this. We do because we have nothing to hide.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {entries.length === 0 && <p className="text-sm text-slate-500">No moderation events yet.</p>}
            {entries.map((e, i) => {
              const S = ACTION_STYLES[e.action] || ACTION_STYLES.flagged;
              const Icon = S.icon;
              return (
                <div key={e.id} data-testid={`moderation-entry-${i}`} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row gap-5">
                  <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${S.bg} ${S.text} ring-1 ${S.ring}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase tracking-[0.22em] px-2 py-0.5 rounded-full ${S.bg} ${S.text} ring-1 ${S.ring}`}>{e.action}</span>
                      <span className="text-xs text-slate-500">Decided by <span className="font-bold text-navy">{e.decided_by}</span> · {new Date(e.timestamp).toLocaleDateString()}</span>
                      {e.appeal_status !== "none" && (
                        <span className="text-xs text-slate-500">Appeal: <span className="font-bold">{e.appeal_status}</span></span>
                      )}
                    </div>
                    <blockquote className="font-heading italic text-xl text-navy mt-3">&quot;{e.review_excerpt}&quot;</blockquote>
                    <p className="font-body text-sm text-slate-600 mt-3 leading-relaxed">
                      <span className="font-bold text-navy">Reason:</span> {e.reason}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 bg-navy text-white rounded-2xl p-8">
            <h3 className="font-heading text-3xl">The 24-hour Dispute SLA</h3>
            <p className="font-body text-white/70 mt-3 max-w-2xl leading-relaxed">
              Merchants and reviewers can dispute any decision on this ledger. We publish our running average response
              time on the homepage and update it daily. Trustpilot&apos;s average is 7-14 days. Ours is under 24.
            </p>
          </div>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
