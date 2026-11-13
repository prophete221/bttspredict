'use client'

import { useEffect, useState } from 'react'
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

function renderTitleWithCode(title: string, code: string) {
  const index = title.indexOf(code)
  if (index < 0) return title
  return <>{title.slice(0, index)}<bdi dir="ltr">{code}</bdi>{title.slice(index + code.length)}</>
}

export default function PromoLandingShell(p: PromoLandingProps) {
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const L = {
    copy: p.labels?.copy ?? (p.lang === 'en' ? 'Copy code' : p.lang === 'ar' ? 'نسخ الرمز' : 'Copier le code'),
    copied: p.labels?.copied ?? (p.lang === 'en' ? 'Copied' : p.lang === 'ar' ? 'تم النسخ' : 'Code copié'),
    copyFailed: p.labels?.copyFailed ?? (p.lang === 'en' ? 'Select the code to copy it.' : p.lang === 'ar' ? 'حدّد الرمز لنسخه.' : 'Sélectionne le code pour le copier.'),
    signup: p.labels?.signup ?? (p.lang === 'en' ? `Visit ${p.brand}` : p.lang === 'ar' ? `زيارة ${p.brand}` : `Voir l’offre chez ${p.brand}`),
    download: p.labels?.download ?? (p.lang === 'en' ? 'Download APK' : p.lang === 'ar' ? 'تحميل APK' : 'Télécharger l’APK'),
    codeLabel: p.labels?.codeLabel ?? (p.lang === 'en' ? 'Promo code' : p.lang === 'ar' ? 'الرمز الترويجي' : 'Code promo'),
    howTitle: p.labels?.howTitle ?? (p.lang === 'en' ? 'How to use the code' : p.lang === 'ar' ? 'Utiliser le code' : 'Utiliser le code'),
    faqTitle: p.labels?.faqTitle ?? (p.lang === 'en' ? 'Terms and questions' : p.lang === 'ar' ? 'الشروط والأسئلة' : 'Conditions et questions'),
    others: p.labels?.others ?? (p.lang === 'en' ? 'Other partner guides' : p.lang === 'ar' ? 'أدلة الشركاء' : 'Autres guides partenaires'),
    stickySignup: p.labels?.stickySignup ?? (p.lang === 'en' ? 'Visit' : p.lang === 'ar' ? 'زيارة' : 'Voir'),
    responsible: p.labels?.responsible ?? (p.lang === 'en' ? 'Play responsibly' : p.lang === 'ar' ? 'العب بمسؤولية' : 'Jouer de façon responsable'),
    affiliateDisclosure: p.labels?.affiliateDisclosure ?? (p.lang === 'en'
      ? 'This page contains affiliate links. BTTSPredict may receive a commission at no extra cost to you.'
      : p.lang === 'ar'
        ? 'تتضمن هذه الصفحة روابط تابعة. قد تحصل BTTSPredict على عمولة دون تكلفة إضافية عليك.'
        : 'Cette page contient des liens affiliés. BTTSPredict peut percevoir une commission, sans coût supplémentaire pour vous.'),
  }

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
      window.setTimeout(() => setCopied(false), 2200)
    } else {
      setCopyFailed(true)
      window.setTimeout(() => setCopyFailed(false), 3000)
    }
  }

  return (
    <div
      data-promo-shell
      data-bookmaker={p.bookmakerId}
      lang={p.lang}
      dir={p.lang === 'ar' ? 'rtl' : 'ltr'}
      className={`promo-shell promo-shell--editorial promo-shell--${p.bookmakerId}`}
    >
      <main className="promo-editorial">
        <header className="promo-editorial__header">
          <a href={p.lang === 'fr' ? '/' : `/${p.lang}`} className="promo-editorial__brand">BTTSPredict <span>/</span> Guides partenaires</a>
          <span className="promo-editorial__age">18+</span>
        </header>

        <section className="promo-editorial__hero" aria-labelledby="promo-title">
          <div className="promo-editorial__intro">
            <p className="promo-editorial__eyebrow">{p.badge}</p>
            <h1 id="promo-title">{renderTitleWithCode(p.title, p.code)}</h1>
            <p className="promo-editorial__summary">{p.intro}</p>
            <div className="promo-editorial__actions">
              <a
                href={p.signupUrl}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                onClick={() => trackAffiliateAction(p.bookmakerId, 'signup_cta_click', `promo-hero-${p.lang}`)}
                data-cta={`promo-signup-${p.bookmakerId}`}
                className="promo-editorial__primary"
              >{L.signup}<span aria-hidden="true">↗</span></a>
              <a
                href={p.downloadUrl}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                onClick={() => trackAffiliateAction(p.bookmakerId, 'download_click', `promo-apk-${p.lang}`)}
                data-cta={`promo-apk-${p.bookmakerId}`}
                className="promo-editorial__secondary"
              >{L.download}</a>
            </div>
            <p data-affiliate-disclosure className="promo-editorial__disclosure">{L.affiliateDisclosure}</p>
          </div>

          <aside className="promo-editorial__code-panel" aria-label={L.codeLabel}>
            <div className="promo-editorial__operator">
              <span className="promo-editorial__logo" style={{ backgroundColor: p.logoBg }}>
                <img src={p.logo} alt={`${p.brand} logo`} width={p.logoW ?? 160} height={p.logoH ?? 48} />
              </span>
              <span className="promo-editorial__operator-name">{p.brand}</span>
            </div>
            <p className="promo-editorial__code-label">{L.codeLabel}</p>
            <code dir="ltr" className="promo-editorial__code">{p.code}</code>
            <button type="button" onClick={handleCopy} className="promo-editorial__copy" data-cta={`promo-copy-${p.bookmakerId}`} aria-live="polite">
              {copied ? L.copied : L.copy}
            </button>
            {copyFailed && <p role="alert" className="promo-editorial__copy-error">{L.copyFailed}</p>}
            <p className="promo-editorial__offer-title">{p.offerHeadline}</p>
            <p className="promo-editorial__offer-sub">{p.offerSub}</p>
          </aside>
        </section>

        <section className="promo-editorial__facts" aria-label={p.lang === 'en' ? 'Offer details' : p.lang === 'ar' ? 'تفاصيل العرض' : 'Détails de l’offre'}>
          {p.benefits.map((benefit, index) => (
            <div className="promo-editorial__fact" key={`${p.bookmakerId}-${index}`}>
              <span>{String(index + 1).padStart(2, '0')}</span><p>{benefit}</p>
            </div>
          ))}
        </section>

        <section className="promo-editorial__section" aria-labelledby="promo-steps-title">
          <div className="promo-editorial__section-head">
            <p className="promo-editorial__eyebrow">{p.brand}</p>
            <h2 id="promo-steps-title">{L.howTitle}</h2>
          </div>
          <ol className="promo-editorial__steps">
            {p.steps.map((step, index) => (
              <li key={step.n}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><h3>{step.title}</h3><p>{step.desc}</p></div>
              </li>
            ))}
          </ol>
        </section>

        {p.faq.length > 0 && (
          <section className="promo-editorial__section" aria-labelledby="promo-faq-title">
            <div className="promo-editorial__section-head">
              <p className="promo-editorial__eyebrow">{p.brand}</p>
              <h2 id="promo-faq-title">{L.faqTitle}</h2>
            </div>
            <div className="promo-editorial__faq">
              {p.faq.map((item, index) => (
                <article key={item.q} className={openFaq === index ? 'is-open' : ''}>
                  <h3>
                    <button type="button" onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}>
                      {item.q}<span aria-hidden="true">{openFaq === index ? '−' : '+'}</span>
                    </button>
                  </h3>
                  {openFaq === index && <p>{item.a}</p>}
                </article>
              ))}
            </div>
          </section>
        )}

        {p.crossLinks.length > 0 && (
          <nav className="promo-editorial__related" aria-label={L.others}>
            <h2>{L.others}</h2>
            <div>{p.crossLinks.map((link) => <a key={link.href} href={link.href}>{link.label}<span aria-hidden="true">→</span></a>)}</div>
          </nav>
        )}

        <footer className="promo-editorial__footer">
          <span>18+</span><span>•</span><a href={p.lang === 'fr' ? '/jouer-responsable' : `/${p.lang}/jouer-responsable`}>{L.responsible}</a>
          <p>{p.lang === 'en' ? 'Bonuses are subject to the operator’s current terms and local eligibility. No betting outcome is guaranteed.' : p.lang === 'ar' ? 'تخضع المكافآت لشروط المشغّل الحالية والأهلية المحلية. لا توجد نتيجة مضمونة.' : 'Les bonus dépendent des conditions en vigueur chez l’opérateur et de votre éligibilité locale. Aucun résultat de pari n’est garanti.'}</p>
        </footer>
      </main>

      <div className="promo-editorial__sticky">
        <button type="button" onClick={handleCopy} data-cta={`promo-sticky-copy-${p.bookmakerId}`}>{copied ? L.copied : L.copy}</button>
        <a href={p.signupUrl} target="_blank" rel="sponsored nofollow noopener noreferrer" onClick={() => trackAffiliateAction(p.bookmakerId, 'signup_cta_click', `promo-sticky-${p.lang}`)} data-cta={`promo-sticky-signup-${p.bookmakerId}`}>{L.stickySignup} {p.brand}<span aria-hidden="true">↗</span></a>
      </div>
    </div>
  )
}
