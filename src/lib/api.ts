/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
/** Canonical EarnedStar API base — earnedstar-back in prod, :8081 locally. */
export function getApiBase(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ??
    (process.env.NODE_ENV === 'production'
      ? 'https://earnedstar-back.vercel.app/api'
      : 'http://localhost:8081/api')
  );
}

export async function fetchFromApi<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getApiBase()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    next: init?.cache ? { revalidate: 60 } : undefined,
  });
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${path}`);
  }
  return res.json() as Promise<T>;
}
