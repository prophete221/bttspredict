#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ALWAYS_EXCLUDED_FILES = new Set([
  '.htaccess',
  'robots.txt',
  'sitemap.xml',
  'deploy-manifest.json',
  'deploy-manifest.prev.json',
  'deploy-list.txt',
  'deploy-diff-stats.json',
  'deploy-upload-rx.txt',
  'deploy-upload-commands.lftp',
  'deploy-upload-plan.json',
  'deploy-transfer.log',
  'deploy-transfer-report.json',
  'match-only-inventory.tsv',
  'remote-inventory.txt',
  'remote-inventory.tsv',
  'remote-inventory-failures.json',
  'remote-inventory-summary.json',
  'remote-inventory.err',
  'stale-match-pages.json',
  'orphan-review.json',
  'stale-match-delete.lftp',
  'sitemap-match-filter.json',
  'ftp-action-state-report.json',
])
const ALWAYS_EXCLUDED_DIRS = new Set(['predeploy-backups', 'ftp-diag'])
const CODE_ONLY_DATA_FILES = new Set([
  'predictions.json',
  'win-history.json',
  'history-exclusions.json',
  'transfers.json',
  'vip-combos.json',
  'team-context.json',
])
const CODE_ONLY_DATA_DIRS = ['predictions-archive/']
const EXPLICIT_ROOT_UPLOADS = ['robots.txt', 'sitemap.xml']
const REQUIRED_ROOT_FILES = ['.htaccess', ...EXPLICIT_ROOT_UPLOADS]

