import React from 'react'
import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import PromoVerificationGuide from '@/components/bttsbet/PromoVerificationGuide'

const brands = [
  ['linebet', 'VISION221'],
  ['1xbet', 'vipbtts'],
  ['melbet', 'Bttswin'],
  ['888starz', 'btts221'],
] as const

const languages = ['fr', 'en', 'ar'] as const

describe('zero-click promo verification guide', () => {
  for (const [bookmaker, code] of brands) {
    for (const lang of languages) {
      it(`renders ${bookmaker}/${lang} as server-readable text with the exact code`, () => {
        const html = renderToStaticMarkup(<PromoVerificationGuide bookmaker={bookmaker} lang={lang} />)
        expect(html).toContain(`data-promo-verification="${bookmaker}-${lang}-offer"`)
        expect(html).toContain(`lang="${lang}"`)
        expect(html).toContain(`dir="${lang === 'ar' ? 'rtl' : 'ltr'}"`)
        expect(html).toContain(`<bdi dir="ltr">${code}</bdi>`)
        expect(html).toContain('<dl')
        expect(html).toContain('<ol')
        expect(html).not.toMatch(/data-promo-verification=".*-undefined/)
        expect(html).toContain(lang === 'fr' ? 'international dans les pays où le bookmaker l’accepte' : lang === 'en' ? 'international in countries where the bookmaker accepts it' : 'الرمز دولي في البلدان التي يقبله فيها المشغّل')
        expect(html).not.toMatch(/100 free spins|sans condition de mise|no wagering requirements|guaranteed bonus/i)
      })
    }
  }

  for (const lang of languages) {
    it(`gives the 888Starz code guide a different purpose in ${lang}`, () => {
      const offer = renderToStaticMarkup(<PromoVerificationGuide bookmaker="888starz" lang={lang} variant="offer" />)
      const code = renderToStaticMarkup(<PromoVerificationGuide bookmaker="888starz" lang={lang} variant="code" />)
      expect(code).not.toBe(offer)
      expect(code).toContain(`href="${lang === 'fr' ? '' : `/${lang}`}/bonus-888starz"`)
      expect(code).toContain(`data-promo-verification="888starz-${lang}-code"`)
    })
  }

  it('keeps the new help server-rendered rather than adding a client-only island', () => {
    const source = readFileSync('src/components/bttsbet/PromoVerificationGuide.tsx', 'utf8')
    expect(source).not.toMatch(/^['"]use client['"]/m)
    expect(source).not.toContain('PROMO_REVIEW_DATE')
    expect(source).not.toContain('dateModified')
  })

  it('does not add the guide to protected Linebet EN or unverified sibling locales', () => {
    const linebet = readFileSync('src/app/[locale]/code-promo-linebet-senegal/page.tsx', 'utf8')
    const xbet = readFileSync('src/app/[locale]/code-promo-1xbet/page.tsx', 'utf8')
    const main888 = readFileSync('src/app/[locale]/bonus-888starz/page.tsx', 'utf8')
    const code888 = readFileSync('src/app/[locale]/bonus-888starz-btts221/page.tsx', 'utf8')
    expect(linebet).toMatch(/lang === 'ar' && <PromoVerificationGuide/)
    expect(xbet).toMatch(/lang === 'en' && <PromoVerificationGuide/)
    expect(main888).toMatch(/lang === 'ar' && <PromoVerificationGuide/)
    expect(code888).toMatch(/lang === 'en' && <PromoVerificationGuide/)
  })

  it('targets Africa and other regions in French without inventing eligible countries', () => {
    const html = renderToStaticMarkup(<PromoVerificationGuide bookmaker="linebet" lang="fr" />)
    expect(html).toContain('Code promo Linebet VISION221 : Afrique et international')
    expect(html).toContain('d’Afrique, d’Europe et d’autres régions')
    expect(html).toContain('dans les pays où Linebet l’accepte')
    expect(html).toContain('celles fixées par Linebet pour le pays du joueur')
    expect(html).toContain('ne constituent pas une liste de pays admissibles')
    expect(html).not.toContain('VISION221 au Sénégal :')
  })

  it('targets Africa and other regions in Arabic with country eligibility determined by Linebet', () => {
    const html = renderToStaticMarkup(<PromoVerificationGuide bookmaker="linebet" lang="ar" />)
    expect(html).toContain('إفريقيا وأوروبا ومناطق أخرى')
    expect(html).toContain('البلدان التي تقبله فيها Linebet')
    expect(html).toContain('كما تحددها Linebet لبلد اللاعب')
    expect(html).toContain('ليست قائمة بالبلدان المؤهلة')
    expect(html).not.toContain('وسياق السنغال')
  })

  it('addresses observed promo-code and APK queries without presenting a free-bet promise', () => {
    const xbet = renderToStaticMarkup(<PromoVerificationGuide bookmaker="1xbet" lang="en" />)
    const melbet = renderToStaticMarkup(<PromoVerificationGuide bookmaker="melbet" lang="ar" />)
    const star = renderToStaticMarkup(<PromoVerificationGuide bookmaker="888starz" lang="ar" />)
    expect(xbet).toContain('1xBet promo code vipbtts: site, APK and bonus type')
    expect(xbet).toContain('not a verified no-deposit free bet')
    expect(melbet).toContain('برومو كود Melbet Bttswin')
    expect(melbet).toContain('وليست رهانًا مجانيًا')
    expect(star).toContain('برومو كود 888Starz btts221')
  })

  it('does not invent official verification for the four owner-supplied codes', () => {
    const html = renderToStaticMarkup(<PromoVerificationGuide bookmaker="linebet" lang="fr" />)
    expect(html).toContain('ne sont pas vérifiées ici')
    expect(html).not.toContain('code vérifié')
    expect(html).not.toContain('valide jusqu’')
    expect(html).not.toContain('sans dépôt garanti')
  })
})
