import { defineConfig } from 'tsup';

/**
 * Per-module entry points so consumers can deep-import a single feature
 * (e.g. `@bndynet/color-hub/harmony`) for better tree-shaking. The barrel
 * (`src/index.ts`) is also the IIFE/CDN build that exposes the global `ch`.
 */
const moduleEntries = [
  'src/utils.ts',
  'src/scale.ts',
  'src/harmony.ts',
  'src/css.ts',
  'src/theme-factory.ts',
  'src/runtime.ts',
  'src/cvd.ts',
  'src/interpolate.ts',
  'src/color-hub.ts',
];

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs', 'iife'],
    globalName: 'ch',
    dts: true,
    sourcemap: true,
    clean: true,
    minify: true,
    target: 'es2020',
    outDir: 'dist',
  },
  {
    entry: moduleEntries,
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    // Keep the IIFE build from the first config; do not wipe it.
    clean: false,
    minify: true,
    target: 'es2020',
    outDir: 'dist',
  },
]);
