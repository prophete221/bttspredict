'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { AFFILIATE } from '@/lib/constants'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const ErrorBoundary = dynamic(() => import('@/components/bttsbet/ErrorBoundary'), { loading: () => null })

/* ═════════════════════════════════════════════════════════════════
   VRAIS LIENS AFFILIÉS — extraits du code existant (src/lib/constants.ts)
   AUCUN lien inventé. Ces 5 liens sont réutilisés à l'identique.
   ═════════════════════════════════════════════════════════════════ */
const LIEN_INSCRIPTION_LINEBET = AFFILIATE.linebet        // https://lb-aff.com/L?tag=d_5589568m_22611c_site&site=5589568&ad=22611&r=registration
const LIEN_APK_LINEBET = AFFILIATE.linebetDownload        // https://lb-aff.com/L?tag=d_5589568m_66803c_apk1&site=5589568&ad=66803
const LIEN_INSCRIPTION_888STARZ = AFFILIATE.star888       // https://888ghta.com/8hwF6V
const LIEN_APK_888STARZ = AFFILIATE.star888Download       // https://888ghta.com/5o6glw
const WHATSAPP_NUMBER = '15406704172'                      // +1 540 670 4172

/* ═════════════════════════════════════════════════════════════════
   Palette OR & ÉMERAUDE v68+
   ═════════════════════════════════════════════════════════════════ */
const C = {
  bg: '#070A14',
  card: '#111827',
  border: '#1F2937',
  gold: '#D4AF37',
  goldDark: '#B7952E',
  goldLight: '#F5D674',
  emerald: '#10B981',
  emeraldDark: '#059669',
  whatsapp: '#25D366',
  text: '#F1F5F9',
  textSec: '#94A3B8',
  textMute: '#64748B',
}

/* ═════════════════════════════════════════════════════════════════
   3 matchs floutés — preview avec xG différents (anti-fake)
   ═════════════════════════════════════════════════════════════════ */
const MATCHS_FLOUTES = [
  { home: 'Real Madrid', away: 'Barcelona', league: 'La Liga', time: '21:00', xgHome: '1.85', xgAway: '1.42', btts: '68%', over: '71%' },
  { home: 'Liverpool', away: 'Arsenal', league: 'Premier League', time: '18:30', xgHome: '1.65', xgAway: '1.20', btts: '61%', over: '64%' },
  { home: 'Bayern Munich', away: 'Dortmund', league: 'Bundesliga', time: '20:30', xgHome: '1.55', xgAway: '1.10', btts: '57%', over: '60%' },
]

/* ═════════════════════════════════════════════════════════════════
   Types
   ═════════════════════════════════════════════════════════════════ */
type VipType = 'foot' | 'multi'
type Bookmaker = 'linebet' | '888starz'
type ModalStep = 'bookmaker' | 'status' | 'verify'

/* ═════════════════════════════════════════════════════════════════
   Component
   ═════════════════════════════════════════════════════════════════ */
