import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    watch: {
      usePolling: true,
      ignored: ['**/node_modules/**', '**/build/**']
    },
    hmr: {
      overlay: true
    }
  },

  build: {
    outDir: 'build',

    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: () => 'index.js',
      name: 'index',
      formats: ['es']
    },

    rollupOptions: {
      output: {
        extend: true,
        inlineDynamicImports: true
      }
    }
  },

  envDir: resolve(__dirname, '../../')
});
