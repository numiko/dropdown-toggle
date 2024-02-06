import path from 'path'
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    environment: 'happy-dom'
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/main.js'),
      name: 'DropdownToggle',
      fileName: (format) => `DropdownToggle.${format}.js`
    }
  }
})
