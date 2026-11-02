'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { AFFILIATE } from '@/lib/constants'
import { trackAffiliateAction, trackAffiliateCodeCopy } from '@/lib/affiliateTracking'
import { copyTextToClipboard } from '@/lib/clipboard'

/* ─── Code promo 1xbet — VIPBTTS (majuscules) ────────────────────────── */
const CODE = 'VIPBTTS'

/* ─── Offre annoncée par la campagne partenaire 1xbet ────────────────── */
const OFFER = {
  bonus: '300%',
  wagering: 'Sans condition de mise',
  minDeposit: 'selon les conditions affichées par 1xbet',
}

/* ─── Palette locale — bleu royal 1xbet + cyan ───────────────────────── */
const BLUE = '#1B6EF3'
const CYAN = '#4CC9F0'
const PRIMARY = '#1B6EF3'
const TEXT = '#F2F6FA'
const TEXT_SEC = '#9DABBB'
const BG_DARK = '#0B0F14'

/* Lien affilié 1xbet — PROVISOIRE (URL officielle) tant que le lien
   d'affiliation n'est pas reçu : une seule constante à remplacer. */
const XBET_SIGNUP = AFFILIATE.oneXbet

/* ─── Bandeau défilant — bénéfices de l'offre annoncée ───────────────── */
const BENEFITS = [
  '300% de bonus à l\u2019inscription',
  'Free spins',
  'Sans condition de mise',
  'Code VIPBTTS',
  'International — selon éligibilité pays',
  'App Android & iOS',
]

/* ─── Étapes (4) ─────────────────────────────────────────────────────── */
const STEPS = [
  {
    n: '01',
    title: 'Inscris-toi via notre lien',
    desc: "Clique sur « S'inscrire sur 1xbet » ci-dessous. Crée ton compte gratuit en 2 minutes avec ton email ou ton numéro.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    n: '02',
    title: `Saisis le code ${CODE}`,
    desc: `Pendant l'inscription (ou dans « Code Promo » de ton compte), colle exactement ${CODE} en majuscules.`,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" />
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Effectue ton premier dépôt',
    desc: 'Dépose avec le moyen de paiement disponible dans ton pays (Wave, Orange Money, MTN, carte…). Vérifie le montant minimum affiché par 1xbet.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="3" />
        <path d="M6 12h.01M18 12h.01" />
      </svg>
    ),
  },
  {
    n: '04',
    title: 'Reçois 300% + free spins',
    desc: `Le bonus de ${OFFER.bonus} à l'inscription et les free spins sont crédités selon l'offre affichée par 1xbet, ${OFFER.wagering.toLowerCase()}.`,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 21 12 17l-5.5 4L8 13.5 3 9l6.5-.5L12 2z" />
      </svg>
    ),
  },
]

/* ─── Moyens de dépôt (disponibilité à vérifier sur 1xbet) ───────────── */
const PAYMENT_METHODS = [
  { name: 'Wave', color: '#1DC9FF', short: 'W' },
  { name: 'Orange Money', color: '#2F7DFF', short: 'OM' },
  { name: 'MTN', color: '#FFCC00', short: 'M' },
  { name: 'Moov', color: '#0066B3', short: 'M' },
  { name: 'Free Money', color: '#CC0066', short: 'F' },
]

/* ─── Détails offre ──────────────────────────────────────────────────── */
const BONUS_ROWS = [
  { label: 'Bonus', value: '300% à l\u2019inscription (offre annoncée)', highlight: true },
  { label: 'Free spins', value: 'Free spins inclus — nombre selon l\u2019offre affichée par 1xbet' },
  { label: 'Condition de mise', value: 'Sans condition de mise (offre annoncée)' },
  { label: 'Dépôt minimum', value: 'À vérifier sur 1xbet selon ton pays' },
  { label: 'Code', value: `${CODE} (copiable — en majuscules)` },
  { label: 'Pays', value: 'International — selon éligibilité pays' },
]

/* ─── Comparatif des partenaires prioritaires ────────────────────────── */
const PARTNER_ROWS = [
  {
    name: '1xbet', code: CODE, bonus: '300% à l\u2019inscription + free spins', note: 'Sans condition de mise', href: '', current: true,
  },
  {
    name: 'Linebet', code: 'VISION221', bonus: '300% + 100 free spins', note: 'Dès 1 € de dépôt', href: '/code-promo-linebet-senegal', current: false,
  },
  {
    name: '888starz', code: 'btts221', bonus: '300% + 100 free spins', note: 'Dès 1 € de dépôt', href: '/bonus-888starz', current: false,
  },
]

