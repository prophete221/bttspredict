'use client'

/**
 * BttsTodayDashboard — terminal-style predictions dashboard for /btts/predictions/today
 *
 * Visual identity: dark premium analytics / data terminal.
 * NOT a blog article.
 *
 * Data sources (read-only):
 *   - public/predictions.json (fields already produced by the engine)
 *
 * Fields consumed (no recalculation, no fabrication):
 *   match, league, date, time, homeLogo, awayLogo,
 *   home, away,
 *   bttsProb, over25Prob,                  ← Poisson probabilities (0..1)
 *   homeLambda, awayLambda,                ← expected goals (xG)
 *   xgHome, xgAway, xgTotal,               ← xG display fallback
 *   reliabilityScore,                      ← 0..100 data confidence (NOT a win chance)
 *   dataSource, dataQuality,               ← ESPN_TEAM_SCHEDULE | LEAGUE_FALLBACK ; HIGH|MEDIUM|LOW
 *   matchCountHome, matchCountAway,        ← real ESPN matches analysed per team
 *   ai_exact_score, exact_score_prob,      ← Gemini exact score view
 *   ai_btts_view, ai_over25_view,          ← Gemini views (displayed, not overriding Poisson)
 *   ai_key_fact, ai_analysis               ← Gemini short text
 */

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { generateMatchSlug } from '@/lib/match-slug'
import { useLanguage } from './LanguageSwitcher'
import { translationsFor } from '@/lib/i18n'
import { getDakarDateString, getDakarMatchStatus } from '@/lib/dakar-date'

// ─── Palette (Slate Design System — matches VIP / methodology) ──────────
const C = {
  bg:       '#071018',
  surface:  '#0D1A20',
  surface2: '#071018',
  border:   '#5D7880',
  text:     '#F5F8F3',
  textSec:  '#B7C4C1',
  textMute: '#64748B',
  success:  '#34D399',
  warning:  '#B8FF1A',
  data:     '#B8FF1A',
  gold:     '#B8FF1A',
  danger:   '#FF7B7B',
}

// ─── Types ──────────────────────────────────────────────────────────────
interface RawPrediction {
  match?: string
  home?: string
  away?: string
  league?: string
  date?: string
  time?: string
  homeLogo?: string
  awayLogo?: string
  type?: string
  prediction?: string
  confidence?: number
  bttsProb?: number
  over25Prob?: number
  homeLambda?: number
  awayLambda?: number
  xgHome?: number
  xgAway?: number
  xgTotal?: number
  reliabilityScore?: number
  dataSource?: string
  dataQuality?: string
  matchCountHome?: number
  matchCountAway?: number
  ai_exact_score?: string
  exact_score_prob?: string
  ai_btts_view?: string
  ai_over25_view?: string
  ai_key_fact?: string
  ai_analysis?: string
}

interface DashboardLabels {
  exactScore: string
  projection: string
  source: string
  quality: string
  matches: string
  dataConfidence: string
  aiAnalysis: string
  score: string
  xgHome: string
  xgAway: string
  xgTotal: string
  openMatch: string
}

interface MatchData {
  key: string
  home: string
  away: string
  league: string
  date: string
  time: string
  homeLogo?: string
  awayLogo?: string
  bttsProb?: number
  over25Prob?: number
  homeLambda?: number
  awayLambda?: number
  xgHome?: number
  xgAway?: number
  xgTotal?: number
  reliabilityScore?: number
  dataSource?: string
  dataQuality?: string
  matchCountHome?: number
  matchCountAway?: number
  aiExactScore?: string
  exactScoreProb?: string
  aiBttsView?: string
  aiOver25View?: string
  aiKeyFact?: string
  aiAnalysis?: string
}

type FilterType = 'all' | 'BTTS' | 'O2.5' | 'HIGH' | 'VIP'

// ─── AI Combo of the Day — selection type ───────────────────────────────
// A ComboPick is a deterministic selection derived ONLY from data already
// present in predictions.json. The frontend never recalculates probabilities;
// it only filters, ranks, and chooses the higher qualifying market per match.
interface ComboPick {
  match: MatchData
  market: 'BTTS' | 'OVER 2.5'
  probability: number        // Real value from predictions.json (0..1) — untouched
  reliabilityScore: number   // Real value from predictions.json (0..100)
  dataQuality: string         // Real value from predictions.json (HIGH | MEDIUM | LOW)
  matchCountTotal: number    // Real sum of matchCountHome + matchCountAway
}

// ─── Helpers ────────────────────────────────────────────────────────────
function fmtPct(p?: number): string {
  if (p == null || !Number.isFinite(p)) return '—'
  return `${(p * 100).toFixed(1)}%`
}

function fmtNum(n?: number, digits = 2): string {
  if (n == null || !Number.isFinite(n)) return '—'
  return n.toFixed(digits)
}

function fmtInt(n?: number): string {
  if (n == null || !Number.isFinite(n)) return '—'
  return String(Math.round(n))
}

