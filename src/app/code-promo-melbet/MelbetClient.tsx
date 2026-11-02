'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { AFFILIATE } from '@/lib/constants'
import { trackAffiliateAction, trackAffiliateCodeCopy } from '@/lib/affiliateTracking'
import { copyTextToClipboard } from '@/lib/clipboard'

/* ─── Code promo Melbet — Bttswin (casse exacte fournie par l'affiliateur) ── */
const CODE = 'Bttswin'

/* ─── Offre Melbet — campagne 2026-11 ─────────────────────────────────────
   Offre annoncée par la campagne : 300% + 100 free spins, sans condition
   de mise — wording uniforme avec les 3 autres partenaires. L'offre
   affichée par Melbet prévaut (voir encart + disclaimer). */
const OFFER = {
  bonus: '300%',
  freeSpins: '100 free spins',
  wagering: 'Sans condition de mise',
  minDeposit: 'À vérifier sur Melbet selon ton pays',
}

/* ─── Palette locale — or Melbet ─────────────────────────────────────────── */
const GOLD = '#F7B52C'
const GOLD_LIGHT = '#FFD65E'
const PRIMARY = '#F7B52C'
const TEXT = '#F2F6FA'
const TEXT_SEC = '#9DABBB'
const BG_DARK = '#0B0F14'

/* Vrais liens d'affiliation Melbet (reçus le 2026-11) */
const MELBET_SIGNUP = AFFILIATE.melbet
const MELBET_APK = AFFILIATE.melbetDownload

/* ─── Bandeau défilant — bénéfices ────────────────────────────────────────── */
const BENEFITS = [
  '300% de bonus + 100 free spins',
  'Sans condition de mise',
  'Code Bttswin',
  'App Android & iOS',
  'Paiements mobiles (Wave, Orange Money…)',
  'International — selon éligibilité pays',
]

/* ─── Étapes (4) ──────────────────────────────────────────────────────────── */
const STEPS = [
  {
    n: '01',
    title: 'Inscris-toi via notre lien',
    desc: "Clique sur « S'inscrire sur Melbet » ci-dessous. Crée ton compte gratuit en 2 minutes avec ton email ou ton numéro.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></svg>
    ),
  },
  {
    n: '02',
    title: `Saisis le code ${CODE}`,
    desc: `Pendant l'inscription (ou dans « Code Promo » de ton compte), recopie exactement ${CODE} — respecte la casse.`,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /></svg>
    ),
  },
  {
    n: '03',
    title: 'Effectue ton premier dépôt',
    desc: 'Choisis le moyen de paiement disponible dans ton pays (Wave, Orange Money, MTN, carte…) et dépose le montant minimum affiché par Melbet.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>
    ),
  },
  {
    n: '04',
    title: 'Reçois 300% + 100 free spins',
    desc: "Les 300% de bonus et les 100 free spins, sans condition de mise, sont crédités selon l'offre affichée par Melbet. Vérifie les conditions (montant minimum, éligibilité) avant de confirmer.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]"><path d="M20 12v10H4V12" /><path d="M2 7h20v5H2z" /><path d="M12 22V7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>
    ),
  },
]

/* ─── Tableau « détails de l'offre » ─────────────────────────────────────── */
const BONUS_ROWS = [
  { label: 'Bonus', value: '300% sur le premier dépôt (offre annoncée)', highlight: true },
  { label: 'Free spins', value: '100 free spins inclus (offre annoncée)' },
  { label: 'Condition de mise', value: 'Sans condition de mise (offre annoncée)' },
  { label: 'Dépôt minimum', value: 'À vérifier sur Melbet selon ton pays' },
  { label: 'Code', value: `${CODE} (copiable — recopier tel quel)` },
  { label: 'Application', value: 'APK Android + site mobile' },
  { label: 'Pays', value: 'International — selon éligibilité pays' },
]

/* ─── Comparatif des partenaires (1xbet & Linebet en priorité) ───────────── */
const PARTNER_ROWS = [
  {
    name: '1xbet', code: 'Vipbtts', bonus: '300% + 100 free spins', note: 'Sans condition de mise', href: '/code-promo-1xbet', current: false,
  },
  {
    name: 'Linebet', code: 'VISION221', bonus: '300% + 100 free spins', note: 'Dès 1 € de dépôt', href: '/code-promo-linebet-senegal', current: false,
  },
  {
    name: 'Melbet', code: CODE, bonus: '300% + 100 free spins', note: 'Sans condition de mise', href: '', current: true,
  },
  {
    name: '888starz', code: 'btts221', bonus: '300% + 100 free spins', note: 'Dès 1 € de dépôt', href: '/bonus-888starz', current: false,
  },
]