function validateRelativePath(value) {
  if (typeof value !== 'string' || !value || value.includes('\0') || /[\r\n]/.test(value) || value.includes('\\')) {
    throw new Error(`Chemin local invalide dans le manifeste/diff: ${String(value)}`)
  }
  if (value.startsWith('/') || path.posix.normalize(value) !== value || value.split('/').some(part => part === '' || part === '.' || part === '..')) {
    throw new Error(`Chemin non relatif ou non canonique dans le manifeste/diff: ${value}`)
  }
  // LFTP executes a command file; reject syntax-breaking characters rather than
  // constructing ambiguous escapes from a remote-controlled path.
  if (/['";`]/.test(value)) throw new Error(`Caractère de commande LFTP interdit dans le chemin: ${value}`)
  return value
}

function quoteLftp(value) {
  // LFTP single quotes preserve Next.js paths containing literal dollar signs.
  return `'${value}'`
}

function isInternalPath(rel) {
  if (ALWAYS_EXCLUDED_FILES.has(rel)) return true
  return ALWAYS_EXCLUDED_DIRS.has(rel.split('/')[0])
}

function isCodeOnlyDataPath(rel) {
  return CODE_ONLY_DATA_FILES.has(rel) || CODE_ONLY_DATA_DIRS.some(prefix => rel.startsWith(prefix))
}

function getDifferentialPaths(diffStats, { codeOnly }) {
  if (!diffStats || typeof diffStats !== 'object' || diffStats.schemaVersion !== 2) {
    throw new Error('Diff absent/invalide: un deploy-diff-stats.json v2 obligatoire est requis; transfert intégral refusé')
  }
  if (diffStats.codeOnlyMode !== codeOnly || diffStats.remoteManifestMustNotBePublished !== codeOnly) {
    throw new Error('Mode du diff incompatible avec le mode de déploiement demandé')
  }
  for (const field of ['newPaths', 'changedPaths', 'missingOnRemote', 'codeOnlyExcludedPaths']) {
    if (!Array.isArray(diffStats[field])) throw new Error(`Diff v2 invalide: ${field} doit être un tableau`)
  }
  const paths = [...diffStats.newPaths, ...diffStats.changedPaths, ...diffStats.missingOnRemote]
  if (new Set(paths).size !== paths.length) throw new Error('Diff v2 invalide: doublon entre les listes de chemins')
  if (!codeOnly && diffStats.codeOnlyExcludedPaths.length) throw new Error('Diff complet invalide: présence de fichiers data exclus en mode non-code-only')
  return { paths, codeOnlyExcludedPaths: diffStats.codeOnlyExcludedPaths }
}

function buildLftpCommands(uploadPaths, { explicitRootFiles, codeOnly }) {
  const parentDirectories = [...new Set(uploadPaths.map(rel => path.posix.dirname(rel)).filter(dir => dir !== '.'))]
    .sort((a, b) => {
      const depth = a.split('/').length - b.split('/').length
      return depth || a.localeCompare(b)
    })
  const commands = [
    '# Generated from the validated differential deploy manifest. No mirror/delete command.',
    'set ssl:verify no',
    'set cmd:fail-exit yes',
    'set net:timeout 60',
    'set net:max-retries 5',
    'lcd out',
  ]
  // -f suppresses the expected "already exists" response. A missing/unwritable
  // directory is still caught by the following exact put into that directory.
  for (const dir of parentDirectories) commands.push(`mkdir -pf ${quoteLftp(dir)}`)
  for (const rel of uploadPaths) commands.push(`put ${quoteLftp(rel)} -o ${quoteLftp(`./${rel}`)}`)

  // Root files are separate explicit uploads and deliberately occur after the
  // differential code/assets. .htaccess is never in this script.
  for (const file of explicitRootFiles) {
    commands.push(`put ${quoteLftp(file.path)} -o ${quoteLftp(`./${file.path}`)}`)
  }
  if (!codeOnly) commands.push(`put ${quoteLftp('deploy-manifest.json')} -o ${quoteLftp('./deploy-manifest.json')}`)
  commands.push('bye')
  return commands
}

/**
 * @param {object} manifest
 * @param {{ codeOnly?: boolean, diffStats?: any }} options
 */
export function buildUploadPlan(manifest, { codeOnly = false, diffStats } = {}) {
  if (!manifest || typeof manifest !== 'object' || !manifest.files || typeof manifest.files !== 'object' || Array.isArray(manifest.files)) {
    throw new Error('Manifeste local invalide: files doit être un objet')
  }
  const entries = Object.entries(manifest.files)
  if (!entries.length) throw new Error('Manifeste local vide: refus de créer une allowlist de transfert')
  const { paths: differentialPaths, codeOnlyExcludedPaths: statsExcludedDataPaths } = getDifferentialPaths(diffStats, { codeOnly })

  const fileMeta = new Map()
  for (const [rawPath, meta] of entries) {
    const rel = validateRelativePath(rawPath)
    if (!meta || typeof meta.hash !== 'string' || !meta.hash || typeof meta.size !== 'number' || !Number.isFinite(meta.size) || meta.size < 0) {
      throw new Error(`Métadonnées invalides dans le manifeste pour ${rel}`)
    }
    if (fileMeta.has(rel)) throw new Error(`Chemin dupliqué dans le manifeste: ${rel}`)
    fileMeta.set(rel, meta)
  }
  for (const rel of REQUIRED_ROOT_FILES) {
    const meta = fileMeta.get(rel)
    if (!meta || meta.size <= 0) throw new Error(`Fichier racine protégé absent ou vide du manifeste: ${rel}`)
  }

  const excludedDataSet = new Set()
  for (const rawPath of statsExcludedDataPaths) {
    const rel = validateRelativePath(rawPath)
    if (!fileMeta.has(rel) || !isCodeOnlyDataPath(rel)) throw new Error(`Le diff marque un chemin data exclu invalide: ${rel}`)
    excludedDataSet.add(rel)
  }

  const uploadPaths = []
  const excludedDataPaths = []
  const excludedInternalPaths = []
  const excludedProtectedPaths = []
  for (const rawPath of differentialPaths) {
    const rel = validateRelativePath(rawPath)
    if (!fileMeta.has(rel)) throw new Error(`Le diff référence un fichier absent du manifeste courant: ${rel}`)
    if (rel === '.htaccess') {
      excludedProtectedPaths.push(rel)
      continue
    }
    if (EXPLICIT_ROOT_UPLOADS.includes(rel)) continue
    if (isInternalPath(rel)) {
      excludedInternalPaths.push(rel)
      continue
    }
    if (codeOnly && isCodeOnlyDataPath(rel)) {
      excludedDataSet.add(rel)
      continue
    }
    uploadPaths.push(rel)
  }
  const uniqueUploadPaths = [...new Set(uploadPaths)].sort()
  if (uniqueUploadPaths.length !== uploadPaths.length) throw new Error('Diff invalide: chemins d’upload dupliqués')
  for (const rel of excludedDataSet) excludedDataPaths.push(rel)
  excludedDataPaths.sort()

  const uploadBytes = uniqueUploadPaths.reduce((sum, rel) => sum + fileMeta.get(rel).size, 0)
  const explicitRootFiles = EXPLICIT_ROOT_UPLOADS.map(rel => ({ path: rel, ...fileMeta.get(rel) }))
  const protectedRootFiles = REQUIRED_ROOT_FILES.map(rel => ({ path: rel, ...fileMeta.get(rel) }))
  const commands = buildLftpCommands(uniqueUploadPaths, { explicitRootFiles, codeOnly })

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    codeOnly,
    manifestFileCount: fileMeta.size,
    diffFileCount: differentialPaths.length,
    uploadFileCount: uniqueUploadPaths.length,
    uploadBytes,
    commandCount: commands.length,
    uploadPaths: uniqueUploadPaths,
    commands,
    excludedDataPaths,
    excludedInternalPaths: [...new Set(excludedInternalPaths)].sort(),
    excludedProtectedPaths: [...new Set(excludedProtectedPaths)].sort(),
    explicitRootFiles,
    protectedRootFiles,
    remoteManifestUpdated: !codeOnly,
    policy: 'Transfert strictement différentiel par commandes LFTP put exactes issues du diff v2 validé contre le manifeste distant complet, une commande par fichier. Aucun mirror/delete. En code-only, les JSON de pronostics/historiques/archives sont exclus et le manifeste distant n’est pas remplacé. robots.txt et sitemap.xml sont envoyés explicitement après les actifs; .htaccess est exclu et publié séparément après succès.',
  }
}

export function buildTransferReport(plan, logText, ftpExitCode) {
  if (!plan || !Array.isArray(plan.uploadPaths) || !Array.isArray(plan.explicitRootFiles)) {
    throw new Error('Plan d’upload invalide pour le rapport de transfert')
  }
  if (!Number.isInteger(ftpExitCode) || ftpExitCode < 0) throw new Error('Code de retour FTP invalide')
  const observedLines = logText.split(/\r?\n/).filter(line => /\b(?:put|STOR|Transferring file|Overwriting old file)\b/i.test(line))
  const confirmedPaths = ftpExitCode === 0
    ? [...plan.uploadPaths, ...plan.explicitRootFiles.map(file => file.path), ...(plan.remoteManifestUpdated ? ['deploy-manifest.json'] : [])]
    : []
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    codeOnly: plan.codeOnly,
    status: ftpExitCode === 0 ? 'success' : 'failed',
    ftpExitCode,
    diffFileCount: plan.diffFileCount,
    plannedFileCount: plan.uploadFileCount,
    plannedBytes: plan.uploadBytes,
    lftpCommandCount: plan.commandCount,
    confirmedUploadedPaths: confirmedPaths,
    observedTransferLogLines: observedLines,
    explicitRootFiles: plan.explicitRootFiles.map(file => ({
      path: file.path,
      sha256: file.hash,
      size: file.size,
      result: ftpExitCode === 0 ? 'confirmed-by-command-exit' : 'not-confirmed',
    })),
    remoteManifestUpdated: plan.remoteManifestUpdated && ftpExitCode === 0,
    note: 'Un code de retour nul avec cmd:fail-exit yes confirme que toutes les commandes put exactes du diff validé ont réussi; en cas d’échec, aucun chemin n’est déclaré confirmé.',
  }
}

