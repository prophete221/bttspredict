import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import PromoLandingShell from '@/components/bttsbet/PromoLandingShell'
import Star888PromoClient from '@/components/bttsbet/Star888PromoClient'

const ROOT = resolve(__dirname, '..')
const languages = ['fr', 'en', 'ar'] as const

describe('Divulgation affiliée sur les pages promotionnelles', () => {
  it('affiche la divulgation près des CTA du gabarit promo partagé', () => {
    for (const lang of languages) {
      const html = renderToStaticMarkup(createElement(PromoLandingShell, {
        brand: 'Linebet',
        code: 'VISION221',
        bookmakerId: 'linebet',
        accent: '#13B981',
        logo: '/logos/linebet-logo.svg',
        logoBg: '#FFFFFF',
        signupUrl: 'https://example.com/signup',
        downloadUrl: 'https://example.com/download',
        lang,
        title: 'Linebet promo code VISION221',
        badge: 'PROMO',
        intro: 'Promo overview',
        offerHeadline: 'Offer',
        offerSub: 'Offer details',
        benefits: [],
        steps: [],
        faq: [],
        crossLinks: [],
      }))
      const ctaIndex = html.indexOf('data-cta="promo-signup-linebet"')
      const disclosureIndex = html.indexOf('data-affiliate-disclosure')
      expect(ctaIndex).toBeGreaterThanOrEqual(0)
      expect(disclosureIndex).toBeGreaterThan(ctaIndex)
      expect(html).toContain('promo-sticky-copy-linebet')
      expect(html).toContain('promo-sticky-signup-linebet')
      expect(html).toContain(lang === 'ar' ? 'كيفية استخدام الرمز' : lang === 'en' ? 'How to use the code' : 'Utiliser le code')
      expect(html.slice(disclosureIndex, disclosureIndex + 500)).toContain(lang === 'fr'
        ? 'Cette page contient des liens affiliés. BTTSPredict peut percevoir une commission, sans coût supplémentaire pour vous.'
        : lang === 'en'
          ? 'This page contains affiliate links. BTTSPredict may receive a commission at no extra cost to you.'
          : 'تتضمن هذه الصفحة روابط تابعة. قد تحصل BTTSPredict على عمولة دون تكلفة إضافية عليك.')
    }

    const source = readFileSync(resolve(ROOT, 'src/components/bttsbet/PromoLandingShell.tsx'), 'utf8')
    expect(source).toContain('data-affiliate-disclosure')
    expect(source).toContain('{L.affiliateDisclosure}')
    expect(source).toContain('This page contains affiliate links')
    expect(source).toContain('Cette page contient des liens affiliés')
    expect(source).toContain('تتضمن هذه الصفحة روابط تابعة')
    const localized = readFileSync(resolve(ROOT, 'src/components/bttsbet/LocalizedPromoClient.tsx'), 'utf8')
    expect(localized).toContain('Linebet promo code VISION221 is listed here; country availability has not been verified.')
    expect(localized).toContain('Check current eligibility and terms directly with Linebet.')
    expect(localized).not.toMatch(/Linebet promo code VISION221 works worldwide/i)
  })

  it('affiche la divulgation sur la page promo 888Starz dans les trois langues', () => {
    const source = readFileSync(resolve(ROOT, 'src/components/bttsbet/Star888PromoClient.tsx'), 'utf8')
    expect(source).toContain('data-affiliate-disclosure')
    expect(source).toContain('{copy.affiliateDisclosure}')
    expect(source).toContain('Les liens vers 888Starz sont affiliés')
    expect(source).toContain('Links to 888Starz are affiliate links')
    expect(source).toContain('روابط 888Starz تابعة')

    for (const lang of languages) {
      for (const variant of ['general', 'code', 'main'] as const) {
        const html = renderToStaticMarkup(createElement(Star888PromoClient, { lang, variant }))
        const ctaIndex = html.indexOf(`data-cta="promo-signup-888starz-${lang}"`)
        const disclosureIndex = html.indexOf('data-affiliate-disclosure')
        expect(ctaIndex).toBeGreaterThanOrEqual(0)
        expect(disclosureIndex).toBeGreaterThan(ctaIndex)
        expect(html).toContain(`promo-sticky-copy-888starz-${lang}`)
        expect(html).toContain(`promo-sticky-signup-888starz-${lang}`)
        expect(html.slice(disclosureIndex, disclosureIndex + 500)).toContain(lang === 'fr'
          ? 'Les liens vers 888Starz sont affiliés ; BTTSPredict peut percevoir une commission si vous les utilisez.'
          : lang === 'en'
            ? 'Links to 888Starz are affiliate links; BTTSPredict may receive a commission if you use them.'
            : 'روابط 888Starz تابعة؛ قد تحصل BTTSPredict على عمولة عند استخدامها.')
      }
    }
  })
})
