/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseEnv } from './env';

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createSupabaseBrowserClient() {
  const { url, anonKey, configured } = getSupabaseEnv();
  if (!configured) return null;
  if (!client) {
    client = createBrowserClient(url, anonKey);
  }
  return client;
}
