'use client'

import { useState, useEffect } from 'react'
import { AFFILIATE } from '@/lib/constants'

interface Prediction {
  match: string
  league: string
  date: string
  time?: string
  type: string
  prediction: string
  confidence: number
  homeLogo?: string
  awayLogo?: string
  homeTeam?: string
  awayTeam?: string
}

/**
 * FreePredictionsWidget — Version compacte des pronostics gratuits
 * À insérer en bas de chaque page du site
 */
export default function FreePredictionsWidget() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/predictions.json')
      .then(r => r.json())
      .then(data => {
        const preds = data.predictions || []
        const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' })
        const todayPreds = preds.filter((p: Prediction) => p.date === today).slice(0, 4)
        setPredictions(todayPreds.length > 0 ? todayPreds : preds.slice(0, 4))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="inline-block w-6 h-6 border-2 border-emerald/30 border-t-emerald rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <section id="free-predictions-widget" className="py-6 px-4" style={{ backgroundColor: '#0D0F12' }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold" style={{ color: '#F4F7FA', fontFamily: 'Poppins, sans-serif' }}>
            ⚽ Pronostics gratuits du jour
          </h2>
          <a href="/pronostics" className="text-[11px] font-bold" style={{ color: '#2D5BFF' }}>
            Tous les pronostics BTTS d'aujourd'hui →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {predictions.map((pred, i) => {
            const teams = pred.match.split(/\s+vs?\s+/i)
            const home = teams[0]?.trim() || ''
            const away = teams[1]?.trim() || ''
            return (
              <div key={i} className="rounded-lg p-3" style={{ backgroundColor: '#1E2228', border: '1px solid rgba(45, 91, 255, 0.1)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono" style={{ color: '#6E7681' }}>{pred.league}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(45, 91, 255, 0.12)', color: '#2D5BFF' }}>
                    {pred.type}
                  </span>
                </div>
                <div className="text-xs font-bold mb-1" style={{ color: '#F4F7FA' }}>
                  {home.length > 12 ? home.slice(0, 11) + '…' : home} vs {away.length > 12 ? away.slice(0, 11) + '…' : away}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px]" style={{ color: '#A8B3C7' }}>
                    Prédiction: <strong style={{ color: '#D4AF37' }}>{pred.prediction}</strong>
                  </span>
                  <span className="text-[10px] font-bold" style={{ color: '#2D5BFF' }}>{pred.confidence}%</span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-3">
          <a
            href={AFFILIATE.linebet}
            rel="sponsored noopener"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold"
            style={{ backgroundColor: '#2D5BFF', color: '#F4F7FA' }}
          >
            Parier sur Linebet →
          </a>
        </div>
      </div>
    </section>
  )
}
