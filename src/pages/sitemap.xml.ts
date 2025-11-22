import type { APIRoute } from 'astro';

const venueModules = import.meta.glob('../data/venues/*.json', { eager: true });
const styleModules = import.meta.glob('../data/styles/*.json', { eager: true });
const destinationModules = import.meta.glob('../data/destinations/*.json', { eager: true });

const venueSlugs = Object.keys(venueModules).map((path) => path.split('/').pop()?.replace('.json', '') || '');
const styleSlugs = Object.keys(styleModules).map((path) => path.split('/').pop()?.replace('.json', '') || '');
const destinationSlugs = Object.keys(destinationModules).map((path) => path.split('/').pop()?.replace('.json', '') || '');

export const GET: APIRoute = () => {
  const siteUrl = 'https://italianvenues.com';
  const lastmod = new Date().toISOString();

  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/weddings', priority: '0.9', changefreq: 'daily' },
    { url: '/weddings/venues', priority: '0.9', changefreq: 'daily' },
    { url: '/weddings/destinations', priority: '0.8', changefreq: 'weekly' },
    { url: '/weddings/styles', priority: '0.8', changefreq: 'weekly' },
    { url: '/weddings/journal', priority: '0.7', changefreq: 'weekly' },
    { url: '/weddings/journal/20-best-italian-wedding-venues-2026-2027', priority: '0.8', changefreq: 'monthly' },
    { url: '/travel', priority: '0.4', changefreq: 'monthly' },
    { url: '/about', priority: '0.6', changefreq: 'monthly' },
    { url: '/contact', priority: '0.6', changefreq: 'monthly' },
    { url: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
    { url: '/terms', priority: '0.3', changefreq: 'yearly' },
    { url: '/cookie-policy', priority: '0.3', changefreq: 'yearly' },
  ];

  const venuePages = venueSlugs.map((slug) => ({
    url: `/weddings/venues/${slug}`,
    priority: '0.9',
    changefreq: 'weekly',
  }));

  const stylePages = styleSlugs.map((slug) => ({
    url: `/weddings/styles/${slug}`,
    priority: '0.8',
    changefreq: 'weekly',
  }));

  const destinationPages = destinationSlugs.map((slug) => ({
    url: `/weddings/destinations/${slug}`,
    priority: '0.8',
    changefreq: 'weekly',
  }));

  const allPages = [...staticPages, ...venuePages, ...stylePages, ...destinationPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

