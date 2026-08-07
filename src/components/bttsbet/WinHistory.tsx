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
  stats: {
    total: number
    won: number
    lost: number
    rate: string
    last30Rate: string
    byType?: {
      BTTS: { total: number; won: number; lost: number; rate: number }
      'O2.5': { total: number; won: number; lost: number; rate: number }
    }
  }
  history: HistoryItem[]
}

type ResultFilter = 'all' | 'won' | 'lost'
type TypeFilter = 'all' | 'BTTS' | 'O2.5'

const COLORS = {
  success: '#A8E063',
  lose: '#5146F5',
  gold: '#5146F5',
  panel: '#0D1630',
  edge: 'rgba(247, 248, 255, 0.08)',
  text: '#A5ABC5',
}

function TeamLogoMini({ src, alt }: { src?: string; alt: string }) {
  const [err, setErr] = useState(false)
  if (!src || err) return null
  return <img src={src} alt={alt} className="w-4 h-4 object-contain flex-shrink-0 rounded" onError={() => setErr(true)} loading="lazy" />
}

// ─── Sparkline — last 14 days win rate ──────────────────────────────────
function WinRateSparkline({ history }: { history: HistoryItem[] }) {
  const data = useMemo(() => {
    const byDate = history.reduce<Record<string, { won: number; lost: number; pending: number; total: number }>>((acc, h) => {
      if (!acc[h.date]) acc[h.date] = { won: 0, lost: 0, pending: 0, total: 0 }
      // Compatibilité ancien/nouveau statut
      const isWon = h.result === 'Gagné' || h.result === 'W'
      const isLost = h.result === 'Perdu' || h.result === 'L'
      const isPending = h.result === 'PENDING' || h.result === 'En attente'
      // Seuls les W/L entrent dans le dénominateur (PENDING exclu)
      if (isWon) { acc[h.date].won++; acc[h.date].total++ }
      else if (isLost) { acc[h.date].lost++; acc[h.date].total++ }
      else if (isPending) { acc[h.date].pending++ }
      return acc
    }, {})

    return Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .map(([date, v]) => ({
        date: date.slice(5),
        rate: v.total > 0 ? Math.round((v.won / v.total) * 100) : null,
        total: v.total,
        pending: v.pending,
      }))
  }, [history])

  // Si aucune donnée vérifiée (que du PENDING), on n'affiche pas le graphique
  const hasVerifiedData = data.some(d => d.total > 0)
  if (!hasVerifiedData) {
    return (
      <div className="squircle-lg p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-papier">Tendance 14 jours</h3>
            <p className="text-[10px] text-cendre mt-0.5">Taux de réussite quotidien</p>
          </div>
          <span className="badge badge-mint">14j</span>
        </div>
        <div className="h-32 sm:h-40 flex items-center justify-center">
          <p className="text-[11px] text-cendre italic text-center px-4">
            Graphique disponible dès que les premiers scores finaux seront vérifiés via API-Football.
            <br />
            <span className="text-trust">Mise à jour en cours…</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="squircle-lg p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-papier">Tendance 14 jours</h3>
          <p className="text-[10px] text-cendre mt-0.5">Taux de réussite quotidien (vérifiés uniquement)</p>
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
              formatter={(v: number | null) => [v == null ? 'N/A' : `${v}%`, 'Réussite']}
            />
            <Area type="monotone" dataKey="rate" stroke={COLORS.success} strokeWidth={2} fill="url(#winGrad)" dot={{ fill: COLORS.success, r: 3 }} connectNulls />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ─── Type Distribution ──────────────────────────────────────────────────
// Compatible avec l'ancien format (BTTS / 'O2.5') ET nouveau (btts / over25)
function TypeDistribution({ byType }: {
  byType?: {
    // Ancien format
    BTTS?: { total: number; won: number; lost: number; rate: number }
    'O2.5'?: { total: number; won: number; lost: number; rate: number }
    // Nouveau format v3
    btts?: { total: number; won: number; lost: number; pending: number; rate: number }
    over25?: { total: number; won: number; lost: number; pending: number; rate: number }
  }
}) {
  const data = useMemo(() => {
    if (!byType) return []
    const btts = byType.btts ?? byType.BTTS
    const over25 = byType.over25 ?? byType['O2.5']
    const rows = []
    if (btts) rows.push({ name: 'BTTS', ...btts })
    if (over25) rows.push({ name: 'O2.5', ...over25 })
    return rows
  }, [byType])

  if (data.length === 0) return null

  const allPending = data.every(d => 'pending' in d && d.total === 0 && (d as any).pending > 0)

  return (
    <div className="squircle-lg p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-papier">Réussite par type</h3>
          <p className="text-[10px] text-cendre mt-0.5">BTTS vs Over 2.5 — stats vérifiées</p>
        </div>
      </div>
      {allPending ? (
        <p className="text-[11px] text-cendre italic py-3">
          Aucun résultat vérifié pour l'instant. Les scores seront ajoutés dès que les matchs seront terminés.
        </p>
      ) : (
        <div className="space-y-3">
          {data.map(d => {
            const rate = d.rate ?? 0
            const pending = (d as any).pending ?? 0
            return (
              <div key={d.name}>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-cendre font-semibold">{d.name}</span>
                  <span className="text-success font-bold tabular-nums">
                    {rate}%
                    {pending > 0 && (
                      <span className="text-cendre font-normal ml-1">({pending} en attente)</span>
                    )}
                  </span>
                </div>
                <div className="relative h-2 bg-dark-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${rate}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-success-dark to-success"
                    style={{ boxShadow: '0 0 8px rgba(168, 224, 99, 0.4)' }}
                  />
                </div>
                <div className="flex items-center justify-between text-[9px] text-cendre mt-1">
                  <span>{(d.won ?? 0).toLocaleString('fr-FR')} gagnés / {(d.total ?? 0).toLocaleString('fr-FR')} vérifiés</span>
                  <span>{(d.lost ?? 0).toLocaleString('fr-FR')} perdus</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Detailed Row ────────────────────────────────────────────────────────
function HistoryRow({ item }: { item: HistoryItem }) {
  // Compatibilité ancien/nouveau statut
  const isWon = item.result === 'Gagné' || item.result === 'W'
  const isLost = item.result === 'Perdu' || item.result === 'L'
  const isPending = item.result === 'PENDING' || item.result === 'En attente'
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
      className="grid grid-cols-[minmax(80px,_auto)_1fr_minmax(80px,_auto)_minmax(70px,_auto)_minmax(110px,_auto)] gap-3 items-center px-4 py-2.5 border-b border-edge/40 hover:bg-dark-800/[0.02] transition-colors"
    >
      {/* Date */}
      <div className="min-w-0">
        <div className="text-[11px] text-cendre mono tabular-nums">{item.date.slice(5)}</div>
        <div className="text-[9px] text-cendre">{item.league}</div>
      </div>

      {/* Match */}
      <div className="min-w-0 flex items-center gap-1.5">
        <TeamLogoMini src={homeLogo} alt={home} />
        <span className="text-xs text-papier font-semibold truncate">{home}</span>
        <span className="text-[9px] text-cendre flex-shrink-0">vs</span>
        <span className="text-xs text-papier font-semibold truncate">{away}</span>
        <TeamLogoMini src={awayLogo} alt={away} />
      </div>

      {/* Type + prediction */}
      <div className="min-w-0">
        <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
          item.type === 'BTTS' ? 'bg-success/10 text-success border border-success/20' : 'bg-gold/10 text-gold-light border border-gold/20'
        }`}>
          {item.type.includes('Over') ? 'O2.5' : item.type}
        </div>
        <div className="text-[10px] text-cendre mt-0.5">Prono: <span className="text-papier font-semibold">{item.prediction}</span></div>
      </div>

      {/* Score */}
      <div className="min-w-0 text-center">
        <div className="text-sm text-papier font-bold mono tabular-nums">
          {item.score === '-' || isPending ? '—' : item.score}
        </div>
        <div className="text-[9px] text-cendre">conf. {item.confidence}%</div>
      </div>

      {/* Result */}
      <div className="min-w-0">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
          isPending
            ? 'bg-trust/15 text-trust border border-trust/30'
            : isWon
              ? 'bg-success/15 text-success border border-success/30'
              : 'bg-lose/15 text-lose-light border border-lose/30'
        }`}>
          {isPending ? (
            <>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-trust animate-pulse" />
              En attente
            </>
          ) : isWon ? (
            <>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              Gagné
            </>
          ) : (
            <>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              Perdu
            </>
          )}
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
  // IMPORTANT: stats.total = won + lost UNIQUEMENT (PENDING exclu du dénominateur)
  // Si win-history.json est bien formé, stats.total !== history.length
  const stats = winData?.stats ?? null
  const total = stats?.total ?? 0
  const won = stats?.won ?? 0
  const lost = stats?.lost ?? 0 // Utiliser stats.lost, NE PAS calculer total - won
  const pending = stats?.pending ?? 0
  const rateNumeric = total > 0 ? (won / total) * 100 : 0
  // Si rate = 0 et total = 0 → tous PENDING → ne pas afficher 0% (crédibilité)
  const isUpdating = total === 0 && pending > 0
  const rate = isUpdating ? null : rateNumeric

  const [totalRef, totalDisplay] = useCountUp(total, 1500, { threshold: 0.3 })
  const [wonRef, wonDisplay] = useCountUp(won, 1500, { threshold: 0.3 })
  const [lostRef, lostDisplay] = useCountUp(lost, 1500, { threshold: 0.3 })
  const [rateRef, rateDisplay] = useCountUp(rate ?? 0, 1800, { decimals: 1, threshold: 0.3 })

  // Filtered history
  const filteredHistory = useMemo(() => {
    return historyArr.filter(h => {
      // Nouveaux statuts: "W" | "L" | "PENDING" (compat: "Gagné" | "Perdu")
      const isWon = h.result === 'Gagné' || h.result === 'W'
      const isLost = h.result === 'Perdu' || h.result === 'L'
      if (resultFilter === 'won' && !isWon) return false
      if (resultFilter === 'lost' && !isLost) return false
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
          <p className="text-cendre text-sm mt-2">Historique en cours de mise à jour…</p>
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
            <div className="text-2xl sm:text-3xl font-bold text-papier tabular-nums" ref={totalRef}>
              {isUpdating ? pending : totalDisplay}
            </div>
            <div className="text-[10px] text-cendre uppercase tracking-widest font-bold mt-1">
              {isUpdating ? 'En attente' : 'Vérifiés'}
            </div>
          </motion.div>
          <motion.div variants={undefined} className="stat-tile">
            <div className="text-2xl sm:text-3xl font-bold text-success tabular-nums glow-text-green" ref={wonRef}>{wonDisplay}</div>
            <div className="text-[10px] text-cendre uppercase tracking-widest font-bold mt-1">Gagnés</div>
          </motion.div>
          <motion.div variants={undefined} className="stat-tile">
            <div className="text-2xl sm:text-3xl font-bold text-lose tabular-nums" ref={lostRef}>{lostDisplay}</div>
            <div className="text-[10px] text-cendre uppercase tracking-widest font-bold mt-1">Perdus</div>
          </motion.div>
          <motion.div variants={undefined} className="stat-tile">
            {isUpdating ? (
              <div className="text-base sm:text-lg font-bold text-trust flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-trust animate-pulse" />
                En cours…
              </div>
            ) : (
              <div className="text-2xl sm:text-3xl font-bold text-gold tabular-nums glow-text-gold" ref={rateRef}>{rateDisplay}%</div>
            )}
            <div className="text-[10px] text-cendre uppercase tracking-widest font-bold mt-1">Réussite</div>
          </motion.div>
        </motion.div>

        {/* Bandeau "Mise à jour en cours" si rate=0 et total > 100 (crédibilité) */}
        {isUpdating && pending > 100 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl flex items-start gap-3"
            style={{
              backgroundColor: 'rgba(99, 216, 208, 0.08)',
              border: '1px solid rgba(99, 216, 208, 0.25)',
            }}
          >
            <svg className="flex-shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B9E7FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <div>
              <p className="text-[13px] font-semibold text-papier">Mise à jour des résultats en cours…</p>
              <p className="text-[11px] text-cendre mt-0.5 leading-relaxed">
                {pending.toLocaleString('fr-FR')} pronostics sont en attente de vérification via API-Football.
                Les scores finaux seront récupérés dès que les matchs seront terminés.
                Aucun résultat ne sera filtré — gagnés ET perdus seront affichés publiquement.
              </p>
            </div>
          </motion.div>
        )}

        {/* Charts row */}
        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          <WinRateSparkline history={historyArr} />
          <TypeDistribution byType={winData?.stats?.byType} />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-[10px] text-cendre uppercase tracking-widest font-bold mr-1">Résultat:</span>
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
                  : 'bg-panel/40 text-cendre border border-edge hover:text-cendre'
              }`}
            >
              {f.label}
            </button>
          ))}

          <div className="w-px h-5 bg-edge mx-1" />

          <span className="text-[10px] text-cendre uppercase tracking-widest font-bold mr-1">Type:</span>
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
                  : 'bg-panel/40 text-cendre border border-edge hover:text-cendre'
              }`}
            >
              {f.label}
            </button>
          ))}

          <div className="ml-auto text-[10px] text-cendre">
            {filteredHistory.length} résultat{filteredHistory.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Table header */}
        <div className="squircle-lg overflow-hidden">
          <div className="hidden md:grid px-4 py-2 text-[10px] text-cendre uppercase tracking-widest font-bold border-b border-edge bg-panel-2"
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
              <div className="px-4 py-8 text-center text-sm text-cendre">
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
              background: 'linear-gradient(135deg, #5146F5, #A8E063)',
              color: '#070B18',
              boxShadow: '0 4px 16px rgba(81, 70, 245, 0.25)',
            }}
          >
            Voir l'historique complet des pronostics (gagnés et perdus) →
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
          <span className="text-[10px] text-cendre">Gagnés ET perdus affichés en transparence</span>
        </motion.div>

        {/* Paragraphe justifiant le positionnement par la transparence */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-6 p-4 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(81, 70, 245, 0.04), rgba(81, 70, 245, 0.04))',
            border: '1px solid rgba(81, 70, 245, 0.12)',
          }}
        >
          <p className="text-[12px] text-cendre leading-relaxed text-center">
            <strong className="text-papier">Cette transparence justifie notre positionnement.</strong>{' '}
            Contrairement aux plateformes qui masquent leurs pertes, BTTSPredict affiche publiquement
            tous ses résultats — gagnés ET perdus. Notre taux de réussite (voir /historique) est calculé
            manuellement à partir de l&apos;historique réel, pas un chiffre marketing inventé.
            Ce standard de transparence est ce qui distingue BTTSPredict comme référence dans l&apos;industrie.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
