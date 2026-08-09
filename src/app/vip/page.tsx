'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { AFFILIATE, SITE } from '@/lib/constants'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const ErrorBoundary = dynamic(() => import('@/components/bttsbet/ErrorBoundary'), { loading: () => null })
const PromoVip = dynamic(() => import('@/components/bttsbet/PromoVip'), { loading: () => null })
const VipCardGrid = dynamic(() => import('@/components/bttsbet/VipCardGlass').then(m => ({ default: m.VipCardGrid })), { loading: () => null })
const VipSports = dynamic(() => import('@/components/bttsbet/VipSports'), { loading: () => null })
const HowToGetVip = dynamic(() => import('@/components/bttsbet/HowToGetVip'), { loading: () => null })
const AviatorVip = dynamic(() => import('@/components/bttsbet/AviatorVip'), { loading: () => null })

const LIEN_LINEBET = AFFILIATE.linebet
const LIEN_LINEBET_APK = AFFILIATE.linebetDownload
const LIEN_888STARZ = AFFILIATE.star888
const LIEN_888STARZ_APK = AFFILIATE.star888Download
const WHATSAPP = '15406704172'

const C = { bg:'#070A14', card:'#111827', border:'#1F2937', gold:'#D4AF37', goldDark:'#B7952E', emerald:'#10B981', whatsapp:'#25D366', text:'#F1F5F9', textSec:'#94A3B8', textMute:'#64748B', error:'#EF4444' }

