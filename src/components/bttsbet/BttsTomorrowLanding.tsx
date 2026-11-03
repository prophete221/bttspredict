import Link from 'next/link'
import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'
import PredictionMarketNav from '@/components/bttsbet/PredictionMarketNav'
import { localizedPath, type Locale } from '@/lib/i18n'

const COPY: Record<Locale, {
  home: string; predictions: string; breadcrumb: string; eyebrow: string; title: string; intro: string;
  panelTitle: string; panelText: string; panelFilter: string; cta: string; browse: string; legal: string;
  visualLabel: string; visualValue: string; visualCaption: string; today: string;
}> = {
  fr: {
    home: 'Accueil', predictions: 'Pronostics', breadcrumb: 'BTTS demain', eyebrow: 'BTTS · DEMAIN',
    title: 'Pronostics BTTS de demain',
    intro: 'Cette page sert de raccourci vers le tableau BTTS. Les matchs du jour et les rencontres à venir y apparaissent à mesure que leurs données sont publiées.',
    panelTitle: 'Où trouver les matchs de demain ?',
    panelText: 'Ouvrez le tableau BTTS. Les matchs de demain y figureront lorsque les rencontres et leurs données auront été publiées; si elles n’apparaissent pas encore, la sélection n’est pas disponible.',
    panelFilter: 'La liste reflète uniquement les rencontres présentes dans les données publiées.',
    cta: 'Ouvrir le tableau BTTS', browse: 'Voir les matchs publiés',
    legal: 'Aucun résultat futur n’est garanti. Les paris comportent un risque de perte. 18+ — Jouez responsable.',
    visualLabel: 'RYTHME DE PUBLICATION', visualValue: '4× / jour', visualCaption: 'Mises à jour automatiques indiquées par le site.', today: 'Tableau BTTS',
  },
  en: {
    home: 'Home', predictions: 'Predictions', breadcrumb: 'BTTS tomorrow', eyebrow: 'BTTS · TOMORROW',
    title: 'BTTS predictions for tomorrow',
    intro: 'This page is a shortcut to the BTTS board. Today’s matches and upcoming fixtures appear there as their data is published.',
    panelTitle: 'Where can I find tomorrow’s matches?',
    panelText: 'Open the BTTS board. Tomorrow’s fixtures will appear when their match data is published; if they are not listed yet, the selection is not available.',
    panelFilter: 'The list reflects only fixtures present in the published data.',
    cta: 'Open the BTTS board', browse: 'See published matches',
    legal: 'No future result is guaranteed. Betting involves a risk of loss. 18+ — Please play responsibly.',
    visualLabel: 'PUBLISHING CADENCE', visualValue: '4× / day', visualCaption: 'Automatic updates as stated by the site.', today: 'BTTS board',
  },
  ar: {
    home: 'الرئيسية', predictions: 'التوقعات', breadcrumb: 'توقعات BTTS للغد', eyebrow: 'BTTS · الغد',
    title: 'توقعات BTTS للغد',
    intro: 'هذه الصفحة اختصار إلى لوحة BTTS. تظهر مباريات اليوم والمباريات القادمة فيها عند نشر بياناتها.',
    panelTitle: 'أين أجد مباريات الغد؟',
    panelText: 'افتح لوحة BTTS. ستظهر مباريات الغد عند نشر بياناتها؛ وإذا لم تظهر بعد، فالاختيارات غير متاحة حتى الآن.',
    panelFilter: 'تعرض القائمة المباريات الموجودة في البيانات المنشورة فقط.',
    cta: 'افتح لوحة BTTS', browse: 'عرض المباريات المنشورة',
    legal: 'لا توجد ضمانات لأي نتيجة مستقبلية. تنطوي المراهنات على مخاطر الخسارة. 18+ — العب بمسؤولية.',
    visualLabel: 'وتيرة النشر', visualValue: '4× يومياً', visualCaption: 'تحديثات آلية وفقاً لما يوضحه الموقع.', today: 'لوحة BTTS',
  },
}

export default function BttsTomorrowLanding({ locale = 'fr' }: { locale?: Locale }) {
  const t = COPY[locale]
  const boardHref = localizedPath('/btts/predictions/today', locale)

  return (
    <div className="page-design page-design--tomorrow min-h-screen bg-[#0B0F14] flex flex-col text-[#F2F6FA]" lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main id="main-content" className="flex-1" style={{ paddingBottom: 'calc(140px + env(safe-area-inset-bottom, 0px))' }}>
        <nav aria-label={t.breadcrumb} className="max-w-5xl mx-auto px-4 pt-6 sm:pt-8 pb-4 text-xs text-[#9DABBB]">
          <Link href={localizedPath('/', locale)} className="hover:text-[#2F7DFF]">{t.home}</Link><span className="mx-2">/</span>
          <Link href={boardHref} className="hover:text-[#2F7DFF]">{t.predictions}</Link><span className="mx-2">/</span><span>{t.breadcrumb}</span>
        </nav>
        <PredictionMarketNav locale={locale} active="tomorrow" />
        <section className="max-w-5xl mx-auto px-4 pb-7">
          <div className="market-hero market-hero--tomorrow">
            <div className="market-hero__content">
              <p className="market-hero__eyebrow">{t.eyebrow}</p>
              <h1 className="market-hero__title">{t.title}</h1>
              <p className="market-hero__text">{t.intro}</p>
              <div className="market-hero__actions">
                <Link href={boardHref} className="market-hero__primary">{t.cta} <span aria-hidden="true">{locale === 'ar' ? '←' : '→'}</span></Link>
                <a href="#tomorrow-feed" className="market-hero__secondary">{t.browse}</a>
              </div>
              <p className="market-hero__meta">{t.legal}</p>
            </div>
            <aside className="market-hero__visual" aria-label={t.visualLabel}>
              <div className="market-visual-card">
                <div className="market-visual-card__label"><span>{t.visualLabel}</span><span className="market-visual-card__mark">BTTS</span></div>
                <strong className="market-visual-card__big">{t.visualValue}</strong>
                <span className="market-visual-card__caption">{t.visualCaption}</span>
                <div className="market-visual-card__rule" />
                <div className="market-visual-card__footer"><span>{t.today}</span><span aria-hidden="true">→</span></div>
              </div>
            </aside>
          </div>
        </section>
        <section id="tomorrow-details" className="max-w-5xl mx-auto px-4 pb-8">
          <div className="tomorrow-info-card">
            <div className="tomorrow-info-card__index" aria-hidden="true">01</div>
            <div className="min-w-0">
              <h2>{t.panelTitle}</h2>
              <p>{t.panelText}</p>
              <p className="tomorrow-info-card__note">{t.panelFilter}</p>
            </div>
          </div>
        </section>
        <section id="tomorrow-feed" className="max-w-5xl mx-auto px-4 py-6 scroll-mt-6">
          <h2 className="tomorrow-feed-heading">{t.browse}</h2>
          <FreePredictions />
        </section>
      </main>
      <Footer />
    </div>
  )
}
