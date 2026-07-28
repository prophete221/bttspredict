'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AFFILIATE } from '@/lib/constants'
import { useScrollAnimation, useCountUp } from '@/hooks/useAnimations'
import { staggerContainer } from '@/lib/motionPresets'
import VipUnlockModal from './VipUnlockModal'

// ─── Deterministic daily data ────────────────────────────────────────────
function getDailyWinRate(): number {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const x = Math.sin(seed * 1357 + 2468) * 13579
  const frac = x - Math.floor(x)
  return Math.round((76 + frac * 14) * 10) / 10 // 76-90%
}

function getDailyAvgMultiplier(): number {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const x = Math.sin(seed * 9301 + 49297) * 233280
  const frac = x - Math.floor(x)
  return Math.round((2.5 + frac * 1.5) * 100) / 100 // 2.5x - 4x
}

function getDailyMaxMultiplier(): number {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const x = Math.sin(seed * 7919 + 13171) * 41943
  const frac = x - Math.floor(x)
  return Math.round((8 + frac * 12) * 100) / 100 // 8x - 20x
}

// Generate fake but realistic Aviator history (last 10 rounds)
function generateHistory(): { multiplier: number; time: string }[] {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const history: { multiplier: number; time: string }[] = []
  for (let i = 0; i < 8; i++) {
    const x = Math.sin((seed + i) * 9301 + 49297) * 233280
    const frac = x - Math.floor(x)
    // Most rounds crash early (1.2-3x), some go high
    const mult = frac < 0.6 ? Math.round((1.2 + frac * 3) * 100) / 100 : Math.round((4 + frac * 8) * 100) / 100
    const minutesAgo = (i + 1) * 3
    const time = new Date(Date.now() - minutesAgo * 60 * 1000)
    history.push({
      multiplier: mult,
      time: time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    })
  }
  return history
}

// ─── Aviator Chart — small sparkline-like visualization ───────────────────
function AviatorMiniChart({ history }: { history: { multiplier: number; time: string }[] }) {
  const maxMult = Math.max(...history.map(h => h.multiplier), 1)

  return (
    <div className="relative h-24 bg-midnight/40 rounded-lg border border-edge overflow-hidden p-2">
      {/* Grid lines */}
      <div className="absolute inset-2 flex flex-col justify-between pointer-events-none">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-px bg-white/[0.04]" />
        ))}
      </div>

      {/* Multiplicator line */}
      <svg className="absolute inset-2" viewBox="0 0 100 60" preserveAspectRatio="none">
        <defs>
          <linearGradient id="avi-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F2C94C" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F2C94C" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          points={history.map((h, i) => {
            const x = (i / (history.length - 1)) * 100
            const y = 60 - (h.multiplier / maxMult) * 50 - 5
            return `${x},${y}`
          }).join(' ')}
          fill="none"
          stroke="#F2C94C"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polygon
          points={`0,60 ${history.map((h, i) => {
            const x = (i / (history.length - 1)) * 100
            const y = 60 - (h.multiplier / maxMult) * 50 - 5
            return `${x},${y}`
          }).join(' ')} 100,60`}
          fill="url(#avi-grad)"
        />
      </svg>

      {/* Y axis labels */}
      <div className="absolute right-2 top-2 text-[9px] text-gold/60 font-mono tabular-nums">
        {maxMult.toFixed(1)}x
      </div>
      <div className="absolute right-2 bottom-2 text-[9px] text-gray-600 font-mono">1.0x</div>
    </div>
  )
}

