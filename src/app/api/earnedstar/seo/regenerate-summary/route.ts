import { NextResponse } from "next/server";
import { getApiBase } from "@/lib/api";
import { authHeaders } from "@/lib/auth-server";

export async function POST() {
  const res = await fetch(`${getApiBase()}/earnedstar/seo/regenerate-summary`, {
    method: "POST",
    headers: { ...(await authHeaders()) },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
