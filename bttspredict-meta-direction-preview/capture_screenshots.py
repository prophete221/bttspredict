#!/usr/bin/env python3
"""Captures Playwright locales pour la maquette BTTSPredict."""
from __future__ import annotations

import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "captures" / "final"
BASE = "http://127.0.0.1:3102"
LANGS = ("fr", "en", "ar")
PAGES = [
    ("home", "/", "Accueil / Match Center"),
    ("btts", "/btts/predictions/today", "Pronostics BTTS"),
    ("over", "/over-2-5/predictions/today", "Pronostics Over 2.5"),
    ("scores", "/ai-correct-score-predictions", "Scores exacts"),
    ("match", "/match/atalanta-vs-parma-2026-11-02", "Détail de rencontre"),
    ("combined", "/btts-and-over-2-5-predictions-today", "Vue combinée"),
    ("stats", "/statistiques", "Statistiques"),
    ("results", "/resultats-verifies", "Résultats vérifiés"),
    ("history", "/historique", "Historique complet"),
    ("vip", "/vip", "Parcours VIP"),
    ("promo-linebet", "/code-promo-linebet-senegal", "Page promo partenaire"),
]
PARTNER_ROUTES = [
    ("promo-1xbet", "/code-promo-1xbet", "1xbet"),
    ("promo-linebet", "/code-promo-linebet-senegal", "linebet"),
    ("promo-melbet", "/code-promo-melbet", "melbet"),
    ("promo-888starz", "/bonus-888starz", "888starz"),
]
VIEWPORTS = {"desktop": (1440, 980), "mobile": (390, 844)}


def make_context(browser, width: int, height: int, lang: str, mobile: bool):
    context = browser.new_context(
        viewport={"width": width, "height": height},
        device_scale_factor=1,
        is_mobile=mobile,
        has_touch=mobile,
    )
    context.add_init_script(f"localStorage.setItem('btts-meta-lang','{lang}')")
    return context


def load_page(context, route: str):
    page = context.new_page()
    errors: list[str] = []
    page.on("pageerror", lambda err: errors.append(str(err)))
    page.goto(f"{BASE}/#{route}", wait_until="networkidle", timeout=30000)
    page.wait_for_function("window.__APP_READY && window.__AFF_READY", timeout=15000)
    page.evaluate("document.fonts.ready")
    page.wait_for_timeout(120)
    return page, errors


def state_for(page) -> dict:
    return page.evaluate("""() => {
      const side = document.querySelector('#sidebar').getBoundingClientRect();
      return {
        lang: document.documentElement.lang,
        dir: document.documentElement.dir,
        width: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        sidebarX: Math.round(side.x),
        sidebarWidth: Math.round(side.width),
        menuOpen: document.querySelector('.app-shell').classList.contains('mobile-menu-open'),
        title: document.querySelector('#pageTitle')?.textContent || '',
        partner: document.body.dataset.partner || '',
        promoCode: document.querySelector('.promo-code b')?.textContent || '',
        affiliateHref: document.querySelector('.affiliate-link')?.getAttribute('href') || '',
        affiliateRel: document.querySelector('.affiliate-link')?.getAttribute('rel') || '',
        comboOpen: document.querySelector('#comboBuilder')?.open ?? null,
        bottomNavVisible: getComputedStyle(document.querySelector('.bottom-nav')).display !== 'none'
      };
    }""")


def validate(state: dict, lang: str, device: str, errors: list[str], page_id: str, issues: list[str]):
    if state["lang"] != lang or state["dir"] != ("rtl" if lang == "ar" else "ltr"):
        issues.append(f"{lang}/{device}/{page_id}: mauvaise langue/direction {state['lang']}/{state['dir']}")
    if state["scrollWidth"] > state["width"] + 1:
        issues.append(f"{lang}/{device}/{page_id}: débordement horizontal {state['scrollWidth']}>{state['width']}")
    if device == "mobile" and not state["bottomNavVisible"]:
        issues.append(f"{lang}/{device}/{page_id}: navigation inférieure absente")
    if device == "mobile" and state["comboOpen"] is True and page_id == "home":
        issues.append(f"{lang}/{device}/{page_id}: Combo Builder ouvert par défaut")
    if errors:
        issues.append(f"{lang}/{device}/{page_id}: erreur JavaScript {errors}")


