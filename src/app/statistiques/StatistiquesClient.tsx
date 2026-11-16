'use client'

/**
 * /statistiques — tableau de bord analytique honnête (Vague 2).
 *
 * RÈGLES ABSOLUES :
 *  - uniquement des données réelles de public/win-history.json (suivi public) ;
 *  - chaque taux affiché avec son dénominateur et son périmètre ;
 *  - aucune projection, aucune donnée inventée, aucune perte masquée ;
 *  - legacyStats (période privée pré-08/08) jamais affiché publiquement.
 */

import { useState, useEffect, type ReactNode } from 'react'
import Link from 'next/link'
import { Navbar, Footer } from '@/components/bttsbet'
import { useLanguage } from '@/components/bttsbet/LanguageSwitcher'
import AnimatedTitle from '@/components/bttsbet/HeroWordmark'
import ArchiveSummaryCards from '@/components/bttsbet/ArchiveSummaryCards'
import type { ArchiveSummary } from '@/lib/archive-summary'
import { RateBar, CompositionBar, CumulativeLine, DailyBars, fmtPct } from '@/components/bttsbet/SimpleCharts'
import { partitionRecordedPickHistory, summarizeRecordedPickHistory, validateRecordedResult } from '@/lib/historyDisplay'

interface HistoryEntry {
  date: string
  match: string
  league: string
  market: string
  prediction?: string
  tier: string
  proba: number
  status: string
  finalScore: string
  verifiedAt: string
  source: string
}

interface WinHistory {
  geminiOnly?: boolean
  generatedAt: string
  trackingPeriod: { startDate: string; isPublicPeriod: boolean; disclaimer: string; insufficientVolume: boolean }
  stats: {
    total: number
    won: number
    lost: number
    pending: number
    unverifiable?: number
    archivedTotal: number
    rate: number
    gold: { total: number; won: number; lost: number; rate: number }
    standard: { total: number; won: number; lost: number; rate: number }
    byType: {
      btts: { total: number; won: number; lost: number; rate: number }
      over25: { total: number; won: number; lost: number; rate: number }
    }
    trend14: Array<{ date: string; total: number; won: number; lost: number; rate: number }>
    period: { from: string; to: string; days: number }
  }
  history: HistoryEntry[]
  pickStats?: ReturnType<typeof summarizeRecordedPickHistory>
  historyAudit?: {
    archivesRead: number; sourceRows: number; sourceWon: number; sourceLost: number; sourceTotal: number
    sourceNoPick: number; sourceNoPickWon: number; sourceNoPickLost: number
    sourceRecordedPickRows: number; geminiRecordedPickRows: number; nonGeminiOrUnknownSourcePickRows: number; sourceNeedsReviewRows: number
    fullPickRows: number; fullPickWon: number; fullPickLost: number; fullPickUnverifiedRows: number
    detailLimit: number; detailRows: number; detailSourceRecordedPickRows: number; detailGeminiRows: number; detailPickRows: number; detailNoPick: number
    outsideDetailRows: number; outsideDetailGeminiRows: number; outsideDetailPickRows: number; sourceMatchesPublished: boolean
  }
}

type Copy = ReturnType<typeof makeCopy>

