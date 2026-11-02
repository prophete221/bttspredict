'use client'

import { AFFILIATE } from '@/lib/constants'
import { useLanguage } from './LanguageSwitcher'
import PromoLandingShell from './PromoLandingShell'

type BookmakerId = 'linebet' | '888starz' | '1xbet' | 'melbet'

const INFO: Record<BookmakerId, {
  brand: string
  code: string
  signup: string
  download: string
  logo: string
  logoBg: string
  accent: string
  path: string
}> = {
  '1xbet': {
    brand: '1xBet',
    code: 'Vipbtts',
    signup: AFFILIATE.oneXbet,
    download: AFFILIATE.oneXbetDownload,
    logo: '/logos/1xbet-logo.png',
    logoBg: '#1a237e',
    accent: '#1B6EF3',
    path: '/code-promo-1xbet',
  },
  linebet: {
    brand: 'Linebet',
    code: 'VISION221',
    signup: AFFILIATE.linebet,
    download: AFFILIATE.linebetDownload,
    logo: '/logos/linebet-logo.jpg',
    logoBg: '#0d1b2a',
    accent: '#2F7DFF',
    path: '/code-promo-linebet-senegal',
  },
  melbet: {
    brand: 'Melbet',
    code: 'Bttswin',
    signup: AFFILIATE.melbet,
    download: AFFILIATE.melbetDownload,
    logo: '/logos/melbet-logo.jpg',
    logoBg: '#1b1b1b',
    accent: '#F59E0B',
    path: '/code-promo-melbet',
  },
  '888starz': {
    brand: '888Starz',
    code: 'btts221',
    signup: AFFILIATE.star888,
    download: AFFILIATE.star888Download,
    logo: '/logos/888starz-logo.png',
    logoBg: '#1a0a0f',
    accent: '#FF4D6D',
    path: '/bonus-888starz',
  },
}

const CROSS: { id: BookmakerId; label: Record<'fr' | 'en' | 'ar', string>; href: string }[] = [
  { id: '1xbet', label: { fr: 'Code promo 1xBet', en: '1xBet promo code', ar: 'رمز 1xBet' }, href: '/code-promo-1xbet' },
  { id: 'linebet', label: { fr: 'Code promo Linebet', en: 'Linebet promo code', ar: 'رمز Linebet' }, href: '/code-promo-linebet-senegal' },
  { id: 'melbet', label: { fr: 'Code promo Melbet', en: 'Melbet promo code', ar: 'رمز Melbet' }, href: '/code-promo-melbet' },
  { id: '888starz', label: { fr: 'Bonus 888Starz', en: '888Starz bonus', ar: 'بونص 888Starz' }, href: '/bonus-888starz' },
]

