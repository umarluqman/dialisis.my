from playwright.sync_api import sync_playwright
import json

JS_ANALYSIS = """() => {
    const meta = {};

    document.querySelectorAll('meta[property^="og:"]').forEach(el => {
        meta[el.getAttribute('property')] = el.getAttribute('content');
    });

    document.querySelectorAll('meta[name^="twitter:"]').forEach(el => {
        meta[el.getAttribute('name')] = el.getAttribute('content');
    });

    meta['title'] = document.title;
    const descEl = document.querySelector('meta[name="description"]');
    meta['description'] = descEl ? descEl.getAttribute('content') : null;

    const images = Array.from(document.querySelectorAll('img'));
    const imagesWithoutAlt = images.filter(img => !img.alt || img.alt.trim() === '');
    meta['total_images'] = images.length;
    meta['images_without_alt'] = imagesWithoutAlt.length;
    meta['images_without_alt_srcs'] = imagesWithoutAlt.map(img => img.src).slice(0, 10);

    meta['h1_tags'] = Array.from(document.querySelectorAll('h1')).map(el => el.textContent.trim());

    const breadcrumbs = document.querySelector('nav[aria-label*="breadcrumb"], nav[aria-label*="Breadcrumb"], .breadcrumb, [class*="breadcrumb"]');
    meta['has_breadcrumbs'] = !!breadcrumbs;

    const logos = Array.from(document.querySelectorAll('header img, a[href="/"] img'));
    meta['logo_images'] = logos.map(img => ({src: img.src, alt: img.alt}));

    const canonical = document.querySelector('link[rel="canonical"]');
    meta['canonical'] = canonical ? canonical.getAttribute('href') : null;

    const jsonLd = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(el => {
        try { return JSON.parse(el.textContent); } catch(e) { return null; }
    }).filter(Boolean);
    meta['json_ld_count'] = jsonLd.length;
    meta['json_ld_types'] = jsonLd.map(j => j['@type'] || (j['@graph'] ? 'Graph' : 'Unknown'));

    const viewportMeta = document.querySelector('meta[name="viewport"]');
    meta['viewport'] = viewportMeta ? viewportMeta.getAttribute('content') : null;

    return meta;
}"""

pages = [
    {"name": "homepage", "url": "https://dialisis.my"},
    {"name": "blog-post", "url": "https://dialisis.my/blog/what-is-dialysis"},
    {"name": "location-selangor", "url": "https://dialisis.my/lokasi/selangor"},
    {"name": "blog-list", "url": "https://dialisis.my/blog"},
]

results = {}
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    for page_info in pages:
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        try:
            page.goto(page_info["url"], wait_until="domcontentloaded", timeout=30000)
            page.wait_for_timeout(3000)
            data = page.evaluate(JS_ANALYSIS)
            results[page_info["name"]] = data
            print(f"OK: {page_info['name']}")
        except Exception as e:
            results[page_info["name"]] = {"error": str(e)}
            print(f"ERROR: {page_info['name']}: {e}")
        page.close()

    browser.close()

with open("/Users/umarluqman/dialisis.my/screenshots/seo_analysis.json", "w") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print(json.dumps(results, indent=2, ensure_ascii=False))
