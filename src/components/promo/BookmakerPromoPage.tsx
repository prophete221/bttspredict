'use client'

/**
 * BookmakerPromoPage — page « code promo » unifiée pour les 4 bookmakers
 * partenaires (Linebet, 1xBet, Melbet, 888Starz).
 *
 * Remplace les anciens clients promo hétérogènes (LinebetClient 599 lignes,
 * LocalizedPromoClient…) par UNE source de vérité :
 *   - registre : src/lib/bookmakers.ts (codes, liens, logos, priorités)
 *   - libellés : src/lib/promo-i18n.ts (fr / en / ar)
 *
 * Design (refonte 2026-11) :
 *   - logo RÉEL du bookmaker (pastille claire), H1 clair, badge d'offre.
 *   - carte code promo = cœur de conversion : code + copie trackée +
 *     bouton INSCRIPTION + bouton APK + raccourci « copier et s'inscrire ».
 *   - AUCUNE section répétée : FAQ unique, un seul bloc CTA par intention.
 *   - <details> natifs pour la FAQ (robustes, accessibles, RTL-safe).
 *   - Mobile-first : colonnes empilées <640px, cibles tactiles ≥ 44 px.
 */

import { useCallback, useState } from 'react'
import { localizedPath, type Locale } from '@/lib/i18n'
import {
  getBookmaker,
  offerShort,
  BOOKMAKER_ORDER,
  type BookmakerId,
} from '@/lib/bookmakers'
import { PROMO_I18N, fillTokens } from '@/lib/promo-i18n'
import { trackAffiliateAction, trackAffiliateCodeCopy } from '@/lib/affiliateTracking'
import { copyTextToClipboard } from '@/lib/clipboard'
import { useLanguage } from '../bttsbet/LanguageSwitcher'

const REL = 'sponsored nofollow noopener noreferrer'

