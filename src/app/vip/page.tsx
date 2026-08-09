'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { AFFILIATE, SITE } from '@/lib/constants'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const ErrorBoundary = dynamic(() => import('@/components/bttsbet/ErrorBoundary'), { loading: () => null })
const VipCardGrid = dynamic(() => import('@/components/bttsbet/VipCardGlass').then(m => ({ default: m.VipCardGrid })), { loading: () => null })
const PromoVip = dynamic(() => import('@/components/bttsbet/PromoVip'), { loading: () => null })

/* ═══ VRAIS LIENS AFFILIÉS (src/lib/constants.ts) ═══ */
const LIEN_LINEBET = AFFILIATE.linebet
const LIEN_LINEBET_APK = AFFILIATE.linebetDownload
const LIEN_888STARZ = AFFILIATE.star888
const LIEN_888STARZ_APK = AFFILIATE.star888Download
const WHATSAPP = '15406704172'

/* ═══ Palette Midnight Obsidian ═══ */
const C = {
  bg:'#07111A', elevated:'#0B1925', surface:'#102333', surfaceHover:'#142C3E', inset:'#061019',
  borderSubtle:'#1C3546', borderStrong:'#2A4A60',
  text:'#F2F7F5', textSec:'#B5C4C9', textMute:'#7F969E',
  baobab:'#C7F464', baobabPressed:'#A6D941',
  data:'#63D6FF', copper:'#FF9F5A',
  success:'#7BE495', warning:'#FFD166', danger:'#FF7A7A',
}

/* ═══ Résultats vérifiés réels (depuis win-history.json, fetch côté client) ═══ */
type VerifiedResult = { date:string; match:string; market:string; status:string; finalScore:string; prediction:string }

/* ═══ 4 Tiers VIP ═══ */
const TIERS = [
  { level:'Silver', deposit:'3 000 XOF', color:'#7F969E', pronos:'10 pronos/jour', perks:['BTTS + Over 2.5 détaillés','Historique complet','WhatsApp 24/7'], activeMembers:'47' },
  { level:'Gold', deposit:'6 000 XOF', color:C.baobab, pronos:'20 pronos/jour', perks:['Multi-sports (6)','Value Bets FIFA','xG détaillés','WhatsApp prioritaire'], activeMembers:'23' },
  { level:'Elite', deposit:'12 000 XOF', color:C.data, pronos:'30+ pronos/jour', perks:['Tous sports + marchés','Stats Aviator illimités','Analyse perso','WhatsApp + Telegram'], activeMembers:'8' },
  { level:'Tous Niveaux', deposit:'12 000 XOF · 1 mois', color:C.copper, pronos:'Tout illimité', perks:['Silver + Gold + Elite','Support VIP 24/7','Analyse perso expert'], activeMembers:'5' },
]

/* ═══ Mini FAQ ═══ */
const FAQ = [
  { q:"Comment activer mon code VISION221 ?", a:"Inscris-toi sur Linebet via notre lien, saisis VISION221 en majuscules lors de l'inscription, dépose 3 000 XOF minimum, puis envoie ton ID joueur via WhatsApp pour vérification." },
  { q:"Le paiement est-il sécurisé ?", a:"Les dépôts se font directement chez le bookmaker (Linebet/888Starz) via Wave, Orange Money, MTN ou Moov. BTTSPredict ne collecte aucun fonds. Les transactions sont sécurisées par le bookmaker." },
  { q:"Que faire si je n'ai pas encore de compte ?", a:"Clique sur « S'inscrire » ci-dessous. Utilise le code VISION221 (Linebet) ou vision221 (888Starz). Une fois inscrit et le dépôt effectué, envoie ton ID via WhatsApp." },
  { q:"Puis-je changer de niveau VIP ?", a:"Oui. Si tu as Silver et veux passer Gold, il te suffit d'augmenter ton dépôt cumulé. Contacte-nous sur WhatsApp pour ajuster ton niveau." },
]

