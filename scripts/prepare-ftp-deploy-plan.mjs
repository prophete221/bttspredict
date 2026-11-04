#!/usr/bin/env node
/**
 * Prépare une publication FTP-Deploy sans supprimer les fichiers distants absents
 * de l'export. L'état transmis à l'action ne contient que les fichiers/dossiers
 * encore présents localement; robots.txt et sitemap.xml sont volontairement
 * retirés de l'état pour forcer leur remplacement.
 *
 * Les seules suppressions sont calculées séparément à partir des listes live
 * des répertoires en/match et ar/match, puis appliquées par LFTP via le fichier
 * stale-match-delete.lftp. Aucun miroir ou nettoyage récursif n'est utilisé.
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const FORCE_UPLOAD = new Set(['robots.txt', 'sitemap.xml'])

function readArgs(argv = process.argv.slice(2)) {
  const args = Object.fromEntries(argv.map(arg => {
    const index = arg.indexOf('=')
    return index < 0 ? [arg.replace(/^--/, ''), 'true'] : [arg.slice(2, index), arg.slice(index + 1)]
  }))
  for (const name of ['state-safe', 'state-legacy', 'match-en', 'match-ar', 'out-dir', 'public-dir', 'state-seed']) {
    if (!args[name]) throw new Error(`Argument requis : --${name}=...`)
  }
  return args
}

export function normalizeStatePath(value) {
  if (typeof value !== 'string') throw new Error('Chemin de sync-state non textuel')
  let name = value.replaceAll('\\', '/').trim()
  while (name.startsWith('./')) name = name.slice(2)
  name = name.replace(/^\/+/, '').replace(/\/+$/, '')
  if (name === '.' || name === '') return ''
  const segments = name.split('/')
  if (segments.some(segment => segment === '..' || segment === '.' || segment === '')) {
    throw new Error(`Chemin dangereux dans le sync-state : ${value}`)
  }
  if (name.includes('\0')) throw new Error('Chemin nul dans le sync-state')
  return name
}

export function parseActionState(value, label = 'sync-state') {
  let state = value
  if (typeof value === 'string') {
    try { state = JSON.parse(value) } catch { throw new Error(`${label} JSON invalide`) }
  }
  if (!state || typeof state !== 'object' || state.version !== '1.0.0' || !Array.isArray(state.data)) {
    throw new Error(`${label} doit avoir version 1.0.0 et un tableau data`)
  }
  const seen = new Set()
  for (const entry of state.data) {
    if (!entry || typeof entry !== 'object' || !['file', 'folder'].includes(entry.type)) {
      throw new Error(`${label} contient un type d'entrée invalide`)
    }
    const name = normalizeStatePath(entry.name)
    if (!name) continue // L'entrée de racine éventuelle n'a pas de chemin à préserver.
    if (seen.has(`${entry.type}:${name}`)) throw new Error(`${label} contient un chemin dupliqué : ${name}`)
    seen.add(`${entry.type}:${name}`)
    if (typeof entry.size !== 'number' || !Number.isFinite(entry.size) || entry.size < 0) {
      throw new Error(`${label} contient une taille invalide : ${name}`)
    }
    if (entry.type === 'file' && (typeof entry.hash !== 'string' || !entry.hash)) {
      throw new Error(`${label} contient un hash de fichier invalide : ${name}`)
    }
  }
  return state
}

function chooseBaseState(safePath, legacyPath) {
  if (fs.existsSync(safePath) && fs.statSync(safePath).size > 0) {
    return { state: parseActionState(fs.readFileSync(safePath, 'utf8'), 'sync-state sûr distant'), source: 'safe' }
  }
  if (fs.existsSync(legacyPath) && fs.statSync(legacyPath).size > 0) {
    return { state: parseActionState(fs.readFileSync(legacyPath, 'utf8'), 'sync-state historique distant'), source: 'legacy' }
  }
  throw new Error('Aucun sync-state distant valide : arrêt sans publication ni suppression')
}

function validateRelativePath(value, label) {
  const normalized = normalizeStatePath(value)
  if (!normalized || normalized !== value) throw new Error(`${label} invalide : ${value}`)
  return normalized
}

export function buildSafeStateSeed(baseState, manifest, forceUploadPaths = [...FORCE_UPLOAD]) {
  if (!manifest || typeof manifest.files !== 'object' || !manifest.files) throw new Error('Manifeste local invalide')
  const localFiles = new Set(Object.keys(manifest.files).map(name => validateRelativePath(name, 'Chemin du manifeste')))
  if (!localFiles.has('robots.txt') || !localFiles.has('sitemap.xml') || !localFiles.has('.htaccess')) {
    throw new Error('Le manifeste doit contenir .htaccess, robots.txt et sitemap.xml')
  }
  // Le fichier de manifeste reste un fichier public historique publié à la racine,
  // même s'il s'exclut de son propre manifeste pour éviter une récursion.
  localFiles.add('deploy-manifest.json')
  const localFolders = new Set()
  for (const name of localFiles) {
    let parent = path.posix.dirname(name)
    while (parent && parent !== '.') {
      localFolders.add(parent)
      parent = path.posix.dirname(parent)
    }
  }
  const forced = new Set(forceUploadPaths)
  const retained = []
  let droppedRemoteOnly = 0
  let droppedForceUpload = 0
  for (const entry of baseState.data) {
    const name = normalizeStatePath(entry.name)
    if (!name) continue
    if (entry.type === 'file' && forced.has(name)) {
      droppedForceUpload += 1
      continue
    }
    const isPresent = entry.type === 'file' ? localFiles.has(name) : localFolders.has(name)
    if (isPresent) retained.push(entry)
    else droppedRemoteOnly += 1
  }
  const state = { ...baseState, version: '1.0.0', data: retained }
  const retainedPaths = retained.map(entry => `${entry.type}:${normalizeStatePath(entry.name)}`)
  if (retainedPaths.some(key => key.endsWith(':robots.txt') || key.endsWith(':sitemap.xml'))) {
    throw new Error('robots.txt ou sitemap.xml serait resté dans l’état, upload forcé non garanti')
  }
  return {
    state,
    report: {
      baseRecordCount: baseState.data.length,
      retainedRecordCount: retained.length,
      droppedRemoteOnlyRecordCount: droppedRemoteOnly,
      forcedUploadStateRecordCount: droppedForceUpload,
      forcedUploadPaths: [...forced].sort(),
      currentExportFileCount: localFiles.size,
      policy: 'L’état remis à FTP-Deploy ne contient que les chemins encore présents dans l’export; aucun fichier distant absent du build ne peut être supprimé par l’action. robots.txt et sitemap.xml sont forcés à l’upload. Les suppressions Match sont séparées et ciblées par LFTP.',
    },
  }
}

export function parseMatchListing(text, locale) {
  if (!['en', 'ar'].includes(locale)) throw new Error(`Locale Match hors périmètre : ${locale}`)
  const expected = `${locale}/match/`
  const results = new Set()
  for (const rawLine of text.split(/\r?\n/)) {
    let line = rawLine.replace(/\x1b\[[0-9;]*m/g, '').trim()
    if (!line) continue
    if (/(?:find|list|access)\s+failed|\b550\b|permission denied/i.test(line)) {
      throw new Error(`Listing ${locale}/match invalide : ${line}`)
    }
    line = line.replace(/^['"]|['"]$/g, '').replaceAll('\\', '/')
    const marker = `${locale}/match/`
    const index = line.lastIndexOf(marker)
    let relative
    if (index >= 0) {
      relative = line.slice(index + marker.length)
    } else {
      line = line.replace(/^\.\/+/, '').replace(/^\/+/, '')
      if (line === `${locale}/match` || line === expected.slice(0, -1) || line.endsWith('/')) continue
      if (/^(?:en|ar)\/match\//.test(line)) {
        throw new Error(`Listing ${locale}/match contient une autre locale : ${line}`)
      }
      if (line.includes(':') && !line.endsWith('.html')) continue // messages de connexion LFTP
      relative = line
    }
    if (!relative || relative.endsWith('/')) continue
    if (relative.split('/').some(segment => segment === '..' || segment === '.')) {
      throw new Error(`Chemin dangereux dans le listing ${locale}/match : ${rawLine}`)
    }
    const remotePath = `${expected}${relative}`
    if (!remotePath.toLowerCase().endsWith('.html')) continue
    if (!remotePath.startsWith(expected)) throw new Error(`Chemin Match hors périmètre : ${remotePath}`)
    if (results.has(remotePath)) throw new Error(`Chemin Match dupliqué : ${remotePath}`)
    results.add(remotePath)
  }
  return [...results].sort()
}

function runNode(args) {
  execFileSync(process.execPath, args, { cwd: ROOT, stdio: 'inherit', env: process.env })
}

function main() {
  const args = readArgs()
  const outDir = path.resolve(ROOT, args['out-dir'])
  const publicDir = path.resolve(ROOT, args['public-dir'])
  const predeployDir = path.join(outDir, 'predeploy-backups')
  const stateSafePath = path.resolve(args['state-safe'])
  const stateLegacyPath = path.resolve(args['state-legacy'])
  const matchEnPath = path.resolve(args['match-en'])
  const matchArPath = path.resolve(args['match-ar'])
  const stateSeedPath = path.resolve(args['state-seed'])
  const currentManifestPath = path.join(outDir, 'deploy-manifest.json')
  const previousSitemapPath = path.join(predeployDir, 'sitemap.xml')
  const now = args.now || new Date().toISOString()
  if (Number.isNaN(new Date(now).getTime())) throw new Error('--now invalide')

  for (const file of [matchEnPath, matchArPath]) {
    if (!fs.existsSync(file)) {
      throw new Error(`Preuve locale de pré-déploiement absente ou vide : ${file}`)
    }
  }
  for (const file of [
    path.join(predeployDir, '.htaccess'),
    path.join(predeployDir, 'robots.txt'),
    previousSitemapPath,
    currentManifestPath,
  ]) {
    if (!fs.existsSync(file) || fs.statSync(file).size === 0) {
      throw new Error(`Preuve locale de pré-déploiement absente ou vide : ${file}`)
    }
  }

  const enPaths = parseMatchListing(fs.readFileSync(matchEnPath, 'utf8'), 'en')
  const arPaths = parseMatchListing(fs.readFileSync(matchArPath, 'utf8'), 'ar')
  const combinedPaths = [...enPaths, ...arPaths]
  if (new Set(combinedPaths).size !== combinedPaths.length) throw new Error('Doublon entre les listings Match EN/AR')

  // Préserver à l'octet près le .htaccess distant : les changements de ce fichier
  // ne sont pas dans le périmètre autorisé.
  const remoteHtaccess = fs.readFileSync(path.join(predeployDir, '.htaccess'))
  fs.writeFileSync(path.join(outDir, '.htaccess'), remoteHtaccess)

  const { state: baseState, source: baseStateSource } = chooseBaseState(stateSafePath, stateLegacyPath)
  const baseByPath = new Map()
  for (const entry of baseState.data) {
    const name = normalizeStatePath(entry.name)
    if (name && entry.type === 'file') baseByPath.set(name, entry)
  }
  const inventoryPath = path.join(outDir, 'remote-inventory.tsv')
  const inventoryLines = combinedPaths.map(remotePath => `${remotePath}\tF\t${Number(baseByPath.get(remotePath)?.size || 0)}`)
  fs.writeFileSync(inventoryPath, inventoryLines.length ? `${inventoryLines.join('\n')}\n` : '')

  runNode([
    '--experimental-strip-types', 'scripts/prepare-stale-match-deletions.mjs',
    `--inventory=${inventoryPath}`,
    `--current-manifest=${currentManifestPath}`,
    `--output=${path.join(outDir, 'stale-match-pages.json')}`,
    `--review=${path.join(outDir, 'orphan-review.json')}`,
    `--delete-commands=${path.join(outDir, 'stale-match-delete.lftp')}`,
    `--public-dir=${publicDir}`,
    `--now=${now}`,
  ])

  const staleReport = JSON.parse(fs.readFileSync(path.join(outDir, 'stale-match-pages.json'), 'utf8'))
  if (!Array.isArray(staleReport.deletions) || staleReport.deletions.some(item => !/^(?:en|ar)\/match\//.test(item.path))) {
    throw new Error('Le plan de suppression dépasse /en/match ou /ar/match')
  }

  runNode([
    '--experimental-strip-types', 'scripts/filter-sitemap-match-urls.mjs',
    `--input=${path.join(outDir, 'sitemap.xml')}`,
    `--previous=${previousSitemapPath}`,
    `--deletions=${path.join(outDir, 'stale-match-pages.json')}`,
    `--current-manifest=${currentManifestPath}`,
    `--output=${path.join(outDir, 'sitemap.xml')}`,
    `--report=${path.join(outDir, 'sitemap-match-filter.json')}`,
    `--public-dir=${publicDir}`,
    `--now=${now}`,
  ])

  // Le sitemap filtré et le .htaccess préservé doivent refléter les empreintes
  // qui seront réellement publiées.
  runNode(['scripts/ftp-diff.mjs', 'manifest'])
  const manifest = JSON.parse(fs.readFileSync(currentManifestPath, 'utf8'))
  const { state: seedState, report: stateReport } = buildSafeStateSeed(baseState, manifest)
  const localHtaccess = fs.readFileSync(path.join(outDir, '.htaccess'))
  if (!remoteHtaccess.equals(localHtaccess)) throw new Error('.htaccess local diffère encore de la sauvegarde distante')

  fs.mkdirSync(path.dirname(stateSeedPath), { recursive: true })
  fs.writeFileSync(stateSeedPath, `${JSON.stringify(seedState)}\n`)
  stateReport.baseStateSource = baseStateSource
  stateReport.liveEnMatchHtmlCount = enPaths.length
  stateReport.liveArMatchHtmlCount = arPaths.length
  stateReport.targetedFinishedMatchDeleteCount = staleReport.deletionCount
  stateReport.targetedFinishedMatchDeleteBytes = staleReport.deletionBytes
  stateReport.robotsSource = 'build/public/robots.txt; its state entry is omitted so the new content is uploaded'
  stateReport.sitemapSource = 'build sitemap merged with the previous remote sitemap; only removed EN/AR Match targets are filtered; its state entry is omitted so the new content is uploaded'
  fs.writeFileSync(path.join(outDir, 'ftp-action-state-report.json'), `${JSON.stringify(stateReport, null, 2)}\n`)

  console.log(`[ftp-plan] state=${baseStateSource}; local=${stateReport.currentExportFileCount} published paths; ${stateReport.retainedRecordCount}/${stateReport.baseRecordCount} state records retained; ${stateReport.droppedRemoteOnlyRecordCount} remote-only records excluded from action; force uploads=${[...FORCE_UPLOAD].join(', ')}`)
  console.log(`[ftp-plan] live Match listings: en=${enPaths.length}, ar=${arPaths.length}; finished HTML targeted for LFTP deletion=${staleReport.deletionCount}; root /match is not inventoried or deleted`)
}

const directPath = process.argv[1] ? path.resolve(process.argv[1]) : ''
if (directPath === fileURLToPath(import.meta.url)) {
  try { main() } catch (error) {
    console.error(`[ftp-plan] Refus : ${error instanceof Error ? error.message : String(error)}`)
    process.exitCode = 1
  }
}
