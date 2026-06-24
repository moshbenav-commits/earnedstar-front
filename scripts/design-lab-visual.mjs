#!/usr/bin/env node
/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
/**
 * EarnedStar design-lab baseline audit (CI-safe) or capture (dev server required).
 *
 * Usage:
 *   npm run qa:design-lab:baseline   # write PNGs — localhost:3000 must be up
 *   npm run qa:design-lab:ci         # verify baselines exist + valid PNG
 *   npm run qa:design-lab:visual:strict
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const esRoot = path.join(__dirname, '..');
const frontRoot = path.join(esRoot, '..', 'expedia-parts-front');
const baselineDir = path.join(esRoot, 'test/visual/design-lab/baselines');

const ROUTES = [
  '/design-lab',
  '/design-lab/tokens',
  '/design-lab/stars',
  '/design-lab/brand',
  '/design-lab/logo-workshop',
  '/design-lab/shared',
];

function routeSlug(route) {
  return route.replace(/^\//, '').replace(/\//g, '__') || 'root';
}

function isValidPng(buffer) {
  if (buffer.length < 24) return false;
  const sig = buffer.subarray(0, 8);
  const pngSig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return sig.equals(pngSig);
}

export function runEarnedStarBaselineAudit() {
  const failures = [];
  for (const route of ROUTES) {
    const slug = routeSlug(route);
    const baselinePath = path.join(baselineDir, `${slug}.png`);
    if (!fs.existsSync(baselinePath)) {
      failures.push({ route, issue: `missing baseline ${slug}.png — run npm run qa:design-lab:baseline` });
      continue;
    }
    const buf = fs.readFileSync(baselinePath);
    if (!isValidPng(buf)) {
      failures.push({ route, issue: `invalid PNG ${slug}.png` });
    }
  }
  return { routes: ROUTES.length, failures, passed: failures.length === 0, mode: 'audit' };
}

export async function runEarnedStarDesignLabVisual(options = {}) {
  const update = options.update ?? process.argv.includes('--update');
  const strict = options.strict ?? process.argv.includes('--strict');

  if (!update && !strict) {
    return runEarnedStarBaselineAudit();
  }

  const visualScript = path.join(frontRoot, 'scripts/browser-qa/design-lab-visual.mjs');
  if (!fs.existsSync(visualScript)) {
    throw new Error('expedia-parts-front design-lab-visual.mjs not found — clone sibling repo');
  }

  const { loadPlaywright } = await import(
    path.join(frontRoot, 'scripts/browser-qa/lib/env.mjs')
  );

  const baseUrl = (options.baseUrl ?? process.env.BROWSER_QA_BASE_URL ?? 'http://localhost:3000').replace(
    /\/$/,
    '',
  );

  const chromium = await loadPlaywright();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const failures = [];
  const updated = [];

  fs.mkdirSync(baselineDir, { recursive: true });

  async function waitForStable() {
    await page.waitForSelector('[data-surface="dark"]', { timeout: 25_000 });
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready;
    });
    await page.waitForTimeout(800);
  }

  async function captureShell() {
    const shell = page.locator('div.ds-surface-dark[data-surface="dark"]').filter({
      has: page.getByRole('navigation', { name: 'Design lab sections' }),
    });
    await shell.waitFor({ state: 'visible', timeout: 15_000 });
    return shell.screenshot({ type: 'png', animations: 'disabled' });
  }

  const requireFromFront = createRequire(path.join(frontRoot, 'package.json'));

  function visualsMatch(baseline, current, maxDiffRatio = 0.01) {
    if (baseline.equals(current)) return { ok: true, ratio: 0 };
    const { PNG } = requireFromFront('pngjs');
    const pixelmatch = requireFromFront('pixelmatch');
    const img1 = PNG.sync.read(baseline);
    const img2 = PNG.sync.read(current);
    if (img1.width !== img2.width || img1.height !== img2.height) {
      return { ok: false, ratio: 1 };
    }
    const diff = new PNG({ width: img1.width, height: img1.height });
    const diffPixels = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, {
      threshold: 0.12,
    });
    const ratio = diffPixels / (img1.width * img1.height);
    return { ok: ratio <= maxDiffRatio, ratio };
  }

  for (const route of ROUTES) {
    const slug = routeSlug(route);
    const baselinePath = path.join(baselineDir, `${slug}.png`);
    const url = `${baseUrl}${route}`;

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
      await waitForStable();
      const shot = await captureShell();

      if (update) {
        fs.writeFileSync(baselinePath, shot);
        updated.push(slug);
        continue;
      }

      if (!fs.existsSync(baselinePath)) {
        failures.push({ route, issue: `missing baseline ${slug}.png` });
        continue;
      }

      const baseline = fs.readFileSync(baselinePath);
      const match = visualsMatch(baseline, shot);
      if (!match.ok) {
        const diffPath = path.join(baselineDir, `${slug}.diff-received.png`);
        fs.writeFileSync(diffPath, shot);
        failures.push({
          route,
          issue: `visual drift (ratio ${(match.ratio * 100).toFixed(2)}%)`,
        });
      }
    } catch (err) {
      failures.push({ route, issue: err instanceof Error ? err.message : String(err) });
    }
  }

  await browser.close();

  return {
    baseUrl,
    mode: update ? 'update' : 'strict',
    routes: ROUTES.length,
    updated,
    failures,
    passed: failures.length === 0,
  };
}

const isMain = process.argv[1]?.includes('design-lab-visual');
if (isMain) {
  const update = process.argv.includes('--update');
  const strict = process.argv.includes('--strict');

  runEarnedStarDesignLabVisual({ update, strict })
    .then((result) => {
      if (result.mode === 'update') {
        console.log(
          `earnedstar design-lab baselines updated — ${result.updated.length} PNGs in test/visual/design-lab/baselines/`,
        );
        process.exit(0);
      }
      if (result.mode === 'audit') {
        if (result.passed) {
          console.log(`earnedstar design-lab baseline audit OK — ${result.routes} PNGs present`);
          process.exit(0);
        }
        console.error('earnedstar design-lab baseline audit FAILED:');
        for (const f of result.failures) console.error(`  ${f.route}: ${f.issue}`);
        process.exit(1);
      }
      if (result.passed) {
        console.log(`earnedstar design-lab strict OK — ${result.routes} routes @ ${result.baseUrl}`);
        process.exit(0);
      }
      console.error('earnedstar design-lab strict FAILED:');
      for (const f of result.failures) console.error(`  ${f.route}: ${f.issue}`);
      process.exit(1);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
