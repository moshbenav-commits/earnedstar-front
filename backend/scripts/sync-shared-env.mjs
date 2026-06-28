#!/usr/bin/env node
/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
/**
 * Copy shared integration keys from expedia-parts-back Vercel env → earnedstar-back.
 * Prerequisite:
 *   cd expedia-parts-back && vercel env pull /tmp/ep-back-env.pull --environment production --yes
 */
import { execSync, spawnSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE_ENV = process.env.EARNEDSTAR_ENV_SOURCE ?? '/tmp/ep-back-env.pull';

const COPY_KEYS = [
  'TELNYX_API_KEY',
  'TELNYX_SMS_FROM_NUMBER',
  'TELNYX_MESSAGING_PROFILE_ID',
  'TELNYX_BRAND_TOLLFREE',
];

const DEFAULTS = {
  EARNEDSTAR_SITE_URL: 'https://earnedstar.com',
  PUBLIC_API_URL: 'https://earnedstar-back.vercel.app/api',
  CORS_ORIGIN:
    'http://localhost:3000,https://earnedstar.com,https://www.earnedstar.com,https://earnedstar.vercel.app',
};

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const out = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx < 0) continue;
    const key = trimmed.slice(0, idx);
    let val = trimmed.slice(idx + 1);
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function upsertVercelEnv(projectName, key, value) {
  const cwd = projectName === 'earnedstar' ? path.resolve(ROOT, '../earnedstar') : ROOT;
  try {
    execSync(`vercel env rm ${key} production --scope expedia-solutions --yes`, { stdio: 'pipe', cwd });
  } catch {
    // not set
  }
  const child = spawnSync(
    'vercel',
    ['env', 'add', key, 'production', '--scope', 'expedia-solutions', '--force'],
    { cwd, input: value, encoding: 'utf8' },
  );
  if (child.status !== 0) {
    throw new Error(`vercel env add ${key} failed: ${child.stderr || child.stdout}`);
  }
  console.log(`  ✓ ${projectName}: ${key}`);
}

function main() {
  const source = loadEnv(SOURCE_ENV);
  if (!Object.keys(source).length) {
    console.error(`Missing ${SOURCE_ENV} — pull expedia-parts-back env first.`);
    process.exit(1);
  }

  console.log('Syncing earnedstar-back Vercel env…');
  for (const key of COPY_KEYS) {
    if (source[key]?.trim()) upsertVercelEnv('earnedstar-back', key, source[key].trim());
  }

  for (const [key, value] of Object.entries(DEFAULTS)) {
    upsertVercelEnv('earnedstar-back', key, value);
  }

  const rotateWebhook = process.argv.includes('--rotate-webhook-secret');
  if (rotateWebhook) {
    const secret = crypto.randomBytes(24).toString('hex');
    upsertVercelEnv('earnedstar-back', 'EARNEDSTAR_WEBHOOK_SECRET', secret);
    console.log('Rotated EARNEDSTAR_WEBHOOK_SECRET on earnedstar-back.');
    console.log('Copy this value to expedia-parts-back + Shopify webhook if using order-fulfilled integration.');
  } else {
    console.log('Skipped webhook secret (pass --rotate-webhook-secret to regenerate).');
  }

  console.log('Done. Redeploy earnedstar-back for env to take effect.');
}

main();
