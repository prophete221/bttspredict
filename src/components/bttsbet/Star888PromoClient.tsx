'use client'

import Image from 'next/image'
import { useState } from 'react'
import { AFFILIATE, BOOKMAKERS } from '@/lib/constants'
import { trackAffiliateAction, trackAffiliateCodeCopy } from '@/lib/affiliateTracking'
import { copyTextToClipboard } from '@/lib/clipboard'

type Lang = 'fr' | 'en' | 'ar'

const CODE = 'btts221'
const LOGO = BOOKMAKERS.find((item) => item.id === '888starz')?.logoFull ?? '/logos/888starz-logo.jpg'

const COPY: Record<Lang, {
  dir: 'ltr' | 'rtl'
  badge: string
  title: string
  positioning: string
  offer: string
  codeLabel: string
  copy: string
  copied: string
  copyFailed: string
  visit: string
  download: string
  disclosure: string
  responsible: string
}> = {
  fr: {
    dir: 'ltr',
    badge: 'OFFRE 888STARZ',
    title: 'Meilleur code promo 888Starz',
    positioning: 'Plus de cashback et des bonus hebdomadaires',
    offer: '300 % worldwide',
    codeLabel: 'Code promo',
    copy: 'Copier le code',
    copied: 'Code copié',
    copyFailed: 'Copie indisponible. Sélectionnez le code pour le copier.',
    visit: 'Consulter 888Starz',
    download: 'Télécharger l’APK',
    disclosure: '18+',
    responsible: 'Jouer responsable',
  },
  en: {
    dir: 'ltr',
    badge: '888STARZ OFFER',
    title: 'Best 888Starz promo code',
    positioning: 'More cashback and weekly bonuses',
    offer: '300% worldwide',
    codeLabel: 'Promo code',
    copy: 'Copy code',
    copied: 'Code copied',
    copyFailed: 'Copy unavailable. Select the code to copy it.',
    visit: 'Visit 888Starz',
    download: 'Download APK',
    disclosure: '18+',
    responsible: 'Play responsibly',
  },
  ar: {
    dir: 'rtl',
    badge: 'عرض 888Starz',
    title: 'أفضل رمز ترويجي لـ 888Starz',
    positioning: 'استرداد نقدي أكبر ومكافآت أسبوعية',
    offer: '300% حول العالم',
    codeLabel: 'الرمز الترويجي',
    copy: 'نسخ الرمز',
    copied: 'تم نسخ الرمز',
    copyFailed: 'تعذر النسخ. حدّد الرمز لنسخه.',
    visit: 'زيارة 888Starz',
    download: 'تحميل APK',
    disclosure: '+18',
    responsible: 'اللعب المسؤول',
  },
}

export default function Star888PromoClient({
  lang = 'fr',
  showDownload = false,
}: {
  lang?: Lang
  showDownload?: boolean
}) {
  const copy = COPY[lang]
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
      className="min-h-[60vh] bg-[#001E28] px-4 py-6 text-[#EAF2F4] sm:py-10"
      style={{
        colorScheme: 'dark',
        fontFamily: lang === 'ar' ? 'var(--font-arabic), var(--font-body), Arial, sans-serif' : 'var(--font-body), Roboto, Arial, sans-serif',
      }}
    >
      <section className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#06232E] shadow-[0_10px_32px_rgba(0,0,0,0.45)]" aria-labelledby="star888-title">
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

            <h1 id="star888-title" className="mt-8 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
              {copy.title}
            </h1>
            <p className="mt-2 text-base font-semibold leading-7 text-[#B9CDD2] sm:text-lg">{copy.positioning}</p>

            <div className="mt-8 border-s-4 border-[#D9164C] ps-4">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#8FA9AF]">888Starz</p>
              <p className="mt-1 text-3xl font-extrabold tracking-tight text-[#D9164C] sm:text-4xl">{copy.offer}</p>
            </div>
          </div>

          <div className="p-5 sm:p-8 lg:p-10">
            <p className="text-sm font-bold text-[#CBDDE0]">{copy.codeLabel}</p>
            <div className="mt-2 rounded-xl border border-white/15 bg-[#0B2B36] p-4 sm:p-5">
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
                <Image src="/logos/google-play.svg" alt="" aria-hidden="true" width={23} height={23} className="h-6 w-6 shrink-0 object-contain" />
                <span>{copy.download}</span>
              </a>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-xs text-[#9FB6BB]">
              <span>{copy.disclosure}</span>
              <span aria-hidden="true">·</span>
              <a href={lang === 'fr' ? '/jouer-responsable' : `/${lang}/jouer-responsable`} className="font-semibold text-white underline underline-offset-2 hover:text-[#FF7A9C]">{copy.responsible}</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
