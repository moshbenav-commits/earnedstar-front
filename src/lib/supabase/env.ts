export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return {
    url: url ?? '',
    anonKey: anonKey ?? '',
    configured: Boolean(url && anonKey),
  };
}

export const ACCESS_TOKEN_COOKIE = 'es-access-token';
export const REFRESH_TOKEN_COOKIE = 'es-refresh-token';
