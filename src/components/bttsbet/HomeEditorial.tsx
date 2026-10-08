'use client'

import { useEffect, useMemo, useState } from 'react'
import { useLanguage } from './LanguageSwitcher'
import { translationsFor, type Locale, localizedPath } from '@/lib/i18n'
import { SITE, AFFILIATE } from '@/lib/constants'
import { trackAffiliateAction, trackAffiliateCodeCopy } from '@/lib/affiliateTracking'
import MovingGradientButton from './MovingGradientButton'

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
   PartnerCard — bloc partenaire Linebet, séparé du produit.
   Ton neutre : code VISION221 inchangé, lien affilié inchangé
   (AffiliateSignupCta), mentions 18+ complètes, aucune pression.
   ═══════════════════════════════════════════════════════════════════ */
export function PartnerCard({ initialLocale }: { initialLocale?: Locale } = {}) {
  const { lang: detectedLang } = useLanguage()
  const lang = initialLocale ?? detectedLang
  const t = translationsFor(lang)
  const [copied, setCopied] = useState(false)

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(SITE.promoCode)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = SITE.promoCode
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    trackAffiliateCodeCopy('linebet', 'home-partner')
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
            <p className="hp-eyebrow hp-eyebrow--partner">{t.home2.ptEyebrow}</p>
            <p className="hp-partner__title">
              <span className="hp-partner__brand" aria-hidden="true">LINEBET</span>
              {SITE.promoCode}
            </p>
            <p className="hp-partner__text">{t.home2.ptText}</p>
            <p className="hp-partner__free">{t.home2.ptFree}</p>
          </div>
          <div className="hp-partner__actions">
            <div className="hp-partner__code">
              <code>{SITE.promoCode}</code>
              <button
                type="button"
                onClick={copyCode}
                className={`hp-partner__copy${copied ? ' is-copied' : ''}`}
                aria-label={`Copier ${SITE.promoCode}`}
                data-cta="partner-copy-vision221"
              >
                {copied ? '✓' : t.hero.copy}
              </button>
            </div>
            <MovingGradientButton
              href={AFFILIATE.linebet}
              external
              rel="sponsored nofollow noopener noreferrer"
              dataCta="partner-signup-home"
              onClick={() => trackAffiliateAction('linebet', 'signup_cta_click', 'home-partner')}
            >
              {t.home2.ptCta}
              <span className="hp-btn-arrow" aria-hidden="true">→</span>
            </MovingGradientButton>
            <p className="hp-partner__mentions">{t.home2.ptMentions}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
