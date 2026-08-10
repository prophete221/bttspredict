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
}

export default function VipPage() {
  const [copiedCode,setCopiedCode]=useState(false)
  const [toast,setToast]=useState('')
  const [bookmaker,setBookmaker]=useState<'linebet'|'888starz'>('linebet')

  const code=bookmaker==='linebet'?'VISION221':'vision221'
  const inscriptionLink=bookmaker==='linebet'?LIEN_LINEBET:LIEN_888STARZ
  const apkLink=bookmaker==='linebet'?LIEN_LINEBET_APK:LIEN_888STARZ_APK

  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),2500)}
  const copyCode=async()=>{
    try{await navigator.clipboard.writeText(code);setCopiedCode(true);showToast('Code copie');setTimeout(()=>setCopiedCode(false),2000)}
    catch{const el=document.createElement('textarea');el.value=code;document.body.appendChild(el);el.select();try{document.execCommand('copy')}catch{}document.body.removeChild(el);setCopiedCode(true);showToast('Code copie');setTimeout(()=>setCopiedCode(false),2000)}
  }

  return (
    <div className="min-h-screen flex flex-col" style={{backgroundColor:C.bg,color:C.text}}>
      <ErrorBoundary><Navbar /></ErrorBoundary>
      <main id="main-content" className="flex-1 relative z-10" style={{paddingBottom:'calc(80px + env(safe-area-inset-bottom, 0px))'}}>

        {toast&&<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl font-bold text-sm shadow-2xl" style={{backgroundColor:C.baobab,color:C.bg}}>{toast}</div>}

        {/* HEADER */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{fontFamily:'Poppins, sans-serif'}}>VIP</h1>
          <p className="text-sm" style={{color:C.textSec}}>Pronostics premium. Debloque avec VISION221 ou vision221.</p>
        </section>

        {/* CARTE VIP 3D */}
        <section className="max-w-sm mx-auto px-4 pb-6">
          <div
            className="relative rounded-2xl p-6 text-center transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: `linear-gradient(145deg, ${C.surface} 0%, ${C.bg} 100%)`,
              border: `1px solid ${C.baobab}44`,
              boxShadow: `0 10px 40px ${C.baobab}11, 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 ${C.baobab}22`,
              transform: 'perspective(1000px) rotateX(2deg)',
            }}
          >
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{background:`radial-gradient(circle at 50% 0%, ${C.baobab}15, transparent 70%)`}} />

            <div className="relative mb-3">
              <span className="inline-block px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider"
                style={{backgroundColor:`${C.baobab}1A`,color:C.baobab,border:`1px solid ${C.baobab}33`}}>
                VIP Premium
              </span>
            </div>

            {/* Code promo */}
            <p className="text-[10px] uppercase tracking-widest mb-1" style={{color:C.textMute}}>Code promo</p>
            <p className="text-2xl font-black mb-1" style={{color:C.baobab,fontFamily:'var(--font-mono), monospace',textShadow:`0 0 20px ${C.baobab}44`}}>
              {code}
            </p>
            <p className="text-[11px] mb-4" style={{color:C.textSec}}>{bookmaker==='linebet'?'Bonus 90 000 XOF':'Bonus 200%'} - Depot min 3 000 F</p>

            {/* Boutons */}
            <div className="space-y-2">
              <button onClick={copyCode} className="block w-full h-[40px] rounded-lg font-bold text-[12px] flex items-center justify-center"
                style={{backgroundColor:copiedCode?C.success:C.baobab,color:C.bg}}>
                {copiedCode?'Copie !':'Copier le code'}
              </button>
              <a href={inscriptionLink} target="_blank" rel="noopener noreferrer nofollow sponsored"
                className="block w-full h-[40px] rounded-lg font-bold text-[12px] flex items-center justify-center"
                style={{backgroundColor:'transparent',color:C.textSec,border:`1px solid ${C.border}`}} data-cta="vip-inscription">
                S&apos;inscrire sur {bookmaker==='linebet'?'Linebet':'888Starz'}
              </a>
              <a href={apkLink} target="_blank" rel="noopener noreferrer nofollow sponsored"
                className="block w-full h-[40px] rounded-lg font-bold text-[12px] flex items-center justify-center"
                style={{backgroundColor:'transparent',color:C.textSec,border:`1px solid ${C.border}`}} data-cta="vip-apk">
                Telecharger APK
              </a>
            </div>

            {/* Choix bookmaker */}
            <div className="flex gap-2 mt-4">
              <button onClick={()=>setBookmaker('linebet')} className="flex-1 py-1.5 rounded text-[10px] font-bold"
                style={{backgroundColor:bookmaker==='linebet'?C.baobab:'transparent',color:bookmaker==='linebet'?C.bg:C.textMute,border:`1px solid ${bookmaker==='linebet'?C.baobab:C.border}`}}>
                Linebet VISION221
              </button>
              <button onClick={()=>setBookmaker('888starz')} className="flex-1 py-1.5 rounded text-[10px] font-bold"
                style={{backgroundColor:bookmaker==='888starz'?C.data:'transparent',color:bookmaker==='888starz'?C.bg:C.textMute,border:`1px solid ${bookmaker==='888starz'?C.data:C.border}`}}>
                888Starz vision221
              </button>
            </div>
          </div>
        </section>

        {/* MODELE DE DEVERROUILLAGE */}
        <section className="max-w-sm mx-auto px-4 pb-6">
          <h2 className="text-sm font-bold mb-4 text-center">Deverrouillage en 3 etapes</h2>

          <div className="flex items-center justify-center gap-1.5 mb-5">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{backgroundColor:C.baobab,color:C.bg}}>1</span>
            <span className="text-[10px]" style={{color:C.textSec}}>Inscription</span>
            <div className="w-4 h-px" style={{backgroundColor:C.border}} />
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{backgroundColor:C.surface,border:`1px solid ${C.border}`,color:C.textSec}}>2</span>
            <span className="text-[10px]" style={{color:C.textSec}}>Depot</span>
            <div className="w-4 h-px" style={{backgroundColor:C.border}} />
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{backgroundColor:C.surface,border:`1px solid ${C.border}`,color:C.textSec}}>3</span>
            <span className="text-[10px]" style={{color:C.textSec}}>WhatsApp</span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="rounded-lg p-3 flex items-center gap-3" style={{backgroundColor:C.surface,border:`1px solid ${C.border}`}}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0" style={{backgroundColor:C.baobab,color:C.bg}}>1</span>
              <p className="text-[11px]" style={{color:C.text}}>Inscris-toi avec le code <strong style={{color:C.baobab}}>{code}</strong></p>
            </div>
            <div className="rounded-lg p-3 flex items-center gap-3" style={{backgroundColor:C.surface,border:`1px solid ${C.border}`}}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0" style={{backgroundColor:C.surface,border:`1px solid ${C.border}`,color:C.textSec}}>2</span>
              <p className="text-[11px]" style={{color:C.textSec}}>Depose 3 000 F minimum via Wave, Orange Money, MTN</p>
            </div>
            <div className="rounded-lg p-3 flex items-center gap-3" style={{backgroundColor:C.surface,border:`1px solid ${C.border}`}}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0" style={{backgroundColor:C.surface,border:`1px solid ${C.border}`,color:C.textSec}}>3</span>
              <p className="text-[11px]" style={{color:C.textSec}}>Envoie ton ID sur WhatsApp pour verification (15-60 min)</p>
            </div>
          </div>

          <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Salut BTTSPredict, code '+code+' depot 3000F. Debloquer VIP.')}`} target="_blank" rel="noopener noreferrer"
            className="block w-full h-[44px] rounded-lg font-bold text-[13px] flex items-center justify-center gap-2"
            style={{backgroundColor:C.success,color:C.bg}} data-cta="vip-whatsapp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Verifier via WhatsApp
          </a>
        </section>

        {/* COUPON FLOUTE */}
        <section className="pb-6"><PromoVip /></section>

        {/* FOOTER LEGAL */}
        <section className="max-w-sm mx-auto px-4 pb-10">
          <div className="rounded-lg p-3 text-center" style={{backgroundColor:'rgba(255,209,102,0.06)',border:'1px solid rgba(255,209,102,0.15)'}}>
            <p className="text-[10px]" style={{color:C.textMute}}>
              18+ - Aucun gain garanti - Affiliation remunere -
              {' '}<a href="/jouer-responsable" className="underline" style={{color:C.warning}}>Jeu responsable</a>
            </p>
          </div>
        </section>

        <ErrorBoundary><Footer /></ErrorBoundary>
      </main>
    </div>
  )
}
