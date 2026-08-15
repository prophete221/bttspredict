'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useAnimations'
import { AFFILIATE } from '@/lib/constants'
import { staggerContainer, staggerChildFadeUp, subtleHover } from '@/lib/motionPresets'
import { resolveTeamLogo } from '@/lib/teamLogos'
import PremiumButton from './PremiumButton'
import { useLanguage } from './LanguageSwitcher'
import { translationsFor, type Locale } from '@/lib/i18n'

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

function formatDateShort(dateStr: string, lang: 'fr' | 'en' | 'ar' = 'fr') {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr + 'T12:00:00')
    const day = d.getDate().toString().padStart(2, '0')
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const today = new Date(); today.setHours(12, 0, 0, 0)
    const matchDate = new Date(dateStr + 'T12:00:00')
    const diffDays = Math.round((matchDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    const labels = lang === 'en' ? { today: 'Today', tomorrow: 'Tomorrow', weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] } : lang === 'ar' ? { today: 'اليوم', tomorrow: 'غداً', weekdays: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'] } : { today: "Aujourd'hui", tomorrow: 'Demain', weekdays: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'] }
    if (diffDays === 0) return labels.today
    if (diffDays === 1) return labels.tomorrow
    return `${labels.weekdays[d.getDay()]} ${day}/${month}`
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
  aiExactScore?: string
  exactScoreProb?: string
  aiBttsProb?: string
  aiOver25Prob?: string
  aiKeyFact?: string
  aiAnalysis?: string
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
function PredictionCard({ match, index, initialLocale }: { match: MatchData; index: number; initialLocale?: Locale }) {
  const [expanded, setExpanded] = useState(false)
  const { lang: detectedLang } = useLanguage()
  const lang = initialLocale ?? detectedLang
  const t = translationsFor(lang)
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
  const dateLabel = formatDateShort(match.date, lang)

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
      className="prediction-match-card squircle-lg overflow-hidden hover:border-success/30 transition-all"
    >
      {/* Top accent line */}
      <div className="prediction-match-card__accent h-px bg-gradient-to-r from-transparent via-success/40 to-transparent" />

      <div className="prediction-match-card__body p-4 sm:p-5">
        {/* Header row: status + league */}
        <div className="prediction-match-card__meta flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 min-w-0">
            {status === 'live' && (
              <span className="badge badge-live">
                <span className="v31-ticker-dot live" /> <span className="live-text">LIVE</span>
              </span>
            )}
            {status === 'upcoming' && (
              <span className="text-[10px] text-cendre mono tabular-nums">{match.time || '--:--'}</span>
            )}
            {status === 'finished' && (
              <span className="text-[10px] text-cendre mono tabular-nums">{match.time || '--:--'}</span>
            )}
            <span className="text-[10px] text-cendre uppercase tracking-widest font-semibold truncate">
              {match.league}
            </span>
          </div>
          <span className="text-[10px] text-cendre mono whitespace-nowrap">{dateLabel}</span>
        </div>

        {/* Teams */}
        <div className="prediction-match-card__teams grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-4">
          {/* Home */}
          <div className="prediction-match-card__team flex flex-col items-center text-center gap-2">
            <TeamLogo src={homeLogo} name={home} size={40} />
            <span className="text-sm font-semibold text-papier truncate max-w-full leading-tight">{home}</span>
          </div>

          {/* VS */}
          <div className="flex flex-col items-center">
            <span className="text-base font-bold text-success mono">VS</span>
            <span className="text-[9px] text-cendre uppercase tracking-widest mt-1">match</span>
          </div>

          {/* Away */}
          <div className="prediction-match-card__team flex flex-col items-center text-center gap-2">
            <TeamLogo src={awayLogo} name={away} size={40} />
            <span className="text-sm font-semibold text-papier truncate max-w-full leading-tight">{away}</span>
          </div>
        </div>

        {/* ═══ UNIFIED PREDICTION — BTTS + Over 2.5 in ONE block (Oui/Non only) ═══ */}
        <div className="prediction-match-card__analysis bg-dark-900 border border-edge rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-success/15 border border-success/30 flex items-center justify-center">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#B8FF1A" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-success-light">{t.predictions.aiPick}</span>
            </div>
            <span className="text-[10px] text-cendre">BTTS + Over 2.5</span>
          </div>

          {/* Two markets side by side — Oui/Non only */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* BTTS column */}
            <div className="space-y-2 text-center">
              <div className="text-[10px] uppercase tracking-widest font-bold text-[#B8FF1A]">BTTS</div>
              <div className="text-2xl sm:text-3xl font-black" style={{ color: bttsPred.prediction === 'Oui' ? '#B8FF1A' : '#B7C4C1' }}>
                {bttsPred.prediction === 'Oui' ? t.predictions.bttsYes : t.predictions.bttsNo}
              </div>
            </div>

            {/* Over 2.5 column */}
            <div className="space-y-2 text-center border-l border-[#5D7880] pl-3 sm:pl-4">
              <div className="text-[10px] uppercase tracking-widest font-bold text-[#B8FF1A]">Over 2.5</div>
              <div className="text-2xl sm:text-3xl font-black" style={{ color: over25Pred.prediction === 'Oui' ? '#B8FF1A' : '#B7C4C1' }}>
                {over25Pred.prediction === 'Oui' ? t.predictions.bttsYes : t.predictions.bttsNo}
              </div>
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
                {/* BTTSPredict AI enrichment */}
                {(match.aiKeyFact || match.aiExactScore) && (
                  <div className="bg-[#B8FF1A]/5 rounded-lg p-3 border border-[#B8FF1A]/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B8FF1A" strokeWidth="2">
                          <path d="M12 2L2 7l10 5 10-5-10-5z" />
                          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-[#B8FF1A]">BTTSPredict AI</span>
                      </div>
                      {match.aiExactScore && (
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] uppercase tracking-wider text-[#B7C4C1]">{t.predictions.predictedScore}</span>
                          <span className="text-sm font-black font-mono text-[#B8FF1A] px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(199,244,100,0.12)' }}>
                            {match.aiExactScore}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Probability row */}
                    {(match.aiExactScore || match.aiBttsProb || match.aiOver25Prob) && (
                      <div className="grid grid-cols-3 gap-1.5 mb-2">
                        {match.aiExactScore && match.exactScoreProb && (
                          <div className="text-center rounded p-1.5" style={{ backgroundColor: 'rgba(199,244,100,0.08)' }}>
                            <div className="text-[8px] uppercase text-[#B7C4C1]">Score</div>
                            <div className="text-[11px] font-bold text-[#B8FF1A]">{match.exactScoreProb}</div>
                          </div>
                        )}
                        {match.aiBttsProb && (
                          <div className="text-center rounded p-1.5" style={{ backgroundColor: 'rgba(123,228,149,0.08)' }}>
                            <div className="text-[8px] uppercase text-[#B7C4C1]">BTTS</div>
                            <div className="text-[11px] font-bold text-[#B8FF1A]">{match.aiBttsProb}</div>
                          </div>
                        )}
                        {match.aiOver25Prob && (
                          <div className="text-center rounded p-1.5" style={{ backgroundColor: 'rgba(255,209,102,0.08)' }}>
                            <div className="text-[8px] uppercase text-[#B7C4C1]">Over 2.5</div>
                            <div className="text-[11px] font-bold text-[#B8FF1A]">{match.aiOver25Prob}</div>
                          </div>
                        )}
                      </div>
                    )}

                    {match.aiKeyFact && (
                      <p className="text-[11px] text-[#F5F8F3] font-semibold mb-2">📊 {match.aiKeyFact}</p>
                    )}
                    {match.aiAnalysis && (
                      <p className="text-[11px] text-[#B7C4C1] leading-relaxed">{match.aiAnalysis}</p>
                    )}
                  </div>
                )}

                {/* CTA */}
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-cendre mb-2">{t.predictions.betMatch}</div>
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
              <>{t.predictions.analysis} <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" /></svg></>
            ) : (
              <>{t.predictions.analysis} <span className="truncate max-w-[140px]">{home} – {away}</span> <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg></>
            )}
          </button>
          {/* LIEN "PAGE MATCH" MASQUÉ TEMPORAIREMENT */}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────
export default function FreePredictions({ initialLocale }: { initialLocale?: Locale } = {}) {
  const [ref, isVisible] = useScrollAnimation()
  const { lang: detectedLang } = useLanguage()
  const lang = initialLocale ?? detectedLang
  const t = translationsFor(lang)
  const [matches, setMatches] = useState<MatchData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeLeague, setActiveLeague] = useState<string>('all')
  const [activeType, setActiveType] = useState<FilterType>('all')
  const [activeDate, setActiveDate] = useState<DateFilter>('all')

  useEffect(() => {
    fetch('/predictions.json')
      .then(r => r.json())
      .then(data => {
        // v91: data.free is an array of matches, each with predictions[] containing BOTH BTTS + Over 2.5
        const rawPredictions = data?.free || data?.predictions || []
        if (!rawPredictions || rawPredictions.length === 0) {
          setLoading(false)
          return
        }
        const matchMap = new Map<string, MatchData>()
        for (const p of rawPredictions) {
          // v91: each prediction already groups both markets under p.predictions[]
          // If p.predictions[] exists, use it directly. Otherwise build from legacy fields.
          const preds = Array.isArray(p.predictions) && p.predictions.length > 0
            ? p.predictions.map(pr => ({
                type: pr.type,
                prediction: pr.prediction,
                confidence: pr.confidence,
                bttsProb: pr.bttsProb ?? p.bttsProb,
                over25Prob: pr.over25Prob ?? p.over25Prob,
                homeLambda: pr.homeLambda ?? p.homeLambda ?? p.xgHome,
                awayLambda: pr.awayLambda ?? p.awayLambda ?? p.xgAway,
              }))
            : [{
                type: p.type || 'BTTS',
                prediction: p.prediction,
                confidence: p.confidence,
                bttsProb: p.bttsProb,
                over25Prob: p.over25Prob,
                homeLambda: p.homeLambda ?? p.xgHome,
                awayLambda: p.awayLambda ?? p.xgAway,
              }]

          const key = p.match
          if (!matchMap.has(key)) {
            matchMap.set(key, {
              match: p.match,
              league: p.league,
              date: p.date,
              time: p.time || '--:--',
              homeLogo: p.homeLogo || '',
              awayLogo: p.awayLogo || '',
              predictions: preds,
              reliabilityScore: p.reliabilityScore,
              xgTotal: p.xgTotal,
              analysis: p.analysis,
              aiKeyFact: p.ai_key_fact,
              aiAnalysis: p.ai_analysis,
              aiExactScore: p.ai_exact_score,
              exactScoreProb: p.exact_score_prob,
              aiBttsProb: p.ai_btts_prob,
              aiOver25Prob: p.ai_over25_prob,
            })
          }
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
      <h2 className="sr-only">{lang === 'en' ? "Today's AI predictions — free BTTS and Over 2.5" : lang === 'ar' ? 'توقعات الذكاء الاصطناعي لليوم — BTTS وOver 2.5 مجاناً' : 'Pronostics IA du jour — BTTS et Over 2.5 gratuits'}</h2>
      <div className="max-w-[440px] mx-auto">
        {/* Compact filter chips — rounded-full, horizontal scroll */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="filter-command-dashboard mb-3"
        >
          <div className="filter-command-dashboard__header">
            <div className="flex items-center gap-2">
              <span className="filter-command-dashboard__pulse" aria-hidden="true" />
              <span>{t.hero.commandCenter}</span>
            </div>
            <span className="filter-command-dashboard__mode">{t.hero.liveData}</span>
          </div>
          <div className="filter-command-dashboard__track">
          {/* Date filter chips */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {([
              { id: 'all', label: t.predictions.all },
              { id: 'today', label: t.predictions.today },
              { id: 'tomorrow', label: t.predictions.tomorrow },
              { id: '7days', label: lang === 'en' ? '7d' : lang === 'ar' ? '7 أيام' : '7j' },
            ] as { id: DateFilter; label: string }[]).map(f => (
              <button
                key={f.id}
                onClick={() => setActiveDate(f.id)}
                aria-pressed={activeDate === f.id}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeDate === f.id
                    ? 'text-[#071018] border-none'
                    : 'text-[#B7C4C1] border border-[#5D7880]'
                }`}
                style={activeDate === f.id ? { backgroundColor: '#B8FF1A' } : { backgroundColor: '#0D1A20' }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="w-px h-4 bg-[#5D7880] flex-shrink-0" />

          {/* Market filter chips */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {([
              { id: 'all', label: t.predictions.all },
              { id: 'BTTS', label: 'BTTS' },
              { id: 'O2.5', label: 'O2.5' },
            ] as { id: FilterType; label: string }[]).map(f => (
              <button
                key={f.id}
                onClick={() => setActiveType(f.id)}
                aria-pressed={activeType === f.id}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeType === f.id
                    ? 'text-[#071018] border-none'
                    : 'text-[#B7C4C1] border border-[#5D7880]'
                }`}
                style={activeType === f.id ? { backgroundColor: '#B8FF1A' } : { backgroundColor: '#0D1A20' }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="w-px h-4 bg-[#5D7880] flex-shrink-0" />

          {/* League filter chips */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {leagues.map(league => (
              <button
                key={league}
                onClick={() => setActiveLeague(league)}
                aria-pressed={activeLeague === league}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeLeague === league
                    ? 'text-[#071018] border-none'
                    : 'text-[#B7C4C1] border border-[#5D7880]'
                }`}
                style={activeLeague === league ? { backgroundColor: '#B8FF1A' } : { backgroundColor: '#0D1A20' }}
              >
                {league === 'all' ? t.predictions.leagues : league}
              </button>
            ))}
          </div>

          {/* Live count badge if matches live */}
          {stats.live > 0 && (
            <>
              <span className="w-px h-4 bg-[#5D7880] flex-shrink-0" />
              <span className="live-text text-[10px] uppercase tracking-widest font-bold whitespace-nowrap flex-shrink-0">
                {stats.live} LIVE
              </span>
            </>
          )}
          </div>
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B8FF1A" strokeWidth="1.5">
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <p className="text-papier text-sm font-bold mb-2">{t.predictions.noMatches}</p>
            <p className="text-cendre text-xs">{lang === 'ar' ? 'جرّب فلترًا آخر أو عد لاحقاً.' : lang === 'en' ? 'Try another filter or come back later.' : 'Essaie un autre filtre ou reviens plus tard.'}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {filteredMatches.map((m, i) => (
              <PredictionCard key={`${m.match}-${m.date}-${m.time}`} match={m} index={i} initialLocale={lang} />
            ))}
          </div>
        )}

        <p className="text-center text-[11px] text-cendre mt-6">
          {lang === 'ar' ? 'توقع إحصائي مبني على xG ونموذج بواسون. لا توجد ضمانات مستقبلية. 18+' : lang === 'en' ? 'Statistical prediction based on xG and a Poisson model. No future guarantee. 18+.' : 'Prediction statistique basee sur xG + modele Poisson. Aucune garantie future. 18+'}
        </p>

        {/* CTA — Voir tous les pronostics du jour (page dédiée) */}
        <div className="text-center mt-5">
          <a
            href="/btts/predictions/today"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
            style={{
              background: 'linear-gradient(135deg, #B8FF1A, #B8FF1A)',
              color: '#071018',
              boxShadow: '0 4px 16px rgba(127, 162, 198, 0.30)',
            }}
          >
            {t.predictions.seeAll} →
          </a>
        </div>
      </div>
    </section>
  )
}
