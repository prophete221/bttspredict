'use client'

import { useState, useEffect, useRef, type ReactNode } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { trackAffiliateAction, trackAffiliateCodeCopy } from '@/lib/affiliateTracking'
import { copyTextToClipboard } from '@/lib/clipboard'

export type PromoLandingProps = {
  brand: string
  code: string
  bookmakerId: '1xbet' | 'linebet' | 'melbet' | '888starz'
  accent: string
  accentSoft?: string
  logo: string
  logoBg: string
  logoW?: number
  logoH?: number
  signupUrl: string
  downloadUrl: string
  lang: 'fr' | 'en' | 'ar'
  title: string
  badge: string
  intro: string
  offerHeadline: string
  offerSub: string
  benefits: string[]
  steps: { n: string; title: string; desc: string }[]
  faq: { q: string; a: string }[]
  crossLinks: { label: string; href: string }[]
  labels?: Partial<{
    copy: string
    copied: string
    copyFailed: string
    signup: string
    download: string
    codeLabel: string
    howTitle: string
    faqTitle: string
    others: string
    stickySignup: string
    responsible: string
    affiliateDisclosure: string
  }>
}

const ease = [0.22, 1, 0.36, 1] as const

function renderTitleWithCode(title: string, code: string) {
  const index = title.indexOf(code)
  if (index < 0) return title
  return <>{title.slice(0, index)}<bdi dir="ltr">{code}</bdi>{title.slice(index + code.length)}</>
}

