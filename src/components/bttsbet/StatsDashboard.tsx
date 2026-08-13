'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Area, AreaChart, Legend
} from 'recharts'

type WinEntry = {
  date: string
  match: string
  league: string
  type: string
  prediction: string
  result: string
  score: string
  confidence: number
}

type WinHistory = {
  date: string
  stats: {
    total: number
    won: number
    lost: number
    pending: number
    rate: string
    last30Rate: string
    byType?: {
      btts?: { total: number; won: number; lost: number; pending: number; rate: number }
      over25?: { total: number; won: number; lost: number; pending: number; rate: number }
      BTTS?: { total: number; won: number; lost: number; rate: number }
      'O2.5'?: { total: number; won: number; lost: number; rate: number }
    }
  }
  history: WinEntry[]
}

const COLORS = {
  gold: '#16A36A',
  mint: '#16A36A',
  cyan: '#16A36A',
  rose: '#16A36A',
  panel: '#0D1B2A',
  edge: 'rgba(242, 247, 245, 0.08)',
  text: '#B7C7D9',
}

const LEAGUE_COLORS = ['#16A36A', '#16A36A', '#16A36A', '#16A36A', '#16A36A', '#16A36A', '#16A36A', '#16A36A', '#16A36A', '#16A36A']

export default function StatsDashboard() {
  const [data, setData] = useState<WinHistory | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/win-history.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid place-items-center h-96">
        <div className="text-cendre text-sm animate-pulse">Chargement des statistiques…</div>
      </div>
    )
  }

  if (!data || !data.history?.length) {
    return (
      <div className="grid place-items-center h-96">
        <div className="text-cendre text-sm">Données non disponibles.</div>
      </div>
    )
  }

  // Compute stats — use stats block (true W/L/PENDING) instead of history.length
  const history = data.history
  const stats = data.stats
  const total = stats?.total ?? 0
  const won = stats?.won ?? 0
  const lost = stats?.lost ?? 0
  const pending = stats?.pending ?? 0
  const rate = total > 0 ? Math.round((won / total) * 100) : 0
  const isUpdating = total === 0 && pending > 0

  // Group by date + type (for dual-line chart BTTS violet + Over 2.5 cyan)
  const byDateType = history.reduce<Record<string, {
    btts: { won: number; total: number };
    over25: { won: number; total: number };
  }>>((acc, h) => {
    if (!acc[h.date]) acc[h.date] = { btts: { won: 0, total: 0 }, over25: { won: 0, total: 0 } }
    const isWon = h.result === 'Gagné' || h.result === 'W'
    const isLost = h.result === 'Perdu' || h.result === 'L'
    if (!isWon && !isLost) return acc // PENDING skip
    const typeKey = h.type.includes('Over') ? 'over25' : 'btts'
    acc[h.date][typeKey].total++
    if (isWon) acc[h.date][typeKey].won++
    return acc
  }, {})

  const timeSeriesDual = Object.entries(byDateType)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, v]) => ({
      date: date.slice(5),
      btts: v.btts.total > 0 ? Math.round((v.btts.won / v.btts.total) * 100) : null,
      over25: v.over25.total > 0 ? Math.round((v.over25.won / v.over25.total) * 100) : null,
    }))

  const hasDualData = timeSeriesDual.some(d => d.btts !== null || d.over25 !== null)

  // Group by league
  const byLeague = history.reduce<Record<string, number>>((acc, h) => {
    acc[h.league] = (acc[h.league] || 0) + 1
    return acc
  }, {})
  const leagueData = Object.entries(byLeague)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  // Group by type — PENDING exclus
  const byType = history.reduce<Record<string, { won: number; lost: number; pending: number; total: number }>>((acc, h) => {
    if (!acc[h.type]) acc[h.type] = { won: 0, lost: 0, pending: 0, total: 0 }
    const isWon = h.result === 'Gagné' || h.result === 'W'
    const isLost = h.result === 'Perdu' || h.result === 'L'
    const isPending = h.result === 'PENDING' || h.result === 'En attente'
    if (isWon) { acc[h.type].won++; acc[h.type].total++ }
    else if (isLost) { acc[h.type].lost++; acc[h.type].total++ }
    else if (isPending) { acc[h.type].pending++ }
    return acc
  }, {})
  const typeData = Object.entries(byType).map(([name, v]) => ({
    name: name.includes('Over') ? 'Over 2.5' : name,
    réussite: v.total > 0 ? Math.round((v.won / v.total) * 100) : 0,
    total: v.total,
    gagnés: v.won,
  }))

  // Confidence buckets — PENDING exclus
  const confBuckets = [
    { range: '40-49%', min: 40, max: 49, won: 0, total: 0 },
    { range: '50-59%', min: 50, max: 59, won: 0, total: 0 },
    { range: '60-69%', min: 60, max: 69, won: 0, total: 0 },
    { range: '70%+', min: 70, max: 100, won: 0, total: 0 },
  ]
  history.forEach(h => {
    const isWon = h.result === 'Gagné' || h.result === 'W'
    const isLost = h.result === 'Perdu' || h.result === 'L'
    if (!isWon && !isLost) return // PENDING skip
    const c = h.confidence || 0
    const bucket = confBuckets.find(b => c >= b.min && c <= b.max)
    if (bucket) {
      bucket.total++
      if (isWon) bucket.won++
    }
  })
  const confData = confBuckets.map(b => ({
    range: b.range,
    réussite: b.total ? Math.round((b.won / b.total) * 100) : 0,
    total: b.total,
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* ── KPI ROW ─────────────────────────────────────────── */}
      {isUpdating && pending > 100 && (
        <div className="mb-4 p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: 'rgba(99, 216, 208, 0.08)', border: '1px solid rgba(99, 216, 208, 0.25)' }}>
          <svg className="flex-shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B9E7FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          <div>
            <p className="text-[13px] font-semibold text-papier">Mise à jour des résultats en cours…</p>
            <p className="text-[11px] text-cendre mt-0.5 leading-relaxed">
              {pending.toLocaleString('fr-FR')} pronostics en attente de vérification via API-Football. Les scores finaux seront ajoutés dès que les matchs seront terminés.
            </p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="stat-tile">
          {isUpdating ? (
            <div className="text-2xl sm:text-3xl font-bold text-trust flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-trust animate-pulse" />En cours…
            </div>
          ) : (
            <div className="text-3xl sm:text-4xl font-black text-gold tabular-nums">{rate}%</div>
          )}
          <div className="text-[10px] sm:text-xs text-cendre uppercase tracking-widest mt-1">Taux vérifié</div>
          <div className="text-[10px] text-cendre mt-1">{isUpdating ? `${pending} en attente` : `${won}G / ${total} total`}</div>
        </div>
        <div className="stat-tile">
          <div className="text-3xl sm:text-4xl font-black text-success tabular-nums">{won}</div>
          <div className="text-[10px] sm:text-xs text-cendre uppercase tracking-widest mt-1">Pronostics gagnés</div>
          <div className="text-[10px] text-cendre mt-1">Sur {total} vérifiés</div>
        </div>
        <div className="stat-tile">
          <div className="text-3xl sm:text-4xl font-black text-rose tabular-nums">{lost}</div>
          <div className="text-[10px] sm:text-xs text-cendre uppercase tracking-widest mt-1">Pronostics perdus</div>
          <div className="text-[10px] text-cendre mt-1">Transparence totale</div>
        </div>
        <div className="stat-tile">
          <div className="text-3xl sm:text-4xl font-black text-ultra tabular-nums">{isUpdating ? '—' : data.stats.last30Rate}</div>
          <div className="text-[10px] sm:text-xs text-cendre uppercase tracking-widest mt-1">Taux 30 jours</div>
          <div className="text-[10px] text-cendre mt-1">{isUpdating ? 'En attente' : `${total} historiques`}</div>
        </div>
      </div>

      {/* ── TIME SERIES CHART — Dual Line (BTTS violet + Over 2.5 cyan) ─── */}
      <section className="squircle-xl p-5 sm:p-6">
        <header className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-papier">Évolution du taux vérifié</h2>
            <p className="text-xs text-cendre mt-1">14 derniers jours — BTTS vs Over 2.5 (vérifiés uniquement)</p>
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#2176FF' }} />
              <span className="text-cendre">BTTS</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#2176FF' }} />
              <span className="text-cendre">Over 2.5</span>
            </span>
          </div>
        </header>
        {hasDualData ? (
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeriesDual} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.edge} strokeOpacity={0.4} />
              <XAxis dataKey="date" stroke={COLORS.text} fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke={COLORS.text} fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: COLORS.panel,
                  border: `1px solid ${COLORS.edge}`,
                  borderRadius: 12,
                  fontSize: 12,
                  color: '#fff',
                }}
                labelStyle={{ color: '#F4F8FC', fontWeight: 700 }}
                formatter={(value, name) => [
                  typeof value === 'number' ? `${value}%` : 'N/A',
                  name === 'btts' ? 'BTTS' : 'Over 2.5',
                ]}
              />
              <Line
                type="monotone"
                dataKey="btts"
                stroke="#2176FF"
                strokeWidth={2.5}
                dot={{ fill: '#2176FF', r: 3 }}
                activeDot={{ r: 5, fill: '#2176FF' }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="over25"
                stroke="#2176FF"
                strokeWidth={2.5}
                dot={{ fill: '#2176FF', r: 3 }}
                activeDot={{ r: 5, fill: '#2176FF' }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        ) : (
          <div className="h-64 sm:h-80 flex items-center justify-center">
            <p className="text-[12px] text-cendre italic text-center px-4">
              Graphique disponible dès que les premiers scores finaux seront vérifiés via API-Football.
              <br /><span className="text-trust">Mise à jour en cours…</span>
            </p>
          </div>
        )}
      </section>

      {/* ── TWO-COLUMN: TYPE + CONFIDENCE ─────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* By Type */}
        <section className="squircle-xl p-5 sm:p-6">
          <header className="mb-5">
            <h2 className="text-lg font-bold text-papier">Réussite par type de pari</h2>
            <p className="text-xs text-cendre mt-1">BTTS vs Over 2.5 — quel marché l'IA maîtrise-t-elle le mieux ?</p>
          </header>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.edge} strokeOpacity={0.4} vertical={false} />
                <XAxis dataKey="name" stroke={COLORS.text} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={COLORS.text} fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: COLORS.panel,
                    border: `1px solid ${COLORS.edge}`,
                    borderRadius: 12,
                    fontSize: 12,
                    color: '#fff',
                  }}
                  cursor={{ fill: 'rgba(199, 244, 100, 0.05)' }}
                />
                <Bar dataKey="réussite" radius={[8, 8, 0, 0]} maxBarSize={64}>
                  {typeData.map((_, i) => (
                    <Cell key={i} fill={i % 2 === 0 ? COLORS.mint : COLORS.cyan} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Confidence buckets */}
        <section className="squircle-xl p-5 sm:p-6">
          <header className="mb-5">
            <h2 className="text-lg font-bold text-papier">Réussite par niveau de confiance</h2>
            <p className="text-xs text-cendre mt-1">Plus l'IA est confiante, plus le taux VIP est élevé ?</p>
          </header>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.edge} strokeOpacity={0.4} vertical={false} />
                <XAxis dataKey="range" stroke={COLORS.text} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={COLORS.text} fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: COLORS.panel,
                    border: `1px solid ${COLORS.edge}`,
                    borderRadius: 12,
                    fontSize: 12,
                    color: '#fff',
                  }}
                  cursor={{ fill: 'rgba(199, 244, 100, 0.05)' }}
                />
                <Bar dataKey="réussite" radius={[8, 8, 0, 0]} maxBarSize={64}>
                  {confData.map((_, i) => (
                    <Cell key={i} fill={COLORS.gold} fillOpacity={0.4 + i * 0.2} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* ── LEAGUE DISTRIBUTION ─────────────────────────────── */}
      <section className="squircle-xl p-5 sm:p-6">
        <header className="mb-5">
          <h2 className="text-lg font-bold text-papier">Répartition par championnat</h2>
          <p className="text-xs text-cendre mt-1">Top 8 ligues par nombre de pronostics récents</p>
        </header>
        <div className="grid lg:grid-cols-2 gap-6 items-center">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leagueData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  stroke={COLORS.panel}
                  strokeWidth={2}
                >
                  {leagueData.map((_, i) => (
                    <Cell key={i} fill={LEAGUE_COLORS[i % LEAGUE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: COLORS.panel,
                    border: `1px solid ${COLORS.edge}`,
                    borderRadius: 12,
                    fontSize: 12,
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="space-y-2">
            {leagueData.map((l, i) => (
              <li key={l.name} className="flex items-center justify-between gap-3 text-sm py-1.5 border-b border-edge/40 last:border-0">
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: LEAGUE_COLORS[i % LEAGUE_COLORS.length] }}
                  />
                  <span className="text-cendre truncate">{l.name}</span>
                </span>
                <span className="text-cendre tabular-nums font-semibold flex-shrink-0">{l.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── DISCLAIMER ─────────────────────────────────────── */}
      <div className="squircle p-4 bg-gold/[0.03] border-gold/20">
        <p className="text-xs text-cendre leading-relaxed">
          <strong className="text-gold">⚠️ Avertissement :</strong> Les statistiques présentées sont calculées à partir des résultats réels des matchs.
          Elles ne constituent pas une garantie de performance future. Les paris sportifs comportent des risques de perte financière.
          Jouez de manière responsable — begambleaware.org. 18+.
        </p>
      </div>
    </motion.div>
  )
}
