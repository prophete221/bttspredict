/**
 * Tests de scripts/fix-html-lang.mjs — correction <html lang> post-export.
 *
 * Garanties vérifiées :
 *  1. out/en/**  passe de lang="fr" à lang="en", rien d'autre ne change ;
 *  2. out/ar/**  passe à lang="ar" dir="rtl" (RTL conservé) ;
 *  3. idempotence (second passage = zéro modification) ;
 *  4. les fichiers hors en//ar/ ne sont jamais touchés ;
 *  5. textes, metas et canonical restent octet-pour-octer identiques.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import { fixHtmlLang, rewriteHtmlTag, verifyHtmlLang } from '../scripts/fix-html-lang.mjs'

const FR_PAGE = `<!DOCTYPE html><html lang="fr" className="dark"><head><meta charset="utf-8"><meta name="description" content="desc FR"><link rel="canonical" href="https://bttspredict.com/en"><title>EN page</title></head><body><div lang="en" dir="ltr">Hello</div></body></html>`
const AR_PAGE = `<!DOCTYPE html><html lang="fr" className="dark"><head><meta charset="utf-8"><link rel="canonical" href="https://bttspredict.com/ar"><title>صفحة</title></head><body><div lang="ar" dir="rtl">مرحبا</div></body></html>`

function makeTmpOut() {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'out-lang-'))
  fs.mkdirSync(path.join(out, 'en', 'match'), { recursive: true })
  fs.mkdirSync(path.join(out, 'ar'), { recursive: true })
  fs.writeFileSync(path.join(out, 'index.html'), FR_PAGE)
  fs.writeFileSync(path.join(out, 'en', 'index.html'), FR_PAGE)
  fs.writeFileSync(path.join(out, 'en', 'match', 'x-1.html'), FR_PAGE)
  fs.writeFileSync(path.join(out, 'ar', 'index.html'), AR_PAGE)
  return out
}

describe('fix-html-lang', () => {
  it('rewrites only the html tag lang for en/ and adds dir=rtl for ar/', () => {
    const fixedEn = rewriteHtmlTag(FR_PAGE, 'en')
    expect(fixedEn).toContain('<html lang="en"')
    expect(fixedEn).not.toContain('lang="fr"')
    // seul l'attribut html change — tout le reste est identique
    expect(fixedEn.replace('<html lang="en"', '<html lang="fr"')).toBe(FR_PAGE)

    const fixedAr = rewriteHtmlTag(FR_PAGE, 'ar')
    expect(fixedAr).toContain('<html lang="ar" dir="rtl"')
    expect(fixedAr.replace('<html lang="ar" dir="rtl"', '<html lang="fr"')).toBe(FR_PAGE)
  })
  it('fixes every html file under en/ and ar/ and nothing outside', () => {
    const out = makeTmpOut()
    const result = fixHtmlLang(out)
    expect(result.en.fixed).toBe(2)
    expect(result.ar.fixed).toBe(1)
    expect(result.errors).toEqual([])

    // racine (fr) inchangée
    expect(fs.readFileSync(path.join(out, 'index.html'), 'utf8')).toBe(FR_PAGE)
    // en corrigé
    const enTag = fs.readFileSync(path.join(out, 'en', 'index.html'), 'utf8').match(/<html[^>]*>/)?.[0] ?? ''
    expect(enTag).toContain('lang="en"')
    expect(enTag).not.toContain('dir="rtl"')
    // ar corrigé avec RTL
    const arTag = fs.readFileSync(path.join(out, 'ar', 'index.html'), 'utf8').match(/<html[^>]*>/)?.[0] ?? ''
    expect(arTag).toContain('lang="ar"')
    expect(arTag).toContain('dir="rtl"')
    // corps et metas inchangés
    const arBody = fs.readFileSync(path.join(out, 'ar', 'index.html'), 'utf8')
    expect(arBody).toContain('<div lang="ar" dir="rtl">مرحبا</div>')
    expect(arBody).toContain('rel="canonical" href="https://bttspredict.com/ar"')
    fs.rmSync(out, { recursive: true, force: true })
  })

  it('is idempotent and verifyHtmlLang accepts the result', () => {
    const out = makeTmpOut()
    fixHtmlLang(out)
    const second = fixHtmlLang(out)
    expect(second.en.fixed).toBe(0)
    expect(second.ar.fixed).toBe(0)
    expect(second.en.alreadyOk).toBe(2)
    expect(second.ar.alreadyOk).toBe(1)
    expect(verifyHtmlLang(out)).toEqual([])
    fs.rmSync(out, { recursive: true, force: true })
  })

  it('leaves an existing dir attribute on html untouched for non-ar locales', () => {
    const withDir = FR_PAGE.replace('<html lang="fr"', '<html lang="fr" dir="ltr"')
    const fixed = rewriteHtmlTag(withDir, 'en')
    expect(fixed).toContain('lang="en"')
    expect(fixed).toContain('dir="ltr"')
  })

  it('normalizes a wrong existing dir attribute for ar to rtl', () => {
    const wrongDir = FR_PAGE.replace('<html lang="fr"', '<html lang="fr" dir="ltr"')
    const fixed = rewriteHtmlTag(wrongDir, 'ar')
    const htmlTag = fixed.match(/<html[^>]*>/)?.[0] ?? ''
    expect(htmlTag).toContain('lang="ar"')
    expect(htmlTag).toContain('dir="rtl"')
    expect(htmlTag).not.toContain('dir="ltr"')
  })
})
