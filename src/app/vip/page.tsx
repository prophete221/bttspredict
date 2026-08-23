'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { AFFILIATE } from '@/lib/constants'
import { useLanguage } from '@/components/bttsbet/LanguageSwitcher'
import { translationsFor, type Locale } from '@/lib/i18n'
import { trackAffiliateAction, trackAffiliateCodeCopy } from '@/lib/affiliateTracking'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const ErrorBoundary = dynamic(() => import('@/components/bttsbet/ErrorBoundary'), { loading: () => null })
const VipUnlockModal = dynamic(() => import('@/components/bttsbet/VipUnlockModal'), { loading: () => null })

const BRAND = {
  linebet: { accent: '#B8FF1A', soft: 'rgba(184,255,26,0.12)', label: 'Linebet', code: 'VISION221' },
  '888starz': { accent: '#FF7B7B', soft: 'rgba(255,123,123,0.12)', label: '888Starz', code: 'btts221' },
} as const

type Bookmaker = keyof typeof BRAND

const copy = {
  fr: {
    eyebrow: 'ACCÈS PRIVÉ · VIP',
    title: 'Débloque ton espace VIP',
    intro: 'Un seul parcours. Choisis ton bookmaker, utilise le code affiché, puis envoie ton ID joueur pour demander l’accès.',
    primary: 'Commencer le déblocage',
    partner: '1. Choisis ton bookmaker',
    codeLabel: 'Ton code est copié automatiquement',
    copy: 'Copier',
    copied: 'Copié',
    signup: 'S’inscrire sur',
    download: 'Télécharger l’application',
    stepTwo: '2. Inscris-toi avec le code et effectue le dépôt demandé par le partenaire',
    stepThree: '3. Ouvre le déblocage, saisis ton ID joueur et envoie la demande sur WhatsApp',
    privacy: 'Ton ID reste dans le message WhatsApp que tu choisis d’envoyer. BTTSPredict ne le reçoit pas.',
    responsible: '18+ · Aucun gain n’est garanti. Vérifie toujours les conditions du partenaire.',
    modalTitle: 'Prépare ta demande VIP',
    linebetCode: 'Code VISION221',
    star888Code: 'Code btts221',
    selected: 'Sélectionné',
    unlock: 'Débloquer avec WhatsApp',
  },
  en: {
    eyebrow: 'PRIVATE ACCESS · VIP',
    title: 'Unlock your VIP access',
    intro: 'One clear path. Choose your bookmaker, use the displayed code, then send your player ID to request access.',
    primary: 'Start unlocking',
    partner: '1. Choose your bookmaker',
    codeLabel: 'Your code is copied automatically',
    copy: 'Copy',
    copied: 'Copied',
    signup: 'Sign up on',
    download: 'Download the app',
    stepTwo: '2. Register with the code and make the deposit requested by the partner',
    stepThree: '3. Open the unlock flow, enter your player ID and send the request on WhatsApp',
    privacy: 'Your ID stays in the WhatsApp message you choose to send. BTTSPredict does not receive it.',
    responsible: '18+ · No profit is guaranteed. Always check the partner’s terms.',
    modalTitle: 'Prepare your VIP request',
    linebetCode: 'Code VISION221',
    star888Code: 'Code btts221',
    selected: 'Selected',
    unlock: 'Unlock with WhatsApp',
  },
  ar: {
    eyebrow: 'وصول خاص · VIP',
    title: 'افتح وصولك إلى VIP',
    intro: 'مسار واضح واحد. اختر شركة المراهنات، استخدم الرمز الظاهر، ثم أرسل معرف اللاعب لطلب الوصول.',
    primary: 'بدء فتح الوصول',
    partner: '1. اختر شركة المراهنات',
    codeLabel: 'يتم نسخ الرمز تلقائياً',
    copy: 'نسخ',
    copied: 'تم النسخ',
    signup: 'التسجيل في',
    download: 'تحميل التطبيق',
    stepTwo: '2. سجّل بالرمز وأجرِ الإيداع الذي تحدده الشركة',
    stepThree: '3. افتح مسار التحقق، أدخل معرف اللاعب وأرسل الطلب عبر واتساب',
    privacy: 'يبقى معرفك داخل رسالة واتساب التي تختار إرسالها. لا تستلمه BTTSPredict.',
    responsible: '18+ · لا يوجد ربح مضمون. تحقق دائماً من شروط الشريك.',
    modalTitle: 'جهّز طلب VIP',
    linebetCode: 'الرمز VISION221',
    star888Code: 'الرمز btts221',
    selected: 'محدد',
    unlock: 'فتح عبر واتساب',
  },
} as const

