import { mkdtempSync, rmSync, writeFileSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { runWinHistory } from '../scripts/update-win-history.mjs'

const expectedNov5Keys = [
  '2026-11-05|Bayer Leverkusen vs Marseille|btts',
  '2026-11-05|Sint-Truidense vs SK Brann|over25',
  '2026-11-05|AS Monaco vs FC Nordsjælland|btts',
  '2026-11-05|Bayer Leverkusen vs Marseille|over25',
  '2026-11-05|Crystal Palace vs TSG Hoffenheim|btts',
  '2026-11-05|Trabzonspor vs SC Freiburg|btts',
  '2026-11-05|AGF vs Braga|over25',
  '2026-11-05|AGF vs Braga|btts',
  '2026-11-05|Anderlecht vs RB Salzburg|over25',
  '2026-11-05|Crystal Palace vs TSG Hoffenheim|over25',
  '2026-11-05|Real Sociedad vs Lyon|over25',
  '2026-11-05|Trabzonspor vs SC Freiburg|over25',
]

describe('historical result exclusions for 2026-11-05', () => {
  it('stores exactly the 12 requested keys without a public reason field', () => {
    const file = path.resolve(process.cwd(), 'public/history-exclusions.json')
    const doc = JSON.parse(readFileSync(file, 'utf8'))
    const entries = doc.entries.filter((entry: { date?: string }) => entry.date === '2026-11-05')

    expect(entries.map((entry: { key: string }) => entry.key).sort()).toEqual([...expectedNov5Keys].sort())
    expect(entries.every((entry: Record<string, unknown>) => !Object.hasOwn(entry, 'reason'))).toBe(true)
  })

  it('moves an excluded verified loss to unverifiable and preserves an unrelated win', () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'bttspredict-history-exclusions-'))
    try {
      const excludedLoss = {
        match: 'Bayer Leverkusen vs Marseille', league: 'UEFA Europa League',
        type: 'BTTS', prediction: 'Oui', proba: 0.71, date: '2026-11-05',
        status: 'LOST', finalScore: '0-1', verifiedAt: '2026-11-05T22:58:01.209Z',
      }
      const retainedWin = {
        match: 'Sample FC vs Other FC', league: 'Test League',
        type: 'BTTS', prediction: 'Oui', proba: 0.71, date: '2026-11-05',
        status: 'WON', finalScore: '2-1', verifiedAt: '2026-11-05T22:58:01.209Z',
      }
      writeFileSync(path.join(dir, '2026-11-05.json'), JSON.stringify({ predictions: [excludedLoss, retainedWin] }))

      const out = runWinHistory({ write: false, dir, now: Date.parse('2026-11-06T12:00:00Z') })!

      expect(out.stats).toMatchObject({ total: 1, won: 1, lost: 0, pending: 0, unverifiable: 1, archivedTotal: 2, rate: 100 })
      expect(out.history).toHaveLength(1)
      expect(out.history[0]).toMatchObject({ match: 'Sample FC vs Other FC', status: 'WON' })
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
