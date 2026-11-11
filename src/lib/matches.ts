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
import { getProba, getConfidence } from './predictions'
import { getGeminiPicks, getGeminiProbability } from './gemini-predictions'

export { generateMatchSlug } from './match-slug'

export interface VerifiedHistoryEntry {
  match?: string
  date?: string
  market?: string
  type?: string
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

/** Preserve only the source markets already published for explicitly retained historical pages. */
function getRetainedPublishedPicks(row: any): ReturnType<typeof getGeminiPicks> {
  if (!Array.isArray(row.predictions)) return []
  return row.predictions.flatMap((pick: any) => {
    if (!pick || typeof pick !== 'object') return []
    const market = marketKey(pick.type || pick.market)
    if (market !== 'btts' && market !== 'over25') return []
    if (pick.prediction !== 'Oui' && pick.prediction !== 'Non') return []
    const probability = typeof pick.proba === 'number'
      ? pick.proba
      : market === 'btts' ? pick.bttsProb : pick.over25Prob
    if (typeof probability !== 'number' || !Number.isFinite(probability) || probability < 0 || probability > 1) return []
    const confidence = pick.confidence ?? row.confidence
    if (typeof confidence !== 'number' || !Number.isFinite(confidence) || confidence < 0 || confidence > 100) return []
    return [{
      type: market === 'btts' ? 'BTTS' as const : 'Over 2.5' as const,
      market: market === 'btts' ? 'BTTS' as const : 'O2.5' as const,
      prediction: pick.prediction as 'Oui' | 'Non',
      confidence,
      proba: probability,
      ...(market === 'btts' ? { bttsProb: probability } : { over25Prob: probability }),
      ...(typeof (pick.tier ?? row.tier) === 'string' ? { tier: String(pick.tier ?? row.tier) } : {}),
      ...(typeof (pick.status ?? row.status) === 'string' ? { status: String(pick.status ?? row.status) } : {}),
      ...(typeof (pick.isWon ?? row.isWon) === 'boolean' ? { isWon: Boolean(pick.isWon ?? row.isWon) } : {}),
      ...(typeof (pick.finalScore ?? row.finalScore) === 'string' ? { finalScore: String(pick.finalScore ?? row.finalScore) } : {}),
      ...(typeof (pick.verifiedAt ?? row.verifiedAt) === 'string' ? { verifiedAt: String(pick.verifiedAt ?? row.verifiedAt) } : {}),
      ...(typeof (pick.source ?? row.source) === 'string' ? { source: String(pick.source ?? row.source) } : {}),
    }]
  })
}

/** Read only the public verified history for a specific match. */
export function getVerifiedHistoryForMatch(home: string, away: string, date?: string): VerifiedHistoryEntry[] {
  const historyPath = path.join(process.cwd(), 'public', 'win-history.json')
  if (!fs.existsSync(historyPath)) return []
  try {
    const payload = JSON.parse(fs.readFileSync(historyPath, 'utf8')) as { history?: VerifiedHistoryEntry[] }
    const expected = `${normalizeMatchName(home)} vs ${normalizeMatchName(away)}`
    return (payload.history || []).filter(entry => {
      const match = normalizeMatchName(entry.match || '')
      const sameTeams = match === expected
      const sameDate = !date || !entry.date || entry.date.slice(0, 10) === date.slice(0, 10)
      return sameTeams && sameDate
    })
  } catch {
    return []
  }
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
    confidence: number
    tier: string
    status?: string
    isWon?: boolean
    finalScore?: string
    verifiedAt?: string
    source?: string
  }>
  aiExactScore?: string
  aiSource?: string
  aiAbstain?: boolean
  exactScoreProb?: string
  aiBttsProb?: string
  aiOver25Prob?: string
  aiKeyFact?: string
  aiAnalysis?: string
  bttsProb?: number
  over25Prob?: number
  homeLambda?: number
  awayLambda?: number
  xgTotal?: number
  // Qualité / provenance des données (mission : page match transparente)
  dataQuality?: string
  dataSource?: string
  matchCountHome?: number
  matchCountAway?: number
  aiRisk?: string
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
  reliabilityScore?: number
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
        matches.set(slug, {
          slug, home, away, date, league: p.league || '', time: p.time || '',
          homeLogo: p.homeLogo, awayLogo: p.awayLogo, predictions: [],
          // Empirical rates are context, never published market probabilities.
          aiSource: isGeminiResponse ? p.ai_source : undefined,
          aiAbstain: p.ai_abstain === true,
          aiKeyFact: isGeminiResponse ? p.ai_key_fact : undefined,
          aiAnalysis: isGeminiResponse ? p.ai_analysis : undefined,
          bttsProb: getGeminiProbability(acceptedPicks, 'BTTS'),
          over25Prob: getGeminiProbability(acceptedPicks, 'O2.5'),
          homeLambda: p.homeLambda, awayLambda: p.awayLambda, xgTotal: p.xgTotal,
          dataQuality: p.dataQuality, dataSource: p.dataSource,
          matchCountHome: p.matchCountHome, matchCountAway: p.matchCountAway,
          aiRisk: p.ai_risk, formBtts: observedFormBtts(p) ?? undefined, lastUpdated: snapshotPublishedAt,
          last5Home: Array.isArray(p.last5Home) ? p.last5Home.slice(0, 5) : undefined,
          last5Away: Array.isArray(p.last5Away) ? p.last5Away.slice(0, 5) : undefined,
          formHome: p.formHome || undefined,
          formAway: p.formAway || undefined,
          standingsHome: p.standingsHome || undefined,
          standingsAway: p.standingsAway || undefined,
          odds: p.odds || undefined,
          aiAbsences: isGeminiResponse ? p.ai_absences || undefined : undefined,
          aiOddsInsight: isGeminiResponse ? p.ai_odds_insight || undefined : undefined,
          aiKeyFactEn: isGeminiResponse ? p.ai_key_fact_en || undefined : undefined,
          aiAnalysisEn: isGeminiResponse ? p.ai_analysis_en || undefined : undefined,
          aiAbsencesEn: isGeminiResponse ? p.ai_absences_en || undefined : undefined,
          aiOddsInsightEn: isGeminiResponse ? p.ai_odds_insight_en || undefined : undefined,
          reliabilityScore: p.reliabilityScore || undefined,
        })
        refreshed.add(slug)
      }
      const match = matches.get(slug)!
      if (current) {
        if (isGeminiResponse) match.aiSource = p.ai_source
        match.aiAbstain = acceptedPicks.length ? false : p.ai_abstain === true
      }
      const markets = acceptedPicks
      for (const market of markets) {
        if (isVipRow(market)) continue
        const type = market.type || market.market || p.type || p.market || ''
        const existing = match.predictions.findIndex(row => marketKey(row.type) === marketKey(type))
        const probability = market.proba ?? (marketKey(type) === 'btts' ? market.bttsProb : market.over25Prob)
        const combined = { ...p, ...market, type, proba: probability ?? p.proba }
        const row = {
          type, market: type, prediction: market.prediction || p.prediction || '',
          proba: current ? (typeof market.proba === 'number' ? market.proba : getProba(combined)) : getProba(combined),
          confidence: current ? (typeof market.confidence === 'number' ? market.confidence : Math.round((market.proba || 0) * 100)) : getConfidence(combined),
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
