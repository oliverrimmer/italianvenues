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
      // Custom priorities based on page importance
      customize(item) {
        // Homepage gets highest priority
        if (item.url === 'https://italianvenues.com/') {
          return { ...item, priority: 1.0, changefreq: 'daily' };
        }
        // Venue pages - critical for conversions
        if (item.url.includes('/venues/')) {
          return { ...item, priority: 0.9, changefreq: 'weekly' };
        }
        // All venues listing page
        if (item.url.endsWith('/venues')) {
          return { ...item, priority: 0.9, changefreq: 'daily' };
        }
        // Style pages - important landing pages
        if (item.url.includes('/styles/')) {
          return { ...item, priority: 0.8, changefreq: 'weekly' };
        }
        // Location pages - important landing pages
        if (item.url.includes('/locations/')) {
          return { ...item, priority: 0.8, changefreq: 'weekly' };
        }
        // Contact and About - moderate priority
        if (item.url.includes('/contact') || item.url.includes('/about')) {
          return { ...item, priority: 0.7, changefreq: 'monthly' };
        }
        // Legal pages - lower priority
        if (item.url.includes('/privacy') || item.url.includes('/terms') || item.url.includes('/cookie')) {
          return { ...item, priority: 0.3, changefreq: 'yearly' };
        }
        // Default
        return item;
      }
    })
  ],
  output: 'server', // Enable server mode for API routes
  adapter: vercel(), // Vercel adapter for serverless deployment
});
