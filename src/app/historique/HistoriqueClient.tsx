'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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
  archivedTotal: number
  rate: number
  avgOdds: number
  profit: number
  roi: number
  yield: number
  gold: {
    total: number
    won: number
    lost: number
    rate: number
    roi: number
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
  trend14: Array<{ date: string; total: number; won: number; lost: number; rate: number; equity: number }>
  period: { from: string; to: string; days: number }
}

interface HistoryEntry {
  date: string
  match: string
  league: string
  market: string
  tier: string
  proba: number
  status: 'WON' | 'LOST' | 'PENDING' | string
  finalScore: string
  verifiedAt: string
  source: string
}

interface WinHistory {
  generatedAt: string
  trackingPeriod: TrackingPeriod
  stats: Stats
  history: HistoryEntry[]
}

export default function HistoriqueClient() {
  const [data, setData] = useState<WinHistory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/win-history.json')
      .then(r => {
        if (!r.ok) throw new Error('Impossible de charger les données')
        return r.json()
      })
      .then(d => { setData(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-block w-10 h-10 border-2 border-[#2d2f31] border-t-[#22c55e] rounded-full animate-spin mb-4" aria-hidden="true" />
        <p className="text-sm text-[#9ca3af]">Chargement de l'historique vérifié…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-sm text-[#FF7185] mb-3">Erreur de récupération des données</p>
        <p className="text-xs text-[#9ca3af]">{error}</p>
        <button onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 rounded-[10px] text-sm font-bold"
          style={{ backgroundColor: '#22c55e', color: '#131314' }}>
          Réessayer
        </button>
      </div>
    )
  }

  if (!data) return null

  const { trackingPeriod, stats, history } = data
  const insufficient = trackingPeriod.insufficientVolume || stats.total < 30

  return (
    <>
      {/* Hero section : lancement officiel */}
      <section className="max-w-4xl mx-auto px-4 pt-12 pb-8 sm:pt-16">
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
            style={{ backgroundColor: 'rgba(199, 244, 100, 0.12)', color: '#22c55e', border: '1px solid rgba(199, 244, 100, 0.25)' }}>
            Nouveau suivi public
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Historique vérifié
          </h1>
          <p className="text-base text-[#9ca3af] leading-relaxed max-w-2xl mx-auto">
            BTTSPredict lance une nouvelle période de suivi vérifié. Chaque pronostic publié est enregistré, horodaté et évalué après le résultat officiel du match. Les performances seront publiées progressivement, sans modification rétroactive.
          </p>
        </div>

        {/* Disclaimer : période de lancement — version crédible */}
        {insufficient && (
          <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: 'rgba(199, 244, 100, 0.06)', border: '1px solid rgba(199, 244, 100, 0.2)' }}>
            <p className="text-sm text-[#22c55e] leading-relaxed mb-2 font-bold">
              Nouvelle période de suivi publique
            </p>
            <p className="text-xs text-[#9ca3af] leading-relaxed">
              Suivi public lancé le {trackingPeriod.startDate}. Chaque pronostic est enregistré, horodaté et vérifié après le résultat officiel du match. Les performances sont publiées progressivement, sans modification rétroactive. Aucun résultat futur n'est garanti.
            </p>
          </div>
        )}
      </section>

      {/* Compteurs réels et dynamiques */}
      <section className="max-w-5xl mx-auto px-4 pb-8">
        <h2 className="text-xl font-bold mb-4 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Compteurs en temps réel
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Pronostics publiés', value: stats.archivedTotal },
            { label: 'Matchs vérifiés', value: stats.total },
            { label: 'Gagnés', value: stats.won },
            { label: 'Perdus', value: stats.lost },
            { label: 'Résultats en attente', value: stats.pending },
            { label: 'Date de lancement', value: trackingPeriod.startDate, isText: true },
          ].map((card, i) => (
            <div key={i} className="p-4 rounded-xl text-center"
              style={{ backgroundColor: '#1e1f20', border: '1px solid #2d2f31' }}>
              <div className={card.isText ? "text-sm font-bold text-[#06b6d4] mb-1" : "text-2xl font-bold text-[#f0f4f9] mb-1"}>
                {card.value}
              </div>
              <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#9ca3af] font-bold">
                {card.label}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-[#9ca3af] text-center mt-4 leading-relaxed">
          Dernière mise à jour : {new Date(data.generatedAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
          {stats.period.from && ` · Période : ${stats.period.from} → ${stats.period.to || 'en cours'}`}
        </p>
      </section>

      {/* Taux de réussite — affiché uniquement si volume suffisant */}
      {!insufficient && stats.total > 0 && (
        <section className="max-w-5xl mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl" style={{ backgroundColor: '#1e1f20', border: '1px solid #2d2f31' }}>
              <div className="text-[11px] uppercase tracking-wider text-[#9ca3af] font-bold mb-2">Taux global</div>
              <div className="text-3xl font-bold text-[#f0f4f9] mb-1">{stats.rate}%</div>
              <div className="text-xs text-[#9ca3af]">{stats.won} G · {stats.lost} P · {stats.total} vérifiés</div>
            </div>
            <div className="p-5 rounded-2xl" style={{ backgroundColor: '#1e1f20', border: '1px solid #2d2f31' }}>
              <div className="text-[11px] uppercase tracking-wider text-[#9ca3af] font-bold mb-2">BTTS</div>
              <div className="text-3xl font-bold text-[#06b6d4] mb-1">{stats.byType.btts.rate}%</div>
              <div className="text-xs text-[#9ca3af]">{stats.byType.btts.won} G · {stats.byType.btts.lost} P</div>
            </div>
            <div className="p-5 rounded-2xl" style={{ backgroundColor: '#1e1f20', border: '1px solid #2d2f31' }}>
              <div className="text-[11px] uppercase tracking-wider text-[#9ca3af] font-bold mb-2">Over 2.5</div>
              <div className="text-3xl font-bold text-[#06b6d4] mb-1">{stats.byType.over25.rate}%</div>
              <div className="text-xs text-[#9ca3af]">{stats.byType.over25.won} G · {stats.byType.over25.lost} P</div>
            </div>
          </div>
        </section>
      )}

      {/* Trend 14j — affiché uniquement si volume suffisant */}
      {!insufficient && stats.trend14 && stats.trend14.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 pb-8">
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Tendance 14 jours
          </h2>
          <div className="flex items-end gap-1 h-32 p-4 rounded-xl" style={{ backgroundColor: '#1e1f20', border: '1px solid #2d2f31' }}>
            {stats.trend14.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full" title={`${d.date}: ${d.won}G/${d.lost}P = ${d.rate}%`}>
                <div className="w-full rounded-t-sm"
                  style={{
                    height: `${Math.min(100, d.rate)}%`,
                    backgroundColor: d.rate >= 55 ? '#22c55e' : d.rate >= 45 ? '#22c55e' : '#FF7185',
                    minHeight: '4px',
                  }}
                  aria-hidden="true" />
                <div className="text-[9px] text-[#9ca3af] mt-1 hidden sm:block">{d.date.slice(5)}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tableau des pronostics vérifiés */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Pronostics vérifiés du nouveau suivi
        </h2>

        {history.length === 0 ? (
          <div className="p-6 rounded-xl text-center" style={{ backgroundColor: '#1e1f20', border: '1px solid #2d2f31' }}>
            <p className="text-sm text-[#9ca3af] mb-2">Aucun pronostic vérifié pour le moment.</p>
            <p className="text-xs text-[#9ca3af]">
              Les pronostics publiés à partir du {trackingPeriod.startDate} seront vérifiés après le résultat officiel des matchs.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #2d2f31' }}>
                  <th className="text-left py-3 px-3 font-bold text-[#9ca3af]">Date</th>
                  <th className="text-left py-3 px-3 font-bold text-[#9ca3af]">Match</th>
                  <th className="text-left py-3 px-3 font-bold text-[#9ca3af] hidden sm:table-cell">Marché</th>
                  <th className="text-center py-3 px-3 font-bold text-[#9ca3af]">Prévision</th>
                  <th className="text-center py-3 px-3 font-bold text-[#9ca3af]">Score</th>
                  <th className="text-center py-3 px-3 font-bold text-[#9ca3af]">Résultat</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 100).map((h, i) => {
                  const isWon = h.status === 'WON'
                  const isLost = h.status === 'LOST'
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #2d2f31' }}>
                      <td className="py-2 px-3 text-[#9ca3af] text-xs whitespace-nowrap">{h.date}</td>
                      <td className="py-2 px-3 text-[#f0f4f9]">
                        <div className="font-medium">{h.match}</div>
                        <div className="text-[10px] text-[#9ca3af] uppercase tracking-wide">{h.league}</div>
                      </td>
                      <td className="py-2 px-3 text-[#9ca3af] hidden sm:table-cell">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                          style={{
                            backgroundColor: h.market === 'btts' ? 'rgba(99, 214, 255, 0.15)' : 'rgba(99, 214, 255, 0.15)',
                            color: h.market === 'btts' ? '#06b6d4' : '#06b6d4',
                          }}>
                          {h.market === 'btts' ? 'BTTS' : 'Over 2.5'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right text-[#9ca3af]">{h.prediction || '—'}</td>
                      <td className="py-2 px-3 text-center text-[#9ca3af]">{h.finalScore}</td>
                      <td className="py-2 px-3 text-center">
                        {isWon ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold"
                            style={{ backgroundColor: 'rgba(168, 224, 99, 0.15)', color: '#22c55e' }}>
                            ✓ Gagné
                          </span>
                        ) : isLost ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold"
                            style={{ backgroundColor: 'rgba(255, 122, 122, 0.15)', color: '#FF7185' }}>
                            ✗ Perdu
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold"
                            style={{ backgroundColor: 'rgba(165, 171, 197, 0.15)', color: '#9ca3af' }}>
                            ⏳ En attente
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
          <Link href="/methodologie" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-bold transition-all"
            style={{ backgroundColor: '#1e1f20', color: '#9ca3af', border: '1px solid #2d2f31' }}>
            Méthodologie du modèle →
          </Link>
          <Link href="/pronostics" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-bold transition-all"
            style={{ backgroundColor: '#22c55e', color: '#131314' }}>
            Voir les pronostics du jour →
          </Link>
        </div>
      </section>

      {/* 18+ disclaimer */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'rgba(255, 122, 122, 0.06)', border: '1px solid rgba(255, 122, 122, 0.2)' }}>
          <p className="text-xs text-[#9ca3af] leading-relaxed">
            18+ · Les paris sportifs comportent un risque de perte. Aucun gain n'est garanti. BTTSPredict ne prend pas de paris et ne collecte pas de fonds. Jouez de manière responsable.
          </p>
        </div>
      </section>
    </>
  )
}
