import { readFileSync, existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { AFFILIATE, BOOKMAKERS } from '@/lib/constants'

/**
 * Gardes-fous « bookmakers & pages codes promo » (demande du propriétaire).
 *
 * Ce test vérifie la cohérence de bout en bout du dispositif d'affiliation :
 *   1. Les 4 pages codes promo FR existent réellement dans src/app.
 *   2. Les 4 pages locales EN/AR ([locale]) existent pour chaque bookmaker
 *      déclaré dans LOCALIZED_PATHS du sitemap.
 *   3. Le sitemap référence toutes les pages codes promo.
 *   4. Les logos réels référencés par BOOKMAKERS existent dans public/.
 *   5. Les liens affiliés de chaque page client pointent vers AFFILIATE
 *      (aucune URL codée en dur non centralisée).
 *   6. Les codes affichés dans les pages utilisent la casse exacte.
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
      expect(sitemap.includes(`LOCALIZED_PATHS`) && sitemap.includes(`'/${path}'`), `${path} doit être dans LOCALIZED_PATHS`).toBe(true)
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
      '888starz': 'src/app/bonus-888starz/Star888Client.tsx',
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
      'src/app/bonus-888starz/Star888Client.tsx',
    ]
    const reffUrls = /https?:\/\/(reffpa|refpa3665|lb-aff|888ghta)\.com[^'"]*/
    for (const file of clients) {
      const text = readFileSync(file, 'utf8')
      // Les clients importent AFFILIATE ; aucune URL d'affiliation codée en dur.
      expect(text, `${file} doit importer AFFILIATE de @/lib/constants`).toContain("from '@/lib/constants'")
      expect(reffUrls.test(text.replace(/AFFILIATE\s*=\s*{[\s\S]*?}/g, '')), `${file} contient une URL affiliée codée en dur`).toBe(false)
    }
  })

  it('never displays a code in the wrong case inside clients', () => {
    const wrongCase: [string, RegExp][] = [
      ['src/app/code-promo-1xbet/XbetClient.tsx', /VIPBTTS|Vipbtts/],
      ['src/app/code-promo-melbet/MelbetClient.tsx', /BTTSWIN|BttsWin|bttswin'/],
    ]
    for (const [file, pattern] of wrongCase) {
      const text = readFileSync(file, 'utf8')
      expect(pattern.test(text), `${file} contient le code dans une casse incorrecte`).toBe(false)
    }
    // Casse exacte attendue
    expect(readFileSync('src/app/code-promo-1xbet/XbetClient.tsx', 'utf8')).toContain("'vipbtts'")
    expect(readFileSync('src/app/code-promo-melbet/MelbetClient.tsx', 'utf8')).toContain("'Bttswin'")
  })

  it('keeps the exact affiliate links from the owner message', () => {
    // Liens transmis par le propriétaire le 2026-11 — toute dérive est un bug.
    expect(AFFILIATE.oneXbet).toBe('https://reffpa.com/L?tag=d_6292935m_1599c_&site=6292935&ad=1599')
    expect(AFFILIATE.oneXbetDownload).toBe('https://reffpa.com/L?tag=d_6292935m_45361c_&site=6292935&ad=45361')
    expect(AFFILIATE.melbet).toBe('https://refpa3665.com/L?tag=d_6293054m_2170c_&site=6293054&ad=2170')
    expect(AFFILIATE.melbetDownload).toBe('https://refpa3665.com/L?tag=d_6293054m_70867c_&site=6293054&ad=70867')
  })

  it('announces the uniform owner campaign on every promo page: 300% + 100 free spins', () => {
    // Consigne propriétaire 2026-11 : « 300% pour tous les bookmakers et 100
    // free spins sans condition de mise ». Toute page qui dérive est un bug.
    const files = [
      'src/lib/constants.ts',
      'src/app/code-promo-1xbet/page.tsx',
      'src/app/code-promo-1xbet/XbetClient.tsx',
      'src/app/code-promo-melbet/page.tsx',
      'src/app/code-promo-melbet/MelbetClient.tsx',
      'src/app/code-promo-linebet-senegal/page.tsx',
      'src/app/code-promo-linebet-senegal/LinebetClient.tsx',
      'src/app/bonus-888starz/page.tsx',
      'src/app/bonus-888starz/Star888Client.tsx',
      'src/components/bttsbet/LocalizedPromoClient.tsx',
    ]
    for (const file of files) {
      const text = readFileSync(file, 'utf8')
      expect(text, `${file} doit annoncer 300%`).toContain('300%')
      expect(/100 free spins|100 l/.test(text), `${file} doit annoncer 100 free spins (ou 100 لفة مجانية)`).toBe(true)
      expect(text, `${file} doit garantir « sans condition de mise » (FR/EN/AR)`).toMatch(/sans condition de mise|no wagering requirements|بدون شروط مراهنة/)
    }
  })

  it('never shows the superseded neutral Melbet wording', () => {
    // Ancien wording « bonus de bienvenue / welcome bonus » remplacé le
    // 2026-11 par l'offre uniforme 300% + 100 free spins (consigne propriétaire).
    const files = [
      'src/lib/constants.ts',
      'src/app/code-promo-melbet/page.tsx',
      'src/app/code-promo-melbet/MelbetClient.tsx',
      'src/components/bttsbet/LocalizedPromoClient.tsx',
    ]
    for (const file of files) {
      const text = readFileSync(file, 'utf8')
      expect(text, `${file} affiche encore l'ancien wording neutre Melbet`).not.toMatch(/[Bb]onus de bienvenue sur le premier dépôt|[Ww]elcome bonus on your first deposit|مكافأة ترحيبية على أول إيداع/)
    }
  })

  it('shows the owner "best promo code" badge on every FR promo page + EN/AR', () => {
    // Claim marketing demandé par le propriétaire (« meilleur code promo »).
    expect(readFileSync('src/app/code-promo-1xbet/XbetClient.tsx', 'utf8')).toContain('Meilleur code promo')
    expect(readFileSync('src/app/code-promo-melbet/MelbetClient.tsx', 'utf8')).toContain('Meilleur code promo')
    expect(readFileSync('src/app/code-promo-linebet-senegal/LinebetClient.tsx', 'utf8')).toContain('Meilleur code promo')
    expect(readFileSync('src/app/bonus-888starz/Star888Client.tsx', 'utf8')).toContain('Meilleur code promo')
    const localized = readFileSync('src/components/bttsbet/LocalizedPromoClient.tsx', 'utf8')
    expect(localized).toContain('Meilleur code promo')
    expect(localized).toContain('best promo code')
  })
})
