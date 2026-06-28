#!/usr/bin/env node
/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
/**
 * Provision dedicated EarnedStar Supabase project + MongoDB database profile.
 *
 * Prerequisites:
 *   SUPABASE_ACCESS_TOKEN — https://supabase.com/dashboard/account/tokens
 *   MONGODB_URI — Atlas admin URI (defaults to expedia-parts-back Vercel prod pull)
 *
 * Usage:
 *   SUPABASE_ACCESS_TOKEN=sbp_... node scripts/provision-databases.mjs
 *   node scripts/provision-databases.mjs --supabase-only
 *   node scripts/provision-databases.mjs --mongo-only
 */
import { execSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MIGRATION_SQL = path.resolve(ROOT, '../earnedstar/supabase/migrations/001_initial.sql');
const PROVISION_ENV = '/tmp/earnedstar-provision.env';
const REGION = 'us-east-2';
const PROJECT_NAME = 'earnedstar';
const args = new Set(process.argv.slice(2));
const supabaseOnly = args.has('--supabase-only');
const mongoOnly = args.has('--mongo-only');

function loadDotEnv(filePath) {
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

function generatePassword() {
  return crypto.randomBytes(18).toString('base64url');
}

function resolveSupabaseToken() {
  const fromEnv = process.env.SUPABASE_ACCESS_TOKEN?.trim();
  if (fromEnv) return fromEnv;
  const backEnv = loadDotEnv(path.resolve(ROOT, '../expedia-parts-back/.env'));
  if (backEnv.SUPABASE_ACCESS_TOKEN?.trim()) return backEnv.SUPABASE_ACCESS_TOKEN.trim();
  const local = loadDotEnv(path.join(ROOT, '.env.provision.local'));
  if (local.SUPABASE_ACCESS_TOKEN?.trim()) return local.SUPABASE_ACCESS_TOKEN.trim();
  return null;
}

function resolveMongoUri() {
  if (process.env.MONGODB_URI?.trim()) return process.env.MONGODB_URI.trim();
  const pulled = loadDotEnv(PROVISION_ENV);
  if (pulled.MONGODB_URI?.trim()) return pulled.MONGODB_URI.trim();
  return null;
}

async function supabaseFetch(token, pathname, options = {}) {
  const res = await fetch(`https://api.supabase.com/v1${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    throw new Error(`Supabase API ${pathname} failed (${res.status}): ${String(body).slice(0, 500)}`);
  }
  return body;
}

async function waitForProjectReady(token, ref, timeoutMs = 180_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const project = await supabaseFetch(token, `/projects/${ref}`);
    if (project.status === 'ACTIVE_HEALTHY' || project.status === 'ACTIVE') return project;
    console.log(`  Supabase project status: ${project.status} — waiting…`);
    await new Promise((r) => setTimeout(r, 8_000));
  }
  throw new Error(`Timed out waiting for Supabase project ${ref} to become active`);
}

function buildDatabaseUrl(ref, password) {
  const encoded = encodeURIComponent(password);
  return `postgresql://postgres.${ref}:${encoded}@aws-1-${REGION}.pooler.supabase.com:6543/postgres?pgbouncer=true`;
}

function buildDirectUrl(ref, password) {
  const encoded = encodeURIComponent(password);
  return `postgresql://postgres.${ref}:${encoded}@aws-1-${REGION}.pooler.supabase.com:5432/postgres`;
}

function deriveEarnedstarMongoUri(baseUri) {
  const m = baseUri.match(/^(mongodb(?:\+srv)?:\/\/[^/]+)(?:\/[^?]*)?(\?.*)?$/);
  if (!m) throw new Error('Invalid MONGODB_URI');
  const suffix = m[2] ?? '';
  const params = new URLSearchParams(suffix.replace(/^\?/, ''));
  if (!params.has('retryWrites')) params.set('retryWrites', 'true');
  if (!params.has('w')) params.set('w', 'majority');
  if (!params.has('maxPoolSize')) params.set('maxPoolSize', '10');
  if (!params.has('maxIdleTimeMS')) params.set('maxIdleTimeMS', '30000');
  const qs = params.toString();
  return `${m[1]}/earnedstar${qs ? `?${qs}` : ''}`;
}

async function provisionMongo(uri) {
  const earnedstarUri = deriveEarnedstarMongoUri(uri);
  const js = `
    const db = db.getSiblingDB('earnedstar');
    const collections = ['merchant_settings','review_events','widget_analytics','auth_sessions'];
    for (const name of collections) {
      if (!db.getCollectionNames().includes(name)) db.createCollection(name);
    }
    db.merchant_settings.createIndex({ slug: 1 }, { unique: true, sparse: true });
    db.review_events.createIndex({ businessId: 1, createdAt: -1 });
    db.widget_analytics.createIndex({ widgetId: 1, day: -1 });
    db.auth_sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    printjson({ ok: true, database: 'earnedstar', collections: db.getCollectionNames() });
  `;
  const tmp = '/tmp/earnedstar-mongo-init.js';
  fs.writeFileSync(tmp, js);
  execSync(`mongosh ${JSON.stringify(earnedstarUri)} --quiet --file ${JSON.stringify(tmp)}`, {
    stdio: 'inherit',
  });
  return earnedstarUri;
}

async function setVercelEnv(projectName, key, value) {
  const cwd =
    projectName === 'earnedstar'
      ? path.resolve(ROOT, '../earnedstar')
      : ROOT;
  execSync(
    `vercel env add ${key} production --value ${JSON.stringify(value)} --scope expedia-solutions --yes --sensitive`,
    { stdio: 'pipe', cwd },
  );
}

async function upsertVercelEnv(projectName, key, value) {
  const cwd =
    projectName === 'earnedstar'
      ? path.resolve(ROOT, '../earnedstar')
      : ROOT;
  try {
    execSync(`vercel env rm ${key} production --scope expedia-solutions --yes`, {
      stdio: 'pipe',
      cwd,
    });
  } catch {
    // not set yet
  }
  await setVercelEnv(projectName, key, value);
}

async function main() {
  if (!mongoOnly) {
    const token = resolveSupabaseToken();
    if (!token) {
      console.error('Set SUPABASE_ACCESS_TOKEN in env or earnedstar-back/.env.provision.local');
      process.exit(1);
    }
    await provisionSupabase(token);
  }

  if (!supabaseOnly) {
    const mongoBase = resolveMongoUri();
    if (mongoBase) {
      await provisionMongoProfile(mongoBase);
    } else {
      console.log('No MONGODB_URI — run scripts/provision-atlas.mjs for a dedicated Atlas project.');
    }
  }
}

async function provisionSupabase(token) {
  console.log('1/3 — Resolve Supabase organization…');
  const orgs = await supabaseFetch(token, '/organizations');
  const org = orgs?.[0];
  if (!org?.slug) throw new Error('No Supabase organizations found for this token');
  console.log(`  Using org: ${org.name} (${org.slug})`);

  console.log('2/3 — Create or reuse Supabase project…');
  const existing = (await supabaseFetch(token, '/projects')).find(
    (p) => p.name?.toLowerCase() === PROJECT_NAME,
  );

  const dbPass = generatePassword();
  let project = existing;
  if (project) {
    console.log(`  Reusing project ${project.name} (${project.ref})`);
    await supabaseFetch(token, `/projects/${project.ref}/database/password`, {
      method: 'PATCH',
      body: JSON.stringify({ password: dbPass }),
    });
  } else {
    project = await supabaseFetch(token, '/projects', {
      method: 'POST',
      body: JSON.stringify({
        name: PROJECT_NAME,
        organization_slug: org.slug,
        db_pass: dbPass,
        region_selection: { type: 'specific', code: REGION },
      }),
    });
    console.log(`  Created project ${project.name} (${project.ref})`);
  }

  await waitForProjectReady(token, project.ref);

  const apiKeys = await supabaseFetch(token, `/projects/${project.ref}/api-keys`);
  const anonKey = apiKeys.find((k) => k.name === 'anon')?.api_key;
  const serviceRoleKey = apiKeys.find((k) => k.name === 'service_role')?.api_key;
  if (!anonKey || !serviceRoleKey) throw new Error('Could not load Supabase API keys');

  const databaseUrl = buildDatabaseUrl(project.ref, dbPass);
  const directUrl = buildDirectUrl(project.ref, dbPass);
  const supabaseUrl = `https://${project.ref}.supabase.co`;

  console.log('3/3 — Apply EarnedStar SQL migration…');
  const sql = fs.readFileSync(MIGRATION_SQL, 'utf8');
  await supabaseFetch(token, `/projects/${project.ref}/database/query`, {
    method: 'POST',
    body: JSON.stringify({ query: sql }),
  });

  const manifest = {
    supabase: {
      project_ref: project.ref,
      url: supabaseUrl,
      region: REGION,
      database_url: databaseUrl,
      direct_url: directUrl,
    },
  };

  const outPath = path.join(ROOT, 'provision-result.json');
  const existingManifest = fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, 'utf8')) : {};
  fs.writeFileSync(outPath, JSON.stringify({ ...existingManifest, ...manifest }, null, 2));
  console.log(`Wrote ${outPath}`);

  console.log('Syncing Supabase env to Vercel…');
  await upsertVercelEnv('earnedstar-back', 'DATABASE_URL', databaseUrl);
  await upsertVercelEnv('earnedstar-back', 'SUPABASE_URL', supabaseUrl);
  await upsertVercelEnv('earnedstar-back', 'SUPABASE_SERVICE_ROLE_KEY', serviceRoleKey);
  await upsertVercelEnv('earnedstar', 'NEXT_PUBLIC_SUPABASE_URL', supabaseUrl);
  await upsertVercelEnv('earnedstar', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', anonKey);
}

async function provisionMongoProfile(mongoBase) {
  console.log('Provisioning MongoDB earnedstar database profile…');
  const earnedstarMongoUri = await provisionMongo(mongoBase);

  const outPath = path.join(ROOT, 'provision-result.json');
  const existingManifest = fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, 'utf8')) : {};
  fs.writeFileSync(
    outPath,
    JSON.stringify(
      {
        ...existingManifest,
        mongodb: {
          database: 'earnedstar',
          uri: earnedstarMongoUri,
          atlas_tier: 'M0',
          max_pool_size: 10,
        },
      },
      null,
      2,
    ),
  );

  await upsertVercelEnv('earnedstar-back', 'MONGODB_URI', earnedstarMongoUri);
  await upsertVercelEnv('earnedstar-back', 'MONGODB_ATLAS_TIER', 'M0');
  await upsertVercelEnv('earnedstar-back', 'MONGODB_MAX_POOL_SIZE', '10');
  console.log('Mongo profile synced to Vercel.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
