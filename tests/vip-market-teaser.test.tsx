// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import sitemap from '@/app/sitemap'
import { GET as getPublicPredictions } from '@/app/predictions.json/route'
import VipMarketTeaser from '@/components/bttsbet/VipMarketTeaser'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

afterEach(cleanup)

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

  it('conserve le formulaire VIP à sept étapes sur la page localisée', () => {
    const vipPageSource = readFileSync(resolve(__dirname, '..', 'src/app/vip/page.tsx'), 'utf8')
    expect(vipPageSource).toContain("import VipUnlockModal from '@/components/bttsbet/VipUnlockModal'")
    expect(vipPageSource).toContain('<VipUnlockModal isOpen={showVipUnlock}')
    expect(vipPageSource).toContain('onClick={openWizard}')

    const formSource = readFileSync(resolve(__dirname, '..', 'src/components/bttsbet/VipUnlockModal.tsx'), 'utf8')
    expect(formSource).toMatch(/Step \{current\} of 7|Étape \{current\} sur 7|الخطوة \{current\} من 7/)
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
