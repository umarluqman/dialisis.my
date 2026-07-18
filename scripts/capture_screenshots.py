from playwright.sync_api import sync_playwright
import json
import os

SCREENSHOTS_DIR = "/Users/umarluqman/dialisis.my/screenshots"

PAGES = [
    {"name": "homepage", "url": "https://dialisis.my"},
    {"name": "blog-list", "url": "https://dialisis.my/blog"},
    {"name": "blog-post", "url": "https://dialisis.my/blog/what-is-dialysis"},
    {"name": "location-selangor", "url": "https://dialisis.my/lokasi/selangor"},
]

VIEWPORTS = [
    {"name": "desktop", "width": 1920, "height": 1080},
    {"name": "laptop", "width": 1366, "height": 768},
    {"name": "tablet", "width": 768, "height": 1024},
    {"name": "mobile", "width": 375, "height": 812},
]

def capture_all():
    with sync_playwright() as p:
        browser = p.chromium.launch()

        for page_info in PAGES:
            for vp in VIEWPORTS:
                context = browser.new_context(
                    viewport={"width": vp["width"], "height": vp["height"]},
                    device_scale_factor=2 if vp["width"] <= 768 else 1,
                )
                page = context.new_page()

                filename = f"{page_info['name']}_{vp['name']}_{vp['width']}x{vp['height']}"
                print(f"Capturing: {filename}")

                try:
                    page.goto(page_info["url"], wait_until="networkidle", timeout=30000)
                    page.wait_for_timeout(2000)

                    # Above-the-fold screenshot
                    page.screenshot(
                        path=os.path.join(SCREENSHOTS_DIR, f"{filename}_above_fold.png"),
                        full_page=False,
                    )

                    # Full page screenshot
                    page.screenshot(
                        path=os.path.join(SCREENSHOTS_DIR, f"{filename}_full.png"),
                        full_page=True,
                    )

                    print(f"  OK: {filename}")

                except Exception as e:
                    print(f"  ERROR on {filename}: {e}")

                context.close()

        browser.close()

def analyze_seo_and_structure():
    results = {}
    with sync_playwright() as p:
        browser = p.chromium.launch()

        for page_info in PAGES:
            page = browser.new_page(viewport={"width": 1920, "height": 1080})
            try:
                page.goto(page_info["url"], wait_until="networkidle", timeout=30000)
                page.wait_for_timeout(2000)

                data = page.evaluate("""() => {
                    const meta = {};

                    // OG tags
                    document.querySelectorAll('meta[property^="og:"]').forEach(el => {
                        meta[el.getAttribute('property')] = el.getAttribute('content');
                    });

                    // Twitter tags
                    document.querySelectorAll('meta[name^="twitter:"]').forEach(el => {
                        meta[el.getAttribute('name')] = el.getAttribute('content');
                    });

                    // Title and description
                    meta['title'] = document.title;
                    const descEl = document.querySelector('meta[name="description"]');
                    meta['description'] = descEl ? descEl.getAttribute('content') : null;

                    // Images without alt text
                    const images = Array.from(document.querySelectorAll('img'));
                    const imagesWithoutAlt = images.filter(img => !img.alt || img.alt.trim() === '');
                    meta['total_images'] = images.length;
                    meta['images_without_alt'] = imagesWithoutAlt.length;
                    meta['images_without_alt_srcs'] = imagesWithoutAlt.map(img => img.src).slice(0, 10);

                    // H1 tags
                    const h1s = Array.from(document.querySelectorAll('h1')).map(el => el.textContent.trim());
                    meta['h1_tags'] = h1s;

                    // Breadcrumbs (check for nav with aria-label or common class)
                    const breadcrumbs = document.querySelector('nav[aria-label*="breadcrumb"], nav[aria-label*="Breadcrumb"], .breadcrumb, [class*="breadcrumb"]');
                    meta['has_breadcrumbs'] = !!breadcrumbs;

                    // Logo alt text
                    const logos = Array.from(document.querySelectorAll('img[class*="logo"], header img, a[href="/"] img'));
                    meta['logo_images'] = logos.map(img => ({src: img.src, alt: img.alt}));

                    // Canonical
                    const canonical = document.querySelector('link[rel="canonical"]');
                    meta['canonical'] = canonical ? canonical.getAttribute('href') : null;

                    // JSON-LD
                    const jsonLd = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(el => {
                        try { return JSON.parse(el.textContent); } catch(e) { return null; }
                    }).filter(Boolean);
                    meta['json_ld_types'] = jsonLd.map(j => j['@type'] || (j['@graph'] ? 'Graph' : 'Unknown'));

                    return meta;
                }""")

                results[page_info["name"]] = data

            except Exception as e:
                results[page_info["name"]] = {"error": str(e)}

            page.close()

        browser.close()

    return results


