import type { MetadataRoute } from 'next'
import { getDakarDateString } from '@/lib/dakar-date'

/**
 * Sitemap Next.js natif v64 — Plateforme PRO
 *
 * Refonte anti-doorway : passage de 43 URLs (blog 2000 + doorway pages
 * identiques) à 12 URLs essentielles type Flashscore.
 *
 * Règles strictes :
 * - PAS de /pronostics (alias non canonique de /btts/predictions/today)
 * - PAS de /linebet-promo-code (redirigé 301 vers /code-promo-linebet-senegal)
 * - PAS de /match/[slug] dans le sitemap (pages trop éphémères)
 * - PAS de blog, PAS de doorway pages
 * - lastModified = today pour / et /code-promo-linebet-senegal
 *
 * Les 12 URLs KEEP (ordre spec v64) :
 *   1.  /
 *   2.  /btts/predictions/today
 *   3.  /btts/statistics
 *   4.  /resultats-verifies
 *   5.  /historique
 *   6.  /vip
 *   7.  /methodologie
 *   8.  /btts-c-est-quoi
 *   9.  /code-promo-linebet-senegal
 *   10. /bonus-888starz
 *   11. /jouer-responsable
 *   12. /mentions-legales
 */

// Requis pour `output: 'export'` — sinon Next.js throw une erreur.
export const dynamic = 'force-static'

const SITE_URL = 'https://bttspredict.com'
const LOCALIZED_PATHS = new Set(['/', '/btts/predictions/today', '/over-2-5/predictions/today', '/ai-correct-score-predictions', '/vip', '/statistiques', '/resultats-verifies', '/methodologie', '/btts-and-over-2-5-predictions-today', '/code-promo-linebet-senegal', '/bonus-888starz'])

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
        'fr-SN': fullUrl,
        ...(LOCALIZED_PATHS.has(path) ? { en: enUrl, ar: arUrl } : {}),
        'x-default': fullUrl,
      },
    },
  }
}

// ─── 16 URLs essentielles (spec v91 + combo + AI correct score) ───
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

  // 12. BTTS c'est quoi
  url('/btts-c-est-quoi', TODAY, 0.75, 'monthly'),

  // 13. Code promo Linebet Sénégal
  url('/code-promo-linebet-senegal', TODAY, 0.95, 'weekly'),

  // 14. Bonus 888starz
  url('/bonus-888starz', TODAY, 0.9, 'weekly'),

  // 15. Jouer responsable
  url('/jouer-responsable', TODAY, 0.5, 'yearly'),

  // 16. Mentions légales
  url('/mentions-legales', '2026-06-01', 0.3, 'yearly'),
]

export default function sitemap(): MetadataRoute.Sitemap {
  return SEO_PAGES
}
