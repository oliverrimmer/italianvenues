import type { APIRoute } from 'astro';

// List all venue slugs
const venueSlugs = [
  'hotel-il-pellicano',
  'la-posta-vecchia',
  'masseria-salamina',
  'mezzatorre-hotel-thermal-spa'
];

// List all style pages
const stylePages = ['luxury', 'seaside', 'villa', 'castle', 'rustic'];

// List all location pages
const locationPages = ['tuscany', 'amalfi-coast', 'lake-como', 'rome', 'puglia', 'umbria'];

// Generate sitemap XML
export const GET: APIRoute = () => {
  const siteUrl = 'https://italianvenues.com';
  const lastmod = new Date().toISOString();

  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' }, // homepage
    { url: '/venues', priority: '0.9', changefreq: 'daily' },
    { url: '/about', priority: '0.7', changefreq: 'monthly' },
    { url: '/contact', priority: '0.7', changefreq: 'monthly' },
    { url: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
    { url: '/terms', priority: '0.3', changefreq: 'yearly' },
    { url: '/cookie-policy', priority: '0.3', changefreq: 'yearly' },
  ];

  const venuePages = venueSlugs.map(slug => ({
    url: `/venues/${slug}`,
    priority: '0.9',
    changefreq: 'weekly'
  }));

  const stylePagesData = stylePages.map(slug => ({
    url: `/styles/${slug}`,
    priority: '0.8',
    changefreq: 'weekly'
  }));

  const locationPagesData = locationPages.map(slug => ({
    url: `/locations/${slug}`,
    priority: '0.8',
    changefreq: 'weekly'
  }));

  const allPages = [...staticPages, ...venuePages, ...stylePagesData, ...locationPagesData];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};

