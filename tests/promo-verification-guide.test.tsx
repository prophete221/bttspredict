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

describe('promo verification guide structure and factual safeguards', () => {
  for (const [bookmaker, code] of brands) {
    for (const lang of languages) {
      it(`renders ${bookmaker}/${lang} with the exact code and correct language direction`, () => {
        const html = renderToStaticMarkup(<PromoVerificationGuide bookmaker={bookmaker} lang={lang} />)
        expect(html).toContain(`data-promo-verification="${bookmaker}-${lang}-offer"`)
        expect(html).toContain(`lang="${lang}"`)
        expect(html).toContain(`dir="${lang === 'ar' ? 'rtl' : 'ltr'}"`)
        expect(html).toContain(`<bdi dir="ltr">${code}</bdi>`)
        expect(html).toContain('<dl')
        expect(html).toContain('<ol')
        expect(html).toContain('<details open')
        expect(html).not.toMatch(/data-promo-verification=".*-undefined/)
      })
    }
  }

  for (const lang of languages) {
    it(`keeps the 888Starz code guide distinct from the offer guide in ${lang}`, () => {
      const offer = renderToStaticMarkup(<PromoVerificationGuide bookmaker="888starz" lang={lang} variant="offer" />)
      const code = renderToStaticMarkup(<PromoVerificationGuide bookmaker="888starz" lang={lang} variant="code" />)
      expect(code).not.toBe(offer)
      expect(code).toContain(`href="${lang === 'fr' ? '' : `/${lang}`}/bonus-888starz"`)
      expect(code).toContain(`data-promo-verification="888starz-${lang}-code"`)
    })
  }

  it('keeps the guide server-rendered and present on every localized promo route', () => {
    const component = readFileSync('src/components/bttsbet/PromoVerificationGuide.tsx', 'utf8')
    expect(component).not.toMatch(/^['"]use client['"]/m)

    const routes = [
      ['src/app/[locale]/code-promo-linebet-senegal/page.tsx', '<PromoVerificationGuide bookmaker="linebet" lang={lang} />'],
      ['src/app/[locale]/code-promo-1xbet/page.tsx', '<PromoVerificationGuide bookmaker="1xbet" lang={lang} />'],
      ['src/app/[locale]/code-promo-melbet/page.tsx', '<PromoVerificationGuide bookmaker="melbet" lang={lang} />'],
      ['src/app/[locale]/bonus-888starz/page.tsx', '<PromoVerificationGuide bookmaker="888starz" lang={lang} variant="offer" />'],
      ['src/app/[locale]/bonus-888starz-btts221/page.tsx', '<PromoVerificationGuide bookmaker="888starz" lang={lang} variant="code" />'],
    ] as const
    for (const [file, expected] of routes) {
      expect(readFileSync(file, 'utf8')).toContain(expected)
    }
  })

  it('does not publish unsupported free-spin, no-wagering or guaranteed-bonus claims', () => {
    const files = [
      'src/components/bttsbet/PromoVerificationGuide.tsx',
      'src/components/bttsbet/LocalizedPromoClient.tsx',
      'src/components/bttsbet/Star888PromoClient.tsx',
      'src/lib/promo-faq.ts',
    ]
    const source = files.map(file => readFileSync(file, 'utf8')).join('\n')
    expect(source).not.toMatch(/100\s*free spins|100\s*لفة مجانية|no wagering requirements|sans condition de mise|بدون شروط مراهنة|guaranteed bonus|bonus garanti|مكافأة مضمونة/i)
  })
})
