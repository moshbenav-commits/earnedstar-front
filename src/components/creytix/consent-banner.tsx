"use client";

/**
 * Creytix consent banner (vendored; SSOT: packages/creytix-analytics-lite).
 * Generalized from the House of Bid donor. Styles ride CSS variables with
 * fallbacks so it sits on any site's theme without a redesign; override the
 * cx-consent-* custom properties in globals.css to tune it.
 *
 * Scope honesty: this gates OPTIONAL marketing enhancement (attribution,
 * marketing-class events). Anonymous first-party page counting is not behind it,
 * and Do-Not-Track/GPC suppresses everything regardless of what is chosen here.
 */
import { useEffect, useState } from "react";

const CONSENT_KEY = "cx-consent";
const CONSENT_VERSION = 1;

type ConsentRecord = { version: number; marketing: boolean; at: number };

function readConsent(): ConsentRecord | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    return parsed.version === CONSENT_VERSION ? parsed : null;
  } catch {
    return null;
  }
}

export function CreytixConsentBanner({ privacyHref = "/privacy" }: { privacyHref?: string }) {
  const [decided, setDecided] = useState(true); // render nothing until mounted

  useEffect(() => {
    setDecided(readConsent() !== null);
  }, []);

  if (decided) return null;

  function save(marketing: boolean) {
    try {
      window.localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ version: CONSENT_VERSION, marketing, at: Date.now() } satisfies ConsentRecord),
      );
    } catch {
      /* storage unavailable — treat as necessary-only for this visit */
    }
    setDecided(true);
  }

  return (
    <div
      data-testid="cx-consent-banner"
      role="region"
      aria-label="Privacy choices"
      style={{
        position: "fixed",
        insetInline: 0,
        bottom: 0,
        zIndex: 90,
        background: "var(--cx-consent-bg, var(--background, #ffffff))",
        color: "var(--cx-consent-fg, var(--foreground, #111111))",
        borderTop: "1px solid var(--cx-consent-line, rgba(0,0,0,0.15))",
        padding: "1rem 1.5rem",
        boxShadow: "0 -8px 24px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          margin: "0 auto",
          maxWidth: "72rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem 1.5rem",
        }}
      >
        <p style={{ margin: 0, maxWidth: "42rem", fontSize: "0.875rem", lineHeight: 1.5 }}>
          We count our own page views anonymously — no tracking cookies, and browser
          privacy signals are honored. Allow optional marketing analytics?{" "}
          <a href={privacyHref} style={{ textDecoration: "underline", textUnderlineOffset: 4 }}>
            Privacy
          </a>
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={() => save(false)}
            style={{
              minHeight: 44,
              padding: "0.5rem 1rem",
              border: "1px solid var(--cx-consent-line, rgba(0,0,0,0.3))",
              background: "transparent",
              color: "inherit",
              cursor: "pointer",
            }}
          >
            Necessary only
          </button>
          <button
            type="button"
            onClick={() => save(true)}
            style={{
              minHeight: 44,
              padding: "0.5rem 1rem",
              border: "1px solid var(--cx-consent-accent, currentColor)",
              background: "var(--cx-consent-accent, var(--foreground, #111111))",
              color: "var(--cx-consent-accent-fg, var(--background, #ffffff))",
              cursor: "pointer",
            }}
          >
            Allow
          </button>
        </div>
      </div>
    </div>
  );
}

/** Mount once in the root layout: boots tracking + shows the banner. */
export function CreytixTrackBoot() {
  useEffect(() => {
    void import("@/lib/creytix/track").then((m) => m.initCreytixTrack());
  }, []);
  return <CreytixConsentBanner />;
}
