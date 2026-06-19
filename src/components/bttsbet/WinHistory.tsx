'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import TiltCard from './TiltCard'
import { resolveTeamLogo } from '@/lib/teamLogos'
import { SITE } from '@/lib/constants'
import { useScrollAnimation, useRevealOnScroll, useCountUp } from '@/hooks/useAnimations'

function MiniTeamLogo({ src, alt }: { src: string; alt: string }) {
  const [err, setErr] = useState(false)
  if (!src || err) return null
  return (
    <img src={src} alt={alt} className="w-5 h-5 rounded object-contain flex-shrink-0" onError={() => setErr(true)} loading="lazy" />
  )
}

interface HistoryItem {
  id: number
  date: string
  match: string
  league: string
  type: string
  prediction: string
  result: string
  score: string
  confidence: number
}

function HistoryRow({ item, index }: { item: HistoryItem; index: number }) {
  // Per-row scroll reveal — each row animates independently
  const [revealRef, isRowVisible] = useRevealOnScroll(0.1, 'fade-up')
  return (
    <motion.div
      ref={revealRef}
      key={item.id || index}
      initial={false}
      animate={isRowVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.2), ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-1 sm:grid-cols-5 gap-1 sm:gap-3 px-3 py-2.5 border-t border-white/[0.04] hover:bg-emerald/[0.04] transition-colors items-center"
    >
      <div className="text-[10px] text-gray-500 sm:text-xs">{item.date}</div>
      <div className="flex items-center gap-1.5">
        <MiniTeamLogo src={resolveTeamLogo(item.match?.split(' vs ')[0])} alt={item.match?.split(' vs ')[0]} />
        <div>
          <div className="text-white font-semibold text-xs sm:text-sm">{item.match}</div>
          <div className="text-[10px] text-gray-500 sm:hidden">{item.league} • {item.type}</div>
          <div className="text-[10px] text-gray-500 hidden sm:block">{item.league}</div>
        </div>
        <MiniTeamLogo src={resolveTeamLogo(item.match?.split(' vs ')[1])} alt={item.match?.split(' vs ')[1]} />
      </div>
      <div className="hidden sm:block">
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${item.type === 'BTTS' ? 'bg-emerald/10 text-emerald border border-emerald/20' : 'bg-gold/10 text-gold border border-gold/20'}`}>
          {item.type}
        </span>
      </div>
      <div className="text-xs text-white font-semibold">{item.prediction}</div>
      <div className="text-xs text-gray-300 font-mono">{item.score}</div>
    </motion.div>
  )
}

export default function WinHistory() {
  const [showAll, setShowAll] = useState(false)
  const [winData, setWinData] = useState<{ stats: { total: number; won: number; last30Rate: string }; history: HistoryItem[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [ref, isVisible] = useScrollAnimation(0.15)

  useEffect(() => {
    // Cache-bust to ensure fresh data after deployments
    const url = `/win-history.json?t=${Date.now()}`
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data) => {
        if (data && data.history && data.history.length > 0) {
          setWinData(data)
        } else {
          setWinData(null)
        }
        setLoading(false)
      })
      .catch(() => {
        setWinData(null)
        setLoading(false)
      })
  }, [])

  const displayStats = useMemo(() => {
    if (!winData || !winData.stats) return null
    const { stats } = winData
    const total = stats.total || 0
    return { total, rate: SITE.historyRate, last30Rate: `${SITE.last30Rate}` }
  }, [winData])

  // Count-up hooks for the three stat cards
  // total: integer count-up
  // rate: parse "88.3%" → 88.3 with 1 decimal
  // last30Rate: parse "91%" → 91 with 0 decimals
  const totalTarget = displayStats?.total ?? 0
  const rateTarget = displayStats ? parseFloat(displayStats.rate.replace('%', '')) : 0
  const last30Target = displayStats ? parseFloat(displayStats.last30Rate.replace('%', '')) : 0
  const [totalRef, totalDisplay] = useCountUp(totalTarget, 1800, { threshold: 0.3 })
  const [rateRef, rateDisplay] = useCountUp(rateTarget, 1800, { decimals: 1, threshold: 0.3 })
  const [last30Ref, last30Display] = useCountUp(last30Target, 1800, { threshold: 0.3 })

  if (loading) {
    return (
      <section id="win-history" className="py-10 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block w-8 h-8 border-2 border-emerald/30 border-t-emerald rounded-full animate-spin" />
        </div>
      </section>
    )
  }

  if (!winData || !winData.history || winData.history.length === 0 || !displayStats) {
    return (
      <section id="win-history" className="py-10 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gray-500 text-sm">Aucun historique disponible pour le moment.</p>
        </div>
      </section>
    )
  }
  const { history } = winData
  // N'afficher que les matchs gagnés
  const wonHistory = history.filter((item) => item.result === 'Gagné')
  const displayedHistory = showAll ? wonHistory : wonHistory.slice(0, 5)

  return (
    <section ref={ref} id="win-history" className="py-10 px-4 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald/[0.02] via-transparent to-transparent pointer-events-none" />
      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20, rotateX: 6 }}
          animate={isVisible ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ transformOrigin: 'center bottom' }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-emerald" />
            <span className="text-[10px] font-bold text-emerald uppercase tracking-widest">Track Record</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-emerald" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
            Derniers <span className="text-emerald neon-glow">Pronostics Gagnants</span>
          </h2>
          <p className="text-gray-500 text-sm">Sélections validées par les résultats réels</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={`grid grid-cols-3 gap-3 mb-6 stagger-reveal ${isVisible ? 'is-visible' : ''}`}
        >
          {[
            { refObj: totalRef, value: totalDisplay, label: 'Analysés', color: 'text-white' },
            { refObj: rateRef, value: rateDisplay, label: 'Réussite', color: 'text-emerald', suffix: '%' },
            { refObj: last30Ref, value: last30Display, label: '30 jours', color: 'text-gold', suffix: '%' },
          ].map((item, i) => (
            <TiltCard key={i} maxTilt={4}>
              <div className="glass-3d rounded-xl p-3 text-center stat-card-animated relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span ref={item.refObj} className={`block text-lg font-bold ${item.color} tabular-nums`}>
                  {item.value}{item.suffix || ''}
                </span>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{item.label}</div>
              </div>
            </TiltCard>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-3d rounded-2xl overflow-hidden relative"
        >
          {/* Premium top sheen */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
          <div className="hidden sm:grid grid-cols-5 gap-3 px-3 py-2 bg-white/[0.03] text-gray-500 text-[10px] font-semibold uppercase tracking-wider border-b border-white/[0.06]">
            <span>Date</span><span>Match</span><span>Type</span><span>Pronostic</span><span>Score</span>
          </div>

          {displayedHistory.map((item, i) => (
            <HistoryRow key={item.id || i} item={item} index={i} />
          ))}
        </motion.div>

        {wonHistory.length > 5 && (
          <div className="text-center mt-4">
            <button onClick={() => setShowAll(!showAll)} className="px-4 py-1.5 glass-3d text-emerald text-xs font-semibold rounded-full hover:bg-emerald/10 transition-all hover-lift border border-emerald/20">
              {showAll ? 'Voir moins ↑' : 'Voir plus ↓'}
            </button>
          </div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.6 }} className="text-center mt-4">
          <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-white/[0.03] border border-white/[0.04]">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 bg-emerald rounded-full animate-ping opacity-75" />
              <span className="relative w-1.5 h-1.5 bg-emerald rounded-full" />
            </span>
            <span className="text-[10px] text-gray-500">Résultats vérifiés par l&apos;IA — mis à jour quotidiennement</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
