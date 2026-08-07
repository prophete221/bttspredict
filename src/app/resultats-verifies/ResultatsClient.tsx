'use client'

import { useState, useEffect } from 'react'

export default function ResultatsClient() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch('/win-history.json').then(r => r.json()).then(d => setData(d)).catch(() => {})
  }, [])

  if (!data || !data.stats) {
    return <div className="text-center py-8 text-[#6B7194]">Chargement…</div>
  }

  const stats = data.stats
  const history = data.history || []
  const won = stats.won || 0
  const lost = stats.lost || 0
  const total = won + lost
  const profit = won * 0.75 - lost * 1
  const roi = total > 0 ? ((profit / total) * 100).toFixed(1) : '0'
  const yieldGold = stats.gold?.yield || 0
  const goldRate = stats.gold?.rate || 0

  const exportCSV = () => {
    const rows = [['Date', 'Match', 'Marché', 'Proba', 'Cote', 'Mise', 'Score', 'Résultat', 'P/L', 'Source', 'Vérifié le']]
    for (const h of history) {
      const isWon = h.status === 'WON' || h.isWon === true
      rows.push([
        h.date || '', h.match || '', h.type || '',
        (h.confidence || 0) + '%', '1.75', '1',
        h.finalScore || h.score || '-',
        isWon ? 'W' : 'L',
        isWon ? '+0.75' : '-1.00',
        h.verifiedSource || 'ESPN', h.verifiedAt || '',
      ])
    }
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bttspredict-resultats-${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="rounded-[20px] bg-[#0D1630] border border-[#303861] p-4">
          <div className="text-[10px] text-[#6B7194] uppercase tracking-widest">ROI Global</div>
          <div className="text-2xl font-bold text-[#5DFDCB] font-mono mt-1">{roi}%</div>
          <div className="text-[10px] text-[#6B7194] mt-0.5">Sur {total} vérifiés, cote moy 1.75</div>
        </div>
        <div className="rounded-[20px] bg-[#0D1630] border border-[#303861] p-4">
          <div className="text-[10px] text-[#6B7194] uppercase tracking-widest">Profit</div>
          <div className="text-2xl font-bold text-[#A8E063] font-mono mt-1">{profit >= 0 ? '+' : ''}{profit.toFixed(1)}u</div>
          <div className="text-[10px] text-[#6B7194] mt-0.5">1 unité/prono</div>
        </div>
        <div className="rounded-[20px] bg-[#0D1630] border border-[#303861] p-4">
          <div className="text-[10px] text-[#6B7194] uppercase tracking-widest">Gold Rate</div>
          <div className="text-2xl font-bold text-[#FFC857] font-mono mt-1">{goldRate}%</div>
          <div className="text-[10px] text-[#6B7194] mt-0.5">Yield: {yieldGold}%</div>
        </div>
        <div className="rounded-[20px] bg-[#0D1630] border border-[#303861] p-4">
          <div className="text-[10px] text-[#6B7194] uppercase tracking-widest">Vérifiés</div>
          <div className="text-2xl font-bold text-[#F7F8FF] font-mono mt-1">{total}</div>
          <div className="text-[10px] text-[#6B7194] mt-0.5">{won}W / {lost}L</div>
        </div>
      </div>

      {/* Export button */}
      <div className="mb-4">
        <button
          onClick={exportCSV}
          className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
          style={{ backgroundColor: '#5146F5', color: '#F7F8FF' }}
        >
          📥 Export CSV horodaté
        </button>
      </div>

      {/* Table */}
      <div className="rounded-[20px] bg-[#0D1630] border border-[#303861] p-4">
        <h2 className="text-sm font-bold text-[#F7F8FF] mb-3">Tableau détaillé (100 derniers)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="text-[#6B7194] border-b border-[#303861]">
                <th className="text-left py-2 px-2">Date</th>
                <th className="text-left py-2 px-2">Match</th>
                <th className="text-left py-2 px-2">Marché</th>
                <th className="text-right py-2 px-2">Proba</th>
                <th className="text-right py-2 px-2">Cote</th>
                <th className="text-center py-2 px-2">Score</th>
                <th className="text-center py-2 px-2">Rés.</th>
                <th className="text-right py-2 px-2">P/L</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr><td colSpan={8} className="text-center text-[#6B7194] py-8">Aucun résultat vérifié.</td></tr>
              ) : (
                history.slice(0, 100).map((h: any, i: number) => {
                  const isWon = h.status === 'WON' || h.isWon === true
                  const pl = isWon ? '+0.75' : '-1.00'
                  const isGold = (h.tier || 'STANDARD').toUpperCase() === 'GOLD'
                  return (
                    <tr key={i} className="border-b border-[#303861]/30">
                      <td className="py-1.5 px-2 text-[#6B7194] font-mono">{(h.date||'').slice(5)}</td>
                      <td className="py-1.5 px-2 text-[#A5ABC5]">{(h.match||'').substring(0,35)}</td>
                      <td className="py-1.5 px-2 text-[#A5ABC5]">
                        {h.type || ''}
                        {isGold && <span className="ml-1 text-[8px] text-[#FFC857] font-bold">GOLD</span>}
                      </td>
                      <td className="py-1.5 px-2 text-right text-[#A5ABC5] font-mono">{h.confidence||0}%</td>
                      <td className="py-1.5 px-2 text-right text-[#A5ABC5] font-mono">1.75</td>
                      <td className="py-1.5 px-2 text-center text-[#F7F8FF] font-mono">{h.finalScore||h.score||'-'}</td>
                      <td className="py-1.5 px-2 text-center" style={{ color: isWon ? '#A8E063' : '#FF7185' }}>
                        <strong>{isWon ? 'W' : 'L'}</strong>
                      </td>
                      <td className="py-1.5 px-2 text-right font-mono" style={{ color: isWon ? '#A8E063' : '#FF7185' }}>{pl}</td>
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
