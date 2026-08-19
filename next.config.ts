/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import type { NextConfig } from "next";
/** PRC-023 Wave 2 — OpenNext on Workers. Leave Vercel `next build` unchanged. */
const isOpenNext = process.env.OPENNEXT_BUILD === "1";


const nextConfig: NextConfig = {
  ...(isOpenNext ? { output: "standalone" as const } : {}),
  ...(isOpenNext ? { serverExternalPackages: ["sharp"] } : {}),
  transpilePackages: ["@expedia/design-system", "@expedia/design-lab"],
  async rewrites() {
    return [
      { source: "/embed/v1/widget.js", destination: "/widget/v1/widget.js" },
      { source: "/embed/v1/badge.js", destination: "/badge/v1/badge.js" },
    ];
  },
  images: {
    ...(isOpenNext ? { unoptimized: true } : {}),
    remotePatterns: [
      { protocol: "https", hostname: "www.expediaparts.com", pathname: "/**" },
      { protocol: "https", hostname: "expediaparts.com", pathname: "/**" },
      { protocol: "https", hostname: "*.supabase.co", pathname: "/**" },
    ],
  },
};

export default nextConfig;
