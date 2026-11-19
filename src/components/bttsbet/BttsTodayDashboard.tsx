'use client'

/**
 * BttsTodayDashboard — premium predictions dashboard for /btts/predictions/today
 *
 * Dashboard public mobile-first : marchés Gemini validés, filtres explicites,
 * cartes compactes et reveal progressif respectant reduced-motion.
 * Motion design 100% CSS/IO — reduced-motion : tout est désactivé et visible.
 * NOT a blog article.
 *
 * Data sources (read-only):
 *   - public/predictions.json (validated Gemini picks and fixture context)
 *
 * Current picks are read only from rows tagged as Gemini; empirical form data
 * remains context and is never turned into a frontend selection.
 * Fields consumed:
 *   match, league, date, time, homeLogo, awayLogo,
 *   home, away,
 *   bttsProb, over25Prob,                  ← validated Gemini market probabilities (0..1)
 *   dataSource,                            ← source label for match context
 *   matchCountHome, matchCountAway,        ← descriptive counts of observed matches per team
 *   ai_key_fact, ai_analysis               ← Gemini short text
 */

import { useEffect, useMemo, useRef, useState, type ReactNode, Children, isValidElement, cloneElement } from 'react'
import { trackAffiliateAction } from '@/lib/affiliateTracking'
import Link from 'next/link'
import { generateMatchSlug } from '@/lib/match-slug'
import { useLanguage } from './LanguageSwitcher'
import { translationsFor, type Locale, localizedPath } from '@/lib/i18n'
import { getDakarDateString, getDakarMatchStatus, getDakarDayDiff } from '@/lib/dakar-date'
import { buildBttsTodayDashboardData, type BttsTodayDashboardData, type BttsTodayMatchData as MatchData, type BttsTodayScheduleFixture as ScheduleFixture } from '@/lib/btts-today-dashboard-data'
import { summarizeVisibleBttsPredictions } from '@/lib/btts-today-dashboard-stats'
import { selectLocalizedAnalysis } from '@/lib/localized-analysis'
import BookmakerCardLinks from './BookmakerCardLinks'
import ShareAnalysisButton from './ShareAnalysisButton'
import VipMarketTeaser from './VipMarketTeaser'
import MissingMarketVipLink from './MissingMarketVipLink'
import TeamLogo from './TeamLogo'

// ─── FixturesCollapsible — page légère : n'affiche que les premières affiches ──
// Présentation uniquement : les données, textes, liens et le compteur restent inchangés.
const FIXTURES_PREVIEW_COUNT = 8
function FixturesCollapsible({ count, lang, preview: previewCount = FIXTURES_PREVIEW_COUNT, children }: { count: number; lang: Locale; preview?: number; children: ReactNode }) {
  const [expanded, setExpanded] = useState(false)
  if (expanded) return <>{children}</>
  const preview = Children.map(children, child => {
    if (!isValidElement(child)) return child
    const arrayChildren = Children.toArray((child.props as { children?: ReactNode }).children)
    return cloneElement(child, {}, arrayChildren.slice(0, previewCount))
  })
  const remaining = count - previewCount
  const moreLabel = lang === 'fr' ? `Voir les ${count} affiches` : lang === 'en' ? `View all ${count} fixtures` : `عرض جميع المباريات (${count})`
  return (
    <>
      {preview}
      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="btx-filter"
          aria-expanded={false}
          style={{ width: '100%', marginTop: 12, justifyContent: 'center' }}
        >
          {moreLabel} <span aria-hidden="true">↓</span>
        </button>
      )}
    </>
  )
}

// ─── Palette (V3 — bleu analyse, sémantique WIN/LOST/PENDING) ────────────────
const C = {
  bg:       '#0B0F14',
  surface:  '#141C25',
  surface2: '#0B0F14',
  border:   '#223041',
  text:     '#F2F6FA',
  textSec:  '#9DABBB',
  textMute: '#6B7A8C',
  success:  '#5B9CF0',
  warning:  '#FBBF24',
  data:     '#2F7DFF',
  gold:     '#E8C268',
  danger:   '#F87171',
}

// ─── Types ──────────────────────────────────────────────────────────────
interface DashboardLabels {
  source: string
  matches: string
  aiAnalysis: string
  openMatch: string
}

type FilterType = 'all' | 'BTTS' | 'O2.5'

type QuickFilter = 'all' | 'today'

type CardStatus = 'live' | 'scheduled' | 'finished'

