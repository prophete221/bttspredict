'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from './LanguageSwitcher'
import { translationsFor, type Locale, localizedPath } from '@/lib/i18n'
import { generateMatchSlug } from '@/lib/match-slug'
import { getDakarDateString, getDakarDayDiff, getDakarMatchStatus, isDakarKickoffUpcomingOrUnscheduled, parseDakarDateTime } from '@/lib/dakar-date'
import { KICKOFF_I18N } from '@/lib/i18n-extras'
import BookmakerCardLinks from './BookmakerCardLinks'
import { getGeminiPicks } from '@/lib/gemini-predictions'
import { groupGeminiItemsByDakarDay, prioritizeMatchCenterItems, selectUpcomingGeminiItems } from '@/lib/match-center-window'
import { resolveMatchPageLogos } from '@/lib/matchPageLogos'
import { resolveTeamLogoSrc } from '@/lib/teamLogoOverrides'
import { attachStadiumTilt } from './stadium-tilt'
// useLayoutEffect isomorphe (évite le warning SSR React)
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * MatchCenter — pronostics Gemini publics uniquement.
 *
 * 100% données réelles :
 *  - predictions.json  → picks futurs validés par Gemini
 *  - win-history.json   → jointure sur matchs terminés (score final, gagné/perdu)
 *
 * Les picks sont chronologiques; les matchs du jour sont priorisés par compétition.
 * Les fixtures sans pick Gemini, abstentions, dates passées, doublons et lignes
 * non validées sont exclus. Aucun badge « sûr »/« immanquable » ;
 * les pronostics perdants ne sont jamais cachés.
 * Squelettes de chargement, état vide professionnel, colonnes empilées <768px.
 */

