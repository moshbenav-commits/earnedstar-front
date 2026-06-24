#!/usr/bin/env node
/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
/**
 * Scan for Vercel billable features and optional team billing health (VERCEL_TOKEN).
 *
 * Exit codes:
 *   0 — no critical findings (deploy may proceed)
 *   1 — warnings only (--ci fails on warnings)
 *   2 — critical findings; require VERCEL_DEPLOY_APPROVED=1 or GitHub environment approval
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');

const args = new Set(process.argv.slice(2));
const isCi = args.has('--ci');
const isPreDeploy = args.has('--pre-deploy');
const jsonOut = args.has('--json');

/** @type {{ id: string, severity: 'critical' | 'warning' | 'info', title: string, detail: string, fix?: string }[]} */
const findings = [];

function add(severity, id, title, detail, fix) {
  findings.push({ id, severity, title, detail, fix });
}

function readText(relPath) {
  const abs = path.join(repoRoot, relPath);
  if (!fs.existsSync(abs)) return null;
  return fs.readFileSync(abs, 'utf8');
}

function readJson(relPath) {
  const raw = readText(relPath);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function scanPackageJson() {
  const pkg = readJson('package.json');
  if (!pkg) return;

  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const rules = [
    {
      key: '@vercel/speed-insights',
      severity: 'critical',
      title: 'Speed Insights package',
      detail: 'Pro add-on ~$10/project/month when enabled on team plans.',
      fix: 'Remove @vercel/speed-insights and <SpeedInsights />; use GA4/Clarity instead.',
    },
    {
      key: '@vercel/analytics',
      severity: 'critical',
      title: 'Vercel Web Analytics package',
      detail: 'Metered events beyond Hobby allowance.',
      fix: 'Remove @vercel/analytics; keep GA4/Clarity.',
    },
    {
      key: '@vercel/blob',
      severity: 'warning',
      title: 'Vercel Blob storage',
      detail: 'Blob storage is metered beyond included usage.',
      fix: 'Prefer Supabase/Cloudinary for new assets unless Blob is required.',
    },
    {
      key: 'ai',
      match: (name) => name.startsWith('@ai-sdk/') || name === 'ai' || name === '@vercel/ai',
      severity: 'critical',
      title: 'Vercel / AI SDK dependency',
      detail: 'AI SDK usage can incur Vercel AI Gateway or provider charges.',
      fix: 'Route AI calls through your Nest API with explicit provider keys, not Vercel AI billing.',
    },
  ];

  for (const [name] of Object.entries(deps)) {
    for (const rule of rules) {
      if (rule.key && name === rule.key) {
        add(rule.severity, `pkg:${name}`, rule.title, rule.detail, rule.fix);
      } else if (rule.match?.(name)) {
        add(rule.severity, `pkg:${name}`, rule.title, `${rule.detail} (package: ${name})`, rule.fix);
      }
    }
  }
}

function scanSourcePatterns() {
  const patterns = [
    {
      glob: 'src/app/layout.tsx',
      regex: /SpeedInsights|<SpeedInsights/,
      id: 'src:speed-insights',
      severity: 'critical',
      title: 'Speed Insights rendered in root layout',
      detail: 'Enabling Speed Insights in dashboard bills ~$10/project/month on Pro.',
      fix: 'Remove <SpeedInsights /> from layout.tsx.',
    },
    {
      glob: 'src',
      regex: /from '@vercel\/analytics|Analytics\s*from\s*'@vercel\/analytics/,
      id: 'src:vercel-analytics',
      severity: 'critical',
      title: 'Vercel Web Analytics import in source',
      detail: 'Metered analytics events on Vercel.',
      fix: 'Remove Vercel Analytics; use GA4.',
    },
  ];

  function walk(dir, cb) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.next') continue;
        walk(abs, cb);
      } else if (/\.(tsx?|jsx?|mjs)$/.test(entry.name)) {
        cb(abs);
      }
    }
  }

  for (const rule of patterns) {
    if (rule.glob === 'src') {
      walk(path.join(repoRoot, 'src'), (file) => {
        const text = fs.readFileSync(file, 'utf8');
        if (rule.regex.test(text)) {
          add(
            rule.severity,
            rule.id,
            rule.title,
            `${rule.detail} (${path.relative(repoRoot, file)})`,
            rule.fix,
          );
        }
      });
      continue;
    }

    const text = readText(rule.glob);
    if (text && rule.regex.test(text)) {
      add(rule.severity, rule.id, rule.title, rule.detail, rule.fix);
    }
  }
}

