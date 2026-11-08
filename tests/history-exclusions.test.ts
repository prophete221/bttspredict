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

const expectedNov7Keys = [
  '2026-11-07|RAAL La Louvière vs Cercle Brugge KSV|btts',
  '2026-11-07|CF Montréal vs Vancouver Whitecaps|btts',
  '2026-11-07|Orlando City SC vs New England Revolution|btts',
  '2026-11-07|FC Cincinnati vs Nashville SC|btts',
  '2026-11-07|Paris Saint-Germain vs Troyes|btts',
  '2026-11-07|St Mirren vs Rangers|over25',
  '2026-11-07|D.C. United vs New York City FC|btts',
  '2026-11-07|RAAL La Louvière vs Cercle Brugge KSV|over25',
  '2026-11-07|AS Roma vs Sassuolo|btts',
  '2026-11-07|Orlando City SC vs New England Revolution|over25',
  '2026-11-07|Sporting CP vs Moreirense|btts',
  '2026-11-07|AJ Auxerre vs Paris FC|btts',
  '2026-11-07|VfB Stuttgart vs Werder Bremen|btts',
  '2026-11-07|1. FC Nürnberg vs SV Darmstadt 98|btts',
  '2026-11-07|West Bromwich Albion vs Millwall|btts',
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

describe('historical result exclusions for 2026-11-07', () => {
  it('stores exactly the 15 requested loss keys without a public reason/comment field', () => {
    const file = path.resolve(process.cwd(), 'public/history-exclusions.json')
    const doc = JSON.parse(readFileSync(file, 'utf8'))
    const entries = doc.entries.filter((entry: { date?: string }) => entry.date === '2026-11-07')

    expect(entries.map((entry: { key: string }) => entry.key).sort()).toEqual([...expectedNov7Keys].sort())
    expect(entries.every((entry: Record<string, unknown>) => !Object.hasOwn(entry, 'reason') && !Object.hasOwn(entry, 'comment'))).toBe(true)
  })

  it('removes only the 15 losses from public verified history and retains all 24 wins', () => {
    const file = path.resolve(process.cwd(), 'public/win-history.json')
    const doc = JSON.parse(readFileSync(file, 'utf8'))
    const rows = doc.history.filter((entry: { date?: string }) => entry.date === '2026-11-07')

    expect(rows).toHaveLength(24)
    expect(rows.every((entry: { status: string }) => entry.status === 'WON')).toBe(true)
    expect(doc.stats).toMatchObject({ total: 525, won: 424, lost: 101, pending: 27, unverifiable: 203, archivedTotal: 755, rate: 80.8 })
    expect(doc.stats.gold).toMatchObject({ total: 400, won: 329, lost: 71, rate: 82.3 })
    expect(doc.stats.standard).toMatchObject({ total: 125, won: 95, lost: 30, rate: 76 })
    expect(doc.stats.byType.btts).toMatchObject({ total: 440, won: 358, lost: 82, rate: 81.4 })
    expect(doc.stats.byType.over25).toMatchObject({ total: 85, won: 66, lost: 19, rate: 77.6 })
    expect(doc.stats.trend14.find((entry: { date: string }) => entry.date === '2026-11-07')).toMatchObject({ total: 24, won: 24, lost: 0, rate: 100 })
  })
})
