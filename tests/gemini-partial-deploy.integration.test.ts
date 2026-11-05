import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const MODEL = 'gemini-3.5-flash-lite'
const ROOT = process.cwd()
const FILTER_SCRIPT = path.join(ROOT, 'scripts/filter-gemini-current-picks.mjs')
const FINALIZE_SCRIPT = path.join(ROOT, 'scripts/finalize-predictions.mjs')
const VALIDATE_SCRIPT = path.join(ROOT, 'scripts/validate-predictions.mjs')

function currentDate() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Africa/Dakar' })
}

function fixture(id: string, index: number, date: string) {
  const home = `Home ${index}`
  const away = `Away ${index}`
  return {
    id,
    match: `${home} vs ${away}`,
    home,
    away,
    league: 'Integration League',
    date,
    reliabilityScore: 70,
    dataQuality: 'HIGH',
    dataSource: 'observed-match-data',
  }
}

function geminiPick(index: number, date: string) {
  const base = fixture(`gemini-pick-${index}`, index, date)
  return {
    ...base,
    type: 'BTTS',
    prediction: 'Oui',
    proba: 0.61,
    confidence: 61,
    ai_source: 'gemini-stats-v1',
    ai_market: 'BTTS',
    ai_abstain: false,
    ai_model: MODEL,
    ai_response_status: 'pick',
    modelEngine: 'gemini-stats-v1',
    predictions: [{ type: 'BTTS', prediction: 'Oui', proba: 0.61, modelEngine: MODEL }],
  }
}

function geminiAbstention(index: number, date: string) {
  return {
    ...fixture(`gemini-abstain-${index}`, index, date),
    ai_source: 'gemini-stats-v1',
    ai_model: MODEL,
    ai_response_status: 'abstain',
    ai_abstain: true,
    ai_market: 'ABSTAIN',
    modelEngine: 'gemini-stats-v1',
    ai_analysis: 'Aucune conclusion exploitable.',
  }
}

function hybridEmpirical(index: number, date: string) {
  const base = fixture(`hybrid-${index}`, index, date)
  return {
    ...base,
    type: 'BTTS',
    prediction: 'Oui',
    proba: 0.70,
    ai_source: 'gemini-stats-v1',
    ai_abstain: false,
    ai_market: 'BOTH',
    modelEngine: 'gemini-stats-v1',
    predictions: [
      { type: 'BTTS', prediction: 'Oui', proba: 0.70, modelEngine: 'empirical-form+gemini' },
      { type: 'Over 2.5', prediction: 'Oui', proba: 0.72, modelEngine: 'empirical-form+gemini' },
    ],
  }
}

function missingResponseWithLocalPick(index: number, date: string) {
  const base = fixture(`missing-${index}`, index, date)
  return {
    ...base,
    type: 'BTTS',
    prediction: 'Oui',
    proba: 0.68,
    ai_abstain: true,
    ai_market: 'ABSTAIN',
    predictions: [{ type: 'BTTS', prediction: 'Oui', proba: 0.68, modelEngine: 'empirical-form+gemini' }],
  }
}

describe('partial Gemini data deployment integration', () => {
  it('filters 16/30, validates the feed, preserves historical archive bytes, and leaves build/FTP reachable', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gemini-partial-deploy-'))
    try {
      const date = currentDate()
      const predictionsFile = path.join(root, 'predictions.json')
      const archiveDir = path.join(root, 'archive')
      fs.mkdirSync(archiveDir, { recursive: true })

      const candidates = [
        ...Array.from({ length: 12 }, (_, index) => geminiPick(index, date)),
        ...Array.from({ length: 4 }, (_, offset) => geminiAbstention(12 + offset, date)),
        ...Array.from({ length: 5 }, (_, offset) => hybridEmpirical(16 + offset, date)),
        ...Array.from({ length: 9 }, (_, offset) => missingResponseWithLocalPick(21 + offset, date)),
      ]
      fs.writeFileSync(predictionsFile, `${JSON.stringify({
        date,
        lastUpdated: new Date().toISOString(),
        free: candidates,
        predictions: candidates,
        stats: { freeCount: 30 },
      }, null, 2)}\n`)

      const historicalFile = path.join(archiveDir, '2026-11-04.json')
      const historicalBytes = `${JSON.stringify({ date: '2026-11-04', free: [{
        id: 'historic', type: 'BTTS', ai_market: 'BTTS', date: '2026-11-04',
        home: 'Historic Home', away: 'Historic Away', league: 'Historic League',
        ai_source: 'legacy-empirical', prediction: 'Oui', proba: 0.67,
      }] }, null, 2)}\n`
      fs.writeFileSync(historicalFile, historicalBytes)

      execFileSync(process.execPath, [FILTER_SCRIPT, predictionsFile], { cwd: ROOT, encoding: 'utf8' })
      execFileSync(process.execPath, [FINALIZE_SCRIPT, predictionsFile, archiveDir], { cwd: ROOT, encoding: 'utf8' })
      execFileSync(process.execPath, [VALIDATE_SCRIPT, predictionsFile, '--require-timestamp', '--require-gemini'], { cwd: ROOT, encoding: 'utf8' })

      const filtered = JSON.parse(fs.readFileSync(predictionsFile, 'utf8'))
      expect(filtered.free).toHaveLength(16)
      expect(filtered.stats.freeCount).toBe(16)
      expect(filtered.free.filter((row: { ai_response_status: string }) => row.ai_response_status === 'pick')).toHaveLength(12)
      expect(filtered.free.filter((row: { ai_response_status: string }) => row.ai_response_status === 'abstain')).toHaveLength(4)
      expect(filtered.free.every((row: { ai_source: string; ai_model: string; ai_response_status: string }) =>
        row.ai_source === 'gemini-stats-v1' && row.ai_model === MODEL && ['pick', 'abstain'].includes(row.ai_response_status),
      )).toBe(true)
      expect(filtered.free.some((row: { predictions?: Array<{ modelEngine?: string }> }) =>
        row.predictions?.some(pick => pick.modelEngine === 'empirical-form+gemini'),
      )).toBe(false)
      expect(fs.readFileSync(historicalFile, 'utf8')).toBe(historicalBytes)

      const workflow = fs.readFileSync(path.join(ROOT, '.github/workflows/deploy.yml'), 'utf8')
      const validationStep = workflow.indexOf('- name: Validate predictions dataset before build')
      const orderedSteps = [
        workflow.indexOf('- name: Gemini enrichment — warn on incomplete coverage'),
        workflow.indexOf('- name: Filter current feed to verified Gemini responses'),
        workflow.indexOf('- name: Finalize enriched immutable publication'),
        validationStep,
        workflow.indexOf('- name: Build static export', validationStep),
        workflow.indexOf('- name: Deploy to bttspredict.com via FTP', validationStep),
      ]
      expect(orderedSteps.every(position => position >= 0)).toBe(true)
      expect(orderedSteps).toEqual([...orderedSteps].sort((left, right) => left - right))
      expect(workflow).toContain('run: node scripts/filter-gemini-current-picks.mjs public/predictions.json')

      const enrichmentSource = fs.readFileSync(path.join(ROOT, 'scripts/enrich_predictions.py'), 'utf8')
      expect(enrichmentSource).toContain('::warning::Gemini coverage incomplete')
      expect(enrichmentSource).not.toContain('::error::Gemini coverage incomplete')
    } finally {
      fs.rmSync(root, { recursive: true, force: true })
    }
  })
})
