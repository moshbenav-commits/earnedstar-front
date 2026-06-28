#!/usr/bin/env node
/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
/**
 * Bulk IndexNow ping for all public EarnedStar Review Profiles.
 * Usage: INDEXNOW_API_KEY=... EARNEDSTAR_SITE_URL=https://earnedstar.com DATABASE_URL=... node scripts/seo-ping-indexnow.mjs
 */
import pg from 'pg';

const siteUrl = (process.env.EARNEDSTAR_SITE_URL ?? 'https://earnedstar.com').replace(/\/$/, '');
const key = process.env.INDEXNOW_API_KEY?.trim();
const dbUrl = process.env.DATABASE_URL?.trim();

if (!key) {
  console.error('INDEXNOW_API_KEY is required');
  process.exit(1);
}
if (!dbUrl) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

async function main() {
  const { rows } = await pool.query(
    `SELECT slug FROM businesses
     WHERE COALESCE(public_profile_enabled, true) = true AND review_count > 0
     ORDER BY slug`,
  );
  const host = new URL(siteUrl).host;
  const urls = rows.map((r) => `${siteUrl}/reviews/${r.slug}`);
  console.log(`Pinging ${urls.length} profile URLs…`);

  const chunkSize = 500;
  for (let i = 0; i < urls.length; i += chunkSize) {
    const chunk = urls.slice(i, i + chunkSize);
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key,
        keyLocation: `${siteUrl}/indexnow-key.txt`,
        urlList: chunk,
      }),
    });
    console.log(`Batch ${i / chunkSize + 1}: HTTP ${res.status}`);
  }

  await pool.end();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
