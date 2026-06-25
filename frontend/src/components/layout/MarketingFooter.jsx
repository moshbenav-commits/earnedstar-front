import React from "react";
import { Link } from "react-router-dom";
import { EarnedStarWordmark } from "../brand/EarnedStarMark";
import EarnedStarMark from "../brand/EarnedStarMark";

export default function MarketingFooter() {
  return (
    <footer data-testid="marketing-footer" className="bg-ink text-white/65 border-t border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 grain-overlay opacity-40" />
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 py-20 relative">
        {/* Masthead */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-5">
            <EarnedStarWordmark variant="white" />
            <p className="font-heading italic text-2xl text-white/90 mt-8 leading-[1.3] max-w-md text-balance">
              The verifiable trust layer for e&#8209;commerce.
            </p>
            <p className="font-body text-sm mt-5 max-w-md text-white/45 leading-[1.65] text-pretty">
              Reviews, email, SMS, and loyalty &mdash; order-locked, AI-audited, publicly provable, and yours forever.
              Built in the post-Yotpo era for merchants who want their stack consolidated, their data portable, and their stars earned.
            </p>
            <div className="mt-10 flex items-center gap-4 text-[10px] smallcaps text-white/35">
              <span className="w-6 h-px bg-gold/40" /> Vol. I &middot; Edition 2026
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-10 text-sm">
            {[
              {
                title: "Platform",
                items: [
                  { label: "Pricing", to: "/pricing" },
                  { label: "Dashboard", to: "/dashboard" },
                  { label: "Live store", to: "/store/reman-transmissions" },
                  { label: "EarnedMail", to: null },
                  { label: "EarnedSend", to: null },
                ],
              },
              {
                title: "Tools",
                items: [
                  { label: "Review Audit", to: "/audit" },
                  { label: "Yotpo Refugees", to: "/yotpo-refugees" },
                  { label: "Moderation Ledger", to: "/store/reman-transmissions/moderation" },
                ],
              },
              {
                title: "Trust",
                items: [
                  { label: "Manifesto", to: "/" },
                  { label: "How trust works", to: null },
                  { label: "Portability", to: null },
                ],
              },
              {
                title: "Company",
                items: [
                  { label: "About", to: null },
                  { label: "Careers", to: null },
                  { label: "Contact", to: null },
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-[10px] smallcaps text-gold-light mb-5">{col.title}</h4>
                <ul className="space-y-3">
                  {col.items.map((it) =>
                    it.to ? (
                      <li key={it.label}>
                        <Link to={it.to} className="font-body text-white/65 hover:text-white transition-colors">{it.label}</Link>
                      </li>
                    ) : (
                      <li key={it.label} className="text-white/30">{it.label}</li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Editorial imprint */}
        <div className="pt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <EarnedStarMark size={36} variant="navy" center="check" />
            <div>
              <p className="text-[10px] smallcaps text-white/40">Published by EarnedStar &middot; Set in Instrument Serif &amp; Plus Jakarta Sans</p>
              <p className="text-xs text-white/45 mt-1 font-num tabular-nums">&copy; 2026 EarnedStar &mdash; All rights reserved. Reviews remain yours.</p>
            </div>
          </div>
          <div className="flex items-center gap-5 text-[10px] smallcaps text-white/40">
            <span>Verified</span>
            <span className="w-px h-3 bg-white/15" />
            <span>Auditable</span>
            <span className="w-px h-3 bg-white/15" />
            <span>Portable</span>
            <span className="w-px h-3 bg-white/15" />
            <span>Fair</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
