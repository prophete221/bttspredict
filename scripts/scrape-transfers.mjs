// ═══════════════════════════════════════════════════════════════════════════
// BTTSPredict — Transfers Scraper v2 (honnête) — 2026-09-28
// ═══════════════════════════════════════════════════════════════════════════
// Source : flux RSS public BBC Sport (transferts, sans clé API).
// Aucun transfert n'est inventé : si la source est indisponible, le fichier
// publié est { "status": "unavailable" } — JAMAIS de fausses données re-datées
// du jour (l'ancien fallback "curated + rotation quotidienne" est supprimé).
// Aucun composant du site ne consomme transfers.json : ce fichier est
// uniquement publié tel quel.
// ═══════════════════════════════════════════════════════════════════════════

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'transfers.json')

// ─── Fetch BBC Sport transfers RSS ─────────────────────────────────────
async function tryFetchBBC() {
  try {
    const res = await fetch('https://feeds.bbci.co.uk/sport/football/transfers/rss.xml', {
      headers: { 'User-Agent': 'BTTSPredict-Scraper/2.0' },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const xml = await res.text()

    // Parse RSS items (simple regex, no DOM parser needed)
    const items = []
    const matches = xml.matchAll(/<item>\s*<title>(.*?)<\/title>\s*<link>(.*?)<\/link>\s*<description>(.*?)<\/description>\s*<pubDate>(.*?)<\/pubDate>/gs)

    for (const match of matches) {
      const [, title, link, , pubDate] = match
      const titleClean = title.replace(/<!\[CDATA\[|\]\]>/g, '').trim()
      items.push({
        title: titleClean,
        date: pubDate.trim(),
        league: 'Football',
        source: 'BBC Sport',
        link: link.replace(/<!\[CDATA\[|\]\]>/g, '').trim(),
      })
    }

    if (items.length > 0) {
      console.log(`✓ BBC: fetched ${items.length} transfer news items`)
      return items.slice(0, 20)
    }
  } catch (err) {
    console.warn(`⚠ BBC fetch failed: ${err.message}`)
  }
  return null
}

// ─── Main ──────────────────────────────────────────────────────────────
async function main() {
  console.log('🔄 BTTSPredict Transfers Scraper v2 — starting...')

  const transfers = await tryFetchBBC()

  if (!transfers || transfers.length === 0) {
    // Honnête : pas de source → pas de données publiées.
    const unavailable = {
      status: 'unavailable',
      reason: 'no_public_source_available',
      updatedAt: new Date().toISOString(),
      count: 0,
      transfers: [],
    }
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(unavailable, null, 2))
    console.log(`✓ Wrote status:unavailable to ${OUTPUT_FILE}`)
    process.exit(0)
  }

  const output = {
    status: 'ok',
    source: 'BBC Sport transfers RSS',
    updatedAt: new Date().toISOString(),
    count: transfers.length,
    transfers,
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2))
  console.log(`✓ Saved ${transfers.length} transfer news items to ${OUTPUT_FILE}`)
}

main().catch(err => {
  console.error('❌ Scraper failed:', err)
  // Ne jamais écrire de fausses données — état honnête même en cas d'échec.
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({
    status: 'unavailable',
    reason: `scraper_error: ${err?.message || 'unknown'}`,
    updatedAt: new Date().toISOString(),
    count: 0,
    transfers: [],
  }, null, 2))
  console.log('✓ status:unavailable written (no fake data)')
  process.exit(0)
})
