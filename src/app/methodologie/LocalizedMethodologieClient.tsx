'use client'

import type { ReactNode } from 'react'
import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'
import { useLanguage } from '@/components/bttsbet/LanguageSwitcher'
import AnimatedTitle from '@/components/bttsbet/HeroWordmark'
import { localizedPath } from '@/lib/i18n'

const COPY = {
  fr: {
    badge: 'Méthodologie', title: 'Comment fonctionnent nos pronostics',
    intro: 'BTTSPredict publie uniquement les sélections BTTS et Over 2.5 validées avant publication. Les probabilités affichées viennent de ce flux : le site ne crée pas de picks avec Poisson ou des heuristiques locales.',
    source: 'Source des sélections', sourceBody: 'Chaque pick affiché doit provenir du flux public validé et concerner un marché pris en charge. Les données de calendrier et de résultats servent à identifier les matchs et à contrôler ensuite leur issue ; elles ne sont pas converties en pronostics locaux.',
    sources: 'Sources des données', espn: 'Calendriers, scores et logos d’équipes, selon les données disponibles.', sportsdb: 'Source complémentaire utilisée pour vérifier certains résultats.',
    markets: 'Comment lire les chiffres', btts: 'Probabilité BTTS associée à la sélection : les deux équipes marquent au moins un but.', over: 'Probabilité Over 2.5 associée à la sélection : le match compte au moins trois buts.',
    limits: 'Le flux public validé ne contient actuellement que BTTS et Over 2.5. Aucun score exact ni combiné calculé localement n’est ajouté.',
    coverage: 'Le flux public ne représente pas le calendrier complet des championnats. Seules les rencontres avec un pick valide apparaissent; la couverture dépend des données publiées disponibles.',
    quality: 'Résultats et contrôles', qualityBody: 'Par défaut, les pages affichent tous les picks valides à venir, sans coupure fixe à J+7. Les filtres facultatifs peuvent réduire la liste mais ne créent ni ne modifient les picks. Les doublons, marchés contradictoires et coups d’envoi passés sont écartés.',
    risk: 'Une estimation n’est pas une garantie. Les paris sportifs comportent un risque de perte. 18+.', cta: 'Voir les picks disponibles →', responsible: 'Jouer de manière responsable →',
  },
  en: {
    badge: 'Methodology', title: 'How our predictions work',
    intro: 'BTTSPredict publishes only BTTS and Over 2.5 picks validated before publication. Displayed probabilities come from that feed; the site does not create picks with Poisson calculations or local heuristics.',
    source: 'Source of the picks', sourceBody: 'Every displayed pick must come from the validated public feed and use a supported market. Match schedules and results help identify fixtures and verify outcomes; they are not converted into locally generated predictions.',
    sources: 'Data sources', espn: 'Schedules, scores and team logos, subject to available data.', sportsdb: 'An additional source used to verify some results.',
    markets: 'How to read the figures', btts: 'BTTS probability associated with the pick: both teams score at least once.', over: 'Over 2.5 probability associated with the pick: the match has at least three goals.',
    limits: 'The validated public feed currently supports BTTS and Over 2.5. No exact-score pick or locally calculated combo is added.',
    coverage: 'The public feed is not a complete fixture schedule. Only matches with a validated pick appear; coverage depends on the published data available.',
    quality: 'Results and checks', qualityBody: 'By default, all valid upcoming picks are displayed, with no fixed J+7 cutoff. Optional filters can narrow the list but do not create or change picks. Duplicates, conflicting markets and kickoffs that have passed are excluded.',
    risk: 'An estimate is not a guarantee. Sports betting carries a risk of loss. 18+.', cta: 'See available picks →', responsible: 'Play responsibly →',
  },
  ar: {
    badge: 'المنهجية', title: 'كيف تعمل توقعاتنا',
    intro: 'تنشر BTTSPredict فقط اختيارات BTTS وOver 2.5 المعتمدة قبل النشر. تأتي الاحتمالات المعروضة من هذا المصدر؛ ولا ينشئ الموقع اختيارات بحسابات بواسون أو بقواعد محلية.',
    source: 'مصدر الاختيارات', sourceBody: 'يجب أن يأتي كل اختيار معروض من البيانات العامة المعتمدة وأن يخص سوقاً مدعوماً. تساعد جداول المباريات والنتائج على تحديد اللقاءات والتحقق من نتائجها لاحقاً، ولا تُحوّل محلياً إلى توقعات.',
    sources: 'مصادر البيانات', espn: 'جداول المباريات والنتائج وشعارات الفرق، وفق البيانات المتاحة.', sportsdb: 'مصدر إضافي للتحقق من بعض النتائج.',
    markets: 'كيفية قراءة الأرقام', btts: 'احتمال BTTS المرتبط بالاختيار: أن يسجل كل فريق هدفاً واحداً على الأقل.', over: 'احتمال Over 2.5 المرتبط بالاختيار: أن تسجل المباراة ثلاثة أهداف أو أكثر.',
    limits: 'تدعم البيانات العامة المعتمدة حالياً BTTS وOver 2.5 فقط. لا نضيف نتيجة دقيقة أو مجموعة محسوبة محلياً.',
    coverage: 'لا تمثل البيانات العامة جدولاً كاملاً للمباريات. تظهر فقط اللقاءات التي لديها اختيار موثّق؛ ويعتمد نطاق التغطية على البيانات المنشورة المتاحة.',
    quality: 'النتائج والتحقق', qualityBody: 'تُعرض افتراضياً جميع الاختيارات القادمة والمعتمدة دون حد زمني ثابت عند J+7. يمكن للمرشحات الاختيارية تقليص القائمة لكنها لا تنشئ الاختيارات ولا تغيّرها. تُستبعد التكرارات والأسواق المتعارضة والمباريات التي بدأ وقتها.',
    risk: 'التقدير ليس ضماناً. تنطوي المراهنات على خطر الخسارة. +18.', cta: 'عرض الاختيارات المتاحة ←', responsible: 'العب بمسؤولية ←',
  },
} as const

