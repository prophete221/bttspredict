'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useAnimations'
import { AFFILIATE } from '@/lib/constants'
import { staggerContainer, staggerChildFadeUp, subtleHover, badgePulse } from '@/lib/motionPresets'
import { resolveTeamLogo } from '@/lib/teamLogos'
import PremiumButton from './PremiumButton'

// ─── Helpers ────────────────────────────────────────────────────────────
function getMatchStatus(date: string, time?: string): 'live' | 'upcoming' | 'finished' {
  if (!date) return 'finished'
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const matchDay = new Date(date + 'T00:00:00'); matchDay.setHours(0, 0, 0, 0)
    if (matchDay.getTime() < today.getTime()) return 'finished'
    if (matchDay.getTime() > today.getTime()) return 'upcoming'
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

function getTimeUntil(date: string, time?: string): { value: string; label: string } | null {
  if (!date || !time || time === '--:--' || !/^\d{2}:\d{2}$/.test(time)) return null
  try {
    const [h, m] = time.split(':').map(Number)
    const matchDateTime = new Date(date + 'T00:00:00')
    matchDateTime.setHours(h, m, 0, 0)
    const diffMs = matchDateTime.getTime() - Date.now()
    if (diffMs < 0) return null
    const diffMin = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMin / 60)
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays > 0) return { value: `J-${diffDays}`, label: 'jours' }
    if (diffHours > 0) return { value: `${diffHours}h${diffMin % 60 ? ` ${diffMin % 60}min` : ''}`, label: 'restant' }
    return { value: `${diffMin}min`, label: 'restant' }
  } catch { return null }
}

interface MatchData {
  match: string
  league: string
  date: string
  time: string
  homeLogo: string
  awayLogo: string
  btts: { prediction: string; confidence: number } | null
  over25: { prediction: string; confidence: number } | null
}

type FilterType = 'all' | 'BTTS' | 'O2.5'
type DateFilter = 'all' | 'today' | 'tomorrow' | '7days'

// ─── Status pill ────────────────────────────────────────────────────────
function StatusPill({ date, time }: { date: string; time: string }) {
  const status = getMatchStatus(date, time)
  if (status === 'live') {
    return (
      <span className="badge badge-live">
        <span className="v31-ticker-dot live" /> LIVE
      </span>
    )
  }
  const timeUntil = getTimeUntil(date, time)
  if (timeUntil) {
    return (
      <div className="text-right">
        <div className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">{timeUntil.label}</div>
        <div className="text-success font-bold text-xs tabular-nums mono">{timeUntil.value}</div>
      </div>
    )
  }
  return (
    <div className="text-right">
      <div className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Heure</div>
      <div className="text-white font-bold text-xs tabular-nums mono">{time}</div>
    </div>
  )
}

