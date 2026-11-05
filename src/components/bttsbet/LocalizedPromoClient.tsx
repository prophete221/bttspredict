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

  const copy =
    langKey === 'en'
      ? {
          badge: `${info.brand.toUpperCase()} OFFER`,
          title: `Best ${info.brand} promo code · more cashback & weekly bonuses`,
          intro: `${info.brand}: 300% worldwide, with more cashback and weekly bonuses. Exact code: ${info.code}`,
          offerHeadline: '300% worldwide',
          offerSub: 'More cashback and weekly bonuses.',
          benefits: ['300% worldwide', 'More cashback and weekly bonuses', `Exact code: ${info.code}`, `${info.brand} link`],
          steps: [
            { n: '01', title: `Open ${info.brand}`, desc: 'Use the link shown on this page.' },
            { n: '02', title: 'Promo code', desc: `Exact code: ${info.code}` },
          ],
        }
      : langKey === 'ar'
        ? {
            badge: `عرض ${info.brand}`,
            title: `أفضل رمز ترويجي لـ ${info.brand} · استرداد نقدي أكبر ومكافآت أسبوعية`,
            intro: `${info.brand}: مكافأة 300% حول العالم، مع استرداد نقدي أكبر ومكافآت أسبوعية. الرمز الدقيق: ${info.code}`,
            offerHeadline: '300% حول العالم',
            offerSub: 'استرداد نقدي أكبر ومكافآت أسبوعية.',
            benefits: ['300% حول العالم', 'استرداد نقدي أكبر ومكافآت أسبوعية', `الرمز الدقيق: ${info.code}`, `رابط ${info.brand}`],
            steps: [
              { n: '01', title: `افتح ${info.brand}`, desc: 'استخدم الرابط الظاهر في هذه الصفحة.' },
              { n: '02', title: 'الرمز الترويجي', desc: `الرمز الدقيق: ${info.code}` },
            ],
          }
        : {
            badge: `OFFRE ${info.brand.toUpperCase()}`,
            title: `Meilleur code promo ${info.brand} · plus de cashback et bonus hebdomadaires`,
            intro: `${info.brand} : bonus 300 % worldwide, davantage de cashback et des bonus hebdomadaires. Code exact : ${info.code}`,
            offerHeadline: '300 % worldwide',
            offerSub: 'Davantage de cashback et des bonus hebdomadaires.',
            benefits: ['300 % worldwide', 'Plus de cashback et bonus hebdomadaires', `Code exact : ${info.code}`, `Lien ${info.brand}`],
            steps: [
              { n: '01', title: `Ouvre ${info.brand}`, desc: 'Utilise le lien affiché sur cette page.' },
              { n: '02', title: 'Code promo', desc: `Code exact : ${info.code}` },
            ],
          }

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