/* ─── FAQ visible (alignée sur le JSON-LD FAQPage) ───────────────────── */
function faqItems(year: number) {
  return [
    {
      q: 'Quel est le code promo 1xbet ?',
      a: `Le code promo 1xbet est ${CODE} — à saisir en majuscules lors de l'inscription ou dans la section « Code Promo » de ton compte 1xbet.`,
    },
    {
      q: `Que donne le code ${CODE} en ${year} ?`,
      a: `Le code ${CODE} donne 300% de bonus à l'inscription + free spins, sans condition de mise — offre annoncée par la campagne partenaire. Vérifie l'offre affichée par 1xbet pour ton pays avant tout dépôt.`,
    },
    {
      q: `Où saisir le code ${CODE} sur 1xbet ?`,
      a: `Saisis ${CODE} dans le champ « Code promo » du formulaire d'inscription 1xbet, ou plus tard dans ton compte, section « Code Promo ». Respecte les majuscules.`,
    },
    {
      q: '1xbet ou Linebet : quel code promo choisir ?',
      a: "Les deux sont nos partenaires officiels : VIPBTTS (1xbet) offre 300% à l'inscription + free spins et VISION221 (Linebet) offre 300% + 100 free spins dès 1 € de dépôt, sans condition de mise (offres annoncées). Choisis selon le bookmaker que tu préfères utiliser.",
    },
    {
      q: 'Le bonus 1xbet est-il valable dans tous les pays ?',
      a: "La disponibilité du code et de l'offre dépend du pays, du compte et de la période. Vérifie ton éligibilité et les conditions actuellement affichées par 1xbet avant toute inscription ou dépôt.",
    },
  ]
}

/* ─── Liens internes ─────────────────────────────────────────────────── */
const INTERNAL_LINKS = [
  { href: '/code-promo-linebet-senegal', label: 'Code promo Linebet' },
  { href: '/bonus-888starz', label: 'Code promo 888Starz' },
  { href: '/btts/predictions/today', label: 'Pronostics du jour' },
  { href: '/vip', label: 'Espace VIP' },
]

