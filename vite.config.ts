import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        // Manifest file
        {
          src: 'public/manifest.json',
          dest: '.',
        },
        // Background script
        {
          src: 'public/background.js',
          dest: '.',
        },
        // Content script
        {
          src: 'public/content.js',
          dest: '.',
        },
        // Workers and other static resources
        {
          src: 'public/workers/*', // Ensures all files in 'workers' are copied
          dest: 'workers',
        },
      ],
    }),
  ],
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        main: './index.html',
        background: path.resolve(__dirname, 'public/background.js'),
        content: path.resolve(__dirname, 'public/content.js'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
    sourcemap: process.env.NODE_ENV === 'development', // Include source maps only in development
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
