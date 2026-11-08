import { defineConfig } from 'vite';

/**
 * Vite configuration for Muggi & Gili's multi-route Preact + TypeScript wedding quest.
 */
export default defineConfig({
  base: '/',
  server: {
    host: true,
    port: 5173,
  },
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
  },
});
