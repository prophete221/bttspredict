'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowUpRight, CalendarDays, Clock3, Trophy } from 'lucide-react'
import { localizedPath, type Locale } from '@/lib/i18n'
import { formatCompetitionDate, type CompetitionMatch, type CompetitionPageData } from '@/lib/competition-pages'
import { useCompetitionFeed } from './useCompetitionFeed'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const COPY = {
  fr: {
    eyebrow: 'Prochains matchs · Flux public', subtitle: 'Les prochaines rencontres disponibles sur BTTSPredict pour cette compétition.',
    updated: 'Données publiées le', count: (n: number) => `${n} rencontre${n > 1 ? 's' : ''} à venir`, time: 'GMT', scheduled: 'À venir', source: 'Calendrier complet ESPN',
    note: 'Cette liste reprend le flux public actuel, pas l’intégralité du calendrier de la ligue. Les coups d’envoi passés et les analyses non validées sont retirés. Aucun pronostic n’est calculé sur cette page.',
    index: 'Toutes les compétitions', center: 'Voir les pronostics', loading: 'Chargement du flux public…', error: 'Le flux public est temporairement indisponible. Aucun ancien calendrier n’est affiché à sa place.',
    empty: 'Aucune prochaine rencontre avec pronostic disponible dans le flux public pour cette compétition. Consulte le calendrier ESPN pour les autres rencontres.', unavailable: 'Date indisponible', yes: 'Oui', no: 'Non',
  },
  en: {
    eyebrow: 'Upcoming matches · Public feed', subtitle: 'Upcoming matches available on BTTSPredict for this competition.',
    updated: 'Data published on', count: (n: number) => `${n} upcoming ${n === 1 ? 'match' : 'matches'}`, time: 'GMT', scheduled: 'Upcoming', source: 'Full ESPN schedule',
    note: 'This list reads the current public feed, not the complete league schedule. Past kickoffs and unvalidated analyses are removed. No prediction is calculated on this page.',
    index: 'All competitions', center: 'View predictions', loading: 'Loading the public feed…', error: 'The public feed is temporarily unavailable. No old schedule is displayed in its place.',
    empty: 'No upcoming match with a prediction is available in the public feed for this competition. See ESPN for other fixtures.', unavailable: 'Date unavailable', yes: 'Yes', no: 'No',
  },
  ar: {
    eyebrow: 'المباريات المقبلة · البيانات العامة', subtitle: 'المباريات المقبلة المتاحة على BTTSPredict لهذه البطولة.',
    updated: 'نُشرت البيانات في', count: (n: number) => `${n} مباريات مقبلة`, time: 'GMT', scheduled: 'مقبلة', source: 'جدول ESPN الكامل',
    note: 'تعرض القائمة البيانات العامة الحالية وليس الجدول الكامل للبطولة. تُحذف المباريات التي مر موعدها والتحليلات غير المعتمدة. لا تُحسب أي توقعات في هذه الصفحة.',
    index: 'جميع البطولات', center: 'عرض التوقعات', loading: 'جار تحميل البيانات العامة…', error: 'البيانات العامة غير متاحة مؤقتاً. لن يُعرض جدول قديم بدلاً منها.',
    empty: 'لا توجد مباراة مقبلة مع توقع متاح في البيانات العامة لهذه البطولة. راجع ESPN للمباريات الأخرى.', unavailable: 'التاريخ غير متاح', yes: 'نعم', no: 'لا',
  },
}

