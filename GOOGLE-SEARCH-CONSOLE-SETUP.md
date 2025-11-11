# Google Search Console Setup Guide

## ✅ Your Sitemap is Golden!

Your sitemap configuration includes:
- **Homepage**: Priority 1.0 (highest) - Daily updates
- **Venues & Venues List**: Priority 0.9 - Daily/Weekly updates
- **Styles & Locations**: Priority 0.8 - Weekly updates
- **Contact/About**: Priority 0.7 - Monthly updates
- **Legal Pages**: Priority 0.3 - Yearly updates
- **API endpoints**: Excluded from crawling

**Sitemap URL:**
- `https://italianvenues.com/sitemap.xml`

**Expected Pages in Sitemap (20+ pages):**
- Homepage
- 4 venue pages (hotel-il-pellicano, la-posta-vecchia, masseria-salamina, mezzatorre-hotel-thermal-spa)
- 5 style pages (luxury, seaside, villa, castle, rustic)
- 6 location pages (tuscany, amalfi-coast, lake-como, rome, puglia, umbria)
- Venues listing page
- About, Contact
- Legal pages (privacy, terms, cookies)

---

## 🔍 Google Search Console Setup

### Step 1: Access Google Search Console
1. Go to [https://search.google.com/search-console](https://search.google.com/search-console)
2. Sign in with your Google account
3. Click **"Add Property"**

### Step 2: Add Your Domain
You have two options:

#### Option A: Domain Property (Recommended)
- Enter: `italianvenues.com`
- This covers all subdomains (www, etc.) and protocols (http, https)
- **Verification Method**: DNS TXT record
  - Google will give you a TXT record
  - Add it to your 10web DNS settings (Type: TXT, Name: @)
  - Click "Verify" in Google Search Console

#### Option B: URL Prefix Property
- Enter: `https://italianvenues.com`
- Only covers this specific URL
- **Verification Method**: Multiple options
  - HTML file upload (easiest for Vercel)
  - HTML meta tag
  - Google Analytics
  - Google Tag Manager

### Step 3: Verify Ownership

**If using HTML Meta Tag (easiest):**
1. Google gives you a meta tag like: `<meta name="google-site-verification" content="xxx..." />`
2. We'll add it to your `BaseLayout.astro` head section
3. Deploy the site
4. Click "Verify" in Google Search Console

**Want me to add the verification tag now?** Just paste the tag Google gives you.

### Step 4: Submit Your Sitemap
1. Once verified, go to **"Sitemaps"** in the left sidebar
2. Add a new sitemap: `sitemap.xml`
3. Click **"Submit"**
4. Google will start crawling within 24-48 hours

### Step 5: Check Coverage
After a few days:
- Go to **"Coverage"** or **"Pages"** section
- Check for any errors or warnings
- Should see ~20+ valid pages

---

## 🤖 Robots.txt - Already Perfect!

Your `robots.txt` is already configured:
```
✅ Allows all search engines
✅ Blocks /api/ endpoints
✅ References sitemaps
✅ Optimized crawl delays for Google/Bing
```

**Live at:** `https://italianvenues.com/robots.txt`

---

## 📊 Bing Webmaster Tools (Optional but Recommended)

1. Go to [https://www.bing.com/webmasters](https://www.bing.com/webmasters)
2. Sign in with Microsoft account
3. **Import from Google Search Console** (easiest!) or add manually
4. Submit sitemap: `sitemap-index.xml`

---

## 🎯 Post-Launch Checklist

**Within 24 hours:**
- [ ] Verify domain in Google Search Console
- [ ] Submit sitemap
- [ ] Check `italianvenues.com/sitemap.xml` loads correctly
- [ ] Check `italianvenues.com/robots.txt` loads correctly

**Within 1 week:**
- [ ] Check Search Console for crawl errors
- [ ] Verify all pages are indexed (Pages → Coverage)
- [ ] Check for any mobile usability issues
- [ ] Review Core Web Vitals

**Within 1 month:**
- [ ] Check search performance (queries, impressions, clicks)
- [ ] Identify top-performing pages
- [ ] Look for indexing issues or warnings

---

## 🚀 Pro Tips

### 1. Index Request (For Faster Indexing)
After launch, in Search Console:
- Go to URL Inspection tool (top bar)
- Paste key URLs (homepage, top venues)
- Click "Request Indexing"
- Do this for your 5-10 most important pages

### 2. Mobile-First Indexing
Google uses mobile version for ranking:
- Check "Mobile Usability" section
- Your site is already mobile-responsive ✅

### 3. Rich Results
Your Schema.org markup is already in place:
- EventVenue schema on venue pages
- TouristDestination schema on location pages
- WebPage schema on all pages
- Check with [Rich Results Test](https://search.google.com/test/rich-results)

### 4. Performance Monitoring
- Speed Insights already enabled ✅
- Core Web Vitals will appear in Search Console after ~28 days
- Monitor Page Experience report

---

## 📈 Expected Timeline

| Time | What to Expect |
|------|----------------|
| **Day 1** | Submit sitemap, Google acknowledges |
| **Day 2-3** | Initial crawling begins |
| **Week 1** | Most pages indexed |
| **Week 2** | Search performance data starts appearing |
| **Week 4** | Core Web Vitals data available |
| **Month 2-3** | Ranking improvements for branded searches |
| **Month 3-6** | Organic traffic grows for long-tail keywords |

---

## 🆘 Troubleshooting

**Sitemap not found?**
- Wait 5-10 minutes after deployment
- Check it's accessible: `https://italianvenues.com/sitemap.xml`
- Resubmit in Search Console

**Pages not indexing?**
- Check Coverage report for errors
- Use URL Inspection tool
- Check for noindex tags (shouldn't have any)
- Request indexing manually

**Need help?**
All your technical SEO is already set up correctly. Just need to verify ownership and submit!

