'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { resolveTeamLogo } from '@/lib/teamLogos'
import { useScrollAnimation, useRevealOnScroll, useCountUp, useStaggerReveal } from '@/hooks/useAnimations'
import { TrophyIcon } from './AnimatedIcons'
import { staggerContainer, staggerChildFadeUp, rowReveal, subtleHover } from '@/lib/motionPresets'

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
  const [revealRef, isRowVisible] = useRevealOnScroll(0.1, 'fade-up')
  const isAlt = index % 2 === 1
  return (
    <motion.div
      ref={revealRef}
      key={item.id || index}
      initial={false}
      variants={rowReveal(index)}
      animate={isRowVisible ? 'visible' : 'hidden'}
      style={{ willChange: 'transform, opacity' }}
      className={`grid grid-cols-1 sm:grid-cols-5 gap-1 sm:gap-3 px-4 py-2 border-t border-edge/30 hover:bg-gold/[0.03] transition-colors items-center ${isAlt ? 'bg-white/[0.01]' : ''}`}
    >
      <div className="text-[10px] text-gray-500 sm:text-xs flex items-center gap-1.5">
        <span className="pastille pastille-cyan" />
        {item.date}
      </div>
      <div className="flex items-center gap-1.5 min-w-0">
        <MiniTeamLogo src={resolveTeamLogo(item.match?.split(' vs ')[0])} alt={item.match?.split(' vs ')[0]} />
        <div className="min-w-0">
          <div className="text-white font-semibold text-xs sm:text-sm truncate">{item.match}</div>
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
      <div className="flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-success/10 border border-success/25 rounded text-success text-[10px] font-bold">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
          Gagné
        </span>
        <span className="text-xs text-gray-300 font-mono tabular-nums">{item.score}</span>
      </div>
    </motion.div>
  )
}