// ─── Helpers ────────────────────────────────────────────────────────────
function fmtPct(p: number | undefined, locale: Locale = 'fr'): string {
  if (p == null || !Number.isFinite(p)) return '—'
  return new Intl.NumberFormat(locale === 'en' ? 'en-GB' : locale === 'ar' ? 'ar' : 'fr-FR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(p)
}

function fmtInt(n?: number): string {
  if (n == null || !Number.isFinite(n)) return '—'
  return String(Math.round(n))
}

function fmtFixtureDate(dateStr: string, locale: Locale, now = new Date()): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
  const diff = getDakarDayDiff(dateStr, now)
  if (diff === 0) return locale === 'en' ? 'Today' : locale === 'ar' ? 'اليوم' : 'Aujourd’hui'
  if (diff === 1) return locale === 'en' ? 'Tomorrow' : locale === 'ar' ? 'غداً' : 'Demain'
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : locale === 'ar' ? 'ar' : 'fr-FR', {
    timeZone: 'Africa/Dakar', day: '2-digit', month: 'short',
  }).format(new Date(`${dateStr}T12:00:00Z`))
}

function passesFilter(match: MatchData, activeFilter: FilterType): boolean {
  if (activeFilter === 'BTTS') return match.aiPicks.some(pick => pick.market === 'BTTS')
  if (activeFilter === 'O2.5') return match.aiPicks.some(pick => pick.market === 'O2.5')
  return true
}

function normalizeDataSource(s: string | undefined, locale: Locale): string {
  if (!s) return '—'
  if (s === 'ESPN_TEAM_SCHEDULE') return 'ESPN'
  if (s === 'LEAGUE_FALLBACK') return locale === 'en' ? 'League data' : locale === 'ar' ? 'بيانات البطولة' : 'Données de la ligue'
  return s
}

// Largeur de barre de probabilité (0..100%) — clampée, jamais recalculée.
function barWidth(p?: number): string {
  if (p == null || !Number.isFinite(p)) return '0%'
  const clamped = Math.min(100, Math.max(0, p * 100))
  return `${clamped.toFixed(1)}%`
}

// ─── useCountUp — compteur animé (reduced-motion aware) ─────────────────
function useCountUp(target: number, active: boolean, duration = 900): number {
  const [value, setValue] = useState(() => Number.isFinite(target) ? target : 0)
  const skippedInitialAnimation = useRef(false)
  useEffect(() => {
    if (!active || !Number.isFinite(target)) return
    if (!skippedInitialAnimation.current) {
      skippedInitialAnimation.current = true
      const id = requestAnimationFrame(() => setValue(target))
      return () => cancelAnimationFrame(id)
    }
    let reduce = false
    try {
      reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch {
      /* no-op */
    }
    if (reduce) {
      /* Valeur finale sans animation — différé d'un frame pour éviter un
         setState synchrone dans l'effet (cascade de rendus). */
      const id = requestAnimationFrame(() => setValue(target))
      return () => cancelAnimationFrame(id)
    }
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, active, duration])
  return Number.isFinite(target) ? value : 0
}

// ─── ProbBar — barre de probabilité animée (marché BTTS / Over 2.5) ─────
function ProbBar({ label, value, color, market, locale, missingMarket }: { label: string; value?: number; color: string; market: 'BTTS' | 'O2.5'; locale: Locale; missingMarket?: 'BTTS' | 'Over 2.5' }) {
  const noData = value == null || !Number.isFinite(value)
  return (
    <div className="btx-prob" data-market={market}>
      <div className="btx-prob__head">
        <span className="btx-prob__label">{label}</span>
        <span className="btx-prob__value" style={{ ['--pc' as string]: color, opacity: noData && !missingMarket ? 0.45 : 1 }}>
          {noData && missingMarket ? <MissingMarketVipLink locale={locale} market={missingMarket} /> : noData ? '—' : fmtPct(value, locale)}
        </span>
      </div>
      <div className="btx-bar" style={{ opacity: noData ? 0.4 : 1 }}>
        <span className="btx-bar__threshold" aria-hidden="true" />
        <span className="btx-bar__fill" style={{ ['--w' as string]: noData ? '0%' : barWidth(value), ['--pc' as string]: color }} />
      </div>
    </div>
  )
}

// ─── StatusChip — LIVE pulsant / Terminé / Heure ────────────────────────
function StatusChip({ status, time, lang, date, now }: { status: CardStatus; time: string; lang: Locale; date?: string; now: number }) {
  if (status === 'live') {
    return (
      <span className="btx-status btx-status--live">
        <span className="btx-status__dot" aria-hidden="true" />
        LIVE
      </span>
    )
  }
  if (status === 'finished') {
    return (
      <span className="btx-status btx-status--done">
        {lang === 'fr' ? 'Terminé' : lang === 'en' ? 'Full time' : 'انتهت'}
      </span>
    )
  }
  // Matchs à venir : afficher la date pour les journées suivantes (J+1 et plus)
  // afin qu'une affiche « 19:00 » de demain ne soit pas confondue avec celle du jour.
  let dayLabel = ''
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const diff = getDakarDayDiff(date, new Date(now))
    if (diff === 1) dayLabel = lang === 'fr' ? 'Demain' : lang === 'en' ? 'Tomorrow' : 'غداً'
    else if (diff > 1) {
      try {
        dayLabel = new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : lang === 'ar' ? 'ar' : 'fr-FR', {
          timeZone: 'Africa/Dakar', day: '2-digit', month: 'short',
        }).format(new Date(`${date}T12:00:00Z`))
      } catch { /* date invalide — libellé absent */ }
    }
  }
  return <span className="btx-status">{dayLabel ? `${dayLabel} · ` : ''}{time || '--:--'}</span>
}

