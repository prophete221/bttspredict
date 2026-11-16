'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useLanguage } from '@/components/bttsbet/LanguageSwitcher'
import { translationsFor, localizedPath } from '@/lib/i18n'
import AnimatedTitle from '@/components/bttsbet/HeroWordmark'
import BookmakerCardLinks from '@/components/bttsbet/BookmakerCardLinks'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })

export default function AICorrectScorePage() {
  const { lang } = useLanguage()
  const t = translationsFor(lang)
  const home = lang === 'fr' ? '/' : `/${lang}`
  const copy = lang === 'fr'
    ? {
        title: 'Prédictions de score exact par IA',
        badge: 'Marché score exact · Disponibilité',
        message: 'Aucune sélection de score exact validée n’est actuellement publiée. BTTSPredict ne complète pas ce marché avec un calcul local ou un modèle de Poisson.',
        next: 'Consultez les marchés publics disponibles :',
        btts: 'Pronostics BTTS',
        over: 'Pronostics Plus de 2,5 buts',
        warning: 'Les autres marchés restent incertains et aucun résultat futur n’est garanti. 18+.',
      }
    : lang === 'en'
      ? {
          title: 'AI Correct Score Predictions',
          badge: 'Correct-score market · Availability',
          message: 'There is currently no validated correct-score pick in the public selections. BTTSPredict does not fill this market with a local calculation or a Poisson model.',
          next: 'See the public markets currently available:',
          btts: 'BTTS predictions',
          over: 'Over 2.5 predictions',
          warning: 'Other markets remain uncertain and no future outcome is guaranteed. 18+.',
        }
      : {
          title: 'توقعات النتيجة الدقيقة بالذكاء الاصطناعي',
          badge: 'سوق النتيجة الدقيقة · التوفر',
          message: 'لا يوجد حالياً اختيار موثّق للنتيجة الدقيقة ضمن الاختيارات العامة. لا تكمل BTTSPredict هذا السوق بحساب محلي أو بنموذج بواسون.',
          next: 'اطّلع على الأسواق العامة المتاحة حالياً:',
          btts: 'توقعات BTTS',
          over: 'توقعات أكثر من 2.5',
          warning: 'تبقى الأسواق الأخرى غير مؤكدة ولا توجد نتيجة مستقبلية مضمونة. 18+.',
        }

  return (
    <div className="min-h-screen flex flex-col text-papier page-design page-design--score-exact">
      <Navbar />
      <main id="main-content" className="flex-1">
        <nav aria-label={lang === 'en' ? 'Breadcrumb' : lang === 'ar' ? 'مسار التنقل' : "Fil d'Ariane"} className="text-xs text-cendre mb-4 max-w-5xl mx-auto px-4 pt-8">
          <Link href={home} className="hover:text-primary">{t.common.home}</Link>
          <span className="mx-1">/</span>
          <span>{lang === 'fr' ? 'Score exact IA' : lang === 'ar' ? 'النتيجة الدقيقة بالذكاء الاصطناعي' : 'AI Correct Score'}</span>
        </nav>

        <section className="max-w-5xl mx-auto px-4 pt-4 pb-6">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4 border border-edge bg-panel text-primary">
            {copy.badge}
          </span>
          <AnimatedTitle as="h1" text={copy.title} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }} />
          <p className="text-base sm:text-lg text-cendre leading-relaxed max-w-3xl mx-auto">{copy.message}</p>
          <p className="text-sm text-cendre leading-relaxed max-w-3xl mx-auto mt-3">{copy.warning}</p>
        </section>

        <section className="max-w-5xl mx-auto px-4 pb-8" aria-live="polite">
          <div className="rounded-2xl border border-edge bg-panel p-5 sm:p-7">
            <h2 className="text-lg font-bold mb-4">{copy.next}</h2>
            <div className="flex flex-wrap gap-3">
              <Link href={localizedPath('/btts/predictions/today', lang)} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white hover:brightness-110">
                {copy.btts}
              </Link>
              <Link href={localizedPath('/over-2-5/predictions/today', lang)} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-edge px-5 py-3 text-sm font-bold text-papier hover:border-primary">
                {copy.over}
              </Link>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-5" aria-label={lang === 'fr' ? 'Partenaires' : lang === 'en' ? 'Partners' : 'الشركاء'}>
          <BookmakerCardLinks locale={lang} placement="exact-score-partner-rail" compact />
        </div>
      </main>
      <Footer />
    </div>
  )
}
