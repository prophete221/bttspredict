'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from './LanguageSwitcher'
import { translationsFor, type Locale, localizedPath } from '@/lib/i18n'
import { AFFILIATE, BOOKMAKERS } from '@/lib/constants'
import { trackAffiliateAction, trackAffiliateCodeCopy } from '@/lib/affiliateTracking'
import { copyTextToClipboard } from '@/lib/clipboard'

type PartnerCodeId = (typeof BOOKMAKERS)[number]['id']
const codeForPartner = (id: PartnerCodeId) => BOOKMAKERS.find((bookmaker) => bookmaker.id === id)?.promoCode ?? ''

/* ═══════════════════════════════════════════════════════════════════
   MethodSection — 4 étapes, éditorial court en 2 colonnes.
   ═══════════════════════════════════════════════════════════════════ */
export function MethodSection({ initialLocale }: { initialLocale?: Locale } = {}) {
  const { lang: detectedLang } = useLanguage()
  const lang = initialLocale ?? detectedLang
  const t = translationsFor(lang)

  const steps = [
    { n: '01', title: t.home2.met1T, text: t.home2.met1D },
    { n: '02', title: t.home2.met2T, text: t.home2.met2D },
    { n: '03', title: t.home2.met3T, text: t.home2.met3D },
    { n: '04', title: t.home2.met4T, text: t.home2.met4D },
  ]

  return (
    <section id="methode" className="hp-section" style={{ scrollMarginTop: '72px' }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="hp-method">
          <div className="hp-method__intro">
            <h2 className="hp-sect-title">{t.home2.metTitle}</h2>
            <p className="hp-method__note">{t.home2.metNote}</p>
            <a href={localizedPath('/methodologie', lang)} className="hp-btn-ghost hp-btn-ghost--sm" data-cta="method-full">
              {t.home2.metCta}
              <span aria-hidden="true">→</span>
            </a>
          </div>
          <ol className="hp-method__steps">
            {steps.map(s => (
              <li key={s.n} className="hp-method__step">
                <span className="hp-method__num" aria-hidden="true">{s.n}</span>
                <div>
                  <p className="hp-method__step-title">{s.title}</p>
                  <p className="hp-method__step-text">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   LeagueCoverage — uniquement les compétitions réellement présentes
   dans win-history.json (archives vérifiées) et predictions.json (jour).
   Clic → filtre la section Matchs (événement interne) + scroll #matchs.
   Aucune ligue vide, aucune page inventée.
   ═══════════════════════════════════════════════════════════════════ */
export function LeagueCoverage({ initialLocale }: { initialLocale?: Locale } = {}) {
  const { lang: detectedLang } = useLanguage()
  const lang = initialLocale ?? detectedLang
  const t = translationsFor(lang)
  const [tracked, setTracked] = useState<Map<string, number>>(new Map())
  const [today, setToday] = useState<Set<string>>(new Set())

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch('/win-history.json').then(r => (r.ok ? r.json() : null)).catch(() => null),
      fetch('/predictions.json').then(r => (r.ok ? r.json() : null)).catch(() => null),
    ]).then(([hist, pred]) => {
      if (cancelled) return
      const map = new Map<string, number>()
      for (const rec of (hist?.history || []) as { league?: string }[]) {
        if (rec.league) map.set(rec.league, (map.get(rec.league) || 0) + 1)
      }
      setTracked(map)
      const todaySet = new Set<string>()
      for (const m of (pred?.free || []) as { league?: string; date?: string }[]) {
        if (m.league && m.date === String(pred?.date || '')) todaySet.add(m.league)
        else if (m.league) todaySet.add(m.league)
      }
      setToday(todaySet)
    })
    return () => { cancelled = true }
  }, [])

  const leagues = useMemo(
    () => Array.from(tracked.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8),
    [tracked],
  )

  const selectLeague = (name: string) => {
    window.dispatchEvent(new CustomEvent('bttspredict:league', { detail: name }))
  }

  if (leagues.length === 0) return null

  return (
    <section className="hp-section hp-section--tint" aria-label={t.home2.lgTitle}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="hp-sect-head">
          <div>
            <h2 className="hp-sect-title">{t.home2.lgTitle}</h2>
            <p className="hp-sect-sub">{t.home2.lgSubtitle}</p>
          </div>
        </div>
        <div className="hp-leagues">
          {leagues.map(([name, count]) => (
            <a
              key={name}
              href="#matchs"
              onClick={() => selectLeague(name)}
              className="hp-league"
              data-cta={`league-${name}`}
            >
              <span className="hp-league__name">{name}</span>
              <span className="hp-league__meta">
                {count} {count === 1 ? t.home2.lgTrackedOne : t.home2.lgTracked}
                {today.has(name) && <em> · {t.home2.lgToday}</em>}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   PartnerCard — hiérarchie commerciale : 1xBet, Linebet, MelBet, 888Starz.
   Codes/liens lus depuis les constantes; conditions opérateur non garanties.
   ═══════════════════════════════════════════════════════════════════ */
export function PartnerCard({ initialLocale }: { initialLocale?: Locale } = {}) {
  const { lang: detectedLang } = useLanguage()
  const lang = initialLocale ?? detectedLang
  const pathname = usePathname()
  const showCodes = false
  const t = translationsFor(lang)
  const primaryCode = codeForPartner('1xbet')
  const linebetCode = codeForPartner('linebet')
  const melbetCode = codeForPartner('melbet')
  const star888Code = codeForPartner('888starz')
  const [copied, setCopied] = useState(false)
  const withDiscreetCode = (text: string, code: string) => {
    const index = text.indexOf(code)
    return index < 0 ? text : <>{text.slice(0, index)}<code className="promo-code-discreet" dir="ltr">{code}</code>{text.slice(index + code.length)}</>
  }

  const copyCode = async () => {
    if (!primaryCode) return
    const ok = await copyTextToClipboard(primaryCode)
    if (!ok) return
    trackAffiliateCodeCopy('1xbet', 'home-partner')
    setCopied(true)
    navigator.vibrate?.(15)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="hp-section" aria-label={t.home2.ptEyebrow}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="hp-partner">
          {/* hp-partner__intro — NE PAS nommer hp-partner__copy (réservé au bouton copier) */}
          <div className="hp-partner__intro">
            <span className="inline-flex rounded-full border border-white/15 bg-white/[.04] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-[#B9C0CA]">
              {lang === 'en' ? 'Advertisement' : lang === 'ar' ? 'إعلان' : 'Publicité'}
            </span>
            <p className="hp-eyebrow hp-eyebrow--partner">{t.home2.ptEyebrow}</p>
            <p className="hp-partner__title">
              <span className="hp-partner__brand" aria-hidden="true">1XBET</span>
              {showCodes && <code dir="ltr" style={{ textTransform: 'none' }}>{primaryCode}</code>}
            </p>
            <p className="hp-partner__text">{showCodes ? withDiscreetCode(t.home2.ptText, primaryCode) : lang === 'ar' ? 'راجع دليل الشريك للاطلاع على المعلومات والشروط الحالية.' : lang === 'fr' ? 'Consultez le guide partenaire pour connaître les informations et conditions actuelles.' : 'See the partner guide for current information and terms.'}</p>
            <p className="hp-partner__free">{t.home2.ptFree}</p>
          </div>
          <div className="hp-partner__actions">
            {showCodes && <div className="hp-partner__code">
                <code dir="ltr" style={{ textTransform: 'none' }}>{primaryCode}</code>
                <button
                  type="button"
                  onClick={copyCode}
                  className={`hp-partner__copy${copied ? ' is-copied' : ''}`}
                  aria-label={`Copier le code 1xBet ${primaryCode}`}
                  data-cta="partner-copy-vipbtts"
                >
                  {copied ? '✓' : t.hero.copy}
                </button>
              </div>}
            <div className="grid gap-2 w-full">
              <a
                href={AFFILIATE.oneXbet}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                data-cta="partner-signup-home-1xbet"
                onClick={() => trackAffiliateAction('1xbet', 'signup_cta_click', 'home-partner-1xbet')}
                className="hp-cta-primary"
              >
                <span className="grid h-7 w-7 place-items-center rounded bg-white p-0.5"><img src="/logos/1xbet-logo.png" alt="" width="24" height="24" className="h-6 w-6 object-contain" /></span>
                {showCodes ? withDiscreetCode(t.home2.ptCta, primaryCode) : lang === 'ar' ? 'زيارة 1xBet' : lang === 'fr' ? 'Consulter 1xBet' : 'Visit 1xBet'}
                <span aria-hidden="true">→</span>
              </a>
              <a
                href={AFFILIATE.linebet}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                onClick={() => trackAffiliateAction('linebet', 'signup_cta_click', 'home-partner-linebet')}
                data-cta="home-partner-linebet-signup"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-bold transition-all"
                style={{
                  background: 'linear-gradient(135deg, #1B6EF3 0%, #2F7DFF 100%)',
                  color: '#FFFFFF',
                  boxShadow: '0 10px 28px rgba(27, 110, 243, 0.35)',
                }}
              >
                <span className="grid h-7 w-7 place-items-center rounded bg-white p-0.5"><img src="/logos/linebet-logo.jpg" alt="" width="24" height="24" className="h-6 w-6 object-contain" /></span>
                {showCodes ? (lang === 'fr' ? <>Linebet · code <code className="promo-code-discreet" dir="ltr">{linebetCode}</code></> : lang === 'en' ? <>Linebet · code <code className="promo-code-discreet" dir="ltr">{linebetCode}</code></> : <>Linebet · <code className="promo-code-discreet" dir="ltr">{linebetCode}</code></>) : lang === 'ar' ? 'زيارة Linebet' : lang === 'fr' ? 'Consulter Linebet' : 'Visit Linebet'}
                <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <a
                href={AFFILIATE.melbet}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                onClick={() => trackAffiliateAction('melbet', 'signup_cta_click', 'home-partner-melbet')}
                data-cta="home-partner-melbet-signup"
                className="flex min-h-10 items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/[0.025] px-2 py-2 text-center text-xs font-semibold text-[#AEB9B5]"
              >
                <span className="grid h-6 w-6 place-items-center rounded bg-white p-0.5"><img src="/logos/melbet-logo.jpg" alt="" width="20" height="20" className="h-5 w-5 object-contain" /></span>
                MelBet{showCodes && <> <code dir="ltr" style={{ fontFamily: 'ui-monospace, monospace', textTransform: 'none' }}>{melbetCode}</code></>}
              </a>
              <a
                href={AFFILIATE.star888}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                onClick={() => trackAffiliateAction('888starz', 'signup_cta_click', 'home-partner-888starz')}
                data-cta="home-partner-888starz-signup"
                className="flex min-h-10 items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/[0.025] px-2 py-2 text-center text-xs font-semibold text-[#AEB9B5]"
              >
                <span className="grid h-6 w-6 place-items-center rounded bg-white p-0.5"><img src="/logos/888starz-logo.jpg" alt="" width="20" height="20" className="h-5 w-5 object-contain" /></span>
                888Starz{showCodes && <> <code dir="ltr" style={{ fontFamily: 'ui-monospace, monospace', textTransform: 'none' }}>{star888Code}</code></>}
              </a>
            </div>
            <p className="hp-partner__mentions">{t.home2.ptMentions}</p>
            <a
              href={localizedPath('/code-promo-1xbet', lang)}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold underline decoration-dotted transition-colors"
              style={{ color: '#9CC6FF' }}
              data-cta="home-partner-1xbet-link"
            >
              {showCodes
                ? lang === 'fr'
                  ? <>Guide code promo 1xBet (<code className="promo-code-discreet" dir="ltr">vipbtts</code>)</>
                  : lang === 'en'
                    ? <>1xBet promo code guide (<code className="promo-code-discreet" dir="ltr">vipbtts</code>)</>
                    : <>دليل رمز 1xBet (<code className="promo-code-discreet" dir="ltr">vipbtts</code>)</>
                : lang === 'fr' ? 'Guide promo 1xBet' : lang === 'ar' ? 'دليل 1xBet' : '1xBet guide'}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
