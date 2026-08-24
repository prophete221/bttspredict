'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { AFFILIATE } from '@/lib/constants'
import { useLanguage } from '@/components/bttsbet/LanguageSwitcher'
import { translationsFor, type Locale } from '@/lib/i18n'
import { trackAffiliateAction, trackAffiliateCodeCopy } from '@/lib/affiliateTracking'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const ErrorBoundary = dynamic(() => import('@/components/bttsbet/ErrorBoundary'), { loading: () => null })
const VipUnlockModal = dynamic(() => import('@/components/bttsbet/VipUnlockModal'), { loading: () => null })

const BRAND = {
  linebet: { accent: '#B8FF1A', soft: 'rgba(184,255,26,0.12)', label: 'Linebet', code: 'VISION221' },
  '888starz': { accent: '#FF7B7B', soft: 'rgba(255,123,123,0.12)', label: '888Starz', code: 'btts221' },
} as const

type Bookmaker = keyof typeof BRAND

type ComboLeg = {
  eventId: string
  home: string
  away: string
  league: string
  kickoff: string
  bookmaker?: string
  market?: string
  selection?: string
  odds?: number
}

type VipCombo = {
  legs: ComboLeg[]
  totalOdds?: number | null
}

type PredictionFixture = {
  id?: string
  home?: string
  away?: string
  league?: string
  date?: string
  time?: string
  kickoff?: string
}

function dakarDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Dakar',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

function formatKickoff(value: string, lang: Locale) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar' : lang === 'en' ? 'en-GB' : 'fr-FR', {
    timeZone: 'Africa/Dakar',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function hasFutureLegs(combo?: VipCombo | null): combo is VipCombo {
  if (!combo?.legs?.length) return false
  return combo.legs.every((leg) => {
    const kickoff = Date.parse(leg.kickoff)
    return Number.isFinite(kickoff) && kickoff > Date.now()
  })
}

function fixtureKickoff(fixture: PredictionFixture) {
  const raw = fixture.kickoff || (fixture.date && fixture.time ? `${fixture.date}T${fixture.time}:00Z` : '')
  const timestamp = Date.parse(raw)
  return { raw, timestamp }
}

