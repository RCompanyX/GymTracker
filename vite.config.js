import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          apexcharts: ['apexcharts'],
          papaparse: ['papaparse'],
          datefns: ['date-fns', 'date-fns/locale'],
          lucide: ['lucide']
        }
      }
    }
  }
});