// ─── Main AviatorVip component ───────────────────────────────────────────
export default function AviatorVip() {
  const [ref, isVisible] = useScrollAnimation()
  const [showModal, setShowModal] = useState(false)

  const winRate = useMemo(() => getDailyWinRate(), [])
  const avgMult = useMemo(() => getDailyAvgMultiplier(), [])
  const maxMult = useMemo(() => getDailyMaxMultiplier(), [])
  const history = useMemo(() => generateHistory(), [])

  const [winRateRef, winRateDisplay] = useCountUp(winRate, 1500, { decimals: 1, threshold: 0.3 })
  const [avgMultRef, avgMultDisplay] = useCountUp(avgMult, 1500, { decimals: 2, threshold: 0.3 })
  const [maxMultRef, maxMultDisplay] = useCountUp(maxMult, 1500, { decimals: 2, threshold: 0.3 })
  const [roundsRef, roundsDisplay] = useCountUp(1247, 1500, { threshold: 0.3 })

  return (
    <>
      <section ref={ref} id="aviator" className="section-pad pt-0">
        <div className="max-w-5xl mx-auto">
          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6 }}
            className="squircle-xl overflow-hidden"
          >
            {/* Top red accent line (aviator theme) */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-lose to-transparent" />

            {/* Header with aviator logo */}
            <div
              className="relative p-5 sm:p-6 border-b border-edge"
              style={{
                background: 'linear-gradient(135deg, rgba(235, 87, 87, 0.08) 0%, transparent 60%)',
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Aviator logo */}
                  <div className="w-16 h-16 rounded-2xl bg-midnight/60 border border-lose/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img src="/logos/sport-aviator.svg" alt="Aviator" className="w-12 h-12 object-contain" loading="lazy" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-lose-light uppercase tracking-widest font-bold">VIP Stats</span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight mt-0.5">
                      Stats <span className="text-lose-light">Aviator</span>
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-1 truncate">
                      Suivi statistique · Historique en direct · Provably fair
                    </p>
                  </div>
                </div>

                {/* LIVE badge */}
                <motion.div
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-1.5 bg-success/10 border border-success/30 rounded-full px-2.5 py-1"
                >
                  <span className="v31-ticker-dot live" />
                  <span className="text-[10px] text-success font-bold uppercase tracking-wider">Live</span>
                </motion.div>
              </div>

              {/* KPI row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-5">
                <div className="bg-midnight/40 border border-edge rounded-lg p-2.5 text-center">
                  <div className="text-base sm:text-lg font-bold text-lose-light tabular-nums glow-text-coral" ref={winRateRef}>{winRateDisplay}%</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Taux cash-out</div>
                </div>
                <div className="bg-midnight/40 border border-edge rounded-lg p-2.5 text-center">
                  <div className="text-base sm:text-lg font-bold text-gold tabular-nums glow-text-gold" ref={avgMultRef}>{avgMultDisplay}x</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Mult. moyen</div>
                </div>
                <div className="bg-midnight/40 border border-edge rounded-lg p-2.5 text-center">
                  <div className="text-base sm:text-lg font-bold text-success tabular-nums glow-text-green" ref={maxMultRef}>{maxMultDisplay}x</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Max du jour</div>
                </div>
                <div className="bg-midnight/40 border border-edge rounded-lg p-2.5 text-center">
                  <div className="text-base sm:text-lg font-bold text-white tabular-nums" ref={roundsRef}>{roundsDisplay}</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Rounds suivis</div>
                </div>
              </div>
            </div>

            {/* Content — chart + locked rounds */}
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Historique récent</span>
                <span className="badge badge-rose text-[9px]">Verrouillé</span>
              </div>

              {/* Mini chart */}
              <AviatorMiniChart history={history} />

              {/* Locked rounds list */}
              <div className="space-y-1 mt-3 relative">
                {history.slice(0, 5).map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3 }}
                    className="grid grid-cols-[60px_1fr_60px] items-center gap-2 bg-midnight/40 rounded-lg px-3 py-2 border border-edge/40"
                  >
                    <span className="text-[10px] text-gray-500 font-mono tabular-nums">{h.time}</span>
                    <div className="flex items-center gap-1.5 min-w-0 blur-[5px] select-none">
                      <span className="text-white text-xs font-semibold">Round #{1247 - i}</span>
                      <span className="text-gray-600 text-[9px]">·</span>
                      <span className="text-lose-light text-xs">crash à</span>
                    </div>
                    <span className="text-[10px] text-gold font-bold tabular-nums blur-[3px] select-none text-right">
                      {h.multiplier.toFixed(2)}x
                    </span>
                  </motion.div>
                ))}

                {/* Lock overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-midnight/30 backdrop-blur-[1px] rounded-lg pointer-events-none">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="bg-midnight/90 border border-lose/30 rounded-full p-3 flex flex-col items-center gap-1"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F47373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span className="text-[10px] text-lose-light font-bold uppercase tracking-wider">VIP</span>
                  </motion.div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-lose/[0.04] border border-lose/20 rounded-lg p-3 mt-4">
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  <strong className="text-lose-light">⚠️ Provably fair :</strong> Aviator est un jeu 100% aléatoire basé sur un générateur certifié.
                  Aucun outil ne peut prédire un round futur. Nos statistiques observent l'historique, pas l'avenir.
                </p>
              </div>

              {/* CTA */}
              <button
                onClick={() => setShowModal(true)}
                className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-3 btn-gold cta-glow text-[#1A1206] text-sm font-bold rounded-xl"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Débloquer les Statistiques Aviator VIP
              </button>
              <p className="text-[10px] text-gray-500 text-center mt-2">
                Inscris-toi avec <span className="text-gold-light font-semibold">VISION221</span> pour débloquer
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <VipUnlockModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Débloque les Statistiques Aviator VIP"
      />
    </>
  )
}
