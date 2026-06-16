import { NextResponse } from "next/server";
import { getApiBase } from "@/lib/api";
import { authHeaders } from "@/lib/auth-server";

export async function GET() {
  const res = await fetch(`${getApiBase()}/earnedstar/onboarding/status`, {
    headers: { ...(await authHeaders()) },
    cache: "no-store",
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