def capture_one(browser, lang, device, page_id, route, label, issues):
    width, height = VIEWPORTS[device]
    context = make_context(browser, width, height, lang, device == "mobile")
    page, errors = load_page(context, route)
    state = state_for(page)
    validate(state, lang, device, errors, page_id, issues)
    if lang == "ar" and device == "desktop" and state["sidebarX"] < width * .5:
        issues.append(f"{lang}/{device}/{page_id}: sidebar pas à droite ({state['sidebarX']})")
    if lang == "ar" and device == "mobile" and state["sidebarX"] < width:
        issues.append(f"{lang}/{device}/{page_id}: tiroir RTL visible au repos ({state['sidebarX']})")
    output = OUT / f"{lang}-{page_id}-{device}.png"
    page.screenshot(path=str(output), full_page=(device == "desktop"))
    page.close(); context.close()
    return output.relative_to(OUT).as_posix(), state


def create_contact_sheets(manifest: list[dict]):
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
        small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 13)
    except OSError:
        font = small = ImageFont.load_default()
    labels = {key: label for key, _, label in PAGES}
    for lang in LANGS:
        items = [x for x in manifest if x["locale"] == lang and x["page"] in labels]
        row_h, pad, head = 545, 20, 68
        width = 1120
        canvas = Image.new("RGB", (width, head + len(items) * row_h + pad), "#080D14")
        draw = ImageDraw.Draw(canvas)
        draw.text((pad, 18), f"BTTSPredict · {lang.upper()} · aperçu responsive", font=font, fill="#F3F6FA")
        draw.text((pad, 44), "Desktop : page complète · Mobile : écran appareil avec barre fixe", font=small, fill="#A5B3C3")
        y = head
        for item in items:
            draw.rounded_rectangle((pad, y, width - pad, y + row_h - 10), radius=12, fill="#101925", outline="#253547", width=1)
            draw.text((pad + 14, y + 10), item["label"], font=font, fill="#F3F6FA")
            for device, x, box in (("desktop", pad + 14, (790, 475)), ("mobile", pad + 830, (250, 475))):
                image = Image.open(OUT / item["files"][device]).convert("RGB")
                if device == "desktop":
                    image = image.crop((0, 0, min(image.width, 1440), min(image.height, 980)))
                thumb = ImageOps.contain(image, box, method=Image.Resampling.LANCZOS)
                label_y = y + 37
                draw.text((x, label_y), device.capitalize(), font=small, fill="#8FA0B2")
                dest_y = label_y + 19 + max(0, (box[1] - thumb.height) // 2)
                canvas.paste(thumb, (x, dest_y))
            y += row_h
        canvas.save(OUT / f"overview-{lang}.png", optimize=True)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    partners = json.loads((ROOT / "affiliate-links.json").read_text())["links"]
    issues: list[str] = []
    manifest: list[dict] = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path="/usr/bin/chromium")
        for lang in LANGS:
            print(f"Capture {lang.upper()} — pages représentatives desktop/mobile…", flush=True)
            for page_id, route, label in PAGES:
                files, states = {}, {}
                for device in VIEWPORTS:
                    rel, state = capture_one(browser, lang, device, page_id, route, label, issues)
                    files[device] = rel
                    states[device] = state
                if page_id == "promo-linebet":
                    expected = partners["linebet"]
                    for device, state in states.items():
                        if state["promoCode"] != expected["code"] or state["affiliateHref"] != expected["signup"]:
                            issues.append(f"{lang}/{device}/{page_id}: code ou URL partenaire non conforme")
                if page_id == "vip":
                    for device, state in states.items():
                        text = json.dumps(state, ensure_ascii=False)
                        if any(code in text for code in ("vipbtts", "VISION221", "Bttswin", "btts221")):
                            issues.append(f"{lang}/{device}/{page_id}: code promotionnel visible hors page dédiée")
                manifest.append({"locale": lang, "page": page_id, "label": label, "route": route, "states": states, "files": files})
            print(f"  {lang.upper()} : {len(PAGES)} pages vérifiées.", flush=True)

            # Mobile fold: the compact Combo Builder stays collapsed.
            context = make_context(browser, 390, 844, lang, True)
            page, errors = load_page(context, "/")
            page.locator("#comboBuilder").scroll_into_view_if_needed()
            page.wait_for_timeout(80)
            state = state_for(page)
            if state["comboOpen"] is not False:
                issues.append(f"{lang}/mobile/home-combo: Combo Builder ouvert")
            combo_path = OUT / f"{lang}-home-combo-mobile.png"
            page.screenshot(path=str(combo_path), full_page=False)
            manifest.append({"locale": lang, "page": "home-combo", "label": "Combo Builder mobile", "route": "/", "states": {"mobile": state}, "files": {"mobile": combo_path.relative_to(OUT).as_posix()}})
            page.close(); context.close()

            # Mobile drawer: ensure the menu opens from the correct side.
            context = make_context(browser, 390, 844, lang, True)
            page, errors = load_page(context, "/")
            page.locator("#menuToggle").click()
            page.wait_for_timeout(100)
            state = state_for(page)
            if not state["menuOpen"]:
                issues.append(f"{lang}/mobile/menu: menu non ouvert")
            if lang == "ar" and state["sidebarX"] < 0:
                issues.append(f"{lang}/mobile/menu: sidebar RTL anormale ({state['sidebarX']})")
            menu_path = OUT / f"{lang}-mobile-menu-open.png"
            page.screenshot(path=str(menu_path), full_page=False)
            manifest.append({"locale": lang, "page": "mobile-menu", "label": "Menu mobile ouvert", "route": "/", "states": {"mobile": state}, "files": {"mobile": menu_path.relative_to(OUT).as_posix()}})
            page.close(); context.close()

        # FR captures of the remaining partner pages show each restrained accent.
        for page_id, route, partner_id in PARTNER_ROUTES:
            print(f"Vérification partenaire : {partner_id}", flush=True)
            partner = partners[partner_id]
            if page_id == "promo-linebet":
                # La page Linebet est déjà capturée en FR/EN/AR avec les vues représentatives.
                context = make_context(browser, 1440, 980, "fr", False)
                page, errors = load_page(context, route)
                page.context.grant_permissions(["clipboard-read", "clipboard-write"])
                page.locator(".copy-code").click()
                page.wait_for_timeout(80)
                result = page.locator(".copy-code").inner_text()
                if state_for(page)["promoCode"] != partner["code"]:
                    issues.append("fr/desktop/promo-linebet: code incorrect")
                if state_for(page)["affiliateHref"] != partner["signup"]:
                    issues.append("fr/desktop/promo-linebet: URL partenaire différente")
                if result not in ("Code copié", partner["code"]):
                    issues.append(f"fr/desktop/promo-linebet: confirmation de copie inattendue {result!r}")
                if errors:
                    issues.append(f"fr/desktop/promo-linebet: erreur JavaScript {errors}")
                page.close(); context.close()
                continue
            files, states = {}, {}
            for device in VIEWPORTS:
                rel, state = capture_one(browser, "fr", device, page_id, route, f"Partenaire {partner['name']}", issues)
                files[device] = rel
                states[device] = state
                if state["promoCode"] != partner["code"]:
                    issues.append(f"fr/{device}/{page_id}: code incorrect {state['promoCode']!r}")
                if state["affiliateHref"] != partner["signup"]:
                    issues.append(f"fr/{device}/{page_id}: URL partenaire différente")
                if not {"sponsored", "nofollow", "noopener", "noreferrer"}.issubset(set(state["affiliateRel"].split())):
                    issues.append(f"fr/{device}/{page_id}: attribut rel incomplet")
            manifest.append({"locale": "fr", "page": page_id, "label": f"Partenaire {partner['name']}", "route": route, "states": states, "files": files})

            # Copy action is checked once on each distinct partner page.
            if page_id != "promo-linebet":
                context = make_context(browser, 1440, 980, "fr", False)
                page, errors = load_page(context, route)
                page.context.grant_permissions(["clipboard-read", "clipboard-write"])
                page.locator(".copy-code").click()
                page.wait_for_timeout(80)
                result = page.locator(".copy-code").inner_text()
                if result not in ("Code copié", partner["code"]):
                    issues.append(f"fr/desktop/{page_id}: confirmation de copie inattendue {result!r}")
                if errors:
                    issues.append(f"fr/desktop/{page_id}: erreur JavaScript {errors}")
                page.close(); context.close()
        browser.close()

    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    create_contact_sheets(manifest)
    count = len(list(OUT.glob("*.png")))
    print(f"Captures PNG (incluant aperçus) : {count}")
    print(f"Vues représentatives : {len(PAGES)} · langues : {len(LANGS)} · mobile/desktop")
    print(f"Contrôles : {len(issues)} problème(s)")
    for issue in issues:
        print("ERREUR:", issue)
    if issues:
        raise SystemExit(1)
    print("Manifest:", OUT / "manifest.json")
    print("Aperçus:", ", ".join(str(OUT / f"overview-{lang}.png") for lang in LANGS))


if __name__ == "__main__":
    main()
