/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { provisionMerchantAfterSignup } from '@/lib/auth-server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, businessName, plan } = body as {
    email?: string;
    password?: string;
    businessName?: string;
    plan?: string;
  };

  if (!email || !password || !businessName) {
    return NextResponse.json({ error: 'Email, password, and business name required' }, { status: 400 });
  }

  const { configured } = getSupabaseEnv();
  if (!configured) {
    if (process.env.EARNEDSTAR_AUTH_DEV_BYPASS === '1') {
      return NextResponse.json({ ok: true, devBypass: true, redirect: '/dashboard' });
    }
    return NextResponse.json({ error: 'Auth not configured' }, { status: 503 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Auth unavailable' }, { status: 503 });
  }

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (data.user?.id) {
    await provisionMerchantAfterSignup({
      ownerId: data.user.id,
      email,
      businessName,
      plan,
    });
  }

  return NextResponse.json({
    ok: true,
    user: { id: data.user?.id, email: data.user?.email },
    redirect: '/dashboard',
  });
}
