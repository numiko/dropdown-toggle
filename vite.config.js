import path from 'path';
import eslint from 'vite-plugin-eslint';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    eslint(),
    dts({
      tsconfigPath: './tsconfig.dts.json',
      entryRoot: 'lib',
      outDirs: 'dist',
      // Do not add `lib/utils` here. Excluding it drops the file from the
      // type-check program, which breaks the import in `lib/DropdownToggle.ts`
      // with TS6307.
      exclude: ['**/*.d.ts', 'node_modules', 'dist']
    })
  ],
  test: {
    environment: 'happy-dom',
    coverage: {
      include: ['lib/']
    }
  },
  build: {
    // Pinned so the published bundles do not drift with the toolchain's
    // default baseline. This matches the support matrix of 4.0.0; raising
    // it is a breaking change for consumers who load `dist` directly.
    target: ['es2020', 'chrome87', 'edge88', 'firefox78', 'safari14'],
    lib: {
      entry: path.resolve(import.meta.dirname, 'lib/DropdownToggle.ts'),
      name: 'DropdownToggle',
      fileName: (format) => `DropdownToggle.${format}.js`
    },
    rolldownOptions: {
      external: ['gsap'],
      output: {
        globals: {
          gsap: 'gsap',
        },
      },
    },
  }
});
