import type { MetadataRoute } from 'next'
import { getDakarDateString } from '@/lib/dakar-date'
import { COMPETITION_SLUGS } from '@/lib/competition-pages'

/**
 * Sitemap complet FR + EN + AR
 * Chaque page localisée a 3 entrées <url> distinctes (fr / en / ar)
 * avec hreflang croisés.
 */

export const dynamic = 'force-static'

const SITE_URL = 'https://bttspredict.com'
const TODAY = getDakarDateString()

type Freq = MetadataRoute.Sitemap[number]['changeFrequency']

/** Chemins disponibles en FR + EN + AR (tests + hreflang). */
const LOCALIZED_PATHS = new Set([
  '/',
  '/btts/predictions/today',
  '/over-2-5/predictions/today',
  '/ai-correct-score-predictions',
  '/vip',
  '/statistiques',
  '/resultats-verifies',
  '/methodologie',
  '/btts-and-over-2-5-predictions-today',
  '/code-promo-linebet-senegal',
  '/code-promo-1xbet',
  '/code-promo-melbet',
  '/bonus-888starz',
  '/bonus-888starz-btts221',
  '/cgu',
  '/politique-confidentialite',
  '/mentions-legales',
  '/jouer-responsable',
  '/historique',
  '/aviator',
  '/competitions',
])

for (const slug of COMPETITION_SLUGS) LOCALIZED_PATHS.add(`/competitions/${slug}`)

type PageDef = {
  path: string
  priority: number
  changeFrequency: Freq
}

const PAGES: PageDef[] = [
  { path: '/', priority: 1.0, changeFrequency: 'daily' },
  { path: '/btts/predictions/today', priority: 0.95, changeFrequency: 'daily' },
  { path: '/over-2-5/predictions/today', priority: 0.95, changeFrequency: 'daily' },
  { path: '/btts-and-over-2-5-predictions-today', priority: 0.95, changeFrequency: 'daily' },
  { path: '/ai-correct-score-predictions', priority: 0.9, changeFrequency: 'daily' },
  { path: '/resultats-verifies', priority: 0.85, changeFrequency: 'daily' },
  { path: '/historique', priority: 0.85, changeFrequency: 'daily' },
  { path: '/vip', priority: 0.9, changeFrequency: 'daily' },
  { path: '/code-promo-1xbet', priority: 0.95, changeFrequency: 'weekly' },
  { path: '/code-promo-linebet-senegal', priority: 0.95, changeFrequency: 'weekly' },
  { path: '/code-promo-melbet', priority: 0.95, changeFrequency: 'weekly' },
  { path: '/bonus-888starz', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/bonus-888starz-btts221', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/statistiques', priority: 0.75, changeFrequency: 'monthly' },
  { path: '/methodologie', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/btts-c-est-quoi', priority: 0.75, changeFrequency: 'monthly' },
  { path: '/guide-que-signifie-btts', priority: 0.75, changeFrequency: 'monthly' },
  { path: '/btts/predictions/tomorrow', priority: 0.8, changeFrequency: 'daily' },
  { path: '/btts/statistics', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/over-2-5/statistics', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/cgu', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/politique-confidentialite', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/mentions-legales', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/jouer-responsable', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/aviator', priority: 0.75, changeFrequency: 'monthly' },
  { path: '/competitions', priority: 0.8, changeFrequency: 'weekly' },
  ...COMPETITION_SLUGS.map((slug) => ({ path: `/competitions/${slug}`, priority: 0.75, changeFrequency: 'weekly' as const })),
]

function absolute(path: string, locale: 'fr' | 'en' | 'ar'): string {
  if (locale === 'fr') return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`
  if (path === '/') return `${SITE_URL}/${locale}`
  return `${SITE_URL}/${locale}${path}`
}

/** Génère une entrée sitemap (nom `url` conservé pour les tests d'architecture). */
function url(
  path: string,
  locale: 'fr' | 'en' | 'ar',
  priority: number,
  changeFrequency: Freq,
): MetadataRoute.Sitemap[number] {
  const localized = LOCALIZED_PATHS.has(path)
  const fr = absolute(path, 'fr')
  const en = absolute(path, 'en')
  const ar = absolute(path, 'ar')
  const self = absolute(path, locale)

  const languages: Record<string, string> = localized
    ? { fr, en, ar, 'x-default': fr }
    : { fr, 'x-default': fr }

  return {
    url: self,
    lastModified: new Date(TODAY),
    changeFrequency,
    priority: locale === 'en' ? Math.min(1, priority + 0.02) : priority,
    alternates: { languages },
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = []
  for (const page of PAGES) {
    out.push(url(page.path, 'fr', page.priority, page.changeFrequency))
    if (LOCALIZED_PATHS.has(page.path)) {
      out.push(url(page.path, 'en', page.priority, page.changeFrequency))
      out.push(url(page.path, 'ar', page.priority, page.changeFrequency))
    }
  }
  return out
}
