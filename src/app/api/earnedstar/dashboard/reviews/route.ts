import { NextRequest, NextResponse } from 'next/server';
import { getApiBase } from '@/lib/api';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug') ?? 'expediaparts';
  const limit = req.nextUrl.searchParams.get('limit') ?? '100';
  const res = await fetch(
    `${getApiBase()}/earnedstar/dashboard/reviews?slug=${slug}&limit=${limit}`,
    { cache: 'no-store' },
  );
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