function readArgs(argv) {
  return Object.fromEntries(argv.map(arg => {
    const index = arg.indexOf('=')
    return index < 0 ? [arg.replace(/^--/, ''), 'true'] : [arg.slice(2, index), arg.slice(index + 1)]
  }))
}

function runCli() {
  const [command, ...rawArgs] = process.argv.slice(2)
  const args = readArgs(rawArgs)
  if (command === 'plan') {
    if (!args.manifest || !args['diff-stats'] || !args['script-file'] || !args.plan) {
      throw new Error('Usage: plan --manifest=... --diff-stats=... --script-file=... --plan=... [--code-only=true]')
    }
    const manifest = JSON.parse(fs.readFileSync(args.manifest, 'utf8'))
    const diffStats = JSON.parse(fs.readFileSync(args['diff-stats'], 'utf8'))
    const plan = buildUploadPlan(manifest, { codeOnly: args['code-only'] === 'true', diffStats })
    fs.mkdirSync(path.dirname(path.resolve(args['script-file'])), { recursive: true })
    fs.mkdirSync(path.dirname(path.resolve(args.plan)), { recursive: true })
    fs.writeFileSync(args['script-file'], `${plan.commands.join('\n')}\n`)
    fs.writeFileSync(args.plan, `${JSON.stringify(plan, null, 2)}\n`)
    console.log(`[ftp-allowlist] codeOnly=${plan.codeOnly}; diff=${plan.diffFileCount}; files=${plan.uploadFileCount}; commands=${plan.commandCount}; bytes=${plan.uploadBytes}; dataExcluded=${plan.excludedDataPaths.length}; roots=${EXPLICIT_ROOT_UPLOADS.join(',')}`)
    return
  }
  if (command === 'report') {
    if (!args.plan || !args.log || !args.output || args['ftp-exit-code'] === undefined) throw new Error('Usage: report --plan=... --log=... --ftp-exit-code=N --output=...')
    const plan = JSON.parse(fs.readFileSync(args.plan, 'utf8'))
    const report = buildTransferReport(plan, fs.readFileSync(args.log, 'utf8'), Number(args['ftp-exit-code']))
    fs.mkdirSync(path.dirname(path.resolve(args.output)), { recursive: true })
    fs.writeFileSync(args.output, `${JSON.stringify(report, null, 2)}\n`)
    console.log(`[ftp-transfer-report] status=${report.status}; confirmed=${report.confirmedUploadedPaths.length}; exit=${report.ftpExitCode}`)
    return
  }
  throw new Error('Commande requise: plan ou report')
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    runCli()
  } catch (error) {
    console.error(`[ftp-allowlist] Refus: ${error instanceof Error ? error.message : String(error)}`)
    process.exitCode = 1
  }
}
