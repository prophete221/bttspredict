import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8')

const combinedPage = read('src/components/bttsbet/LocalizedCombinedPredictionsClient.tsx')
const over25Page = read('src/app/[locale]/over-2-5/predictions/today/page.tsx')
const localizedHome = read('src/app/[locale]/page.tsx')
const matchCenter = read('src/components/bttsbet/MatchCenter.tsx')
const hero = read('src/components/bttsbet/Hero.tsx')

describe('partner panel placement', () => {
  it('removes the promo strips and partner-signup panel from the site routes', () => {
    expect(combinedPage).not.toContain('Partner promo codes')
    expect(combinedPage).not.toContain('PartnerSignupBand')
    expect(over25Page).not.toContain('over25-partner-strip')
    expect(over25Page).not.toContain('PartnerSignupBand')
    expect(localizedHome).not.toContain('PartnerSignupBand')
  })

  it('keeps official affiliate links within match cards', () => {
    expect(matchCenter).toContain('<BookmakerCardLinks')
    expect(hero).toContain('<BookmakerCardLinks')
  })
})
