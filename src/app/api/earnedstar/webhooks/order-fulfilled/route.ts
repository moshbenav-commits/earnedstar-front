import { NextRequest, NextResponse } from "next/server";
import { getApiBase } from "@/lib/api";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const secret =
    req.headers.get("x-earnedstar-webhook-secret") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    "";

  const res = await fetch(`${getApiBase()}/earnedstar/webhooks/order-fulfilled`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-earnedstar-webhook-secret": secret,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