export default function VipPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [vipType, setVipType] = useState<VipType>('foot')
  const [vipPrice, setVipPrice] = useState(3000)
  const [step, setStep] = useState<ModalStep>('bookmaker')
  const [bookmaker, setBookmaker] = useState<Bookmaker>('linebet')
  const [alreadyRegistered, setAlreadyRegistered] = useState<boolean | null>(null)
  const [playerId, setPlayerId] = useState('')
  const [copiedCode, setCopiedCode] = useState(false)
  const [toast, setToast] = useState('')

  const code = bookmaker === 'linebet' ? 'VISION221' : 'vision221'
  const platformLabel = bookmaker === 'linebet' ? 'Linebet' : '888Starz'
  const inscriptionLink = bookmaker === 'linebet' ? LIEN_INSCRIPTION_LINEBET : LIEN_INSCRIPTION_888STARZ
  const apkLink = bookmaker === 'linebet' ? LIEN_APK_LINEBET : LIEN_APK_888STARZ

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(true)
      showToast(`Code copié ${code}`)
      setTimeout(() => setCopiedCode(false), 2000)
    } catch {
      const el = document.createElement('textarea')
      el.value = code
      document.body.appendChild(el)
      el.select()
      try { document.execCommand('copy') } catch {}
      document.body.removeChild(el)
      setCopiedCode(true)
      showToast(`Code copié ${code}`)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  const openModal = (type: VipType, price: number) => {
    setVipType(type)
    setVipPrice(price)
    setStep('bookmaker')
    setBookmaker('linebet')
    setAlreadyRegistered(null)
    setPlayerId('')
    setModalOpen(true)
  }

  const buildWhatsAppLink = () => {
    const id = playerId.trim() || 'NON_RENSEIGNE'
    const text = `Salut BTTSPredict, je viens de m'inscrire avec ton code ${code} sur ${platformLabel} ID joueur : ${id} Dépôt ${vipPrice}F fait ce jour. Merci de vérifier et débloquer mon VIP ${vipType === 'foot' ? 'Foot' : 'Multi'} 1 mois.`
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
  }

  const handleVerifyClick = (e: React.MouseEvent) => {
    if (!playerId.trim()) {
      e.preventDefault()
      showToast('⚠ Saisis ton ID joueur d\'abord')
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.bg, color: C.text }}>
      <ErrorBoundary><Navbar /></ErrorBoundary>

      <main id="main-content" className="flex-1 relative z-10" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>

        {/* ══════ Toast flottant ══════ */}
        {toast && (
          <div
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl font-bold text-sm shadow-2xl"
            style={{
              backgroundColor: toast.startsWith('⚠') ? '#EF4444' : C.emerald,
              color: C.bg,
              border: `1.5px solid ${toast.startsWith('⚠') ? '#EF4444' : C.emerald}`,
            }}
            role="status"
            aria-live="polite"
          >
            {toast}
          </div>
        )}

        {/* ══════ HERO ══════ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-6 text-center">
          <span
            className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
            style={{ backgroundColor: `${C.gold}1A`, color: C.gold, border: `1px solid ${C.gold}55` }}
          >
            ★ Programme VIP Premium
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Débloquer VIP 1 Mois Gratuit
          </h1>
          <p className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: C.textSec }}>
            Inscris-toi avec notre code, dépôt <strong style={{ color: C.gold }}>3 000 F min</strong>, envoie ton ID,
            on vérifie en <strong style={{ color: C.gold }}>15-60 min</strong>. 18+ Jouer responsable.
          </p>
        </section>

        {/* ══════ 3 MATCHS FLOUTÉS ══════ */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
          <h2 className="text-xl sm:text-2xl mb-5 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Aperçu des pronostics VIP
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MATCHS_FLOUTES.map((match) => (
              <div
                key={match.home}
                className="relative rounded-2xl p-5 overflow-hidden"
                style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
              >
                {/* Blur overlay */}
                <div className="absolute inset-0 z-10 backdrop-blur-[12px]" style={{ backgroundColor: 'rgba(7, 10, 20, 0.5)' }} aria-hidden="true" />
                {/* Cadenas or */}
                <div
                  className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${C.gold}15`, border: `1px solid ${C.gold}` }}
                  aria-hidden="true"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>

                <div className="relative z-0">
                  <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: C.gold }}>{match.league}</p>
                  <p className="text-base font-bold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>{match.home}</p>
                  <p className="text-xs mb-3" style={{ color: C.textSec }}>vs {match.away}</p>
                  <p className="text-xs mb-3" style={{ color: C.textMute }}>{match.time}</p>

                  {/* xG + probas floutés */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div>
                      <span className="text-[9px] uppercase" style={{ color: C.textMute }}>xG home</span>
                      <p className="text-base font-black" style={{ color: C.emerald, filter: 'blur(4px)', userSelect: 'none' }}>{match.xgHome}</p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase" style={{ color: C.textMute }}>xG away</span>
                      <p className="text-base font-black" style={{ color: C.emerald, filter: 'blur(4px)', userSelect: 'none' }}>{match.xgAway}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
                    <span className="text-[10px]" style={{ color: C.textSec }}>BTTS</span>
                    <span className="text-sm font-bold" style={{ color: C.emerald, filter: 'blur(3px)', userSelect: 'none' }}>{match.btts}</span>
                  </div>
                </div>

                {/* Bouton Débloquer */}
                <button
                  onClick={() => openModal('foot', 3000)}
                  className="relative z-30 mt-3 w-full py-2 rounded-[10px] font-bold text-[12px] transition-all"
                  style={{ backgroundColor: C.gold, color: C.bg }}
                >
                  🔓 Débloquer pour voir
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ══════ 2 CARTES PRICING ══════ */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* CARTE VIP FOOT (Or) */}
            <div
              className="rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${C.bg} 0%, #1a1f2e 100%)`,
                border: `1.5px solid ${C.gold}`,
                boxShadow: `0 0 60px ${C.gold}22, 0 10px 40px rgba(0,0,0,0.4)`,
              }}
            >
              <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] mb-4"
                style={{ backgroundColor: `${C.gold}1A`, color: C.gold, border: `1px solid ${C.gold}55` }}>
                ⚽ VIP Foot
              </div>
              <p className="text-4xl sm:text-5xl font-black mb-2" style={{ color: C.gold, fontFamily: 'var(--font-mono), monospace', textShadow: `0 0 30px ${C.gold}55` }}>
                3 000 F
              </p>
              <p className="text-xs mb-5" style={{ color: C.textSec }}>Dépôt min · 1 mois gratuit</p>
              <ul className="text-left space-y-2 mb-6 max-w-xs mx-auto">
                {['6 pronos BTTS + Over 2.5 / jour', 'xG détaillés par équipe', 'Historique vérifiable'].map(b => (
                  <li key={b} className="flex items-start gap-2 text-sm" style={{ color: C.text }}>
                    <span style={{ color: C.gold }}>✓</span> {b}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => openModal('foot', 3000)}
                className="w-full h-[52px] rounded-[10px] font-bold text-[14px] transition-all"
                style={{ backgroundColor: C.gold, color: C.bg, boxShadow: `0 6px 20px ${C.gold}33` }}
              >
                Débloquer VIP Foot — 3 000F
              </button>
            </div>

            {/* CARTE VIP MULTI (Émeraude) */}
            <div
              className="rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${C.bg} 0%, #0a1f1a 100%)`,
                border: `1.5px solid ${C.emerald}`,
                boxShadow: `0 0 60px ${C.emerald}22, 0 10px 40px rgba(0,0,0,0.4)`,
              }}
            >
              <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] mb-4"
                style={{ backgroundColor: `${C.emerald}1A`, color: C.emerald, border: `1px solid ${C.emerald}55` }}>
                🏆 VIP Multi-Sports
              </div>
              <p className="text-4xl sm:text-5xl font-black mb-2" style={{ color: C.emerald, fontFamily: 'var(--font-mono), monospace', textShadow: `0 0 30px ${C.emerald}55` }}>
                12 000 F
              </p>
              <p className="text-xs mb-5" style={{ color: C.textSec }}>Dépôt min · 1 mois gratuit</p>
              <ul className="text-left space-y-2 mb-6 max-w-xs mx-auto">
                {['20+ pronos multi-sports / jour', 'Football + Tennis + NBA + NFL + UFC', 'Value Bets + Stats Aviator inclus'].map(b => (
                  <li key={b} className="flex items-start gap-2 text-sm" style={{ color: C.text }}>
                    <span style={{ color: C.emerald }}>✓</span> {b}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => openModal('multi', 12000)}
                className="w-full h-[52px] rounded-[10px] font-bold text-[14px] transition-all"
                style={{ backgroundColor: C.emerald, color: C.bg, boxShadow: `0 6px 20px ${C.emerald}33` }}
              >
                Débloquer VIP Multi — 12 000F
              </button>
            </div>
          </div>
        </section>

        {/* ══════ Footer VIP ══════ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <p className="text-[11px] leading-relaxed" style={{ color: C.textSec }}>
              <strong style={{ color: '#EF4444' }}>Liens affiliés</strong> — 18+ — Aucune garantie de gain —
              On ne prend pas les paris — Contact:{' '}
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: C.whatsapp }}>
                wa.me/15406704172
              </a>
            </p>
          </div>
        </section>

        <ErrorBoundary><Footer /></ErrorBoundary>
      </main>

      {/* ═══════════════════════════════════════════════════════════
          MODAL 3 ÉTAPES — Or & Émeraude premium popup
          ═══════════════════════════════════════════════════════════ */}
      {modalOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
            onClick={() => setModalOpen(false)}
          >
            {/* Modal */}
            <div
              className="relative w-full max-w-md rounded-2xl p-6 overflow-hidden"
              style={{
                backgroundColor: C.card,
                border: `1.5px solid ${vipType === 'foot' ? C.gold : C.emerald}`,
                boxShadow: `0 0 60px ${vipType === 'foot' ? C.gold : C.emerald}22`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ color: C.textMute }}
                aria-label="Fermer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Titre modal */}
              <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: vipType === 'foot' ? C.gold : C.emerald }}>
                Étape {step === 'bookmaker' ? '1/3' : step === 'status' ? '2/3' : '3/3'}
              </p>
              <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {step === 'bookmaker' && 'Choisis ton bookmaker'}
                {step === 'status' && 'Es-tu déjà inscrit ?'}
                {step === 'verify' && `Vérification ${platformLabel}`}
              </h2>

              {/* ─── ÉTAPE 1: CHOIX BOOKMAKER ─── */}
              {step === 'bookmaker' && (
                <div className="space-y-3">
                  {/* Linebet card */}
                  <button
                    onClick={() => { setBookmaker('linebet'); setStep('status') }}
                    className="w-full p-4 rounded-xl text-left transition-all"
                    style={{ backgroundColor: `${C.gold}08`, border: `1.5px solid ${C.gold}44` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm" style={{ color: C.gold }}>Linebet</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${C.gold}1A`, color: C.gold, border: `1px solid ${C.gold}55` }}>VISION221</span>
                    </div>
                    <p className="text-[11px]" style={{ color: C.textSec }}>Bonus 90 000 XOF · Code en MAJUSCULES</p>
                  </button>

                  {/* 888Starz card */}
                  <button
                    onClick={() => { setBookmaker('888starz'); setStep('status') }}
                    className="w-full p-4 rounded-xl text-left transition-all"
                    style={{ backgroundColor: `${C.emerald}08`, border: `1.5px solid ${C.emerald}44` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm" style={{ color: C.emerald }}>888Starz</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${C.emerald}1A`, color: C.emerald, border: `1px solid ${C.emerald}55` }}>vision221</span>
                    </div>
                    <p className="text-[11px]" style={{ color: C.textSec }}>Bonus 200% · Code en minuscules</p>
                  </button>
                </div>
              )}

              {/* ─── ÉTAPE 2: STATUT INSCRIPTION ─── */}
              {step === 'status' && (
                <div className="space-y-3">
                  <button
                    onClick={() => { setAlreadyRegistered(true); setStep('verify') }}
                    className="w-full h-[52px] rounded-[10px] font-bold text-[14px] transition-all"
                    style={{ backgroundColor: vipType === 'foot' ? C.gold : C.emerald, color: C.bg }}
                  >
                    ✓ Déjà inscrit sur {platformLabel}
                  </button>
                  <button
                    onClick={() => { setAlreadyRegistered(false); setStep('verify') }}
                    className="w-full h-[52px] rounded-[10px] font-bold text-[14px] transition-all"
                    style={{ backgroundColor: 'transparent', color: C.text, border: `1.5px solid ${C.border}` }}
                  >
                    Pas encore inscrit
                  </button>
                  <button onClick={() => setStep('bookmaker')} className="w-full text-[11px] mt-2" style={{ color: C.textMute }}>
                    ← Retour
                  </button>
                </div>
              )}

              {/* ─── ÉTAPE 3: VÉRIFICATION ─── */}
              {step === 'verify' && (
                <div className="space-y-4">
                  {/* Si pas encore inscrit: code copiable + liens */}
                  {alreadyRegistered === false && (
                    <>
                      {/* Code promo cliquable */}
                      <div className="text-center mb-3">
                        <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: C.textSec }}>Code promo {platformLabel}</p>
                        <button
                          onClick={copyCode}
                          title="Cliquer pour copier"
                          className="inline-flex items-center gap-2 cursor-pointer transition-transform hover:scale-[1.02] bg-transparent border-0 p-0"
                        >
                          <span className="text-3xl font-black tracking-[0.15em]" style={{
                            color: bookmaker === 'linebet' ? C.gold : C.emerald,
                            fontFamily: 'var(--font-mono), monospace',
                            textShadow: `0 0 20px ${bookmaker === 'linebet' ? C.gold : C.emerald}55`,
                          }}>
                            {code}
                          </span>
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg" style={{
                            backgroundColor: copiedCode ? C.emerald : `${bookmaker === 'linebet' ? C.gold : C.emerald}1A`,
                            border: `1px solid ${copiedCode ? C.emerald : (bookmaker === 'linebet' ? C.gold : C.emerald)}`,
                            color: copiedCode ? C.bg : (bookmaker === 'linebet' ? C.gold : C.emerald),
                          }}>
                            {copiedCode ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                            )}
                          </span>
                        </button>
                      </div>

                      {/* 3 boutons */}
                      <a
                        href={inscriptionLink}
                        target="_blank"
                        rel="noopener noreferrer nofollow sponsored"
                        className="block w-full h-[48px] rounded-[10px] font-bold text-[13px] flex items-center justify-center transition-all"
                        style={{ backgroundColor: bookmaker === 'linebet' ? C.gold : C.emerald, color: C.bg }}
                      >
                        S'inscrire sur {platformLabel} →
                      </a>
                      <a
                        href={apkLink}
                        target="_blank"
                        rel="noopener noreferrer nofollow sponsored"
                        className="block w-full h-[48px] rounded-[10px] font-bold text-[13px] flex items-center justify-center transition-all"
                        style={{ backgroundColor: 'transparent', color: C.text, border: `1.5px solid ${C.border}` }}
                      >
                        📥 Télécharger APK {platformLabel}
                      </a>
                    </>
                  )}

                  {/* Input ID */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: C.textSec }}>
                      ID joueur {platformLabel}
                    </label>
                    <input
                      type="text"
                      value={playerId}
                      onChange={(e) => setPlayerId(e.target.value)}
                      placeholder="Ex: 12345678"
                      className="w-full h-[48px] px-4 rounded-[10px] text-sm font-mono"
                      style={{ backgroundColor: C.bg, border: `1.5px solid ${C.border}`, color: C.text, outline: 'none' }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = vipType === 'foot' ? C.gold : C.emerald }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = C.border }}
                    />
                  </div>

                  {/* Bouton WhatsApp */}
                  <a
                    href={buildWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleVerifyClick}
                    className="block w-full h-[52px] rounded-[10px] font-bold text-[14px] flex items-center justify-center gap-2 transition-all"
                    style={{ backgroundColor: C.whatsapp, color: C.bg, boxShadow: `0 6px 20px ${C.whatsapp}33` }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Vérifier via WhatsApp
                  </a>

                  <p className="text-[11px] text-center" style={{ color: C.textMute }}>
                    On vérifie dans le tableau de bord affilié que le code {code} a bien été utilisé + dépôt min {vipPrice} F. Délai 15-60 min.
                  </p>

                  <button onClick={() => setStep('status')} className="w-full text-[11px]" style={{ color: C.textMute }}>
                    ← Retour
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
