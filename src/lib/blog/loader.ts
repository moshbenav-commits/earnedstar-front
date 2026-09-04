import fs from 'node:fs';
import path from 'node:path';

import prebuiltIndex from '@/data/blog-articles.json';

import type { BlogArticle, BlogFaq, BlogInternalLink, BlogStatus } from './types';

/**
 * Blog loader — reads neutral-master markdown at build time.
 *
 * Production reads ONLY `content/blog/`, which is populated by
 * `expedia-solutions/brand/scripts/blog-sync.mjs` from brand/content-library
 * (the SSOT). The site never reaches outside its own tree in a real build, so
 * a standalone deploy works unchanged.
 *
 * In development, if `content/blog/` is empty, it falls back to reading the
 * sibling `expedia-solutions` repo's content-library directly so drafts can be
 * previewed before approval. Those are flagged `isDraftPreview` and the UI
 * bands them clearly. The fallback is compiled out of production by the
 * NODE_ENV check.
 *
 * Dependency-free by design: this repo has neither `gray-matter` nor
 * `next-mdx-remote`, so frontmatter is parsed below with a small hand-rolled
 * reader (handles exactly the shapes the neutral-master spec produces — flat
 * scalars, block lists of scalars, block lists of flat objects) and the
 * markdown body is rendered by a minimal renderer in `[slug]/page.tsx`. If
 * this repo ever gains `gray-matter` + `next-mdx-remote`, swap both for the
 * real thing — the `BlogArticle` shape (types.ts) does not need to change.
 */

const BRAND = 'earnedstar';
const SITE_CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');
// This repo is a sibling of expedia-solutions/, not nested inside it, so the
// content-library is one level up and over — not directly above.
const LIBRARY_DIR = path.join(
  process.cwd(),
  '..',
  'expedia-solutions',
  'brand',
  'content-library',
  BRAND,
  'articles',
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
 * list item that happens to be a URL (`https://example.com/...`) is never
 * misread as a one-key object (`{ https: "//example.com/..." }`).
 */
const KEY_LINE = /^([a-zA-Z_][a-zA-Z0-9_]*):(?:\s+(.*))?$/;

/**
 * Minimal, dependency-free YAML-frontmatter reader. Handles exactly the
 * shapes ARTICLE_NEUTRAL_MASTER_SPEC.md produces: flat scalars, block lists of
 * scalars (`source_links`), and block lists of flat objects (`faq`,
 * `internal_links`). It is not a general YAML parser — it does not need to be.
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

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
}

function asFaq(value: unknown): BlogFaq[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const row = item as Record<string, unknown>;
      const q = asString(row.q);
      const a = asString(row.a);
      return q && a ? { q, a } : null;
    })
    .filter((row): row is BlogFaq => row !== null);
}

function asInternalLinks(value: unknown): BlogInternalLink[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const row = item as Record<string, unknown>;
      const anchor = asString(row.anchor);
      const target = asString(row.target);
      return anchor && target ? { anchor, target } : null;
    })
    .filter((row): row is BlogInternalLink => row !== null);
}

function parseArticle(file: string, isDraftPreview: boolean): BlogArticle | null {
  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = parseFrontmatter(raw);

  const slug = asString(data.slug) || path.basename(file, '.md');
  const title = asString(data.title);
  if (!title) return null; // an article without a title is malformed, not renderable

  return {
    atomId: asString(data.atom_id, path.basename(file, '.md')),
    brand: asString(data.brand, BRAND),
    vertical: asString(data.vertical),
    persona: typeof data.persona === 'string' ? data.persona : null,
    trendTag: typeof data.trend_tag === 'string' ? data.trend_tag : null,
    slug,
    title,
    description: asString(data.description),
    category: asString(data.category, 'General'),
    readMinutes: typeof data.read_minutes === 'number' ? data.read_minutes : 5,
    kind: data.kind === 'article' ? 'article' : 'blog',
    primaryKeyword: typeof data.primary_keyword === 'string' ? data.primary_keyword : null,
    sourceLinks: asStringArray(data.source_links),
    faq: asFaq(data.faq),
    internalLinks: asInternalLinks(data.internal_links),
    status: (asString(data.status, 'draft') as BlogStatus) ?? 'draft',
    reviewRequired: data.review_required === true,
    body: content,
    isDraftPreview,
  };
}

function readDir(dir: string, isDraftPreview: boolean): BlogArticle[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      try {
        return parseArticle(path.join(dir, f), isDraftPreview);
      } catch {
        // One malformed file must not take the whole blog index down.
        return null;
      }
    })
    .filter((a): a is BlogArticle => a !== null);
}

/**
 * Disk reader — the single parser. Used directly in development and by
 * `npm run blog:index` (scripts/lib/build-blog-index.mjs) at build time.
 */
export function readArticlesFromDisk(): BlogArticle[] {
  let articles = readDir(SITE_CONTENT_DIR, false);

  if (!articles.length && isDev) {
    articles = readDir(LIBRARY_DIR, true);
  }

  // Newest first — the atom id carries the YYYY-MM-DD prefix.
  return articles.sort((a, b) => b.atomId.localeCompare(a.atomId));
}

/**
 * Production serves the index frozen at build time (src/data/blog-articles.json,
 * written by `npm run blog:index` from prebuild / build:opennext). A Cloudflare
 * Worker has no filesystem at request time — until 2026-09-04 this function read
 * content/blog with fs in production and every article 404'd on the live site.
 * Development keeps reading disk so authors see edits without a rebuild.
 */
export function getAllArticles(): BlogArticle[] {
  const frozen = (prebuiltIndex as { articles?: BlogArticle[] }).articles;
  if (!isDev && Array.isArray(frozen) && frozen.length) return frozen;
  return readArticlesFromDisk();
}

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

export function getArticleSlugs(): string[] {
  return getAllArticles().map((a) => a.slug);
}
