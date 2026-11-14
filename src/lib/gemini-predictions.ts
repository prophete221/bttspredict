export type GeminiMarket = 'BTTS' | 'O2.5'
export const GEMINI_MODEL_ID = 'gemini-3.5-flash-lite'

export interface GeminiPrediction {
  type: 'BTTS' | 'Over 2.5'
  market: GeminiMarket
  prediction: 'Oui' | 'Non'
  confidence?: number
  proba: number
  bttsProb?: number
  over25Prob?: number
  tier?: string
  status?: string
  isWon?: boolean
  finalScore?: string
  verifiedAt?: string
  source?: string
}

type DataRow = Record<string, unknown>

function normalizeMarket(value: unknown): GeminiMarket | null {
  const market = String(value ?? '').toLowerCase().replace(/[^a-z0-9]/g, '')
  if (market === 'btts') return 'BTTS'
  if (market === 'over25' || market === 'o25') return 'O2.5'
  return null
}

function normalizeSelection(value: unknown): 'yes' | 'no' | null {
  const selection = String(value ?? '').trim().toLowerCase()
  if (selection === 'oui' || selection === 'yes') return 'yes'
  if (selection === 'non' || selection === 'no') return 'no'
  return null
}

function numericProbability(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0.48 && value <= 0.78
    ? value
    : null
}

/** Merge independently validated market picks without guessing between conflicts. */
export function mergeUniqueMarketPicks<T extends { type: string; prediction: string; proba: number }>(current: T[], incoming: readonly T[]): T[] {
  const merged = new Map<string, T>()
  const conflictedMarkets = new Set<string>()
  for (const pick of [...current, ...incoming]) {
    if (conflictedMarkets.has(pick.type)) continue
    const existing = merged.get(pick.type)
    if (!existing) {
      merged.set(pick.type, pick)
      continue
    }
    if (existing.prediction !== pick.prediction || Math.abs(existing.proba - pick.proba) >= 1e-9) {
      merged.delete(pick.type)
      conflictedMarkets.add(pick.type)
    }
  }
  return [...merged.values()]
}

/**
 * Return only a single, explicitly sourced pick from the pinned Gemini model.
 * Empirical/local rows, legacy hybrid tags, stale fields, and abstentions are not picks.
 */
export function getGeminiPicks(value: unknown): GeminiPrediction[] {
  if (!value || typeof value !== 'object') return []
  const row = value as DataRow
  if (
    row.ai_source !== 'gemini-stats-v1' || row.ai_abstain !== false ||
    row.ai_model !== GEMINI_MODEL_ID || row.ai_response_status !== 'pick' ||
    row.modelEngine !== 'gemini-stats-v1'
  ) return []

  const market = normalizeMarket(row.ai_market)
  const topLevelMarket = normalizeMarket(row.type)
  const selection = normalizeSelection(row.prediction)
  const probability = numericProbability(row.proba)
  const nested = Array.isArray(row.predictions) ? row.predictions : []
  if (!market || market !== topLevelMarket || !selection || probability === null || nested.length !== 1) return []

  const candidate = nested[0]
  if (!candidate || typeof candidate !== 'object') return []
  const pick = candidate as DataRow
  const pickMarket = normalizeMarket(pick.type)
  const pickSelection = normalizeSelection(pick.prediction)
  const pickProbability = numericProbability(pick.proba)
  if (
    pick.modelEngine !== GEMINI_MODEL_ID || pickMarket !== market ||
    pickSelection !== selection || pickProbability === null ||
    Math.abs(pickProbability - probability) >= 1e-9
  ) return []

  const confidenceValue = Number(pick.confidence ?? row.confidence)
  const confidence = Number.isFinite(confidenceValue) && confidenceValue >= 0 && confidenceValue <= 100
    ? confidenceValue
    : undefined
  const prediction = selection === 'yes' ? 'Oui' : 'Non'
  return [{
    type: market === 'BTTS' ? 'BTTS' : 'Over 2.5',
    market,
    prediction,
    confidence,
    proba: probability,
    ...(market === 'BTTS' ? { bttsProb: probability } : { over25Prob: probability }),
    ...(typeof (pick.tier ?? row.tier) === 'string' ? { tier: String(pick.tier ?? row.tier) } : {}),
    ...(typeof (pick.status ?? row.status) === 'string' ? { status: String(pick.status ?? row.status) } : {}),
    ...(typeof (pick.isWon ?? row.isWon) === 'boolean' ? { isWon: Boolean(pick.isWon ?? row.isWon) } : {}),
    ...(typeof (pick.finalScore ?? row.finalScore) === 'string' ? { finalScore: String(pick.finalScore ?? row.finalScore) } : {}),
    ...(typeof (pick.verifiedAt ?? row.verifiedAt) === 'string' ? { verifiedAt: String(pick.verifiedAt ?? row.verifiedAt) } : {}),
    ...(typeof (pick.source ?? row.source) === 'string' ? { source: String(pick.source ?? row.source) } : {}),
  }]
}

export function getGeminiProbability(picks: GeminiPrediction[], market: GeminiMarket): number | undefined {
  return picks.find(pick => pick.market === market)?.proba
}
