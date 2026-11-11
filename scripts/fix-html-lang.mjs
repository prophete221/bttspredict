#!/usr/bin/env node
/**
 * fix-html-lang.mjs — corrige l'attribut <html lang> de l'export statique.
 *
 * Problème (relevé du build main@a57ff0e) : les 907 pages HTML déclarent
 * lang="fr", y compris sous /en/ et /ar/, parce que src/app/layout.tsx est le
 * seul root layout (lang="fr") et que [locale]/layout.tsx ne pose lang/dir que
 * sur un <div>. La vraie langue n'est appliquée que par un script côté client,
 * invisible des crawlers.
 *
 * Correctif : après `next build` (et avant ftp-diff prepare, pour que les
 * empreintes du manifeste portent sur les fichiers corrigés), ce script
 * réécrit UNIQUEMENT l'attribut lang (et dir="rtl" pour l'arabe) de la balise
 * <html> des fichiers sous out/en/ et out/ar/ :
 *   - out/en/**  → <html lang="en" ...>      (direction inchangée = ltr)
 *   - out/ar/**  → <html lang="ar" dir="rtl" ...>
 *
 * Garanties :
 *   - aucun texte, URL, balise meta, canonical, hreflang ou JSON-LD modifié ;
 *   - le reste de chaque fichier reste octet-pour-octet identique ;
 *   - l'arabe conserve la direction RTL (identique au comportement du script
 *     runtime existant qui pose documentElement.dir='rtl' pour /ar/) ;
 *   - idempotent : relancer le script ne change rien.
 *
 * Usage : node scripts/fix-html-lang.mjs [outDir]   (défaut: out)
 * Sortie : code 1 si des fichiers en/ar restent mal étiquetés après passage.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function walkHtml(dir, base = dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walkHtml(full, base, acc)
    else if (entry.isFile() && entry.name.endsWith('.html')) {
      acc.push(path.relative(base, full).split(path.sep).join('/'))
    }
  }
  return acc
}

/** Réécrit <html lang="fr" → <html lang="xx" (dir inclus) à la PREMIÈRE
 * occurrence seulement ; retourne le nouveau contenu ou null si rien à faire. */
export function rewriteHtmlTag(html, locale) {
  const idx = html.indexOf('<html')
  if (idx === -1) return null
  const tagEnd = html.indexOf('>', idx)
  if (tagEnd === -1) return null
  const tag = html.slice(idx, tagEnd + 1)
  if (tag.includes(`lang="${locale}"`)) return null // déjà correct (idempotence)

  // Cible : la déclaration de langue actuelle de la balise <html> uniquement.
  const langMatch = tag.match(/\blang="[^"]*"/)
  if (!langMatch) return null
  let nextTag = tag.replace(langMatch[0], `lang="${locale}"`)
  if (locale === 'ar') {
    // RTL arabe : aligne <html> sur le dir déjà posé par le layout [locale]
    // et le script runtime. Si un dir existe déjà il est conservé/normalisé,
    // sinon il est ajouté juste après lang.
    if (/\bdir="[^"]*"/.test(nextTag)) {
      nextTag = nextTag.replace(/\bdir="[^"]*"/, 'dir="rtl"')
    } else {
      nextTag = nextTag.replace(`lang="ar"`, 'lang="ar" dir="rtl"')
    }
  }
  return html.slice(0, idx) + nextTag + html.slice(tagEnd + 1)
}

