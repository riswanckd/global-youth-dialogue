import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/admin/',
  plugins: [
    react(),
    {
      name: 'root-redirect',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/' || req.url === '') {
            res.writeHead(302, { Location: '/admin/' });
            res.end();
            return;
          }
          next();
        });
      },
    },
  ],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'https://gyde-api.vercel.app',
        changeOrigin: true,
      },
    },
  },
});