export default function CompetitionPageContent({ competition, locale }: { competition: CompetitionPageData; locale: Locale }) {
  const copy = COPY[locale]
  const feed = useCompetitionFeed()
  const matches = feed.matches[competition.slug] || []
  const updated = feed.lastUpdated ? formatCompetitionDate(feed.lastUpdated.slice(0, 10), locale) : null
  const name = competition.displayName[locale]
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F14] text-[#F2F6FA]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main id="main-content" className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-9 pb-12">
          <nav aria-label={locale === 'fr' ? 'Fil d’Ariane' : locale === 'en' ? 'Breadcrumb' : 'مسار التنقل'} className="mb-5 text-xs text-[#9DABBB]">
            <Link href={localizedPath('/competitions', locale)} className="hover:text-[#4A90FF]">{copy.index}</Link><span className="mx-2" aria-hidden="true">/</span><span>{name}</span>
          </nav>
          <section className="relative overflow-hidden rounded-3xl border p-5 sm:p-8 md:p-10" style={{ background: 'radial-gradient(ellipse at 90% 5%, rgba(47,125,255,.18), transparent 42%), linear-gradient(145deg,#111B27,#0C121A 65%)', borderColor: '#223041' }}>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#7FB2FF]"><Trophy size={14} aria-hidden="true" />{copy.eyebrow}</p>
            <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">{name}</h1>
            <p className="mt-3 text-sm sm:text-base leading-7 text-[#B7C4D3]">{copy.subtitle}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-[#DAE4EF]">
              <span className="inline-flex items-center gap-2"><CalendarDays size={14} aria-hidden="true" />{copy.updated}: <time dateTime={feed.lastUpdated || undefined}>{updated || copy.unavailable}</time></span>
              {feed.status === 'ready' && <span role="status">{copy.count(matches.length)}</span>}
            </div>
          </section>
          <div className="mt-5 flex flex-wrap items-start justify-between gap-4 rounded-2xl border px-4 py-3.5 text-xs leading-6 text-[#9DABBB]" style={{ borderColor: '#223041', backgroundColor: '#101720' }}>
            <p className="max-w-3xl">{copy.note}</p>
            <a href={competition.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-[#7FB2FF]">{copy.source}<ArrowUpRight size={14} aria-hidden="true" /></a>
          </div>
          <section className="mt-8" aria-labelledby="competition-fixtures-heading">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><h2 id="competition-fixtures-heading" className="text-xl sm:text-2xl font-bold">{copy.scheduled}</h2><span className="text-xs text-[#9DABBB]">{copy.time}</span></div>
            {feed.status !== 'ready' ? <p role="status" className="rounded-2xl border border-[#223041] p-6 text-sm text-[#B7C4D3]">{feed.status === 'loading' ? copy.loading : copy.error}</p> : matches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{matches.map(match => <MatchCard key={`${match.date}|${match.home}|${match.away}`} match={match} locale={locale} />)}</div>
            ) : <p className="rounded-2xl border border-[#223041] p-6 text-sm text-[#B7C4D3]">{copy.empty}</p>}
          </section>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={localizedPath('/competitions', locale)} className="inline-flex min-h-11 items-center rounded-xl border border-[#304259] px-4 py-2.5 text-sm font-semibold">{copy.index}</Link>
            <Link href={localizedPath('/btts/predictions/today', locale)} className="inline-flex min-h-11 items-center rounded-xl bg-[#2F7DFF] px-4 py-2.5 text-sm font-bold text-white">{copy.center}</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
function MatchCard({ match, locale }: { match: CompetitionMatch; locale: Locale }) {
  const copy = COPY[locale]
  return (
    <article className="competition-match-card min-w-0 rounded-2xl border p-4 sm:p-5" data-match-date={match.date} data-kickoff={match.kickoffAt} style={{ borderColor: '#223041', background: 'linear-gradient(145deg,#141C25,#10161E)' }}>
      <p className="inline-flex flex-wrap items-center gap-2 text-xs text-[#93A6BA]"><Clock3 size={13} aria-hidden="true" /><time dateTime={match.kickoffAt}>{formatCompetitionDate(match.date, locale)} · {match.time} GMT</time></p>
      <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-3"><p className="min-w-0 break-words text-sm sm:text-base font-semibold">{match.home}</p><span className="text-xs text-[#607489]">{locale === 'ar' ? 'ضد' : 'vs'}</span><p className="min-w-0 break-words text-end text-sm sm:text-base font-semibold">{match.away}</p></div>
      <div className="mt-4 flex flex-wrap gap-2">{match.predictions.map(pick => <span key={pick.market} className="rounded-lg border border-[#304259] px-3 py-2 text-xs text-[#B7D6FF]">{pick.type} · {pick.prediction === 'Oui' ? copy.yes : copy.no} · {new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(pick.proba)}</span>)}</div>
    </article>
  )
}
