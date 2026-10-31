import { defineConfig } from 'vite';

/**
 * Relative base keeps the production build portable: it works on GitHub Pages
 * project sites, Netlify, and a plain static file server without rewrites.
 */
export default defineConfig({
  base: './',
  server: {
    host: true,
    port: 5173,
  },
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
  },
});
