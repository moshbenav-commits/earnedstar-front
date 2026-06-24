/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { NextResponse } from 'next/server';
import { getApiBase } from '@/lib/api';

export async function GET() {
  const res = await fetch(`${getApiBase()}/earnedstar/billing/public-config`, { cache: 'no-store' });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
