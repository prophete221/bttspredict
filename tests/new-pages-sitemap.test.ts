import { describe, expect, it } from 'vitest'
import sitemap from '@/app/sitemap'
import { COMPETITION_SLUGS } from '@/lib/competition-pages'
import { aviatorMeta } from '@/components/bttsbet/AviatorPageContent'

const additions = [
  '/aviator',
  '/competitions',
  ...COMPETITION_SLUGS.map((slug) => `/competitions/${slug}`),
]

const localizedUrls = additions.flatMap((path) => [
  `https://bttspredict.com${path}`,
  `https://bttspredict.com/en${path}`,
  `https://bttspredict.com/ar${path}`,
])

describe('routes publiques demandées', () => {
  const entries = sitemap()

  it('ajoute Aviator, l’index et les 11 pages de compétition dans les trois langues', () => {
    expect(COMPETITION_SLUGS).toHaveLength(11)
    expect(entries).toHaveLength(100)
    const newEntries = entries.filter((entry) => localizedUrls.includes(entry.url))
    expect(newEntries).toHaveLength(39)
    expect(newEntries.map((entry) => entry.url).sort()).toEqual([...localizedUrls].sort())
    for (const entry of newEntries) {
      expect(entry.alternates?.languages).toMatchObject({
        fr: expect.stringContaining('https://bttspredict.com/'),
        en: expect.stringContaining('https://bttspredict.com/en/'),
        ar: expect.stringContaining('https://bttspredict.com/ar/'),
        'x-default': expect.stringContaining('https://bttspredict.com/'),
      })
    }
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
      ar: 'https://bttspredict.com/ar/aviator',
      'x-default': 'https://bttspredict.com/aviator',
    })
  })
})
