/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
export const DEFAULT_EARNEDSTAR_CORS_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://earnedstar.com',
  'https://www.earnedstar.com',
  'https://earnedstar.vercel.app',
  'https://earnedstar-front.vercel.app',
] as const;

export function resolveCorsOrigins(): boolean | string[] {
  const raw = process.env.CORS_ORIGIN?.trim();
  if (!raw) return [...DEFAULT_EARNEDSTAR_CORS_ORIGINS];
  const configured = raw.split(',').map((s) => s.trim()).filter(Boolean);
  return [...new Set([...configured, ...DEFAULT_EARNEDSTAR_CORS_ORIGINS])];
}
