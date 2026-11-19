import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { publicPredictionPayload } from './public-predictions.mjs'
import { buildStrictGeminiHistoryProjection } from './gemini-history-export.mjs'
import { runWinHistory } from './update-win-history.mjs'

export function sanitizePublicData(root, { staticExport = false, sourcePublicDir = path.resolve('public') } = {}) {
  let changed = 0
  const files = ['predictions.json']
  const archiveDir = path.join(root, 'predictions-archive')
  if (fs.existsSync(archiveDir)) {
    files.push(...fs.readdirSync(archiveDir).filter(file => file.endsWith('.json')).map(file => `predictions-archive/${file}`))
  }
  for (const relative of files) {
    const file = path.join(root, relative)
    if (!fs.existsSync(file)) continue
    const payload = JSON.parse(fs.readFileSync(file, 'utf8'))
    // Les archives conservent leurs pronostics gratuits originaux comme preuve.
    // Le flux courant ne présente plus d'anciens chiffres rédigés par Gemini.
    const safe = publicPredictionPayload(payload, { retireLegacyAiNumbers: relative === 'predictions.json' })
    if (JSON.stringify(payload) !== JSON.stringify(safe)) {
      fs.writeFileSync(file, JSON.stringify(safe, null, 2) + '\n')
      changed++
    }
  }
  const combosPath = path.join(root, 'vip-combos.json')
  if (fs.existsSync(combosPath)) {
    const original = JSON.parse(fs.readFileSync(combosPath, 'utf8'))
    const safe = { date: original.date, timezone: 'Africa/Dakar', status: 'unavailable', reason: 'Les sélections privées ne sont pas distribuées par cet export statique.', combos: [] }
    if (JSON.stringify(original) !== JSON.stringify(safe)) {
      fs.writeFileSync(combosPath, JSON.stringify(safe, null, 2) + '\n')
      changed++
    }
  }
  if (staticExport) {
    const sourceHistoryPath = path.join(sourcePublicDir, 'win-history.json')
    const sourceArchiveDir = path.join(sourcePublicDir, 'predictions-archive')
    const exportHistoryPath = path.join(root, 'win-history.json')
    if (fs.existsSync(sourceHistoryPath) && fs.existsSync(sourceArchiveDir) && fs.existsSync(exportHistoryPath)) {
      const payload = JSON.parse(fs.readFileSync(sourceHistoryPath, 'utf8'))
      const archiveFiles = fs.readdirSync(sourceArchiveDir).filter(file => file.endsWith('.json')).sort()
      const archiveRows = archiveFiles.flatMap(file => {
        try {
          const archived = JSON.parse(fs.readFileSync(path.join(sourceArchiveDir, file), 'utf8'))
          return Array.isArray(archived.predictions) ? archived.predictions : []
        } catch {
          return []
        }
      })
      const generatedAt = Date.parse(payload.generatedAt || '')
      const now = Number.isFinite(generatedAt) ? generatedAt : Date.now()
      const fullRun = runWinHistory({ write: false, dir: sourceArchiveDir, now, includeFullHistory: true })
      const safe = buildStrictGeminiHistoryProjection({
        payload,
        fullHistory: Array.isArray(fullRun?.auditFullHistory) ? fullRun.auditFullHistory : (payload.history || []),
        archiveRows,
        archivesRead: archiveFiles.length,
        sourceStats: fullRun?.stats || payload.stats || {},
      })
      const current = JSON.parse(fs.readFileSync(exportHistoryPath, 'utf8'))
      if (JSON.stringify(current) !== JSON.stringify(safe)) {
        fs.writeFileSync(exportHistoryPath, JSON.stringify(safe, null, 2) + '\n')
        changed++
      }
    }
  }
  return changed
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const root = path.resolve(process.argv[2] || 'public')
  if (!fs.existsSync(root)) throw new Error(`Répertoire absent : ${root}`)
  const staticExport = process.argv.includes('--static-export')
  console.log(`Protection publique : ${sanitizePublicData(root, { staticExport })} fichier(s) nettoyé(s) dans ${root}`)
}
