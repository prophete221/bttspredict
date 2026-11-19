'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/components/bttsbet/LanguageSwitcher'
import AnimatedTitle from '@/components/bttsbet/HeroWordmark'
import ArchiveSummaryCards from '@/components/bttsbet/ArchiveSummaryCards'
import type { ArchiveSummary } from '@/lib/archive-summary'
import { partitionRecordedPickHistory, selectBttsHistory, summarizeRecordedPickHistory } from '@/lib/historyDisplay'
import { validateRecordedResult } from '@/lib/historyDisplay'

interface TrackingPeriod {
  startDate: string
  modelVersion?: string  // Optionnel : ne plus exposer publiquement
  isPublicPeriod: boolean
  disclaimer: string
  insufficientVolume: boolean
}

interface Stats {
  total: number
  won: number
  lost: number
  pending: number
  unverifiable?: number
  archivedTotal: number
  rate: number
  gold: {
    total: number
    won: number
    lost: number
    rate: number
  }
  standard: {
    total: number
    won: number
    lost: number
    rate: number
  }
  byType: {
    btts: { total: number; won: number; lost: number; rate: number }
    over25: { total: number; won: number; lost: number; rate: number }
  }
  trend14: Array<{ date: string; total: number; won: number; lost: number; rate: number }>
  period: { from: string; to: string; days: number }
}

interface HistoryEntry {
  date: string
  match: string
  league: string
  market: string
  prediction?: string
  tier: string
  proba: number
  status: 'WON' | 'LOST' | 'PENDING' | string
  finalScore: string
  verifiedAt: string
  source: string
}

interface HistoryReviewRow {
  date: string
  match: string
  market?: string
  prediction?: string
  provenanceVerified?: boolean
  status?: string
  finalScore?: string
}

export interface WinHistory {
  geminiOnly?: boolean
  generatedAt: string
  trackingPeriod: TrackingPeriod
  stats: Stats
  history: HistoryEntry[]
  historyReviewRows?: HistoryReviewRow[]
  pickStats?: ReturnType<typeof summarizeRecordedPickHistory>
  historyAudit?: {
    archivesRead: number; sourceRows: number; sourceWon: number; sourceLost: number; sourceTotal: number
    sourceNoPick: number; sourceNoPickWon: number; sourceNoPickLost: number
    sourceRecordedPickRows: number; geminiRecordedPickRows: number; nonGeminiOrUnknownSourcePickRows: number; sourceNeedsReviewRows: number
    fullPickRows: number; fullPickWon: number; fullPickLost: number; fullPickUnverifiedRows: number
    detailRows: number; detailSourceRecordedPickRows: number; detailGeminiRows: number; detailRecordedPickRows: number; detailPickRows: number; detailNeedsReviewRows: number; detailNoPick: number
    outsideDetailRows: number; outsideDetailSourceRecordedPickRows: number; outsideDetailGeminiRows: number; outsideDetailRecordedPickRows: number; outsideDetailPickRows: number; outsideDetailNeedsReviewRows: number; outsideDetailNoPick: number; sourceMatchesPublished: boolean
  }
}

