'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { AFFILIATE } from '@/lib/constants'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const ErrorBoundary = dynamic(() => import('@/components/bttsbet/ErrorBoundary'), { loading: () => null })
const VipUnlockModal = dynamic(() => import('@/components/bttsbet/VipUnlockModal'), { loading: () => null })

const LIEN_LINEBET = AFFILIATE.linebet
const LIEN_LINEBET_APK = AFFILIATE.linebetDownload
const LIEN_888STARZ = AFFILIATE.star888
const LIEN_888STARZ_APK = AFFILIATE.star888Download
const WHATSAPP = '15406704172'

// ─── Bookmaker brand colors ───
// Linebet = vert clair (light green)
// 888Starz = rouge clair (light red)
const BRAND = {
  linebet: { primary: '#5DD9A0', primaryGlow: '#5DD9A030', primaryDark: '#3FBA7C' },
  star888: { primary: '#FF7B7B', primaryGlow: '#FF7B7B30', primaryDark: '#E55A5A' },
}

const C = {
  bg:'#131314', surface:'#1e1f20', border:'#2d2f31',
  text:'#f0f4f9', textSec:'#9ca3af', textMute:'#9ca3af',
  baobab:'#22c55e', data:'#06b6d4', success:'#22c55e', warning:'#f59e0b',
  gold:'#FFD700',
}

interface PreviewMatch {
  home: string
  away: string
  league: string
  time: string
  date: string
  homeLogo?: string
  awayLogo?: string
  homeInitial: string
  awayInitial: string
}

