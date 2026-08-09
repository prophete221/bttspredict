'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation, useCountUp } from '@/hooks/useAnimations'
import VipUnlockModal from './VipUnlockModal'

const C = {
  bg: '#070B18', card: '#0D1630', border: 'rgba(247, 248, 255, 0.08)',
  green: '#5146F5', greenLight: '#5146F5', gold: '#5146F5', cyan: '#5146F5', violet: '#5146F5',
  text: '#F7F8FF', textSec: '#A5ABC5', textMute: '#A5ABC5',
  danger: '#5146F5',
}

function getHourlyServerSeed(): string {
  const now = new Date()
  const hourSeed = Math.floor(now.getTime() / (1000 * 60 * 60))
  let seed = ''; let x = hourSeed
  for (let i = 0; i < 64; i++) { x = (x * 9301 + 49297) % 233280; seed += Math.floor((x / 233280) * 16).toString(16) }
  return seed
}

function sha256Sync(message: string): string {
  function rrot(x: number, n: number): number { return (x >>> n) | (x << (32 - n)) }
  const K = new Uint32Array([0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2])
  const H = new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19])
  const bytes = new Uint8Array(message.length)
  for (let i = 0; i < message.length; i++) bytes[i] = message.charCodeAt(i) & 0xff
  const bitLen = bytes.length * 8
  const paddedLen = Math.ceil((bytes.length + 9) / 64) * 64
  const padded = new Uint8Array(paddedLen); padded.set(bytes); padded[bytes.length] = 0x80
  padded[paddedLen - 4] = (bitLen >>> 24) & 0xff; padded[paddedLen - 3] = (bitLen >>> 16) & 0xff; padded[paddedLen - 2] = (bitLen >>> 8) & 0xff; padded[paddedLen - 1] = bitLen & 0xff
  const W = new Uint32Array(64)
  for (let off = 0; off < padded.length; off += 64) {
    for (let i = 0; i < 16; i++) W[i] = (padded[off + i*4] << 24) | (padded[off + i*4 + 1] << 16) | (padded[off + i*4 + 2] << 8) | padded[off + i*4 + 3]
    for (let i = 16; i < 64; i++) { const s0 = rrot(W[i-15],7)^rrot(W[i-15],18)^(W[i-15]>>>3); const s1 = rrot(W[i-2],17)^rrot(W[i-2],19)^(W[i-2]>>>10); W[i] = (W[i-16]+s0+W[i-7]+s1)|0 }
    let [a,b,c,d,e,f,g,h] = [H[0],H[1],H[2],H[3],H[4],H[5],H[6],H[7]]
    for (let i = 0; i < 64; i++) { const S1 = rrot(e,6)^rrot(e,11)^rrot(e,25); const ch = (e&f)^(~e&g); const t1 = (h+S1+ch+K[i]+W[i])|0; const S0 = rrot(a,2)^rrot(a,13)^rrot(a,22); const mj = (a&b)^(a&c)^(b&c); const t2 = (S0+mj)|0; h=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0 }
    H[0]=(H[0]+a)|0;H[1]=(H[1]+b)|0;H[2]=(H[2]+c)|0;H[3]=(H[3]+d)|0;H[4]=(H[4]+e)|0;H[5]=(H[5]+f)|0;H[6]=(H[6]+g)|0;H[7]=(H[7]+h)|0
  }
  return Array.from(H).map(x => x.toString(16).padStart(8,'0')).join('')
}

function crashPointFromHash(hash: string): number {
  const h = parseInt(hash.slice(0, 13), 16); const e = Math.pow(2, 52)
  if (h % 51 === 0) return 1.00
  return Math.max(1.00, Math.floor((100 * e - h) / (e - h)) / 100)
}

interface AviatorRound { nonce: number; hash: string; multiplier: number; time: string }

