import { NextRequest, NextResponse } from "next/server";
import { getApiBase } from "@/lib/api";
import { mapReview } from "@/lib/earnedstar-server";
import type { Review } from "@/types/review";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const limit = req.nextUrl.searchParams.get("limit") ?? "8";
  const offset = req.nextUrl.searchParams.get("offset") ?? "0";
  const res = await fetch(
    `${getApiBase()}/earnedstar/reviews/${slug}?limit=${limit}&offset=${offset}`,
    { next: { revalidate: 60 } },
  );
  if (!res.ok) {
    return NextResponse.json([], { status: res.status });
  }
  const rows = (await res.json()) as Record<string, unknown>[];
  const mapped: Review[] = rows.map(mapReview);
  return NextResponse.json(mapped);
}
