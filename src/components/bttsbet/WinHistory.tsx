'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

/**
 * WinHistory (V7 — Clean credibility)
 * - No ROI, no Profit, no Cote moy, no Filtre proba displayed
 * - 2 clean cards: All Picks + Gold Picks (or "Phase d'optimisation")
 * - Header: "Historique Vérifié — N matchs vérifiés via ESPN"
 * - Footer: link to /methodologie
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
          <div className="inline-block w-8 h-8 border-2 border-[#10B981]/30 border-t-[#10B981] rounded-full animate-spin" />
        </div>
      </section>
    )
  }

  if (!data || !data.stats) {
    return (
      <section id="win-history" className="py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-[#94A3B8]">Données non disponibles.</p>
        </div>
      </section>
    )
  }

  const stats = data.stats
  const gold = stats.gold || { total: 0, won: 0, lost: 0, rate: 0 }
  const hasGold = gold.total >= 10
  const goldReady = gold.rate >= 55
  const goldBuilding = gold.total > 0 && gold.total < 10
  const majTime = new Date(data.generatedAt).toLocaleTimeString('fr-FR')

  return (
    <section id="win-history" className="py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Historique Vérifié — <span className="text-[#10B981]">{stats.total} matchs vérifiés via ESPN</span>
          </h2>
        </div>

        {/* Bandeau compact */}
        <div className="rounded-[16px] bg-[#142C3E] border border-[#334155]/50 p-3 flex items-center justify-between text-xs text-[#94A3B8]">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse"></span>
            {stats.total} vérifiés
          </span>
          <span className="text-[#94A3B8]">
            ESPN public · Maj {majTime}
          </span>
        </div>

        {/* KPI Cards: All vs Gold */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Carte 1 — All Picks */}
          <div className="rounded-[16px] bg-[#1E293B] border border-[#334155] p-5" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.22)' }}>
            <div className="text-[10px] text-[#94A3B8] uppercase tracking-widest">Tous les pronos</div>
            <div className="mt-1 flex items-baseline gap-2">
              <div className="text-3xl font-bold text-white font-mono">{stats.rate}%</div>
              <div className="text-xs text-[#94A3B8]">{stats.won}W/{stats.lost}L</div>
            </div>
            <div className="mt-2 text-[10px] text-[#94A3B8]">
              {stats.total} vérifiés • Vérifié via ESPN • Maj {majTime}
            </div>
            <div className="mt-3 h-1.5 bg-[#0F172A] rounded-full">
              <div className="h-full bg-[#10B981] rounded-full transition-all duration-700" style={{ width: `${stats.rate}%` }}></div>
            </div>
          </div>

          {/* Carte 2 — Gold Picks */}
          {hasGold && goldReady && (
            <div className="rounded-[16px] bg-[#142C3E] border border-[#10B981]/42 p-5" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.22)' }}>
              <div className="text-[10px] text-[#10B981] uppercase tracking-widest font-bold">Gold Picks</div>
              <div className="mt-1 flex items-baseline gap-2">
                <div className="text-3xl font-bold text-[#F8FAFC] font-mono">{gold.rate}%</div>
                <div className="text-xs text-[#94A3B8]">{gold.won}W/{gold.lost}L</div>
              </div>
              <div className="mt-2 text-[10px] text-[#94A3B8]">
                {gold.total} vérifiés
              </div>
              <div className="mt-3 h-1.5 bg-[#0F172A] rounded-full">
                <div className="h-full bg-[#10B981] rounded-full transition-all duration-700" style={{ width: `${gold.rate}%` }}></div>
              </div>
            </div>
          )}
          {hasGold && !goldReady && (
            <div className="rounded-[16px] bg-[#142C3E] border border-[#334155] p-5" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.22)' }}>
              <div className="text-[10px] text-[#10B981] uppercase tracking-widest font-bold">Gold Picks</div>
              <div className="mt-2 text-sm text-[#94A3B8]">
                {gold.total} vérifiés • Phase d'optimisation — Objectif 60%+
              </div>
            </div>
          )}
          {goldBuilding && (
            <div className="rounded-[16px] bg-[#142C3E] border border-[#334155] p-5">
              <div className="text-[10px] text-[#10B981] uppercase tracking-widest font-bold">Gold Picks</div>
              <div className="mt-2 text-sm text-[#94A3B8]">
                {gold.total} vérifiés • Phase d'optimisation — Objectif 60%+
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-[11px] text-[#94A3B8] px-1">
          Source: ESPN public • Vérifiable match par match ci-dessous •{' '}
          <Link href="/methodologie" className="underline hover:text-[#94A3B8]">Comment on vérifie?</Link>
        </div>

        {/* Trend 14j */}
        {stats.trend14 && stats.trend14.length > 0 && (
          <div className="rounded-[16px] bg-[#1E293B] border border-[#334155] p-4">
            <h3 className="text-sm font-bold text-[#F8FAFC] mb-3">Tendance 14 jours</h3>
            <div className="flex items-end gap-1 h-24">
              {stats.trend14.map((d: any, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t transition-all duration-500"
                    style={{
                      height: `${Math.max(d.rate, 4)}%`,
                      backgroundColor: d.rate >= 55 ? '#3B82F6' : d.rate >= 40 ? '#10B981' : '#EF4444',
                      minHeight: '4px',
                    }}
                    title={`${d.date}: ${d.rate}% (${d.won}W/${d.lost}L)`}
                  />
                  <span className="text-[10px] text-[#94A3B8]">{d.date.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History table */}
        {data.history && data.history.length > 0 && (
          <div className="rounded-[16px] bg-[#1E293B] border border-[#334155] p-4">
            <h3 className="text-sm font-bold text-[#F8FAFC] mb-3">Derniers résultats vérifiés</h3>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {data.history.slice(0, 30).map((h: any, i: number) => {
                const isWon = h.status === 'WON' || h.isWon === true
                const isGold = (h.tier || 'STANDARD').toUpperCase() === 'GOLD'
                const market = (h.type || h.market || '').includes('Over') ? 'O2.5' : (h.type || h.market || 'BTTS')
                return (
                  <div key={i} className="flex items-center gap-2 text-[11px] py-1.5 border-b border-[#334155]/30">
                    <span className="text-[#94A3B8] font-mono flex-shrink-0">{(h.date || '').slice(5)}</span>
                    <span className="text-[#94A3B8] truncate flex-1">{h.match}</span>
                    <span className="text-[#94A3B8] flex-shrink-0">{market}</span>
                    <span className="text-[#F8FAFC] font-mono flex-shrink-0">{h.finalScore || h.score || '-'}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold flex-shrink-0 ${
                        isWon ? 'bg-[#3B82F6]/14 text-[#3B82F6]' : 'bg-[#EF4444]/14 text-[#EF4444]'
                      }`}
                    >
                      {isWon ? 'W' : 'L'}
                    </span>
                    {isGold && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/14 text-[#10B981] flex-shrink-0">
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
        <div className="text-[10px] text-[#94A3B8] text-center pt-2">
          Les performances passées ne garantissent pas les résultats futurs. 18+ — Jeu responsable.
        </div>
      </div>
    </section>
  )
}