export default function VipPage({ initialLocale }: { initialLocale?: Locale } = {}) {
  const { lang: detectedLang } = useLanguage()
  const lang = initialLocale ?? detectedLang
  const t = translationsFor(lang)
  const text = copy[lang]
  const [bookmaker, setBookmaker] = useState<Bookmaker>('linebet')
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState('')
  const [showModal, setShowModal] = useState(false)

  const selected = BRAND[bookmaker]
  const signupLink = bookmaker === 'linebet' ? AFFILIATE.linebet : AFFILIATE.star888
  const downloadLink = bookmaker === 'linebet' ? AFFILIATE.linebetDownload : AFFILIATE.star888Download
  const code = selected.code

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const openUnlock = () => {
    trackAffiliateAction(bookmaker, 'vip_unlock_open', 'vip-access-page')
    setShowModal(true)
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = code
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      try { document.execCommand('copy') } catch {}
      document.body.removeChild(textarea)
    }
    trackAffiliateCodeCopy(bookmaker, 'vip-access-code')
    setCopied(true)
    setToast(`${code} · ${text.copied}`)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const chooseBookmaker = (next: Bookmaker) => {
    setBookmaker(next)
    setCopied(false)
    trackAffiliateAction(next, 'promo_view', 'vip-access-page')
    const nextCode = BRAND[next].code
    navigator.clipboard?.writeText(nextCode).catch(() => undefined)
    trackAffiliateCodeCopy(next, 'vip-access-auto-copy')
  }

  return (
    <div className="vip-access-page min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <ErrorBoundary><Navbar /></ErrorBoundary>

      <main id="main-content" className="vip-access-main">
        {toast && <div className="vip-access-toast" role="status">{toast}</div>}

        <section className="vip-access-hero" aria-labelledby="vip-access-title">
          <div className="vip-access-hero__glow" aria-hidden="true" />
          <div className="vip-access-shell">
            <div className="vip-access-kicker"><span aria-hidden="true" />{text.eyebrow}</div>
            <div className="vip-access-hero__grid">
              <div className="vip-access-hero__copy">
                <h1 id="vip-access-title">{text.title}</h1>
                <p>{text.intro}</p>
                <div className="vip-access-proof" aria-label="VIP access information">
                  <span><b>01</b> {t.hero.btts}</span>
                  <span><b>02</b> {t.hero.goals}</span>
                  <span><b>03</b> {t.hero.exact}</span>
                </div>
              </div>
              <div className="vip-access-hero__lock" aria-hidden="true">
                <div className="vip-access-lock-ring"><span>VIP</span></div>
                <div className="vip-access-hero__lock-line" />
                <small>18+ · VERIFIED ACCESS</small>
              </div>
            </div>
          </div>
        </section>

        <section className="vip-access-panel vip-access-shell" aria-labelledby="vip-access-flow-title">
          <div className="vip-access-panel__header">
            <div>
              <span className="vip-access-overline">VIP ACCESS FLOW</span>
              <h2 id="vip-access-flow-title">{text.partner}</h2>
            </div>
            <span className="vip-access-status"><i aria-hidden="true" /> {text.selected}</span>
          </div>

          <div className="vip-access-partners" role="group" aria-label={text.partner}>
            {(Object.keys(BRAND) as Bookmaker[]).map((key) => {
              const brand = BRAND[key]
              const isSelected = bookmaker === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => chooseBookmaker(key)}
                  className={`vip-access-partner ${isSelected ? 'is-selected' : ''}`}
                  style={isSelected ? { '--vip-brand': brand.accent, '--vip-brand-soft': brand.soft } as React.CSSProperties : undefined}
                  aria-pressed={isSelected}
                >
                  <span className="vip-access-partner__logo"><img src={key === 'linebet' ? '/logos/linebet-provided.jpg' : '/logos/888starz-provided.webp'} alt={`${brand.label} logo`} /></span>
                  <span className="vip-access-partner__body"><strong>{brand.label}</strong><small>{key === 'linebet' ? text.linebetCode : text.star888Code}</small></span>
                  {isSelected && <span className="vip-access-partner__check" aria-hidden="true">✓</span>}
                </button>
              )
            })}
          </div>

          <div className="vip-access-code" style={{ '--vip-brand': selected.accent, '--vip-brand-soft': selected.soft } as React.CSSProperties}>
            <div>
              <span>{text.codeLabel}</span>
              <strong>{code}</strong>
            </div>
            <button type="button" onClick={copyCode} className="vip-access-code__copy" aria-label={`${text.copy} ${code}`}>
              <span aria-hidden="true">{copied ? '✓' : '⧉'}</span>{copied ? text.copied : text.copy}
            </button>
          </div>

          <div className="vip-access-actions">
            <a
              href={signupLink}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              onClick={() => trackAffiliateAction(bookmaker, 'signup', 'vip-access-page')}
              className="vip-access-primary"
              data-cta="vip-access-signup"
            >
              {text.signup} {selected.label} <span aria-hidden="true">↗</span>
            </a>
            <a
              href={downloadLink}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              onClick={() => trackAffiliateAction(bookmaker, 'download', 'vip-access-page')}
              className="vip-access-secondary"
              data-cta="vip-access-download"
            >
              {text.download}
            </a>
          </div>

          <div className="vip-access-steps" aria-label="VIP activation steps">
            <div className="vip-access-step vip-access-step--active"><span>1</span><p>{text.partner.replace(/^\d+\.\s*/, '')}</p></div>
            <div className="vip-access-step"><span>2</span><p>{text.stepTwo.replace(/^\d+\.\s*/, '')}</p></div>
            <div className="vip-access-step"><span>3</span><p>{text.stepThree.replace(/^\d+\.\s*/, '')}</p></div>
          </div>

          <button type="button" onClick={openUnlock} className="vip-access-unlock" data-cta="vip-access-unlock">
            <span className="vip-access-unlock__icon" aria-hidden="true">⌁</span>
            <span>{text.primary}</span>
            <span aria-hidden="true">→</span>
          </button>

          <p className="vip-access-privacy">{text.privacy}</p>
          <p className="vip-access-responsible">{text.responsible}</p>
        </section>
      </main>

      <ErrorBoundary><Footer /></ErrorBoundary>

      <VipUnlockModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={text.modalTitle}
      />
    </div>
  )
}
