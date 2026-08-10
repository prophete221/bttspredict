'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { AFFILIATE } from '@/lib/constants'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const ErrorBoundary = dynamic(() => import('@/components/bttsbet/ErrorBoundary'), { loading: () => null })
const PromoVip = dynamic(() => import('@/components/bttsbet/PromoVip'), { loading: () => null })

const LIEN_LINEBET = AFFILIATE.linebet
const LIEN_LINEBET_APK = AFFILIATE.linebetDownload
const LIEN_888STARZ = AFFILIATE.star888
const LIEN_888STARZ_APK = AFFILIATE.star888Download
const WHATSAPP = '15406704172'

const C = {
  bg:'#07111A', surface:'#102333', border:'#1C3546',
  text:'#F2F7F5', textSec:'#B5C4C9', textMute:'#7F969E',
  baobab:'#C7F464', data:'#63D6FF', copper:'#FF9F5A', success:'#7BE495', warning:'#FFD166',
  gold:'#FFD700', goldDk:'#B8860B',
}

const VIP_PERKS = [
  { icon: '🎯', title: 'Pronos premium', desc: 'Sélections exclusives BTTS + Over 2.5' },
  { icon: '⚡', title: 'Mise à jour 4x/jour', desc: '08h, 12h, 16h, 20h' },
  { icon: '🔐', title: 'Coupon du jour', desc: '6 pronostics premium à débloquer' },
  { icon: '💬', title: 'Support WhatsApp', desc: 'Vérification en 15-60 min' },
]

