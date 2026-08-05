'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from 'recharts'
import { resolveTeamLogo } from '@/lib/teamLogos'
import { useScrollAnimation, useCountUp } from '@/hooks/useAnimations'
import { staggerContainer } from '@/lib/motionPresets'
import { TrophyIcon } from './AnimatedIcons'

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

interface WinData {
  date: string
  stats: { total: number; won: number; rate: string; last30Rate: string }
  history: HistoryItem[]
}

type ResultFilter = 'all' | 'won' | 'lost'
type TypeFilter = 'all' | 'BTTS' | 'O2.5'

const COLORS = {
  success: '#166534',
  lose: '#DC2626',
  gold: '#FACC15',
  panel: '#FFFFFF',
  edge: '#E5E7EB',
  text: '#6B7280',
}

function TeamLogoMini({ src, alt }: { src?: string; alt: string }) {
  const [err, setErr] = useState(false)
  if (!src || err) return null
  return <img src={src} alt={alt} className="w-4 h-4 object-contain flex-shrink-0 rounded" onError={() => setErr(true)} loading="lazy" />
}

// ─── Sparkline — last 14 days win rate ──────────────────────────────────
function WinRateSparkline({ history }: { history: HistoryItem[] }) {
  const data = useMemo(() => {
    const byDate = history.reduce<Record<string, { won: number; lost: number; total: number }>>((acc, h) => {
      if (!acc[h.date]) acc[h.date] = { won: 0, lost: 0, total: 0 }
      acc[h.date].total++
      if (h.result === 'Gagné') acc[h.date].won++
      else acc[h.date].lost++
      return acc
    }, {})

    return Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .map(([date, v]) => ({
        date: date.slice(5),
        rate: v.total ? Math.round((v.won / v.total) * 100) : 0,
        total: v.total,
      }))
  }, [history])

  if (data.length < 2) return null

  return (
    <div className="squircle-lg p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Tendance 14 jours</h3>
          <p className="text-[10px] text-gray-600 mt-0.5">Taux de réussite quotidien</p>
        </div>
        <span className="badge badge-mint">14j</span>
      </div>
      <div className="h-32 sm:h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
            <defs>
              <linearGradient id="winGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.success} stopOpacity={0.5} />
                <stop offset="100%" stopColor={COLORS.success} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.edge} vertical={false} />
            <XAxis dataKey="date" stroke={COLORS.text} fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke={COLORS.text} fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
            <Tooltip
              contentStyle={{
                backgroundColor: COLORS.panel,
                border: `1px solid ${COLORS.edge}`,
                borderRadius: 8,
                fontSize: 11,
                color: '#fff',
              }}
              labelStyle={{ color: COLORS.success, fontWeight: 700 }}
              formatter={(v: number) => [`${v}%`, 'Réussite']}
            />
            <Area type="monotone" dataKey="rate" stroke={COLORS.success} strokeWidth={2} fill="url(#winGrad)" dot={{ fill: COLORS.success, r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ─── Type Distribution ──────────────────────────────────────────────────
function TypeDistribution({ history }: { history: HistoryItem[] }) {
  const data = useMemo(() => {
    const groups = history.reduce<Record<string, { won: number; lost: number; total: number }>>((acc, h) => {
      const key = h.type.includes('Over') ? 'O2.5' : h.type
      if (!acc[key]) acc[key] = { won: 0, lost: 0, total: 0 }
      acc[key].total++
      if (h.result === 'Gagné') acc[key].won++
      else acc[key].lost++
      return acc
    }, {})

    return Object.entries(groups).map(([name, v]) => ({
      name,
      won: v.won,
      lost: v.lost,
      total: v.total,
      rate: v.total ? Math.round((v.won / v.total) * 100) : 0,
    }))
  }, [history])

  if (data.length === 0) return null

  return (
    <div className="squircle-lg p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Réussite par type</h3>
          <p className="text-[10px] text-gray-600 mt-0.5">BTTS vs Over 2.5</p>
        </div>
      </div>
      <div className="space-y-3">
        {data.map(d => (
          <div key={d.name}>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-gray-600 font-semibold">{d.name}</span>
              <span className="text-success font-bold tabular-nums">{d.rate}%</span>
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${d.rate}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-success-dark to-success"
                style={{ boxShadow: '0 0 8px rgba(29, 185, 84, 0.4)' }}
              />
            </div>
            <div className="flex items-center justify-between text-[9px] text-gray-600 mt-1">
              <span>{d.won} gagnés / {d.total} total</span>
              <span>{d.lost} perdus</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Detailed Row ────────────────────────────────────────────────────────
function HistoryRow({ item }: { item: HistoryItem }) {
  const isWon = item.result === 'Gagné'
  const teams = item.match.split(/\s+vs?\s+/i)
  const home = teams[0] || ''
  const away = teams[1] || ''
  const homeLogo = resolveTeamLogo(home)
  const awayLogo = resolveTeamLogo(away)

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-[minmax(80px,_auto)_1fr_minmax(80px,_auto)_minmax(70px,_auto)_minmax(110px,_auto)] gap-3 items-center px-4 py-2.5 border-b border-edge/40 hover:bg-white/[0.02] transition-colors"
    >
      {/* Date */}
      <div className="min-w-0">
        <div className="text-[11px] text-gray-600 mono tabular-nums">{item.date.slice(5)}</div>
        <div className="text-[9px] text-gray-600">{item.league}</div>
      </div>

      {/* Match */}
      <div className="min-w-0 flex items-center gap-1.5">
        <TeamLogoMini src={homeLogo} alt={home} />
        <span className="text-xs text-gray-900 font-semibold truncate">{home}</span>
        <span className="text-[9px] text-gray-600 flex-shrink-0">vs</span>
        <span className="text-xs text-gray-900 font-semibold truncate">{away}</span>
        <TeamLogoMini src={awayLogo} alt={away} />
      </div>

      {/* Type + prediction */}
      <div className="min-w-0">
        <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
          item.type === 'BTTS' ? 'bg-success/10 text-success border border-success/20' : 'bg-gold/10 text-gold-light border border-gold/20'
        }`}>
          {item.type.includes('Over') ? 'O2.5' : item.type}
        </div>
        <div className="text-[10px] text-gray-600 mt-0.5">Prono: <span className="text-gray-900 font-semibold">{item.prediction}</span></div>
      </div>

      {/* Score */}
      <div className="min-w-0 text-center">
        <div className="text-sm text-gray-900 font-bold mono tabular-nums">{item.score}</div>
        <div className="text-[9px] text-gray-600">conf. {item.confidence}%</div>
      </div>

      {/* Result */}
      <div className="min-w-0">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
          isWon ? 'bg-success/15 text-success border border-success/30' : 'bg-lose/15 text-lose-light border border-lose/30'
        }`}>
          {isWon ? (
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
          ) : (
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          )}
          {isWon ? 'Gagné' : 'Perdu'}
        </span>
      </div>
    </motion.div>
  )
}

// ─── Main ────────────────────────────────────────────────────────────────
export default function WinHistory() {
  const [winData, setWinData] = useState<WinData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [resultFilter, setResultFilter] = useState<ResultFilter>('all')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [ref, isVisible] = useScrollAnimation(0.15)

  useEffect(() => {
    fetch('/win-history.json')
      .then(r => r.json())
      .then(data => {
        if (data?.history?.length) setWinData(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const historyArr = winData?.history ?? []
  const total = winData?.stats?.total ?? historyArr.length
  const won = winData?.stats?.won ?? historyArr.filter(h => h.result === 'Gagné').length
  const lost = total - won
  const rate = total ? (won / total) * 100 : 0

  const [totalRef, totalDisplay] = useCountUp(total, 1500, { threshold: 0.3 })
  const [wonRef, wonDisplay] = useCountUp(won, 1500, { threshold: 0.3 })
  const [lostRef, lostDisplay] = useCountUp(lost, 1500, { threshold: 0.3 })
  const [rateRef, rateDisplay] = useCountUp(rate, 1800, { decimals: 1, threshold: 0.3 })

  // Filtered history
  const filteredHistory = useMemo(() => {
    return historyArr.filter(h => {
      if (resultFilter === 'won' && h.result !== 'Gagné') return false
      if (resultFilter === 'lost' && h.result === 'Gagné') return false
      if (typeFilter === 'BTTS' && h.type !== 'BTTS') return false
      if (typeFilter === 'O2.5' && !h.type.includes('Over')) return false
      return true
    })
  }, [historyArr, resultFilter, typeFilter])

  const displayedHistory = showAll ? filteredHistory : filteredHistory.slice(0, 12)

  if (loading) {
    return (
      <section ref={ref} id="win-history" className="section-pad overflow-x-hidden">
        <div className="max-w-[440px] sm:max-w-2xl mx-auto text-center">
          <div className="inline-block w-10 h-10 rounded-full bg-success/10 animate-pulse" />
          <div className="h-4 w-48 mx-auto mt-3 bg-panel rounded animate-pulse" />
        </div>
      </section>
    )
  }

  if (!winData || historyArr.length === 0) {
    return (
      <section ref={ref} id="win-history" className="section-pad overflow-x-hidden">
        <div className="max-w-[440px] sm:max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-2"><TrophyIcon size={40} /></div>
          <h2 className="section-title">Historique des <span className="text-success">Pronostics</span></h2>
          <p className="text-gray-600 text-sm mt-2">Historique en cours de mise à jour…</p>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} id="win-history" className="section-pad overflow-x-hidden">
      <div className="max-w-[440px] sm:max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <span className="eyebrow">Track Record</span>
          <h2 className="section-title mt-3 mb-3">
            Historique & <span className="text-success">Statistiques</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Transparence totale — gagnés ET perdus affichés.
            Les performances passées ne garantissent pas les résultats futurs.
          </p>
        </motion.div>

        {/* KPI Tiles */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
        >
          <motion.div variants={undefined} className="stat-tile">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 tabular-nums" ref={totalRef}>{totalDisplay}</div>
            <div className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mt-1">Analysés</div>
          </motion.div>
          <motion.div variants={undefined} className="stat-tile">
            <div className="text-2xl sm:text-3xl font-bold text-success tabular-nums glow-text-green" ref={wonRef}>{wonDisplay}</div>
            <div className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mt-1">Gagnés</div>
          </motion.div>
          <motion.div variants={undefined} className="stat-tile">
            <div className="text-2xl sm:text-3xl font-bold text-lose tabular-nums" ref={lostRef}>{lostDisplay}</div>
            <div className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mt-1">Perdus</div>
          </motion.div>
          <motion.div variants={undefined} className="stat-tile">
            <div className="text-2xl sm:text-3xl font-bold text-gold tabular-nums glow-text-gold" ref={rateRef}>{rateDisplay}%</div>
            <div className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mt-1">Réussite</div>
          </motion.div>
        </motion.div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          <WinRateSparkline history={historyArr} />
          <TypeDistribution history={historyArr} />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mr-1">Résultat:</span>
          {([
            { id: 'all', label: 'Tous' },
            { id: 'won', label: 'Gagnés' },
            { id: 'lost', label: 'Perdus' },
          ] as { id: ResultFilter; label: string }[]).map(f => (
            <button
              key={f.id}
              onClick={() => setResultFilter(f.id)}
              aria-pressed={resultFilter === f.id}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                resultFilter === f.id
                  ? 'bg-success/15 text-success border border-success/30'
                  : 'bg-panel/40 text-gray-600 border border-edge hover:text-gray-600'
              }`}
            >
              {f.label}
            </button>
          ))}

          <div className="w-px h-5 bg-edge mx-1" />

          <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mr-1">Type:</span>
          {([
            { id: 'all', label: 'Tous' },
            { id: 'BTTS', label: 'BTTS' },
            { id: 'O2.5', label: 'Over 2.5' },
          ] as { id: TypeFilter; label: string }[]).map(f => (
            <button
              key={f.id}
              onClick={() => setTypeFilter(f.id)}
              aria-pressed={typeFilter === f.id}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                typeFilter === f.id
                  ? 'bg-gold/15 text-gold-light border border-gold/30'
                  : 'bg-panel/40 text-gray-600 border border-edge hover:text-gray-600'
              }`}
            >
              {f.label}
            </button>
          ))}

          <div className="ml-auto text-[10px] text-gray-600">
            {filteredHistory.length} résultat{filteredHistory.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Table header */}
        <div className="squircle-lg overflow-hidden">
          <div className="hidden md:grid px-4 py-2 text-[10px] text-gray-600 uppercase tracking-widest font-bold border-b border-edge bg-panel-2"
            style={{ gridTemplateColumns: 'minmax(80px, auto) 1fr minmax(80px, auto) minmax(70px, auto) minmax(110px, auto)' }}
          >
            <span>Date</span>
            <span>Match</span>
            <span>Type</span>
            <span>Score</span>
            <span>Résultat</span>
          </div>

          {/* Rows */}
          <div className="max-h-[600px] overflow-y-auto scroll-list">
            {displayedHistory.length > 0 ? (
              displayedHistory.map((item, i) => (
                <HistoryRow key={`${item.id || i}-${item.match}`} item={item} />
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-gray-600">
                Aucun résultat pour ces filtres.
              </div>
            )}
          </div>
        </div>

        {/* Show more */}
        {filteredHistory.length > 12 && (
          <div className="text-center mt-4">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-1.5 px-4 py-2 squircle text-xs font-semibold text-success hover:bg-success/10 transition-colors"
            >
              {showAll ? (
                <>Voir moins <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" /></svg></>
              ) : (
                <>Voir plus ({filteredHistory.length - 12} restants) <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg></>
              )}
            </button>
          </div>
        )}

        {/* CTA — Voir l'historique complet (page dédiée) */}
        <div className="text-center mt-4">
          <a
            href="/historique"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
            style={{
              background: 'linear-gradient(135deg, #16A34A, #166534)',
              color: '#020617',
              boxShadow: '0 4px 16px rgba(22, 163, 74, 0.25)',
            }}
          >
            Voir l'historique complet →
          </a>
        </div>

        {/* Trust badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="flex items-center justify-center gap-2 mt-6"
        >
          <span className="badge badge-mint">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
            Résultats vérifiés
          </span>
          <span className="text-[10px] text-gray-600">Gagnés ET perdus affichés en transparence</span>
        </motion.div>

        {/* Paragraphe justifiant le positionnement par la transparence */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-6 p-4 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.04), rgba(34, 197, 94, 0.04))',
            border: '1px solid rgba(22, 163, 74, 0.12)',
          }}
        >
          <p className="text-[12px] text-gray-600 leading-relaxed text-center">
            <strong className="text-gray-900">Cette transparence justifie notre positionnement.</strong>{' '}
            Contrairement aux plateformes qui masquent leurs pertes, BTTSPredict affiche publiquement
            tous ses résultats — gagnés ET perdus. Notre taux de réussite (84,5%) est calculé
            manuellement à partir de l&apos;historique réel, pas un chiffre marketing inventé.
            Ce standard de transparence est ce qui distingue BTTSPredict comme référence dans l&apos;industrie.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
