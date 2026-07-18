# SEO Audit Report: dialisis.my

**Date:** 2026-02-20 | **Business Type:** Healthcare Directory (YMYL) | **Framework:** Next.js 14 on Cloudflare/CloudFront

---

## SEO Health Score: 61/100


| Category                  | Score  | Weight | Weighted |
| ------------------------- | ------ | ------ | -------- |
| Technical SEO             | 72/100 | 25%    | 18.0     |
| Content Quality (E-E-A-T) | 42/100 | 25%    | 10.5     |
| On-Page SEO               | 78/100 | 20%    | 15.6     |
| Schema / Structured Data  | 55/100 | 10%    | 5.5      |
| Performance (CWV)         | 60/100 | 10%    | 6.0      |
| Images                    | 75/100 | 5%     | 3.75     |
| AI Search Readiness       | 35/100 | 5%     | 1.75     |
| **Total**                 |        |        | **61.1** |


---

## Prioritized Action Plan

### CRITICAL (Fix Immediately)


| #   | Issue                                                                                                             | Impact                                         | Location                                                              |
| --- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------- |
| 1   | **All blog posts severely under minimum word count** (220-354 words vs 1,500 minimum)                             | Content quality, YMYL trust                    | `posts/*.mdx`                                                         |
| 2   | **No named author or medical reviewer on any content** — anonymous "Dialisis MY" author on a YMYL healthcare site | E-E-A-T, Google trust                          | All blog posts, About page                                            |
| 3   | **Missing HSTS header**                                                                                           | Security vulnerability                         | `next.config.js` headers                                              |
| 4   | **Wrong `lang="ms"` on English blog posts**                                                                       | Confuses search engines about content language | Root layout                                                           |
| 5   | **Google Fonts loaded via CSS `@import`** creating a 3-hop render-blocking waterfall                              | LCP degradation ~300-800ms                     | `src/app/globals.css` lines 1-2                                       |
| 6   | **Garbled Malay text** in 2 blog posts (incoherent words like "keseleraan", "jankaran", "haiwa")                  | Content quality, AI/low-quality signal         | `penapis-dialisis-elisio-hx.mdx`, `terapi-sel-stem-untuk-fistula.mdx` |


### HIGH (Fix Within 1 Week)


| #   | Issue                                                                                                   | Impact                            | Location                                |
| --- | ------------------------------------------------------------------------------------------------------- | --------------------------------- | --------------------------------------- |
| 7   | **About page is only ~90 words** with no names, photos, or credentials                                  | YMYL trust signal                 | `src/app/tentang-kami/page.tsx`         |
| 8   | **Homepage HTML never cached at CDN edge** — TTFB ~580ms on every request                               | Performance, LCP                  | CloudFront/Cloudflare config            |
| 9   | **Missing `og:image` on homepage** — hurts WhatsApp/social sharing                                      | Social sharing, referral traffic  | Homepage metadata                       |
| 10  | **FAQPage schema on location pages** — restricted since Aug 2023 to gov/healthcare authority sites only | Schema warnings in Search Console | `src/lib/location-seo.ts` lines 103-141 |
| 11  | **Missing standalone Organization + WebSite schema** in root layout                                     | No sitelinks searchbox in Google  | `src/app/layout.tsx`                    |
| 12  | **Missing BreadcrumbList schema on blog posts** (visual breadcrumbs exist but no JSON-LD)               | Missing breadcrumb rich results   | `src/lib/json-ld.ts`                    |
| 13  | **Missing CSP, Referrer-Policy, Permissions-Policy headers**                                            | Security hardening                | `next.config.js`                        |
| 14  | **Gmail address on contact page** instead of domain email                                               | Trust signal                      | `src/app/hubungi-kami/page.tsx`         |
| 15  | **Duplicate Kuala Lumpur URLs in sitemap** (12 URLs appear twice)                                       | Crawl budget waste                | `src/lib/location-utils.ts`             |
| 16  | **35 undersized touch targets on mobile** — nav buttons 36px, state pills 34px (min: 44px)              | Mobile usability, accessibility   | Header, location filters                |


### MEDIUM (Fix Within 1 Month)