export default function VipPage() {
  const [copiedCode,setCopiedCode]=useState(false)
  const [toast,setToast]=useState('')
  const [bookmaker,setBookmaker]=useState<'linebet'|'888starz'>('linebet')

  const code=bookmaker==='linebet'?'VISION221':'vision221'
  const inscriptionLink=bookmaker==='linebet'?LIEN_LINEBET:LIEN_888STARZ
  const apkLink=bookmaker==='linebet'?LIEN_LINEBET_APK:LIEN_888STARZ_APK
  const bonus=bookmaker==='linebet'?'Bonus 90 000 XOF':'Bonus 200%'

  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),2500)}
  const copyCode=async()=>{
    try{await navigator.clipboard.writeText(code);setCopiedCode(true);showToast('Code copié');setTimeout(()=>setCopiedCode(false),2000)}
    catch{const el=document.createElement('textarea');el.value=code;document.body.appendChild(el);el.select();try{document.execCommand('copy')}catch{}document.body.removeChild(el);setCopiedCode(true);showToast('Code copié');setTimeout(()=>setCopiedCode(false),2000)}
  }

  return (
    <div className="min-h-screen flex flex-col" style={{backgroundColor:C.bg,color:C.text}}>
      <ErrorBoundary><Navbar /></ErrorBoundary>
      <main id="main-content" className="flex-1 relative z-10" style={{paddingBottom:'calc(80px + env(safe-area-inset-bottom, 0px))'}}>

        {toast&&<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl font-bold text-sm shadow-2xl" style={{backgroundColor:C.baobab,color:C.bg}}>{toast}</div>}

        {/* ═══ HERO VIP ═══ */}
        <section className="relative overflow-hidden pt-10 pb-6">
          {/* Glow background */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background:`radial-gradient(ellipse 60% 50% at 50% 0%, ${C.gold}15, transparent 70%)`,
          }} />
          <div className="absolute inset-0 pointer-events-none" style={{
            background:`radial-gradient(ellipse 40% 30% at 50% 20%, ${C.baobab}10, transparent 60%)`,
          }} />

          <div className="relative max-w-md mx-auto px-4 text-center">
            {/* Crown icon */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3" style={{
              backgroundColor:`${C.gold}15`,
              border:`1px solid ${C.gold}40`,
              boxShadow:`0 0 30px ${C.gold}20`,
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill={C.gold}>
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm0 2h14v2H5v-2z"/>
              </svg>
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
              style={{backgroundColor:`${C.gold}1A`,color:C.gold,border:`1px solid ${C.gold}40`}}>
              ✦ Programme Premium ✦
            </span>

            <h1 className="text-3xl sm:text-4xl font-black mb-2" style={{
              fontFamily:'Poppins, sans-serif',
              background:`linear-gradient(135deg, ${C.gold} 0%, ${C.baobab} 100%)`,
              WebkitBackgroundClip:'text',
              WebkitTextFillColor:'transparent',
              backgroundClip:'text',
            }}>
              VIP BTTSPredict
            </h1>

            <p className="text-xs mb-4" style={{color:C.textSec}}>
              Pronostics premium · Coupon quotidien · Déblocage immédiat
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="rounded-lg p-2" style={{backgroundColor:C.surface,border:`1px solid ${C.border}`}}>
                <div className="text-lg font-black" style={{color:C.gold}}>6</div>
                <div className="text-[9px] uppercase tracking-wider" style={{color:C.textMute}}>Matchs/jour</div>
              </div>
              <div className="rounded-lg p-2" style={{backgroundColor:C.surface,border:`1px solid ${C.border}`}}>
                <div className="text-lg font-black" style={{color:C.baobab}}>4x</div>
                <div className="text-[9px] uppercase tracking-wider" style={{color:C.textMute}}>Maj/jour</div>
              </div>
              <div className="rounded-lg p-2" style={{backgroundColor:C.surface,border:`1px solid ${C.border}`}}>
                <div className="text-lg font-black" style={{color:C.data}}>15min</div>
                <div className="text-[9px] uppercase tracking-wider" style={{color:C.textMute}}>Vérif.</div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ CARTE VIP COMPACTE ═══ */}
        <section className="max-w-md mx-auto px-4 pb-5">
          <div className="relative rounded-xl overflow-hidden" style={{
            background:`linear-gradient(135deg, ${C.surface} 0%, ${C.bg} 100%)`,
            border:`1px solid ${C.gold}30`,
            boxShadow:`0 8px 32px ${C.gold}10, 0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 ${C.gold}20`,
          }}>
            {/* Top accent */}
            <div className="h-[3px] w-full" style={{background:`linear-gradient(90deg, ${C.gold}, ${C.baobab}, ${C.gold})`}} />

            <div className="p-4">
              {/* Bookmaker selector — compact */}
              <div className="grid grid-cols-2 gap-1.5 mb-3">
                <button onClick={()=>setBookmaker('linebet')} className="py-2 rounded-lg text-[11px] font-bold transition-all"
                  style={{
                    backgroundColor:bookmaker==='linebet'?C.baobab:'transparent',
                    color:bookmaker==='linebet'?C.bg:C.textMute,
                    border:`1px solid ${bookmaker==='linebet'?C.baobab:C.border}`,
                  }}>
                  Linebet
                </button>
                <button onClick={()=>setBookmaker('888starz')} className="py-2 rounded-lg text-[11px] font-bold transition-all"
                  style={{
                    backgroundColor:bookmaker==='888starz'?C.data:'transparent',
                    color:bookmaker==='888starz'?C.bg:C.textMute,
                    border:`1px solid ${bookmaker==='888starz'?C.data:C.border}`,
                  }}>
                  888Starz
                </button>
              </div>

              {/* Code promo — compact */}
              <div className="text-center mb-3">
                <p className="text-[9px] uppercase tracking-[0.2em] mb-1" style={{color:C.textMute}}>Code promo</p>
                <button onClick={copyCode} className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all hover:scale-[1.02]"
                  style={{backgroundColor:`${C.baobab}15`,border:`1px dashed ${C.baobab}40`}}>
                  <span className="text-lg font-black tracking-wider" style={{
                    color:C.baobab,
                    fontFamily:'var(--font-mono), monospace',
                    textShadow:`0 0 12px ${C.baobab}40`,
                  }}>
                    {code}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={copiedCode?C.success:C.baobab} strokeWidth="2.5">
                    {copiedCode ? <polyline points="20 6 9 17 4 12" /> : <rect x="9" y="9" width="13" height="13" rx="2" />}
                    {!copiedCode && <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />}
                  </svg>
                </button>
                <p className="text-[10px] mt-1.5" style={{color:C.textSec}}>
                  <span style={{color:C.gold}}>{bonus}</span> · Dépôt min 3 000 F
                </p>
              </div>

              {/* Boutons — compact */}
              <div className="space-y-1.5">
                <a href={inscriptionLink} target="_blank" rel="noopener noreferrer nofollow sponsored"
                  className="block w-full h-[36px] rounded-lg font-bold text-[12px] flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01]"
                  style={{backgroundColor:C.baobab,color:C.bg,boxShadow:`0 4px 14px ${C.baobab}30`}} data-cta="vip-inscription">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  S&apos;inscrire sur {bookmaker==='linebet'?'Linebet':'888Starz'}
                </a>
                <a href={apkLink} target="_blank" rel="noopener noreferrer nofollow sponsored"
                  className="block w-full h-[34px] rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all"
                  style={{backgroundColor:'transparent',color:C.textSec,border:`1px solid ${C.border}`}} data-cta="vip-apk">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  Télécharger APK
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ PERKS — grille compacte ═══ */}
        <section className="max-w-md mx-auto px-4 pb-5">
          <div className="grid grid-cols-2 gap-2">
            {VIP_PERKS.map((perk, i) => (
              <div key={i} className="rounded-lg p-3 transition-all hover:border-[#FFD700]/30" style={{
                backgroundColor:C.surface,
                border:`1px solid ${C.border}`,
              }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{perk.icon}</span>
                  <span className="text-[11px] font-bold" style={{color:C.gold}}>{perk.title}</span>
                </div>
                <p className="text-[10px] leading-tight" style={{color:C.textSec}}>{perk.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ ÉTAPES DÉVERROUILLAGE — compact ═══ */}
        <section className="max-w-md mx-auto px-4 pb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3 text-center" style={{color:C.textMute}}>
            Déverrouillage en 3 étapes
          </h2>

          <div className="space-y-1.5 mb-3">
            <div className="rounded-lg p-2.5 flex items-center gap-3" style={{backgroundColor:C.surface,border:`1px solid ${C.border}`}}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0" style={{backgroundColor:C.baobab,color:C.bg}}>1</span>
              <p className="text-[11px]" style={{color:C.text}}>Inscris-toi avec le code <strong style={{color:C.baobab}}>{code}</strong></p>
            </div>
            <div className="rounded-lg p-2.5 flex items-center gap-3" style={{backgroundColor:C.surface,border:`1px solid ${C.border}`}}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0" style={{backgroundColor:C.surface,border:`1px solid ${C.border}`,color:C.textSec}}>2</span>
              <p className="text-[11px]" style={{color:C.textSec}}>Dépose 3 000 F via Wave, Orange Money, MTN</p>
            </div>
            <div className="rounded-lg p-2.5 flex items-center gap-3" style={{backgroundColor:C.surface,border:`1px solid ${C.border}`}}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0" style={{backgroundColor:C.surface,border:`1px solid ${C.border}`,color:C.textSec}}>3</span>
              <p className="text-[11px]" style={{color:C.textSec}}>Envoie ton ID sur WhatsApp pour vérification</p>
            </div>
          </div>

          <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Salut BTTSPredict, code '+code+' depot 3000F. Debloquer VIP.')}`} target="_blank" rel="noopener noreferrer"
            className="block w-full h-[40px] rounded-lg font-bold text-[12px] flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            style={{backgroundColor:C.success,color:C.bg,boxShadow:`0 4px 14px ${C.success}30`}} data-cta="vip-whatsapp">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Vérifier via WhatsApp
          </a>
        </section>

        {/* ═══ CARTE VERROUILLÉE PREMIUM ═══ */}
        <section className="pb-5"><PromoVip /></section>

        {/* ═══ FOOTER LÉGAL ═══ */}
        <section className="max-w-md mx-auto px-4 pb-10">
          <div className="rounded-lg p-2.5 text-center" style={{backgroundColor:'rgba(255,209,102,0.06)',border:'1px solid rgba(255,209,102,0.15)'}}>
            <p className="text-[10px]" style={{color:C.textMute}}>
              18+ · Aucun gain garanti · Affiliation rémunéré ·{' '}
              <a href="/jouer-responsable" className="underline" style={{color:C.warning}}>Jeu responsable</a>
            </p>
          </div>
        </section>

        <ErrorBoundary><Footer /></ErrorBoundary>
      </main>
    </div>
  )
}