export default function LocalizedMethodologieClient() {
  const { lang } = useLanguage()
  const copy = COPY[lang]
  const sourceLabel = lang === 'ar' ? 'المصادر' : lang === 'en' ? 'Sources' : 'Sources'

  return (
    <div className="min-h-screen bg-[#0B0F14] flex flex-col text-[#F2F6FA]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main id="main-content" className="flex-1">
        <article className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
          <header className="mb-10">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4" style={{ backgroundColor: 'rgba(127, 162, 198, 0.16)', color: '#2F7DFF', border: '1px solid rgba(127, 162, 198, 0.30)' }}>{copy.badge}</span>
            <AnimatedTitle as="h1" text={copy.title} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }} />
            <p className="text-base text-[#9DABBB] leading-relaxed">{copy.intro}</p>
          </header>
          <Section title={copy.source}><p>{copy.sourceBody}</p></Section>
          <Section title={copy.sources}>
            <Card title="ESPN">{copy.espn}</Card>
            <Card title="TheSportsDB">{copy.sportsdb}</Card>
            <p className="mt-4 text-xs">{sourceLabel}: ESPN, TheSportsDB. {copy.risk}</p>
          </Section>
          <Section title={copy.markets}>
            <Card title="BTTS">{copy.btts}</Card>
            <Card title="Over 2.5">{copy.over}</Card>
            <p className="mt-3 text-xs">{copy.limits}</p>
            <p className="mt-3 text-xs">{copy.coverage}</p>
          </Section>
          <Section title={copy.quality}><p>{copy.qualityBody}</p></Section>
          <div className="pt-8 border-t border-[#6B7A8C] flex flex-wrap justify-center gap-3">
            <a href={localizedPath('/btts/predictions/today', lang)} className="px-5 py-2.5 rounded-[10px] text-sm font-bold" style={{ backgroundColor: '#2F7DFF', color: '#FFFFFF' }}>{copy.cta}</a>
            <a href={localizedPath('/jouer-responsable', lang)} className="px-5 py-2.5 rounded-[10px] text-sm font-bold" style={{ border: '1px solid #F87171', color: '#F87171' }}>{copy.responsible}</a>
          </div>
        </article>
        <section className="max-w-5xl mx-auto px-4 py-8"><FreePredictions /></section>
      </main>
      <Footer />
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="mb-10"><h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>{title}</h2><div className="text-sm text-[#9DABBB] leading-relaxed space-y-3">{children}</div></section>
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return <div className="p-4 rounded-xl mb-3" style={{ backgroundColor: '#141C25', border: '1px solid #6B7A8C' }}><h3 className="text-base font-bold mb-2 text-[#F2F6FA]">{title}</h3><p className="text-xs text-[#9DABBB] leading-relaxed">{children}</p></div>
}