| #   | Issue                                                                                        | Impact                                  | Location                                    |
| --- | -------------------------------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------- |
| 17  | **framer-motion** (~50KB compressed) contributing to heavy JS bundle (243KB total)           | INP, mobile performance                 | Bundle analysis                             |
| 18  | **Homepage static text content is only ~315 words** — no educational/informational content   | Content depth, topical authority        | `src/app/(home)/page.tsx`                   |
| 19  | **Location page SEO content is templated/identical** across states except name/numbers       | Thin content risk on programmatic pages | `src/components/location-seo-content.tsx`   |
| 20  | **Privacy policy date dynamically generated** (`new Date()`) — falsely shows "updated today" | Trust signal                            | `src/app/polisi-privasi/page.tsx` line 35   |
| 21  | **No medical disclaimer** visible on content pages (only buried in Terms)                    | YMYL compliance                         | Site-wide component needed                  |
| 22  | **MedicalBusiness schema on center pages** missing `image` and `openingHoursSpecification`   | Rich result eligibility                 | `src/app/(home)/[slug]/page.tsx`            |
| 23  | **Homepage MedicalWebPage schema** has invalid `offers` type (uses Service, expects Offer)   | Schema validation                       | `src/lib/json-ld.ts`                        |
| 24  | **Add preconnect hints** for third-party domains (Google Ads, GTM)                           | LCP improvement ~100-200ms              | `src/app/layout.tsx`                        |
| 25  | **Remove `X-Powered-By: Next.js` header** — reveals tech stack                               | Security                                | `next.config.js` (`poweredByHeader: false`) |


### LOW (Backlog)


| #   | Issue                                                                        | Impact                            | Location                         |
| --- | ---------------------------------------------------------------------------- | --------------------------------- | -------------------------------- |
| 26  | Consolidate duplicate `User-agent: *` blocks in robots.txt                   | Crawler parsing clarity           | `robots.txt`                     |
| 27  | Remove deprecated `<priority>` and `<changefreq>` from sitemaps              | XML bloat reduction               | Sitemap generation               |
| 28  | 246 sitemap URLs share identical `lastmod` timestamp                         | Google ignores unreliable lastmod | Sitemap generation               |
| 29  | Breadcrumb state name lowercase in center page schema ("melaka" vs "Melaka") | Schema accuracy                   | `src/app/(home)/[slug]/page.tsx` |
| 30  | Blog link missing from mobile nav — reduces blog discoverability             | Content discovery                 | Mobile header                    |
| 31  | Consider unblocking AI crawlers if AI citation is a goal                     | AI search visibility              | `robots.txt`                     |
| 32  | Add a `/lokasi` index page as a state selector landing                       | Internal linking, user nav        | New page needed                  |
| 33  | `www.dialisis.my` requires 3 redirect hops instead of 1                      | Minor crawl efficiency            | Cloudflare/CloudFront config     |


---

## Implementation Update (2026-02-21)

### Completed in this pass

- [DONE] **#3 HSTS header added** + additional hardening headers (`CSP`, `Referrer-Policy`, `Permissions-Policy`) in `next.config.js`
- [DONE] **#9 Homepage `og:image` fixed** in `src/app/(home)/page.tsx`
- [DONE] **#12 Blog `BreadcrumbList` JSON-LD added** in `src/app/blog/[slug]/page.tsx`
- [DONE] **#13 Security hardening headers added** in `next.config.js`
- [DONE] **#15 Duplicate Kuala Lumpur location URLs fixed** by deduping `getAllLocationData()` in `src/lib/location-utils.ts`
- [DONE] **#16 Mobile touch targets improved** (navbar buttons + state pills) in `src/components/navbar.tsx` and `src/app/(home)/dialysis-center-list.tsx`
- [DONE] **#20 Privacy policy fixed date** (removed dynamic `new Date()`) in `src/app/polisi-privasi/page.tsx`
- [DONE] **#21 Site-wide medical disclaimer added** in `src/components/medical-disclaimer.tsx` and mounted in `src/app/layout.tsx`
- [DONE] **#22 `MedicalBusiness.image` added** for center pages in `src/app/(home)/[slug]/page.tsx`
- [DONE] **#24 Preconnect hints added** in `src/app/layout.tsx`
- [DONE] **#25 `X-Powered-By` removed** via `poweredByHeader: false` in `next.config.js`
- [DONE] **#27 Removed sitemap `<priority>` and `<changefreq>`** in `src/app/sitemap.ts` and `src/app/api/sitemap/[num]/route.ts`
- [DONE] **#28 Removed unreliable bulk `lastmod` values** for static/location URLs in `src/app/sitemap.ts`
- [DONE] **#30 Blog link added to mobile navbar** in `src/components/navbar.tsx`

