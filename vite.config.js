import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/extension.ts',
      name: 'extension',
      formats: ['cjs'],
      fileName: 'extension',
    },
    rollupOptions: {
      external: ['vscode'],
      output: {
        dir: 'out',
        entryFileNames: 'extension.js',
      }
    },
  },
});
