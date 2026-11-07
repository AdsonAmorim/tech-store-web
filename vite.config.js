import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Só em desenvolvimento, quando VITE_API_URL está vazia: /api vai para a API local
    proxy: { '/api': 'http://localhost:3001' },
  },
});
