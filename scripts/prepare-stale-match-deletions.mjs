#!/usr/bin/env node
/**
 * Prépare un nettoyage FTPS très ciblé : uniquement les pages HTML Match
 * présentes sur le serveur, absentes de l’export actuel et terminées à Dakar.
 * Les autres fichiers absents de l’export sont consignés pour revue humaine,
 * jamais supprimés automatiquement.
 *
 * Appeler avec Node 22+ : node --experimental-strip-types ...
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getDakarDateString, getDakarMatchStatus } from '../src/lib/dakar-date.ts'
import { loadMatchScheduleIndex } from './match-status-index.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const protectedRemoteFiles = new Set(['.htaccess', 'robots.txt', 'sitemap.xml', 'deploy-manifest.json'])
const excludedReviewPrefixes = ['predeploy-backups/', 'ftp-diag/']

function readArgs() {
  const args = Object.fromEntries(process.argv.slice(2).map(arg => {
    const index = arg.indexOf('=')
    return index < 0 ? [arg.replace(/^--/, ''), 'true'] : [arg.slice(2, index), arg.slice(index + 1)]
  }))
  for (const name of ['inventory', 'current-manifest', 'output', 'review', 'delete-commands']) {
    if (!args[name]) throw new Error(`Argument requis : --${name}=...`)
  }
  return args
}

function parseMatchPagePath(remotePath) {
  // Next export produit normalement slug.html; index.html couvre une ancienne
  // configuration trailingSlash. Aucun asset, dossier ou chemin non-Match ne passe.
  const match = remotePath.match(/^(?:(en|ar)\/)?match\/([\p{L}\p{N}_-]+?)-(\d{4}-\d{2}-\d{2})(?:\.html|\/index\.html)$/u)
  if (!match) return null
  const [, locale, slug, date] = match
  const parsed = new Date(`${date}T00:00:00.000Z`)
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return null
  return { locale: locale || 'fr', slug: `${slug}-${date}`, date }
}

function main() {
  const args = readArgs()
  const inventoryPath = path.resolve(args.inventory)
  const manifestPath = path.resolve(args['current-manifest'])
  const outputPath = path.resolve(args.output)
  const reviewPath = path.resolve(args.review)
  const commandsPath = path.resolve(args['delete-commands'])
  const publicDir = path.resolve(args['public-dir'] || path.join(ROOT, 'public'))
  const now = args.now ? new Date(args.now) : new Date()
  if (Number.isNaN(now.getTime())) throw new Error('Valeur --now invalide')
  const today = getDakarDateString(now)

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  if (!manifest.files || typeof manifest.files !== 'object') throw new Error('Manifeste courant invalide')
  const currentFiles = new Set(Object.keys(manifest.files))
  const known = loadMatchScheduleIndex(publicDir)
  const remoteFiles = new Map()
  for (const line of fs.readFileSync(inventoryPath, 'utf8').split(/\r?\n/)) {
    if (!line.trim()) continue
    const [remotePath, kind, rawSize] = line.split('\t')
    if (kind !== 'F') continue
    const size = Number(rawSize)
    if (!remotePath || !Number.isFinite(size) || size < 0 || remoteFiles.has(remotePath)) {
      throw new Error(`Entrée d’inventaire invalide ou dupliquée : ${remotePath || '(vide)'}`)
    }
    remoteFiles.set(remotePath, size)
  }
  if (remoteFiles.size === 0) throw new Error('Inventaire FTP vide : refus de préparer des suppressions')

  const deletions = []
  const reviewCandidates = []
  let preservedUpcomingOrLiveMatch = 0
  for (const [remotePath, size] of remoteFiles) {
    // A path in the current export is retained, including a historical Match page.
    if (currentFiles.has(remotePath)) continue
    if (protectedRemoteFiles.has(remotePath)) continue
    const matchPath = parseMatchPagePath(remotePath)
    if (matchPath) {
      const matchData = known.get(matchPath.slug)
      const status = getDakarMatchStatus(matchData?.date || matchPath.date, matchData?.time, now)
      if (matchPath.locale === 'fr') {
        reviewCandidates.push({ path: remotePath, size, category: 'match-root-out-of-scope' })
      } else if (status === 'finished') {
        deletions.push({ path: remotePath, size, matchDate: matchPath.date, status })
      } else {
        preservedUpcomingOrLiveMatch += 1
        reviewCandidates.push({ path: remotePath, size, category: status === 'live' ? 'match-live-or-unknown' : 'match-upcoming-or-unknown' })
      }
      continue
    }
    if (excludedReviewPrefixes.some(prefix => remotePath.startsWith(prefix))) continue
    reviewCandidates.push({ path: remotePath, size, category: 'non-match-unverified' })
  }

  deletions.sort((a, b) => a.path.localeCompare(b.path))
  reviewCandidates.sort((a, b) => a.path.localeCompare(b.path))
  const totalBytes = deletions.reduce((sum, item) => sum + item.size, 0)
  const report = {
    generatedAt: now.toISOString(),
    timezone: 'Africa/Dakar',
    today,
    policy: 'Delete only remote HTML Match pages under en/match or ar/match that are absent from the current export and finished at Dakar. Never delete root match/, live/upcoming matches or unrelated files.',
    deletionCount: deletions.length,
    deletionBytes: totalBytes,
    deletions,
    preservedUpcomingOrLiveMatchCount: preservedUpcomingOrLiveMatch,
  }
  const review = {
    generatedAt: now.toISOString(),
    currentExportFileCount: currentFiles.size,
    remoteFileCount: remoteFiles.size,
    unverifiedOrphanCandidateCount: reviewCandidates.length,
    policy: 'Review only. Paths here are not automatically deleted because their lack of runtime or URL impact is not proven.',
    candidates: reviewCandidates,
  }
  const commandLines = deletions.map(item => `rm -f "${item.path}"`)
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.mkdirSync(path.dirname(reviewPath), { recursive: true })
  fs.mkdirSync(path.dirname(commandsPath), { recursive: true })
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`)
  fs.writeFileSync(reviewPath, `${JSON.stringify(review, null, 2)}\n`)
  fs.writeFileSync(commandsPath, commandLines.length ? `${commandLines.join('\n')}\n` : '')
  console.log(`[match-prune] Dakar=${today}; pages passées supprimables=${deletions.length} (${totalBytes} octets); candidats non-Match à revue manuelle=${reviewCandidates.length}; préservés à venir/en cours=${preservedUpcomingOrLiveMatch}`)
}

try {
  main()
} catch (error) {
  console.error(`[match-prune] Refus : ${error instanceof Error ? error.message : String(error)}`)
  process.exitCode = 1
}
