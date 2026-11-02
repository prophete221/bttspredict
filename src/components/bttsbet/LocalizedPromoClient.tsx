'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from './LanguageSwitcher'
import { AFFILIATE } from '@/lib/constants'
import { trackAffiliateAction, trackAffiliateCodeCopy } from '@/lib/affiliateTracking'
import { copyTextToClipboard } from '@/lib/clipboard'

/* ──────────────────────────────────────────────────────────────
   Pages codes promo localisées (EN / AR) — 4 bookmakers partenaires.
   Casse EXACTE des codes (fournie par les affilieurs, ne pas modifier) :
   - Linebet  → VISION221 (majuscules)
   - 888Starz → btts221   (minuscules)
   - 1xbet    → Vipbtts   (casse mixte exacte)
   - Melbet   → Bttswin   (casse mixte exacte)
   Offre (campagne 2026-11) : les 4 partenaires annoncent 300% + 100
   free spins, sans condition de mise (Linebet/888Starz dès 1 € de dépôt).
   ────────────────────────────────────────────────────────────── */

type BookmakerId = 'linebet' | '888starz' | '1xbet' | 'melbet'

const BOOKMAKER_INFO: Record<BookmakerId, {
  brand: string
  code: string
  signup: string
  download: string
  logo: string
  logoWidth: number
  logoHeight: number
  logoBg: string
  /** Casse affichée à l'utilisateur */
  caseHint: { fr: string; en: string; ar: string }
  /** Offre par langue (headline + sous-titre + réponse FAQ bonus) */
  offer: Record<'fr' | 'en' | 'ar', { headline: string; sub: string; faqBonus: string; title: string }>
}> = {
  '1xbet': {
    brand: '1xbet',
    code: 'Vipbtts',
    signup: AFFILIATE.oneXbet,
    download: AFFILIATE.oneXbetDownload,
    logo: '/logos/1xbet-logo.png',
    logoWidth: 520,
    logoHeight: 296,
    logoBg: '#FFFFFF',
    caseHint: { fr: 'tel quel (casse exacte)', en: 'exactly as shown (exact case)', ar: 'كما هو تماماً (بنفس الأحرف)' },
    offer: {
      fr: {
        headline: '300% de bonus + 100 free spins',
        sub: 'Sans condition de mise · Offre annoncée par la campagne 1xbet',
        faqBonus: '300% de bonus et 100 free spins, sans condition de mise — offre annoncée par la campagne. Vérifie l\u2019offre affichée par 1xbet pour ton pays avant de déposer.',
        title: '300% + 100 spins',
      },
      en: {
        headline: '300% bonus + 100 free spins',
        sub: 'No wagering requirements · Offer announced by the 1xbet campaign',
        faqBonus: '300% bonus and 100 free spins, no wagering requirements — offer announced by the campaign. Check the offer shown by 1xbet for your country before depositing.',
        title: '300% + 100 spins',
      },
      ar: {
        headline: 'مكافأة 300% + 100 لفة مجانية',
        sub: 'بدون شروط مراهنة · عرض معلن من حملة 1xbet',
        faqBonus: 'مكافأة 300% و100 لفة مجانية، بدون شروط مراهنة — عرض معلن من الحملة. تحقق من العرض المعروض من 1xbet لبلدك قبل الإيداع.',
        title: '300% + 100 لفة مجانية',
      },
    },
  },
  linebet: {
    brand: 'Linebet',
    code: 'VISION221',
    signup: AFFILIATE.linebet,
    download: AFFILIATE.linebetDownload,
    logo: '/logos/linebet-logo.jpg',
    logoWidth: 560,
    logoHeight: 222,
    logoBg: '#FFFFFF',
    caseHint: { fr: 'en majuscules', en: 'in capitals', ar: 'بأحرف كبيرة' },
    offer: {
      fr: {
        headline: '300% de bonus + 100 free spins',
        sub: 'Sans condition de mise · Dès 1 € de dépôt · Offre annoncée par la campagne Linebet',
        faqBonus: '300% de bonus et 100 free spins, sans condition de mise, dès 1 € de dépôt — offre annoncée par la campagne. Vérifie l\u2019offre affichée par Linebet pour ton pays avant de déposer.',
        title: '300% + 100 spins',
      },
      en: {
        headline: '300% bonus + 100 free spins',
        sub: 'No wagering requirements · From €1 deposit · Offer announced by the Linebet campaign',
        faqBonus: '300% bonus and 100 free spins, no wagering requirements, from a €1 deposit — offer announced by the campaign. Check the offer shown by Linebet for your country before depositing.',
        title: '300% + 100 spins',
      },
      ar: {
        headline: 'مكافأة 300% + 100 لفة مجانية',
        sub: 'بدون شروط مراهنة · إيداع من 1 يورو · عرض معلن من حملة Linebet',
        faqBonus: 'مكافأة 300% و100 لفة مجانية، بدون شروط مراهنة، بدءاً من إيداع 1 يورو — عرض معلن من الحملة. تحقق من العرض المعروض من Linebet لبلدك قبل الإيداع.',
        title: '300% + 100 لفة مجانية',
      },
    },
  },
  melbet: {
    brand: 'Melbet',
    code: 'Bttswin',
    signup: AFFILIATE.melbet,
    download: AFFILIATE.melbetDownload,
    logo: '/logos/melbet-logo.jpg',
    logoWidth: 560,
    logoHeight: 143,
    logoBg: '#1B1E27',
    caseHint: { fr: 'tel quel (casse exacte)', en: 'exactly as shown (exact case)', ar: 'كما هو تماماً (بنفس الأحرف)' },
    offer: {
      fr: {
        headline: '300% de bonus + 100 free spins',
        sub: 'Sans condition de mise · Offre annoncée par la campagne Melbet',
        faqBonus: '300% de bonus et 100 free spins, sans condition de mise — offre annoncée par la campagne Melbet. Vérifie l\u2019offre affichée par Melbet pour ton pays avant de déposer.',
        title: '300% + 100 spins',
      },
      en: {
        headline: '300% bonus + 100 free spins',
        sub: 'No wagering requirements · Offer announced by the Melbet campaign',
        faqBonus: '300% bonus and 100 free spins, no wagering requirements — offer announced by the Melbet campaign. Check the offer shown by Melbet for your country before depositing.',
        title: '300% + 100 spins',
      },
      ar: {
        headline: 'مكافأة 300% + 100 لفة مجانية',
        sub: 'بدون شروط مراهنة · عرض معلن من حملة Melbet',
        faqBonus: 'مكافأة 300% و100 لفة مجانية، بدون شروط مراهنة — عرض معلن من حملة Melbet. تحقق من العرض المعروض من Melbet لبلدك قبل الإيداع.',
        title: '300% + 100 لفة مجانية',
      },
    },
  },
  '888starz': {
    brand: '888Starz',
    code: 'btts221',
    signup: AFFILIATE.star888,
    download: AFFILIATE.star888Download,
    logo: '/logos/888starz-logo.jpg',
    logoWidth: 520,
    logoHeight: 455,
    logoBg: '#0A0A0C',
    caseHint: { fr: 'en minuscules', en: 'in lowercase', ar: 'بأحرف صغيرة' },
    offer: {
      fr: {
        headline: '300% de bonus + 100 free spins',
        sub: 'Sans condition de mise · Dès 1 € de dépôt · Offre annoncée par la campagne 888Starz',
        faqBonus: '300% de bonus et 100 free spins, sans condition de mise, dès 1 € de dépôt — offre annoncée par la campagne. Vérifie l\u2019offre affichée par 888Starz pour ton pays avant de déposer.',
        title: '300% + 100 spins',
      },
      en: {
        headline: '300% bonus + 100 free spins',
        sub: 'No wagering requirements · From €1 deposit · Offer announced by the 888Starz campaign',
        faqBonus: '300% bonus and 100 free spins, no wagering requirements, from a €1 deposit — offer announced by the campaign. Check the offer shown by 888Starz for your country before depositing.',
        title: '300% + 100 spins',
      },
      ar: {
        headline: 'مكافأة 300% + 100 لفة مجانية',
        sub: 'بدون شروط مراهنة · إيداع من 1 يورو · عرض معلن من حملة 888Starz',
        faqBonus: 'مكافأة 300% و100 لفة مجانية، بدون شروط مراهنة، بدءاً من إيداع 1 يورو — عرض معلن من الحملة. تحقق من العرض المعروض من 888Starz لبلدك قبل الإيداع.',
        title: '300% + 100 لفة مجانية',
      },
    },
  },
}

