import path from 'path';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'vite';

const typescriptPlugin = typescript({
  exclude: [
    "./src/**/*.stories.tsx",
    "./src/**/*.test.ts",
    "node_modules/**/*",
    "vite.config.ts",
    "vitest.config.ts"
  ]
});

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'react-hooks-helpers',
      fileName: format => `index.${format}.js`
    },
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {
          react: 'react'
        }
      },
      plugins: [typescriptPlugin]
    }
  },
})