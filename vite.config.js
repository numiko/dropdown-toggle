import path from 'path';
import eslint from 'vite-plugin-eslint';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [eslint()],
  test: {
    environment: 'happy-dom'
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/DropdownToggle.js'),
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
