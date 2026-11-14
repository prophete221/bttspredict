import { readFileSync, existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { AFFILIATE, BOOKMAKERS } from '@/lib/constants'

/**
 * Gardes-fous « bookmakers & pages codes promo » (demande du propriétaire).
 *
 * Ce test vérifie la cohérence de bout en bout du dispositif :
 *   1. Les 4 pages codes promo FR existent réellement dans src/app.
 *   2. Les pages EN/AR existent pour chaque bookmaker déclaré.
 *   3. Le sitemap référence les pages codes promo.
 *   4. Les logos référencés existent dans public/ et les clients les affichent.
 *   5. Les liens des clients viennent de AFFILIATE, sans URL codée en dur.
 *   6. Les codes affichés utilisent la casse exacte.
 */

const FR_PROMO_PAGES: Record<string, string> = {
  '1xbet': 'src/app/code-promo-1xbet/page.tsx',
  linebet: 'src/app/code-promo-linebet-senegal/page.tsx',
  melbet: 'src/app/code-promo-melbet/page.tsx',
  '888starz': 'src/app/bonus-888starz/page.tsx',
}

const LOCALIZED_PROMO_PAGES: Record<string, string> = {
  '1xbet': 'src/app/[locale]/code-promo-1xbet/page.tsx',
  linebet: 'src/app/[locale]/code-promo-linebet-senegal/page.tsx',
  melbet: 'src/app/[locale]/code-promo-melbet/page.tsx',
  '888starz': 'src/app/[locale]/bonus-888starz/page.tsx',
}

describe('bookmakers data guardrails', () => {
  it('has a FR promo page for every bookmaker', () => {
    for (const [id, page] of Object.entries(FR_PROMO_PAGES)) {
      expect(existsSync(page), `page FR manquante pour ${id}: ${page}`).toBe(true)
    }
  })

  it('has EN/AR localized pages for every bookmaker', () => {
    for (const [id, page] of Object.entries(LOCALIZED_PROMO_PAGES)) {
      expect(existsSync(page), `page [locale] manquante pour ${id}: ${page}`).toBe(true)
    }
  })

  it('lists every promo page in the sitemap (FR + EN + AR alternates)', () => {
    const sitemap = readFileSync('src/app/sitemap.ts', 'utf8')
    for (const path of ['/code-promo-1xbet', '/code-promo-linebet-senegal', '/code-promo-melbet', '/bonus-888starz']) {
      expect(sitemap).toContain(`'${path}'`)
    }
    for (const path of ['code-promo-1xbet', 'code-promo-melbet', 'code-promo-linebet-senegal']) {
      expect(sitemap.includes('LOCALIZED_PATHS') && sitemap.includes(`'/${path}'`), `${path} doit être dans LOCALIZED_PATHS`).toBe(true)
    }
  })

  it('serves the real logo referenced by BOOKMAKERS from public/', () => {
    for (const bookmaker of BOOKMAKERS) {
      const onDisk = `public${bookmaker.logoFull}`
      expect(existsSync(onDisk), `logo introuvable sur le disque: ${onDisk}`).toBe(true)
    }
  })

  it('renders the real logo inside each FR promo page client', () => {
    const clients: Record<string, string> = {
      '1xbet': 'src/app/code-promo-1xbet/XbetClient.tsx',
      linebet: 'src/app/code-promo-linebet-senegal/LinebetClient.tsx',
      melbet: 'src/app/code-promo-melbet/MelbetClient.tsx',
      '888starz': 'src/components/bttsbet/Star888PromoClient.tsx',
    }
    for (const bookmaker of BOOKMAKERS) {
      const client = readFileSync(clients[bookmaker.id], 'utf8')
      expect(client, `logo ${bookmaker.logoFull} absent du client ${bookmaker.id}`).toContain(bookmaker.logoFull)
    }
  })

  it('reads affiliate links from AFFILIATE (no hardcoded signup URL in clients)', () => {
    const clients = [
      'src/app/code-promo-1xbet/XbetClient.tsx',
      'src/app/code-promo-melbet/MelbetClient.tsx',
      'src/app/code-promo-linebet-senegal/LinebetClient.tsx',
      'src/components/bttsbet/Star888PromoClient.tsx',
    ]
    const reffUrls = /https?:\/\/(reffpa|refpa3665|lb-aff|888ghta)\.com[^'"]*/
    for (const file of clients) {
      const text = readFileSync(file, 'utf8')
      expect(text, `${file} doit importer AFFILIATE de @/lib/constants`).toContain("from '@/lib/constants'")
      expect(reffUrls.test(text.replace(/AFFILIATE\s*=\s*{[\s\S]*?}/g, '')), `${file} contient une URL affiliée codée en dur`).toBe(false)
    }
  })

  it('never displays a code in the wrong case inside clients', () => {
    const wrongCase: [string, RegExp][] = [
      ['src/app/code-promo-1xbet/XbetClient.tsx', /\b(?:VIPBTTS|VIPbtts)\b/],
      ['src/app/code-promo-melbet/MelbetClient.tsx', /\b(?:BTTSWIN|BttsWin|bttswin)\b/],
    ]
    for (const [file, pattern] of wrongCase) {
      const text = readFileSync(file, 'utf8')
      expect(pattern.test(text), `${file} contient le code dans une casse incorrecte`).toBe(false)
    }
    expect(readFileSync('src/app/code-promo-1xbet/XbetClient.tsx', 'utf8')).toContain("'vipbtts'")
    expect(readFileSync('src/app/code-promo-melbet/MelbetClient.tsx', 'utf8')).toContain("'Bttswin'")
  })

  it('keeps the exact affiliate links from the owner message', () => {
    expect(AFFILIATE.oneXbet).toBe('https://reffpa.com/L?tag=d_6292935m_1599c_&site=6292935&ad=1599')
    expect(AFFILIATE.oneXbetDownload).toBe('https://reffpa.com/L?tag=d_6292935m_45361c_&site=6292935&ad=45361')
    expect(AFFILIATE.linebet).toBe('https://lb-aff.com/L?tag=d_5589568m_22611c_&site=5589568&ad=22611')
    expect(AFFILIATE.linebetDownload).toBe('https://lb-aff.com/L?tag=d_5589568m_66803c_apk1&site=5589568&ad=66803')
    expect(AFFILIATE.star888).toBe('https://888ghta.com/8hwF6V')
    expect(AFFILIATE.star888Download).toBe('https://888ghta.com/5o6glw')
    expect(AFFILIATE.melbet).toBe('https://refpa3665.com/L?tag=d_6293054m_2170c_&site=6293054&ad=2170')
    expect(AFFILIATE.melbetDownload).toBe('https://refpa3665.com/L?tag=d_6293054m_70867c_&site=6293054&ad=70867')
  })

  it('contains the 300% worldwide offer without invented spin, deposit or wagering terms', () => {
    const files = [
      'src/app/code-promo-1xbet/page.tsx',
      'src/app/code-promo-1xbet/XbetClient.tsx',
      'src/app/code-promo-melbet/page.tsx',
      'src/app/code-promo-melbet/MelbetClient.tsx',
      'src/app/code-promo-linebet-senegal/page.tsx',
      'src/app/code-promo-linebet-senegal/LinebetClient.tsx',
      'src/app/bonus-888starz/page.tsx',
      'src/components/bttsbet/Star888PromoClient.tsx',
      'src/app/bonus-888starz-btts221/page.tsx',
      'src/app/[locale]/code-promo-1xbet/page.tsx',
      'src/app/[locale]/code-promo-melbet/page.tsx',
      'src/app/[locale]/bonus-888starz/page.tsx',
      'src/app/[locale]/bonus-888starz-btts221/page.tsx',
      'src/components/bttsbet/LocalizedPromoClient.tsx',
      'src/components/bttsbet/Star888PromoClient.tsx',
      'src/components/bttsbet/GiftPopup.tsx',
      'src/lib/promo-faq.ts',
      'src/lib/i18n.ts',
      'src/app/page.tsx',
    ]
    for (const file of files) {
      const text = readFileSync(file, 'utf8')
      const worldwideOffer = /(?:300\s*%[\s\S]{0,80}(?:worldwide|monde entier|mondial(?:e)?|عالم|حول العالم)|(?:worldwide|monde entier|mondial(?:e)?|عالم|حول العالم)[\s\S]{0,80}300\s*%)/i
      expect(text, `${file} doit mentionner l’offre mondiale de 300%`).toMatch(worldwideOffer)
      expect(text, `${file} ne doit pas inventer spins, dépôt ou conditions`).not.toMatch(/100\s*free spins|100\s*لفة مجانية|no wagering requirements|sans condition de mise|بدون شروط مراهنة|first deposit|premier dépôt|dépôt de 1\s*€/i)
    }
  })

  it('uses the owner-confirmed worldwide Linebet offer and directs readers to local terms', () => {
    const page = readFileSync('src/app/[locale]/code-promo-linebet-senegal/page.tsx', 'utf8')
    const client = readFileSync('src/components/bttsbet/LocalizedPromoClient.tsx', 'utf8')
    const clientEnglishStart = client.indexOf("    en: {\n      badge: 'LINEBET PROMO CODE'")
    const clientEnglishEnd = client.indexOf('    ar: {', clientEnglishStart)
    const clientEnglish = client.slice(clientEnglishStart, clientEnglishEnd)
    const faq = readFileSync('src/lib/promo-faq.ts', 'utf8')
    const faqLinebet = faq.slice(faq.indexOf('  linebet: {'), faq.indexOf("  '1xbet': {"))
    const faqEnglish = faqLinebet.slice(faqLinebet.indexOf('    en: ['), faqLinebet.indexOf('    ar: ['))
    const shell = readFileSync('src/components/bttsbet/PromoLandingShell.tsx', 'utf8')

    expect(page).toContain("const title = isEnglish ? 'Linebet Promo Code VISION221: Worldwide 300% Offer'")
    expect(page).toContain("'Linebet 300% worldwide'")
    const metadataDescription = page.match(/const description = isEnglish\s*\?\s*'([^']+)'/)?.[1] ?? ''
    expect(metadataDescription).toContain('worldwide 300% deposit bonus')
    expect(metadataDescription).toContain('Check local terms with Linebet')
    expect(clientEnglish).toContain('Linebet promo code VISION221 is valid worldwide')
    expect(clientEnglish).toContain('Check the terms that apply to your account with Linebet')
    expect(faqEnglish).toContain('VISION221 is offered worldwide')
    expect(faqEnglish).toContain('check the local terms directly with Linebet')
    expect(shell).not.toContain('Country availability has not been verified')
  })

  it('never shows the superseded neutral Melbet wording', () => {
    const files = [
      'src/lib/constants.ts',
      'src/app/code-promo-melbet/page.tsx',
      'src/app/code-promo-melbet/MelbetClient.tsx',
      'src/components/bttsbet/LocalizedPromoClient.tsx',
    ]
    for (const file of files) {
      const text = readFileSync(file, 'utf8')
      expect(text, `${file} affiche encore l’ancien wording Melbet`).not.toMatch(/[Bb]onus de bienvenue sur le premier dépôt|[Ww]elcome bonus on your first deposit|مكافأة ترحيبية على أول إيداع/)
    }
  })

  it('keeps the selected promo claims with visible affiliate disclosures', () => {
    const clients = [
      'src/app/code-promo-1xbet/XbetClient.tsx',
      'src/app/code-promo-melbet/MelbetClient.tsx',
      'src/app/code-promo-linebet-senegal/LinebetClient.tsx',
      'src/components/bttsbet/Star888PromoClient.tsx',
    ]
    for (const file of clients) {
      const text = readFileSync(file, 'utf8')
      expect(text).not.toMatch(/PUBLICITÉ|ADVERTISEMENT|إعلان|offre partenaire|partner offer|code partenaire|partner code|lien partenaire|partner link|عرض الشريك|رمز الشريك|رابط الشريك/i)
      expect(text).toMatch(/Code promo|Promo code|رمز .* الترويجي/i)
      expect(text).toMatch(/cashback/i)
    }

    const localized = readFileSync('src/components/bttsbet/LocalizedPromoClient.tsx', 'utf8')
    expect(localized).not.toMatch(/PUBLICITÉ|ADVERTISEMENT|إعلان|offre partenaire|partner offer|code partenaire|partner code|lien partenaire|partner link|عرض الشريك|رمز الشريك|رابط الشريك/i)
    expect(localized).toMatch(/Promo Code/)
    expect(localized).toMatch(/Code promo/)
    expect(localized).toMatch(/رمز .* الترويجي/)
    expect(localized).toMatch(/cashback.*weekly bonuses/i)
    expect(localized).toMatch(/cashback.*bonus hebdomadaires/i)
    expect(localized).toMatch(/استرداد نقدي/)
    expect(localized).toMatch(/مكافآت أسبوعية/)

    const shell = readFileSync('src/components/bttsbet/PromoLandingShell.tsx', 'utf8')
    expect(shell).not.toMatch(/PUBLICITÉ|ADVERTISEMENT|إعلان|Other partners|Autres partenaires|شركاء آخرون/i)
    expect(shell).toContain('data-affiliate-disclosure')
    expect(shell).toContain('affiliateDisclosure')
    expect(shell).toContain('BTTSPredict peut percevoir une commission')
    expect(shell).toContain('BTTSPredict may receive a commission')
    expect(shell).toContain('قد تحصل BTTSPredict على عمولة')

    const star888 = readFileSync('src/components/bttsbet/Star888PromoClient.tsx', 'utf8')
    expect(star888).toContain('data-affiliate-disclosure')
    expect(star888).toContain('affiliateDisclosure')
  })
})
