import { describe, expect, it } from 'vitest'
import sitemap from '@/app/sitemap'
import { COMPETITION_SLUGS } from '@/lib/competition-pages'
import { ARABIC_PROMO_PATHS } from '@/lib/arabic-promo-routes'
import { aviatorMeta } from '@/components/bttsbet/AviatorPageContent'

const additions = [
  '/aviator',
  '/competitions',
  ...COMPETITION_SLUGS.map((slug) => `/competitions/${slug}`),
]

const localizedUrls = additions.flatMap((path) => [
  `https://bttspredict.com${path}`,
  `https://bttspredict.com/en${path}`,
])

describe('routes publiques demandées', () => {
  const entries = sitemap()

  it('ajoute Aviator, l’index et les 11 pages de compétition en français et en anglais', () => {
    expect(COMPETITION_SLUGS).toHaveLength(11)
    const newEntries = entries.filter((entry) => localizedUrls.includes(entry.url))
    expect(newEntries).toHaveLength(26)
    expect(newEntries.map((entry) => entry.url).sort()).toEqual([...localizedUrls].sort())
    for (const entry of newEntries) {
      expect(entry.alternates?.languages).toMatchObject({
        fr: expect.stringContaining('https://bttspredict.com/'),
        en: expect.stringContaining('https://bttspredict.com/en/'),
        'x-default': expect.stringContaining('https://bttspredict.com/'),
      })
      expect(entry.alternates?.languages).not.toHaveProperty('ar')
    }
  })

  it('publie en arabe uniquement les cinq pages promotionnelles autorisées', () => {
    const arabicEntries = entries.filter((entry) => entry.url === 'https://bttspredict.com/ar' || entry.url.startsWith('https://bttspredict.com/ar/'))
    expect(arabicEntries).toHaveLength(ARABIC_PROMO_PATHS.length)
    expect(arabicEntries.map((entry) => entry.url).sort()).toEqual(
      ARABIC_PROMO_PATHS.map((path) => `https://bttspredict.com/ar${path}`).sort(),
    )
    for (const path of ARABIC_PROMO_PATHS) {
      const promo = entries.find((entry) => entry.url === `https://bttspredict.com/ar${path}`)
      expect(promo?.alternates?.languages).toMatchObject({
        fr: `https://bttspredict.com${path}`,
        en: `https://bttspredict.com/en${path}`,
        ar: `https://bttspredict.com/ar${path}`,
      })
    }
  })

  it('publie le nouveau guide BTTS une seule fois, en français uniquement', () => {
    const guideUrl = 'https://bttspredict.com/guide-que-signifie-btts'
    const guideEntries = entries.filter((entry) => entry.url === guideUrl)
    expect(guideEntries).toHaveLength(1)
    expect(guideEntries[0].alternates?.languages).toEqual({ fr: guideUrl, 'x-default': guideUrl })
    expect(entries.some((entry) => entry.url === 'https://bttspredict.com/en/guide-que-signifie-btts')).toBe(false)
    expect(entries.some((entry) => entry.url === 'https://bttspredict.com/ar/guide-que-signifie-btts')).toBe(false)
  })

  it('conserve les principales routes historiques protégées', () => {
    const urls = new Set(entries.map((entry) => entry.url))
    for (const url of [
      'https://bttspredict.com/',
      'https://bttspredict.com/en',
      'https://bttspredict.com/en/btts-and-over-2-5-predictions-today',
      'https://bttspredict.com/en/over-2-5/predictions/today',
      'https://bttspredict.com/en/ai-correct-score-predictions',
      'https://bttspredict.com/code-promo-linebet-senegal',
      'https://bttspredict.com/bonus-888starz',
    ]) expect(urls.has(url)).toBe(true)
  })

  it('décrit Aviator sans résultat de manche inventé ni promesse de prédiction', () => {
    const metadata = aviatorMeta('fr')
    expect(metadata.title).toContain('fonctionnement du jeu')
    expect(metadata.description).toContain('Aucun résultat de manche')
    expect(metadata.alternates.languages).toEqual({
      fr: 'https://bttspredict.com/aviator',
      en: 'https://bttspredict.com/en/aviator',
      'x-default': 'https://bttspredict.com/aviator',
    })
  })
})
