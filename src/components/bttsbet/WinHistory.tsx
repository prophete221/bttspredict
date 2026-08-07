'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

/**
 * WinHistory (V6 — Clean Gold UI)
 * - Si gold.total === 0, on cache complètement la carte Gold
 * - Plus de "Proba ≥65%", "Ligues à buts", "Yield 0%", "Calibration..."
 * - Stats réelles depuis /win-history.json
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
  const gold = stats.gold || { total: 0, won: 0, lost: 0, rate: 0 }
  const hasGold = gold.total >= 1

  return (
    <section id="win-history" className="py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F8FF]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Historique & <span className="text-[#5146F5]">Statistiques</span>
          </h2>
          <p className="text-sm text-[#A5ABC5] mt-2">
            Transparence totale — gagnés ET perdus affichés.
          </p>
        </div>

        {/* Bandeau vérification live */}
        <div className="rounded-[20px] bg-[#171A38] border border-[#303861]/50 p-3 flex items-center gap-2 text-xs text-[#A5ABC5]">
          <span className="w-2 h-2 bg-[#A8E063] rounded-full animate-pulse"></span>
          ✅ Vérification live ESPN • {stats.total} matchs vérifiés • Maj {new Date(data.generatedAt).toLocaleTimeString('fr-FR')}
        </div>

        {/* KPI Cards: All vs Gold */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* All Picks */}
          <div className="rounded-[24px] bg-[#0D1630] border border-[#303861] p-5">
            <div className="text-[10px] text-[#6B7194] uppercase tracking-widest">Tous les pronos live</div>
            <div className="mt-1 flex items-baseline gap-2">
              <div className="text-3xl font-bold text-white font-mono">{stats.rate}%</div>
              <div className="text-xs text-[#A5ABC5]">{stats.won}W/{stats.lost}L • {stats.total}</div>
            </div>
            <div className="mt-3 h-1.5 bg-[#070B18] rounded-full">
              <div className="h-full bg-[#5146F5] rounded-full transition-all duration-700" style={{ width: `${stats.rate}%` }}></div>
            </div>
          </div>

          {/* Gold Picks — caché si gold.total === 0 */}
          {hasGold && (
            <div className="rounded-[24px] bg-gradient-to-br from-[#FFC857] to-[#FF8A00] p-5">
              <div className="text-[10px] text-black/60 uppercase tracking-widest font-bold">Gold Picks • Haute confiance</div>
              <div className="mt-1 flex items-baseline gap-2">
                <div className="text-3xl font-black text-black font-mono">{gold.rate}%</div>
                <div className="text-xs text-black/70 font-semibold">{gold.won}W/{gold.lost}L • {gold.total}</div>
              </div>
              <div className="mt-3 h-1.5 bg-black/20 rounded-full">
                <div className="h-full bg-black rounded-full transition-all duration-700" style={{ width: `${gold.rate}%` }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Lien méthodologie */}
        <div className="text-[11px] text-[#6B7194] px-1">
          <Link href="/methodologie" className="underline hover:text-[#A5ABC5]">Comment on vérifie les résultats?</Link>
          {' • '}Stats vérifiables match par match ci-dessous
        </div>

        {/* Trend 14j */}
        {stats.trend14 && stats.trend14.length > 0 && (
          <div className="rounded-[24px] bg-[#0D1630] border border-[#303861] p-4">
            <h3 className="text-sm font-bold text-[#F7F8FF] mb-3">Tendance 14 jours</h3>
            <div className="flex items-end gap-1 h-24">
              {stats.trend14.map((d: any, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t transition-all duration-500"
                    style={{
                      height: `${Math.max(d.rate, 4)}%`,
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
              {data.history.slice(0, 30).map((h: any, i: number) => {
                const isWon = h.status === 'WON' || h.isWon === true
                const isGold = (h.tier || 'STANDARD').toUpperCase() === 'GOLD'
                return (
                  <div key={i} className="flex items-center gap-2 text-[11px] py-1.5 border-b border-[#303861]/30">
                    <span className="text-[#6B7194] font-mono flex-shrink-0">{(h.date || '').slice(5)}</span>
                    <span className="text-[#A5ABC5] truncate flex-1">{h.match}</span>
                    <span className="text-[#6B7194] flex-shrink-0">{h.type}</span>
                    <span className="text-[#F7F8FF] font-mono flex-shrink-0">{h.finalScore || h.score || '-'}</span>
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
