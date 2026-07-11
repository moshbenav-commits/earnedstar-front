import { NextRequest, NextResponse } from 'next/server';

const API_BASE =
  process.env.VISITOR_PULSE_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://expedia-parts-back-gamma.vercel.app/api';

const DEFAULT_BRAND = 'earnedstar';

const GEO_HEADER_COUNTRY = 'x-storefront-geo-country';
const GEO_HEADER_REGION = 'x-storefront-geo-region';
const GEO_HEADER_CITY = 'x-storefront-geo-city';
const GEO_HEADER_SOURCE = 'x-storefront-geo-source';

function resolveBrand(): string {
  return process.env.NEXT_PUBLIC_STOREFRONT_BRAND || DEFAULT_BRAND;
}

function buildForwardHeaders(request: NextRequest): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-storefront-brand': resolveBrand(),
  };

  const userAgent = request.headers.get('user-agent');
  if (userAgent) headers['user-agent'] = userAgent;

  const vercelCountry = request.headers.get('x-vercel-ip-country');
  if (vercelCountry) {
    headers[GEO_HEADER_COUNTRY] = vercelCountry;
    const region = request.headers.get('x-vercel-ip-country-region');
    if (region) headers[GEO_HEADER_REGION] = region;
    const city = request.headers.get('x-vercel-ip-city');
    if (city) headers[GEO_HEADER_CITY] = city;
    headers[GEO_HEADER_SOURCE] = 'vercel';
  } else {
    const cfCountry = request.headers.get('cf-ipcountry');
    if (cfCountry && cfCountry !== 'XX') {
      headers[GEO_HEADER_COUNTRY] = cfCountry;
      const region = request.headers.get('cf-region');
      if (region) headers[GEO_HEADER_REGION] = region;
      const city = request.headers.get('cf-ipcity');
      if (city) headers[GEO_HEADER_CITY] = city;
      headers[GEO_HEADER_SOURCE] = 'cloudflare';
    }
  }

  return headers;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const headers = buildForwardHeaders(request);

    const response = await fetch(`${API_BASE}/marketing/sessions/track`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
