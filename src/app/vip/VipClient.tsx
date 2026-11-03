'use client'

import { useState } from 'react'
import { AFFILIATE } from '@/lib/constants'
import { BOOKMAKER_ORDER, getBookmaker, type BookmakerId } from '@/lib/bookmakers'
import { trackAffiliateAction, trackAffiliateCodeCopy } from '@/lib/affiliateTracking'

/* ─── Palette locale (alignée sur LinebetClient / Star888Client) ─────── */
const GOLD = '#2F7DFF'       // v68: or unifié
const PRIMARY = '#2F7DFF'
const PRIMARY_HOVER = '#2F7DFF'
const ORANGE = '#2F7DFF'      // v68: 888Starz card passe d'orange à Émeraude
const ORANGE_DARK = '#4A90FF' // v68: émeraude sombre pour hover
const TEXT = '#F2F6FA'
const TEXT_SEC = '#9DABBB'
const BG_DARK = '#0B0F14'
const BORDER_OUTLINE = '#9DABBB'

const WHATSAPP_NUMBER = '15406704172'

/* Liens affiliés — fournis par le registre bookmakers.ts (source unique).
   Les constantes AFFILIATE restent importées pour compatibilité. */

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

// Refonte 2026-11 : plateforme = le registre des 4 bookmakers (plus de codes
// en dur ni de code 888Starz erroné « vision221 » → btts221 désormais exact).

