import { afterEach, describe, expect, it, vi } from 'vitest'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { publicPredictionPayload, observedFormBtts } from '../scripts/public-predictions.mjs'
import { buildStrictGeminiHistoryKeys } from '../scripts/gemini-history-export.mjs'
import { sanitizePublicData } from '../scripts/sanitize-public-data.mjs'
import { loadAllMatches } from '../src/lib/matches'
import { getGeminiPicks } from '../src/lib/gemini-predictions'

const roots: string[] = []
afterEach(() => {
  vi.restoreAllMocks()
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true })
})
function workspace() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'btts-public-'))
  roots.push(root)
  fs.mkdirSync(path.join(root, 'public', 'predictions-archive'), { recursive: true })
  return root
}
const free = { id: 'free', home: 'Home', away: 'Away', date: '2026-10-21', type: 'BTTS', prediction: 'Oui', proba: 0.54, confidence: 54 }
const vip = { ...free, id: 'private', home: 'Private', vip: true, ai_exact_score: '3-2', analysis: 'Private selection', predictions: [{ prediction: 'Non' }] }

describe('historique Gemini sans seuil de probabilité', () => {
  it.each([0, 0.2, 0.47, 0.79, 0.95, 1])('garde un pick Gemini valide à %s', probability => {
    const row = {
      ...free,
      match: 'Home vs Away',
      proba: probability,
      confidence: Math.round(probability * 100),
      status: 'WON',
      finalScore: '2-1',
      ai_source: 'gemini-stats-v1',
      ai_abstain: false,
      ai_model: 'gemini-3.5-flash-lite',
      ai_response_status: 'pick',
      ai_market: 'BTTS',
      modelEngine: 'gemini-stats-v1',
      predictions: [{ type: 'BTTS', prediction: 'Oui', proba: probability, modelEngine: 'gemini-3.5-flash-lite' }],
    }
    expect(buildStrictGeminiHistoryKeys([row])).toHaveProperty('size', 1)
  })

  it.each([-0.01, 1.01, Number.NaN, Number.POSITIVE_INFINITY])('rejette une probabilité invalide %s', probability => {
    const row = {
      ...free,
      match: 'Home vs Away',
      proba: probability,
      status: 'WON',
      finalScore: '2-1',
      ai_source: 'gemini-stats-v1',
      ai_abstain: false,
      ai_model: 'gemini-3.5-flash-lite',
      ai_response_status: 'pick',
      ai_market: 'BTTS',
      modelEngine: 'gemini-stats-v1',
      predictions: [{ type: 'BTTS', prediction: 'Oui', proba: probability, modelEngine: 'gemini-3.5-flash-lite' }],
    }
    expect(buildStrictGeminiHistoryKeys([row])).toHaveProperty('size', 0)
  })
})

