/**
 * Creytix Analytics sink (vendored; SSOT: packages/creytix-analytics-lite).
 * First-party JSONL on the site's own disk — free, no third party, readable by
 * the audit and by Creytix Analytics ingestion later. Rotates daily by filename.
 *
 * Lake forward (Creytix Data Lake §7 Phase 1 — CREYTIX_DATA_LAKE_PLAN_2026-07-29.md):
 * when LAKE_INGEST_URL + LAKE_INGEST_SECRET are configured on the deployment,
 * every event is ALSO forwarded server-side to the Bronze ingest endpoint
 * (POST /marketing/lake/events on expedia-parts-back) stamped with this site's
 * own canonical brand id as sourceSite — never via /marketing/sessions/track,
 * whose store-brand narrowing would mislabel fleet sites as 'parts'. Fail-open:
 * a lake failure never affects the visitor response or the JSONL sink. On
 * Cloudflare Workers the local disk is ephemeral, so the lake IS the durable
 * sink there. The secret stays server-side (worker secret), never in the page.
 */
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const MAX_BODY = 4_096;
const DIR = path.join(process.cwd(), ".analytics");
/** Canonical brand id (expedia-parts-back storefront-brand.util.ts registry). */
const SOURCE_SITE = "earnedstar";

type TrackRecord = {
  event: string;
  path: string;
  visitorId: string;
  referrer?: string;
  props?: Record<string, unknown>;
  at: number;
  ua?: string;
};

/** page_view → the shared pulse.pageview taxonomy; other events namespace under pulse.* */
function lakeEventType(event: string): string {
  if (event === "page_view") return "pulse.pageview";
  const slug = event.toLowerCase().replace(/[^a-z0-9_]/g, "_");
  return `pulse.${slug}`;
}

async function forwardToLake(record: TrackRecord): Promise<void> {
  const url = process.env.LAKE_INGEST_URL;
  const secret = process.env.LAKE_INGEST_SECRET;
  if (!url || !secret) return;
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-lake-ingest-secret": secret,
    },
    body: JSON.stringify({
      sourceSite: SOURCE_SITE,
      eventType: lakeEventType(record.event),
      occurredAt: new Date(record.at).toISOString(),
      visitorId: record.visitorId || null,
      payload: {
        path: record.path,
        referrer: record.referrer,
        ...(record.props ? { props: record.props } : {}),
      },
      producer: `${SOURCE_SITE}-front`,
    }),
    signal: AbortSignal.timeout(2_500),
  });
}

export async function POST(request: Request): Promise<Response> {
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY) return new Response(null, { status: 413 });
    const row = JSON.parse(raw);
    if (typeof row?.event !== "string" || typeof row?.path !== "string") {
      return new Response(null, { status: 400 });
    }
    const record: TrackRecord = {
      event: String(row.event).slice(0, 64),
      path: String(row.path).slice(0, 256),
      visitorId: String(row.visitorId ?? "").slice(0, 64),
      referrer: typeof row.referrer === "string" ? row.referrer.slice(0, 256) : undefined,
      props: typeof row.props === "object" && row.props ? row.props : undefined,
      at: Number.isFinite(row.at) ? row.at : Date.now(),
      ua: request.headers.get("user-agent")?.slice(0, 160) ?? undefined,
    };
    // Awaited: Workers may cancel dangling promises once the response returns.
    try {
      await forwardToLake(record);
    } catch {
      /* lake is fail-open — JSONL sink and the 204 still happen */
    }
    try {
      await mkdir(DIR, { recursive: true });
      const day = new Date(record.at).toISOString().slice(0, 10);
      await appendFile(path.join(DIR, `events-${day}.jsonl`), `${JSON.stringify(record)}\n`);
    } catch {
      /* no writable disk on Workers — the lake forward above is the sink there */
    }
    return new Response(null, { status: 204 });
  } catch {
    // Analytics must never surface an error to a visitor's network tab as a failure loop.
    return new Response(null, { status: 204 });
  }
}
