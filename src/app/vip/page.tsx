'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { AFFILIATE, SITE } from '@/lib/constants'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const ErrorBoundary = dynamic(() => import('@/components/bttsbet/ErrorBoundary'), { loading: () => null })
const PromoVip = dynamic(() => import('@/components/bttsbet/PromoVip'), { loading: () => null })

/* --- VRAIS LIENS AFFILIES --- */
const LIEN_LINEBET = AFFILIATE.linebet
const LIEN_LINEBET_APK = AFFILIATE.linebetDownload
const LIEN_888STARZ = AFFILIATE.star888
const LIEN_888STARZ_APK = AFFILIATE.star888Download
const WHATSAPP = '15406704172'

/* --- Palette --- */
const C = {
  bg:'#07111A', surface:'#102333', border:'#1C3546',
  text:'#F2F7F5', textSec:'#B5C4C9', textMute:'#7F969E',
  baobab:'#C7F464', data:'#63D6FF', copper:'#FF9F5A',
  success:'#7BE495', warning:'#FFD166',
}

/* --- 6 sports logos pour carte Multi-Sport --- */
const SPORTS = [
  { name:'Football', emoji:'\u26BD', color:'#C7F464' },
  { name:'Tennis', emoji:'\u1F3BE', color:'#63D6FF' },
  { name:'NBA', emoji:'\u1F3C0', color:'#FF9F5A' },
  { name:'NFL', emoji:'\u1F3C8', color:'#7BE495' },
  { name:'UFC', emoji:'\u1F94B', color:'#FF7A7A' },
  { name:'Handball', emoji:'\u1F93C', color:'#FFD166' },
]

