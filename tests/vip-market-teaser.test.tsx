// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import sitemap from '@/app/sitemap'
import { GET as getPublicPredictions } from '@/app/predictions.json/route'
import MissingMarketVipLink from '@/components/bttsbet/MissingMarketVipLink'
import VipMarketTeaser from '@/components/bttsbet/VipMarketTeaser'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

afterEach(cleanup)

describe('CTA VIP pour un marché sans décision Gemini', () => {
  it.each([
    ['fr', 'Débloquer VIP', '/vip'],
    ['en', 'Unlock VIP', '/en/vip'],
    ['ar', 'افتح VIP', '/ar/vip'],
  ] as const)('remplace le tiret par un lien localisé en %s, sans créer de marché verrouillé supplémentaire', (locale, label, href) => {
    const { container } = render(
      <>
        <MissingMarketVipLink locale={locale} market="BTTS" />
        <MissingMarketVipLink locale={locale} market="Over 2.5" />
        <VipMarketTeaser locale={locale} />
      </>,
    )
    const actions = [...container.querySelectorAll<HTMLAnchorElement>('[data-testid="missing-market-vip-link"]')]

    expect(actions).toHaveLength(2)
    expect(actions.map((action) => action.textContent?.trim())).toEqual([label, label])
    expect(actions.map((action) => action.getAttribute('href'))).toEqual([href, href])
    expect([...container.querySelectorAll('[data-missing-market]')].map((node) => node.getAttribute('data-missing-market'))).toEqual(['BTTS', 'Over 2.5'])
    expect(container.querySelectorAll('[data-vip-market]')).toHaveLength(2)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('est utilisé comme fallback uniquement pour les marchés absents dans les deux cartes de pronostics', () => {
    const freePredictionsSource = readFileSync(resolve(__dirname, '..', 'src/components/bttsbet/FreePredictions.tsx'), 'utf8')
    const dashboardSource = readFileSync(resolve(__dirname, '..', 'src/components/bttsbet/BttsTodayDashboard.tsx'), 'utf8')

    expect(freePredictionsSource).toContain('<MissingMarketVipLink locale={lang} market="BTTS" />')
    expect(freePredictionsSource).toContain('<MissingMarketVipLink locale={lang} market="Over 2.5" />')
    expect(dashboardSource).toMatch(/missingMarket=\{!bttsPick \? 'BTTS' : undefined\}/)
    expect(dashboardSource).toMatch(/missingMarket=\{!over25Pick \? 'Over 2\.5' : undefined\}/)
  })
})

describe('teaser VIP verrouillé dans les cartes gratuites', () => {
  it.each([
    ['fr', 'BTTS avancé', 'Score exact', 'Débloquer'],
    ['en', 'Advanced BTTS', 'Exact score', 'Unlock'],
    ['ar', 'BTTS متقدم', 'النتيجة الدقيقة', 'افتح VIP'],
  ] as const)('affiche les deux marchés VIP en %s et le lien VIP localisé', (locale, first, second, unlock) => {
    const { container } = render(<VipMarketTeaser locale={locale} />)
    const markets = [...container.querySelectorAll<HTMLElement>('[data-vip-market]')]

    expect(markets).toHaveLength(2)
    expect(container.querySelector('[data-testid="vip-market-teaser"]')?.classList.contains('prediction-match-card__vip-teaser')).toBe(true)
    expect(markets.map((market) => market.textContent?.trim())).toEqual([first, second])
    const vipLink = screen.getByRole('link', { name: unlock })
    expect(vipLink.getAttribute('href')).toBe(locale === 'fr' ? '/vip' : `/${locale}/vip`)
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(container.textContent).not.toMatch(/\d+(?:[.,]\d+)?\s*%/)
    expect(container.innerHTML).not.toMatch(/generic preview|no picks or odds|aperçu générique|sans choix ni cote|معاينة عامة|دون اختيارات أو احتمالات/i)
  })

  it('sépare les marchés VIP du pied d’analyse dans la grille Over 2.5', () => {
    const freePredictionsSource = readFileSync(resolve(__dirname, '..', 'src/components/bttsbet/FreePredictions.tsx'), 'utf8')
    const globalCss = readFileSync(resolve(__dirname, '..', 'src/app/globals.css'), 'utf8')

    expect(freePredictionsSource).toContain('prediction-match-card__footer')
    expect(globalCss).toContain('"vip vip" "details details" "actions actions"')
    expect(globalCss).toContain('.prediction-match-card__body > .prediction-match-card__vip-teaser { grid-area: vip;')
    expect(globalCss).toContain('.prediction-match-card__body > .prediction-match-card__footer { grid-area: actions;')
  })

  it('est présent dans les variantes de cartes gratuites utilisées sur le site', () => {
    const files = [
      'src/components/bttsbet/BttsTodayDashboard.tsx',
      'src/components/bttsbet/FreePredictions.tsx',
      'src/components/bttsbet/FreePredictionsWidget.tsx',
    ]
    for (const file of files) {
      const source = readFileSync(resolve(__dirname, '..', file), 'utf8')
      expect(source, file).toContain("import VipMarketTeaser from './VipMarketTeaser'")
      expect(source, file).toContain('<VipMarketTeaser locale={')
    }

    const teaserSource = readFileSync(resolve(__dirname, '..', 'src/components/bttsbet/VipMarketTeaser.tsx'), 'utf8')
    expect(teaserSource).not.toContain('predictions.json')
    expect(teaserSource).not.toContain('vipPreview')
    expect(teaserSource).not.toContain('ai_exact_score')
  })

  it('intègre la vraie demande VIP dans la page localisée, sans modal séparé', () => {
    const vipPageSource = readFileSync(resolve(__dirname, '..', 'src/app/vip/page.tsx'), 'utf8')
    expect(vipPageSource).toContain("import VipApplication from './VipApplication'")
    expect(vipPageSource).toContain('<VipApplication lang={lang} />')
    expect(vipPageSource).toContain('href="#vip-application"')
    expect(vipPageSource).toContain('onClick={scrollToApplication}')
    expect(vipPageSource).not.toContain('VipUnlockModal')
    expect(vipPageSource).toContain("heroCta: 'Débloquer le VIP'")
    expect(vipPageSource).toContain("heroCta: 'Unlock VIP'")
    expect(vipPageSource).toContain("heroCta: 'افتح VIP'")
    expect(vipPageSource).not.toContain('Start the process')
    expect(vipPageSource).not.toContain('juste avant l’étape WhatsApp')

    const flowStart = vipPageSource.indexOf('const VIP_FLOW')
    const flowEnd = vipPageSource.indexOf('const FLOW_HEADING')
    const flowSource = vipPageSource.slice(flowStart, flowEnd)
    expect(flowSource).toContain("wizardStart: 'Ouvrir la procédure en 4 étapes'")
    expect(flowSource).toContain("wizardStart: 'Open the 4-step process'")
    expect(flowSource).toContain("wizardStart: 'افتح الإجراءات في 4 خطوات'")
    for (const [locale, nextLocale] of [['fr', 'en'], ['en', 'ar']] as const) {
      const localeStart = flowSource.indexOf(`  ${locale}: {`)
      const localeEnd = flowSource.indexOf(`  ${nextLocale}: {`, localeStart + 1)
      const localeFlow = flowSource.slice(localeStart, localeEnd)
      expect([...localeFlow.matchAll(/\{ title: '[1-4]\./g)], locale).toHaveLength(4)
    }
    const arabicFlowStart = flowSource.indexOf('  ar: {')
    const arabicFlow = flowSource.slice(arabicFlowStart, flowSource.lastIndexOf('\n}'))
    expect([...arabicFlow.matchAll(/\{ title: '[1-4]\./g)], 'ar').toHaveLength(4)

    const formSource = readFileSync(resolve(__dirname, '..', 'src/app/vip/VipApplication.tsx'), 'utf8')
    expect(formSource).toContain("body.set('registrationConfirmed', 'on')")
    expect(formSource).toContain("body.set('depositConfirmed', 'on')")
    expect(formSource).toContain("body.set('consent', 'yes')")
    expect(formSource).toContain("setInviteUrl(validTelegramInvite(status))")
    expect(formSource).toContain("status.status !== 'approved_pending_telegram'")
    expect(formSource).toContain("sessionStorage.setItem(RECEIPT_SESSION_KEY")
  })

  it('place la vidéo à la place du panneau hero, avant l’aperçu VIP, sans copie dans le parcours', () => {
    const pageSource = readFileSync(resolve(__dirname, '..', 'src/app/vip/page.tsx'), 'utf8')
    const cssSource = readFileSync(resolve(__dirname, '..', 'src/app/vip/vip.css'), 'utf8')
    const heroCardStart = pageSource.indexOf('<div className="vipx-hero__card">')
    const videoStart = pageSource.indexOf('<video\n                className="vipx-hero__video"')
    const heroCardEnd = pageSource.indexOf('</div>', videoStart)
    const previewStart = pageSource.indexOf('<VipLockedPicks')
    const trustBadgesStart = pageSource.indexOf('className="vipx-hero__trust"')

    expect(heroCardStart).toBeGreaterThanOrEqual(0)
    expect(trustBadgesStart).toBeLessThan(videoStart)
    expect(heroCardStart).toBeLessThan(videoStart)
    expect(videoStart).toBeLessThan(heroCardEnd)
    expect(videoStart).toBeLessThan(previewStart)
    expect(pageSource.match(/<video\b/g)).toHaveLength(1)
    expect(pageSource).not.toContain('vipx-hero__art')
    expect(pageSource).not.toContain('vipx-flow__video')
    expect(pageSource).toContain('poster="/videos/vip-parcours-poster.jpg"')
    expect(pageSource).toContain('<source src="/videos/vip-parcours.mp4" type="video/mp4" />')
    expect(cssSource).toContain('.vipx .vipx-hero__video')
    expect(cssSource).toContain('aspect-ratio: 1.36')
    expect(cssSource).toContain('min-block-size: 210px')
  })

  it('ne montre plus les messages de diagnostic Gemini sans supprimer la provenance positive', () => {
    const files = [
      'src/components/bttsbet/BttsTodayDashboard.tsx',
      'src/components/bttsbet/FreePredictions.tsx',
      'src/components/bttsbet/MatchCenter.tsx',
      'src/app/match/[slug]/page.tsx',
    ]
    for (const file of files) {
      const source = readFileSync(resolve(__dirname, '..', file), 'utf8')
      expect(source, file).not.toMatch(/No Gemini pick (?:published|is published) for this match\./i)
      expect(source, file).not.toMatch(/Aucun pick Gemini (?:publié|n’est publié) pour ce match\./i)
      expect(source, file).not.toMatch(/(?:لم يتم نشر ترشيح|لا يوجد ترشيح منشور) من Gemini لهذه المباراة/i)
    }

    const freePredictionsSource = readFileSync(resolve(__dirname, '..', 'src/components/bttsbet/FreePredictions.tsx'), 'utf8')
    expect(freePredictionsSource).toContain('{humanMethodLabel(dataQuality, lang)}')
  })

  it('n’expose aucune clé VIP dans la réponse JSON publique', async () => {
    const response = getPublicPredictions()
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload).not.toHaveProperty('vip')
    expect(payload).not.toHaveProperty('vipPreview')
    expect(payload).not.toHaveProperty('vipPredictions')
    expect(payload.stats).not.toHaveProperty('vipCount')
  })
})

describe('sitemap et robots — préservation des URL de production', () => {
  it('garde les routes anglaises protégées dans le sitemap avec leurs variantes localisées', () => {
    const entries = sitemap()
    const byUrl = new Map(entries.map((entry) => [entry.url, entry]))
    const protectedUrls = [
      'https://bttspredict.com/',
      'https://bttspredict.com/en',
      'https://bttspredict.com/en/btts-and-over-2-5-predictions-today',
      'https://bttspredict.com/en/over-2-5/predictions/today',
      'https://bttspredict.com/en/ai-correct-score-predictions',
    ]

    for (const url of protectedUrls) expect(byUrl.has(url)).toBe(true)
    const englishEntry = byUrl.get('https://bttspredict.com/en/over-2-5/predictions/today')
    expect(englishEntry?.alternates?.languages?.en).toBe('https://bttspredict.com/en/over-2-5/predictions/today')
    expect(englishEntry?.alternates?.languages?.fr).toBe('https://bttspredict.com/over-2-5/predictions/today')
    expect(englishEntry?.alternates?.languages?.ar).toBe('https://bttspredict.com/ar/over-2-5/predictions/today')
  })

  it('conserve le sitemap, les ressources de rendu et les seules exclusions système de robots.txt', () => {
    const robots = readFileSync(resolve(__dirname, '..', 'public/robots.txt'), 'utf8')
    expect(robots).toContain('Allow: /')
    expect(robots).toContain('Disallow: /api/')
    expect(robots).toContain('Disallow: /admin')
    expect(robots).not.toMatch(/^Disallow: \/_next\//m)
    expect(robots).toContain('Sitemap: https://bttspredict.com/sitemap.xml')
    expect(robots).not.toMatch(/^Host:/m)
  })
})
