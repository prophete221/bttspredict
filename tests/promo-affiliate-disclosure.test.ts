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
      expect(html.slice(disclosureIndex, disclosureIndex + 500)).toContain(lang === 'fr'
        ? 'Les liens vers l’opérateur sont affiliés ; BTTSPredict peut percevoir une commission si vous les utilisez.'
        : lang === 'en'
          ? 'Links to the operator are affiliate links; BTTSPredict may receive a commission if you use them.'
          : 'روابط المشغّل تابعة؛ قد تحصل BTTSPredict على عمولة عند استخدامها.')
    }

    const source = readFileSync(resolve(ROOT, 'src/components/bttsbet/PromoLandingShell.tsx'), 'utf8')
    expect(source).toContain('data-affiliate-disclosure')
    expect(source).toContain('{L.affiliateDisclosure}')
    expect(source).toContain('Links to the operator are affiliate links')
    expect(source).toContain('Les liens vers l’opérateur sont affiliés')
    expect(source).toContain('روابط المشغّل تابعة')
    const localized = readFileSync(resolve(ROOT, 'src/components/bttsbet/LocalizedPromoClient.tsx'), 'utf8')
    expect(localized).toContain('Linebet promo code VISION221 works worldwide.')
    expect(localized).not.toContain('country availability has not been verified')
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
