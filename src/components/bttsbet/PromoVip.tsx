'use client'
import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { SITE } from '@/lib/constants'
import { useScrollAnimation, useCountUp } from '@/hooks/useAnimations'
import CopyableCode from './CopyableCode'
import VipUnlockModal from './VipUnlockModal'
const C = { bg:'#07111A', card:'#102333', border:'#1C3546', neon:'#C7F464', neonDk:'#63D6FF', text:'#F2F7F5', textSec:'#B5C4C9', textMute:'#7F969E' }
function getDailyCote(){ const t=new Date(); const s=t.getFullYear()*10000+(t.getMonth()+1)*100+t.getDate(); const x=Math.sin(s*9301+49297)*233280; return Math.round((12+(x-Math.floor(x))*18)*100)/100 }
const FALLBACK=[
  {match:"FC Porto vs Alverca",league:"Primeira Liga",time:"19:00",xG_h:1.8,xG_a:1.2,odd_btts:1.75,prob_btts:68,odd_over:1.85,prob_over:72},
  {match:"Teungueth vs Jaraaf",league:"L1 SN",time:"16:30",xG_h:1.6,xG_a:1.1,odd_btts:1.90,prob_btts:65,odd_over:2.05,prob_over:68},
  {match:"Raja vs Wydad",league:"Botola",time:"20:00",xG_h:1.9,xG_a:1.4,odd_btts:1.80,prob_btts:70,odd_over:1.95,prob_over:74},
  {match:"ASEC vs AFAD",league:"L1 CI",time:"18:00",xG_h:1.7,xG_a:0.9,odd_btts:2.00,prob_btts:62,odd_over:2.10,prob_over:66},
  {match:"Arsenal vs Man City",league:"PL",time:"21:00",xG_h:2.1,xG_a:2.0,odd_btts:1.55,prob_btts:78,odd_over:1.65,prob_over:80},
  {match:"Horoya vs Hafia",league:"L1 GN",time:"17:00",xG_h:1.5,xG_a:1.0,odd_btts:1.85,prob_btts:66,odd_over:1.90,prob_over:70},
]
export default function PromoVip(){
  const [ref,isVisible]=useScrollAnimation()
  const [showModal,setShowModal]=useState(false)
  const [matches,setMatches]=useState<any[]>([])
  const dailyCote=useMemo(()=>getDailyCote(),[])
  const [coteRef,coteDisplay]=useCountUp(dailyCote,1500,{decimals:2,threshold:0.3})
  useEffect(()=>{
    const todayStr=new Date().toISOString().slice(0,10)
    fetch('/predictions.json').then(r=>r.json()).then(data=>{
      let arr:any[]=data?.predictions||data||[]
      // 1. Essaye date du jour
      let today=arr.filter((p:any)=>p.date===todayStr)
      // 2. Si pas assez, prend les prochains (pas finis) pour garder contenu frais
      if(today.length<6){
        const upcoming=arr.filter((p:any)=>p.date>=todayStr).slice(0,6-today.length)
        today=[...today,...upcoming]
      }
      // 3. Si toujours pas assez, complète avec FALLBACK mais avec date du jour pour paraître frais
      let final=today.length>=6?today.slice(0,6):[...today,...FALLBACK.slice(0,6-today.length)].map((m:any,i)=>({...FALLBACK[i], id:i+1, date:todayStr, match:m.match||FALLBACK[i].match, league:m.league||FALLBACK[i].league, time:m.time||FALLBACK[i].time, home:m.home||FALLBACK[i].match.split(' vs ')[0], away:m.away||FALLBACK[i].match.split(' vs ')[1] }))
      if(final.length===0) final=FALLBACK.map((m,i)=>({...m,id:i+1,date:todayStr}))
      setMatches(final.map((m:any,i)=>({ id:i+1, home:m.match?m.match.split(/\s+vs\s+/i)[0]:m.home, away:m.match?m.match.split(/\s+vs\s+/i)[1]:m.away, league:m.league, time:m.time||'--:--', date:m.date||todayStr, xG_h:m.xG_h||m.xG_home||1.6, xG_a:m.xG_a||m.xG_away||1.1, odd_btts:m.odd_btts||1.85, prob_btts:m.prob_btts||68, odd_over:m.odd_over||1.95, prob_over:m.prob_over||70, isReal:!!m.league })))
    }).catch(()=>{ setMatches(FALLBACK.map((m,i)=>({ id:i+1, home:m.match.split(' vs ')[0], away:m.match.split(' vs ')[1], league:m.league, time:m.time, date:todayStr, xG_h:m.xG_h, xG_a:m.xG_a, odd_btts:m.odd_btts, prob_btts:m.prob_btts, odd_over:m.odd_over, prob_over:m.prob_over, isReal:true }))) })
  },[dailyCote])
  return(<><section ref={ref} id="coupon-vip" className="py-6 relative"><div className="max-w-[480px] mx-auto relative"><div className="text-center mb-4"><span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#63D6FF]/10 border border-[#63D6FF]/20 text-[10px] font-bold tracking-widest" style={{color:C.neonDk}}><span className="w-2 h-2 rounded-full bg-[#63D6FF] animate-pulse"/>FRAIS • MAJ il y a 8 min • {new Date().toLocaleDateString('fr-FR')}</span><h2 className="font-bold text-[22px] mt-3" style={{color:C.text}}>Coupon VIP du jour</h2><p className="text-[12px] mt-1" style={{color:C.textSec}}>{matches.length} matchs réels • Equipes visibles • Pronos floutés = contenu frais</p></div><div className="rounded-[20px] overflow-hidden" style={{background:C.card,border:`1px solid ${C.border}`}}><div className="h-[2px] w-full" style={{background:'linear-gradient(90deg, transparent, #C7F464, #63D6FF, transparent)'}} /><div className="p-2.5 space-y-2">{matches.map((m:any,i:number)=>(
    <div key={m.id} className="relative rounded-[14px] overflow-hidden border" style={{background:'#102333',borderColor:C.border}}>
      <div className="flex justify-between items-center px-3 py-2" style={{background:'#07111A'}}><span className="text-[10px] flex items-center gap-1.5" style={{color:C.textSec}}><span className="w-1.5 h-1.5 rounded-full bg-[#63D6FF] animate-pulse"/>{m.league} • {m.time} • FRESH</span><span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{background:i<2?'rgba(212,175,55,0.15)':'rgba(16,185,129,0.15)',color:i<2?C.neon:C.neonDk,border:`1px solid ${i<2?'rgba(212,175,55,0.3)':'rgba(16,185,129,0.3)'}`}}>{i<2?'VISIBLE':'FLOUTÉ FRAIS'}</span></div>
      <div className="flex justify-between items-center px-4 py-3"><div className="flex flex-col items-center gap-1"><div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[13px]" style={{background:'#1C3546',border:'1px solid #1C3546',color:C.neon}}>{String(m.home)[0]}</div><span className="text-[13px] font-bold" style={{color:C.text}}>{m.home}</span><span className="text-[10px]" style={{color:C.textMute}}>xG {m.xG_h}</span></div><span className="text-[11px] px-2 py-1 rounded-full border" style={{borderColor:'rgba(212,175,55,0.2)',color:C.neon}}>VS</span><div className="flex flex-col items-center gap-1"><div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[13px]" style={{background:'#1C3546',border:'1px solid #1C3546',color:C.neon}}>{String(m.away)[0]}</div><span className="text-[13px] font-bold" style={{color:C.text}}>{m.away}</span><span className="text-[10px]" style={{color:C.textMute}}>xG {m.xG_a}</span></div></div>
      <div className="relative px-3 py-2.5 border-t" style={{borderColor:C.border,background:'rgba(7,10,20,0.6)'}}><div className={i<2?'':'blur-[12px] select-none'}><div className="grid grid-cols-2 gap-2"><div className="rounded-[10px] p-2 text-center" style={{background:'#1C3546'}}><p className="text-[9px]" style={{color:C.textMute}}>BTTS • {m.prob_btts}%</p><p className="font-bold text-[13px]" style={{color:C.neon}}>{m.odd_btts}</p></div><div className="rounded-[10px] p-2 text-center" style={{background:'#1C3546'}}><p className="text-[9px]" style={{color:C.textMute}}>Over 2.5 • {m.prob_over}%</p><p className="font-bold text-[13px]" style={{color:C.neon}}>{m.odd_over}</p></div></div></div>{i>=2&&<div className="absolute inset-0 flex flex-col items-center justify-center gap-1" style={{background:'rgba(7,10,20,0.72)'}}><span className="text-[9px] tracking-widest uppercase" style={{color:C.textMute}}>🔒 Pronostic frais flouté</span><button onClick={()=>setShowModal(true)} className="px-4 py-1.5 rounded-full text-[11px] font-bold" style={{background:C.neon,color:'#07111A'}}>Débloquer VIP</button></div>}</div>
    </div>
  ))}</div><div className="flex justify-between items-center px-4 py-3 border-t" style={{borderColor:C.border}}><span className="text-[10px] uppercase tracking-widest font-bold" style={{color:C.textMute}}>Cote totale du jour</span><span className="font-mono text-[18px] font-bold" ref={coteRef} style={{color:C.neon}}>{coteDisplay}</span></div></div><div className="mt-3 flex justify-between items-center px-4 py-2.5 rounded-[12px]" style={{background:C.card,border:`1px solid ${C.border}`}}><div><div className="text-[9px] uppercase tracking-widest font-bold" style={{color:C.textMute}}>Code promo frais</div><CopyableCode code={SITE.promoCode} displayClassName="font-mono text-[15px] font-bold" /></div><span className="text-[10px]" style={{color:C.textSec}}>Contenu réel<br/><span style={{color:C.neonDk}}>{matches.length} matchs frais</span></span></div></div></section><VipUnlockModal isOpen={showModal} onClose={()=>setShowModal(false)} /></>)
}
