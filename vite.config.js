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
      exclude: ['**/*.d.ts', 'node_modules', 'dist'],
      // `lib/utils` holds internal helpers that are not part of the public API,
      // so their declaration files are not published. They cannot be handled via
      // `exclude`, as that drops them from the type-check program and breaks the
      // imports in `lib/DropdownToggle.ts`.
      beforeWriteFile: (filePath) => {
        if (filePath.includes(`${path.sep}utils${path.sep}`)) {
          return false;
        }
      }
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
