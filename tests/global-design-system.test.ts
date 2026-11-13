import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOT = resolve(__dirname, '..')

describe('Global BTTSPredict design system', () => {
  it('uses the approved navy, analytical blue, VIP gold and semantic success palette', () => {
    const css = readFileSync(resolve(ROOT, 'src/app/football-intelligence.css'), 'utf8')

    expect(css).toContain('--fi-bg: #070B12;')
    expect(css).toContain('--fi-panel: #0F1622;')
    expect(css).toContain('--fi-panel-raised: #121A26;')
    expect(css).toContain('--fi-teal: #3B82F6;')
    expect(css).toContain('--fi-gold: #E8C97A;')
    expect(css).toContain('--fi-success: #22C55E;')
    expect(css).toContain('.fi-status-dot.is-fresh { background: var(--fi-success);')
  })

  it('sets browser chrome to dark mode while preserving the canonical homepage', () => {
    const layout = readFileSync(resolve(ROOT, 'src/app/layout.tsx'), 'utf8')

    expect(layout).toContain('themeColor: "#070B12"')
    expect(layout).toContain('colorScheme: "dark"')
    expect(layout).toContain('canonical: "https://bttspredict.com/"')
  })
})

describe('Shared footer visual and RTL consistency', () => {
  it('uses the global dark surface tokens and logical text alignment', () => {
    const footer = readFileSync(resolve(ROOT, 'src/components/bttsbet/Footer.tsx'), 'utf8')

    expect(footer).toContain("backgroundColor: '#0F1622'")
    expect(footer).toContain("border: '1px solid #283548'")
    expect(footer).toContain('text-start')
    expect(footer).toContain("lang === 'ar' ? 'قانوني'")
  })
})

describe('Legacy theme override protection', () => {
  it('keeps the final rendered shell dark and the active/VIP navigation on brand', () => {
    const css = readFileSync(resolve(ROOT, 'src/app/football-intelligence.css'), 'utf8')
    const finalTheme = css.slice(css.lastIndexOf('/* 2026-11-13 — final authority'))

    expect(finalTheme).toContain('color-scheme: dark !important')
    expect(finalTheme).toContain('background: #070B12 !important')
    expect(finalTheme).toContain('background: #3B82F6 !important')
    expect(finalTheme).toContain('color: #E8C97A !important')
    expect(finalTheme).not.toContain('color-scheme: light !important')
  })
})

describe('Partner navigation state', () => {
  it('marks the current partner guide in both navigation renderings', () => {
    const navigation = readFileSync(resolve(ROOT, 'src/components/bttsbet/Navbar.tsx'), 'utf8')

    expect(navigation).toContain("aria-current={isActive(partnerRoutes[id]) ? 'page' : undefined}")
    expect(navigation).toContain("const activePartner = Object.entries(partnerRoutes).find(([, href]) => isActive(href))?.[0]")
    expect(navigation).toContain("activePage?.label[lang] ?? activePartnerTitle")
    expect(navigation).toContain("if (event.shiftKey && document.activeElement === first)")
    expect(navigation).toContain("select:not([disabled]), textarea:not([disabled])")
    expect(navigation).toContain("drawerCloseButtonRef.current?.focus()")
    expect(navigation).toContain("menuTriggerRef.current?.focus()")
    expect(navigation).toContain("if (drawerWasOpenRef.current) menuTriggerRef.current?.focus()")
  })
})

describe('Public page surface consistency', () => {
  it('keeps home, prediction dashboards and promo guides on the navy surface system', () => {
    const css = readFileSync(resolve(ROOT, 'src/app/football-intelligence.css'), 'utf8')
    const finalSurfaces = css.slice(css.lastIndexOf('/* 2026-11-13 — final surface pass'))

    expect(finalSurfaces).toContain('.hp-hero')
    expect(finalSurfaces).toContain('.page-design--home')
    expect(finalSurfaces).toContain('footer#faq')
    expect(finalSurfaces).toContain('#btts-today-dashboard .btx-card')
    expect(finalSurfaces).toContain('[data-promo-shell]')
    expect(finalSurfaces).toContain('background: var(--fi-panel) !important')
  })

})

