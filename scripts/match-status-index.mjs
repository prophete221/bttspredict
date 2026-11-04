import fs from 'node:fs'
import path from 'node:path'
import { generateMatchSlug } from '../src/lib/match-slug.ts'
import { isVipRow } from './public-predictions.mjs'

/**
 * Reproduit les règles de sélection horaires de loadAllMatches() : 14 archives,
 * puis le flux courant prioritaire; les lignes VIP ne créent pas de page Match.
 * Les fichiers lus ne sont jamais modifiés.
 */
export function loadMatchScheduleIndex(publicDir) {
  const matchBySlug = new Map()
  const ingest = (data, current = false) => {
    const rows = Array.isArray(data) ? data : (data?.free || data?.predictions || [])
    if (!Array.isArray(rows)) return
    const refreshed = new Set()
    for (const row of rows) {
      if (isVipRow(row)) continue
      const home = row?.home || ''
      const away = row?.away || ''
      const date = String(row?.date || '').slice(0, 10)
      if (!home || !away || !/^\d{4}-\d{2}-\d{2}$/.test(date)) continue
      const slug = generateMatchSlug(home, away, date)
      if (!matchBySlug.has(slug) || (current && !refreshed.has(slug))) {
        matchBySlug.set(slug, { date, time: row?.time || '' })
        refreshed.add(slug)
      }
    }
  }

  const archiveDir = path.join(publicDir, 'predictions-archive')
  if (fs.existsSync(archiveDir)) {
    const files = fs.readdirSync(archiveDir)
      .filter(name => name.endsWith('.json'))
      .sort()
      .slice(-14)
    for (const file of files) {
      try {
        ingest(JSON.parse(fs.readFileSync(path.join(archiveDir, file), 'utf8')))
      } catch {
        // Une archive illisible ne rend jamais une URL Match supprimable à elle seule.
      }
    }
  }

  const currentPath = path.join(publicDir, 'predictions.json')
  if (fs.existsSync(currentPath)) {
    try {
      ingest(JSON.parse(fs.readFileSync(currentPath, 'utf8')), true)
    } catch {
      // En cas de flux courant illisible, les archives restent la source de repli.
    }
  }
  return matchBySlug
}