/* ─── FAQ visible (alignée sur le JSON-LD FAQPage) ───────────────────────── */
function faqItems(year: number) {
  return [
    {
      q: 'Quel est le code promo Melbet ?',
      a: `Le code promo Melbet est ${CODE} — à recopier exactement tel quel lors de l'inscription ou dans la section « Code Promo » de ton compte Melbet.`,
    },
    {
      q: `Que donne le code ${CODE} en ${year} ?`,
      a: `Le code ${CODE} donne 300% de bonus + 100 free spins, sans condition de mise — offre annoncée par la campagne Melbet. Vérifie l'offre affichée par Melbet pour ton pays avant tout dépôt.`,
    },
    {
      q: `Où saisir le code ${CODE} sur Melbet ?`,
      a: `Saisis ${CODE} dans le champ « Code promo » du formulaire d'inscription Melbet, ou plus tard dans ton compte, section « Code Promo ». Respecte la casse exacte.`,
    },
    {
      q: 'Melbet ou 1xbet : quel code promo choisir ?',
      a: "Les deux sont nos partenaires officiels et annoncent la même offre : 300% de bonus + 100 free spins sans condition de mise, avec Bttswin (Melbet) comme avec Vipbtts (1xbet). Choisis le bookmaker que tu préfères utiliser.",
    },
    {
      q: 'Le bonus Melbet est-il valable dans tous les pays ?',
      a: "La disponibilité du code et de l'offre dépend du pays, du compte et de la période. Vérifie ton éligibilité et les conditions actuellement affichées par Melbet avant toute inscription ou dépôt.",
    },
  ]
}

/* ─── Liens internes ─────────────────────────────────────────────────────── */
const INTERNAL_LINKS = [
  { href: '/code-promo-1xbet', label: 'Code promo 1xbet' },
  { href: '/code-promo-linebet-senegal', label: 'Code promo Linebet' },
  { href: '/bonus-888starz', label: 'Code promo 888Starz' },
  { href: '/btts/predictions/today', label: 'Pronostics du jour' },
  { href: '/vip', label: 'Espace VIP' },
]

