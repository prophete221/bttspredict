'use client'

import { useState } from 'react'
import { AFFILIATE, SITE } from '@/lib/constants'

/* ─── Palette locale — Linebet vert clair (couleur de marque) ───────── */
const GOLD = '#B8FF1A'       // vert clair Linebet
const GOLD_LIGHT = '#3FBA7C' // vert clair sombre
const PRIMARY = '#B8FF1A'    // boutons et accents en vert clair
const PRIMARY_HOVER = '#3FBA7C'
const TEXT = '#F5F8F3'
const TEXT_SEC = '#B7C4C1'
const BG_DARK = '#071018'

/* Lien affilié Linebet — registration */
const LINEBET_SIGNUP = AFFILIATE.linebet

/* ─── Étapes (4) — design moderne avec icônes SVG ───────────────────── */
const STEPS = [
  {
    n: '01',
    title: 'Inscris-toi via notre lien',
    desc: "Clique sur « S'inscrire sur Linebet » ci-dessous. Crée ton compte gratuit en 2 minutes avec ton email ou ton numéro.",
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
    desc: "Pendant l'inscription (ou dans « Code Promo » de ton compte), colle exactement VISION221 en majuscules.",
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
    desc: "Wave, Orange Money, MTN, Moov ou Free Money. Le dépôt est instantané — ton compte est crédité en quelques secondes.",
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
    title: 'Vérifie le bonus reçu',
    desc: "Les conditions du bonus, les montants disponibles et les critères d'éligibilité peuvent évoluer. Vérifie toujours les conditions actuellement affichées par Linebet avant toute inscription ou dépôt.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 21 12 17l-5.5 4L8 13.5 3 9l6.5-.5L12 2z" />
      </svg>
    ),
  },
]

/* ─── Moyens de dépôt ───────────────────────────────────────────────── */
const PAYMENT_METHODS = [
  { name: 'Wave', color: '#1DC9FF', short: 'W' },
  { name: 'Orange Money', color: '#B8FF1A', short: 'OM' },
  { name: 'MTN', color: '#FFCC00', short: 'M' },
  { name: 'Moov', color: '#0066B3', short: 'M' },
  { name: 'Free Money', color: '#CC0066', short: 'F' },
]

/* ─── Détails bonus ──────────────────────────────────────────────────── */
const BONUS_ROWS = [
  { label: 'Bonus', value: 'Conditions à vérifier auprès de Linebet', highlight: true },
  { label: 'Code', value: 'VISION221 (copiable)' },
  { label: 'Dépôt min', value: '200 XOF' },
  { label: 'Méthodes', value: 'Wave, Orange Money, MTN, Moov, Free Money' },
  { label: 'Pays', value: '6 pays Afrique Ouest & Maroc' },
]

/* ─── Liens internes ─────────────────────────────────────────────────── */
const INTERNAL_LINKS = [
  { href: '/btts/predictions/today', label: 'Tableau des sélections internationales' },
  { href: '/bonus-888starz', label: 'Bonus 888Starz' },
  { href: '/btts-c-est-quoi', label: "C'est quoi BTTS ?" },
]

