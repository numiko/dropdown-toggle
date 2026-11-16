import path from 'path';
import eslint from 'vite-plugin-eslint';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [eslint(), dts({
    exclude: ['**/*.d.ts', 'node_modules', 'dist', 'lib/utils'],
    external: ['gsap'],
    skipDiagnostics: true,
    tsconfigPath: './tsconfig.dts.json',
  })],
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
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['gsap'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          gsap: 'gsap',
        },
      },
    },
  }
});
