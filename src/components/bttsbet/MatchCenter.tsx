'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from './LanguageSwitcher'
import { translationsFor, type Locale, localizedPath } from '@/lib/i18n'
import { generateMatchSlug } from '@/lib/match-slug'
import { matchMetricLabels } from '@/lib/matchMetricLabels'
import { getDakarDateString, getDakarDayDiff, getDakarMatchStatus, parseDakarDateTime } from '@/lib/dakar-date'
import { KICKOFF_I18N } from '@/lib/i18n-extras'
import ComboBuilder from './ComboBuilder'
import BookmakerCardLinks from './BookmakerCardLinks'
import { getGeminiPicks } from '@/lib/gemini-predictions'
import { groupGeminiItemsByDakarDay, prioritizeMatchCenterItems, selectUpcomingGeminiItems } from '@/lib/match-center-window'
import { resolveMatchPageLogos } from '@/lib/matchPageLogos'
import { resolveTeamLogoSrc } from '@/lib/teamLogoOverrides'
import { selectFixtureOnlyItems, type PublicCalendarItem } from '@/lib/public-calendar'
// useLayoutEffect isomorphe (évite le warning SSR React)
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * MatchCenter — picks Gemini publics et calendrier du jour (accueil FR/EN).
 *
 * 100% données réelles :
 *  - predictions.json  → picks futurs validés par Gemini et fixtures publiques du jour
 *  - win-history.json   → jointure sur matchs terminés (score final, gagné/perdu)
 *
 * Les picks sont chronologiques; les matchs du jour sont priorisés par compétition.
 * Une fixture sans pick reste affichée sans prédiction ni probabilité. Les dates passées,
 * doublons et lignes non validées sont exclus. Aucun badge « sûr »/« immanquable » ;
 * les pronostics perdants ne sont jamais cachés.
 * Squelettes de chargement, état vide professionnel, colonnes empilées <768px.
 */

interface MarketPick {
  type: string
  prediction: string
  confidence?: number
  proba?: number
}

interface FeedItem {
  match: string
  home: string
  away: string
  league: string
  date: string
  time: string
  homeLogo?: string
  awayLogo?: string
  confidence?: number
  reliabilityScore?: number
  xgHome?: number
  xgAway?: number
  xgTotal?: number
  formBTTS?: number
  ai_exact_score?: string
  exact_score_prob?: string
  odds?: { provider?: string; home?: number | null; draw?: number | null; away?: number | null; over25?: number | null; under25?: number | null } | null
  predictions?: MarketPick[]
  type?: string
  prediction?: string
  bttsProb?: number
  over25Prob?: number
  estimatedCoteBTTS?: number
  estimatedCoteOver?: number
  ai_source?: string
  ai_abstain?: boolean
  isFixtureOnly?: boolean
}

interface HistoryRecord {
  date: string
  match: string
  market: string
  status: string
  finalScore?: string
}

const hasFinalResult = (record?: HistoryRecord) =>
  Boolean(record?.finalScore || record?.status === 'WON' || record?.status === 'LOST')

function dayDiff(dateStr: string): number {
  return getDakarDayDiff(dateStr)
}

/** Unités locales du compte à rebours (jours / heures / minutes). */
const CD_UNITS: Record<Locale, [string, string, string]> = {
  fr: ['j', 'h', 'min'],
  en: ['d', 'h', 'min'],
  ar: ['ي', 'س', 'د'],
}

/** « Commence dans 45 min » — delta lisible vers le prochain coup d'envoi Dakar. */
function formatCountdown(ms: number, lang: Locale): string {
  const [du, hu, mu] = CD_UNITS[lang] ?? CD_UNITS.fr
  const mins = Math.max(0, Math.floor(ms / 60_000))
  const d = Math.floor(mins / 1440)
  const h = Math.floor((mins % 1440) / 60)
  const m = mins % 60
  if (d >= 1) return `${d} ${du} ${h} ${hu}`
  if (h >= 1) return `${h} ${hu} ${m} ${mu}`
  return `${m} ${mu}`
}