describe('GA4 production-only consent gating', () => {
  it('disables tracking in PR builds and enables the known GA4 stream only for main deployment', () => {
    const analytics = readFileSync(resolve(ROOT, 'src/components/bttsbet/AnalyticsLoader.tsx'), 'utf8')
    const workflow = readFileSync(resolve(ROOT, '.github/workflows/deploy.yml'), 'utf8')
    const consent = readFileSync(resolve(ROOT, 'src/components/bttsbet/CookieConsent.tsx'), 'utf8')

    expect(analytics).toContain("process.env.NEXT_PUBLIC_GA_ENABLED === 'true'")
    expect(analytics).toContain("parsed.preferences?.analytics === true")
    expect(consent).toContain("const STORAGE_KEY = 'bttsbet_cookie_consent'")
    expect(consent).toContain("window.dispatchEvent(new CustomEvent('cookie-consent-changed'")
    expect(workflow).toContain("NEXT_PUBLIC_GA_ENABLED: 'false'")
    expect(workflow).toContain("NEXT_PUBLIC_GA_ENABLED: 'true'")
    expect(workflow).toContain("vars.NEXT_PUBLIC_GA_ID || 'G-F705Z3L2HT'")
  })
})




describe('Editorial redesign regression checks', () => {
  it('removes animated template elements from the public homepage', () => {
    const hero = readFileSync(resolve(ROOT, 'src/components/bttsbet/Hero.tsx'), 'utf8')
    const home = readFileSync(resolve(ROOT, 'src/app/page.tsx'), 'utf8')
    const localizedHome = readFileSync(resolve(ROOT, 'src/app/[locale]/page.tsx'), 'utf8')

    expect(hero).not.toContain('AnimatedTitle')
    expect(hero).not.toContain('CLUB_LOGOS.map')
    expect(hero).not.toContain('hp-clubs__track')
    expect(home).not.toContain('TrustPillars')
    expect(home).not.toContain('ScrollProgressBar')
    expect(localizedHome).not.toContain('TrustPillars')
  })

  it('keeps prediction cards focused on markets and data rather than AI badges', () => {
    const dashboard = readFileSync(resolve(ROOT, 'src/components/bttsbet/BttsTodayDashboard.tsx'), 'utf8')
    const css = readFileSync(resolve(ROOT, 'src/app/football-intelligence.css'), 'utf8')

    expect(dashboard).not.toContain('BTTS · AI')
    expect(dashboard).not.toContain('BTTS · IA')
    expect(dashboard).not.toContain('btx-combo__icon')
    expect(css).toContain('.fi-today-dashboard .btx-card')
    expect(css).toContain('.hp-mc-grid')
    expect(css).toContain('.combox')
  })

  it('removes unsupported superlatives and repeated global bonus claims from visible copy', () => {
    const translations = readFileSync(resolve(ROOT, 'src/lib/i18n.ts'), 'utf8')
    const promo = readFileSync(resolve(ROOT, 'src/components/bttsbet/LocalizedPromoClient.tsx'), 'utf8')

    expect(translations).not.toContain('N°1 Mondiale')
    expect(translations).not.toContain('World’s No.1')
    expect(translations).not.toContain('300% worldwide confirmed for Linebet')
    expect(promo).not.toContain('works worldwide')
    expect(promo).not.toContain('fonctionne dans le monde entier')
  })

  it('uses the shared editorial partner-guide shell and preserves affiliate disclosure', () => {
    const shell = readFileSync(resolve(ROOT, 'src/components/bttsbet/PromoLandingShell.tsx'), 'utf8')
    expect(shell).toContain('promo-editorial__code-panel')
    expect(shell).toContain('promo-editorial__sticky')
    expect(shell).toContain('data-affiliate-disclosure')
    expect(shell).not.toContain('framer-motion')
    expect(shell).not.toContain('motion.')
  })
})


describe('Market-page accuracy and consistent prediction cards', () => {
  it('filters Over 2.5 and combined pages to the markets named by each page', () => {
    const feed = readFileSync(resolve(ROOT, 'src/components/bttsbet/FreePredictions.tsx'), 'utf8')
    const over = readFileSync(resolve(ROOT, 'src/app/over-2-5/predictions/today/page.tsx'), 'utf8')
    const combined = readFileSync(resolve(ROOT, 'src/app/btts-and-over-2-5-predictions-today/page.tsx'), 'utf8')

    expect(feed).toContain("marketFilter?: 'all' | 'btts' | 'over25' | 'combined'")
    expect(feed).toContain("if (marketFilter === 'over25') return hasOver")
    expect(feed).toContain("if (marketFilter === 'combined') return hasBtts && hasOver")
    expect(over).toContain('marketFilter="over25"')
    expect(combined).toContain('marketFilter="combined"')
    expect(feed).not.toContain('from \'framer-motion\'')
  })

  it('does not invent default goal averages on the correct-score estimate page', () => {
    const page = readFileSync(resolve(ROOT, 'src/app/ai-correct-score-predictions/page.tsx'), 'utf8')
    expect(page).not.toContain('|| 1.3')
    expect(page).not.toContain('|| 1.1')
    expect(page).not.toContain('AnimatedTitle')
    expect(page).toContain('Estimations de score exact')
    expect(page).toContain('typeof m.homeLambda === \'number\'')
  })
})
