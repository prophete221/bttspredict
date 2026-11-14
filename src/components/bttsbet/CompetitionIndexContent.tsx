'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowUpRight, CalendarDays, Trophy } from 'lucide-react'
import { localizedPath, type Locale } from '@/lib/i18n'
import { COMPETITION_PAGES, formatCompetitionDate } from '@/lib/competition-pages'
import { useCompetitionFeed } from './useCompetitionFeed'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const COPY = {
  fr: {
    eyebrow: 'Matchs classés par compétition', title: 'Prochains matchs par compétition',
    intro: 'Parcours les prochaines rencontres disponibles dans le flux public BTTSPredict.',
    count: (n: number) => `${n} rencontre${n > 1 ? 's' : ''} à venir`, updated: 'Données publiées le', open: 'Voir les matchs',
    note: 'Ce n’est pas le calendrier exhaustif des ligues. Une compétition sans rencontre disponible est signalée comme telle. Les coups d’envoi passés sont retirés automatiquement.',
    loading: 'Chargement…', error: 'Flux public indisponible', unavailable: 'Date indisponible',
  },
  en: {
    eyebrow: 'Matches grouped by competition', title: 'Upcoming matches by competition',
    intro: 'Browse upcoming matches available in BTTSPredict’s current public feed.',
    count: (n: number) => `${n} upcoming ${n === 1 ? 'match' : 'matches'}`, updated: 'Data published on', open: 'View matches',
    note: 'This is not a complete league schedule. Competitions with no available match are identified honestly. Past kickoffs are removed automatically.',
    loading: 'Loading…', error: 'Public feed unavailable', unavailable: 'Date unavailable',
  },
  ar: {
    eyebrow: 'المباريات حسب البطولة', title: 'المباريات المقبلة حسب البطولة',
    intro: 'تصفح المباريات المقبلة المتاحة في بيانات BTTSPredict العامة الحالية.',
    count: (n: number) => `${n} مباريات مقبلة`, updated: 'نُشرت البيانات في', open: 'عرض المباريات',
    note: 'هذا ليس الجدول الكامل للبطولات. يُوضح عدم توفر مباراة عند غيابها، وتُحذف المباريات التي مر موعدها تلقائياً.',
    loading: 'جار التحميل…', error: 'البيانات العامة غير متاحة', unavailable: 'التاريخ غير متاح',
  },
}
export default function CompetitionIndexContent({ locale }: { locale: Locale }) {
  const copy = COPY[locale]
  const feed = useCompetitionFeed()
  const updated = feed.lastUpdated ? formatCompetitionDate(feed.lastUpdated.slice(0, 10), locale) : null
  return (
    <div className="page-design page-design--competition min-h-screen flex flex-col bg-[#080D14] text-[#EDF2F7]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main id="main-content" className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-7 sm:pt-10 pb-14">
          <section className="relative overflow-hidden rounded-3xl border p-6 sm:p-9" style={{ background: 'radial-gradient(ellipse at 90% 0%, rgba(47,125,255,.18), transparent 42%), linear-gradient(145deg,#111B27,#0C121A 65%)', borderColor: '#223041' }}>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#7FB2FF]"><Trophy size={14} aria-hidden="true" />{copy.eyebrow}</p>
            <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">{copy.title}</h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base leading-7 text-[#B7C4D3]">{copy.intro}</p>
            <p className="mt-5 inline-flex flex-wrap items-center gap-2 text-xs text-[#DAE4EF]"><CalendarDays size={14} aria-hidden="true" />{copy.updated}: <time dateTime={feed.lastUpdated || undefined}>{updated || copy.unavailable}</time></p>
          </section>
          <p className="mt-4 rounded-2xl border px-4 py-3 text-xs leading-6 text-[#9DABBB]" style={{ borderColor: '#223041', backgroundColor: '#101720' }}>{copy.note}</p>
          <section className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" aria-label={copy.eyebrow}>
            {COMPETITION_PAGES.map(competition => (
              <Link key={competition.slug} href={localizedPath(`/competitions/${competition.slug}`, locale)} className="group min-w-0 rounded-2xl border p-4 sm:p-5 transition-colors hover:border-[#4A90FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A90FF]" style={{ borderColor: '#223041', background: 'linear-gradient(145deg,#141C25,#10161E)' }}>
                <div className="flex items-start justify-between gap-3"><h2 className="min-w-0 break-words text-lg font-bold">{competition.displayName[locale]}</h2><ArrowUpRight size={17} className="shrink-0 text-[#5BA9FF]" aria-hidden="true" /></div>
                <p className="mt-2 text-xs text-[#9DABBB]">{feed.status === 'ready' ? copy.count(feed.matches[competition.slug].length) : feed.status === 'loading' ? copy.loading : copy.error}</p>
                <p className="mt-4 text-xs font-semibold text-[#7FB2FF]">{copy.open} <span aria-hidden="true">→</span></p>
              </Link>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
