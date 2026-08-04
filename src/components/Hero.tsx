'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { SITE } from '@/lib/constants'

export default function Hero() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true)
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 3000)
          setProgress((1 - Math.pow(1 - t, 3)) * 100)
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const steps = ['Forme', 'xG', 'Blessures', 'Cotes', 'Historique', 'BTTS', 'Over 2.5']

  return (
    <section ref={ref} className="relative overflow-hidden pt-8 pb-6">
      {/* Mesh gradient bg */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--grad-mesh)' }} />
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#00FF88 1px, transparent 1px), linear-gradient(90deg, #00FF88 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5"
          style={{ background: 'var(--color-neon-dim)', border: '1px solid rgba(0,255,136,0.2)' }}>
          <span className="w-2 h-2 rounded-full live-dot" style={{ background: 'var(--color-neon)' }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--color-neon)' }}>IA Active — 1200+ matchs/jour</span>
        </motion.div>

        {/* Title */}
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[28px] sm:text-[40px] font-bold leading-[1.05] tracking-tight text-white mb-4">
          Le moteur IA qui sait quand<br />
          <span className="neon-text" style={{ color: 'var(--color-neon)' }}>les deux équipes marquent.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm sm:text-base text-[var(--color-text-secondary)] max-w-md mx-auto mb-6 leading-relaxed">
          Modèles Poisson calibrés sur 50 000 matchs. ~52% de réussite publiée, gagnés et pertes affichés. Code{' '}
          <button onClick={() => { navigator.clipboard?.writeText(SITE.promoCode); navigator.vibrate?.(15) }}
            className="font-mono font-bold neon-text" style={{ color: 'var(--color-neon)' }}>{SITE.promoCode}</button>{' '}
          = Bonus 90 000 XOF.
        </motion.p>

        {/* CTA — 1 vert + 1 ghost */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col gap-2.5 max-w-sm mx-auto">
          <a href={SITE.affiliate} target="_blank" rel="sponsored noopener"
            className="h-[56px] rounded-[14px] font-bold text-[15px] flex items-center justify-center gap-2 transition-all"
            style={{ background: 'var(--grad-primary)', color: '#0a0a0a', boxShadow: 'var(--shadow-cta)' }}>
            S'inscrire · Bonus 90 000 XOF
          </a>
          <a href="#pronos"
            className="h-[48px] rounded-[14px] font-medium text-[13px] flex items-center justify-center"
            style={{ background: 'transparent', border: '1px solid var(--border-strong)', color: 'rgba(255,255,255,0.7)' }}>
            Voir les pronostics du jour
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-center gap-4 mt-5 text-[10px] text-[var(--color-text-muted)]">
          <span>18+</span>
          <span>·</span>
          <span>Résultats vérifiés</span>
          <span>·</span>
          <span>Aucun paiement sur BTTSPredict</span>
        </motion.div>

        {/* Pipeline IA */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
          className="glass rounded-[20px] p-5 mt-6 max-w-md mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-white">Analyse IA en cours…</span>
            <span className="font-mono text-xs font-bold" style={{ color: 'var(--color-neon)' }}>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden mb-4" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: 'var(--grad-primary)', boxShadow: '0 0 8px var(--color-neon)' }} />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded flex items-center justify-center transition-all"
                  style={{
                    background: i < progress / 14 ? 'var(--color-neon-dim)' : 'transparent',
                    border: '1px solid ' + (i < progress / 14 ? 'var(--color-neon)' : 'rgba(255,255,255,0.1)'),
                  }}>
                  {i < progress / 14 && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="var(--color-neon)" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                </div>
                <span className="text-[10px]" style={{ color: i < progress / 14 ? 'rgba(255,255,255,0.8)' : 'var(--color-text-muted)' }}>{s}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