function scanVercelJson() {
  const vercel = readJson('vercel.json');
  if (!vercel) return;

  if (vercel.git?.deploymentEnabled === true) {
    add(
      'warning',
      'git:auto-deploy',
      'Git push auto-deploy enabled',
      'Every push to main deploys to Vercel without this guard. Disable git.deploymentEnabled to require GitHub Actions approval deploys only.',
      'Set vercel.json git.deploymentEnabled to false and use .github/workflows/vercel-deploy.yml.',
    );
  }

  const crons = vercel.crons ?? [];
  if (crons.length > 0) {
    add(
      'warning',
      'vercel:crons',
      `${crons.length} Vercel cron job(s) configured`,
      'Crons invoke serverless functions on a schedule (function + duration usage).',
      'Move heavy jobs to GitHub Actions or an external scheduler if leaving Vercel.',
    );
  }
}

function loadVercelToken() {
  const fromEnv = process.env.VERCEL_TOKEN?.trim();
  if (fromEnv) return fromEnv;
  try {
    const authPath = path.join(
      process.env.HOME ?? '',
      'Library/Application Support/com.vercel.cli/auth.json',
    );
    const auth = JSON.parse(fs.readFileSync(authPath, 'utf8'));
    return typeof auth.token === 'string' ? auth.token.trim() : null;
  } catch {
    return null;
  }
}

async function resolveTeamId(token) {
  const fromEnv = process.env.VERCEL_ORG_ID?.trim();
  if (fromEnv) return fromEnv;
  const slug = process.env.VERCEL_TEAM_SLUG?.trim() || 'expedia-solutions';
  const res = await fetch('https://api.vercel.com/v2/teams', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.teams?.find((team) => team.slug === slug)?.id ?? null;
}

async function scanVercelProjectDashboard(token, teamId) {
  const pkg = readJson('package.json');
  const projectName = process.env.VERCEL_PROJECT_NAME?.trim() || pkg?.name;
  if (!projectName) return;

  try {
    const res = await fetch(
      `https://api.vercel.com/v9/projects/${encodeURIComponent(projectName)}?teamId=${teamId}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!res.ok) {
      add(
        'warning',
        'api:project',
        'Could not read Vercel project add-ons',
        `HTTP ${res.status} for project ${projectName}.`,
      );
      return;
    }

    const project = await res.json();
    const si = project.speedInsights;
    const speedInsightsActive =
      si?.enabledAt &&
      (!si.disabledAt || si.enabledAt > si.disabledAt);

    if (speedInsightsActive) {
      add(
        'critical',
        'dashboard:speed-insights',
        'Speed Insights enabled in Vercel dashboard',
        `Project "${projectName}" still has Speed Insights on (~$10/project/mo on Pro) even if code was removed.`,
        `https://vercel.com/expedia-solutions/${projectName}/speed-insights — ⋯ menu → Disable Speed Insights`,
      );
    } else if (si?.disabledAt) {
      add(
        'info',
        'dashboard:speed-insights-off',
        'Speed Insights disabled in Vercel dashboard',
        si.canceledAt
          ? `Billing for "${projectName}" stops collecting new data; add-on cancels at end of cycle.`
          : `Speed Insights is off for "${projectName}".`,
      );
    }

    if (project.webAnalytics?.id && project.webAnalytics?.enabledAt) {
      add(
        'warning',
        'dashboard:web-analytics',
        'Vercel Web Analytics enabled in dashboard',
        `Project "${projectName}" has Web Analytics on (metered events).`,
        `https://vercel.com/expedia-solutions/${projectName}/analytics — disable if unused.`,
      );
    }
  } catch (error) {
    add(
      'warning',
      'api:project-network',
      'Vercel project add-on check failed',
      error instanceof Error ? error.message : String(error),
    );
  }
}

