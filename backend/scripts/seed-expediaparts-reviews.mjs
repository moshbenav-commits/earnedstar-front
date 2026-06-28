#!/usr/bin/env node
/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
/**
 * Seed published reviews for ExpediaParts founding merchant.
 * Requires DATABASE_URL or Supabase management token in .env.provision.local
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PROJECT_REF = 'ppnbpblnuxbihhxgozxi';

const REVIEWS = [
  {
    customer_name: 'Marcus T.',
    order_id: 'ORD-48291',
    rating: 5,
    text: 'Exactly what I ordered. Fast shipping and the reman engine matched the listing perfectly. Would buy again.',
    product: 'Remanufactured 2.5L Engine — Toyota Camry',
    ymm: { year: 2018, make: 'Toyota', model: 'Camry' },
    response: null,
    days_ago: 14,
  },
  {
    customer_name: 'Diane K.',
    order_id: 'ORD-48102',
    rating: 5,
    text: 'Great quality and customer service responded within hours. Core return process was straightforward.',
    product: '4L60E Transmission — Chevy Silverado 1500',
    ymm: { year: 2016, make: 'Chevrolet', model: 'Silverado 1500' },
    response: 'Thank you, Diane! We appreciate you taking the time to share your experience.',
    days_ago: 18,
  },
  {
    customer_name: 'Rafael S.',
    order_id: 'ORD-47988',
    rating: 4,
    text: 'Solid product quality. Shipping took a day longer than expected but the transfer case fit right up.',
    product: 'NP246 Transfer Case — GMC Sierra',
    ymm: { year: 2014, make: 'GMC', model: 'Sierra 1500' },
    response: null,
    days_ago: 22,
  },
  {
    customer_name: 'Amelia W.',
    order_id: 'ORD-47856',
    rating: 5,
    text: 'Verified purchase badge gave our shoppers confidence. Install kit arrived complete with all hardware.',
    product: 'Engine Install Kit — Hardware + Fluids',
    ymm: { year: 2012, make: 'Ford', model: 'F-150' },
    response: null,
    days_ago: 25,
  },
  {
    customer_name: 'James P.',
    order_id: 'ORD-47701',
    rating: 5,
    text: 'Called sales, got the right VIN match, and the engine fired on first crank. Honest mileage disclosure.',
    product: 'Used 5.3L V8 Engine — Low Miles',
    ymm: { year: 2019, make: 'Chevrolet', model: 'Tahoe' },
    response: 'Thanks James — glad the VIN match worked out.',
    days_ago: 30,
  },
  {
    customer_name: 'Sofia R.',
    order_id: 'ORD-47544',
    rating: 5,
    text: 'Warranty team was helpful when I had a question about break-in oil. Five stars for communication.',
    product: 'Remanufactured 6-Speed Automatic',
    ymm: { year: 2015, make: 'Ram', model: '1500' },
    response: null,
    days_ago: 35,
  },
  {
    customer_name: 'Kevin L.',
    order_id: 'ORD-47390',
    rating: 4,
    text: 'Good value vs local yards. Tracking updates were accurate and the part was well packaged.',
    product: 'Rear Differential Assembly',
    ymm: { year: 2013, make: 'Toyota', model: 'Tacoma' },
    response: null,
    days_ago: 40,
  },
  {
    customer_name: 'Nina H.',
    order_id: 'ORD-47211',
    rating: 5,
    text: 'Bought for our shop fleet — three units so far, all passed bench checks. Repeat customer.',
    product: 'Remanufactured 4.0L V6 Engine',
    ymm: { year: 2011, make: 'Jeep', model: 'Wrangler' },
    response: null,
    days_ago: 45,
  },
];

function loadToken() {
  const local = path.join(ROOT, '.env.provision.local');
  if (!fs.existsSync(local)) return process.env.SUPABASE_ACCESS_TOKEN?.trim() ?? null;
  const line = fs.readFileSync(local, 'utf8').split('\n').find((l) => l.startsWith('SUPABASE_ACCESS_TOKEN='));
  return line?.slice('SUPABASE_ACCESS_TOKEN='.length).trim() ?? null;
}

async function runQuery(token, sql) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
  });
  if (!res.ok) throw new Error(`Query failed (${res.status}): ${(await res.text()).slice(0, 400)}`);
  return res.json();
}

async function main() {
  const token = loadToken();
  if (!token) {
    console.error('Set SUPABASE_ACCESS_TOKEN in .env.provision.local');
    process.exit(1);
  }

  const bizRows = await runQuery(
    token,
    `SELECT id::text FROM businesses WHERE slug = 'expediaparts' LIMIT 1`,
  );
  const businessId = bizRows?.[0]?.id;
  if (!businessId) throw new Error('expediaparts business not found — run provision:supabase first');

  for (const r of REVIEWS) {
    const created = new Date(Date.now() - r.days_ago * 86400000).toISOString();
    const sql = `
      INSERT INTO reviews (
        business_id, customer_name, order_id, rating_overall, review_text,
        ymm_year, ymm_make, ymm_model, verified_purchase, fraud_score, status,
        business_response, helpful_count, published_at, created_at
      )
      SELECT '${businessId}'::uuid, '${r.customer_name.replace(/'/g, "''")}', '${r.order_id}',
        ${r.rating}, '${r.text.replace(/'/g, "''")}',
        ${r.ymm.year}, '${r.ymm.make}', '${r.ymm.model}',
        true, ${Math.floor(Math.random() * 15) + 5}, 'published',
        ${r.response ? `'${r.response.replace(/'/g, "''")}'` : 'NULL'},
        ${Math.floor(Math.random() * 20) + 3},
        '${created}', '${created}'
      WHERE NOT EXISTS (
        SELECT 1 FROM reviews WHERE business_id = '${businessId}'::uuid AND order_id = '${r.order_id}'
      );
    `;
    await runQuery(token, sql);
  }

  await runQuery(
    token,
    `UPDATE businesses SET
      review_count = (SELECT COUNT(*) FROM reviews WHERE business_id = businesses.id AND status = 'published'),
      avg_rating = COALESCE((SELECT ROUND(AVG(rating_overall)::numeric, 2) FROM reviews WHERE business_id = businesses.id AND status = 'published'), 0)
     WHERE slug = 'expediaparts'`,
  );

  const summary = await runQuery(
    token,
    `SELECT review_count, avg_rating FROM businesses WHERE slug = 'expediaparts'`,
  );
  console.log('Seeded reviews for expediaparts:', summary?.[0]);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
