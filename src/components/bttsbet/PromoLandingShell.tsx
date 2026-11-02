'use client'

import { useState, useEffect, useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
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
  }>
}

const ease = [0.22, 1, 0.36, 1] as const

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

function Marquee({ items, accent }: { items: string[]; accent: string }) {
  const doubled = [...items, ...items]
  return (
    <div className="relative overflow-hidden py-3" style={{ borderTop: `1px solid ${accent}22`, borderBottom: `1px solid ${accent}22` }}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12" style={{ background: 'linear-gradient(90deg,#0B0F14,transparent)' }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12" style={{ background: 'linear-gradient(270deg,#0B0F14,transparent)' }} />
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((b, i) => (
          <span key={`${b}-${i}`} className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em]" style={{ color: accent }}>
            {b}
            <span className="mx-4 opacity-40">◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export default function PromoLandingShell(p: PromoLandingProps) {
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const { scrollYProgress } = useScroll()
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  const L = {
    copy: p.labels?.copy ?? (p.lang === 'en' ? 'Copy code' : p.lang === 'ar' ? 'نسخ الرمز' : 'Copier le code'),
    copied: p.labels?.copied ?? (p.lang === 'en' ? 'Copied!' : p.lang === 'ar' ? 'تم النسخ!' : 'Copié !'),
    copyFailed: p.labels?.copyFailed ?? (p.lang === 'en' ? 'Copy failed — select the code' : p.lang === 'ar' ? 'فشل النسخ' : 'Copie échouée — sélectionne le code'),
    signup: p.labels?.signup ?? (p.lang === 'en' ? `Sign up on ${p.brand}` : p.lang === 'ar' ? `سجّل على ${p.brand}` : `S'inscrire sur ${p.brand}`),
    download: p.labels?.download ?? (p.lang === 'en' ? 'Download APK' : p.lang === 'ar' ? 'تحميل APK' : 'Télécharger l’APK'),
    codeLabel: p.labels?.codeLabel ?? (p.lang === 'en' ? 'Promo code' : p.lang === 'ar' ? 'رمز ترويجي' : 'Code promo'),
    howTitle: p.labels?.howTitle ?? (p.lang === 'en' ? 'How to activate' : p.lang === 'ar' ? 'كيفية التفعيل' : 'Comment activer'),
    faqTitle: p.labels?.faqTitle ?? (p.lang === 'en' ? 'FAQ' : p.lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'),
    others: p.labels?.others ?? (p.lang === 'en' ? 'Other partners' : p.lang === 'ar' ? 'شركاء آخرون' : 'Autres partenaires'),
    stickySignup: p.labels?.stickySignup ?? (p.lang === 'en' ? 'Sign up' : p.lang === 'ar' ? 'سجّل' : "S'inscrire"),
    responsible: p.labels?.responsible ?? (p.lang === 'en' ? 'Play responsibly' : p.lang === 'ar' ? 'العب بمسؤولية' : 'Jouez responsable'),
  }

  const accent = p.accent
  const soft = p.accentSoft ?? `${accent}33`

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
    <div className="relative min-h-screen overflow-x-hidden text-[#F2F6FA]" style={{ backgroundColor: '#070B12' }}>
      {/* Scroll progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[80] h-[3px] origin-left"
        style={{ scaleX: 1, width: progressWidth, background: `linear-gradient(90deg, ${accent}, #fff)` }}
      />

      {/* Ambient orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <motion.div
          className="absolute -top-32 -left-20 h-80 w-80 rounded-full blur-[100px]"
          style={{ background: soft }}
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 -right-24 h-96 w-96 rounded-full blur-[120px] opacity-60"
          style={{ background: soft }}
          animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '28px 28px' }} />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-32 pt-10 sm:pt-14">
        {/* Hero */}
        <section className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: accent, border: `1px solid ${accent}55`, background: `${accent}14` }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: accent }} />
            {p.badge}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease }}
            className="mt-5 text-3xl font-black leading-tight sm:text-5xl"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {p.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.15, ease }}
            className="mx-auto mt-6 flex min-h-[72px] max-w-[300px] items-center justify-center rounded-2xl px-5 py-3 shadow-2xl sm:max-w-[360px]"
            style={{
              backgroundColor: p.logoBg,
              boxShadow: `0 20px 50px ${accent}33`,
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
            className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#9DABBB] sm:text-base"
          >
            {p.intro}
          </motion.p>

          {/* Code + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease }}
            className="mx-auto mt-8 max-w-md"
          >
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9DABBB]">{L.codeLabel}</p>
            <button
              type="button"
              onClick={handleCopy}
              data-cta={`promo-copy-${p.bookmakerId}`}
              className="group relative w-full overflow-hidden rounded-2xl px-4 py-4 transition-transform active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`,
                boxShadow: `0 12px 40px ${accent}55`,
              }}
              aria-label={`${p.code} — ${L.copy}`}
            >
              <span className="relative z-10 font-mono text-2xl font-black tracking-[0.25em] text-white sm:text-3xl">{p.code}</span>
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
              <p className="mt-2 text-xs text-[#F87171]" role="alert">{L.copyFailed} ({p.code})</p>
            )}

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <a
                href={p.signupUrl}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                onClick={() => trackAffiliateAction(p.bookmakerId, 'signup_cta_click', `promo-hero-${p.lang}`)}
                data-cta={`promo-signup-${p.bookmakerId}`}
                className="rounded-xl py-3.5 text-center text-sm font-bold text-white transition-transform active:scale-[0.98]"
                style={{ backgroundColor: accent, boxShadow: `0 8px 28px ${accent}44` }}
              >
                {L.signup} →
              </a>
              <a
                href={p.downloadUrl}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                onClick={() => trackAffiliateAction(p.bookmakerId, 'download_click', `promo-apk-${p.lang}`)}
                data-cta={`promo-apk-${p.bookmakerId}`}
                className="rounded-xl py-3.5 text-center text-sm font-bold transition-transform active:scale-[0.98]"
                style={{
                  color: '#F2F6FA',
                  border: `1px solid ${accent}66`,
                  background: `${accent}14`,
                }}
              >
                {L.download}
              </a>
            </div>
          </motion.div>
        </section>

        {/* Marquee */}
        <div className="mt-10">
          <Marquee items={p.benefits} accent={accent} />
        </div>

        {/* Offer card */}
        <FadeIn className="mt-10" delay={0.05}>
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
        <FadeIn className="mt-12" delay={0.05}>
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
        <FadeIn className="mt-12" delay={0.05}>
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
          <FadeIn className="mt-12" delay={0.05}>
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

        <p className="mt-12 text-center text-[11px] text-[#6B7A8C]">
          18+ · {L.responsible} · {p.lang === 'en' ? 'No future result is guaranteed.' : p.lang === 'ar' ? 'لا توجد ضمانات مستقبلية.' : 'Aucun résultat futur n’est garanti.'}
        </p>
      </main>

      {/* Sticky mobile CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 px-3 py-2.5 backdrop-blur-xl md:hidden"
        style={{
          background: 'rgba(7, 11, 18, 0.92)',
          paddingBottom: 'max(0.65rem, env(safe-area-inset-bottom))',
        }}
      >
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="h-12 shrink-0 rounded-xl px-3 font-mono text-sm font-bold"
            style={{ border: `1px solid ${accent}55`, background: '#111827', color: copied ? '#34D399' : '#F2F6FA' }}
            data-cta={`promo-sticky-copy-${p.bookmakerId}`}
          >
            {copied ? '✓' : p.code}
          </button>
          <a
            href={p.signupUrl}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            onClick={() => trackAffiliateAction(p.bookmakerId, 'signup_cta_click', `promo-sticky-${p.lang}`)}
            data-cta={`promo-sticky-signup-${p.bookmakerId}`}
            className="flex h-12 flex-1 items-center justify-center rounded-xl text-sm font-bold text-white"
            style={{ background: accent, boxShadow: `0 8px 24px ${accent}44` }}
          >
            {L.stickySignup} · {p.code}
          </a>
        </div>
      </div>
    </div>
  )
}
