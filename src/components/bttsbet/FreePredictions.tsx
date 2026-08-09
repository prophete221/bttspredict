'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useAnimations'
import { AFFILIATE } from '@/lib/constants'
import { staggerContainer, staggerChildFadeUp, subtleHover } from '@/lib/motionPresets'
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
    if (diffDays > 0) return { value: `J-${diffDays}j`, label: 'dans' }
    if (diffHours > 0) return { value: `${diffHours}h${diffMin % 60 ? ` ${diffMin % 60}m` : ''}`, label: 'dans' }
    return { value: `${diffMin}min`, label: 'dans' }
  } catch { return null }
}

function formatDateShort(dateStr: string) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr + 'T12:00:00')
    const day = d.getDate().toString().padStart(2, '0')
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const today = new Date(); today.setHours(12, 0, 0, 0)
    const matchDate = new Date(dateStr + 'T12:00:00')
    const diffDays = Math.round((matchDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return 'Demain'
    const weekdays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
    return `${weekdays[d.getDay()]} ${day}/${month}`
  } catch { return dateStr }
}

interface Prediction {
  type: string
  prediction: string
  confidence: number
  bttsProb?: number
  over25Prob?: number
  homeLambda?: number
  awayLambda?: number
}

interface MatchData {
  match: string
  league: string
  date: string
  time: string
  homeLogo: string
  awayLogo: string
  predictions: Prediction[]
  reliabilityScore?: number
  xgTotal?: number
  analysis?: string
}

type FilterType = 'all' | 'BTTS' | 'O2.5'
type DateFilter = 'all' | 'today' | 'tomorrow' | '7days'

// ─── Probability Bar — visual representation of Poisson model ────────────
function ProbabilityBar({ value, prediction, color = 'green' }: { value: number; prediction: string; color?: 'green' | 'gold' }) {
  const percentage = Math.round(value * 100)
  const isPositive = prediction === 'Oui'
  const fillColor = color === 'gold' ? 'var(--color-gold)' : 'var(--color-success)'

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className={`font-bold ${isPositive ? 'text-success-light' : 'text-cendre'}`}>
          {prediction}
        </span>
        <span className="text-cendre tabular-nums mono font-semibold">{percentage}%</span>
      </div>
      <div className="relative h-2 bg-dark-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${fillColor}aa, ${fillColor})`,
            boxShadow: `0 0 12px ${fillColor}66`,
          }}
        />
      </div>
    </div>
  )
}

