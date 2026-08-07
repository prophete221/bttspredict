'use client'

import { useState, useEffect } from 'react'

/**
 * WinHistory (GOLD v5) — Affiche Gold Picks vs All Picks
 * Stats réelles depuis win-history.json (généré par update-win-history.mjs V5)
 * - Gold = pronos proba≥70% ou proba≥65% + ligues à buts
 * - All = tous pronos vérifiés
 * - Affiche yield Gold, trend 14j
 */
export default function WinHistory() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/win-history.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section id="win-history" className="py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block w-8 h-8 border-2 border-[#5146F5]/30 border-t-[#5146F5] rounded-full animate-spin" />
        </div>
      </section>
    )
  }

  if (!data || !data.stats) {
    return (
      <section id="win-history" className="py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-[#A5ABC5]">Données non disponibles.</p>
        </div>
      </section>
    )
  }

  const stats = data.stats
  const gold = stats.gold || { total: 0, won: 0, lost: 0, rate: 0, yield: 0 }
  const standard = stats.standard || { total: 0, won: 0, lost: 0, rate: 0 }
  const isGoldReady = gold.total >= 30
  const isUpdating = stats.total === 0 && stats.pending > 0

  return (
    <section id="win-history" className="py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F8FF]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Historique & <span className="text-[#5146F5]">Statistiques</span>
          </h2>
          <p className="text-sm text-[#A5ABC5] mt-2">
            Transparence totale — gagnés ET perdus affichés.
          </p>
        </div>

        {/* Bandeau Gold */}
        <div className="rounded-[24px] bg-gradient-to-r from-[#171A38] to-[#1E1A4D] border border-[#5146F5]/30 p-4">
          <p className="text-sm text-[#A5ABC5]">
            <span className="text-[#FFC857] font-bold">🏆 Gold Picks à {gold.rate}%</span> —{' '}
            <span className="text-[#F7F8FF]">{gold.total} Gold vérifiés live</span> • All: {stats.total} vérifiés •{' '}
            Dernier scan: {new Date(data.generatedAt).toLocaleString('fr-FR')}
          </p>
        </div>

        {/* Bandeau "Mise à jour en cours" si tout PENDING */}
        {isUpdating && stats.pending > 100 && (
          <div className="rounded-xl p-4 flex items-start gap-3" style={{ backgroundColor: 'rgba(99, 216, 208, 0.08)', border: '1px solid rgba(99, 216, 208, 0.25)' }}>
            <svg className="flex-shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B9E7FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <div>
              <p className="text-[13px] font-semibold text-[#F7F8FF]">Mise à jour des résultats en cours…</p>
              <p className="text-[11px] text-[#A5ABC5] mt-0.5 leading-relaxed">
                {stats.pending.toLocaleString('fr-FR')} pronostics en attente de vérification via ESPN + TheSportsDB (100% gratuit).
              </p>
            </div>
          </div>
        )}

        {/* KPI Cards: All vs Gold */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* All Picks */}
          <div className="rounded-[24px] bg-[#0D1630] border border-[#303861] p-6">
            <div className="text-xs text-[#A5ABC5] uppercase tracking-widest">Tous les pronos live</div>
            <div className="mt-2 flex items-baseline gap-3">
              <div className="text-4xl font-bold text-white font-mono">
                {isUpdating ? '—' : `${stats.rate}%`}
              </div>
              <div className="text-sm text-[#A5ABC5]">
                {stats.won}W/{stats.lost}L • {stats.total}
              </div>
            </div>
            <div className="mt-3 h-2 bg-[#070B18] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5146F5] rounded-full transition-all duration-800"
                style={{ width: `${isUpdating ? 0 : stats.rate}%` }}
              />
            </div>
            <div className="mt-2 flex gap-4 text-[10px] text-[#6B7194]">
              <span>BTTS: {stats.byType?.btts?.rate ?? 0}%</span>
              <span>O2.5: {stats.byType?.over25?.rate ?? 0}%</span>
              <span>Standard: {standard.rate}%</span>
            </div>
          </div>

          {/* Gold Picks */}
          <div className="rounded-[24px] bg-gradient-to-br from-[#FFC857] to-[#FF8A00] p-6">
            <div className="text-xs text-black/70 uppercase font-bold tracking-widest">Gold Picks • Haute confiance</div>
            {isGoldReady ? (
              <div className="mt-2 flex items-baseline gap-3">
                <div className="text-5xl font-black text-black font-mono">{gold.rate}%</div>
                <div className="text-sm text-black/80 font-semibold">
                  {gold.won}W/{gold.lost}L • {gold.total}
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <div className="text-2xl font-black text-black">Calibration Gold…</div>
                <div className="text-sm text-black/80 mt-1">
                  {gold.won}W/{gold.lost}L sur {gold.total} — besoin de 30+ pour stats fiables
                </div>
              </div>
            )}
            <div className="mt-3 flex gap-2 flex-wrap text-[11px]">
              <span className="bg-black text-[#FFC857] px-2 py-1 rounded-full font-bold">Proba ≥65%</span>
              <span className="bg-black/20 text-black px-2 py-1 rounded-full font-bold">Ligues à buts</span>
              <span className="bg-black/20 text-black px-2 py-1 rounded-full font-bold">Yield {gold.yield ?? 0}%</span>
            </div>
          </div>
        </div>

        {/* Explication */}
        <div className="text-[11px] text-[#6B7194] p-3 bg-[#070B18] rounded-xl leading-relaxed">
          <strong className="text-[#A5ABC5]">Comment on atteint {gold.rate}%:</strong> On filtre les meilleurs pronos
          (proba ≥65% + ligues à +58% BTTS comme Bundesliga, Eredivisie, Championship).
          Sur 100% on fait ~{stats.rate}%, sur le top 15% (Gold) on fait {gold.rate}%.
          Vérifiable match par match ci-dessous.
        </div>

        {/* Trend 14 jours */}
        {stats.trend14 && stats.trend14.length > 0 && (
          <div className="rounded-[24px] bg-[#0D1630] border border-[#303861] p-4">
            <h3 className="text-sm font-bold text-[#F7F8FF] mb-3">Tendance 14 jours</h3>
            <div className="flex items-end gap-1 h-24">
              {stats.trend14.map((d: any, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t transition-all duration-500"
                    style={{
                      height: `${d.rate}%`,
                      backgroundColor: d.rate >= 60 ? '#5DFDCB' : d.rate >= 40 ? '#5146F5' : '#FF7185',
                      minHeight: '4px',
                    }}
                    title={`${d.date}: ${d.rate}% (${d.won}W/${d.lost}L)`}
                  />
                  <span className="text-[8px] text-[#6B7194]">{d.date.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History table */}
        {data.history && data.history.length > 0 && (
          <div className="rounded-[24px] bg-[#0D1630] border border-[#303861] p-4">
            <h3 className="text-sm font-bold text-[#F7F8FF] mb-3">Derniers résultats vérifiés</h3>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {data.history
                .filter((h: any) => h.status === 'WON' || h.status === 'LOST' || h.isWon === true || h.isWon === false)
                .slice(0, 30)
                .map((h: any, i: number) => {
                  const isWon = h.status === 'WON' || h.isWon === true
                  const isGold = (h.tier || 'STANDARD').toUpperCase() === 'GOLD'
                  return (
                    <div key={i} className="flex items-center gap-2 text-[11px] py-1.5 border-b border-[#303861]/30">
                      <span className="text-[#6B7194] font-mono flex-shrink-0">{(h.date || '').slice(5)}</span>
                      <span className="text-[#A5ABC5] truncate flex-1">{h.match}</span>
                      <span className="text-[#6B7194] flex-shrink-0">{h.type}</span>
                      <span className="text-[#F7F8FF] font-mono flex-shrink-0">{h.finalScore || h.score}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold flex-shrink-0 ${
                          isWon ? 'bg-[#A8E063]/15 text-[#A8E063]' : 'bg-[#FF7185]/15 text-[#FF7185]'
                        }`}
                      >
                        {isWon ? 'W' : 'L'}
                      </span>
                      {isGold && (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#FFC857]/15 text-[#FFC857] flex-shrink-0">
                          GOLD
                        </span>
                      )}
                    </div>
                  )
                })}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="text-[10px] text-[#6B7194] text-center pt-2">
          Les performances passées ne garantissent pas les résultats futurs. 18+ — Jeu responsable.
        </div>
      </div>
    </section>
  )
}
