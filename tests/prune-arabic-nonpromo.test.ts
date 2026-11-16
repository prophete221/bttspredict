import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { afterEach, describe, expect, it } from 'vitest'
import { ARABIC_PROMO_PATHS as SOURCE_PROMO_PATHS } from '../src/lib/arabic-promo-routes'
import { ARABIC_PROMO_PATHS, pruneArabicNonPromo } from '../scripts/prune-arabic-nonpromo.mjs'

const temporaryRoots: string[] = []

function createOutputFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'btts-ar-prune-'))
  temporaryRoots.push(root)
  const write = (relative: string, content = '<!doctype html><html><head></head><body></body></html>') => {
    const file = path.join(root, relative)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, content)
  }
  const arabicAlternate = '<link rel="alternate" hreflang="ar" href="https://bttspredict.com/ar/vip">'
  write('index.html', `<html><head>${arabicAlternate}</head><body></body></html>`)
  write('en/vip.html', `<html><head>${arabicAlternate}</head><body></body></html>`)
  write('code-promo-1xbet.html', `<html><head>${arabicAlternate}</head><body></body></html>`)
  write('en/code-promo-1xbet.html', `<html><head>${arabicAlternate}</head><body></body></html>`)
  write('ar/index.html')
  write('ar/vip.html')
  write('ar/match/test-match.html')
  for (const promoPath of ARABIC_PROMO_PATHS) write(`ar${promoPath}.html`)
  return { root, write }
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) fs.rmSync(root, { recursive: true, force: true })
})