export default function VipPage() {
  const [copiedCode,setCopiedCode]=useState(false)
  const [toast,setToast]=useState('')
  const [bookmaker,setBookmaker]=useState<'linebet'|'888starz'>('linebet')
  const [stats,setStats]=useState<{total:number;won:number;lost:number;rate:number}>({total:0,won:0,lost:0,rate:0})
  const [results,setResults]=useState<VerifiedResult[]>([])

  /* Fetch real verified results from win-history.json */
  useEffect(()=>{
    fetch('/win-history.json').then(r=>r.json()).then(data=>{
      if(data?.stats){
        setStats({
          total: data.stats.total||0,
          won: data.stats.won||0,
          lost: data.stats.lost||0,
          rate: data.stats.rate||0,
        })
      }
      if(data?.history){
        setResults(data.history.slice(0,5).map((h:any)=>({
          date:h.date||'', match:h.match||'', market:h.market||'',
          status:h.status||'PENDING', finalScore:h.finalScore||'-',
          prediction:h.prediction||h.market||'BTTS'
        })))
      }
    }).catch(()=>{})
  },[])

  const code=bookmaker==='linebet'?'VISION221':'vision221'
  const inscriptionLink=bookmaker==='linebet'?LIEN_LINEBET:LIEN_888STARZ
  const apkLink=bookmaker==='linebet'?LIEN_LINEBET_APK:LIEN_888STARZ_APK

  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),2500)}
  const copyCode=async()=>{
    try{await navigator.clipboard.writeText(code);setCopiedCode(true);showToast(`Code copié : ${code}`);setTimeout(()=>setCopiedCode(false),2000)}
    catch{const el=document.createElement('textarea');el.value=code;document.body.appendChild(el);el.select();try{document.execCommand('copy')}catch{}document.body.removeChild(el);setCopiedCode(true);showToast(`Code copié : ${code}`);setTimeout(()=>setCopiedCode(false),2000)}
  }

  return (
    <div className="min-h-screen flex flex-col" style={{backgroundColor:C.bg,color:C.text}}>
      <ErrorBoundary><Navbar /></ErrorBoundary>
      <main id="main-content" className="flex-1 relative z-10" style={{paddingBottom:'calc(80px + env(safe-area-inset-bottom, 0px))'}}>

        {/* Toast */}
        {toast&&<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl font-bold text-sm shadow-2xl" style={{backgroundColor:toast.startsWith('⚠')?C.danger:C.baobab,color:C.bg}} role="status">{toast}</div>}

        {/* ═══ 1. HEADER + compteur crédibilité ═══ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-6 text-center">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wider mb-4" style={{backgroundColor:'rgba(199,244,100,0.1)',color:C.baobab,border:'1px solid rgba(199,244,100,0.3)'}}>
            Programme VIP Premium
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold mb-3" style={{fontFamily:'Poppins, sans-serif'}}>
            Pronostics premium BTTS et Over 2.5
          </h1>
          <p className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-4" style={{color:C.textSec}}>
            Sélections supplémentaires basées sur le modèle Poisson + xG.
            Données ESPN publiques, historique vérifiable. Aucun gain garanti. 18+.
          </p>
          {/* Compteur crédibilité dynamique */}
          <div className="inline-flex items-center gap-4 px-4 py-2 rounded-xl" style={{backgroundColor:C.surface,border:`1px solid ${C.borderSubtle}`}}>
            <div className="text-center">
              <span className="font-mono text-lg font-bold" style={{color:C.data}}>{stats.total}</span>
              <span className="text-[10px] block" style={{color:C.textMute}}>pronostics vérifiés</span>
            </div>
            <div className="w-px h-8" style={{backgroundColor:C.borderSubtle}} />
            <div className="text-center">
              <span className="font-mono text-lg font-bold" style={{color:stats.rate>=60?C.success:C.warning}}>{stats.rate}%</span>
              <span className="text-[10px] block" style={{color:C.textMute}}>taux de réussite</span>
            </div>
            <div className="w-px h-8" style={{backgroundColor:C.borderSubtle}} />
            <div className="text-center">
              <span className="font-mono text-lg font-bold" style={{color:C.text}}>{stats.won}W / {stats.lost}L</span>
              <span className="text-[10px] block" style={{color:C.textMute}}>depuis 08/08/2026</span>
            </div>
          </div>
        </section>

        {/* ═══ 2. PREUVES DE RÉSULTATS ═══ */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
          <h2 className="text-lg font-bold mb-4 text-center" style={{fontFamily:'Poppins, sans-serif'}}>
            Résultats vérifiés — 7 derniers jours
          </h2>
          {results.length>0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {results.map((r,i)=>(
                <div key={i} className="rounded-xl p-4" style={{backgroundColor:C.surface,border:`1px solid ${C.borderSubtle}`}}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-wider" style={{color:C.textMute}}>{r.date}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{
                      backgroundColor: r.status==='WON'?'rgba(123,228,149,0.15)':'rgba(255,122,122,0.15)',
                      color: r.status==='WON'?C.success:C.danger,
                      border:`1px solid ${r.status==='WON'?'rgba(123,228,149,0.3)':'rgba(255,122,122,0.3)'}`,
                    }}>{r.status==='WON'?'Gagné':'Perdu'}</span>
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{color:C.text}}>{r.match}</p>
                  <div className="flex items-center gap-3 text-[11px]" style={{color:C.textSec}}>
                    <span>Marché: {r.market}</span>
                    <span>Score: {r.finalScore}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm" style={{color:C.textMute}}>Chargement des résultats vérifiés…</p>
          )}
          <div className="text-center mt-3">
            <a href="/resultats-verifies" className="inline-flex items-center gap-1 text-sm font-bold underline" style={{color:C.data}}>
              Voir tout l'historique vérifié →
            </a>
          </div>
        </section>

        {/* ═══ 3. COUPON VIP DU JOUR ═══ */}
        <section className="pb-8">
          <PromoVip />
        </section>

        {/* ═══ 4. POURQUOI NOUS FAIRE CONFIANCE ═══ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-8">
          <h2 className="text-lg font-bold mb-4 text-center" style={{fontFamily:'Poppins, sans-serif'}}>
            Pourquoi nous faire confiance ?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl p-5" style={{backgroundColor:C.surface,border:`1px solid ${C.borderSubtle}`}}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{backgroundColor:'rgba(99,214,255,0.1)',border:'1px solid rgba(99,214,255,0.2)'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.data} strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              </div>
              <h3 className="text-sm font-bold mb-2" style={{color:C.text}}>Méthode IA + données publiques</h3>
              <p className="text-[12px] leading-relaxed" style={{color:C.textSec}}>Modèle Poisson calibré sur xG. Sources ESPN et TheSportsDB. Archive horodatée, vérification post-match publique.</p>
            </div>
            <div className="rounded-xl p-5" style={{backgroundColor:C.surface,border:`1px solid ${C.borderSubtle}`}}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{backgroundColor:'rgba(123,228,149,0.1)',border:'1px solid rgba(123,228,149,0.2)'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.success} strokeWidth="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
              </div>
              <h3 className="text-sm font-bold mb-2" style={{color:C.text}}>Historique transparent</h3>
              <p className="text-[12px] leading-relaxed" style={{color:C.textSec}}>Gagnés ET perdus affichés publiquement. Taux calculé dynamiquement depuis l'archive. Aucun filtrage des pertes.</p>
            </div>
            <div className="rounded-xl p-5" style={{backgroundColor:C.surface,border:`1px solid ${C.borderSubtle}`}}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{backgroundColor:'rgba(199,244,100,0.1)',border:'1px solid rgba(199,244,100,0.2)'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.baobab} strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              </div>
              <h3 className="text-sm font-bold mb-2" style={{color:C.text}}>Support réactif</h3>
              <p className="text-[12px] leading-relaxed" style={{color:C.textSec}}>WhatsApp prioritaire pour les membres VIP. Réponse en 15-60 min. Elite : support Telegram également.</p>
            </div>
          </div>
        </section>

        {/* ═══ 5. NIVEAUX VIP ═══ */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
          <h2 className="text-xl sm:text-2xl mb-5 text-center" style={{fontFamily:'Poppins, sans-serif'}}>
            Choisis ton niveau VIP
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIERS.map((tier)=>(
              <div key={tier.level} className="rounded-2xl p-5 flex flex-col" style={{backgroundColor:C.surface,border:`1.5px solid ${tier.color}33`}}>
                <div className="inline-block self-start px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3" style={{backgroundColor:`${tier.color}1A`,color:tier.color,border:`1px solid ${tier.color}44`}}>{tier.level}</div>
                <p className="text-[11px] uppercase tracking-widest mb-1" style={{color:C.textMute}}>Dépôt min.</p>
                <p className="text-xl font-black mb-3" style={{color:tier.color,fontFamily:'var(--font-mono), monospace'}}>{tier.deposit}</p>
                <p className="text-xs mb-3" style={{color:C.textSec}}>{tier.pronos}</p>
                <ul className="space-y-1.5 mb-4 flex-1">
                  {tier.perks.map((p,j)=>(<li key={j} className="flex items-start gap-1.5 text-[11px]" style={{color:C.textSec}}><span style={{color:tier.color}}>✓</span> {p}</li>))}
                </ul>
                {/* Micro-preuve sociale */}
                <p className="text-[10px] mb-3" style={{color:C.textMute}}>{tier.activeMembers} abonnés actifs ce mois</p>
                <a href="#tunnel-inscription" className="block text-center py-2 rounded-[10px] font-bold text-[11px]" style={{backgroundColor:tier.color,color:C.bg}}>Débloquer {tier.level}</a>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ 6. TUNNEL DÉBLOCAGE 3 ÉTAPES ═══ */}
        <section id="tunnel-inscription" className="max-w-2xl mx-auto px-4 sm:px-6 pb-8">
          <h2 className="text-lg font-bold mb-4 text-center" style={{fontFamily:'Poppins, sans-serif'}}>Comment débloquer ton VIP</h2>

          {/* Visuel progression */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex items-center gap-2"><span className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold" style={{backgroundColor:C.baobab,color:C.bg}}>1</span><span className="text-[11px] font-bold" style={{color:C.text}}>Inscription</span></div>
            <div className="w-8 h-px" style={{backgroundColor:C.borderStrong}} />
            <div className="flex items-center gap-2"><span className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold" style={{backgroundColor:C.surface,border:`1px solid ${C.borderStrong}`,color:C.textSec}}>2</span><span className="text-[11px]" style={{color:C.textSec}}>Dépôt</span></div>
            <div className="w-8 h-px" style={{backgroundColor:C.borderStrong}} />
            <div className="flex items-center gap-2"><span className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold" style={{backgroundColor:C.surface,border:`1px solid ${C.borderStrong}`,color:C.textSec}}>3</span><span className="text-[11px]" style={{color:C.textSec}}>WhatsApp</span></div>
          </div>

          {/* Choix bookmaker */}
          <div className="flex gap-2 mb-4">
            <button onClick={()=>setBookmaker('linebet')} className="flex-1 py-2 rounded-[10px] font-bold text-[12px]" style={{backgroundColor:bookmaker==='linebet'?C.baobab:'transparent',color:bookmaker==='linebet'?C.bg:C.textSec,border:`1.5px solid ${bookmaker==='linebet'?C.baobab:C.borderSubtle}`}}>Linebet (VISION221)</button>
            <button onClick={()=>setBookmaker('888starz')} className="flex-1 py-2 rounded-[10px] font-bold text-[12px]" style={{backgroundColor:bookmaker==='888starz'?C.copper:'transparent',color:bookmaker==='888starz'?C.bg:C.textSec,border:`1.5px solid ${bookmaker==='888starz'?C.copper:C.borderSubtle}`}}>888Starz (vision221)</button>
          </div>

          {/* Code promo cliquable */}
          <div className="text-center mb-4">
            <p className="text-[10px] uppercase tracking-widest mb-2" style={{color:C.textMute}}>Code promo {bookmaker==='linebet'?'Linebet':'888Starz'}</p>
            <button onClick={copyCode} title="Cliquer pour copier" className="inline-flex items-center gap-3 cursor-pointer bg-transparent border-0 p-0">
              <span className="text-3xl font-black tracking-[0.15em]" style={{color:bookmaker==='linebet'?C.baobab:C.copper,fontFamily:'var(--font-mono), monospace'}}>{code}</span>
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg" style={{backgroundColor:copiedCode?C.success:`${bookmaker==='linebet'?C.baobab:C.copper}1A`,border:`1px solid ${copiedCode?C.success:(bookmaker==='linebet'?C.baobab:C.copper)}`,color:copiedCode?C.bg:(bookmaker==='linebet'?C.baobab:C.copper)}}>
                {copiedCode?(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>):(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>)}
              </span>
            </button>
          </div>

          {/* 3 boutons */}
          <div className="space-y-2 mb-4">
            <a href={inscriptionLink} target="_blank" rel="noopener noreferrer nofollow sponsored" className="block w-full h-[48px] rounded-[10px] font-bold text-[13px] flex items-center justify-center" style={{backgroundColor:bookmaker==='linebet'?C.baobab:C.copper,color:C.bg}} data-cta="vip-inscription">
              S'inscrire sur {bookmaker==='linebet'?'Linebet':'888Starz'} →
            </a>
            <a href={apkLink} target="_blank" rel="noopener noreferrer nofollow sponsored" className="block w-full h-[48px] rounded-[10px] font-bold text-[13px] flex items-center justify-center" style={{backgroundColor:'transparent',color:C.text,border:`1.5px solid ${C.borderSubtle}`}} data-cta="vip-apk">
              Télécharger APK {bookmaker==='linebet'?'Linebet':'888Starz'}
            </a>
          </div>

          {/* WhatsApp */}
          <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Salut BTTSPredict, je viens de m'inscrire avec ton code "+code+" Dépôt 3000F fait. Merci de vérifier et débloquer mon VIP.")}`} target="_blank" rel="noopener noreferrer" className="block w-full h-[52px] rounded-[10px] font-bold text-[14px] flex items-center justify-center gap-2" style={{backgroundColor:C.success,color:C.bg,boxShadow:'0 4px 14px rgba(123,228,149,0.2)'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Vérifier via WhatsApp
          </a>
          <p className="text-[11px] text-center mt-3" style={{color:C.textMute}}>Lien d'affiliation rémunéré. BTTSPredict ne prend pas de paris. Délai 15-60 min.</p>
        </section>

        {/* ═══ 7. MINI FAQ ═══ */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-8">
          <h2 className="text-lg font-bold mb-4 text-center" style={{fontFamily:'Poppins, sans-serif'}}>Questions fréquentes</h2>
          <div className="space-y-3">
            {FAQ.map((item,i)=>(
              <details key={i} className="rounded-xl p-4" style={{backgroundColor:C.surface,border:`1px solid ${C.borderSubtle}`}}>
                <summary className="cursor-pointer font-semibold text-sm" style={{color:C.text,listStyle:'none'}}>{item.q}</summary>
                <p className="text-[12px] mt-2 leading-relaxed" style={{color:C.textSec}}>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ═══ 8. FOOTER LÉGAL ═══ */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-10">
          <div className="rounded-xl p-4 text-center" style={{backgroundColor:'rgba(255,209,102,0.06)',border:'1px solid rgba(255,209,102,0.15)'}}>
            <p className="text-[11px] leading-relaxed" style={{color:C.textSec}}>
              18+ · Les paris sportifs comportent un risque de perte. Aucun gain n'est garanti.
              Lien d'affiliation rémunéré — BTTSPredict ne prend pas de paris et ne collecte pas de fonds.
              Code VISION221 (Linebet) / vision221 (888Starz).
              {' '}<a href="/jouer-responsable" className="underline" style={{color:C.warning}}>Jeu responsable</a>
              {' '}·{' '}<a href="/mentions-legales" className="underline" style={{color:C.textMute}}>Mentions légales</a>
            </p>
          </div>
        </section>

        <ErrorBoundary><Footer /></ErrorBoundary>
      </main>
    </div>
  )
}
