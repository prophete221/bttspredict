'use client'

import { useState, useEffect } from 'react'
import { SITE } from '@/lib/constants'

interface Prediction {
  match: string; league: string; date: string; time: string
  type: string; prediction: string; confidence: number
  homeLogo?: string; awayLogo?: string
  analysis?: { bttsProb?: number; over25Prob?: number; homeLambda?: number; awayLambda?: number }
}

function getMatchStatus(date: string, time?: string): 'live' | 'upcoming' | 'finished' {
  if (!date) return 'finished'
  try {
    const today = new Date(); today.setHours(0,0,0,0)
    const d = new Date(date+'T00:00:00'); d.setHours(0,0,0,0)
    if (d < today) return 'finished'
    if (d > today) return 'upcoming'
    if (!time || !/^\d{2}:\d{2}$/.test(time)) return 'upcoming'
    const [h,m] = time.split(':').map(Number)
    const dt = new Date(date+'T00:00:00'); dt.setHours(h,m,0,0)
    const diff = dt.getTime() - Date.now()
    if (diff < 0 && diff > -2.5*3600000) return 'live'
    if (diff < 0) return 'finished'
    return 'upcoming'
  } catch { return 'finished' }
}

export default function FreePredictions() {
  const [matches, setMatches] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'btts' | 'over25'>('all')

  useEffect(() => {
    fetch('/predictions.json').then(r => r.json()).then(data => {
      if (!data?.predictions) return
      const map = new Map<string, Prediction>()
      for (const p of data.predictions) {
        if (getMatchStatus(p.date, p.time) === 'finished') continue
        const key = p.match
        if (!map.has(key)) map.set(key, { ...p, predictions: [p] })
      }
      setMatches([...map.values()].slice(0, 6))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filteredMatches = matches.filter(m => {
    if (filter === 'all') return true
    if (filter === 'btts') return m.type === 'BTTS'
    if (filter === 'over25') return m.type === 'Over 2.5'
    return true
  })

  const getConfidenceColor = (conf: number) => {
    if (conf >= 65) return 'var(--color-success)'
    if (conf >= 50) return 'var(--color-warning)'
    return 'var(--color-danger)'
  }

  const getConfidenceLabel = (conf: number) => {
    if (conf >= 65) return 'high'
    if (conf >= 50) return 'medium'
    return 'low'
  }

  if (loading) {
    return (
      <section id="pronos" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-[var(--color-dark-500)] rounded w-1/3 mb-4"/>
                <div className="h-20 bg-[var(--color-dark-500)] rounded mb-4"/>
                <div className="h-12 bg-[var(--color-dark-500)] rounded"/>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="pronos" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 badge badge-primary mb-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            Pronostics Gratuits
          </div>
          <h2 className="text-display-md text-white mb-3">
            Les meilleurs pronostics du jour
          </h2>
          <p className="text-body-md text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Analysés par notre équipe sur +50 critères. Sans inscription requise.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { key: 'all', label: 'Tous', icon: '🎯' },
            { key: 'btts', label: 'BTTS', icon: '⚽' },
            { key: 'over25', label: 'Over 2.5', icon: '📊' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === tab.key
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-dark-700)] text-[var(--color-text-secondary)] hover:text-white'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Match Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((m, i) => (
            <div 
              key={i} 
              className={`match-card animate-slide-up`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* League Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  {m.league}
                </span>
                <span className="text-xs font-mono text-[var(--color-text-muted)]">
                  {m.time || '--:--'}
                </span>
              </div>

              {/* Teams */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex-1 text-center">
                  {m.homeLogo && (
                    <img src={m.homeLogo} alt={`Logo ${m.homeTeam}`} className="w-12 h-12 object-contain mx-auto mb-2" loading="lazy" />
                  )}
                  <div className="text-sm font-semibold text-white truncate">
                    {m.match.split(' vs ')[0]}
                  </div>
                </div>
                <div className="px-4 text-lg font-bold text-[var(--color-primary-light)]">VS</div>
                <div className="flex-1 text-center">
                  {m.awayLogo && (
                    <img src={m.awayLogo} alt={`Logo ${m.awayTeam}`} className="w-12 h-12 object-contain mx-auto mb-2" loading="lazy" />
                  )}
                  <div className="text-sm font-semibold text-white truncate">
                    {m.match.split(' vs ')[1]}
                  </div>
                </div>
              </div>

              {/* Prediction */}
              <div className="p-4 bg-[var(--color-dark-700)]/50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase">
                    {m.type}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className={`confidence-dot ${getConfidenceLabel(m.confidence)}`}/>
                    <span className="text-xs font-mono font-bold" style={{ color: getConfidenceColor(m.confidence) }}>
                      {m.confidence}%
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold mb-3" style={{ color: m.prediction === 'Oui' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                  {m.prediction === 'Oui' ? '✅ OUI' : '❌ NON'}
                </div>
                <div className="prediction-bar">
                  <div 
                    className="prediction-bar-fill yes" 
                    style={{ width: `${m.confidence}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-[var(--color-text-muted)]">
                  <span>Oui {m.confidence}%</span>
                  <span>Non {100 - m.confidence}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="card-gradient inline-block">
            <p className="text-[var(--color-text-secondary)] mb-4">
              Vous voulez plus de pronostics ? Accédez au contenu VIP exclusif.
            </p>
            <a href="#vip" className="btn btn-vip">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Débloquer les pronostics VIP
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
