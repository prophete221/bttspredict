'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollAnimation, useRevealOnScroll, useCountUp } from '@/hooks/useAnimations'
import { AFFILIATE } from '@/lib/constants'
import { resolveTeamLogo } from '@/lib/teamLogos'

function TeamLogo({ src, initials, size = 'sm', color = 'emerald' }: {
  src: string; initials: string; size?: string; color?: string
}) {
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const sizeClasses: Record<string, string> = {
    xs: 'w-5 h-5 text-[8px]',
    sm: 'w-7 h-7 sm:w-8 sm:h-8 text-[10px] sm:text-xs',
    md: 'w-10 h-10 sm:w-12 sm:h-12 text-xs sm:text-sm',
    lg: 'w-12 h-12 text-sm',
  }

  const colorClasses: Record<string, string> = {
    emerald: 'bg-emerald/8 border-emerald/15 text-emerald',
    royal: 'bg-royal/8 border-royal/15 text-royal',
  }

  const sizeClass = sizeClasses[size] || sizeClasses.sm
  const colorClass = colorClasses[color] || colorClasses.emerald

  if (src && !imgError) {
    return (
      <div className={`${sizeClass} rounded-lg border flex items-center justify-center overflow-hidden relative ${colorClass}`}>
        <img
          src={src}
          alt={initials}
          className={`v31-logo-zoom w-full h-full object-contain transition-opacity duration-200 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onError={() => setImgError(true)}
          onLoad={() => setImgLoaded(true)}
          loading="lazy"
        />
        {!imgLoaded && (
          <span className="absolute font-bold">{initials}</span>
        )}
      </div>
    )
  }

  return (
    <div className={`${sizeClass} rounded-lg border flex items-center justify-center ${colorClass}`}>
      <span className="font-bold">{initials}</span>
    </div>
  )
}

function formatDateShort(dateStr: string) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr + 'T12:00:00')
    const day = d.getDate().toString().padStart(2, '0')
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const today = new Date()
    today.setHours(12, 0, 0, 0)
    const matchDate = new Date(dateStr + 'T12:00:00')
    const diffDays = Math.round((matchDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return `Auj.`
    if (diffDays === 1) return `Dem.`
    const weekdays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
    const weekday = weekdays[d.getDay()]
    return `${weekday} ${day}/${month}`
  } catch {
    return dateStr
  }
}

function getDateLabel(dateStr: string) {
  if (!dateStr) return 'upcoming'
  const today = new Date()
  today.setHours(12, 0, 0, 0)
  const matchDate = new Date(dateStr + 'T12:00:00')
  const diffDays = Math.round((matchDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'tomorrow'
  return 'upcoming'
}

function PredBadge({ type, prediction, expanded }: { type: string; prediction: string; expanded: boolean }) {
  const isBtts = type === 'BTTS'
  const isPositive = prediction === 'Oui'

  if (expanded) {
    return (
      <div className={`flex-1 rounded-xl p-3 sm:p-4 border transition-all ${
        isPositive
          ? isBtts
            ? 'bg-emerald/8 border-emerald/20 hover:bg-emerald/12'
            : 'bg-success/8 border-success/20 hover:bg-success/12'
          : 'bg-red-500/5 border-red-500/15 hover:bg-red-500/8'
      }`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-semibold">
            {isBtts ? 'Les deux marquent' : 'Plus de 2.5 buts'}
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            isPositive
              ? isBtts
                ? 'bg-emerald/15 text-emerald'
                : 'bg-success/15 text-success-light'
              : 'bg-red-500/15 text-red-400'
          }`}>
            {prediction}
          </span>
        </div>
        <div className={`text-lg sm:text-xl font-extrabold ${
          isPositive
            ? isBtts ? 'text-emerald' : 'text-success-light'
            : 'text-red-400'
        }`}>
          {isBtts ? 'BTTS' : 'Over 2.5'}
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isPositive ? '78%' : '25%' }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`h-full rounded-full ${
              isPositive
                ? isBtts
                  ? 'bg-gradient-to-r from-emerald-dark to-emerald'
                  : 'bg-gradient-to-r from-success-dark to-success'
                : 'bg-red-500/40'
            }`}
          />
        </div>
      </div>
    )
  }

  // Compact badge — BTTS = cyan badge-btts, Over 2.5 = green badge-over25
  const label = isBtts ? 'BTTS' : 'O2.5'
  if (!isBtts && !isPositive) {
    return (
      <span className="v31-badge-pulse inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
        {label} {prediction}
      </span>
    )
  }
  return (
    <span className={`v31-badge-pulse ${isBtts ? 'badge-btts' : 'badge-over25'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        isPositive
          ? isBtts ? 'bg-emerald' : 'bg-success'
          : 'bg-red-400'
      }`} />
      {label} {prediction}
    </span>
  )
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

