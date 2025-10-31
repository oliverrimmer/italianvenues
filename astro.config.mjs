// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://italianvenues.com', // Your production URL
  integrations: [
    tailwind(),
    sitemap({
      // Customize sitemap generation
      filter: (page) => !page.includes('/api/'), // Exclude API routes
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    })
  ],
  output: 'server', // Enable server mode for API routes
  adapter: vercel(), // Vercel adapter for serverless deployment
});
