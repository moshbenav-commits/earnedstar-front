import { NextRequest, NextResponse } from "next/server";
import { getApiBase } from "@/lib/api";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const max = req.nextUrl.searchParams.get("max") ?? "12";
  const res = await fetch(`${getApiBase()}/earnedstar/widget/${slug}?max=${max}`, {
    next: { revalidate: 120 },
  });
  const data = await res.json();
  return NextResponse.json(data, {
    status: res.status,
    headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" },
  });
}
