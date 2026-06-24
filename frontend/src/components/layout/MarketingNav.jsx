import React from "react";
import { Link, NavLink } from "react-router-dom";
import { EarnedStarWordmark } from "../brand/EarnedStarMark";

const links = [
  { to: "/", label: "Manifesto" },
  { to: "/pricing", label: "Pricing" },
  { to: "/audit", label: "The Audit" },
  { to: "/yotpo-refugees", label: "Yotpo Refugees" },
  { to: "/store/reman-transmissions", label: "Live Store" },
  { to: "/dashboard", label: "Dashboard" },
];

export default function MarketingNav({ dark = false }) {
  const base = dark ? "text-white/65 hover:text-white" : "text-ink/60 hover:text-ink";
  const active = dark ? "text-white" : "text-ink";
  return (
    <header
      data-testid="marketing-nav"
      className={`sticky top-0 z-40 backdrop-blur-xl border-b ${
        dark ? "bg-ink/55 border-white/10" : "bg-cream/75 border-ink/10"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 h-16 flex items-center justify-between">
        <Link to="/" data-testid="nav-logo-link" className="flex items-center">
          <EarnedStarWordmark variant={dark ? "white" : "navy"} />
        </Link>
        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={({ isActive }) =>
                `text-[13px] font-semibold tracking-tight transition-colors ${
                  isActive ? active : base
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className={`hidden lg:inline text-[10px] smallcaps ${dark ? "text-white/40" : "text-ink/40"}`}>Vol. 01 · 2026</span>
          <Link
            to="/dashboard"
            data-testid="nav-cta-button"
            className="px-4 py-2 rounded-full text-[13px] font-bold text-ink gold-foil shadow-sm hover:shadow-md transition-shadow"
          >
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}
