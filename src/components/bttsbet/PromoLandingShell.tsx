'use client'

import { useState, useEffect, type CSSProperties } from 'react'
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
    copy: string; copied: string; copyFailed: string; signup: string; download: string
    codeLabel: string; howTitle: string; faqTitle: string; others: string
    stickySignup: string; responsible: string; affiliateDisclosure: string
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
    copied: p.labels?.copied ?? (p.lang === 'en' ? 'Copied!' : p.lang === 'ar' ? 'تم النسخ!' : 'Copié !'),
    copyFailed: p.labels?.copyFailed ?? (p.lang === 'en' ? 'Copy failed — select the code' : p.lang === 'ar' ? 'فشل النسخ' : 'Copie échouée — sélectionne le code'),
    signup: p.labels?.signup ?? (p.lang === 'en' ? `Open ${p.brand}` : p.lang === 'ar' ? `افتح ${p.brand}` : `Consulter ${p.brand}`),
    download: p.labels?.download ?? (p.lang === 'en' ? 'Download APK' : p.lang === 'ar' ? 'تحميل APK' : 'Télécharger l’APK'),
    codeLabel: p.labels?.codeLabel ?? (p.lang === 'en' ? 'Promo code' : p.lang === 'ar' ? 'رمز ترويجي' : 'Code promo'),
    howTitle: p.labels?.howTitle ?? (p.lang === 'en' ? 'Using the code' : p.lang === 'ar' ? 'استخدام الرمز' : 'Utiliser le code'),
    faqTitle: p.labels?.faqTitle ?? (p.lang === 'en' ? 'FAQ' : p.lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'),
    others: p.labels?.others ?? (p.lang === 'en' ? 'Other offers' : p.lang === 'ar' ? 'عروض أخرى' : 'Autres offres'),
    responsible: p.labels?.responsible ?? (p.lang === 'en' ? 'Play responsibly' : p.lang === 'ar' ? 'العب بمسؤولية' : 'Jouez responsable'),
    affiliateDisclosure: p.labels?.affiliateDisclosure ?? (p.lang === 'en'
      ? 'Links to the operator are affiliate links; BTTSPredict may receive a commission if you use them.'
      : p.lang === 'ar'
        ? 'روابط المشغّل تابعة؛ قد تحصل BTTSPredict على عمولة عند استخدامها.'
        : 'Les liens vers l’opérateur sont affiliés ; BTTSPredict peut percevoir une commission si vous les utilisez.'),
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
    <main
      data-promo-shell
      data-bookmaker={p.bookmakerId}
      lang={p.lang}
      dir={p.lang === 'ar' ? 'rtl' : 'ltr'}
      className="bp-promo"
      style={{ '--bp-promo-accent': p.accent, '--bp-promo-logo-bg': p.logoBg } as CSSProperties}
    >
      <div className="bp-promo__main">
        <header className="bp-promo__hero">
          <div className="bp-promo__identity">
            <span className="bp-promo__badge"><i />{p.badge}</span>
            <div className="bp-promo__logo"><img src={p.logo} alt={`${p.brand} logo`} width={p.logoW ?? 200} height={p.logoH ?? 56} /></div>
          </div>
          <div className="bp-promo__copy">
            <p className="bp-promo__overline">BTTSPREDICT <span>·</span> {p.brand}</p>
            <h1>{renderTitleWithCode(p.title, p.code)}</h1>
            <p className="bp-promo__intro">{p.intro}</p>
          </div>
        </header>

        <section className="bp-promo__code" aria-label={L.codeLabel}>
          <div className="bp-promo__code-label">{L.codeLabel}</div>
          <button type="button" className="bp-promo__copy-button" onClick={handleCopy} data-cta={`promo-copy-${p.bookmakerId}`} aria-label={`${p.code} — ${L.copy}`}>
            <bdi dir="ltr">{p.code}</bdi>
            <span>{copied ? L.copied : L.copy}</span>
          </button>
          {copyFailed && <p className="bp-promo__copy-error" role="alert">{L.copyFailed}</p>}
          <div className="bp-promo__actions">
            <a href={p.signupUrl} target="_blank" rel="sponsored nofollow noopener noreferrer" onClick={() => trackAffiliateAction(p.bookmakerId, 'signup_cta_click', `promo-hero-${p.lang}`)} data-cta={`promo-signup-${p.bookmakerId}`}>
              <img src={p.logo} alt="" width={22} height={22} />{L.signup}<span aria-hidden="true">↗</span>
            </a>
            <a href={p.downloadUrl} target="_blank" rel="sponsored nofollow noopener noreferrer" onClick={() => trackAffiliateAction(p.bookmakerId, 'download_click', `promo-apk-${p.lang}`)} data-cta={`promo-apk-${p.bookmakerId}`}>
              <img src="/logos/google-play.svg" alt="" width={20} height={20} />{L.download}<span aria-hidden="true">↓</span>
            </a>
          </div>
          <p className="bp-promo__disclosure" data-affiliate-disclosure>{L.affiliateDisclosure}</p>
        </section>

        <section className="bp-promo__offer">
          <div><span>{p.brand}</span><h2>{p.offerHeadline}</h2><p>{p.offerSub}</p></div>
          <ul>{p.benefits.map(item => <li key={item}><i aria-hidden="true">✓</i>{item}</li>)}</ul>
        </section>

        <section className="bp-promo__steps">
          <header><p>{p.brand}</p><h2>{L.howTitle}</h2></header>
          <ol>{p.steps.map(step => <li key={step.n}><span>{step.n}</span><div><h3>{step.title}</h3><p>{step.desc}</p></div></li>)}</ol>
        </section>

        <section className="bp-promo__faq">
          <h2>{L.faqTitle}</h2>
          <div>{p.faq.map((item, index) => <article key={item.q} className={openFaq === index ? 'is-open' : ''}>
            <button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? null : index)}>
              <span>{item.q}</span><b aria-hidden="true">{openFaq === index ? '−' : '+'}</b>
            </button>
            {openFaq === index && <p>{item.a}</p>}
          </article>)}</div>
        </section>

        {p.crossLinks.length > 0 && <nav className="bp-promo__other" aria-label={L.others}>
          <h2>{L.others}</h2><div>{p.crossLinks.map(link => <a href={link.href} key={link.href}>{link.label}<span aria-hidden="true">→</span></a>)}</div>
        </nav>}

        <footer className="bp-promo__footer">
          <p>18+ · {L.responsible} · {p.lang === 'en' ? 'No future result is guaranteed.' : p.lang === 'ar' ? 'لا توجد ضمانات مستقبلية.' : 'Aucun résultat futur n’est garanti.'}</p>
          <p>{L.affiliateDisclosure}</p>
        </footer>
      </div>
    </main>
  )
}