export default function VipPage() {
  const [copiedCode,setCopiedCode]=useState(false)
  const [toast,setToast]=useState('')
  const [bookmaker,setBookmaker]=useState<'linebet'|'888starz'>('linebet')

  const code=bookmaker==='linebet'?'VISION221':'vision221'
  const inscriptionLink=bookmaker==='linebet'?LIEN_LINEBET:LIEN_888STARZ
  const apkLink=bookmaker==='linebet'?LIEN_LINEBET_APK:LIEN_888STARZ_APK

  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),2500)}
  const copyCode=async()=>{
    try{await navigator.clipboard.writeText(code);setCopiedCode(true);showToast(`Code copie : ${code}`);setTimeout(()=>setCopiedCode(false),2000)}
    catch{const el=document.createElement('textarea');el.value=code;document.body.appendChild(el);el.select();try{document.execCommand('copy')}catch{}document.body.removeChild(el);setCopiedCode(true);showToast(`Code copie : ${code}`);setTimeout(()=>setCopiedCode(false),2000)}
  }

  return (
    <div className="min-h-screen flex flex-col" style={{backgroundColor:C.bg,color:C.text}}>
      <ErrorBoundary><Navbar /></ErrorBoundary>
      <main id="main-content" className="flex-1 relative z-10" style={{paddingBottom:'calc(80px + env(safe-area-inset-bottom, 0px))'}}>

        {toast&&<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl font-bold text-sm shadow-2xl" style={{backgroundColor:C.baobab,color:C.bg}}>{toast}</div>}

        {/* --- HEADER --- */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{fontFamily:'Poppins, sans-serif'}}>
            Pronostics VIP
          </h1>
          <p className="text-sm max-w-lg mx-auto" style={{color:C.textSec}}>
            Football + Multi-Sports. Debloque avec VISION221 ou vision221.
          </p>
        </section>

        {/* --- 2 CARTES 3D --- */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* CARTE 3D - LINEBET FOOTBALL */}
            <div
              className="relative rounded-2xl p-6 text-center transition-all duration-300 hover:scale-[1.03]"
              style={{
                background: `linear-gradient(145deg, ${C.surface} 0%, ${C.bg} 100%)`,
                border: `1px solid ${C.baobab}44`,
                boxShadow: `0 10px 40px ${C.baobab}11, 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 ${C.baobab}22`,
                transform: 'perspective(1000px) rotateX(2deg)',
              }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{background:`radial-gradient(circle at 50% 0%, ${C.baobab}15, transparent 70%)`}} />

              {/* Badge */}
              <div className="relative mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider"
                  style={{backgroundColor:`${C.baobab}1A`,color:C.baobab,border:`1px solid ${C.baobab}33`}}>
                  {'\u26BD'} Football VIP
                </span>
              </div>

              {/* Code promo */}
              <p className="text-[10px] uppercase tracking-widest mb-1" style={{color:C.textMute}}>Code promo</p>
              <p className="text-2xl font-black mb-1" style={{color:C.baobab,fontFamily:'var(--font-mono), monospace',textShadow:`0 0 20px ${C.baobab}44`}}>
                VISION221
              </p>
              <p className="text-[11px] mb-4" style={{color:C.textSec}}>Bonus 90,000 XOF - Min deposit 3,000 F</p>

              {/* Boutons */}
              <div className="space-y-2">
                <a href={LIEN_LINEBET} target="_blank" rel="noopener noreferrer nofollow sponsored"
                  className="block w-full h-[40px] rounded-lg font-bold text-[12px] flex items-center justify-center transition-all"
                  style={{backgroundColor:C.baobab,color:C.bg,boxShadow:`0 2px 8px ${C.baobab}33`}}
                  data-cta="vip-3d-linebet-inscription">
                  S&apos;inscrire sur Linebet
                </a>
                <a href={LIEN_LINEBET_APK} target="_blank" rel="noopener noreferrer nofollow sponsored"
                  className="block w-full h-[40px] rounded-lg font-bold text-[12px] flex items-center justify-center transition-all"
                  style={{backgroundColor:'transparent',color:C.textSec,border:`1px solid ${C.border}`}}
                  data-cta="vip-3d-linebet-apk">
                  {'\u1F4E5'} Telecharger APK
                </a>
              </div>
            </div>

            {/* CARTE 3D - MULTI-SPORT */}
            <div
              className="relative rounded-2xl p-6 text-center transition-all duration-300 hover:scale-[1.03]"
              style={{
                background: `linear-gradient(145deg, ${C.surface} 0%, ${C.bg} 100%)`,
                border: `1px solid ${C.data}44`,
                boxShadow: `0 10px 40px ${C.data}11, 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 ${C.data}22`,
                transform: 'perspective(1000px) rotateX(2deg)',
              }}
            >
              {/* Glow */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{background:`radial-gradient(circle at 50% 0%, ${C.data}15, transparent 70%)`}} />

              {/* Badge */}
              <div className="relative mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider"
                  style={{backgroundColor:`${C.data}1A`,color:C.data,border:`1px solid ${C.data}33`}}>
                  {'\u1F3AF'} Multi-Sports VIP
                </span>
              </div>

              {/* 6 sports logos */}
              <div className="grid grid-cols-6 gap-1 mb-3">
                {SPORTS.map((s,i)=>(
                  <div key={i} className="flex flex-col items-center gap-0.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[14px]"
                      style={{backgroundColor:`${s.color}15`,border:`1px solid ${s.color}33`}}>
                      {s.emoji}
                    </div>
                    <span className="text-[7px] font-bold" style={{color:C.textMute}}>{s.name.slice(0,3)}</span>
                  </div>
                ))}
              </div>

              {/* Code promo */}
              <p className="text-[10px] uppercase tracking-widest mb-1" style={{color:C.textMute}}>Code promo</p>
              <p className="text-2xl font-black mb-1" style={{color:C.data,fontFamily:'var(--font-mono), monospace',textShadow:`0 0 20px ${C.data}44`}}>
                vision221
              </p>
              <p className="text-[11px] mb-4" style={{color:C.textSec}}>
                  Bonus 200% - Min deposit 3,000 F
                </p>

              {/* Boutons */}
              <div className="space-y-2">
                <a href={LIEN_888STARZ} target="_blank" rel="noopener noreferrer nofollow sponsored"
                  className="block w-full h-[40px] rounded-lg font-bold text-[12px] flex items-center justify-center transition-all"
                  style={{backgroundColor:C.data,color:C.bg,boxShadow:`0 2px 8px ${C.data}33`}}
                  data-cta="vip-3d-888starz-inscription">
                  S&apos;inscrire sur 888Starz
                </a>
                <a href={LIEN_888STARZ_APK} target="_blank" rel="noopener noreferrer nofollow sponsored"
                  className="block w-full h-[40px] rounded-lg font-bold text-[12px] flex items-center justify-center transition-all"
                  style={{backgroundColor:'transparent',color:C.textSec,border:`1px solid ${C.border}`}}
                  data-cta="vip-3d-888starz-apk">
                  {'\u1F4E5'} Telecharger APK
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* --- COUPON FLOUTE --- */}
        <section className="pb-8"><PromoVip /></section>

        {/* --- TUNNEL DEBLOCAGE --- */}
        <section id="tunnel" className="max-w-md mx-auto px-4 sm:px-6 pb-8">
          <h2 className="text-base font-bold mb-4 text-center" style={{fontFamily:'Poppins, sans-serif'}}>Debloquer ton VIP</h2>

          {/* Progression */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{backgroundColor:C.baobab,color:C.bg}}>1</span>
              <span className="text-[10px] font-bold" style={{color:C.text}}>Inscription</span>
            </div>
            <div className="w-6 h-px" style={{backgroundColor:C.border}} />
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{backgroundColor:C.surface,border:`1px solid ${C.border}`,color:C.textSec}}>2</span>
              <span className="text-[10px]" style={{color:C.textSec}}>Depot</span>
            </div>
            <div className="w-6 h-px" style={{backgroundColor:C.border}} />
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{backgroundColor:C.surface,border:`1px solid ${C.border}`,color:C.textSec}}>3</span>
              <span className="text-[10px]" style={{color:C.textSec}}>WhatsApp</span>
            </div>
          </div>

          {/* Choix bookmaker */}
          <div className="flex gap-2 mb-3">
            <button onClick={()=>setBookmaker('linebet')} className="flex-1 py-2 rounded-lg font-bold text-[11px]"
              style={{backgroundColor:bookmaker==='linebet'?C.baobab:'transparent',color:bookmaker==='linebet'?C.bg:C.textSec,border:`1px solid ${bookmaker==='linebet'?C.baobab:C.border}`}}>
              Linebet
            </button>
            <button onClick={()=>setBookmaker('888starz')} className="flex-1 py-2 rounded-lg font-bold text-[11px]"
              style={{backgroundColor:bookmaker==='888starz'?C.data:'transparent',color:bookmaker==='888starz'?C.bg:C.textSec,border:`1px solid ${bookmaker==='888starz'?C.data:C.border}`}}>
              888Starz
            </button>
          </div>

          {/* Code cliquable */}
          <div className="text-center mb-3">
            <button onClick={copyCode} className="inline-flex items-center gap-2 cursor-pointer bg-transparent border-0 p-0">
              <span className="text-xl font-black tracking-[0.1em]" style={{color:bookmaker==='linebet'?C.baobab:C.data,fontFamily:'var(--font-mono), monospace'}}>{code}</span>
              <span className="inline-flex items-center justify-center w-7 h-7 rounded" style={{backgroundColor:copiedCode?C.success:`${bookmaker==='linebet'?C.baobab:C.data}1A`,border:`1px solid ${copiedCode?C.success:(bookmaker==='linebet'?C.baobab:C.data)}`,color:copiedCode?C.bg:(bookmaker==='linebet'?C.baobab:C.data)}}>
                {copiedCode?'OK':'\u1F4CB'}
              </span>
            </button>
          </div>

          {/* Boutons */}
          <a href={inscriptionLink} target="_blank" rel="noopener noreferrer nofollow sponsored"
            className="block w-full h-[44px] rounded-lg font-bold text-[13px] flex items-center justify-center mb-2"
            style={{backgroundColor:bookmaker==='linebet'?C.baobab:C.data,color:C.bg}} data-cta="vip-tunnel-inscription">
            S&apos;inscrire
          </a>
          <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Salut BTTSPredict, code "+code+" depot 3000F. Debloquer VIP.")}`} target="_blank" rel="noopener noreferrer"
            className="block w-full h-[44px] rounded-lg font-bold text-[13px] flex items-center justify-center"
            style={{backgroundColor:C.success,color:C.bg}} data-cta="vip-tunnel-whatsapp">
            Verifier via WhatsApp
          </a>
          <p className="text-[10px] text-center mt-3" style={{color:C.textMute}}>Affiliation remunere. 18+. Aucun gain garanti. Delai 15-60 min.</p>
        </section>

        {/* --- FOOTER --- */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-10">
          <div className="rounded-lg p-3 text-center" style={{backgroundColor:'rgba(255,209,102,0.06)',border:'1px solid rgba(255,209,102,0.15)'}}>
            <p className="text-[10px]" style={{color:C.textMute}}>
              18+ - Aucun gain garanti - Lien d&apos;affiliation remunere - BTTSPredict ne prend pas de paris.
              {' '}<a href="/jouer-responsable" className="underline" style={{color:C.warning}}>Jeu responsable</a>
            </p>
          </div>
        </section>

        <ErrorBoundary><Footer /></ErrorBoundary>
      </main>
    </div>
  )
}
