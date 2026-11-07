import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import Star888PromoClient from '@/components/bttsbet/Star888PromoClient'
import { getPromoFaq, type PromoLang } from '@/lib/promo-faq'

const languages: PromoLang[] = ['fr', 'en', 'ar']
const variants = ['general', 'code', 'main'] as const

describe('FAQ visibles des pages promotionnelles 888Starz', () => {
  for (const variant of variants) {
    it.each(languages)(`rend les questions et réponses de la source JSON-LD — ${variant} / %s`, (lang) => {
      const html = renderToStaticMarkup(createElement(Star888PromoClient, { lang, variant }))
      expect(html).toContain('data-promo-faq')
      for (const item of getPromoFaq('888starz', lang)) {
        expect(html).toContain(item.q)
        expect(html).toContain(item.a)
      }
    })
  }
})