describe('suppression des routes arabes non promotionnelles', () => {
  it('conserve les cinq routes promo, nettoie les hreflang et rapporte les routes supprimées', () => {
    expect([...ARABIC_PROMO_PATHS].sort()).toEqual([...SOURCE_PROMO_PATHS].sort())
    const { root } = createOutputFixture()

    const result = pruneArabicNonPromo(root)

    expect(result.removedRoutes).toEqual(['/ar', '/ar/match/test-match', '/ar/vip'])
    expect(result.keptPromoRoutes).toEqual([
      '/ar/bonus-888starz',
      '/ar/bonus-888starz-btts221',
      '/ar/code-promo-1xbet',
      '/ar/code-promo-linebet-senegal',
      '/ar/code-promo-melbet',
    ])
    expect(result.strippedAlternateFileCount).toBe(2)
    expect(fs.existsSync(path.join(root, 'ar/index.html'))).toBe(false)
    expect(fs.existsSync(path.join(root, 'ar/vip.html'))).toBe(false)
    expect(fs.existsSync(path.join(root, 'ar/match/test-match.html'))).toBe(false)
    for (const promoPath of ARABIC_PROMO_PATHS) {
      expect(fs.existsSync(path.join(root, `ar${promoPath}.html`))).toBe(true)
    }
    expect(fs.readFileSync(path.join(root, 'index.html'), 'utf8')).not.toContain('hreflang="ar"')
    expect(fs.readFileSync(path.join(root, 'en/vip.html'), 'utf8')).not.toContain('hreflang="ar"')
    expect(fs.readFileSync(path.join(root, 'code-promo-1xbet.html'), 'utf8')).toContain('hreflang="ar"')
    expect(fs.readFileSync(path.join(root, 'en/code-promo-1xbet.html'), 'utf8')).toContain('hreflang="ar"')
  })

  it('retourne une vraie 404 sur la racine arabe et son ancien fichier plat avant le routage statique', () => {
    const rules = fs.readFileSync(path.resolve(process.cwd(), 'public/.htaccess'), 'utf8')
    expect(rules).toMatch(/^RewriteRule \^ar\/\?\$ \/404\.html \[L,R=404\]$/m)
    expect(rules).toContain(String.raw`RewriteRule ^ar\.html/?$ /404.html [L,R=404]`)
    expect(rules).toContain('Options -Indexes')
    const rootOnly = /^ar\/?$/
    expect(['ar', 'ar/'].every(route => rootOnly.test(route))).toBe(true)
    expect([...ARABIC_PROMO_PATHS].every(route => !rootOnly.test(`ar${route}`))).toBe(true)
    const staticRewrite = rules.indexOf('RewriteRule ^(.+)/?$ /$1.html [L]')
    expect(staticRewrite).toBeGreaterThan(-1)
    expect(rules.indexOf('RewriteRule ^ar/?$ /404.html [L,R=404]')).toBeLessThan(staticRewrite)
    expect(rules.indexOf(String.raw`RewriteRule ^ar\.html/?$ /404.html [L,R=404]`)).toBeLessThan(staticRewrite)
  })

  it('bloque les anciennes routes arabes même si leurs fichiers sont encore présents', () => {
    const rules = fs.readFileSync(path.resolve(process.cwd(), 'public/.htaccess'), 'utf8')
    const condition = rules.match(/^RewriteCond %\{REQUEST_URI\} !(\^\/ar\/[^\n]+)$/m)
    expect(condition).not.toBeNull()
    const allowlist = new RegExp(condition![1])
    for (const route of ARABIC_PROMO_PATHS) {
      expect(allowlist.test(`/ar${route}`)).toBe(true)
      expect(allowlist.test(`/ar${route}.html`)).toBe(true)
    }
    for (const route of ['/ar/vip', '/ar/vip.html', '/ar/index.html', '/ar/match/foo', '/ar/bonus-888starz/autre']) {
      expect(allowlist.test(route)).toBe(false)
    }
    expect(rules.indexOf('RewriteRule ^ar/.+ - [L,R=404]')).toBeLessThan(rules.indexOf('RewriteRule \\.html$ - [L]'))
  })

  it('garde la forme index.html d’une promo mais retire ses sous-routes HTML', () => {
    const { root, write } = createOutputFixture()
    write('ar/bonus-888starz/index.html')
    write('ar/bonus-888starz/chunk.txt', 'route payload')
    write('ar/bonus-888starz/subpage/index.html')

    const result = pruneArabicNonPromo(root)

    expect(fs.existsSync(path.join(root, 'ar/bonus-888starz/index.html'))).toBe(true)
    expect(fs.existsSync(path.join(root, 'ar/bonus-888starz/chunk.txt'))).toBe(true)
    expect(fs.existsSync(path.join(root, 'ar/bonus-888starz/subpage'))).toBe(false)
    expect(result.removedRoutes).toContain('/ar/bonus-888starz/subpage')
  })

  it('ne suit jamais un lien symbolique dans l’arbre de sortie', () => {
    const { root } = createOutputFixture()
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'btts-ar-outside-'))
    temporaryRoots.push(outside)
    const outsideFile = path.join(outside, 'must-remain.html')
    fs.writeFileSync(outsideFile, '<html>keep</html>')
    fs.symlinkSync(outside, path.join(root, 'ar', 'external'), 'dir')

    pruneArabicNonPromo(root)

    expect(fs.existsSync(outsideFile)).toBe(true)
    expect(fs.lstatSync(outsideFile).isFile()).toBe(true)
    expect(fs.existsSync(path.join(root, 'ar', 'external'))).toBe(false)
  })

  it('refuse une racine out symbolique sans toucher à sa cible', () => {
    const { root } = createOutputFixture()
    const parent = fs.mkdtempSync(path.join(os.tmpdir(), 'btts-ar-link-'))
    temporaryRoots.push(parent)
    const alias = path.join(parent, 'alias')
    fs.symlinkSync(root, alias, 'dir')

    expect(() => pruneArabicNonPromo(alias)).toThrow(/symbolique/i)
    expect(fs.existsSync(path.join(root, 'ar/vip.html'))).toBe(true)
  })

  it('refuse les options CLI pouvant écrire hors de out', () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'btts-ar-cli-'))
    temporaryRoots.push(cwd)
    const out = path.join(cwd, 'out')
    fs.mkdirSync(out)
    const write = (relative: string) => {
      const file = path.join(out, relative)
      fs.mkdirSync(path.dirname(file), { recursive: true })
      fs.writeFileSync(file, '<html></html>')
    }
    write('ar/vip.html')
    const script = path.resolve(process.cwd(), 'scripts/prune-arabic-nonpromo.mjs')
    const outsideReport = path.join(cwd, 'escape.json')

    const result = spawnSync(process.execPath, [script, 'out', `--report=${outsideReport}`], { cwd, encoding: 'utf8' })

    expect(result.status).not.toBe(0)
    expect(fs.existsSync(outsideReport)).toBe(false)
    expect(fs.existsSync(path.join(out, 'ar/vip.html'))).toBe(true)
  })

  it('peut être exécuté une seconde fois sans retirer les promos ni modifier les fichiers', () => {
    const { root } = createOutputFixture()
    pruneArabicNonPromo(root)
    const second = pruneArabicNonPromo(root)
    expect(second.removedRoutes).toEqual([])
    expect(second.strippedAlternateFileCount).toBe(0)
    expect(fs.existsSync(path.join(root, 'ar/code-promo-1xbet.html'))).toBe(true)
  })
})
