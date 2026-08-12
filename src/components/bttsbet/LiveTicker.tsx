'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDakarDateLabel, getDakarDateString, parseDakarDateTime } from '@/lib/dakar-date'

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

/**
 * Determine match status based on date + time.
 * - If date is in the past (before today) → finished
 * - If date is today and time is in the past > 2.5h ago → finished
 * - If date is today and time is in the past < 2.5h ago → live
 * - Otherwise → upcoming
 */
export function getMatchStatus(date: string, time?: string, now = new Date()): LiveStatus {
  if (!date) return 'finished'

  try {
    const today = getDakarDateString(now)
    if (date < today) return 'finished'
    if (date > today) return 'upcoming'

    if (!time || time === '--:--' || !/^\d{2}:\d{2}$/.test(time)) {
      return 'upcoming'
    }

    const matchDateTime = parseDakarDateTime(date, time)
    if (!matchDateTime) return 'finished'

    const diffMs = matchDateTime.getTime() - now.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    if (diffMs < 0 && diffHours > -2.5) return 'live'
    if (diffMs < 0) return 'finished'
    return 'upcoming'
  } catch {
    return 'finished'
  }
}

export function getTimeUntilMatch(date: string, time?: string, now = new Date()): string {
  if (!date) return ''
  try {
    const matchDateTime = parseDakarDateTime(date, time && /^\d{2}:\d{2}$/.test(time) ? time : '12:00')
    if (!matchDateTime) return ''

    const diffMs = matchDateTime.getTime() - now.getTime()
    if (diffMs < 0) return ''
    const diffMin = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMin / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `J-${diffDays}j`
    if (diffHours > 0) return `${diffHours}h ${diffMin % 60}min`
    return `${diffMin}min`
  } catch {
    return ''
  }
}

export function formatTime(date: string, time?: string, now = new Date()): string {
  if (!time || time === '--:--' || !/^\d{2}:\d{2}$/.test(time)) {
    return formatDakarDateLabel(date, now)
  }
  return time
}

export default function LiveTicker() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetch('/predictions.json')
      .then(r => r.json())
      .then(data => {
        const preds: Match[] = data.predictions || []
        // Filter: only show matches that are upcoming OR live
        // This excludes ALL finished matches (past dates, or today with past time > 2.5h ago)
        const visible = preds.filter(m => {
          const status = getMatchStatus(m.date, m.time)
          return status === 'upcoming' || status === 'live'
        })
        // Sort: live first, then upcoming by date+time
        const sorted = [...visible].sort((a, b) => {
          const sa = getMatchStatus(a.date, a.time)
          const sb = getMatchStatus(b.date, b.time)
          if (sa === 'live' && sb !== 'live') return -1
          if (sb === 'live' && sa !== 'live') return 1
          const da = `${a.date}T${a.time || '23:59'}`
          const db = `${b.date}T${b.time || '23:59'}`
          return da.localeCompare(db)
        })
        setMatches(sorted.slice(0, 15))
      })
      .catch((err) => {
        console.warn('[LiveTicker] Fetch failed:', err)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (matches.length === 0) return
    intervalRef.current = setInterval(() => {
      setCurrentIndex(i => (i + 1) % matches.length)
    }, 5000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [matches.length])

  if (loading) {
    return (
      <div className="relative z-20 -mt-2 mb-0">
        <div className="max-w-[440px] sm:max-w-2xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden glass-card border border-edge h-12 animate-pulse" />
        </div>
      </div>
    )
  }

  if (matches.length === 0) return null

  const currentMatch = matches[currentIndex]
  if (!currentMatch) return null

  const status = getMatchStatus(currentMatch.date, currentMatch.time)
  const timeUntil = getTimeUntilMatch(currentMatch.date, currentMatch.time)
  const teams = currentMatch.match.split(/\s+vs?\s+/i)
  const home = teams[0] || ''
  const away = teams[1] || ''
  const timeLabel = formatTime(currentMatch.date, currentMatch.time)

  return (
    <div className="relative z-20 -mt-2 mb-0">
      <div className="max-w-[440px] sm:max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden glass-card border border-edge"
        >
          {/* Top accent line — violet to cyan gradient */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet to-transparent" />

          <div className="flex items-stretch">
            {/* Live badge column */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-r border-edge bg-dark-800 flex-shrink-0">
              <span className={`v31-ticker-dot ${status === 'live' ? '' : 'opacity-50'}`} />
              <span className={`text-[10px] font-bold uppercase tracking-widest ${status === 'live' ? 'live-text' : 'text-violet-light'}`}>
                {status === 'live' ? 'Live' : 'À venir'}
              </span>
            </div>

            {/* Match content — animated */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3 px-4 py-2.5"
                >
                  {/* Time */}
                  <div className="flex-shrink-0 text-center min-w-[55px]">
                    {status === 'live' ? (
                      <div className="text-success font-bold text-xs">
                        <div className="text-[10px] text-success/60 uppercase tracking-widest">En cours</div>
                        <div className="font-mono tabular-nums">LIVE</div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-[10px] text-cendre uppercase tracking-widest font-bold">Heure</div>
                        <div className="text-papier font-bold text-xs font-mono tabular-nums">{timeLabel}</div>
                      </div>
                    )}
                  </div>

                  <div className="w-px h-8 bg-edge flex-shrink-0" />

                  {/* Teams */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {currentMatch.homeLogo && (
                      <img src={currentMatch.homeLogo} alt={`Logo ${home}`} className="w-5 h-5 object-contain flex-shrink-0" loading="lazy" />
                    )}
                    <span className="text-papier text-xs font-semibold truncate">{home}</span>
                    <span className="text-cendre text-[10px] flex-shrink-0 font-mono">VS</span>
                    <span className="text-papier text-xs font-semibold truncate">{away}</span>
                    {currentMatch.awayLogo && (
                      <img src={currentMatch.awayLogo} alt={`Logo ${away}`} className="w-5 h-5 object-contain flex-shrink-0" loading="lazy" />
                    )}
                  </div>

                  <div className="hidden sm:block w-px h-8 bg-edge flex-shrink-0" />

                  {/* League */}
                  <div className="hidden sm:block text-[10px] text-cendre truncate max-w-[120px] flex-shrink-0">
                    {currentMatch.league}
                  </div>

                  <div className="hidden sm:block w-px h-8 bg-edge flex-shrink-0" />

                  {/* Prediction */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="badge badge-cyan text-[9px]">{currentMatch.type}</span>
                    <span className="text-violet-light font-bold text-xs">{currentMatch.prediction}</span>
                    <span className="text-cendre text-[10px] tabular-nums hidden sm:inline">({currentMatch.confidence}%)</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Counter — X/N */}
            <div className="hidden sm:flex items-center px-4 py-2.5 border-l border-edge bg-dark-800 flex-shrink-0">
              <div className="text-[10px] text-cendre tabular-nums font-mono">
                <span className="text-violet-light font-bold">{currentIndex + 1}</span>
                <span className="text-cendre">/{matches.length}</span>
              </div>
            </div>
          </div>

          {/* Progress bar — auto-advances every 5s */}
          <motion.div
            key={currentIndex}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, ease: 'linear' }}
            className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-violet via-cyan to-success"
          />
        </motion.div>
      </div>
    </div>
  )
}