interface MarketPick {
  type: string
  market?: 'BTTS' | 'O2.5'
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
  formBTTS?: number
  odds?: { provider?: string; home?: number | null; draw?: number | null; away?: number | null; over25?: number | null; under25?: number | null } | null
  predictions?: MarketPick[]
  type?: string
  prediction?: string
  ai_source?: string
  ai_abstain?: boolean
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
  const [results, setResults] = useState<Map<string, HistoryRecord>>(new Map())
  const [loading, setLoading] = useState(true)
  const [dataDate, setDataDate] = useState('')
  const dakarToday = getDakarDateString()
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
      const raw: FeedItem[] = [
        ...(Array.isArray(pred?.free) ? pred.free : []),
        ...(Array.isArray(pred?.predictions) ? pred.predictions : []),
      ]
      const normalizedItems: FeedItem[] = raw.map(item => ({
        ...item,
        predictions: getGeminiPicks(item),
      }))
      setItems(normalizedItems)
      if (pred?.lastUpdated) setDataDate(String(pred.lastUpdated).slice(0, 10))
      const map = new Map<string, HistoryRecord>()
      const recs: HistoryRecord[] = hist?.geminiOnly === true ? hist.history || [] : []
      for (const rec of recs) map.set(`${rec.match}|${rec.date}`, rec)
      setResults(map)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  // Compte à rebours temps réel — cadence 30 s, synchronisée sur l'horloge du navigateur.
  useEffect(() => {
    const id = window.setInterval(() => setNowTs(Date.now()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  // Tous les picks Gemini à venir restent visibles; la date Dakar retire les
  // matches expirés au passage du jour local, sans limite de dates futures.
  const filteredPicks = useMemo(() => {
    const validated = selectUpcomingGeminiItems(items, date => getDakarDayDiff(date, new Date(nowTs)))
    return validated.filter(item => isDakarKickoffUpcomingOrUnscheduled(item.date, item.time, new Date(nowTs)))
  }, [items, nowTs])
  const filtered = useMemo(() => {
    if (lang !== 'fr' && lang !== 'en') return filteredPicks
    return prioritizeMatchCenterItems(filteredPicks, dakarToday)
  }, [filteredPicks, dakarToday, lang])
  const { today: todayItems, upcoming: upcomingItems } = useMemo(
    () => groupGeminiItemsByDakarDay(filtered, dakarToday),
    [filtered, dakarToday],
  )
  const matchWord = (count: number) => lang === 'en'
    ? count === 1 ? 'match' : 'matches'
    : lang === 'ar'
      ? count === 1 ? 'مباراة' : 'مباريات'
      : count === 1 ? 'match' : 'matchs'
  const matchCountSuffix = filtered.length === 1
    ? lang === 'en' ? 'match shown' : lang === 'ar' ? 'مباراة معروضة' : 'match affiché'
    : t.home2.mcCountSuffix

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

  // ═══ Tilt 3D piloté par le pointeur (décoratif, desktop, reduced-motion off) ═══
  // Délégation sur la grille : un seul listener pour toutes les cartes,
  // compatible re-rendus React. Le CSS identity-2026 applique la rotation
  // et le reflet via --rx/--ry/--gx/--gy.
  useEffect(() => {
    if (loading) return
    const grid = gridRef.current
    if (!grid) return
    return attachStadiumTilt(grid)
  }, [loading, filtered])

  return (
    <section id="matchs" className="hp-section" style={{ scrollMarginTop: '72px' }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        {/* En-tête de section */}
        <div className="hp-sect-head">
          <div>
            <p className="hp-eyebrow">{t.home2.mcEyebrow}</p>
            <p className="hp-brand-line" aria-label="Brand">
              {lang === 'en' ? 'PUBLIC PICKS · VERIFIED RESULTS' : lang === 'ar' ? 'اختيارات عامة · نتائج قابلة للتحقق' : 'SÉLECTIONS PUBLIQUES · RÉSULTATS VÉRIFIÉS'}
            </p>
            <h2 className="hp-sect-title">
              {lang === 'en' ? 'Today’s picks and upcoming matches' : lang === 'ar' ? 'توقعات اليوم والمباريات القادمة' : 'Pronostics du jour et matchs à venir'}
            </h2>
          </div>
          <div className="hp-sect-meta">
            <span className="hp-counter" role="status">
              <strong>{loading ? '…' : filtered.length}</strong> {matchCountSuffix}
            </span>
            {dataDate && (
              <span className="hp-data-date">{t.home2.mcUpdated} {formatCardDate(dataDate, lang)}</span>
            )}
          </div>
        </div>

        <p className="hp-mc-note">
          {lang === 'en'
            ? 'Pick percentages come from validated selections; recent form and odds are context data, not guarantees.'
            : lang === 'ar'
              ? 'نسب الاختيارات مصدرها الاختيارات المعتمدة؛ الأداء الحديث والأسعار بيانات سياقية وليست ضماناً.'
              : 'Les pourcentages proviennent des picks validés ; la forme récente et les cotes sont des indicateurs de contexte, pas des garanties.'}
        </p>

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
                  {todayItems.length} {matchWord(todayItems.length)}
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
                  {upcomingItems.length} {matchWord(upcomingItems.length)}
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

// ─── Stadium Signal — helpers de la maquette A validée (23/11/2026) ──────────

// Libellé humain du marché (« Over 2,5 buts » / « Les deux équipes marquent »).
function marketLabel(market: 'BTTS' | 'O2.5', lang: Locale): string {
  if (market === 'BTTS') {
    return lang === 'en' ? 'Both teams to score' : lang === 'ar' ? 'كلا الفريقين يسجلان' : 'Les deux équipes marquent'
  }
  return lang === 'en' ? 'Over 2.5 goals' : lang === 'ar' ? 'أكثر من 2.5 هدف' : 'Over 2,5 buts'
}

// ─── ProbRing — jauge circulaire du pronostic principal (maquette A) ─────
function ProbRing({ value, ringId, sub, ariaLabel, valueClassName }: { value: number; ringId: string; sub: string; ariaLabel: string; valueClassName?: string }) {
  const pct = Math.min(100, Math.max(0, Math.round((Number.isFinite(value) ? value : 0) * 100)))
  const radius = 31
  const circumference = 2 * Math.PI * radius
  const dash = (pct / 100) * circumference
  return (
    <div className="btx-ring" role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 74 74" width="74" height="74" aria-hidden="true" focusable="false">
        <circle cx="37" cy="37" r={radius} fill="none" stroke="rgba(178,202,238,0.10)" strokeWidth="7" />
        <circle
          cx="37" cy="37" r={radius} fill="none"
          stroke={`url(#${ringId})`} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={`${dash.toFixed(1)} ${circumference.toFixed(1)}`}
          transform="rotate(-90 37 37)"
        />
        <defs>
          <linearGradient id={ringId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2A5CD8" />
            <stop offset="1" stopColor="#6BA1FF" />
          </linearGradient>
        </defs>
      </svg>
      <span className="btx-ring__val" aria-hidden="true">
        <b className={valueClassName}>{pct}%</b>
        <i>{sub}</i>
      </span>
    </div>
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
  // Pronostic principal (maquette A validée) : premier pick publié ; les picks
  // supplémentaires passent en tuiles, la cote Over 2,5 complète la rangée.
  const heroPick = picks[0] ?? null
  const extraPicks = picks.slice(1)

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

  const statusText = statusLabel
  const ringId = `mc-ring-${Math.min(index, 8)}-${matchSlug.replace(/[^a-zA-Z0-9]/g, '').slice(0, 24)}`

  // Ligne de provenance (maquette A) — véridique : bookmaker des cotes,
  // tels qu'ils sortent du pipeline public. (Aucune mention de fournisseur
  // d'analyse IA n'est affichée — décision produit.)
  const provBits: string[] = []
  if (m.odds?.provider) provBits.push(`${lang === 'en' ? 'Source' : lang === 'ar' ? 'المصدر' : 'Source'} ${m.odds.provider}`)
  const coteValue = typeof m.odds?.over25 === 'number' && Number.isFinite(m.odds.over25) ? m.odds.over25 : null
  const coteImplied = coteValue !== null && coteValue > 1 ? Math.min(100, Math.max(0, (1 / coteValue) * 100)) : null

  return (
    <article
      data-match-date={m.date}
      data-match={m.match}
      data-match-league={m.league}
      className={`btp-match-card hp-mc-card hp-mc-card--approved hp-mc-card--signal${won ? ' is-won' : ''}${lost ? ' is-lost' : ''}${matchStatus === 'live' && !isFinished ? ' is-live' : ''}`}
      style={{ ['--card-order' as string]: index }}
      lang={lang}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="btp-match-card__meta">
        <span className="btp-match-card__league">{m.league}</span>
        <span className={`hp-mc-status ${statusClass}`}>
          {matchStatus === 'live' && !isFinished && <i aria-hidden="true" />}
          {statusText}
        </span>
      </div>

      {/* ─── AFFICHE — crêtes + coup d'envoi (maquette A) ─── */}
      <div className="btp-match-card__fixture">
        <div className="btp-match-card__team">
          <span className="btp-match-card__crest">
            <span aria-hidden="true">{m.home.slice(0, 1).toUpperCase()}</span>
            {homeLogo && <img src={homeLogo} alt="" width={40} height={40} loading="lazy" decoding="async" onLoad={event => { event.currentTarget.classList.add('is-loaded'); event.currentTarget.previousElementSibling?.classList.add('is-hidden') }} onError={event => { event.currentTarget.style.display = 'none' }} />}
          </span>
          <strong className="hp-mc-team-name">{m.home}</strong>
        </div>
        <div className="hp-mc-time-row">
          {isFinished && hasResult ? (
            <strong className="btp-match-card__score">{record?.finalScore}</strong>
          ) : (
            <strong>{m.time || '--:--'}</strong>
          )}
          <span>{formatCardDate(m.date, lang)} · {t.home2.mcTz}</span>
          <em className="btp-match-card__vsmark" aria-hidden="true">VS</em>
        </div>
        <div className="btp-match-card__team btp-match-card__team--away">
          <span className="btp-match-card__crest">
            <span aria-hidden="true">{m.away.slice(0, 1).toUpperCase()}</span>
            {awayLogo && <img src={awayLogo} alt="" width={40} height={40} loading="lazy" decoding="async" onLoad={event => { event.currentTarget.classList.add('is-loaded'); event.currentTarget.previousElementSibling?.classList.add('is-hidden') }} onError={event => { event.currentTarget.style.display = 'none' }} />}
          </span>
          <strong className="hp-mc-team-name">{m.away}</strong>
        </div>
      </div>

      {/* ─── COMPTE À REBOURS (bannière dorée de la maquette) ─── */}
      {countdown && matchStatus !== 'live' && !isFinished && (
        <small className="btp-match-card__countdown">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 7v5l3 2" />
          </svg>
          {KICKOFF_I18N[lang].startsSoon} {countdown}
        </small>
      )}

      {/* ─── PRONOSTIC PRINCIPAL — jauge circulaire (maquette A) ─── */}
      {heroPick && (() => {
        const typeUp = (heroPick.type || '').toUpperCase()
        const heroIsBtts = heroPick.market === 'BTTS' || typeUp.includes('BTTS') || typeUp.includes('BOTH')
        const selectionLabel = heroPick.prediction === 'Oui'
          ? (lang === 'en' ? 'Yes' : lang === 'ar' ? 'نعم' : 'Oui')
          : heroPick.prediction === 'Non'
            ? (lang === 'en' ? 'No' : lang === 'ar' ? 'لا' : 'Non')
            : heroPick.prediction
        const probability = typeof heroPick.proba === 'number' && heroPick.proba >= 0 && heroPick.proba <= 1
          ? Math.round(heroPick.proba * 100)
          : null
        return (
          <div className={`btx-pick ${heroIsBtts ? 'btp-market--btts' : 'btp-market--over25'}`} data-market={heroIsBtts ? 'BTTS' : 'O2.5'}>
            <div className="btx-pick__copy">
              <span className="btx-pick__lab">
                {lang === 'fr' ? 'Pronostic principal' : lang === 'en' ? 'Main pick' : 'التنبؤ الرئيسي'}
              </span>
              <span className="btx-pick__market">{marketLabel(heroIsBtts ? 'BTTS' : 'O2.5', lang)}</span>
              <strong className="hp-pick__selection btx-pick__sel" data-prediction={heroPick.prediction === 'Oui' ? 'yes' : heroPick.prediction === 'Non' ? 'no' : 'unknown'}>
                {selectionLabel}
              </strong>
            </div>
            {probability !== null && (
              <ProbRing value={heroPick.proba as number} ringId={ringId} sub={lang === 'en' ? 'est.' : lang === 'ar' ? 'تقديري' : 'estimé'} valueClassName="hp-pick__confidence" ariaLabel={`${probability}%`} />
            )}
          </div>
        )
      })()}

      {/* ─── TUILES : picks complémentaires + cote Over 2,5 (maquette A) ─── */}
      {(extraPicks.length > 0 || coteValue !== null) && (
        <div className="btx-tiles" aria-label={lang === 'en' ? 'Context stats' : lang === 'ar' ? 'بيانات السياق' : 'Données de contexte'}>
          {extraPicks.map(p => {
            const typeUp = (p.type || '').toUpperCase()
            const isBtts = p.market === 'BTTS' || typeUp.includes('BTTS') || typeUp.includes('BOTH')
            const marketShort = isBtts
              ? 'BTTS'
              : typeUp.includes('OVER') || typeUp.includes('2.5') || typeUp.includes('O2.5')
                ? (lang === 'en' ? 'Over 2.5' : lang === 'ar' ? 'أكثر من 2.5' : 'Over 2,5')
                : p.type
            const selectionLabel = p.prediction === 'Oui'
              ? (lang === 'en' ? 'Yes' : lang === 'ar' ? 'نعم' : 'Oui')
              : p.prediction === 'Non'
                ? (lang === 'en' ? 'No' : lang === 'ar' ? 'لا' : 'Non')
                : p.prediction
            const probability = typeof p.proba === 'number' && p.proba >= 0 && p.proba <= 1
              ? Math.round(p.proba * 100)
              : null
            return (
              <div key={p.market ?? p.type} className={`btx-prob ${isBtts ? 'btp-market--btts' : 'btp-market--over25'}`} data-market={isBtts ? 'BTTS' : 'O2.5'}>
                <span className="btx-prob__head">
                  <span className="btx-prob__label">{marketShort}</span>
                  {probability !== null && <strong className="hp-pick__confidence btx-prob__value">{probability}%</strong>}
                </span>
                <strong className="hp-pick__selection" data-prediction={p.prediction === 'Oui' ? 'yes' : p.prediction === 'Non' ? 'no' : 'unknown'}>{selectionLabel}</strong>
                {probability !== null && (
                  <span className="btx-bar" aria-hidden="true">
                    <i className="btx-bar__fill" style={{ ['--w' as string]: `${probability}%` }} />
                  </span>
                )}
              </div>
            )
          })}
          {coteValue !== null && (
            <div className="btx-cote">
              <span className="btx-cote__k">{lang === 'en' ? 'Over 2.5 odds' : lang === 'ar' ? 'سعر أكثر من 2.5' : 'Cote Over 2,5'}</span>
              <span className="btx-cote__v"><b>{coteValue.toFixed(2)}</b></span>
              <span className="btx-cote__mini" aria-hidden="true">
                <i style={{ width: coteImplied != null ? `${coteImplied.toFixed(1)}%` : '0%' }} />
              </span>
            </div>
          )}
        </div>
      )}

      {/* ─── SOURCE (maquette A) ─── */}
      {provBits.length > 0 && <p className="btx-prov" dir="ltr">{provBits.join(' · ')}</p>}

      {/* ─── CTA « Ouvrir l'analyse » (maquette A) ─── */}
      {matchHref && (
        <a className="hp-mc-open btx-cta" href={matchHref} data-cta={`mc-open-${index}`}>
          <span>{t.home2.mcOpen}</span>
          <span aria-hidden="true">↗</span>
        </a>
      )}
    </article>
  )
}