// ─── Prediction pill ────────────────────────────────────────────────────
function PredictionPill({ type, prediction, confidence }: { type: string; prediction: string; confidence: number }) {
  const isPositive = prediction === 'Oui'
  const color = isPositive ? 'badge-mint' : 'badge-rose'

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md ${color === 'badge-mint' ? 'bg-success/10 border border-success/30' : 'bg-lose/10 border border-lose/30'}`}>
      <span className="text-[9px] uppercase tracking-wider font-bold opacity-80">{type}</span>
      <span className={`text-xs font-bold ${isPositive ? 'text-success-light' : 'text-lose-light'}`}>{prediction}</span>
      <span className="text-[9px] text-gray-500 tabular-nums">{confidence}%</span>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────
export default function FreePredictions() {
  const [ref, isVisible] = useScrollAnimation()
  const [matches, setMatches] = useState<MatchData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeLeague, setActiveLeague] = useState<string>('all')
  const [activeType, setActiveType] = useState<FilterType>('all')
  const [activeDate, setActiveDate] = useState<DateFilter>('all')

  useEffect(() => {
    fetch('/predictions.json')
      .then(r => r.json())
      .then(data => {
        if (!data?.predictions) return
        const matchMap = new Map<string, MatchData>()
        for (const p of data.predictions) {
          if (getMatchStatus(p.date, p.time) === 'finished') continue
          const key = p.matchSemantic || p.match
          if (!matchMap.has(key)) {
            matchMap.set(key, {
              match: p.match,
              league: p.league,
              date: p.date,
              time: p.time || '--:--',
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
        const all = [...matchMap.values()].sort((a, b) => {
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
    return ['all', ...Array.from(set).slice(0, 10)]
  }, [matches])

  const filteredMatches = useMemo(() => {
    return matches.filter(m => {
      if (activeLeague !== 'all' && m.league !== activeLeague) return false
      if (activeType === 'BTTS' && !m.btts) return false
      if (activeType === 'O2.5' && !m.over25) return false

      if (activeDate !== 'all') {
        const today = new Date(); today.setHours(0, 0, 0, 0)
        const matchDay = new Date(m.date + 'T00:00:00'); matchDay.setHours(0, 0, 0, 0)
        const diffDays = Math.round((matchDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        if (activeDate === 'today' && diffDays !== 0) return false
        if (activeDate === 'tomorrow' && diffDays !== 1) return false
        if (activeDate === '7days' && (diffDays < 0 || diffDays > 7)) return false
      }
      return true
    })
  }, [matches, activeLeague, activeType, activeDate])

  const stats = useMemo(() => ({
    total: matches.length,
    btts: matches.filter(m => m.btts).length,
    o25: matches.filter(m => m.over25).length,
    live: matches.filter(m => getMatchStatus(m.date, m.time) === 'live').length,
  }), [matches])

  return (
    <section ref={ref} id="free-predictions" className="section-pad pt-4 sm:pt-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
            <div>
              <span className="eyebrow">Dashboard IA</span>
              <h2 className="section-title mt-2 mb-2">
                Pronostics IA <span className="text-success">du jour</span>
              </h2>
              <p className="section-subtitle">
                Sélection quotidienne filtrée automatiquement — les matchs terminés sont exclus.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 squircle px-4 py-2.5">
              <div className="text-center">
                <div className="text-lg font-bold text-white tabular-nums">{stats.total}</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Matchs</div>
              </div>
              <div className="w-px h-8 bg-edge" />
              <div className="text-center">
                <div className="text-lg font-bold text-success tabular-nums">{stats.btts}</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">BTTS</div>
              </div>
              <div className="w-px h-8 bg-edge" />
              <div className="text-center">
                <div className="text-lg font-bold text-gold tabular-nums">{stats.o25}</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">O2.5</div>
              </div>
              {stats.live > 0 && (
                <>
                  <div className="w-px h-8 bg-edge" />
                  <div className="text-center">
                    <div className="text-lg font-bold text-live tabular-nums">{stats.live}</div>
                    <div className="text-[9px] text-live uppercase tracking-widest font-bold">Live</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Filters — modern SaaS style */}
          <div className="flex flex-col gap-3 mb-4">
            {/* Date filter + market filter row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mr-1">Date:</span>
              {([
                { id: 'all', label: 'Tous' },
                { id: 'today', label: "Aujourd'hui" },
                { id: 'tomorrow', label: 'Demain' },
                { id: '7days', label: '7 jours' },
              ] as { id: DateFilter; label: string }[]).map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveDate(f.id)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    activeDate === f.id
                      ? 'bg-success/15 text-success border border-success/30'
                      : 'bg-panel/40 text-gray-500 border border-edge hover:text-gray-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mr-1">Marché:</span>
              {([
                { id: 'all', label: 'Tous' },
                { id: 'BTTS', label: 'BTTS' },
                { id: 'O2.5', label: 'Over 2.5' },
              ] as { id: FilterType; label: string }[]).map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveType(f.id)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    activeType === f.id
                      ? 'bg-success/15 text-success border border-success/30'
                      : 'bg-panel/40 text-gray-500 border border-edge hover:text-gray-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* League filter — horizontal scroll */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mr-1">Ligue:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1 py-0.5">
                {leagues.map(league => (
                  <button
                    key={league}
                    onClick={() => setActiveLeague(league)}
                    className={`flex-shrink-0 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                      activeLeague === league
                        ? 'bg-success/15 text-success border border-success/30'
                        : 'bg-panel/40 text-gray-500 border border-edge hover:text-gray-300'
                    }`}
                  >
                    {league === 'all' ? 'Toutes' : league}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Table / list */}
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="squircle h-16 animate-pulse" />
            ))}
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="squircle-xl p-10 text-center">
            <div className="w-14 h-14 bg-white/[0.04] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-edge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">Aucun pronostic pour ces filtres. Reviens demain !</p>
          </div>
        ) : (
          <>
            {/* Desktop table header */}
            <div className="hidden md:grid squircle-lg px-5 py-3 mb-2 sticky top-16 z-30"
              style={{ gridTemplateColumns: 'minmax(60px, auto) minmax(180px, 1fr) minmax(120px, auto) minmax(140px, auto) minmax(100px, auto)' }}
            >
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Statut</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Match</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Ligue</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Pronostics IA</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold text-right">Action</div>
            </div>

            {/* Rows */}
            <div className="space-y-1">
              {filteredMatches.map((m, i) => {
                const teams = m.match.split(/\s+vs?\s+/i)
                const home = teams[0]?.trim() || m.match
                const away = teams[1]?.trim() || ''
                const homeLogo = m.homeLogo || resolveTeamLogo(home)
                const awayLogo = m.awayLogo || resolveTeamLogo(away)
                const status = getMatchStatus(m.date, m.time)

                return (
                  <motion.div
                    key={`${m.match}-${m.date}-${m.time}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.2) }}
                    className="squircle-lg"
                  >
                    <div className="pred-row">
                      {/* Status */}
                      <div className="min-w-0">
                        <StatusPill date={m.date} time={m.time} />
                      </div>

                      {/* Match */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {homeLogo && (
                            <img src={homeLogo} alt={home} className="w-5 h-5 object-contain flex-shrink-0" loading="lazy" />
                          )}
                          <span className="text-sm text-white font-semibold truncate">{home}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {awayLogo && (
                            <img src={awayLogo} alt={away} className="w-5 h-5 object-contain flex-shrink-0" loading="lazy" />
                          )}
                          <span className="text-sm text-white font-semibold truncate">{away}</span>
                        </div>
                      </div>

                      {/* League */}
                      <div className="min-w-0 hidden md:block">
                        <span className="text-[10px] text-gray-500 truncate block">{m.league}</span>
                        <span className="text-[9px] text-gray-600 mono">{m.date}</span>
                      </div>

                      {/* Predictions */}
                      <div className="flex flex-wrap gap-1.5 min-w-0">
                        {m.btts && <PredictionPill type="BTTS" prediction={m.btts.prediction} confidence={m.btts.confidence} />}
                        {m.over25 && <PredictionPill type="O2.5" prediction={m.over25.prediction} confidence={m.over25.confidence} />}
                      </div>

                      {/* Action */}
                      <div className="text-right min-w-0">
                        <a
                          href={AFFILIATE.linebet}
                          rel="sponsored nofollow"
                          target="_blank"
                          className="inline-flex items-center gap-1 px-3 py-1.5 btn-linebet cta-glow text-[11px] font-bold rounded-md"
                        >
                          Parier
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-[11px] text-gray-600">
                Pronostics générés par IA — modèles Poisson calibrés sur 50 000+ matchs. Aucune garantie future.
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
