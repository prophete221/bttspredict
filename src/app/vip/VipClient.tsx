'use client'

import { useState } from 'react'
import { AFFILIATE } from '@/lib/constants'

/* ─── Palette locale (alignée sur LinebetClient / Star888Client) ─────── */
const GOLD = '#10B981'       // v68: or unifié
const PRIMARY = '#10B981'
const PRIMARY_HOVER = '#059669'
const ORANGE = '#3B82F6'      // v68: 888Starz card passe d'orange à Émeraude
const ORANGE_DARK = '#4BA8CC' // v68: émeraude sombre pour hover
const TEXT = '#F8FAFC'
const TEXT_SEC = '#94A3B8'
const BG_DARK = '#0F172A'
const BORDER_OUTLINE = '#94A3B8'

const WHATSAPP_NUMBER = '15406704172'

/* Liens affiliés */
const LINEBET_SIGNUP = AFFILIATE.linebet
const LINEBET_APK = AFFILIATE.linebetDownload
const STAR888_SIGNUP = AFFILIATE.star888
const STAR888_APK = AFFILIATE.star888Download

/* ─── Steps communs (3) ──────────────────────────────────────────────── */
const STEPS = [
  {
    n: '01',
    title: "S'inscrire avec le code",
    desc: "Clique sur « S'inscrire » ci-dessous. Saisis le code promo exact (majuscule pour Linebet, minuscule pour 888Starz).",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    n: '02',
    title: 'Dépôt minimum 3 000 F',
    desc: "Effectue un premier dépôt de 3 000 F minimum via Wave, Orange Money, MTN ou Moov. Dépôt instantané.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Envoyer ton ID joueur',
    desc: "Dans la section « Vérifier mon dépôt » ci-dessous, saisis ton ID joueur Linebet/888Starz. On vérifie dans le tableau de bord affilié.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
]

/* ─── Avantages VIP (3 colonnes) ─────────────────────────────────────── */
const ADVANTAGES = [
  {
    title: '6 pronos / jour',
    desc: 'BTTS + Over 2.5 premium sélectionnés par le moteur IA. Mise à jour quotidienne.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2 a10 10 0 0 1 10 10 l-10 0 z" fill="currentColor" fillOpacity="0.2" />
      </svg>
    ),
  },
  {
    title: 'xG + probas uniques',
    desc: 'Expected Goals détaillés par équipe. Probabilités BTTS/Over 2.5 calculées par modèle Poisson — toutes différentes par match.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 14l4-4 4 4 5-5" />
      </svg>
    ),
  },
  {
    title: 'Historique vérifiable',
    desc: "Suivi public depuis le 08/08/2026. Gagnés ET perdus affichés sans filtrage. Archive horodatée.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
]

/* ─── Aperçu VIP flouté (3 matchs avec xG différents) ───────────────── */
const VIP_PREVIEW = [
  { home: 'Real Madrid', away: 'Barcelona', league: 'La Liga', xgHome: '1.85', xgAway: '1.42', btts: '68%', over: '71%' },
  { home: 'Liverpool', away: 'Arsenal', league: 'Premier League', xgHome: '1.65', xgAway: '1.20', btts: '61%', over: '64%' },
  { home: 'Bayern Munich', away: 'Dortmund', league: 'Bundesliga', xgHome: '1.55', xgAway: '1.10', btts: '57%', over: '60%' },
]

type Platform = 'linebet' | '888starz'

