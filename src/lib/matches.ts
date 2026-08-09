/**
 * Match slug utility library — generates stable, SEO-friendly URLs for match pages.
 *
 * Slug format: {home}-{away}-{YYYY-MM-DD}
 * Example: "arsenal-vs-chelsea-2026-08-15"
 *
 * Used by:
 *  - src/app/match/[slug]/page.tsx (static generation)
 *  - Internal links from /pronostics cards
 *  - Sitemap generator
 */

import fs from 'fs'
import path from 'path'

export interface MatchData {
  slug: string
  home: string
  away: string
  league: string
  date: string
  time?: string
  homeLogo?: string
  awayLogo?: string
  predictions: Array<{
    type: string
    market: string
    prediction: string
    proba: number
    confidence: number
    tier: string
    status?: string
    isWon?: boolean
    finalScore?: string
    verifiedAt?: string
    source?: string
  }>
}

/**
 * Normalize a team name for slug usage.
 * "1. FC Heidenheim 1846" → "fc-heidenheim"
 * "Arsenal" → "arsenal"
 */
function normalizeTeamName(name: string): string {
  return (name || '')
    .toLowerCase()
    .replace(/^\d+\.\s*/, '') // strip leading "1. " "2. "
    .replace(/\d+/g, '') // strip all digits (years, division numbers)
    .replace(/[^a-zà-ÿ\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'equipe'
}

/**
 * Generate a stable slug for a match.
 */
export function generateMatchSlug(home: string, away: string, date: string): string {
  const h = normalizeTeamName(home)
  const a = normalizeTeamName(away)
  const d = (date || '').slice(0, 10)
  return `${h}-vs-${a}-${d}`
}

/**
 * Parse a slug back to { home, away, date }.
 * Imperfect — only used for debugging.
 */
export function parseMatchSlug(slug: string): { home: string; away: string; date: string } | null {
  const m = slug.match(/^(.+)-vs-(.+)-(\d{4}-\d{2}-\d{2})$/)
  if (!m) return null
  return { home: m[1].replace(/-/g, ' '), away: m[2].replace(/-/g, ' '), date: m[3] }
}

/**
 * Load all archived predictions and group by match.
 * Returns a Map of slug → MatchData.
 */
export function loadAllMatches(): Map<string, MatchData> {
  const archiveDir = path.join(process.cwd(), 'public', 'predictions-archive')
  const matches = new Map<string, MatchData>()

  if (!fs.existsSync(archiveDir)) return matches

  const files = fs.readdirSync(archiveDir).filter(f => f.endsWith('.json')).sort().slice(-90) // last 90 days

  for (const file of files) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(archiveDir, file), 'utf8'))
      const preds = data.predictions || data
      if (!Array.isArray(preds)) continue

      for (const p of preds) {
        const home = p.home || ''
        const away = p.away || ''
        const date = (p.date || '').slice(0, 10)
        if (!home || !away || !date) continue

        const slug = generateMatchSlug(home, away, date)
        if (!matches.has(slug)) {
          matches.set(slug, {
            slug,
            home,
            away,
            league: p.league || '',
            date,
            time: p.time || '',
            homeLogo: p.homeLogo,
            awayLogo: p.awayLogo,
            predictions: [],
          })
        }

        const match = matches.get(slug)!
        match.predictions.push({
          type: p.type || p.market || '',
          market: p.type || p.market || '',
          prediction: p.prediction || '',
          proba: p.proba || p.confidence / 100 || 0.62,
          confidence: p.confidence || 62,
          tier: p.tier || 'STANDARD',
          status: p.status,
          isWon: p.isWon,
          finalScore: p.finalScore,
          verifiedAt: p.verifiedAt,
          source: p.source || '',
        })
      }
    } catch (e) {
      continue
    }
  }

  return matches
}

/**
 * Get a single match by slug.
 */
export function getMatchBySlug(slug: string): MatchData | null {
  const matches = loadAllMatches()
  return matches.get(slug) || null
}

/**
 * Get all slugs for static generation.
 */
export function getAllMatchSlugs(): string[] {
  const matches = loadAllMatches()
  return Array.from(matches.keys())
}
