'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from './LanguageSwitcher'
import { translationsFor, type Locale, localizedPath } from '@/lib/i18n'
import { generateMatchSlug } from '@/lib/match-slug'
import { getDakarDayDiff, hasDakarKickoffPassed } from '@/lib/dakar-date'

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
  xgHome?: number
  xgAway?: number
  xgTotal?: number
  predictions?: MarketPick[]
  type?: string
  prediction?: string
}

function dayLabel(date: string, lang: Locale, today: string, tomorrow: string): string {
  const diff = getDakarDayDiff(date)
  if (diff === 0) return today
  if (diff === 1) return tomorrow
  const locale = lang === 'en' ? 'en-GB' : lang === 'ar' ? 'ar' : 'fr-FR'
  try {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      timeZone: 'Africa/Dakar',
    }).format(new Date(date + 'T12:00:00Z'))
  } catch {
    return date
  }
}

function cleanTitle(value: string): string {
  return value.replace(/[\[\]]/g, '')
}

export default function Hero({ initialLocale }: { initialLocale?: Locale } = {}) {
  const { lang: detectedLang } = useLanguage()
  const lang = initialLocale ?? detectedLang
  const t = translationsFor(lang)
  const [featured, setFeatured] = useState<FeedItem | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/predictions.json')
      .then((response) => (response.ok ? response.json() : null))
      .catch(() => null)
      .then((payload) => {
        if (cancelled) return
        const rows: FeedItem[] = Array.isArray(payload?.free)
          ? payload.free
          : Array.isArray(payload?.predictions) ? payload.predictions : []
        const upcoming = rows
          .filter((match) => !hasDakarKickoffPassed(match.date, match.time))
          .sort((a, b) => {
            const score = (match: FeedItem) =>
              (match.predictions?.length ? 4 : 0) +
              (match.xgTotal !== undefined ? 2 : 0) +
              (match.confidence !== undefined ? 1 : 0)
            return score(b) - score(a)
          })
        setFeatured(upcoming[0] ?? null)
        setReady(true)
      })
    return () => { cancelled = true }
  }, [])

  const picks: MarketPick[] = featured
    ? (featured.predictions?.length
      ? featured.predictions
      : featured.type
        ? [{ type: featured.type, prediction: featured.prediction ?? '', confidence: featured.confidence }]
        : []).slice(0, 2)
    : []

  const yes = t.predictions.bttsYes
  const no = t.predictions.bttsNo
  const matchHref = featured?.home && featured.away && featured.date
    ? localizedPath(`/match/${generateMatchSlug(featured.home, featured.away, featured.date)}`, lang)
    : localizedPath('/matchs', lang)
  const direction = lang === 'ar' ? 'rtl' : 'ltr'
  const featuredDay = featured
    ? dayLabel(featured.date, lang, t.home2.mcToday, t.home2.mcTomorrow)
    : ''

  return (
    <section className="btp-home-hero" lang={lang} dir={direction}>
      <div className="btp-home-hero__inner">
        <div className="btp-home-hero__copy">
          <p className="btp-home-hero__eyebrow">BTTSPREDICT <span>·</span> FOOTBALL INTELLIGENCE</p>
          <h1 className="btp-home-hero__title">
            <span>{cleanTitle(t.home2.heroTitle1)}</span>
            <span className="btp-home-hero__title-accent">{cleanTitle(t.home2.heroTitle2)}</span>
          </h1>
          <p className="btp-home-hero__description">{t.home2.heroText}</p>
          <div className="btp-home-hero__actions">
            <a href="#matchs" className="btp-home-hero__primary" data-cta="hero-open-matchs">
              {t.home2.heroCtaPrimary}
              <span aria-hidden="true">→</span>
            </a>
            <a href={localizedPath('/historique', lang)} className="btp-home-hero__secondary" data-cta="hero-history">
              {t.home2.heroCtaSecondary}
            </a>
          </div>
          <ul className="btp-home-hero__facts" aria-label={lang === 'en' ? 'Platform information' : lang === 'ar' ? 'معلومات المنصة' : 'Informations plateforme'}>
            <li><span>MARKETS</span><strong>BTTS · OVER 2.5 · SCORE</strong></li>
            <li><span>METHOD</span><strong>{lang === 'en' ? 'Recent form + model' : lang === 'ar' ? 'الأداء الأخير + النموذج' : 'Forme récente + modèle'}</strong></li>
            <li><span>TIMEZONE</span><strong>GMT</strong></li>
          </ul>
        </div>

        <aside className="btp-home-hero__feature" aria-label={lang === 'en' ? 'Featured match' : lang === 'ar' ? 'المباراة المختارة' : 'Match à la une'}>
          <div className="btp-home-hero__feature-head">
            <span className="btp-home-hero__feature-label">
              <i aria-hidden="true" />
              {lang === 'en' ? 'FEATURED MATCH' : lang === 'ar' ? 'مباراة مختارة' : 'MATCH À LA UNE'}
            </span>
            <span className="btp-home-hero__live-tag">{lang === 'en' ? 'DATA FEED' : lang === 'ar' ? 'بيانات مباشرة' : 'FLUX DE DONNÉES'}</span>
          </div>

          {!ready ? (
            <div className="btp-home-hero__loading" aria-label={lang === 'en' ? 'Loading match data' : lang === 'ar' ? 'جار تحميل بيانات المباراة' : 'Chargement des données'} />
          ) : featured ? (
            <>
              <p className="btp-home-hero__league">{featured.league}</p>
              <div className="btp-home-hero__teams">
                <div className="btp-home-hero__team">
                  {featured.homeLogo && <img src={featured.homeLogo} alt="" width={38} height={38} loading="lazy" />}
                  <strong>{featured.home}</strong>
                </div>
                <span className="btp-home-hero__versus">VS</span>
                <div className="btp-home-hero__team">
                  {featured.awayLogo && <img src={featured.awayLogo} alt="" width={38} height={38} loading="lazy" />}
                  <strong>{featured.away}</strong>
                </div>
              </div>
              <div className="btp-home-hero__kickoff">
                <strong>{featured.time}</strong>
                <span>{featuredDay} · GMT</span>
              </div>
              {picks.length > 0 && (
                <div className="btp-home-hero__picks">
                  {picks.map((pick) => (
                    <div className="btp-home-hero__pick" key={pick.type}>
                      <span>{pick.type}</span>
                      <strong>{pick.prediction === 'Oui' ? yes : pick.prediction === 'Non' ? no : pick.prediction}</strong>
                      {typeof pick.confidence === 'number' && pick.confidence > 0 && pick.confidence <= 100 && (
                        <b>{pick.confidence}%</b>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <p className="btp-home-hero__source">
                {lang === 'en' ? 'Published match data' : lang === 'ar' ? 'بيانات المباراة المنشورة' : 'Données de match publiées'}
              </p>
            </>
          ) : (
            <div className="btp-home-hero__empty">
              <strong>{lang === 'en' ? 'No featured match available' : lang === 'ar' ? 'لا توجد مباراة مختارة حالياً' : 'Aucun match à la une'}</strong>
              <span>{lang === 'en' ? 'Check the full match list for the latest fixtures.' : lang === 'ar' ? 'راجع قائمة المباريات للاطلاع على أحدث المواجهات.' : 'Consultez la liste complète des matchs à venir.'}</span>
            </div>
          )}

          <a href={matchHref} className="btp-home-hero__feature-link">
            {lang === 'en' ? 'View match analysis' : lang === 'ar' ? 'عرض تحليل المباراة' : 'Voir l’analyse du match'}
            <span aria-hidden="true">→</span>
          </a>
        </aside>
      </div>
    </section>
  )
}
