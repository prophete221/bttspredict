'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

type Match = {
  match: string
  league: string
  date: string
  time?: string
  homeLogo?: string
  awayLogo?: string
  type: string
  prediction: string
  confidence: number
}

type LiveStatus = 'upcoming' | 'live' | 'finished'

function getMatchStatus(date: string, time?: string): LiveStatus {
  if (!date) return 'upcoming'
  try {
    const matchDateTime = new Date(`${date}T${time || '12:00'}:00`)
    const now = new Date()
    const diffMs = matchDateTime.getTime() - now.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)

    // Live if match started less than 2.5h ago (typical match duration)
    if (diffMs < 0 && diffHours > -2.5) return 'live'
    if (diffMs < 0) return 'finished'
    return 'upcoming'
  } catch {
    return 'upcoming'
  }
}

function getTimeUntilMatch(date: string, time?: string): string {
  if (!date) return ''
  try {
    const matchDateTime = new Date(`${date}T${time || '12:00'}:00`)
    const now = new Date()
    const diffMs = matchDateTime.getTime() - now.getTime()

    if (diffMs < 0) return ''
    const diffMin = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMin / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `J-${diffDays}`
    if (diffHours > 0) return `${diffHours}h ${diffMin % 60}min`
    return `${diffMin}min`
  } catch {
    return ''
  }
}

export default function LiveTicker() {
  const [matches, setMatches] = useState<Match[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetch('/predictions.json')
      .then(r => r.json())
      .then(data => {
        const preds: Match[] = data.predictions || []
        // Sort by date+time
        const sorted = [...preds].sort((a, b) => {
          const da = `${a.date}T${a.time || '23:59'}`
          const db = `${b.date}T${b.time || '23:59'}`
          return da.localeCompare(db)
        })
        setMatches(sorted.slice(0, 20))
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (matches.length === 0) return
    intervalRef.current = setInterval(() => {
      setCurrentIndex(i => (i + 1) % matches.length)
    }, 5000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [matches.length])

  if (matches.length === 0) return null

  // Build display list: 1 upcoming live match + 3-4 scrolling
  const liveMatches = matches.filter(m => getMatchStatus(m.date, m.time) === 'live')
  const upcomingMatches = matches.filter(m => getMatchStatus(m.date, m.time) === 'upcoming')
  const displayMatches = [...liveMatches, ...upcomingMatches].slice(0, 8)
  const currentMatch = displayMatches[currentIndex % displayMatches.length] || matches[0]

  const status = getMatchStatus(currentMatch.date, currentMatch.time)
  const timeUntil = getTimeUntilMatch(currentMatch.date, currentMatch.time)
  const teams = currentMatch.match.split(/\s+vs?\s+/i)
  const home = teams[0] || ''
  const away = teams[1] || ''

  return (
    <div className="relative z-20 -mt-2 mb-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden squircle border border-edge bg-panel/80 backdrop-blur-md"
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

          <div className="flex items-stretch">
            {/* Live badge column */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-r border-edge bg-midnight/50 flex-shrink-0">
              <span className={`v31-ticker-dot ${status === 'live' ? '' : 'opacity-50'}`} />
              <span className={`text-[10px] font-bold uppercase tracking-widest ${status === 'live' ? 'text-success' : 'text-gray-400'}`}>
                {status === 'live' ? 'Live' : status === 'finished' ? 'Fin' : 'Bientôt'}
              </span>
            </div>

            {/* Match content — animated */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <AnimatePresenceKeyed key={currentIndex}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3 px-4 py-2.5"
                >
                  {/* Time / countdown */}
                  <div className="flex-shrink-0 text-center min-w-[55px]">
                    {status === 'live' ? (
                      <div className="text-success font-bold text-xs">
                        <div className="text-[10px] text-success/60 uppercase tracking-widest">En cours</div>
                        <div className="font-mono tabular-nums">LIVE</div>
                      </div>
                    ) : status === 'upcoming' && timeUntil ? (
                      <div>
                        <div className="text-[10px] text-gold/60 uppercase tracking-widest font-bold">{timeUntil.includes('h') ? 'Dans' : 'J-'}</div>
                        <div className="text-gold font-bold text-xs font-mono tabular-nums">{timeUntil}</div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Heure</div>
                        <div className="text-white font-bold text-xs font-mono tabular-nums">{currentMatch.time || '--:--'}</div>
                      </div>
                    )}
                  </div>

                  <div className="w-px h-8 bg-edge flex-shrink-0" />

                  {/* Teams */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {currentMatch.homeLogo && (
                      <img src={currentMatch.homeLogo} alt="" className="w-5 h-5 object-contain flex-shrink-0" loading="lazy" />
                    )}
                    <span className="text-white text-xs font-semibold truncate">{home}</span>
                    <span className="text-gray-500 text-[10px] flex-shrink-0 font-mono">VS</span>
                    <span className="text-white text-xs font-semibold truncate">{away}</span>
                    {currentMatch.awayLogo && (
                      <img src={currentMatch.awayLogo} alt="" className="w-5 h-5 object-contain flex-shrink-0" loading="lazy" />
                    )}
                  </div>

                  <div className="w-px h-8 bg-edge flex-shrink-0" />

                  {/* League */}
                  <div className="hidden sm:block text-[10px] text-gray-500 truncate max-w-[120px] flex-shrink-0">
                    {currentMatch.league}
                  </div>

                  <div className="hidden sm:block w-px h-8 bg-edge flex-shrink-0" />

                  {/* Prediction */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="badge badge-mint text-[9px]">{currentMatch.type}</span>
                    <span className="text-gold font-bold text-xs">{currentMatch.prediction}</span>
                    <span className="text-gray-500 text-[10px] tabular-nums hidden sm:inline">({currentMatch.confidence}%)</span>
                  </div>
                </motion.div>
              </AnimatePresenceKeyed>
            </div>

            {/* Counter — X/N */}
            <div className="hidden sm:flex items-center px-4 py-2.5 border-l border-edge bg-midnight/50 flex-shrink-0">
              <div className="text-[10px] text-gray-500 tabular-nums font-mono">
                <span className="text-gold font-bold">{(currentIndex % displayMatches.length) + 1}</span>
                <span className="text-gray-600">/{displayMatches.length}</span>
              </div>
            </div>
          </div>

          {/* Progress bar — auto-advances every 5s */}
          <motion.div
            key={currentIndex}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, ease: 'linear' }}
            className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-gold via-success to-ultra"
          />
        </motion.div>
      </div>
    </div>
  )
}

// Small wrapper to use AnimatePresence with a key
import { AnimatePresence } from 'framer-motion'
function AnimatePresenceKeyed({ children, key }: { children: React.ReactNode; key: number }) {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>
}
