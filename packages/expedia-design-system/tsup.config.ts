/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { defineConfig } from 'tsup';
import { cpSync } from 'node:fs';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    tokens: 'src/tokens.ts',
    typography: 'src/typography.ts',
    brandAssets: 'src/brandAssets.ts',
    'components/index': 'src/components/index.ts',
  },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'react-icons', 'clsx', 'next'],
  onSuccess: async () => {
    cpSync('src/styles', 'dist/styles', { recursive: true });
  },
});