export default function XbetClient() {
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const [toast, setToast] = useState(false)
  const year = new Date().getUTCFullYear()

  /* Mesure : 1 vue de la page promo par session */
  useEffect(() => {
    trackAffiliateAction('1xbet', 'promo_view', 'code-promo-1xbet-page')
  }, [])

  const showToast = () => {
    setToast(true)
    setTimeout(() => setToast(false), 2000)
  }

  const handleCopy = async () => {
    // Succès affiché UNIQUEMENT si la copie a réellement réussi
    const ok = await copyTextToClipboard(CODE)
    if (ok) {
      trackAffiliateCodeCopy('1xbet', '1xbet-promo-code-card')
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

  const trackSignup = () => trackAffiliateAction('1xbet', 'signup_cta_click', '1xbet-promo-code-card')

  const copyLabel = copyFailed ? '⚠ Copie impossible' : copied ? 'Copié !' : `Copier le code ${CODE}`

  return (
    <>
      {/* Toast flottant — seulement après un vrai succès de copie */}
      {toast && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl font-bold text-sm shadow-2xl"
          style={{
            backgroundColor: '#1B6EF3',
            color: BG_DARK,
            border: '1.5px solid #1B6EF3',
            boxShadow: '0 10px 40px rgba(27, 110, 243, 0.4)',
          }}
          role="status"
          aria-live="polite"
        >
          {copyFailed ? `⚠ Copie impossible — code : ${CODE}` : '✅ Code copié !'}
        </div>
      )}

      {/* ─────────── Barre CTA collante mobile — conversion ─────────── */}
      <div className="xbt-sticky md:hidden" role="complementary" aria-label="Action rapide code promo">
        <div className="flex items-center gap-2 px-3 py-2" style={{ backgroundColor: 'rgba(7, 17, 26, 0.96)', borderTop: '1px solid rgba(27, 110, 243, 0.35)' }}>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 h-[46px] rounded-xl flex-shrink-0"
            style={{ backgroundColor: '#0C1A33', border: '1px solid rgba(27, 110, 243, 0.5)' }}
            aria-label={`Copier le code promo ${CODE}`}
            data-cta="xbt-sticky-copy"
          >
            {copied ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4CC9F0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(242, 246, 250, 0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
            )}
            <span className="font-mono text-[13px] font-bold" style={{ color: copied ? '#4CC9F0' : '#F2F6FA' }}>
              {copied ? 'Copié!' : CODE}
            </span>
          </button>
          <a
            href={XBET_SIGNUP}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            onClick={trackSignup}
            className="flex items-center justify-center gap-1.5 flex-1 h-[46px] rounded-xl text-sm font-bold"
            style={{ background: 'linear-gradient(120deg, #1B6EF3 0%, #3E9BF5 100%)', color: '#FFFFFF' }}
            data-cta="xbt-sticky-register"
          >
            S&apos;inscrire sur 1xbet
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </a>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav aria-label="Fil d'Ariane" className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <ol className="flex items-center gap-2 text-sm" style={{ color: TEXT_SEC }}>
          <li><a href="/" className="hover:text-emerald transition-colors">Accueil</a></li>
          <li aria-hidden="true">/</li>
          <li><span aria-current="page">Code Promo 1xbet</span></li>
        </ol>
      </nav>

      {/* ─────────── HERO + H1 — aurore bleue 1xbet ─────────── */}
      <section className="lpb-hero pb-6 sm:pb-8">
        <div className="lpb-orb lpb-orb--1" aria-hidden="true" />
        <div className="lpb-orb lpb-orb--2" aria-hidden="true" />
        <span className="lpb-spark text-lg" style={{ top: '14%', left: '9%', animationDelay: '0.2s' }} aria-hidden="true">✦</span>
        <span className="lpb-spark text-sm" style={{ top: '58%', left: '16%', animationDelay: '1.1s' }} aria-hidden="true">✦</span>
        <span className="lpb-spark text-base" style={{ top: '22%', right: '11%', animationDelay: '1.8s' }} aria-hidden="true">✦</span>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="lpb-rise flex justify-center mb-4" style={{ '--d': '40ms' } as CSSProperties}>
            <span className="lpb-badge text-[10px] tracking-[0.18em]">Code promotionnel 1xbet — Nouveau partenaire</span>
          </div>
          <h1
            className="lpb-rise text-3xl sm:text-5xl mb-3 leading-tight"
            style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em', color: TEXT, '--d': '120ms' } as CSSProperties}
          >
            CODE PROMO <span style={{ color: BLUE, textShadow: `0 0 22px ${BLUE}66` }}>1XBET</span> VIPBTTS
          </h1>
          <div className="lpb-rise mx-auto mb-4 flex min-h-16 max-w-[280px] items-center justify-center rounded-xl bg-white px-4 py-2 shadow-lg sm:max-w-[340px]" style={{ '--d': '220ms' } as CSSProperties}>
            <img src="/logos/1xbet.svg" alt="Logo officiel 1xbet" className="max-h-14 w-auto object-contain" width={256} height={96} loading="eager" />
          </div>
          <p className="lpb-rise text-sm sm:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: TEXT_SEC, '--d': '320ms' } as CSSProperties}>
            Inscris-toi avec le code <strong style={{ color: CYAN }}>{CODE}</strong> et profite de l&apos;offre annoncée : <strong style={{ color: TEXT }}>300% de bonus à l&apos;inscription + free spins</strong>, sans condition de mise.
          </p>
          <p className="lpb-rise text-[11px] mt-3" style={{ color: TEXT_SEC, '--d': '420ms' } as CSSProperties}>
            Offre annoncée — vérifie les conditions affichées par 1xbet · 18+
          </p>

          {/* CTA above-the-fold — copie + inscription sans scroller */}
          <div className="lpb-rise mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3" style={{ '--d': '520ms' } as CSSProperties}>
            <button onClick={handleCopy} className="lpb-btn lpb-btn--copy px-6" aria-label={`Copier le code ${CODE}`}>
              {copyLabel}
            </button>
            <a
              href={XBET_SIGNUP}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              onClick={trackSignup}
              className="lpb-btn lpb-btn--primary px-6"
              data-cta="xbet-signup-hero"
            >
              S&apos;inscrire sur 1xbet
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

      {/* ─────────── BILLBOARD OFFRE — 3 chiffres ─────────── */}
      <section className="pb-8" aria-label="Offre de bienvenue annoncée">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="lpb-stat lpb-pop" style={{ '--d': '120ms' } as CSSProperties}>
              <p className="lpb-stat__num">300%</p>
              <p className="text-[10px] sm:text-xs mt-1.5 font-bold uppercase tracking-wider" style={{ color: TEXT }}>Bonus à l&apos;inscription</p>
            </div>
            <div className="lpb-stat lpb-pop" style={{ '--d': '260ms' } as CSSProperties}>
              <p className="lpb-stat__num"><span className="lpb-spins-star" aria-hidden="true">✦</span> FS</p>
              <p className="text-[10px] sm:text-xs mt-1.5 font-bold uppercase tracking-wider" style={{ color: TEXT }}>Free spins inclus</p>
            </div>
            <div className="lpb-stat lpb-pop" style={{ '--d': '400ms' } as CSSProperties}>
              <p className="lpb-stat__num">0×</p>
              <p className="text-[10px] sm:text-xs mt-1.5 font-bold uppercase tracking-wider" style={{ color: TEXT }}>Condition de mise</p>
            </div>
          </div>
          <p className="text-xs mt-3 text-center font-semibold" style={{ color: TEXT }}>
            {OFFER.wagering} · Offre annoncée par la campagne partenaire — vérifie les conditions affichées par 1xbet avant tout dépôt.
          </p>
        </div>
      </section>

      {/* ─────────── CARTE CODE PREMIUM ─────────── */}
      <section className="pb-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="lpb-card">
            <div className="lpb-card__inner">
              <span className="lpb-shine__beam" aria-hidden="true" />

              <p className="text-[11px] uppercase tracking-[0.25em] mb-2" style={{ color: TEXT_SEC }}>
                Code promo 1xbet
              </p>
              <button
                type="button"
                onClick={handleCopy}
                title="Cliquer pour copier"
                aria-label={`Code promo ${CODE} — cliquer pour copier dans le presse-papier`}
                className="inline-flex items-center justify-center gap-3 mb-3 select-all cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] bg-transparent border-0 p-0"
                style={{ fontFamily: 'var(--font-mono), monospace' }}
              >
                <span className="lpb-code text-5xl sm:text-6xl font-black tracking-[0.15em]">
                  {CODE}
                </span>
                <span
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
                  style={{
                    backgroundColor: copied ? '#1B6EF3' : 'rgba(27, 110, 243, 0.14)',
                    border: `1px solid ${copied ? '#1B6EF3' : BLUE}`,
                    color: copied ? BG_DARK : BLUE,
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
                À saisir exactement en <strong style={{ color: TEXT }}>majuscules</strong> · Code {CODE}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <button onClick={handleCopy} className="lpb-btn lpb-btn--copy flex-1 sm:flex-initial sm:min-w-[240px]" aria-label={`Copier le code ${CODE} dans le presse-papier`}>
                  {copyLabel}
                </button>
                <a
                  href={XBET_SIGNUP}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="lpb-btn lpb-btn--primary flex-1 sm:flex-initial sm:min-w-[240px]"
                  data-cta="xbet-signup-card"
                  onClick={trackSignup}
                >
                  S&apos;inscrire sur 1xbet
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </a>
              </div>

              <p className="text-[10px] mt-4" style={{ color: '#9DABBB' }}>
                Lien d&apos;affiliation rémunéré · 18+ · Jouer responsable
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── TABLE OFFRE ─────────── */}
      <section className="pb-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl mb-4 text-center" style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em', color: TEXT }}>
            Détails de l&apos;offre 1xbet
          </h2>
          <div className="lpb-rise rounded-2xl overflow-hidden" style={{ border: `1px solid ${BLUE}33`, backgroundColor: '#141C25' }}>
            <table className="w-full text-sm">
              <tbody>
                {BONUS_ROWS.map((row, i) => (
                  <tr
                    key={row.label}
                    style={{
                      borderTop: i === 0 ? 'none' : `1px solid ${BLUE}1A`,
                      backgroundColor: row.highlight ? `${BLUE}10` : 'transparent',
                    }}
                  >
                    <th scope="row" className="text-left p-4 font-semibold align-top" style={{ color: TEXT_SEC, width: '40%' }}>
                      {row.label}
                    </th>
                    <td className="text-left p-4 align-top font-bold" style={{ color: row.highlight ? CYAN : TEXT }}>
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] mt-2 text-center" style={{ color: TEXT_SEC }}>
            Offre annoncée par la campagne partenaire — les conditions affichées par 1xbet prévalent.
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
                style={{ backgroundColor: '#141C25', border: `1px solid ${BLUE}22`, '--d': `${idx * 130}ms` } as CSSProperties}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0" style={{ color: CYAN }} aria-hidden="true">
                    {step.icon}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: CYAN }}>
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
              {copyFailed ? `⚠ Copie impossible — code : ${CODE}` : copied ? `✅ Code copié — colle-le sur 1xbet` : `📋 Copier ${CODE} maintenant`}
            </button>
          </div>
        </div>
      </section>

      {/* ─────────── COMPARATIF PARTENAIRES PRIORITAIRES ─────────── */}
      <section className="pb-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl mb-2 text-center" style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em', color: TEXT }}>
            1xbet, Linebet ou 888starz ?
          </h2>
          <p className="text-center text-sm mb-6" style={{ color: TEXT_SEC }}>
            Nos partenaires officiels — offres annoncées, à vérifier chez chaque opérateur.
          </p>
          <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BLUE}33`, backgroundColor: '#141C25' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid ${BLUE}33` }}>
                  <th scope="col" className="text-left p-3.5 font-bold" style={{ color: TEXT_SEC }}>Bookmaker</th>
                  <th scope="col" className="text-left p-3.5 font-bold" style={{ color: TEXT_SEC }}>Code</th>
                  <th scope="col" className="text-left p-3.5 font-bold hidden sm:table-cell" style={{ color: TEXT_SEC }}>Offre annoncée</th>
                  <th scope="col" className="text-right p-3.5 font-bold" style={{ color: TEXT_SEC }}>Voir</th>
                </tr>
              </thead>
              <tbody>
                {PARTNER_ROWS.map((p) => (
                  <tr key={p.code} style={{ borderTop: `1px solid ${BLUE}1A`, backgroundColor: p.current ? `${BLUE}10` : 'transparent' }}>
                    <td className="p-3.5 font-bold" style={{ color: p.current ? CYAN : TEXT }}>
                      {p.name}
                      {p.current && <span className="ml-2 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: `${BLUE}22`, color: CYAN }}>Vous êtes ici</span>}
                    </td>
                    <td className="p-3.5 font-mono font-black tracking-wider" style={{ color: CYAN }}>{p.code}</td>
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

      {/* ─────────── MOYENS DE DÉPÔT ─────────── */}
      <section className="pb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl mb-2 text-center" style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em', color: TEXT }}>
            Moyens de dépôt 1xbet
          </h2>
          <p className="text-center text-sm mb-6" style={{ color: TEXT_SEC }}>
            Utilise le moyen disponible dans ton pays · disponibilité à vérifier sur 1xbet.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {PAYMENT_METHODS.map((m) => (
              <div key={m.name} className="lpb-pay rounded-2xl p-4 text-center" style={{ backgroundColor: '#141C25', border: `1px solid ${m.color}33` }}>
                <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-base" style={{ backgroundColor: `${m.color}1A`, color: m.color, border: `1px solid ${m.color}55` }} aria-hidden="true">
                  {m.short}
                </div>
                <p className="text-[11px] font-semibold" style={{ color: TEXT }}>
                  {m.name}
                </p>
              </div>
            ))}
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
              <details key={item.q} className="lpb-faq rounded-2xl p-4" style={{ backgroundColor: '#141C25', border: `1px solid ${BLUE}22` }}>
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
          <div className="rounded-2xl p-5 text-center" style={{ backgroundColor: '#141C25', border: `1px solid ${BLUE}22` }}>
            <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: CYAN }}>
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
              L&apos;offre annoncée (300% + free spins, sans condition de mise) est soumise aux conditions de 1xbet (éligibilité, dépôt minimum, moyens de paiement — voir site bookmaker).
              Pariez responsable · <a href="/jouer-responsable" className="underline" style={{ color: PRIMARY }}>en savoir plus</a> · 18+.
            </p>
          </div>
        </div>
      </section>

    </>
  )
}
