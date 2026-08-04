'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

  if (loading) {
    return <div className="grid sm:grid-cols-2 gap-4">{[...Array(4)].map((_,i) => <div key={i} className="h-48 rounded-2xl skeleton" />)}</div>
  }

  return (
    <section id="pronos" className="py-12 px-4 max-w-6xl mx-auto">
      <div className="mb-8">
        <span className="text-[11px] uppercase tracking-widest font-bold text-[var(--color-neon)]">GRATUIT · SANS INSCRIPTION</span>
        <h2 className="text-3xl font-bold text-white mt-2">Pronostics BTTS du jour</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">6 pronostics gratuits complets. Le blocage VIP n'apparaît qu'après la preuve de valeur.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {matches.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="glass rounded-2xl p-4 hover:border-white/12 transition-all"
            style={{ boxShadow: 'var(--shadow-card)' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--color-text-muted)]">{m.league}</span>
              {m.time && <span className="font-mono text-[10px] text-[var(--color-text-muted)]">{m.time}</span>}
            </div>
            {/* Teams */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 mb-4">
              <div className="flex flex-col items-center gap-1.5">
                {m.homeLogo && <img src={m.homeLogo} alt="" className="w-10 h-10 object-contain" loading="lazy" />}
                <span className="text-sm font-semibold text-white text-center truncate">{m.match.split(' vs ')[0]}</span>
              </div>
              <span className="text-lg font-bold text-[var(--color-neon)]">VS</span>
              <div className="flex flex-col items-center gap-1.5">
                {m.awayLogo && <img src={m.awayLogo} alt="" className="w-10 h-10 object-contain" loading="lazy" />}
                <span className="text-sm font-semibold text-white text-center truncate">{m.match.split(' vs ')[1]}</span>
              </div>
            </div>
            {/* Prediction */}
            <div className="rounded-xl p-3" style={{ background: 'var(--color-card)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">{m.type}</span>
                <span className="font-mono text-xs font-bold" style={{ color: 'var(--color-neon)' }}>{m.confidence}%</span>
              </div>
              <div className="text-xl font-bold" style={{ color: m.prediction === 'Oui' ? 'var(--color-neon)' : 'var(--color-text-muted)' }}>
                {m.prediction}
              </div>
              <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full" style={{ width: `${m.confidence}%`, background: 'var(--grad-primary)' }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
