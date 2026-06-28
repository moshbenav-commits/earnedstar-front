#!/usr/bin/env node
/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
/**
 * Apply pending EarnedStar SQL migrations (002+) to the Supabase project.
 * Uses SUPABASE_ACCESS_TOKEN from env or earnedstar-back/.env.provision.local
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.resolve(__dirname, '../../earnedstar/supabase/migrations');
const PROJECT_REF = process.env.EARNEDSTAR_SUPABASE_REF?.trim() || 'ppnbpblnuxbihhxgozxi';

function loadToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN?.trim()) return process.env.SUPABASE_ACCESS_TOKEN.trim();
  const local = path.join(__dirname, '../.env.provision.local');
  if (!fs.existsSync(local)) return null;
  const line = fs.readFileSync(local, 'utf8').split('\n').find((l) => l.startsWith('SUPABASE_ACCESS_TOKEN='));
  return line?.slice('SUPABASE_ACCESS_TOKEN='.length).trim() ?? null;
}

async function runQuery(token, sql) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Migration failed (${res.status}): ${text.slice(0, 500)}`);
  }
  return text;
}

async function main() {
  const token = loadToken();
  if (!token) {
    console.error('Missing SUPABASE_ACCESS_TOKEN');
    process.exit(1);
  }

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const pending = files.filter((f) => f !== '001_initial.sql');
  console.log(`Applying ${pending.length} migrations to ${PROJECT_REF}…`);

  for (const file of pending) {
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    console.log(`→ ${file}`);
    await runQuery(token, sql);
    console.log(`  ✓ ${file}`);
  }

  console.log('All pending migrations applied.');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