export default function BookmakerPromoPage({
  bookmaker,
  reviewDate,
  initialLocale,
}: {
  bookmaker: BookmakerId
  reviewDate?: string
  initialLocale?: Locale
}) {
  const { lang: detectedLang } = useLanguage()
  const lang = initialLocale ?? detectedLang
  const t = PROMO_I18N[lang]
  const b = getBookmaker(bookmaker)
  const effectiveReviewDate = reviewDate || new Date().toISOString().slice(0, 10)

  const [copied, setCopied] = useState(false)
  const [copiedInstant, setCopiedInstant] = useState(false)

  const vars = {
    brand: b.name,
    code: b.promoCode,
    bonus: b.offer.bonus ?? t.genericBonus,
    freeSpins: b.offer.freeSpins ?? '',
    wagering: b.offer.wagering,
    minDeposit: b.offer.minDeposit,
  }

  const hasFullOffer = Boolean(b.offer.bonus)

  const copyCode = useCallback(async () => {
    const ok = await copyTextToClipboard(b.promoCode)
    if (!ok) return
    trackAffiliateCodeCopy(b.id, 'promo-page-code-card')
    setCopied(true)
    setTimeout(() => setCopied(false), 2400)
  }, [b.id, b.promoCode])

  const copyAndGo = useCallback(async () => {
    const ok = await copyTextToClipboard(b.promoCode)
    if (ok) {
      trackAffiliateCodeCopy(b.id, 'promo-page-instant')
      setCopiedInstant(true)
      setTimeout(() => setCopiedInstant(false), 2400)
    }
  }, [b.id, b.promoCode])

  const fill = (s: string) => fillTokens(s, vars)

  const offerDetails = t.offerDetails.map(({ label, value }) => ({
    label,
    value: fill(value)
      .replaceAll('{freeSpins}', b.offer.freeSpins ?? '—')
      .replaceAll('{bonus}', b.offer.bonus ?? t.genericBonus)
      .replaceAll('{wagering}', b.offer.wagering),
  }))

  return (
    <div className="promo-page mx-auto max-w-[860px] px-4 pb-14 pt-6 sm:px-6">
      {/* ═══ Fil d'Ariane ═══ */}
      <nav aria-label="Breadcrumb" className="mb-5 text-[13px] text-[var(--color-text-secondary)]">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><a href={localizedPath('/', lang)} className="hover:text-[var(--color-text-primary)] hover:underline">{t.breadcrumbLabel}</a></li>
          <li aria-hidden="true">/</li>
          <li><a href="#autres-codes" className="hover:text-[var(--color-text-primary)] hover:underline">{lang === 'en' ? 'Promo codes' : lang === 'ar' ? 'الرموز الترويجية' : 'Codes promo'}</a></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-[var(--color-text-primary)]">{b.name}</li>
        </ol>
      </nav>

      {/* ═══ En-tête : logo réel + H1 + badge offre ═══ */}
      <header className="mb-8 text-center">
        <div className="promo-logo-plate mx-auto mb-5">
          <img
            src={b.logo}
            alt={`${b.name} — logo officiel`}
            width={168}
            height={56}
            className="promo-logo-img"
            loading="eager"
            decoding="async"
          />
        </div>

        <p className="promo-eyebrow mb-3">
          <span className="promo-eyebrow__dot" aria-hidden="true" />
          {t.eyebrow} · {effectiveReviewDate.slice(0, 4)}
        </p>

        <h1 className="promo-title">
          {t.titlePrefix} <span className="promo-title__brand">{b.name}</span>{' '}
          <span className="promo-title__code">{b.promoCode}</span>
        </h1>

        <p className="mx-auto mt-4 max-w-[560px] text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
          {fill(hasFullOffer ? t.introLine : t.introLineGeneric)}
        </p>

        <p className="promo-offer-badge mx-auto mt-4 inline-flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          {hasFullOffer ? `${offerShort(b)} · ${b.offer.wagering}` : t.offerBadge}
        </p>
      </header>

      {/* ═══ CARTE CODE — cœur de conversion ═══ */}
      <section className="promo-code-card mb-10" aria-labelledby="promo-code-heading">
        <h2 id="promo-code-heading" className="promo-code-card__label">
          {t.codeLabel} {b.name}
        </h2>

        <div className="promo-code-display">
          <span className="promo-code-display__value" data-promo-code={b.id}>{b.promoCode}</span>
          <button
            onClick={copyCode}
            className="promo-copy-btn"
            data-cta={`promo-copy-${b.id}`}
            aria-label={`${t.copy} ${b.promoCode}`}
          >
            {copied ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                {t.copied}
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                {t.copy}
              </>
            )}
          </button>
        </div>
        <p className="promo-code-hint">{t.codeCaseHint(b.promoCodeIsCaps)}</p>

        {/* CTAs principaux — inscription + APK */}
        <div className="promo-ctas">
          <a
            href={b.signup}
            target="_blank"
            rel={REL}
            onClick={() => trackAffiliateAction(b.id, 'signup_cta_click', 'promo-page-primary')}
            className="promo-cta promo-cta--signup"
            data-cta={`promo-signup-${b.id}`}
            style={{ '--bm-accent': b.accent } as React.CSSProperties}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            {fill(t.signupCta)}
          </a>
          <a
            href={b.download}
            target="_blank"
            rel={REL}
            onClick={() => trackAffiliateAction(b.id, 'apk_click', 'promo-page-apk')}
            className="promo-cta promo-cta--apk"
            data-cta={`promo-apk-${b.id}`}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {t.apkCta}
          </a>
        </div>

        {/* Raccourci : copier + s'inscrire */}
        <a
          href={b.signup}
          target="_blank"
          rel={REL}
          onClick={copyAndGo}
          className="promo-instant"
          data-cta={`promo-instant-${b.id}`}
        >
          {copiedInstant ? `✓ ${t.copied}` : `${t.instantCta} →`}
        </a>

        <p className="promo-verified">
          <span className="promo-status-dot" aria-hidden="true" />
          {t.verifiedNote} {effectiveReviewDate}
        </p>
      </section>

      {/* ═══ Détails de l'offre ═══ */}
      <section className="promo-section" aria-labelledby="offre-titre">
        <h2 id="offre-titre" className="promo-h2">{t.offerTitle}</h2>
        <dl className="promo-offer-grid">
          {offerDetails.map(row => (
            <div key={row.label} className="promo-offer-row">
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ═══ Étapes ═══ */}
      <section className="promo-section" aria-labelledby="etapes-titre">
        <h2 id="etapes-titre" className="promo-h2">{fill(t.stepsTitle)}</h2>
        <ol className="promo-steps">
          {t.steps.map((step, i) => (
            <li key={i} className="promo-step">
              <span className="promo-step__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="promo-step__title">{fill(step.title)}</h3>
                <p className="promo-step__desc">{fill(step.desc)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ═══ Pourquoi ce bookmaker ═══ */}
      <section className="promo-section" aria-labelledby="pourquoi-titre">
        <h2 id="pourquoi-titre" className="promo-h2">{fill(t.whyTitle)}</h2>
        <div className="promo-why-grid">
          {t.why.map((item, i) => (
            <div key={i} className="promo-why-card">
              <h3 className="promo-why-card__title">{fill(item.title)}</h3>
              <p className="promo-why-card__desc">{fill(item.desc)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Dépôts & retraits ═══ */}
      <section className="promo-section" aria-labelledby="depots-titre">
        <h2 id="depots-titre" className="promo-h2">{t.depositsTitle}</h2>
        <p className="promo-sub">{fill(t.depositsSub)}</p>
        <ul className="promo-chips" aria-label={`${t.depositsTitle} · ${t.payoutsLabel}`}>
          {t.payouts.map(p => (
            <li key={p} className="promo-chip">{p}</li>
          ))}
        </ul>
      </section>

      {/* ═══ FAQ — instance unique ═══ */}
      <section className="promo-section" aria-labelledby="faq-titre">
        <h2 id="faq-titre" className="promo-h2">{t.faqTitle}</h2>
        <div className="promo-faq">
          {t.faq.map((item, i) => (
            <details key={i} className="promo-faq__item" {...(i === 0 ? { open: true } : {})}>
              <summary>{fill(item.q)}</summary>
              <div className="promo-faq__a">{fill(item.a)}</div>
            </details>
          ))}
        </div>
      </section>

      {/* ═══ Autres codes promo — Linebet/1xBet d'abord ═══ */}
      <section id="autres-codes" className="promo-section" aria-labelledby="autres-titre" style={{ scrollMarginTop: '96px' }}>
        <h2 id="autres-titre" className="promo-h2">{t.otherCodesTitle}</h2>
        <p className="promo-sub">{t.otherCodesSub}</p>
        <div className="promo-codes-grid">
          {BOOKMAKER_ORDER.map(id => {
            const other = getBookmaker(id)
            const isCurrent = id === bookmaker
            return (
              <a
                key={id}
                href={isCurrent ? undefined : localizedPath(other.promoPath, lang)}
                className={`promo-code-mini${isCurrent ? ' is-current' : ''}`}
                aria-current={isCurrent ? 'page' : undefined}
                data-cta={isCurrent ? undefined : `promo-cross-${other.id}`}
              >
                {other.featured && !isCurrent && <span className="promo-code-mini__star">{lang === 'en' ? 'Priority' : lang === 'ar' ? 'أولوية' : 'Prioritaire'}</span>}
                <img src={other.logo} alt="" width={92} height={26} loading="lazy" decoding="async" className="promo-code-mini__logo" />
                <span className="promo-code-mini__code">{other.promoCode}</span>
                <span className="promo-code-mini__offer">{offerShort(other)}</span>
              </a>
            )
          })}
        </div>
      </section>

      {/* ═══ Jeu responsable ═══ */}
      <aside className="promo-responsible">
        <span className="promo-responsible__18">18+</span>
        <p>{t.responsible}</p>
      </aside>
    </div>
  )
}
