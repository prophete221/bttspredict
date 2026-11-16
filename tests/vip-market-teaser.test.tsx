// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import sitemap from '@/app/sitemap'
import { GET as getPublicPredictions } from '@/app/predictions.json/route'
import MissingMarketVipLink from '@/components/bttsbet/MissingMarketVipLink'
import VipMarketTeaser from '@/components/bttsbet/VipMarketTeaser'
import VipButtons from '@/components/bttsbet/VipButtons'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

afterEach(cleanup)

describe('CTA VIP pour un marché sans décision Gemini', () => {
  it.each([
    ['fr', 'Débloquer VIP', '/vip'],
    ['en', 'Unlock VIP', '/en/vip'],
    ['ar', 'Unlock VIP', '/en/vip'],
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
    ['ar', 'Advanced BTTS', 'Exact score', 'Unlock'],
  ] as const)('affiche les deux marchés VIP en %s et le lien VIP localisé', (locale, first, second, unlock) => {
    const { container } = render(<VipMarketTeaser locale={locale} />)
    const markets = [...container.querySelectorAll<HTMLElement>('[data-vip-market]')]

    expect(markets).toHaveLength(2)
    expect(container.querySelector('[data-testid="vip-market-teaser"]')?.classList.contains('prediction-match-card__vip-teaser')).toBe(true)
    expect(markets.map((market) => market.textContent?.trim())).toEqual([first, second])
    const vipLink = screen.getByRole('link', { name: unlock })
    expect(vipLink.getAttribute('href')).toBe(locale === 'fr' ? '/vip' : '/en/vip')
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(container.textContent).not.toMatch(/\d+(?:[.,]\d+)?\s*%/)
    expect(container.innerHTML).not.toMatch(/generic preview|no picks or odds|aperçu générique|sans choix ni cote|معاينة عامة|دون اختيارات أو احتمالات/i)
  })

  it('replie les CTA d’une locale arabe vers les parcours VIP anglais autorisés', () => {
    const { container } = render(<VipButtons locale="ar" />)
    const links = [...container.querySelectorAll<HTMLAnchorElement>('a[data-cta]')]
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['/en/vip', '/en/vip#historique-vip'])
  })

  it('conserve la rangée du teaser dans la grille Over 2.5', () => {
    const freePredictionsSource = readFileSync(resolve(__dirname, '..', 'src/components/bttsbet/FreePredictions.tsx'), 'utf8')
    const globalCss = readFileSync(resolve(__dirname, '..', 'src/app/globals.css'), 'utf8')

    expect(freePredictionsSource).toContain('prediction-match-card__footer')
    expect(freePredictionsSource).toContain('VipMarketTeaser')
    expect(globalCss).toContain('.page-design--over25 .prediction-match-card__body > .prediction-match-card__vip-teaser')
    expect(globalCss).toContain('"vip vip"')
    expect(globalCss).toContain('"vip"')
  })

  it('préserve le teaser historique dans les variantes de cartes gratuites', () => {
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

  it('conserve l’ancienne page VIP live et exclut le mockup local', () => {
    const vipPageSource = readFileSync(resolve(__dirname, '..', 'src/app/vip/page.tsx'), 'utf8')
    const modalSource = readFileSync(resolve(__dirname, '..', 'src/app/vip/VipJourneyModal.tsx'), 'utf8')
    const localizedSource = readFileSync(resolve(__dirname, '..', 'src/app/[locale]/vip/page.tsx'), 'utf8')

    expect(vipPageSource).toContain("import VipJourneyModal from './VipJourneyModal'")
    expect(vipPageSource).toContain('VIP_PARTNERS')
    expect(vipPageSource).not.toContain('Aperçu local non connecté')
    expect(vipPageSource).not.toContain('Essai Gold')
    expect(vipPageSource).not.toContain('trialPrice')
    expect(modalSource).toContain('const API =')
    expect(modalSource).toContain('Demande d’accès VIP')
    expect(modalSource).not.toContain('aucun envoi')
    expect(localizedSource).toContain("getStaticLocaleParams('/vip')")
    expect(localizedSource).toContain("if (locale !== 'en') notFound()")
  })

  it('ne publie aucune URL VIP arabe', () => {
    const entries = sitemap()
    expect(entries.some((entry) => entry.url === 'https://bttspredict.com/ar/vip')).toBe(false)
    const arabic = entries.filter((entry) => entry.url.startsWith('https://bttspredict.com/ar/')).map((entry) => entry.url).sort()
    expect(arabic).toEqual([
      'https://bttspredict.com/ar/bonus-888starz',
      'https://bttspredict.com/ar/code-promo-1xbet',
      'https://bttspredict.com/ar/code-promo-linebet-senegal',
      'https://bttspredict.com/ar/code-promo-melbet',
      'https://bttspredict.com/ar/bonus-888starz-btts221',
    ].sort())
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
    expect(freePredictionsSource).toContain('{observedMatchCountLabel(match.matchCountHome, match.matchCountAway, lang)}')
    expect(freePredictionsSource).not.toContain('humanMatchDataAvailabilityLabel')
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
  it('garde les routes anglaises protégées sans variante arabe hors promotions', () => {
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
    expect(englishEntry?.alternates?.languages?.ar).toBeUndefined()
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
