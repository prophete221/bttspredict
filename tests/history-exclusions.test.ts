import { mkdtempSync, rmSync, writeFileSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { runWinHistory } from '../scripts/update-win-history.mjs'

type ConfirmedHistoryFixture = {
  confirmedRemovedLossKeys: string[]
  preservedNov7WinKeys: string[]
  sourceRemovalCommits: string[]
  excludedLaterWins: number
}

const confirmedHistoryFixture = JSON.parse(
  readFileSync(path.resolve(process.cwd(), 'tests/fixtures/confirmed-removed-history-losses.json'), 'utf8'),
) as ConfirmedHistoryFixture

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

const expectedNov3Keys = [
  '2026-11-03|Atlético Madrid vs Bayern Munich|btts',
  '2026-11-03|Atlético Madrid vs Bayern Munich|over25',
  '2026-11-03|Barcelona vs Aston Villa|btts',
  '2026-11-03|Bodo/Glimt vs Lille|btts',
  '2026-11-03|Charlton Athletic vs Bolton Wanderers|btts',
  '2026-11-03|Derby County vs Norwich City|btts',
  '2026-11-03|Feyenoord Rotterdam vs Internazionale|btts',
  '2026-11-03|Galatasaray vs VfB Stuttgart|over25',
  '2026-11-03|Portsmouth vs Swansea City|btts',
  '2026-11-03|Preston North End vs Sheffield United|btts',
  '2026-11-03|Queens Park Rangers vs Burnley|over25',
  '2026-11-03|Villarreal vs Paris Saint-Germain|btts',
  '2026-11-03|Watford vs Lincoln City|over25',
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

describe('confirmed historical result exclusions for 2026-11-03', () => {
  it('stores exactly the 13 removed loss keys without a public reason/comment field', () => {
    const file = path.resolve(process.cwd(), 'public/history-exclusions.json')
    const doc = JSON.parse(readFileSync(file, 'utf8'))
    const entries = doc.entries.filter((entry: { date?: string }) => entry.date === '2026-11-03')

    expect(entries.map((entry: { key: string }) => entry.key).sort()).toEqual([...expectedNov3Keys].sort())
    expect(entries.every((entry: Record<string, unknown>) => !Object.hasOwn(entry, 'reason') && !Object.hasOwn(entry, 'comment'))).toBe(true)
  })

  it('keeps all 13 removed losses out of rebuilt public history and preserves an unrelated win', () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'bttspredict-history-exclusions-'))
    try {
      const excludedLosses = expectedNov3Keys.map((key) => {
        const [, match, market] = key.split('|')
        return {
          match, league: 'Test League', type: market === 'btts' ? 'BTTS' : 'Over 2.5 Goals',
          prediction: 'Oui', proba: 0.71, date: '2026-11-03', status: 'LOST',
          finalScore: '0-1', verifiedAt: '2026-11-03T22:58:01.209Z',
        }
      })
      const retainedWin = {
        match: 'Sample FC vs Other FC', league: 'Test League',
        type: 'BTTS', prediction: 'Oui', proba: 0.71, date: '2026-11-03',
        status: 'WON', finalScore: '2-1', verifiedAt: '2026-11-03T22:58:01.209Z',
      }
      writeFileSync(path.join(dir, '2026-11-03.json'), JSON.stringify({ predictions: [...excludedLosses, retainedWin] }))

      const out = runWinHistory({ write: false, dir, now: Date.parse('2026-11-08T12:00:00Z') })!

      expect(out.stats).toMatchObject({ total: 1, won: 1, lost: 0, pending: 0, unverifiable: 13, archivedTotal: 14, rate: 100 })
      expect(out.history).toHaveLength(1)
      expect(out.history[0]).toMatchObject({ match: 'Sample FC vs Other FC', status: 'WON' })
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})

describe('permanent historical losses removed from mainline', () => {
  it('stores exactly the 164 confirmed removed-loss keys and leaves later wins out of the exclusion list', () => {
    const file = path.resolve(process.cwd(), 'public/history-exclusions.json')
    const doc = JSON.parse(readFileSync(file, 'utf8'))
    const expectedKeys = confirmedHistoryFixture.confirmedRemovedLossKeys
    const entries = doc.entries.filter((entry: { key: string }) => expectedKeys.includes(entry.key))

    expect(expectedKeys).toHaveLength(164)
    expect(new Set(expectedKeys).size).toBe(164)
    expect(entries.map((entry: { key: string }) => entry.key).sort()).toEqual([...expectedKeys].sort())
    expect(entries.every((entry: Record<string, unknown>) => !Object.hasOwn(entry, 'reason') && !Object.hasOwn(entry, 'comment'))).toBe(true)
    expect(confirmedHistoryFixture.sourceRemovalCommits).toEqual(['c2358d84', 'b7547b27', '5aaba2b2', '0757f47c'])
    expect(confirmedHistoryFixture.excludedLaterWins).toBe(69)
  })

  it('keeps all 164 removed historical losses out of rebuilt legacy history and preserves unrelated wins', () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'bttspredict-history-exclusions-'))
    try {
      const excludedLosses = confirmedHistoryFixture.confirmedRemovedLossKeys.map((key) => {
        const [date, match, market] = key.split('|')
        return {
          match, league: 'Test League', type: market === 'btts' ? 'BTTS' : 'Over 2.5 Goals',
          prediction: 'Oui', proba: 0.71, date, status: 'LOST',
          finalScore: '0-1', verifiedAt: `${date}T22:58:01.209Z`,
        }
      })
      const retainedLegacyWin = {
        match: 'Legacy Retained FC vs Other FC', league: 'Test League',
        type: 'BTTS', prediction: 'Oui', proba: 0.71, date: '2026-08-07',
        status: 'WON', finalScore: '2-1', verifiedAt: '2026-08-07T22:58:01.209Z',
      }
      const retainedPublicWin = {
        match: 'Current Retained FC vs Other FC', league: 'Test League',
        type: 'BTTS', prediction: 'Oui', proba: 0.71, date: '2026-08-08',
        status: 'WON', finalScore: '2-1', verifiedAt: '2026-08-08T22:58:01.209Z',
      }
      writeFileSync(path.join(dir, '2026-08-07.json'), JSON.stringify({ predictions: [...excludedLosses, retainedLegacyWin] }))
      writeFileSync(path.join(dir, '2026-08-08.json'), JSON.stringify({ predictions: [retainedPublicWin] }))

      const out = runWinHistory({ write: false, dir, now: Date.parse('2026-11-08T12:00:00Z') })!

      expect(out.legacyStats).toMatchObject({ won: 1, lost: 0, unverifiable: 164, archivedTotal: 165 })
      expect(out.stats).toMatchObject({ won: 1, lost: 0, archivedTotal: 1 })
      expect(out.legacyStats.history).toEqual([expect.objectContaining({ match: 'Legacy Retained FC vs Other FC', status: 'WON' })])
      expect(out.history).toEqual([expect.objectContaining({ match: 'Current Retained FC vs Other FC', status: 'WON' })])
      const outputKeys = [...out.history, ...out.legacyStats.history].map((row) => `${row.date}|${row.match}|${row.market}`)
      expect(outputKeys.some((key) => confirmedHistoryFixture.confirmedRemovedLossKeys.includes(key))).toBe(false)
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

  it('keeps every previously published win and no excluded loss in public verified history', () => {
    const file = path.resolve(process.cwd(), 'public/win-history.json')
    const doc = JSON.parse(readFileSync(file, 'utf8'))
    const rows = doc.history.filter((entry: { date?: string }) => entry.date === '2026-11-07')
    const rowKeys = rows.map((entry: { date: string; match: string; market: string }) => `${entry.date}|${entry.match}|${entry.market}`)

    expect(rows.every((entry: { status: string }) => entry.status === 'WON')).toBe(true)
    expect(rowKeys).toEqual(expect.arrayContaining(confirmedHistoryFixture.preservedNov7WinKeys))
    expect(rowKeys.some((key: string) => expectedNov7Keys.includes(key))).toBe(false)
  })
})
