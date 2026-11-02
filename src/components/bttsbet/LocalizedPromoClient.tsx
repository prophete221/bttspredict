'use client'

// Garantie campagne: sans condition de mise / no wagering requirements

import { AFFILIATE } from '@/lib/constants'
import { useLanguage } from './LanguageSwitcher'
import PromoLandingShell from './PromoLandingShell'
import { getPromoFaq, type PromoBookmakerId } from '@/lib/promo-faq'

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
  { id: '1xbet', label: { fr: 'Code promo 1xBet', en: '1xBet promo code', ar: 'رمز 1xBet' }, href: '/code-promo-1xbet' },
  { id: 'linebet', label: { fr: 'Code promo Linebet', en: 'Linebet promo code', ar: 'رمز Linebet' }, href: '/code-promo-linebet-senegal' },
  { id: 'melbet', label: { fr: 'Code promo Melbet', en: 'Melbet promo code', ar: 'رمز Melbet' }, href: '/code-promo-melbet' },
  { id: '888starz', label: { fr: 'Bonus 888Starz', en: '888Starz bonus', ar: 'بونص 888Starz' }, href: '/bonus-888starz' },
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

  const copy =
    langKey === 'en'
      ? {
          badge: 'best promo code — 300% + 100 Free Spins',
          title: `${info.brand} promo code ${info.code}`,
          intro: `Use code ${info.code} when you register via our partner link to unlock the offer announced by ${info.brand}. Enter the code exactly as shown. Final terms are those displayed by the operator after sign-up.`,
          offerHeadline: '300% + 100 free spins',
          offerSub: 'As announced by the partner campaign — no wagering requirement per announcement. Always check operator terms. 18+.',
          benefits: ['300% bonus', '100 Free Spins', 'Exact code required', 'Android & iOS app', '18+ responsible'],
          steps: [
            { n: '01', title: 'Open our partner link', desc: `Use « Sign up on ${info.brand} » so the partner account is attributed correctly.` },
            { n: '02', title: `Enter ${info.code}`, desc: 'Type the code in the promo field before your first deposit — case sensitive.' },
            { n: '03', title: 'Read the terms', desc: 'Check eligibility, country and timing on the operator site before depositing.' },
            { n: '04', title: 'Deposit & activate', desc: 'Follow only the official instructions after registration. Download the APK if needed.' },
          ],
        }
      : langKey === 'ar'
        ? {
            badge: 'أفضل رمز — 300% + 100 لفة مجانية',
            title: `رمز ${info.brand} ${info.code}`,
            intro: `استخدم الرمز ${info.code} عند التسجيل عبر رابط الشريك لتفعيل العرض المعلن من ${info.brand}. أدخل الرمز بدقة. الشروط النهائية هي ما يعرضه المشغل بعد التسجيل.`,
            offerHeadline: '300% + 100 لفة مجانية',
            offerSub: 'حسب إعلان حملة الشريك — بدون شرط رهان وفق الإعلان. راجع شروط المشغل دائمًا. 18+.',
            benefits: ['بونص 300%', '100 لفة مجانية', 'رمز دقيق إلزامي', 'تطبيق Android و iOS', '18+ بمسؤولية'],
            steps: [
              { n: '01', title: 'افتح رابط الشريك', desc: `استخدم « سجّل على ${info.brand} » ليُحتسب الحساب الشريك.` },
              { n: '02', title: `أدخل ${info.code}`, desc: 'أدخل الرمز في خانة الترويج قبل أول إيداع — حساس لحالة الأحرف.' },
              { n: '03', title: 'اقرأ الشروط', desc: 'تحقق من الأهلية والبلد والتوقيت على موقع المشغل قبل الإيداع.' },
              { n: '04', title: 'أودع وفعّل', desc: 'اتبع التعليمات الرسمية فقط بعد التسجيل. حمّل APK عند الحاجة.' },
            ],
          }
        : {
            badge: 'Meilleur code promo — 300% + 100 Free Spins',
            title: `Code promo ${info.brand} ${info.code}`,
            intro: `Utilise le code ${info.code} à l’inscription via notre lien partenaire pour activer l’offre annoncée par ${info.brand}. Respecte la casse exacte.`,
            offerHeadline: '300% + 100 free spins',
            offerSub: 'Sans condition de mise selon l’annonce partenaire. Conditions affichées par l’opérateur. 18+.',
            benefits: ['Bonus 300%', '100 Free Spins', 'Code exact obligatoire', 'App Android & iOS', 'Jeu responsable 18+'],
            steps: [
              { n: '01', title: 'Ouvre le lien partenaire', desc: `Ouvre ${info.brand} avec notre lien partenaire pour que l’offre soit bien attribuée.` },
              { n: '02', title: `Entre le code ${info.code}`, desc: 'Saisis le code exact (casse sensible) dans le champ promo avant le premier dépôt.' },
              { n: '03', title: 'Vérifie les conditions', desc: 'Suis les conditions affichées par l’opérateur après inscription.' },
              { n: '04', title: 'Dépose et active', desc: 'Optionnel : installe l’APK officiel via le bouton de téléchargement.' },
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
  )
}
