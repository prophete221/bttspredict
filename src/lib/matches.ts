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
import retainedClickedFrMatchPages from '../data/retained-clicked-fr-match-pages.json'
import { generateMatchSlug } from './match-slug'
import { isVipRow, observedFormBtts } from '../../scripts/public-predictions.mjs'
import { projectGeminiKeyFact } from './match-fact-projection'
import { getGeminiPicks, getGeminiProbability, type GeminiPrediction } from './gemini-predictions'
import { getWinHistory } from '../app/historique/getWinHistory'

export { generateMatchSlug } from './match-slug'

export interface VerifiedHistoryEntry {
  match?: string
  date?: string
  league?: string
  market?: string
  type?: string
  prediction?: string
  tier?: string
  status?: string
  isWon?: boolean
  finalScore?: string
  score?: string
  verifiedAt?: string
  source?: string
}

function normalizeMatchName(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function marketKey(value: string | undefined): string {
  const normalized = (value || '').toLowerCase().replace(/[^a-z0-9]/g, '')
  if (normalized.includes('btts')) return 'btts'
  if (normalized.includes('over25') || normalized.includes('o25')) return 'over25'
  return normalized
}

/** Merge only validated picks; once a market conflicts for a fixture, keep it withheld. */
export function addValidatedMatchPicks(
  selected: Map<GeminiPrediction['market'], GeminiPrediction>,
  conflicts: Set<GeminiPrediction['market']>,
  incoming: readonly GeminiPrediction[],
): void {
  for (const pick of incoming) {
    if (conflicts.has(pick.market)) continue
    const existing = selected.get(pick.market)
    if (!existing) {
      selected.set(pick.market, pick)
    } else if (existing.prediction !== pick.prediction || Math.abs(existing.proba - pick.proba) >= 1e-9) {
      selected.delete(pick.market)
      conflicts.add(pick.market)
    } else {
      // Same pick repeated with fresher publication/status metadata.
      selected.set(pick.market, pick)
    }
  }
}

/** Retained archives may publish picks only when they pass the same strict Gemini validator as the live feed. */
function getRetainedPublishedPicks(row: any): ReturnType<typeof getGeminiPicks> {
  return getGeminiPicks(row)
}

/** Read only score-consistent, strictly Gemini-proven history for a specific match. */
export function getVerifiedHistoryForMatch(home: string, away: string, date?: string): VerifiedHistoryEntry[] {
  const payload = getWinHistory() as { geminiOnly?: boolean; history?: VerifiedHistoryEntry[] } | null
  if (payload?.geminiOnly !== true) return []
  const expected = `${normalizeMatchName(home)} vs ${normalizeMatchName(away)}`
  return (payload.history || []).filter(entry => {
    const match = normalizeMatchName(entry.match || '')
    const sameTeams = match === expected
    const sameDate = !date || !entry.date || entry.date.slice(0, 10) === date.slice(0, 10)
    return sameTeams && sameDate
  })
}

export function verifiedMarketKey(value: string | undefined): string {
  return marketKey(value)
}

/** Forme détaillée d'une équipe sur ses derniers matchs (pipeline, source ESPN). */
export interface TeamFormSummary {
  last5String?: string
  wins?: number
  draws?: number
  losses?: number
  goalsFor?: number
  goalsAgainst?: number
  bttsRate?: number
  over25Rate?: number
  cleanSheets?: number
  failedToScore?: number
  count?: number
}

/** Position au classement de la compétition courante (ESPN standings). */
export interface TeamStandings {
  rank?: number
  points?: number
  played?: number
  gf?: number
  ga?: number
  note?: string
}

/** Cotes moyennes du marché agrégées par le pipeline. */
export interface MatchOdds {
  provider?: string
  home?: number
  draw?: number
  away?: number
  over25?: number
  under25?: number
}

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
    confidence?: number
    tier: string
    status?: string
    isWon?: boolean
    finalScore?: string
    verifiedAt?: string
    source?: string
  }>
  aiSource?: string
  aiKeyFact?: string
  aiAnalysis?: string
  bttsProb?: number
  over25Prob?: number
  // Provenance factuelle et taille de l’échantillon, sans métriques de modèle local.
  dataSource?: string
  matchCountHome?: number
  matchCountAway?: number
  formBtts?: string | number
  // Historique détaillé des 5 derniers matchs de chaque équipe (ESPN, publié
  // par le pipeline pour la section « Dernière minute » des pages /match/).
  last5Home?: Array<{ date: string; opponent: string; venue: 'H' | 'A'; score: string; result: 'W' | 'D' | 'L' }>
  last5Away?: Array<{ date: string; opponent: string; venue: 'H' | 'A'; score: string; result: 'W' | 'D' | 'L' }>
  // Forme détaillée par équipe (pipeline quick-update-predictions.mjs, source ESPN).
  formHome?: TeamFormSummary
  formAway?: TeamFormSummary
  // Classement de la compétition courante par équipe (ESPN standings).
  standingsHome?: TeamStandings
  standingsAway?: TeamStandings
  // Cotes moyennes du marché (agrégées par le pipeline).
  odds?: MatchOdds
  // Champs éditoriaux Gemini supplémentaires : actualités d'équipe (absents)
  // et lecture des cotes. Versions _en préférées sur les pages anglaises.
  aiAbsences?: string
  aiOddsInsight?: string
  aiKeyFactEn?: string
  aiAnalysisEn?: string
  aiAbsencesEn?: string
  aiOddsInsightEn?: string
  // Date de publication réelle du snapshot de données (predictions.json / archives).
  // Remplace toute date de source codée en dur dans l'UI.
  lastUpdated?: string
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
export function loadAllMatches(archiveLimit = 14, includeRetainedClickedFrPages = false): Map<string, MatchData> {
  const archiveDir = path.join(process.cwd(), 'public', 'predictions-archive')
  const matches = new Map<string, MatchData>()
  const selectedGeminiPicks = new Map<string, Map<GeminiPrediction['market'], GeminiPrediction>>()
  const conflictingGeminiMarkets = new Map<string, Set<GeminiPrediction['market']>>()
  const ingest = (data: any, fallbackDate: string, current = false, retainedArchive = false) => {
    const rows = Array.isArray(data) ? data : (data.free || data.predictions || [])
    if (!Array.isArray(rows)) return
    const refreshed = new Set<string>()
    for (const p of rows) {
      if (isVipRow(p)) continue
      const currentPicks = getGeminiPicks(p)
      const home = p.home || '', away = p.away || '', date = (p.date || '').slice(0, 10)
      if (!home || !away || !date) continue
      const slug = generateMatchSlug(home, away, date)
      const acceptedPicks = currentPicks.length ? currentPicks : retainedArchive ? getRetainedPublishedPicks(p) : []
      const isGeminiResponse = currentPicks.length > 0 && p.ai_source === 'gemini-stats-v1'
      const snapshotPublishedAt = p.publishedAt || data.lastUpdated || data.date || fallbackDate
      // Le flux actuel est prioritaire pour TOUS les champs, pas seulement les champs vides.
      // Il est lui-même restauré depuis la première publication par le finaliseur d'archives.
      if (!matches.has(slug) || (current && !refreshed.has(slug))) {
        if (current) {
          selectedGeminiPicks.set(slug, new Map())
          conflictingGeminiMarkets.set(slug, new Set())
        }
        matches.set(slug, {
          slug, home, away, date, league: p.league || '', time: p.time || '',
          homeLogo: p.homeLogo, awayLogo: p.awayLogo, predictions: [],
          // Empirical rates are context, never published market probabilities.
          aiSource: isGeminiResponse ? p.ai_source : undefined,
          aiKeyFact: isGeminiResponse ? projectGeminiKeyFact(p, 'fr') : undefined,
          aiAnalysis: isGeminiResponse ? p.ai_analysis : undefined,
          bttsProb: getGeminiProbability(acceptedPicks, 'BTTS'),
          over25Prob: getGeminiProbability(acceptedPicks, 'O2.5'),
          dataSource: p.dataSource,
          matchCountHome: p.matchCountHome, matchCountAway: p.matchCountAway,
          formBtts: observedFormBtts(p) ?? undefined, lastUpdated: snapshotPublishedAt,
          last5Home: Array.isArray(p.last5Home) ? p.last5Home.slice(0, 5) : undefined,
          last5Away: Array.isArray(p.last5Away) ? p.last5Away.slice(0, 5) : undefined,
          formHome: p.formHome || undefined,
          formAway: p.formAway || undefined,
          standingsHome: p.standingsHome || undefined,
          standingsAway: p.standingsAway || undefined,
          odds: p.odds || undefined,
          aiAbsences: isGeminiResponse ? p.ai_absences || undefined : undefined,
          aiOddsInsight: isGeminiResponse ? p.ai_odds_insight || undefined : undefined,
          aiKeyFactEn: isGeminiResponse ? projectGeminiKeyFact(p, 'en') : undefined,
          aiAnalysisEn: isGeminiResponse ? p.ai_analysis_en || undefined : undefined,
          aiAbsencesEn: isGeminiResponse ? p.ai_absences_en || undefined : undefined,
          aiOddsInsightEn: isGeminiResponse ? p.ai_odds_insight_en || undefined : undefined,
        })
        refreshed.add(slug)
      }
      const match = matches.get(slug)!
      if (current) {
        if (isGeminiResponse) match.aiSource = p.ai_source
      }
      const markets = acceptedPicks
      if (!retainedArchive && currentPicks.length > 0) {
        const selected = selectedGeminiPicks.get(slug) || new Map<GeminiPrediction['market'], GeminiPrediction>()
        const conflicts = conflictingGeminiMarkets.get(slug) || new Set<GeminiPrediction['market']>()
        selectedGeminiPicks.set(slug, selected)
        conflictingGeminiMarkets.set(slug, conflicts)
        addValidatedMatchPicks(selected, conflicts, currentPicks)
        const picks = [...selected.values()]
        match.predictions = picks.map(pick => ({
          type: pick.type,
          market: pick.market,
          prediction: pick.prediction,
          proba: pick.proba,
          confidence: pick.confidence,
          tier: pick.tier || 'STANDARD',
          status: pick.status,
          isWon: pick.isWon,
          finalScore: pick.finalScore,
          verifiedAt: pick.verifiedAt,
          source: pick.source || '',
        }))
        match.bttsProb = getGeminiProbability(picks, 'BTTS')
        match.over25Prob = getGeminiProbability(picks, 'O2.5')
        continue
      }
      for (const market of markets) {
        if (isVipRow(market)) continue
        const type = market.type || market.market || p.type || p.market || ''
        const existing = match.predictions.findIndex(row => marketKey(row.type) === marketKey(type))
        const row = {
          type, market: type, prediction: market.prediction || p.prediction || '',
          proba: market.proba,
          confidence: market.confidence,
          tier: market.tier || p.tier || 'STANDARD', status: market.status || p.status,
          isWon: market.isWon ?? p.isWon, finalScore: market.finalScore || p.finalScore,
          verifiedAt: market.verifiedAt || p.verifiedAt, source: market.source || p.source || '',
        }
        if (existing < 0) match.predictions.push(row)
        else if (current) match.predictions[existing] = row
      }
    }
  }
  if (fs.existsSync(archiveDir)) {
    const archiveFiles = fs.readdirSync(archiveDir).filter(f => f.endsWith('.json')).sort()
    const archiveCount = Math.max(0, Math.floor(archiveLimit))
    const files = archiveCount === 0 ? [] : archiveFiles.slice(-archiveCount)
    for (const file of files) {
      try { ingest(JSON.parse(fs.readFileSync(path.join(archiveDir, file), 'utf8')), file.replace(/\.json$/, '')) }
      catch { /* Une archive illisible ne doit pas supprimer les autres pages. */ }
    }
  }
  const currentPath = path.join(process.cwd(), 'public', 'predictions.json')
  if (fs.existsSync(currentPath)) {
    try { ingest(JSON.parse(fs.readFileSync(currentPath, 'utf8')), '', true) }
    catch { /* Conserver les archives si le flux courant est indisponible. */ }
  }
  if (includeRetainedClickedFrPages) {
    for (const entry of retainedClickedFrMatchPages.matches) {
      const row = entry.record as Record<string, any>
      const expectedSlug = generateMatchSlug(row.home || '', row.away || '', row.date || '')
      if (expectedSlug !== entry.slug) {
        throw new Error(`Retained FR match source slug mismatch: expected ${entry.slug}, got ${expectedSlug}`)
      }
      ingest({ date: entry.snapshotDate, lastUpdated: entry.lastUpdated, predictions: [row] }, entry.snapshotDate, true, true)
    }
  }
  return matches
}
/**
 * Get a single match by slug.
 */
export function getMatchBySlug(slug: string): MatchData | null {
  let decodedSlug = slug
  try {
    decodedSlug = decodeURIComponent(slug)
  } catch {
    // Keep the original slug when a malformed URL segment is supplied.
  }
  if (retainedClickedFrMatchPages.matches.some(entry => entry.slug === decodedSlug)) {
    return loadAllMatches(0, true).get(decodedSlug) || null
  }
  const matches = loadAllMatches()
  return matches.get(decodedSlug) || null
}

/**
 * Get all slugs for static generation.
 */
export function getAllMatchSlugs(): string[] {
  const matches = loadAllMatches()
  return Array.from(matches.keys())
}
