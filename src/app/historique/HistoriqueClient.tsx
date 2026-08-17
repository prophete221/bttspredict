'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/components/bttsbet/LanguageSwitcher'

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
  prediction?: string
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
  const { lang } = useLanguage()
  const copy = lang === 'fr' ? { loading: 'Chargement de l’historique vérifié…', error: 'Erreur de récupération des données', retry: 'Réessayer', newTracking: 'Nouveau suivi public', title: 'Historique vérifié', intro: 'BTTSPredict lance une nouvelle période de suivi vérifié. Chaque pronostic publié est enregistré, horodaté et évalué après le résultat officiel du match. Les performances seront publiées progressivement, sans modification rétroactive.', launch: 'Nouvelle période de suivi publique', counters: 'Compteurs en temps réel', published: 'Pronostics publiés', verified: 'Matchs vérifiés', won: 'Gagnés', lost: 'Perdus', pending: 'Résultats en attente', launchDate: 'Date de lancement' } : lang === 'en' ? { loading: 'Loading verified history…', error: 'Unable to retrieve the data', retry: 'Try again', newTracking: 'New public tracking period', title: 'Verified history', intro: 'BTTSPredict is starting a new verified tracking period. Every published prediction is recorded, time-stamped and assessed after the official match result. Performance will be published progressively, without retroactive changes.', launch: 'New public tracking period', counters: 'Real-time counters', published: 'Published predictions', verified: 'Verified matches', won: 'Won', lost: 'Lost', pending: 'Pending results', launchDate: 'Launch date' } : { loading: 'جار تحميل السجل الموثق…', error: 'تعذر استرجاع البيانات', retry: 'إعادة المحاولة', newTracking: 'فترة تتبع عامة جديدة', title: 'السجل الموثق', intro: 'تبدأ BTTSPredict فترة جديدة لتتبع التوقعات الموثقة. يتم تسجيل كل توقع منشور وتأريخه وتقييمه بعد النتيجة الرسمية للمباراة. سيتم نشر الأداء تدريجياً دون تعديلات بأثر رجعي.', launch: 'فترة تتبع عامة جديدة', counters: 'عدادات مباشرة', published: 'التوقعات المنشورة', verified: 'المباريات الموثقة', won: 'فوز', lost: 'خسارة', pending: 'نتائج معلقة', launchDate: 'تاريخ البداية' }
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
        <div className="inline-block w-10 h-10 border-2 border-[#5D7880] border-t-[#B8FF1A] rounded-full animate-spin mb-4" aria-hidden="true" />
        <p className="text-sm text-[#B7C4C1]">{copy.loading}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-sm text-[#FF7B7B] mb-3">Erreur de récupération des données</p>
        <p className="text-xs text-[#B7C4C1]">{error}</p>
        <button onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 rounded-[10px] text-sm font-bold"
          style={{ backgroundColor: '#B8FF1A', color: '#071018' }}>
          {copy.retry}
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
            style={{ backgroundColor: 'rgba(127, 162, 198, 0.16)', color: '#B8FF1A', border: '1px solid rgba(127, 162, 198, 0.30)' }}>
            {copy.newTracking}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {copy.title}
          </h1>
          <p className="text-base text-[#B7C4C1] leading-relaxed max-w-2xl mx-auto">
            {copy.intro}
          </p>
        </div>

        {/* Disclaimer : période de lancement — version crédible */}
        {insufficient && (
          <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: 'rgba(75, 182, 135, 0.06)', border: '1px solid rgba(75, 182, 135, 0.2)' }}>
            <p className="text-sm text-[#B8FF1A] leading-relaxed mb-2 font-bold">
              {copy.launch}
            </p>
            <p className="text-xs text-[#B7C4C1] leading-relaxed">
              Suivi public lancé le {trackingPeriod.startDate}. Chaque pronostic est enregistré, horodaté et vérifié après le résultat officiel du match. Les performances sont publiées progressivement, sans modification rétroactive. Aucun résultat futur n'est garanti.
            </p>
          </div>
        )}
      </section>

      {/* Compteurs réels et dynamiques */}
      <section className="max-w-5xl mx-auto px-4 pb-8">
        <h2 className="text-xl font-bold mb-4 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {copy.counters}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: copy.published, value: stats.archivedTotal },
            { label: copy.verified, value: stats.total },
            { label: copy.won, value: stats.won },
            { label: copy.lost, value: stats.lost },
            { label: copy.pending, value: stats.pending },
            { label: copy.launchDate, value: trackingPeriod.startDate, isText: true },
          ].map((card, i) => (
            <div key={i} className="p-4 rounded-xl text-center"
              style={{ backgroundColor: '#0D1A20', border: '1px solid #5D7880' }}>
              <div className={card.isText ? "text-sm font-bold text-[#B8FF1A] mb-1" : "text-2xl font-bold text-[#F5F8F3] mb-1"}>
                {card.value}
              </div>
              <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#B7C4C1] font-bold">
                {card.label}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-[#B7C4C1] text-center mt-4 leading-relaxed">
          Dernière mise à jour : {new Date(data.generatedAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
          {stats.period.from && ` · Période : ${stats.period.from} → ${stats.period.to || 'en cours'}`}
        </p>
      </section>

      {/* Taux de réussite — affiché uniquement si volume suffisant */}
      {!insufficient && stats.total > 0 && (
        <section className="max-w-5xl mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl" style={{ backgroundColor: '#0D1A20', border: '1px solid #5D7880' }}>
              <div className="text-[11px] uppercase tracking-wider text-[#B7C4C1] font-bold mb-2">Taux global</div>
              <div className="text-3xl font-bold text-[#F5F8F3] mb-1">{stats.rate}%</div>
              <div className="text-xs text-[#B7C4C1]">{stats.won} G · {stats.lost} P · {stats.total} vérifiés</div>
            </div>
            <div className="p-5 rounded-2xl" style={{ backgroundColor: '#0D1A20', border: '1px solid #5D7880' }}>
              <div className="text-[11px] uppercase tracking-wider text-[#B7C4C1] font-bold mb-2">BTTS</div>
              <div className="text-3xl font-bold text-[#B8FF1A] mb-1">{stats.byType.btts.rate}%</div>
              <div className="text-xs text-[#B7C4C1]">{stats.byType.btts.won} G · {stats.byType.btts.lost} P</div>
            </div>
            <div className="p-5 rounded-2xl" style={{ backgroundColor: '#0D1A20', border: '1px solid #5D7880' }}>
              <div className="text-[11px] uppercase tracking-wider text-[#B7C4C1] font-bold mb-2">Over 2.5</div>
              <div className="text-3xl font-bold text-[#B8FF1A] mb-1">{stats.byType.over25.rate}%</div>
              <div className="text-xs text-[#B7C4C1]">{stats.byType.over25.won} G · {stats.byType.over25.lost} P</div>
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
          <div className="flex items-end gap-1 h-32 p-4 rounded-xl" style={{ backgroundColor: '#0D1A20', border: '1px solid #5D7880' }}>
            {stats.trend14.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full" title={`${d.date}: ${d.won}G/${d.lost}P = ${d.rate}%`}>
                <div className="w-full rounded-t-sm"
                  style={{
                    height: `${Math.min(100, d.rate)}%`,
                    backgroundColor: d.rate >= 55 ? '#B8FF1A' : d.rate >= 45 ? '#B8FF1A' : '#FF7B7B',
                    minHeight: '4px',
                  }}
                  aria-hidden="true" />
                <div className="text-[9px] text-[#B7C4C1] mt-1 hidden sm:block">{d.date.slice(5)}</div>
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
          <div className="p-6 rounded-xl text-center" style={{ backgroundColor: '#0D1A20', border: '1px solid #5D7880' }}>
            <p className="text-sm text-[#B7C4C1] mb-2">Aucun pronostic vérifié pour le moment.</p>
            <p className="text-xs text-[#B7C4C1]">
              Les pronostics publiés à partir du {trackingPeriod.startDate} seront vérifiés après le résultat officiel des matchs.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #5D7880' }}>
                  <th className="text-left py-3 px-3 font-bold text-[#B7C4C1]">Date</th>
                  <th className="text-left py-3 px-3 font-bold text-[#B7C4C1]">Match</th>
                  <th className="text-left py-3 px-3 font-bold text-[#B7C4C1] hidden sm:table-cell">Marché</th>
                  <th className="text-center py-3 px-3 font-bold text-[#B7C4C1]">Prévision</th>
                  <th className="text-center py-3 px-3 font-bold text-[#B7C4C1]">Score</th>
                  <th className="text-center py-3 px-3 font-bold text-[#B7C4C1]">Résultat</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 100).map((h, i) => {
                  const isWon = h.status === 'WON'
                  const isLost = h.status === 'LOST'
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #5D7880' }}>
                      <td className="py-2 px-3 text-[#B7C4C1] text-xs whitespace-nowrap">{h.date}</td>
                      <td className="py-2 px-3 text-[#F5F8F3]">
                        <div className="font-medium">{h.match}</div>
                        <div className="text-[10px] text-[#B7C4C1] uppercase tracking-wide">{h.league}</div>
                      </td>
                      <td className="py-2 px-3 text-[#B7C4C1] hidden sm:table-cell">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                          style={{
                            backgroundColor: h.market === 'btts' ? 'rgba(169, 196, 223, 0.15)' : 'rgba(169, 196, 223, 0.15)',
                            color: h.market === 'btts' ? '#B8FF1A' : '#B8FF1A',
                          }}>
                          {h.market === 'btts' ? 'BTTS' : 'Over 2.5'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right text-[#B7C4C1]">{h.prediction || '—'}</td>
                      <td className="py-2 px-3 text-center text-[#B7C4C1]">{h.finalScore}</td>
                      <td className="py-2 px-3 text-center">
                        {isWon ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold"
                            style={{ backgroundColor: 'rgba(168, 224, 99, 0.15)', color: '#B8FF1A' }}>
                            ✓ Gagné
                          </span>
                        ) : isLost ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold"
                            style={{ backgroundColor: 'rgba(255, 122, 122, 0.15)', color: '#FF7B7B' }}>
                            ✗ Perdu
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold"
                            style={{ backgroundColor: 'rgba(165, 171, 197, 0.15)', color: '#B7C4C1' }}>
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
            style={{ backgroundColor: '#0D1A20', color: '#B7C4C1', border: '1px solid #5D7880' }}>
            Méthodologie du modèle →
          </Link>
          <Link href="/btts/predictions/today" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-bold transition-all"
            style={{ backgroundColor: '#B8FF1A', color: '#071018' }}>
            Voir les pronostics du jour →
          </Link>
        </div>
      </section>

      {/* 18+ disclaimer */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'rgba(255, 122, 122, 0.06)', border: '1px solid rgba(255, 122, 122, 0.2)' }}>
          <p className="text-xs text-[#B7C4C1] leading-relaxed">
            18+ · Les paris sportifs comportent un risque de perte. Aucun gain n'est garanti. BTTSPredict ne prend pas de paris et ne collecte pas de fonds. Jouez de manière responsable.
          </p>
        </div>
      </section>
    </>
  )
}
