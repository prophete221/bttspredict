import fs from 'fs'
import path from 'path'
import { runWinHistory } from '../../../scripts/update-win-history.mjs'
import { buildStrictGeminiHistoryProjection } from '../../../scripts/gemini-history-export.mjs'

let cached: any | null | undefined

/** Read-only public projection: source JSON and archive files are never rewritten here. */
export function getWinHistory() {
  if (cached !== undefined) return cached
  try {
    const sourceHistoryPath = path.join(process.cwd(), 'public', 'win-history.json')
    const archiveDir = path.join(process.cwd(), 'public', 'predictions-archive')
    const payload = JSON.parse(fs.readFileSync(sourceHistoryPath, 'utf8'))
    const archiveFiles = fs.readdirSync(archiveDir)
      .filter(name => name.endsWith('.json'))
      .sort()
    const archiveRows = archiveFiles.flatMap(name => {
      try {
        const archived = JSON.parse(fs.readFileSync(path.join(archiveDir, name), 'utf8'))
        return Array.isArray(archived.predictions) ? archived.predictions : []
      } catch {
        return []
      }
    })
    const generatedTime = Date.parse(payload.generatedAt || '')
    const asOf = Number.isFinite(generatedTime) ? generatedTime : Date.now()
    const fullRun = runWinHistory({ write: false, dir: archiveDir, now: asOf, includeFullHistory: true })
    const fullHistory = Array.isArray(fullRun?.auditFullHistory)
      ? fullRun.auditFullHistory
      : (Array.isArray(payload.history) ? payload.history : [])

    cached = buildStrictGeminiHistoryProjection({
      payload,
      fullHistory,
      archiveRows,
      archivesRead: archiveFiles.length,
      sourceStats: fullRun?.stats || payload.stats || {},
    })
    return cached
  } catch {
    cached = null
    return null
  }
}
