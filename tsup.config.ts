import { defineConfig } from 'tsup';

// Emit ESM (.js) and CommonJS (.cjs) bundles plus bundled type declarations, so the
// package works with both `import` and `require`. The SDK has no runtime
// dependencies, so the output is self-contained.
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  target: 'es2022',
});
