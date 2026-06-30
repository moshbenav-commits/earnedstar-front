/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { NextResponse } from "next/server";
import { getApiBase } from "@/lib/api";

export async function GET() {
  const res = await fetch(`${getApiBase()}/earnedstar/webhooks/events`, { cache: "no-store" });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
