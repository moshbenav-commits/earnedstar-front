/**
 * Creytix Analytics — first-party beacon client (vendored; SSOT:
 * packages/creytix-analytics-lite). Do not edit in-site — edit the SSOT and
 * re-vendor: npm run creytix:analytics:vendor -- --site=earnedstar
 *
 * Cookieless: visitor id is a random localStorage id, never a cookie. Honors
 * Do-Not-Track/GPC before consent is even consulted. Page views count always
 * (first-party legitimate interest); marketing enhancement events only fire
 * after the consent banner records an opt-in.
 */

const SITE = "earnedstar";
const ENDPOINT = "/api/track";
const VISITOR_KEY = "cx-visitor";
const CONSENT_KEY = "cx-consent";

type TrackPayload = {
  site: string;
  event: string;
  path: string;
  visitorId: string;
  referrer?: string;
  props?: Record<string, string | number | boolean>;
  at: number;
};

function privacySignalsBlock(): boolean {
  if (typeof navigator === "undefined") return true;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  return nav.doNotTrack === "1" || nav.globalPrivacyControl === true;
}

function visitorId(): string {
  try {
    const existing = window.localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    window.localStorage.setItem(VISITOR_KEY, id);
    return id;
  } catch {
    return "no-storage";
  }
}

export function marketingConsentGranted(): boolean {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    return raw ? JSON.parse(raw).marketing === true : false;
  } catch {
    return false;
  }
}

function send(payload: TrackPayload): void {
  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: "application/json" }))) return;
    void fetch(ENDPOINT, { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } });
  } catch {
    /* analytics must never break the page */
  }
}

/** Anonymous page view — fires regardless of consent, suppressed by DNT/GPC. */
export function trackPageView(path?: string): void {
  if (typeof window === "undefined" || privacySignalsBlock()) return;
  send({
    site: SITE,
    event: "page_view",
    path: path ?? window.location.pathname,
    visitorId: visitorId(),
    referrer: document.referrer || undefined,
    at: Date.now(),
  });
}

/** Named event (lead capture, CTA click…). Marketing-class events need consent. */
export function trackEvent(
  event: string,
  props?: Record<string, string | number | boolean>,
  opts?: { marketing?: boolean },
): void {
  if (typeof window === "undefined" || privacySignalsBlock()) return;
  if (opts?.marketing && !marketingConsentGranted()) return;
  send({ site: SITE, event, path: window.location.pathname, visitorId: visitorId(), props, at: Date.now() });
}

/** Boot: first view + SPA navigations (History API patch, popstate). */
export function initCreytixTrack(): void {
  if (typeof window === "undefined") return;
  const w = window as Window & { __cxTrackBooted?: boolean };
  if (w.__cxTrackBooted) return;
  w.__cxTrackBooted = true;
  trackPageView();
  const emit = () => trackPageView();
  const { pushState, replaceState } = window.history;
  window.history.pushState = function (...args) { pushState.apply(this, args); emit(); };
  window.history.replaceState = function (...args) { replaceState.apply(this, args); emit(); };
  window.addEventListener("popstate", emit);
}
