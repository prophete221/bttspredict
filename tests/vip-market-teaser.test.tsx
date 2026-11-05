// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
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
  ] as const)('affiche seulement deux marchés génériques en %s', (locale, first, second, unlock) => {
    const { container } = render(<VipMarketTeaser locale={locale} />)
    const markets = [...container.querySelectorAll<HTMLElement>('[data-vip-market]')]

    expect(markets).toHaveLength(2)
    expect(markets.map((market) => market.textContent?.trim())).toEqual([first, second])
    expect(screen.getByRole('button', { name: unlock })).not.toBeNull()
    expect(container.textContent).not.toMatch(/\d+(?:[.,]\d+)?\s*%/)
  })

  it('ouvre le formulaire VIP existant et garde la validation manuelle', async () => {
    render(<VipMarketTeaser locale="fr" />)
    fireEvent.click(screen.getByRole('button', { name: 'Débloquer' }))

    expect(await screen.findByRole('dialog')).not.toBeNull()
    expect(screen.getByText('Étape 1 sur 7')).not.toBeNull()
    expect(screen.getByText('L’accès à vie reste verrouillé jusqu’à la confirmation manuelle du propriétaire.')).not.toBeNull()
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