export default function LinebetClient() {
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
      // Fallback pour anciens navigateurs
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

  // alias demandé par la spec : copyCode()
  const copyCode = handleCopy

  return (
    <>
      {/* Toast flottant — affiché quand le code est copié (clic sur bouton ou sur le code lui-même) */}
      {toast && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl font-bold text-sm shadow-2xl"
          style={{
            backgroundColor: '#B8FF1A',
            color: BG_DARK,
            border: '1.5px solid #B8FF1A',
            boxShadow: '0 10px 40px rgba(169, 196, 223, 0.4)',
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
            <span aria-current="page">Code Promo Linebet Afrique Ouest &amp; Maroc</span>
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
            GUIDE <span style={{ color: GOLD, textShadow: `0 0 22px ${GOLD}66` }}>LINEBET</span> VISION221 — SÉNÉGAL
          </h1>
          <p className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: TEXT_SEC }}>
            Inscription, code copiable et conditions à vérifier avant tout dépôt.
          </p>
          <p className="text-sm sm:text-base max-w-2xl mx-auto mt-3 leading-relaxed" style={{ color: TEXT_SEC }}>
            Code promo <strong style={{ color: GOLD }}>VISION221</strong>. Les conditions du bonus et les montants disponibles peuvent évoluer — vérifiez toujours les conditions affichées par l'opérateur avant toute inscription ou dépôt.
          </p>
        </div>
      </section>

      {/* ─────────── CARTE CODE MODERNE ─────────── */}
      <section className="pb-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div
            className="rounded-2xl p-8 text-center relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${BG_DARK} 0%, #11242B 100%)`,
              border: `1.5px solid ${GOLD}`,
              boxShadow: `0 0 60px ${GOLD}22, 0 10px 40px rgba(0,0,0,0.4), inset 0 1px 0 ${GOLD}33`,
            }}
          >
            {/* Badge exclusif */}
            <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] mb-5"
              style={{ backgroundColor: `${GOLD}1A`, color: GOLD, border: `1px solid ${GOLD}55` }}>
              ★ Exclusif Afrique de l&apos;Ouest
            </div>

            {/* Code VISION221 — cliquable directement */}
            <p className="text-[11px] uppercase tracking-[0.25em] mb-2" style={{ color: TEXT_SEC }}>
              Code promo Linebet
            </p>
            <button
              type="button"
              onClick={copyCode}
              title="Cliquer pour copier"
              aria-label="Code promo VISION221 — cliquer pour copier dans le presse-papier"
              className="inline-flex items-center justify-center gap-3 mb-3 select-all cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] bg-transparent border-0 p-0"
              style={{
                color: GOLD,
                fontFamily: 'var(--font-mono), monospace',
                textShadow: `0 0 30px ${GOLD}55, 0 0 12px ${GOLD}88`,
              }}
            >
              <span className="text-5xl sm:text-6xl font-black tracking-[0.15em]">
                VISION221
              </span>
              <span
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
                style={{
                  backgroundColor: copied ? '#B8FF1A' : `${GOLD}1A`,
                  border: `1px solid ${copied ? '#B8FF1A' : GOLD}`,
                  color: copied ? BG_DARK : GOLD,
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
              Les conditions et montants du bonus peuvent évoluer — vérifiez les conditions affichées par Linebet avant tout dépôt.
            </p>

            {/* 3 boutons : 1-Copier (or), 2-S'inscrire (violet), 3-Télécharger (outline) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <button
                onClick={handleCopy}
                className="flex-1 sm:flex-initial sm:min-w-[260px] h-[52px] rounded-[10px] font-bold text-[14px] flex items-center justify-center gap-2 transition-all"
                style={{
                  backgroundColor: copied ? '#B8FF1A' : GOLD,
                  color: copied ? BG_DARK : BG_DARK,
                  border: 'none',
                  boxShadow: `0 6px 20px ${GOLD}33`,
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
                href={LINEBET_SIGNUP}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="flex-1 sm:flex-initial sm:min-w-[260px] h-[52px] rounded-[10px] font-bold text-[14px] flex items-center justify-center gap-2 transition-all"
                style={{
                  backgroundColor: PRIMARY,
                  color: TEXT,
                  border: 'none',
                  boxShadow: '0 6px 20px rgba(127, 162, 198, 0.30)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = PRIMARY_HOVER }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = PRIMARY }}
                data-cta="linebet-signup-v60"
              >
                S&apos;inscrire sur Linebet
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>

              <a
                href={LINEBET_SIGNUP}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="flex-1 sm:flex-initial sm:min-w-[260px] h-[52px] rounded-[10px] font-bold text-[14px] flex items-center justify-center gap-2 transition-all"
                style={{
                  backgroundColor: 'transparent',
                  color: '#C8CCDA',
                  border: '1.5px solid #B7C4C1',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#11242B' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                data-cta="linebet-download-v61"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Télécharger Linebet APK (Android &amp; iOS)
              </a>
            </div>

            <p className="text-[10px] mt-4" style={{ color: '#B7C4C1' }}>
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
            Détails du bonus Linebet
          </h2>
          <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${GOLD}33`, backgroundColor: '#0D1A20' }}>
            <table className="w-full text-sm">
              <tbody>
                {BONUS_ROWS.map((row, i) => (
                  <tr
                    key={row.label}
                    style={{
                      borderTop: i === 0 ? 'none' : `1px solid ${GOLD}1A`,
                      backgroundColor: row.highlight ? `${GOLD}10` : 'transparent',
                    }}
                  >
                    <th scope="row" className="text-left p-4 font-semibold align-top" style={{ color: TEXT_SEC, width: '40%' }}>
                      {row.label}
                    </th>
                    <td className="text-left p-4 align-top font-bold" style={{ color: row.highlight ? GOLD : TEXT }}>
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
            Comment utiliser le code VISION221
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className="rounded-2xl p-5 relative"
                style={{
                  backgroundColor: '#0D1A20',
                  border: `1px solid ${GOLD}22`,
                }}
              >
                {/* Numéro + icône */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${GOLD}15`, border: `1px solid ${GOLD}40`, color: GOLD }}
                    aria-hidden="true"
                  >
                    {step.icon}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: GOLD }}>
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

          {/* CTA inline après étapes */}
          <div className="text-center mt-6">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] font-bold text-[13px] transition-all"
              style={{
                backgroundColor: copied ? '#B8FF1A' : GOLD,
                color: BG_DARK,
                boxShadow: `0 4px 14px ${GOLD}33`,
              }}
            >
              {copied ? '✅ Code copié — colle-le sur Linebet' : '📋 Copier VISION221 maintenant'}
            </button>
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
            Moyens de dépôt Linebet
          </h2>
          <p className="text-center text-sm mb-6" style={{ color: TEXT_SEC }}>
            Dépôt instantané dès 200 XOF dans toute l&apos;Afrique de l&apos;Ouest &amp; au Maroc.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {PAYMENT_METHODS.map((m) => (
              <div
                key={m.name}
                className="rounded-2xl p-4 text-center"
                style={{ backgroundColor: '#0D1A20', border: `1px solid ${m.color}33` }}
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

      {/* ─────────── FAQ visible (3 questions — alignées sur JSON-LD) ─────────── */}
      <section className="pb-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2
            className="text-xl sm:text-2xl mb-4 text-center"
            style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em', color: TEXT }}
          >
            Questions fréquentes
          </h2>
          <div className="space-y-3">
            {[
              {
                q: 'Quel est le code promo Linebet Afrique Ouest ?',
                a: "Le code promo est VISION221 — saisi en majuscules lors de l'inscription ou dans la section « Code Promo » de ton compte. Les conditions du bonus, les montants disponibles et les critères d'éligibilité peuvent évoluer. Vérifie toujours les conditions actuellement affichées par Linebet avant toute inscription ou dépôt.",
              },
              {
                q: 'Comment déposer avec Wave ?',
                a: "Sélectionne Wave dans la section Dépôt de Linebet, entre le montant (minimum 200 XOF), valide avec ton code secret Wave. Le dépôt est instantané. Le bonus VISION221 est activé automatiquement sur le premier dépôt, quel que soit le moyen utilisé.",
              },
              {
                q: 'Le bonus est-il valable au Maroc, Mali et Côte d\'Ivoire ?',
                a: "Oui. Le code VISION221 fonctionne pour les 6 pays couverts : Sénégal, Mali, Côte d'Ivoire, Guinée, Congo et Maroc. Les conditions et montants du bonus peuvent évoluer ; vérifie les conditions actuellement affichées par Linebet avant toute inscription ou dépôt.",
              },
            ].map((item) => (
              <details key={item.q} className="rounded-2xl p-4" style={{ backgroundColor: '#0D1A20', border: `1px solid ${GOLD}22` }}>
                <summary className="cursor-pointer font-semibold text-sm" style={{ color: TEXT, listStyle: 'none' }}>
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
          <div className="rounded-2xl p-5 text-center" style={{ backgroundColor: '#0D1A20', border: `1px solid ${GOLD}22` }}>
            <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: GOLD }}>
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
              Les bonus sont soumis aux conditions de Linebet (mise x5, dépôt min 200 XOF — voir site bookmaker).
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
          borderTop: `1.5px solid ${GOLD}`,
          boxShadow: '0 -8px 24px rgba(0,0,0,0.4)',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-widest" style={{ color: TEXT_SEC }}>Code promo</span>
          <span className="text-base font-black tracking-[0.12em]" style={{ color: GOLD, fontFamily: 'var(--font-mono), monospace' }}>
            VISION221
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="px-5 py-2.5 rounded-[10px] font-bold text-[13px]"
          style={{
            backgroundColor: copied ? '#B8FF1A' : GOLD,
            color: BG_DARK,
          }}
        >
          {copied ? '✅ Copié' : '📋 Copier'}
        </button>
      </div>

      {/* Spacer pour sticky bar mobile (évite que le footer ne soit masqué) */}
      <div className="sm:hidden h-[72px]" aria-hidden="true" />
    </>
  )
}