function buildMatchOnlyCombos(payload: { free?: PredictionFixture[]; vipPreview?: PredictionFixture[]; predictions?: PredictionFixture[] } | null) {
  const rows = [...(payload?.free || []), ...(payload?.vipPreview || []), ...(payload?.predictions || [])]
  const seen = new Set<string>()
  const fixtures = rows.filter((fixture) => {
    const home = fixture.home?.trim()
    const away = fixture.away?.trim()
    const { timestamp } = fixtureKickoff(fixture)
    if (!home || !away || !Number.isFinite(timestamp) || timestamp <= Date.now()) return false
    const key = `${home.toLowerCase()}|${away.toLowerCase()}|${timestamp}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  const toCombo = (target: 3 | 5): VipCombo | null => {
    const selected = fixtures.slice(0, target)
    if (selected.length < target) return null
    return {
      totalOdds: null,
      legs: selected.map((fixture, index) => {
        const { raw } = fixtureKickoff(fixture)
        return {
          eventId: fixture.id || `fixture-${target}-${index}-${raw}`,
          home: fixture.home!.trim(),
          away: fixture.away!.trim(),
          league: fixture.league?.trim() || 'Football',
          kickoff: raw,
        }
      }),
    }
  }
  return { target3: toCombo(3), target5: toCombo(5) }
}

const copy = {
  fr: {
    eyebrow: 'ACCÈS PRIVÉ · VIP',
    title: 'Débloque ton espace VIP',
    intro: 'Un seul parcours. Choisis ton bookmaker, utilise le code affiché, puis envoie ton ID joueur pour demander l’accès.',
    primary: 'Débloquer le combiné VIP',
    partner: '1. Choisis ton bookmaker',
    codeLabel: 'Ton code est copié automatiquement',
    copy: 'Copier',
    copied: 'Copié',
    signup: 'S’inscrire sur',
    download: 'Télécharger l’application',
    stepTwo: '2. Inscris-toi avec le code et effectue le dépôt demandé par le partenaire',
    stepThree: '3. Ouvre le déblocage, saisis ton ID joueur et envoie la demande sur WhatsApp',
    privacy: 'Ton ID reste dans le message WhatsApp que tu choisis d’envoyer. BTTSPredict ne le reçoit pas.',
    responsible: '18+ · Aucun gain n’est garanti. Vérifie toujours les conditions du partenaire.',
    modalTitle: 'Prépare ta demande VIP',
    linebetCode: 'Code VISION221',
    star888Code: 'Code btts221',
    selected: 'Sélectionné',
    unlock: 'Débloquer avec WhatsApp',
    combosEyebrow: 'SÉLECTIONS DU JOUR · VIP',
    combosTitle: 'Combiné VIP du jour',
    combosIntro: 'Les matchs sont visibles. Le marché et la sélection du combiné restent verrouillés jusqu’à ta demande VIP.',
    combo2: 'Combiné VIP du jour',
    combo5: 'Combiné VIP · 5 matchs',
    comboVipToday: 'Combiné VIP du jour',
    combo5MatchOnly: 'Combiné VIP · 5 matchs',
    matchOnlyBadge: 'VIP',
    matchOnlySource: 'Combiné VIP du jour · contenu protégé jusqu’au déblocage',
    totalOdds: 'Cote totale',
    kickoff: 'Coup d’envoi',
    locked: 'Marchés verrouillés',
    unavailable: 'Le combiné VIP du jour sera disponible après la prochaine mise à jour.',
    dataFreshness: 'Données horodatées depuis la source de cotes partenaire',
  },
  en: {
    eyebrow: 'PRIVATE ACCESS · VIP',
    title: 'Unlock your VIP access',
    intro: 'One clear path. Choose your bookmaker, use the displayed code, then send your player ID to request access.',
    primary: 'Unlock VIP combo',
    partner: '1. Choose your bookmaker',
    codeLabel: 'Your code is copied automatically',
    copy: 'Copy',
    copied: 'Copied',
    signup: 'Sign up on',
    download: 'Download the app',
    stepTwo: '2. Register with the code and make the deposit requested by the partner',
    stepThree: '3. Open the unlock flow, enter your player ID and send the request on WhatsApp',
    privacy: 'Your ID stays in the WhatsApp message you choose to send. BTTSPredict does not receive it.',
    responsible: '18+ · No profit is guaranteed. Always check the partner’s terms.',
    modalTitle: 'Prepare your VIP request',
    linebetCode: 'Code VISION221',
    star888Code: 'Code btts221',
    selected: 'Selected',
    unlock: 'Unlock with WhatsApp',
    combosEyebrow: 'TODAY’S PICKS · VIP',
    combosTitle: "Today's VIP combo",
    combosIntro: 'Matches stay visible. The combo market and selection remain locked until you request VIP access.',
    combo2: 'Today’s VIP combo',
    combo5: 'VIP combo · 5 matches',
    comboVipToday: 'Today’s VIP combo',
    combo5MatchOnly: 'VIP combo · 5 matches',
    matchOnlyBadge: 'VIP',
    matchOnlySource: "Today's VIP combo · content protected until unlock",
    totalOdds: 'Total odds',
    kickoff: 'Kick-off',
    locked: 'Markets locked',
    unavailable: "Today's VIP combo will be available after the next update.",
    dataFreshness: 'Timestamped data from the partner odds source',
  },
  ar: {
    eyebrow: 'وصول خاص · VIP',
    title: 'افتح وصولك إلى VIP',
    intro: 'مسار واضح واحد. اختر شركة المراهنات، استخدم الرمز الظاهر، ثم أرسل معرف اللاعب لطلب الوصول.',
    primary: 'فتح المركب VIP',
    partner: '1. اختر شركة المراهنات',
    codeLabel: 'يتم نسخ الرمز تلقائياً',
    copy: 'نسخ',
    copied: 'تم النسخ',
    signup: 'التسجيل في',
    download: 'تحميل التطبيق',
    stepTwo: '2. سجّل بالرمز وأجرِ الإيداع الذي تحدده الشركة',
    stepThree: '3. افتح مسار التحقق، أدخل معرف اللاعب وأرسل الطلب عبر واتساب',
    privacy: 'يبقى معرفك داخل رسالة واتساب التي تختار إرسالها. لا تستلمه BTTSPredict.',
    responsible: '18+ · لا يوجد ربح مضمون. تحقق دائماً من شروط الشريك.',
    modalTitle: 'جهّز طلب VIP',
    linebetCode: 'الرمز VISION221',
    star888Code: 'الرمز btts221',
    selected: 'محدد',
    unlock: 'فتح عبر واتساب',
    combosEyebrow: 'اختيارات اليوم · VIP',
    combosTitle: 'المركب VIP لليوم',
    combosIntro: 'المباريات ظاهرة. يبقى سوق الاختيار المركب والاختيار نفسه مقفلين حتى تطلب وصول VIP.',
    combo2: 'المركب VIP لليوم',
    combo5: 'المركب VIP · 5 مباريات',
    comboVipToday: 'المركب VIP لليوم',
    combo5MatchOnly: 'المركب VIP · 5 مباريات',
    matchOnlyBadge: 'VIP',
    matchOnlySource: 'المركب VIP لليوم · المحتوى محمي حتى الفتح',
    totalOdds: 'المعامل الإجمالي',
    kickoff: 'موعد البداية',
    locked: 'الأسواق مقفلة',
    unavailable: 'سيكون المركب VIP لليوم متاحاً بعد التحديث القادم.',
    dataFreshness: 'بيانات مؤرخة من مصدر معاملات الشريك',
  },
} as const

export default function VipPage({ initialLocale }: { initialLocale?: Locale } = {}) {
  const { lang: detectedLang } = useLanguage()
  const lang = initialLocale ?? detectedLang
  const t = translationsFor(lang)
  const text = copy[lang]
  const [bookmaker, setBookmaker] = useState<Bookmaker>('linebet')
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [matchOnlyCombos, setMatchOnlyCombos] = useState<{ target3: VipCombo | null; target5: VipCombo | null } | null>(null)

  const selected = BRAND[bookmaker]
  const signupLink = bookmaker === 'linebet' ? AFFILIATE.linebet : AFFILIATE.star888
  const downloadLink = bookmaker === 'linebet' ? AFFILIATE.linebetDownload : AFFILIATE.star888Download
  const code = selected.code
  const today = dakarDate()
  const availableCombos = [
    hasFutureLegs(matchOnlyCombos?.target3)
      ? { key: 'target3' as const, combo: matchOnlyCombos.target3, title: `${text.comboVipToday} — ${today}` }
      : null,
    hasFutureLegs(matchOnlyCombos?.target5)
      ? { key: 'target5' as const, combo: matchOnlyCombos.target5, title: `${text.combo5MatchOnly} — ${today}` }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null)

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2200)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    let cancelled = false
    fetch('/predictions.json', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() as Promise<{ date?: string; free?: PredictionFixture[]; vipPreview?: PredictionFixture[]; predictions?: PredictionFixture[] }> : null)
      .then((payload) => {
        if (!cancelled && payload?.date === dakarDate()) setMatchOnlyCombos(buildMatchOnlyCombos(payload))
      })
      .catch(() => {
        if (!cancelled) setMatchOnlyCombos(null)
      })
    return () => { cancelled = true }
  }, [])

  const openUnlock = () => {
    trackAffiliateAction(bookmaker, 'vip_unlock_open', 'vip-access-page')
    setShowModal(true)
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = code
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      try { document.execCommand('copy') } catch {}
      document.body.removeChild(textarea)
    }
    trackAffiliateCodeCopy(bookmaker, 'vip-access-code')
    setCopied(true)
    setToast(`${code} · ${text.copied}`)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const chooseBookmaker = (next: Bookmaker) => {
    setBookmaker(next)
    setCopied(false)
    trackAffiliateAction(next, 'promo_view', 'vip-access-page')
    const nextCode = BRAND[next].code
    navigator.clipboard?.writeText(nextCode).catch(() => undefined)
    trackAffiliateCodeCopy(next, 'vip-access-auto-copy')
  }

  return (
    <div className="vip-access-page min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <ErrorBoundary><Navbar /></ErrorBoundary>

      <main id="main-content" className="vip-access-main">
        {toast && <div className="vip-access-toast" role="status">{toast}</div>}

        <section className="vip-access-hero" aria-labelledby="vip-access-title">
          <div className="vip-access-hero__glow" aria-hidden="true" />
          <div className="vip-access-shell">
            <div className="vip-access-kicker"><span aria-hidden="true" />{text.eyebrow}</div>
            <div className="vip-access-hero__grid">
              <div className="vip-access-hero__copy">
                <h1 id="vip-access-title">{text.title}</h1>
                <p>{text.intro}</p>
                <div className="vip-access-proof" aria-label="VIP access information">
                  <span><b>01</b> {t.hero.btts}</span>
                  <span><b>02</b> {t.hero.goals}</span>
                  <span><b>03</b> {t.hero.exact}</span>
                </div>
              </div>
              <div className="vip-access-hero__lock" aria-hidden="true">
                <div className="vip-access-lock-ring"><span>VIP</span></div>
                <div className="vip-access-hero__lock-line" />
                <small>18+ · VERIFIED ACCESS</small>
              </div>
            </div>
          </div>
        </section>

        <section className="vip-access-combos vip-access-shell" aria-labelledby="vip-access-combos-title">
          <div className="vip-access-combos__header">
            <div>
              <span className="vip-access-overline">{text.combosEyebrow}</span>
              <h2 id="vip-access-combos-title">{text.combosTitle}</h2>
              <p>{text.combosIntro}</p>
            </div>
            <time className="vip-access-combos__date" dateTime={today}>{today}</time>
          </div>

          {availableCombos.length > 0 ? (
            <div className="vip-access-combos__grid">
              {availableCombos.map(({ key, combo, title }) => (
                <article key={key} className={`vip-access-combo-card ${key === 'target5' ? 'is-featured' : ''}`}>
                  <header className="vip-access-combo-card__header">
                    <div>
                      <span className="vip-access-combo-card__eyebrow">{title}</span>
                      <strong className="vip-access-combo-card__odds">{text.matchOnlyBadge}</strong>
                    </div>
                    <span className="vip-access-combo-card__lock" aria-label={text.locked}>LOCK</span>
                  </header>
                  <div className="vip-access-combo-card__source">{text.matchOnlySource} · {today}</div>
                  <div className="vip-access-combo-card__legs">
                    {combo.legs.map((leg) => (
                      <div className="vip-access-combo-leg" key={`${key}-${leg.eventId}`}>
                        <div className="vip-access-combo-leg__teams">
                          <small>{leg.league}</small>
                          <strong>{leg.home} <span>vs</span> {leg.away}</strong>
                        </div>
                        <time dateTime={leg.kickoff} className="vip-access-combo-leg__time">
                          <span>{text.kickoff}</span>{formatKickoff(leg.kickoff, lang)}
                        </time>
                      </div>
                    ))}
                  </div>
                  <div className="vip-access-combo-card__locked">
                    <span className="vip-access-combo-card__locked-icon" aria-hidden="true">⌁</span>
                    <span>{text.locked}</span>
                    <button type="button" onClick={openUnlock}>{text.primary}</button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="vip-access-combos__empty" role="status">
              <span className="vip-access-combos__empty-icon" aria-hidden="true">—</span>
              <p>{text.unavailable}</p>
            </div>
          )}
        </section>
        <section className="vip-access-panel vip-access-shell" aria-labelledby="vip-access-flow-title">
          <div className="vip-access-panel__header">
            <div>
              <span className="vip-access-overline">VIP ACCESS FLOW</span>
              <h2 id="vip-access-flow-title">{text.partner}</h2>
            </div>
            <span className="vip-access-status"><i aria-hidden="true" /> {text.selected}</span>
          </div>

          <div className="vip-access-partners" role="group" aria-label={text.partner}>
            {(Object.keys(BRAND) as Bookmaker[]).map((key) => {
              const brand = BRAND[key]
              const isSelected = bookmaker === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => chooseBookmaker(key)}
                  className={`vip-access-partner ${isSelected ? 'is-selected' : ''}`}
                  style={isSelected ? { '--vip-brand': brand.accent, '--vip-brand-soft': brand.soft } as React.CSSProperties : undefined}
                  aria-pressed={isSelected}
                >
                  <span className="vip-access-partner__logo"><img src={key === 'linebet' ? '/logos/linebet-provided.jpg' : '/logos/888starz-provided.webp'} alt={`${brand.label} logo`} /></span>
                  <span className="vip-access-partner__body"><strong>{brand.label}</strong><small>{key === 'linebet' ? text.linebetCode : text.star888Code}</small></span>
                  {isSelected && <span className="vip-access-partner__check" aria-hidden="true">✓</span>}
                </button>
              )
            })}
          </div>

          <div className="vip-access-code" style={{ '--vip-brand': selected.accent, '--vip-brand-soft': selected.soft } as React.CSSProperties}>
            <div>
              <span>{text.codeLabel}</span>
              <strong>{code}</strong>
            </div>
            <button type="button" onClick={copyCode} className="vip-access-code__copy" aria-label={`${text.copy} ${code}`}>
              <span aria-hidden="true">{copied ? '✓' : '⧉'}</span>{copied ? text.copied : text.copy}
            </button>
          </div>

          <div className="vip-access-actions">
            <a
              href={signupLink}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              onClick={() => trackAffiliateAction(bookmaker, 'signup', 'vip-access-page')}
              className="vip-access-primary"
              data-cta="vip-access-signup"
            >
              {text.signup} {selected.label} <span aria-hidden="true">↗</span>
            </a>
            <a
              href={downloadLink}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              onClick={() => trackAffiliateAction(bookmaker, 'download', 'vip-access-page')}
              className="vip-access-secondary"
              data-cta="vip-access-download"
            >
              {text.download}
            </a>
          </div>

          <div className="vip-access-steps" aria-label="VIP activation steps">
            <div className="vip-access-step vip-access-step--active"><span>1</span><p>{text.partner.replace(/^\d+\.\s*/, '')}</p></div>
            <div className="vip-access-step"><span>2</span><p>{text.stepTwo.replace(/^\d+\.\s*/, '')}</p></div>
            <div className="vip-access-step"><span>3</span><p>{text.stepThree.replace(/^\d+\.\s*/, '')}</p></div>
          </div>

          <button type="button" onClick={openUnlock} className="vip-access-unlock" data-cta="vip-access-unlock">
            <span className="vip-access-unlock__icon" aria-hidden="true">⌁</span>
            <span>{text.primary}</span>
            <span aria-hidden="true">→</span>
          </button>

          <p className="vip-access-privacy">{text.privacy}</p>
          <p className="vip-access-responsible">{text.responsible}</p>
        </section>

      </main>

      <ErrorBoundary><Footer /></ErrorBoundary>

      <VipUnlockModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={text.modalTitle}
      />
    </div>
  )
}
