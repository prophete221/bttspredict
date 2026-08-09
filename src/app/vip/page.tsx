'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { AFFILIATE, SITE } from '@/lib/constants'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const ErrorBoundary = dynamic(() => import('@/components/bttsbet/ErrorBoundary'), { loading: () => null })

/* ═════════════════════════════════════════════════════════════════
   5 VRAIS LIENS AFFILIÉS — extraits du code existant (src/lib/constants.ts)
   AUCUN lien inventé. Réutilisés à l'identique.
   ═════════════════════════════════════════════════════════════════ */
const LIEN_INSCRIPTION_LINEBET = AFFILIATE.linebet
const LIEN_APK_LINEBET = AFFILIATE.linebetDownload
const LIEN_INSCRIPTION_888STARZ = AFFILIATE.star888
const LIEN_APK_888STARZ = AFFILIATE.star888Download
const WHATSAPP_NUMBER = '15406704172'

/* ═════════════════════════════════════════════════════════════════
   Palette OR & ÉMERAUDE v68+
   ═════════════════════════════════════════════════════════════════ */
const C = {
  bg: '#070A14',
  card: '#111827',
  border: '#1F2937',
  gold: '#D4AF37',
  goldDark: '#B7952E',
  emerald: '#10B981',
  emeraldDark: '#059669',
  whatsapp: '#25D366',
  text: '#F1F5F9',
  textSec: '#94A3B8',
  textMute: '#64748B',
  error: '#EF4444',
}

/* ═════════════════════════════════════════════════════════════════
   VIP TIERS — restaurés depuis backup (VipCardGlass.tsx)
   ═════════════════════════════════════════════════════════════════ */
const VIP_TIERS = [
  { level: 'Silver', deposit: '3 000 XOF', color: '#94A3B8', pronos: '10 pronos/jour', perks: ['BTTS + Over 2.5', 'Historique complet', 'WhatsApp 24/7'] },
  { level: 'Gold', deposit: '6 000 XOF', color: C.gold, pronos: '20 pronos/jour', perks: ['Multi-sports (6)', 'Value Bets FIFA', 'xG détaillés', 'WhatsApp prioritaire'] },
  { level: 'Elite', deposit: '12 000 XOF', color: C.emerald, pronos: '30+ pronos/jour', perks: ['Tous sports + marchés', 'Stats Aviator illimités', 'Analyse perso', 'WhatsApp + Telegram'] },
  { level: 'Tous Niveaux', deposit: '12 000 XOF · 1 mois', color: C.gold, pronos: 'Tout illimité', perks: ['Silver + Gold + Elite', 'Support VIP 24/7', 'Analyse perso expert'] },
]

/* ═════════════════════════════════════════════════════════════════
   Sports couverts (backup VipSports)
   ═════════════════════════════════════════════════════════════════ */
const SPORTS = ['Football', 'Tennis', 'NBA', 'NFL', 'UFC', 'Handball']

/* ═════════════════════════════════════════════════════════════════
   FAQ (backup HowToGetVip)
   ═════════════════════════════════════════════════════════════════ */
const FAQ = [
  { q: 'Comment débloquer mon VIP ?', a: "Inscris-toi avec le code VISION221 (Linebet) ou vision221 (888Starz), dépose 3 000 F min, envoie ton ID via WhatsApp. On vérifie en 15-60 min." },
  { q: "L'accès VIP est-il valable combien de temps ?", a: "30 jours à partir de l'activation. Renouvelable en gardant ton compte bookmaker actif." },
  { q: 'Combien de pronostics par jour ?', a: "10 (Silver), 20 (Gold), 30+ (Elite). BTTS, Over 2.5, value bets, multi-sports." },
  { q: 'Le bonus est-il garanti ?', a: 'Non. Aucun gain n\'est garanti. Les paris sportifs comportent un risque de perte. 18+.' },
]

/* ═════════════════════════════════════════════════════════════════
   Match data type (backup PromoVip pattern)
   ═════════════════════════════════════════════════════════════════ */
type VipMatch = {
  match: string; home: string; away: string; league: string
  date: string; time: string; homeLogo: string; awayLogo: string
}

