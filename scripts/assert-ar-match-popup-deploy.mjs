#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const EXPECTED_ROUTE_BASE = 'https://bttspredict.com'
const EXPECTED_ROUTE_COUNT = 36
const FILE_LIMIT = 10000

function argsFrom(argv) {
  return Object.fromEntries(argv.map(arg => {
    const index = arg.indexOf('=')
    return index < 0 ? [arg.replace(/^--/u, ''), 'true'] : [arg.slice(2, index), arg.slice(index + 1)]
  }))
}

function requireArgs(args, names) {
  for (const name of names) if (!args[name]) throw new Error(`Argument requis : --${name}=...`)
}

function readJson(file, label) {
  const input = path.resolve(ROOT, file)
  return JSON.parse(fs.readFileSync(input, 'utf8'))
}

function isAllowedCandidate(candidate, slugSet) {
  if (!candidate || typeof candidate.path !== 'string' || typeof candidate.slug !== 'string' || !slugSet.has(candidate.slug)) return false
  const prefix = `ar/match/${candidate.slug}`
  return candidate.path === `${prefix}.html` || candidate.path === `${prefix}.txt` ||
    (candidate.path.startsWith(`${prefix}/`) && new RegExp(`^${prefix}/__next\\..+\\.txt$`, 'u').test(candidate.path))
}

function validateRouteProof(plan) {
  const route = plan.routeVerification
  const slugs = Array.isArray(plan.knownSlugs) ? plan.knownSlugs : []
  if (plan.routeCount !== EXPECTED_ROUTE_COUNT || slugs.length !== EXPECTED_ROUTE_COUNT || new Set(slugs).size !== EXPECTED_ROUTE_COUNT ||
      route?.verified !== true || route.base !== EXPECTED_ROUTE_BASE || !Number.isFinite(Date.parse(route.checkedAt)) ||
      route.routeCount !== EXPECTED_ROUTE_COUNT || route.passedCount !== EXPECTED_ROUTE_COUNT || route.failedCount !== 0 ||
      !Array.isArray(route.results) || route.results.length !== EXPECTED_ROUTE_COUNT) {
    throw new Error('Preuve des 36 routes AR communes absente ou incomplète.')
  }
  const bySlug = new Map()
  for (const result of route.results) {
    if (!result || typeof result.slug !== 'string' || bySlug.has(result.slug) || !slugs.includes(result.slug) ||
        result.ok !== true || result.status !== 200 || result.servesSharedPopup !== true ||
        typeof result.contentType !== 'string' || !result.contentType.toLowerCase().includes('text/html')) {
      throw new Error('Preuve AR avec route invalide, dupliquée ou sans popup commune.')
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
      throw new Error(`URL finale AR hors route commune pour ${result.slug}`)
    }
    bySlug.set(result.slug, result)
  }
  if (bySlug.size !== EXPECTED_ROUTE_COUNT || slugs.some(slug => !bySlug.has(slug))) {
    throw new Error('La preuve AR ne couvre pas exactement les 36 slugs connus.')
  }
}

function validatePresencePlan(plan) {
  if (!plan || plan.schemaVersion !== 2 || !Array.isArray(plan.candidates) || !Array.isArray(plan.deletions) ||
      plan.presenceVerified !== true || plan.presenceStatus !== 'confirmed-after-live-route-check' ||
      plan.presenceFtpExitCode !== 0 || plan.presenceFtpNoopVerified !== true) {
    throw new Error('Présence AR exacte non validée : contrôle FTP ou plan incomplet.')
  }
  validateRouteProof(plan)
  const slugs = new Set(plan.knownSlugs)
  if (!Number.isInteger(plan.candidateCount) || plan.candidateCount !== plan.candidates.length ||
      !Number.isInteger(plan.presenceSizeCheckCount) || plan.presenceSizeCheckCount !== plan.candidateCount ||
      !Number.isInteger(plan.presentCandidateCount) || !Number.isInteger(plan.unconfirmedCandidateCount) ||
      plan.presentCandidateCount + plan.unconfirmedCandidateCount !== plan.candidateCount ||
      !Number.isInteger(plan.deletionCount) || plan.deletionCount !== plan.deletions.length ||
      plan.deletionCount !== plan.presentCandidateCount) {
    throw new Error('Liste des candidats AR ou compteurs de présence incohérents.')
  }
  const candidateByPath = new Map()
  for (const candidate of plan.candidates) {
    if (!isAllowedCandidate(candidate, slugs) || candidateByPath.has(candidate.path)) throw new Error('Candidat AR hors allowlist ou dupliqué.')
    candidateByPath.set(candidate.path, candidate)
  }
  for (const deletion of plan.deletions) {
    const candidate = candidateByPath.get(deletion?.path)
    if (!candidate || deletion.slug !== candidate.slug || deletion.size !== candidate.size) {
      throw new Error('Suppression AR qui ne correspond pas à un candidat exact confirmé.')
    }
  }
  const noOp = plan.candidateCount === 0 && plan.candidates.length === 0 && plan.presenceSizeCheckCount === 0 &&
    plan.presentCandidateCount === 0 && plan.unconfirmedCandidateCount === 0 && plan.deletionCount === 0 &&
    plan.deletions.length === 0 && plan.presenceNoOpVerified === true
  if (plan.candidateCount === 0 && !noOp) throw new Error('Plan vide sans preuve explicite du no-op FTP et routes.')
  if (plan.candidateCount > 0 && plan.presenceNoOpVerified === true) throw new Error('Plan non vide marqué à tort comme no-op.')
  return noOp
}

function assertDeployment(args) {
  requireArgs(args, ['plan', 'diff-stats'])
  const plan = readJson(args.plan, 'Plan AR')
  const stats = readJson(args['diff-stats'], 'Statistiques de diff')
  const noOp = validatePresencePlan(plan)
  if (!Number.isInteger(stats.newPathCount) || stats.newPathCount < 0) throw new Error('Nombre d’ajouts au diff LWS invalide.')
  const message = process.env.DEPLOY_COMMIT_MESSAGE || ''
  const counts = [...message.matchAll(/\[lws-files=(\d+)\]/gu)]
  if (counts.length > 1) throw new Error('Plusieurs compteurs LWS dans le message de commit.')
  if (counts.length === 0) {
    if (!noOp) throw new Error('Compteur LWS absent : seul un plan AR strictement vide, vérifié par FTP et les 36 routes, est autorisé.')
    console.log('[ar-match-presence] no-op prouvé : zéro candidat, zéro suppression, réponse FTP NOOP non ambiguë et 36 routes communes validées; aucun rm ne sera généré.')
    return
  }

  const currentFiles = Number(counts[0][1])
  const additions = stats.newPathCount
  const projectedPeak = currentFiles + additions
  const projectedFinal = projectedPeak - plan.deletionCount
  if (!Number.isInteger(currentFiles) || currentFiles < 0 || currentFiles > FILE_LIMIT ||
      projectedPeak > FILE_LIMIT || projectedFinal < 0) {
    throw new Error('Projection nette LWS invalide après présence exacte.')
  }
  console.log(`[LWS quota exact] ${currentFiles} + ${additions} = ${projectedPeak} au pic; ${plan.deletionCount} chemins présents confirmés; projection nette ${projectedFinal}/${FILE_LIMIT}.`)
}

try {
  assertDeployment(argsFrom(process.argv.slice(2)))
} catch (error) {
  console.error(`[ar-match-deploy] refus : ${error instanceof Error ? error.message : String(error)}`)
  process.exitCode = 1
}
