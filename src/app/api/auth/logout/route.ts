import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSupabaseEnv } from '@/lib/supabase/env';

export async function POST(req: NextRequest) {
  const { configured } = getSupabaseEnv();
  if (!configured) {
    if (process.env.EARNEDSTAR_AUTH_DEV_BYPASS === '1') {
      return NextResponse.json({ ok: true, devBypass: true });
    }
    return NextResponse.json({ error: 'Auth not configured' }, { status: 503 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Auth unavailable' }, { status: 503 });
  }

  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
