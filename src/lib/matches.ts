/**
 * Match slug utility library — generates stable, SEO-friendly URLs for match pages.
 *
 * Slug format: {home}-{away}-{YYYY-MM-DD}
 * Example: "arsenal-vs-chelsea-2026-08-15"
 *
 * Used by:
 *  - src/app/match/[slug]/page.tsx (static generation)
 *  - Internal links from /btts/predictions/today cards
 *  - Sitemap generator
 */

import fs from 'fs'
import path from 'path'
import { generateMatchSlug } from './match-slug'

export { generateMatchSlug } from './match-slug'

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
  aiExactScore?: string
  exactScoreProb?: string
  aiBttsProb?: string
  aiOver25Prob?: string
  aiKeyFact?: string
  aiAnalysis?: string
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
            aiExactScore: p.ai_exact_score,
            exactScoreProb: p.exact_score_prob,
            aiBttsProb: p.ai_btts_prob,
            aiOver25Prob: p.ai_over25_prob,
            aiKeyFact: p.ai_key_fact,
            aiAnalysis: p.ai_analysis,
          })
        }

        const match = matches.get(slug)!
        if (!match.aiExactScore && p.ai_exact_score) match.aiExactScore = p.ai_exact_score
        if (!match.exactScoreProb && p.exact_score_prob) match.exactScoreProb = p.exact_score_prob
        if (!match.aiBttsProb && p.ai_btts_prob) match.aiBttsProb = p.ai_btts_prob
        if (!match.aiOver25Prob && p.ai_over25_prob) match.aiOver25Prob = p.ai_over25_prob
        if (!match.aiKeyFact && p.ai_key_fact) match.aiKeyFact = p.ai_key_fact
        if (!match.aiAnalysis && p.ai_analysis) match.aiAnalysis = p.ai_analysis
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

  // Current predictions may contain richer AI fields than archived snapshots.
  // Merge those fields into the same stable match records so every live prediction
  // can link to a detailed static match page without changing the data source.
  const currentPath = path.join(process.cwd(), 'public', 'predictions.json')
  if (fs.existsSync(currentPath)) {
    try {
      const current = JSON.parse(fs.readFileSync(currentPath, 'utf8'))
      const currentPredictions = current?.free || current?.predictions || []
      if (Array.isArray(currentPredictions)) {
        for (const p of currentPredictions) {
          const home = p.home || ''
          const away = p.away || ''
          const date = (p.date || '').slice(0, 10)
          if (!home || !away || !date) continue
          const slug = generateMatchSlug(home, away, date)
          let match = matches.get(slug)
          if (!match) {
            match = {
              slug,
              home,
              away,
              league: p.league || '',
              date,
              time: p.time || '',
              homeLogo: p.homeLogo,
              awayLogo: p.awayLogo,
              predictions: [],
            }
            matches.set(slug, match)
          }
          if (!match.aiExactScore && p.ai_exact_score) match.aiExactScore = p.ai_exact_score
          if (!match.exactScoreProb && p.exact_score_prob) match.exactScoreProb = p.exact_score_prob
          if (!match.aiBttsProb && p.ai_btts_prob) match.aiBttsProb = p.ai_btts_prob
          if (!match.aiOver25Prob && p.ai_over25_prob) match.aiOver25Prob = p.ai_over25_prob
          if (!match.aiKeyFact && p.ai_key_fact) match.aiKeyFact = p.ai_key_fact
          if (!match.aiAnalysis && p.ai_analysis) match.aiAnalysis = p.ai_analysis
          if (match.predictions.length === 0) {
            match.predictions.push({
              type: p.type || p.market || 'BTTS',
              market: p.type || p.market || 'BTTS',
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
        }
      }
    } catch {
      // Keep archived match pages available if the live data file is unavailable.
    }
  }

  return matches
}

/**
 * Get a single match by slug.
 */
export function getMatchBySlug(slug: string): MatchData | null {
  const matches = loadAllMatches()
  let decodedSlug = slug
  try {
    decodedSlug = decodeURIComponent(slug)
  } catch {
    // Keep the original slug when a malformed URL segment is supplied.
  }
  return matches.get(decodedSlug) || null
}

/**
 * Get all slugs for static generation.
 */
export function getAllMatchSlugs(): string[] {
  const matches = loadAllMatches()
  return Array.from(matches.keys())
}
