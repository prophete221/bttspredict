'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { useLanguage } from './LanguageSwitcher'
import BookmakerCardLinks from './BookmakerCardLinks'
import { type Locale, localizedPath } from '@/lib/i18n'
import { generateMatchSlug } from '@/lib/match-slug'
import { getDakarDayDiff, parseDakarDateTime } from '@/lib/dakar-date'
import { getNextGeminiFixture, type FeaturedFixture } from '@/lib/home-featured-match'
import { getGeminiPicks, type GeminiPrediction } from '@/lib/gemini-predictions'
import { selectUpcomingGeminiItems } from '@/lib/match-center-window'

/** Prochaines affiches avec sélection publique — même fenêtre/logique que la carte vedette. */
function getUpcomingGeminiFixtures(data: unknown, now = new Date(), limit = 4): FeaturedFixture[] {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return []
  const payload = data as { free?: unknown[]; predictions?: unknown[] }
  const rows = [
    ...(Array.isArray(payload.free) ? payload.free : []),
    ...(Array.isArray(payload.predictions) ? payload.predictions : []),
  ]
  const candidates: FeaturedFixture[] = []
  for (const value of rows) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) continue
    const row = value as Record<string, unknown>
    const home = typeof row.home === 'string' ? row.home.trim() : ''
    const away = typeof row.away === 'string' ? row.away.trim() : ''
    const date = typeof row.date === 'string' ? row.date.slice(0, 10) : ''
    const time = typeof row.time === 'string' ? row.time.trim() : ''
    const kickoff = parseDakarDateTime(date, time)
    if (!home || !away || !kickoff || kickoff.getTime() <= now.getTime()) continue
    const predictions = getGeminiPicks(row)
    if (predictions.length === 0) continue
    candidates.push({
      home,
      away,
      league: typeof row.league === 'string' ? row.league.trim() : '',
      date,
      time,
      homeLogo: typeof row.homeLogo === 'string' ? row.homeLogo : undefined,
      awayLogo: typeof row.awayLogo === 'string' ? row.awayLogo : undefined,
      predictions,
    })
  }
  return selectUpcomingGeminiItems(candidates, date => getDakarDayDiff(date, now))
    .filter(item => {
      const kickoff = parseDakarDateTime(item.date, item.time)
      return kickoff !== null && kickoff.getTime() > now.getTime()
    })
    .sort((a, b) => {
      const aKickoff = parseDakarDateTime(a.date, a.time)?.getTime() ?? Number.MAX_SAFE_INTEGER
      const bKickoff = parseDakarDateTime(b.date, b.time)?.getTime() ?? Number.MAX_SAFE_INTEGER
      return aKickoff - bKickoff
    })
    .slice(0, limit)
}

type Copy = {
  eyebrow: string
  title: string
  titleAccent: string
  description: string
  primary: string
  history: string
  featured: string
  today: string
  noMatch: string
  view: string
  timezone: string
  source: string
  probability: string
  risk: string
  vs: string
  btts: string
  over: string
}

