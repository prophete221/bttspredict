#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const EXPECTED_KNOWN_SLUGS = 36
const EXPECTED_ROUTE_BASE = 'https://bttspredict.com'
const FTP_NOOP_START = '__AR_FTP_NOOP_START__'
const FTP_NOOP_END = '__AR_FTP_NOOP_END__'
const POLICY = 'Candidates come only from the 36 known legacy AR slugs intersected with the previous local manifest, excluding paths in the current export. No remote listing contributes paths. Exact FTP SIZE confirmation after the shared popup is live is required before any rm command is generated.'

function argsFrom(argv) {
  return Object.fromEntries(argv.map(arg => {
    const index = arg.indexOf('=')
    return index < 0 ? [arg.replace(/^--/, ''), 'true'] : [arg.slice(2, index), arg.slice(index + 1)]
  }))
}

function requireArgs(args, names) {
  for (const name of names) if (!args[name]) throw new Error(`Argument requis : --${name}=...`)
}

function resolveFromRoot(file) {
  return path.resolve(ROOT, file)
}

function readJson(file, label) {
  return JSON.parse(fs.readFileSync(resolveFromRoot(file), 'utf8'))
}

function readSlugs(file) {
  const value = readJson(file, 'slugs')
  if (!Array.isArray(value) || value.length !== EXPECTED_KNOWN_SLUGS || value.some(slug => typeof slug !== 'string')) {
    throw new Error(`La liste AR doit contenir exactement ${EXPECTED_KNOWN_SLUGS} slugs textuels connus`)
  }
  if (new Set(value).size !== value.length) throw new Error('Doublon dans les 36 slugs AR connus')
  for (const slug of value) {
    const match = slug.match(/^[\p{L}\p{N}_-]+-(\d{4}-\d{2}-\d{2})$/u)
    if (!match) throw new Error(`Slug AR historique invalide : ${slug}`)
    const parsed = new Date(`${match[1]}T00:00:00.000Z`)
    if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== match[1]) {
      throw new Error(`Date invalide dans le slug AR historique : ${slug}`)
    }
  }
  return value
}

function readManifest(file, label) {
  const manifest = readJson(file, label)
  if (!manifest || typeof manifest !== 'object' || !manifest.files || typeof manifest.files !== 'object' || Array.isArray(manifest.files)) {
    throw new Error(`${label} invalide : mapping files absent`)
  }
  if (manifest.fileCount !== undefined && manifest.fileCount !== Object.keys(manifest.files).length) {
    throw new Error(`${label} incohérent : fileCount ne correspond pas au mapping files`)
  }
  return manifest
}

