import { NextResponse } from "next/server";
import { getApiBase } from "@/lib/api";

export async function GET() {
  const res = await fetch(`${getApiBase()}/earnedstar/seo/sitemap-merchants`, {
    next: { revalidate: 3600 },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
