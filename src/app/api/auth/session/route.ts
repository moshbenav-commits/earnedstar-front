import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSupabaseEnv } from '@/lib/supabase/env';

export async function GET() {
  const { configured } = getSupabaseEnv();
  if (!configured) {
    if (process.env.EARNEDSTAR_AUTH_DEV_BYPASS === '1') {
      return NextResponse.json({
        user: { id: 'dev-owner', email: 'dev@earnedstar.local' },
        authenticated: true,
        devBypass: true,
      });
    }
    return NextResponse.json({ user: null, authenticated: false });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ user: null, authenticated: false });
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return NextResponse.json({ user: null, authenticated: false });
  }

  return NextResponse.json({
    user: { id: data.user.id, email: data.user.email },
    authenticated: true,
  });
}
