#!/usr/bin/env node
/**
 * Prépare une publication FTP-Deploy sans supprimer les fichiers distants absents
 * de l'export. L'état transmis à l'action ne contient que les fichiers/dossiers
 * encore présents localement; robots.txt et sitemap.xml sont volontairement
 * retirés de l'état pour forcer leur remplacement.
 *
 * Aucun chemin EN ou FR n'est supprimé. Les candidats AR proviennent uniquement
 * des 36 slugs locaux et du manifeste de référence; leur présence FTP est
 * vérifiée individuellement après activation et contrôle de la route popup.
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
  for (const name of ['state-safe', 'state-legacy', 'out-dir', 'public-dir', 'state-seed']) {
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
  const normalizedData = []
  for (const entry of state.data) {
    if (!entry || typeof entry !== 'object' || !['file', 'folder'].includes(entry.type)) {
      throw new Error(`${label} contient un type d'entrée invalide`)
    }
    const name = normalizeStatePath(entry.name)
    if (!name) {
      normalizedData.push(entry)
      continue // L'entrée de racine éventuelle n'a pas de chemin à préserver.
    }
    if (seen.has(`${entry.type}:${name}`)) throw new Error(`${label} contient un chemin dupliqué : ${name}`)
    seen.add(`${entry.type}:${name}`)
    if (entry.type === 'folder') {
      // FTP-Deploy 1.0.0 serializes IFolder as { type, name }; size/hash are file-only.
      const folder = { ...entry }
      delete folder.size
      delete folder.hash
      normalizedData.push(folder)
      continue
    }
    if (typeof entry.size !== 'number' || !Number.isFinite(entry.size) || entry.size < 0) {
      throw new Error(`${label} contient une taille invalide : ${name}`)
    }
    if (typeof entry.hash !== 'string' || !entry.hash) {
      throw new Error(`${label} contient un hash de fichier invalide : ${name}`)
    }
    normalizedData.push(entry)
  }
  return { ...state, data: normalizedData }
}

export function chooseBaseState(safePath, legacyPath) {
  if (fs.existsSync(safePath) && fs.statSync(safePath).size > 0) {
    return { state: parseActionState(fs.readFileSync(safePath, 'utf8'), 'sync-state sûr distant'), source: 'safe' }
  }
  if (fs.existsSync(legacyPath) && fs.statSync(legacyPath).size > 0) {
    return { state: parseActionState(fs.readFileSync(legacyPath, 'utf8'), 'sync-state historique distant'), source: 'legacy' }
  }
  throw new Error('État FTP distant introuvable ou invalide : ni .ftp-deploy-sync-state-safe.json ni .ftp-deploy-sync-state.json n’est valide; arrêt fermé avant tout transfert et toute suppression')
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
  const stateSeedPath = path.resolve(args['state-seed'])
  const currentManifestPath = path.join(outDir, 'deploy-manifest.json')
  const previousManifestPath = path.join(outDir, 'deploy-manifest.prev.json')
  const previousSitemapPath = path.join(predeployDir, 'sitemap.xml')
  const now = args.now || new Date().toISOString()
  if (Number.isNaN(new Date(now).getTime())) throw new Error('--now invalide')

  for (const file of [
    path.join(predeployDir, 'robots.txt'),
    previousSitemapPath,
    previousManifestPath,
    currentManifestPath,
  ]) {
    if (!fs.existsSync(file) || fs.statSync(file).size === 0) {
      throw new Error(`Preuve locale de pré-déploiement absente ou vide : ${file}`)
    }
  }

  const previousManifest = JSON.parse(fs.readFileSync(previousManifestPath, 'utf8'))
  if (!previousManifest.files || typeof previousManifest.files !== 'object') throw new Error('Manifeste de référence invalide')
  const { state: baseState, source: baseStateSource } = chooseBaseState(stateSafePath, stateLegacyPath)
  const inventoryPath = path.join(outDir, 'match-only-inventory.tsv')
  const matchPagePattern = /^(?:(?:en|ar)\/)?match\/[\p{L}\p{N}_-]+-\d{4}-\d{2}-\d{2}(?:\.html|\/index\.html)$/u
  const inventoryLines = Object.entries(previousManifest.files)
    .filter(([remotePath]) => matchPagePattern.test(remotePath))
    .map(([remotePath, metadata]) => `${remotePath}\tF\t${Number(metadata?.size || 0)}`)
  if (inventoryLines.length === 0) throw new Error('Le manifeste local précédent ne contient aucune page Match; arrêt fermé')
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
  if (!Array.isArray(staleReport.deletions) || staleReport.deletions.length !== 0) {
    throw new Error('Le plan pré-déploiement doit préserver toutes les pages Match; aucune suppression anticipée n’est permise')
  }

  runNode([
    'scripts/prepare-ar-match-popup-cleanup.mjs', 'plan',
    `--manifest=${previousManifestPath}`,
    `--current-manifest=${currentManifestPath}`,
    '--slugs=src/data/legacy-ar-match-slugs.json',
    `--plan=${path.join(outDir, 'ar-match-popup-cleanup-plan.json')}`,
    `--commands=${path.join(outDir, 'ar-match-popup-cleanup.lftp')}`,
  ])
  const arCleanupPlan = JSON.parse(fs.readFileSync(path.join(outDir, 'ar-match-popup-cleanup-plan.json'), 'utf8'))
  if (!Array.isArray(arCleanupPlan.candidates) || arCleanupPlan.candidateCount !== arCleanupPlan.candidates.length ||
    !Array.isArray(arCleanupPlan.deletions) || arCleanupPlan.deletions.length !== 0 || arCleanupPlan.deletionCount !== 0 ||
    arCleanupPlan.candidates.some(item => !/^ar\/match\//.test(item.path))) {
    throw new Error('Le plan candidat AR est invalide ou contient une suppression pré-route')
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

  // Le sitemap filtré doit refléter l'empreinte réellement publiée. .htaccess
  // reste celui du build et est exclu de l'action FTPS; il est remplacé ensuite
  // par l'ancienne méthode LFTP temporaire + rename, après réussite de l'upload.
  runNode(['scripts/ftp-diff.mjs', 'manifest'])
  const codeOnlyMode = process.env.CODE_ONLY_MODE === 'true'
  const historyJsonMode = process.env.HISTORY_JSON_MODE === 'true'
  if (historyJsonMode && !codeOnlyMode) throw new Error('HISTORY_JSON_MODE exige CODE_ONLY_MODE=true')
  const diffArgs = ['scripts/ftp-diff.mjs', 'prepare', '--require-prev', '--allow-legacy-v1']
  if (codeOnlyMode) diffArgs.push('--code-only')
  if (historyJsonMode) diffArgs.push('--history-json-only', '--force-path=win-history.json', '--force-path=history-exclusions.json')
  runNode(diffArgs)
  const diffStatsPath = path.join(outDir, 'deploy-diff-stats.json')
  const diffStats = JSON.parse(fs.readFileSync(diffStatsPath, 'utf8'))
  if (diffStats.codeOnlyMode !== codeOnlyMode) throw new Error('Le mode du diff ne correspond pas au mode de déploiement')
  if (diffStats.historyJsonMode !== historyJsonMode) throw new Error('Le mode history-json du diff ne correspond pas au mode de déploiement')
  runNode([
    'scripts/prepare-ftp-upload-allowlist.mjs', 'plan',
    `--manifest=${currentManifestPath}`,
    `--diff-stats=${diffStatsPath}`,
    `--script-file=${path.join(outDir, 'deploy-upload-commands.lftp')}`,
    `--plan=${path.join(outDir, 'deploy-upload-plan.json')}`,
    `--code-only=${codeOnlyMode}`,
    `--history-json-only=${historyJsonMode}`,
  ])
  const manifest = JSON.parse(fs.readFileSync(currentManifestPath, 'utf8'))
  const { state: seedState, report: stateReport } = buildSafeStateSeed(baseState, manifest)

  fs.mkdirSync(path.dirname(stateSeedPath), { recursive: true })
  fs.writeFileSync(stateSeedPath, `${JSON.stringify(seedState)}\n`)
  stateReport.baseStateSource = baseStateSource
  stateReport.liveEnMatchHtmlCount = null
  stateReport.liveArMatchHtmlCount = null
  stateReport.enMatchInventorySkipped = true
  stateReport.targetedFinishedMatchDeleteCount = 0
  stateReport.targetedFinishedMatchDeleteBytes = 0
  stateReport.arMatchRemoteFileCount = null
  stateReport.arMatchRemoteRouteCount = null
  stateReport.arMatchKnownSlugCount = arCleanupPlan.routeCount
  stateReport.arMatchManifestCandidateCount = arCleanupPlan.candidateCount
  stateReport.arMatchPopupCleanupCount = 0
  stateReport.differentialTransfer = {
    codeOnlyMode,
    historyJsonMode,
    explicitlyAllowedHistoryJsonPaths: historyJsonMode ? ['history-exclusions.json', 'win-history.json'] : [],
    changedPathCount: diffStats.changedCount,
    bytesToAdd: diffStats.bytesToAdd,
    excludedDataPathCount: diffStats.codeOnlyExcludedPaths.length,
    excludedDataBytes: diffStats.codeOnlyExcludedBytes,
    remoteManifestMustNotBePublished: diffStats.remoteManifestMustNotBePublished,
    matchOnlyInventoryUsedForDiff: false,
  }
  stateReport.htaccessSource = 'build/.htaccess; excluded from FTP-Deploy and published after success through the historical temporary-upload + rename method'
  stateReport.robotsSource = 'build/public/robots.txt; its state entry is omitted so the new content is uploaded'
  stateReport.sitemapSource = 'build sitemap merged with the previous remote sitemap; all existing EN/AR Match targets are retained because their URLs remain live; its state entry is omitted so the new content is uploaded'
  fs.writeFileSync(path.join(outDir, 'ftp-action-state-report.json'), `${JSON.stringify(stateReport, null, 2)}\n`)

  console.log(`[ftp-plan] state=${baseStateSource}; local=${stateReport.currentExportFileCount} published paths; ${stateReport.retainedRecordCount}/${stateReport.baseRecordCount} state records retained; ${stateReport.droppedRemoteOnlyRecordCount} remote-only records excluded from action; force uploads=${[...FORCE_UPLOAD].join(', ')}`)
  console.log(`[ftp-plan] differential: ${diffStats.changedCount} paths, ${diffStats.bytesToAdd} bytes; codeOnly=${codeOnlyMode}; historyJsonMode=${historyJsonMode}; Match-only inventory is not used as a complete server inventory`)
  console.log(`[ftp-plan] AR popup cleanup: ${arCleanupPlan.candidateCount} exact candidates from ${arCleanupPlan.routeCount} known slugs and the local reference manifest; zero deletions until the popup is live and each FTP SIZE is confirmed`)
}

const directPath = process.argv[1] ? path.resolve(process.argv[1]) : ''
if (directPath === fileURLToPath(import.meta.url)) {
  try { main() } catch (error) {
    console.error(`[ftp-plan] Refus : ${error instanceof Error ? error.message : String(error)}`)
    process.exitCode = 1
  }
}
