'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { AFFILIATE } from '@/lib/constants'
import { getDakarDateString } from '@/lib/dakar-date'
import { useLanguage } from '@/components/bttsbet/LanguageSwitcher'
import { translationsFor } from '@/lib/i18n'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const ErrorBoundary = dynamic(() => import('@/components/bttsbet/ErrorBoundary'), { loading: () => null })
const VipUnlockModal = dynamic(() => import('@/components/bttsbet/VipUnlockModal'), { loading: () => null })

const LIEN_LINEBET = AFFILIATE.linebet
const LIEN_LINEBET_APK = AFFILIATE.linebetDownload
const LIEN_888STARZ = AFFILIATE.star888
const LIEN_888STARZ_APK = AFFILIATE.star888Download
const WHATSAPP = '15406704172'

// ─── Bookmaker brand colors ───
// Linebet = vert clair (light green)
// 888Starz = rouge clair (light red)
const BRAND = {
  linebet: { primary: '#B8FF1A', primaryGlow: '#B8FF1A30', primaryDark: '#3FBA7C' },
  star888: { primary: '#FF7B7B', primaryGlow: '#FF7B7B30', primaryDark: '#E55A5A' },
}

const C = {
  bg:'#071018', surface:'#0D1A20', border:'#5D7880',
  text:'#F5F8F3', textSec:'#B7C4C1', textMute:'#B7C4C1',
  baobab:'#B8FF1A', data:'#8FE3B5', success:'#34D399', warning:'#F5C451',
  gold:'#F5C451',
}

interface PreviewMatch {
  home: string
  away: string
  league: string
  time: string
  date: string
  homeLogo?: string
  awayLogo?: string
  homeInitial: string
  awayInitial: string
}

interface VipComboLeg {
  eventId?: string
  home: string
  away: string
  league: string
  kickoff: string
  bookmaker: string
  market: string
  selection: string
  odds: number
  updatedAt: string
}

interface VipCombo {
  totalOdds: number
  legs: VipComboLeg[]
}