function validateCandidatePath(filePath, slugSet) {
  if (typeof filePath !== 'string' || !filePath.startsWith('ar/match/') || filePath.includes('\\') || /[\r\n\0'"`;*?\[\]]/u.test(filePath)) {
    throw new Error(`Chemin candidat non autorisé : ${String(filePath)}`)
  }
  const relative = filePath.slice('ar/match/'.length)
  const parts = relative.split('/')
  if (parts.some(part => !part || part === '.' || part === '..')) throw new Error(`Chemin candidat dangereux : ${filePath}`)
  if (parts.length === 1) {
    const match = parts[0].match(/^(.+)-(\d{4}-\d{2}-\d{2})\.(html|txt)$/u)
    if (!match) return null
    const slug = `${match[1]}-${match[2]}`
    return slugSet.has(slug) ? slug : null
  }
  if (parts.length === 2 && /^__next\..+\.txt$/u.test(parts[1]) && slugSet.has(parts[0])) return parts[0]
  return null
}

function writeJson(file, value) {
  const output = resolveFromRoot(file)
  fs.mkdirSync(path.dirname(output), { recursive: true })
  fs.writeFileSync(output, `${JSON.stringify(value, null, 2)}\n`)
}

function writeText(file, value) {
  const output = resolveFromRoot(file)
  fs.mkdirSync(path.dirname(output), { recursive: true })
  fs.writeFileSync(output, value)
}

function plan(args) {
  requireArgs(args, ['manifest', 'current-manifest', 'slugs', 'plan', 'commands'])
  const previous = readManifest(args.manifest, 'Manifeste de référence local')
  const current = readManifest(args['current-manifest'], 'Manifeste local du build')
  const slugs = readSlugs(args.slugs)
  const slugSet = new Set(slugs)
  const currentFiles = new Set(Object.keys(current.files))
  const candidates = []

  for (const [filePath, metadata] of Object.entries(previous.files)) {
    if (!filePath.startsWith('ar/match/')) continue
    const slug = validateCandidatePath(filePath, slugSet)
    if (!slug || currentFiles.has(filePath)) continue
    if (!metadata || typeof metadata.size !== 'number' || !Number.isFinite(metadata.size) || metadata.size < 0) {
      throw new Error(`Métadonnée de taille invalide pour ${filePath}`)
    }
    candidates.push({ path: filePath, slug, size: metadata.size })
  }

  candidates.sort((a, b) => a.path.localeCompare(b.path))
  if (new Set(candidates.map(item => item.path)).size !== candidates.length) throw new Error('Chemin candidat dupliqué')
  const planValue = {
    schemaVersion: 2,
    generatedAt: new Date().toISOString(),
    sourceManifest: path.basename(resolveFromRoot(args.manifest)),
    currentManifest: path.basename(resolveFromRoot(args['current-manifest'])),
    sourceSlugs: path.basename(resolveFromRoot(args.slugs)),
    policy: POLICY,
    routeCount: slugs.length,
    knownSlugs: slugs,
    candidateCount: candidates.length,
    candidates,
    presenceStatus: 'pending-after-live-route-check',
    presenceVerified: false,
    deletionCount: 0,
    deletionBytes: 0,
    deletions: [],
  }
  writeJson(args.plan, planValue)
  writeText(args.commands, '')
  console.log(`[ar-match-cleanup] ${candidates.length} exact candidates from ${slugs.length} known slugs and the local reference manifest; zero deletions before live-route presence checks.`)
}

function readPlan(file) {
  const planValue = readJson(file, 'Plan AR')
  if (planValue.schemaVersion !== 2 || !Array.isArray(planValue.candidates) || !Array.isArray(planValue.deletions)) {
    throw new Error('Plan AR invalide')
  }
  const slugSet = new Set(readSlugs('src/data/legacy-ar-match-slugs.json'))
  for (const candidate of planValue.candidates) {
    if (!candidate || validateCandidatePath(candidate.path, slugSet) !== candidate.slug) throw new Error(`Candidat hors allowlist : ${candidate?.path}`)
  }
  if (planValue.candidateCount !== planValue.candidates.length) throw new Error('candidateCount du plan incohérent')
  for (const deletion of planValue.deletions) {
    if (!deletion || validateCandidatePath(deletion.path, slugSet) !== deletion.slug || !planValue.candidates.some(item => item.path === deletion.path)) {
      throw new Error(`Suppression hors candidats confirmés : ${deletion?.path}`)
    }
  }
  return planValue
}

function validateRouteReport(file, planValue) {
  const report = readJson(file, 'Rapport de vérification des routes AR')
  const slugs = readSlugs('src/data/legacy-ar-match-slugs.json')
  const planSlugs = Array.isArray(planValue.knownSlugs) ? planValue.knownSlugs : []
  const sameSlugs = planSlugs.length === slugs.length && new Set(planSlugs).size === slugs.length && slugs.every(slug => planSlugs.includes(slug))
  if (!sameSlugs || planValue.routeCount !== EXPECTED_KNOWN_SLUGS) throw new Error('Plan AR sans preuve des 36 slugs connus')
  if (!report || report.base !== EXPECTED_ROUTE_BASE || !Number.isFinite(Date.parse(report.checkedAt)) ||
      report.routeCount !== EXPECTED_KNOWN_SLUGS || report.passedCount !== EXPECTED_KNOWN_SLUGS || report.failedCount !== 0 ||
      !Array.isArray(report.results) || report.results.length !== EXPECTED_KNOWN_SLUGS) {
    throw new Error('Rapport AR absent, incomplet ou ne validant pas les 36 routes communes')
  }

  const bySlug = new Map()
  for (const result of report.results) {
    if (!result || typeof result.slug !== 'string' || bySlug.has(result.slug)) throw new Error('Rapport AR avec slug absent ou dupliqué')
    if (result.ok !== true || result.status !== 200 || result.servesSharedPopup !== true ||
        typeof result.contentType !== 'string' || !result.contentType.toLowerCase().includes('text/html')) {
      throw new Error(`Route AR non confirmée pour ${result.slug}`)
    }
    let finalUrl
    let finalPath
    try {
      finalUrl = new URL(result.finalUrl)
      finalPath = decodeURIComponent(finalUrl.pathname).replace(/\/$/u, '')
    } catch {
      throw new Error(`URL finale AR invalide pour ${result.slug}`)
    }
    if (finalUrl.origin !== EXPECTED_ROUTE_BASE || finalPath !== `/ar/match/${result.slug}`) {
      throw new Error(`URL finale hors route commune pour ${result.slug}`)
    }
    bySlug.set(result.slug, result)
  }
  if (bySlug.size !== slugs.length || slugs.some(slug => !bySlug.has(slug))) throw new Error('Le rapport ne contient pas exactement les 36 slugs AR connus')

  return {
    verified: true,
    checkedAt: report.checkedAt,
    base: report.base,
    routeCount: report.routeCount,
    passedCount: report.passedCount,
    failedCount: report.failedCount,
    results: slugs.map(slug => {
      const result = bySlug.get(slug)
      return {
        slug,
        status: result.status,
        finalUrl: result.finalUrl,
        contentType: result.contentType,
        servesSharedPopup: result.servesSharedPopup,
        ok: result.ok,
      }
    }),
  }
}

function validateFtpNoop(logPath) {
  const lines = fs.readFileSync(resolveFromRoot(logPath), 'utf8').replace(/\x1b\[[0-9;]*m/gu, '').split(/\r?\n/u)
  const start = []
  const end = []
  lines.forEach((line, index) => {
    if (line.trim() === FTP_NOOP_START) start.push(index)
    if (line.trim() === FTP_NOOP_END) end.push(index)
  })
  if (start.length !== 1 || end.length !== 1 || start[0] >= end[0]) throw new Error('Preuve FTP NOOP absente, dupliquée ou mal ordonnée')
  const responses = lines.slice(start[0] + 1, end[0]).map(line => line.match(/^\s*(\d{3})\b/u)).filter(Boolean).map(match => Number(match[1]))
  if (responses.length !== 1 || responses[0] !== 200) throw new Error(`Réponse FTP NOOP ambiguë ou en échec : ${responses.join(',') || 'aucune'}`)
}

function sizeCommandLines(items) {
  const commands = []
  items.forEach((item, index) => {
    commands.push(`echo __AR_SIZE_START_${index}__`)
    commands.push(`quote SIZE '${item.path}'`)
    commands.push(`echo __AR_SIZE_END_${index}__`)
  })
  return commands
}

function sizeCommands(items, commandsPath) {
  const commands = sizeCommandLines(items)
  writeText(commandsPath, commands.length ? `${commands.join('\n')}\n` : '')
}

function presenceCommands(args) {
  requireArgs(args, ['plan', 'commands'])
  const planValue = readPlan(args.plan)
  if (planValue.presenceVerified) throw new Error('La présence des candidats a déjà été vérifiée')
  const commands = [`echo ${FTP_NOOP_START}`, 'quote NOOP', `echo ${FTP_NOOP_END}`, ...sizeCommandLines(planValue.candidates)]
  writeText(args.commands, `${commands.join('\n')}\n`)
  console.log(`[ar-match-presence] contrôle FTP NOOP + ${planValue.candidates.length} vérifications SIZE exactes prêts; aucune suppression n’est générée.`)
}

function parseSizeLog(logPath, items) {
  const source = fs.readFileSync(resolveFromRoot(logPath), 'utf8').replace(/\x1b\[[0-9;]*m/g, '')
  const results = new Map()
  let activeIndex = null
  let responseCodes = []

  for (const line of source.split(/\r?\n/)) {
    const start = line.match(/__AR_SIZE_START_(\d+)__/)
    if (start) {
      if (activeIndex !== null) throw new Error('Marqueur SIZE de début imbriqué ou incomplet')
      activeIndex = Number(start[1])
      responseCodes = []
      if (!Number.isInteger(activeIndex) || activeIndex < 0 || activeIndex >= items.length || results.has(activeIndex)) {
        throw new Error(`Marqueur SIZE inconnu ou dupliqué : ${start[1]}`)
      }
      continue
    }
    const end = line.match(/__AR_SIZE_END_(\d+)__/)
    if (end) {
      const endIndex = Number(end[1])
      if (activeIndex === null || activeIndex !== endIndex) throw new Error(`Marqueur SIZE de fin incohérent : ${end[1]}`)
      if (responseCodes.length !== 1 || ![213, 550].includes(responseCodes[0])) {
        throw new Error(`Présence non confirmée pour ${items[activeIndex].path}; réponses FTP=${responseCodes.join(',') || 'aucune'}`)
      }
      results.set(activeIndex, responseCodes[0] === 213)
      activeIndex = null
      responseCodes = []
      continue
    }
    if (activeIndex !== null) {
      const code = line.match(/^\s*(\d{3})\b/u)
      if (code) responseCodes.push(Number(code[1]))
    } else {
      const code = line.match(/^\s*(\d{3})\b/u)
      if (code && [213, 550].includes(Number(code[1]))) throw new Error(`Réponse SIZE FTP hors marqueur : ${line.trim()}`)
    }
  }

  if (activeIndex !== null) throw new Error(`Journal FTP tronqué pendant le contrôle de ${items[activeIndex].path}`)
  if (results.size !== items.length) throw new Error(`Journal FTP incomplet : ${results.size}/${items.length} chemins confirmés`)
  return items.map((item, index) => ({ item, present: results.get(index) }))
}

function confirmPresence(args) {
  requireArgs(args, ['plan', 'log', 'commands', 'route-report', 'ftp-exit-code'])
  const planValue = readPlan(args.plan)
  if (planValue.presenceVerified) throw new Error('La présence des candidats a déjà été confirmée')
  writeText(args.commands, '')
  if (args['ftp-exit-code'] !== '0') throw new Error(`Contrôle FTP non réussi : code ${args['ftp-exit-code']}`)
  const routeVerification = validateRouteReport(args['route-report'], planValue)
  validateFtpNoop(args.log)
  const results = parseSizeLog(args.log, planValue.candidates)
  const deletions = results.filter(result => result.present).map(result => result.item)
  const noOpVerified = planValue.candidates.length === 0 && results.length === 0 && deletions.length === 0
  planValue.presenceCheckedAt = new Date().toISOString()
  planValue.presenceStatus = 'confirmed-after-live-route-check'
  planValue.presenceVerified = true
  planValue.presenceFtpExitCode = 0
  planValue.presenceFtpNoopVerified = true
  planValue.presenceSizeCheckCount = results.length
  planValue.presenceNoOpVerified = noOpVerified
  planValue.routeVerification = routeVerification
  planValue.presentCandidateCount = deletions.length
  planValue.unconfirmedCandidateCount = planValue.candidates.length - deletions.length
  planValue.deletionCount = deletions.length
  planValue.deletionBytes = deletions.reduce((sum, item) => sum + item.size, 0)
  planValue.deletions = deletions
  writeJson(args.plan, planValue)
  const commands = deletions.map(item => `rm -f '${item.path}'`)
  writeText(args.commands, commands.length ? `${commands.join('\n')}\n` : '')
  console.log(`[ar-match-presence] ${deletions.length}/${planValue.candidateCount} candidats confirmés après validation FTP et des 36 routes; ${planValue.unconfirmedCandidateCount} non confirmés laissés intacts; no-op=${noOpVerified}.`)
}

function postCleanupCommands(args) {
  requireArgs(args, ['plan', 'commands'])
  const planValue = readPlan(args.plan)
  if (!planValue.presenceVerified || planValue.deletionCount !== planValue.deletions.length) {
    throw new Error('Aucune allowlist de suppression confirmée disponible')
  }
  sizeCommands(planValue.deletions, args.commands)
  console.log(`[ar-match-post-cleanup] ${planValue.deletions.length} chemins exacts à revérifier après rm.`)
}

function verifyAbsent(args) {
  requireArgs(args, ['plan', 'log'])
  const planValue = readPlan(args.plan)
  if (!planValue.presenceVerified || planValue.deletionCount !== planValue.deletions.length) {
    throw new Error('Plan de suppressions non confirmé')
  }
  const results = parseSizeLog(args.log, planValue.deletions)
  const remaining = results.filter(result => result.present).map(result => result.item.path)
  if (remaining.length) throw new Error(`Chemins AR toujours présents après nettoyage : ${remaining.join(', ')}`)
  planValue.postCleanupVerifiedAt = new Date().toISOString()
  planValue.postCleanupVerifiedCount = results.length
  planValue.postCleanupVerified = true
  writeJson(args.plan, planValue)
  console.log(`[ar-match-post-cleanup] vérification exacte réussie : ${results.length} fichiers supprimés absents; aucun autre chemin n’a été testé ou supprimé.`)
}

try {
  const mode = process.argv[2] || 'plan'
  const args = argsFrom(process.argv.slice(3))
  if (mode === 'plan') plan(args)
  else if (mode === 'presence-commands') presenceCommands(args)
  else if (mode === 'confirm-presence') confirmPresence(args)
  else if (mode === 'post-cleanup-commands') postCleanupCommands(args)
  else if (mode === 'verify-absent') verifyAbsent(args)
  else throw new Error('Usage : prepare-ar-match-popup-cleanup.mjs plan|presence-commands|confirm-presence|post-cleanup-commands|verify-absent --key=value ...')
} catch (error) {
  console.error(`[ar-match-cleanup] refus : ${error instanceof Error ? error.message : String(error)}`)
  process.exitCode = 1
}