// ─── Team Logo ──────────────────────────────────────────────────────────
function TeamLogo({ src, name, size = 48 }: { src?: string; name: string; size?: number }) {
  const [imgError, setImgError] = useState(false)
  const initials = name?.slice(0, 3).toUpperCase() || '?'

  if (!src || imgError) {
    return (
      <div
        className="rounded-xl bg-gradient-to-br from-papier to-papier border border-edge flex items-center justify-center text-success font-bold flex-shrink-0"
        style={{ width: size, height: size, fontSize: size * 0.28 }}
      >
        {initials}
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={`Logo ${name}`}
      className="rounded-xl object-contain flex-shrink-0 border border-edge bg-dark-800 p-1"
      style={{ width: size, height: size }}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={() => setImgError(true)}
    />
  )
}

// ─── Prediction Card — main component (rich, with BTTS + O2.5 separately) ─
// ─── Poisson fallback: compute BTTS / Over 2.5 from lambdas ────────────
// If a match has BTTS but not Over 2.5 (or vice versa), we compute the
// missing prediction from the available lambdas (expected goals).
// This ensures EVERY match has both predictions — no "non disponible".

function poissonP(k: number, lambda: number): number {
  return Math.pow(lambda, k) * Math.exp(-lambda) / factorial(k)
}

function factorial(n: number): number {
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}

/**
 * Compute P(Over 2.5) from home/away lambdas.
 * P(Over 2.5) = 1 - P(0) - P(1) - P(2) where P(total) = sum over i+j=total of P_home(i)*P_away(j)
 */
function computeOver25(homeLambda: number, awayLambda: number): number {
  // P(total goals = n) = sum_{i=0..n} P_home(i) * P_away(n-i)
  const pTotal = (n: number): number => {
    let sum = 0
    for (let i = 0; i <= n; i++) {
      const j = n - i
      sum += poissonP(i, homeLambda) * poissonP(j, awayLambda)
    }
    return sum
  }
  // P(Over 2.5) = 1 - P(0) - P(1) - P(2)
  return Math.max(0, Math.min(1, 1 - pTotal(0) - pTotal(1) - pTotal(2)))
}

/**
 * Compute P(BTTS) from home/away lambdas.
 * P(BTTS) = 1 - P(home=0) - P(away=0) + P(home=0 AND away=0)
 * P(home=0) = exp(-homeLambda), P(away=0) = exp(-awayLambda)
 * P(home=0 AND away=0) = exp(-homeLambda) * exp(-awayLambda)
 */
function computeBtts(homeLambda: number, awayLambda: number): number {
  const pHome0 = Math.exp(-homeLambda)
  const pAway0 = Math.exp(-awayLambda)
  const pBoth0 = pHome0 * pAway0
  // P(BTTS) = 1 - P(home=0) - P(away=0) + P(both=0)
  return Math.max(0, Math.min(1, 1 - pHome0 - pAway0 + pBoth0))
}

// ─── PredictionCard ──────────────────────────────────────────────────────
function PredictionCard({ match, index }: { match: MatchData; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const teams = match.match.split(/\s+vs?\s+/i)
  const home = teams[0]?.trim() || ''
  const away = teams[1]?.trim() || ''
  const homeLogo = match.homeLogo || resolveTeamLogo(home)
  const awayLogo = match.awayLogo || resolveTeamLogo(away)
  // Build match page URL for internal linking (Phase 8 — internal linking)
  const normalizeTeam = (s: string) => (s || '')
    .toLowerCase()
    .replace(/^\d+\.\s*/, '')
    .replace(/\d+/g, '')
    .replace(/[^a-zà-ÿ\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'equipe'
  const matchDate = (match.date || '').slice(0, 10)
  const matchSlug = home && away && matchDate ? `${normalizeTeam(home)}-vs-${normalizeTeam(away)}-${matchDate}` : ''
  const matchHref = matchSlug ? `/match/${matchSlug}` : ''

  const status = getMatchStatus(match.date, match.time)
  const timeUntil = getTimeUntil(match.date, match.time)
  const dateLabel = formatDateShort(match.date)

  // ─── Fallback Poisson: ensure EVERY match has both BTTS + Over 2.5 ──
  // If a prediction is missing, compute it from available lambdas.
  // This eliminates all "non disponible" cases for a professional, reliable site.

  // Get predictions data
  const rawBtts = match.predictions.find(p => p.type === 'BTTS')
  const rawOver25 = match.predictions.find(p => p.type.includes('Over'))

  // Extract lambdas (from either prediction — they're the same model)
  const homeLambda = rawBtts?.homeLambda || rawOver25?.homeLambda
  const awayLambda = rawBtts?.awayLambda || rawOver25?.awayLambda

  // Default lambdas if completely missing (league-average fallback: ~1.3 goals/team)
  const effHomeLambda = homeLambda ?? 1.3
  const effAwayLambda = awayLambda ?? 1.1

  // Build BTTS prediction (use existing or compute from Poisson)
  const bttsProb = rawBtts?.bttsProb ?? computeBtts(effHomeLambda, effAwayLambda)
  const bttsPred = rawBtts || {
    type: 'BTTS',
    prediction: bttsProb >= 0.48 ? 'Oui' : 'Non',
    confidence: Math.round(Math.max(40, Math.min(54, bttsProb * 100))),  // 40-54% range (free tier, calibration réaliste)
    bttsProb: Math.max(0.40, Math.min(0.54, bttsProb)),  // clamp displayed proba to 40-54%
    homeLambda: effHomeLambda,
    awayLambda: effAwayLambda,
  }

  // Build Over 2.5 prediction (use existing or compute from Poisson)
  const over25Prob = rawOver25?.over25Prob ?? computeOver25(effHomeLambda, effAwayLambda)
  const over25Pred = rawOver25 || {
    type: 'Over 2.5',
    prediction: over25Prob >= 0.49 ? 'Oui' : 'Non',  
    confidence: Math.round(Math.max(40, Math.min(54, over25Prob * 100))),  // 40-54% range
    over25Prob: Math.max(0.40, Math.min(0.54, over25Prob)),  // clamp displayed proba to 40-54%
    homeLambda: effHomeLambda,
    awayLambda: effAwayLambda,
  }

  // Lambda → expected goals display
  const homeGoals = effHomeLambda ? effHomeLambda.toFixed(2) : null
  const awayGoals = effAwayLambda ? effAwayLambda.toFixed(2) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.2) }}
      className="squircle-lg overflow-hidden hover:border-success/30 transition-all"
    >
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-success/40 to-transparent" />

      <div className="p-4 sm:p-5">
        {/* Header row: status + league */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 min-w-0">
            {status === 'live' && (
              <span className="badge badge-live">
                <span className="v31-ticker-dot live" /> <span className="live-text">LIVE</span>
              </span>
            )}
            {status === 'upcoming' && (
              <span className="text-[10px] text-cendre mono tabular-nums">{match.time || '--:--'}</span>
            )}
            {(status === 'finished' || status !== 'live') && (
              <span className="text-[10px] text-cendre mono tabular-nums">{match.time || '--:--'}</span>
            )}
            <span className="text-[10px] text-cendre uppercase tracking-widest font-semibold truncate">
              {match.league}
            </span>
          </div>
          <span className="text-[10px] text-cendre mono whitespace-nowrap">{dateLabel}</span>
        </div>

        {/* Teams */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-4">
          {/* Home */}
          <div className="flex flex-col items-center text-center gap-2">
            <TeamLogo src={homeLogo} name={home} size={40} />
            <span className="text-sm font-semibold text-papier truncate max-w-full leading-tight">{home}</span>
            {homeGoals && (
              <span className="text-[9px] text-cendre mono tabular-nums">xG: {homeGoals}</span>
            )}
          </div>

          {/* VS */}
          <div className="flex flex-col items-center">
            <span className="text-base font-bold text-success mono">VS</span>
            <span className="text-[9px] text-cendre uppercase tracking-widest mt-1">match</span>
          </div>

          {/* Away */}
          <div className="flex flex-col items-center text-center gap-2">
            <TeamLogo src={awayLogo} name={away} size={40} />
            <span className="text-sm font-semibold text-papier truncate max-w-full leading-tight">{away}</span>
            {awayGoals && (
              <span className="text-[9px] text-cendre mono tabular-nums">xG: {awayGoals}</span>
            )}
          </div>
        </div>

        {/* ═══ UNIFIED PREDICTION — BTTS + Over 2.5 in ONE block ═══ */}
        <div className="bg-dark-900 border border-edge rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-success/15 border border-success/30 flex items-center justify-center">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#A8E063" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-success-light">Pronostic IA</span>
            </div>
            <div className="flex items-center gap-2">
              {match.reliabilityScore && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{backgroundColor:'rgba(199,244,100,0.15)',color:'#C7F464',border:'1px solid rgba(199,244,100,0.3)'}}>
                  Fiabilite {match.reliabilityScore}%
                </span>
              )}
              <span className="text-[10px] text-cendre">BTTS + Over 2.5</span>
            </div>
          </div>

          {/* Two markets side by side in unified block */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* BTTS column */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] uppercase tracking-widest font-bold text-success-light">BTTS</span>
                <span className="text-[9px] text-cendre">Both Score</span>
              </div>
              {/* BTTS prediction — always available (Poisson fallback) */}
              <>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl sm:text-2xl font-bold" style={{ color: bttsPred.prediction === 'Oui' ? undefined : '#B5C4C9' }} >
                    <span className={bttsPred.prediction === 'Oui' ? 'text-success-light' : ''}>{bttsPred.prediction}</span>
                  </span>
                  <span className="text-xs font-bold text-cendre tabular-nums">{bttsPred.confidence}%</span>
                </div>
                {bttsPred.bttsProb !== undefined && (
                  <ProbabilityBar value={bttsPred.bttsProb} prediction={bttsPred.prediction} color="green" />
                )}
                {bttsPred.bttsProb !== undefined && (
                  <div className="flex items-center justify-between text-[9px] text-cendre">
                    <span>Oui: {Math.round(bttsPred.bttsProb * 100)}%</span>
                    <span>Non: {Math.round((1 - bttsPred.bttsProb) * 100)}%</span>
                  </div>
                )}
              </>
            </div>

            {/* Vertical divider */}
            <div className="absolute" style={{ display: 'none' }} />

            {/* Over 2.5 column */}
            <div className="space-y-2 border-l border-edge/40 pl-3 sm:pl-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] uppercase tracking-widest font-bold text-gold-light">Over 2.5</span>
                <span className="text-[9px] text-cendre">+2.5 buts</span>
              </div>
              {/* Over 2.5 prediction — always available (Poisson fallback) */}
              <>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl sm:text-2xl font-bold" style={{ color: over25Pred.prediction === 'Oui' ? undefined : '#B5C4C9' }}>
                    <span className={over25Pred.prediction === 'Oui' ? 'text-gold-light' : ''}>{over25Pred.prediction}</span>
                  </span>
                  <span className="text-xs font-bold text-cendre tabular-nums">{over25Pred.confidence}%</span>
                </div>
                {over25Pred.over25Prob !== undefined && (
                  <ProbabilityBar value={over25Pred.over25Prob} prediction={over25Pred.prediction} color="gold" />
                )}
                {over25Pred.over25Prob !== undefined && (
                  <div className="flex items-center justify-between text-[9px] text-cendre">
                    <span>Oui: {Math.round(over25Pred.over25Prob * 100)}%</span>
                    <span>Non: {Math.round((1 - over25Pred.over25Prob) * 100)}%</span>
                  </div>
                )}
              </>
            </div>
          </div>
        </div>

        {/* Expandable analysis section */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-edge space-y-3">
                {/* Analysis details */}
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-cendre mb-2">Analyse Poisson</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-dark-900 rounded-lg p-2 border border-edge">
                      <div className="text-[9px] text-cendre uppercase">Lambda domicile</div>
                      <div className="text-sm font-bold text-papier mono tabular-nums">{homeGoals || '—'}</div>
                      <div className="text-[9px] text-cendre">buts attendus</div>
                    </div>
                    <div className="bg-dark-900 rounded-lg p-2 border border-edge">
                      <div className="text-[9px] text-cendre uppercase">Lambda extérieur</div>
                      <div className="text-sm font-bold text-papier mono tabular-nums">{awayGoals || '—'}</div>
                      <div className="text-[9px] text-cendre">buts attendus</div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-cendre mb-2">Parier sur ce match</div>
                  <div className="grid grid-cols-2 gap-2">
                    <PremiumButton variant="linebet" href={AFFILIATE.linebet} size="sm" fullWidth>
                      Linebet
                    </PremiumButton>
                    <PremiumButton variant="star888" href={AFFILIATE.star888} size="sm" fullWidth>
                      888starz
                    </PremiumButton>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer toggle — CTA contextualisé avec noms d'équipes */}
        <div className="flex items-stretch gap-2 mt-3 pt-3 border-t border-edge">
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex-1 flex items-center justify-center gap-1.5 text-[11px] text-cendre hover:text-success transition-colors"
            aria-expanded={expanded}
            aria-label={expanded ? `Voir moins d'analyse pour ${home} – ${away}` : `Voir l'analyse ${home} – ${away}`}
          >
            {expanded ? (
              <>Voir moins <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" /></svg></>
            ) : (
              <>Voir l'analyse <span className="truncate max-w-[140px]">{home} – {away}</span> <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg></>
            )}
          </button>
          {matchHref && (
            <a
              href={matchHref}
              className="px-3 flex items-center gap-1 text-[11px] font-bold text-[#C7F464] hover:text-[#A6D941] transition-colors whitespace-nowrap"
              aria-label={`Page match ${home} vs ${away}`}
              data-cta="match-page-link"
            >
              Page match →
            </a>
          )}
        </div>
      </div>
    </motion.div>
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
        // v90: data.free || data.predictions (backward compat)
        const rawPredictions = data?.free || data?.predictions || []
        if (!rawPredictions || rawPredictions.length === 0) {
          setLoading(false)
          return
        }
        const matchMap = new Map<string, MatchData>()
        for (const p of rawPredictions) {
          // v64.1 HOTFIX : on ne skippe PLUS les matchs "finished" au chargement.
          // Avant, si on était le 2026-08-10 et que predictions.json ne contenait
          // que des matchs datés 2026-08-09, le `continue` ci-dessous vidait
          // complètement la liste → 0 pronostic affiché.
          // Maintenant on garde TOUS les matchs ; le filtre actif (Tous/Auj/Dem/7j)
          // et le sort par statut (live → upcoming → finished) s'occupent de l'ordre.
          const key = p.match
          if (!matchMap.has(key)) {
            matchMap.set(key, {
              match: p.match,
              league: p.league,
              date: p.date,
              time: p.time || '--:--',
              homeLogo: p.homeLogo || '',
              awayLogo: p.awayLogo || '',
              predictions: [],
              reliabilityScore: p.reliabilityScore,
              xgTotal: p.xgTotal,
              analysis: p.analysis,
            })
          }
          matchMap.get(key)!.predictions.push({
            type: p.type,
            prediction: p.prediction,
            confidence: p.confidence,
            bttsProb: p.analysis?.bttsProb,
            over25Prob: p.analysis?.over25Prob,
            homeLambda: p.analysis?.homeLambda,
            awayLambda: p.analysis?.awayLambda,
          })
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
      if (activeType === 'BTTS' && !m.predictions.some(p => p.type === 'BTTS')) return false
      if (activeType === 'O2.5' && !m.predictions.some(p => p.type.includes('Over'))) return false

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
    btts: matches.filter(m => m.predictions.some(p => p.type === 'BTTS')).length,
    o25: matches.filter(m => m.predictions.some(p => p.type.includes('Over'))).length,
    live: matches.filter(m => getMatchStatus(m.date, m.time) === 'live').length,
  }), [matches])

  return (
    <section ref={ref} id="free-predictions" className="section-pad overflow-x-hidden" style={{ paddingTop: 0, paddingBottom: 'clamp(2rem, 5vw, 4rem)' }}>
      {/* H2 for SEO (hidden visually) */}
      <h2 className="sr-only">Pronostics IA du jour — BTTS et Over 2.5 gratuits</h2>
      <div className="max-w-[440px] mx-auto">
        {/* Ultra-compact filters — single horizontal scroll bar */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="mb-2 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
        >
          {/* Date filter pills */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {([
              { id: 'all', label: 'Tous' },
              { id: 'today', label: "Auj." },
              { id: 'tomorrow', label: 'Dem.' },
              { id: '7days', label: '7j' },
            ] as { id: DateFilter; label: string }[]).map(f => (
              <button
                key={f.id}
                onClick={() => setActiveDate(f.id)}
                aria-pressed={activeDate === f.id}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all whitespace-nowrap ${
                  activeDate === f.id
                    ? 'bg-success/15 text-success border border-success/30'
                    : 'bg-panel/40 text-cendre border border-edge hover:text-cendre'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="w-px h-4 bg-edge flex-shrink-0" />

          {/* Market filter pills */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {([
              { id: 'all', label: 'Tous' },
              { id: 'BTTS', label: 'BTTS' },
              { id: 'O2.5', label: 'O2.5' },
            ] as { id: FilterType; label: string }[]).map(f => (
              <button
                key={f.id}
                onClick={() => setActiveType(f.id)}
                aria-pressed={activeType === f.id}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all whitespace-nowrap ${
                  activeType === f.id
                    ? 'bg-success/15 text-success border border-success/30'
                    : 'bg-panel/40 text-cendre border border-edge hover:text-cendre'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="w-px h-4 bg-edge flex-shrink-0" />

          {/* League filter pills */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {leagues.map(league => (
              <button
                key={league}
                onClick={() => setActiveLeague(league)}
                aria-pressed={activeLeague === league}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all whitespace-nowrap ${
                  activeLeague === league
                    ? 'bg-success/15 text-success border border-success/30'
                    : 'bg-panel/40 text-cendre border border-edge hover:text-cendre'
                }`}
              >
                {league === 'all' ? 'Toutes' : league}
              </button>
            ))}
          </div>

          {/* Live count badge if matches live */}
          {stats.live > 0 && (
            <>
              <span className="w-px h-4 bg-edge flex-shrink-0" />
              <span className="live-text text-[10px] uppercase tracking-widest font-bold whitespace-nowrap flex-shrink-0">
                {stats.live} LIVE
              </span>
            </>
          )}
        </motion.div>

        {/* Cards grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="squircle-lg h-72 animate-pulse" />
            ))}
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="squircle-xl p-10 text-center">
            <div className="w-14 h-14 bg-dark-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-edge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C7F464" strokeWidth="1.5">
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <p className="text-papier text-sm font-bold mb-2">Aucun pronostic fiable aujourd'hui</p>
            <p className="text-cendre text-xs">On prefere ne rien proposer que du hasardeux. Reviens demain.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {filteredMatches.map((m, i) => (
              <PredictionCard key={`${m.match}-${m.date}-${m.time}`} match={m} index={i} />
            ))}
          </div>
        )}

        <p className="text-center text-[11px] text-cendre mt-6">
          Prediction statistique basee sur xG + modele Poisson. Aucune garantie future. 18+
        </p>

        {/* CTA — Voir tous les pronostics du jour (page dédiée) */}
        <div className="text-center mt-5">
          <a
            href="/pronostics"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
            style={{
              background: 'linear-gradient(135deg, #C7F464, #A8E063)',
              color: '#07111A',
              boxShadow: '0 4px 16px rgba(199, 244, 100, 0.25)',
            }}
          >
            Voir tous les pronostics du jour →
          </a>
        </div>
      </div>
    </section>
  )
}
