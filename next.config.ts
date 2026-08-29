/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // P11 trust/security baseline (site-audit securityHeaders). No CSP here —
  // a blanket CSP would break inline scripts/styles on a site we haven't
  // CSP-audited.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  transpilePackages: ["@expedia/design-system", "@expedia/design-lab"],
  async rewrites() {
    return [
      { source: "/embed/v1/widget.js", destination: "/widget/v1/widget.js" },
      { source: "/embed/v1/badge.js", destination: "/badge/v1/badge.js" },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.expediaparts.com", pathname: "/**" },
      { protocol: "https", hostname: "expediaparts.com", pathname: "/**" },
      { protocol: "https", hostname: "*.supabase.co", pathname: "/**" },
    ],
  },
};

export default nextConfig;
