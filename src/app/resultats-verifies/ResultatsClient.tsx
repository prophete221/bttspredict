'use client'

/**
 * /resultats-verifies — résultats vérifiés (Vague 2).
 * Données réelles de win-history.json uniquement ; chaque taux avec son
 * dénominateur ; sémantique stricte WIN (vert) / LOST (rouge) ; texte ≥ 12px.
 */

import { useState, useEffect } from 'react'
import { useLanguage } from '@/components/bttsbet/LanguageSwitcher'
import { fmtPct } from '@/components/bttsbet/SimpleCharts'

type ResultHistoryEntry = {
  date: string
  match: string
  type?: string
  market?: string
  status?: string
  isWon?: boolean
  tier?: string
  proba?: number
  finalScore?: string
  score?: string
}

type Copy = {
  loading: string
  verified: string
  allRate: string
  goldPicks: string
  verifiedCount: string
  premiumSelection: string
  last30: string
  lastScan: string
  detailed: string
  date: string
  match: string
  market: string
  proba: string
  score: string
  result: string
  empty: string
  marketBreakdown: string
  sample: string
  noMarketData: string
  btts: string
  over: string
  won: string
  lost: string
  source: string
  published: string
  scopeOf: string
}

const COPIES: Record<'fr' | 'en' | 'ar', Copy> = {
  fr: {
    loading: 'Chargement…', verified: 'Vérifiés', allRate: 'Taux global', goldPicks: 'Sélections Gold', verifiedCount: 'vérifiés', premiumSelection: 'Sélection premium', last30: '30 derniers jours', lastScan: 'Dernière vérification', detailed: 'Tableau détaillé (100 derniers)', date: 'Date', match: 'Match', market: 'Marché', proba: 'Proba modèle', score: 'Score', result: 'Résultat', empty: 'Aucun résultat vérifié.', marketBreakdown: 'Performance par marché', sample: 'vérifiés', noMarketData: 'Pas encore de données suffisantes par marché.', btts: 'BTTS', over: 'Over 2.5', won: 'WIN', lost: 'LOST', source: 'Source : ESPN', published: 'publiés', scopeOf: 'sur',
  },
  en: {
    loading: 'Loading…', verified: 'Verified', allRate: 'Overall rate', goldPicks: 'Gold picks', verifiedCount: 'verified', premiumSelection: 'Premium selection', last30: 'Last 30 days', lastScan: 'Last verification', detailed: 'Detailed table (last 100)', date: 'Date', match: 'Match', market: 'Market', proba: 'Model proba', score: 'Score', result: 'Result', empty: 'No verified result.', marketBreakdown: 'Performance by market', sample: 'verified', noMarketData: 'Not enough market-level data yet.', btts: 'BTTS', over: 'Over 2.5', won: 'WIN', lost: 'LOST', source: 'Source: ESPN', published: 'published', scopeOf: 'out of',
  },
  ar: {
    loading: 'جار التحميل…', verified: 'موثق', allRate: 'المعدل العام', goldPicks: 'اختيارات Gold', verifiedCount: 'موثق', premiumSelection: 'اختيار مميز', last30: 'آخر 30 يوماً', lastScan: 'آخر تحقق', detailed: 'الجدول التفصيلي (آخر 100)', date: 'التاريخ', match: 'المباراة', market: 'السوق', proba: 'احتمال النموذج', score: 'النتيجة', result: 'الحالة', empty: 'لا توجد نتائج موثقة.', marketBreakdown: 'الأداء حسب السوق', sample: 'موثق', noMarketData: 'لا توجد بيانات كافية حسب السوق بعد.', btts: 'BTTS', over: 'أكثر من 2.5', won: 'فوز', lost: 'خسارة', source: 'المصدر: ESPN', published: 'منشور', scopeOf: 'من أصل',
  },
}