function MatchRow({ match, index }: { match: MatchData; index: number }) {
  const [expanded, setExpanded] = useState(false)
  // Per-card scroll reveal — each card animates independently as user scrolls
  const [revealRef, isCardVisible] = useRevealOnScroll(0.1, 'fade-up')

  const teams = match.match ? match.match.split(' vs ') : ['', '']
  const team1 = teams[0]?.trim() || match.match
  const team2 = teams[1]?.trim() || ''
  const initials1 = team1.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const initials2 = team2.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const homeLogo = match.homeLogo || resolveTeamLogo(team1)
  const awayLogo = match.awayLogo || resolveTeamLogo(team2)

  return (
    <motion.div
      ref={revealRef}
      initial={false}
      animate={isCardVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.03, 0.18), ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <motion.div
        layout
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(!expanded) } }}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        className={`v31-data-stream v31-card-hover-glow relative rounded-xl border cursor-pointer transition-all duration-300 overflow-hidden ${
          expanded
            ? 'bg-gradient-to-b from-panel-2 to-panel border-emerald/30 shadow-lg shadow-emerald/8'
            : 'bg-gradient-to-b from-panel/80 to-panel/60 border-edge hover:border-emerald/40'
        }`}
      >
        {/* Premium top sheen */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald via-gold to-emerald origin-left"
            />
          )}
        </AnimatePresence>

        {/* COMPACT ROW — with micro-icons */}
        <div className="flex items-center gap-3 px-3 sm:px-4 py-3">
          <div className="flex-shrink-0 text-center min-w-[44px] sm:min-w-[50px]">
            <div className="flex items-center justify-center gap-1 text-white font-bold text-sm sm:text-base tabular-nums">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald/60" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              {match.time || '--:--'}
            </div>
            <div className="text-gray-500 text-[10px]">{match.date ? formatDateShort(match.date) : ''}</div>
          </div>

          <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent flex-shrink-0 hidden sm:block" />

          {/* Teams layout - stacked on mobile */}
          <div className="flex-1 min-w-0">
            {/* Mobile: show stacked teams */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
              <div className="flex items-center gap-1.5">
                <TeamLogo src={homeLogo} initials={initials1} size="sm" color="emerald" />
                <span className="text-white font-semibold text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[150px]">{team1}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-600 text-[10px] font-bold">VS</span>
                <TeamLogo src={awayLogo} initials={initials2} size="sm" color="royal" />
                <span className="text-white font-semibold text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[150px]">{team2}</span>
              </div>
            </div>
            <div className="text-gray-500 text-[10px] sm:text-[11px] truncate flex items-center gap-1 mt-0.5">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600 flex-shrink-0" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
              </svg>
              {match.league}
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {match.btts && <PredBadge type="BTTS" prediction={match.btts.prediction} expanded={false} />}
            {match.over25 && <PredBadge type="O2.5" prediction={match.over25.prediction} expanded={false} />}
          </div>

          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="flex-shrink-0 text-gray-500"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.div>
        </div>

        {/* EXPANDED CARD */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-4 sm:px-4 sm:pb-5 border-t border-edge/50 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1 text-center">
                    <TeamLogo src={homeLogo} initials={initials1} size="lg" color="emerald" />
                    <div className="text-white font-semibold text-sm truncate max-w-[110px] sm:max-w-[140px] mx-auto mt-1.5">
                      {team1}
                    </div>
                  </div>

                  <div className="flex-shrink-0 px-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <span className="text-gray-400 text-xs font-bold">VS</span>
                    </div>
                  </div>

                  <div className="flex-1 text-center">
                    <TeamLogo src={awayLogo} initials={initials2} size="lg" color="royal" />
                    <div className="text-white font-semibold text-sm truncate max-w-[110px] sm:max-w-[140px] mx-auto mt-1.5">
                      {team2}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mb-4">
                  {match.btts && <PredBadge type="BTTS" prediction={match.btts.prediction} expanded={true} />}
                  {match.over25 && <PredBadge type="O2.5" prediction={match.over25.prediction} expanded={true} />}
                  {!match.btts && !match.over25 && (
                    <div className="flex-1 text-center text-gray-500 text-sm py-4">
                      Aucune prédiction disponible
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse" />
                    <span className="text-[10px] text-gray-500">IA BttsBet</span>
                  </div>
                  {/* V23: Deux boutons côte à côte — Linebet + 888starz */}
                  <div className="flex items-center gap-1.5">
                    <a
                      href={AFFILIATE.linebet}
                      rel={AFFILIATE.rel}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="v31-cta-wave flex items-center gap-1.5 px-2.5 py-2 btn-linebet text-[#06281F] text-xs"
                      style={{ ['--v31-wave-delay' as string]: '2s' }}
                      data-cursor="hover"
                    >
                      <img src="/logos/linebet-icon.svg" alt="Linebet" className="w-4 h-4 rounded object-contain flex-shrink-0" loading="lazy"/>
                      Linebet
                    </a>
                    <a
                      href={AFFILIATE.star888}
                      rel={AFFILIATE.rel}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="v31-cta-wave flex items-center gap-1.5 px-2.5 py-2 btn-star888 text-white text-xs"
                      style={{ ['--v31-wave-delay' as string]: '6s' }}
                      data-cursor="hover"
                    >
                      <img src="/logos/888starz-icon.svg" alt="888starz" className="w-4 h-4 rounded object-contain flex-shrink-0" loading="lazy"/>
                      888starz
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

const DATE_GROUP_STYLES: Record<string, { line: string; text: string; badge: string; dot: string }> = {
  emerald: { line: 'bg-gradient-to-r from-transparent via-emerald/25 to-transparent', text: 'text-emerald', badge: 'bg-emerald/10 text-emerald border border-emerald/20', dot: 'bg-emerald' },
  gold: { line: 'bg-gradient-to-r from-transparent via-gold/25 to-transparent', text: 'text-gold', badge: 'bg-gold/10 text-gold border border-gold/20', dot: 'bg-gold' },
  royal: { line: 'bg-gradient-to-r from-transparent via-royal/25 to-transparent', text: 'text-royal', badge: 'bg-royal/10 text-royal border border-royal/20', dot: 'bg-royal' },
}

function DateGroupHeader({ label, count, color = 'emerald' }: { label: string; count: number; color?: string }) {
  const s = DATE_GROUP_STYLES[color] || DATE_GROUP_STYLES.emerald
  return (
    <div className="flex items-center gap-3 mt-6 mb-3 first:mt-0">
      <div className={`h-px flex-1 ${s.line}`} />
      <div className={`flex items-center gap-2 ${s.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
        <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
        <span className={`text-[10px] ${s.badge} font-bold px-2 py-0.5 rounded-full`}>
          {count}
        </span>
      </div>
      <div className={`h-px flex-1 ${s.line}`} />
    </div>
  )
}

interface Prediction {
  match: string
  league: string
  date: string
  time: string
  type: string
  prediction: string
  confidence: number
  matchSemantic?: string
  homeLogo?: string
  awayLogo?: string
}

export default function FreePredictions() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeLeague, setActiveLeague] = useState('all')
  const [ref, isVisible] = useScrollAnimation()

  useEffect(() => {
    fetch('/predictions.json')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data) => {
        setPredictions(data.predictions || [])
        setLoading(false)
      })
      .catch(() => {
        setPredictions([])
        setError('Impossible de charger les pronostics. Réessayez plus tard.')
        setLoading(false)
      })
  }, [])

  const groupedPredictions = useMemo(() => {
    return predictions.reduce<Record<string, MatchData>>((groups, p) => {
      const key = `${p.match}|${p.date || ''}|${p.time || ''}`
      if (!groups[key]) {
        groups[key] = {
          match: p.match,
          league: p.league,
          date: p.date,
          time: p.time,
          matchSemantic: p.matchSemantic,
          homeLogo: p.homeLogo || '',
          awayLogo: p.awayLogo || '',
          btts: null,
          over25: null,
        }
      }
      if (p.type === 'BTTS') {
        groups[key].btts = { prediction: p.prediction, confidence: p.confidence }
      } else if (p.type === 'Over 2.5') {
        groups[key].over25 = { prediction: p.prediction, confidence: p.confidence }
      }
      return groups
    }, {})
  }, [predictions])

  const matchList = useMemo(() => Object.values(groupedPredictions), [groupedPredictions])

  const leagues = useMemo(() => {
    const leagueSet = new Set(matchList.map(m => m.league).filter(Boolean))
    return ['all', ...Array.from(leagueSet).slice(0, 6)]
  }, [matchList])

  const filteredMatches = useMemo(() => {
    if (activeLeague === 'all') return matchList
    return matchList.filter(m => m.league === activeLeague)
  }, [matchList, activeLeague])

  const dateGroups = useMemo(() => {
    const groups: Record<string, MatchData[]> = { today: [], tomorrow: [], upcoming: [] }
    filteredMatches.forEach(m => {
      const label = getDateLabel(m.date)
      groups[label].push(m)
    })
    return groups
  }, [filteredMatches])

  const stats = useMemo(() => {
    const bttsOui = matchList.filter(m => m.btts?.prediction === 'Oui').length
    const o25Oui = matchList.filter(m => m.over25?.prediction === 'Oui').length
    return { total: matchList.length, bttsOui, o25Oui }
  }, [matchList])

  // Count-up animations for stats — only mount after predictions are loaded so
  // the hook receives the correct target value.
  const totalStats = !loading ? stats.total : 0
  const bttsStats = !loading ? stats.bttsOui : 0
  const o25Stats = !loading ? stats.o25Oui : 0
  const [totalRef, totalDisplay] = useCountUp(totalStats, 1200, { threshold: 0.3 })
  const [bttsRef, bttsDisplay] = useCountUp(bttsStats, 1400, { threshold: 0.3 })
  const [o25Ref, o25Display] = useCountUp(o25Stats, 1400, { threshold: 0.3 })

  return (
    <section ref={ref} id="free-predictions" className="py-10 sm:py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className={`mb-6 stagger-reveal ${isVisible ? 'is-visible' : ''}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-px bg-gradient-to-r from-emerald to-transparent" />
                <span className="text-[10px] font-bold text-emerald uppercase tracking-widest">Live Predictions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1 tracking-tight">
                <span className="v31-scan-laser">PRONOSTICS <span className="text-emerald neon-glow">IA</span></span>
              </h2>
              <p className="text-gray-500 text-sm">Sélection IA — matchs des 7 prochains jours</p>
            </div>
            <div className="flex items-center gap-4 bg-panel/70 border border-edge rounded-xl px-4 py-2.5 backdrop-blur-sm v31-ia-glow">
              <div className="flex items-center gap-1.5">
                <span className="v31-pulse-ring relative flex w-1.5 h-1.5">
                  <span className="absolute inset-0 bg-emerald rounded-full animate-ping opacity-75" />
                  <span className="relative w-1.5 h-1.5 bg-emerald rounded-full" />
                </span>
                <span className="text-xs text-gray-400"><span ref={totalRef} className="text-white font-bold tabular-nums">{totalDisplay}</span> matchs</span>
              </div>
              <div className="w-px h-4 bg-edge" />
              <div className="text-xs text-gray-400"><span ref={bttsRef} className="text-emerald font-bold tabular-nums">{bttsDisplay}</span> BTTS</div>
              <div className="w-px h-4 bg-edge" />
              <div className="text-xs text-gray-400"><span ref={o25Ref} className="text-success-light font-bold tabular-nums">{o25Display}</span> O2.5</div>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {leagues.map((league) => (
              <button
                key={league}
                onClick={() => setActiveLeague(league)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeLeague === league
                    ? 'bg-emerald/12 text-emerald border border-emerald/30 shadow-sm shadow-emerald/10'
                    : 'bg-panel/40 text-gray-500 border border-edge hover:text-gray-300 hover:border-edge-light'
                }`}
              >
                {league === 'all' ? 'Tous' : league}
              </button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-10 h-10 border-2 border-emerald/30 border-t-emerald rounded-full animate-spin" />
            <p className="text-gray-500 text-sm mt-4">Chargement des pronostics...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="glass-3d rounded-2xl p-8 max-w-sm mx-auto border border-red-500/20">
              <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF4D6D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <p className="text-red-400 text-sm mb-3">{error}</p>
              <button onClick={() => window.location.reload()} className="text-xs text-gray-500 underline hover:text-gray-300">Rafraîchir la page</button>
            </div>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="text-center py-16">
            <div className="glass-3d rounded-2xl p-8 max-w-sm mx-auto">
              <div className="w-14 h-14 bg-white/[0.04] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/[0.06]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
                </svg>
              </div>
              <p className="text-gray-400 text-sm">Aucun pronostic disponible. Revenez demain !</p>
            </div>
          </div>
        ) : (
          <div>
            {dateGroups.today.length > 0 && (
              <>
                <DateGroupHeader label="Aujourd'hui" count={dateGroups.today.length} color="emerald" />
                <div className="space-y-2">
                  {dateGroups.today.map((m, i) => (
                    <MatchRow key={`${m.match}-${m.date}-${m.time}`} match={m} index={i} />
                  ))}
                </div>
              </>
            )}
            {dateGroups.tomorrow.length > 0 && (
              <>
                <DateGroupHeader label="Demain" count={dateGroups.tomorrow.length} color="gold" />
                <div className="space-y-2">
                  {dateGroups.tomorrow.map((m, i) => (
                    <MatchRow key={`${m.match}-${m.date}-${m.time}`} match={m} index={i} />
                  ))}
                </div>
              </>
            )}
            {dateGroups.upcoming.length > 0 && (
              <>
                <DateGroupHeader label="À venir" count={dateGroups.upcoming.length} color="royal" />
                <div className="space-y-2">
                  {dateGroups.upcoming.map((m, i) => (
                    <MatchRow key={`${m.match}-${m.date}-${m.time}`} match={m} index={i} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-[11px] text-gray-600">
            Pronostics générés par IA — dates réelles des matchs vérifiées
          </p>
        </div>
      </div>
    </section>
  )
}
