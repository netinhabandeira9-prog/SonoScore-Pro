import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import pkg from 'vite-plugin-sitemap';
const { sitemap } = pkg;

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://www.sonoscorepro.com.br',
      routes: [
        { url: '/',          changefreq: 'daily',   priority: 1.0 },
        { url: '/quiz',      changefreq: 'daily',   priority: 0.9 },
        { url: '/resultado', changefreq: 'weekly',  priority: 0.9 },
        { url: '/obrigado',  changefreq: 'monthly', priority: 0.7 },
      ],
      exclude: ['/app', '/app/*', '/login', '/dashboard', '/billing'],
      generateRobotsTxt: true,
    }),
  ],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000
  }
});
