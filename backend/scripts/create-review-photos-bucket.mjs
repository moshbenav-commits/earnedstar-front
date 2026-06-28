#!/usr/bin/env node
/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
/**
 * Create the public `review-photos` Supabase Storage bucket (migration 003 assumes it exists).
 *
 * Requires in earnedstar-back/.env or .env.provision.local:
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
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

function loadEnv() {
  const merged = {
    ...loadEnvFile(path.join(ROOT, '.env')),
    ...loadEnvFile(path.join(ROOT, '.env.provision.local')),
    ...process.env,
  };
  return merged;
}

async function main() {
  const env = loadEnv();
  const url = env.SUPABASE_URL?.trim();
  const key = env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const bucket = 'review-photos';
  const listRes = await fetch(`${url}/storage/v1/bucket`, {
    headers: { Authorization: `Bearer ${key}`, apikey: key },
  });
  if (!listRes.ok) {
    console.error('List buckets failed:', await listRes.text());
    process.exit(1);
  }
  const buckets = await listRes.json();
  if (buckets.some((b) => b.name === bucket)) {
    console.log(`Bucket "${bucket}" already exists.`);
    return;
  }

  const createRes = await fetch(`${url}/storage/v1/bucket`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: bucket,
      public: true,
      file_size_limit: 5_242_880,
      allowed_mime_types: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    }),
  });

  if (!createRes.ok) {
    console.error('Create bucket failed:', await createRes.text());
    process.exit(1);
  }
  console.log(`Created public bucket "${bucket}".`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