export default function ResultatsClient({ initialData }: { initialData?: any }) {
  const { lang } = useLanguage()
  const copy = COPIES[lang]
  const [data, setData] = useState<any>(initialData || null)

  useEffect(() => {
    if (data) return
    fetch('/win-history.json').then(r => r.json()).then(d => setData(d)).catch(() => {})
  }, [data])

  if (!data || !data.stats) return <div className="text-center py-8 text-sm text-[#9DABBB]">{copy.loading}</div>

  const stats = data.stats
  const history: ResultHistoryEntry[] = data.history || []
  const won = stats.won || 0
  const lost = stats.lost || 0
  const total = won + lost
  const goldRate = stats.gold?.rate || 0
  const goldTotal = stats.gold?.total || 0
  const now = Date.now()
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000
  let w30 = 0, l30 = 0
  for (const h of history) {
    const d = new Date(h.date).getTime()
    if (d >= thirtyDaysAgo) {
      if (h.status === 'WON' || h.isWon === true) w30++
      else if (h.status === 'LOST' || h.isWon === false) l30++
    }
  }
  const rate30 = (w30 + l30) > 0 ? ((w30 / (w30 + l30)) * 100).toFixed(1) : null
  // (2026-09-28) Yield/ROI retirés : ils dépendaient d'une cote fictive 1,90.
  // Aucun chiffre financier ne sera affiché tant que des cotes réelles ne sont pas collectées.

  const seen = new Set<string>()
  const dedupedHistory: ResultHistoryEntry[] = []
  for (const h of history) {
    const key = `${h.date}-${h.match}-${h.type || h.market || ''}`
    if (seen.has(key)) continue
    seen.add(key)
    dedupedHistory.push(h)
  }

  function getMarket(h: ResultHistoryEntry): string {
    const t = (h.type || h.market || '').toUpperCase()
    if (t.includes('BTTS')) return copy.btts
    if (t.includes('OVER')) return copy.over
    return t || '-'
  }

  const marketStats = [
    { label: copy.btts, rows: history.filter(h => (h.type || h.market || '').toUpperCase().includes('BTTS')) },
    { label: copy.over, rows: history.filter(h => (h.type || h.market || '').toUpperCase().includes('OVER')) },
  ].map(item => {
    const wins = item.rows.filter(h => h.status === 'WON' || h.isWon === true).length
    const losses = item.rows.filter(h => h.status === 'LOST' || h.isWon === false).length
    const count = wins + losses
    return { ...item, wins, losses, count, rate: count ? +((wins / count) * 100).toFixed(1) : null }
  })

  const generatedAt = data.generatedAt ? new Date(data.generatedAt) : null
  const scanLabel = generatedAt && !Number.isNaN(generatedAt.getTime())
    ? `${copy.lastScan}: ${generatedAt.toLocaleString(lang === 'ar' ? 'ar' : lang === 'en' ? 'en-GB' : 'fr-FR', { dateStyle: 'medium', timeStyle: 'short' })} · ${copy.source}`
    : `${copy.lastScan} · ${copy.source}`
  const published = stats.archivedTotal || 0
  const trackingFrom = data.trackingPeriod?.startDate || null

  return (
    <>
      {/* Périmètre explicite */}
      <p className="text-xs text-[#9DABBB] leading-relaxed mb-6 max-w-3xl">
        {total} {copy.verified} {copy.scopeOf} {published} {copy.published}
        {trackingFrom && (lang === 'fr' ? ` depuis le ${trackingFrom} (suivi public)` : lang === 'en' ? ` since ${trackingFrom} (public tracking)` : ` منذ ${trackingFrom}`)}
        {published > 0 && published - total > 0 && ` · ${published - total} ${lang === 'fr' ? 'encore en attente de vérification' : lang === 'en' ? 'still pending verification' : 'لا يزال قيد التحقق'}`}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="rounded-[16px] bg-[#141C25] border border-[#223041] p-5" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.22)' }}>
          <div className="text-xs text-[#9DABBB] uppercase tracking-widest font-bold">{copy.verified}</div>
          <div className="mt-1 flex items-baseline gap-2"><div className="text-3xl font-bold text-[#F2F6FA] font-mono">{total}</div><div className="text-xs text-[#9DABBB]">{won} WIN / {lost} LOST</div></div>
          <div className="mt-2 text-xs text-[#9DABBB]">{copy.allRate}: <span className="text-[#F2F6FA] font-bold">{fmtPct(stats.rate?.toFixed(1), lang)} %</span></div>
        </div>
        <div className="rounded-[16px] bg-[#141C25] border border-[#E8C268]/40 p-5" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.22)' }}>
          <div className="text-xs uppercase tracking-widest font-bold" style={{ color: '#E8C268' }}>{copy.goldPicks}</div>
          <div className="mt-1 flex items-baseline gap-2"><div className="text-3xl font-bold text-[#F2F6FA] font-mono">{fmtPct(goldRate?.toFixed(1), lang)} %</div><div className="text-xs text-[#9DABBB]">{goldTotal} {copy.verifiedCount}</div></div>
          <div className="mt-2 text-xs text-[#9DABBB]">{copy.premiumSelection} · {stats.gold?.won || 0} WIN / {stats.gold?.lost || 0} LOST</div>
        </div>
        <div className="rounded-[16px] bg-[#141C25] border border-[#223041] p-5" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.22)' }}>
          <div className="text-xs text-[#9DABBB] uppercase tracking-widest font-bold">{copy.last30}</div>
          <div className="mt-1 flex items-baseline gap-2"><div className="text-3xl font-bold text-[#F2F6FA] font-mono">{rate30 !== null ? `${fmtPct(rate30, lang)} %` : '—'}</div><div className="text-xs text-[#9DABBB]">{w30} WIN / {l30} LOST</div></div>
          <div className="mt-2 text-xs text-[#9DABBB]">{scanLabel}</div>
        </div>
      </div>

      <section className="rounded-[16px] bg-[#141C25] border border-[#223041] p-4 sm:p-5 mb-6" aria-labelledby="market-breakdown-title">
        <h2 id="market-breakdown-title" className="text-sm font-bold text-[#F2F6FA] mb-3">{copy.marketBreakdown}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {marketStats.map(item => (
            <div key={item.label} className="rounded-xl border border-[#223041] bg-[#10161D] px-3 py-3">
              <div className="flex items-baseline justify-between gap-2">
                <div className="text-sm font-bold text-[#F2F6FA]">{item.label}</div>
                <div className="text-lg font-bold text-[#2F7DFF] font-mono">{item.rate !== null ? `${fmtPct(item.rate.toFixed(1), lang)} %` : '—'}</div>
              </div>
              <div className="mt-1 text-xs text-[#9DABBB]">
                {item.wins} WIN · {item.losses} LOST · {item.count} {copy.sample}
                {item.count > 0 && item.count < 30 && (
                  <span className="ml-2 px-1.5 py-0.5 rounded text-[12px]" style={{ backgroundColor: 'rgba(251,191,36,0.12)', color: '#FBBF24' }}>
                    {lang === 'fr' ? 'échantillon faible' : lang === 'en' ? 'small sample' : 'عينة صغيرة'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        {marketStats.every(item => item.count === 0) && <p className="text-xs text-[#9DABBB] mt-3">{copy.noMarketData}</p>}
      </section>

      <div className="rounded-[16px] bg-[#141C25] border border-[#223041] p-4 sm:p-5">
        <h2 className="text-sm font-bold text-[#F2F6FA] mb-3">{copy.detailed}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-[#9DABBB] border-b border-[#223041]">
                <th className="text-left py-2 px-2 font-bold">{copy.date}</th>
                <th className="text-left py-2 px-2 font-bold">{copy.match}</th>
                <th className="text-left py-2 px-2 font-bold">{copy.market}</th>
                <th className="text-center py-2 px-2 font-bold">{copy.proba}</th>
                <th className="text-center py-2 px-2 font-bold">{copy.score}</th>
                <th className="text-center py-2 px-2 font-bold">{copy.result}</th>
              </tr>
            </thead>
            <tbody>
              {dedupedHistory.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-[#9DABBB] py-8">{copy.empty}</td></tr>
              ) : dedupedHistory.slice(0, 100).map((h, i) => {
                const isWon = h.status === 'WON' || h.isWon === true
                const isGold = (h.tier || 'STANDARD').toUpperCase() === 'GOLD'
                const probaPct = typeof h.proba === 'number' && h.proba > 0 ? `${fmtPct((h.proba * 100).toFixed(0), lang)}%` : '—'
                return (
                  <tr key={i} className="border-b border-[#223041]/50">
                    <td className="py-2 px-2 text-[#9DABBB] font-mono whitespace-nowrap">{(h.date || '').slice(5)}</td>
                    <td className="py-2 px-2 text-[#F2F6FA]">{(h.match || '').substring(0, 35)}</td>
                    <td className="py-2 px-2 text-[#9DABBB] whitespace-nowrap">
                      {getMarket(h)}
                      {isGold && <span className="ml-1.5 px-1.5 py-0.5 rounded text-[12px] font-bold" style={{ backgroundColor: 'rgba(232,194,104,0.14)', color: '#E8C268' }}>GOLD</span>}
                    </td>
                    <td className="py-2 px-2 text-center text-[#9DABBB] font-mono">{probaPct}</td>
                    <td className="py-2 px-2 text-center text-[#F2F6FA] font-mono">{h.finalScore || h.score || '-'}</td>
                    <td className="py-2 px-2 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-bold text-xs"
                        style={isWon ? { backgroundColor: 'rgba(52,211,153,0.13)', color: '#34D399' } : { backgroundColor: 'rgba(248,113,113,0.13)', color: '#F87171' }}>
                        <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isWon ? '#34D399' : '#F87171' }} aria-hidden="true" />
                        {isWon ? 'WIN' : 'LOST'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
