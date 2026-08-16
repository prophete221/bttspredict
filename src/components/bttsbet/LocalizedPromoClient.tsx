'use client'

import { useState } from 'react'
import { useLanguage } from './LanguageSwitcher'
import { AFFILIATE } from '@/lib/constants'
import { trackAffiliateAction, trackAffiliateCodeCopy } from '@/lib/affiliateTracking'

export default function LocalizedPromoClient({ bookmaker, reviewDate }: { bookmaker: 'linebet' | '888starz'; reviewDate?: string }) {
  const effectiveReviewDate = reviewDate || new Date().toISOString().slice(0, 10)
  const { lang } = useLanguage()
  const isLinebet = bookmaker === 'linebet'
  const code = 'VISION221'
  const brand = isLinebet ? 'Linebet' : '888Starz'
  const signup = isLinebet ? AFFILIATE.linebet : AFFILIATE.star888
  const download = isLinebet ? AFFILIATE.linebetDownload : AFFILIATE.star888Download
  const [copied, setCopied] = useState(false)

  const copy = lang === 'fr'
    ? {
        title: `Code promo ${brand}`,
        intro: `Guide ${brand} : code copiable, inscription et conditions à vérifier avant tout dépôt.`,
        codeLabel: 'Code promo',
        signup: `S’inscrire sur ${brand}`,
        download: 'Télécharger APK',
        steps: 'Comment utiliser le code',
        one: `Ouvre le lien officiel ${brand} et crée ton compte.`,
        two: `Saisis le code ${code} pendant l’inscription ou dans la section Code Promo.`,
        three: 'Vérifie le bonus, le dépôt minimum et les conditions affichées pour ton pays avant de déposer.',
        copied: 'Code copié',
        conditions: 'Les conditions commerciales, montants et critères d’éligibilité peuvent changer. Vérifie toujours les conditions officielles.',
        verified: 'Guide vérifié le',
        responsible: 'Jouer responsable',
        faqTitle: `Questions fréquentes sur ${brand}`,
        faqBonus: `Quel est le bonus ${brand} ?`,
        faqBonusAnswer: 'Les montants et conditions varient selon le pays et la période. Consulte toujours l’offre actuellement affichée par l’opérateur.',
        faqCountry: 'Le code fonctionne-t-il dans tous les pays ?',
        faqCountryAnswer: 'La disponibilité dépend du pays, du compte et de la période. Vérifie ton éligibilité avant tout dépôt.',
      }
    : lang === 'en'
      ? {
          title: `${brand} promo code ${effectiveReviewDate.slice(0, 4)}`,
          intro: `${brand} sign-up guide with a copyable code and terms to check before any deposit.`,
          codeLabel: 'Promo code',
          signup: `Sign up on ${brand}`,
          download: 'Download APK',
          steps: 'How to use the code',
          one: `Open the official ${brand} link and create your account.`,
          two: `Enter code ${code} during sign-up or in the Promo Code section.`,
          three: 'Check the bonus, minimum deposit and terms shown for your country before depositing.',
          copied: 'Code copied',
          conditions: 'Commercial terms, amounts and eligibility criteria may change. Always check the operator’s official terms.',
          verified: 'Guide checked on',
          responsible: 'Play responsibly',
          faqTitle: `Frequently asked questions about ${brand}`,
          faqBonus: `What is the ${brand} bonus?`,
          faqBonusAnswer: 'Amounts and terms vary by country and period. Always check the offer currently displayed by the operator.',
          faqCountry: 'Does the code work in every country?',
          faqCountryAnswer: 'Availability depends on country, account and period. Check your eligibility before making a deposit.',
        }
      : {
          title: `رمز ${brand} الترويجي ${effectiveReviewDate.slice(0, 4)}`,
          intro: `دليل التسجيل في ${brand} مع رمز قابل للنسخ وشروط يجب التحقق منها قبل أي إيداع.`,
          codeLabel: 'الرمز الترويجي',
          signup: `التسجيل في ${brand}`,
          download: 'تحميل التطبيق',
          steps: 'كيفية استخدام الرمز',
          one: `افتح رابط ${brand} الرسمي وأنشئ حسابك.`,
          two: `أدخل الرمز ${code} أثناء التسجيل أو في قسم الرمز الترويجي.`,
          three: 'تحقق من المكافأة والحد الأدنى للإيداع والشروط المعروضة لبلدك قبل الإيداع.',
          copied: 'تم نسخ الرمز',
          conditions: 'قد تتغير الشروط التجارية والمبالغ ومعايير الأهلية. تحقق دائماً من الشروط الرسمية للمشغل.',
          verified: 'تم التحقق من الدليل في',
          responsible: 'العب بمسؤولية',
          faqTitle: `الأسئلة الشائعة حول ${brand}`,
          faqBonus: `ما هي مكافأة ${brand}؟`,
          faqBonusAnswer: 'تختلف المبالغ والشروط حسب البلد والفترة. تحقق دائماً من العرض المعروض حالياً من المشغل.',
          faqCountry: 'هل يعمل الرمز في جميع البلدان؟',
          faqCountryAnswer: 'تعتمد الإتاحة على البلد والحساب والفترة. تحقق من أهليتك قبل أي إيداع.',
        }

  const handleCopy = async () => {
    trackAffiliateCodeCopy(bookmaker, `localized-${bookmaker}`)
    try {
      await navigator.clipboard?.writeText(code)
    } finally {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const track = (event: 'signup' | 'download') => trackAffiliateAction(bookmaker, event, `localized-${bookmaker}`)
  const reviewDateLabel = new Intl.DateTimeFormat(lang === 'ar' ? 'ar' : lang === 'en' ? 'en-GB' : 'fr-FR', { dateStyle: 'long', timeZone: 'Africa/Dakar' }).format(new Date(`${effectiveReviewDate}T12:00:00Z`))

  return (
    <div className="min-h-screen bg-[#071018] flex flex-col text-[#F5F8F3]">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-[#B7C4C1] mb-8">
          <a href="/">BTTSPredict</a> <span aria-hidden="true">/</span> <span>{brand}</span>
        </nav>
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[#B8FF1A]">{brand}</p>
          <h1 className="text-4xl font-black mt-3" style={{ fontFamily: 'Poppins, sans-serif' }}>{copy.title}</h1>
          <p className="text-sm text-[#B7C4C1] mt-4">{copy.intro}</p>
          <p className="text-xs text-[#B7C4C1] mt-3">{copy.verified} <time dateTime={effectiveReviewDate}>{reviewDateLabel}</time>
 · 18+</p>
        </div>

        <section className="rounded-2xl p-6 bg-[#0D1A20] border border-[#5D7880] text-center" aria-labelledby="localized-code-title">
          <p id="localized-code-title" className="text-xs uppercase tracking-widest text-[#B7C4C1]">{copy.codeLabel}</p>
          <button onClick={handleCopy} className="mt-3 px-6 py-3 rounded-xl text-xl font-black tracking-widest" style={{ backgroundColor: '#B8FF1A', color: '#071018' }} aria-label={`${code} — copy`}>{code}</button>
          {copied && <p className="text-xs text-[#34D399] mt-2" role="status" aria-live="polite">{copy.copied}</p>}
          <div className="grid gap-3 mt-6">
            <a href={signup} target="_blank" rel="noopener noreferrer nofollow sponsored" onClick={() => track('signup')} className="rounded-xl py-3 font-bold" style={{ backgroundColor: '#B8FF1A', color: '#071018' }}>{copy.signup}</a>
            <a href={download} target="_blank" rel="noopener noreferrer nofollow sponsored" onClick={() => track('download')} className="rounded-xl py-3 font-bold border border-[#5D7880] text-[#F5F8F3]">{copy.download}</a>
          </div>
          <p className="text-xs text-[#B7C4C1] mt-4">{copy.conditions}</p>
        </section>

        <section className="mt-8 rounded-2xl p-6 bg-[#0D1A20] border border-[#5D7880]" aria-labelledby="localized-steps-title">
          <h2 id="localized-steps-title" className="text-xl font-bold mb-4">{copy.steps}</h2>
          <ol className="space-y-3 text-sm text-[#B7C4C1] list-decimal list-inside">
            <li>{copy.one}</li>
            <li>{copy.two}</li>
            <li>{copy.three}</li>
          </ol>
        </section>

        <section className="mt-8 rounded-2xl p-6 bg-[#0D1A20] border border-[#5D7880]" aria-labelledby="localized-faq-title">
          <h2 id="localized-faq-title" className="text-xl font-bold mb-4">{copy.faqTitle}</h2>
          <details className="border-b border-[#5D7880] py-3">
            <summary className="cursor-pointer font-bold">{copy.faqBonus}</summary>
            <p className="text-sm text-[#B7C4C1] mt-2">{copy.faqBonusAnswer}</p>
          </details>
          <details className="py-3">
            <summary className="cursor-pointer font-bold">{copy.faqCountry}</summary>
            <p className="text-sm text-[#B7C4C1] mt-2">{copy.faqCountryAnswer}</p>
          </details>
        </section>

        <p className="text-center text-xs text-[#B7C4C1] mt-8">18+ · {copy.responsible} · Aucun résultat futur n’est garanti.</p>
      </main>
    </div>
  )
}
