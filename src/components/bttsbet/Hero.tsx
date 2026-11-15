'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from './LanguageSwitcher'
import { translationsFor, type Locale, localizedPath } from '@/lib/i18n'
import { generateMatchSlug } from '@/lib/match-slug'
import { getDakarDayDiff, hasDakarKickoffPassed } from '@/lib/dakar-date'
import BookmakerCardLinks from './BookmakerCardLinks'

interface Pick { type: string; prediction: string; confidence?: number }
interface Fixture {
  home: string; away: string; league: string; date: string; time: string
  homeLogo?: string; awayLogo?: string; predictions?: Pick[]
  type?: string; prediction?: string; confidence?: number
  xgTotal?: number; reliabilityScore?: number
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

export default function Hero({ initialLocale }: { initialLocale?: Locale } = {}) {
  const { lang: detectedLang } = useLanguage()
  const lang = initialLocale ?? detectedLang
  const t = translationsFor(lang)
  const [fixture, setFixture] = useState<Fixture | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let active = true
    fetch('/predictions.json')
      .then(r => r.ok ? r.json() : null)
      .catch(() => null)
      .then(data => {
        if (!active) return
        const rows: Fixture[] = Array.isArray(data?.free) ? data.free : Array.isArray(data?.predictions) ? data.predictions : []
        const next = rows
          .filter(row => row.home && row.away && row.date && !hasDakarKickoffPassed(row.date, row.time))
          .sort((a, b) => {
            const score = (x: Fixture) => (x.predictions?.length ? 4 : 0) + (x.xgTotal !== undefined ? 2 : 0) + (x.reliabilityScore !== undefined ? 1 : 0)
            return score(b) - score(a) || (a.date + a.time).localeCompare(b.date + b.time)
          })[0] ?? null
        setFixture(next)
        setLoaded(true)
      })
    return () => { active = false }
  }, [])

  const direction = lang === 'ar' ? 'rtl' : 'ltr'
  const picks = fixture?.predictions?.length
    ? fixture.predictions.slice(0, 2)
    : fixture?.type ? [{ type: fixture.type, prediction: fixture.prediction ?? '', confidence: fixture.confidence }].slice(0, 2) : []
  const href = fixture
    ? localizedPath(`/match/${generateMatchSlug(fixture.home, fixture.away, fixture.date)}`, lang)
    : localizedPath('/matchs', lang)
  const copy = lang === 'en'
    ? { eyebrow: 'FOOTBALL ANALYTICS', description: 'Clear match analysis, published selections and a verifiable results history.', featured: 'FEATURED MATCH', noMatch: 'No upcoming selection is available right now.', view: 'View match analysis', matches: 'Explore matches', history: 'Results history', method: 'Methodology', kickoff: 'KICK-OFF', today: 'MATCH DATA' }
    : lang === 'ar'
      ? { eyebrow: 'تحليل كرة القدم', description: 'تحليل واضح للمباريات واختيارات منشورة وسجل نتائج قابل للتحقق.', featured: 'المباراة المختارة', noMatch: 'لا توجد اختيارات قادمة متاحة حالياً.', view: 'عرض تحليل المباراة', matches: 'استكشف المباريات', history: 'سجل النتائج', method: 'المنهجية', kickoff: 'موعد البداية', today: 'بيانات المباراة' }
      : { eyebrow: 'ANALYSE FOOTBALL', description: 'Des analyses de matchs lisibles, des sélections publiées et un historique de résultats vérifiable.', featured: 'MATCH À LA UNE', noMatch: 'Aucune sélection à venir disponible pour le moment.', view: 'Voir l’analyse du match', matches: 'Voir les matchs', history: 'Historique des résultats', method: 'Méthodologie', kickoff: 'COUP D’ENVOI', today: 'DONNÉES DU MATCH' }

  return (
    <section className="bp-home" lang={lang} dir={direction}>
      <div className="bp-home__inner">
        <div className="bp-home__intro">
          <div className="bp-home__brands" aria-label="Brand">
            <span className="bp-home__brand bp-home__brand--primary">
              {lang === 'en' ? 'World’s No.1 platform' : lang === 'ar' ? 'المنصة رقم 1 عالمياً' : 'Plateforme N°1 Mondiale'}
            </span>
            <span className="bp-home__brand bp-home__brand--accent">BTTS &amp; Over 2.5 Master</span>
          </div>
          <p className="bp-home__eyebrow">BTTSPREDICT <span>·</span> {copy.eyebrow}</p>
          <h1 className="bp-home__title">
            <span>{t.home2.heroTitle1.replace(/[\[\]]/g, '')}</span>
            <strong>{t.home2.heroTitle2}</strong>
          </h1>
          <p className="bp-home__description">{copy.description}</p>
          <div className="bp-home__actions">
            <a className="bp-home__primary" href="#matchs">{t.home2.heroCtaPrimary}<span aria-hidden="true">→</span></a>
            <a className="bp-home__secondary" href={localizedPath('/historique', lang)}>{copy.history}</a>
          </div>
          <div className="bp-home__facts">
            <span><b>BTTS</b><small>{lang === 'ar' ? 'الفريقان يسجلان' : lang === 'en' ? 'Both teams score' : 'Les deux équipes marquent'}</small></span>
            <span><b>OVER 2.5</b><small>{lang === 'ar' ? '3 أهداف أو أكثر' : lang === 'en' ? '3 goals or more' : '3 buts ou plus'}</small></span>
            <span><b>18+</b><small>{copy.method}</small></span>
          </div>
        </div>

        <article className="bp-feature">
          <header className="bp-feature__header">
            <span><i />{copy.featured}</span>
            <small>{copy.today}</small>
          </header>
          {!loaded ? <div className="bp-feature__loading" aria-hidden="true" /> : fixture ? (
            <>
              <p className="bp-feature__league">{fixture.league}</p>
              <div className="bp-feature__teams">
                <div>{fixture.homeLogo ? <img src={fixture.homeLogo} alt="" width={42} height={42} /> : <span className="bp-feature__initial">{fixture.home.slice(0,1)}</span>}<b>{fixture.home}</b></div>
                <em>VS</em>
                <div>{fixture.awayLogo ? <img src={fixture.awayLogo} alt="" width={42} height={42} /> : <span className="bp-feature__initial">{fixture.away.slice(0,1)}</span>}<b>{fixture.away}</b></div>
              </div>
              <div className="bp-feature__time"><b>{fixture.time || '—'}</b><span>{dateLabel(fixture.date, lang)} · GMT</span></div>
              {picks.length > 0 && <div className="bp-feature__picks">{picks.map(p => <div key={p.type}><small>{p.type}</small><b>{p.prediction === 'Oui' ? t.predictions.bttsYes : p.prediction === 'Non' ? t.predictions.bttsNo : p.prediction}</b>{typeof p.confidence === 'number' && p.confidence > 0 && p.confidence <= 100 && <strong>{p.confidence}%</strong>}</div>)}</div>}
            </>
          ) : <div className="bp-feature__empty">{copy.noMatch}</div>}
          {fixture && <div className="bp-feature__partners"><BookmakerCardLinks locale={lang} placement="home-featured-match-card" compact /></div>}
          <a className="bp-feature__link" href={href}>{copy.view}<span aria-hidden="true">→</span></a>
        </article>
      </div>
    </section>
  )
}
