#!/usr/bin/env node
/**
 * Post-build SEO verification — anti-récidive.
 *
 * Scanne tous les fichiers HTML statiques générés par Next.js dans `out/`
 * et THROW si un title ou une description dépasse les limites Bing.
 *
 * Limites "hard" (avec marge) :
 *   - title    : HARD_MAX_TITLE = 70 chars (Bing coupe à 60)
 *   - description : HARD_MAX_DESC = 160 chars (Bing coupe à 155)
 *
 * À lancer après `npm run build` :
 *   node scripts/verify-seo.mjs
 *
 * Exit codes:
 *   0 = OK
 *   1 = au moins une page hors limites
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const OUT_DIR = join(__dirname, '..', 'out')

const HARD_MAX_TITLE = 70
const HARD_MAX_DESC = 160

/** Récupère tous les fichiers .html dans out/ (récursif) */
function listHtmlFiles(dir, accumulator = []) {
  const entries = readdirSync(dir)
  for (const entry of entries) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      listHtmlFiles(full, accumulator)
    } else if (entry.endsWith('.html')) {
      accumulator.push(full)
    }
  }
  return accumulator
}

/** Extrait le <title> d'un document HTML */
function extractTitle(html) {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  return m ? m[1] : null
}

/** Extrait la <meta name="description" content="..."> */
function extractDescription(html) {
  // Next.js rend : <meta name="description" content="..."/>
  const m = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)
  return m ? m[1] : null
}

function main() {
  if (!statSync(OUT_DIR, { throwIfNoEntry: false })) {
    console.error(`❌ Dossier out/ introuvable — lancez "npm run build" d'abord.`)
    process.exit(1)
  }

  const files = listHtmlFiles(OUT_DIR)
  if (files.length === 0) {
    console.error(`❌ Aucun fichier .html trouvé dans out/`)
    process.exit(1)
  }

  console.log(`\n🔍 Audit SEO — ${files.length} fichiers HTML scannés`)
  console.log(`   Limites hard: title ≤ ${HARD_MAX_TITLE}, description ≤ ${HARD_MAX_DESC}\n`)

  const violations = []

  for (const file of files) {
    const html = readFileSync(file, 'utf8')
    const relPath = file.replace(OUT_DIR + '/', '').replace(OUT_DIR + '\\', '')

    const title = extractTitle(html)
    const desc = extractDescription(html)

    if (title !== null && title.length > HARD_MAX_TITLE) {
      violations.push({
        file: relPath,
        type: 'title',
        length: title.length,
        value: title,
      })
    }

    if (desc !== null && desc.length > HARD_MAX_DESC) {
      violations.push({
        file: relPath,
        type: 'description',
        length: desc.length,
        value: desc,
      })
    }
  }

  if (violations.length === 0) {
    console.log(`✅ Aucune violation SEO détectée. Toutes les pages respectent les limites Bing.`)
    process.exit(0)
  }

  console.error(`\n❌ ${violations.length} violation(s) SEO détectée(s):\n`)
  for (const v of violations) {
    console.error(`   ${v.file}`)
    console.error(`     ${v.type} = ${v.length} chars (max ${v.type === 'title' ? HARD_MAX_TITLE : HARD_MAX_DESC})`)
    console.error(`     "${v.value}"`)
    console.error('')
  }
  process.exit(1)
}

main()
