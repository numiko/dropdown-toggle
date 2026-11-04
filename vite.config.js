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
      outDir: 'dist',
      rollupTypes: true,
      exclude: ['**/*.d.ts', 'node_modules', 'dist', 'lib/utils'],
      external: ['gsap'],
      skipDiagnostics: true
    })
  ],
  test: {
    environment: 'happy-dom',
    coverage: {
      include: ['lib/']
    }
  },
  build: {
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