function makeCopy(lang: 'fr' | 'en' | 'ar') {
  if (lang === 'en') {
    return {
      title: 'Results statistics', subtitle: 'Archive summary and verified results by competition.',
      eyebrow: 'STATISTICS',
      lowVolume: 'The sample is still limited.',
      kpiOverall: 'Overall success rate', kpiGold: 'Gold picks rate', kpiVerified: 'Verified predictions',
      composition: 'Outcome composition', compositionDesc: (_p: number) => 'Wins and losses from verified match results.',
      evolution: 'Cumulative verified results', daily: 'Daily verifications', dailyDesc: 'Match results verified over the last 30 days.',
      markets: 'By market', tiers: 'Verified results by selection tier', leagues: 'Verified results by competition',
      tableLeague: 'Competition', tableWin: 'WIN', tableLost: 'LOST', tableRate: 'Rate', tableSample: 'Sample',
      verifiedOn: 'Verified match results only.', updated: 'Last data update', method: 'Methodology', results: 'Verified results →', today: 'Today’s predictions →',
      loading: 'Loading statistics…', error: 'Unable to load statistics data.', retry: 'Retry',
      disclaimer: '18+ · Sports betting carries a risk of loss. No future result is guaranteed. BTTSPredict does not take bets or hold funds.',
    }
  }
  if (lang === 'ar') {
    return {
      title: 'إحصائيات موثقة', subtitle: 'نتائج التوقعات الموثقة، مرتبة حسب السوق والمسابقة.',
      eyebrow: 'الإحصائيات',
      lowVolume: 'العينة ما زالت محدودة.',
      kpiOverall: 'معدل النجاح الإجمالي', kpiGold: 'معدل اختيارات Gold', kpiVerified: 'توقعات موثقة',
      composition: 'توزيع النتائج', compositionDesc: (_p: number) => 'النتائج تتضمن المباريات الرابحة والخاسرة.',
      evolution: 'النتائج الموثقة التراكمية', daily: 'التحققات اليومية', dailyDesc: 'نتائج المباريات التي تم التحقق منها خلال آخر 30 يوماً.',
      markets: 'حسب السوق', tiers: 'حسب مستوى الاختيار', leagues: 'حسب المسابقة',
      tableLeague: 'المسابقة', tableWin: 'فوز', tableLost: 'خسارة', tableRate: 'المعدل', tableSample: 'العينة',
      verifiedOn: 'النتائج الموثقة فقط.', updated: 'آخر تحديث للبيانات', method: 'المنهجية', results: 'النتائج الموثقة ←', today: 'توقعات اليوم ←',
      loading: 'جار تحميل الإحصائيات…', error: 'تعذر تحميل بيانات الإحصائيات.', retry: 'إعادة المحاولة',
      disclaimer: '18+ · المراهنات الرياضية تنطوي على خطر الخسارة. لا توجد ضمانات لأي نتيجة مستقبلية. BTTSPredict لا يقبل الرهانات ولا يحتفظ بالأموال.',
    }
  }
  return {
    title: 'Statistiques des résultats', subtitle: 'Bilan des archives et détail des résultats vérifiés par compétition.',
    eyebrow: 'STATISTIQUES',
    lowVolume: 'Échantillon encore limité.',
    kpiOverall: 'Taux de réussite global', kpiGold: 'Taux Sélections Gold', kpiVerified: 'Pronostics vérifiés',
    composition: 'Composition des résultats', compositionDesc: (_p: number) => 'Résultats gagnants et perdants des matchs vérifiés.',
    evolution: 'Évolution des résultats vérifiés', daily: 'Vérifications par jour', dailyDesc: 'Résultats vérifiés au cours des 30 derniers jours.',
    markets: 'Par marché', tiers: 'Résultats vérifiés par niveau de sélection', leagues: 'Résultats vérifiés par compétition',
    tableLeague: 'Compétition', tableWin: 'WIN', tableLost: 'LOST', tableRate: 'Taux', tableSample: 'Échantillon',
    verifiedOn: 'Résultats de matchs vérifiés.', updated: 'Dernière mise à jour des données', method: 'Méthodologie', results: 'Résultats vérifiés →', today: 'Pronostics du jour →',
    loading: 'Chargement des statistiques…', error: 'Impossible de charger les données de statistiques.', retry: 'Réessayer',
    disclaimer: '18+ · Les paris sportifs comportent un risque de perte. Aucun résultat futur n\'est garanti. BTTSPredict ne prend pas de paris et ne collecte pas de fonds.',
  }
}

