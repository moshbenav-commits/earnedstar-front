/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getApiBase } from '@/lib/api';
import { authHeaders } from '@/lib/auth-server';
import { paymentsEnabled } from '@/lib/payments-enabled';

export async function POST(req: NextRequest) {
  if (!paymentsEnabled()) {
    return NextResponse.json(
      { message: 'Payment processing is not active. Contact sales to subscribe.' },
      { status: 503 },
    );
  }

  const body = await req.json();
  const res = await fetch(`${getApiBase()}/earnedstar/billing/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await authHeaders()),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
