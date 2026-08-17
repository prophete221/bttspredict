'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/components/bttsbet/LanguageSwitcher'

type ResultHistoryEntry = {
  date: string
  match: string
  type?: string
  market?: string
  status?: string
  isWon?: boolean
  tier?: string
  prediction?: string
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
  prediction: string
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
}

const COPIES: Record<'fr' | 'en' | 'ar', Copy> = {
  fr: {
    loading: 'Chargement…', verified: 'Vérifiés', allRate: 'Taux global', goldPicks: 'Sélections Gold', verifiedCount: 'vérifiés', premiumSelection: 'Sélection premium', last30: '30 derniers jours', lastScan: 'Dernière vérification', detailed: 'Tableau détaillé (100 derniers)', date: 'Date', match: 'Match', market: 'Marché', prediction: 'Prévision', score: 'Score', result: 'Résultat', empty: 'Aucun résultat vérifié.', marketBreakdown: 'Performance par marché', sample: 'échantillon', noMarketData: 'Pas encore de données suffisantes par marché.', btts: 'BTTS', over: 'Over 2.5', won: 'gagné(s)', lost: 'perdu(s)', source: 'Source : ESPN',
  },
  en: {
    loading: 'Loading…', verified: 'Verified', allRate: 'Overall rate', goldPicks: 'Gold picks', verifiedCount: 'verified', premiumSelection: 'Premium selection', last30: 'Last 30 days', lastScan: 'Last verification', detailed: 'Detailed table (last 100)', date: 'Date', match: 'Match', market: 'Market', prediction: 'Prediction', score: 'Score', result: 'Result', empty: 'No verified result.', marketBreakdown: 'Performance by market', sample: 'sample', noMarketData: 'Not enough market-level data yet.', btts: 'BTTS', over: 'Over 2.5', won: 'won', lost: 'lost', source: 'Source: ESPN',
  },
  ar: {
    loading: 'جار التحميل…', verified: 'موثق', allRate: 'المعدل العام', goldPicks: 'اختيارات Gold', verifiedCount: 'موثق', premiumSelection: 'اختيار مميز', last30: 'آخر 30 يوماً', lastScan: 'آخر تحقق', detailed: 'الجدول التفصيلي (آخر 100)', date: 'التاريخ', match: 'المباراة', market: 'السوق', prediction: 'التوقع', score: 'النتيجة', result: 'الحالة', empty: 'لا توجد نتائج موثقة.', marketBreakdown: 'الأداء حسب السوق', sample: 'عينة', noMarketData: 'لا توجد بيانات كافية حسب السوق بعد.', btts: 'BTTS', over: 'أكثر من 2.5', won: 'فوز', lost: 'خسارة', source: 'المصدر: ESPN',
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

  if (!data || !data.stats) return <div className="text-center py-8 text-[#B4C4CC]">{copy.loading}</div>

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
  const rate30 = (w30 + l30) > 0 ? ((w30 / (w30 + l30)) * 100).toFixed(1) : '—'
  const goldYield = stats.gold?.yield || 0
  const showGoldYield = goldYield > 0

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
    return { ...item, wins, losses, count, rate: count ? ((wins / count) * 100).toFixed(1) : '—' }
  })

  const generatedAt = data.generatedAt ? new Date(data.generatedAt) : null
  const scanLabel = generatedAt && !Number.isNaN(generatedAt.getTime())
    ? `${copy.lastScan}: ${generatedAt.toLocaleString(lang === 'ar' ? 'ar' : lang === 'en' ? 'en-GB' : 'fr-FR', { dateStyle: 'medium', timeStyle: 'short' })} · ${copy.source}`
    : `${copy.lastScan} · ${copy.source}`

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="rounded-[16px] bg-[#0D202D] border border-[#23495C] p-5" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.22)' }}>
          <div className="text-[10px] text-[#B4C4CC] uppercase tracking-widest">{copy.verified}</div>
          <div className="mt-1 flex items-baseline gap-2"><div className="text-3xl font-bold text-[#F3F7F5] font-mono">{total}</div><div className="text-xs text-[#B4C4CC]">{won}W / {lost}L</div></div>
          <div className="mt-2 text-[10px] text-[#B4C4CC]">{copy.allRate}: <span className="text-[#F3F7F5] font-bold">{stats.rate}%</span></div>
        </div>
        <div className="rounded-[16px] bg-[#142D3D] border border-[#E6A24C]/42 p-5" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.22)' }}>
          <div className="text-[10px] text-[#E6A24C] uppercase tracking-widest font-bold">{copy.goldPicks}</div>
          <div className="mt-1 flex items-baseline gap-2"><div className="text-3xl font-bold text-[#F3F7F5] font-mono">{goldRate}%</div><div className="text-xs text-[#B4C4CC]">{goldTotal} {copy.verifiedCount}</div></div>
          <div className="mt-2 text-[10px] text-[#B4C4CC]">{copy.premiumSelection}{showGoldYield && <span className="ml-2 text-[#E6A24C]">Yield +{goldYield}%</span>}</div>
        </div>
        <div className="rounded-[16px] bg-[#0D202D] border border-[#23495C] p-5" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.22)' }}>
          <div className="text-[10px] text-[#B4C4CC] uppercase tracking-widest">{copy.last30}</div>
          <div className="mt-1 flex items-baseline gap-2"><div className="text-3xl font-bold text-[#F3F7F5] font-mono">{rate30}%</div><div className="text-xs text-[#B4C4CC]">{w30}W / {l30}L</div></div>
          <div className="mt-2 text-[10px] text-[#B4C4CC]">{scanLabel}</div>
        </div>
      </div>

      <section className="rounded-[16px] bg-[#0D202D] border border-[#23495C] p-4 mb-6" aria-labelledby="market-breakdown-title">
        <h2 id="market-breakdown-title" className="text-sm font-bold text-[#F3F7F5] mb-3">{copy.marketBreakdown}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {marketStats.map(item => (
            <div key={item.label} className="rounded-xl border border-[#23495C]/60 px-3 py-3">
              <div className="text-xs font-bold text-[#F3F7F5]">{item.label}</div>
              <div className="mt-1 text-xl font-bold text-[#E6A24C]">{item.rate}%</div>
              <div className="text-[10px] text-[#B4C4CC]">{item.wins} {copy.won} · {item.losses} {copy.lost} · {item.count} {copy.sample}</div>
            </div>
          ))}
        </div>
        {marketStats.every(item => item.count === 0) && <p className="text-xs text-[#B4C4CC] mt-3">{copy.noMarketData}</p>}
      </section>

      <div className="rounded-[16px] bg-[#0D202D] border border-[#23495C] p-4">
        <h2 className="text-sm font-bold text-[#F3F7F5] mb-3">{copy.detailed}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]"><thead><tr className="text-[#B4C4CC] border-b border-[#23495C]"><th className="text-left py-2 px-2">{copy.date}</th><th className="text-left py-2 px-2">{copy.match}</th><th className="text-left py-2 px-2">{copy.market}</th><th className="text-center py-2 px-2">{copy.prediction}</th><th className="text-center py-2 px-2">{copy.score}</th><th className="text-center py-2 px-2">{copy.result}</th></tr></thead>
            <tbody>{dedupedHistory.length === 0 ? <tr><td colSpan={6} className="text-center text-[#B4C4CC] py-8">{copy.empty}</td></tr> : dedupedHistory.slice(0, 100).map((h, i) => { const isWon = h.status === 'WON' || h.isWon === true; const isGold = (h.tier || 'STANDARD').toUpperCase() === 'GOLD'; return <tr key={i} className="border-b border-[#23495C]/30"><td className="py-1.5 px-2 text-[#B4C4CC] font-mono">{(h.date || '').slice(5)}</td><td className="py-1.5 px-2 text-[#B4C4CC]">{(h.match || '').substring(0, 35)}</td><td className="py-1.5 px-2 text-[#B4C4CC]">{getMarket(h)}{isGold && <span className="ml-1 text-[10px] text-[#E6A24C] font-bold">GOLD</span>}</td><td className="py-1.5 px-2 text-center text-[#B4C4CC] font-mono">{h.prediction || '—'}</td><td className="py-1.5 px-2 text-center text-[#F3F7F5] font-mono">{h.finalScore || h.score || '-'}</td><td className="py-1.5 px-2 text-center" style={{ color: isWon ? '#E6A24C' : '#E56B6F' }}><strong>{isWon ? 'W' : 'L'}</strong></td></tr> })}</tbody>
          </table>
        </div>
      </div>
    </>
  )
}
