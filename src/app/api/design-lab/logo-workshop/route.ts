/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';
import {
  auditWorkshopSource,
  buildAiIterationPrompt,
  buildFigmaHandoffPrompt,
  iterationArtifactPaths,
  resolveSvgTarget,
  resolvePinterestImageUrl,
  briefSlug,
  createReferenceId,
  type LogoWorkshopBrief,
  type LogoWorkshopBrandTarget,
  type LogoWorkshopReference,
  type LogoWorkshopTier,
} from '@expedia/design-lab/logo-workshop';

const WORKSPACE_ROOT = path.resolve(process.cwd(), '..');
const WORKSHOP_ROOT = path.join(WORKSPACE_ROOT, 'earnedstar', 'brand', 'workshop');
const WORKSHOP_BRIEFS_DIR = path.join(WORKSHOP_ROOT, 'briefs');
const WORKSHOP_ITERATIONS_DIR = path.join(WORKSHOP_ROOT, 'iterations');
const WORKSHOP_REFERENCE_DIR = path.join(process.cwd(), 'public', 'brand', 'workshop', 'reference');
const CURSOR_PROMPTS_DIR = path.join(WORKSPACE_ROOT, 'docs', 'prompts', 'cursor');

function listIterations(): { filename: string; path: string; cursorTxt: string; figmaTxt: string }[] {
  if (!fs.existsSync(WORKSHOP_ITERATIONS_DIR)) return [];
  return fs
    .readdirSync(WORKSHOP_ITERATIONS_DIR)
    .filter((name) => name.endsWith('.md'))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, '');
      return {
        filename,
        path: path.relative(WORKSPACE_ROOT, path.join(WORKSHOP_ITERATIONS_DIR, filename)),
        cursorTxt: `docs/prompts/cursor/logo-workshop-${slug}.txt`,
        figmaTxt: `docs/prompts/cursor/logo-workshop-${slug}-figma.txt`,
      };
    })
    .sort((a, b) => b.filename.localeCompare(a.filename));
}

function devOnly() {
  return process.env.NODE_ENV === 'development';
}

function ensureDirs() {
  fs.mkdirSync(WORKSHOP_BRIEFS_DIR, { recursive: true });
  fs.mkdirSync(WORKSHOP_ITERATIONS_DIR, { recursive: true });
  fs.mkdirSync(WORKSHOP_REFERENCE_DIR, { recursive: true });
  fs.mkdirSync(CURSOR_PROMPTS_DIR, { recursive: true });
}

function saveBriefJson(brief: LogoWorkshopBrief): string {
  ensureDirs();
  const filename = `${briefSlug(brief)}.json`;
  const target = path.join(WORKSHOP_BRIEFS_DIR, filename);
  fs.writeFileSync(target, `${JSON.stringify(brief, null, 2)}\n`, 'utf8');
  return path.relative(WORKSPACE_ROOT, target);
}

const EARNEDSTAR_SOURCE_FILES = {
  origami: path.join(WORKSPACE_ROOT, 'earnedstar/src/components/brand/earnedstar-lucky-star.tsx'),
  flat: path.join(WORKSPACE_ROOT, 'earnedstar/src/components/brand/earnedstar-mark.tsx'),
} as const;

function readSvgAudit(brand: LogoWorkshopBrandTarget, tier: LogoWorkshopTier) {
  const target = resolveSvgTarget(brand, tier);
  if (!target || brand !== 'earnedstar') {
    return {
      audit: auditWorkshopSource('', brand, tier, target),
      error: 'EarnedStar workshop only audits earnedstar brand targets.',
    };
  }

  const absolute =
    tier === 'origami'
      ? EARNEDSTAR_SOURCE_FILES.origami
      : tier === 'flat'
        ? EARNEDSTAR_SOURCE_FILES.flat
        : null;

  if (!absolute || !fs.existsSync(absolute)) {
    return {
      audit: auditWorkshopSource('', brand, tier, target),
      error: `Missing file for tier ${tier}.`,
    };
  }

  const sourceText = fs.readFileSync(absolute, 'utf8');
  return { audit: auditWorkshopSource(sourceText, brand, tier, target), error: null };
}

function extensionForMime(mime: string): string {
  if (mime.includes('jpeg') || mime.includes('jpg')) return '.jpg';
  if (mime.includes('webp')) return '.webp';
  if (mime.includes('gif')) return '.gif';
  return '.png';
}

function listBriefs(): { filename: string; path: string; updatedAt: string | null }[] {
  if (!fs.existsSync(WORKSHOP_BRIEFS_DIR)) return [];
  return fs
    .readdirSync(WORKSHOP_BRIEFS_DIR)
    .filter((name) => name.endsWith('.json'))
    .map((filename) => {
      const absolute = path.join(WORKSHOP_BRIEFS_DIR, filename);
      let updatedAt: string | null = null;
      try {
        const parsed = JSON.parse(fs.readFileSync(absolute, 'utf8')) as LogoWorkshopBrief;
        updatedAt = parsed.updatedAt ?? null;
      } catch {
        updatedAt = null;
      }
      return {
        filename,
        path: path.relative(WORKSPACE_ROOT, absolute),
        updatedAt,
      };
    })
    .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''));
}