export default function HistoriqueClient({ initialData, archiveSummary }: { initialData: WinHistory | null; archiveSummary: ArchiveSummary | null }) {
  const { lang } = useLanguage()
  const copy = lang === 'fr' ? { loading: 'Chargement de l’historique vérifié…', error: 'Erreur de récupération des données', retry: 'Réessayer', newTracking: 'Nouveau suivi public', title: 'Historique vérifié', intro: 'Consultez les résultats officiels des pronostics BTTS publiés.', launch: 'Nouvelle période de suivi publique' } : lang === 'en' ? { loading: 'Loading verified history…', error: 'Unable to retrieve the data', retry: 'Try again', newTracking: 'New public tracking period', title: 'Verified history', intro: 'Browse the official results for published BTTS predictions.', launch: 'New public tracking period' } : { loading: 'جار تحميل السجل الموثق…', error: 'تعذر استرجاع البيانات', retry: 'إعادة المحاولة', newTracking: 'فترة تتبع عامة جديدة', title: 'السجل الموثق', intro: 'اطّلع على النتائج الرسمية لتوقعات BTTS المنشورة.', launch: 'فترة تتبع عامة جديدة' }
  const [data, setData] = useState<WinHistory | null>(initialData)
  const [loading, setLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)

  // Chaînes complémentaires (historiquement codées en dur en FR — corrigé Vague 2)
  const t = lang === 'fr' ? {
    trendTitle: 'Tendance des résultats vérifiés sur 14 jours', tableTitle: 'Historique des pronostics BTTS', methodLink: 'Méthodologie du modèle →',
    thDate: 'Date', thMatch: 'Match', thMarket: 'Marché', thPred: 'Prévision', thScore: 'Score', thResult: 'Résultat',
    rateGlobal: 'Taux global', winShort: 'W', loseShort: 'L', verifiedWord: 'vérifiés', goldRateLabel: 'Taux Gold',
    wonBadge: 'Gagné', lostBadge: 'Perdu', pendingBadge: 'En attente', emptyTable: 'Aucun pronostic vérifié pour le moment.',
    emptyTableHint: (d: string) => `Les pronostics publiés à partir du ${d} seront vérifiés après le résultat officiel des matchs.`,
    verifiedCountLabel: (n: number) => `${n} vérifiés`, todayLink: 'Voir les pronostics du jour →',
  } : lang === 'en' ? {
    trendTitle: '14-day verified-results trend', tableTitle: 'BTTS prediction history', methodLink: 'Model methodology →',
    thDate: 'Date', thMatch: 'Match', thMarket: 'Market', thPred: 'Prediction', thScore: 'Score', thResult: 'Result',
    rateGlobal: 'Overall rate', winShort: 'W', loseShort: 'L', verifiedWord: 'verified', goldRateLabel: 'Gold rate',
    wonBadge: 'Won', lostBadge: 'Lost', pendingBadge: 'Pending', emptyTable: 'No verified prediction yet.',
    emptyTableHint: (d: string) => `Predictions published from ${d} will be verified after the official match result.`,
    verifiedCountLabel: (n: number) => `${n} verified`, todayLink: 'View today’s predictions →',
  } : {
    trendTitle: 'اتجاه 14 يوماً', tableTitle: 'سجل توقعات BTTS', methodLink: 'منهجية النموذج ←',
    thDate: 'التاريخ', thMatch: 'المباراة', thMarket: 'السوق', thPred: 'التوقع', thScore: 'النتيجة', thResult: 'الحالة',
    rateGlobal: 'المعدل الإجمالي', winShort: 'ف', loseShort: 'خ', verifiedWord: 'موثق', goldRateLabel: 'معدل Gold',
    wonBadge: 'فاز', lostBadge: 'خسر', pendingBadge: 'قيد الانتظار', emptyTable: 'لا توجد توقعات موثقة بعد.',
    emptyTableHint: (d: string) => `ستتم موثقة التوقعات المنشورة من ${d} بعد النتيجة الرسمية للمباراة.`,
    verifiedCountLabel: (n: number) => `${n} موثق`, todayLink: 'عرض توقعات اليوم ←',
  }

  useEffect(() => {
    if (initialData) return
    fetch('/win-history.json')
      .then(r => {
        if (!r.ok) throw new Error('Impossible de charger les données')
        return r.json()
      })
      .then(d => { if (d?.geminiOnly !== true) throw new Error('Verified history is unavailable'); setData(d); setLoading(false) })
      .catch((e) => {
        const message = e instanceof Error ? e.message : String(e)
        setError(lang === 'fr' ? message : lang === 'en' ? 'Unable to load the history data. Please try again.' : 'تعذر تحميل بيانات السجل. يرجى المحاولة مجدداً.')
        setLoading(false)
      })
  }, [initialData, lang])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-block w-10 h-10 border-2 border-[#6B7A8C] border-t-[#2F7DFF] rounded-full animate-spin mb-4" aria-hidden="true" />
        <p className="text-sm text-[#9DABBB]">{copy.loading}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-sm text-[#F87171] mb-3">{lang === 'fr' ? 'Erreur de récupération des données' : copy.error}</p>
        <p className="text-xs text-[#9DABBB]">{error}</p>
        <button onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 rounded-[10px] text-sm font-bold"
          style={{ backgroundColor: '#2F7DFF', color: '#FFFFFF' }}>
          {copy.retry}
        </button>
      </div>
    )
  }

  if (!data) return null

  const { trackingPeriod, history } = data
  const stats = data.pickStats ?? summarizeRecordedPickHistory(history, {
    asOf: data.generatedAt ? Date.parse(data.generatedAt) : undefined,
    trackingStart: trackingPeriod.startDate,
  })
  const bttsHistory = selectBttsHistory(history)
  const { withPick: recordedBttsHistory } = partitionRecordedPickHistory(bttsHistory)
  const tableHistory = recordedBttsHistory.filter(row => validateRecordedResult(row) === 'verified').slice(0, 100)
  const insufficient = stats.total < 30
  const trackingNotice = lang === 'fr'
    ? 'Les résultats passés ne garantissent pas les résultats futurs.'
    : lang === 'en'
      ? 'Past results do not guarantee future results.'
      : 'النتائج السابقة لا تضمن النتائج المستقبلية.'
  const responsibleNotice = lang === 'fr'
    ? "18+ · Les paris sportifs comportent un risque de perte. Aucun gain n'est garanti. BTTSPredict ne prend pas de paris et ne collecte pas de fonds. Jouez de manière responsable."
    : lang === 'en'
      ? '18+ · Sports betting involves a risk of loss. No winnings are guaranteed. BTTSPredict does not accept bets or collect funds. Please play responsibly.'
      : '18+ · تنطوي المراهنات الرياضية على مخاطر الخسارة. لا توجد أرباح مضمونة. لا تقبل BTTSPredict الرهانات ولا تجمع الأموال. يرجى اللعب بمسؤولية.'
  const methodologyHref = lang === 'fr' ? '/methodologie' : `/${lang}/methodologie`
  const predictionsHref = lang === 'fr' ? '/btts/predictions/today' : `/${lang}/btts/predictions/today`

  return (
    <>
      {/* Hero section : lancement officiel */}
      <section className="max-w-4xl mx-auto px-4 pt-12 pb-8 sm:pt-16">
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
            style={{ backgroundColor: 'rgba(127, 162, 198, 0.16)', color: '#2F7DFF', border: '1px solid rgba(127, 162, 198, 0.30)' }}>
            {copy.newTracking}
          </span>
          <AnimatedTitle
            as="h1"
            text={copy.title}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          />
          <p className="text-base text-[#9DABBB] leading-relaxed max-w-2xl mx-auto">
            {copy.intro}
          </p>
        </div>

        {/* Disclaimer : période de lancement — version crédible */}
        {insufficient && (
          <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: 'rgba(47, 125, 255, 0.06)', border: '1px solid rgba(47, 125, 255, 0.2)' }}>
            <p className="text-sm text-[#2F7DFF] leading-relaxed mb-2 font-bold">
              {copy.launch}
            </p>
            <p className="text-xs text-[#9DABBB] leading-relaxed">
              {trackingNotice}
            </p>
          </div>
        )}
      </section>

      <ArchiveSummaryCards summary={archiveSummary} lang={lang} />

      {/* Trend 14j — affiché uniquement si volume suffisant */}
      {!insufficient && stats.trend14 && stats.trend14.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 pb-8">
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t.trendTitle}
          </h2>
          <div className="flex items-end gap-1 h-32 p-4 rounded-xl" style={{ backgroundColor: '#141C25', border: '1px solid #223041' }}>
            {stats.trend14.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full" title={`${d.date}: ${d.won} W / ${d.lost} L = ${d.rate}%`}>
                <div className="w-full rounded-t-sm bg-[#2F7DFF]"
                  style={{
                    height: `${Math.min(100, d.rate)}%`,
                    minHeight: '4px',
                  }}
                  aria-hidden="true" />
                <div className="text-xs text-[#6B7A8C] mt-1 hidden sm:block">{d.date.slice(5)}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tableau des pronostics vérifiés */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {t.tableTitle}
        </h2>

        {tableHistory.length === 0 ? (
          <div className="p-6 rounded-xl text-center" style={{ backgroundColor: '#141C25', border: '1px solid #223041' }}>
            <p className="text-sm text-[#9DABBB] mb-2">{t.emptyTable}</p>
            <p className="text-xs text-[#9DABBB]">
              {t.emptyTableHint(trackingPeriod.startDate)}
            </p>
          </div>
        ) : (
          <div className="history-table-wrap overflow-x-auto">
            <table className="history-table w-full text-sm" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #223041' }}>
                  <th className="text-left py-3 px-3 font-bold text-[#9DABBB]">{t.thDate}</th>
                  <th className="text-left py-3 px-3 font-bold text-[#9DABBB]">{t.thMatch}</th>
                  <th className="text-left py-3 px-3 font-bold text-[#9DABBB] hidden sm:table-cell">{t.thMarket}</th>
                  <th className="text-center py-3 px-3 font-bold text-[#9DABBB]">{t.thPred}</th>
                  <th className="text-center py-3 px-3 font-bold text-[#9DABBB]">{t.thScore}</th>
                  <th className="text-center py-3 px-3 font-bold text-[#9DABBB]">{t.thResult}</th>
                </tr>
              </thead>
              <tbody>
                {tableHistory.map((h, i) => {
                  const isWon = h.status === 'WON'
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #223041' }}>
                      <td className="py-2 px-3 text-[#9DABBB] text-xs whitespace-nowrap">{h.date}</td>
                      <td className="py-2 px-3 text-[#F2F6FA]">
                        <div className="font-medium">{h.match}</div>
                        <div className="text-xs text-[#9DABBB] uppercase tracking-wide">{h.league}</div>
                      </td>
                      <td className="py-2 px-3 text-[#9DABBB] hidden sm:table-cell">
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-bold uppercase"
                          style={{
                            backgroundColor: 'rgba(47, 125, 255, 0.12)',
                            color: '#2F7DFF',
                          }}>
                          {h.market === 'btts' ? 'BTTS' : 'Over 2.5'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right text-[#9DABBB]">{h.prediction || '—'}</td>
                      <td className="py-2 px-3 text-center text-[#9DABBB]">{h.finalScore}</td>
                      <td className="py-2 px-3 text-center">
                        {isWon ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold tracking-win-badge"
                            style={{ backgroundColor: 'rgba(52, 211, 153, 0.13)', color: '#34D399' }}>
                            <span className="inline-block w-1.5 h-1.5 rounded-full tracking-win-dot" style={{ backgroundColor: '#34D399' }} aria-hidden="true" />
                            {t.wonBadge}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold"
                            style={{ backgroundColor: 'rgba(248, 113, 113, 0.13)', color: '#F87171' }}>
                            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#F87171' }} aria-hidden="true" />
                            {t.lostBadge}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Liens utiles */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href={methodologyHref} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-bold transition-all"
            style={{ backgroundColor: '#141C25', color: '#9DABBB', border: '1px solid #223041' }}>
            {t.methodLink}
          </Link>
          <Link href={predictionsHref} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-bold transition-all"
            style={{ backgroundColor: '#2F7DFF', color: '#FFFFFF' }}>
            {t.todayLink}
          </Link>
        </div>
      </section>

      {/* 18+ disclaimer */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'rgba(255, 122, 122, 0.06)', border: '1px solid rgba(255, 122, 122, 0.2)' }}>
          <p className="text-xs text-[#9DABBB] leading-relaxed">
            {responsibleNotice}
          </p>
        </div>
      </section>
    </>
  )
}
