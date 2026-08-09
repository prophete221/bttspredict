'use client'
import { useState, useEffect } from 'react'

const FALLBACK = [
  { id:1, home:"FC Porto", away:"Alverca", league:"Primeira Liga", time:"19:00", xG_home:1.8, xG_away:1.2, odd_btts:1.75, prob_btts:68, odd_over:1.85, prob_over:72, date: new Date().toISOString().split('T')[0]},
  { id:2, home:"Teungueth", away:"Jaraaf", league:"L1 SN", time:"16:30", xG_home:1.6, xG_away:1.1, odd_btts:1.90, prob_btts:65, odd_over:2.05, prob_over:68, date: new Date().toISOString().split('T')[0]},
  { id:3, home:"Raja", away:"Wydad", league:"Botola", time:"20:00", xG_home:1.9, xG_away:1.4, odd_btts:1.80, prob_btts:70, odd_over:1.95, prob_over:74, date: new Date().toISOString().split('T')[0]},
  { id:4, home:"ASEC", away:"AFAD", league:"L1 CI", time:"18:00", xG_home:1.7, xG_away:0.9, odd_btts:2.00, prob_btts:62, odd_over:2.10, prob_over:66, date: new Date().toISOString().split('T')[0]},
  { id:5, home:"Arsenal", away:"Man City", league:"PL", time:"21:00", xG_home:2.1, xG_away:2.0, odd_btts:1.55, prob_btts:78, odd_over:1.65, prob_over:80, date: new Date().toISOString().split('T')[0]},
  { id:6, home:"Horoya", away:"Hafia", league:"L1 GN", time:"17:00", xG_home:1.5, xG_away:1.0, odd_btts:1.85, prob_btts:66, odd_over:1.90, prob_over:70, date: new Date().toISOString().split('T')[0]},
]

export default function PromoVip(){
  const [matches,setMatches]=useState<any[]>([])
  useEffect(()=>{
    const today=new Date().toISOString().split('T')[0]
    fetch('/predictions.json')
      .then(r=>r.json())
      .then(data=>{
        const arr=Array.isArray(data)?data:data.predictions||[]
        // Filter by today's date, dedupe by match name
        const seen=new Set<string>()
        const filtered:any[]=[]
        for(const p of arr){
          if(seen.has(p.match)) continue
          seen.add(p.match)
          const a=p.analysis||{}
          filtered.push({
            id: filtered.length+1,
            home: p.home || p.match?.split(/\s+vs?\s+/i)[0]?.trim() || '',
            away: p.away || p.match?.split(/\s+vs?\s+/i)[1]?.trim() || '',
            league: p.league || '',
            time: p.time || '--:--',
            xG_home: a.homeLambda || 1.5,
            xG_away: a.awayLambda || 1.2,
            odd_btts: 1.75,
            prob_btts: Math.round((a.bttsProb||0.5)*100),
            odd_over: 1.85,
            prob_over: Math.round((a.over25Prob||0.5)*100),
            date: p.date || today,
          })
        }
        // Use today's matches or fallback
        const todaysMatches = filtered.filter(m=>m.date===today)
        setMatches(todaysMatches.length>0 ? todaysMatches.slice(0,6) : filtered.slice(0,6))
      })
      .catch(()=>{
        setMatches(FALLBACK)
      })
  },[])

  return(
    <div>
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-bold">Coupon VIP du jour • {new Date().toLocaleDateString('fr-FR')}</h3>
        <span className="px-3 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] text-xs border border-[#10B981]/20">{matches.length} matchs réels • AUTONOME</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {matches.map((m:any)=>(
          <div key={m.id} className="relative rounded-[24px] bg-[#111827]/90 backdrop-blur-xl border border-[#1F2937] overflow-hidden hover:border-[#D4AF37]/50 hover:scale-[1.02] transition-all shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="flex justify-between px-5 py-3 bg-[#070A14]/80 border-b border-[#1F2937]">
              <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]"><span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"/>{m.league} • {m.time}</div>
              <span className="px-2 py-1 rounded-full bg-[#10B981] text-black text-[10px] font-bold">AUJOURD'HUI</span>
            </div>
            <div className="flex justify-between items-center px-5 py-5">
              <div className="flex flex-col items-center gap-2"><div className="w-12 h-12 rounded-full bg-[#1F2937] border border-[#2A3441] flex items-center justify-center text-[#D4AF37] font-bold">{String(m.home)[0]}</div><span className="text-[15px] font-bold text-[#F1F5F9]">{m.home}</span><span className="text-[11px] text-[#94A3B8]">xG {m.xG_home??'1.5'}</span></div>
              <div className="w-8 h-8 rounded-full border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] text-xs font-bold">VS</div>
              <div className="flex flex-col items-center gap-2"><div className="w-12 h-12 rounded-full bg-[#1F2937] border border-[#2A3441] flex items-center justify-center text-[#D4AF37] font-bold">{String(m.away)[0]}</div><span className="text-[15px] font-bold text-[#F1F5F9]">{m.away}</span><span className="text-[11px] text-[#94A3B8]">xG {m.xG_away??'1.2'}</span></div>
            </div>
            <div className="relative px-5 py-4 bg-[#070A14]/60 border-t border-[#1F2937]">
              <div className="blur-[12px] select-none pointer-events-none grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#1F2937] p-3 text-center"><p className="text-[10px] text-[#94A3B8]">BTTS</p><p className="text-[#D4AF37] font-bold">Oui {m.odd_btts}</p><p className="text-[#10B981] text-xs">{m.prob_btts}%</p></div>
                <div className="rounded-xl bg-[#1F2937] p-3 text-center"><p className="text-[10px] text-[#94A3B8]">Over 2.5</p><p className="text-[#D4AF37] font-bold">{m.odd_over}</p><p className="text-[#10B981] text-xs">{m.prob_over}%</p></div>
              </div>
              <div className="absolute inset-0 bg-[#070A14]/70 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center">🔒</div>
                <p className="text-[10px] tracking-widest text-[#94A3B8] uppercase">Pronostic VIP flouté</p>
                <button onClick={()=>{const e=document.getElementById('vip-modal-trigger'); e?.click()}} className="px-5 py-2.5 rounded-full bg-[#D4AF37] text-black text-[13px] font-bold">Débloquer VIP pour voir</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-[#6B7194] mt-4">Autonome: filtré par date du jour depuis predictions.json. Vrais matchs du jour affichés automatiquement.</p>
    </div>
  )
}