### Already resolved before this pass

- [DONE] **#5 Google Fonts CSS `@import` issue** no longer present; app already uses `next/font` in `src/app/layout.tsx`
- [DONE] **#10 FAQPage schema on location pages** not present in current location JSON-LD (`src/lib/location-seo.ts`)
- [DONE] **#11 Standalone `Organization` + `WebSite` schema** already present in `jsonLdGlobal` (`src/lib/json-ld.ts`)
- [DONE] **#23 Invalid homepage `offers` schema** no longer present in `jsonLdHome` (`src/lib/json-ld.ts`)
- [DONE] **#26 Duplicate `User-agent: *` in app-level robots** not present in `src/app/robots.ts`
- [DONE] **#29 Lowercase breadcrumb state name** already normalized in `src/app/(home)/[slug]/page.tsx`

### Pending (needs your input, infra access, or content work)

- [PENDING] **#1, #6, #7, #18, #19** content expansion/quality and About page depth
- [PENDING] **#2** named author + medical reviewer details
- [PENDING] **#4** route-level HTML `lang` per blog language needs broader i18n/layout strategy
- [PENDING] **#8, #33** CDN/edge redirect and caching behavior (CloudFront/Cloudflare level)
- [PENDING] **#14** replace Gmail with domain email (needs your preferred mailbox)
- [PENDING] **#17** `framer-motion` bundle reduction/refactor
- [PENDING] **#22** `openingHoursSpecification` still missing due no reliable opening-hours data per center
- [PENDING] **#31** AI crawler blocking is a policy decision
- [PENDING] **#32** `/lokasi` index landing page not implemented yet

---

## Detailed Category Reports

### 1. Technical SEO (72/100)

#### Crawlability (78/100) — WARNING

**Positive:**

- robots.txt properly blocks API routes, Next.js internals, error pages
- Cloudflare-managed AI crawler blocks with `Content-Signal: search=yes,ai-train=no`
- Sitemap index at `/sitemap.xml` with 2 child sitemaps (~1,235 URLs total)
- Meta robots `index, follow` on all pages with `max-image-preview:large`
- Canonical tags present and correct on all tested pages

**Issues:**

- Duplicate `User-agent: *` blocks in robots.txt (Cloudflare + custom)

#### Indexability (82/100) — PASS

**Positive:**

- No `noindex` tags on tested pages
- Clean URL structure with kebab-case slugs
- Unique, descriptive titles and meta descriptions
- Single H1 per page, logical heading hierarchy
- Bilingual blog posts with hreflang tags (MS/EN)

**Issues:**

- Johor location page HTML is 209 KB (heavy due to 137 inline center listings)

#### Security (58/100) — FAIL


| Header                    | Status                      |
| ------------------------- | --------------------------- |
| HTTPS + redirects         | PASS                        |
| X-Content-Type-Options    | PASS (`nosniff`)            |
| X-Frame-Options           | PASS (`DENY`)               |
| X-XSS-Protection          | PASS (`1; mode=block`)      |
| Strict-Transport-Security | **FAIL** (missing)          |
| Content-Security-Policy   | **FAIL** (missing)          |
| Permissions-Policy        | **FAIL** (missing)          |
| Referrer-Policy           | **FAIL** (missing)          |
| X-Powered-By              | WARNING (reveals `Next.js`) |


#### URL Structure (90/100) — PASS

- Clean lowercase kebab-case URLs, no query params in indexed URLs
- Trailing slash stripped via 308 redirects
- Legacy URL redirects properly configured (301s)
- All URLs under 75 characters
- Issue: `http://www.dialisis.my` requires 3 redirect hops

#### Mobile Optimization (88/100) — PASS

- Viewport meta tag correct
- PWA support (service worker, manifest, apple-touch-icon)
- Responsive CSS with Tailwind
- Images have explicit width/height

#### Core Web Vitals (62/100) — WARNING

- **LCP (NEEDS IMPROVEMENT):** Font waterfall blocks text rendering; no `font-display` in local CSS; LCP element is H1 text
- **INP (NEEDS IMPROVEMENT):** 17 JS chunks + Google Ads script; framer-motion is heavy on main thread
- **CLS (LIKELY GOOD):** Images have dimensions; `aspect-ratio` CSS used; but ad slots may not be pre-sized

#### Page Speed (70/100) — WARNING