/* Liens croisés — chaque page promo locale renvoie vers les autres partenaires
   (1xbet et Linebet en tête, conformément à la priorité d'affiliation). */
const CROSS_LINKS: { href: string; label: { fr: string; en: string; ar: string } }[] = [
  { href: '/code-promo-1xbet', label: { fr: 'Code promo 1xbet', en: '1xbet promo code', ar: 'رمز 1xbet الترويجي' } },
  { href: '/code-promo-linebet-senegal', label: { fr: 'Code promo Linebet', en: 'Linebet promo code', ar: 'رمز Linebet الترويجي' } },
  { href: '/code-promo-melbet', label: { fr: 'Code promo Melbet', en: 'Melbet promo code', ar: 'رمز Melbet الترويجي' } },
  { href: '/bonus-888starz', label: { fr: 'Code promo 888Starz', en: '888Starz promo code', ar: 'رمز 888Starz الترويجي' } },
]

export default function LocalizedPromoClient({ bookmaker, reviewDate }: { bookmaker: BookmakerId; reviewDate?: string }) {
  const effectiveReviewDate = reviewDate || new Date().toISOString().slice(0, 10)
  const { lang } = useLanguage()
  const langKey = (lang === 'en' || lang === 'ar' ? lang : 'fr') as 'fr' | 'en' | 'ar'
  const info = BOOKMAKER_INFO[bookmaker]
  const code = info.code
  const brand = info.brand
  const offer = info.offer[langKey]
  const caseHint = info.caseHint[langKey]
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)

  /* Mesure : 1 vue de page promo par session (dédupliquée côté tracking) */
  useEffect(() => {
    trackAffiliateAction(bookmaker, 'promo_view', `localized-${bookmaker}-page`)
  }, [bookmaker])

  const year = effectiveReviewDate.slice(0, 4)
  const copy = langKey === 'fr'
    ? {
        badge: '🏆 Meilleur code promo — 300% + 100 Free Spins',
        title: `Code promo ${brand} ${year} : ${offer.title}`,
        intro: `Inscris-toi sur ${brand} avec le code ${code} : ${offer.headline.toLowerCase()}.`,
        codeLabel: 'Code promo',
        codeHint: `À saisir exactement ${caseHint}`,
        signup: `S’inscrire sur ${brand}`,
        download: 'Télécharger l’app',
        steps: 'Comment utiliser le code',
        one: `Copie le code ${code} puis ouvre le lien d’inscription officiel ${brand}.`,
        two: `Colle ${code} dans le champ « Code promo » pendant l’inscription (ou dans ton compte).`,
        three: `Dépose : le bonus est crédité selon l’offre affichée par ${brand}.`,
        copied: 'Code copié — colle-le lors de l’inscription',
        copyFailed: 'Copie impossible — sélectionne le code et copie-le manuellement',
        conditions: 'Offre annoncée par la campagne partenaire. Vérifie les conditions affichées par l’opérateur avant tout dépôt.',
        verified: 'Guide vérifié le',
        responsible: 'Jouer responsable',
        faqTitle: `Questions fréquentes sur ${brand}`,
        faqCode: `Quel est le code promo ${brand} ?`,
        faqCodeAnswer: `Le code est ${code} — à saisir exactement ${caseHint} pendant l’inscription ou dans la section « Code promo » de ton compte.`,
        faqBonus: `Qu’est-ce que je reçois avec ${code} ?`,
        faqCountry: 'Le code fonctionne-t-il dans tous les pays ?',
        faqCountryAnswer: 'La disponibilité dépend du pays, du compte et de la période. Vérifie ton éligibilité avant tout dépôt.',
        others: 'Autres partenaires officiels',
      }
    : langKey === 'en'
      ? {
          badge: '🏆 The best promo code — 300% + 100 Free Spins',
          title: `${brand} promo code ${year}: ${offer.title}`,
          intro: `Sign up on ${brand} with code ${code}: ${offer.headline.toLowerCase()}.`,
          codeLabel: 'Promo code',
          codeHint: `Enter exactly ${caseHint}`,
          signup: `Sign up on ${brand}`,
          download: 'Download the app',
          steps: 'How to use the code',
          one: `Copy code ${code} then open the official ${brand} sign-up link.`,
          two: `Paste ${code} in the “Promo code” field during sign-up (or in your account).`,
          three: `Deposit: the bonus is credited per the offer shown by ${brand}.`,
          copied: 'Code copied — paste it at sign-up',
          copyFailed: 'Copy failed — select the code and copy it manually',
          conditions: 'Offer announced by the partner campaign. Check the terms shown by the operator before any deposit.',
          verified: 'Guide checked on',
          responsible: 'Play responsibly',
          faqTitle: `Frequently asked questions about ${brand}`,
          faqCode: `What is the ${brand} promo code?`,
          faqCodeAnswer: `The code is ${code} — enter it exactly ${caseHint} during sign-up or in the “Promo code” section of your account.`,
          faqBonus: `What do I get with ${code}?`,
          faqCountry: 'Does the code work in every country?',
          faqCountryAnswer: 'Availability depends on country, account and period. Check your eligibility before making a deposit.',
          others: 'Other official partners',
        }
      : {
          badge: '🏆 أفضل رمز ترويجي — 300% + 100 لفة مجانية',
          title: `رمز ${brand} الترويجي ${year}: ${offer.title}`,
          intro: `سجّل في ${brand} بالرمز ${code}: ${offer.headline}.`,
          codeLabel: 'الرمز الترويجي',
          codeHint: `أدخله تماماً ${caseHint}`,
          signup: `التسجيل في ${brand}`,
          download: 'تحميل التطبيق',
          steps: 'كيفية استخدام الرمز',
          one: `انسخ الرمز ${code} ثم افتح رابط التسجيل الرسمي لـ ${brand}.`,
          two: `الصق ${code} في خانة «الرمز الترويجي» أثناء التسجيل (أو في حسابك).`,
          three: `أودع: تُضاف المكافأة وفق العرض المعروض من ${brand}.`,
          copied: 'تم نسخ الرمز — الصقه أثناء التسجيل',
          copyFailed: 'تعذّر النسخ — حدد الرمز وانسخه يدوياً',
          conditions: 'عرض معلن من الحملة الشريكة. تحقق من الشروط المعروضة من المشغل قبل أي إيداع.',
          verified: 'تم التحقق من الدليل في',
          responsible: 'العب بمسؤولية',
          faqTitle: `الأسئلة الشائعة حول ${brand}`,
          faqCode: `ما هو رمز ${brand} الترويجي؟`,
          faqCodeAnswer: `الرمز هو ${code} — أدخله تماماً ${caseHint} أثناء التسجيل أو في قسم «الرمز الترويجي» في حسابك.`,
          faqBonus: `ماذا أحصل عليه مع ${code}؟`,
          faqCountry: 'هل يعمل الرمز في جميع البلدان؟',
          faqCountryAnswer: 'تعتمد الإتاحة على البلد والحساب والفترة. تحقق من أهليتك قبل أي إيداع.',
          others: 'شركاء رسميون آخرون',
        }

  const handleCopy = async () => {
    const ok = await copyTextToClipboard(code)
    if (ok) {
      // Mesure : on ne compte une copie QUE si elle a réellement réussi
      trackAffiliateCodeCopy(bookmaker, `localized-${bookmaker}`)
      setCopied(true)
      setCopyFailed(false)
      window.setTimeout(() => setCopied(false), 2500)
    } else {
      setCopyFailed(true)
      setCopied(false)
      window.setTimeout(() => setCopyFailed(false), 4000)
    }
  }

  const track = (event: 'signup_cta_click' | 'download_click') => trackAffiliateAction(bookmaker, event, `localized-${bookmaker}`)
  const reviewDateLabel = new Intl.DateTimeFormat(langKey === 'ar' ? 'ar' : langKey === 'en' ? 'en-GB' : 'fr-FR', { dateStyle: 'long', timeZone: 'Africa/Dakar' }).format(new Date(`${effectiveReviewDate}T12:00:00Z`))

  return (
    <div className="min-h-screen bg-[#0B0F14] flex flex-col text-[#F2F6FA]">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-[#9DABBB] mb-8">
          <a href="/">BTTSPredict</a> <span aria-hidden="true">/</span> <span>{brand}</span>
        </nav>
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[#2F7DFF]">{brand}</p>
          <p className="text-xs font-bold mt-2" style={{ color: '#FFD65E' }}>{copy.badge}</p>
          <h1 className="text-4xl font-black mt-3" style={{ fontFamily: 'Poppins, sans-serif' }}>{copy.title}</h1>
          {/* Vrai logo officiel du bookmaker */}
          <div className="mx-auto mt-5 flex min-h-16 max-w-[280px] items-center justify-center rounded-xl px-4 py-2 shadow-lg sm:max-w-[340px]" style={{ backgroundColor: info.logoBg }}>
            <img src={info.logo} alt={`Logo officiel ${brand}`} className="max-h-14 w-auto object-contain rounded-lg" width={info.logoWidth} height={info.logoHeight} loading="eager" />
          </div>
          <p className="text-sm text-[#9DABBB] mt-4">{copy.intro}</p>
          <p className="text-xs text-[#9DABBB] mt-3">{copy.verified} <time dateTime={effectiveReviewDate}>{reviewDateLabel}</time>
 · 18+</p>
        </div>

        {/* Encart offre — l'avantage est visible avant tout geste */}
        <section className="rounded-2xl p-5 mb-4 text-center" style={{ backgroundColor: '#101a26', border: '1px solid #2F7DFF55' }} aria-label={offer.headline}>
          <p className="text-lg sm:text-xl font-black" style={{ color: '#2F7DFF' }}>{offer.headline}</p>
          <p className="text-xs text-[#9DABBB] mt-2">{offer.sub}</p>
        </section>

        <section className="rounded-2xl p-6 bg-[#141C25] border border-[#6B7A8C] text-center" aria-labelledby="localized-code-title">
          <p id="localized-code-title" className="text-xs uppercase tracking-widest text-[#9DABBB]">{copy.codeLabel}</p>
          <button onClick={handleCopy} className="mt-3 px-6 py-3 rounded-xl text-xl font-black tracking-widest" style={{ backgroundColor: '#2F7DFF', color: '#FFFFFF' }} aria-label={`${code} — copy`}>{code}</button>
          {copied && <p className="text-xs text-[#34D399] mt-2" role="status" aria-live="polite">{copy.copied}</p>}
          {copyFailed && <p className="text-xs text-[#F87171] mt-2" role="alert">{copy.copyFailed} ({code})</p>}
          {!copied && !copyFailed && <p className="text-xs text-[#9DABBB] mt-2">{copy.codeHint}</p>}
          <div className="grid gap-3 mt-6">
            <a href={info.signup} target="_blank" rel="noopener noreferrer nofollow sponsored" onClick={() => track('signup_cta_click')} className="rounded-xl py-3 font-bold" style={{ backgroundColor: '#2F7DFF', color: '#FFFFFF' }}>{copy.signup}</a>
            <a href={info.download} target="_blank" rel="noopener noreferrer nofollow sponsored" onClick={() => track('download_click')} className="rounded-xl py-3 font-bold border border-[#6B7A8C] text-[#F2F6FA]">{copy.download}</a>
          </div>
          <p className="text-xs text-[#9DABBB] mt-4">{copy.conditions}</p>
        </section>

        <section className="mt-8 rounded-2xl p-6 bg-[#141C25] border border-[#6B7A8C]" aria-labelledby="localized-steps-title">
          <h2 id="localized-steps-title" className="text-xl font-bold mb-4">{copy.steps}</h2>
          <ol className="space-y-3 text-sm text-[#9DABBB] list-decimal list-inside">
            <li>{copy.one}</li>
            <li>{copy.two}</li>
            <li>{copy.three}</li>
          </ol>
        </section>

        <section className="mt-8 rounded-2xl p-6 bg-[#141C25] border border-[#6B7A8C]" aria-labelledby="localized-faq-title">
          <h2 id="localized-faq-title" className="text-xl font-bold mb-4">{copy.faqTitle}</h2>
          <details className="border-b border-[#6B7A8C] py-3">
            <summary className="cursor-pointer font-bold">{copy.faqCode}</summary>
            <p className="text-sm text-[#9DABBB] mt-2">{copy.faqCodeAnswer}</p>
          </details>
          <details className="border-b border-[#6B7A8C] py-3">
            <summary className="cursor-pointer font-bold">{copy.faqBonus}</summary>
            <p className="text-sm text-[#9DABBB] mt-2">{offer.faqBonus}</p>
          </details>
          <details className="py-3">
            <summary className="cursor-pointer font-bold">{copy.faqCountry}</summary>
            <p className="text-sm text-[#9DABBB] mt-2">{copy.faqCountryAnswer}</p>
          </details>
        </section>

        {/* Liens croisés — les autres partenaires (1xbet & Linebet en tête) */}
        <section className="mt-8 rounded-2xl p-6 bg-[#141C25] border border-[#6B7A8C]" aria-labelledby="localized-cross-title">
          <h2 id="localized-cross-title" className="text-lg font-bold mb-4">{copy.others}</h2>
          <div className="flex flex-wrap gap-2">
            {CROSS_LINKS.filter((l) => l.href !== `/${bookmaker === 'linebet' ? 'code-promo-linebet-senegal' : bookmaker === '1xbet' ? 'code-promo-1xbet' : bookmaker === 'melbet' ? 'code-promo-melbet' : 'bonus-888starz'}`).map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg font-semibold text-sm transition-all"
                style={{ backgroundColor: 'rgba(47, 125, 255, 0.08)', color: '#F2F6FA', border: '1px solid rgba(47, 125, 255, 0.2)' }}
              >
                {l.label[langKey]} →
              </a>
            ))}
          </div>
        </section>

        <p className="text-center text-xs text-[#9DABBB] mt-8">18+ · {copy.responsible} · Aucun résultat futur n’est garanti.</p>
      </main>
    </div>
  )
}
