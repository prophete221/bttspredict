'use client'

import Image from 'next/image'
import { useState } from 'react'
import { AFFILIATE, BOOKMAKERS } from '@/lib/constants'
import { trackAffiliateAction, trackAffiliateCodeCopy } from '@/lib/affiliateTracking'
import { copyTextToClipboard } from '@/lib/clipboard'
import { getPromoFaq } from '@/lib/promo-faq'

type Lang = 'fr' | 'en' | 'ar'

const CODE = 'btts221'
const LOGO = BOOKMAKERS.find((item) => item.id === '888starz')?.logoFull ?? '/logos/888starz-logo.jpg'

const COPY: Record<Lang, {
  dir: 'ltr' | 'rtl'
  badge: string
  title: string
  positioning: string
  offer: string
  highlights: string[]
  guideTitle: string
  steps: { title: string; body: string }[]
  codeLabel: string
  copy: string
  copied: string
  copyFailed: string
  visit: string
  download: string
  disclosure: string
  affiliateDisclosure: string
  responsible: string
  faqTitle: string
}> = {
  fr: {
    dir: 'ltr',
    badge: 'OFFRE 888STARZ',
    title: 'Code promo 888Starz : btts221',
    positioning: 'Le code 888Starz est btts221. L’offre annoncée comprend un bonus de dépôt de 300 %, du cashback et des bonus hebdomadaires. Vérifiez les conditions et votre éligibilité directement auprès de 888Starz.',
    offer: 'Bonus de dépôt mondial 300 %',
    highlights: ['Cashback', 'Bonus hebdomadaires', 'Code exact : btts221'],
    guideTitle: 'Utiliser le code',
    steps: [
      { title: 'Copier le code', body: 'Recopiez btts221 tel qu’il apparaît sur cette page.' },
      { title: 'Vérifier les modalités', body: 'Consultez les conditions en vigueur directement auprès de 888Starz.' },
    ],
    codeLabel: 'Code promo',
    copy: 'Copier le code',
    copied: 'Code copié',
    copyFailed: 'Copie indisponible. Sélectionnez le code pour le copier.',
    visit: 'Consulter 888Starz',
    download: 'Télécharger l’APK',
    disclosure: '18+',
    affiliateDisclosure: 'Les liens vers 888Starz sont affiliés ; BTTSPredict peut percevoir une commission si vous les utilisez.',
    responsible: 'Jouer responsable',
    faqTitle: 'Questions fréquentes',
  },
  en: {
    dir: 'ltr',
    badge: '888STARZ OFFER',
    title: '888Starz promo code: btts221',
    positioning: 'The 888Starz code is btts221. The advertised offer includes a 300% deposit bonus, cashback and weekly bonuses. Confirm eligibility and current terms with 888Starz.',
    offer: '300% Worldwide Deposit Bonus',
    highlights: ['Cashback', 'Weekly bonuses', 'Exact code: btts221'],
    guideTitle: 'Using the code',
    steps: [
      { title: 'Copy the code', body: 'Copy btts221 exactly as shown on this page.' },
      { title: 'Check the terms', body: 'Review the current terms directly with 888Starz.' },
    ],
    codeLabel: 'Promo code',
    copy: 'Copy code',
    copied: 'Code copied',
    copyFailed: 'Copy unavailable. Select the code to copy it.',
    visit: 'Visit 888Starz',
    download: 'Download APK',
    disclosure: '18+',
    affiliateDisclosure: 'Links to 888Starz are affiliate links; BTTSPredict may receive a commission if you use them.',
    responsible: 'Play responsibly',
    faqTitle: 'Frequently asked questions',
  },
  ar: {
    dir: 'rtl',
    badge: 'عرض 888Starz',
    title: 'رمز 888Starz الترويجي: btts221',
    positioning: 'رمز 888Starz هو btts221. يتضمن العرض المعلن مكافأة إيداع بنسبة 300% واسترداداً نقدياً ومكافآت أسبوعية. تحقق من الأهلية والشروط الحالية لدى 888Starz.',
    offer: 'مكافأة إيداع عالمية 300%',
    highlights: ['استرداد نقدي', 'مكافآت أسبوعية', 'الرمز الدقيق: btts221'],
    guideTitle: 'استخدام الرمز',
    steps: [
      { title: 'انسخ الرمز', body: 'انسخ btts221 كما يظهر في هذه الصفحة.' },
      { title: 'تحقق من الشروط', body: 'راجع الشروط الحالية مباشرة لدى 888Starz.' },
    ],
    codeLabel: 'الرمز الترويجي',
    copy: 'نسخ الرمز',
    copied: 'تم نسخ الرمز',
    copyFailed: 'تعذر النسخ. حدّد الرمز لنسخه.',
    visit: 'زيارة 888Starz',
    download: 'تحميل APK',
    disclosure: '+18',
    affiliateDisclosure: 'روابط 888Starz تابعة؛ قد تحصل BTTSPredict على عمولة عند استخدامها.',
    responsible: 'اللعب المسؤول',
    faqTitle: 'الأسئلة الشائعة',
  },
}