export default function VipClient() {
  const [toast, setToast] = useState<string | null>(null)
  const [playerId, setPlayerId] = useState('')
  const [platform, setPlatform] = useState<BookmakerId>('linebet')
  const [copied, setCopied] = useState(false)

  const selectedBm = getBookmaker(platform)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const copySelectedCode = async () => {
    trackAffiliateCodeCopy(selectedBm.id, 'vip-partner-card')
    try {
      await navigator.clipboard.writeText(selectedBm.promoCode)
    } catch {
      const el = document.createElement('textarea')
      el.value = selectedBm.promoCode
      document.body.appendChild(el)
      el.select()
      try { document.execCommand('copy') } catch {}
      document.body.removeChild(el)
    }
    setCopied(true)
    showToast(`Code copié ${selectedBm.promoCode}`)
    setTimeout(() => setCopied(false), 2000)
  }

  // Construction du message WhatsApp pré-rempli (code exact du registre)
  const buildWhatsAppLink = () => {
    const id = playerId.trim() || 'NON_RENSEIGNE'
    const text = `Salut BTTSPredict, je viens de m'inscrire avec ton code ${selectedBm.promoCode} sur ${selectedBm.name} ID joueur : ${id} Dépôt 3000F fait ce jour. Merci de vérifier et débloquer mon VIP 1 mois gratuit.`
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
            backgroundColor: toast.startsWith('⚠') ? '#F87171' : '#2F7DFF',
            color: BG_DARK,
            border: `1.5px solid ${toast.startsWith('⚠') ? '#F87171' : '#2F7DFF'}`,
            boxShadow: '0 10px 40px rgba(169, 196, 223, 0.4)',
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
            style={{ backgroundColor: 'rgba(127, 162, 198, 0.16)', color: GOLD, border: `1px solid ${GOLD}55` }}
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

      {/* ─────────── CARTE PARTENAIRE (onglets 4 bookmakers) ─────────── */}
      <section className="pb-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Onglets — Linebet et 1xBet d'abord (prioritaires) */}
          <div className="flex flex-wrap justify-center gap-2 mb-4" role="tablist" aria-label="Choix du bookmaker partenaire">
            {BOOKMAKER_ORDER.map(id => {
              const b = getBookmaker(id)
              const isActive = platform === id
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => { setPlatform(id); setCopied(false) }}
                  className="flex items-center gap-2 px-3.5 h-[42px] rounded-[10px] text-[12.5px] font-bold transition-all"
                  style={{
                    backgroundColor: isActive ? 'rgba(47, 125, 255, 0.14)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1.5px solid ${isActive ? '#2F7DFF' : 'rgba(255, 255, 255, 0.14)'}`,
                    color: isActive ? TEXT : TEXT_SEC,
                  }}
                >
                  <span className="flex h-6 w-10 items-center justify-center rounded bg-white px-1">
                    <img src={b.logo} alt="" width={96} height={30} className="max-h-4 w-auto object-contain" />
                  </span>
                  {b.name}
                  {b.featured && <span aria-hidden="true" style={{ color: '#34D399' }}>★</span>}
                </button>
              )
            })}
          </div>

          {/* Carte du bookmaker sélectionné */}
          <div
            className="rounded-2xl p-6 text-center"
            style={{
              background: `linear-gradient(135deg, ${BG_DARK} 0%, #1A242F 100%)`,
              border: '1.5px solid rgba(255, 255, 255, 0.16)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
            }}
            role="tabpanel"
            aria-label={`Offre ${selectedBm.name}`}
          >
            {selectedBm.featured && (
              <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] mb-4"
                style={{ backgroundColor: 'rgba(52, 211, 153, 0.10)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.35)' }}>
                ★ Partenaire prioritaire
              </div>
            )}

            <p className="text-[11px] uppercase tracking-[0.25em] mb-2" style={{ color: TEXT_SEC }}>
              {selectedBm.name} — Code promo
            </p>
            <button
              type="button"
              onClick={copySelectedCode}
              title="Cliquer pour copier"
              aria-label={`Code promo ${selectedBm.promoCode} — cliquer pour copier dans le presse-papier`}
              className="inline-flex items-center justify-center gap-3 mb-3 select-all cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] bg-transparent border-0 p-0"
              style={{ color: TEXT, fontFamily: 'var(--font-mono), monospace' }}
            >
              <span className="text-4xl sm:text-5xl font-black tracking-[0.12em]">{selectedBm.promoCode}</span>
              <span
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
                style={{
                  backgroundColor: copied ? '#34D399' : 'rgba(47, 125, 255, 0.14)',
                  border: `1px solid ${copied ? '#34D399' : 'rgba(47, 125, 255, 0.45)'}`,
                  color: copied ? '#05200F' : '#2F7DFF',
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
            <p className="text-xs mb-5" style={{ color: TEXT_SEC }}>
              {selectedBm.offer.bonus
                ? <>Offre annoncée : <strong style={{ color: TEXT }}>{selectedBm.offer.bonus} + {selectedBm.offer.freeSpins} free spins</strong> · Conditions à vérifier auprès de {selectedBm.name}</>
                : <>Offre de bienvenue affichée lors de l&apos;inscription · Conditions à vérifier auprès de {selectedBm.name}</>}
              {' '}· Dépôt min 3 000 F
            </p>

            {/* Boutons — inscription + APK */}
            <div className="flex flex-col gap-2">
              <a
                href={selectedBm.signup}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="h-[44px] rounded-[10px] font-bold text-[13px] flex items-center justify-center gap-2 transition-all"
                style={{ backgroundColor: PRIMARY, color: TEXT, border: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = PRIMARY_HOVER }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = PRIMARY }}
                onClick={() => trackAffiliateAction(selectedBm.id, 'signup_cta_click', 'vip-partner-card')}
              >
                S&apos;inscrire sur {selectedBm.name} →
              </a>
              <a
                href={selectedBm.download}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="h-[44px] rounded-[10px] font-bold text-[13px] flex items-center justify-center gap-2 transition-all"
                style={{ backgroundColor: 'transparent', color: '#C8CCDA', border: `1.5px solid ${BORDER_OUTLINE}` }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1A242F' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                onClick={() => trackAffiliateAction(selectedBm.id, 'download_click', 'vip-partner-card')}
              >
                📥 Télécharger APK {selectedBm.name}
              </a>
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
                style={{ backgroundColor: '#141C25', border: `1px solid ${GOLD}22` }}
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
              backgroundColor: '#141C25',
              border: `1.5px solid #2F7DFF`,
              boxShadow: '0 0 40px rgba(169, 196, 223, 0.15)',
            }}
          >
            <h2
              className="text-xl sm:text-2xl mb-2 text-center"
              style={{ fontFamily: 'Poppins, sans-serif', color: TEXT }}
            >
              Vérifier mon dépôt et débloquer VIP
            </h2>
            <p className="text-xs text-center mb-5" style={{ color: TEXT_SEC }}>
              On vérifie dans le tableau de bord affilié que le code {selectedBm.promoCode} a bien été utilisé + dépôt min 3 000 F. Délai <strong style={{ color: '#2F7DFF' }}>15-60 min</strong>.
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
                    border: '1.5px solid #6B7A8C',
                    color: TEXT,
                    outline: 'none',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#2F7DFF' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#6B7A8C' }}
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
                  onChange={(e) => setPlatform(e.target.value as BookmakerId)}
                  className="w-full h-[48px] px-4 rounded-[10px] text-sm font-semibold"
                  style={{
                    backgroundColor: BG_DARK,
                    border: '1.5px solid #6B7A8C',
                    color: TEXT,
                    outline: 'none',
                  }}
                >
                  {BOOKMAKER_ORDER.map(id => {
                    const b = getBookmaker(id)
                    return <option key={id} value={id}>{b.name} (code {b.promoCode})</option>
                  })}
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
                  backgroundColor: '#2F7DFF',
                  color: BG_DARK,
                  border: 'none',
                  boxShadow: '0 6px 20px rgba(169, 196, 223, 0.3)',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Vérifier via WhatsApp
              </a>
            </div>

            <p className="text-[11px] text-center mt-4 leading-relaxed" style={{ color: '#9DABBB' }}>
              Si OK, accès groupe VIP + 6 pronos BTTS / Over 2.5 par jour avec xG.
              Numéro WhatsApp : <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#2F7DFF' }}>+1 540 670 4172</a>
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
                style={{ backgroundColor: '#141C25', border: `1px solid ${PRIMARY}22` }}
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
                style={{ backgroundColor: '#141C25', border: `1px solid ${GOLD}22` }}
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
                      <span className="text-[9px] uppercase" style={{ color: '#9DABBB' }}>xG home</span>
                      <p className="text-base font-black" style={{ color: '#2F7DFF', filter: 'blur(3px)', userSelect: 'none' }}>
                        {match.xgHome}
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase" style={{ color: '#9DABBB' }}>xG away</span>
                      <p className="text-base font-black" style={{ color: '#2F7DFF', filter: 'blur(3px)', userSelect: 'none' }}>
                        {match.xgAway}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid rgba(47, 125, 255, 0.1)' }}>
                    <span className="text-[10px]" style={{ color: TEXT_SEC }}>BTTS</span>
                    <span className="text-sm font-bold" style={{ color: '#2F7DFF', filter: 'blur(3px)', userSelect: 'none' }}>{match.btts}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px]" style={{ color: TEXT_SEC }}>Over 2.5</span>
                    <span className="text-sm font-bold" style={{ color: '#2F7DFF', filter: 'blur(3px)', userSelect: 'none' }}>{match.over}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-[11px] mt-4" style={{ color: '#9DABBB' }}>
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
              <strong style={{ color: '#F87171' }}>Liens affiliés</strong> — 18+ — Aucune garantie de gain —
              On ne prend pas les paris, on ne collecte pas les fonds — Contact :{' '}
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#2F7DFF' }}>
                wa.me/15406704172
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