export default function VipClient() {
  const [copiedLinebet, setCopiedLinebet] = useState(false)
  const [copied888, setCopied888] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [playerId, setPlayerId] = useState('')
  const [platform, setPlatform] = useState<Platform>('linebet')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const copyLinebet = async () => {
    try {
      await navigator.clipboard.writeText('VISION221')
      setCopiedLinebet(true)
      showToast('Code copié VISION221')
      setTimeout(() => setCopiedLinebet(false), 2000)
    } catch {
      const el = document.createElement('textarea')
      el.value = 'VISION221'
      document.body.appendChild(el)
      el.select()
      try { document.execCommand('copy') } catch {}
      document.body.removeChild(el)
      setCopiedLinebet(true)
      showToast('Code copié VISION221')
      setTimeout(() => setCopiedLinebet(false), 2000)
    }
  }

  const copy888 = async () => {
    try {
      await navigator.clipboard.writeText('vision221')
      setCopied888(true)
      showToast('Code copié vision221')
      setTimeout(() => setCopied888(false), 2000)
    } catch {
      const el = document.createElement('textarea')
      el.value = 'vision221'
      document.body.appendChild(el)
      el.select()
      try { document.execCommand('copy') } catch {}
      document.body.removeChild(el)
      setCopied888(true)
      showToast('Code copié vision221')
      setTimeout(() => setCopied888(false), 2000)
    }
  }

  // Construction du message WhatsApp pré-rempli
  const buildWhatsAppLink = () => {
    const code = platform === 'linebet' ? 'VISION221' : 'vision221'
    const platformLabel = platform === 'linebet' ? 'Linebet' : '888Starz'
    const id = playerId.trim() || 'NON_RENSEIGNE'
    const text = `Salut BTTSPredict, je viens de m'inscrire avec ton code ${code} sur ${platformLabel} ID joueur : ${id} Dépôt 3000F fait ce jour. Merci de vérifier et débloquer mon VIP 1 mois gratuit.`
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
  }

  const handleVerifyClick = (e: React.MouseEvent) => {
    if (!playerId.trim()) {
      e.preventDefault()
      showToast('⚠ Saisis ton ID joueur d\'abord')
      return
    }
    // Laisse le lien s'ouvrir normalement (target _blank)
  }

  return (
    <>
      {/* Toast flottant */}
      {toast && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl font-bold text-sm shadow-2xl"
          style={{
            backgroundColor: toast.startsWith('⚠') ? '#EF4444' : '#3B82F6',
            color: BG_DARK,
            border: `1.5px solid ${toast.startsWith('⚠') ? '#EF4444' : '#3B82F6'}`,
            boxShadow: '0 10px 40px rgba(99, 214, 255, 0.4)',
          }}
          role="status"
          aria-live="polite"
        >
          {toast}
        </div>
      )}

      {/* Breadcrumb */}
      <nav aria-label="Fil d'Ariane" className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <ol className="flex items-center gap-2 text-sm" style={{ color: TEXT_SEC }}>
          <li><a href="/" className="hover:text-emerald transition-colors">Accueil</a></li>
          <li aria-hidden="true">/</li>
          <li><span aria-current="page">VIP — Déblocage 1 mois gratuit</span></li>
        </ol>
      </nav>

      {/* ─────────── HERO ─────────── */}
      <section className="pb-6 sm:pb-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center pt-6">
          <span
            className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
            style={{ backgroundColor: 'rgba(199, 244, 100, 0.12)', color: GOLD, border: `1px solid ${GOLD}55` }}
          >
            ★ Programme VIP Affilié
          </span>
          <h1
            className="text-3xl sm:text-5xl font-bold mb-3"
            style={{ fontFamily: 'Poppins, sans-serif', color: TEXT }}
          >
            Débloquer VIP 1 Mois Gratuit
          </h1>
          <p className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: TEXT_SEC }}>
            Inscris-toi avec notre code, dépôt <strong style={{ color: GOLD }}>3 000 F min</strong>, envoie ton ID,
            on vérifie en <strong style={{ color: GOLD }}>15-60 min</strong> dans notre espace affilié. 18+ Jouer responsable.
          </p>
        </div>
      </section>

      {/* ─────────── 2 CARTES AFFILIÉES CÔTE À CÔTE ─────────── */}
      <section className="pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* ═══ CARTE LINEBET (VISION221 MAJ) ═══ */}
            <div
              className="rounded-2xl p-6 text-center relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${BG_DARK} 0%, #142C3E 100%)`,
                border: `1.5px solid ${GOLD}`,
                boxShadow: `0 0 60px ${GOLD}22, 0 10px 40px rgba(0,0,0,0.4), inset 0 1px 0 ${GOLD}33`,
              }}
            >
              {/* Badge */}
              <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] mb-4"
                style={{ backgroundColor: `${GOLD}1A`, color: GOLD, border: `1px solid ${GOLD}55` }}>
                ★ Recommandé Afrique de l&apos;Ouest
              </div>

              <p className="text-[11px] uppercase tracking-[0.25em] mb-2" style={{ color: TEXT_SEC }}>
                Linebet — Code promo
              </p>
              <button
                type="button"
                onClick={copyLinebet}
                title="Cliquer pour copier"
                aria-label="Code promo VISION221 — cliquer pour copier dans le presse-papier"
                className="inline-flex items-center justify-center gap-3 mb-3 select-all cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] bg-transparent border-0 p-0"
                style={{ color: GOLD, fontFamily: 'var(--font-mono), monospace', textShadow: `0 0 30px ${GOLD}55` }}
              >
                <span className="text-4xl sm:text-5xl font-black tracking-[0.15em]">VISION221</span>
                <span
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
                  style={{
                    backgroundColor: copiedLinebet ? '#3B82F6' : `${GOLD}1A`,
                    border: `1px solid ${copiedLinebet ? '#3B82F6' : GOLD}`,
                    color: copiedLinebet ? BG_DARK : GOLD,
                  }}
                  aria-hidden="true"
                >
                  {copiedLinebet ? (
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
              <p className="text-xs mb-5" style={{ color: TEXT_SEC }}>
                Bonus · Conditions à vérifier auprès de Linebet · Dépôt min 3 000 F
              </p>

              {/* 3 boutons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={copyLinebet}
                  className="h-[44px] rounded-[10px] font-bold text-[13px] flex items-center justify-center gap-2 transition-all"
                  style={{
                    backgroundColor: copiedLinebet ? '#3B82F6' : GOLD,
                    color: BG_DARK,
                    border: 'none',
                    boxShadow: `0 4px 14px ${GOLD}33`,
                  }}
                >
                  {copiedLinebet ? '✅ Copié !' : '📋 Copier VISION221'}
                </button>
                <a
                  href={LINEBET_SIGNUP}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="h-[44px] rounded-[10px] font-bold text-[13px] flex items-center justify-center gap-2 transition-all"
                  style={{ backgroundColor: PRIMARY, color: TEXT, border: 'none' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = PRIMARY_HOVER }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = PRIMARY }}
                >
                  S&apos;inscrire sur Linebet →
                </a>
                <a
                  href={LINEBET_APK}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="h-[44px] rounded-[10px] font-bold text-[13px] flex items-center justify-center gap-2 transition-all"
                  style={{ backgroundColor: 'transparent', color: '#C8CCDA', border: `1.5px solid ${BORDER_OUTLINE}` }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#142C3E' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  📥 Télécharger APK Linebet
                </a>
              </div>
            </div>

            {/* ═══ CARTE 888STARZ (vision221 MIN) ═══ */}
            <div
              className="rounded-2xl p-6 text-center relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${BG_DARK} 0%, #142C3E 100%)`,
                border: `1.5px solid ${ORANGE}`,
                boxShadow: `0 0 60px ${ORANGE}22, 0 10px 40px rgba(0,0,0,0.4), inset 0 1px 0 ${ORANGE}33`,
              }}
            >
              {/* Badge */}
              <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] mb-4"
                style={{ backgroundColor: `${ORANGE}1A`, color: ORANGE, border: `1px solid ${ORANGE}55` }}>
                ★ Bonus · Conditions à vérifier auprès de 888Starz
              </div>

              <p className="text-[11px] uppercase tracking-[0.25em] mb-2" style={{ color: TEXT_SEC }}>
                888Starz — Code promo
              </p>
              <button
                type="button"
                onClick={copy888}
                title="Cliquer pour copier"
                aria-label="Code promo vision221 — cliquer pour copier dans le presse-papier"
                className="inline-flex items-center justify-center gap-3 mb-3 select-all cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] bg-transparent border-0 p-0"
                style={{ color: ORANGE, fontFamily: 'var(--font-mono), monospace', textShadow: `0 0 30px ${ORANGE}55` }}
              >
                <span className="text-4xl sm:text-5xl font-black tracking-[0.15em]">vision221</span>
                <span
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
                  style={{
                    backgroundColor: copied888 ? '#3B82F6' : `${ORANGE}1A`,
                    border: `1px solid ${copied888 ? '#3B82F6' : ORANGE}`,
                    color: copied888 ? BG_DARK : ORANGE,
                  }}
                  aria-hidden="true"
                >
                  {copied888 ? (
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
              <p className="text-xs mb-5" style={{ color: TEXT_SEC }}>
                Bonus <strong style={{ color: ORANGE }}>200%</strong> · Dépôt min 3 000 F
              </p>

              {/* 3 boutons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={copy888}
                  className="h-[44px] rounded-[10px] font-bold text-[13px] flex items-center justify-center gap-2 transition-all"
                  style={{
                    backgroundColor: copied888 ? '#3B82F6' : ORANGE,
                    color: BG_DARK,
                    border: 'none',
                    boxShadow: `0 4px 14px ${ORANGE}33`,
                  }}
                >
                  {copied888 ? '✅ Copié !' : '📋 Copier vision221'}
                </button>
                <a
                  href={STAR888_SIGNUP}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="h-[44px] rounded-[10px] font-bold text-[13px] flex items-center justify-center gap-2 transition-all"
                  style={{ backgroundColor: PRIMARY, color: TEXT, border: 'none' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = PRIMARY_HOVER }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = PRIMARY }}
                >
                  S&apos;inscrire sur 888Starz →
                </a>
                <a
                  href={STAR888_APK}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="h-[44px] rounded-[10px] font-bold text-[13px] flex items-center justify-center gap-2 transition-all"
                  style={{ backgroundColor: 'transparent', color: '#C8CCDA', border: `1.5px solid ${BORDER_OUTLINE}` }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#142C3E' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  📥 Télécharger APK 888Starz
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── 3 STEPS COMMUNS ─────────── */}
      <section className="pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2
            className="text-xl sm:text-2xl mb-5 text-center"
            style={{ fontFamily: 'Poppins, sans-serif', color: TEXT }}
          >
            Comment débloquer ton VIP 1 mois gratuit
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className="rounded-2xl p-5 relative"
                style={{ backgroundColor: '#1E293B', border: `1px solid ${GOLD}22` }}
              >
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
        </div>
      </section>

      {/* ─────────── SECTION VÉRIFICATION ID ─────────── */}
      <section className="pb-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{
              backgroundColor: '#1E293B',
              border: `1.5px solid #3B82F6`,
              boxShadow: '0 0 40px rgba(99, 214, 255, 0.15)',
            }}
          >
            <h2
              className="text-xl sm:text-2xl mb-2 text-center"
              style={{ fontFamily: 'Poppins, sans-serif', color: TEXT }}
            >
              Vérifier mon dépôt et débloquer VIP
            </h2>
            <p className="text-xs text-center mb-5" style={{ color: TEXT_SEC }}>
              On vérifie dans le tableau de bord affilié que le code VISION221 / vision221 a bien été utilisé + dépôt min 3 000 F. Délai <strong style={{ color: '#3B82F6' }}>15-60 min</strong>.
            </p>

            <div className="space-y-3">
              {/* Input ID joueur */}
              <div>
                <label htmlFor="playerId" className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: TEXT_SEC }}>
                  ID joueur
                </label>
                <input
                  id="playerId"
                  type="text"
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value)}
                  placeholder="Ex: 12345678"
                  className="w-full h-[48px] px-4 rounded-[10px] text-sm font-mono"
                  style={{
                    backgroundColor: BG_DARK,
                    border: '1.5px solid #334155',
                    color: TEXT,
                    outline: 'none',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#3B82F6' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#334155' }}
                />
              </div>

              {/* Select plateforme */}
              <div>
                <label htmlFor="platform" className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: TEXT_SEC }}>
                  Plateforme
                </label>
                <select
                  id="platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                  className="w-full h-[48px] px-4 rounded-[10px] text-sm font-semibold"
                  style={{
                    backgroundColor: BG_DARK,
                    border: '1.5px solid #334155',
                    color: TEXT,
                    outline: 'none',
                  }}
                >
                  <option value="linebet">Linebet (code VISION221)</option>
                  <option value="888starz">888Starz (code vision221)</option>
                </select>
              </div>

              {/* Bouton WhatsApp */}
              <a
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleVerifyClick}
                className="block w-full h-[52px] rounded-[10px] font-bold text-[14px] flex items-center justify-center gap-2 transition-all mt-2"
                style={{
                  backgroundColor: '#3B82F6',
                  color: BG_DARK,
                  border: 'none',
                  boxShadow: '0 6px 20px rgba(99, 214, 255, 0.3)',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Vérifier via WhatsApp
              </a>
            </div>

            <p className="text-[11px] text-center mt-4 leading-relaxed" style={{ color: '#94A3B8' }}>
              Si OK, accès groupe VIP + 6 pronos BTTS / Over 2.5 par jour avec xG.
              Numéro WhatsApp : <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#3B82F6' }}>+1 540 670 4172</a>
            </p>
          </div>
        </div>
      </section>

      {/* ─────────── AVANTAGES (3 colonnes) ─────────── */}
      <section className="pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2
            className="text-xl sm:text-2xl mb-5 text-center"
            style={{ fontFamily: 'Poppins, sans-serif', color: TEXT }}
          >
            Ce que tu débloques avec le VIP
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ADVANTAGES.map((adv) => (
              <div
                key={adv.title}
                className="rounded-2xl p-5 text-center"
                style={{ backgroundColor: '#1E293B', border: `1px solid ${PRIMARY}22` }}
              >
                <div
                  className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: `${PRIMARY}15`, border: `1px solid ${PRIMARY}40`, color: PRIMARY }}
                  aria-hidden="true"
                >
                  {adv.icon}
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: TEXT, fontFamily: 'Poppins, sans-serif' }}>
                  {adv.title}
                </h3>
                <p className="text-[12px] leading-relaxed" style={{ color: TEXT_SEC }}>
                  {adv.desc}
                </p>
              </div>
            ))}
          </div>
          <p className="text-center mt-4">
            <a
              href="/resultats-verifies"
              className="inline-flex items-center gap-1 text-sm font-bold underline"
              style={{ color: PRIMARY }}
            >
              Voir historique vérifiable depuis le 08/08/2026 →
            </a>
          </p>
        </div>
      </section>

      {/* ─────────── APERÇU VIP FLOUTÉ ─────────── */}
      <section className="pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2
            className="text-xl sm:text-2xl mb-5 text-center"
            style={{ fontFamily: 'Poppins, sans-serif', color: TEXT }}
          >
            Aperçu des pronostics VIP du jour
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {VIP_PREVIEW.map((match) => (
              <div
                key={match.home}
                className="relative rounded-2xl p-5 overflow-hidden"
                style={{ backgroundColor: '#1E293B', border: `1px solid ${GOLD}22` }}
              >
                {/* Blur overlay */}
                <div
                  className="absolute inset-0 z-10 backdrop-blur-md"
                  style={{ backgroundColor: 'rgba(7, 17, 26, 0.4)' }}
                  aria-hidden="true"
                />
                {/* Cadenas */}
                <div
                  className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${GOLD}15`, border: `1px solid ${GOLD}` }}
                  aria-hidden="true"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>

                <div className="relative z-0">
                  <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: GOLD }}>
                    {match.league}
                  </p>
                  <p className="text-base font-bold mb-1" style={{ color: TEXT, fontFamily: 'Poppins, sans-serif' }}>
                    {match.home}
                  </p>
                  <p className="text-xs mb-3" style={{ color: TEXT_SEC }}>vs {match.away}</p>

                  {/* xG affichés mais floutés */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div>
                      <span className="text-[9px] uppercase" style={{ color: '#94A3B8' }}>xG home</span>
                      <p className="text-base font-black" style={{ color: '#3B82F6', filter: 'blur(3px)', userSelect: 'none' }}>
                        {match.xgHome}
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase" style={{ color: '#94A3B8' }}>xG away</span>
                      <p className="text-base font-black" style={{ color: '#3B82F6', filter: 'blur(3px)', userSelect: 'none' }}>
                        {match.xgAway}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid rgba(199, 244, 100, 0.1)' }}>
                    <span className="text-[10px]" style={{ color: TEXT_SEC }}>BTTS</span>
                    <span className="text-sm font-bold" style={{ color: '#3B82F6', filter: 'blur(3px)', userSelect: 'none' }}>{match.btts}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px]" style={{ color: TEXT_SEC }}>Over 2.5</span>
                    <span className="text-sm font-bold" style={{ color: '#3B82F6', filter: 'blur(3px)', userSelect: 'none' }}>{match.over}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-[11px] mt-4" style={{ color: '#94A3B8' }}>
            🔒 xG différents par match (pas 1.30 vs 1.10 partout) — débloque l&apos;accès complet via WhatsApp ci-dessus
          </p>
        </div>
      </section>

      {/* ─────────── FOOTER VIP ─────────── */}
      <section className="pb-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: 'rgba(255, 122, 122, 0.06)', border: '1px solid rgba(255, 122, 122, 0.2)' }}
          >
            <p className="text-[11px] leading-relaxed" style={{ color: TEXT_SEC }}>
              <strong style={{ color: '#EF4444' }}>Liens affiliés</strong> — 18+ — Aucune garantie de gain —
              On ne prend pas les paris, on ne collecte pas les fonds — Contact :{' '}
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#3B82F6' }}>
                wa.me/15406704172
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
