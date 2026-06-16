import { NextRequest, NextResponse } from "next/server";
import { getApiBase } from "@/lib/api";
import { mapReview } from "@/lib/earnedstar-server";
import type { Review } from "@/types/review";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const sp = req.nextUrl.searchParams;
  const query = new URLSearchParams();
  for (const key of ["limit", "offset", "page", "sort", "min_rating", "ymm_year", "ymm_make", "ymm_model", "has_photos"]) {
    const val = sp.get(key);
    if (val) query.set(key, val);
  }
  const res = await fetch(`${getApiBase()}/earnedstar/reviews/${slug}?${query.toString()}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    return NextResponse.json([], { status: res.status });
  }
  const rows = (await res.json()) as Record<string, unknown>[];
  const mapped: Review[] = rows.map(mapReview);
  return NextResponse.json(mapped, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
  });
}
