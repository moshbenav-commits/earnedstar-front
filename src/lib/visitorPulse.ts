/**
 * Creytix Visitor Pulse — lightweight pageview beacon.
 * Minimal session/visitor model mirroring expedia-parts-front's
 * storefrontSessionTracking.ts: 30-min inactivity + UTC-day session
 * rollover, stable localStorage visitor id. No vehicle context, no
 * tracking phones, no external state stores.
 */

const VISITOR_ID_KEY = 'cx_visitor_id';
const SESSION_KEY = 'cx_visitor_session';
const INACTIVITY_MS = 30 * 60 * 1000;
const DEFAULT_BRAND = 'earnedstar';

type StoredSession = {
  sessionId: string;
  lastActivityAt: string;
  utcDay: string;
  referrerSent?: boolean;
};

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function utcDayKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

function createId(): string {
  if (isBrowser() && typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `v_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

function getOrCreateVisitorId(): string | null {
  if (!isBrowser()) return null;
  try {
    const existing = window.localStorage.getItem(VISITOR_ID_KEY);
    if (existing) return existing;
    const id = createId();
    window.localStorage.setItem(VISITOR_ID_KEY, id);
    return id;
  } catch {
    return null;
  }
}

function readStoredSession(): StoredSession | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredSession>;
    if (!parsed.sessionId || !parsed.lastActivityAt) return null;
    return {
      sessionId: parsed.sessionId,
      lastActivityAt: parsed.lastActivityAt,
      utcDay: parsed.utcDay ?? utcDayKey(new Date(parsed.lastActivityAt)),
      referrerSent: parsed.referrerSent,
    };
  } catch {
    return null;
  }
}

function writeStoredSession(session: StoredSession): void {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // ignore write failures (private mode, quota)
  }
}

function isSessionExpired(stored: StoredSession, now: Date): boolean {
  const last = new Date(stored.lastActivityAt).getTime();
  if (Number.isNaN(last)) return true;
  if (now.getTime() - last > INACTIVITY_MS) return true;
  if (stored.utcDay !== utcDayKey(now)) return true;
  return false;
}

function getOrCreateSession(): StoredSession {
  const now = new Date();
  const stored = readStoredSession();
  if (stored && !isSessionExpired(stored, now)) {
    const refreshed: StoredSession = { ...stored, lastActivityAt: now.toISOString() };
    writeStoredSession(refreshed);
    return refreshed;
  }
  const fresh: StoredSession = {
    sessionId: createId(),
    lastActivityAt: now.toISOString(),
    utcDay: utcDayKey(now),
    referrerSent: false,
  };
  writeStoredSession(fresh);
  return fresh;
}

function readUtmParams(): { utmSource?: string; utmMedium?: string; utmCampaign?: string } {
  if (!isBrowser()) return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') ?? undefined,
    utmMedium: params.get('utm_medium') ?? undefined,
    utmCampaign: params.get('utm_campaign') ?? undefined,
  };
}

function resolveStorefrontBrand(): string {
  return process.env.NEXT_PUBLIC_STOREFRONT_BRAND || DEFAULT_BRAND;
}

/** POST a Creytix Visitor Pulse pageview beacon. Swallows all errors. */
export function sendPageview(path: string): void {
  if (!isBrowser()) return;
  if (path.startsWith('/admin') || path.startsWith('/api')) return;
  if (process.env.NEXT_PUBLIC_VISITOR_PULSE_DISABLED === '1') return;

  const visitorId = getOrCreateVisitorId();
  if (!visitorId) return;

  const session = getOrCreateSession();
  const utm = readUtmParams();
  const storefrontBrand = resolveStorefrontBrand();

  let referrer: string | undefined;
  if (!session.referrerSent) {
    referrer = document.referrer || undefined;
    writeStoredSession({ ...session, referrerSent: true });
  }

  const body = {
    sessionId: session.sessionId,
    visitorId,
    path,
    referrer,
    storefrontBrand,
    ...utm,
  };

  fetch('/api/visitor-pulse/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify(body),
  }).catch(() => {});
}