export function fixHtmlLang(outDir) {
  const result = { en: { fixed: 0, alreadyOk: 0 }, ar: { fixed: 0, alreadyOk: 0 }, errors: [] }
  if (!fs.existsSync(outDir)) {
    result.errors.push(`out/ introuvable: ${outDir} — exécuter next build d'abord`)
    return result
  }
  const englishRoot = path.join(outDir, 'en.html')
  if (!fs.existsSync(englishRoot)) {
    result.errors.push('en.html absent — la page /en doit être générée par l’export statique')
  } else {
    const html = fs.readFileSync(englishRoot, 'utf8')
    const next = rewriteHtmlTag(html, 'en')
    if (next === null) {
      const tag = html.match(/<html[^>]*>/)?.[0] ?? ''
      if (tag.includes('lang="en"')) result.en.alreadyOk += 1
      else result.errors.push(`en.html: balise <html> sans lang reconnu («${tag.slice(0, 80)}»)`)
    } else {
      fs.writeFileSync(englishRoot, next)
      result.en.fixed += 1
    }
  }
  for (const locale of ['en', 'ar']) {
    const localeDir = path.join(outDir, locale)
    if (!fs.existsSync(localeDir)) continue
    for (const relLocal of walkHtml(localeDir)) {
      const rel = `${locale}/${relLocal}`
      const full = path.join(outDir, rel)
      const html = fs.readFileSync(full, 'utf8')
      const next = rewriteHtmlTag(html, locale)
      if (next === null) {
        // déjà correct OU aucune balise html/lang trouvée : on vérifie après coup
        const tag = html.match(/<html[^>]*>/)?.[0] ?? ''
        if (tag.includes(`lang="${locale}"`)) result[locale].alreadyOk += 1
        else result.errors.push(`${rel}: balise <html> sans lang reconnu («${tag.slice(0, 80)}»)`)
        continue
      }
      fs.writeFileSync(full, next)
      result[locale].fixed += 1
    }
  }
  return result
}

/** Vérification stricte : aucun .html sous en/ ou ar/ ne doit garder un autre lang. */
export function verifyHtmlLang(outDir) {
  const bad = []
  if (!fs.existsSync(outDir)) return ['out/ introuvable']
  const englishRoot = path.join(outDir, 'en.html')
  if (!fs.existsSync(englishRoot)) {
    bad.push('en.html absent — la page /en doit être générée par l’export statique')
  } else {
    const tag = fs.readFileSync(englishRoot, 'utf8').match(/<html[^>]*>/)?.[0] ?? ''
    if (!tag.includes('lang="en"')) bad.push(`en.html: «${tag.slice(0, 100)}»`)
  }
  for (const locale of ['en', 'ar']) {
    const localeDir = path.join(outDir, locale)
    if (!fs.existsSync(localeDir)) continue
    for (const relLocal of walkHtml(localeDir)) {
      const rel = `${locale}/${relLocal}`
      const tag = fs.readFileSync(path.join(outDir, rel), 'utf8').match(/<html[^>]*>/)?.[0] ?? ''
      if (!tag.includes(`lang="${locale}"`)) bad.push(`${rel}: «${tag.slice(0, 100)}»`)
      if (locale === 'ar' && !/\bdir="rtl"/.test(tag)) bad.push(`${rel}: dir="rtl" absent`)
    }
  }
  return bad
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  const outDir = path.resolve(process.argv[2] || path.join(ROOT, 'out'))
  const result = fixHtmlLang(outDir)
  console.log(
    `[fix-html-lang] en: ${result.en.fixed} corrigés, ${result.en.alreadyOk} déjà OK — ` +
      `ar: ${result.ar.fixed} corrigés, ${result.ar.alreadyOk} déjà OK`,
  )
  if (result.errors.length) {
    for (const e of result.errors) console.error(`[fix-html-lang] ERREUR ${e}`)
  }
  const bad = verifyHtmlLang(outDir)
  if (bad.length) {
    for (const b of bad.slice(0, 20)) console.error(`[fix-html-lang] VÉRIF ÉCHOUÉE ${b}`)
    console.error(`[fix-html-lang] ${bad.length} fichier(s) en/ar mal étiquetés après correction — abandon.`)
    process.exit(1)
  }
  console.log('[fix-html-lang] Vérification OK: lang et dir corrects sur en/ et ar/.')
}