- Brotli compression active (88% HTML reduction)
- Static assets cached with `immutable` headers
- HTML pages NOT cached at CDN edge (`cf-cache-status: DYNAMIC`)
- 4 third-party domains loaded without `preconnect` hints
- 17 JS chunks + Google Ads + GTM = significant JS overhead

#### International SEO (55/100) — FAIL

- All pages use `<html lang="ms">` including English blog posts
- hreflang tags implemented on bilingual blog pairs (good)
- `x-default` correctly points to Malay version
- English blog posts: `lang="ms"` conflicts with `og:locale="en_MY"`

---

### 2. Content Quality & E-E-A-T (42/100)

#### E-E-A-T Breakdown


| Signal            | Score  | Weight | Weighted      |
| ----------------- | ------ | ------ | ------------- |
| Experience        | 15/100 | 20%    | 3.0           |
| Expertise         | 30/100 | 25%    | 7.5           |
| Authoritativeness | 25/100 | 25%    | 6.25          |
| Trustworthiness   | 40/100 | 30%    | 12.0          |
| **Total**         |        |        | **28.75/100** |


**Experience (15/100):** Zero first-hand experience signals. No patient stories, no center visits, no staff interviews. Blog author is "Dialisis MY" (organization), not a person. About page ~90 words with no personal/organizational identity.

**Expertise (30/100):** No medical professionals named as contributors or reviewers. Blog content is surface-level. All 8 blog posts are 220-354 words (vs 1,500 minimum). Two Malay posts contain garbled text ("keseleraan", "jankaran", "haiwa" are not real words).

**Authoritativeness (25/100):** Links to National Renal Registry (NRR) in footer. Blog posts cite credible sources (Mayo Clinic, UC Davis). No external recognition, press mentions, or endorsements from medical bodies. Claims "Sumber Rasmi" but doesn't specify the source.

**Trustworthiness (40/100):** Contact page with email, WhatsApp, location. Privacy policy and terms exist. HTTPS enabled. But: Gmail address instead of domain email, no specific street address, no organization registration number, no medical disclaimer on content pages, About page has no names/photos. Privacy policy date is dynamically generated (`new Date()`) showing "today" every day.

#### Blog Post Word Counts


| File                                      | Words | Min Required | Status |
| ----------------------------------------- | ----- | ------------ | ------ |
| `what-is-dialysis.mdx`                    | 231   | 1,500        | FAIL   |
| `apa-itu-dialisis.mdx`                    | 220   | 1,500        | FAIL   |
| `elisio-hx-dialysis-filter.mdx`           | 354   | 1,500        | FAIL   |
| `penapis-dialisis-elisio-hx.mdx`          | 344   | 1,500        | FAIL   |
| `stem-cell-therapy-for-fistula.mdx`       | 276   | 1,500        | FAIL   |
| `terapi-sel-stem-untuk-fistula.mdx`       | 292   | 1,500        | FAIL   |
| `react-cell-therapy-for-ckd-patients.mdx` | 294   | 1,500        | FAIL   |
| `terapi-sel-react-untuk-pesakit-ckd.mdx`  | 287   | 1,500        | FAIL   |


#### AI Citation Readiness (35/100)

- JSON-LD structured data on all page types (good)
- FAQ structured data on location pages provides quotable Q&A
- robots.txt blocks all major AI crawlers (ClaudeBot, GPTBot, Google-Extended)
- Blog posts too short for meaningful citation
- No statistics pages, data tables, or glossary

---

### 3. Schema / Structured Data (55/100)

#### Schema Inventory


| Page           | Types                                | Issues                                                                        |
| -------------- | ------------------------------------ | ----------------------------------------------------------------------------- |
| Homepage       | `MedicalWebPage`                     | Missing `url`, `@id`; invalid `offers` type                                   |
| Blog listing   | `Blog`                               | Missing `blogPost` entries                                                    |
| Blog post      | `Article`                            | Missing `BreadcrumbList`; `dateModified` always equals `datePublished`        |
| Location/state | `WebPage` + `FAQPage`                | FAQPage restricted since Aug 2023; `ItemList` has no elements                 |
| Center detail  | `MedicalBusiness` + `BreadcrumbList` | Missing `image`, `openingHoursSpecification`; breadcrumb state name lowercase |


#### Missing Schema (Should Add)


