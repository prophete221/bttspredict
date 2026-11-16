#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ARABIC_PROMO_PATHS } from './prune-arabic-nonpromo.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DEFAULT_BASE = 'https://bttspredict.com'
const DEFAULT_TIMEOUT_MS = 10000
const DEFAULT_ATTEMPTS = 3
const DEFAULT_RETRY_DELAY_MS = 300
export const LEGACY_AR_MATCH_SLUGS = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'src/data/legacy-ar-match-slugs.json'), 'utf8'),
)

function parseArgs(argv) {
  return Object.fromEntries(argv.map(arg => {
    const index = arg.indexOf('=')
    return index < 0 ? [arg.replace(/^--/, ''), 'true'] : [arg.slice(2, index), arg.slice(index + 1)]
  }))
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error)
}

export function buildArabicAllowlistChecks(slugs = LEGACY_AR_MATCH_SLUGS) {
  if (!Array.isArray(slugs) || slugs.length !== 36 || slugs.some(slug => typeof slug !== 'string')) {
    throw new Error('La liste doit contenir exactement les 36 slugs AR historiques connus')
  }
  const forbidden = [
    '/ar',
    '/ar/',
    '/ar.html',
    '/ar.html/',
    '/ar/vip',
    '/ar/index.html',
    '/ar/match',
    '/ar/match/',
    ...slugs.map(slug => `/ar/match/${encodeURIComponent(slug)}`),
  ]
  const allowed = [...ARABIC_PROMO_PATHS].map(route => `/ar${route}`)
  return [
    ...allowed.map(route => ({ path: route, expectedStatus: 200, kind: 'allowed-promo' })),
    ...forbidden.map(route => ({ path: route, expectedStatus: 404, kind: 'forbidden-route' })),
  ]
}

export async function verifyArabicPromoAllowlist({
  base = DEFAULT_BASE,
  fetchImpl = globalThis.fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  attempts = DEFAULT_ATTEMPTS,
  retryDelayMs = DEFAULT_RETRY_DELAY_MS,
} = {}) {
  if (typeof fetchImpl !== 'function') throw new Error('Fetch indisponible pour vérifier les routes arabes')
  const normalizedBase = base.replace(/\/$/u, '')
  const checks = buildArabicAllowlistChecks()
  const results = new Array(checks.length)
  let next = 0

  const worker = async () => {
    while (true) {
      const index = next++
      if (index >= checks.length) return
      const check = checks[index]
      const url = `${normalizedBase}${check.path}`
      let lastError = ''
      for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
          const response = await fetchImpl(url, {
            redirect: 'follow',
            signal: AbortSignal.timeout(timeoutMs),
            headers: { 'cache-control': 'no-cache' },
          })
          const contentType = response.headers?.get?.('content-type') || ''
          const statusMatches = response.status === check.expectedStatus
          const htmlMatches = check.expectedStatus !== 200 || contentType.toLowerCase().includes('text/html')
          results[index] = {
            ...check,
            url,
            status: response.status,
            contentType,
            attempts: attempt,
            ok: statusMatches && htmlMatches,
            ...(!statusMatches ? { error: `HTTP ${response.status}, attendu ${check.expectedStatus}` } : {}),
            ...(statusMatches && !htmlMatches ? { error: `Type de contenu non HTML : ${contentType || 'absent'}` } : {}),
          }
          break
        } catch (error) {
          lastError = errorMessage(error)
          if (attempt < attempts) await delay(retryDelayMs * attempt)
          else {
            results[index] = {
              ...check,
              url,
              status: null,
              contentType: '',
              attempts: attempt,
              ok: false,
              error: lastError,
            }
          }
        }
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(4, checks.length) }, () => worker()))
  const failed = results.filter(result => !result.ok)
  return {
    checkedAt: new Date().toISOString(),
    base: normalizedBase,
    allowedPromoCount: [...ARABIC_PROMO_PATHS].length,
    forbiddenRouteCount: checks.length - [...ARABIC_PROMO_PATHS].length,
    routeCount: checks.length,
    passedCount: checks.length - failed.length,
    failedCount: failed.length,
    outcome: failed.length ? 'blocked' : 'verified',
    results,
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const reportPath = path.resolve(ROOT, args.report || 'out/ar-promo-allowlist-live-check.json')
  const report = await verifyArabicPromoAllowlist({ base: args.base || DEFAULT_BASE })
  fs.mkdirSync(path.dirname(reportPath), { recursive: true })
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
  console.log(`[ar-promo-allowlist] ${report.passedCount}/${report.routeCount} routes conformes; promos=${report.allowedPromoCount}; autres routes bloquées=${report.forbiddenRouteCount}; outcome=${report.outcome}`)
  for (const result of report.results.filter(item => !item.ok)) {
    console.error(`[ar-promo-allowlist] ${result.kind} ${result.path}: ${result.error}`)
  }
  if (report.failedCount) process.exitCode = 1
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main()
}