// ─── Match Card — premium V3 (glass, liseré statut, sheen, barres animées) ──
function MatchCard({ match, index, status, lang, labels, now }: {
  match: MatchData
  index: number
  status: CardStatus
  lang: Locale
  labels: DashboardLabels
  now: number
}) {
  const [expanded, setExpanded] = useState(false)

  // N’afficher que les textes disponibles dans la langue de l’interface.
  const localized = (fr?: string, en?: string) => selectLocalizedAnalysis(fr, en, lang)
  const vKeyFact = localized(match.aiKeyFact, match.aiKeyFactEn)
  const vAnalysis = localized(match.aiAnalysis, match.aiAnalysisEn)
  const vFormSummary = localized(match.aiFormSummary, match.aiFormSummaryEn)
  const vAbsences = localized(match.aiAbsences, match.aiAbsencesEn)
  const vOddsInsight = localized(match.aiOddsInsight, match.aiOddsInsightEn)
  const hasLocalizedAnalysis = Boolean(vKeyFact || vAnalysis || vFormSummary || vAbsences || vOddsInsight)
  const hasSourceAnalysis = Boolean(match.aiKeyFact || match.aiAnalysis || match.aiFormSummary || match.aiAbsences || match.aiOddsInsight || match.aiKeyFactEn || match.aiAnalysisEn || match.aiFormSummaryEn || match.aiAbsencesEn || match.aiOddsInsightEn)

  // Statut fin pour les cartes « programmées » d'aujourd'hui : un match dont
  // l'heure est passée bascule en live/terminé via getDakarMatchStatus.
  const fine: CardStatus = useMemo(() => {
    if (status === 'finished') return 'finished'
    const s = getDakarMatchStatus(match.date, match.time, new Date(now))
    if (s === 'live') return 'live'
    if (s === 'finished') return 'finished'
    return 'scheduled'
  }, [status, match.date, match.time, now])

  const accent =
    fine === 'live' ? 'rgba(52, 211, 153, 0.85)'
    : fine === 'finished' ? 'rgba(107, 122, 140, 0.55)'
    : 'rgba(47, 125, 255, 0.8)'

  const dataSourceLabel = normalizeDataSource(match.dataSource, lang)
  const bttsPick = match.aiPicks.find(pick => pick.market === 'BTTS')
  const over25Pick = match.aiPicks.find(pick => pick.market === 'O2.5')

  const matchPath = localizedPath(`/match/${generateMatchSlug(match.home, match.away, match.date)}`, lang)

  return (
    <article
      className="btx-card btx-rev"
      style={{ ['--accent' as string]: accent, ['--d' as string]: `${Math.min(index, 8) * 50}ms` }}
      aria-label={`${match.home} vs ${match.away} — ${match.league}`}
    >
      <div className="btx-card__edge" aria-hidden="true" />
      <div className="btx-card__inner">
        {/* ─── TOP : ligue + statut ─── */}
        <div className="btx-card__top">
          <span className="btx-league">{match.league}</span>
          <StatusChip status={fine} time={match.time} lang={lang} date={match.date} now={now} />
        </div>

        {/* ─── TEAMS ─── */}
        <div className="btx-teams">
          <div className="btx-team">
            <TeamLogo src={match.homeLogo} name={match.home} />
            <span className="btx-team__name">{match.home}</span>
          </div>
          <div className="btx-vs" aria-hidden="true">
            <span className="btx-vs__line" />
            <span className="btx-vs__chip">VS</span>
            <span className="btx-vs__line" />
          </div>
          <div className="btx-team">
            <TeamLogo src={match.awayLogo} name={match.away} />
            <span className="btx-team__name">{match.away}</span>
          </div>
        </div>

        {/* ─── PROBABILITÉS — barres animées ─── */}
        <div className="btx-probs">
          <ProbBar
            label={`BTTS${bttsPick ? ` · ${bttsPick.prediction === 'Oui' ? (lang === 'en' ? 'Yes' : lang === 'ar' ? 'نعم' : 'Oui') : (lang === 'en' ? 'No' : lang === 'ar' ? 'لا' : 'Non')}` : ''}`}
            value={bttsPick?.proba}
            color="#34D399"
            market="BTTS"
            locale={lang}
            missingMarket={!bttsPick ? 'BTTS' : undefined}
          />
          <ProbBar
            label={`Over 2.5${over25Pick ? ` · ${over25Pick.prediction === 'Oui' ? (lang === 'en' ? 'Yes' : lang === 'ar' ? 'نعم' : 'Oui') : (lang === 'en' ? 'No' : lang === 'ar' ? 'لا' : 'Non')}` : ''}`}
            value={over25Pick?.proba}
            color="#FBBF24"
            market="O2.5"
            locale={lang}
            missingMarket={!over25Pick ? 'Over 2.5' : undefined}
          />
        </div>
        {/* ─── MÉTA : source / matchs pris en compte ─── */}
        <div className="btx-meta">
          <span className="btx-chip">
            {labels.source} <b style={{ ['--cc' as string]: '#7DB5FF' }}>{dataSourceLabel}</b>
          </span>
          <span className="btx-chip">
            {fmtInt(match.matchCountHome)} + {fmtInt(match.matchCountAway)} {labels.matches}
          </span>
        </div>

        {/* ─── ANALYSE IA GEMINI ─── */}
        {hasLocalizedAnalysis && (
          <div className="btx-ai">
            <div className="btx-ai__head">
              <span className="btx-ai__dot" aria-hidden="true" />
              <span className="btx-ai__label">{labels.aiAnalysis}</span>
            </div>
            {vKeyFact && <p className="btx-ai__fact">{vKeyFact}</p>}

            {/* Forme récente des deux équipes */}
            {vFormSummary && (
              <div style={{ margin: '0.45rem 0', padding: '0.55rem 0.65rem', borderRadius: 10, background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 3 }}>
                  {lang === 'fr' ? 'Forme récente (5 derniers matchs)' : lang === 'en' ? 'Recent form' : 'الفورمة الأخيرة'}
                </div>
                <div style={{ fontSize: 12.5, lineHeight: 1.5, opacity: 0.85 }}>📈 {vFormSummary}</div>
              </div>
            )}

            {/* Cotes réelles du marché (gratuit — ESPN/bookmaker) */}
            {match.odds && (match.odds.home || match.odds.away) && (
              <div style={{ margin: '0.45rem 0' }}>
                <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 4 }}>
                  {lang === 'fr' ? 'Cotes marché' : lang === 'en' ? 'Market odds' : 'أودز السوق'}{match.odds.provider ? ` · ${match.odds.provider}` : ''}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ flex: 1, textAlign: 'center', padding: '3px 0', borderRadius: 8, background: 'rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: 9, opacity: 0.55 }}>1</div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono, monospace)' }}>{match.odds.home ?? '—'}</div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center', padding: '3px 0', borderRadius: 8, background: 'rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: 9, opacity: 0.55 }}>{lang === 'en' ? 'D' : lang === 'ar' ? 'X' : 'N'}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono, monospace)' }}>{match.odds.draw ?? '—'}</div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center', padding: '3px 0', borderRadius: 8, background: 'rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: 9, opacity: 0.55 }}>2</div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono, monospace)' }}>{match.odds.away ?? '—'}</div>
                  </div>
                  {match.odds.over25 && (
                    <div style={{ flex: 1, textAlign: 'center', padding: '3px 0', borderRadius: 8, background: 'rgba(52,211,153,0.12)' }}>
                      <div style={{ fontSize: 9, opacity: 0.55 }}>O2.5</div>
                      <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono, monospace)', color: '#34D399' }}>{match.odds.over25}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {vAnalysis && (
              <p className="btx-ai__text">
                {expanded || vAnalysis.length <= 180 ? vAnalysis : `${vAnalysis.slice(0, 177)}…`}
              </p>
            )}

            {/* Lecture des cotes par l'IA */}
            {vOddsInsight && (
              <p style={{ fontSize: 12.5, lineHeight: 1.5, opacity: 0.7, margin: '0.4rem 0 0.2rem' }}>💰 {vOddsInsight}</p>
            )}

            {/* Disponibilités / absents */}
            {vAbsences && (
              <p style={{ fontSize: 12.5, lineHeight: 1.5, opacity: 0.7, margin: '0.2rem 0' }}>🩹 {vAbsences}</p>
            )}
            <div className="btx-actions" style={{ paddingInline: 0, borderTop: 'none', paddingTop: '0.55rem' }}>
              {vAnalysis && vAnalysis.length > 180 && (
                <button
                  onClick={() => setExpanded(e => !e)}
                  aria-expanded={expanded}
                  aria-label={expanded ? (lang === 'en' ? `Hide the full analysis of ${match.home} vs ${match.away}` : lang === 'ar' ? `إخفاء التحليل الكامل لـ ${match.home} ضد ${match.away}` : `Masquer l'analyse complète de ${match.home} vs ${match.away}`) : (lang === 'en' ? `View the full analysis of ${match.home} vs ${match.away}` : lang === 'ar' ? `عرض التحليل الكامل لـ ${match.home} ضد ${match.away}` : `Voir l'analyse complète de ${match.home} vs ${match.away}`)}
                  className="btx-link"
                  style={{ background: 'none', border: 'none', padding: 0 }}
                >
                  {expanded ? '−' : '+'} {expanded ? (lang === 'fr' ? 'Masquer l’analyse' : lang === 'en' ? 'Hide analysis' : 'إخفاء التحليل') : (lang === 'fr' ? 'Voir l’analyse complète' : lang === 'en' ? 'Full analysis' : 'التحليل الكامل')}
                </button>
              )}
              <Link
                href={matchPath}
                className="btx-link"
              >
                {labels.openMatch} →
              </Link>
              <ShareAnalysisButton
                home={match.home}
                away={match.away}
                league={match.league}
                date={match.date}
                time={match.time}
                bttsProbability={fmtPct(match.bttsProb, lang)}
                over25Probability={fmtPct(match.over25Prob, lang)}
                path={matchPath}
                locale={lang}
              />
            </div>
          </div>
        )}

        {/* Lien page match pour les cartes sans analyse IA */}
      {!hasLocalizedAnalysis && hasSourceAnalysis && lang !== 'fr' && (
        <p className="btx-ai__text">{lang === 'en' ? 'Analysis text is not available in English for this match yet.' : 'تحليل المباراة غير متاح بهذه اللغة حالياً.'}</p>
      )}

      {!hasLocalizedAnalysis && (
          <div className="btx-actions">
            <Link
              href={matchPath}
              className="btx-link"
            >
              {labels.openMatch} →
            </Link>
            <ShareAnalysisButton
              home={match.home}
              away={match.away}
              league={match.league}
              date={match.date}
              time={match.time}
              bttsProbability={fmtPct(match.bttsProb, lang)}
              over25Probability={fmtPct(match.over25Prob, lang)}
              path={matchPath}
              locale={lang}
            />
          </div>
        )}
        <VipMarketTeaser locale={lang} />
      </div>
    </article>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────
