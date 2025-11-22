// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://italianvenues.com', // Your production URL
  integrations: [
    tailwind(),
    sitemap(),
  ],
  output: 'server', // Server mode for API routes
  adapter: vercel(), // Vercel adapter
});
