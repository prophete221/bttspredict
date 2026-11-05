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
      badge: 'OFFRE 1XBET',
      title: 'Code promo 1xBet vipbtts : offre mondiale à 300 %',
      intro: 'Découvrez l’offre 1xBet de 300 %, annoncée dans le monde entier, avec le code vipbtts',
      offerHeadline: 'Offre mondiale à 300 %',
      offerSub: 'Plus de cashback et des bonus hebdomadaires.',
      benefits: ['Offre mondiale à 300 %', 'Plus de cashback et des bonus hebdomadaires', 'Code exact vipbtts', 'Lien 1xBet'],
      steps: [
        { n: '01', title: 'Consulter 1xBet', desc: 'Ouvrez 1xBet via le lien affiché sur cette page.' },
        { n: '02', title: 'Code promo', desc: 'Code exact : vipbtts' },
      ],
    },
    en: {
      badge: '1XBET OFFER',
      title: '1xBet Promo Code vipbtts for a 300% Worldwide Offer',
      intro: 'Explore 1xBet’s worldwide 300% offer and the exact code vipbtts',
      offerHeadline: '300% Worldwide Offer',
      offerSub: 'Extra cashback and weekly bonuses.',
      benefits: ['300% worldwide offer', 'Extra cashback and weekly bonuses', 'Exact code vipbtts', '1xBet link'],
      steps: [
        { n: '01', title: 'Visit 1xBet', desc: 'Follow the link shown on this page.' },
        { n: '02', title: 'Promo code', desc: 'Exact code: vipbtts' },
      ],
    },
    ar: {
      badge: 'عرض 1xBet',
      title: 'رمز 1xBet الترويجي vipbtts لعرض عالمي بنسبة 300%',
      intro: 'تعرّف على عرض 1xBet بنسبة 300% المعلن عالميًا، مع الرمز vipbtts',
      offerHeadline: 'عرض عالمي بنسبة 300%',
      offerSub: 'استرداد نقدي إضافي ومكافآت أسبوعية.',
      benefits: ['عرض عالمي بنسبة 300%', 'استرداد نقدي إضافي ومكافآت أسبوعية', 'الرمز الدقيق vipbtts', 'رابط 1xBet'],
      steps: [
        { n: '01', title: 'زيارة 1xBet', desc: 'استخدم الرابط الظاهر في هذه الصفحة.' },
        { n: '02', title: 'الرمز الترويجي', desc: 'الرمز الدقيق: vipbtts' },
      ],
    },
  },
  linebet: {
    fr: {
      badge: 'OFFRE LINEBET',
      title: 'Code promo Linebet Sénégal VISION221 : offre mondiale à 300 %',
      intro: 'Retrouvez le code exact VISION221 et les détails de l’offre mondiale de 300 % de Linebet.',
      offerHeadline: 'Offre mondiale à 300 %',
      offerSub: 'Plus de cashback et des bonus hebdomadaires.',
      benefits: ['Offre mondiale à 300 %', 'Plus de cashback et des bonus hebdomadaires', 'Code exact VISION221', 'Lien Linebet'],
      steps: [
        { n: '01', title: 'Consulter Linebet', desc: 'Ouvrez Linebet via le lien affiché sur cette page.' },
        { n: '02', title: 'Code promo', desc: 'Code exact : VISION221' },
      ],
    },
    en: {
      badge: 'LINEBET OFFER',
      title: 'Linebet Promo Code VISION221 for a 300% Worldwide Offer',
      intro: 'Explore Linebet’s worldwide 300% offer and the exact code VISION221',
      offerHeadline: '300% Worldwide Offer',
      offerSub: 'Extra cashback and weekly bonuses.',
      benefits: ['300% worldwide offer', 'Extra cashback and weekly bonuses', 'Exact code VISION221', 'Linebet link'],
      steps: [
        { n: '01', title: 'Visit Linebet', desc: 'Follow the link shown on this page.' },
        { n: '02', title: 'Promo code', desc: 'Exact code: VISION221' },
      ],
    },
    ar: {
      badge: 'عرض Linebet',
      title: 'رمز Linebet الترويجي VISION221 لعرض عالمي بنسبة 300%',
      intro: 'تعرّف على عرض Linebet بنسبة 300% المعلن عالميًا، مع الرمز VISION221',
      offerHeadline: 'عرض عالمي بنسبة 300%',
      offerSub: 'استرداد نقدي إضافي ومكافآت أسبوعية.',
      benefits: ['عرض عالمي بنسبة 300%', 'استرداد نقدي إضافي ومكافآت أسبوعية', 'الرمز الدقيق VISION221', 'رابط Linebet'],
      steps: [
        { n: '01', title: 'زيارة Linebet', desc: 'استخدم الرابط الظاهر في هذه الصفحة.' },
        { n: '02', title: 'الرمز الترويجي', desc: 'الرمز الدقيق: VISION221' },
      ],
    },
  },
  melbet: {
    fr: {
      badge: 'OFFRE MELBET',
      title: 'Code promo Melbet Bttswin : bonus mondial de 300 %',
      intro: 'Retrouvez le code exact Bttswin et les informations sur l’offre Melbet de 300 %, annoncée dans le monde entier.',
      offerHeadline: 'Bonus mondial de 300 %',
      offerSub: 'Plus de cashback et des bonus hebdomadaires.',
      benefits: ['Bonus mondial de 300 %', 'Plus de cashback et des bonus hebdomadaires', 'Code exact Bttswin', 'Lien Melbet'],
      steps: [
        { n: '01', title: 'Consulter Melbet', desc: 'Ouvrez Melbet via le lien affiché sur cette page.' },
        { n: '02', title: 'Code promo', desc: 'Code exact : Bttswin' },
      ],
    },
    en: {
      badge: 'MELBET OFFER',
      title: 'Melbet Promo Code Bttswin for a 300% Worldwide Offer',
      intro: 'Explore Melbet’s worldwide 300% offer and the exact code Bttswin',
      offerHeadline: '300% Worldwide Offer',
      offerSub: 'Extra cashback and weekly bonuses.',
      benefits: ['300% worldwide offer', 'Extra cashback and weekly bonuses', 'Exact code Bttswin', 'Melbet link'],
      steps: [
        { n: '01', title: 'Visit Melbet', desc: 'Follow the link shown on this page.' },
        { n: '02', title: 'Promo code', desc: 'Exact code: Bttswin' },
      ],
    },
    ar: {
      badge: 'عرض Melbet',
      title: 'رمز Melbet الترويجي Bttswin لعرض عالمي بنسبة 300%',
      intro: 'تعرّف على عرض Melbet بنسبة 300% المعلن عالميًا، مع الرمز Bttswin',
      offerHeadline: 'عرض عالمي بنسبة 300%',
      offerSub: 'استرداد نقدي إضافي ومكافآت أسبوعية.',
      benefits: ['عرض عالمي بنسبة 300%', 'استرداد نقدي إضافي ومكافآت أسبوعية', 'الرمز الدقيق Bttswin', 'رابط Melbet'],
      steps: [
        { n: '01', title: 'زيارة Melbet', desc: 'استخدم الرابط الظاهر في هذه الصفحة.' },
        { n: '02', title: 'الرمز الترويجي', desc: 'الرمز الدقيق: Bttswin' },
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
        <Star888PromoClient lang={langKey} showDownload />
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
