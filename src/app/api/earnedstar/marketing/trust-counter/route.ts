/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import { NextResponse } from "next/server";
import { getApiBase } from "@/lib/api";

export async function GET() {
  const res = await fetch(`${getApiBase()}/earnedstar/marketing/trust-counter`, {
    next: { revalidate: 30 },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