const COPY: Record<Locale, Copy> = {
  fr: {
    eyebrow: 'TABLEAU DU JOUR',
    title: 'Pronostics BTTS',
    titleAccent: 'et Over 2,5 aujourd’hui',
    description: 'Rencontres à venir, sélections publiques et historique de résultats vérifiables.',
    primary: 'Voir les matchs analysés',
    history: 'Historique des résultats',
    featured: 'PROCHAIN MATCH AVEC SÉLECTION',
    today: 'À VENIR',
    noMatch: 'Aucune sélection à venir n’est disponible pour le moment.',
    view: 'Ouvrir l’analyse du match',
    timezone: 'Coup d’envoi · GMT',
    source: 'Sélection publique',
    probability: 'Probabilité estimée',
    risk: '18+ · aucun résultat garanti',
    vs: 'CONTRE',
    btts: 'Les deux équipes marquent',
    over: 'Au moins 3 buts',
  },
  en: {
    eyebrow: 'MATCHDAY BOARD',
    title: 'BTTS predictions',
    titleAccent: 'and Over 2.5 today',
    description: 'Upcoming fixtures, public selections and a verifiable results history.',
    primary: 'Explore analysed matches',
    history: 'Results history',
    featured: 'NEXT MATCH WITH A PICK',
    today: 'UPCOMING',
    noMatch: 'No upcoming selection is available right now.',
    view: 'Open match analysis',
    timezone: 'Kick-off · GMT',
    source: 'Public selection',
    probability: 'Estimated probability',
    risk: '18+ · no outcome is guaranteed',
    vs: 'VS',
    btts: 'Both teams to score',
    over: 'At least 3 goals',
  },
  ar: {
    eyebrow: 'لوحة مباريات اليوم',
    title: 'توقعات BTTS',
    titleAccent: 'و Over 2.5 اليوم',
    description: 'المباريات القادمة والاختيارات العامة وسجل نتائج قابل للتحقق.',
    primary: 'استكشف المباريات المحللة',
    history: 'سجل النتائج',
    featured: 'المباراة القادمة مع اختيار',
    today: 'قادمة',
    noMatch: 'لا يتوفر حالياً اختيار قادم.',
    view: 'افتح تحليل المباراة',
    timezone: 'موعد البداية · GMT',
    source: 'اختيار عام',
    probability: 'الاحتمال المقدّر',
    risk: '18+ · لا توجد نتيجة مضمونة',
    vs: 'ضد',
    btts: 'كلا الفريقين يسجلان',
    over: '3 أهداف على الأقل',
  },
}

function dateLabel(date: string, lang: Locale) {
  const diff = getDakarDayDiff(date)
  if (diff === 0) return lang === 'en' ? 'Today' : lang === 'ar' ? 'اليوم' : 'Aujourd’hui'
  if (diff === 1) return lang === 'en' ? 'Tomorrow' : lang === 'ar' ? 'غداً' : 'Demain'
  try {
    return new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : lang === 'ar' ? 'ar' : 'fr-FR', {
      weekday: 'short', day: '2-digit', month: 'short', timeZone: 'Africa/Dakar',
    }).format(new Date(date + 'T12:00:00Z'))
  } catch { return date }
}

function marketLabel(pick: GeminiPrediction, copy: Copy) {
  return pick.market === 'BTTS' ? copy.btts : copy.over
}

function selectionLabel(value: GeminiPrediction['prediction'], lang: Locale) {
  if (value === 'Oui') return lang === 'en' ? 'Yes' : lang === 'ar' ? 'نعم' : 'Oui'
  return lang === 'en' ? 'No' : lang === 'ar' ? 'لا' : 'Non'
}

