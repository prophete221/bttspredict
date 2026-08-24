import type { MetadataRoute } from 'next'
import { getDakarDateString } from '@/lib/dakar-date'

/**
 * Sitemap Next.js natif — pages indexables vérifiées
 *
 * Le sitemap contient les pages éditoriales, les pages de pronostics,
 * les pages légales et les pages affiliées distinctes réellement publiées.
 *
 * Règles strictes :
 * - PAS de /pronostics (alias non canonique de /btts/predictions/today)
 * - PAS de /linebet-promo-code (redirigé 301 vers /code-promo-linebet-senegal)
 * - PAS de /match/[slug] dans le sitemap (pages trop éphémères)
 * - PAS de blog, PAS de doorway pages
 * - lastModified = la date du jour Africa/Dakar pour toutes les entrées actives
 *
 * Les 18 URLs actives sont définies dans SEO_PAGES ci-dessous :
 * Les pages statistiques spécialisées BTTS et Over 2.5 restent volontairement
 * exclues tant que leurs données dédiées ne sont pas publiées.
 */

// Requis pour `output: 'export'` — sinon Next.js throw une erreur.
export const dynamic = 'force-static'

const SITE_URL = 'https://bttspredict.com'
const LOCALIZED_PATHS = new Set(['/', '/btts/predictions/today', '/over-2-5/predictions/today', '/ai-correct-score-predictions', '/vip', '/statistiques', '/resultats-verifies', '/methodologie', '/btts-and-over-2-5-predictions-today', '/code-promo-linebet-senegal', '/bonus-888starz', '/bonus-888starz-btts221', '/cgu', '/politique-confidentialite', '/mentions-legales', '/jouer-responsable'])

// Date métier du jour (YYYY-MM-DD), explicitement basée sur Africa/Dakar.
const TODAY = getDakarDateString()

// Helper : génère une URL sitemap avec hreflang
function url(
  path: string,
  lastModified: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
): MetadataRoute.Sitemap[number] {
  const fullUrl = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`
  const localizedSuffix = path === '/' ? '' : path
  const enUrl = `${SITE_URL}/en${localizedSuffix}`
  const arUrl = `${SITE_URL}/ar${localizedSuffix}`
  return {
    url: fullUrl,
    lastModified: new Date(lastModified),
    changeFrequency,
    priority,
    alternates: {
      languages: {
        fr: fullUrl,
        ...(LOCALIZED_PATHS.has(path) ? { en: enUrl, ar: arUrl } : {}),
        'x-default': fullUrl,
      },
    },
  }
}

// Pages essentielles indexables, sans doublons ni alias non canoniques.
const SEO_PAGES: MetadataRoute.Sitemap = [
  // 1. Homepage
  url('/', TODAY, 1.0, 'daily'),

  // 2. BTTS predictions today
  url('/btts/predictions/today', TODAY, 0.9, 'daily'),

  // 3. Over 2.5 predictions today
  url('/over-2-5/predictions/today', TODAY, 0.9, 'daily'),

  // 4. BTTS + Over 2.5 combined predictions today
  url('/btts-and-over-2-5-predictions-today', TODAY, 0.9, 'daily'),

  // 5. AI correct score predictions
  url('/ai-correct-score-predictions', TODAY, 0.85, 'daily'),

  // 6. BTTS statistics — TEMPORAIREMENT RETIRÉ DU SITEMAP (données en préparation)
  // url('/btts/statistics', TODAY, 0.85, 'monthly'),

  // 7. Over 2.5 statistics — TEMPORAIREMENT RETIRÉ DU SITEMAP (données en préparation)
  // url('/over-2-5/statistics', TODAY, 0.85, 'monthly'),

  // 8. Résultats vérifiés
  url('/resultats-verifies', TODAY, 0.85, 'daily'),

  // 9. Historique
  url('/historique', TODAY, 0.85, 'daily'),

  // 10. VIP
  url('/vip', TODAY, 0.9, 'daily'),

  // 11. Statistiques générales
  url('/statistiques', TODAY, 0.75, 'monthly'),

  // 12. Méthodologie
  url('/methodologie', TODAY, 0.8, 'monthly'),

  // 13. Conditions générales
  url('/cgu', TODAY, 0.3, 'yearly'),

  // 14. Confidentialité
  url('/politique-confidentialite', TODAY, 0.3, 'yearly'),

  // 15. Mentions légales
  url('/mentions-legales', TODAY, 0.3, 'yearly'),

  // 16. Jeu responsable
  url('/jouer-responsable', TODAY, 0.5, 'yearly'),

  // 15. BTTS c'est quoi
  url('/btts-c-est-quoi', TODAY, 0.75, 'monthly'),

  // 16. Code promo Linebet Sénégal
  url('/code-promo-linebet-senegal', TODAY, 0.95, 'weekly'),

  // 17. Bonus 888starz
  url('/bonus-888starz', TODAY, 0.9, 'weekly'),

  // 18. Page dédiée btts221 — offre à vérifier quotidiennement
  url('/bonus-888starz-btts221', TODAY, 0.95, 'daily'),

]

export default function sitemap(): MetadataRoute.Sitemap {
  return SEO_PAGES
}