export default function VipPage() {
  const [vipMatches, setVipMatches] = useState<VipMatch[]>([])
  const [copiedCode, setCopiedCode] = useState(false)
  const [toast, setToast] = useState('')
  const [bookmaker, setBookmaker] = useState<'linebet' | '888starz'>('linebet')

  useEffect(() => {
    fetch('/predictions.json')
      .then(r => r.json())
      .then(data => {
        if (!data?.predictions) return
        const matchMap = new Map<string, VipMatch>()
        for (const p of data.predictions) {
          const key = p.match
          if (!matchMap.has(key)) {
            const [home, away] = (p.match || '').split(/\s+vs?\s+/i)
            matchMap.set(key, {
              match: p.match, home: home?.trim() || '', away: away?.trim() || '',
              league: p.league || '', date: p.date || '', time: p.time || '--:--',
              homeLogo: p.homeLogo || '', awayLogo: p.awayLogo || '',
            })
          }
        }
        const all = [...matchMap.values()].sort((a, b) => (a.time || '').localeCompare(b.time || '')).slice(0, 6)
        setVipMatches(all)
      })
      .catch(() => {})
  }, [])

  const code = bookmaker === 'linebet' ? 'VISION221' : 'vision221'
  const inscriptionLink = bookmaker === 'linebet' ? LIEN_INSCRIPTION_LINEBET : LIEN_INSCRIPTION_888STARZ
  const apkLink = bookmaker === 'linebet' ? LIEN_APK_LINEBET : LIEN_APK_888STARZ

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(true); showToast(`Code copié ${code}`); setTimeout(() => setCopiedCode(false), 2000)
    } catch {
      const el = document.createElement('textarea'); el.value = code; document.body.appendChild(el); el.select()
      try { document.execCommand('copy') } catch {}
      document.body.removeChild(el); setCopiedCode(true); showToast(`Code copié ${code}`); setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  /* ═══ 14 SECTIONS — Restaurées depuis backup-v2 ═══ */
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.bg, color: C.text }}>
      <ErrorBoundary><Navbar /></ErrorBoundary>

      <main id="main-content" className="flex-1 relative z-10" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>

        {/* Toast */}
        {toast && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl font-bold text-sm shadow-2xl"
            style={{ backgroundColor: toast.startsWith('⚠') ? C.error : C.emerald, color: C.bg, border: `1.5px solid ${toast.startsWith('⚠') ? C.error : C.emerald}` }}
            role="status" aria-live="polite">{toast}</div>
        )}

        {/* ═══ 1. INTRODUCTION ═══ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-6 text-center">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
            style={{ backgroundColor: `${C.gold}1A`, color: C.gold, border: `1px solid ${C.gold}55` }}>
            ★ Programme VIP Premium
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Débloquer VIP 1 Mois Gratuit
          </h1>
          <p className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: C.textSec }}>
            Inscris-toi avec notre code, dépôt <strong style={{ color: C.gold }}>3 000 F min</strong>, envoie ton ID,
            on vérifie en <strong style={{ color: C.gold }}>15-60 min</strong> dans notre espace affilié. 18+ Jouer responsable.
          </p>
        </section>

        {/* ═══ 2. VALEUR (6 features) ═══ */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { title: '+20 Pronos/Jour', desc: 'BTTS + Over 2.5 + value bets' },
              { title: 'Cotes Boostées', desc: 'Combinés premium' },
              { title: 'Signaux Direct', desc: 'Alertes temps réel' },
              { title: 'Value Bets FIFA', desc: 'Cotes sous-évaluées détectées' },
              { title: 'Multi-Sports', desc: '6 sports couverts' },
              { title: 'Historique Complet', desc: 'Gagnés ET perdus affichés' },
            ].map((f, i) => (
              <div key={i} className="rounded-2xl p-4 text-center" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
                <h3 className="text-sm font-bold mb-1" style={{ color: C.gold }}>{f.title}</h3>
                <p className="text-[11px]" style={{ color: C.textSec }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ 3. VIP CARD GRID (4 tiers) ═══ */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
          <h2 className="text-xl sm:text-2xl mb-5 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
            💎 Choisis ton <span style={{ color: C.gold }}>niveau VIP</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VIP_TIERS.map((tier) => (
              <div key={tier.level} className="rounded-2xl p-5 flex flex-col" style={{ backgroundColor: C.card, border: `1.5px solid ${tier.color}33` }}>
                <div className="inline-block self-start px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3"
                  style={{ backgroundColor: `${tier.color}1A`, color: tier.color, border: `1px solid ${tier.color}44` }}>
                  {tier.level}
                </div>
                <p className="text-[11px] uppercase tracking-widest mb-1" style={{ color: C.textMute }}>Dépôt min.</p>
                <p className="text-xl font-black mb-3" style={{ color: tier.color, fontFamily: 'var(--font-mono), monospace' }}>{tier.deposit}</p>
                <p className="text-xs mb-3" style={{ color: C.textSec }}>{tier.pronos}</p>
                <ul className="space-y-1.5 mb-4 flex-1">
                  {tier.perks.map((p, j) => (
                    <li key={j} className="flex items-start gap-1.5 text-[11px]" style={{ color: C.textSec }}>
                      <span style={{ color: tier.color }}>✓</span> {p}
                    </li>
                  ))}
                </ul>
                <a href="#verification" className="block text-center py-2 rounded-[10px] font-bold text-[11px]" style={{ backgroundColor: tier.color, color: C.bg }}>
                  Débloquer {tier.level}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ 4. AVANTAGES ═══ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-8">
          <h2 className="text-lg font-bold mb-3 text-center">Ce que tu débloques</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
              <p className="text-2xl font-black" style={{ color: C.gold }}>6+</p><p className="text-[10px]" style={{ color: C.textSec }}>pronos/jour</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
              <p className="text-2xl font-black" style={{ color: C.emerald }}>xG</p><p className="text-[10px]" style={{ color: C.textSec }}>uniques/match</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
              <p className="text-2xl font-black" style={{ color: C.gold }}>30j</p><p className="text-[10px]" style={{ color: C.textSec }}>accès gratuit</p>
            </div>
          </div>
        </section>

        {/* ═══ 5. SPORTS ═══ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-8">
          <h2 className="text-lg font-bold mb-3 text-center">Sports couverts</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {SPORTS.map(s => (
              <span key={s} className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: `${C.emerald}1A`, color: C.emerald, border: `1px solid ${C.emerald}33` }}>{s}</span>
            ))}
          </div>
        </section>

        {/* ═══ 6+7. NOMBRE PRONOS + DURÉE ═══ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-8 text-center">
          <p className="text-sm" style={{ color: C.textSec }}>
            <strong style={{ color: C.text }}>10 à 30+ pronostics</strong> par jour selon le niveau. Accès valable <strong style={{ color: C.gold }}>30 jours</strong>, renouvelable.
          </p>
        </section>

        {/* ═══ 8. HOW TO GET VIP (4 steps) ═══ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-8">
          <h2 className="text-lg font-bold mb-4 text-center">Comment débloquer ton VIP</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {[
              { n: '01', t: "S'inscrire", d: 'Avec le code VISION221 ou vision221' },
              { n: '02', t: 'Déposer', d: '3 000 F min via Wave, OM, MTN' },
              { n: '03', t: 'Envoyer ID', d: 'Via WhatsApp +15406704172' },
              { n: '04', t: 'VIP activé', d: 'En 15-60 min, accès groupe' },
            ].map((s, i) => (
              <div key={i} className="rounded-xl p-4 text-center" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
                <p className="text-[10px] font-mono mb-2" style={{ color: C.gold }}>{s.n}</p>
                <h3 className="text-sm font-bold mb-1">{s.t}</h3>
                <p className="text-[11px]" style={{ color: C.textSec }}>{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ 9. PROMO VIP — Coupon du jour (matchs visible + flouté) ═══ */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-8">
          <h2 className="text-lg font-bold mb-3 text-center">Coupon VIP du jour</h2>
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
            {/* Top accent */}
            <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${C.gold}55, transparent)` }} />

            {/* 2 matchs VISIBLES */}
            <div className="p-3">
              {vipMatches.slice(0, 2).map((m, i) => (
                <div key={i} className="flex items-center gap-2 py-2 px-2 rounded-[10px] mb-1" style={{ background: 'rgba(241, 245, 249, 0.02)' }}>
                  <span className="font-mono text-[10px] w-10 text-center" style={{ color: C.textMute }}>{m.time}</span>
                  {m.homeLogo && <img src={m.homeLogo} alt="" className="w-4 h-4 object-contain" loading="lazy" />}
                  <span className="text-[11px] font-semibold truncate" style={{ color: C.text }}>{m.home}</span>
                  <span className="text-[9px]" style={{ color: C.textMute }}>vs</span>
                  <span className="text-[11px] font-semibold truncate" style={{ color: C.text }}>{m.away}</span>
                  {m.awayLogo && <img src={m.awayLogo} alt="" className="w-4 h-4 object-contain" loading="lazy" />}
                  <span className="font-mono text-[10px] font-bold ml-auto" style={{ color: C.gold }}>VIP</span>
                </div>
              ))}

              {/* Matchs FLOUTÉS (blur 12px + overlay) */}
              {vipMatches.length > 2 && (
                <div className="relative" style={{ filter: 'blur(12px)', opacity: 0.5, pointerEvents: 'none' }}>
                  {vipMatches.slice(2, 5).map((m, i) => (
                    <div key={i} className="flex items-center gap-2 py-2 px-2 rounded-[10px] mb-1" style={{ background: 'rgba(241, 245, 249, 0.02)' }}>
                      <span className="font-mono text-[10px] w-10" style={{ color: C.textMute }}>{m.time}</span>
                      <span className="text-[11px] truncate flex-1" style={{ color: C.text }}>{m.match}</span>
                      <span className="font-mono text-[10px] font-bold" style={{ color: C.emerald }}>VIP</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Lock overlay + bouton Débloquer */}
              <div className="relative flex items-center justify-center py-3 mt-1">
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(7, 10, 20, 0.85)' }}>
                  <a href="#verification" className="flex items-center gap-2 px-5 py-2.5 rounded-[12px] font-bold text-[13px] transition-all"
                    style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`, color: C.bg, boxShadow: `0 4px 20px ${C.gold}33` }}
                    data-cta="vip-unlock-coupon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Débloquer VIP pour voir
                  </a>
                </div>
                <span className="text-[10px]" style={{ color: C.textMute }}>
                  +{Math.max(0, vipMatches.length - 2)} sélections verrouillées
                </span>
              </div>
            </div>
            <div className="px-3 py-2.5 flex items-center justify-between border-t" style={{ borderColor: C.border }}>
              <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: C.textMute }}>Cote totale</span>
              <span className="font-mono text-[14px] font-bold" style={{ color: C.gold }}>VIP</span>
            </div>
          </div>
        </section>

        {/* ═══ 10. AVIATOR VIP (info court) ═══ */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-8">
          <div className="rounded-xl p-4" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
            <p className="text-xs" style={{ color: C.textSec }}>
              🎮 <strong style={{ color: C.emerald }}>Stats Aviator premium</strong> incluses en VIP Gold+. Algorithme Provably Fair (SHA-256), informatif non prédictif.
            </p>
          </div>
        </section>

        {/* ═══ 11. HISTORIQUE (lien) ═══ */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-8 text-center">
          <a href="/resultats-verifies" className="inline-flex items-center gap-1 text-sm font-bold underline" style={{ color: C.gold }}>
            Voir historique vérifiable depuis le 08/08/2026 →
          </a>
        </section>

        {/* ═══ 12. CONDITIONS ═══ */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-8">
          <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <p className="text-[11px] leading-relaxed" style={{ color: C.textSec }}>
              ⚠ Aucun gain garanti. Bonus soumis aux conditions du bookmaker (mise, dépôt min). BTTSPredict ne prend pas de paris, ne collecte pas de fonds. Lien d'affiliation rémunéré. 18+ Jouer responsable.
            </p>
          </div>
        </section>

        {/* ═══ 13. CODE PROMO + BOOKMAKER (2 cartes + vérification) ═══ */}
        <section id="verification" className="max-w-2xl mx-auto px-4 sm:px-6 pb-8">
          <h2 className="text-lg font-bold mb-4 text-center">Code promo + Vérification WhatsApp</h2>

          {/* Choix bookmaker */}
          <div className="flex gap-2 mb-4">
            <button onClick={() => setBookmaker('linebet')} className="flex-1 py-2 rounded-[10px] font-bold text-[12px] transition-all"
              style={{ backgroundColor: bookmaker === 'linebet' ? C.gold : 'transparent', color: bookmaker === 'linebet' ? C.bg : C.textSec, border: `1.5px solid ${bookmaker === 'linebet' ? C.gold : C.border}` }}>
              Linebet (VISION221)
            </button>
            <button onClick={() => setBookmaker('888starz')} className="flex-1 py-2 rounded-[10px] font-bold text-[12px] transition-all"
              style={{ backgroundColor: bookmaker === '888starz' ? C.emerald : 'transparent', color: bookmaker === '888starz' ? C.bg : C.textSec, border: `1.5px solid ${bookmaker === '888starz' ? C.emerald : C.border}` }}>
              888Starz (vision221)
            </button>
          </div>

          {/* Code cliquable */}
          <div className="text-center mb-4">
            <button onClick={copyCode} title="Cliquer pour copier" className="inline-flex items-center gap-3 cursor-pointer transition-transform hover:scale-[1.02] bg-transparent border-0 p-0">
              <span className="text-3xl sm:text-4xl font-black tracking-[0.15em]" style={{
                color: bookmaker === 'linebet' ? C.gold : C.emerald, fontFamily: 'var(--font-mono), monospace',
                textShadow: `0 0 20px ${bookmaker === 'linebet' ? C.gold : C.emerald}55`,
              }}>{code}</span>
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg" style={{
                backgroundColor: copiedCode ? C.emerald : `${bookmaker === 'linebet' ? C.gold : C.emerald}1A`,
                border: `1px solid ${copiedCode ? C.emerald : (bookmaker === 'linebet' ? C.gold : C.emerald)}`,
                color: copiedCode ? C.bg : (bookmaker === 'linebet' ? C.gold : C.emerald),
              }}>
                {copiedCode ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                )}
              </span>
            </button>
          </div>

          {/* 3 boutons */}
          <div className="space-y-2 mb-4">
            <a href={inscriptionLink} target="_blank" rel="noopener noreferrer nofollow sponsored"
              className="block w-full h-[48px] rounded-[10px] font-bold text-[13px] flex items-center justify-center transition-all"
              style={{ backgroundColor: bookmaker === 'linebet' ? C.gold : C.emerald, color: C.bg }} data-cta="vip-inscription">
              S'inscrire sur {bookmaker === 'linebet' ? 'Linebet' : '888Starz'} →
            </a>
            <a href={apkLink} target="_blank" rel="noopener noreferrer nofollow sponsored"
              className="block w-full h-[48px] rounded-[10px] font-bold text-[13px] flex items-center justify-center transition-all"
              style={{ backgroundColor: 'transparent', color: C.text, border: `1.5px solid ${C.border}` }} data-cta="vip-apk">
              📥 Télécharger APK {bookmaker === 'linebet' ? 'Linebet' : '888Starz'}
            </a>
          </div>

          {/* WhatsApp */}
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Salut BTTSPredict, je viens de m'inscrire avec ton code " + code + " Dépôt 3000F fait. Merci de vérifier et débloquer mon VIP.")}`}
            target="_blank" rel="noopener noreferrer"
            className="block w-full h-[52px] rounded-[10px] font-bold text-[14px] flex items-center justify-center gap-2 transition-all"
            style={{ backgroundColor: C.whatsapp, color: C.bg, boxShadow: `0 6px 20px ${C.whatsapp}33` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            Vérifier via WhatsApp
          </a>
          <p className="text-[11px] text-center mt-3" style={{ color: C.textMute }}>
            On vérifie dans le tableau de bord affilié. Délai 15-60 min. Numéro: wa.me/15406704172
          </p>
        </section>

        {/* ═══ 14. FAQ + JEU RESPONSABLE ═══ */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-10">
          <h2 className="text-lg font-bold mb-4 text-center">Questions fréquentes</h2>
          <div className="space-y-3 mb-6">
            {FAQ.map((item, i) => (
              <details key={i} className="rounded-xl p-4" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
                <summary className="cursor-pointer font-semibold text-sm" style={{ color: C.text, listStyle: 'none' }}>{item.q}</summary>
                <p className="text-[12px] mt-2 leading-relaxed" style={{ color: C.textSec }}>{item.a}</p>
              </details>
            ))}
          </div>
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <p className="text-[11px]" style={{ color: C.textSec }}>
              18+ · Les paris sportifs comportent un risque de perte. Aucun gain garanti. Lien d'affiliation rémunéré.{' '}
              <a href="/jouer-responsable" className="underline" style={{ color: C.gold }}>En savoir plus</a> · wa.me/15406704172
            </p>
          </div>
        </section>

        <ErrorBoundary><Footer /></ErrorBoundary>
      </main>
    </div>
  )
}
