import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { runWinHistory, validateWinHistoryPayload } from '../scripts/update-win-history.mjs'

const NOW = Date.parse('2026-10-20T12:00:00Z')
const makePrediction = (match: string, fields: Record<string, unknown>) => ({
  id: match,
  date: '2026-10-24',
  time: '18:45',
  match,
  league: 'Regression League',
  type: 'BTTS',
  prediction: 'Oui',
  ...fields,
})

let archiveDir = ''
beforeAll(() => {
  archiveDir = fs.mkdtempSync(path.join(os.tmpdir(), 'verified-rate-'))
  fs.writeFileSync(path.join(archiveDir, '2026-10-24.json'), JSON.stringify({ predictions: [
    // A recognized result status wins over a contradictory legacy boolean.
    makePrediction('winner', { status: 'WON', isWon: false, finalScore: '2-1' }),
    makePrediction('loser', { status: 'LOST', isWon: true, finalScore: '0-0' }),
    // Unknown/pending statuses cannot be treated as final results due to stale booleans.
    makePrediction('pending', { status: 'PENDING', isWon: false }),
    makePrediction('unknown', { status: 'IN_PROGRESS', isWon: true }),
    // Boolean-only legacy records remain compatible.
    makePrediction('legacy-loser', { isWon: false, finalScore: '0-0' }),
    // Existing W/L status is retained in source totals even when no pick was recorded.
    makePrediction('no-pick-winner', { status: 'WON', prediction: '', finalScore: '2-0' }),
  ] }))
})
afterAll(() => {
  if (archiveDir) fs.rmSync(archiveDir, { recursive: true, force: true })
})

describe('verified results and rate denominator', () => {
  it('counts explicit WON/LOST statuses, preserves losses, and excludes unresolved records', () => {
    const data = runWinHistory({ write: false, dir: archiveDir, now: NOW })!
    expect(data.stats).toMatchObject({
      total: 4,
      won: 2,
      lost: 2,
      pending: 2,
      unverifiable: 0,
      archivedTotal: 6,
      rate: 50,
    })
    expect(data.stats.total).toBe(data.stats.won + data.stats.lost)
    expect(data.history.map((row: any) => row.status).sort()).toEqual(['LOST', 'LOST', 'WON', 'WON'])
  })

  it('returns all deduplicated W/L rows only for an explicit dry-run audit, without writing files', () => {
    const data = runWinHistory({ write: false, dir: archiveDir, now: NOW, includeFullHistory: true })!
    expect(data.auditFullHistory).toHaveLength(4)
    expect(data.auditFullHistory.filter((row: any) => !row.prediction)).toHaveLength(1)
    expect(data.stats.total).toBe(data.auditFullHistory.length)
    expect(data.history).toHaveLength(4)
    expect(fs.readdirSync(archiveDir)).toEqual(['2026-10-24.json'])
  })

  it('rejects a nonzero rate when no verified outcomes exist', () => {
    const data = runWinHistory({ write: false, dir: archiveDir, now: NOW })!
    const payload = structuredClone(data) as any
    payload.stats.total = 0
    payload.stats.won = 0
    payload.stats.lost = 0
    payload.stats.rate = 100
    // Also align ancillary counters to isolate the rate invariant.
    payload.stats.pending = 0
    payload.stats.unverifiable = payload.stats.archivedTotal
    expect(() => validateWinHistoryPayload(payload)).toThrow(/stats.rate/)
  })
})

describe('conservation intégrale de l’historique', () => {
  it('agrège les résultats depuis toutes les archives, y compris la plus ancienne au-delà de 90', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'all-archive-history-'))
    const files: string[] = []
    const start = Date.UTC(2026, 7, 8)
    try {
      for (let index = 0; index < 91; index += 1) {
        const day = new Date(start + index * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
        const predictions = index === 0
          ? [makePrediction('oldest-won', { id: 'oldest-won', date: day, status: 'WON', finalScore: '2-1' })]
          : index === 90
            ? [makePrediction('newest-lost', { id: 'newest-lost', date: day, status: 'LOST', finalScore: '1-0' })]
            : []
        const file = `${day}.json`
        files.push(file)
        fs.writeFileSync(path.join(dir, file), JSON.stringify({ predictions }, null, 2))
      }
      const originalNames = fs.readdirSync(dir).sort()

      const data = runWinHistory({ write: false, dir, now: Date.parse('2026-11-07T12:00:00Z'), includeFullHistory: true })!

      expect(data.stats).toMatchObject({ total: 2, won: 1, lost: 1, archivedTotal: 2 })
      expect(data.history.map((row: any) => row.match).sort()).toEqual(['newest-lost', 'oldest-won'])
      expect(data.auditFullHistory).toHaveLength(2)
      expect(fs.readdirSync(dir).sort()).toEqual(originalNames)
      expect(originalNames).toEqual(files.sort())
    } finally {
      fs.rmSync(dir, { recursive: true, force: true })
    }
  })

  it('conserve tous les détails publics vérifiés au-delà de l’ancien plafond de 500', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'full-public-history-'))
    try {
      const predictions = Array.from({ length: 501 }, (_, index) => {
        const match = `public-record-${String(index).padStart(3, '0')}`
        return makePrediction(match, { id: match, date: '2026-10-24', status: 'WON', finalScore: '2-1' })
      })
      fs.writeFileSync(path.join(dir, '2026-10-24.json'), JSON.stringify({ predictions }))

      const data = runWinHistory({ write: false, dir, now: NOW, includeFullHistory: true })!

      expect(data.stats.total).toBe(501)
      expect(data.history).toHaveLength(501)
      expect(data.auditFullHistory).toHaveLength(501)
    } finally {
      fs.rmSync(dir, { recursive: true, force: true })
    }
  })

  it('conserve aussi tous les détails legacy au-delà de l’ancien plafond de 200', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'full-legacy-history-'))
    try {
      const predictions = Array.from({ length: 201 }, (_, index) => {
        const match = `legacy-record-${String(index).padStart(3, '0')}`
        return makePrediction(match, { id: match, date: '2026-08-07', status: 'WON', finalScore: '2-1' })
      })
      fs.writeFileSync(path.join(dir, '2026-08-07.json'), JSON.stringify({ predictions }))

      const data = runWinHistory({ write: false, dir, now: NOW })!

      expect(data.stats.total).toBe(0)
      expect(data.legacyStats.total).toBe(201)
      expect(data.legacyStats.history).toHaveLength(201)
    } finally {
      fs.rmSync(dir, { recursive: true, force: true })
    }
  })
})