export default function VipPage() {
  const { lang } = useLanguage()
  const t = translationsFor(lang)
  const vipCopy = lang === 'fr' ? {
    access: 'ESPACE VIP · ACCÈS PRIVÉ', title: 'Le centre privé de tes analyses', subtitle: 'BTTS · Over 2,5 · Score exact · Matchs internationaux', published: 'sélections premium publiées', description: 'Une lecture plus complète des matchs, avec des éléments publiés avant le coup d’envoi et une méthode présentée sans promesse de gain.', unlock: 'Débloquer l’analyse VIP', benefits: 'Ce que tu déverrouilles', benefitTitle: 'Une fiche de match plus complète', choose: 'Choisis ton partenaire d’accès · code copié automatiquement', selected: 'Partenaire sélectionné', deposit: 'Dépôt min 3 000 F', signup: 'S’inscrire sur', download: 'Télécharger APK', steps: 'Activation simple et transparente', step1: 'Inscris-toi avec le code', step2: 'Effectue le dépôt minimum indiqué par le partenaire', step3: 'Envoie ton ID sur WhatsApp pour finaliser la vérification', verify: 'Finaliser ma vérification via WhatsApp', desk: 'BUREAU D’INTELLIGENCE PRIVÉ', secure: 'APERÇU SÉCURISÉ', selections: 'Sélections', context: 'Contexte', history: 'Historique', locked: 'ANALYSE PROTÉGÉE', preview: 'Aperçu des matchs · données protégées', encrypted: 'CHIFFRÉ', unavailable: 'Aperçu premium indisponible pour le moment — aucune donnée fictive n’est affichée.', detailed: 'Analyse détaillée', scoreMarkets: 'Score · Marchés · Faits clés', accessNote: 'Accès après vérification · 18+ · Aucun gain garanti', conditions: 'Les conditions commerciales sont définies par le partenaire et doivent être vérifiées avant toute inscription.', partnerSelected: 'Partenaire sélectionné', depositNote: 'Dépôt minimum indiqué par le partenaire', downloadApk: 'Télécharger APK', combo2: 'Combiné cible cote 2', combo5: 'Combiné cible cote 5', comboUnavailable: 'Aucun combiné vérifié disponible pour le moment.', comboSource: 'Cotes bookmaker vérifiées · données du jour', comboUpdated: 'Mise à jour' }
  : lang === 'en' ? {
    access: 'VIP DESK · PRIVATE ACCESS', title: 'Your private analysis desk', subtitle: 'BTTS · Over 2.5 · Correct score · International matches', published: 'premium selections published', description: 'A deeper match view with pre-kickoff information and a documented method without profit promises.', unlock: 'Unlock VIP analysis', benefits: 'What you unlock', benefitTitle: 'A more complete match file', choose: 'Choose your access partner · code copied automatically', selected: 'Selected partner', deposit: 'Minimum deposit 3,000 XOF', signup: 'Sign up on', download: 'Download APK', steps: 'Simple and transparent activation', step1: 'Sign up with code', step2: 'Make the minimum deposit indicated by the partner', step3: 'Send your ID on WhatsApp to complete verification', verify: 'Complete my verification on WhatsApp', desk: 'PRIVATE INTELLIGENCE DESK', secure: 'SECURE PREVIEW', selections: 'Selections', context: 'Context', history: 'History', locked: 'PRO ANALYSIS / LOCKED', preview: 'Match preview · protected data', encrypted: 'ENCRYPTED', unavailable: 'Premium preview is currently unavailable — no fictional data is displayed.', detailed: 'Detailed analysis', scoreMarkets: 'Score · Markets · Key facts', accessNote: 'Access after verification · 18+ · No profit is guaranteed', conditions: 'Commercial terms are set by the partner and must be checked before registration.', partnerSelected: 'Selected partner', depositNote: 'Minimum deposit set by the partner', downloadApk: 'Download APK', combo2: 'Target odds 2 combo', combo5: 'Target odds 5 combo', comboUnavailable: 'No verified combo is available right now.', comboSource: "Verified bookmaker odds · today’s data", comboUpdated: 'Updated' }
  : {
    access: 'مساحة VIP · وصول خاص', title: 'مكتبك الخاص للتحليل', subtitle: 'BTTS · أكثر من 2.5 · النتيجة الدقيقة · مباريات دولية', published: 'اختيارات مميزة منشورة', description: 'رؤية أعمق للمباراة مع معلومات قبل البداية ومنهجية موثقة دون وعود بالربح.', unlock: 'فتح تحليل VIP', benefits: 'ما الذي تحصل عليه', benefitTitle: 'ملف مباراة أكثر اكتمالاً', choose: 'اختر شريك الوصول · يتم نسخ الرمز تلقائياً', selected: 'الشريك المختار', deposit: 'الحد الأدنى للإيداع 3000 XOF', signup: 'التسجيل في', download: 'تحميل التطبيق', steps: 'تفعيل بسيط وشفاف', step1: 'سجّل باستخدام الرمز', step2: 'أجرِ الحد الأدنى للإيداع الذي يحدده الشريك', step3: 'أرسل هويتك عبر واتساب لإكمال التحقق', verify: 'إكمال التحقق عبر واتساب', desk: 'مكتب الذكاء الخاص', secure: 'معاينة آمنة', selections: 'الاختيارات', context: 'السياق', history: 'السجل', locked: 'تحليل احترافي محمي', preview: 'معاينة المباريات · بيانات محمية', encrypted: 'مشفّر', unavailable: 'المعاينة المميزة غير متاحة حالياً — لا يتم عرض بيانات وهمية.', detailed: 'تحليل مفصل', scoreMarkets: 'النتيجة · الأسواق · الحقائق الأساسية', accessNote: 'الوصول بعد التحقق · 18+ · لا يوجد ربح مضمون', conditions: 'يحدد الشريك الشروط التجارية ويجب التحقق منها قبل التسجيل.', partnerSelected: 'الشريك المختار', depositNote: 'الحد الأدنى للإيداع يحدده الشريك', downloadApk: 'تحميل التطبيق', combo2: 'تركيبة بهدف معامل 2', combo5: 'تركيبة بهدف معامل 5', comboUnavailable: 'لا توجد تركيبة موثقة متاحة حالياً.', comboSource: 'كوتات مراهنات موثقة · بيانات اليوم', comboUpdated: 'آخر تحديث' }
  const [copiedCode, setCopiedCode] = useState(false)
  const [toast, setToast] = useState('')
  const [bookmaker, setBookmaker] = useState<'linebet'|'888starz'>('linebet')
  const [previewMatches, setPreviewMatches] = useState<PreviewMatch[]>([])
  const [vipCount, setVipCount] = useState<number | null>(null)
  const [generationDate, setGenerationDate] = useState<string | null>(null)
  const [vipCombos, setVipCombos] = useState<{ target2: VipCombo | null; target5: VipCombo | null; date?: string; fetchedAt?: string; status?: string } | null>(null)
  const [showModal, setShowModal] = useState(false)

  const code = bookmaker === 'linebet' ? 'VISION221' : 'vision221'
  const inscriptionLink = bookmaker === 'linebet' ? LIEN_LINEBET : LIEN_888STARZ
  const apkLink = bookmaker === 'linebet' ? LIEN_LINEBET_APK : LIEN_888STARZ_APK
  const bonus = bookmaker === 'linebet' ? 'Bonus 90 000 XOF' : 'Bonus 200%'
  const brandColor = bookmaker === 'linebet' ? BRAND.linebet.primary : BRAND.star888.primary
  const brandGlow = bookmaker === 'linebet' ? BRAND.linebet.primaryGlow : BRAND.star888.primaryGlow
  const brandDark = bookmaker === 'linebet' ? BRAND.linebet.primaryDark : BRAND.star888.primaryDark

  // Load 2 real matches from predictions.json (vipPreview preferred, then free)
  // — NO hardcoded fallback matches. If predictions.json provides fewer than 2,
  // previewMatches stays empty and the card renders a neutral skeleton state.
  // Real VIP prediction count + generation date come from stats / top-level date.
  useEffect(() => {
    fetch('/predictions.json')
      .then(r => r.json())
      .then(data => {
        // Real VIP prediction count (from engine stats) and real generation date
        const statsVipCount = data?.stats?.vipCount
        if (typeof statsVipCount === 'number' && Number.isFinite(statsVipCount)) {
          setVipCount(statsVipCount)
        }
        const topDate = data?.date
        if (typeof topDate === 'string' && topDate.length > 0) {
          setGenerationDate(topDate)
        }
        // Build preview from real match data only — no fallback demo matches
        const arr: any[] = data?.vipPreview || data?.free || data?.predictions || []
        const todayStr = getDakarDateString()
        const upcoming = arr.filter((p: any) => p.date >= todayStr).slice(0, 2)
        if (upcoming.length > 0) {
          setPreviewMatches(upcoming.map((m: any) => ({
            home: m.home,
            away: m.away,
            league: m.league,
            time: m.time || '--:--',
            date: m.date,
            homeLogo: m.homeLogo,
            awayLogo: m.awayLogo,
            homeInitial: String(m.home || '?')[0].toUpperCase(),
            awayInitial: String(m.away || '?')[0].toUpperCase(),
          })))
        }
        // Else: previewMatches remains [] — render empty state, no demo data
      })
      .catch(() => {
        // Network/parse failure — leave previewMatches empty (no fake matches)
      })
  }, [])

  useEffect(() => {
    // The daily JSON is regenerated in production; bypass the one-hour edge/browser cache.
    fetch(`/vip-combos.json?ts=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && typeof data === 'object') setVipCombos(data)
      })
      .catch(() => setVipCombos(null))
  }, [])

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2500) }

  // ─── Copy the given code to clipboard + show toast ───
  const copyToClipboard = async (codeToCopy: string) => {
    try {
      await navigator.clipboard.writeText(codeToCopy)
      setCopiedCode(true)
      showToast(`Code ${codeToCopy} copié`)
      setTimeout(() => setCopiedCode(false), 2000)
    } catch {
      const el = document.createElement('textarea')
      el.value = codeToCopy
      document.body.appendChild(el)
      el.select()
      try { document.execCommand('copy') } catch {}
      document.body.removeChild(el)
      setCopiedCode(true)
      showToast(`Code ${codeToCopy} copié`)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  // ─── Legacy copyCode (used by manual copy button) ───
  const copyCode = () => copyToClipboard(code)

  // ─── Select bookmaker AND auto-copy its promo code at the same time ───
  const selectBookmaker = (bk: 'linebet' | '888starz') => {
    setBookmaker(bk)
    const codeToCopy = bk === 'linebet' ? 'VISION221' : 'vision221'
    copyToClipboard(codeToCopy)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.bg, color: C.text }}>
      <ErrorBoundary><Navbar /></ErrorBoundary>
      <main id="main-content" className="flex-1 relative z-10" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>

        {toast && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl font-bold text-sm shadow-2xl"
            style={{ backgroundColor: C.baobab, color: C.bg }}>{toast}</div>
        )}

        {/* ═══ 1. VIP PREMIUM LOCKED CARD ═══ */}
        <section className="relative pt-8 pb-6 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse 50% 40% at 50% 0%, ${C.gold}12, transparent 70%)`,
          }} />

          <div className="relative max-w-[400px] mx-auto px-4">
            {/* Header — VIP Analysis */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] mb-3"
                style={{ backgroundColor: `${C.gold}1A`, color: C.gold, border: `1px solid ${C.gold}40` }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.gold }} />
                {vipCopy.access}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight" style={{ fontFamily: 'Poppins, sans-serif', color: C.text }}>
                {vipCopy.title}
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: C.gold }}>
                {vipCopy.subtitle}
              </p>
              <p className="text-[11px] mt-2" style={{ color: C.textSec }}>
                {vipCount != null ? `${vipCount} ${vipCopy.published}` : vipCopy.published}
                {generationDate ? ` · mise à jour ${generationDate}` : ''}
              </p>
              <p className="max-w-[340px] mx-auto text-xs leading-relaxed mt-3" style={{ color: C.textSec }}>
                {vipCopy.description}
              </p>
              <div className="vip-command-status mt-4" aria-label="État du centre d’analyse VIP">
                <div className="vip-command-status__top">
                  <span className="inline-flex items-center gap-2"><span className="vip-status-dot" aria-hidden="true" /> {vipCopy.desk}</span>
                  <span>{vipCopy.secure}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-left">
                <div className="vip-telemetry-module rounded-xl px-2 py-2" style={{ backgroundColor: `${C.gold}0D`, border: `1px solid ${C.gold}30` }}>
                  <div className="text-[10px] font-black" style={{ color: C.gold }}>01</div>
                  <div className="text-[9px] mt-1" style={{ color: C.textSec }}>{vipCopy.selections}</div>
                </div>
                <div className="vip-telemetry-module rounded-xl px-2 py-2" style={{ backgroundColor: `${C.success}0D`, border: `1px solid ${C.success}30` }}>
                  <div className="text-[10px] font-black" style={{ color: C.success }}>02</div>
                  <div className="text-[9px] mt-1" style={{ color: C.textSec }}>{vipCopy.context}</div>
                </div>
                <div className="vip-telemetry-module rounded-xl px-2 py-2" style={{ backgroundColor: `${C.data}0D`, border: `1px solid ${C.data}30` }}>
                  <div className="text-[10px] font-black" style={{ color: C.data }}>03</div>
                  <div className="text-[9px] mt-1" style={{ color: C.textSec }}>{vipCopy.history}</div>
                </div>
                </div>
              </div>
            </div>

            {/* ═══ VERIFIED DAILY COMBOS ═══ */}
            <section className="mb-5 rounded-2xl p-3" style={{ backgroundColor: `${C.surface}CC`, border: `1px solid ${C.gold}35` }} aria-label="Combinés VIP du jour">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: C.gold }}>{vipCopy.combo2} · {vipCopy.combo5}</div>
                  <div className="text-[9px] mt-1" style={{ color: C.textSec }}>{vipCopy.comboSource}</div>
                </div>
                {vipCombos?.fetchedAt && <span className="text-[8px]" style={{ color: C.textSec }}>{vipCopy.comboUpdated} {new Date(vipCombos.fetchedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Dakar' })}</span>}
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {([['target2', vipCopy.combo2], ['target5', vipCopy.combo5]] as const).map(([key, label]) => {
                  const combo = vipCombos?.[key]
                  return <div key={key} className="rounded-xl p-3 relative overflow-hidden" style={{ backgroundColor: C.bg, border: `1px solid ${C.border}` }}>
                    <div className="flex items-center justify-between mb-2"><span className="text-[10px] font-black uppercase" style={{ color: C.gold }}>{label}</span>{combo && <strong style={{ color: C.success }}>@{combo.totalOdds.toFixed(2)}</strong>}</div>
                    {combo ? <>
                      <div className="text-[9px] mb-2" style={{ color: C.textSec }}>{combo.legs.length} sélections vérifiées · détails protégés</div>
                      <div className="relative rounded-lg p-2" style={{ border: `1px solid ${C.border}`, minHeight: 54 }}>
                        <div className="space-y-1" style={{ filter: 'blur(5px)', opacity: 0.55, userSelect: 'none' }} aria-hidden="true">
                          {combo.legs.map((leg, index) => <div key={`${leg.eventId || index}-${leg.selection}`} className="text-[9px]" style={{ color: C.textSec }}>{leg.home} — {leg.away} · {leg.selection} @{leg.odds.toFixed(2)}</div>)}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center gap-1.5" style={{ backgroundColor: 'rgba(7,16,24,0.62)' }}>
                          <span aria-hidden="true" style={{ color: C.gold }}>▣</span><span className="text-[8px] font-black uppercase tracking-wider" style={{ color: C.gold }}>VIP · Débloquer les matchs</span>
                        </div>
                      </div>
                    </> : <div className="text-[9px]" style={{ color: C.textSec }}>{vipCopy.comboUnavailable}</div>}
                  </div>
                })}
              </div>
            </section>

            {/* ═══ PREMIUM LOCKED CARD ═══ */}
            <div className="vip-3d-card relative rounded-[16px] overflow-hidden" style={{
              background: `linear-gradient(145deg, ${C.surface} 0%, ${C.bg} 100%)`,
              border: `1px solid ${C.gold}25`,
              boxShadow: `0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 ${C.gold}15`,
            }}>
              {/* Top accent */}
              <div className="h-[2px] w-full" style={{
                background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
              }} />

              <div className="vip-terminal-bar">
                <div className="flex items-center gap-2">
                  <span className="vip-terminal-bar__icon" aria-hidden="true">⌁</span>
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-[0.18em]" style={{ color: C.text }}>{vipCopy.locked}</div>
                    <div className="text-[8px] uppercase tracking-[0.12em] mt-0.5" style={{ color: C.textSec }}>{vipCopy.preview}</div>
                  </div>
                </div>
                <span className="vip-terminal-bar__signal">{vipCopy.encrypted}</span>
              </div>

              {/* Match cards — rendered from real predictions.json data only */}
              <div className="p-3 space-y-2">
                {previewMatches.length === 0 && (
                  <div className="relative rounded-[12px] overflow-hidden" style={{
                    backgroundColor: C.bg,
                    border: `1px solid ${C.border}`,
                  }}>
                    <div className="px-3 py-6 text-center">
                      <span className="text-[10px] uppercase tracking-wider" style={{ color: C.textSec }}>
                        {vipCopy.unavailable}
                      </span>
                    </div>
                  </div>
                )}
                {previewMatches.map((m, i) => (
                  <div key={i} className="relative rounded-[12px] overflow-hidden" style={{
                    backgroundColor: C.bg,
                    border: `1px solid ${C.border}`,
                  }}>
                    {/* Match header */}
                    <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: `1px solid ${C.border}` }}>
                      <span className="text-[9px] uppercase tracking-wider font-bold" style={{ color: C.textSec }}>{m.league}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono" style={{ color: C.textSec }}>{m.time}</span>
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase" style={{ backgroundColor: `${C.gold}15`, color: C.gold }}>VIP</span>
                      </div>
                    </div>

                    {/* Teams */}
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                        <TeamLogoMini src={m.homeLogo} name={m.home} initial={m.homeInitial} />
                        <span className="text-[11px] font-bold text-center truncate w-full" style={{ color: C.text }}>{m.home}</span>
                      </div>
                      <div className="flex flex-col items-center px-2 flex-shrink-0">
                        <span className="text-[10px] font-black" style={{ color: C.gold }}>VS</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                        <TeamLogoMini src={m.awayLogo} name={m.away} initial={m.awayInitial} />
                        <span className="text-[11px] font-bold text-center truncate w-full" style={{ color: C.text }}>{m.away}</span>
                      </div>
                    </div>

                    {/* ═══ LOCKED: AI Score + Markets — blurred, neutral placeholders ═══ */}
                    {/* No real VIP prediction values are exposed in the DOM before unlock. */}
                    {/* No fabricated numbers either — only neutral placeholders (••, ••%, •.••). */}
                    <div className="relative px-3 pb-3" style={{ borderTop: `1px solid ${C.border}` }}>
                      <div style={{ filter: 'blur(7px)', opacity: 0.6, pointerEvents: 'none', userSelect: 'none' }}>
                        {/* AI Exact Score — neutral placeholder */}
                        <div className="text-center py-2">
                          <div className="text-[8px] uppercase tracking-widest font-bold mb-1" style={{ color: C.textSec }}>AI Exact Score</div>
                          <div className="text-2xl font-black font-mono" style={{ color: C.gold }}>• — •</div>
                        </div>
                        {/* Probability row — neutral placeholders */}
                        <div className="grid grid-cols-3 gap-1.5">
                          <div className="text-center rounded p-1.5" style={{ backgroundColor: `${C.success}10` }}>
                            <div className="text-[7px] uppercase" style={{ color: C.textSec }}>BTTS</div>
                            <div className="text-[11px] font-black" style={{ color: C.success }}>••%</div>
                          </div>
                          <div className="text-center rounded p-1.5" style={{ backgroundColor: `${C.warning}10` }}>
                            <div className="text-[7px] uppercase" style={{ color: C.textSec }}>Over 2.5</div>
                            <div className="text-[11px] font-black" style={{ color: C.warning }}>••%</div>
                          </div>
                          <div className="text-center rounded p-1.5" style={{ backgroundColor: `${C.data}10` }}>
                            <div className="text-[7px] uppercase" style={{ color: C.textSec }}>xG</div>
                            <div className="text-[11px] font-black" style={{ color: C.data }}>•.••</div>
                          </div>
                        </div>
                      </div>

                      {/* Lock overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ backgroundColor: 'rgba(15,23,42,0.8)' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: C.gold }}>{vipCopy.detailed}</span>
                        <span className="text-[8px]" style={{ color: C.textSec }}>{vipCopy.scoreMarkets}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Unlock CTA */}
              <div className="px-3 pb-3">
                <button
                  onClick={() => setShowModal(true)}
                  className="block w-full h-[44px] rounded-[12px] font-black text-[12px] uppercase tracking-wider transition-all hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${C.gold} 0%, ${C.gold}cc 100%)`,
                    color: C.bg,
                    boxShadow: `0 6px 20px ${C.gold}30`,
                  }} data-cta="vip-unlock-3d">
                  <span className="inline-flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    {vipCopy.unlock}
                  </span>
                </button>
                <p className="text-[9px] text-center mt-2" style={{ color: C.textSec }}>
                  {vipCopy.accessNote}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 2. VALEUR VIP — bénéfices réels, sans promesse de performance ═══ */}
        <section className="max-w-md mx-auto px-4 pb-5" aria-labelledby="vip-benefits-title">
          <div className="vip-3d-card rounded-2xl p-4" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                    <p className="text-[9px] uppercase tracking-[0.22em] font-bold" style={{ color: C.gold }}>{vipCopy.benefits}</p>
                <h2 id="vip-benefits-title" className="text-sm font-black mt-1" style={{ color: C.text }}>{vipCopy.benefitTitle}</h2>
              </div>
              <span className="rounded-full px-2 py-1 text-[9px] font-bold" style={{ color: C.success, backgroundColor: `${C.success}12`, border: `1px solid ${C.success}35` }}>18+</span>
            </div>
            <div className="vip-benefit-grid grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="vip-3d-card vip-3d-card--gold rounded-xl p-3" style={{ backgroundColor: C.bg }}>
                <div className="text-xs font-black" style={{ color: C.gold }}>BTTS</div>
                  <p className="text-[10px] leading-relaxed mt-1" style={{ color: C.textSec }}>{lang === 'fr' ? 'Lecture du marché et contexte du match.' : lang === 'en' ? 'Market view and match context.' : 'قراءة السوق وسياق المباراة.'}</p>
              </div>
              <div className="vip-3d-card vip-3d-card--success rounded-xl p-3" style={{ backgroundColor: C.bg }}>
                <div className="text-xs font-black" style={{ color: C.success }}>O2.5</div>
                  <p className="text-[10px] leading-relaxed mt-1" style={{ color: C.textSec }}>{lang === 'fr' ? 'Indicateurs complémentaires affichés clairement.' : lang === 'en' ? 'Additional indicators displayed clearly.' : 'مؤشرات إضافية معروضة بوضوح.'}</p>
              </div>
              <div className="vip-3d-card vip-3d-card--data rounded-xl p-3" style={{ backgroundColor: C.bg }}>
                <div className="text-xs font-black" style={{ color: C.data }}>SCORE</div>
                  <p className="text-[10px] leading-relaxed mt-1" style={{ color: C.textSec }}>{lang === 'fr' ? 'Projection exacte présentée comme une estimation.' : lang === 'en' ? 'Exact-score projection presented as an estimate.' : 'توقع النتيجة الدقيقة مقدم كتقدير.'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 3. SÉLECTEUR BOOKMAKER — couleurs de marque ═══ */}
        <section className="max-w-md mx-auto px-4 pb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2 text-center" style={{ color: C.textMute }}>
            {vipCopy.choose}
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {/* Linebet — VERT CLAIR */}
            <button onClick={() => selectBookmaker('linebet')} aria-pressed={bookmaker === 'linebet'}
              className="relative py-2.5 rounded-xl text-[12px] font-bold transition-all overflow-hidden"
              style={{
                backgroundColor: bookmaker === 'linebet' ? BRAND.linebet.primary : 'transparent',
                color: bookmaker === 'linebet' ? C.bg : BRAND.linebet.primary,
                border: `1px solid ${bookmaker === 'linebet' ? BRAND.linebet.primary : C.border}`,
                boxShadow: bookmaker === 'linebet' ? `0 4px 16px ${BRAND.linebet.primaryGlow}` : 'none',
              }}>
              <span className="inline-flex items-center gap-2">
                <span className="flex h-5 w-8 items-center justify-center rounded bg-white px-1"><img src="/logos/linebet-provided.jpg" alt="Logo Linebet" className="max-h-4 w-auto object-contain" width={1280} height={465} /></span>
                Linebet
              </span>
              {bookmaker === 'linebet' && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.bg }} />
              )}
            </button>
            {/* 888Starz — ROUGE CLAIR */}
            <button onClick={() => selectBookmaker('888starz')} aria-pressed={bookmaker === '888starz'}
              className="relative py-2.5 rounded-xl text-[12px] font-bold transition-all overflow-hidden"
              style={{
                backgroundColor: bookmaker === '888starz' ? BRAND.star888.primary : 'transparent',
                color: bookmaker === '888starz' ? C.bg : BRAND.star888.primary,
                border: `1px solid ${bookmaker === '888starz' ? BRAND.star888.primary : C.border}`,
                boxShadow: bookmaker === '888starz' ? `0 4px 16px ${BRAND.star888.primaryGlow}` : 'none',
              }}>
              <span className="inline-flex items-center gap-2">
                <span className="flex h-5 w-8 items-center justify-center rounded bg-white px-1"><img src="/logos/888starz-provided.webp" alt="Logo 888Starz" className="max-h-4 w-auto object-contain" width={1920} height={894} /></span>
                888Starz
              </span>
              {bookmaker === '888starz' && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.bg }} />
              )}
            </button>
          </div>
        </section>

        {/* ═══ 3. CARTE CODE PROMO — couleur bookmaker ═══ */}
        <section className="max-w-md mx-auto px-4 pb-4">
          <div className="rounded-2xl overflow-hidden" style={{
            background: `linear-gradient(135deg, ${C.surface} 0%, ${C.bg} 100%)`,
            border: `1px solid ${brandColor}40`,
            boxShadow: `0 4px 20px ${brandGlow}`,
          }}>
            <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${brandColor}, ${C.gold}, ${brandColor})` }} />

            <div className="p-4 text-center">
              <p className="text-[9px] uppercase tracking-[0.25em] mb-1" style={{ color: C.textMute }}>{vipCopy.partnerSelected} · {bookmaker === 'linebet' ? 'Linebet' : '888Starz'}</p>

              <button onClick={copyCode} className="inline-flex items-center gap-2 px-5 py-2 rounded-lg transition-all hover:scale-[1.02] mb-2"
                style={{ backgroundColor: `${brandColor}15`, border: `1px dashed ${brandColor}50` }}>
                <span className="text-xl font-black tracking-wider" style={{
                  color: brandColor,
                  fontFamily: 'var(--font-mono), monospace',
                  textShadow: `0 0 14px ${brandGlow}`,
                }}>
                  {code}
                </span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={copiedCode ? C.success : brandColor} strokeWidth="2.5">
                  {copiedCode ? <polyline points="20 6 9 17 4 12" /> : <rect x="9" y="9" width="13" height="13" rx="2" />}
                  {!copiedCode && <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />}
                </svg>
              </button>

                <p className="text-[10px]" style={{ color: C.textSec }}>
                <span className="font-bold" style={{ color: brandColor }}>{bonus}</span> · {vipCopy.depositNote}
              </p>
              <p className="text-[9px] leading-relaxed mt-2" style={{ color: C.textMute }}>
                {vipCopy.conditions}
              </p>

              {/* Boutons */}
              <div className="space-y-1.5 mt-3">
                <a href={inscriptionLink} target="_blank" rel="noopener noreferrer nofollow sponsored"
                  className="block w-full h-[38px] rounded-lg font-bold text-[12px] flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01]"
                  style={{ backgroundColor: brandColor, color: C.bg, boxShadow: `0 4px 14px ${brandGlow}` }} data-cta="vip-inscription">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  S&apos;inscrire sur {bookmaker === 'linebet' ? 'Linebet' : '888Starz'}
                </a>
                <a href={apkLink} target="_blank" rel="noopener noreferrer nofollow sponsored"
                  className="block w-full h-[34px] rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all"
                  style={{ backgroundColor: 'transparent', color: C.textSec, border: `1px solid ${C.border}` }} data-cta="vip-apk">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  {vipCopy.downloadApk}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 4. ÉTAPES DÉVERROUILLAGE ═══ */}
        <section className="max-w-md mx-auto px-4 pb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3 text-center" style={{ color: C.textMute }}>
            {vipCopy.steps}
          </h2>
          <div className="space-y-1.5 mb-3">
            <div className="rounded-lg p-2.5 flex items-center gap-3" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0" style={{ backgroundColor: brandColor, color: C.bg }}>1</span>
              <p className="text-[11px]" style={{ color: C.text }}>{vipCopy.step1} <strong style={{ color: brandColor }}>{code}</strong></p>
            </div>
            <div className="rounded-lg p-2.5 flex items-center gap-3" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, color: C.textSec }}>2</span>
              <p className="text-[11px]" style={{ color: C.textSec }}>{vipCopy.step2}</p>
            </div>
            <div className="rounded-lg p-2.5 flex items-center gap-3" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, color: C.textSec }}>3</span>
              <p className="text-[11px]" style={{ color: C.textSec }}>{vipCopy.step3}</p>
            </div>
          </div>

          <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Salut BTTSPredict, code '+code+' depot 3000F. Debloquer VIP.')}`} target="_blank" rel="noopener noreferrer"
            className="block w-full h-[40px] rounded-lg font-bold text-[12px] flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            style={{ backgroundColor: C.success, color: C.bg, boxShadow: `0 4px 14px ${C.success}30` }} data-cta="vip-whatsapp">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            {vipCopy.verify}
          </a>
        </section>

        {/* ═══ FOOTER LÉGAL ═══ */}
        <section className="max-w-md mx-auto px-4 pb-10">
          <div className="rounded-lg p-2.5 text-center" style={{ backgroundColor: 'rgba(255,209,102,0.06)', border: '1px solid rgba(255,209,102,0.15)' }}>
            <p className="text-[10px]" style={{ color: C.textMute }}>
              {t.legal.eighteen} · {t.legal.noGuarantee} · {t.legal.affiliation} ·{' '}
              <a href="/jouer-responsable" className="underline" style={{ color: C.warning }}>{t.legal.responsible}</a>
            </p>
          </div>
        </section>

        <ErrorBoundary><Footer /></ErrorBoundary>
      </main>

      {/* ═══ MODAL DE DÉVERROUILLAGE (instructions + vérificateur ID) ═══ */}
      <ErrorBoundary>
        <VipUnlockModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </ErrorBoundary>
    </div>
  )
}

// ─── Team logo mini ───
function TeamLogoMini({ src, name, initial }: { src?: string; name: string; initial: string }) {
  const [err, setErr] = useState(false)
  if (!src || err) {
    return (
      <span
        className="w-7 h-7 flex items-center justify-center text-[11px] font-black rounded flex-shrink-0"
        style={{ backgroundColor: '#5D7880', color: '#B8FF1A' }}
        aria-label={name}
        title={name}
      >
        {initial}
      </span>
    )
  }
  return (
    <img
      src={src}
      alt={`Logo ${name}`}
      className="w-7 h-7 object-contain flex-shrink-0 rounded"
      width={28}
      height={28}
      loading="lazy"
      decoding="async"
      onError={() => setErr(true)}
    />
  )
}
