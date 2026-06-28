#!/usr/bin/env node
/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
/**
 * Set earnedstar-back SMTP env on Vercel after Proton mailboxes exist.
 *
 * Required in earnedstar-back/.env.provision.local (never commit):
 *   SMTP_PASS=<proton SMTP submission token for invitations@earnedstar.com>
 *
 * Optional overrides:
 *   SMTP_HOST=smtp.protonmail.ch
 *   SMTP_USER=invitations@earnedstar.com
 *   SMTP_FROM=EarnedStar Invitations <invitations@earnedstar.com>
 *   SMTP_REPLY_TO=support@earnedstar.com
 *
 * Usage:
 *   node scripts/set-earnedstar-smtp-vercel.mjs
 */
import { execSync, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function loadEnvFile(filePath) {
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

function upsertVercelEnv(key, value) {
  try {
    execSync(`vercel env rm ${key} production --scope expedia-solutions --yes`, {
      stdio: 'pipe',
      cwd: ROOT,
    });
  } catch {
    // not set
  }
  const child = spawnSync(
    'vercel',
    ['env', 'add', key, 'production', '--scope', 'expedia-solutions', '--force'],
    { cwd: ROOT, input: value, encoding: 'utf8' },
  );
  if (child.status !== 0) {
    throw new Error(`vercel env add ${key} failed: ${child.stderr || child.stdout}`);
  }
  console.log(`  ✓ ${key}`);
}

function main() {
  const env = {
    ...loadEnvFile(path.join(ROOT, '.env.provision.local')),
    ...loadEnvFile(path.join(ROOT, '.env')),
    ...process.env,
  };

  const pass = env.SMTP_PASS?.trim();
  if (!pass) {
    console.error('Missing SMTP_PASS in .env.provision.local');
    console.error('Generate in Proton: invitations@ → Settings → SMTP → Create token');
    process.exit(1);
  }

  const vars = {
    SMTP_HOST: env.SMTP_HOST?.trim() || 'smtp.protonmail.ch',
    SMTP_PORT: env.SMTP_PORT?.trim() || '587',
    SMTP_USER: env.SMTP_USER?.trim() || 'invitations@earnedstar.com',
    SMTP_PASS: pass,
    SMTP_FROM:
      env.SMTP_FROM?.trim() || 'EarnedStar Invitations <invitations@earnedstar.com>',
    SMTP_REPLY_TO: env.SMTP_REPLY_TO?.trim() || 'support@earnedstar.com',
  };

  console.log('Setting earnedstar-back Vercel SMTP env…');
  for (const [key, value] of Object.entries(vars)) {
    upsertVercelEnv(key, value);
  }
  console.log('Done. Run: vercel deploy --prod --yes');
}

main();
