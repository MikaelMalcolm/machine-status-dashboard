import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite bundles your React app for development and production.
// See https://vite.dev/config/ for more options.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
