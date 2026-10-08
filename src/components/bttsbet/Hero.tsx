'use client'

import { useEffect, useState } from 'react'
import { useScrollAnimation } from '@/hooks/useAnimations'
import { useLanguage } from './LanguageSwitcher'
import { translationsFor, type Locale, localizedPath } from '@/lib/i18n'
import { generateMatchSlug } from '@/lib/match-slug'
import AnimatedTitle from './HeroWordmark'
import MovingGradientButton from './MovingGradientButton'

/**
 * Hero v4 — « signal terminal » premium.
 *
 * Colonne gauche : eyebrow, H1 (accents dégradés), texte, 2 CTA internes,
 * puis bandeau de chiffres 100% factuels lu depuis les JSON réels
 * (sélections publiées, résultats vérifiés, début du suivi public) —
 * chaque item est masqué si la donnée n'est pas disponible.
 * Colonne droite : carte « Signal en vedette » — un VRAI match du flux
 * predictions.json (marchés, xG, forme, fiabilité, horodatage GMT),
 * sans aucune statistique inventée. Fallback si flux vide : pipeline
 * de traitement factuel (4 étapes de la méthode).
 * La carte « Centre de transparence » est supprimée (décision produit).
 * Aucun pourcentage de réussite affiché ici.
 */

interface MarketPick {
  type: string
  prediction: string
  confidence?: number
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
  predictions?: MarketPick[]
  type?: string
  prediction?: string
}

/** Écart en jours UTC entre la date du match et aujourd'hui. */
function dayDiff(dateStr: string): number {
  try {
    const today = new Date(); today.setUTCHours(0, 0, 0, 0)
    const d = new Date(dateStr + 'T00:00:00Z')
    return Math.round((d.getTime() - today.getTime()) / 86400000)
  } catch { return 999 }
}

function formatDay(dateStr: string, lang: Locale): string {
  try {
    const loc = lang === 'en' ? 'en-GB' : lang === 'ar' ? 'ar' : 'fr-FR'
    const d = new Date(dateStr + 'T12:00:00Z')
    return new Intl.DateTimeFormat(loc, { weekday: 'short', day: '2-digit', month: 'short', timeZone: 'UTC' }).format(d)
  } catch { return dateStr }
}

/** Richesse de données réelles d'un match — sert à choisir la vedette. */
function dataRichness(m: FeedItem): number {
  return (
    (m.predictions?.length ? 8 : 0) +
    (m.xgTotal !== undefined ? 4 : 0) +
    (m.ai_exact_score ? 2 : 0) +
    (m.reliabilityScore !== undefined ? 1 : 0)
  )
}

/** Met en évidence le mot utile du titre via des crochets [mot] — i18n-safe. */
function withAccent(text: string, key: string) {
  const m = text.match(/\[(.+?)\]/)
  if (!m || m.index === undefined) return text
  return (
    <span key={key}>
      {text.slice(0, m.index)}
      <em className="hp-title-em">{m[1]}</em>
      {text.slice(m.index + m[0].length)}
    </span>
  )
}

function plainTitle(text: string) {
  return text.replace(/[\[\]]/g, '')
}

function accentOf(text: string) {
  const m = text.match(/\[(.+?)\]/)
  return m ? m[1] : undefined
}