export default function StatistiquesClient({ initialData, archiveSummary }: { initialData: WinHistory | null; archiveSummary: ArchiveSummary | null }) {
  const { lang } = useLanguage()
  const copy = makeCopy(lang)
  const [data, setData] = useState<WinHistory | null>(initialData)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (initialData) return
    fetch('/win-history.json')
      .then(r => { if (!r.ok) throw new Error('HTTP error'); return r.json() })
      .then(d => { if (d?.geminiOnly !== true) throw new Error('Verified history is unavailable'); setData(d) })
      .catch(() => setFailed(true))
  }, [initialData])

  if (failed) {
    return (
      <Shell>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <p className="text-sm text-[#F87171] mb-3">{copy.error}</p>
          <button onClick={() => { setFailed(false); fetch('/win-history.json').then(r => r.json()).then(d => { if (d?.geminiOnly !== true) throw new Error('Verified history is unavailable'); setData(d) }).catch(() => setFailed(true)) }}
            className="mt-4 px-4 py-2 rounded-[10px] text-sm font-bold" style={{ backgroundColor: '#2F7DFF', color: '#FFFFFF' }}>
            {copy.retry}
          </button>
        </div>
      </Shell>
    )
  }

  if (!data || !data.stats) {
    return (
      <Shell>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="inline-block w-10 h-10 border-2 border-[#6B7A8C] border-t-[#2F7DFF] rounded-full animate-spin mb-4" aria-hidden="true" />
          <p className="text-sm text-[var(--text-secondary)]">{copy.loading}</p>
        </div>
      </Shell>
    )
  }

  const { history, trackingPeriod, generatedAt } = data
  const stats = data.pickStats ?? summarizeRecordedPickHistory(history, {
    asOf: generatedAt ? Date.parse(generatedAt) : undefined,
    trackingStart: trackingPeriod.startDate,
  })

  // ── Les compétitions utilisent uniquement les picks enregistrés présents dans le détail (≤500 lignes). ──
  const { withPick: detailPicks } = partitionRecordedPickHistory(history)
  const verifiedDetail = detailPicks.filter(h => (h.status === 'WON' || h.status === 'LOST') && validateRecordedResult(h) === 'verified')
  const byLeagueMap = new Map<string, { won: number; lost: number }>()
  for (const h of verifiedDetail) {
    const lg = h.league || '—'
    const cur = byLeagueMap.get(lg) || { won: 0, lost: 0 }
    if (h.status === 'WON') { cur.won++; byLeagueMap.set(lg, cur) }
    else if (h.status === 'LOST') { cur.lost++; byLeagueMap.set(lg, cur) }
  }
  const leagues = Array.from(byLeagueMap.entries())
    .map(([league, v]) => ({ league, ...v, total: v.won + v.lost, rate: v.won + v.lost > 0 ? +(v.won / (v.won + v.lost) * 100).toFixed(1) : null }))
    .sort((a, b) => b.total - a.total)
  const dailyAll = stats.daily.map(({ date, won, lost }) => ({ date, won, lost }))
  const daily30 = dailyAll.slice(-30)
  const cumulative = dailyAll.reduce<Array<{ date: string; cumWon: number; cumLost: number }>>((acc, d) => {
    const prev = acc[acc.length - 1]
    acc.push({ date: d.date, cumWon: (prev?.cumWon || 0) + d.won, cumLost: (prev?.cumLost || 0) + d.lost })
    return acc
  }, [])
  const tierGold = stats.gold
  const tierStd = stats.standard
  const updatedLabel = new Date(generatedAt).toLocaleString(lang === 'ar' ? 'ar' : lang === 'en' ? 'en-GB' : 'fr-FR', { dateStyle: 'medium', timeStyle: 'short' })

  return (
    <Shell>
      <div className="max-w-5xl mx-auto px-4 py-10">
      {/* En-tête */}
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2F7DFF] mb-2">BTTSPredict · {copy.eyebrow}</p>
        <AnimatedTitle as="h1" text={copy.title} className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'Poppins, sans-serif' }} />
        <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed max-w-3xl">{copy.subtitle}</p>
      </header>

      <ArchiveSummaryCards summary={archiveSummary} lang={lang} />

      {/* Composition of recorded archive outcomes. */}
      {archiveSummary && <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6 mb-8" aria-labelledby="st-composition">
        <h2 id="st-composition" className="text-base font-bold text-[var(--text-primary)] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>{copy.composition}</h2>
        <p className="text-xs text-[var(--text-secondary)] mb-4">{lang === 'fr' ? 'Résultats enregistrés dans les archives.' : lang === 'en' ? 'Results recorded in the archive.' : 'النتائج المسجلة في الأرشيف.'}</p>
        <CompositionBar won={archiveSummary.won} lost={archiveSummary.lost} lang={lang} countKind="recorded"
          labels={{ won: 'WIN', lost: 'LOST' }} />
      </section>}

      {/* Évolution cumulée */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6 mb-8" aria-labelledby="st-evolution">
        <h2 id="st-evolution" className="text-base font-bold text-[var(--text-primary)] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>{copy.evolution}</h2>
        <CumulativeLine points={cumulative} lang={lang} />
      </section>

      {/* Vérifications par jour */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6 mb-8" aria-labelledby="st-daily">
        <h2 id="st-daily" className="text-base font-bold text-[var(--text-primary)] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>{copy.daily}</h2>
        <p className="text-xs text-[var(--text-secondary)] mb-4">{copy.dailyDesc}</p>
        <DailyBars days={daily30} lang={lang} />
      </section>

      {/* Par niveau de sélection */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6 mb-8" aria-labelledby="st-tiers">
        <h2 id="st-tiers" className="text-base font-bold text-[var(--text-primary)] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>{copy.tiers}</h2>
        <div className="space-y-5">
          <RateBar label={lang === 'fr' ? 'Gold (sélection premium)' : lang === 'en' ? 'Gold (premium selection)' : 'Gold (اختيار مميز)'}
            rate={tierGold.won + tierGold.lost > 0 ? Number(((tierGold.won / (tierGold.won + tierGold.lost)) * 100).toFixed(1)) : null}
            won={tierGold.won} lost={tierGold.lost} lang={lang} color="#E8C268" />
          <RateBar label={lang === 'fr' ? 'Standard' : 'Standard'}
            rate={tierStd.won + tierStd.lost > 0 ? Number(((tierStd.won / (tierStd.won + tierStd.lost)) * 100).toFixed(1)) : null}
            won={tierStd.won} lost={tierStd.lost} lang={lang} />
        </div>
      </section>

      {/* Par compétition */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6 mb-8" aria-labelledby="st-leagues">
        <h2 id="st-leagues" className="text-base font-bold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{copy.leagues}</h2>
        {leagues.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)]">—</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                  <th className="text-left py-2 px-2 font-bold">{copy.tableLeague}</th>
                  <th className="text-center py-2 px-2 font-bold">{copy.tableWin}</th>
                  <th className="text-center py-2 px-2 font-bold">{copy.tableLost}</th>
                  <th className="text-center py-2 px-2 font-bold">{copy.tableRate}</th>
                </tr>
              </thead>
              <tbody>
                {leagues.map(l => (
                  <tr key={l.league} className="border-b border-[var(--border)]/50">
                    <td className="py-2.5 px-2 text-[var(--text-primary)] font-medium">{l.league}</td>
                    <td className="py-2.5 px-2 text-center font-mono tracking-win-text" style={{ color: '#34D399' }}>{l.won}</td>
                    <td className="py-2.5 px-2 text-center font-mono" style={{ color: '#F87171' }}>{l.lost}</td>
                    <td className="py-2.5 px-2 text-center font-mono text-[var(--text-primary)]">
                      {l.rate !== null ? `${fmtPct(l.rate.toFixed(1), lang)} %` : '—'}
                      <span className="ml-1 text-xs text-[#6B7A8C]">({l.total})</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Mise à jour + navigation */}
      <p className="text-xs text-[#6B7A8C] mb-8">
        {copy.updated} : {updatedLabel} · {copy.verifiedOn}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        <Link href={lang === 'fr' ? '/methodologie' : `/${lang}/methodologie`} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[rgba(47,125,255,0.6)] transition-colors">
          <div className="text-sm font-bold text-[var(--text-primary)]">{copy.method} →</div>
        </Link>
        <Link href={lang === 'fr' ? '/resultats-verifies' : `/${lang}/resultats-verifies`} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[rgba(47,125,255,0.6)] transition-colors">
          <div className="text-sm font-bold text-[var(--text-primary)]">{copy.results}</div>
        </Link>
        <Link href={lang === 'fr' ? '/btts/predictions/today' : `/${lang}/btts/predictions/today`} className="p-4 rounded-xl font-bold text-sm text-center" style={{ backgroundColor: '#2F7DFF', color: '#FFFFFF' }}>
          {copy.today}
        </Link>
      </div>

      <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'rgba(255, 122, 122, 0.06)', border: '1px solid rgba(255, 122, 122, 0.2)' }}>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{copy.disclaimer}</p>
      </div>
      </div>
    </Shell>
  )
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="content-page stats-page min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