function fmtDate(dateStr?: string): string {
  if (!dateStr) return '—'
  try {
    const d = new Date(dateStr + 'T12:00:00')
    const day = d.getDate().toString().padStart(2, '0')
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`
  } catch {
    return dateStr
  }
}

function passesFilter(match: MatchData, activeFilter: FilterType): boolean {
  if (activeFilter === 'BTTS') return (match.bttsProb ?? 0) >= 0.5
  if (activeFilter === 'O2.5') return (match.over25Prob ?? 0) >= 0.5
  if (activeFilter === 'HIGH') return (match.reliabilityScore ?? 0) >= 80
  return true
}

function normalizeDataSource(s?: string): string {
  if (!s) return '—'
  if (s === 'ESPN_TEAM_SCHEDULE') return 'ESPN TEAM SCHEDULE'
  if (s === 'LEAGUE_FALLBACK') return 'LEAGUE FALLBACK'
  return s.toUpperCase().replace(/_/g, ' ')
}

function qualityColor(q?: string): string {
  if (!q) return C.textSec
  const u = q.toUpperCase()
  if (u === 'HIGH') return C.success
  if (u === 'MEDIUM') return C.warning
  if (u === 'LOW') return C.danger
  return C.textSec
}

function hasSufficientData(match: MatchData): boolean {
  const quality = (match.dataQuality || '').toUpperCase()
  const sampleSize = (match.matchCountHome ?? 0) + (match.matchCountAway ?? 0)
  return quality !== 'LOW' && sampleSize >= 2
}

// ─── Team Logo (compact, dashboard-grade) ───────────────────────────────
function TeamLogo({ src, name, size = 36 }: { src?: string; name: string; size?: number }) {
  const [err, setErr] = useState(false)
  const initial = (name || '?').slice(0, 3).toUpperCase()
  if (!src || err) {
    return (
      <div
        className="rounded-md flex items-center justify-center font-black flex-shrink-0"
        style={{
          width: size,
          height: size,
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          color: C.success,
          fontSize: Math.round(size * 0.32),
        }}
        aria-label={name}
        title={name}
      >
        {initial}
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={`Logo ${name}`}
      className="object-contain flex-shrink-0 rounded"
      style={{ width: size, height: size, backgroundColor: C.surface2 }}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={() => setErr(true)}
    />
  )
}

// ─── Stat Block (header summary) ─────────────────────────────────────────
function StatBlock({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-lg p-2 sm:p-3 text-center" style={{
      backgroundColor: C.surface2,
      border: `1px solid ${C.border}`,
    }}>
      <div className="text-[8px] sm:text-[9px] uppercase tracking-widest font-bold mb-0.5" style={{ color: C.textSec }}>
        {label}
      </div>
      <div className="text-base sm:text-lg font-black tabular-nums" style={{ color: accent || C.text }}>
        {value}
      </div>
    </div>
  )
}

// ─── Probability Block (large, primary visual) ──────────────────────────
function ProbBlock({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-md p-2 text-center" style={{ backgroundColor: `${accent}10` }}>
      <div className="text-[8px] uppercase tracking-widest font-bold mb-1" style={{ color: C.textSec }}>
        {label}
      </div>
      <div className="text-base sm:text-lg font-black tabular-nums" style={{ color: accent }}>
        {value}
      </div>
    </div>
  )
}

// ─── Data Quality Badge ──────────────────────────────────────────────────
function DataBadge({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[8px] uppercase tracking-widest font-bold" style={{ color: C.textSec }}>
        {label}
      </span>
      <span
        className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider"
        style={{
          backgroundColor: `${accent || C.textSec}15`,
          color: accent || C.textSec,
          border: `1px solid ${accent || C.textSec}30`,
        }}
      >
        {value}
      </span>
    </div>
  )
}

// ─── Match Card — terminal-style ─────────────────────────────────────────
function MatchCard({ match, index, insufficientDataLabel, labels }: { match: MatchData; index: number; insufficientDataLabel: string; labels: DashboardLabels }) {
  const [expanded, setExpanded] = useState(false)

  const dataSourceLabel = normalizeDataSource(match.dataSource)
  const quality = match.dataQuality?.toUpperCase() || '—'
  const qualityColorVal = qualityColor(match.dataQuality)
  const sufficientData = hasSufficientData(match)

  return (
    <article
      className="rounded-xl overflow-hidden transition-all"
      style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        animation: `dashFade 0.4s ease-out ${Math.min(index * 0.04, 0.3)}s backwards`,
      }}
    >
      {/* Top accent */}
      <div className="h-[2px] w-full" style={{
        background: `linear-gradient(90deg, transparent, ${C.success}40, transparent)`,
      }} />

      {/* ─── HEADER: League + Time ─── */}
      <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: `1px solid ${C.border}` }}>
        <span className="text-[9px] uppercase tracking-widest font-bold truncate" style={{ color: C.textSec }}>
          {match.league}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] font-mono tabular-nums" style={{ color: C.textSec }}>
            {match.time || '--:--'}
          </span>
        </div>
      </div>

      {/* ─── TEAMS ─── */}
      <div className="flex items-center justify-between px-3 py-3 gap-2">
        <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
          <TeamLogo src={match.homeLogo} name={match.home} size={36} />
          <span className="text-[11px] font-bold text-center truncate w-full" style={{ color: C.text }}>
            {match.home}
          </span>
        </div>
        <div className="flex flex-col items-center px-1 flex-shrink-0">
          <span className="text-[10px] font-black" style={{ color: C.gold }}>VS</span>
        </div>
        <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
          <TeamLogo src={match.awayLogo} name={match.away} size={36} />
          <span className="text-[11px] font-bold text-center truncate w-full" style={{ color: C.text }}>
            {match.away}
          </span>
        </div>
      </div>

      {/* ─── PROBABILITIES — primary block ─── */}
      <div className="px-3 pb-3">
        <div className="grid grid-cols-2 gap-1.5 mb-2">
          <ProbBlock label="BTTS" value={sufficientData ? fmtPct(match.bttsProb) : '—'} accent={C.success} />
          <ProbBlock label="Over 2.5" value={sufficientData ? fmtPct(match.over25Prob) : '—'} accent={C.warning} />
        </div>

        {/* xG row */}
        <div className="grid grid-cols-3 gap-1.5">
          <div className="rounded-md p-2 text-center" style={{ backgroundColor: `${C.data}08` }}>
            <div className="text-[7px] uppercase tracking-wider font-bold mb-0.5" style={{ color: C.textSec }}>{labels.xgHome}</div>
            <div className="text-[11px] font-black tabular-nums" style={{ color: C.data }}>
              {sufficientData ? fmtNum(match.homeLambda ?? match.xgHome) : '—'}
            </div>
          </div>
          <div className="rounded-md p-2 text-center" style={{ backgroundColor: `${C.data}08` }}>
            <div className="text-[7px] uppercase tracking-wider font-bold mb-0.5" style={{ color: C.textSec }}>{labels.xgAway}</div>
            <div className="text-[11px] font-black tabular-nums" style={{ color: C.data }}>
              {sufficientData ? fmtNum(match.awayLambda ?? match.xgAway) : '—'}
            </div>
          </div>
          <div className="rounded-md p-2 text-center" style={{ backgroundColor: `${C.data}08` }}>
            <div className="text-[7px] uppercase tracking-wider font-bold mb-0.5" style={{ color: C.textSec }}>{labels.xgTotal}</div>
            <div className="text-[11px] font-black tabular-nums" style={{ color: C.data }}>
              {sufficientData ? fmtNum(match.xgTotal ?? ((match.homeLambda ?? match.xgHome ?? 0) + (match.awayLambda ?? match.xgAway ?? 0))) : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* ─── EXACT SCORE — source data only ─── */}
      <div className="px-3 pb-3">
        <div className="rounded-md p-2.5" style={{ backgroundColor: `${C.gold}10`, border: `1px solid ${C.gold}35` }}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[8px] uppercase tracking-widest font-bold" style={{ color: C.textSec }}>
              {labels.exactScore}
            </span>
            {sufficientData && match.exactScoreProb && (
              <span className="text-[9px] font-mono font-bold" style={{ color: C.gold }}>
                {match.exactScoreProb}
              </span>
            )}
          </div>
          <div className="mt-1 text-lg font-black tabular-nums" style={{ color: match.aiExactScore ? C.gold : C.textSec }}>
            {sufficientData && match.aiExactScore ? match.aiExactScore : 'Non publié — données insuffisantes'}
          </div>
          <p className="text-[8px] mt-1" style={{ color: C.textMute }}>
            {sufficientData ? labels.projection : insufficientDataLabel}
          </p>
        </div>
      </div>

      {/* ─── DATA SOURCE / DATA QUALITY ─── */}
      <div className="px-3 py-2 flex flex-wrap items-center justify-between gap-2" style={{
        borderTop: `1px solid ${C.border}`,
        backgroundColor: C.surface2,
      }}>
        <DataBadge label={labels.source} value={dataSourceLabel} accent={C.data} />
        <DataBadge label={labels.quality} value={quality} accent={qualityColorVal} />
        <span className="text-[8px] uppercase tracking-wider font-bold" style={{ color: C.textSec }}>
          {fmtInt(match.matchCountHome)} + {fmtInt(match.matchCountAway)} {labels.matches}
        </span>
      </div>

      {/* ─── DATA CONFIDENCE ─── */}
      {match.reliabilityScore != null && Number.isFinite(match.reliabilityScore) && (
        <div className="px-3 py-2" style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[8px] uppercase tracking-widest font-bold" style={{ color: C.textSec }}>
              {labels.dataConfidence}
            </span>
            <span className="text-[11px] font-black tabular-nums" style={{ color: C.gold }}>
              {Math.round(match.reliabilityScore)}%
            </span>
          </div>
          <div className="relative h-1 rounded-full overflow-hidden" style={{ backgroundColor: C.surface2 }}>
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${Math.min(100, Math.max(0, match.reliabilityScore))}%`,
                background: `linear-gradient(90deg, ${C.gold}aa, ${C.gold})`,
                boxShadow: `0 0 8px ${C.gold}66`,
              }}
            />
          </div>
        </div>
      )}

      {/* ─── AI ANALYSIS — secondary, collapsible ─── */}
      <div className="px-3 py-2" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: C.data, boxShadow: `0 0 6px ${C.data}` }}
            />
            <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: C.data }}>
              {labels.aiAnalysis}
            </span>
          </div>
          {sufficientData && match.aiExactScore && (
            <span className="text-[9px] font-mono tabular-nums" style={{ color: C.textSec }}>
              {labels.score}: <span style={{ color: C.gold }}>{match.aiExactScore}</span>
              {match.exactScoreProb ? ` (${match.exactScoreProb})` : ''}
            </span>
          )}
        </div>

        {sufficientData && match.aiKeyFact && (
          <p className="text-[10px] font-semibold mb-1" style={{ color: C.text }}>
            {match.aiKeyFact}
          </p>
        )}
        {sufficientData && !expanded && match.aiAnalysis && (
          <p className="text-[10px] leading-relaxed mt-1" style={{ color: C.textSec }}>
            {match.aiAnalysis.length > 180 ? `${match.aiAnalysis.slice(0, 177)}…` : match.aiAnalysis}
          </p>
        )}
        {sufficientData && expanded && match.aiAnalysis && (
          <p className="text-[10px] leading-relaxed mt-1" style={{ color: C.textSec }}>
            {match.aiAnalysis}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 mt-2">
          {sufficientData && match.aiAnalysis && (
            <button
              onClick={() => setExpanded(e => !e)}
              aria-expanded={expanded}
              aria-label={expanded ? `Masquer l'analyse complète de ${match.home} vs ${match.away}` : `Voir l'analyse complète de ${match.home} vs ${match.away}`}
              className="text-[9px] uppercase tracking-widest font-bold transition-colors"
              style={{ color: C.data }}
            >
              {expanded ? 'Masquer l’analyse' : 'Voir l’analyse complète'}
            </button>
          )}
          <Link
            href={`/match/${generateMatchSlug(match.home, match.away, match.date)}`}
            className="text-[9px] uppercase tracking-widest font-bold transition-colors"
            style={{ color: C.gold }}
          >
            {labels.openMatch} →
          </Link>
        </div>
      </div>

      {/* ─── Inline keyframes ─── */}
      <style jsx>{`
        @keyframes dashFade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </article>
  )
}

// ─── ComboPickRow — one row inside AI COMBO OF THE DAY ──────────────────
function ComboPickRow({ pick, index }: { pick: ComboPick; index: number }) {
  const num = String(index + 1).padStart(2, '0')
  const marketColor = pick.market === 'BTTS' ? C.success : C.warning

  return (
    <div className="rounded-lg p-2.5" style={{
      backgroundColor: C.surface2,
      border: `1px solid ${C.border}`,
    }}>
      {/* Row 1: number + match name + league/time */}
      <div className="flex items-start gap-2 mb-1.5">
        <span className="text-[12px] font-black tabular-nums flex-shrink-0 mt-0.5" style={{ color: C.gold }}>
          {num}
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-bold truncate" style={{ color: C.text }}>
            {pick.match.home} <span style={{ color: C.textSec }}>vs</span> {pick.match.away}
          </div>
          <div className="text-[9px] uppercase tracking-wider font-bold truncate" style={{ color: C.textSec }}>
            {pick.match.league} · {pick.match.time || '--:--'}
          </div>
        </div>
      </div>

      {/* Row 2: market badge + real probability */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span
          className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider flex-shrink-0"
          style={{
            backgroundColor: `${marketColor}15`,
            color: marketColor,
            border: `1px solid ${marketColor}30`,
          }}
        >
          {pick.market}
        </span>
        <span className="text-[14px] font-black tabular-nums" style={{ color: marketColor }}>
          {(pick.probability * 100).toFixed(1)}%
        </span>
      </div>

      {/* Row 3: meta info — source/quality/confidence (real values only) */}
      <div className="flex items-center justify-between gap-2 mt-1.5 pt-1.5 text-[8px]" style={{
        borderTop: `1px solid ${C.border}`,
        color: C.textSec,
      }}>
        <span className="uppercase tracking-wider font-bold truncate flex-1 min-w-0">
          {normalizeDataSource(pick.match.dataSource)} · {pick.dataQuality}
        </span>
        <span className="flex items-center gap-1 flex-shrink-0">
          <span className="uppercase tracking-wider font-bold">Confidence</span>
          <span className="font-black tabular-nums" style={{ color: C.gold }}>
            {Math.round(pick.reliabilityScore)}%
          </span>
        </span>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────
export default function BttsTodayDashboard() {
  const { lang } = useLanguage()
  const t = translationsFor(lang)
  const [matches, setMatches] = useState<MatchData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [generationDate, setGenerationDate] = useState<string | null>(null)
  const [todayMatches, setTodayMatches] = useState<MatchData[]>([])
  const [upcomingMatches, setUpcomingMatches] = useState<MatchData[]>([])
  const [now, setNow] = useState<number>(() => Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    fetch('/predictions.json')
      .then(r => r.json())
      .then(data => {
        const raw: RawPrediction[] = data?.free || data?.predictions || []
        // Today's date in Africa/Dakar (Senegal timezone = UTC+0 / GMT)
        // Important: do NOT use UTC blindly — use Intl with explicit timezone to ensure
        // the date matches the site's local day, even if the user's browser uses another TZ.
        const todayStr = getDakarDateString()

        // Group by match (predictions.json stores one row per market — BTTS or Over 2.5)
        const map = new Map<string, MatchData>()
        for (const p of raw) {
          const key = p.match || `${p.home || ''} vs ${p.away || ''} ${p.date || ''}`
          if (!map.has(key)) {
            map.set(key, {
              key,
              home: p.home || '',
              away: p.away || '',
              league: p.league || '—',
              date: p.date || '',
              time: p.time || '--:--',
              homeLogo: p.homeLogo,
              awayLogo: p.awayLogo,
              bttsProb: p.bttsProb,
              over25Prob: p.over25Prob,
              homeLambda: p.homeLambda,
              awayLambda: p.awayLambda,
              xgHome: p.xgHome,
              xgAway: p.xgAway,
              xgTotal: p.xgTotal,
              reliabilityScore: p.reliabilityScore,
              dataSource: p.dataSource,
              dataQuality: p.dataQuality,
              matchCountHome: p.matchCountHome,
              matchCountAway: p.matchCountAway,
              aiExactScore: p.ai_exact_score,
              exactScoreProb: p.exact_score_prob,
              aiBttsView: p.ai_btts_view,
              aiOver25View: p.ai_over25_view,
              aiKeyFact: p.ai_key_fact,
              aiAnalysis: p.ai_analysis,
            })
          } else {
            // Merge missing fields from sibling row (BTTS row may carry bttsProb,
            // Over 2.5 row may carry over25Prob)
            const existing = map.get(key)!
            if (existing.bttsProb == null && p.bttsProb != null) existing.bttsProb = p.bttsProb
            if (existing.over25Prob == null && p.over25Prob != null) existing.over25Prob = p.over25Prob
            if (existing.homeLambda == null && p.homeLambda != null) existing.homeLambda = p.homeLambda
            if (existing.awayLambda == null && p.awayLambda != null) existing.awayLambda = p.awayLambda
            if (existing.reliabilityScore == null && p.reliabilityScore != null) existing.reliabilityScore = p.reliabilityScore
            if (existing.dataSource == null && p.dataSource != null) existing.dataSource = p.dataSource
            if (existing.dataQuality == null && p.dataQuality != null) existing.dataQuality = p.dataQuality
            if (existing.matchCountHome == null && p.matchCountHome != null) existing.matchCountHome = p.matchCountHome
            if (existing.matchCountAway == null && p.matchCountAway != null) existing.matchCountAway = p.matchCountAway
            if (existing.aiExactScore == null && p.ai_exact_score != null) existing.aiExactScore = p.ai_exact_score
            if (existing.exactScoreProb == null && p.exact_score_prob != null) existing.exactScoreProb = p.exact_score_prob
            if (existing.aiBttsView == null && p.ai_btts_view != null) existing.aiBttsView = p.ai_btts_view
            if (existing.aiOver25View == null && p.ai_over25_view != null) existing.aiOver25View = p.ai_over25_view
            if (existing.aiKeyFact == null && p.ai_key_fact != null) existing.aiKeyFact = p.ai_key_fact
            if (existing.aiAnalysis == null && p.ai_analysis != null) existing.aiAnalysis = p.ai_analysis
          }
        }

        // Separate today's matches from upcoming matches.
        // - todayMatches: date === todayStr (real today matches, Africa/Dakar)
        // - upcomingMatches: date > todayStr (kept for the "À venir" section)
        // We never show past matches (date < todayStr).
        const all = [...map.values()]
          .filter(m => m.date >= todayStr)
          .sort((a, b) => {
            const da = `${a.date}T${a.time || '23:59'}`
            const db = `${b.date}T${b.time || '23:59'}`
            return da.localeCompare(db)
          })

        setMatches(all)
        setTodayMatches(all.filter(m => m.date === todayStr))
        setUpcomingMatches(all.filter(m => m.date > todayStr))
        if (typeof data?.date === 'string' && data.date.length > 0) setGenerationDate(data.date)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const finishedTodayMatches = useMemo(
    () => todayMatches.filter(m => getDakarMatchStatus(m.date, m.time, new Date(now)) === 'finished'),
    [todayMatches, now],
  )
  const liveTodayMatches = useMemo(
    () => todayMatches.filter(m => getDakarMatchStatus(m.date, m.time, new Date(now)) === 'live'),
    [todayMatches, now],
  )
  const scheduledTodayMatches = useMemo(
    () => todayMatches.filter(m => getDakarMatchStatus(m.date, m.time, new Date(now)) === 'upcoming'),
    [todayMatches, now],
  )

  // ─── Real stats from loaded data (no fabrication) ──────────────────────
  const stats = useMemo(() => {
    // « Today » = matchs réellement affichés (filtrés par date >= todayStr dans useEffect).
    // On utilise matches.length qui correspond exactement à ce qui est rendu dans la grille.
    const bttsHigh = matches.filter(m => (m.bttsProb ?? 0) >= 0.6).length
    const overHigh = matches.filter(m => (m.over25Prob ?? 0) >= 0.6).length
    const highQuality = matches.filter(m => (m.dataQuality || '').toUpperCase() === 'HIGH').length
    const avgReliability = matches.length > 0
      ? Math.round(matches.reduce((s, m) => s + (m.reliabilityScore ?? 0), 0) / matches.length)
      : null

    // todayCount = number of active/scheduled matches for today (Africa/Dakar).
    // Finished matches remain visible in their own section but are not counted as current selections.
    return {
      todayCount: scheduledTodayMatches.length + liveTodayMatches.length,
      total: matches.length,
      bttsHigh,
      overHigh,
      highQuality,
      avgReliability,
    }
  }, [matches, scheduledTodayMatches, liveTodayMatches])

  // ─── AI COMBO OF THE DAY — deterministic selection from real data only ──
  // Eligibility filter (NO recalculation — uses predictions.json values as-is):
  //   1. dataQuality !== 'LOW' (and must be a known value)
  //   2. reliabilityScore >= 70
  //   3. bttsProb >= 0.65 OR over25Prob >= 0.65
  // For each qualifying match, the market with the higher qualifying probability
  // is selected (deterministic — no randomization).
  // Sort order (deterministic, stable):
  //   1. reliabilityScore DESC
  //   2. selected probability DESC
  //   3. dataQuality HIGH > MEDIUM
  //   4. matchCountTotal (real ESPN matches) DESC
  //   5. alphabetical (home vs away) — stable tiebreak
  const combo = useMemo<ComboPick[]>(() => {
    if (loading || matches.length === 0) return []

    const candidates: ComboPick[] = []

    for (const m of [...liveTodayMatches, ...scheduledTodayMatches]) {
      const dq = (m.dataQuality || '').toUpperCase()
      if (dq === 'LOW' || dq === '') continue

      const sampleSize = (m.matchCountHome ?? 0) + (m.matchCountAway ?? 0)
      if (sampleSize < 2) continue

      const rs = m.reliabilityScore ?? 0
      if (!Number.isFinite(rs) || rs < 70) continue

      const btts = m.bttsProb ?? 0
      const over = m.over25Prob ?? 0

      const bttsQualifies = Number.isFinite(btts) && btts >= 0.65
      const overQualifies = Number.isFinite(over) && over >= 0.65

      if (!bttsQualifies && !overQualifies) continue

      let market: 'BTTS' | 'OVER 2.5'
      let probability: number
      if (bttsQualifies && overQualifies) {
        if (btts >= over) { market = 'BTTS'; probability = btts }
        else { market = 'OVER 2.5'; probability = over }
      } else if (bttsQualifies) {
        market = 'BTTS'; probability = btts
      } else {
        market = 'OVER 2.5'; probability = over
      }

      candidates.push({
        match: m,
        market,
        probability,
        reliabilityScore: rs,
        dataQuality: dq,
        matchCountTotal: (m.matchCountHome ?? 0) + (m.matchCountAway ?? 0),
      })
    }

    const dataQualityRank = (dq: string) => dq === 'HIGH' ? 2 : dq === 'MEDIUM' ? 1 : 0

    candidates.sort((a, b) => {
      if (a.reliabilityScore !== b.reliabilityScore) return b.reliabilityScore - a.reliabilityScore
      if (a.probability !== b.probability) return b.probability - a.probability
      const dqA = dataQualityRank(a.dataQuality)
      const dqB = dataQualityRank(b.dataQuality)
      if (dqA !== dqB) return dqB - dqA
      if (a.matchCountTotal !== b.matchCountTotal) return b.matchCountTotal - a.matchCountTotal
      const keyA = `${a.match.home} vs ${a.match.away}`
      const keyB = `${b.match.home} vs ${b.match.away}`
      return keyA.localeCompare(keyB)
    })

    return candidates.slice(0, 3)
  }, [liveTodayMatches, scheduledTodayMatches, loading])

  // ─── Filters ──────────────────────────────────────────────────────────
  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: t.predictions.all },
    { id: 'BTTS', label: 'BTTS' },
    { id: 'O2.5', label: 'Over 2.5' },
    { id: 'HIGH', label: lang === 'fr' ? 'Confiance élevée' : lang === 'en' ? 'High confidence' : 'ثقة عالية' },
  ]

  const filteredMatches = useMemo(() => {
    return matches.filter(m => {
      if (activeFilter === 'BTTS') return (m.bttsProb ?? 0) >= 0.5
      if (activeFilter === 'O2.5') return (m.over25Prob ?? 0) >= 0.5
      if (activeFilter === 'HIGH') return (m.reliabilityScore ?? 0) >= 80
      return true
    })
  }, [matches, activeFilter])

  const insufficientDataLabel = lang === 'fr'
    ? 'Projection masquée : échantillon de données insuffisant.'
    : lang === 'en'
      ? 'Projection hidden: insufficient data sample.'
      : 'تم إخفاء التوقع: عينة البيانات غير كافية.'
  const labels: DashboardLabels = lang === 'fr'
    ? { exactScore: 'Score exact proposé', projection: 'Projection issue des données disponibles, sans garantie de résultat.', source: 'Source', quality: 'Qualité', matches: 'matchs', dataConfidence: 'Confiance des données', aiAnalysis: 'Analyse IA', score: 'Score', xgHome: 'xG domicile', xgAway: 'xG extérieur', xgTotal: 'xG total', openMatch: 'Ouvrir la page du match' }
    : lang === 'en'
      ? { exactScore: 'Proposed exact score', projection: 'Projection based on available data, with no result guaranteed.', source: 'Source', quality: 'Quality', matches: 'matches', dataConfidence: 'Data confidence', aiAnalysis: 'AI analysis', score: 'Score', xgHome: 'Home xG', xgAway: 'Away xG', xgTotal: 'Total xG', openMatch: 'Open match page' }
      : { exactScore: 'النتيجة الدقيقة المقترحة', projection: 'توقع مبني على البيانات المتاحة دون ضمان للنتيجة.', source: 'المصدر', quality: 'الجودة', matches: 'مباريات', dataConfidence: 'موثوقية البيانات', aiAnalysis: 'تحليل الذكاء الاصطناعي', score: 'النتيجة', xgHome: 'xG صاحب الأرض', xgAway: 'xG الضيف', xgTotal: 'إجمالي xG', openMatch: 'فتح صفحة المباراة' }

  // ─── Render ───────────────────────────────────────────────────────────
  return (
    <section id="btts-today-dashboard" className="max-w-[1200px] mx-auto px-3 sm:px-4 py-4 sm:py-6">

      {/* ─── DASHBOARD HEADER ─── */}
      <div className="rounded-xl p-3 sm:p-4 mb-4" style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
      }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: C.success, boxShadow: `0 0 6px ${C.success}` }}
              />
              <span className="text-[9px] uppercase tracking-widest font-black" style={{ color: C.success }}>
                BTTSPredict
              </span>
              <span className="text-[9px] uppercase tracking-widest" style={{ color: C.textSec }}>
                · AI + Statistical Engine
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black" style={{ color: C.text, fontFamily: 'Poppins, sans-serif' }}>
              {lang === 'fr' ? 'Pronostics du jour' : lang === 'en' ? 'Today’s predictions' : 'توقعات اليوم'}
            </h2>
            <p className="text-[10px]" style={{ color: C.textSec }}>
              {lang === 'fr' ? 'Prédictions statistiques basées sur des données réelles de matchs' : lang === 'en' ? 'Statistical predictions powered by real match data' : 'توقعات إحصائية مبنية على بيانات حقيقية للمباريات'}
              {generationDate ? ` · ${fmtDate(generationDate)}` : ''}
            </p>
          </div>
        </div>

        {/* ─── Stats row (real values only) ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
          <StatBlock label={lang === 'fr' ? 'Matchs' : lang === 'en' ? 'Matches' : 'المباريات'} value={fmtInt(stats.todayCount)} accent={C.text} />
          <StatBlock label={lang === 'fr' ? 'BTTS élevé' : lang === 'en' ? 'BTTS high' : 'BTTS مرتفع'} value={fmtInt(stats.bttsHigh)} accent={C.success} />
          <StatBlock label={lang === 'fr' ? 'Over 2.5 élevé' : lang === 'en' ? 'Over 2.5 high' : 'Over 2.5 مرتفع'} value={fmtInt(stats.overHigh)} accent={C.warning} />
          <StatBlock label={lang === 'fr' ? 'Qualité des données' : lang === 'en' ? 'Data quality' : 'جودة البيانات'} value={stats.highQuality > 0 ? 'HIGH' : '—'} accent={stats.highQuality > 0 ? C.success : C.textSec} />
        </div>

        {stats.avgReliability != null && (
          <div className="mt-2 flex flex-col gap-1 text-[10px]" style={{ color: C.textSec }}>
            <div className="flex items-center gap-2">
              <span className="uppercase tracking-widest font-bold">{lang === 'fr' ? 'Confiance moyenne des données :' : lang === 'en' ? 'Average data confidence:' : 'متوسط موثوقية البيانات:'}</span>
              <span className="font-black tabular-nums" style={{ color: C.gold }}>{stats.avgReliability}%</span>
            </div>
            <span className="text-[8px] italic" style={{ color: C.textMute }}>
              {lang === 'fr' ? 'Qualité des données disponibles — ce n’est pas une probabilité de réussite.' : lang === 'en' ? 'Available data quality — this is not a probability of success.' : 'جودة البيانات المتاحة — ليست احتمالاً للنجاح.'}
            </span>
          </div>
        )}
      </div>

      {/* ─── AI COMBO OF THE DAY ─── */}
      {/* Deterministic selection — NO Gemini call from client, NO recalculation. */}
      {/* Source: /predictions.json fields only (bttsProb, over25Prob, reliabilityScore, dataQuality, dataSource). */}
      {!loading && (liveTodayMatches.length > 0 || scheduledTodayMatches.length > 0) && (
        <div className="rounded-xl p-3 sm:p-4 mb-4" style={{
          backgroundColor: C.surface,
          border: `1px solid ${C.gold}40`,
          boxShadow: `0 0 24px ${C.gold}08`,
        }}>
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base flex-shrink-0" style={{ color: C.gold }}>✦</span>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-widest font-black" style={{ color: C.gold }}>
                {lang === 'fr' ? 'Combo IA du jour' : lang === 'en' ? 'AI Combo of the Day' : 'تركيبة الذكاء الاصطناعي لليوم'}
              </div>
              <div className="text-[9px]" style={{ color: C.textSec }}>
                {combo.length === 3
                  ? (lang === 'fr' ? 'Sélection statistique · 3 choix' : lang === 'en' ? 'Statistical selection · 3 picks' : 'اختيار إحصائي · 3 اختيارات')
                  : (lang === 'fr' ? 'Sélection statistique' : lang === 'en' ? 'Statistical selection' : 'اختيار إحصائي')}
              </div>
              <div className="text-[8px] mt-0.5 italic" style={{ color: C.textMute }}>
                {lang === 'fr' ? 'Sélection déterministe basée sur les données disponibles — ne garantit aucun résultat.' : lang === 'en' ? 'Deterministic selection based on available data — no result is guaranteed.' : 'اختيار محدد يعتمد على البيانات المتاحة — لا توجد ضمانات لأي نتيجة.'}
              </div>
            </div>
          </div>

          {/* Picks — exactly 3 required, otherwise neutral empty state. Legacy copy: No combo available today. */}
          {combo.length < 3 ? (
            <div className="py-4 text-center">
              <p className="text-[11px] font-bold" style={{ color: C.text }}>
                {t.predictions.noCombo}
              </p>
              <p className="text-[9px] mt-1" style={{ color: C.textSec }}>
                {lang === 'fr' ? 'Conditions : qualité des données différente de LOW, fiabilité ≥ 70 %, BTTS ou Over 2.5 ≥ 65 %.' : lang === 'en' ? 'Eligibility: data quality is not LOW, reliability ≥ 70%, BTTS or Over 2.5 ≥ 65%.' : 'الشروط: جودة البيانات ليست منخفضة، الموثوقية ≥ 70%، وBTTS أو Over 2.5 ≥ 65%.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {combo.map((pick, i) => (
                <ComboPickRow
                  key={`${pick.match.key}-${pick.market}`}
                  pick={pick}
                  index={i}
                />
              ))}
            </div>
          )}

          {/* Disclaimer — discrete */}
          <p className="text-[9px] mt-3 text-center" style={{ color: C.textMute }}>
            {lang === 'fr' ? 'Sélection IA basée sur les sorties du modèle statistique. Aucun pari n’est garanti.' : lang === 'en' ? 'AI selection based on statistical model outputs. No bet is guaranteed.' : 'اختيار الذكاء الاصطناعي مبني على مخرجات النموذج الإحصائي. لا توجد ضمانات لأي رهان.'}
          </p>
        </div>
      )}

      {/* ─── FILTERS ─── */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-3">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            aria-pressed={activeFilter === f.id}
            className="px-3 py-1.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap flex-shrink-0"
            style={{
              backgroundColor: activeFilter === f.id ? C.success : C.surface,
              color: activeFilter === f.id ? C.bg : C.textSec,
              border: `1px solid ${activeFilter === f.id ? C.success : C.border}`,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ─── TODAY'S MATCHES ─── */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="rounded-xl h-64 animate-pulse" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }} />
          ))}
        </div>
      ) : (
        <>
          {/* ─── Section: Aujourd'hui ─── */}
          <div className="mb-6">
            <h3 className="text-xs uppercase tracking-widest font-black mb-3" style={{ color: C.text }}>
              {lang === 'fr' ? 'À venir aujourd’hui' : lang === 'en' ? 'Today — upcoming' : 'المباريات القادمة اليوم'}
              <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{
                backgroundColor: (scheduledTodayMatches.length + liveTodayMatches.length) > 0 ? `${C.success}20` : `${C.textMute}20`,
                color: (scheduledTodayMatches.length + liveTodayMatches.length) > 0 ? C.success : C.textMute,
              }}>
                {scheduledTodayMatches.length + liveTodayMatches.length}
              </span>
            </h3>
            {scheduledTodayMatches.length === 0 ? (
              <div className="rounded-xl p-8 text-center" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
                <p className="text-sm font-bold mb-1" style={{ color: C.text }}>{lang === 'fr' ? 'Aucun match disponible aujourd’hui' : lang === 'en' ? 'No match available today' : 'لا توجد مباريات متاحة اليوم'}</p>
                <p className="text-[11px]" style={{ color: C.textSec }}>{lang === 'fr' ? 'Revenez plus tard ou consultez les matchs à venir ci-dessous.' : lang === 'en' ? 'Come back later or check the upcoming matches below.' : 'عد لاحقاً أو راجع المباريات القادمة أدناه.'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {[...liveTodayMatches, ...scheduledTodayMatches]
                  .filter(m => passesFilter(m, activeFilter))
                  .map((m, i) => (
                    <MatchCard key={`today-${m.key}`} match={m} index={i} insufficientDataLabel={insufficientDataLabel} labels={labels} />
                  ))}
              </div>
            )}
          </div>

          {finishedTodayMatches.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-widest font-black mb-3" style={{ color: C.textSec }}>
                {lang === 'fr' ? 'Terminés aujourd’hui' : lang === 'en' ? 'Finished today' : 'انتهت اليوم'}
                <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: `${C.textMute}20`, color: C.textMute }}>
                  {finishedTodayMatches.length}
                </span>
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 opacity-80">
                {finishedTodayMatches.filter(m => passesFilter(m, activeFilter)).map((m, i) => (
                  <MatchCard key={`finished-${m.key}`} match={m} index={i} insufficientDataLabel={insufficientDataLabel} labels={labels} />
                ))}
              </div>
            </div>
          )}

          {liveTodayMatches.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-widest font-black mb-3" style={{ color: C.success }}>
                {lang === 'fr' ? 'En direct / en cours' : lang === 'en' ? 'Live / in progress' : 'مباشر / قيد اللعب'}
                <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: `${C.success}20`, color: C.success }}>
                  {liveTodayMatches.length}
                </span>
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {liveTodayMatches.filter(m => passesFilter(m, activeFilter)).map((m, i) => (
                  <MatchCard key={`live-${m.key}`} match={m} index={i} insufficientDataLabel={insufficientDataLabel} labels={labels} />
                ))}
              </div>
            </div>
          )}

          {/* ─── Section: À venir ─── */}
          {upcomingMatches.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-widest font-black mb-3" style={{ color: C.text }}>
                {lang === 'fr' ? 'À venir' : lang === 'en' ? 'Upcoming' : 'القادمة'}
                <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{
                  backgroundColor: `${C.textSec}20`,
                  color: C.textSec,
                }}>
                  {upcomingMatches.length}
                </span>
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {upcomingMatches
                  .filter(m => passesFilter(m, activeFilter))
                  .map((m, i) => (
                    <MatchCard key={`upcoming-${m.key}`} match={m} index={i} insufficientDataLabel={insufficientDataLabel} labels={labels} />
                  ))}
              </div>
            </div>
          )}

          {/* Empty state when both sections are empty under current filter */}
          {scheduledTodayMatches.length === 0 && liveTodayMatches.length === 0 && upcomingMatches.length === 0 && (
            <div className="rounded-xl p-8 text-center" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
              <p className="text-sm font-bold mb-1" style={{ color: C.text }}>{lang === 'fr' ? 'Aucun match sous ce filtre' : lang === 'en' ? 'No matches under this filter' : 'لا توجد مباريات ضمن هذا الفلتر'}</p>
              <p className="text-[11px]" style={{ color: C.textSec }}>{lang === 'fr' ? 'Essayez un autre filtre ou revenez plus tard.' : lang === 'en' ? 'Try another filter or come back later.' : 'جرّب فلترًا آخر أو عد لاحقاً.'}</p>
            </div>
          )}
        </>
      )}

      {/* ─── Footer disclaimer ─── */}
      <p className="text-center text-[10px] mt-6" style={{ color: C.textSec }}>
        {lang === 'fr' ? 'Prédictions statistiques basées sur xG + modèle de Poisson. Aucun résultat futur garanti. 18+' : lang === 'en' ? 'Statistical predictions based on xG + Poisson model. No future result guaranteed. 18+.' : 'توقعات إحصائية مبنية على xG ونموذج بواسون. لا توجد ضمانات لنتيجة مستقبلية. 18+'}
      </p>
    </section>
  )
}
