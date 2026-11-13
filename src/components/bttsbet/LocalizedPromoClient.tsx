'use client'

import { AFFILIATE } from '@/lib/constants'
import { useLanguage } from './LanguageSwitcher'
import Navbar from './Navbar'
import PromoLandingShell from './PromoLandingShell'
import { getPromoFaq, type PromoBookmakerId } from '@/lib/promo-faq'
import Star888PromoClient from './Star888PromoClient'

type BookmakerId = PromoBookmakerId

const INFO: Record<BookmakerId, {
  brand: string
  code: string
  signup: string
  download: string
  logo: string
  logoBg: string
  accent: string
}> = {
  '1xbet': {
    brand: '1xBet',
    code: 'vipbtts',
    signup: AFFILIATE.oneXbet,
    download: AFFILIATE.oneXbetDownload,
    logo: '/logos/1xbet-logo.png',
    logoBg: '#1a237e',
    accent: '#1B6EF3',
  },
  linebet: {
    brand: 'Linebet',
    code: 'VISION221',
    signup: AFFILIATE.linebet,
    download: AFFILIATE.linebetDownload,
    logo: '/logos/linebet-logo.jpg',
    logoBg: '#0d1b2a',
    accent: '#2F7DFF',
  },
  melbet: {
    brand: 'Melbet',
    code: 'Bttswin',
    signup: AFFILIATE.melbet,
    download: AFFILIATE.melbetDownload,
    logo: '/logos/melbet-logo.jpg',
    logoBg: '#1b1b1b',
    accent: '#F59E0B',
  },
  '888starz': {
    brand: '888Starz',
    code: 'btts221',
    signup: AFFILIATE.star888,
    download: AFFILIATE.star888Download,
    logo: '/logos/888starz-logo.jpg',
    logoBg: '#1a0a0f',
    accent: '#FF4D6D',
  },
}

const CROSS: { id: BookmakerId; label: Record<'fr' | 'en' | 'ar', string>; href: string }[] = [
  { id: '1xbet', label: { fr: 'Guide 1xBet', en: '1xBet guide', ar: 'دليل 1xBet' }, href: '/code-promo-1xbet' },
  { id: 'linebet', label: { fr: 'Guide Linebet', en: 'Linebet guide', ar: 'دليل Linebet' }, href: '/code-promo-linebet-senegal' },
  { id: 'melbet', label: { fr: 'Guide Melbet', en: 'Melbet guide', ar: 'دليل Melbet' }, href: '/code-promo-melbet' },
  { id: '888starz', label: { fr: 'Guide 888Starz', en: '888Starz guide', ar: 'دليل 888Starz' }, href: '/bonus-888starz' },
]

type PromoText = {
  badge: string
  title: string
  intro: string
  offerHeadline: string
  offerSub: string
  benefits: string[]
  steps: { n: string; title: string; desc: string }[]
}

