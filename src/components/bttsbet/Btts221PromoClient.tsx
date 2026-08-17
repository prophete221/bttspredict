'use client'

import { useMemo, useState } from 'react'
import { AFFILIATE } from '@/lib/constants'
import { trackAffiliateAction, trackAffiliateCodeCopy } from '@/lib/affiliateTracking'

type Lang = 'fr' | 'en' | 'ar'

const CODE = 'btts221'

const COPY: Record<Lang, {
  dir: 'ltr' | 'rtl'
  eyebrow: string
  title: string
  intro: string
  offerLabel: string
  offerText: string
  conditions: string
  copy: string
  copied: string
  signup: string
  guide: string
  stepsTitle: string
  steps: string[]
  faqTitle: string
  faq: Array<{ q: string; a: string }>
  verified: string
  affiliate: string
  responsible: string
  home: string
  predictions: string
}> = {
  fr: {
    dir: 'ltr',
    eyebrow: 'OFFRE DÉDIÉE · 888STARZ',
    title: 'Code promo 888Starz btts221 : offre 150 free spins',
    intro: 'Une page indépendante pour vérifier le code btts221, consulter les conditions affichées et ouvrir 888Starz avec le bon code.',
    offerLabel: 'Campagne btts221 annoncée',
    offerText: '150 free spins à l’inscription et dépôt minimum annoncé à 1 USD — disponibilité, éligibilité et conditions à confirmer directement sur 888Starz.',
    conditions: 'Les bonus peuvent varier selon le pays, le compte, la période et les conditions de mise. Ne dépose rien avant d’avoir vérifié l’offre officielle.',
    copy: 'Copier btts221',
    copied: 'Code copié',
    signup: 'Ouvrir 888Starz avec btts221',
    guide: 'Comment utiliser le code',
    stepsTitle: 'Activer le code promo 888Starz btts221',
    steps: [
      'Ouvre le lien officiel 888Starz depuis cette page.',
      'Crée ton compte et saisis exactement btts221 en minuscules si le champ est disponible.',
      'Vérifie l’offre affichée pour ton pays avant tout dépôt.',
      'Lis les conditions des free spins, du dépôt et de la mise avant de confirmer.',
    ],
    faqTitle: 'Questions sur btts221 et le bonus 888Starz',
    faq: [
      { q: 'Quel est le code promo 888Starz ?', a: 'Le code présenté sur cette page est btts221, en minuscules. Vérifie son acceptation pendant l’inscription.' },
      { q: 'Le code donne-t-il 150 free spins ?', a: 'La campagne annoncée mentionne 150 free spins, mais l’offre doit être confirmée sur 888Starz selon ton pays, ton compte et la période.' },
      { q: 'Quel est le dépôt minimum ?', a: 'Le dépôt minimum annoncé est de 1 USD pour cette campagne. Vérifie le montant réellement affiché avant toute transaction.' },
      { q: 'Le code fonctionne-t-il partout ?', a: 'Non garanti. L’éligibilité peut dépendre du pays, du compte, de l’appareil et des règles locales de l’opérateur.' },
    ],
    verified: 'Page vérifiée le',
    affiliate: 'Lien d’affiliation rémunéré · 18+ · Les conditions de l’opérateur s’appliquent.',
    responsible: 'Jouer responsable',
    home: 'Accueil',
    predictions: 'Voir les prédictions',
  },
  en: {
    dir: 'ltr',
    eyebrow: 'DEDICATED OFFER · 888STARZ',
    title: '888Starz promo code btts221: 150 free spins offer',
    intro: 'A dedicated page to check the btts221 code, review the displayed terms and open 888Starz with the correct code.',
    offerLabel: 'btts221 campaign announced',
    offerText: '150 free spins at sign-up and a $1 minimum deposit announced — availability, eligibility and terms must be confirmed directly on 888Starz.',
    conditions: 'Bonuses may vary by country, account, period and wagering terms. Do not deposit before checking the official offer.',
    copy: 'Copy btts221',
    copied: 'Code copied',
    signup: 'Open 888Starz with btts221',
    guide: 'How to use the code',
    stepsTitle: 'Activate the 888Starz btts221 promo code',
    steps: [
      'Open the official 888Starz link from this page.',
      'Create your account and enter btts221 in lowercase if the field is available.',
      'Check the offer displayed for your country before depositing.',
      'Read the free spins, deposit and wagering terms before confirming.',
    ],
    faqTitle: 'Questions about btts221 and the 888Starz bonus',
    faq: [
      { q: 'What is the 888Starz promo code?', a: 'The code shown on this page is btts221 in lowercase. Check that it is accepted during registration.' },
      { q: 'Does the code give 150 free spins?', a: 'The announced campaign mentions 150 free spins, but the offer must be confirmed on 888Starz for your country, account and period.' },
      { q: 'What is the minimum deposit?', a: 'The announced minimum deposit is $1 for this campaign. Check the amount displayed before making any transaction.' },
      { q: 'Does the code work everywhere?', a: 'Not guaranteed. Eligibility may depend on your country, account, device and the operator’s local rules.' },
    ],
    verified: 'Page checked on',
    affiliate: 'Paid affiliate link · 18+ · Operator terms apply.',
    responsible: 'Play responsibly',
    home: 'Home',
    predictions: 'View predictions',
  },
  ar: {
    dir: 'rtl',
    eyebrow: 'عرض خاص · 888STARZ',
    title: 'رمز 888Starz الترويجي btts221: عرض 150 لفة مجانية',
    intro: 'صفحة مستقلة للتحقق من الرمز btts221 وقراءة الشروط المعروضة وفتح 888Starz باستخدام الرمز الصحيح.',
    offerLabel: 'حملة btts221 المعلنة',
    offerText: '150 لفة مجانية عند التسجيل وحد أدنى معلن للإيداع قدره 1 دولار — يجب تأكيد التوفر والأهلية والشروط مباشرة على 888Starz.',
    conditions: 'قد تختلف المكافآت حسب البلد والحساب والفترة وشروط المراهنة. لا تقم بالإيداع قبل التحقق من العرض الرسمي.',
    copy: 'نسخ btts221',
    copied: 'تم نسخ الرمز',
    signup: 'فتح 888Starz باستخدام btts221',
    guide: 'طريقة استخدام الرمز',
    stepsTitle: 'تفعيل رمز 888Starz الترويجي btts221',
    steps: [
      'افتح رابط 888Starz الرسمي من هذه الصفحة.',
      'أنشئ حسابك وأدخل btts221 بأحرف صغيرة إذا كان الحقل متاحاً.',
      'تحقق من العرض الظاهر لبلدك قبل الإيداع.',
      'اقرأ شروط اللفات المجانية والإيداع ومتطلبات المراهنة قبل التأكيد.',
    ],
    faqTitle: 'أسئلة حول btts221 ومكافأة 888Starz',
    faq: [
      { q: 'ما هو الرمز الترويجي لـ 888Starz؟', a: 'الرمز المعروض في هذه الصفحة هو btts221 بأحرف صغيرة. تحقق من قبوله أثناء التسجيل.' },
      { q: 'هل يمنح الرمز 150 لفة مجانية؟', a: 'تشير الحملة المعلنة إلى 150 لفة مجانية، لكن يجب تأكيد العرض على 888Starz حسب بلدك وحسابك والفترة.' },
      { q: 'ما هو الحد الأدنى للإيداع؟', a: 'الحد الأدنى المعلن لهذه الحملة هو 1 دولار. تحقق من المبلغ الظاهر قبل إجراء أي معاملة.' },
      { q: 'هل يعمل الرمز في كل البلدان؟', a: 'لا يوجد ضمان عام. قد تعتمد الأهلية على البلد والحساب والجهاز والقواعد المحلية للمشغل.' },
    ],
    verified: 'تم التحقق من الصفحة في',
    affiliate: 'رابط تابع مدفوع · +18 · تطبق شروط المشغل.',
    responsible: 'اللعب المسؤول',
    home: 'الرئيسية',
    predictions: 'عرض التوقعات',
  },
}

