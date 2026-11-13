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

describe('Page surface and VIP palette consistency', () => {
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

  it('uses champagne gold rather than legacy red on the VIP flow', () => {
    const vipCss = readFileSync(resolve(ROOT, 'src/app/vip/vip.css'), 'utf8')
    const finalVip = vipCss.slice(vipCss.lastIndexOf('/* 2026-11-13 — final VIP art direction'))

    expect(finalVip).toContain('#E8C97A !important')
    expect(finalVip).toContain('background: #0F1622 !important')
    expect(finalVip).not.toContain('#ff827b')
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

describe('VIP Discovery and Pro public preview', () => {
  it('removes the old bookmaker-deposit lifetime flow from the public VIP page', () => {
    const page = readFileSync(resolve(ROOT, 'src/app/vip/page.tsx'), 'utf8')
    const locked = readFileSync(resolve(ROOT, 'src/app/vip/VipLockedPicks.tsx'), 'utf8')
    const history = readFileSync(resolve(ROOT, 'src/app/vip/VipWinHistory.tsx'), 'utf8')

    expect(page).toContain('VIP_PLAN_COPY')
    expect(page).toContain('id="vip-plans"')
    expect(page).toContain('Discovery — 7 jours gratuits')
    expect(page).toContain('VIP Pro')
    expect(page).toContain('Aucun paiement n’est accepté pour le moment')
    expect(page).toContain('vipx-member__crown')
    expect(page).not.toContain('vip-parcours.mp4')
    expect(page).not.toContain('VipJourneyModal')
    expect(page).not.toContain('VIP_BOOKS')
    expect(page).not.toMatch(/à vie|lifetime|dépôt minimum de 3|minimum deposit of \$3/i)
    expect(page).toContain('disabled>{flow.unavailable}')
    expect(locked).toContain('onViewPlans')
    expect(locked).not.toContain('Demander une revue manuelle')
    expect(history).toContain('View plans')
    expect(history).not.toContain('Request VIP access')
  })

  it('styles the new plan comparison with responsive navy cards and champagne VIP accents', () => {
    const vipCss = readFileSync(resolve(ROOT, 'src/app/vip/vip.css'), 'utf8')

    expect(vipCss).toContain('.vipx-plans-grid')
    expect(vipCss).toContain('.vipx-plan-card--pro')
    expect(vipCss).toContain('grid-template-columns: minmax(0, 1fr)')
  })
})
