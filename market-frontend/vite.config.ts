import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    https: {
      key: './localhost.key', // Ścieżka do klucza prywatnego
      cert: './localhost.crt', // Ścieżka do certyfikatu
    },
    proxy: {
      '/api': {
        target: 'https://localhost:7143', // Adres Twojego backendu
        changeOrigin: true,
        secure: false, // Ustaw na false dla samo-podpisanego certyfikatu backendu
      },
    },
  },
});