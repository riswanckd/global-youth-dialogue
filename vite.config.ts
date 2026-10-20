import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Root Vite config to allow Vercel or any runner to execute "vite build" directly from root
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'sync-dist-dirs',
      closeBundle() {
        const distRoot = path.resolve(__dirname, 'dist');
        const webDist = path.resolve(__dirname, 'web/dist');
        if (fs.existsSync(distRoot)) {
          fs.cpSync(distRoot, webDist, { recursive: true });
        }
      },
    },
  ],
  root: path.resolve(__dirname, 'web'),
  publicDir: path.resolve(__dirname, 'web/public'),
  css: {
    postcss: path.resolve(__dirname, 'web'),
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
