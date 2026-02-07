
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Polyfill process.env for the browser to prevent crashes in some libs
    'process.env': process.env
  },
  server: {
    port: 3000,
    open: false
  }
});