export default function Hero({ initialLocale }: { initialLocale?: Locale } = {}) {
  const { lang: detectedLang } = useLanguage()
  const lang = initialLocale ?? detectedLang
  const copy = COPY[lang] ?? COPY.fr
  const [fixture, setFixture] = useState<FeaturedFixture | null>(null)
  const [strip, setStrip] = useState<FeaturedFixture[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let active = true
    fetch('/predictions.json')
      .then(response => response.ok ? response.json() : null)
      .catch(() => null)
      .then(data => {
        if (!active) return
        setFixture(getNextGeminiFixture(data))
        setStrip(getUpcomingGeminiFixtures(data).slice(1))
        setLoaded(true)
      })
    return () => { active = false }
  }, [])

  const direction = lang === 'ar' ? 'rtl' : 'ltr'
  const matchHref = (f: FeaturedFixture) =>
    localizedPath(`/match/${generateMatchSlug(f.home, f.away, f.date)}`, lang)
  const href = fixture ? matchHref(fixture) : '#matchs'
  const featureLinkLabel = fixture ? copy.view : copy.primary

  return (
    <section className="bp-home" lang={lang} dir={direction}>
      <div className="bp-home__inner">
        <div className="bp-home__intro">
          <p className="bp-home__eyebrow"><span aria-hidden="true">◈</span> {copy.eyebrow}</p>
          <h1 className="bp-home__title">
            <span>{copy.title}</span>
            <strong>{copy.titleAccent}</strong>
          </h1>
          <p className="bp-home__description">{copy.description}</p>
          <div className="bp-home__actions">
            <a className="bp-home__primary" href="#matchs">{copy.primary}<span aria-hidden="true">→</span></a>
            <a className="bp-home__secondary" href={localizedPath('/historique', lang)}>{copy.history}</a>
          </div>
          <div className="bp-home__facts">
            <span><b>BTTS</b><small>{copy.btts}</small></span>
            <span><b>OVER 2.5</b><small>{copy.over}</small></span>
            <span><b>18+</b><small>{copy.risk.replace('18+ · ', '')}</small></span>
          </div>
        </div>

        <article className="bp-feature" aria-labelledby="bp-feature-heading">
          <header className="bp-feature__header">
            <span id="bp-feature-heading"><i />{copy.featured}</span>
            <small>{copy.today}</small>
          </header>
          {!loaded ? <div className="bp-feature__loading" aria-hidden="true" /> : fixture ? (
            <>
              {fixture.league && <p className="bp-feature__league">{fixture.league}</p>}
              <div className="bp-feature__teams">
                <div>
                  {fixture.homeLogo ? <img src={fixture.homeLogo} alt="" width={42} height={42} loading="lazy" /> : <span className="bp-feature__initial">{fixture.home.slice(0, 1)}</span>}
                  <b>{fixture.home}</b>
                </div>
                <em>{copy.vs}</em>
                <div>
                  {fixture.awayLogo ? <img src={fixture.awayLogo} alt="" width={42} height={42} loading="lazy" /> : <span className="bp-feature__initial">{fixture.away.slice(0, 1)}</span>}
                  <b>{fixture.away}</b>
                </div>
              </div>
              <div className="bp-feature__time">
                <b>{fixture.time}</b>
                <span>{dateLabel(fixture.date, lang)} · {copy.timezone}</span>
              </div>
              <div className="bp-feature__picks" aria-label={copy.source}>
                {fixture.predictions.map(pick => (
                  <div key={pick.market} className={`bp-feature__pick ${pick.market === 'BTTS' ? 'is-btts' : 'is-over'}`} data-market={pick.market}>
                    <small>{marketLabel(pick, copy)}</small>
                    <b>{selectionLabel(pick.prediction, lang)}</b>
                    <strong title={copy.probability} aria-label={`${copy.probability} ${Math.round(pick.proba * 100)}%`}>{Math.round(pick.proba * 100)}%</strong>
                    <i className="bp-feature__meter" aria-hidden="true" style={{ '--meter': `${Math.round(pick.proba * 100)}%` } as CSSProperties} />
                  </div>
                ))}
              </div>
              <p className="bp-feature__source">{copy.source}</p>
              <div className="bp-feature__partners">
                <BookmakerCardLinks locale={lang} placement="home-featured-match-card" compact />
              </div>
            </>
          ) : <div className="bp-feature__empty">{copy.noMatch}</div>}
          <a className="bp-feature__link" href={href}>{featureLinkLabel}<span aria-hidden="true">→</span></a>
        </article>
      </div>

      {strip.length > 0 && (
        <div className="bp-fixture-strip">
          <p className="bp-fixture-strip__label">{copy.eyebrow}</p>
          <div className="bp-fixture-strip__rail">
            {strip.map(item => (
              <a
                className="bp-fixture"
                href={matchHref(item)}
                key={`${item.date}-${item.home}-${item.away}`}
              >
                {item.league && <span className="bp-fixture__league">{item.league}</span>}
                <span className="bp-fixture__teams">{item.home}<i aria-hidden="true">–</i>{item.away}</span>
                <span className="bp-fixture__meta">
                  <b>{item.time}</b>
                  {item.predictions.map(pick => (
                    <em key={pick.market} className={pick.market === 'BTTS' ? 'is-btts' : 'is-over'}>
                      {pick.market} {Math.round(pick.proba * 100)}%
                    </em>
                  ))}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