export default function LocalizedPromoClient({ bookmaker }: { bookmaker: BookmakerId }) {
  const { lang } = useLanguage()
  const langKey = lang === 'en' || lang === 'ar' ? lang : 'fr'
  const info = INFO[bookmaker]

  const copy = langKey === 'en' ? {
    badge: 'Best promo code — 300% + 100 Free Spins',
    title: `${info.brand} promo code ${info.code}`,
    intro: `Use code ${info.code} when you register via our link to unlock the welcome offer announced by ${info.brand}. Enter the code exactly as shown.`,
    offerHeadline: '300% + 100 free spins',
    offerSub: 'No wagering requirement as announced. Terms shown by the operator apply. 18+.',
    benefits: ['300% bonus', '100 Free Spins', 'No wagering', 'Android & iOS app', 'International'],
    steps: [
      { n: '01', title: 'Register via our link', desc: `Open ${info.brand} with our partner link so the promo is attributed correctly.` },
      { n: '02', title: `Enter code ${info.code}`, desc: 'Type the code exactly (case sensitive) in the promo field before your first deposit.' },
      { n: '03', title: 'Deposit & claim', desc: 'Follow the offer terms displayed by the operator after registration.' },
      { n: '04', title: 'Download the app', desc: 'Optional: install the official APK via our download button for mobile play.' },
    ],
    faq: [
      { q: `What is the ${info.brand} promo code?`, a: `The promo code is ${info.code}. Enter it exactly as written.` },
      { q: 'What is the bonus?', a: '300% + 100 free spins as announced for this partner campaign, subject to operator terms.' },
      { q: 'Is it available in my country?', a: `${info.brand} availability depends on local regulations. Always check the operator site.` },
    ],
  } : langKey === 'ar' ? {
    badge: 'أفضل رمز — 300% + 100 لفة مجانية',
    title: `رمز ${info.brand} ${info.code}`,
    intro: `استخدم الرمز ${info.code} عند التسجيل عبر رابطنا لتفعيل عرض الترحيب. أدخل الرمز بدقة كما هو ظاهر.`,
    offerHeadline: '300% + 100 لفة مجانية',
    offerSub: 'بدون شرط رهان كما هو معلن. تطبق شروط المشغل. 18+.',
    benefits: ['بونص 300%', '100 لفة مجانية', 'بدون شرط رهان', 'تطبيق Android و iOS', 'دولي'],
    steps: [
      { n: '01', title: 'سجّل عبر رابطنا', desc: `افتح ${info.brand} عبر رابط الشريك ليُحتسب العرض.` },
      { n: '02', title: `أدخل الرمز ${info.code}`, desc: 'أدخل الرمز بدقة في خانة الرمز قبل أول إيداع.' },
      { n: '03', title: 'أودع واستفد', desc: 'اتبع شروط العرض المعروضة من المشغل بعد التسجيل.' },
      { n: '04', title: 'حمّل التطبيق', desc: 'اختياري: ثبّت APK الرسمي عبر زر التحميل.' },
    ],
    faq: [
      { q: `ما هو رمز ${info.brand}؟`, a: `الرمز هو ${info.code}. أدخله كما هو مكتوب.` },
      { q: 'ما هو البونص؟', a: '300% + 100 لفة مجانية حسب الحملة، وفق شروط المشغل.' },
      { q: 'هل هو متاح في بلدي؟', a: `توافر ${info.brand} يعتمد على القوانين المحلية.` },
    ],
  } : {
    badge: 'Meilleur code promo — 300% + 100 Free Spins',
    title: `Code promo ${info.brand} ${info.code}`,
    intro: `Utilise le code ${info.code} à l’inscription via notre lien pour activer l’offre annoncée par ${info.brand}. Respecte la casse exacte.`,
    offerHeadline: '300% + 100 free spins',
    offerSub: 'Sans condition de mise selon l’annonce partenaire. Conditions affichées par l’opérateur. 18+.',
    benefits: ['Bonus 300%', '100 Free Spins', 'Sans condition de mise', 'App Android & iOS', 'International'],
    steps: [
      { n: '01', title: 'Inscris-toi via notre lien', desc: `Ouvre ${info.brand} avec notre lien partenaire pour que l’offre soit bien attribuée.` },
      { n: '02', title: `Entre le code ${info.code}`, desc: 'Saisis le code exact (casse sensible) dans le champ promo avant le premier dépôt.' },
      { n: '03', title: 'Dépose et active', desc: 'Suis les conditions affichées par l’opérateur après inscription.' },
      { n: '04', title: 'Télécharge l’app', desc: 'Optionnel : installe l’APK officiel via le bouton de téléchargement.' },
    ],
    faq: [
      { q: `Quel est le code promo ${info.brand} ?`, a: `Le code est ${info.code}. Saisis-le exactement comme indiqué.` },
      { q: 'Quelle est l’offre ?', a: '300% + 100 free spins selon la campagne partenaire, sous conditions opérateur.' },
      { q: 'Disponible dans mon pays ?', a: `La disponibilité de ${info.brand} dépend de la réglementation locale.` },
    ],
  }

  const prefix = langKey === 'fr' ? '' : `/${langKey}`
  const crossLinks = CROSS.filter((c) => c.id !== bookmaker).map((c) => ({
    label: c.label[langKey],
    href: `${prefix}${c.href}`,
  }))

  return (
    <PromoLandingShell
      brand={info.brand}
      code={info.code}
      bookmakerId={bookmaker === '888starz' ? '888starz' : bookmaker}
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
      faq={copy.faq}
      crossLinks={crossLinks}
    />
  )
}