function LoadingSkeleton() {
  return (
    <section className="py-4 sm:py-5 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-3">
          <div className="inline-block w-10 h-10 rounded-full bg-gold/10 animate-pulse" />
          <div className="h-4 w-48 mx-auto mt-3 bg-panel rounded shimmer-card" />
          <div className="h-3 w-32 mx-auto mt-2 bg-edge/20 rounded shimmer-card" />
        </div>
        <div className="grid grid-cols-3 gap-1.5 sm:gap-3 mb-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-panel border border-edge/40 squircle shimmer-card p-2 sm:p-3 text-center">
              <div className="h-5 w-12 mx-auto bg-gold/10 rounded shimmer-card" />
              <div className="h-2 w-16 mx-auto mt-1 bg-edge/20 rounded shimmer-card" />
            </div>
          ))}
        </div>
        {[1,2,3,4,5].map(i => (
          <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-t border-edge/20">
            <div className="h-3 w-16 bg-edge/20 rounded shimmer-card" />
            <div className="h-3 w-32 bg-panel rounded shimmer-card flex-1" />
            <div className="h-3 w-8 bg-edge/20 rounded shimmer-card" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default function WinHistory() {
  const [showAll, setShowAll] = useState(false)
  const [winData, setWinData] = useState<{ stats: { total: number; won: number; rate: string; last30Rate: string }; history: HistoryItem[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [ref, isVisible] = useScrollAnimation(0.15)
  const [staggerRef] = useStaggerReveal()

  useEffect(() => {
    async function loadWinHistory() {
      try {
        const r = await fetch(`/win-history.json?t=${Date.now()}`)
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        const data = await r.json()
        if (data && data.history && data.history.length > 0) {
          setWinData(data)
        }
        setLoading(false)
      } catch (err) {
        console.error('[WinHistory] Fetch failed, trying fallback:', err)
        try {
          const r2 = await fetch('/win-history.json')
          if (!r2.ok) throw new Error(`HTTP ${r2.status}`)
          const data2 = await r2.json()
          if (data2 && data2.history && data2.history.length > 0) {
            setWinData(data2)
          }
          setLoading(false)
        } catch (fallbackErr) {
          console.error('[WinHistory] Fallback also failed:', fallbackErr)
          setLoading(false)
        }
      }
    }
    loadWinHistory()
  }, [])

  // Show skeleton while loading — NEVER return null (causes empty space gaps)
  if (loading) {
    return <LoadingSkeleton />
  }

  // If data failed to load entirely, show minimal fallback instead of null
  if (!winData || !winData.history || winData.history.length === 0) {
    return (
      <section ref={ref} id="win-history" className="py-4 sm:py-5 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex justify-center mb-2">
            <TrophyIcon size={40} />
          </div>
          <h2 className="section-title text-white tracking-tight">
            Historique des <span className="text-gold">Pronostics</span>
          </h2>
          <p className="text-gray-500 text-sm mt-2">Historique en cours de mise à jour…</p>
        </div>
      </section>
    )
  }

  const { history, stats } = winData

  // Afficher SEULEMENT les pronostics gagnés (filter out any non-winning entries)
  const wonOnly = history.filter((item) => item.result === 'Gagné')

  // Use the claimed stats rate from JSON (which accounts for total analyzed including losses)
  // This gives the real 76% rate instead of computing from only shown wins (which would be 100%)
  const displayStats = useMemo(() => {
    const total = stats?.total || wonOnly.length
    const won = stats?.won || wonOnly.length
    // Use the JSON stats rate which includes the "analyzed but lost" predictions
    const rateStr = stats?.rate || `${total > 0 ? Math.round((won / total) * 1000) / 10 : 0}%`
    const rateVal = parseFloat(rateStr.replace('%', ''))
    return { total, won, rateStr, rateVal }
  }, [stats, wonOnly.length])

  // Show 8 entries by default (more than before), all on "Voir plus"
  const INITIAL_SHOW = 8
  const displayedHistory = showAll ? wonOnly : wonOnly.slice(0, INITIAL_SHOW)

  // Count-up hooks
  const [totalRef, totalDisplay] = useCountUp(displayStats.total, 1800, { threshold: 0.3 })
  const [rateRef, rateDisplay] = useCountUp(displayStats.rateVal, 1800, { decimals: 1, threshold: 0.3 })
  const [wonRef, wonDisplay] = useCountUp(displayStats.won, 1800, { threshold: 0.3 })

  return (
    <section ref={ref} id="win-history" className="section-entrance py-3 sm:py-4 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-2"
        >
          <div className="flex justify-center mb-1.5">
            <TrophyIcon size={36} />
          </div>
          <span className="live-indicator">Live</span>
          <span className="text-[10px] font-bold text-gold uppercase tracking-[0.15em]">Track Record</span>
          <h2 className="section-title text-white mt-1 tracking-tight">
            Historique des <span className="text-gold">Pronostics</span>
          </h2>
          <p className="text-gray-500 text-xs mt-0.5">Pronostics gagnés vérifiés — résultats réels</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-2"
        >
          {[
            { refObj: totalRef, value: totalDisplay, label: 'Analysés', color: 'text-white' },
            { refObj: rateRef, value: rateDisplay, label: 'Réussite', color: 'text-gold', suffix: '%' },
            { refObj: wonRef, value: wonDisplay, label: 'Gagnés', color: 'text-gold' },
          ].map((item, i) => (
            <motion.div key={i} variants={staggerChildFadeUp} whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(250,204,21,0.08)', transition: { duration: 0.25 } }} whileTap={{ y: 0, transition: { duration: 0.15 } }} style={{ willChange: 'transform, opacity' }} className="bg-panel border border-edge/40 squircle shimmer-card p-2 sm:p-2.5 text-center min-w-0">
              <span ref={item.refObj} className={`block text-sm sm:text-base font-bold ${item.color} tabular-nums`}>
                {item.value}{item.suffix || ''}
              </span>
              <div className="text-[9px] text-gray-500 uppercase tracking-wider font-medium mt-0.5">
                {item.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-panel border border-edge/40 squircle-lg overflow-hidden"
        >
          <div className="hidden sm:grid grid-cols-5 gap-3 px-4 py-2 text-gray-500 text-[10px] font-semibold uppercase tracking-wider border-b border-edge/40">
            <span>Date</span><span>Match</span><span>Type</span><span>Pronostic</span><span>Résultat</span>
          </div>

          <div ref={staggerRef} className="stagger-reveal">
            {displayedHistory.map((item, i) => (
              <HistoryRow key={item.id || i} item={item} index={i} />
            ))}
          </div>
        </motion.div>

        {wonOnly.length > INITIAL_SHOW && (
          <div className="text-center mt-2">
            <motion.button onClick={() => setShowAll(!showAll)} variants={subtleHover} initial="rest" whileHover="hover" whileTap="tap" style={{ willChange: 'transform, opacity' }} className="px-4 py-1.5 bg-panel border border-edge/40 text-gold text-xs font-semibold rounded-full hover:border-gold/30 transition-colors">
              {showAll ? 'Voir moins ↑' : `Voir plus (${wonOnly.length} gagnés) ↓`}
            </motion.button>
          </div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.4 }} className="text-center mt-1.5">
          <div className="flex items-center gap-1.5 justify-center">
            <span className="trust-badge">Résultats vérifiés</span>
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 bg-success rounded-full animate-ping opacity-50" />
              <span className="relative w-1.5 h-1.5 bg-success rounded-full" />
            </span>
            <span className="text-[10px] text-gray-500">Seuls les pronostics gagnés sont affichés</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
