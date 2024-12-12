import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        dir: 'build'
      }
    }
  },
  // Optionally, copy extension files
  resolve: {
    alias: {
      '@extension': path.resolve(__dirname, 'extension')
    }
  }
});