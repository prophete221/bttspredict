export type GeminiMarket = 'BTTS' | 'O2.5'

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
  if (market.includes('btts') || market.includes('bothteams')) return 'BTTS'
  if (market.includes('over25') || market.includes('o25')) return 'O2.5'
  return null
}

function numericProbability(value: unknown): number | null {
  const number = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(number) && number >= 0 && number <= 1 ? number : null
}

/**
 * Return only current picks explicitly attributed to Gemini.
 * Empirical percentages, local-model rows, stale fields and abstentions are not picks.
 */
export function getGeminiPicks(value: unknown): GeminiPrediction[] {
  if (!value || typeof value !== 'object') return []
  const row = value as DataRow
  if (row.ai_source !== 'gemini-stats-v1' || row.ai_abstain === true) return []

  const nested = Array.isArray(row.predictions) ? row.predictions : []
  const candidates: DataRow[] = nested.length
    ? nested.filter(item => Boolean(item) && typeof item === 'object') as DataRow[]
    : [row]
  const picks: GeminiPrediction[] = []

  for (const candidate of candidates) {
    const market = normalizeMarket(candidate.type ?? candidate.market ?? row.type ?? row.market)
    if (!market) continue
    const rawSelection = String(candidate.prediction ?? '').trim().toLowerCase()
    if (!['oui', 'yes', 'non', 'no'].includes(rawSelection)) continue
    const probability = numericProbability(
      candidate.proba ?? candidate.probability ?? (market === 'BTTS' ? candidate.bttsProb : candidate.over25Prob),
    )
    if (probability === null) continue

    const confidenceValue = Number(candidate.confidence ?? row.confidence)
    const confidence = Number.isFinite(confidenceValue) && confidenceValue >= 0 && confidenceValue <= 100
      ? confidenceValue
      : undefined
    const prediction = rawSelection === 'oui' || rawSelection === 'yes' ? 'Oui' : 'Non'
    picks.push({
      type: market === 'BTTS' ? 'BTTS' : 'Over 2.5',
      market,
      prediction,
      confidence,
      proba: probability,
      ...(market === 'BTTS' ? { bttsProb: probability } : { over25Prob: probability }),
      ...(typeof (candidate.tier ?? row.tier) === 'string' ? { tier: String(candidate.tier ?? row.tier) } : {}),
      ...(typeof (candidate.status ?? row.status) === 'string' ? { status: String(candidate.status ?? row.status) } : {}),
      ...(typeof (candidate.isWon ?? row.isWon) === 'boolean' ? { isWon: Boolean(candidate.isWon ?? row.isWon) } : {}),
      ...(typeof (candidate.finalScore ?? row.finalScore) === 'string' ? { finalScore: String(candidate.finalScore ?? row.finalScore) } : {}),
      ...(typeof (candidate.verifiedAt ?? row.verifiedAt) === 'string' ? { verifiedAt: String(candidate.verifiedAt ?? row.verifiedAt) } : {}),
      ...(typeof (candidate.source ?? row.source) === 'string' ? { source: String(candidate.source ?? row.source) } : {}),
    })
  }

  return picks
}

export function getGeminiProbability(picks: GeminiPrediction[], market: GeminiMarket): number | undefined {
  return picks.find(pick => pick.market === market)?.proba
}
