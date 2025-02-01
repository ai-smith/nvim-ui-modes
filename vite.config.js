import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/extension.ts',
      name: 'extension',
      fileName: 'extension',
    },
    rollupOptions: {
      external: ['vscode'],
    },
  },
});