function FadeIn({
  children,
  className = '',
  delay = 0,
  y = 28,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.65, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

export default function PromoLandingShell(p: PromoLandingProps) {
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const L = {
    copy: p.labels?.copy ?? (p.lang === 'en' ? 'Copy code' : p.lang === 'ar' ? 'نسخ الرمز' : 'Copier le code'),
    copied: p.labels?.copied ?? (p.lang === 'en' ? 'Copied!' : p.lang === 'ar' ? 'تم النسخ!' : 'Copié !'),
    copyFailed: p.labels?.copyFailed ?? (p.lang === 'en' ? 'Copy failed — select the code' : p.lang === 'ar' ? 'فشل النسخ' : 'Copie échouée — sélectionne le code'),
    signup: p.labels?.signup ?? (p.lang === 'en' ? `Open ${p.brand}` : p.lang === 'ar' ? `افتح ${p.brand}` : `Consulter ${p.brand}`),
    download: p.labels?.download ?? (p.lang === 'en' ? 'Download APK' : p.lang === 'ar' ? 'تحميل APK' : 'Télécharger l’APK'),
    codeLabel: p.labels?.codeLabel ?? (p.lang === 'en' ? 'Promo code' : p.lang === 'ar' ? 'رمز ترويجي' : 'Code promo'),
    howTitle: p.labels?.howTitle ?? (p.lang === 'en' ? 'Using the code' : p.lang === 'ar' ? 'استخدام الرمز' : 'Utiliser le code'),
    faqTitle: p.labels?.faqTitle ?? (p.lang === 'en' ? 'FAQ' : p.lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'),
    others: p.labels?.others ?? (p.lang === 'en' ? 'Other offers' : p.lang === 'ar' ? 'عروض أخرى' : 'Autres offres'),
    stickySignup: p.labels?.stickySignup ?? (p.lang === 'en' ? 'Open' : p.lang === 'ar' ? 'افتح' : 'Ouvrir'),
    responsible: p.labels?.responsible ?? (p.lang === 'en' ? 'Play responsibly' : p.lang === 'ar' ? 'العب بمسؤولية' : 'Jouez responsable'),
    affiliateDisclosure: p.labels?.affiliateDisclosure ?? (p.lang === 'en'
      ? 'Links to the operator are affiliate links; BTTSPredict may receive a commission if you use them.'
      : p.lang === 'ar'
        ? 'روابط المشغّل تابعة؛ قد تحصل BTTSPredict على عمولة عند استخدامها.'
        : 'Les liens vers l’opérateur sont affiliés ; BTTSPredict peut percevoir une commission si vous les utilisez.'),
  }

  const accent = p.accent
  useEffect(() => {
    trackAffiliateAction(p.bookmakerId, 'promo_view', `promo:${p.bookmakerId}:${p.lang}`)
  }, [p.bookmakerId, p.lang])

  const handleCopy = async () => {
    const ok = await copyTextToClipboard(p.code)
    if (ok) {
      trackAffiliateCodeCopy(p.bookmakerId, `promo-shell-${p.lang}`)
      setCopied(true)
      setCopyFailed(false)
      navigator.vibrate?.(12)
      setTimeout(() => setCopied(false), 2200)
    } else {
      setCopyFailed(true)
      setTimeout(() => setCopyFailed(false), 3000)
    }
  }

  return (
    <div
      data-promo-shell
      data-bookmaker={p.bookmakerId}
      className={`relative min-h-screen overflow-x-hidden text-[#F5F5F5] promo-shell promo-shell--${p.bookmakerId}`}
      style={{ backgroundColor: '#090909' }}
    >
      <main className="promo-main relative z-10 mx-auto w-full max-w-3xl px-4 pb-14 pt-6 sm:pt-8">
        {/* Hero */}
        <section className="promo-main__story text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="promo-story__badge inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-[11px] font-semibold"
            style={{ color: accent, border: `1px solid ${accent}55`, background: `${accent}14` }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: accent }} />
            {p.badge}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease }}
            className="promo-story__title mt-5 min-w-0 break-words text-3xl font-black leading-tight sm:text-5xl [overflow-wrap:anywhere]"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {renderTitleWithCode(p.title, p.code)}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.15, ease }}
            className="promo-story__logo mx-auto mt-5 flex min-h-[60px] max-w-[240px] items-center justify-center rounded-xl px-4 py-2 sm:max-w-[280px]"
            style={{
              backgroundColor: p.logoBg,
              boxShadow: 'none',
              border: `1px solid ${accent}33`,
            }}
          >
            <img
              src={p.logo}
              alt={`${p.brand} logo`}
              width={p.logoW ?? 200}
              height={p.logoH ?? 56}
              className="max-h-14 w-auto object-contain"
              loading="eager"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="promo-story__intro mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#9DABBB] sm:text-base"
          >
            {p.intro}
          </motion.p>

          {/* Code + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease }}
            className="promo-story__actions mx-auto mt-6 max-w-md"
          >
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9DABBB]">{L.codeLabel}</p>
            <button
              type="button"
              onClick={handleCopy}
              data-cta={`promo-copy-${p.bookmakerId}`}
              className="group relative w-full overflow-hidden rounded-xl px-4 py-3.5 transition-colors"
              style={{
                background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`,
                boxShadow: 'none',
              }}
              aria-label={`${p.code} — ${L.copy}`}
            >
              <span dir="ltr" className="relative z-10 font-mono text-2xl font-black tracking-[0.25em] text-white sm:text-3xl">{p.code}</span>
              <span className="relative z-10 mt-1 block text-[11px] font-bold uppercase tracking-wider text-white/80">
                {copied ? L.copied : L.copy}
              </span>
              <motion.span
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{ background: 'linear-gradient(120deg, transparent, rgba(255,255,255,0.18), transparent)' }}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
              />
            </button>
            {copyFailed && (
              <p className="mt-2 text-xs text-[#F87171]" role="alert">{L.copyFailed}</p>
            )}

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <a
                href={p.signupUrl}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                onClick={() => trackAffiliateAction(p.bookmakerId, 'signup_cta_click', `promo-hero-${p.lang}`)}
                data-cta={`promo-signup-${p.bookmakerId}`}
                className="rounded-lg py-3 text-center text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: accent, boxShadow: 'none' }}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-white p-0.5">
                    <img src={p.logo} alt="" width={24} height={24} className="h-6 w-6 object-contain" />
                  </span>
                  <span>{L.signup} →</span>
                </span>
              </a>
              <a
                href={p.downloadUrl}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                onClick={() => trackAffiliateAction(p.bookmakerId, 'download_click', `promo-apk-${p.lang}`)}
                data-cta={`promo-apk-${p.bookmakerId}`}
                className="rounded-lg py-3 text-center text-sm font-semibold transition-colors"
                style={{
                  color: '#F2F6FA',
                  border: `1px solid ${accent}66`,
                  background: `${accent}14`,
                }}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <img src={p.logo} alt="" aria-hidden="true" width={22} height={22} className="h-6 w-6 object-contain" />
                  <img src="/logos/google-play.svg" alt="" aria-hidden="true" width={22} height={22} className="h-6 w-6 object-contain" />
                  <span>{L.download}</span>
                </span>
              </a>
            </div>
            <p data-affiliate-disclosure className="mt-3 px-2 text-center text-[11px] leading-relaxed text-[#9DABBB]">
              {L.affiliateDisclosure}
            </p>
          </motion.div>
        </section>

        {/* Offer card */}
        <FadeIn className="promo-main__offer mt-10" delay={0.05}>
          <div
            className="relative overflow-hidden rounded-3xl p-6 text-center sm:p-8"
            style={{
              background: `linear-gradient(145deg, ${accent}22 0%, #101a26 45%, #0c141f 100%)`,
              border: `1px solid ${accent}44`,
              boxShadow: `0 24px 60px rgba(0,0,0,0.35), inset 0 1px 0 ${accent}33`,
            }}
          >
            <p className="text-2xl font-black sm:text-3xl" style={{ color: accent }}>{p.offerHeadline}</p>
            <p className="mt-3 text-sm text-[#9DABBB]">{p.offerSub}</p>
          </div>
        </FadeIn>

        {/* Steps */}
        <FadeIn className="promo-main__steps mt-12" delay={0.05}>
          <h2 className="mb-5 text-center text-xl font-bold sm:text-2xl">{L.howTitle}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {p.steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-2xl p-4 sm:p-5"
                style={{
                  background: 'rgba(16, 22, 34, 0.9)',
                  border: `1px solid ${accent}28`,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                }}
              >
                <span className="font-mono text-xs font-bold" style={{ color: accent }}>{s.n}</span>
                <p className="mt-1 text-sm font-bold sm:text-base">{s.title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-[#9DABBB] sm:text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </FadeIn>

        {/* FAQ */}
        <FadeIn className="promo-main__faq mt-12" delay={0.05}>
          <h2 className="mb-5 text-center text-xl font-bold sm:text-2xl">{L.faqTitle}</h2>
          <div className="space-y-2">
            {p.faq.map((item, i) => {
              const open = openFaq === i
              return (
                <motion.div
                  key={item.q}
                  layout
                  className="overflow-hidden rounded-2xl"
                  style={{
                    background: 'rgba(16, 22, 34, 0.92)',
                    border: `1px solid ${open ? accent + '66' : '#1e293b'}`,
                  }}
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-bold"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                  >
                    <span>{item.q}</span>
                    <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }} style={{ color: accent }} className="text-lg leading-none">
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease }}
                      >
                        <p className="px-4 pb-4 text-sm leading-relaxed text-[#9DABBB]">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </FadeIn>

        {/* Cross links */}
        {p.crossLinks.length > 0 && (
          <FadeIn className="promo-main__crosslinks mt-12" delay={0.05}>
            <h2 className="mb-4 text-center text-lg font-bold">{L.others}</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {p.crossLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="rounded-xl px-3.5 py-2 text-sm font-semibold transition-all hover:scale-[1.03]"
                  style={{
                    background: `${accent}14`,
                    border: `1px solid ${accent}33`,
                    color: '#F2F6FA',
                  }}
                >
                  {l.label} →
                </a>
              ))}
            </div>
          </FadeIn>
        )}

      <p className="promo-main__responsible mt-12 text-center text-[11px] text-[#6B7A8C]">
          18+ · {L.responsible} · {p.lang === 'en' ? 'No future result is guaranteed.' : p.lang === 'ar' ? 'لا توجد ضمانات مستقبلية.' : 'Aucun résultat futur n’est garanti.'}
        </p>
      </main>
    </div>
  )
}