export default function Hero({ initialLocale }: { initialLocale?: Locale } = {}) {
  const [sectionRef] = useScrollAnimation(0.05)
  const { lang: detectedLang } = useLanguage()
  const lang = initialLocale ?? detectedLang
  const t = translationsFor(lang)

  const [featured, setFeatured] = useState<FeedItem | null>(null)
  const [feedCount, setFeedCount] = useState<number | null>(null)
  const [verified, setVerified] = useState<number | null>(null)
  const [sinceDate, setSinceDate] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch('/predictions.json').then(r => (r.ok ? r.json() : null)).catch(() => null),
      fetch('/win-history.json').then(r => (r.ok ? r.json() : null)).catch(() => null),
    ]).then(([pred, hist]) => {
      if (cancelled) return
      const raw: FeedItem[] = Array.isArray(pred?.free)
        ? pred.free
        : Array.isArray(pred?.predictions) ? pred.predictions : []
      // Signal en vedette : prochain match à venir avec les données les plus riches
      const upcoming = raw
        .filter(m => dayDiff(m.date) >= 0)
        .sort((a, b) => dataRichness(b) - dataRichness(a))
      setFeatured(upcoming[0] || raw[0] || null)
      setFeedCount(raw.length > 0 ? raw.length : null)
      const s = hist?.stats
      if (s && typeof s.total === 'number' && s.total > 0) setVerified(s.total)
      const since = hist?.trackingPeriod?.startDate
      if (typeof since === 'string') setSinceDate(since)
      setReady(true)
    })
    return () => { cancelled = true }
  }, [])

  const m = featured
  const diff = m ? dayDiff(m.date) : 999
  const dayLabel = !m
    ? ''
    : diff === 0 ? t.home2.mcToday : diff === 1 ? t.home2.mcTomorrow : formatDay(m.date, lang)

  const picks: MarketPick[] = m
    ? (m.predictions?.length ? m.predictions : m.type ? [{ type: m.type, prediction: m.prediction || '', confidence: m.confidence }] : []).slice(0, 3)
    : []

  const pickWord = (word: string) =>
    word === 'Oui' ? t.predictions.bttsYes : word === 'Non' ? t.predictions.bttsNo : word

  const liveHref = m && m.home && m.away && m.date
    ? localizedPath(`/match/${generateMatchSlug(m.home, m.away, m.date)}`, lang)
    : ''

  const loc = lang === 'en' ? 'en-GB' : lang === 'ar' ? 'ar' : 'fr-FR'
  const num = (v?: number, digits = 2) =>
    v === undefined ? null : v.toLocaleString(loc, { maximumFractionDigits: digits })

  const pipeline = [
    { n: '01', title: t.home2.met1T },
    { n: '02', title: t.home2.met2T },
    { n: '03', title: t.home2.met3T },
    { n: '04', title: t.home2.met4T },
  ]

  return (
    <section ref={sectionRef} className="hp-hero relative overflow-hidden">
      {/* Ambiance : halos lumineux + grille fine (décoratif) */}
      <div className="hp-hero__glow hp-hero__glow--a" aria-hidden="true" />
      <div className="hp-hero__glow hp-hero__glow--b" aria-hidden="true" />
      <div className="hp-hero__gridbg" aria-hidden="true" />

      <div className="hp-hero__inner relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="hp-hero__grid">
          {/* ═══ Colonne message ═══ */}
          <div className="hp-hero__copy">
            <h1 className="hp-hero__title">
              <AnimatedTitle
                text={plainTitle(t.home2.heroTitle1)}
                accent={accentOf(t.home2.heroTitle1)}
                enabled={lang !== 'ar'}
              />
              <span className="hp-hero__title-line2">{withAccent(t.home2.heroTitle2, 'l2')}</span>
            </h1>

            <p className="hp-hero__text">{t.home2.heroText}</p>

            <div className="hp-hero__cta-zone">
              <MovingGradientButton href="#matchs" dataCta="hero-open-matchs">
                {t.home2.heroCtaPrimary}
                <span className="hp-btn-arrow" aria-hidden="true">→</span>
              </MovingGradientButton>
              <a href={localizedPath('/historique', lang)} data-cta="hero-history" className="hp-btn-ghost">
                {t.home2.heroCtaSecondary}
              </a>
            </div>

            {/* Bandeau de chiffres factuels — lus depuis les JSON réels */}
            {(feedCount !== null || verified !== null || sinceDate) && (
              <dl className="hp-hstats">
                {feedCount !== null && (
                  <div className="hp-hstat">
                    <dt className="hp-hstat__label">{t.home2.heroStat1}</dt>
                    <dd className="hp-hstat__value">{feedCount}</dd>
                  </div>
                )}
                {verified !== null && (
                  <div className="hp-hstat">
                    <dt className="hp-hstat__label">{t.home2.heroStat2}</dt>
                    <dd className="hp-hstat__value">{verified}</dd>
                  </div>
                )}
                {sinceDate && (
                  <div className="hp-hstat">
                    <dt className="hp-hstat__label">{t.home2.heroStat3}</dt>
                    <dd className="hp-hstat__value hp-hstat__value--date">{sinceDate}</dd>
                  </div>
                )}
              </dl>
            )}

            <p className="hp-hero__reassurance">{t.home2.heroReassurance}</p>
          </div>

          {/* ═══ Carte « Signal en vedette » — vraies données du flux ═══ */}
          <aside className="hp-live-zone" aria-label={t.home2.heroLiveEyebrow}>
            <div className="hp-live-halo" aria-hidden="true" />
            <article className="hp-live">
              <header className="hp-live__head">
                <p className="hp-live__eyebrow">
                  <span className="hp-live__pulse" aria-hidden="true" />
                  {t.home2.heroLiveEyebrow}
                </p>
                <span className="hp-live__badge">{t.home2.heroLiveBadge}</span>
              </header>

              {!ready ? (
                <div className="hp-live__skeleton" aria-hidden="true" />
              ) : m ? (
                <>
                  <div className="hp-live__meta">
                    <span className="hp-live__league">{m.league}</span>
                    <span className="hp-live__when">
                      <time dateTime={`${m.date}T${m.time || '00:00'}:00Z`}>{m.time}</time>
                      <small>{t.home2.mcTz}</small>
                      <em>{dayLabel}</em>
                    </span>
                  </div>

                  <div className="hp-live__teams">
                    <div className="hp-live__team">
                      {m.homeLogo && <img src={m.homeLogo} alt="" width={30} height={30} loading="lazy" />}
                      <span>{m.home}</span>
                    </div>
                    <div className="hp-live__sep" aria-hidden="true"><i>VS</i></div>
                    <div className="hp-live__team">
                      {m.awayLogo && <img src={m.awayLogo} alt="" width={30} height={30} loading="lazy" />}
                      <span>{m.away}</span>
                    </div>
                  </div>

                  {(picks.length > 0 || m.ai_exact_score) && (
                    <div className="hp-live__markets">
                      {picks.map(p => (
                        <span key={p.type} className={`hp-live__pick${p.type === 'BTTS' ? ' is-btts' : p.type.includes('Over') ? ' is-over' : ''}`}>
                          <b>{p.type}</b>
                          <span>{pickWord(p.prediction)}</span>
                          {p.confidence !== undefined && <i>{p.confidence}%</i>}
                        </span>
                      ))}
                      {m.ai_exact_score && (
                        <span className="hp-live__pick is-exact">
                          <b>{t.home2.mcExact}</b>
                          <span>{m.ai_exact_score}</span>
                        </span>
                      )}
                    </div>
                  )}

                  {(m.xgTotal !== undefined || m.formBTTS !== undefined || m.reliabilityScore !== undefined) && (
                    <div className="hp-live__data">
                      {m.xgHome !== undefined && m.xgAway !== undefined && (
                        <span><i>{t.home2.mcXg}</i> {num(m.xgHome)}/{num(m.xgAway)}</span>
                      )}
                      {m.xgTotal !== undefined && (
                        <span><i>Σ xG</i> {num(m.xgTotal, 1)}</span>
                      )}
                      {m.formBTTS !== undefined && (
                        <span><i>{t.home2.mcForm}</i> {m.formBTTS}%</span>
                      )}
                      {m.reliabilityScore !== undefined && (
                        <span><i>{t.home2.mcReliability}</i> {num(m.reliabilityScore, 1)}%</span>
                      )}
                    </div>
                  )}

                  <footer className="hp-live__foot">
                    <span className="hp-live__pub">
                      <span className="hp-status-dot" aria-hidden="true" />
                      {t.home2.mcPublished}
                    </span>
                    {liveHref && (
                      <a href={liveHref} className="hp-live__open" data-cta="hero-live-open">
                        {t.home2.mcOpen}
                        <span aria-hidden="true">→</span>
                      </a>
                    )}
                  </footer>
                </>
              ) : (
                /* Fallback factuel : pipeline de traitement (aucune donnée inventée) */
                <div className="hp-live__pipeline">
                  <ol>
                    {pipeline.map(s => (
                      <li key={s.n}>
                        <span className="hp-live__step-n" aria-hidden="true">{s.n}</span>
                        <span className="hp-live__step-t">{s.title}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="hp-live__pipeline-note">{t.home2.mcEmptyText}</p>
                </div>
              )}
            </article>
          </aside>
        </div>
      </div>
    </section>
  )
}
