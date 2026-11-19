import { afterEach, describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { sanitizePublicData } from '../scripts/sanitize-public-data.mjs'

const roots: string[] = []

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true })
})

function workspace() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gemini-history-retention-'))
  roots.push(root)
  fs.mkdirSync(path.join(root, 'public', 'predictions-archive'), { recursive: true })
  return root
}

describe('export complet de l’historique Gemini', () => {
  it('conserve dans l’export un pick vérifié situé avant les 90 archives les plus récentes', () => {
    const sourceRoot = workspace()
    const exportRoot = workspace()
    const sourcePublicDir = path.join(sourceRoot, 'public')
    const sourceHistoryPath = path.join(sourcePublicDir, 'win-history.json')
    const sourceArchiveDir = path.join(sourcePublicDir, 'predictions-archive')
    const originalHistory = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'public/win-history.json'), 'utf8'))
    const date = '2026-08-08'
    const match = 'Old Archive Home vs Old Archive Away'
    const archivePick = {
      id: 'old-gemini-pick',
      date,
      match,
      league: 'Regression League',
      type: 'BTTS',
      prediction: 'Oui',
      proba: 0.54,
      status: 'WON',
      finalScore: '2-1',
      verifiedAt: '2026-08-09T12:00:00.000Z',
      ai_source: 'gemini-stats-v1',
      ai_abstain: false,
      ai_model: 'gemini-3.5-flash-lite',
      ai_response_status: 'pick',
      ai_market: 'BTTS',
      modelEngine: 'gemini-stats-v1',
      predictions: [{ type: 'BTTS', prediction: 'Oui', proba: 0.54, modelEngine: 'gemini-3.5-flash-lite' }],
    }
    const historyRow = {
      date,
      match,
      league: 'Regression League',
      market: 'btts',
      type: 'BTTS',
      prediction: 'Oui',
      status: 'WON',
      finalScore: '2-1',
      verifiedAt: archivePick.verifiedAt,
    }
    fs.writeFileSync(sourceHistoryPath, JSON.stringify({
      ...originalHistory,
      generatedAt: '2026-11-06T12:00:00.000Z',
      history: [historyRow],
    }))
    fs.copyFileSync(sourceHistoryPath, path.join(exportRoot, 'win-history.json'))

    const archivePaths: string[] = []
    const start = Date.UTC(2026, 7, 8)
    for (let index = 0; index < 91; index += 1) {
      const archiveDate = new Date(start + index * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      const archivePath = path.join(sourceArchiveDir, `${archiveDate}.json`)
      fs.writeFileSync(archivePath, JSON.stringify({ predictions: index === 0 ? [archivePick] : [] }))
      archivePaths.push(archivePath)
    }
    const sourceFiles = [sourceHistoryPath, ...archivePaths]
    const sourceHashes = sourceFiles.map(file => createHash('sha256').update(fs.readFileSync(file)).digest('hex'))

    expect(sanitizePublicData(exportRoot, { staticExport: true, sourcePublicDir })).toBe(1)
    const exported = JSON.parse(fs.readFileSync(path.join(exportRoot, 'win-history.json'), 'utf8'))

    expect(exported.historyAudit.archivesRead).toBe(91)
    expect(exported.historyAudit.fullPickRows).toBe(1)
    expect(exported.stats.total).toBe(1)
    expect(exported.history).toHaveLength(1)
    expect(exported.history[0]).toMatchObject({ date, match, status: 'WON', finalScore: '2-1' })
    expect(sourceFiles.map(file => createHash('sha256').update(fs.readFileSync(file)).digest('hex'))).toEqual(sourceHashes)
  })
})
