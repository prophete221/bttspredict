'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollAnimation, useCountUp } from '@/hooks/useAnimations'
import { AFFILIATE } from '@/lib/constants'
import { staggerContainer, staggerChildFadeUp, cardHoverLift, subtleHover, badgePulse } from '@/lib/motionPresets'
import { AIBrain } from './AnimatedIcons'
import { resolveTeamLogo } from '@/lib/teamLogos'
import PremiumButton from './PremiumButton'

// ─── Helpers ────────────────────────────────────────────────────────────
function formatDateShort(dateStr: string) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr + 'T12:00:00')
    const day = d.getDate().toString().padStart(2, '0')
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const today = new Date(); today.setHours(12, 0, 0, 0)
    const matchDate = new Date(dateStr + 'T12:00:00')
    const diffDays = Math.round((matchDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Auj.'
    if (diffDays === 1) return 'Dem.'
    const weekdays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
    return `${weekdays[d.getDay()]} ${day}/${month}`
  } catch { return dateStr }
}

function getDateGroup(dateStr: string): 'today' | 'tomorrow' | 'upcoming' {
  const today = new Date(); today.setHours(12, 0, 0, 0)
  const matchDate = new Date(dateStr + 'T12:00:00')
  const diffDays = Math.round((matchDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'tomorrow'
  return 'upcoming'
}

function getMatchStatus(date: string, time?: string): 'live' | 'upcoming' | 'finished' {
  if (!date) return 'finished'
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const matchDay = new Date(date + 'T00:00:00'); matchDay.setHours(0, 0, 0, 0)
    // Past day → finished
    if (matchDay.getTime() < today.getTime()) return 'finished'
    // Future day → upcoming
    if (matchDay.getTime() > today.getTime()) return 'upcoming'
    // Today — check time
    if (!time || time === '--:--' || !/^\d{2}:\d{2}$/.test(time)) return 'upcoming'
    const [h, m] = time.split(':').map(Number)
    const matchDateTime = new Date(date + 'T00:00:00')
    matchDateTime.setHours(h, m, 0, 0)
    const diffMs = matchDateTime.getTime() - Date.now()
    const diffHours = diffMs / (1000 * 60 * 60)
    if (diffMs < 0 && diffHours > -2.5) return 'live'
    if (diffMs < 0) return 'finished'
    return 'upcoming'
  } catch { return 'finished' }
}

function getTimeUntil(date: string, time?: string): string {
  if (!date) return ''
  try {
    const matchDateTime = new Date(`${date}T${time || '12:00'}:00`)
    const diffMs = matchDateTime.getTime() - Date.now()
    if (diffMs < 0) return ''
    const diffMin = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMin / 60)
    if (diffHours > 0) return `${diffHours}h${diffMin % 60 ? ` ${diffMin % 60}min` : ''}`
    return `${diffMin}min`
  } catch { return '' }
}

interface MatchData {
  match: string
  league: string
  date: string
  time: string
  matchSemantic?: string
  homeLogo: string
  awayLogo: string
  btts: { prediction: string; confidence: number } | null
  over25: { prediction: string; confidence: number } | null
}

