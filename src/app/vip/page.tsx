'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { AFFILIATE, SITE } from '@/lib/constants'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const ErrorBoundary = dynamic(() => import('@/components/bttsbet/ErrorBoundary'), { loading: () => null })
const PromoVip = dynamic(() => import('@/components/bttsbet/PromoVip'), { loading: () => null })

/* VRAIS LIENS AFFILIÉS (src/lib/constants.ts) */
const LIEN_LINEBET = AFFILIATE.linebet
const LIEN_LINEBET_APK = AFFILIATE.linebetDownload
const LIEN_888STARZ = AFFILIATE.star888
const LIEN_888STARZ_APK = AFFILIATE.star888Download
const WHATSAPP = '15406704172'

/* Palette OR & ÉMERAUDE */
const C = {
  bg:'#070A14', card:'#111827', border:'#1F2937',
  gold:'#D4AF37', goldDark:'#B7952E', emerald:'#10B981', emeraldDark:'#059669',
  whatsapp:'#25D366', text:'#F1F5F9', textSec:'#94A3B8', textMute:'#64748B', error:'#EF4444',
}

const TIERS = [
  {level:'Silver',deposit:'3 000 XOF',color:'#94A3B8',pronos:'10 pronos/jour',perks:['BTTS + Over 2.5','Historique complet','WhatsApp 24/7']},
  {level:'Gold',deposit:'6 000 XOF',color:C.gold,pronos:'20 pronos/jour',perks:['Multi-sports (6)','Value Bets FIFA','xG détaillés','WhatsApp prioritaire']},
  {level:'Elite',deposit:'12 000 XOF',color:C.emerald,pronos:'30+ pronos/jour',perks:['Tous sports + marchés','Stats Aviator illimités','Analyse perso','WhatsApp + Telegram']},
  {level:'Tous Niveaux',deposit:'12 000 XOF · 1 mois',color:C.gold,pronos:'Tout illimité',perks:['Silver + Gold + Elite','Support VIP 24/7','Analyse perso expert']},
]

const SPORTS = ['Football','Tennis','NBA','NFL','UFC','Handball']

const FAQ = [
  {q:'Le VIP garantit-il des gains ?',a:'Non. Aucun gain n\'est garanti. Les paris sportifs comportent un risque de perte.'},
  {q:'Quel bookmaker ?',a:'Linebet (VISION221) ou 888Starz (vision221). Wave, Orange Money, MTN, Moov acceptés.'},
  {q:'Combien de pronostics/jour ?',a:'Entre 2 et 5 pronostics premium par jour selon le calendrier sportif.'},
  {q:'Remboursement possible ?',a:'Non. Aucun remboursement après activation du VIP.'},
  {q:'Support VIP ?',a:'WhatsApp prioritaire +1 540 670 4172. Elite: aussi Telegram.'},
  {q:'Âge minimum ?',a:'18+ strictement. Vérification à l\'inscription chez le bookmaker.'},
]

