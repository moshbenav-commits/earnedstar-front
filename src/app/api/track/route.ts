/**
 * Creytix Analytics sink (vendored; SSOT: packages/creytix-analytics-lite).
 * First-party JSONL on the site's own disk — free, no third party, readable by
 * the audit and by Creytix Analytics ingestion later. Rotates daily by filename.
 */
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const MAX_BODY = 4_096;
const DIR = path.join(process.cwd(), ".analytics");

export async function POST(request: Request): Promise<Response> {
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY) return new Response(null, { status: 413 });
    const row = JSON.parse(raw);
    if (typeof row?.event !== "string" || typeof row?.path !== "string") {
      return new Response(null, { status: 400 });
    }
    const record = {
      event: String(row.event).slice(0, 64),
      path: String(row.path).slice(0, 256),
      visitorId: String(row.visitorId ?? "").slice(0, 64),
      referrer: typeof row.referrer === "string" ? row.referrer.slice(0, 256) : undefined,
      props: typeof row.props === "object" && row.props ? row.props : undefined,
      at: Number.isFinite(row.at) ? row.at : Date.now(),
      ua: request.headers.get("user-agent")?.slice(0, 160) ?? undefined,
    };
    await mkdir(DIR, { recursive: true });
    const day = new Date(record.at).toISOString().slice(0, 10);
    await appendFile(path.join(DIR, `events-${day}.jsonl`), `${JSON.stringify(record)}\n`);
    return new Response(null, { status: 204 });
  } catch {
    // Analytics must never surface an error to a visitor's network tab as a failure loop.
    return new Response(null, { status: 204 });
  }
}