export async function GET(request: Request) {
  if (!devOnly()) {
    return NextResponse.json({ error: 'Logo workshop API is dev-only.' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'briefs') {
    return NextResponse.json({ ok: true, briefs: listBriefs() });
  }

  if (action === 'brief') {
    const file = searchParams.get('file');
    if (!file || file.includes('..')) {
      return NextResponse.json({ error: 'Missing or invalid file param.' }, { status: 400 });
    }
    const absolute = path.join(WORKSHOP_BRIEFS_DIR, path.basename(file));
    if (!fs.existsSync(absolute)) {
      return NextResponse.json({ error: 'Brief not found.' }, { status: 404 });
    }
    const brief = JSON.parse(fs.readFileSync(absolute, 'utf8')) as LogoWorkshopBrief;
    return NextResponse.json({ ok: true, brief, path: path.relative(WORKSPACE_ROOT, absolute) });
  }

  if (action === 'iterations') {
    return NextResponse.json({ ok: true, iterations: listIterations() });
  }

  if (action === 'resolve-pinterest') {
    const pinUrl = searchParams.get('url') ?? '';
    const result = await resolvePinterestImageUrl(pinUrl);
    return NextResponse.json(result);
  }

  const brand = (searchParams.get('brand') ?? 'earnedstar') as LogoWorkshopBrandTarget;
  const tier = (searchParams.get('tier') ?? 'origami') as LogoWorkshopTier;
  const { audit, error } = readSvgAudit(brand, tier);

  return NextResponse.json({ ok: true, audit, error });
}

export async function POST(request: Request) {
  if (!devOnly()) {
    return NextResponse.json({ error: 'Logo workshop API is dev-only.' }, { status: 404 });
  }

  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('multipart/form-data')) {
    const form = await request.formData();
    const briefRaw = form.get('brief');
    const file = form.get('file');
    const label = String(form.get('label') ?? 'Uploaded reference').trim();

    if (typeof briefRaw !== 'string' || !(file instanceof File)) {
      return NextResponse.json({ error: 'Expected brief JSON and image file.' }, { status: 400 });
    }

    let brief: LogoWorkshopBrief;
    try {
      brief = JSON.parse(briefRaw) as LogoWorkshopBrief;
    } catch {
      return NextResponse.json({ error: 'Invalid brief JSON.' }, { status: 400 });
    }

    const ext = extensionForMime(file.type || 'image/png');
    const filename = `${createReferenceId()}${ext}`;
    const absolutePath = path.join(WORKSHOP_REFERENCE_DIR, filename);
    const bytes = Buffer.from(await file.arrayBuffer());
    ensureDirs();
    fs.writeFileSync(absolutePath, bytes);

    const previewUrl = `/brand/workshop/reference/${filename}`;
    const reference: LogoWorkshopReference = {
      id: createReferenceId(),
      source: 'upload',
      label,
      sourceUrl: previewUrl,
      previewUrl,
      savedPath: path.relative(WORKSPACE_ROOT, absolutePath),
    };

    brief = {
      ...brief,
      updatedAt: new Date().toISOString(),
      references: [...brief.references, reference],
    };

    const savedBriefPath = saveBriefJson(brief);

    return NextResponse.json({
      ok: true,
      reference,
      savedBriefPath,
    });
  }

  try {
    const body = (await request.json()) as {
      action?: 'save-brief' | 'iterate';
      brief?: LogoWorkshopBrief;
    };

    if (!body.brief || body.brief.version !== 1) {
      return NextResponse.json({ error: 'Missing brief payload.' }, { status: 400 });
    }

    const brief = body.brief;
    const savedBriefPath = saveBriefJson(brief);

    if (body.action === 'iterate') {
      const { audit } = readSvgAudit(brief.brand, brief.tier);
      const artifacts = iterationArtifactPaths(brief);
      const prompt = buildAiIterationPrompt(brief, audit, {
        savedBriefPath,
        iterationPath: artifacts.workshopMd,
      });
      const figmaPrompt = buildFigmaHandoffPrompt(brief, audit);

      ensureDirs();
      const mdAbsolute = path.join(WORKSPACE_ROOT, artifacts.workshopMd);
      const txtAbsolute = path.join(WORKSPACE_ROOT, artifacts.cursorTxt);
      const figmaAbsolute = path.join(WORKSPACE_ROOT, artifacts.figmaTxt);
      fs.writeFileSync(mdAbsolute, `${prompt}\n`, 'utf8');
      fs.writeFileSync(txtAbsolute, `${prompt}\n`, 'utf8');
      fs.writeFileSync(figmaAbsolute, `${figmaPrompt}\n`, 'utf8');

      const esMd = path.join(WORKSHOP_ITERATIONS_DIR, `${briefSlug(brief)}.md`);
      fs.writeFileSync(esMd, `${prompt}\n`, 'utf8');

      return NextResponse.json({
        ok: true,
        savedBriefPath,
        prompt,
        figmaPrompt,
        audit,
        artifacts: {
          workshopMd: path.relative(WORKSPACE_ROOT, esMd),
          cursorTxt: artifacts.cursorTxt,
          figmaTxt: artifacts.figmaTxt,
          cursorAtReference: `@${artifacts.cursorTxt}`,
          figmaAtReference: `@${artifacts.figmaTxt}`,
        },
      });
    }

    return NextResponse.json({ ok: true, savedBriefPath });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }
}