function formatDate(value: string, lang: Lang) {
  return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : lang === 'en' ? 'en-GB' : 'ar', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Dakar',
  }).format(new Date(`${value}T12:00:00Z`))
}

export default function Btts221PromoClient({ lang, reviewDate }: { lang: Lang; reviewDate: string }) {
  const [copied, setCopied] = useState(false)
  const today = reviewDate
  const copy = useMemo(() => COPY[lang], [lang])

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(CODE) } catch { /* Clipboard may be unavailable in some browsers. */ }
    setCopied(true)
    trackAffiliateCodeCopy('888starz', `btts221-${lang}-hero`)
    window.setTimeout(() => setCopied(false), 2200)
  }

  const handleSignup = () => trackAffiliateAction('888starz', 'signup', `btts221-${lang}-hero`)

  return (
    <main dir={copy.dir} className="min-h-screen bg-dark-800 text-papier pb-20">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-cendre">
          <a href={lang === 'fr' ? '/' : `/${lang}`} className="hover:text-papier">{copy.home}</a>
          <span className="mx-2">/</span>
          <span aria-current="page">888Starz btts221</span>
        </nav>

        <section className="relative overflow-hidden rounded-3xl border border-[#D6B36A]/35 bg-[radial-gradient(circle_at_top_right,rgba(214,179,106,.18),transparent_42%),linear-gradient(135deg,#071018,#101C29)] px-5 py-8 shadow-[0_24px_80px_rgba(0,0,0,.35)] sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#D6B36A]/10 blur-3xl" />
          <div className="relative max-w-3xl">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[.22em] text-[#D6B36A]">{copy.eyebrow}</p>
            <h1 className="text-4xl leading-[.98] tracking-tight text-papier sm:text-6xl">{copy.title}</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#C8D2DA] sm:text-base">{copy.intro}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={handleCopy} className="rounded-xl border border-[#D6B36A]/60 bg-[#D6B36A] px-5 py-3 text-sm font-black text-[#071018] shadow-[0_10px_30px_rgba(214,179,106,.2)] transition-transform hover:-translate-y-0.5">
                {copied ? copy.copied : copy.copy}
              </button>
              <a href={AFFILIATE.star888} target="_blank" rel="sponsored nofollow noopener noreferrer" onClick={handleSignup} data-cta={`btts221-${lang}-signup`} className="rounded-xl border border-[#8BA9C7]/50 bg-[#8BA9C7]/15 px-5 py-3 text-center text-sm font-bold text-papier transition-colors hover:bg-[#8BA9C7]/25">
                {copy.signup}
              </a>
            </div>
            <p className="mt-4 text-[11px] text-[#AAB8C2]">{copy.verified} <time dateTime={today}>{formatDate(today, lang)}</time> · {copy.affiliate}</p>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-[1.25fr_.75fr]">
          <div className="rounded-2xl border border-[#D6B36A]/35 bg-[#0D1A20] p-5 sm:p-7">
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#D6B36A]">{copy.offerLabel}</p>
            <p className="mt-3 text-lg font-bold leading-8 text-papier">{copy.offerText}</p>
            <p className="mt-4 text-xs leading-6 text-[#AAB8C2]">{copy.conditions}</p>
          </div>
          <div className="rounded-2xl border border-[#8BA9C7]/30 bg-[#0D1A20] p-5 sm:p-7">
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#8BA9C7]">{copy.guide}</p>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-[#C8D2DA]">
              {copy.steps.slice(0, 3).map((step, index) => <li key={step}><span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#8BA9C7]/20 text-xs font-bold text-[#8BA9C7]">{index + 1}</span>{step}</li>)}
            </ol>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-papier sm:text-3xl">{copy.stepsTitle}</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {copy.steps.map((step, index) => <article key={step} className="rounded-2xl border border-white/10 bg-[#0D1A20] p-5"><span className="text-xs font-bold text-[#D6B36A]">0{index + 1}</span><p className="mt-3 text-sm leading-6 text-[#C8D2DA]">{step}</p></article>)}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="btts221-faq">
          <h2 id="btts221-faq" className="text-2xl font-bold text-papier sm:text-3xl">{copy.faqTitle}</h2>
          <div className="mt-5 space-y-3">
            {copy.faq.map((item) => <details key={item.q} className="rounded-2xl border border-white/10 bg-[#0D1A20] p-5"><summary className="cursor-pointer font-bold text-papier">{item.q}</summary><p className="mt-3 text-sm leading-7 text-[#C8D2DA]">{item.a}</p></details>)}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-[#FF7B7B]/25 bg-[#FF7B7B]/5 p-5 text-center">
          <p className="text-xs leading-6 text-[#C8D2DA]">{copy.affiliate} <a className="underline" href={lang === 'fr' ? '/jouer-responsable' : `/${lang}/jouer-responsable`}>{copy.responsible}</a></p>
        </section>

        <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs font-bold text-[#8BA9C7]">
          <a href={lang === 'fr' ? '/btts/predictions/today' : `/${lang}/btts/predictions/today`} className="hover:text-papier">{copy.predictions}</a>
          <a href={lang === 'fr' ? '/bonus-888starz' : `/${lang}/bonus-888starz`} className="hover:text-papier">888Starz guide</a>
        </div>
      </div>
    </main>
  )
}
