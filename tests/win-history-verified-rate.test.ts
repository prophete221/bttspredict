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