const CODE_COPY: Record<Lang, Pick<typeof COPY.fr, 'title' | 'positioning' | 'offer'>> = {
  fr: {
    title: 'Guide du code promo 888Starz : btts221',
    positioning: 'Le code 888Starz est btts221. L’offre annoncée comprend un bonus de dépôt de 300 %, du cashback et des bonus hebdomadaires. Vérifiez les conditions et votre éligibilité directement auprès de 888Starz.',
    offer: 'Bonus de dépôt mondial 300 %',
  },
  en: {
    title: '888Starz code guide: btts221',
    positioning: '888Starz code btts221 works worldwide. The offer includes a 300% worldwide deposit bonus, cashback and weekly bonuses. Check terms with 888Starz.',
    offer: '300% Worldwide Deposit Bonus',
  },
  ar: {
    title: 'دليل رمز 888Starz الترويجي: btts221',
    positioning: 'يعمل رمز 888Starz ‏btts221 حول العالم. يشمل العرض مكافأة إيداع عالمية بنسبة 300%، واستردادًا نقديًا ومكافآت أسبوعية. راجع الشروط لدى 888Starz.',
    offer: 'مكافأة إيداع عالمية 300%',
  },
}

type MainPromoCopy = Pick<typeof COPY.fr, 'title' | 'positioning' | 'offer' | 'highlights' | 'guideTitle' | 'steps'>

const MAIN_PROMO_COPY: Record<Lang, MainPromoCopy> = {
  fr: {
    title: 'Code promo 888Starz : btts221',
    positioning: 'Le code 888Starz est btts221. L’offre annoncée comprend un bonus de dépôt de 300 %, du cashback et des bonus hebdomadaires. Vérifiez les conditions auprès de l’opérateur.',
    offer: 'Bonus de dépôt mondial 300 %',
    highlights: ['Bonus de dépôt 300 %', 'Cashback', 'Bonus hebdomadaires · code btts221'],
    guideTitle: 'Comment utiliser le code btts221',
    steps: [
      { title: 'Copier btts221', body: 'Recopiez le code exact avant de consulter l’offre 888Starz.' },
      { title: 'Consulter 888Starz', body: 'Vérifiez auprès de l’opérateur les modalités en vigueur.' },
    ],
  },
  en: {
    title: '888Starz promo code: btts221',
    positioning: 'The 888Starz code is btts221. The advertised offer includes a 300% deposit bonus, cashback and weekly bonuses. Check the terms with the operator.',
    offer: '300% Worldwide Deposit Bonus',
    highlights: ['300% deposit bonus', 'Cashback', 'Weekly bonuses · code btts221'],
    guideTitle: 'How to use code btts221',
    steps: [
      { title: 'Copy btts221', body: 'Copy the exact code before reviewing the 888Starz offer.' },
      { title: 'Check with 888Starz', body: 'Review the offer terms directly with the operator.' },
    ],
  },
  ar: {
    title: 'رمز 888Starz الترويجي: btts221',
    positioning: 'رمز 888Starz هو btts221. يتضمن العرض المعلن مكافأة إيداع بنسبة 300% واسترداداً نقدياً ومكافآت أسبوعية. تحقق من الشروط لدى المشغّل.',
    offer: 'مكافأة إيداع عالمية 300%',
    highlights: ['مكافأة إيداع 300%', 'استرداد نقدي', 'مكافآت أسبوعية · الرمز btts221'],
    guideTitle: 'طريقة استخدام الرمز btts221',
    steps: [
      { title: 'انسخ btts221', body: 'انسخ الرمز الدقيق قبل مراجعة عرض 888Starz.' },
      { title: 'راجع العرض لدى 888Starz', body: 'تحقق من شروط العرض مباشرة لدى المشغّل.' },
    ],
  },
}

