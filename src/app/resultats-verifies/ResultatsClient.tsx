'use client'

import { useState, useEffect } from 'react'

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

export default function ResultatsClient({ initialData }: { initialData?: any }) {
  const [data, setData] = useState<any>(initialData || null)

  // Fallback: try client-side fetch if no initial data (e.g. during dev)
  useEffect(() => {
    if (data) return
    fetch('/win-history.json').then(r => r.json()).then(d => setData(d)).catch(() => {})
  }, [data])

  if (!data || !data.stats) {
    return <div className="text-center py-8 text-[#B7C4C1]">Chargement…</div>
  }

  const stats = data.stats
  const history: ResultHistoryEntry[] = data.history || []
  const won = stats.won || 0
  const lost = stats.lost || 0
  const total = won + lost
  const goldRate = stats.gold?.rate || 0
  const goldTotal = stats.gold?.total || 0

  // Trend 30j: calculer depuis history (30 derniers jours)
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

  // Gold yield: ne l'afficher que si > 0
  const goldYield = stats.gold?.yield || 0
  const showGoldYield = goldYield > 0

  // Déduplication: clé date-match-type, garde les 2 lignes BTTS+Over mais avec Marché visible
  const seen = new Set()
  const dedupedHistory: ResultHistoryEntry[] = []
  for (const h of history) {
    const key = `${h.date}-${h.match}-${h.type || h.market || ''}`
    if (seen.has(key)) continue
    seen.add(key)
    dedupedHistory.push(h)
  }

  // Marché display
  function getMarket(h: any): string {
    const t = (h.type || h.market || '').toUpperCase()
    if (t.includes('BTTS')) return 'BTTS'
    if (t.includes('OVER')) return 'Over 2.5'
    return t || '-'
  }

  return (
    <>
      {/* Stats Summary — 3 cartes neutres, pas de ROI négatif */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {/* Carte 1: Vérifiés + Taux All */}
        <div className="rounded-[16px] bg-[#0D1A20] border border-[#5D7880] p-5" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.22)' }}>
          <div className="text-[10px] text-[#B7C4C1] uppercase tracking-widest">Vérifiés</div>
          <div className="mt-1 flex items-baseline gap-2">
            <div className="text-3xl font-bold text-[#F5F8F3] font-mono">{total}</div>
            <div className="text-xs text-[#B7C4C1]">{won}W / {lost}L</div>
          </div>
          <div className="mt-2 text-[10px] text-[#B7C4C1]">
            Taux All: <span className="text-[#F5F8F3] font-bold">{stats.rate}%</span>
          </div>
        </div>

        {/* Carte 2: Gold */}
        <div className="rounded-[16px] bg-[#11242B] border border-[#B8FF1A]/42 p-5" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.22)' }}>
          <div className="text-[10px] text-[#B8FF1A] uppercase tracking-widest font-bold">Gold Picks</div>
          <div className="mt-1 flex items-baseline gap-2">
            <div className="text-3xl font-bold text-[#F5F8F3] font-mono">{goldRate}%</div>
            <div className="text-xs text-[#B7C4C1]">{goldTotal} vérifiés</div>
          </div>
          <div className="mt-2 text-[10px] text-[#B7C4C1]">
            Sélection premium
            {showGoldYield && <span className="ml-2 text-[#B8FF1A]">Yield +{goldYield}%</span>}
          </div>
        </div>

        {/* Carte 3: 30 derniers jours */}
        <div className="rounded-[16px] bg-[#0D1A20] border border-[#5D7880] p-5" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.22)' }}>
          <div className="text-[10px] text-[#B7C4C1] uppercase tracking-widest">Taux 30 derniers jours</div>
          <div className="mt-1 flex items-baseline gap-2">
            <div className="text-3xl font-bold text-[#F5F8F3] font-mono">{rate30}%</div>
            <div className="text-xs text-[#B7C4C1]">{w30}W / {l30}L</div>
          </div>
          <div className="mt-2 text-[10px] text-[#B7C4C1]">
            Dernier scan: il y a {Math.round((now - new Date(data.generatedAt).getTime()) / 3600000)}h via ESPN
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[16px] bg-[#0D1A20] border border-[#5D7880] p-4">
        <h2 className="text-sm font-bold text-[#F5F8F3] mb-3">Tableau détaillé (100 derniers)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="text-[#B7C4C1] border-b border-[#5D7880]">
                <th className="text-left py-2 px-2">Date</th>
                <th className="text-left py-2 px-2">Match</th>
                <th className="text-left py-2 px-2">Marché</th>
                <th className="text-center py-2 px-2">Prévision</th>
                <th className="text-center py-2 px-2">Score</th>
                <th className="text-center py-2 px-2">Rés.</th>
              </tr>
            </thead>
            <tbody>
              {dedupedHistory.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-[#B7C4C1] py-8">Aucun résultat vérifié.</td></tr>
              ) : (
                dedupedHistory.slice(0, 100).map((h, i: number) => {
                  const isWon = h.status === 'WON' || h.isWon === true
                  const isGold = (h.tier || 'STANDARD').toUpperCase() === 'GOLD'
                  const market = getMarket(h)
                  return (
                    <tr key={i} className="border-b border-[#5D7880]/30">
                      <td className="py-1.5 px-2 text-[#B7C4C1] font-mono">{(h.date||'').slice(5)}</td>
                      <td className="py-1.5 px-2 text-[#B7C4C1]">{(h.match||'').substring(0,35)}</td>
                      <td className="py-1.5 px-2 text-[#B7C4C1]">
                        {market}
                        {isGold && <span className="ml-1 text-[10px] text-[#B8FF1A] font-bold">GOLD</span>}
                      </td>
                      <td className="py-1.5 px-2 text-center text-[#B7C4C1] font-mono">{h.prediction || '—'}</td>
                      <td className="py-1.5 px-2 text-center text-[#F5F8F3] font-mono">{h.finalScore||h.score||'-'}</td>
                      <td className="py-1.5 px-2 text-center" style={{ color: isWon ? '#B8FF1A' : '#FF7B7B' }}>
                        <strong>{isWon ? 'W' : 'L'}</strong>
                      </td>

                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