| Type                           | Priority | Notes                                               |
| ------------------------------ | -------- | --------------------------------------------------- |
| `Organization` (standalone)    | HIGH     | Only exists nested; needs standalone in root layout |
| `WebSite` with `SearchAction`  | HIGH     | Enables sitelinks searchbox in Google               |
| `BreadcrumbList` on blog posts | HIGH     | Visual breadcrumbs exist but no JSON-LD             |
| `MedicalBusiness.image`        | HIGH     | Center pages have no image property                 |


---

### 4. Sitemap Analysis

- Sitemap index with 2 child sitemaps: 254 static/blog/location URLs + 981 center URLs = ~1,235 total
- All URLs use HTTPS, all spot-checked URLs return 200
- **Bug:** 12 Kuala Lumpur URLs appear twice (duplicated in `getAllLocationData()`)
- 246 URLs share identical `lastmod` timestamp (Google ignores unreliable lastmod)
- `<priority>` and `<changefreq>` tags present but ignored by Google
- 227 location pages pass quality gate (real database-driven content per page)

---

### 5. Performance (60/100)

#### Core Web Vitals Estimates


| Metric | Estimated         | Threshold (Good) | Status            |
| ------ | ----------------- | ---------------- | ----------------- |
| LCP    | 2.5-4.0s (mobile) | < 2.5s           | NEEDS IMPROVEMENT |
| INP    | 200-400ms         | < 200ms          | NEEDS IMPROVEMENT |
| CLS    | 0.02-0.05         | < 0.1            | GOOD              |
| TTFB   | ~580ms            | < 200ms          | POOR              |


#### Resource Breakdown


| Resource                | Raw    | Compressed  |
| ----------------------- | ------ | ----------- |
| HTML                    | 137 KB | 16 KB       |
| CSS (1 file)            | 60 KB  | 10 KB       |
| JavaScript (17 chunks)  | 795 KB | 243 KB      |
| Third-party (Ads + GTM) | —      | 347 KB      |
| **Total**               | —      | **~621 KB** |


#### Key Performance Issues

1. **Font loading via CSS `@import`** creates 3-hop render-blocking waterfall
2. **Homepage HTML never cached** at CDN edge (TTFB ~580ms)
3. **framer-motion** (~50KB compressed) heavy animation library
4. **91KB polyfills** always loaded (modern browsers don't need most)
5. **No `preconnect` hints** for third-party domains

---

### 6. Visual Analysis

#### Mobile Responsiveness

- No horizontal scroll (PASS)
- Base body font 16px (PASS)
- Some labels at 12px (borderline)
- 35 undersized touch targets (nav buttons 36px, state pills 34px vs 44px minimum)
- Mobile wizard UX is excellent (step-by-step location selection)

#### Above-the-Fold Content

- **Desktop:** H1, value proposition, trust signals, state filters, search bar all visible
- **Mobile:** H1, value proposition, trust signals, wizard step 1 with location selection visible
- Clear value proposition and CTAs on both viewports

#### Visual SEO Signals

- All images have alt text (PASS)
- Proper meta descriptions on all pages
- Single H1 per page
- Breadcrumbs on blog and location pages
- Missing `og:image` on homepage and blog list page
- Logo SVG may need `aria-label` for accessibility

---

## What's Working Well

- Excellent URL structure — clean kebab-case, consistent redirects
- Strong sitemap coverage — 1,235 URLs across all page types
- Good structured data foundation — MedicalWebPage, MedicalBusiness, Article schemas
- Mobile-first wizard UX — reduces friction for stressed users on phones
- Bilingual blog with hreflang — proper MS/EN alternate tags
- PWA support — service worker, web manifest, apple-touch-icon
- Trust signals above the fold — "Maklumat Terkini", "Sumber Rasmi", "Seluruh Malaysia"
- Location pages are data-rich — real center counts, MOH/private breakdowns
- All images have alt text — full compliance
- Brotli compression active — 88% HTML reduction
- Proper canonical tags on all pages

---

## Top 5 Highest-Impact Actions

1. **Expand blog content to 1,500+ words each** and add a medical reviewer byline
2. **Switch from CSS `@import` to `next/font`** — eliminates render-blocking waterfall (LCP improvement ~300-800ms)
3. **Enable edge caching for HTML pages** (ISR) — cuts TTFB from ~580ms to <100ms
4. **Build out the About page** with real names, credentials, and healthcare connection
5. **Remove FAQPage schema and add Organization + WebSite schema to root layout**

