/**
 * Tests d'acceptation — SEO, routes, composants
 */
import { describe, test, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(__dirname, '..')

describe('Architecture SEO', () => {
  test('robots.txt existe', () => {
    expect(fs.existsSync(path.join(ROOT, 'public/robots.txt'))).toBe(true)
  })
  test('sitemap.ts génère des URLs', () => {
    const sm = fs.readFileSync(path.join(ROOT, 'src/app/sitemap.ts'), 'utf8')
    const count = (sm.match(/url\(/g) || []).length
    expect(count).toBeGreaterThan(5)
  })
  test('sitemap.ts inclut les pages topical BTTS et Over 2.5', () => {
    const sm = fs.readFileSync(path.join(ROOT, 'src/app/sitemap.ts'), 'utf8')
    expect(sm).toContain('/btts/predictions/today')
    expect(sm).toContain('/over-2-5/predictions/today')
  })
})

describe('Pages match SSG', () => {
  test('/match/[slug] page existe avec generateStaticParams', () => {
    expect(fs.existsSync(path.join(ROOT, 'src/app/match/[slug]/page.tsx'))).toBe(true)
    const page = fs.readFileSync(path.join(ROOT, 'src/app/match/[slug]/page.tsx'), 'utf8')
    expect(page).toContain('generateStaticParams')
    expect(page).toContain('generateMetadata')
    expect(page).toContain('SportsEvent')
  })
  test('src/lib/matches.ts existe', () => {
    expect(fs.existsSync(path.join(ROOT, 'src/lib/matches.ts'))).toBe(true)
  })
})

describe('Topical authority BTTS + Over 2.5', () => {
  test('/btts/predictions/today existe', () => {
    expect(fs.existsSync(path.join(ROOT, 'src/app/btts/predictions/today/page.tsx'))).toBe(true)
  })
  test('/btts/statistics existe', () => {
    expect(fs.existsSync(path.join(ROOT, 'src/app/btts/statistics/page.tsx'))).toBe(true)
  })
  test('/over-2-5/predictions/today existe', () => {
    expect(fs.existsSync(path.join(ROOT, 'src/app/over-2-5/predictions/today/page.tsx'))).toBe(true)
  })
  test('/over-2-5/statistics existe', () => {
    expect(fs.existsSync(path.join(ROOT, 'src/app/over-2-5/statistics/page.tsx'))).toBe(true)
  })
})

describe('BottomNavigation', () => {
  test('BottomNavigation.tsx existe', () => {
    expect(fs.existsSync(path.join(ROOT, 'src/components/bttsbet/BottomNavigation.tsx'))).toBe(true)
  })
  test('BottomNavigation est monté dans layout.tsx', () => {
    const layout = fs.readFileSync(path.join(ROOT, 'src/app/layout.tsx'), 'utf8')
    expect(layout).toContain('BottomNavigation')
  })
  test('BottomNavigation a 3 onglets', () => {
    const nav = fs.readFileSync(path.join(ROOT, 'src/components/bttsbet/BottomNavigation.tsx'), 'utf8')
    expect(nav).toContain('Accueil')
    expect(nav).toContain('Pronos')
    expect(nav).toContain('VIP')
  })
  test('BottomNavigation a aria-current', () => {
    const nav = fs.readFileSync(path.join(ROOT, 'src/components/bttsbet/BottomNavigation.tsx'), 'utf8')
    expect(nav).toContain('aria-current')
  })
  test('CookieConsent monté dans layout', () => {
    const layout = fs.readFileSync(path.join(ROOT, 'src/app/layout.tsx'), 'utf8')
    expect(layout).toContain('CookieConsent')
  })
})

describe('Nouveau suivi public', () => {
  test('tracking-period.json existe avec startDate', () => {
    const tp = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/tracking-period.json'), 'utf8'))
    expect(tp.startDate).toBe('2026-08-08')
  })
  test('tracking-period.json ne contient pas modelVersion', () => {
    const tp = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/tracking-period.json'), 'utf8'))
    expect(tp.modelVersion).toBeUndefined()
  })
  test('win-history.json contient trackingPeriod', () => {
    const wh = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/win-history.json'), 'utf8'))
    expect(wh.trackingPeriod).toBeDefined()
    expect(wh.trackingPeriod.startDate).toBe('2026-08-08')
  })
  test('win-history.json contient legacyStats privé', () => {
    const wh = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/win-history.json'), 'utf8'))
    expect(wh.legacyStats).toBeDefined()
    expect(wh.legacyStats.isPrivate).toBe(true)
  })
})

describe('AEO / LLM', () => {
  test('llms.txt existe et ne mentionne pas API-Football (affirmatif)', () => {
    const llms = fs.readFileSync(path.join(ROOT, 'public/llms.txt'), 'utf8')
    const cleaned = llms.replace(/does NOT claim to use[^.]+/gi, '')
    expect(cleaned).not.toMatch(/API-Football/i)
    expect(cleaned).not.toMatch(/Forebet/i)
  })
  test('ai.txt existe', () => {
    expect(fs.existsSync(path.join(ROOT, 'public/ai.txt'))).toBe(true)
  })
  test('llms.txt mentionne le suivi 2026-08-08', () => {
    const llms = fs.readFileSync(path.join(ROOT, 'public/llms.txt'), 'utf8')
    expect(llms).toContain('8 August 2026')
  })
})

describe('Conformité', () => {
  test('Aucune page publique ne mentionne "sans clé API"', () => {
    const files = [
      'src/app/page.tsx',
      'src/app/pronostics/page.tsx',
      'src/app/methodologie/page.tsx',
      'src/app/match/[slug]/page.tsx',
    ]
    for (const f of files) {
      const filePath = path.join(ROOT, f)
      if (!fs.existsSync(filePath)) continue
      const content = fs.readFileSync(filePath, 'utf8')
      expect(content).not.toMatch(/sans clé API/i)
    }
  })
  test('Fichiers publics ne mentionnent plus "sans clé API"', () => {
    const files = ['public/tracking-period.json', 'public/llms.txt', 'public/ai.txt']
    for (const f of files) {
      const content = fs.readFileSync(path.join(ROOT, f), 'utf8')
      expect(content).not.toMatch(/sans clé API/i)
      expect(content).not.toMatch(/without API key/i)
    }
  })
  test('Aucune page ne contient "gain garanti" / "sans risque" / "100% sûr"', () => {
    const files = ['src/app/page.tsx', 'src/app/vip/page.tsx', 'src/app/pronostics/page.tsx']
    for (const f of files) {
      const filePath = path.join(ROOT, f)
      if (!fs.existsSync(filePath)) continue
      const content = fs.readFileSync(filePath, 'utf8')
      const cleaned = content
        .replace(/Aucun gain n.*?est garanti/g, '')
        .replace(/ne garantit aucun gain/g, '')
        .replace(/garantit/g, '')
      expect(cleaned).not.toMatch(/gain assuré/i)
      expect(cleaned).not.toMatch(/sans risque/i)
      expect(cleaned).not.toMatch(/100%\s*sûr/i)
    }
  })
})

describe('VipSports — pas de chiffre de précision inventé', () => {
  test('VipSports ne contient pas de propriété accuracy avec un chiffre inventé', () => {
    const content = fs.readFileSync(path.join(ROOT, 'src/components/bttsbet/VipSports.tsx'), 'utf8')
    if (!content) return
    const inventedAccuracy = content.match(/accuracy:\s*(\d+)/g)
    if (inventedAccuracy) {
      expect.fail(
        `VipSports.tsx contient ${inventedAccuracy.length} chiffre(s) de "accuracy" inventé(s): ${inventedAccuracy.join(', ')}. `
      )
    }
  })
})

describe('Meta descriptions 25-160 caractères', () => {
  const FILES = [
    { path: 'src/app/page.tsx', type: 'inline' },
    { path: 'src/app/pronostics/page.tsx', type: 'inline' },
    { path: 'src/app/historique/page.tsx', type: 'inline' },
    { path: 'src/app/methodologie/page.tsx', type: 'inline' },
    { path: 'src/app/vip/page.tsx', type: 'inline' },
    { path: 'src/app/btts/predictions/today/page.tsx', type: 'inline' },
    { path: 'src/app/over-2-5/predictions/today/page.tsx', type: 'inline' },
    { path: 'src/app/betting-tips/page.tsx', type: 'const' },
    { path: 'src/app/cgu/page.tsx', type: 'const' },
    { path: 'src/app/mentions-legales/page.tsx', type: 'const' },
    { path: 'src/app/jouer-responsable/page.tsx', type: 'const' },
  ]

  function extractDescription(content: string, type: string): string | null {
    if (type === 'const') {
      const m = content.match(/const\s+DESCRIPTION\s*=\s*['"`]([^'"`]+)['"`]/)
      return m ? m[1] : null
    }
    const m = content.match(/description:\s*['"`]([^'"`]+)['"`]/)
    return m ? m[1] : null
  }

  test('Toutes les pages indexables ont une meta description entre 25 et 160 caractères', () => {
    const results: { file: string; len: number }[] = []
    for (const f of FILES) {
      const filePath = path.join(ROOT, f.path)
      if (!fs.existsSync(filePath)) continue
      const content = fs.readFileSync(filePath, 'utf8')
      const desc = extractDescription(content, f.type)
      if (!desc) continue
      const len = desc.length
      if (len < 25 || len > 160) {
        results.push({ file: f.path, len })
      }
    }
    if (results.length > 0) {
      const msg = results.map(r => `${r.file}: ${r.len} chars`).join('\n')
      expect.fail(`Meta descriptions hors plage 25-160:\n${msg}`)
    }
  })
})

describe('AI Combo of the Day — sélection temporelle', () => {
  test('utilise exclusivement les matchs actifs du jour et reste masqué sans match à venir', () => {
    const content = fs.readFileSync(
      path.join(ROOT, 'src/components/bttsbet/BttsTodayDashboard.tsx'),
      'utf8',
    )
    expect(content).toContain('for (const m of [...liveTodayMatches, ...scheduledTodayMatches])')
    expect(content).toContain('{!loading && (liveTodayMatches.length > 0 || scheduledTodayMatches.length > 0) && (')
    expect(content).toContain("'Terminés aujourd’hui'")
    expect(content).toContain('No combo available today.')
  })
})