describe('frontière publique des données VIP', () => {
  it('retire les chiffres Gemini hérités du flux courant sans réécrire les preuves archivées', () => {
    const row = { ...free, ai_exact_score: '4-0', ai_btts_prob: '99%', ai_winner: 'Home' }
    const payload = { free: [row], predictions: [row] }
    const current = publicPredictionPayload(payload, { retireLegacyAiNumbers: true })
    expect(current.free[0].proba).toBe(0.54)
    expect(current.free[0]).not.toHaveProperty('ai_exact_score')
    expect(current.free[0]).not.toHaveProperty('ai_btts_prob')
    expect(current.free[0]).not.toHaveProperty('ai_winner')
    expect(current.free[0].formBTTS).toBeNull()
    const lowSample = publicPredictionPayload({ free: [{ ...row, matchCountHome: 2, matchCountAway: 8 }] }, { retireLegacyAiNumbers: true }).free
    expect(lowSample).toHaveLength(1)
    expect(lowSample[0]).toMatchObject({ matchCountHome: 2, matchCountAway: 8, proba: 0.54 })
    expect(observedFormBtts({ formBTTS: 80, formHome: { bttsRate: 0.4 }, formAway: { bttsRate: 0.8 } })).toBe(60)
    expect(publicPredictionPayload(payload).free[0]).toEqual(row)
  })

  it('retire les métriques locales du flux courant tout en préservant la provenance du pick Gemini', () => {
    const row = {
      ...free,
      ai_source: 'gemini-stats-v1', ai_abstain: false, ai_model: 'gemini-3.5-flash-lite',
      ai_response_status: 'pick', ai_market: 'BTTS', modelEngine: 'gemini-stats-v1',
      homeLambda: 1.8, awayLambda: 1.3, xgHome: 1.8, xgAway: 1.3, xgTotal: 3.1,
      empiricalBttsRate: 0.8, empiricalOver25Rate: 0.7, reliabilityScore: 88,
      dataQuality: 'HIGH', bttsProb: 0.54, over25Prob: 0.7,
      analysisData: { homeLambda: 1.8, awayLambda: 1.3, xgTotal: 3.1 }, analysis: 'Legacy local analysis',
      ai_analysis: 'Legacy local text', ai_analysis_en: 'Legacy local English text',
      ai_confidence: 88, ai_risks: ['Legacy risk'], analysisEngine: 'local-poisson',
      predictions: [{ type: 'BTTS', prediction: 'Oui', proba: 0.54, confidence: 54, ai_analysis: 'Nested legacy text', ai_confidence: 88, modelEngine: 'gemini-3.5-flash-lite' }],
    }
    const serialized = publicPredictionPayload({ free: [row] }, { retireLegacyAiNumbers: true }).free[0]

    expect(serialized).toMatchObject({ ai_model: 'gemini-3.5-flash-lite', modelEngine: 'gemini-stats-v1' })
    for (const field of ['homeLambda', 'awayLambda', 'xgHome', 'xgAway', 'xgTotal', 'empiricalBttsRate', 'empiricalOver25Rate', 'reliabilityScore', 'dataQuality', 'bttsProb', 'over25Prob', 'analysisData', 'analysis', 'ai_analysis', 'ai_analysis_en', 'ai_confidence', 'ai_risks', 'analysisEngine', 'confidence']) {
      expect(serialized).not.toHaveProperty(field)
    }
    expect(serialized.predictions[0]).not.toHaveProperty('confidence')
    expect(serialized.predictions[0]).not.toHaveProperty('ai_analysis')
    expect(serialized.predictions[0]).not.toHaveProperty('ai_confidence')
    expect(serialized.predictions[0].modelEngine).toBe('gemini-3.5-flash-lite')
    expect(getGeminiPicks(serialized)).toHaveLength(1)
  })

  it('retire entièrement les fixtures et choix VIP de tous les niveaux exportés', () => {
    const fixture = { id: 'fixture', home: 'Club A', away: 'Club B', league: 'League 2', date: '2026-11-10', time: '19:00' }
    const privateFixture = { ...fixture, id: 'private-fixture', home: 'Private club', vip: true }
    const safe = publicPredictionPayload({ free: [free, vip], predictions: [free, vip], fixtures: [fixture, privateFixture], vipPreview: [vip], vip: [vip], vipPredictions: [vip], stats: { freeCount: 1, vipCount: 1 }, combos: [{ legs: [vip] }] })
    expect(safe.free).toEqual([free])
    expect(safe.predictions).toEqual([free])
    expect(safe.fixtures).toEqual([fixture])
    expect(safe).not.toHaveProperty('vipPreview')
    expect(safe).not.toHaveProperty('vip')
    expect(safe).not.toHaveProperty('vipPredictions')
    expect(safe.stats).toEqual({ freeCount: 1 })
    expect(safe).not.toHaveProperty('combos')
    expect(JSON.stringify(safe)).not.toContain('Private')
    expect(JSON.stringify(safe)).not.toContain('VIP')
  })
  it('nettoie aussi les archives et les combinés, de façon idempotente', () => {
    const root = workspace(), publicDir = path.join(root, 'public')
    const historicalFields = { ...free, homeLambda: 1.2, xgHome: 1.2, analysisData: { homeLambda: 1.2 } }
    const payload = { free: [historicalFields], predictions: [historicalFields], vipPreview: [vip], stats: { vipCount: 1 } }
    fs.writeFileSync(path.join(publicDir, 'predictions.json'), JSON.stringify(payload))
    fs.writeFileSync(path.join(publicDir, 'predictions-archive', '2026-10-21.json'), JSON.stringify(payload))
    fs.writeFileSync(path.join(publicDir, 'vip-combos.json'), JSON.stringify({ combos: [vip] }))
    expect(sanitizePublicData(publicDir)).toBe(3)
    expect(sanitizePublicData(publicDir)).toBe(0)
    expect(fs.readFileSync(path.join(publicDir, 'predictions.json'), 'utf8')).not.toContain('vipPreview')
    expect(fs.readFileSync(path.join(publicDir, 'predictions-archive', '2026-10-21.json'), 'utf8')).not.toContain('vipPreview')
    expect(fs.readFileSync(path.join(publicDir, 'predictions-archive', '2026-10-21.json'), 'utf8')).not.toContain('ai_exact_score')
    expect(JSON.parse(fs.readFileSync(path.join(publicDir, 'predictions.json'), 'utf8')).free[0]).not.toHaveProperty('homeLambda')
    expect(JSON.parse(fs.readFileSync(path.join(publicDir, 'predictions-archive', '2026-10-21.json'), 'utf8')).free[0]).toMatchObject(historicalFields)
    expect(JSON.parse(fs.readFileSync(path.join(publicDir, 'vip-combos.json'), 'utf8')).combos).toEqual([])
  })

  it('exporte uniquement l’historique Gemini strict sans modifier les JSON source ni les exclusions', () => {
    const exportDir = workspace()
    const sourceDir = path.resolve(process.cwd(), 'public')
    const sourceFiles = [
      path.join(sourceDir, 'win-history.json'),
      path.join(sourceDir, 'history-exclusions.json'),
      path.join(sourceDir, 'predictions-archive', '2026-11-01.json'),
    ]
    const hashesBefore = sourceFiles.map(file => createHash('sha256').update(fs.readFileSync(file)).digest('hex'))
    fs.copyFileSync(sourceFiles[0], path.join(exportDir, 'win-history.json'))

    expect(sanitizePublicData(exportDir, { staticExport: true, sourcePublicDir: sourceDir })).toBe(1)
    const exported = JSON.parse(fs.readFileSync(path.join(exportDir, 'win-history.json'), 'utf8'))

    expect(exported).toMatchObject({ geminiOnly: true, historyAudit: { geminiRecordedPickRows: 72, fullPickRows: 72, fullPickWon: 49, fullPickLost: 23 } })
    expect(exported.history).toHaveLength(72)
    expect(exported.history.every((row: Record<string, unknown>) => row.ai_source === 'gemini-stats-v1' && row.ai_abstain === false && row.ai_model === 'gemini-3.5-flash-lite' && row.ai_response_status === 'pick' && row.modelEngine === 'gemini-stats-v1')).toBe(true)
    expect(JSON.stringify(exported.history)).not.toMatch(/"(?:proba|confidence|xgHome|xgAway|xgTotal|homeLambda|awayLambda)"/)
    expect(exported.stats).toMatchObject({ total: 72, won: 49, lost: 23 })
    expect(exported).not.toHaveProperty('legacyStats')
    expect((exported.historyReviewRows || []).some((row: Record<string, unknown>) => 'reviewStatus' in row)).toBe(false)
    expect(exported.historyReviewRows.every((row: { provenanceVerified?: boolean; prediction?: string }) => row.provenanceVerified || !row.prediction)).toBe(true)
    expect(sourceFiles.map(file => createHash('sha256').update(fs.readFileSync(file)).digest('hex'))).toEqual(hashesBefore)
    expect(sanitizePublicData(exportDir, { staticExport: true, sourcePublicDir: sourceDir })).toBe(0)
  })

  it('les pages match reprennent uniquement le pick courant avec provenance Gemini complète', () => {
    const root = workspace()
    fs.writeFileSync(path.join(root, 'public', 'predictions-archive', '2026-10-21.json'), JSON.stringify({ predictions: [{ ...free, proba: 0.9, ai_analysis: 'Ancien texte' }] }))
    const currentPick = {
      ...free,
      ai_source: 'gemini-stats-v1', ai_abstain: false, ai_model: 'gemini-3.5-flash-lite',
      ai_response_status: 'pick', ai_market: 'BTTS', modelEngine: 'gemini-stats-v1',
      ai_analysis: 'Texte actuel',
      predictions: [{ type: 'BTTS', prediction: 'Oui', proba: 0.54, confidence: 54, modelEngine: 'gemini-3.5-flash-lite' }],
    }
    fs.writeFileSync(path.join(root, 'public', 'predictions.json'), JSON.stringify({ lastUpdated: '2026-10-21T10:00:00Z', free: [currentPick, vip] }))
    vi.spyOn(process, 'cwd').mockReturnValue(root)
    const matches = [...loadAllMatches().values()]
    expect(matches).toHaveLength(1)
    expect(matches[0].aiAnalysis).toBe('Texte actuel')
    expect(matches[0].predictions.map(row => row.proba)).toEqual([0.54])
    expect(matches[0].lastUpdated).toBe('2026-10-21T10:00:00Z')
  })
})