export default function VipPage() {
  const [copiedCode, setCopiedCode] = useState(false)
  const [toast, setToast] = useState('')
  const [bookmaker, setBookmaker] = useState<'linebet'|'888starz'>('linebet')
  const [previewMatches, setPreviewMatches] = useState<PreviewMatch[]>([])
  const [showModal, setShowModal] = useState(false)

  const code = bookmaker === 'linebet' ? 'VISION221' : 'vision221'
  const inscriptionLink = bookmaker === 'linebet' ? LIEN_LINEBET : LIEN_888STARZ
  const apkLink = bookmaker === 'linebet' ? LIEN_LINEBET_APK : LIEN_888STARZ_APK
  const bonus = bookmaker === 'linebet' ? 'Bonus 90 000 XOF' : 'Bonus 200%'
  const brandColor = bookmaker === 'linebet' ? BRAND.linebet.primary : BRAND.star888.primary
  const brandGlow = bookmaker === 'linebet' ? BRAND.linebet.primaryGlow : BRAND.star888.primaryGlow
  const brandDark = bookmaker === 'linebet' ? BRAND.linebet.primaryDark : BRAND.star888.primaryDark

  // Load 2 matches from predictions.json (vipPreview or free) to show as preview
  useEffect(() => {
    fetch('/predictions.json')
      .then(r => r.json())
      .then(data => {
        const arr: any[] = data?.vipPreview || data?.free || data?.predictions || []
        const todayStr = new Date().toISOString().slice(0, 10)
        const upcoming = arr.filter((p: any) => p.date >= todayStr).slice(0, 2)
        if (upcoming.length >= 2) {
          setPreviewMatches(upcoming.map((m: any) => ({
            home: m.home,
            away: m.away,
            league: m.league,
            time: m.time || '--:--',
            date: m.date,
            homeLogo: m.homeLogo,
            awayLogo: m.awayLogo,
            homeInitial: String(m.home || '?')[0].toUpperCase(),
            awayInitial: String(m.away || '?')[0].toUpperCase(),
          })))
        } else {
          // Fallback demo matches
          setPreviewMatches([
            { home: 'Hannover 96', away: 'VfL Wolfsburg', league: '2. Bundesliga', time: '13:30', date: '2026-08-16', homeInitial: 'H', awayInitial: 'V' },
            { home: 'LAFC', away: 'San Diego FC', league: 'MLS', time: '04:30', date: '2026-08-15', homeInitial: 'L', awayInitial: 'S' },
          ])
        }
      })
      .catch(() => {
        setPreviewMatches([
          { home: 'Hannover 96', away: 'VfL Wolfsburg', league: '2. Bundesliga', time: '13:30', date: '2026-08-16', homeInitial: 'H', awayInitial: 'V' },
          { home: 'LAFC', away: 'San Diego FC', league: 'MLS', time: '04:30', date: '2026-08-15', homeInitial: 'L', awayInitial: 'S' },
        ])
      })
  }, [])

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2500) }

  // ─── Copy the given code to clipboard + show toast ───
  const copyToClipboard = async (codeToCopy: string) => {
    try {
      await navigator.clipboard.writeText(codeToCopy)
      setCopiedCode(true)
      showToast(`Code ${codeToCopy} copié`)
      setTimeout(() => setCopiedCode(false), 2000)
    } catch {
      const el = document.createElement('textarea')
      el.value = codeToCopy
      document.body.appendChild(el)
      el.select()
      try { document.execCommand('copy') } catch {}
      document.body.removeChild(el)
      setCopiedCode(true)
      showToast(`Code ${codeToCopy} copié`)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  // ─── Legacy copyCode (used by manual copy button) ───
  const copyCode = () => copyToClipboard(code)

  // ─── Select bookmaker AND auto-copy its promo code at the same time ───
  const selectBookmaker = (bk: 'linebet' | '888starz') => {
    setBookmaker(bk)
    const codeToCopy = bk === 'linebet' ? 'VISION221' : 'vision221'
    copyToClipboard(codeToCopy)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.bg, color: C.text }}>
      <ErrorBoundary><Navbar /></ErrorBoundary>
      <main id="main-content" className="flex-1 relative z-10" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>

        {toast && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl font-bold text-sm shadow-2xl"
            style={{ backgroundColor: C.baobab, color: C.bg }}>{toast}</div>
        )}

        {/* ═══ 1. CARTE VIP 3D VERROUILLÉE — EN HAUT DE LA PAGE ═══ */}
        <section className="relative pt-6 pb-8 overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse 70% 60% at 50% 0%, ${brandGlow}, transparent 70%)`,
          }} />
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse 40% 30% at 50% 20%, ${C.gold}15, transparent 60%)`,
          }} />

          <div className="relative max-w-md mx-auto px-4">
            {/* Premium badge */}
            <div className="text-center mb-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-2" style={{
                background: `linear-gradient(135deg, ${C.gold}25, ${C.gold}08)`,
                border: `1px solid ${C.gold}40`,
                boxShadow: `0 0 24px ${C.gold}25, inset 0 1px 0 ${C.gold}30`,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill={C.gold}>
                  <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm0 2h14v2H5v-2z" />
                </svg>
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em]"
                style={{
                  background: `linear-gradient(135deg, ${C.gold}25, ${C.gold}10)`,
                  color: C.gold,
                  border: `1px solid ${C.gold}40`,
                }}>
                ✦ Pronostics VIP ✦
              </span>
              <h1 className="text-2xl font-black mt-2 mb-1" style={{
                fontFamily: 'Poppins, sans-serif',
                background: `linear-gradient(135deg, ${C.gold} 0%, ${C.text} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Pronostics Premium
              </h1>
              <p className="text-[11px]" style={{ color: C.textSec }}>
                Coupon du jour · Débloque les marchés et cotes
              </p>
            </div>

            {/* ═══ CARTE 3D ═══ */}
            <div
              className="relative rounded-2xl overflow-hidden transition-all duration-500"
              style={{
                background: `linear-gradient(145deg, ${C.surface} 0%, ${C.bg} 50%, #0A1822 100%)`,
                border: `1px solid ${C.gold}30`,
                boxShadow: `
                  0 20px 60px rgba(0,0,0,0.5),
                  0 8px 24px ${brandGlow},
                  0 0 0 1px ${C.gold}10,
                  inset 0 1px 0 ${C.gold}25,
                  inset 0 -1px 0 rgba(0,0,0,0.3)
                `,
                transform: 'perspective(1000px) rotateX(2deg)',
              }}
            >
              {/* Top accent bar */}
              <div className="h-[3px] w-full" style={{
                background: `linear-gradient(90deg, transparent 0%, ${C.gold} 30%, ${brandColor} 50%, ${C.gold} 70%, transparent 100%)`,
              }} />

              {/* Header card */}
              <div className="px-4 py-3 flex items-center justify-between" style={{
                backgroundColor: 'rgba(7,17,26,0.6)',
                borderBottom: `1px solid ${C.border}`,
              }}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: brandColor, boxShadow: `0 0 8px ${brandColor}` }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.textSec }}>
                    Coupon VIP · {previewMatches.length} matchs
                  </span>
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded" style={{
                  backgroundColor: `${C.gold}15`,
                  color: C.gold,
                  border: `1px solid ${C.gold}30`,
                }}>
                  LOCKED
                </span>
              </div>

              {/* ═══ 2 MATCHES — noms/logos visibles, marchés/cotes floutés ═══ */}
              <div className="p-3 space-y-2">
                {previewMatches.map((m, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden" style={{
                    backgroundColor: '#0B1925',
                    border: `1px solid ${C.border}`,
                  }}>
                    {/* League header */}
                    <div className="flex items-center justify-between px-3 py-1.5" style={{
                      backgroundColor: C.bg,
                      borderBottom: `1px solid ${C.border}`,
                    }}>
                      <span className="text-[9px] uppercase tracking-wider font-bold" style={{ color: C.textSec }}>
                        {m.league}
                      </span>
                      <span className="text-[9px] font-mono" style={{ color: C.textMute }}>{m.time}</span>
                    </div>

                    {/* Teams visible — logos + names */}
                    <div className="flex items-center justify-between px-3 py-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <TeamLogoMini src={m.homeLogo} name={m.home} initial={m.homeInitial} />
                        <span className="text-[12px] font-bold truncate" style={{ color: C.text }}>{m.home}</span>
                      </div>

                      <div className="flex flex-col items-center px-2 flex-shrink-0">
                        <span className="text-[10px] font-black" style={{ color: brandColor }}>VS</span>
                      </div>

                      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                        <span className="text-[12px] font-bold truncate text-right" style={{ color: C.text }}>{m.away}</span>
                        <TeamLogoMini src={m.awayLogo} name={m.away} initial={m.awayInitial} />
                      </div>
                    </div>

                    {/* ═══ MARCHÉS + COTES — FLOUTÉS ═══ */}
                    <div className="relative px-3 pb-3" style={{ borderTop: `1px solid ${C.border}` }}>
                      <div className="pt-2 grid grid-cols-3 gap-1.5" style={{ filter: 'blur(6px)', opacity: 0.7, pointerEvents: 'none', userSelect: 'none' }}>
                        <div className="rounded p-1.5 text-center" style={{ backgroundColor: 'rgba(99,214,255,0.1)' }}>
                          <div className="text-[8px] uppercase tracking-wider" style={{ color: C.textMute }}>BTTS</div>
                          <div className="text-[11px] font-black" style={{ color: C.data }}>1.85</div>
                        </div>
                        <div className="rounded p-1.5 text-center" style={{ backgroundColor: 'rgba(123,228,149,0.1)' }}>
                          <div className="text-[8px] uppercase tracking-wider" style={{ color: C.textMute }}>Over 2.5</div>
                          <div className="text-[11px] font-black" style={{ color: C.success }}>1.92</div>
                        </div>
                        <div className="rounded p-1.5 text-center" style={{ backgroundColor: 'rgba(255,209,102,0.1)' }}>
                          <div className="text-[8px] uppercase tracking-wider" style={{ color: C.textMute }}>Cote</div>
                          <div className="text-[11px] font-black" style={{ color: C.warning }}>3.45</div>
                        </div>
                      </div>

                      {/* Lock overlay for markets */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: '8px' }}>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{
                          backgroundColor: 'rgba(7,17,26,0.85)',
                          border: `1px solid ${C.gold}40`,
                          backdropFilter: 'blur(8px)',
                        }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2.5">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                          <span className="text-[8px] font-black uppercase tracking-wider" style={{ color: C.gold }}>Marchés verrouillés</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Total cote — also blurred */}
                <div className="relative flex items-center justify-between px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(7,17,26,0.5)', border: `1px solid ${C.border}` }}>
                  <div style={{ filter: 'blur(5px)', opacity: 0.7, pointerEvents: 'none' }}>
                    <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: C.textMute }}>Cote totale</span>
                    <span className="font-mono text-[16px] font-black ml-3" style={{ color: C.baobab }}>12.84</span>
                  </div>
                  <div className="absolute right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{
                    backgroundColor: `${C.baobab}15`,
                    border: `1px solid ${C.baobab}40`,
                  }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={C.baobab} strokeWidth="2.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span className="text-[8px] font-black uppercase" style={{ color: C.baobab }}>VIP</span>
                  </div>
                </div>
              </div>

              {/* CTA déverrouiller — ouvre le modal (instructions + vérificateur ID) */}
              <div className="px-3 pb-3">
                <button
                  onClick={() => setShowModal(true)}
                  className="block w-full h-[42px] rounded-xl font-black text-[12px] uppercase tracking-wider transition-all hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${C.gold} 0%, ${brandColor} 100%)`,
                    color: C.bg,
                    boxShadow: `0 8px 24px ${brandGlow}, 0 4px 12px ${C.gold}30`,
                  }} data-cta="vip-unlock-3d">
                  <span className="inline-flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Débloquer le coupon
                  </span>
                </button>
                <p className="text-[9px] text-center mt-2" style={{ color: C.textMute }}>
                  Accès immédiat · 6 pronostics premium · 18+
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 2. SÉLECTEUR BOOKMAKER — couleurs de marque ═══ */}
        <section className="max-w-md mx-auto px-4 pb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2 text-center" style={{ color: C.textMute }}>
            Choisis ton bookmaker · Code copié auto
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {/* Linebet — VERT CLAIR */}
            <button onClick={() => selectBookmaker('linebet')}
              className="relative py-2.5 rounded-xl text-[12px] font-bold transition-all overflow-hidden"
              style={{
                backgroundColor: bookmaker === 'linebet' ? BRAND.linebet.primary : 'transparent',
                color: bookmaker === 'linebet' ? C.bg : BRAND.linebet.primary,
                border: `1px solid ${bookmaker === 'linebet' ? BRAND.linebet.primary : C.border}`,
                boxShadow: bookmaker === 'linebet' ? `0 4px 16px ${BRAND.linebet.primaryGlow}` : 'none',
              }}>
              Linebet
              {bookmaker === 'linebet' && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.bg }} />
              )}
            </button>
            {/* 888Starz — ROUGE CLAIR */}
            <button onClick={() => selectBookmaker('888starz')}
              className="relative py-2.5 rounded-xl text-[12px] font-bold transition-all overflow-hidden"
              style={{
                backgroundColor: bookmaker === '888starz' ? BRAND.star888.primary : 'transparent',
                color: bookmaker === '888starz' ? C.bg : BRAND.star888.primary,
                border: `1px solid ${bookmaker === '888starz' ? BRAND.star888.primary : C.border}`,
                boxShadow: bookmaker === '888starz' ? `0 4px 16px ${BRAND.star888.primaryGlow}` : 'none',
              }}>
              888Starz
              {bookmaker === '888starz' && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.bg }} />
              )}
            </button>
          </div>
        </section>

        {/* ═══ 3. CARTE CODE PROMO — couleur bookmaker ═══ */}
        <section className="max-w-md mx-auto px-4 pb-4">
          <div className="rounded-2xl overflow-hidden" style={{
            background: `linear-gradient(135deg, ${C.surface} 0%, ${C.bg} 100%)`,
            border: `1px solid ${brandColor}40`,
            boxShadow: `0 4px 20px ${brandGlow}`,
          }}>
            <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${brandColor}, ${C.gold}, ${brandColor})` }} />

            <div className="p-4 text-center">
              <p className="text-[9px] uppercase tracking-[0.25em] mb-1" style={{ color: C.textMute }}>Code promo {bookmaker === 'linebet' ? 'Linebet' : '888Starz'}</p>

              <button onClick={copyCode} className="inline-flex items-center gap-2 px-5 py-2 rounded-lg transition-all hover:scale-[1.02] mb-2"
                style={{ backgroundColor: `${brandColor}15`, border: `1px dashed ${brandColor}50` }}>
                <span className="text-xl font-black tracking-wider" style={{
                  color: brandColor,
                  fontFamily: 'var(--font-mono), monospace',
                  textShadow: `0 0 14px ${brandGlow}`,
                }}>
                  {code}
                </span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={copiedCode ? C.success : brandColor} strokeWidth="2.5">
                  {copiedCode ? <polyline points="20 6 9 17 4 12" /> : <rect x="9" y="9" width="13" height="13" rx="2" />}
                  {!copiedCode && <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />}
                </svg>
              </button>

              <p className="text-[10px]" style={{ color: C.textSec }}>
                <span className="font-bold" style={{ color: brandColor }}>{bonus}</span> · Dépôt min 3 000 F
              </p>

              {/* Boutons */}
              <div className="space-y-1.5 mt-3">
                <a href={inscriptionLink} target="_blank" rel="noopener noreferrer nofollow sponsored"
                  className="block w-full h-[38px] rounded-lg font-bold text-[12px] flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01]"
                  style={{ backgroundColor: brandColor, color: C.bg, boxShadow: `0 4px 14px ${brandGlow}` }} data-cta="vip-inscription">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  S&apos;inscrire sur {bookmaker === 'linebet' ? 'Linebet' : '888Starz'}
                </a>
                <a href={apkLink} target="_blank" rel="noopener noreferrer nofollow sponsored"
                  className="block w-full h-[34px] rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all"
                  style={{ backgroundColor: 'transparent', color: C.textSec, border: `1px solid ${C.border}` }} data-cta="vip-apk">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  Télécharger APK
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 4. ÉTAPES DÉVERROUILLAGE ═══ */}
        <section className="max-w-md mx-auto px-4 pb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3 text-center" style={{ color: C.textMute }}>
            Déverrouillage en 3 étapes
          </h2>
          <div className="space-y-1.5 mb-3">
            <div className="rounded-lg p-2.5 flex items-center gap-3" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0" style={{ backgroundColor: brandColor, color: C.bg }}>1</span>
              <p className="text-[11px]" style={{ color: C.text }}>Inscris-toi avec le code <strong style={{ color: brandColor }}>{code}</strong></p>
            </div>
            <div className="rounded-lg p-2.5 flex items-center gap-3" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, color: C.textSec }}>2</span>
              <p className="text-[11px]" style={{ color: C.textSec }}>Dépose 3 000 F via Wave, Orange Money, MTN</p>
            </div>
            <div className="rounded-lg p-2.5 flex items-center gap-3" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, color: C.textSec }}>3</span>
              <p className="text-[11px]" style={{ color: C.textSec }}>Envoie ton ID sur WhatsApp pour vérification</p>
            </div>
          </div>

          <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Salut BTTSPredict, code '+code+' depot 3000F. Debloquer VIP.')}`} target="_blank" rel="noopener noreferrer"
            className="block w-full h-[40px] rounded-lg font-bold text-[12px] flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            style={{ backgroundColor: C.success, color: C.bg, boxShadow: `0 4px 14px ${C.success}30` }} data-cta="vip-whatsapp">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            Vérifier via WhatsApp
          </a>
        </section>

        {/* ═══ FOOTER LÉGAL ═══ */}
        <section className="max-w-md mx-auto px-4 pb-10">
          <div className="rounded-lg p-2.5 text-center" style={{ backgroundColor: 'rgba(255,209,102,0.06)', border: '1px solid rgba(255,209,102,0.15)' }}>
            <p className="text-[10px]" style={{ color: C.textMute }}>
              18+ · Aucun gain garanti · Affiliation rémunéré ·{' '}
              <a href="/jouer-responsable" className="underline" style={{ color: C.warning }}>Jeu responsable</a>
            </p>
          </div>
        </section>

        <ErrorBoundary><Footer /></ErrorBoundary>
      </main>

      {/* ═══ MODAL DE DÉVERROUILLAGE (instructions + vérificateur ID) ═══ */}
      <ErrorBoundary>
        <VipUnlockModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </ErrorBoundary>
    </div>
  )
}

// ─── Team logo mini ───
function TeamLogoMini({ src, name, initial }: { src?: string; name: string; initial: string }) {
  const [err, setErr] = useState(false)
  if (!src || err) {
    return (
      <span
        className="w-7 h-7 flex items-center justify-center text-[11px] font-black rounded flex-shrink-0"
        style={{ backgroundColor: '#2d2f31', color: '#22c55e' }}
        aria-label={name}
        title={name}
      >
        {initial}
      </span>
    )
  }
  return (
    <img
      src={src}
      alt={`Logo ${name}`}
      className="w-7 h-7 object-contain flex-shrink-0 rounded"
      width={28}
      height={28}
      loading="lazy"
      decoding="async"
      onError={() => setErr(true)}
    />
  )
}
