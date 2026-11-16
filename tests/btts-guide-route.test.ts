import { describe, expect, it } from 'vitest'
import sitemap from '@/app/sitemap'
import { generateMetadata, generateStaticParams } from '@/app/[locale]/btts-c-est-quoi/page'
import { ARABIC_PROMO_PATHS } from '@/lib/arabic-promo-routes'

const SITE_URL = 'https://bttspredict.com'
const GUIDE_FR = `${SITE_URL}/btts-c-est-quoi`
const GUIDE_EN = `${SITE_URL}/en/btts-c-est-quoi`
const GUIDE_ALTERNATES = { fr: GUIDE_FR, en: GUIDE_EN, 'x-default': GUIDE_FR }
const ARABIC_PROMO_PATH_SET = new Set<string>(ARABIC_PROMO_PATHS)

describe('localized BTTS guide route', () => {
  it('generates only English and preserves its page title, canonical and hreflang', async () => {
    expect(generateStaticParams()).toEqual([{ locale: 'en' }])

    const metadata = await generateMetadata({ params: Promise.resolve({ locale: 'en' }) })
    expect(metadata.title).toBe('What Does BTTS Mean? Definition and Score Examples')
    expect(metadata.description).toContain('BTTS means Both Teams To Score')
    expect(metadata.alternates).toEqual({ canonical: GUIDE_EN, languages: GUIDE_ALTERNATES })
    expect(JSON.stringify(metadata)).not.toMatch(/[\u0600-\u06FF]/u)
  })

  it('lists the English URL and exposes Arabic only on the exact five promotional routes', () => {
    const entries = sitemap()
    const guide = entries.find((entry) => entry.url === GUIDE_EN)
    expect(guide).toBeDefined()
    expect(guide?.alternates?.languages).toEqual(GUIDE_ALTERNATES)

    const arabicRoutes = entries
      .map((entry) => new URL(entry.url).pathname)
      .filter((pathname) => pathname.startsWith('/ar/'))
      .map((pathname) => pathname.replace(/^\/ar/, ''))
      .sort()
    expect(arabicRoutes).toEqual([...ARABIC_PROMO_PATHS].sort())

    for (const entry of entries) {
      const pathname = new URL(entry.url).pathname
      const route = pathname.replace(/^\/(?:en|ar)(?=\/|$)/, '') || '/'
      const arabicAlternate = entry.alternates?.languages?.ar
      if (ARABIC_PROMO_PATH_SET.has(route)) {
        expect(arabicAlternate).toBe(`${SITE_URL}/ar${route}`)
      } else {
        expect(arabicAlternate).toBeUndefined()
      }
    }
  })
})
