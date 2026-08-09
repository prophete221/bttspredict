import type { MetadataRoute } from 'next'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

/**
 * Sitemap Next.js natif — régénéré à chaque build.
 *
 * Anti-récidive : ce fichier remplace l'ancien `public/sitemap.xml` statique
 * et le script `scripts/generate-sitemap.mjs`. Le sitemap est maintenant
 * généré automatiquement par Next.js dans `out/sitemap.xml` lors du build.
 *
 * Règles :
 * - PAS de /linebet-promo-code (redirigé 301 vers /code-promo-linebet-senegal)
 * - PAS de /match/[slug] dans le sitemap principal (max 4 matchs du jour)
 * - Priorités spec : / =1.0, /code-promo-linebet-senegal=0.95,
 *   /bonus-888starz=0.9, /btts/predictions/today=0.85
 * - lastModified homepage + code-promo-linebet-senegal = today
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

// ─── Pages SEO principales ───
// PAS de /linebet-promo-code — redirigé 301 vers /code-promo-linebet-senegal
const SEO_PAGES: MetadataRoute.Sitemap = [
  // Page d'accueil — priorité 1.0, lastModified aujourd'hui
  url('/', TODAY, 1.0, 'daily'),

  // Code promo Linebet — priorité 0.95, lastModified aujourd'hui
  url('/code-promo-linebet-senegal', TODAY, 0.95, 'weekly'),

  // Bonus 888starz — priorité 0.9
  url('/bonus-888starz', TODAY, 0.9, 'weekly'),

  // Pronostics — priorité 0.9
  url('/pronostics', TODAY, 0.9, 'daily'),
  url('/pronostics/aujourd-hui', TODAY, 0.85, 'daily'),
  url('/historique', TODAY, 0.85, 'daily'),
  url('/resultats-verifies', TODAY, 0.8, 'daily'),

  // BTTS predictions — priorité 0.85
  url('/btts/predictions/today', TODAY, 0.85, 'daily'),
  url('/btts/predictions/tomorrow', TODAY, 0.8, 'daily'),
  url('/btts/statistics', '2026-07-06', 0.75, 'monthly'),
  url('/btts-c-est-quoi', '2026-07-06', 0.8, 'monthly'),

  // Over 2.5 predictions
  url('/over-2-5/predictions/today', TODAY, 0.85, 'daily'),
  url('/over-2-5/statistics', '2026-07-06', 0.75, 'monthly'),
  url('/over-2-5-predictions', TODAY, 0.8, 'daily'),

  // Football / Betting tips
  url('/football-predictions-today', TODAY, 0.85, 'daily'),
  url('/betting-tips', TODAY, 0.8, 'weekly'),
  url('/correct-score-predictions', TODAY, 0.8, 'weekly'),
  url('/match-predictions', TODAY, 0.8, 'weekly'),
  url('/team-predictions', TODAY, 0.8, 'weekly'),
  url('/league-predictions', TODAY, 0.8, 'weekly'),

  // VIP
  url('/vip', TODAY, 0.85, 'weekly'),

  // Méthodologie & Équipe
  url('/methodologie', '2026-07-06', 0.8, 'monthly'),
  url('/equipe', '2026-06-01', 0.6, 'monthly'),
  url('/presse', '2026-06-01', 0.5, 'monthly'),

  // Bookmakers
  url('/bookmakers', TODAY, 0.8, 'monthly'),

  // Jeu responsable & légal
  url('/jouer-responsable', '2026-06-01', 0.5, 'yearly'),
  url('/mentions-legales', '2026-06-01', 0.3, 'yearly'),
  url('/cgu', '2026-06-01', 0.3, 'yearly'),
  url('/politique-confidentialite', '2026-06-01', 0.3, 'yearly'),

  // Aviator (informatif)
  url('/prediction-aviator', '2026-07-06', 0.7, 'monthly'),

  // Faille FIFA
  url('/faille-fifa', '2026-07-06', 0.7, 'monthly'),

  // Blog index
  url('/blog', TODAY, 0.8, 'weekly'),

  // Blog articles
  url('/blog/comment-analyser-match-btts', '2026-06-01', 0.7, 'monthly'),
  url('/blog/strategie-mise-over-2-5', '2026-05-28', 0.7, 'monthly'),
  url('/blog/gestion-bankroll-paris-sportifs', '2026-05-20', 0.7, 'monthly'),
  url('/blog/meilleurs-championnats-btts', '2026-05-25', 0.7, 'monthly'),
  url('/blog/faille-fifa-linebet', '2026-07-06', 0.85, 'monthly'),
  url('/blog/guide-linebet-inscription', '2026-05-15', 0.8, 'monthly'),
]

// ─── Match pages — limité à 4 max (matchs du jour / récents) ───
// On lit le fichier predictions.json le plus récent pour ne garder que 4 matchs
function getRecentMatchUrls(): MetadataRoute.Sitemap {
  try {
    const predictionsPath = join(process.cwd(), 'public', 'predictions.json')
    if (!existsSync(predictionsPath)) return []

    const data = JSON.parse(readFileSync(predictionsPath, 'utf-8'))
    const preds = Array.isArray(data) ? data : (data.predictions || [])

    const seen = new Set<string>()
    const matchUrls: MetadataRoute.Sitemap = []

    for (const p of preds.slice(0, 4)) {
      const home = (p.home || '').toLowerCase()
        .replace(/^\d+\.\s*/, '')
        .replace(/\d+/g, '')
        .replace(/[^a-zà-ÿ\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || 'equipe'
      const away = (p.away || '').toLowerCase()
        .replace(/^\d+\.\s*/, '')
        .replace(/\d+/g, '')
        .replace(/[^a-zà-ÿ\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || 'equipe'
      const date = (p.date || '').slice(0, 10)
      if (!home || !away || !date) continue

      const slug = `${home}-vs-${away}-${date}`
      if (seen.has(slug)) continue
      seen.add(slug)

      matchUrls.push(
        url(`/match/${slug}`, date, 0.6, 'weekly'),
      )
    }

    return matchUrls
  } catch {
    return []
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const matchUrls = getRecentMatchUrls()
  return [...SEO_PAGES, ...matchUrls]
}
