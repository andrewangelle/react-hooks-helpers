import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'react-hooks-helpers',
      fileName: format => `react-hooks-helpers.${format}.js`
    },
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {
          react: 'react'
        }
      }
    }
  },
})