export default function MelbetClient() {
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const [toast, setToast] = useState(false)
  const year = new Date().getUTCFullYear()

  /* Mesure : 1 vue de la page promo par session */
  useEffect(() => {
    trackAffiliateAction('melbet', 'promo_view', 'code-promo-melbet-page')
  }, [])

  const showToast = () => {
    setToast(true)
    setTimeout(() => setToast(false), 2000)
  }

  const handleCopy = async () => {
    // Succès affiché UNIQUEMENT si la copie a réellement réussi
    const ok = await copyTextToClipboard(CODE)
    if (ok) {
      trackAffiliateCodeCopy('melbet', 'melbet-promo-code-card')
      setCopied(true)
      setCopyFailed(false)
      showToast()
      setTimeout(() => setCopied(false), 2000)
    } else {
      setCopyFailed(true)
      showToast()
      setTimeout(() => setCopyFailed(false), 4000)
    }
  }

  const trackSignup = () => trackAffiliateAction('melbet', 'signup_cta_click', 'melbet-promo-code-card')

  const copyLabel = copyFailed ? '⚠ Copie impossible' : copied ? 'Copié !' : `Copier le code ${CODE}`

  return (
    <>
      {/* Toast flottant — seulement après un vrai succès de copie */}
      {toast && (
        <div
          className="fixed left-1/2 top-[72px] z-[70] -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-bold"
          style={{
            backgroundColor: BG_DARK,
            color: copied ? GOLD_LIGHT : TEXT,
            border: `1px solid ${GOLD}`,
            boxShadow: '0 10px 40px rgba(247, 181, 44, 0.4)',
          }}
          role="status"
          aria-live="polite"
        >
          {copyFailed ? `⚠ Copie impossible — code : ${CODE}` : '✅ Code copié !'}
        </div>
      )}

      {/* ─────────── Barre CTA collante mobile — conversion ─────────── */}
      <div className="mel-sticky md:hidden" role="complementary" aria-label="Action rapide code promo">
        <div className="flex items-center gap-2 px-3 py-2" style={{ backgroundColor: 'rgba(7, 17, 26, 0.96)', borderTop: '1px solid rgba(247, 181, 44, 0.35)' }}>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 h-[46px] rounded-xl flex-shrink-0"
            style={{ backgroundColor: '#1B1E27', border: '1px solid rgba(247, 181, 44, 0.5)' }}
            aria-label={`Copier le code promo ${CODE}`}
            data-cta="mel-sticky-copy"
          >
            {copied ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GOLD_LIGHT} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(242, 246, 250, 0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
            )}
            <span className="font-mono text-[13px] font-bold" style={{ color: copied ? GOLD_LIGHT : '#F2F6FA' }}>
              {copied ? 'Copié!' : CODE}
            </span>
          </button>
          <a
            href={MELBET_SIGNUP}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            onClick={trackSignup}
            className="flex items-center justify-center gap-1.5 flex-1 h-[46px] rounded-xl text-sm font-bold"
            style={{ background: 'linear-gradient(120deg, #F7B52C 0%, #FFCF52 100%)', color: '#17130A' }}
            data-cta="mel-sticky-register"
          >
            S&apos;inscrire sur Melbet
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </a>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav aria-label="Fil d'Ariane" className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <ol className="flex items-center gap-2 text-sm" style={{ color: TEXT_SEC }}>
          <li><a href="/" className="hover:text-emerald transition-colors">Accueil</a></li>
          <li aria-hidden="true">/</li>
          <li><span aria-current="page">Code Promo Melbet</span></li>
        </ol>
      </nav>

      {/* ─────────── HERO + H1 — aurore or Melbet ─────────── */}
      <section className="lpb-hero pb-6 sm:pb-8">
        <div className="lpb-orb lpb-orb--1" aria-hidden="true" />
        <div className="lpb-orb lpb-orb--2" aria-hidden="true" />
        <span className="lpb-spark text-lg" style={{ top: '14%', left: '9%', animationDelay: '0.2s' }} aria-hidden="true">✦</span>
        <span className="lpb-spark text-sm" style={{ top: '58%', left: '16%', animationDelay: '1.1s' }} aria-hidden="true">✦</span>
        <span className="lpb-spark text-base" style={{ top: '22%', right: '11%', animationDelay: '1.8s' }} aria-hidden="true">✦</span>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="lpb-rise flex justify-center mb-4" style={{ '--d': '40ms' } as CSSProperties}>
            <span className="lpb-badge text-[10px] tracking-[0.18em]">🏆 Meilleur code promo — 300% + 100 Free Spins</span>
          </div>
          <h1
            className="lpb-rise text-3xl sm:text-5xl mb-3 leading-tight"
            style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em', color: TEXT, '--d': '120ms' } as CSSProperties}
          >
            CODE PROMO <span style={{ color: GOLD, textShadow: `0 0 22px ${GOLD}66` }}>MELBET</span> Bttswin
          </h1>
          <div className="lpb-rise mx-auto mb-4 flex min-h-16 max-w-[280px] items-center justify-center rounded-xl px-4 py-2 shadow-lg sm:max-w-[340px]" style={{ backgroundColor: '#1B1E27', '--d': '220ms' } as CSSProperties}>
            <img src="/logos/melbet-logo.jpg" alt="Logo officiel Melbet" className="max-h-14 w-auto object-contain rounded-lg" width={560} height={143} loading="eager" />
          </div>
          <p className="lpb-rise text-sm sm:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: TEXT_SEC, '--d': '320ms' } as CSSProperties}>
            Inscris-toi avec le code <strong style={{ color: GOLD_LIGHT }}>{CODE}</strong> et reçois <strong style={{ color: TEXT }}>300% de bonus + 100 free spins</strong>, sans condition de mise — l&apos;offre annoncée par la campagne Melbet.
          </p>
          <p className="lpb-rise text-[11px] mt-3" style={{ color: TEXT_SEC, '--d': '420ms' } as CSSProperties}>
            Offre annoncée — vérifie les conditions affichées par Melbet · 18+
          </p>

          {/* CTA above-the-fold — copie + inscription sans scroller */}
          <div className="lpb-rise mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3" style={{ '--d': '520ms' } as CSSProperties}>
            <button onClick={handleCopy} className="lpb-btn lpb-btn--copy px-6" aria-label={`Copier le code ${CODE}`}>
              {copyLabel}
            </button>
            <a
              href={MELBET_SIGNUP}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              onClick={trackSignup}
              className="lpb-btn lpb-btn--primary px-6"
              data-cta="melbet-signup-hero"
            >
              S&apos;inscrire sur Melbet
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </a>
          </div>
        </div>
      </section>

      {/* ─────────── BANDEAU DÉFILANT BÉNÉFICES (décoratif) ─────────── */}
      <section className="pb-6" aria-hidden="true">
        <div className="lpb-marquee">
          <div className="lpb-marquee__track">
            {[0, 1].map((copy) => (
              <div className="lpb-marquee__group" key={copy}>
                {BENEFITS.map((b) => (
                  <span className="lpb-marquee__item" key={`${copy}-${b}`}>{b}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── CARTE CODE PREMIUM ─────────── */}
      <section className="pb-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="lpb-card">
            <div className="lpb-card__inner">
              <span className="lpb-shine__beam" aria-hidden="true" />

              <p className="text-[11px] uppercase tracking-[0.25em] mb-2" style={{ color: TEXT_SEC }}>
                Code promo Melbet
              </p>
              <button
                type="button"
                onClick={handleCopy}
                className="flex w-full items-center justify-center gap-3 py-2"
                aria-label={`Code promo ${CODE} — cliquer pour copier dans le presse-papier`}
                data-cta="melbet-code-card"
              >
                <span className="lpb-code text-5xl sm:text-6xl font-black tracking-[0.15em]">
                  {CODE}
                </span>
                <span
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
                  style={{
                    backgroundColor: copied ? GOLD : 'rgba(247, 181, 44, 0.14)',
                    border: `1px solid ${copied ? GOLD : PRIMARY}`,
                    color: copied ? BG_DARK : GOLD,
                  }}
                  aria-hidden="true"
                >
                  {copied ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                  )}
                </span>
              </button>
              <p className="text-xs mb-6" style={{ color: TEXT_SEC }}>
                À recopier exactement <strong style={{ color: TEXT }}>tel quel</strong> · Code {CODE}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <button onClick={handleCopy} className="lpb-btn lpb-btn--copy flex-1 sm:flex-initial sm:min-w-[240px]" aria-label={`Copier le code ${CODE} dans le presse-papier`}>
                  {copyLabel}
                </button>
                <a
                  href={MELBET_SIGNUP}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="lpb-btn lpb-btn--primary flex-1 sm:flex-initial sm:min-w-[240px]"
                  data-cta="melbet-signup-card"
                  onClick={trackSignup}
                >
                  S&apos;inscrire sur Melbet
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </a>
              </div>

              {/* APK Android — téléchargement direct via le lien affilié */}
              <a
                href={MELBET_APK}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                onClick={() => trackAffiliateAction('melbet', 'download_click', 'melbet-card-apk')}
                className="mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all"
                style={{ backgroundColor: 'rgba(247, 181, 44, 0.10)', border: `1px solid ${GOLD}55`, color: TEXT }}
                data-cta="melbet-apk-card"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                Télécharger l&apos;application Melbet (APK Android)
              </a>

              <p className="text-[10px] mt-4" style={{ color: '#9DABBB' }}>
                Lien d&apos;affiliation rémunéré · 18+ · Jouer responsable
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── DÉTAILS DE L'OFFRE ─────────── */}
      <section className="pb-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl mb-4 text-center" style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em', color: TEXT }}>
            Détails de l&apos;offre {CODE}
          </h2>
          <div className="overflow-hidden rounded-2xl" style={{ border: `1px solid ${GOLD}33`, backgroundColor: '#141C25' }}>
            <table className="w-full text-sm">
              <tbody>
                {BONUS_ROWS.map((row) => (
                  <tr key={row.label} style={{ borderTop: `1px solid ${GOLD}14` }}>
                    <th scope="row" className="text-left p-4 align-top font-bold text-[12px] uppercase tracking-wider" style={{ color: TEXT_SEC, width: '42%' }}>
                      {row.label}
                    </th>
                    <td className="text-left p-4 align-top font-bold" style={{ color: row.highlight ? GOLD_LIGHT : TEXT }}>
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] mt-2 text-center" style={{ color: TEXT_SEC }}>
            Les conditions affichées par Melbet prévalent — offre annoncée par la campagne partenaire.
          </p>
        </div>
      </section>

      {/* ─────────── ÉTAPES (4) ─────────── */}
      <section className="pb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl mb-6 text-center" style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em', color: TEXT }}>
            Comment utiliser le code {CODE}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((step, idx) => (
              <div
                key={step.n}
                className="lpb-rise lpb-step rounded-2xl p-5 relative"
                style={{ backgroundColor: '#141C25', border: `1px solid ${GOLD}22`, '--d': `${idx * 130}ms` } as CSSProperties}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0" style={{ color: GOLD_LIGHT }} aria-hidden="true">
                    {step.icon}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: GOLD_LIGHT }}>
                    {step.n}
                  </span>
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: TEXT, fontFamily: 'Poppins, sans-serif' }}>
                  {step.title}
                </h3>
                <p className="text-[12px] leading-relaxed" style={{ color: TEXT_SEC }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <button onClick={handleCopy} className="lpb-btn lpb-btn--copy px-5" style={{ minHeight: 44 }}>
              {copyFailed ? `⚠ Copie impossible — code : ${CODE}` : copied ? `✅ Code copié — colle-le sur Melbet` : `📋 Copier ${CODE} maintenant`}
            </button>
          </div>
        </div>
      </section>

      {/* ─────────── COMPARATIF PARTENAIRES PRIORITAIRES ─────────── */}
      <section className="pb-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl mb-2 text-center" style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em', color: TEXT }}>
            Melbet, 1xbet ou Linebet ?
          </h2>
          <p className="text-center text-sm mb-6" style={{ color: TEXT_SEC }}>
            Nos partenaires officiels — offres annoncées, à vérifier chez chaque opérateur.
          </p>
          <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${GOLD}33`, backgroundColor: '#141C25' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid ${GOLD}33` }}>
                  <th scope="col" className="text-left p-3.5 font-bold" style={{ color: TEXT_SEC }}>Bookmaker</th>
                  <th scope="col" className="text-left p-3.5 font-bold" style={{ color: TEXT_SEC }}>Code</th>
                  <th scope="col" className="text-left p-3.5 font-bold hidden sm:table-cell" style={{ color: TEXT_SEC }}>Offre annoncée</th>
                  <th scope="col" className="text-right p-3.5 font-bold" style={{ color: TEXT_SEC }}>Voir</th>
                </tr>
              </thead>
              <tbody>
                {PARTNER_ROWS.map((p) => (
                  <tr key={p.code} style={{ borderTop: `1px solid ${GOLD}1A`, backgroundColor: p.current ? `${GOLD}10` : 'transparent' }}>
                    <td className="p-3.5 font-bold" style={{ color: p.current ? GOLD_LIGHT : TEXT }}>
                      {p.name}
                      {p.current && <span className="ml-2 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: `${GOLD}22`, color: GOLD_LIGHT }}>Vous êtes ici</span>}
                    </td>
                    <td className="p-3.5 font-mono font-black tracking-wider" style={{ color: GOLD_LIGHT }}>{p.code}</td>
                    <td className="p-3.5 hidden sm:table-cell" style={{ color: TEXT_SEC }}>
                      {p.bonus} · {p.note}
                    </td>
                    <td className="p-3.5 text-right">
                      {p.current ? (
                        <span className="text-xs font-bold" style={{ color: TEXT_SEC }}>Cette page</span>
                      ) : (
                        <a href={p.href} className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg" style={{ backgroundColor: `${PRIMARY}18`, color: TEXT, border: `1px solid ${PRIMARY}33` }}>
                          Offre →
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─────────── FAQ visible (alignée sur JSON-LD) ─────────── */}
      <section className="pb-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl mb-4 text-center" style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em', color: TEXT }}>
            Questions fréquentes
          </h2>
          <div className="space-y-3">
            {faqItems(year).map((item) => (
              <details key={item.q} className="lpb-faq rounded-2xl p-4" style={{ backgroundColor: '#141C25', border: `1px solid ${GOLD}22` }}>
                <summary className="cursor-pointer font-semibold text-sm" style={{ color: TEXT }}>
                  {item.q}
                </summary>
                <p className="text-[12px] mt-2 leading-relaxed" style={{ color: TEXT_SEC }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── LIENS INTERNES ─────────── */}
      <section className="pb-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl p-5 text-center" style={{ backgroundColor: '#141C25', border: `1px solid ${GOLD}22` }}>
            <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: GOLD_LIGHT }}>
              À découvrir sur BTTSPredict
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
              {INTERNAL_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg font-semibold transition-all"
                  style={{ backgroundColor: `${PRIMARY}15`, color: TEXT, border: `1px solid ${PRIMARY}33` }}
                >
                  {l.label} →
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── Disclaimer 18+ ─────────── */}
      <section className="pb-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'rgba(255, 122, 122, 0.06)', border: '1px solid rgba(255, 122, 122, 0.2)' }}>
            <p className="text-[11px] leading-relaxed" style={{ color: TEXT_SEC }}>
              ⚠ BTTSPredict est un site informatif et d&apos;affiliation. Nous ne prenons aucun pari, ne collectons aucun fonds et ne sommes pas un bookmaker.
              L&apos;offre annoncée (300% + 100 free spins) est soumise aux conditions de Melbet (éligibilité, dépôt minimum — voir site bookmaker).
              Pariez responsable · <a href="/jouer-responsable" className="underline" style={{ color: PRIMARY }}>en savoir plus</a> · 18+.
            </p>
          </div>
        </div>
      </section>

    </>
  )
}
