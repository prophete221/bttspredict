#!/usr/bin/env node
/**
 * Rapport SEO complet — affiche tous les titles + descriptions + longueurs.
 * Usage: node scripts/seo-report.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const OUT_DIR = join(__dirname, '..', 'out')

function listHtmlFiles(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e)
    const st = statSync(full)
    if (st.isDirectory()) listHtmlFiles(full, acc)
    else if (e.endsWith('.html')) acc.push(full)
  }
  return acc
}

function decodeEntities(s) {
  return s
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
}

const files = listHtmlFiles(OUT_DIR).sort()
console.log(`\n📊 RAPPORT SEO — ${files.length} pages\n`)
console.log('Page'.padEnd(55) + 'Title len'.padEnd(11) + 'Desc len')
console.log('-'.repeat(80))

for (const f of files) {
  const html = readFileSync(f, 'utf8')
  const rel = f.replace(OUT_DIR + '/', '').replace(OUT_DIR + '\\', '')
  const tm = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  const dm = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)
  const title = tm ? decodeEntities(tm[1]) : ''
  const desc = dm ? decodeEntities(dm[1]) : ''
  const tFlag = title.length > 60 ? (title.length > 70 ? '❌' : '⚠') : '✅'
  const dFlag = desc.length > 150 ? (desc.length > 160 ? '❌' : '⚠') : '✅'
  console.log(
    rel.padEnd(55) +
    `${tFlag} ${String(title.length).padEnd(7)}` +
    `${dFlag} ${desc.length}`
  )
}
console.log('')