const LOCALIZED_COPY: Record<Exclude<BookmakerId, '888starz'>, Record<'fr' | 'en' | 'ar', PromoText>> = {
  '1xbet': {
    fr: {
      badge: 'GUIDE CODE 1XBET',
      title: 'Code promo 1xBet : vipbtts',
      intro: 'Saisissez vipbtts dans le champ code promo de 1xBet. L’offre annoncée comprend un bonus de dépôt de 300 %, du cashback et des bonus hebdomadaires. Les conditions et l’éligibilité sont à confirmer sur le site de l’opérateur.',
      offerHeadline: 'Bonus de dépôt 1xBet',
      offerSub: 'Bonus de dépôt mondial de 300 % · cashback · bonus hebdomadaires.',
      benefits: ['Code exact : vipbtts', 'Bonus de dépôt mondial de 300 %', 'Cashback', 'Bonus hebdomadaires'],
      steps: [
        { n: '01', title: 'Copier le code exact', desc: 'Recopiez vipbtts tel qu’il apparaît sur cette page.' },
        { n: '02', title: 'Consulter les conditions 1xBet', desc: 'Le bouton ouvre le site de l’opérateur ; vérifiez-y les modalités en vigueur.' },
      ],
    },
    en: {
      badge: '1XBET CODE GUIDE',
      title: '1xBet promo code: vipbtts',
      intro: 'Enter vipbtts in the 1xBet promo-code field. The advertised offer includes a 300% deposit bonus, cashback and weekly bonuses. Confirm eligibility and current terms with the operator.',
      offerHeadline: '1xBet deposit bonus',
      offerSub: '300% worldwide deposit bonus · cashback · weekly bonuses.',
      benefits: ['Exact code: vipbtts', '300% worldwide deposit bonus', 'Cashback', 'Weekly bonuses'],
      steps: [
        { n: '01', title: 'Copy the exact code', desc: 'Copy vipbtts exactly as shown on this page.' },
        { n: '02', title: 'Check 1xBet’s terms', desc: 'The button opens the operator’s site; review the current terms there.' },
      ],
    },
    ar: {
      badge: 'دليل رمز 1xBet',
      title: 'رمز 1xBet الترويجي: vipbtts',
      intro: 'أدخل vipbtts في خانة الرمز الترويجي لدى 1xBet. يتضمن العرض المعلن مكافأة إيداع بنسبة 300% واسترداداً نقدياً ومكافآت أسبوعية. تحقق من الأهلية والشروط الحالية لدى المشغّل.',
      offerHeadline: 'مكافأة إيداع 1xBet',
      offerSub: 'مكافأة إيداع عالمية 300% · استرداد نقدي · مكافآت أسبوعية.',
      benefits: ['الرمز الدقيق: vipbtts', 'مكافأة إيداع عالمية 300%', 'استرداد نقدي', 'مكافآت أسبوعية'],
      steps: [
        { n: '01', title: 'انسخ الرمز الدقيق', desc: 'انسخ vipbtts كما يظهر في هذه الصفحة.' },
        { n: '02', title: 'تحقق من شروط 1xBet', desc: 'يفتح الزر موقع المشغّل؛ راجع الشروط السارية هناك.' },
      ],
    },
  },
  linebet: {
    fr: {
      badge: 'GUIDE INTERNATIONAL LINEBET',
      title: 'Code promo Linebet : VISION221',
      intro: 'Saisissez VISION221 lors de votre inscription chez Linebet. L’offre annoncée comprend un bonus de dépôt de 300 %, du cashback et des bonus hebdomadaires. Vérifiez les conditions et la disponibilité auprès de Linebet.',
      offerHeadline: 'Offre Linebet dans le monde',
      offerSub: 'Code VISION221 · bonus de dépôt mondial de 300 % · cashback et bonus hebdomadaires.',
      benefits: ['Code Linebet : VISION221', 'Code communiqué pour une utilisation internationale', 'Bonus de dépôt mondial de 300 %', 'Cashback et bonus hebdomadaires'],
      steps: [
        { n: '01', title: 'Copier VISION221', desc: 'Le code promo Linebet VISION221 fonctionne dans le monde entier.' },
        { n: '02', title: 'Vérifier les règles locales', desc: 'Consultez Linebet pour les conditions et la disponibilité applicables dans votre pays.' },
      ],
    },
    en: {
      badge: 'INTERNATIONAL LINEBET GUIDE',
      title: 'Linebet promo code: VISION221',
      intro: 'Enter VISION221 when registering with Linebet. The advertised offer includes a 300% deposit bonus, cashback and weekly bonuses. Confirm availability and current terms with Linebet.',
      offerHeadline: 'Linebet offer',
      offerSub: 'VISION221 code · 300% worldwide deposit bonus · cashback and weekly bonuses.',
      benefits: ['Linebet code: VISION221', 'Code supplied for international use', '300% worldwide deposit bonus', 'Cashback and weekly bonuses'],
      steps: [
        { n: '01', title: 'Copy VISION221', desc: 'Use the VISION221 code and check the current offer terms directly with Linebet.' },
        { n: '02', title: 'Check local rules', desc: 'Ask Linebet about the terms and availability that apply in your country.' },
      ],
    },
    ar: {
      badge: 'دليل Linebet الدولي',
      title: 'رمز Linebet الترويجي: VISION221',
      intro: 'أدخل VISION221 عند التسجيل لدى Linebet. يتضمن العرض المعلن مكافأة إيداع بنسبة 300% واسترداداً نقدياً ومكافآت أسبوعية. تحقق من التوافر والشروط الحالية لدى Linebet.',
      offerHeadline: 'عرض Linebet حول العالم',
      offerSub: 'رمز VISION221 · مكافأة إيداع عالمية 300% · استرداد نقدي ومكافآت أسبوعية.',
      benefits: ['رمز Linebet: VISION221', 'رمز مخصص للاستخدام الدولي', 'مكافأة إيداع عالمية 300%', 'استرداد نقدي ومكافآت أسبوعية'],
      steps: [
        { n: '01', title: 'انسخ VISION221', desc: 'يعمل رمز Linebet VISION221 حول العالم.' },
        { n: '02', title: 'تحقق من القوانين المحلية', desc: 'اسأل Linebet عن الشروط والتوافر المطبقين في بلدك.' },
      ],
    },
  },
  melbet: {
    fr: {
      badge: 'GUIDE MELBET',
      title: 'Code promo Melbet : Bttswin',
      intro: 'Le code Melbet est Bttswin (B majuscule). L’offre annoncée comprend un bonus de dépôt de 300 %, du cashback et des bonus hebdomadaires. Consultez Melbet pour confirmer les conditions applicables.',
      offerHeadline: 'Melbet : bonus et cashback',
      offerSub: 'Bonus mondial de dépôt 300 % · cashback · bonus hebdomadaires.',
      benefits: ['Code exact : Bttswin', 'Bonus mondial de dépôt 300 %', 'Cashback', 'Bonus hebdomadaires'],
      steps: [
        { n: '01', title: 'Recopier le code Bttswin', desc: 'Le code fourni pour Melbet est Bttswin, avec un B initial majuscule.' },
        { n: '02', title: 'Lire les conditions Melbet', desc: 'Les modalités détaillées ne sont pas précisées ici ; vérifiez-les sur le site de l’opérateur.' },
      ],
    },
    en: {
      badge: 'MELBET GUIDE',
      title: 'Melbet promo code: Bttswin',
      intro: 'The Melbet code is Bttswin (capital B). The advertised offer includes a 300% deposit bonus, cashback and weekly bonuses. Check the applicable terms directly with Melbet.',
      offerHeadline: 'Melbet bonus and cashback',
      offerSub: '300% worldwide deposit bonus · cashback · weekly bonuses.',
      benefits: ['Exact code: Bttswin', '300% worldwide deposit bonus', 'Cashback', 'Weekly bonuses'],
      steps: [
        { n: '01', title: 'Copy the Bttswin code', desc: 'The code provided for Melbet is Bttswin, with an initial capital B.' },
        { n: '02', title: 'Read Melbet’s terms', desc: 'Detailed terms are not listed here; check them on the operator’s site.' },
      ],
    },
    ar: {
      badge: 'دليل Melbet',
      title: 'رمز Melbet الترويجي: Bttswin',
      intro: 'رمز Melbet هو Bttswin بحرف B كبير. يتضمن العرض المعلن مكافأة إيداع بنسبة 300% واسترداداً نقدياً ومكافآت أسبوعية. تحقق من الشروط المطبقة لدى Melbet.',
      offerHeadline: 'مكافأة Melbet والاسترداد النقدي',
      offerSub: 'مكافأة إيداع عالمية 300% · استرداد نقدي · مكافآت أسبوعية.',
      benefits: ['الرمز الدقيق: Bttswin', 'مكافأة إيداع عالمية 300%', 'استرداد نقدي', 'مكافآت أسبوعية'],
      steps: [
        { n: '01', title: 'انسخ رمز Bttswin', desc: 'الرمز المقدم لـ Melbet هو Bttswin بحرف B كبير في البداية.' },
        { n: '02', title: 'اقرأ شروط Melbet', desc: 'لم تُدرج الشروط التفصيلية هنا؛ راجعها على موقع المشغّل.' },
      ],
    },
  },
}

