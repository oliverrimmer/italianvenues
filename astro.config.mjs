// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://italianvenues.com', // Your production URL
  integrations: [
    tailwind(),
  ],
  output: 'server', // Server mode for API routes
  adapter: vercel(), // Vercel adapter
});
