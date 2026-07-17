'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import TiltCard from './TiltCard'
import { resolveTeamLogo } from '@/lib/teamLogos'
import { SITE } from '@/lib/constants'
import { useScrollAnimation, useRevealOnScroll, useCountUp } from '@/hooks/useAnimations'
import { TrophyIcon } from './AnimatedIcons'

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
  const isAlt = index % 2 === 1
  return (
    <motion.div
      ref={revealRef}
      key={item.id || index}
      initial={false}
      animate={isRowVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.2), ease: [0.22, 1, 0.36, 1] }}
      className={`grid grid-cols-1 sm:grid-cols-5 gap-1 sm:gap-3 px-4 py-2.5 border-t border-edge/30 hover:bg-gold/[0.03] transition-colors items-center ${isAlt ? 'bg-white/[0.01]' : ''}`}
    >
      <div className="text-[10px] text-gray-500 sm:text-xs flex items-center gap-1.5">
        <span className="pastille pastille-cyan" />
        {item.date}
      </div>
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
        <span className={item.type === 'BTTS' ? 'badge-btts' : 'badge-over25'}>
          {item.type}
        </span>
      </div>
      <div className="text-xs text-white font-semibold">{item.prediction}</div>
      <div className="text-xs text-gray-300 font-mono tabular-nums">{item.score}</div>
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

  // Compute real win rate from history data (before useMemo to avoid circular deps)
  const historyArr = winData?.history ?? []
  const wonCount = historyArr.filter((item) => item.result === 'Gagné').length
  const realWinRate = historyArr.length > 0 ? Math.round((wonCount / historyArr.length) * 1000) / 10 : 0

  const displayStats = useMemo(() => {
    if (!winData || !winData.stats) return null
    const { stats } = winData
    const total = stats.total || 0
    return { total, rate: `${realWinRate}%`, wonCount }
  }, [winData, realWinRate])

  // Count-up hooks for the three stat cards
  const totalTarget = displayStats?.total ?? 0
  const rateTarget = displayStats ? parseFloat(displayStats.rate.replace('%', '')) : 0
  const wonTarget = displayStats?.wonCount ?? 0
  const [totalRef, totalDisplay] = useCountUp(totalTarget, 1800, { threshold: 0.3 })
  const [rateRef, rateDisplay] = useCountUp(rateTarget, 1800, { decimals: 1, threshold: 0.3 })
  const [last30Ref, last30Display] = useCountUp(wonTarget, 1800, { threshold: 0.3 })

  if (loading) {
    return (
      <section id="win-history" className="py-10 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
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
  // Afficher TOUS les pronostics (gagnés ET perdus) — transparence totale
  const displayedHistory = showAll ? history : history.slice(0, 5)

  return (
    <section ref={ref} id="win-history" className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-2">
            <TrophyIcon size={40} />
          </div>
          <span className="text-[10px] font-bold text-gold uppercase tracking-[0.15em]">Track Record</span>
          <h2 className="section-title text-white mt-2 tracking-tight">
            Historique des <span className="text-gold">Pronostics</span>
          </h2>
          <p className="text-gray-500 text-sm mt-1">Tous les pronostics — gagnés et perdus — sans filtrage</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {[
            { refObj: totalRef, value: totalDisplay, label: 'Analysés', color: 'text-white' },
            { refObj: rateRef, value: rateDisplay, label: 'Réussite réelle', color: 'text-gold', suffix: '%' },
            { refObj: last30Ref, value: last30Display, label: 'Gagnés', color: 'text-gold' },
          ].map((item, i) => (
            <div key={i} className="bg-panel border border-edge/40 squircle p-3 text-center">
              <span ref={item.refObj} className={`block text-lg font-bold ${item.color} tabular-nums`}>
                {item.value}{item.suffix || ''}
              </span>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-0.5">
                {item.label}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-panel border border-edge/40 squircle-lg overflow-hidden"
        >
          <div className="hidden sm:grid grid-cols-5 gap-3 px-4 py-2.5 text-gray-500 text-[10px] font-semibold uppercase tracking-wider border-b border-edge/40">
            <span>Date</span><span>Match</span><span>Type</span><span>Pronostic</span><span>Score</span>
          </div>

          {displayedHistory.map((item, i) => (
            <HistoryRow key={item.id || i} item={item} index={i} />
          ))}
        </motion.div>

        {history.length > 5 && (
          <div className="text-center mt-4">
            <button onClick={() => setShowAll(!showAll)} className="px-4 py-1.5 bg-panel border border-edge/40 text-gold text-xs font-semibold rounded-full hover:border-gold/30 transition-colors">
              {showAll ? 'Voir moins ↑' : 'Voir plus ↓'}
            </button>
          </div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.6 }} className="text-center mt-4">
          <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-white/[0.02] border border-edge/30">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 bg-success rounded-full animate-ping opacity-50" />
              <span className="relative w-1.5 h-1.5 bg-success rounded-full" />
            </span>
            <span className="text-[10px] text-gray-500">Résultats complets (gagnés et perdus) — transparence totale</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