export default function LocalizedPromoClient({
  bookmaker,
  reviewDate: _reviewDate,
}: {
  bookmaker: BookmakerId
  reviewDate?: string
}) {
  const { lang } = useLanguage()
  const langKey = lang === 'en' || lang === 'ar' ? lang : 'fr'
  const info = INFO[bookmaker]
  const faq = getPromoFaq(bookmaker, langKey)

  if (bookmaker === '888starz') {
    return (
      <>
        <Navbar />
        <Star888PromoClient lang={langKey} showDownload variant="main" />
      </>
    )
  }

  const copy = LOCALIZED_COPY[bookmaker][langKey]
  const prefix = langKey === 'fr' ? '' : `/${langKey}`
  const crossLinks = CROSS.filter((c) => c.id !== bookmaker).map((c) => ({
    label: c.label[langKey],
    href: `${prefix}${c.href}`,
  }))

  return (
    <>
      <Navbar />
      <PromoLandingShell
        brand={info.brand}
        code={info.code}
        bookmakerId={bookmaker}
        accent={info.accent}
        logo={info.logo}
        logoBg={info.logoBg}
        signupUrl={info.signup}
        downloadUrl={info.download}
        lang={langKey}
        title={copy.title}
        badge={copy.badge}
        intro={copy.intro}
        offerHeadline={copy.offerHeadline}
        offerSub={copy.offerSub}
        benefits={copy.benefits}
        steps={copy.steps}
        faq={faq}
        crossLinks={crossLinks}
      />
    </>
  )
}
