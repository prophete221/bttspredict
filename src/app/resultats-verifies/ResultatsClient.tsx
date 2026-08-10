'use client'

import { useState, useEffect } from 'react'

export default function ResultatsClient() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch('/win-history.json').then(r => r.json()).then(d => setData(d)).catch(() => {})
  }, [])

  if (!data || !data.stats) {
    return <div className="text-center py-8 text-[#7F969E]">Chargement…</div>
  }

  const stats = data.stats
  const history = data.history || []
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
  const dedupedHistory = []
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
        <div className="rounded-[16px] bg-[#102333] border border-[#1C3546] p-5" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.22)' }}>
          <div className="text-[10px] text-[#7F969E] uppercase tracking-widest">Vérifiés</div>
          <div className="mt-1 flex items-baseline gap-2">
            <div className="text-3xl font-bold text-[#F2F7F5] font-mono">{total}</div>
            <div className="text-xs text-[#B5C4C9]">{won}W / {lost}L</div>
          </div>
          <div className="mt-2 text-[10px] text-[#7F969E]">
            Taux All: <span className="text-[#F2F7F5] font-bold">{stats.rate}%</span>
          </div>
        </div>

        {/* Carte 2: Gold */}
        <div className="rounded-[16px] bg-[#142C3E] border border-[#C7F464]/42 p-5" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.22)' }}>
          <div className="text-[10px] text-[#C7F464] uppercase tracking-widest font-bold">Gold Picks</div>
          <div className="mt-1 flex items-baseline gap-2">
            <div className="text-3xl font-bold text-[#F2F7F5] font-mono">{goldRate}%</div>
            <div className="text-xs text-[#B5C4C9]">{goldTotal} vérifiés</div>
          </div>
          <div className="mt-2 text-[10px] text-[#7F969E]">
            Sélection premium
            {showGoldYield && <span className="ml-2 text-[#63D6FF]">Yield +{goldYield}%</span>}
          </div>
        </div>

        {/* Carte 3: 30 derniers jours */}
        <div className="rounded-[16px] bg-[#102333] border border-[#1C3546] p-5" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.22)' }}>
          <div className="text-[10px] text-[#7F969E] uppercase tracking-widest">Taux 30 derniers jours</div>
          <div className="mt-1 flex items-baseline gap-2">
            <div className="text-3xl font-bold text-[#F2F7F5] font-mono">{rate30}%</div>
            <div className="text-xs text-[#B5C4C9]">{w30}W / {l30}L</div>
          </div>
          <div className="mt-2 text-[10px] text-[#7F969E]">
            Dernier scan: il y a {Math.round((now - new Date(data.generatedAt).getTime()) / 3600000)}h via ESPN
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[16px] bg-[#102333] border border-[#1C3546] p-4">
        <h2 className="text-sm font-bold text-[#F2F7F5] mb-3">Tableau détaillé (100 derniers)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="text-[#7F969E] border-b border-[#1C3546]">
                <th className="text-left py-2 px-2">Date</th>
                <th className="text-left py-2 px-2">Match</th>
                <th className="text-left py-2 px-2">Marché</th>
                <th className="text-center py-2 px-2">Prévision</th>
                <th className="text-center py-2 px-2">Score</th>
                <th className="text-center py-2 px-2">Rés.</th>
                <th className="text-right py-2 px-2">P/L</th>
              </tr>
            </thead>
            <tbody>
              {dedupedHistory.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-[#7F969E] py-8">Aucun résultat vérifié.</td></tr>
              ) : (
                dedupedHistory.slice(0, 100).map((h: any, i: number) => {
                  const isWon = h.status === 'WON' || h.isWon === true
                  const pl = isWon ? '+0.75' : '-1.00'
                  const isGold = (h.tier || 'STANDARD').toUpperCase() === 'GOLD'
                  const market = getMarket(h)
                  return (
                    <tr key={i} className="border-b border-[#1C3546]/30">
                      <td className="py-1.5 px-2 text-[#7F969E] font-mono">{(h.date||'').slice(5)}</td>
                      <td className="py-1.5 px-2 text-[#B5C4C9]">{(h.match||'').substring(0,35)}</td>
                      <td className="py-1.5 px-2 text-[#B5C4C9]">
                        {market}
                        {isGold && <span className="ml-1 text-[10px] text-[#C7F464] font-bold">GOLD</span>}
                      </td>
                      <td className="py-1.5 px-2 text-center text-[#B5C4C9] font-mono">{h.prediction || '—'}</td>
                      <td className="py-1.5 px-2 text-center text-[#F2F7F5] font-mono">{h.finalScore||h.score||'-'}</td>
                      <td className="py-1.5 px-2 text-center" style={{ color: isWon ? '#63D6FF' : '#FF7A7A' }}>
                        <strong>{isWon ? 'W' : 'L'}</strong>
                      </td>
                      <td className="py-1.5 px-2 text-right font-mono" style={{ color: isWon ? '#63D6FF' : '#FF7A7A' }}>{pl}</td>
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
