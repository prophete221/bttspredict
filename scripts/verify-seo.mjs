#!/usr/bin/env node
/**
 * Post-build metadata audit.
 *
 * Google does not prescribe fixed character limits for title links or meta
 * descriptions. Google may also generate a query-specific snippet from page
 * content. This audit therefore checks for a usable title element and reports
 * metadata coverage; it does not fail a build because text exceeds an arbitrary
 * character count.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const OUT_DIR = join(__dirname, '..', 'out')

function listHtmlFiles(dir, accumulator = []) {
  const entries = readdirSync(dir)
  for (const entry of entries) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) listHtmlFiles(full, accumulator)
    else if (entry.endsWith('.html')) accumulator.push(full)
  }
  return accumulator
}

function extractTitle(html) {
  return html.match(/<title[^>]*>([\\s\\S]*?)<\\/title>/i)?.[1]?.trim() ?? null
}

function extractDescription(html) {
  return html.match(/<meta\\s+name=["']description["']\\s+content=["']([^"']*)["']/i)?.[1]?.trim() ?? null
}

function main() {
  try {
    const files = listHtmlFiles(OUT_DIR)
    if (files.length === 0) {
      console.error('❌ Aucun fichier HTML trouvé dans out/.')
      process.exit(1)
    }

    const missingTitles = []
    let descriptions = 0
    const titleCounts = new Map()

    for (const file of files) {
      const html = readFileSync(file, 'utf8')
      const relPath = file.slice(OUT_DIR.length + 1)
      const title = extractTitle(html)
      const description = extractDescription(html)

      if (!title) missingTitles.push(relPath)
      else titleCounts.set(title, (titleCounts.get(title) ?? 0) + 1)

      if (description) descriptions += 1
    }

    console.log(`🔎 Audit metadata : ${files.length} pages HTML analysées.`)
    console.log(`   Titles présents : ${files.length - missingTitles.length}/${files.length}`)
    console.log(`   Meta descriptions présentes : ${descriptions}/${files.length}`)
    console.log('   Aucune limite fixe de caractères appliquée aux titles ou descriptions.')

    if (missingTitles.length > 0) {
      console.error('❌ Pages sans title exploitable :')
      for (const file of missingTitles) console.error(`   - ${file}`)
      process.exit(1)
    }

    const duplicates = [...titleCounts.entries()].filter(([, count]) => count > 1)
    if (duplicates.length > 0) {
      console.warn(`⚠️ ${duplicates.length} title(s) identique(s) détecté(s) : à examiner manuellement.`)
    }
    console.log('✅ Audit metadata terminé.')
  } catch (error) {
    console.error('❌ Audit metadata impossible :', error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

main()
