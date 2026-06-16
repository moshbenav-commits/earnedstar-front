import { NextResponse } from 'next/server';
import { getApiBase } from '@/lib/api';

export async function GET() {
  const res = await fetch(`${getApiBase()}/earnedstar/dashboard/overview`, { cache: 'no-store' });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
