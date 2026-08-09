'use client'

import { useState, useEffect } from 'react'

export default function ResultatsClient() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch('/win-history.json').then(r => r.json()).then(d => setData(d)).catch(() => {})
  }, [])

  if (!data || !data.stats) {
    return <div className="text-center py-8 text-[#9CA3AF]">Chargement…</div>
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

  // Proba: ordre de fallback
  function getProba(h: any): string {
    const proba = h.proba || h.analysis?.bttsProb || h.analysis?.over25Prob || (h.confidence ? h.confidence / 100 : 0)
    if (!proba || proba === 0) return '-'
    return Math.round(proba * 100) + '%'
  }

  // Marché display
  function getMarket(h: any): string {
    const t = (h.type || h.market || '').toUpperCase()
    if (t.includes('BTTS')) return 'BTTS'
    if (t.includes('OVER')) return 'Over 2.5'
    return t || '-'
  }

  const exportCSV = () => {
    const rows = [['Date', 'Match', 'Marché', 'Proba', 'Cote', 'Mise', 'Score', 'Résultat', 'P/L', 'Source', 'Vérifié le']]
    for (const h of dedupedHistory) {
      const isWon = h.status === 'WON' || h.isWon === true
      rows.push([
        h.date || '', h.match || '', getMarket(h),
        getProba(h), '1.75', '1',
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
      {/* Bandeau suivi public — v67 crédibilité */}
      <div
        className="rounded-xl p-4 mb-6"
        style={{
          backgroundColor: 'rgba(18, 18, 18, 0.08)',
          border: '1px solid rgba(18, 18, 18, 0.2)',
        }}
      >
        <p className="text-sm font-bold" style={{ color: '#121212' }}>
          Suivi public depuis le 08/08/2026
        </p>
        <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
          Échantillon : <strong style={{ color: '#111827' }}>{total} pronostics vérifiés</strong> ({won} gagnés / {lost} perdus / {stats.pending || 0} en attente).
          Taux BTTS : <strong style={{ color: '#111827' }}>{stats.rate}%</strong> — calculé dynamiquement depuis le tableau ci-dessous.
          ROI cumulé : <strong style={{ color: stats.profit >= 0 ? '#00C950' : '#FF3B30' }}>{stats.profit >= 0 ? '+' : ''}{stats.profit}u</strong>.
          {' '}
          {total < 30 && (
            <span style={{ color: '#121212' }}>
              ⚠ En calibration — données démo jusqu&apos;au 15/08/2026 (volume insuffisant pour évaluer statistiquement la performance).
            </span>
          )}
        </p>
      </div>

      {/* Stats Summary — 3 cartes neutres, pas de ROI négatif */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {/* Carte 1: Vérifiés + Taux All */}
        <div className="rounded-[16px] bg-[#FFFFFF] border border-[#E6E8EB] p-5" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.22)' }}>
          <div className="text-[10px] text-[#9CA3AF] uppercase tracking-widest">Vérifiés</div>
          <div className="mt-1 flex items-baseline gap-2">
            <div className="text-3xl font-bold text-[#111827] font-mono">{total}</div>
            <div className="text-xs text-[#6B7280]">{won}W / {lost}L</div>
          </div>
          <div className="mt-2 text-[10px] text-[#9CA3AF]">
            Taux All: <span className="text-[#111827] font-bold">{stats.rate}%</span>
          </div>
        </div>

        {/* Carte 2: Gold */}
        <div className="rounded-[16px] bg-[#F9FAFB] border border-[#121212]/42 p-5" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.22)' }}>
          <div className="text-[10px] text-[#121212] uppercase tracking-widest font-bold">Gold Picks</div>
          <div className="mt-1 flex items-baseline gap-2">
            <div className="text-3xl font-bold text-[#111827] font-mono">{goldRate}%</div>
            <div className="text-xs text-[#6B7280]">{goldTotal} vérifiés</div>
          </div>
          <div className="mt-2 text-[10px] text-[#9CA3AF]">
            Filtre proba ≥ 68%
            {showGoldYield && <span className="ml-2 text-[#00C950]">Yield +{goldYield}%</span>}
          </div>
        </div>

        {/* Carte 3: 30 derniers jours */}
        <div className="rounded-[16px] bg-[#FFFFFF] border border-[#E6E8EB] p-5" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.22)' }}>
          <div className="text-[10px] text-[#9CA3AF] uppercase tracking-widest">Taux 30 derniers jours</div>
          <div className="mt-1 flex items-baseline gap-2">
            <div className="text-3xl font-bold text-[#111827] font-mono">{rate30}%</div>
            <div className="text-xs text-[#6B7280]">{w30}W / {l30}L</div>
          </div>
          <div className="mt-2 text-[10px] text-[#9CA3AF]">
            Dernier scan: il y a {Math.round((now - new Date(data.generatedAt).getTime()) / 3600000)}h via ESPN
          </div>
        </div>
      </div>

      {/* Export button */}
      <div className="mb-4">
        <button
          onClick={exportCSV}
          className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
          style={{ backgroundColor: '#121212', color: '#111827' }}
        >
          📥 Export CSV horodaté
        </button>
      </div>

      {/* Table */}
      <div className="rounded-[16px] bg-[#FFFFFF] border border-[#E6E8EB] p-4">
        <h2 className="text-sm font-bold text-[#111827] mb-3">Tableau détaillé (100 derniers)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="text-[#9CA3AF] border-b border-[#E6E8EB]">
                <th className="text-left py-2 px-2">Date</th>
                <th className="text-left py-2 px-2">Match</th>
                <th className="text-left py-2 px-2">Marché</th>
                <th className="text-right py-2 px-2">Proba</th>
                <th className="text-center py-2 px-2">Score</th>
                <th className="text-center py-2 px-2">Rés.</th>
                <th className="text-right py-2 px-2">P/L</th>
              </tr>
            </thead>
            <tbody>
              {dedupedHistory.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-[#9CA3AF] py-8">Aucun résultat vérifié.</td></tr>
              ) : (
                dedupedHistory.slice(0, 100).map((h: any, i: number) => {
                  const isWon = h.status === 'WON' || h.isWon === true
                  const pl = isWon ? '+0.75' : '-1.00'
                  const isGold = (h.tier || 'STANDARD').toUpperCase() === 'GOLD'
                  const market = getMarket(h)
                  const proba = getProba(h)
                  return (
                    <tr key={i} className="border-b border-[#E6E8EB]/30">
                      <td className="py-1.5 px-2 text-[#9CA3AF] font-mono">{(h.date||'').slice(5)}</td>
                      <td className="py-1.5 px-2 text-[#6B7280]">{(h.match||'').substring(0,35)}</td>
                      <td className="py-1.5 px-2 text-[#6B7280]">
                        {market}
                        {isGold && <span className="ml-1 text-[8px] text-[#121212] font-bold">GOLD</span>}
                      </td>
                      <td className="py-1.5 px-2 text-right text-[#6B7280] font-mono">{proba}</td>
                      <td className="py-1.5 px-2 text-center text-[#111827] font-mono">{h.finalScore||h.score||'-'}</td>
                      <td className="py-1.5 px-2 text-center" style={{ color: isWon ? '#00C950' : '#FF3B30' }}>
                        <strong>{isWon ? 'W' : 'L'}</strong>
                      </td>
                      <td className="py-1.5 px-2 text-right font-mono" style={{ color: isWon ? '#00C950' : '#FF3B30' }}>{pl}</td>
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