export default function VipPage() {
  const [copiedCode,setCopiedCode]=useState(false)
  const [toast,setToast]=useState('')
  const [bookmaker,setBookmaker]=useState<'linebet'|'888starz'>('linebet')

  const code = bookmaker==='linebet' ? 'VISION221' : 'vision221'
  const inscriptionLink = bookmaker==='linebet' ? LIEN_LINEBET : LIEN_888STARZ
  const apkLink = bookmaker==='linebet' ? LIEN_LINEBET_APK : LIEN_888STARZ_APK

  const showToast=(msg:string)=>{setToast(msg);setTimeout(()=>setToast(''),2500)}
  const copyCode=async()=>{
    try{await navigator.clipboard.writeText(code);setCopiedCode(true);showToast(`Code copié ${code}`);setTimeout(()=>setCopiedCode(false),2000)}
    catch{const el=document.createElement('textarea');el.value=code;document.body.appendChild(el);el.select();try{document.execCommand('copy')}catch{}document.body.removeChild(el);setCopiedCode(true);showToast(`Code copié ${code}`);setTimeout(()=>setCopiedCode(false),2000)}
  }

  return (
    <div className="min-h-screen flex flex-col" style={{backgroundColor:C.bg,color:C.text}}>
      <ErrorBoundary><Navbar /></ErrorBoundary>
      <main id="main-content" className="flex-1 relative z-10" style={{paddingBottom:'calc(80px + env(safe-area-inset-bottom, 0px))'}}>

        {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl font-bold text-sm shadow-2xl" style={{backgroundColor:toast.startsWith('⚠')?C.error:C.emerald,color:C.bg}} role="status">{toast}</div>}

        {/* 1. INTRODUCTION */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-6 text-center">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4" style={{backgroundColor:`${C.gold}1A`,color:C.gold,border:`1px solid ${C.gold}55`}}>★ Programme VIP Premium</span>
          <h1 className="text-3xl sm:text-5xl font-bold mb-3" style={{fontFamily:'Poppins, sans-serif'}}>Pronostics premium BTTS et Over 2.5</h1>
          <p className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed" style={{color:C.textSec}}>Sélections supplémentaires + analyses détaillées + même modèle Poisson. Accès après activation chez le bookmaker partenaire. Aucun gain garanti. 18+.</p>
        </section>

        {/* 2. VALEUR (3 cartes) */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[{t:'Sélections supplémentaires',d:'2 à 5 pronos premium/jour en plus des 6 gratuits',i:'📊'},{t:'Analyses détaillées',d:'xG par équipe, probabilités Poisson, indices de confiance',i:'🔍'},{t:'Même modèle Poisson',d:'Aucun modèle différent du gratuit. Le VIP donne accès à plus de matchs.',i:'⚙️'}].map((v,i)=>(
              <div key={i} className="rounded-2xl p-5" style={{backgroundColor:C.card,border:`1px solid ${C.border}`}}>
                <div className="text-3xl mb-3">{v.i}</div>
                <h3 className="text-base font-bold mb-2" style={{color:C.gold}}>{v.t}</h3>
                <p className="text-[12px] leading-relaxed" style={{color:C.textSec}}>{v.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. VIP TIERS (4 cartes) */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
          <h2 className="text-xl sm:text-2xl mb-5 text-center" style={{fontFamily:'Poppins, sans-serif'}}>💎 Choisis ton <span style={{color:C.gold}}>niveau VIP</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIERS.map((tier)=>(
              <div key={tier.level} className="rounded-2xl p-5 flex flex-col" style={{backgroundColor:C.card,border:`1.5px solid ${tier.color}33`}}>
                <div className="inline-block self-start px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3" style={{backgroundColor:`${tier.color}1A`,color:tier.color,border:`1px solid ${tier.color}44`}}>{tier.level}</div>
                <p className="text-[11px] uppercase tracking-widest mb-1" style={{color:C.textMute}}>Dépôt min.</p>
                <p className="text-xl font-black mb-3" style={{color:tier.color,fontFamily:'var(--font-mono), monospace'}}>{tier.deposit}</p>
                <p className="text-xs mb-3" style={{color:C.textSec}}>{tier.pronos}</p>
                <ul className="space-y-1.5 mb-4 flex-1">{tier.perks.map((p,j)=>(<li key={j} className="flex items-start gap-1.5 text-[11px]" style={{color:C.textSec}}><span style={{color:tier.color}}>✓</span> {p}</li>))}</ul>
                <a href="#verification" className="block text-center py-2 rounded-[10px] font-bold text-[11px]" style={{backgroundColor:tier.color,color:C.bg}}>Débloquer {tier.level}</a>
              </div>
            ))}
          </div>
        </section>

        {/* 4. AVANTAGES tableau */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-8">
          <h2 className="text-lg font-bold mb-4 text-center">Avantages par niveau</h2>
          <div className="overflow-x-auto rounded-2xl" style={{border:`1px solid ${C.border}`}}>
            <table className="w-full text-sm"><thead><tr style={{backgroundColor:C.card}}>
              <th className="text-left p-3" style={{color:C.textSec}}>Avantage</th><th className="text-center p-3" style={{color:'#94A3B8'}}>Silver</th><th className="text-center p-3" style={{color:C.gold}}>Gold</th><th className="text-center p-3" style={{color:C.emerald}}>Elite</th>
            </tr></thead><tbody>
              {[['Pronos/jour','10','20','30+'],['Sports','Football','6 sports','Tous'],['Value Bets FIFA','—','✓','Illimité'],['Stats Aviator','—','—','Illimité'],['Support','WhatsApp','Prioritaire','VIP direct']].map((row,i)=>(
                <tr key={i} style={{borderTop:`1px solid ${C.border}`}}><td className="p-3 font-medium" style={{color:C.text}}>{row[0]}</td><td className="text-center p-3" style={{color:C.textSec}}>{row[1]}</td><td className="text-center p-3" style={{color:C.textSec}}>{row[2]}</td><td className="text-center p-3" style={{color:C.textSec}}>{row[3]}</td></tr>
              ))}
            </tbody></table>
          </div>
        </section>

        {/* 5. SPORTS */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-8">
          <h2 className="text-lg font-bold mb-3 text-center">Sports couverts</h2>
          <div className="flex flex-wrap justify-center gap-2">{SPORTS.map(s=>(<span key={s} className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{backgroundColor:`${C.emerald}1A`,color:C.emerald,border:`1px solid ${C.emerald}33`}}>{s}</span>))}</div>
          <p className="text-[11px] text-center mt-3" style={{color:C.textMute}}>Volume insuffisant pour afficher un taux par sport. Football = sport principal.</p>
        </section>

        {/* 6+7. NOMBRE + DURÉE */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-8 text-center">
          <p className="text-sm" style={{color:C.textSec}}>Entre <strong style={{color:C.text}}>2 et 5 pronostics</strong> premium/jour. Accès valable <strong style={{color:C.gold}}>30 jours</strong>, renouvelable.</p>
        </section>

        {/* 8. HOWTO */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-8">
          <h2 className="text-lg font-bold mb-4 text-center">Comment activer le VIP</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[{n:'01',t:"S'inscrire",d:'Code VISION221 (Linebet) ou vision221 (888Starz)'},{n:'02',t:'Déposer',d:'3 000 XOF min via Wave, OM, MTN, Moov'},{n:'03',t:'Envoyer preuve',d:'WhatsApp +1 540 670 4172. Vérif 15-60 min.'}].map((s,i)=>(
              <div key={i} className="rounded-xl p-4 text-center" style={{backgroundColor:C.card,border:`1px solid ${C.border}`}}>
                <p className="text-[10px] font-mono mb-2" style={{color:C.gold}}>{s.n}</p><h3 className="text-sm font-bold mb-1">{s.t}</h3><p className="text-[11px]" style={{color:C.textSec}}>{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 9. PROMO VIP — composant autonome 6 cartes team visible flouté */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
          <PromoVip />
        </section>

        {/* 10. AVIATOR */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-8">
          <div className="rounded-xl p-4" style={{backgroundColor:C.card,border:`1px solid ${C.border}`}}>
            <p className="text-xs" style={{color:C.textSec}}>🎮 <strong style={{color:C.emerald}}>Stats Aviator premium</strong> en VIP Gold+. Provably Fair (SHA-256), informatif non prédictif.</p>
          </div>
        </section>

        {/* 11. HISTORIQUE */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-8 text-center">
          <a href="/resultats-verifies" className="inline-flex items-center gap-1 text-sm font-bold underline" style={{color:C.gold}}>Voir l'historique vérifié →</a>
        </section>

        {/* 12. CONDITIONS */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-8">
          <h2 className="text-lg font-bold mb-4 text-center">Conditions et limites</h2>
          <div className="rounded-xl p-4 space-y-2" style={{backgroundColor:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.2)'}}>
            {['Aucun gain garanti. Risque de perte.','Aucun remboursement après activation.','18+ strictement.','Le VIP donne accès à plus de pronos, pas à une méthode différente.','Le modèle Poisson est le même pour gratuit et VIP.','BTTSPredict ne prend pas de paris, ne collecte pas de fonds.'].map((c,i)=>(<p key={i} className="text-[11px] leading-relaxed" style={{color:C.textSec}}>• {c}</p>))}
          </div>
        </section>

        {/* 13. CODE PROMO + CTA */}
        <section id="verification" className="max-w-2xl mx-auto px-4 sm:px-6 pb-8">
          <h2 className="text-lg font-bold mb-4 text-center">Code promo + Vérification WhatsApp</h2>
          <div className="flex gap-2 mb-4">
            <button onClick={()=>setBookmaker('linebet')} className="flex-1 py-2 rounded-[10px] font-bold text-[12px] transition-all" style={{backgroundColor:bookmaker==='linebet'?C.gold:'transparent',color:bookmaker==='linebet'?C.bg:C.textSec,border:`1.5px solid ${bookmaker==='linebet'?C.gold:C.border}`}}>Linebet (VISION221)</button>
            <button onClick={()=>setBookmaker('888starz')} className="flex-1 py-2 rounded-[10px] font-bold text-[12px] transition-all" style={{backgroundColor:bookmaker==='888starz'?C.emerald:'transparent',color:bookmaker==='888starz'?C.bg:C.textSec,border:`1.5px solid ${bookmaker==='888starz'?C.emerald:C.border}`}}>888Starz (vision221)</button>
          </div>
          <div className="text-center mb-4">
            <button onClick={copyCode} title="Cliquer pour copier" className="inline-flex items-center gap-3 cursor-pointer transition-transform hover:scale-[1.02] bg-transparent border-0 p-0">
              <span className="text-3xl sm:text-4xl font-black tracking-[0.15em]" style={{color:bookmaker==='linebet'?C.gold:C.emerald,fontFamily:'var(--font-mono), monospace',textShadow:`0 0 20px ${bookmaker==='linebet'?C.gold:C.emerald}55`}}>{code}</span>
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg" style={{backgroundColor:copiedCode?C.emerald:`${bookmaker==='linebet'?C.gold:C.emerald}1A`,border:`1px solid ${copiedCode?C.emerald:(bookmaker==='linebet'?C.gold:C.emerald)}`,color:copiedCode?C.bg:(bookmaker==='linebet'?C.gold:C.emerald)}}>
                {copiedCode?(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>):(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>)}
              </span>
            </button>
          </div>
          <div className="space-y-2 mb-4">
            <a href={inscriptionLink} target="_blank" rel="noopener noreferrer nofollow sponsored" className="block w-full h-[48px] rounded-[10px] font-bold text-[13px] flex items-center justify-center transition-all" style={{backgroundColor:bookmaker==='linebet'?C.gold:C.emerald,color:C.bg}} data-cta="vip-linebet-inscription">S'inscrire sur {bookmaker==='linebet'?'Linebet':'888Starz'} →</a>
            <a href={apkLink} target="_blank" rel="noopener noreferrer nofollow sponsored" className="block w-full h-[48px] rounded-[10px] font-bold text-[13px] flex items-center justify-center transition-all" style={{backgroundColor:'transparent',color:C.text,border:`1.5px solid ${C.border}`}} data-cta="vip-linebet-apk">📥 Télécharger APK {bookmaker==='linebet'?'Linebet':'888Starz'}</a>
          </div>
          <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Salut BTTSPredict, je viens de m'inscrire avec ton code "+code+" Dépôt 3000F fait. Merci de vérifier et débloquer mon VIP.")}`} target="_blank" rel="noopener noreferrer" className="block w-full h-[52px] rounded-[10px] font-bold text-[14px] flex items-center justify-center gap-2 transition-all" style={{backgroundColor:C.whatsapp,color:C.bg,boxShadow:`0 6px 20px ${C.whatsapp}33`}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Vérifier via WhatsApp
          </a>
          <p className="text-[11px] text-center mt-3" style={{color:C.textMute}}>Lien d'affiliation rémunéré. BTTSPredict ne prend pas de paris. Délai 15-60 min.</p>
        </section>

        {/* 14. FAQ + JEU RESPONSABLE */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-10">
          <h2 className="text-lg font-bold mb-4 text-center">Questions fréquentes</h2>
          <div className="space-y-3 mb-6">
            {FAQ.map((item,i)=>(
              <details key={i} className="rounded-xl p-4" style={{backgroundColor:C.card,border:`1px solid ${C.border}`}}>
                <summary className="cursor-pointer font-semibold text-sm" style={{color:C.text,listStyle:'none'}}>{item.q}</summary>
                <p className="text-[12px] mt-2 leading-relaxed" style={{color:C.textSec}}>{item.a}</p>
              </details>
            ))}
          </div>
          <div className="rounded-xl p-4 text-center" style={{backgroundColor:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.2)'}}>
            <p className="text-[11px]" style={{color:C.textSec}}>18+ · Paris sportifs = risque de perte. Aucun gain garanti. Lien d'affiliation rémunéré. <a href="/jouer-responsable" className="underline" style={{color:C.gold}}>En savoir plus</a></p>
          </div>
        </section>

        <ErrorBoundary><Footer /></ErrorBoundary>
      </main>
    </div>
  )
}
