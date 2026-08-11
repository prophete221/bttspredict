'use client'

import { useState } from 'react'
import { AFFILIATE } from '@/lib/constants'

/* ─── Palette locale — 888Starz rouge clair (couleur de marque) ──────── */
const ORANGE = '#FF7B7B'      // rouge clair 888Starz
const ORANGE_DARK = '#E55A5A' // rouge clair sombre
const PRIMARY = '#FF7B7B'     // boutons et accents en rouge clair
const PRIMARY_HOVER = '#E55A5A'
const TEXT = '#F8FAFC'
const TEXT_SEC = '#94A3B8'
const BG_DARK = '#0F172A'
const BORDER_OUTLINE = '#94A3B8'

/* Lien affilié 888Starz */
const STAR888_SIGNUP = AFFILIATE.star888

/* ─── Étapes (4) — design moderne avec icônes SVG ────────────────────── */
const STEPS = [
  {
    n: '01',
    title: 'Inscris-toi via notre lien',
    desc: "Clique sur « S'inscrire sur 888Starz » ci-dessous. Crée ton compte gratuit en 2 minutes.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    n: '02',
    title: 'Saisis le code VISION221',
    desc: "Pendant l'inscription (ou dans « Code Promo » de ton compte), colle exactement VISION221.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" />
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Dépose dès 200 XOF',
    desc: "Wave, Orange Money, MTN ou Moov. Dépôt instantané, compte crédité en quelques secondes.",
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
    title: 'Reçois ton bonus 200%',
    desc: "Bonus exclusif 200% sur ton 1er dépôt (jusqu'à 130% si conditions remplies). Activé automatiquement.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 21 12 17l-5.5 4L8 13.5 3 9l6.5-.5L12 2z" />
      </svg>
    ),
  },
]

/* ─── Moyens de dépôt ─────────────────────────────────────────────────── */
const PAYMENT_METHODS = [
  { name: 'Wave', color: '#1DC9FF', short: 'W' },
  { name: 'Orange Money', color: '#3B82F6', short: 'OM' },
  { name: 'MTN', color: '#FFCC00', short: 'M' },
  { name: 'Moov', color: '#0066B3', short: 'M' },
]

/* ─── Détails bonus ──────────────────────────────────────────────────── */
const BONUS_ROWS = [
  { label: 'Bonus', value: '200% sur 1er dépôt', highlight: true },
  { label: 'Code', value: 'VISION221 (copiable)' },
  { label: 'Dépôt min', value: '200 XOF' },
  { label: 'Méthodes', value: 'Wave, Orange Money, MTN, Moov' },
  { label: 'Pays', value: 'Sénégal, Mali, CIV, Guinée, Congo, Maroc' },
]

/* ─── Liens internes ─────────────────────────────────────────────────── */
const INTERNAL_LINKS = [
  { href: '/', label: 'Pronostics BTTS Afrique Ouest' },
  { href: '/code-promo-linebet-senegal', label: 'Code Promo Linebet' },
  { href: '/btts-c-est-quoi', label: "C'est quoi BTTS ?" },
]

