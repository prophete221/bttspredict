import type { MetadataRoute } from 'next'
import { getDakarDateString } from '@/lib/dakar-date'

/**
 * Sitemap complet FR + EN + AR
 *
 * Chaque page localisée a 3 entrées <url> distinctes (fr / en / ar)
 * avec hreflang croisés — Google indexe ainsi les URLs /en et /ar
 * (et pas seulement le français).
 *
 * Exclus volontairement :
 * - /pronostics (alias non canonique)
 * - /linebet-promo-code (301 → code-promo-linebet-senegal)
 * - /match/[slug] (éphémère)
 * - /prediction-aviator (hors coeur SEO si non prioritaire)
 */

export const dynamic = 'force-static'

const SITE_URL = 'https://bttspredict.com'
const TODAY = getDakarDateString()

type Freq = MetadataRoute.Sitemap[number]['changeFrequency']

type PageDef = {
  /** Chemin FR sans locale, ex: /vip ou / */
  path: string
  priority: number
  changeFrequency: Freq
  /** Si false : uniquement FR (pas de /en /ar) */
  localized?: boolean
}

/** Toutes les pages indexables du site */
const PAGES: PageDef[] = [
  // Accueil & pronos (quotidien)
  { path: '/', priority: 1.0, changeFrequency: 'daily', localized: true },
  { path: '/btts/predictions/today', priority: 0.95, changeFrequency: 'daily', localized: true },
  { path: '/over-2-5/predictions/today', priority: 0.95, changeFrequency: 'daily', localized: true },
  { path: '/btts-and-over-2-5-predictions-today', priority: 0.95, changeFrequency: 'daily', localized: true },
  { path: '/ai-correct-score-predictions', priority: 0.9, changeFrequency: 'daily', localized: true },
  { path: '/resultats-verifies', priority: 0.85, changeFrequency: 'daily', localized: true },
  { path: '/historique', priority: 0.85, changeFrequency: 'daily', localized: true },
  { path: '/vip', priority: 0.9, changeFrequency: 'daily', localized: true },

  // Codes promo — priorité haute
  { path: '/code-promo-1xbet', priority: 0.95, changeFrequency: 'weekly', localized: true },
  { path: '/code-promo-linebet-senegal', priority: 0.95, changeFrequency: 'weekly', localized: true },
  { path: '/code-promo-melbet', priority: 0.95, changeFrequency: 'weekly', localized: true },
  { path: '/bonus-888starz', priority: 0.9, changeFrequency: 'weekly', localized: true },
  { path: '/bonus-888starz-btts221', priority: 0.9, changeFrequency: 'weekly', localized: true },

  // Éditorial / stats
  { path: '/statistiques', priority: 0.75, changeFrequency: 'monthly', localized: true },
  { path: '/methodologie', priority: 0.8, changeFrequency: 'monthly', localized: true },
  { path: '/btts-c-est-quoi', priority: 0.75, changeFrequency: 'monthly', localized: false },
  { path: '/btts/predictions/tomorrow', priority: 0.8, changeFrequency: 'daily', localized: false },
  { path: '/btts/statistics', priority: 0.7, changeFrequency: 'weekly', localized: false },
  { path: '/over-2-5/statistics', priority: 0.7, changeFrequency: 'weekly', localized: false },

  // Légal
  { path: '/cgu', priority: 0.3, changeFrequency: 'yearly', localized: true },
  { path: '/politique-confidentialite', priority: 0.3, changeFrequency: 'yearly', localized: true },
  { path: '/mentions-legales', priority: 0.3, changeFrequency: 'yearly', localized: true },
  { path: '/jouer-responsable', priority: 0.5, changeFrequency: 'yearly', localized: true },
]

function absolute(path: string, locale: 'fr' | 'en' | 'ar'): string {
  if (locale === 'fr') {
    return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`
  }
  if (path === '/') return `${SITE_URL}/${locale}`
  return `${SITE_URL}/${locale}${path}`
}

function entry(
  path: string,
  locale: 'fr' | 'en' | 'ar',
  priority: number,
  changeFrequency: Freq,
  localized: boolean,
): MetadataRoute.Sitemap[number] {
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
    const localized = page.localized !== false
    out.push(entry(page.path, 'fr', page.priority, page.changeFrequency, localized))
    if (localized) {
      out.push(entry(page.path, 'en', page.priority, page.changeFrequency, true))
      out.push(entry(page.path, 'ar', page.priority, page.changeFrequency, true))
    }
  }

  return out
}
