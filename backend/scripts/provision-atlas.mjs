#!/usr/bin/env node
/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
/**
 * Create a dedicated MongoDB Atlas project + M0 cluster for EarnedStar.
 *
 * Requires Atlas Admin API keys (Organization → Access Manager → API Keys):
 *   ATLAS_PUBLIC_KEY
 *   ATLAS_PRIVATE_KEY
 *
 * Usage:
 *   ATLAS_PUBLIC_KEY=... ATLAS_PRIVATE_KEY=... node scripts/provision-atlas.mjs
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ATLAS_VERSION = '2023-01-01';
const PROJECT_NAME = 'earnedstar';
const CLUSTER_NAME = 'earnedstar-m0';

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

function resolveAtlasKeys() {
  const local = loadDotEnv(path.join(ROOT, '.env.provision.local'));
  const pub = process.env.ATLAS_PUBLIC_KEY?.trim() || local.ATLAS_PUBLIC_KEY?.trim();
  const priv = process.env.ATLAS_PRIVATE_KEY?.trim() || local.ATLAS_PRIVATE_KEY?.trim();
  return { pub, priv };
}

async function atlasFetch(pub, priv, pathname, options = {}) {
  const auth = Buffer.from(`${pub}:${priv}`).toString('base64');
  const res = await fetch(`https://cloud.mongodb.com${pathname}`, {
    ...options,
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
      Accept: `application/vnd.atlas.${ATLAS_VERSION}+json`,
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
    throw new Error(`Atlas API ${pathname} failed (${res.status}): ${String(JSON.stringify(body)).slice(0, 500)}`);
  }
  return body;
}

function generatePassword() {
  return crypto.randomBytes(16).toString('base64url');
}

async function waitForCluster(pub, priv, groupId, clusterName, timeoutMs = 600_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const cluster = await atlasFetch(pub, priv, `/api/atlas/v2/groups/${groupId}/clusters/${clusterName}`);
    console.log(`  Cluster state: ${cluster.stateName}`);
    if (cluster.stateName === 'IDLE') return cluster;
    await new Promise((r) => setTimeout(r, 20_000));
  }
  throw new Error(`Timed out waiting for Atlas cluster ${clusterName}`);
}

async function main() {
  const { pub, priv } = resolveAtlasKeys();
  if (!pub || !priv) {
    console.error('Set ATLAS_PUBLIC_KEY and ATLAS_PRIVATE_KEY (Atlas → Organization → API Keys).');
    process.exit(1);
  }

  console.log('1/4 — Resolve Atlas organization…');
  const orgs = await atlasFetch(pub, priv, '/api/atlas/v2/orgs');
  const org = orgs.results?.[0];
  if (!org?.id) throw new Error('No Atlas organizations found');
  console.log(`  Using org: ${org.name} (${org.id})`);

  console.log('2/4 — Create or reuse Atlas project…');
  const projects = await atlasFetch(pub, priv, '/api/atlas/v2/groups');
  let group = projects.results?.find((p) => p.name?.toLowerCase() === PROJECT_NAME);
  if (!group) {
    group = await atlasFetch(pub, priv, '/api/atlas/v2/groups', {
      method: 'POST',
      body: JSON.stringify({ name: PROJECT_NAME, orgId: org.id }),
    });
    console.log(`  Created project ${group.name} (${group.id})`);
  } else {
    console.log(`  Reusing project ${group.name} (${group.id})`);
  }

  console.log('3/4 — Create or reuse M0 cluster…');
  let cluster;
  try {
    cluster = await atlasFetch(pub, priv, `/api/atlas/v2/groups/${group.id}/clusters/${CLUSTER_NAME}`);
    console.log(`  Reusing cluster ${cluster.name} (${cluster.stateName})`);
  } catch {
    cluster = await atlasFetch(pub, priv, `/api/atlas/v2/groups/${group.id}/clusters`, {
      method: 'POST',
      body: JSON.stringify({
        name: CLUSTER_NAME,
        clusterType: 'REPLICASET',
        providerSettings: {
          providerName: 'TENANT',
          backingProviderName: 'AWS',
          regionName: 'US_EAST_1',
          instanceSizeName: 'M0',
        },
      }),
    });
    console.log(`  Created cluster ${cluster.name}`);
  }

  if (cluster.stateName !== 'IDLE') {
    await waitForCluster(pub, priv, group.id, CLUSTER_NAME);
  }

  const dbUser = 'earnedstar_app';
  const dbPass = generatePassword();
  console.log('4/4 — Ensure database user + collections…');
  try {
    await atlasFetch(pub, priv, `/api/atlas/v2/groups/${group.id}/databaseUsers`, {
      method: 'POST',
      body: JSON.stringify({
        username: dbUser,
        password: dbPass,
        databaseName: 'admin',
        roles: [{ roleName: 'readWrite', databaseName: 'earnedstar' }],
        scopes: [{ name: CLUSTER_NAME, type: 'CLUSTER' }],
      }),
    });
    console.log(`  Created database user ${dbUser}`);
  } catch (err) {
    const msg = String(err);
    if (!msg.includes('409') && !msg.includes('already exists')) throw err;
    console.log(`  Database user ${dbUser} already exists — reset password via Atlas UI if needed`);
  }

  const srv = cluster.connectionStrings?.standardSrv ?? cluster.srvAddress;
  if (!srv) {
    cluster = await atlasFetch(pub, priv, `/api/atlas/v2/groups/${group.id}/clusters/${CLUSTER_NAME}`);
  }
  const host = (cluster.connectionStrings?.standardSrv ?? '').replace('mongodb+srv://', '').split('/')[0];
  const uri = `mongodb+srv://${encodeURIComponent(dbUser)}:${encodeURIComponent(dbPass)}@${host}/earnedstar?retryWrites=true&w=majority&maxPoolSize=10&maxIdleTimeMS=30000`;

  const manifest = {
    atlas: {
      org_id: org.id,
      project_id: group.id,
      project_name: group.name,
      cluster_name: CLUSTER_NAME,
      dashboard_url: `https://cloud.mongodb.com/v2/${group.id}#/clusters/detail/${CLUSTER_NAME}`,
    },
    mongodb: {
      database: 'earnedstar',
      uri,
      atlas_tier: 'M0',
      max_pool_size: 10,
    },
  };

  const outPath = path.join(ROOT, 'provision-result.json');
  const existing = fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, 'utf8')) : {};
  fs.writeFileSync(outPath, JSON.stringify({ ...existing, ...manifest }, null, 2));
  console.log(`Wrote ${outPath}`);
  console.log('Add MONGODB_URI to earnedstar-back Vercel env, then redeploy.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
