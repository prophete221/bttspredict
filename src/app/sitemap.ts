import type { MetadataRoute } from 'next'

/**
 * Sitemap Next.js natif v64 — Plateforme PRO
 *
 * Refonte anti-doorway : passage de 43 URLs (blog 2000 + doorway pages
 * identiques) à 12 URLs essentielles type Flashscore.
 *
 * Règles strictes :
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

// Date du jour (YYYY-MM-DD) pour lastModified dynamique
const TODAY = new Date().toISOString().split('T')[0]

// Helper : génère une URL sitemap avec hreflang
function url(
  path: string,
  lastModified: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
): MetadataRoute.Sitemap[number] {
  const fullUrl = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`
  return {
    url: fullUrl,
    lastModified: new Date(lastModified),
    changeFrequency,
    priority,
    alternates: {
      languages: {
        'fr-SN': fullUrl,
        'x-default': fullUrl,
      },
    },
  }
}

// ─── 14 URLs essentielles (spec v91 + tâche 002 : Over 2.5 restauré) ───
const SEO_PAGES: MetadataRoute.Sitemap = [
  // 1. Homepage — priorité 1.0, lastModified aujourd'hui
  url('/', TODAY, 1.0, 'daily'),

  // 2. BTTS predictions today — priorité 0.9 (page BTTS spécialisée)
  url('/btts/predictions/today', TODAY, 0.9, 'daily'),

  // 3. Over 2.5 predictions today — priorité 0.9 (page Over 2.5 spécialisée, contenu distinct)
  url('/over-2-5/predictions/today', TODAY, 0.9, 'daily'),

  // 4. BTTS statistics — priorité 0.85
  url('/btts/statistics', TODAY, 0.85, 'monthly'),

  // 5. Over 2.5 statistics — priorité 0.85 (page spécialisée)
  url('/over-2-5/statistics', TODAY, 0.85, 'monthly'),

  // 6. Résultats vérifiés — priorité 0.85
  url('/resultats-verifies', TODAY, 0.85, 'daily'),

  // 7. Historique — priorité 0.85
  url('/historique', TODAY, 0.85, 'daily'),

  // 8. VIP — priorité 0.9 (page premium, mise à jour récente)
  url('/vip', TODAY, 0.9, 'daily'),

  // 9. Méthodologie — priorité 0.8
  url('/methodologie', TODAY, 0.8, 'monthly'),

  // 10. BTTS c'est quoi — priorité 0.75
  url('/btts-c-est-quoi', TODAY, 0.75, 'monthly'),

  // 11. Code promo Linebet Sénégal — priorité 0.95
  url('/code-promo-linebet-senegal', TODAY, 0.95, 'weekly'),

  // 12. Bonus 888starz — priorité 0.9
  url('/bonus-888starz', TODAY, 0.9, 'weekly'),

  // 13. Jouer responsable — priorité 0.5
  url('/jouer-responsable', TODAY, 0.5, 'yearly'),

  // 14. Mentions légales — priorité 0.3
  url('/mentions-legales', '2026-06-01', 0.3, 'yearly'),
]

export default function sitemap(): MetadataRoute.Sitemap {
  return SEO_PAGES
}