export default function VipPage() {
  const [copiedCode,setCopiedCode]=useState(false)
  const [toast,setToast]=useState('')
  const [bookmaker,setBookmaker]=useState<'linebet'|'888starz'>('linebet')
  const code=bookmaker==='linebet'?'VISION221':'vision221'
  const inscriptionLink=bookmaker==='linebet'?LIEN_LINEBET:LIEN_888STARZ
  const apkLink=bookmaker==='linebet'?LIEN_LINEBET_APK:LIEN_888STARZ_APK
  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),2500)}
  const copyCode=async()=>{try{await navigator.clipboard.writeText(code);setCopiedCode(true);showToast(`Code copié ${code}`);setTimeout(()=>setCopiedCode(false),2000)}catch{const el=document.createElement('textarea');el.value=code;document.body.appendChild(el);el.select();try{document.execCommand('copy')}catch{}document.body.removeChild(el);setCopiedCode(true);showToast(`Code copié ${code}`);setTimeout(()=>setCopiedCode(false),2000)}}

  return (
    <div className="min-h-screen flex flex-col" style={{backgroundColor:C.bg,color:C.text}}>
      <ErrorBoundary><Navbar /></ErrorBoundary>
      <main id="main-content" className="flex-1 relative z-10" style={{paddingBottom:'calc(80px + env(safe-area-inset-bottom, 0px))'}}>
        {toast&&<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl font-bold text-sm shadow-2xl" style={{backgroundColor:C.emerald,color:C.bg}}>{toast}</div>}

        {/* 1. INTRODUCTION */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-6 text-center">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4" style={{backgroundColor:`${C.gold}1A`,color:C.gold,border:`1px solid ${C.gold}55`}}>★ Programme VIP Premium</span>
          <h1 className="text-3xl sm:text-5xl font-bold mb-3" style={{fontFamily:'Poppins, sans-serif'}}>Pronostics premium BTTS et Over 2.5</h1>
          <p className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed" style={{color:C.textSec}}>Sélections supplémentaires + analyses détaillées + même modèle Poisson. Aucun gain garanti. 18+.</p>
        </section>

        {/* 2. VALEUR */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[{t:'Sélections supplémentaires',d:'2 à 5 pronos premium/jour en plus des 6 gratuits',i:'📊'},{t:'Analyses détaillées',d:'xG par équipe, probabilités Poisson',i:'🔍'},{t:'Même modèle Poisson',d:'Pas de méthode secrète. Plus de matchs, c\'est tout.',i:'⚙️'}].map((v,i)=>(
              <div key={i} className="rounded-2xl p-5" style={{backgroundColor:C.card,border:`1px solid ${C.border}`}}><div className="text-3xl mb-3">{v.i}</div><h3 className="text-base font-bold mb-2" style={{color:C.gold}}>{v.t}</h3><p className="text-[12px]" style={{color:C.textSec}}>{v.d}</p></div>
            ))}
          </div>
        </section>

        {/* 3. VIP CARD GRID */}
        <section className="pb-8"><VipCardGrid /></section>

        {/* 4. AVANTAGES */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-8">
          <h2 className="text-lg font-bold mb-4 text-center">Avantages par niveau</h2>
          <div className="overflow-x-auto rounded-2xl" style={{border:`1px solid ${C.border}`}}>
            <table className="w-full text-sm"><thead><tr style={{backgroundColor:C.card}}><th className="text-left p-3" style={{color:C.textSec}}>Avantage</th><th className="text-center p-3" style={{color:'#94A3B8'}}>Silver</th><th className="text-center p-3" style={{color:C.gold}}>Gold</th><th className="text-center p-3" style={{color:C.emerald}}>Elite</th></tr></thead><tbody>
              {[['Pronos/jour','10','20','30+'],['Sports','Football','6 sports','Tous'],['Value Bets','—','✓','Illimité'],['Stats Aviator','—','—','Illimité'],['Support','WhatsApp','Prioritaire','VIP direct']].map((r,i)=>(<tr key={i} style={{borderTop:`1px solid ${C.border}`}}><td className="p-3 font-medium" style={{color:C.text}}>{r[0]}</td><td className="text-center p-3" style={{color:C.textSec}}>{r[1]}</td><td className="text-center p-3" style={{color:C.textSec}}>{r[2]}</td><td className="text-center p-3" style={{color:C.textSec}}>{r[3]}</td></tr>))}
            </tbody></table>
          </div>
        </section>

        {/* 5. SPORTS */}
        <section className="pb-8"><VipSports /></section>

        {/* 6+7. NOMBRE + DURÉE */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-8 text-center"><p className="text-sm" style={{color:C.textSec}}>Entre <strong style={{color:C.text}}>2 et 5 pronostics</strong> premium/jour. Accès valable <strong style={{color:C.gold}}>30 jours</strong>, renouvelable.</p></section>

        {/* 8. HOWTO */}
        <section className="pb-8"><HowToGetVip /></section>

        {/* 9. PROMO VIP — Coupon du jour (team visible, reste flouté 12px, autonome) */}
        <section className="pb-8"><PromoVip /></section>

        {/* 10. AVIATOR */}
        <section className="pb-8"><AviatorVip /></section>

        {/* 11. HISTORIQUE */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-8 text-center"><a href="/resultats-verifies" className="inline-flex items-center gap-1 text-sm font-bold underline" style={{color:C.gold}}>Voir l'historique vérifié →</a></section>

        {/* 12. CONDITIONS */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-8">
          <div className="rounded-xl p-4 space-y-2" style={{backgroundColor:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.2)'}}>
            {['Aucun gain garanti. Risque de perte.','Aucun remboursement après activation.','18+ strictement.','Même modèle Poisson que gratuit.','BTTSPredict ne prend pas de paris.'].map((c,i)=>(<p key={i} className="text-[11px]" style={{color:C.textSec}}>• {c}</p>))}
          </div>
        </section>

        {/* 13. CODE PROMO + CTA */}
        <section id="verification" className="max-w-2xl mx-auto px-4 sm:px-6 pb-8">
          <h2 className="text-lg font-bold mb-4 text-center">Code promo + Vérification</h2>
          <div className="flex gap-2 mb-4">
            <button onClick={()=>setBookmaker('linebet')} className="flex-1 py-2 rounded-[10px] font-bold text-[12px]" style={{backgroundColor:bookmaker==='linebet'?C.gold:'transparent',color:bookmaker==='linebet'?C.bg:C.textSec,border:`1.5px solid ${bookmaker==='linebet'?C.gold:C.border}`}}>Linebet (VISION221)</button>
            <button onClick={()=>setBookmaker('888starz')} className="flex-1 py-2 rounded-[10px] font-bold text-[12px]" style={{backgroundColor:bookmaker==='888starz'?C.emerald:'transparent',color:bookmaker==='888starz'?C.bg:C.textSec,border:`1.5px solid ${bookmaker==='888starz'?C.emerald:C.border}`}}>888Starz (vision221)</button>
          </div>
          <div className="text-center mb-4">
            <button onClick={copyCode} className="inline-flex items-center gap-3 cursor-pointer bg-transparent border-0 p-0"><span className="text-3xl font-black tracking-[0.15em]" style={{color:bookmaker==='linebet'?C.gold:C.emerald,fontFamily:'var(--font-mono), monospace'}}>{code}</span></button>
          </div>
          <div className="space-y-2 mb-4">
            <a href={inscriptionLink} target="_blank" rel="noopener noreferrer nofollow sponsored" className="block w-full h-[48px] rounded-[10px] font-bold text-[13px] flex items-center justify-center" style={{backgroundColor:bookmaker==='linebet'?C.gold:C.emerald,color:C.bg}} data-cta="vip-linebet-inscription">S'inscrire →</a>
            <a href={apkLink} target="_blank" rel="noopener noreferrer nofollow sponsored" className="block w-full h-[48px] rounded-[10px] font-bold text-[13px] flex items-center justify-center" style={{backgroundColor:'transparent',color:C.text,border:`1.5px solid ${C.border}`}} data-cta="vip-linebet-apk">📥 Télécharger APK</a>
          </div>
          <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Salut BTTSPredict, code "+code+" dépôt 3000F. Débloquer VIP.")}`} target="_blank" rel="noopener noreferrer" className="block w-full h-[52px] rounded-[10px] font-bold text-[14px] flex items-center justify-center gap-2" style={{backgroundColor:C.whatsapp,color:C.bg}}>Vérifier via WhatsApp</a>
        </section>

        {/* 14. FAQ + JEU RESPONSABLE */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-10">
          <div className="rounded-xl p-4 text-center" style={{backgroundColor:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.2)'}}><p className="text-[11px]" style={{color:C.textSec}}>18+ · Risque de perte. Aucun gain garanti. Lien d'affiliation rémunéré. <a href="/jouer-responsable" className="underline" style={{color:C.gold}}>En savoir plus</a></p></div>
        </section>

        <ErrorBoundary><Footer /></ErrorBoundary>
      </main>
    </div>
  )
}