function formatCardDate(dateStr: string, lang: Locale): string {
  try {
    const loc = lang === 'en' ? 'en-GB' : lang === 'ar' ? 'ar' : 'fr-FR'
    const d = new Date(dateStr + 'T12:00:00Z')
    return new Intl.DateTimeFormat(loc, { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Africa/Dakar' }).format(d)
  } catch { return dateStr }
}

export default function MatchCenter({ initialLocale }: { initialLocale?: Locale } = {}) {
  const { lang: detectedLang } = useLanguage()
  const lang = initialLocale ?? detectedLang
  const t = translationsFor(lang)

  const [items, setItems] = useState<FeedItem[]>([])
  const [fixtureItems, setFixtureItems] = useState<FeedItem[]>([])
  const [results, setResults] = useState<Map<string, HistoryRecord>>(new Map())
  const [loading, setLoading] = useState(true)
  const [dataDate, setDataDate] = useState('')
  const showPublicFixtures = lang === 'fr' || lang === 'en'
  const dakarToday = getDakarDateString()
  const fixtureDay = showPublicFixtures ? dakarToday : ''
  // Horloge partagée du compte à rebours — cadence 30 s, synchronisée sur l'horloge du navigateur.
  // pour l'ensemble des cartes (évite 44 intervalles individuels).
  const [nowTs, setNowTs] = useState<number>(() => Date.now())
  const gridRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch('/predictions.json').then(r => (r.ok ? r.json() : null)).catch(() => null),
      fetch('/win-history.json').then(r => (r.ok ? r.json() : null)).catch(() => null),
    ]).then(([pred, hist]) => {
      if (cancelled) return
      const raw: FeedItem[] = Array.isArray(pred?.free) ? pred.free
        : Array.isArray(pred?.predictions) ? pred.predictions : []
      const normalizedItems: FeedItem[] = raw.map(item => ({
        ...item,
        predictions: getGeminiPicks(item),
      }))
      setItems(normalizedItems)
      if (showPublicFixtures) {
        const verifiedPickRows: PublicCalendarItem[] = normalizedItems
          .filter(item => Array.isArray(item.predictions) && item.predictions.length > 0)
          .map(item => ({
            date: item.date,
            home: item.home,
            away: item.away,
            league: item.league,
            match: item.match,
            predictions: item.predictions,
          }))
        const publicFixtures: PublicCalendarItem[] = Array.isArray(pred?.fixtures) ? pred.fixtures : []
        const todayFixtures = selectFixtureOnlyItems(publicFixtures, verifiedPickRows, new Date(), fixtureDay)
          .filter(row => row.date === fixtureDay)
          .flatMap(row => {
            const fixture = row as PublicCalendarItem & { homeLogo?: unknown; awayLogo?: unknown }
            const home = String(fixture.home || '').trim()
            const away = String(fixture.away || '').trim()
            const league = String(fixture.league || '').trim()
            if (!home || !away || !league) return []
            return [{
              match: String(fixture.match || `${home} vs ${away}`),
              home,
              away,
              league,
              date: String(fixture.date || ''),
              time: String(fixture.time || ''),
              homeLogo: typeof fixture.homeLogo === 'string' ? fixture.homeLogo : undefined,
              awayLogo: typeof fixture.awayLogo === 'string' ? fixture.awayLogo : undefined,
              predictions: [],
              isFixtureOnly: true,
            }]
          })
        setFixtureItems(todayFixtures)
      } else {
        setFixtureItems([])
      }
      if (pred?.lastUpdated) setDataDate(String(pred.lastUpdated).slice(0, 10))
      const map = new Map<string, HistoryRecord>()
      const recs: HistoryRecord[] = hist?.history || []
      for (const rec of recs) map.set(`${rec.match}|${rec.date}`, rec)
      setResults(map)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [fixtureDay, showPublicFixtures])

  // Compte à rebours temps réel — cadence 30 s, synchronisée sur l'horloge du navigateur.
  useEffect(() => {
    const id = window.setInterval(() => setNowTs(Date.now()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  // Tous les picks Gemini à venir restent visibles; la date Dakar retire les
  // matches expirés au passage du jour local, sans limite de dates futures.
  const filteredPicks = useMemo(
    () => selectUpcomingGeminiItems(items, dayDiff),
    [items, dakarToday],
  )
  const filtered = useMemo(() => {
    if (!showPublicFixtures) return filteredPicks
    return prioritizeMatchCenterItems([...filteredPicks, ...fixtureItems], dakarToday)
  }, [filteredPicks, fixtureItems, dakarToday, showPublicFixtures])
  const { today: todayItems, upcoming: upcomingItems } = useMemo(
    () => groupGeminiItemsByDakarDay(filtered, dakarToday),
    [filtered, dakarToday],
  )
  const matchWord = lang === 'en' ? 'matches' : lang === 'ar' ? 'مباريات' : 'matchs'

  // ═══ Révélation 3D au scroll ═══
  // Gate JS (.mc3d) : sans JS les cartes restent visibles (progressive enhancement).
  // Chaque carte entre en scène (opacity + rotateX + translateY, stagger via --d)
  // quand elle entre dans le viewport, puis le délai de transition est retiré
  // pour que le hover 3D reste instantané.
  useIsoLayoutEffect(() => {
    if (loading) return
    const grid = gridRef.current
    if (!grid) return
    const cards = Array.from(grid.querySelectorAll<HTMLElement>('.hp-mc-card'))
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

    grid.classList.add('mc3d')
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
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    )
    cards.forEach(c => {
      if (!c.classList.contains('is-revealed')) io.observe(c)
    })
    return () => io.disconnect()
  }, [loading, filtered])

  return (
    <section id="matchs" className="hp-section" style={{ scrollMarginTop: '72px' }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        {/* En-tête de section */}
        <div className="hp-sect-head">
          <div>
            <p className="hp-eyebrow">{t.home2.mcEyebrow}</p>
            <h2 className="hp-sect-title">
              {lang === 'en' ? 'Today’s picks and upcoming matches' : lang === 'ar' ? 'توقعات اليوم والمباريات القادمة' : 'Pronostics du jour et matchs à venir'}
            </h2>
          </div>
          <div className="hp-sect-meta">
            <span className="hp-counter" role="status">
              <strong>{loading ? '…' : filtered.length}</strong> {t.home2.mcCountSuffix}
            </span>
            {dataDate && (
              <span className="hp-data-date">{t.home2.mcUpdated} {dataDate}</span>
            )}
          </div>
        </div>

        {/* Générateur de Combiné Intelligente — en tête du Match Center */}
        {items.length > 0 && (
          <ComboBuilder items={items} lang={lang} />
        )}

        {/* Contenu */}
        {loading ? (
          <div className="hp-mc-grid" aria-hidden="true" ref={loading ? gridRef : undefined}>
            {[1, 2, 3, 4].map(i => <div key={i} className="hp-mc-card hp-skeleton" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="hp-empty">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <p className="hp-empty__title">{t.home2.mcEmptyTitle}</p>
            <p className="hp-empty__text">{t.home2.mcEmptyText}</p>
            <a href={localizedPath('/historique', lang)} className="hp-btn-ghost hp-btn-ghost--sm" data-cta="mc-empty-archives">
              {t.home2.mcEmptyCta}
            </a>
          </div>
        ) : (
          <div className="hp-mc-grid" ref={filtered.length > 0 ? gridRef : undefined}>
            {todayItems.length > 0 && (
              <h3 data-match-group="today" className="hp-mc-group">
                <span className="hp-mc-group__marker" aria-hidden="true" />
                <span className="hp-mc-group__title">
                  {lang === 'en' ? 'Today' : lang === 'ar' ? 'اليوم' : 'Aujourd’hui'}
                </span>
                <span className="hp-mc-group__count">
                  {todayItems.length} {matchWord}
                </span>
              </h3>
            )}
            {todayItems.map((m, i) => (
              <MatchCard key={`${m.match}-${m.date}-${m.time}`} m={m} index={i} lang={lang} results={results} nowTs={nowTs} />
            ))}
            {upcomingItems.length > 0 && (
              <h3 data-match-group="upcoming" className="hp-mc-group">
                <span className="hp-mc-group__marker" aria-hidden="true" />
                <span className="hp-mc-group__title">
                  {lang === 'en' ? 'Upcoming' : lang === 'ar' ? 'قادمة' : 'À venir'}
                </span>
                <span className="hp-mc-group__count">
                  {upcomingItems.length} {matchWord}
                </span>
              </h3>
            )}
            {upcomingItems.map((m, i) => (
              <MatchCard key={`${m.match}-${m.date}-${m.time}`} m={m} index={todayItems.length + i} lang={lang} results={results} nowTs={nowTs} />
            ))}
          </div>
        )}
        <div className="mt-6" aria-label={lang === 'fr' ? 'Partenaires' : lang === 'en' ? 'Partners' : 'الشركاء'}>
          <BookmakerCardLinks locale={lang} placement="match-center-partner-rail" compact />
        </div>
      </div>
    </section>
  )
}

/* ═══ Carte de match ═══ */
function MatchCard({ m, index, lang, results, nowTs }: {
  m: FeedItem
  index: number
  lang: Locale
  results: Map<string, HistoryRecord>
  nowTs: number
}) {
  const t = translationsFor(lang)
  const metricLabels = matchMetricLabels(lang)
  const record = results.get(`${m.match}|${m.date}`)
  const isFinished = hasFinalResult(record)
  const hasResult = Boolean(record?.finalScore)
  const won = record?.status === 'WON'
  const lost = record?.status === 'LOST'

  // Indicateur temps réel : statut du coup d'envoi + libellé « Commence dans … ».
  // Recalculé à chaque tick de l'horloge partagée (nowTs, toutes les 30 s).
  const matchStatus = getDakarMatchStatus(m.date, m.time, new Date(nowTs))
  const kickoffMs = useMemo(() => {
    const kickoff = parseDakarDateTime(m.date, m.time)
    return kickoff ? kickoff.getTime() : null
  }, [m.date, m.time])
  const countdown = kickoffMs !== null && nowTs < kickoffMs
    ? formatCountdown(kickoffMs - nowTs, lang)
    : null

  const picks: MarketPick[] = (Array.isArray(m.predictions) ? m.predictions : []).slice(0, 3)

  const matchHref = m.home && m.away && m.date
    ? localizedPath(`/match/${generateMatchSlug(m.home, m.away, m.date)}`, lang)
    : ''
  const matchSlug = m.home && m.away && m.date ? generateMatchSlug(m.home, m.away, m.date) : ''
  const resolvedLogos = resolveMatchPageLogos(matchSlug, m)
  const homeLogo = resolveTeamLogoSrc(resolvedLogos?.homeLogo ?? m.homeLogo)
  const awayLogo = resolveTeamLogoSrc(resolvedLogos?.awayLogo ?? m.awayLogo)

  const upcomingLabel = lang === 'en' ? 'UPCOMING' : lang === 'ar' ? 'قادمة' : 'À VENIR'
  const finishedLabel = lang === 'en' ? 'FINISHED' : lang === 'ar' ? 'منتهية' : 'TERMINÉ'
  const statusLabel = isFinished
    ? won ? t.home2.mcWon : lost ? t.home2.mcLost : finishedLabel
    : matchStatus === 'live'
      ? KICKOFF_I18N[lang].live
      : matchStatus === 'finished'
        ? t.home2.mcVerifying
        : upcomingLabel
  const statusClass = isFinished
    ? won ? 'is-won' : lost ? 'is-lost' : 'is-finished'
    : matchStatus === 'live'
      ? 'is-live'
      : matchStatus === 'finished'
        ? 'is-review'
        : 'is-upcoming'

  const loc = lang === 'en' ? 'en-GB' : lang === 'ar' ? 'ar' : 'fr-FR'
  const num = (v?: number, digits = 2) =>
    v === undefined ? null : v.toLocaleString(loc, { maximumFractionDigits: digits })

  return (
    <article
      data-match-date={m.date}
      data-match={m.match}
      data-match-league={m.league}
      data-fixture-only={m.isFixtureOnly ? 'true' : undefined}
      className={`hp-mc-card hp-mc-card--refonte hp-mc-card--approved${won ? ' is-won' : ''}${lost ? ' is-lost' : ''}${!isFinished ? ' is-pending' : ''}`}
      style={{ ['--d' as string]: `${Math.min(index, 6) * 40}ms` }}
    >
      {/* Compétition et état du match */}
      <div className="hp-mc-top">
        <span className="hp-mc-league">{m.league}</span>
        <span
          className={`hp-mc-status ${statusClass}`}
          title={countdown && matchStatus !== 'live' && !isFinished ? `${KICKOFF_I18N[lang].startsSoon} ${countdown}` : undefined}
        >
          {matchStatus === 'live' && !isFinished && <span className="hp-mc-status__dot" aria-hidden="true" />}
          {statusLabel}
        </span>
      </div>

      {/* Date et heure restent visibles même sur les écrans étroits. */}
      <div className="hp-mc-time-row">
        <span className="hp-mc-time-value">{m.time || '--:--'}</span>
        <span className="hp-mc-time-zone">{t.home2.mcTz}</span>
        <span className="hp-mc-time-date">{formatCardDate(m.date, lang)}</span>
        {countdown && matchStatus !== 'live' && !isFinished && (
          <span className="hp-mc-countdown">{KICKOFF_I18N[lang].startsSoon} {countdown}</span>
        )}
      </div>

      {/* Écussons et équipes */}
      <div className="hp-mc-teams">
        <div className="hp-mc-team">
          <span className="hp-mc-crest">
            <span className="hp-mc-crest__fallback" aria-hidden="true">{m.home.slice(0, 1).toUpperCase()}</span>
            {homeLogo && <img src={homeLogo} alt="" width={44} height={44} loading="lazy" decoding="async" onLoad={event => { event.currentTarget.classList.add('is-loaded'); event.currentTarget.previousElementSibling?.classList.add('is-hidden') }} onError={event => { event.currentTarget.style.display = 'none' }} />}
          </span>
          <span className="hp-mc-team-name">{m.home}</span>
        </div>
        <span className="hp-mc-vs" aria-hidden="true">VS</span>
        <div className="hp-mc-team">
          <span className="hp-mc-crest">
            <span className="hp-mc-crest__fallback" aria-hidden="true">{m.away.slice(0, 1).toUpperCase()}</span>
            {awayLogo && <img src={awayLogo} alt="" width={44} height={44} loading="lazy" decoding="async" onLoad={event => { event.currentTarget.classList.add('is-loaded'); event.currentTarget.previousElementSibling?.classList.add('is-hidden') }} onError={event => { event.currentTarget.style.display = 'none' }} />}
          </span>
          <span className="hp-mc-team-name">{m.away}</span>
        </div>
      </div>

      {/* Résultat final si le match est déjà vérifié */}
      {isFinished && (
        <div className={`hp-mc-result${won ? ' is-won' : ''}${lost ? ' is-lost' : ''}`}>
          {hasResult ? (
            <>
              <span className="hp-mc-result__score">{record?.finalScore}</span>
              <span className={`hp-mc-result__badge${won ? ' tracking-win-badge' : ''}`}>{won ? t.home2.mcWon : lost ? t.home2.mcLost : ''}</span>
              <span className="hp-mc-result__label">{t.home2.mcFinalScore}</span>
            </>
          ) : (
            <span className="hp-mc-result__label">{t.home2.mcVerifying}</span>
          )}
        </div>
      )}

      {/* Ligne 3 : picks Gemini uniquement */}
      {picks.length > 0 && (
        <div className="hp-mc-picks">
          {picks.map(p => {
            const typeUp = (p.type || '').toUpperCase()
            const marketClass =
              typeUp.includes('BTTS') || typeUp.includes('BOTH')
                ? ' is-btts'
                : typeUp.includes('OVER') || typeUp.includes('2.5') || typeUp.includes('O2.5')
                  ? ' is-over'
                  : typeUp.includes('EXACT') || typeUp.includes('CS')
                    ? ' is-exact'
                    : ''
            const marketShort =
              typeUp.includes('BTTS') || typeUp.includes('BOTH')
                ? 'BTTS'
                : typeUp.includes('OVER') || typeUp.includes('2.5') || typeUp.includes('O2.5')
                  ? 'O2.5'
                  : p.type
            const selectionLabel = p.prediction === 'Oui'
              ? t.predictions.bttsYes
              : p.prediction === 'Non'
                ? t.predictions.bttsNo
                : p.prediction
            return (
              <div key={p.type} className={`hp-pick${marketClass}`}>
                <span className="hp-pick__mark" aria-hidden="true">{marketShort}</span>
                <span className="hp-pick__copy">
                  <span className="hp-pick__label">
                    {lang === 'en' ? 'PICK' : lang === 'ar' ? 'توقع' : 'PRONOSTIC'} · {p.type}
                  </span>
                  <span className="hp-pick__selection">{selectionLabel}</span>
                </span>
                {p.confidence !== undefined && p.confidence > 0 && p.confidence <= 100 && (
                  <span className="hp-pick__confidence">
                    <strong>{p.confidence}%</strong>
                    <small>{lang === 'en' ? 'confidence' : lang === 'ar' ? 'الثقة' : 'confiance'}</small>
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}
      {m.isFixtureOnly && (
        <p role="note" className="mx-4 mb-3 rounded-lg border border-[#344255] bg-[#141C25] px-3 py-2 text-center text-xs text-[#9DABBB]">
          {lang === 'en' ? 'Scheduled fixture only — no prediction available.' : 'Match programmé uniquement — aucun pronostic disponible.'}
        </p>
      )}
      {/* Ligne 3bis : cotes réelles du marché (gratuit — ESPN/bookmaker) */}
      {m.odds && (m.odds.home || m.odds.away) && (
        <div className="hp-mc-data" title={m.odds.provider ? (lang === 'en' ? `${m.odds.provider} odds` : lang === 'ar' ? `أودز ${m.odds.provider}` : `Cotes ${m.odds.provider}`) : (lang === 'en' ? 'Market odds' : lang === 'ar' ? 'أودز السوق' : 'Cotes marché')}>
          {m.odds.home !== null && m.odds.home !== undefined && <span><i>1</i> {m.odds.home}</span>}
          {m.odds.draw !== null && m.odds.draw !== undefined && <span><i>{lang === 'en' ? 'D' : lang === 'ar' ? 'X' : 'N'}</i> {m.odds.draw}</span>}
          {m.odds.away !== null && m.odds.away !== undefined && <span><i>2</i> {m.odds.away}</span>}
          {m.odds.over25 !== null && m.odds.over25 !== undefined && <span><i>O2.5</i> {m.odds.over25}</span>}
        </div>
      )}

      {/* Ligne 4 : synthèse données réelles */}
      {(m.xgTotal !== undefined || m.formBTTS !== undefined) && (
        <div className="hp-mc-data">
          {m.xgHome !== undefined && m.xgAway !== undefined && (
            <span title={metricLabels.teamGoalsDescription}><i>{metricLabels.teamGoals}</i> {num(m.xgHome)}/{num(m.xgAway)}</span>
          )}
          {m.xgTotal !== undefined && <span title={metricLabels.combinedGoalsDescription}><i>{metricLabels.combinedGoals}</i> {num(m.xgTotal, 1)}</span>}
          {m.formBTTS !== undefined && <span title={metricLabels.recentBttsDescription}><i>{metricLabels.recentBtts}</i> {m.formBTTS}%</span>}
        </div>
      )}


      {/* Ligne 5 : publication + analyse */}
      <div className="hp-mc-foot">
        <span className="hp-mc-pub">
          <span className="hp-status-dot" aria-hidden="true" />
          {m.isFixtureOnly ? (lang === 'en' ? 'Scheduled fixture' : 'Match au calendrier') : t.home2.mcPublished}
        </span>
        {matchHref && (
          <a href={matchHref} className="hp-mc-open" data-cta={`mc-open-${index}`}>
            {t.home2.mcOpen}
            <span aria-hidden="true">→</span>
          </a>
        )}
      </div>
    </article>
  )
}