async function scanTeamBilling() {
  const token = loadVercelToken();
  const teamId = token ? await resolveTeamId(token) : null;
  if (!token || !teamId) {
    add(
      'info',
      'api:skipped',
      'Vercel billing API check skipped',
      'Set VERCEL_TOKEN + VERCEL_ORG_ID (or log in via Vercel CLI locally) to verify billing and dashboard add-ons.',
    );
    return;
  }

  try {
    const res = await fetch(`https://api.vercel.com/v2/teams/${teamId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      add(
        'warning',
        'api:teams',
        'Could not read Vercel team billing state',
        `HTTP ${res.status} — verify token scope includes team read.`,
      );
      return;
    }

    const team = await res.json();
    const billing = team?.billing ?? team;
    const plan = billing?.plan ?? team?.billingPlan ?? 'unknown';
    const billingStatus = billing?.status ?? 'unknown';

    add(
      'info',
      'api:plan',
      `Vercel team plan: ${plan} (${billingStatus})`,
      billingStatus === 'active'
        ? 'Billing is active — deploys should succeed.'
        : 'Verify billing before production deploy.',
    );

    if (
      team?.limited === true ||
      billingStatus === 'overdue' ||
      billing?.blocked === true
    ) {
      add(
        'critical',
        'api:account-blocked',
        'Vercel account or billing is blocked',
        'Deploys fail until payment method / overdue balance is resolved.',
        'https://vercel.com/teams/expedia-solutions/settings/billing',
      );
    }

    const spendLimit = billing?.controls?.analyticsSpendLimitInDollars;
    if (typeof spendLimit === 'number') {
      add(
        'info',
        'api:spend-limit',
        `Vercel spend alert threshold: $${spendLimit}/cycle`,
        'Configure email alerts in Vercel → Team Settings → Billing → Spend Management.',
        'https://vercel.com/teams/expedia-solutions/settings/billing',
      );
    }

    await scanVercelProjectDashboard(token, teamId);
  } catch (error) {
    add(
      'warning',
      'api:network',
      'Vercel billing API unreachable',
      error instanceof Error ? error.message : String(error),
    );
  }
}

function printReport() {
  const critical = findings.filter((f) => f.severity === 'critical');
  const warnings = findings.filter((f) => f.severity === 'warning');
  const infos = findings.filter((f) => f.severity === 'info');

  if (jsonOut) {
    console.log(JSON.stringify({ critical, warnings, infos }, null, 2));
    return;
  }

  console.log('\n=== Vercel billing guard ===\n');

  const sections = [
    ['CRITICAL — approval required', critical],
    ['WARNINGS — review recommended', warnings],
    ['INFO', infos],
  ];

  for (const [label, items] of sections) {
    if (items.length === 0) continue;
    console.log(`${label}:`);
    for (const item of items) {
      console.log(`  • [${item.id}] ${item.title}`);
      console.log(`    ${item.detail}`);
      if (item.fix) console.log(`    Fix: ${item.fix}`);
    }
    console.log('');
  }

  if (isPreDeploy) {
    console.log('Production deploy uses Vercel build minutes and may incur Pro plan charges.');
    console.log('To proceed with critical items present, set VERCEL_DEPLOY_APPROVED=1');
    console.log('or run deploy via GitHub Actions → Vercel production deploy (requires reviewer).\n');
  }
}

function exitCode() {
  const critical = findings.some((f) => f.severity === 'critical');
  const warnings = findings.some((f) => f.severity === 'warning');

  if (critical) return 2;
  if (isCi && warnings) return 1;
  return 0;
}

scanPackageJson();
scanSourcePatterns();
scanVercelJson();
await scanTeamBilling();
printReport();
process.exit(exitCode());
