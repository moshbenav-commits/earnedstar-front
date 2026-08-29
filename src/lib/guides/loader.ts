import fs from 'node:fs';
import path from 'node:path';

import type { Guide, GuideStatus, GuideStep } from './types';

/**
 * Guide loader — reads neutral-master markdown at build time.
 *
 * Mirrors `src/lib/blog/loader.ts`'s exact pattern (same dependency-free
 * frontmatter reader, same dev-preview fallback) for the `kind: guide`
 * content shape defined in
 * expedia-solutions/brand/content-library/GUIDE_NEUTRAL_MASTER_SPEC.md.
 *
 * Production reads ONLY `content/guides/`, which is populated by
 * `expedia-solutions/brand/scripts/guide-sync.mjs` from brand/content-library
 * (the SSOT) once a guide's status is `approved`. The site never reaches
 * outside its own tree in a real build, so a standalone deploy works
 * unchanged.
 *
 * In development, if `content/guides/` is empty, it falls back to reading
 * the sibling `expedia-solutions` repo's content-library directly so drafts
 * can be previewed before approval. Those are flagged `isDraftPreview` and
 * the UI bands them clearly. The fallback is compiled out of production by
 * the NODE_ENV check.
 *
 * Dependency-free by design, same as the blog loader — no `gray-matter` /
 * `next-mdx-remote` in this repo.
 */

const BRAND = 'earnedstar';
const SITE_CONTENT_DIR = path.join(process.cwd(), 'content', 'guides');
// This repo is a sibling of expedia-solutions/, not nested inside it, so the
// content-library is one level up and over — not directly above.
const LIBRARY_DIR = path.join(
  process.cwd(),
  '..',
  'expedia-solutions',
  'brand',
  'content-library',
  BRAND,
  'guides',
);

const isDev = process.env.NODE_ENV !== 'production';

function stripQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    trimmed.length >= 2 &&
    ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'")))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseScalar(raw: string): unknown {
  const value = raw.trim();
  if (value === '' || value === 'null' || value === '~') return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^-?\d+$/.test(value)) return Number(value);
  return stripQuotes(value);
}

/**
 * Matches a `key: value` or bare `key:` line. The colon must be followed by
 * whitespace or end-of-line — NOT by an arbitrary character — so a scalar
 * list item that happens to be a URL is never misread as a one-key object.
 */
const KEY_LINE = /^([a-zA-Z_][a-zA-Z0-9_]*):(?:\s+(.*))?$/;

/**
 * Minimal, dependency-free YAML-frontmatter reader. Handles exactly the
 * shapes GUIDE_NEUTRAL_MASTER_SPEC.md produces: flat scalars and a block
 * list of flat objects (`steps`). It is not a general YAML parser — it does
 * not need to be.
 */
function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw.trim() };

  const [, block, body] = match;
  const lines = block.split(/\r?\n/);
  const data: Record<string, unknown> = {};
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '') {
      i += 1;
      continue;
    }

    const topMatch = KEY_LINE.exec(line);
    if (!topMatch) {
      // Indentation drift or otherwise unrecognized line — skip rather than
      // loop forever on malformed input.
      i += 1;
      continue;
    }

    const [, key, restRaw] = topMatch;
    const rest = restRaw ?? '';

    if (rest.trim() !== '') {
      data[key] = parseScalar(rest);
      i += 1;
      continue;
    }

    // Empty value on the key line means a block list follows on subsequent
    // indented `- ` lines.
    const items: unknown[] = [];
    i += 1;

    while (i < lines.length && /^\s+-\s/.test(lines[i])) {
      const dashMatch = /^(\s+)-\s(.*)$/.exec(lines[i]);
      if (!dashMatch) break;
      const [, indentStr, firstLine] = dashMatch;
      const dashIndent = indentStr.length;
      i += 1;

      const kvMatch = KEY_LINE.exec(firstLine);
      if (kvMatch) {
        const obj: Record<string, string> = {};
        obj[kvMatch[1]] = stripQuotes(kvMatch[2] ?? '');

        while (i < lines.length) {
          const next = lines[i];
          if (next.trim() === '') {
            i += 1;
            continue;
          }
          const nextIndent = (/^(\s*)/.exec(next) ?? ['', ''])[1].length;
          if (nextIndent <= dashIndent) break;
          const subMatch = KEY_LINE.exec(next.trim());
          if (!subMatch) break;
          obj[subMatch[1]] = stripQuotes(subMatch[2] ?? '');
          i += 1;
        }

        items.push(obj);
      } else {
        items.push(stripQuotes(firstLine));
      }
    }

    data[key] = items;
  }

  return { data, content: (body ?? '').trim() };
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asSteps(value: unknown): GuideStep[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const row = item as Record<string, unknown>;
      const instruction = asString(row.instruction);
      if (!instruction) return null;
      const detail = typeof row.detail === 'string' && row.detail !== 'null' ? row.detail : null;
      return { instruction, detail };
    })
    .filter((step): step is GuideStep => step !== null);
}

function parseGuide(file: string, isDraftPreview: boolean): Guide | null {
  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = parseFrontmatter(raw);

  const slug = path.basename(file, '.md');
  const title = asString(data.title);
  if (!title) return null; // a guide without a title is malformed, not renderable

  return {
    needId: asString(data.need_id, slug),
    brand: asString(data.brand, BRAND),
    slug,
    title,
    description: asString(data.description),
    route: asString(data.route, '/'),
    kind: 'guide',
    status: (asString(data.status, 'draft') as GuideStatus) ?? 'draft',
    reviewRequired: data.review_required === true,
    steps: asSteps(data.steps),
    videoSlug: typeof data.video_slug === 'string' ? data.video_slug : null,
    body: content,
    isDraftPreview,
  };
}

function readDir(dir: string, isDraftPreview: boolean): Guide[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      try {
        return parseGuide(path.join(dir, f), isDraftPreview);
      } catch {
        // One malformed file must not take the whole guide index down.
        return null;
      }
    })
    .filter((g): g is Guide => g !== null);
}

export function getAllGuides(): Guide[] {
  let guides = readDir(SITE_CONTENT_DIR, false);

  if (!guides.length && isDev) {
    guides = readDir(LIBRARY_DIR, true);
  }

  return guides.sort((a, b) => a.title.localeCompare(b.title));
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return getAllGuides().find((g) => g.slug === slug);
}

export function getGuideSlugs(): string[] {
  return getAllGuides().map((g) => g.slug);
}
