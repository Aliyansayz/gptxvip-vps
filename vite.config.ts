import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react(), tailwindcss()],

    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },

    resolve: {
      alias: {
        // The agent catalog is a self-contained view and uses @/ for its local modules.
        '@': path.resolve(__dirname, 'src/devLushArea/agentMarketplace'),
      },
    },

    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      host: true,
      allowedHosts: ['gptx.vip'],
      proxy: {
        '/ws': { target: 'ws://127.0.0.1:8000', ws: true },
        '/api': { target: 'http://127.0.0.1:8000' },
      },
    },

    preview: {
      host: true,
      allowedHosts: ['gptx.vip'],
    },
  };
});