// ─── Team Logo ──────────────────────────────────────────────────────────
function TeamLogo({ src, name, size = 40 }: { src?: string; name: string; size?: number }) {
  const [imgError, setImgError] = useState(false)
  const initials = name?.slice(0, 3).toUpperCase() || '?'

  if (!src || imgError) {
    return (
      <div
        className="rounded-lg bg-gradient-to-br from-gold/10 to-midnight/40 border border-gold/15 flex items-center justify-center text-gold/70 font-bold flex-shrink-0"
        style={{ width: size, height: size, fontSize: size * 0.3 }}
      >
        {initials}
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={name}
      className="rounded-lg object-contain flex-shrink-0 border border-edge/40 bg-white/5"
      style={{ width: size, height: size }}
      loading="lazy"
      onError={() => setImgError(true)}
    />
  )
}

// ─── Prediction Pill ────────────────────────────────────────────────────
function PredictionPill({ type, prediction, confidence }: { type: string; prediction: string; confidence: number }) {
  const isBtts = type === 'BTTS'
  const isPositive = prediction === 'Oui'
  const color = isBtts
    ? (isPositive ? 'gold' : 'rose')
    : (isPositive ? 'mint' : 'rose')

  const styles: Record<string, string> = {
    gold: 'bg-gold/10 border-gold/30 text-gold',
    mint: 'bg-success/10 border-success/30 text-success',
    rose: 'bg-lose/10 border-lose/30 text-lose',
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${styles[color]} text-xs font-bold`}>
      <span className="text-[10px] uppercase tracking-wider opacity-80">{isBtts ? 'BTTS' : 'O2.5'}</span>
      <span>{prediction}</span>
      <span className="text-[10px] opacity-60 tabular-nums">{confidence}%</span>
    </div>
  )
}

// ─── Match Card (Premium) ───────────────────────────────────────────────
function MatchCard({ match, index }: { match: MatchData; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const teams = match.match.split(/\s+vs?\s+/i)
  const home = teams[0]?.trim() || ''
  const away = teams[1]?.trim() || ''
  const homeLogo = match.homeLogo || resolveTeamLogo(home)
  const awayLogo = match.awayLogo || resolveTeamLogo(away)

  const status = getMatchStatus(match.date, match.time)
  const timeUntil = getTimeUntil(match.date, match.time)
  const dateLabel = formatDateShort(match.date)

  const avgConfidence = Math.round(
    ((match.btts?.confidence || 0) + (match.over25?.confidence || 0)) /
    ((match.btts ? 1 : 0) + (match.over25 ? 1 : 0) || 1)
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
      variants={cardHoverLift}
      whileHover="hover"
      onClick={() => setExpanded(e => !e)}
      className="pred-card cursor-pointer group"
    >
      {/* Live badge if live */}
      {status === 'live' && (
        <div className="absolute top-2 right-2 z-10">
          <span className="badge badge-mint badge-pulse text-[9px]">
            <span className="v31-ticker-dot" /> LIVE
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 mb-3">
        {/* Time/Date block */}
        <div className="flex-shrink-0 text-center min-w-[48px]">
          {status === 'live' ? (
            <>
              <div className="text-[9px] text-success/60 uppercase tracking-widest font-bold">En cours</div>
              <div className="text-success font-bold text-xs font-mono">LIVE</div>
            </>
          ) : status === 'upcoming' && timeUntil ? (
            <>
              <div className="text-[9px] text-gold/60 uppercase tracking-widest font-bold">Dans</div>
              <div className="text-gold font-bold text-xs font-mono tabular-nums">{timeUntil}</div>
            </>
          ) : (
            <>
              <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">{dateLabel}</div>
              <div className="text-white font-bold text-xs font-mono tabular-nums">{match.time || '--:--'}</div>
            </>
          )}
        </div>

        <div className="w-px h-12 bg-edge flex-shrink-0" />

        {/* Teams */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <TeamLogo src={homeLogo} name={home} size={28} />
            <span className="text-white text-sm font-semibold truncate">{home}</span>
          </div>
          <div className="flex items-center gap-2">
            <TeamLogo src={awayLogo} name={away} size={28} />
            <span className="text-white text-sm font-semibold truncate">{away}</span>
          </div>
        </div>

        {/* League + confidence */}
        <div className="flex-shrink-0 text-right hidden sm:block">
          <div className="text-[10px] text-gray-500 truncate max-w-[100px]">{match.league}</div>
          <div className="text-[10px] text-gold/70 font-bold tabular-nums mt-1">{avgConfidence}%</div>
        </div>
      </div>

      {/* Predictions */}
      <div className="flex flex-wrap gap-1.5">
        {match.btts && <PredictionPill type="BTTS" prediction={match.btts.prediction} confidence={match.btts.confidence} />}
        {match.over25 && <PredictionPill type="O2.5" prediction={match.over25.prediction} confidence={match.over25.confidence} />}
      </div>

      {/* Confidence bar */}
      <div className="confidence-bar mt-3">
        <div className="confidence-bar-fill" style={{ width: `${avgConfidence}%` }} />
      </div>

      {/* Expanded: CTA */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-edge/40">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Parier sur ce match</div>
                <span className="text-[10px] text-gold/60">Code promo VISION221</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <PremiumButton variant="linebet" href={AFFILIATE.linebet} size="sm" fullWidth>
                  Linebet
                </PremiumButton>
                <PremiumButton variant="star888" href={AFFILIATE.star888} size="sm" fullWidth>
                  888starz
                </PremiumButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Date Group Header ──────────────────────────────────────────────────
function DateGroupHeader({ label, count, color }: { label: string; count: number; color: 'gold' | 'mint' | 'neutral' }) {
  const colorClass = color === 'gold' ? 'text-gold' : color === 'mint' ? 'text-success' : 'text-gray-400'
  return (
    <div className="flex items-center gap-3 mb-3 mt-5 first:mt-0">
      <span className={`text-sm font-bold ${colorClass}`}>{label}</span>
      <span className="text-[10px] text-gray-500 tabular-nums">({count})</span>
      <div className="flex-1 h-px bg-edge/40" />
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────
export default function FreePredictions() {
  const [ref, isVisible] = useScrollAnimation()
  const [matches, setMatches] = useState<MatchData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeLeague, setActiveLeague] = useState<string>('all')

  const [totalRef, totalDisplay] = useCountUp(0, 1200, { threshold: 0.3 })
  const [bttsRef, bttsDisplay] = useCountUp(0, 1200, { threshold: 0.3 })
  const [o25Ref, o25Display] = useCountUp(0, 1200, { threshold: 0.3 })

  useEffect(() => {
    fetch('/predictions.json')
      .then(r => r.json())
      .then(data => {
        if (!data?.predictions) return
        const matchMap = new Map<string, MatchData>()
        for (const p of data.predictions) {
          // Skip finished matches — only show live + upcoming
          const status = getMatchStatus(p.date, p.time)
          if (status === 'finished') continue

          const key = p.matchSemantic || p.match
          if (!matchMap.has(key)) {
            matchMap.set(key, {
              match: p.match,
              league: p.league,
              date: p.date,
              time: p.time || '--:--',
              matchSemantic: p.matchSemantic,
              homeLogo: p.homeLogo || '',
              awayLogo: p.awayLogo || '',
              btts: null,
              over25: null,
            })
          }
          const m = matchMap.get(key)!
          if (p.type === 'BTTS') m.btts = { prediction: p.prediction, confidence: p.confidence }
          else if (p.type.includes('Over')) m.over25 = { prediction: p.prediction, confidence: p.confidence }
        }
        const all = [...matchMap.values()]
          .sort((a, b) => {
            // Live first, then by date+time
            const sa = getMatchStatus(a.date, a.time)
            const sb = getMatchStatus(b.date, b.time)
            if (sa === 'live' && sb !== 'live') return -1
            if (sb === 'live' && sa !== 'live') return 1
            const da = `${a.date}T${a.time || '23:59'}`
            const db = `${b.date}T${b.time || '23:59'}`
            return da.localeCompare(db)
          })
        setMatches(all)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const leagues = useMemo(() => {
    const set = new Set<string>()
    matches.forEach(m => set.add(m.league))
    return ['all', ...Array.from(set).slice(0, 8)]
  }, [matches])

  const filteredMatches = useMemo(() => {
    if (activeLeague === 'all') return matches
    return matches.filter(m => m.league === activeLeague)
  }, [matches, activeLeague])

  const dateGroups = useMemo(() => {
    return {
      today: filteredMatches.filter(m => getDateGroup(m.date) === 'today'),
      tomorrow: filteredMatches.filter(m => getDateGroup(m.date) === 'tomorrow'),
      upcoming: filteredMatches.filter(m => getDateGroup(m.date) === 'upcoming'),
    }
  }, [filteredMatches])

  // Count stats
  useEffect(() => {
    if (matches.length === 0) return
    const total = matches.length
    const btts = matches.filter(m => m.btts).length
    const o25 = matches.filter(m => m.over25).length
    setTimeout(() => {
      // @ts-expect-error count-up library
      if (totalRef?.current) totalRef.current = total
      // @ts-expect-error count-up library
      if (bttsRef?.current) bttsRef.current = btts
      // @ts-expect-error count-up library
      if (o25Ref?.current) o25Ref.current = o25
    }, 100)
  }, [matches, totalRef, bttsRef, o25Ref])

  return (
    <section ref={ref} id="free-predictions" className="section-pad pt-4 sm:pt-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <AIBrain size={36} />
                <div className="flex items-center gap-2">
                  <span className="badge badge-mint badge-pulse">
                    <span className="v31-ticker-dot" /> Live
                  </span>
                  <span className="eyebrow">IA en direct</span>
                </div>
              </div>
              <h2 className="section-title">
                Pronostics <span className="text-gold">IA</span> Gratuits
              </h2>
              <p className="section-subtitle mt-1">
                Sélection quotidienne — matchs des 7 prochains jours
              </p>
            </div>

            {/* Stats card */}
            <div className="flex items-center gap-3 bg-panel/70 border border-edge rounded-xl px-4 py-2.5 backdrop-blur-sm">
              <div>
                <div className="text-lg font-bold text-white tabular-nums">{matches.length}</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Matchs</div>
              </div>
              <div className="w-px h-8 bg-edge" />
              <div>
                <div className="text-lg font-bold text-gold tabular-nums">
                  {matches.filter(m => m.btts).length}
                </div>
                <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">BTTS</div>
              </div>
              <div className="w-px h-8 bg-edge" />
              <div>
                <div className="text-lg font-bold text-success tabular-nums">
                  {matches.filter(m => m.over25).length}
                </div>
                <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">O2.5</div>
              </div>
            </div>
          </div>

          {/* League filters */}
          <motion.div variants={staggerChildFadeUp} className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
            {leagues.map(league => (
              <motion.button
                key={league}
                variants={subtleHover}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setActiveLeague(league)}
                className={`flex-shrink-0 px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold transition-all ${
                  activeLeague === league
                    ? 'bg-gold/10 text-gold border border-gold/30'
                    : 'bg-panel/40 text-gray-500 border border-edge hover:text-gray-300 hover:border-edge-light'
                }`}
              >
                {league === 'all' ? 'Tous' : league}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="space-y-2 py-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="pred-card animate-pulse h-24" />
            ))}
          </div>
        ) : (
          <>
            {dateGroups.today.length > 0 && (
              <>
                <DateGroupHeader label="Aujourd'hui" count={dateGroups.today.length} color="mint" />
                <div className="grid sm:grid-cols-2 gap-3">
                  {dateGroups.today.map((m, i) => <MatchCard key={`${m.match}-${m.date}-${m.time}`} match={m} index={i} />)}
                </div>
              </>
            )}
            {dateGroups.tomorrow.length > 0 && (
              <>
                <DateGroupHeader label="Demain" count={dateGroups.tomorrow.length} color="gold" />
                <div className="grid sm:grid-cols-2 gap-3">
                  {dateGroups.tomorrow.map((m, i) => <MatchCard key={`${m.match}-${m.date}-${m.time}`} match={m} index={i} />)}
                </div>
              </>
            )}
            {dateGroups.upcoming.length > 0 && (
              <>
                <DateGroupHeader label="À venir" count={dateGroups.upcoming.length} color="neutral" />
                <div className="grid sm:grid-cols-2 gap-3">
                  {dateGroups.upcoming.map((m, i) => <MatchCard key={`${m.match}-${m.date}-${m.time}`} match={m} index={i} />)}
                </div>
              </>
            )}
          </>
        )}

        <p className="text-center text-[11px] text-gray-600 mt-6">
          Pronostics générés par IA — modèles Poisson calibrés sur 50 000+ matchs. Aucune garantie future.
        </p>
      </div>
    </section>
  )
}