export default function BttsTodayDashboard({
  initialLocale,
  initialDashboard,
  initialNow,
}: { initialLocale?: Locale; initialDashboard?: BttsTodayDashboardData; initialNow?: number } = {}) {
  const { lang: detectedLang } = useLanguage()
  // Sur /en|/ar, la locale de l'URL gagne (immunise contre un ancien
  // localStorage 'bttsbet-lang' qui re-franciserait la page).
  const lang = initialLocale ?? detectedLang
  const t = translationsFor(lang)
  const sectionRef = useRef<HTMLElement | null>(null)

  // Vue du dashboard de prédictions (1×/session) — funnel : PRÉDICTION.
  useEffect(() => {
    trackAffiliateAction('platform', 'prediction_view', `dashboard:${window.location.pathname}`, { lang })
  }, [lang])
  const [dashboardData, setDashboardData] = useState<BttsTodayDashboardData>(() => initialDashboard ?? {
    matches: [], todayMatches: [], upcomingMatches: [], scheduleFixtures: [], generationDate: null,
  })
  const { matches, todayMatches, upcomingMatches, scheduleFixtures } = dashboardData
  const [loading, setLoading] = useState(!initialDashboard)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all')
  const selectMetric = (metric: QuickFilter) => {
    setActiveFilter('all')
    setQuickFilter(current => current === metric ? 'all' : metric)
    window.requestAnimationFrame(() => {
      const target = document.getElementById('btx-dashboard-grid')
      if (!target) return
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
    })
  }
  const [now, setNow] = useState<number>(() => initialNow ?? Date.now())

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setNow(Date.now()))
    const timer = window.setInterval(() => setNow(Date.now()), 60_000)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    fetch('/predictions.json')
      .then(r => r.json())
      .then(data => {
        // Replace the complete snapshot; never append it to the server-rendered rows.
        setDashboardData(buildBttsTodayDashboardData(data, new Date()))
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

  // ─── Filtres ──────────────────────────────────────────────────────────
  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: t.predictions.all },
    { id: 'BTTS', label: 'BTTS' },
    { id: 'O2.5', label: 'Over 2.5' },
  ]

  const passesDashboardFilters = (match: MatchData) => passesFilter(match, activeFilter)
  const visibleTodayMatches = [...liveTodayMatches, ...scheduledTodayMatches].filter(passesDashboardFilters)
  const visibleFinishedMatches = quickFilter === 'today' ? [] : finishedTodayMatches.filter(passesDashboardFilters)
  const visibleUpcomingMatches = quickFilter === 'today' ? [] : upcomingMatches.filter(passesDashboardFilters)
  const displayedPredictionMatches = [...visibleTodayMatches, ...visibleFinishedMatches, ...visibleUpcomingMatches]
  // Count only prediction cards currently rendered; schedule-only fixture rows are intentionally excluded.
  const stats = summarizeVisibleBttsPredictions(displayedPredictionMatches)
  const hasVisibleMatches = visibleTodayMatches.length + visibleFinishedMatches.length + visibleUpcomingMatches.length > 0
  const todayDate = getDakarDateString(new Date(now))
  const visibleFixtures = activeFilter === 'all' && (quickFilter === 'all' || quickFilter === 'today')
    ? scheduleFixtures.filter(fixture => quickFilter !== 'today' || fixture.date === todayDate)
    : []
  const hasVisibleContent = hasVisibleMatches || visibleFixtures.length > 0

  const filteredMatches = useMemo(() => matches.filter(m => passesFilter(m, activeFilter)), [matches, activeFilter])

  const labels: DashboardLabels = lang === 'fr'
    ? { source: 'Source', matches: 'matchs récents', aiAnalysis: 'Analyse du match', openMatch: 'Ouvrir la page du match' }
    : lang === 'en'
      ? { source: 'Source', matches: 'recent matches', aiAnalysis: 'Match analysis', openMatch: 'Open match page' }
      : { source: 'المصدر', matches: 'مباريات حديثة', aiAnalysis: 'تحليل المباراة', openMatch: 'فتح صفحة المباراة' }

  // ─── Révélation au scroll (IntersectionObserver, gate .btx3d) ─────────
  // Sans JS : cartes toujours visibles (progressive enhancement).
  // reduced-motion : tout est révélé immédiatement.
  useEffect(() => {
    const section = sectionRef.current
    if (!section || loading) return
    const cards = Array.from(section.querySelectorAll<HTMLElement>('.btx-rev:not(.is-revealed)'))
    if (cards.length === 0) return

    let reduced = false
    try {
      reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch {
      /* no-op */
    }
    if (reduced || typeof IntersectionObserver === 'undefined') {
      cards.forEach(c => c.classList.add('is-revealed'))
      return
    }

    section.classList.add('btx3d')
    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          el.style.transitionDelay = el.style.getPropertyValue('--d') || '0ms'
          el.classList.add('is-revealed')
          io.unobserve(el)
          const done = (e: TransitionEvent) => {
            if (e.propertyName !== 'transform') return
            el.style.transitionDelay = ''
            el.removeEventListener('transitionend', done)
          }
          el.addEventListener('transitionend', done)
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 }
    )
    cards.forEach(c => io.observe(c))
    return () => io.disconnect()
  }, [loading, activeFilter, quickFilter, filteredMatches, liveTodayMatches, scheduledTodayMatches, finishedTodayMatches, upcomingMatches, now])

  // ─── Compteurs animés du header ────────────────────────────────────────
  const animCount = useCountUp(stats.total, !loading)
  const countLabel = quickFilter === 'today'
    ? lang === 'fr' ? 'Matchs du jour' : lang === 'en' ? 'Matches today' : 'مباريات اليوم'
    : quickFilter === 'all' && activeFilter === 'all'
      ? lang === 'fr' ? 'Matchs avec pronostic' : lang === 'en' ? 'Matches with predictions' : 'مباريات بتوقعات'
      : lang === 'fr' ? 'Matchs affichés' : lang === 'en' ? 'Matches shown' : 'المباريات المعروضة'
  const countAriaLabel = lang === 'fr'
    ? quickFilter === 'today'
      ? `${animCount} matchs du jour affichés. Touchez pour revenir à tous les matchs avec pronostic.`
      : `${animCount} matchs affichés. Touchez pour filtrer les matchs du jour.`
    : lang === 'en'
      ? quickFilter === 'today'
        ? `${animCount} matches today. Activate to show all prediction matches.`
        : `${animCount} prediction matches shown. Activate to filter today’s matches.`
      : quickFilter === 'today'
        ? `${animCount} مباراة اليوم. اضغط لعرض جميع المباريات ذات التوقعات.`
        : `${animCount} مباراة معروضة ذات توقعات. اضغط لتصفية مباريات اليوم.`

  // ─── Render ───────────────────────────────────────────────────────────
  return (
    <section id="btts-today-dashboard" ref={sectionRef} lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} className="fi-today-dashboard max-w-[1200px] mx-auto px-3 sm:px-4 py-4 sm:py-6">

      {/* ─── HERO ─── */}
      <div className="btx-hero btx-rev p-4 sm:p-5 mb-4" style={{ ['--d' as string]: '0ms' }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="min-w-0">
            <span className="btx-eyebrow">
              <span className="btx-eyebrow-dot" aria-hidden="true" />
              BTTSPredict
            </span>
            <h2 className="btx-title">
              {lang === 'fr' ? <>Pronostics <em>du jour</em></> : lang === 'en' ? <>Today’s <em>picks</em></> : <>توقعات <em>اليوم</em></>}
            </h2>
            <p className="btx-sub">
              {lang === 'fr'
                ? 'BTTS · Over 2.5'
                : lang === 'en'
                  ? 'BTTS · Over 2.5'
                  : 'BTTS · Over 2.5'}
            </p>
          </div>
        </div>

        {/* ─── Stats réelles ─── */}
        <div className="btx-stats mt-4" role="group" aria-label={lang === 'fr' ? 'Nombre de pronostics affichés' : lang === 'en' ? 'Displayed prediction count' : 'عدد التوقعات المعروضة'}>
          <button type="button" className={`btx-stat${quickFilter === 'today' ? ' is-selected' : ''}`} aria-pressed={quickFilter === 'today'} aria-controls="btx-dashboard-grid" aria-describedby="btx-metric-help" aria-label={countAriaLabel} onClick={() => selectMetric('today')}>
            <div className="btx-stat__label">{countLabel}</div>
            <div className="btx-stat__value" style={{ ['--accent' as string]: '#F2F6FA' }}>{animCount}</div>
          </button>
        </div>

        <p id="btx-metric-help" className="btx-period-note">
          {lang === 'fr'
            ? 'Le compteur suit les matchs avec pronostic affichés; touchez-le pour basculer entre les matchs du jour et tous les matchs disponibles.'
            : lang === 'en'
              ? 'The count follows the prediction matches shown; tap it to switch between today’s matches and all available matches.'
              : 'يعرض العداد مباريات التوقعات؛ اضغط للتبديل بين مباريات اليوم وجميع المباريات المتاحة.'}
        </p>

      </div>

      <div id="btx-dashboard-grid" className="btx-dashboard-grid">
        <aside className="btx-dashboard-insights">
      <section
        className="btx-partner-rail btx-rev mb-4"
        aria-label={lang === 'fr' ? 'Partenaires' : lang === 'en' ? 'Partners' : 'الشركاء'}
        style={{ ['--d' as string]: '80ms' }}
      >
        <div className="btx-partner-rail__copy">
          <span className="btx-partner-rail__eyebrow">{lang === 'fr' ? 'Partenaires' : lang === 'en' ? 'Partners' : 'الشركاء'}</span>
          <p>
            {lang === 'fr'
              ? 'Liens partenaires — vérifiez les conditions et la disponibilité auprès de chaque opérateur.'
              : lang === 'en'
                ? 'Partner links — check each operator’s terms and availability.'
                : 'روابط الشركاء — تحقق من الشروط والتوافر لدى كل مشغّل.'}
          </p>
        </div>
        <BookmakerCardLinks locale={lang} placement="dashboard-partner-rail" compact />
      </section>

        </aside>
        <aside className="btx-dashboard-filters">
      {/* ─── FILTRES ─── */}
      <div id="opportunities" className="btx-filters btx-rev mb-4" role="group" aria-label={lang === 'fr' ? 'Filtres de pronostics' : lang === 'ar' ? 'مرشحات التوقعات' : 'Prediction filters'} style={{ ['--d' as string]: '90ms', scrollMarginTop: '84px' }}>
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => { setQuickFilter('all'); setActiveFilter(f.id) }}
            aria-pressed={activeFilter === f.id}
            className={`btx-filter${activeFilter === f.id ? ' is-active' : ''}`}
          >
            {f.label}
          </button>
        ))}
      </div>
        </aside>
        <div className="btx-dashboard-feed">
      {/* ─── SECTIONS MATCHS ─── */}
      {loading ? (
        <div className="btx-grid">
          {[1, 2, 3, 4].map(i => <div key={i} className="btx-skel" aria-hidden="true" />)}
        </div>
      ) : (
        <>
          {/* ─── Aujourd'hui (live + à venir) ─── */}
          <div className="mb-7">
            <h3 className="btx-section-title">
              {lang === 'fr' ? 'Aujourd’hui' : lang === 'en' ? 'Today' : 'اليوم'}
              <span className={`btx-count-pill${visibleTodayMatches.length > 0 ? ' btx-count-pill--green' : ' btx-count-pill--muted'}`}>
                {visibleTodayMatches.length}
              </span>
            </h3>
            {visibleTodayMatches.length === 0 && quickFilter === 'all' && activeFilter === 'all' && liveTodayMatches.length + scheduledTodayMatches.length === 0 && (visibleUpcomingMatches.length > 0 || visibleFixtures.some(fixture => fixture.date === todayDate)) ? (
              <div className="btx-empty">
                <p className="btx-empty__title">{visibleFixtures.some(fixture => fixture.date === todayDate)
                  ? lang === 'fr' ? 'Aucun pronostic disponible aujourd’hui' : lang === 'en' ? 'No prediction available today' : 'لا يوجد توقع متاح اليوم'
                  : lang === 'fr' ? 'Aucun match disponible aujourd’hui' : lang === 'en' ? 'No match available today' : 'لا توجد مباريات متاحة اليوم'}</p>
                <p className="btx-empty__sub">{visibleFixtures.some(fixture => fixture.date === todayDate)
                  ? lang === 'fr' ? 'Les rencontres sans pronostic sont listées séparément plus bas.' : lang === 'en' ? 'Matches without a pick are listed separately below.' : 'تُعرض المباريات بلا توقع في قسم منفصل أدناه.'
                  : lang === 'fr' ? 'Revenez plus tard ou consultez les matchs à venir ci-dessous.' : lang === 'en' ? 'Come back later or check the upcoming matches below.' : 'عد لاحقاً أو راجع المباريات القادمة أدناه.'}</p>
              </div>
            ) : visibleTodayMatches.length > 0 ? (
              <div className="btx-grid">
                {visibleTodayMatches.map((m, i) => (
                    <MatchCard
                      key={`today-${m.key}`}
                      match={m}
                      index={i}
                      status="scheduled"
                      lang={lang}
                      labels={labels}
                      now={now}
                    />
                ))}
              </div>
            ) : null}
          </div>

          {visibleFinishedMatches.length > 0 && (
            <div className="mb-7">
              <h3 className="btx-section-title" style={{ color: C.textSec }}>
                {/* Conservé pour cohérence i18n et tests d'acceptance */}
                {lang === 'fr' ? 'Terminés aujourd’hui' : lang === 'en' ? 'Finished today' : 'انتهت اليوم'}
                <span className="btx-count-pill btx-count-pill--muted">{visibleFinishedMatches.length}</span>
              </h3>
              <div className="btx-grid" style={{ opacity: 0.82 }}>
                {visibleFinishedMatches.map((m, i) => (
                  <MatchCard
                    key={`finished-${m.key}`}
                    match={m}
                    index={i}
                    status="finished"
                    lang={lang}
                    labels={labels}
                    now={now}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ─── À venir (autres jours) ─── */}
          {visibleUpcomingMatches.length > 0 && (
            <div className="mb-7">
              <h3 className="btx-section-title">
                {lang === 'fr' ? 'À venir' : lang === 'en' ? 'Upcoming' : 'القادمة'}
                <span className="btx-count-pill">{visibleUpcomingMatches.length}</span>
              </h3>
              {/* Page légère : aperçu de 6 cartes, le reste via « Voir tout » (présentation uniquement). */}
              <FixturesCollapsible count={visibleUpcomingMatches.length} lang={lang} preview={6}>
                <div className="btx-grid">
                  {visibleUpcomingMatches.map((m, i) => (
                      <MatchCard
                        key={`upcoming-${m.key}`}
                        match={m}
                        index={i}
                        status="scheduled"
                        lang={lang}
                        labels={labels}
                        now={now}
                      />
                  ))}
                </div>
              </FixturesCollapsible>
            </div>
          )}

          {visibleFixtures.length > 0 && (
            <section className="mb-7" aria-labelledby="btx-fixtures-title">
              <h3 id="btx-fixtures-title" className="btx-section-title">
                {lang === 'fr' ? 'Fixtures sans pronostic' : lang === 'en' ? 'Fixtures without a pick' : 'مباريات بلا توقع'}
                <span className="btx-count-pill btx-count-pill--muted">{visibleFixtures.length}</span>
              </h3>
              <p className="mb-3 text-xs" style={{ color: C.textSec }}>
                {lang === 'fr' ? 'Rencontres programmées par ESPN ; aucun pronostic n’est affiché.' : lang === 'en' ? 'ESPN-scheduled matches with no prediction available.' : 'مباريات مجدولة من ESPN؛ لا يتم عرض أي توقع.'}
              </p>
              {/* Page légère : seules les 8 premières affiches sont rendues,
                  le reste reste accessible via « Voir tout » (présentation uniquement —
                  aucune donnée, texte, lien ou SEO modifié). */}
              <FixturesCollapsible count={visibleFixtures.length} lang={lang}>
                <div className="btx-grid">
                  {visibleFixtures.map(fixture => (
                    <article key={fixture.key} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
                      <p style={{ color: C.text, fontWeight: 800 }}>{fixture.home} <span style={{ color: C.textSec }}>vs</span> {fixture.away}</p>
                      <p className="mt-1 text-xs" style={{ color: C.textSec }}>{fixture.league}</p>
                      <time className="mt-2 block text-xs" style={{ color: C.textMute }} dateTime={fixture.time ? `${fixture.date}T${fixture.time}` : fixture.date}>
                        {fmtFixtureDate(fixture.date, lang, new Date(now))}{fixture.time ? ` · ${fixture.time}` : ''}
                      </time>
                    </article>
                  ))}
                </div>
              </FixturesCollapsible>
            </section>
          )}

          {/* Empty state when both sections are empty under current filter */}
          {!hasVisibleContent && (
            <div className="btx-empty">
              <p className="btx-empty__title">{lang === 'fr' ? 'Aucun match sous ce filtre' : lang === 'en' ? 'No matches under this filter' : 'لا توجد مباريات ضمن هذا الفلتر'}</p>
              <p className="btx-empty__sub">{lang === 'fr' ? 'Essayez un autre filtre ou revenez plus tard.' : lang === 'en' ? 'Try another filter or come back later.' : 'جرّب فلترًا آخر أو عد لاحقاً.'}</p>
            </div>
          )}
        </>
      )}
        </div>
      </div>

      {/* ─── Footer disclaimer ─── */}
      <p className="btx-disclaimer">
        {lang === 'fr' ? 'Les sélections publiques affichées passent les contrôles de validation avant publication. Aucun résultat futur n’est garanti. 18+.' : lang === 'en' ? 'The public picks shown here pass the publication checks. No future outcome is guaranteed. 18+.' : 'الاختيارات العامة المعروضة هنا تجتاز ضوابط التحقق قبل النشر. لا توجد نتيجة مستقبلية مضمونة. 18+'}
      </p>
    </section>
  )
}
