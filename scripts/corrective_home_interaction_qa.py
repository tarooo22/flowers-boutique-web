from __future__ import annotations

import json
from pathlib import Path

from playwright.sync_api import sync_playwright


BASE_URL = "http://localhost:3000"
REPORT = Path("/home/ubuntu/flowers-boutique-web/docs/corrective-home-interaction-qa.json")


def assert_visible(page, selector: str, label: str) -> dict[str, str]:
    locator = page.locator(selector).first
    locator.wait_for(state="visible", timeout=10000)
    if not locator.is_visible():
        raise AssertionError(f"{label} is not visible: {selector}")
    return {"status": "passed", "selector": selector}


def main() -> None:
    results: dict[str, object] = {}
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            headless=True,
            executable_path="/usr/bin/chromium",
            args=["--no-sandbox"],
        )
        desktop = browser.new_page(viewport={"width": 1440, "height": 1000})
        desktop.goto(BASE_URL, wait_until="networkidle")
        results["desktop_navigation"] = {
            "route_links": [
                href
                for href in ["/catalog", "/bouquet-builder", "/about", "/contact"]
                if desktop.locator(f'.am-primary-nav a[href="{href}"]').count() == 1
            ],
        }
        if len(results["desktop_navigation"]["route_links"]) != 4:
            raise AssertionError("The rebuilt desktop primary navigation is missing a route surface")

        desktop.get_by_role("button", name="ძიება").click()
        results["search_dialog"] = assert_visible(desktop, ".am-search-dialog input", "search dialog")
        desktop.keyboard.press("Escape")

        desktop.get_by_role("button", name="შესვლა ან რეგისტრაცია").click()
        results["account_menu"] = assert_visible(desktop, ".am-account-menu", "account menu")
        desktop.keyboard.press("Escape")

        desktop.locator("button.am-cart-button").click()
        results["header_cart_drawer"] = assert_visible(desktop, '[role="dialog"]', "cart drawer")
        desktop.keyboard.press("Escape")

        desktop.evaluate("window.scrollTo(0, 320)")
        desktop.wait_for_timeout(250)
        if not desktop.locator(".am-header.is-scrolled").count():
            raise AssertionError("Sticky header did not expose scrolled state")
        results["sticky_scroll"] = {"status": "passed", "selector": ".am-header.is-scrolled"}

        mobile = browser.new_page(viewport={"width": 375, "height": 812})
        mobile.goto(BASE_URL, wait_until="networkidle")
        results["mobile_quick_nav"] = assert_visible(mobile, ".am-mobile-quick-nav", "mobile quick nav")
        for href in ["/", "/catalog", "/wishlist"]:
            if mobile.locator(f'.am-mobile-quick-nav a[href="{href}"]').count() != 1:
                raise AssertionError(f"Mobile quick navigation is missing {href}")

        mobile.get_by_role("button", name="მენიუს გახსნა").click()
        results["mobile_menu"] = assert_visible(mobile, ".am-mobile-menu", "mobile menu")
        for href in ["/catalog", "/bouquet-builder", "/about", "/contact", "/wishlist", "/delivery"]:
            if mobile.locator(f'.am-mobile-menu a[href="{href}"]').count() < 1:
                raise AssertionError(f"Mobile menu is missing {href}")
        mobile.keyboard.press("Escape")

        mobile.locator('.am-mobile-quick-nav button[aria-label="კალათის გახსნა"]').click()
        results["mobile_quick_cart_drawer"] = assert_visible(mobile, '[role="dialog"]', "quick-nav cart drawer")
        mobile.keyboard.press("Escape")

        mobile.get_by_role("button", name="მენიუს გახსნა").click()
        mobile.get_by_role("button", name="სწრაფი კონტაქტი").click()
        results["contact_sheet"] = assert_visible(mobile, '[role="dialog"]', "contact sheet")
        mobile.keyboard.press("Escape")

        browser.close()

    REPORT.write_text(json.dumps(results, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(results, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
