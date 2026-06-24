/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
/** Dev-only Pinterest pin → direct image URL resolver (og:image / i.pinimg.com). */

const PINIMG_RE = /https:\/\/i\.pinimg\.com\/[^\s"'<>\\]+/i;
const OG_IMAGE_RE =
  /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i;
const OG_IMAGE_RE_ALT =
  /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i;

function decodeHtmlUrl(raw: string): string {
  return raw
    .replace(/&amp;/g, '&')
    .replace(/\\u002F/g, '/')
    .replace(/\\\//g, '/');
}

function pickBestPinimg(candidates: string[]): string | null {
  const normalized = candidates.map(decodeHtmlUrl).filter((u) => PINIMG_RE.test(u));
  if (normalized.length === 0) return null;
  const sorted = [...normalized].sort((a, b) => b.length - a.length);
  return sorted[0] ?? null;
}

export type PinterestResolveResult = {
  ok: boolean;
  previewUrl: string | null;
  source: 'og:image' | 'pinimg-scrape' | null;
  error?: string;
};

export async function resolvePinterestImageUrl(pinUrl: string): Promise<PinterestResolveResult> {
  const input = pinUrl.trim();
  if (!input) {
    return { ok: false, previewUrl: null, source: null, error: 'Empty URL.' };
  }

  if (PINIMG_RE.test(input)) {
    return { ok: true, previewUrl: input, source: 'pinimg-scrape' };
  }

  if (!/pinterest\./i.test(input)) {
    return { ok: false, previewUrl: null, source: null, error: 'Not a Pinterest pin URL.' };
  }

  try {
    const res = await fetch(input, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(12_000),
    });

    if (!res.ok) {
      return {
        ok: false,
        previewUrl: null,
        source: null,
        error: `Pinterest returned HTTP ${res.status}.`,
      };
    }

    const html = await res.text();
    const og =
      html.match(OG_IMAGE_RE)?.[1] ?? html.match(OG_IMAGE_RE_ALT)?.[1] ?? null;
    if (og) {
      return { ok: true, previewUrl: decodeHtmlUrl(og), source: 'og:image' };
    }

    const pinimgs = html.match(/https:\/\/i\.pinimg\.com\/[^"'\\s]+/gi) ?? [];
    const best = pickBestPinimg(pinimgs);
    if (best) {
      return { ok: true, previewUrl: best, source: 'pinimg-scrape' };
    }

    return {
      ok: false,
      previewUrl: null,
      source: null,
      error: 'Could not extract image — copy image address from the pin manually.',
    };
  } catch {
    return {
      ok: false,
      previewUrl: null,
      source: null,
      error: 'Pinterest fetch failed — paste i.pinimg.com URL directly.',
    };
  }
}
