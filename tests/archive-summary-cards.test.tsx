import React from 'react'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import ArchiveSummaryCards from '@/components/bttsbet/ArchiveSummaryCards'
import { CompositionBar } from '@/components/bttsbet/SimpleCharts'
import { extractArchiveSummary } from '@/lib/archive-summary'
import { getArchiveSummary } from '@/app/historique/getArchiveSummary'
import { getWinHistory } from '@/app/historique/getWinHistory'

const aggregate = (total: number, won: number, lost: number, rate: number) => ({ total, won, lost, rate })

describe('archive summary cards', () => {
  it('reads all three saved archive rollups without changing the source or the strict projection', () => {
    const source = 'public/win-history.json'
    const original = readFileSync(source)
    const hash = (data: Buffer) => createHash('sha256').update(data).digest('hex')
    const json = JSON.parse(original.toString('utf8'))
    const summary = getArchiveSummary()
    expect(summary).toEqual({
      ...aggregate(json.stats.total, json.stats.won, json.stats.lost, json.stats.rate),
      byType: {
        btts: aggregate(json.stats.byType.btts.total, json.stats.byType.btts.won, json.stats.byType.btts.lost, json.stats.byType.btts.rate),
        over25: aggregate(json.stats.byType.over25.total, json.stats.byType.over25.won, json.stats.byType.over25.lost, json.stats.byType.over25.rate),
      },
    })
    expect(summary).toEqual({ ...aggregate(538, 426, 112, 79.2), byType: { btts: aggregate(437, 354, 83, 81), over25: aggregate(101, 72, 29, 71.3) } })
    const verified = getWinHistory()
    expect(verified?.geminiOnly).toBe(true)
    expect(verified?.stats.total).toBe(verified?.pickStats.total)
    expect(verified?.stats.won).toBe(verified?.pickStats.won)
    expect(hash(readFileSync(source))).toBe(hash(original))
  })

  it('renders the same three correctly labelled recorded totals in French and English', () => {
    const summary = getArchiveSummary()
    expect(summary).not.toBeNull()
    const fr = renderToStaticMarkup(<ArchiveSummaryCards summary={summary} lang="fr" />)
    const en = renderToStaticMarkup(<ArchiveSummaryCards summary={summary} lang="en" />)
    for (const html of [fr, en]) {
      for (const figure of ['538', '426', '112', '437', '354', '83', '101', '72', '29']) expect(html).toContain(figure)
      expect(html).toContain('BTTS')
      expect(html).toContain('Over 2.5')
      expect(html).not.toMatch(/gemini/i)
    }
    expect(fr).toContain('79,2 %'); expect(fr).toContain('81 %'); expect(fr).toContain('71,3 %')
    expect(fr).toContain('résultats enregistrés'); expect(fr).toContain('Les détails vérifiés sont présentés séparément')
    expect(en).toContain('79.2 %'); expect(en).toContain('81 %'); expect(en).toContain('71.3 %')
    expect(en).toContain('recorded results'); expect(en).toContain('Verified details are shown separately')
  })

  it('uses the common cards on home, history, statistics and results while retaining the strict row filter', () => {
    for (const name of ['src/components/bttsbet/PerformanceDashboard.tsx', 'src/app/historique/HistoriqueClient.tsx', 'src/app/statistiques/StatistiquesClient.tsx', 'src/app/resultats-verifies/ResultatsClient.tsx']) {
      expect(readFileSync(name, 'utf8')).toContain('<ArchiveSummaryCards summary={archiveSummary} lang={lang} />')
    }
    for (const name of ['src/app/historique/HistoriqueClient.tsx', 'src/app/resultats-verifies/ResultatsClient.tsx']) {
      expect(readFileSync(name, 'utf8')).toContain("validateRecordedResult(row) === 'verified'")
    }
  })

  it('labels archive composition as recorded, including its accessible name', () => {
    const labels = { won: 'WIN', lost: 'LOST' }
    const archive = renderToStaticMarkup(<CompositionBar won={426} lost={112} labels={labels} lang="fr" countKind="recorded" />)
    expect(archive).toContain('538 enregistrés')
    expect(archive).not.toContain('538 vérifiés')
    expect(archive).toContain('aria-label="426 WIN, 112 LOST / 538 enregistrés"')
    const verified = renderToStaticMarkup(<CompositionBar won={49} lost={23} labels={labels} lang="fr" />)
    expect(verified).toContain('72 vérifiés')
    expect(readFileSync('src/app/statistiques/StatistiquesClient.tsx', 'utf8')).toContain('countKind="recorded"')
  })

  it('rejects missing, inconsistent, nonnumeric and unbalanced rollups rather than inventing figures', () => {
    const btts = aggregate(8, 6, 2, 75), over25 = aggregate(2, 2, 0, 100)
    const valid = { stats: { ...aggregate(10, 8, 2, 80), byType: { btts, over25 } } }
    expect(extractArchiveSummary(valid)).not.toBeNull()
    expect(extractArchiveSummary(null)).toBeNull()
    expect(extractArchiveSummary({ stats: aggregate(0, 0, 0, 0) })).toBeNull()
    expect(extractArchiveSummary({ stats: { ...aggregate(10, 8, 1, 80), byType: { btts, over25 } } })).toBeNull()
    expect(extractArchiveSummary({ stats: { ...aggregate(10, 8, 2, 79.2), byType: { btts, over25 } } })).toBeNull()
    expect(extractArchiveSummary({ stats: { ...aggregate(10, 8, 2, 80), byType: { btts, over25: aggregate(1, 1, 0, 100) } } })).toBeNull()
    expect(renderToStaticMarkup(<ArchiveSummaryCards summary={null} lang="fr" />)).toBe('')
  })
})