export default function Star888Client() {
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState(false)

  const showToast = () => {
    setToast(true)
    setTimeout(() => setToast(false), 2000)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('VISION221')
      setCopied(true)
      showToast()
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const el = document.createElement('textarea')
      el.value = 'VISION221'
      document.body.appendChild(el)
      el.select()
      try { document.execCommand('copy') } catch {}
      document.body.removeChild(el)
      setCopied(true)
      showToast()
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const copyCode = handleCopy

  return (
    <>
      {/* Toast flottant — affiché quand le code est copié */}
      {toast && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl font-bold text-sm shadow-2xl"
          style={{
            backgroundColor: '#FF7B7B',
            color: BG_DARK,
            border: '1.5px solid #FF7B7B',
            boxShadow: '0 10px 40px rgba(99, 214, 255, 0.4)',
          }}
          role="status"
          aria-live="polite"
        >
          ✅ Code copié !
        </div>
      )}

      {/* Breadcrumb */}
      <nav aria-label="Fil d'Ariane" className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <ol className="flex items-center gap-2 text-sm" style={{ color: TEXT_SEC }}>
          <li>
            <a href="/" className="hover:text-emerald transition-colors">Accueil</a>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <span aria-current="page">Code Promo 888Starz Afrique</span>
          </li>
        </ol>
      </nav>

      {/* ─────────── HERO + H1 ─────────── */}
      <section className="pb-6 sm:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1
            className="text-3xl sm:text-5xl mb-3 leading-tight"
            style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em', color: TEXT }}
          >
            CODE PROMO <span style={{ color: ORANGE, textShadow: `0 0 22px ${ORANGE}66` }}>888STARZ</span> AFRIQUE - VISION221
          </h1>
          <p className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: TEXT_SEC }}>
            Sénégal · Mali · Côte d&apos;Ivoire · Guinée · Congo · Maroc
          </p>
          <p className="text-sm sm:text-base max-w-2xl mx-auto mt-3 leading-relaxed" style={{ color: TEXT_SEC }}>
            Bonus exclusif <strong style={{ color: ORANGE }}>200% sur 1er dépôt</strong> avec le code{' '}
            <strong style={{ color: '#FF7B7B' }}>VISION221</strong>. Dépôt minimum 200 XOF.
          </p>
        </div>
      </section>

      {/* ─────────── CARTE CODE MODERNE ─────────── */}
      <section className="pb-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div
            className="rounded-2xl p-8 text-center relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${BG_DARK} 0%, #142C3E 100%)`,
              border: `1.5px solid ${ORANGE}`,
              boxShadow: `0 0 60px ${ORANGE}22, 0 10px 40px rgba(0,0,0,0.4), inset 0 1px 0 ${ORANGE}33`,
            }}
          >
            {/* Badge exclusif */}
            <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] mb-5"
              style={{ backgroundColor: `${ORANGE}1A`, color: ORANGE, border: `1px solid ${ORANGE}55` }}>
              ★ Exclusif Afrique de l&apos;Ouest
            </div>

            {/* Code VISION221 — cliquable directement */}
            <p className="text-[11px] uppercase tracking-[0.25em] mb-2" style={{ color: TEXT_SEC }}>
              Code promo 888Starz
            </p>
            <button
              type="button"
              onClick={copyCode}
              title="Cliquer pour copier"
              aria-label="Code promo VISION221 — cliquer pour copier dans le presse-papier"
              className="inline-flex items-center justify-center gap-3 mb-3 select-all cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] bg-transparent border-0 p-0"
              style={{
                color: ORANGE,
                fontFamily: 'var(--font-mono), monospace',
                textShadow: `0 0 30px ${ORANGE}55, 0 0 12px ${ORANGE}88`,
              }}
            >
              <span className="text-5xl sm:text-6xl font-black tracking-[0.15em]">
                VISION221
              </span>
              <span
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
                style={{
                  backgroundColor: copied ? '#FF7B7B' : `${ORANGE}1A`,
                  border: `1px solid ${copied ? '#FF7B7B' : ORANGE}`,
                  color: copied ? BG_DARK : ORANGE,
                }}
                aria-hidden="true"
              >
                {copied ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </span>
            </button>
            <p className="text-xs mb-6" style={{ color: TEXT_SEC }}>
              Bonus <strong style={{ color: ORANGE }}>200%</strong> sur 1er dépôt · Code VISION221
            </p>

            {/* 3 boutons : 1-Copier (orange), 2-S'inscrire (violet), 3-Télécharger (outline) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <button
                onClick={handleCopy}
                className="flex-1 sm:flex-initial sm:min-w-[260px] h-[52px] rounded-[10px] font-bold text-[14px] flex items-center justify-center gap-2 transition-all"
                style={{
                  backgroundColor: copied ? '#FF7B7B' : ORANGE,
                  color: copied ? BG_DARK : BG_DARK,
                  border: 'none',
                  boxShadow: `0 6px 20px ${ORANGE}33`,
                }}
                aria-label="Copier le code VISION221 dans le presse-papier"
              >
                {copied ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copié !
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copier le code VISION221
                  </>
                )}
              </button>

              <a
                href={STAR888_SIGNUP}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="flex-1 sm:flex-initial sm:min-w-[260px] h-[52px] rounded-[10px] font-bold text-[14px] flex items-center justify-center gap-2 transition-all"
                style={{
                  backgroundColor: PRIMARY,
                  color: TEXT,
                  border: 'none',
                  boxShadow: '0 6px 20px rgba(199, 244, 100, 0.3)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = PRIMARY_HOVER }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = PRIMARY }}
                data-cta="888starz-signup-v641"
              >
                S&apos;inscrire sur 888Starz
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>

              <a
                href={AFFILIATE.star888Download}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="flex-1 sm:flex-initial sm:min-w-[260px] h-[52px] rounded-[10px] font-bold text-[14px] flex items-center justify-center gap-2 transition-all"
                style={{
                  backgroundColor: 'transparent',
                  color: '#C8CCDA',
                  border: `1.5px solid ${BORDER_OUTLINE}`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#142C3E' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                data-cta="888starz-download-v641"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Télécharger APK 888Starz
              </a>
            </div>

            <p className="text-[10px] mt-4" style={{ color: '#94A3B8' }}>
              Lien d&apos;affiliation rémunéré · 18+ · Jouer responsable
            </p>
          </div>
        </div>
      </section>

      {/* ─────────── TABLE BONUS ─────────── */}
      <section className="pb-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2
            className="text-xl sm:text-2xl mb-4 text-center"
            style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em', color: TEXT }}
          >
            Détails du bonus 888Starz
          </h2>
          <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${ORANGE}33`, backgroundColor: '#1E293B' }}>
            <table className="w-full text-sm">
              <tbody>
                {BONUS_ROWS.map((row, i) => (
                  <tr
                    key={row.label}
                    style={{
                      borderTop: i === 0 ? 'none' : `1px solid ${ORANGE}1A`,
                      backgroundColor: row.highlight ? `${ORANGE}10` : 'transparent',
                    }}
                  >
                    <th scope="row" className="text-left p-4 font-semibold align-top" style={{ color: TEXT_SEC, width: '40%' }}>
                      {row.label}
                    </th>
                    <td className="text-left p-4 align-top font-bold" style={{ color: row.highlight ? ORANGE : TEXT }}>
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─────────── ÉTAPES (4) ─────────── */}
      <section className="pb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2
            className="text-xl sm:text-2xl mb-6 text-center"
            style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em', color: TEXT }}
          >
            Comment utiliser le code VISION221 sur 888Starz
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className="rounded-2xl p-5 relative"
                style={{
                  backgroundColor: '#1E293B',
                  border: `1px solid ${ORANGE}22`,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${ORANGE}15`, border: `1px solid ${ORANGE}40`, color: ORANGE }}
                    aria-hidden="true"
                  >
                    {step.icon}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: ORANGE }}>
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
        </div>
      </section>

      {/* ─────────── MOYENS DE DÉPÔT ─────────── */}
      <section className="pb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2
            className="text-xl sm:text-2xl mb-2 text-center"
            style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em', color: TEXT }}
          >
            Moyens de dépôt 888Starz
          </h2>
          <p className="text-center text-sm mb-6" style={{ color: TEXT_SEC }}>
            Dépôt instantané dès 200 XOF en Afrique de l&apos;Ouest.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PAYMENT_METHODS.map((m) => (
              <div
                key={m.name}
                className="rounded-2xl p-4 text-center"
                style={{ backgroundColor: '#1E293B', border: `1px solid ${m.color}33` }}
              >
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-base"
                  style={{ backgroundColor: `${m.color}1A`, color: m.color, border: `1px solid ${m.color}55` }}
                  aria-hidden="true"
                >
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

      {/* ─────────── LIENS INTERNES ─────────── */}
      <section className="pb-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl p-5 text-center" style={{ backgroundColor: '#1E293B', border: `1px solid ${ORANGE}22` }}>
            <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: ORANGE }}>
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
              Les bonus sont soumis aux conditions de 888Starz (mise, dépôt min 200 XOF — voir site bookmaker).
              Pariez responsable · <a href="/jouer-responsable" className="underline" style={{ color: PRIMARY }}>en savoir plus</a> · 18+.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────── STICKY BOTTOM BAR (mobile only) ─────────── */}
      <div
        className="sm:hidden fixed bottom-0 left-0 right-0 z-[80] flex items-center justify-between gap-3 px-4 py-3"
        style={{
          backgroundColor: BG_DARK,
          borderTop: `1.5px solid ${ORANGE}`,
          boxShadow: '0 -8px 24px rgba(0,0,0,0.4)',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-widest" style={{ color: TEXT_SEC }}>Code promo</span>
          <span className="text-base font-black tracking-[0.12em]" style={{ color: ORANGE, fontFamily: 'var(--font-mono), monospace' }}>
            VISION221
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="px-5 py-2.5 rounded-[10px] font-bold text-[13px]"
          style={{
            backgroundColor: copied ? '#FF7B7B' : ORANGE,
            color: BG_DARK,
          }}
        >
          {copied ? '✅ Copié' : '📋 Copier'}
        </button>
      </div>

      {/* Spacer pour sticky bar mobile */}
      <div className="sm:hidden h-[72px]" aria-hidden="true" />
    </>
  )
}