def analyze_mobile_issues():
    issues = {}
    with sync_playwright() as p:
        browser = p.chromium.launch()

        page = browser.new_page(viewport={"width": 375, "height": 812})
        try:
            page.goto("https://dialisis.my", wait_until="networkidle", timeout=30000)
            page.wait_for_timeout(2000)

            data = page.evaluate("""() => {
                const result = {};

                // Check for horizontal scroll
                result['has_horizontal_scroll'] = document.documentElement.scrollWidth > document.documentElement.clientWidth;
                result['page_width'] = document.documentElement.scrollWidth;
                result['viewport_width'] = document.documentElement.clientWidth;

                // Check font sizes
                const bodyEl = document.querySelector('body');
                const bodyFontSize = window.getComputedStyle(bodyEl).fontSize;
                result['body_font_size'] = bodyFontSize;

                // Check all text elements for small fonts
                const smallTextElements = [];
                document.querySelectorAll('p, span, a, li, td, th, label, input, button').forEach(el => {
                    const fs = parseFloat(window.getComputedStyle(el).fontSize);
                    if (fs < 14 && el.textContent.trim().length > 0) {
                        smallTextElements.push({
                            tag: el.tagName,
                            text: el.textContent.trim().substring(0, 50),
                            fontSize: fs + 'px'
                        });
                    }
                });
                result['small_text_elements'] = smallTextElements.slice(0, 20);

                // Check touch targets
                const smallTargets = [];
                document.querySelectorAll('a, button, input, select, [role="button"]').forEach(el => {
                    const rect = el.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44)) {
                        smallTargets.push({
                            tag: el.tagName,
                            text: (el.textContent || el.getAttribute('aria-label') || '').trim().substring(0, 50),
                            width: Math.round(rect.width),
                            height: Math.round(rect.height)
                        });
                    }
                });
                result['small_touch_targets'] = smallTargets.slice(0, 20);

                // Check navigation
                const nav = document.querySelector('nav');
                const hamburger = document.querySelector('[class*="menu"], [class*="hamburger"], [aria-label*="menu"], button[class*="nav"]');
                result['has_nav'] = !!nav;
                result['has_hamburger'] = !!hamburger;

                // Above the fold content
                const aboveFold = [];
                document.querySelectorAll('h1, h2, h3, p, button, a').forEach(el => {
                    const rect = el.getBoundingClientRect();
                    if (rect.top < 812 && rect.bottom > 0 && el.textContent.trim().length > 0) {
                        aboveFold.push({
                            tag: el.tagName,
                            text: el.textContent.trim().substring(0, 100),
                            top: Math.round(rect.top),
                            visible: rect.top >= 0 && rect.top < 812
                        });
                    }
                });
                result['above_fold_elements'] = aboveFold.filter(e => ['H1','H2','H3','BUTTON'].includes(e.tag)).slice(0, 15);

                return result;
            }""")

            issues["mobile_375"] = data

        except Exception as e:
            issues["mobile_375"] = {"error": str(e)}

        page.close()
        browser.close()

    return issues


if __name__ == "__main__":
    print("=== Capturing Screenshots ===")
    capture_all()

    print("\n=== SEO & Structure Analysis ===")
    seo = analyze_seo_and_structure()
    with open(os.path.join(SCREENSHOTS_DIR, "seo_analysis.json"), "w") as f:
        json.dump(seo, f, indent=2, default=str)
    print(json.dumps(seo, indent=2, default=str))

    print("\n=== Mobile Analysis ===")
    mobile = analyze_mobile_issues()
    with open(os.path.join(SCREENSHOTS_DIR, "mobile_analysis.json"), "w") as f:
        json.dump(mobile, f, indent=2, default=str)
    print(json.dumps(mobile, indent=2, default=str))