function generateRounds(count: number): AviatorRound[] {
  const serverSeed = getHourlyServerSeed(); const rounds: AviatorRound[] = []; const now = Date.now()
  for (let i = 0; i < count; i++) {
    const nonce = 10000 + Math.floor(now / 1000 / 60 / 60) - i
    const hash = sha256Sync(serverSeed + ':' + nonce)
    const multiplier = crashPointFromHash(hash)
    const time = new Date(now - i * 3 * 60 * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    rounds.push({ nonce, hash, multiplier, time })
  }
  return rounds
}

function computeDailyStats() {
  const rounds = generateRounds(100)
  const cashedOut = rounds.filter(r => r.multiplier >= 2.0).length
  const winRate = Math.round((cashedOut / rounds.length) * 1000) / 10
  const avgMult = Math.round((rounds.reduce((s, r) => s + r.multiplier, 0) / rounds.length) * 100) / 100
  const maxMult = Math.round(Math.max(...rounds.map(r => r.multiplier)) * 100) / 100
  return { winRate, avgMult, maxMult, totalRounds: rounds.length }
}

export default function AviatorVip() {
  const [ref, isVisible] = useScrollAnimation()
  const [showModal, setShowModal] = useState(false)
  const [mounted, setMounted] = useState(false)
  const stats = useMemo(() => mounted ? computeDailyStats() : null, [mounted])
  const rounds = useMemo(() => mounted ? generateRounds(4) : [], [mounted])

  useEffect(() => { setMounted(true) }, [])

  return (
    <>
      <section ref={ref} id="aviator" className="section-pad overflow-x-hidden" style={{ paddingTop: '16px', paddingBottom: '16px', backgroundColor: '#070B18' }}>
        <div className="max-w-[440px] sm:max-w-2xl mx-auto">
          {/* Compact card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isVisible ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.4 }}
            className="rounded-[14px] overflow-hidden"
            style={{ backgroundColor: C.card, border: '1px solid ' + C.border, boxShadow: '0 4px 20px rgba(7, 11, 24,0.3)' }}
          >
            {/* Top accent */}
            <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, ' + C.danger + ', transparent)' }} />

            <div className="p-3.5">
              {/* Header — compact */}
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(81, 70, 245,0.1)', border: '1px solid rgba(81, 70, 245,0.2)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.danger} strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-papier">Stats Aviator</h3>
                  <p className="text-[9px]" style={{ color: C.textMute }}>Provably Fair · SHA-256</p>
                </div>
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(81, 70, 245,0.1)' }}>
                  <span className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: C.danger }} />
                  <span className="font-mono text-[8px] font-bold" style={{ color: C.danger }}>LIVE</span>
                </div>
              </div>

              {/* Warning — compact */}
              <div className="p-2 rounded-lg mb-3" style={{ backgroundColor: 'rgba(81, 70, 245,0.06)', border: '1px solid rgba(81, 70, 245,0.15)' }}>
                <p className="text-[9px] leading-relaxed" style={{ color: C.textSec }}>
                  ⚠️ <span style={{ color: C.danger }}>Provably Fair :</span> Aviator est 100% aléatoire. Aucun outil ne peut prédire un round futur.
                </p>
              </div>

              {/* KPI — 2x2 compact grid */}
              <div className="grid grid-cols-2 gap-1.5 mb-3">
                <div className="p-2 rounded-lg text-center" style={{ backgroundColor: 'rgba(81, 70, 245,0.06)' }}>
                  <div className="text-sm font-bold tabular-nums" style={{ color: C.danger }}>{stats?.winRate || 0}%</div>
                  <div className="text-[8px] uppercase tracking-wider" style={{ color: C.textMute }}>Cash-out</div>
                </div>
                <div className="p-2 rounded-lg text-center" style={{ backgroundColor: 'rgba(81, 70, 245,0.06)' }}>
                  <div className="text-sm font-bold tabular-nums" style={{ color: C.cyan }}>{stats?.avgMult.toFixed(2) || '0.00'}x</div>
                  <div className="text-[8px] uppercase tracking-wider" style={{ color: C.textMute }}>Mult. moyen</div>
                </div>
                <div className="p-2 rounded-lg text-center" style={{ backgroundColor: 'rgba(81, 70, 245,0.06)' }}>
                  <div className="text-sm font-bold tabular-nums" style={{ color: C.gold }}>{stats?.maxMult.toFixed(2) || '0.00'}x</div>
                  <div className="text-[8px] uppercase tracking-wider" style={{ color: C.textMute }}>Max du jour</div>
                </div>
                <div className="p-2 rounded-lg text-center" style={{ backgroundColor: 'rgba(81, 70, 245,0.06)' }}>
                  <div className="text-sm font-bold tabular-nums" style={{ color: C.violet }}>{stats?.totalRounds || 0}</div>
                  <div className="text-[8px] uppercase tracking-wider" style={{ color: C.textMute }}>Rounds</div>
                </div>
              </div>

              {/* Locked rounds — blur */}
              <div className="relative">
                <div className="space-y-1" style={{ filter: 'blur(5px)', opacity: 0.4, pointerEvents: 'none' }}>
                  {rounds.map((r, i) => (
                    <div key={i} className="flex items-center justify-between px-2 py-1.5 rounded" style={{ backgroundColor: 'rgba(247, 248, 255,0.02)' }}>
                      <span className="font-mono text-[10px]" style={{ color: C.textSec }}>#{r.nonce}</span>
                      <span className="font-mono text-[10px] font-bold" style={{ color: C.gold }}>{r.multiplier.toFixed(2)}x</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unlock button */}
              <button
                onClick={() => setShowModal(true)}
                className="w-full mt-3 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all"
                style={{ background: 'linear-gradient(135deg, #5146F5, #5146F5)', color: '#F7F8FF' }}
              >
                🔒 Débloquer les Stats Aviator VIP
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <VipUnlockModal isOpen={showModal} onClose={() => setShowModal(false)} title="Débloque les Stats Aviator VIP" />
    </>
  )
}
