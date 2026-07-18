from playwright.sync_api import sync_playwright
import json

JS_MOBILE = """() => {
    const result = {};

    result['has_horizontal_scroll'] = document.documentElement.scrollWidth > document.documentElement.clientWidth;
    result['page_width'] = document.documentElement.scrollWidth;
    result['viewport_width'] = document.documentElement.clientWidth;

    const bodyEl = document.querySelector('body');
    result['body_font_size'] = window.getComputedStyle(bodyEl).fontSize;

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
    result['small_text_count'] = smallTextElements.length;

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
    result['small_touch_targets_count'] = smallTargets.length;

    const nav = document.querySelector('nav');
    const hamburger = document.querySelector('[class*="menu"], [class*="hamburger"], [aria-label*="menu"], button[class*="nav"]');
    result['has_nav'] = !!nav;
    result['has_hamburger_or_menu'] = !!hamburger;

    const aboveFold = [];
    document.querySelectorAll('h1, h2, h3, p, button, a, input').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < 812 && el.textContent.trim().length > 0) {
            aboveFold.push({
                tag: el.tagName,
                text: el.textContent.trim().substring(0, 120),
                top: Math.round(rect.top),
                height: Math.round(rect.height)
            });
        }
    });
    result['above_fold_headings'] = aboveFold.filter(e => ['H1','H2','H3'].includes(e.tag)).slice(0, 10);
    result['above_fold_buttons'] = aboveFold.filter(e => ['BUTTON'].includes(e.tag)).slice(0, 10);
    result['above_fold_inputs'] = aboveFold.filter(e => ['INPUT'].includes(e.tag)).slice(0, 5);

    return result;
}"""

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # Mobile viewport
    page = browser.new_page(viewport={"width": 375, "height": 812})
    page.goto("https://dialisis.my", wait_until="networkidle", timeout=30000)
    page.wait_for_timeout(2000)
    mobile_data = page.evaluate(JS_MOBILE)
    print("=== MOBILE (375px) Homepage ===")
    print(json.dumps(mobile_data, indent=2, ensure_ascii=False))
    page.close()

    # Desktop above-the-fold
    page = browser.new_page(viewport={"width": 1920, "height": 1080})
    page.goto("https://dialisis.my", wait_until="networkidle", timeout=30000)
    page.wait_for_timeout(2000)
    desktop_data = page.evaluate(JS_MOBILE)
    print("\n=== DESKTOP (1920px) Homepage ===")
    print(json.dumps(desktop_data, indent=2, ensure_ascii=False))
    page.close()

    browser.close()

combined = {"mobile_375": mobile_data, "desktop_1920": desktop_data}
with open("/Users/umarluqman/dialisis.my/screenshots/mobile_analysis.json", "w") as f:
    json.dump(combined, f, indent=2, ensure_ascii=False)
