import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollAnimation } from '../../hooks/useAnimations'
import { AFFILIATE } from '../../data/constants'
import { resolveTeamLogo } from '../../utils/teamLogos'

// ─── V20: Team Logo Component with fallback to initials ───
function TeamLogo({ src, initials, size = 'sm', color = 'emerald' }) {
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const sizeClasses = {
    xs: 'w-5 h-5 text-[8px]',
    sm: 'w-7 h-7 sm:w-8 sm:h-8 text-[10px] sm:text-xs',
    md: 'w-10 h-10 sm:w-12 sm:h-12 text-xs sm:text-sm',
    lg: 'w-12 h-12 text-sm',
  }

  const colorClasses = {
    emerald: 'bg-emerald/8 border-emerald/15 text-emerald',
    royal: 'bg-royal/8 border-royal/15 text-royal',
  }

  const sizeClass = sizeClasses[size] || sizeClasses.sm
  const colorClass = colorClasses[color] || colorClasses.emerald

  // If we have a valid logo URL and it hasn't failed, show the image
  if (src && !imgError) {
    return (
      <div className={`${sizeClass} rounded-lg border flex items-center justify-center overflow-hidden relative ${colorClass}`}>
        <img
          src={src}
          alt={initials}
          className={`w-full h-full object-contain transition-opacity duration-200 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onError={() => setImgError(true)}
          onLoad={() => setImgLoaded(true)}
          loading="lazy"
        />
        {/* Show initials while loading */}
        {!imgLoaded && (
          <span className="absolute font-bold">{initials}</span>
        )}
      </div>
    )
  }

  // Fallback to initials
  return (
    <div className={`${sizeClass} rounded-lg border flex items-center justify-center ${colorClass}`}>
      <span className="font-bold">{initials}</span>
    </div>
  )
}



function formatDateShort(dateStr) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr + 'T12:00:00')
    const day = d.getDate().toString().padStart(2, '0')
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const today = new Date()
    today.setHours(12, 0, 0, 0)
    const matchDate = new Date(dateStr + 'T12:00:00')
    const diffDays = Math.round((matchDate - today) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return `Auj.`
    if (diffDays === 1) return `Dem.`
    const weekdays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
    const weekday = weekdays[d.getDay()]
    return `${weekday} ${day}/${month}`
  } catch {
    return dateStr
  }
}

function getDateLabel(dateStr) {
  if (!dateStr) return 'upcoming'
  const today = new Date()
  today.setHours(12, 0, 0, 0)
  const matchDate = new Date(dateStr + 'T12:00:00')
  const diffDays = Math.round((matchDate - today) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'tomorrow'
  return 'upcoming'
}

// ─── Prediction Badge Component ───
function PredBadge({ type, prediction, expanded }) {
  const isBtts = type === 'BTTS'
  const isPositive = prediction === 'Oui'
  const color = isBtts ? 'emerald' : 'gold'
  const label = isBtts ? 'BTTS' : 'O2.5'

  if (expanded) {
    return (
      <div className={`flex-1 rounded-xl p-3 sm:p-4 border transition-all ${
        isPositive
          ? isBtts
            ? 'bg-emerald/8 border-emerald/20 hover:bg-emerald/12'
            : 'bg-gold/8 border-gold/20 hover:bg-gold/12'
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
                : 'bg-gold/15 text-gold'
              : 'bg-red-500/15 text-red-400'
          }`}>
            {prediction}
          </span>
        </div>
        <div className={`text-lg sm:text-xl font-extrabold ${
          isPositive
            ? isBtts ? 'text-emerald' : 'text-gold'
            : 'text-red-400'
        }`}>
          {isBtts ? 'BTTS' : 'Over 2.5'}
        </div>
        {/* Signal bar */}
        <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isPositive ? '78%' : '25%' }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`h-full rounded-full ${
              isPositive
                ? isBtts
                  ? 'bg-gradient-to-r from-emerald-dark to-emerald'
                  : 'bg-gradient-to-r from-gold-dark to-gold'
                : 'bg-red-500/40'
            }`}
          />
        </div>
      </div>
    )
  }

  // Compact badge
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg ${
      isPositive
        ? isBtts
          ? 'bg-emerald/10 text-emerald border border-emerald/20'
          : 'bg-gold/10 text-gold border border-gold/20'
        : 'bg-red-500/10 text-red-400 border border-red-500/20'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        isPositive
          ? isBtts ? 'bg-emerald' : 'bg-gold'
          : 'bg-red-400'
      }`} />
      {label} {prediction}
    </span>
  )
}

// ─── Single Match Row (Concept C — Hybride Carte-Ligne) ───
function MatchRow({ match, index, isVisible }) {
  const [expanded, setExpanded] = useState(false)

  const teams = match.match ? match.match.split(' vs ') : ['', '']
  const team1 = teams[0]?.trim() || match.match
  const team2 = teams[1]?.trim() || ''
  const initials1 = team1.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const initials2 = team2.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  // V20: Extract logo URLs from match data, with frontend fallback
  const homeLogo = match.homeLogo || resolveTeamLogo(team1)
  const awayLogo = match.awayLogo || resolveTeamLogo(team2)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="relative"
    >
      <motion.div
        layout
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(!expanded) } }}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        className={`relative rounded-xl border cursor-pointer transition-all duration-300 overflow-hidden ${
          expanded
            ? 'bg-panel border-emerald/25 shadow-lg shadow-emerald/5'
            : 'bg-panel/60 border-edge hover:border-emerald/15 hover:bg-panel/80'
        }`}
      >
        {/* Top accent line on expand */}
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

        {/* ── COMPACT ROW ── */}
        <div className="flex items-center gap-3 px-3 sm:px-4 py-3">
          {/* Time + Date badge */}
          <div className="flex-shrink-0 text-center min-w-[44px] sm:min-w-[50px]">
            <div className="text-white font-bold text-sm sm:text-base tabular-nums">{match.time || '--:--'}</div>
            <div className="text-gray-500 text-[10px]">{match.date ? formatDateShort(match.date) : ''}</div>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-edge flex-shrink-0" />

          {/* Team logos face-off — always visible */}
          <div className="flex-shrink-0 flex items-center gap-1.5">
            <TeamLogo src={homeLogo} initials={initials1} size="sm" color="emerald" />
            <span className="text-gray-600 text-[10px] font-bold">VS</span>
            <TeamLogo src={awayLogo} initials={initials2} size="sm" color="royal" />
          </div>

          {/* Match info */}
          <div className="flex-1 min-w-0">
            <div className="text-white font-semibold text-sm truncate">{match.match}</div>
            <div className="text-gray-500 text-[11px] truncate">{match.league}</div>
          </div>

          {/* Prediction badges (compact) */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {match.btts && <PredBadge type="BTTS" prediction={match.btts.prediction} expanded={false} />}
            {match.over25 && <PredBadge type="O2.5" prediction={match.over25.prediction} expanded={false} />}
          </div>

          {/* Expand chevron */}
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

        {/* ── EXPANDED CARD ── */}
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
                {/* Teams face-to-face — larger */}
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

                {/* Prediction cards */}
                <div className="flex gap-3 mb-4">
                  {match.btts && <PredBadge type="BTTS" prediction={match.btts.prediction} expanded={true} />}
                  {match.over25 && <PredBadge type="O2.5" prediction={match.over25.prediction} expanded={true} />}
                  {!match.btts && !match.over25 && (
                    <div className="flex-1 text-center text-gray-500 text-sm py-4">
                      Aucune prédiction disponible
                    </div>
                  )}
                </div>

                {/* CTA Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse" />
                    <span className="text-[10px] text-gray-500">IA BttsBet</span>
                  </div>
                  <a
                    href={AFFILIATE.linebet}
                    rel={AFFILIATE.rel}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-2 bg-gradient-to-r from-emerald to-emerald-dark text-midnight font-bold rounded-lg text-xs hover:shadow-lg hover:shadow-emerald/20 transition-all hover:brightness-110"
                  >
                    Parier sur Linebet
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

// ─── Date Group Header ───
const DATE_GROUP_STYLES = {
  emerald: {
    line: 'bg-emerald/15',
    text: 'text-emerald',
    badge: 'bg-emerald/10 text-emerald',
  },
  gold: {
    line: 'bg-gold/15',
    text: 'text-gold',
    badge: 'bg-gold/10 text-gold',
  },
  royal: {
    line: 'bg-royal/15',
    text: 'text-royal',
    badge: 'bg-royal/10 text-royal',
  },
}

function DateGroupHeader({ label, count, color = 'emerald' }) {
  const s = DATE_GROUP_STYLES[color] || DATE_GROUP_STYLES.emerald
  return (
    <div className="flex items-center gap-3 mt-6 mb-3 first:mt-0">
      <div className={`h-px flex-1 ${s.line}`} />
      <div className={`flex items-center gap-2 ${s.text}`}>
        <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
        <span className={`text-[10px] ${s.badge} font-bold px-2 py-0.5 rounded-full`}>
          {count}
        </span>
      </div>
      <div className={`h-px flex-1 ${s.line}`} />
    </div>
  )
}

// ─── Main FreePredictions Component ───
export default function FreePredictions() {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeLeague, setActiveLeague] = useState('all')
  const [ref, isVisible] = useScrollAnimation()

  const loadPredictions = (retryCount = 0) => {
    setLoading(true)
    setError(null)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    fetch(`/predictions.json?t=${Date.now()}`, { cache: 'no-store', signal: controller.signal })
      .then((r) => {
        clearTimeout(timeout)
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data) => {
        if (data && data.predictions) {
          setPredictions(data.predictions)
        } else {
          throw new Error('Empty data')
        }
        setLoading(false)
      })
      .catch((err) => {
        clearTimeout(timeout)
        console.warn('Predictions fetch failed:', err.message)

        // Auto-retry once
        if (retryCount < 1) {
          setTimeout(() => loadPredictions(retryCount + 1), 1500)
          return
        }

        setPredictions([])
        setError('Impossible de charger les pronostics.')
        setLoading(false)
      })
  }

  useEffect(() => {
    loadPredictions()
  }, [])

  // Group predictions by match
  const groupedPredictions = useMemo(() => {
    return predictions.reduce((groups, p) => {
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

  // Extract unique leagues
  const leagues = useMemo(() => {
    const leagueSet = new Set(matchList.map(m => m.league).filter(Boolean))
    return ['all', ...Array.from(leagueSet).slice(0, 6)]
  }, [matchList])

  // Filter by league
  const filteredMatches = useMemo(() => {
    if (activeLeague === 'all') return matchList
    return matchList.filter(m => m.league === activeLeague)
  }, [matchList, activeLeague])

  // Group by date
  const dateGroups = useMemo(() => {
    const groups = { today: [], tomorrow: [], upcoming: [] }
    filteredMatches.forEach(m => {
      const label = getDateLabel(m.date)
      groups[label].push(m)
    })
    return groups
  }, [filteredMatches])

  // Stats
  const stats = useMemo(() => {
    const bttsOui = matchList.filter(m => m.btts?.prediction === 'Oui').length
    const o25Oui = matchList.filter(m => m.over25?.prediction === 'Oui').length
    return { total: matchList.length, bttsOui, o25Oui }
  }, [matchList])

  return (
    <section ref={ref} id="free-predictions" className="py-10 sm:py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* ── Dashboard Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>
                PRONOSTICS <span className="text-emerald">IA</span>
              </h2>
              <p className="text-gray-400 text-sm">Sélection IA — matchs des 7 prochains jours</p>
            </div>
            {/* Mini stats */}
            <div className="flex items-center gap-4 bg-panel/60 border border-edge rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse" />
                <span className="text-xs text-gray-400"><span className="text-white font-bold">{stats.total}</span> matchs</span>
              </div>
              <div className="w-px h-4 bg-edge" />
              <div className="text-xs text-gray-400"><span className="text-emerald font-bold">{stats.bttsOui}</span> BTTS</div>
              <div className="w-px h-4 bg-edge" />
              <div className="text-xs text-gray-400"><span className="text-gold font-bold">{stats.o25Oui}</span> O2.5</div>
            </div>
          </div>

          {/* ── League Filter Tabs ── */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {leagues.map((league) => (
              <button
                key={league}
                onClick={() => setActiveLeague(league)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeLeague === league
                    ? 'bg-emerald/15 text-emerald border border-emerald/25'
                    : 'bg-panel/40 text-gray-500 border border-edge hover:text-gray-300 hover:border-edge-light'
                }`}
              >
                {league === 'all' ? 'Tous' : league}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Match List ── */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-10 h-10 border-2 border-emerald/30 border-t-emerald rounded-full animate-spin" />
            <p className="text-gray-500 text-sm mt-4">Chargement des pronostics...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="glass-3d rounded-2xl p-8 max-w-sm mx-auto">
              <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF3D71" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <p className="text-red-400 text-sm mb-3">{error}</p>
              <button onClick={loadPredictions} className="px-4 py-2 bg-emerald/15 text-emerald font-bold rounded-lg text-xs hover:bg-emerald/25 transition-all">
                Réessayer
              </button>
            </div>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="text-center py-16">
            <div className="glass-3d rounded-2xl p-8 max-w-sm mx-auto">
              <div className="w-14 h-14 bg-edge rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
                </svg>
              </div>
              <p className="text-gray-400 text-sm">Aucun pronostic disponible. Revenez demain !</p>
            </div>
          </div>
        ) : (
          <div>
            {/* Today */}
            {dateGroups.today.length > 0 && (
              <>
                <DateGroupHeader label="Aujourd'hui" count={dateGroups.today.length} color="emerald" />
                <div className="space-y-2">
                  {dateGroups.today.map((m, i) => (
                    <MatchRow key={`${m.match}-${m.date}-${m.time}`} match={m} index={i} isVisible={isVisible} />
                  ))}
                </div>
              </>
            )}
            {/* Tomorrow */}
            {dateGroups.tomorrow.length > 0 && (
              <>
                <DateGroupHeader label="Demain" count={dateGroups.tomorrow.length} color="gold" />
                <div className="space-y-2">
                  {dateGroups.tomorrow.map((m, i) => (
                    <MatchRow key={`${m.match}-${m.date}-${m.time}`} match={m} index={i} isVisible={isVisible} />
                  ))}
                </div>
              </>
            )}
            {/* Upcoming */}
            {dateGroups.upcoming.length > 0 && (
              <>
                <DateGroupHeader label="À venir" count={dateGroups.upcoming.length} color="royal" />
                <div className="space-y-2">
                  {dateGroups.upcoming.map((m, i) => (
                    <MatchRow key={`${m.match}-${m.date}-${m.time}`} match={m} index={i} isVisible={isVisible} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Footer note */}
        <div className="text-center mt-6">
          <p className="text-[11px] text-gray-600">
            Pronostics générés par IA — dates réelles des matchs vérifiées
          </p>
        </div>
      </div>
    </section>
  )
}
