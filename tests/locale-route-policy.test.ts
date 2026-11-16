import { describe, expect, it } from 'vitest'
import { ARABIC_PROMO_PATHS } from '@/lib/arabic-promo-routes'
import { getAvailableLocales, getStaticLocaleParams, getStaticLocalesForPath, isVipAvailable } from '@/lib/locale-route-policy'

describe('politique des routes localisées', () => {
  it('autorise Arabic only on the exact five promotional routes', () => {
    expect(ARABIC_PROMO_PATHS).toEqual([
      '/code-promo-1xbet',
      '/code-promo-linebet-senegal',
      '/code-promo-melbet',
      '/bonus-888starz',
      '/bonus-888starz-btts221',
    ])
    for (const path of ARABIC_PROMO_PATHS) {
      expect(getAvailableLocales(`/ar${path}`)).toEqual(['fr', 'en', 'ar'])
      expect(getStaticLocalesForPath(path)).toEqual(['en', 'ar'])
      expect(getStaticLocaleParams(path)).toEqual([{ locale: 'en' }, { locale: 'ar' }])
    }
  })

  it('generates no Arabic locale segment for non-promotional routes', () => {
    for (const path of [
      '/',
      '/vip',
      '/ai-correct-score-predictions',
      '/btts/predictions/today',
      '/historique',
      '/jouer-responsable',
      '/btts-c-est-quoi',
      '/competitions/[slug]',
      '/match/[slug]',
      '/code-promo-1xbet/nested',
    ]) {
      expect(getAvailableLocales(`/ar${path === '/' ? '' : path}`)).toEqual(['fr', 'en'])
      expect(getStaticLocalesForPath(path)).toEqual(['en'])
      expect(getStaticLocaleParams(path)).toEqual([{ locale: 'en' }])
    }
  })

  it('réserve la navigation VIP au français et à l’anglais', () => {
    expect(isVipAvailable('fr')).toBe(true)
    expect(isVipAvailable('en')).toBe(true)
    expect(isVipAvailable('ar')).toBe(false)
    for (const path of ['/vip', '/en/vip', '/ar/vip']) {
      expect(getAvailableLocales(path)).toEqual(['fr', 'en'])
    }
  })
})