function titleWithCode(title: string) {
  const index = title.indexOf(CODE)
  if (index < 0) return title
  return <>{title.slice(0, index)}<bdi dir="ltr">{CODE}</bdi>{title.slice(index + CODE.length)}</>
}

export default function Star888PromoClient({
  lang = 'fr',
  showDownload = false,
  variant = 'general',
}: {
  lang?: Lang
  showDownload?: boolean
  variant?: 'general' | 'code' | 'main'
}) {
  const copy = variant === 'code'
    ? { ...COPY[lang], ...CODE_COPY[lang] }
    : variant === 'main'
      ? { ...COPY[lang], ...MAIN_PROMO_COPY[lang] }
      : COPY[lang]
  const faq = getPromoFaq('888starz', lang)
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)

  const handleCopy = async () => {
    const ok = await copyTextToClipboard(CODE)
    if (ok) {
      setCopied(true)
      setCopyFailed(false)
      trackAffiliateCodeCopy('888starz', `promo-888starz-${lang}`)
      window.setTimeout(() => setCopied(false), 2200)
      navigator.vibrate?.(12)
    } else {
      setCopied(false)
      setCopyFailed(true)
      window.setTimeout(() => setCopyFailed(false), 3500)
    }
  }

  return (
    <main
      lang={lang}
      dir={copy.dir}
      data-888starz-promo
      className="promo-shell--888starz min-h-[60vh] bg-[#070B12] px-4 pb-36 pt-6 text-[#F2F6FA] sm:pt-10 sm:pb-36 md:pb-10"
      style={{
        colorScheme: 'dark',
        fontFamily: lang === 'ar' ? 'var(--font-arabic), var(--font-body), Arial, sans-serif' : 'var(--font-body), Roboto, Arial, sans-serif',
      }}
    >
      <section className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#0C1726] shadow-[0_20px_56px_rgba(0,0,0,0.42)]" aria-labelledby="star888-title">
        <div className="grid lg:grid-cols-[1.05fr_.95fr]">
          <div className="border-b border-white/10 p-5 sm:p-8 lg:border-b-0 lg:border-e lg:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="inline-flex items-center rounded-full border border-[#D9164C]/40 bg-[#D9164C]/12 px-3 py-1.5 text-xs font-bold tracking-wide text-[#FF7A9C]">
                {copy.badge}
              </span>
              <span className="grid h-14 min-w-28 place-items-center rounded-lg border border-white/12 bg-white px-3">
                <Image src={LOGO} alt="888Starz" width={132} height={42} priority className="h-9 w-auto object-contain" />
              </span>
            </div>

            <h1 id="star888-title" className="mt-8 max-w-full break-words text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl [overflow-wrap:anywhere]">
              {titleWithCode(copy.title)}
            </h1>
            <p className="mt-2 text-base font-semibold leading-7 text-[#B9CDD2] sm:text-lg">{copy.positioning}</p>

            <div className="mt-8 border-s-4 border-[#D9164C] ps-4">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#8FA9AF]">888Starz</p>
              <p className="mt-1 text-3xl font-extrabold tracking-tight text-[#D9164C] sm:text-4xl">{copy.offer}</p>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-3" data-promo-highlights>
              {copy.highlights.map((highlight, index) => (
                <div key={highlight} className="rounded-xl border border-white/10 bg-[#101E30] p-3">
                  <span className="text-[10px] font-bold tracking-widest text-[#FF7A9C]">0{index + 1}</span>
                  <p className="mt-1 text-xs font-semibold leading-relaxed text-[#CBDDE0]">{highlight}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 sm:p-8 lg:p-10">
            <p className="text-sm font-bold text-[#CBDDE0]">{copy.codeLabel}</p>
            <div className="mt-2 rounded-2xl border border-white/15 bg-[#101E30] p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <code dir="ltr" className="select-all text-3xl font-extrabold tracking-[.12em] text-white sm:text-4xl">{CODE}</code>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/40 bg-transparent px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9164C] focus-visible:ring-offset-2"
                  data-cta={`promo-copy-888starz-${lang}`}
                  aria-label={copy.copy}
                  aria-live="polite"
                >
                  {copied ? copy.copied : copy.copy}
                </button>
              </div>
              <p className="sr-only" role="status" aria-live="polite">{copyFailed ? copy.copyFailed : copied ? copy.copied : ''}</p>
              {copyFailed && <p className="mt-2 text-sm font-medium text-[#FF7A9C]" role="alert">{copy.copyFailed}</p>}
            </div>

            <a
              href={AFFILIATE.star888}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              onClick={() => trackAffiliateAction('888starz', 'signup_cta_click', `promo-hero-${lang}`)}
              data-cta={`promo-signup-888starz-${lang}`}
              className="mt-5 flex min-h-14 w-full items-center justify-center gap-3 rounded-lg bg-[#D9164C] px-5 py-3 text-center text-base font-extrabold text-white shadow-sm transition-colors hover:bg-[#B81240] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-white p-1">
                <Image src={LOGO} alt="" width={28} height={28} className="h-6 w-6 object-contain" />
              </span>
              <span>{copy.visit}</span>
            </a>

            {showDownload && (
              <a
                href={AFFILIATE.star888Download}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                onClick={() => trackAffiliateAction('888starz', 'download_click', `promo-apk-${lang}`)}
                data-cta={`promo-apk-888starz-${lang}`}
                className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-transparent px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9164C] focus-visible:ring-offset-2"
              >
                <Image src={LOGO} alt="" aria-hidden="true" width={23} height={23} className="h-6 w-6 shrink-0 object-contain" />
                <Image src="/logos/google-play.svg" alt="" aria-hidden="true" width={23} height={23} className="h-6 w-6 shrink-0 object-contain" />
                <span>{copy.download}</span>
              </a>
            )}

            <p data-affiliate-disclosure className="mt-4 text-center text-xs leading-relaxed text-[#9FB6BB]">{copy.affiliateDisclosure}</p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-xs text-[#9FB6BB]">
              <span>{copy.disclosure}</span>
              <span aria-hidden="true">·</span>
              <a href={lang === 'fr' ? '/jouer-responsable' : `/${lang}/jouer-responsable`} className="font-semibold text-white underline underline-offset-2 hover:text-[#FF7A9C]">{copy.responsible}</a>
            </div>
          </div>
        </div>
      </section>
      <section data-promo-steps aria-labelledby="star888-steps-title" className="mx-auto mt-8 w-full max-w-5xl rounded-2xl border border-white/10 bg-[#0C1726] p-5 sm:p-8">
        <h2 id="star888-steps-title" className="text-xl font-bold text-white sm:text-2xl">{copy.guideTitle}</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {copy.steps.map((step, index) => (
            <div key={step.title} className="rounded-xl border border-[#D9164C]/25 bg-[#101E30] p-4">
              <span className="text-xs font-bold tracking-widest text-[#FF7A9C]">0{index + 1}</span>
              <h3 className="mt-1 font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#B9CDD2]">{step.body}</p>
            </div>
          ))}
        </div>
      </section>
      <section data-promo-faq aria-labelledby="star888-faq-title" className="mx-auto mt-8 w-full max-w-5xl rounded-2xl border border-white/10 bg-[#06232E] p-5 sm:p-8">
        <h2 id="star888-faq-title" className="text-xl font-bold text-white sm:text-2xl">{copy.faqTitle}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {faq.map((item) => (
            <div key={item.q} className="rounded-xl border border-white/10 bg-[#101E30] p-4">
              <h3 className="text-base font-bold text-white">{item.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#B9CDD2]">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="fixed bottom-[calc(86px+env(safe-area-inset-bottom))] left-1/2 z-[45] flex w-[calc(100%-24px)] max-w-[520px] -translate-x-1/2 gap-2 rounded-2xl border border-white/10 bg-[#0B1422]/95 p-2 shadow-2xl backdrop-blur-xl md:hidden">
        <button
          type="button"
          onClick={handleCopy}
          data-cta={`promo-sticky-copy-888starz-${lang}`}
          className="min-h-11 flex-1 rounded-xl border border-white/15 bg-white/5 px-3 text-xs font-extrabold text-white"
        >
          {copied ? copy.copied : copy.copy}
        </button>
        <a
          href={AFFILIATE.star888}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          onClick={() => trackAffiliateAction('888starz', 'signup_cta_click', `promo-sticky-${lang}`)}
          data-cta={`promo-sticky-signup-888starz-${lang}`}
          className="flex min-h-11 flex-[1.25] items-center justify-center rounded-xl bg-[#D9164C] px-3 text-center text-xs font-extrabold text-white"
        >
          {copy.visit} →
        </a>
      </div>
    </main>
  )
}
