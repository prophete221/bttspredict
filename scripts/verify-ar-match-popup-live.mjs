#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DEFAULT_BASE = 'https://bttspredict.com'
const DEFAULT_ATTEMPTS = 3
const DEFAULT_TIMEOUT_MS = 10000
const DEFAULT_RETRY_DELAY_MS = 300
const SHARED_POPUP_MARKER = 'data-ar-match-shared-popup="true"'
const CHECK_DESCRIPTION = 'Each legacy /ar/match/<slug> must return HTML containing the shared popup marker before AR static files can be removed.'

function parseArgs(argv) {
  return Object.fromEntries(argv.map(arg => {
    const index = arg.indexOf('=')
    return index < 0 ? [arg.replace(/^--/, ''), 'true'] : [arg.slice(2, index), arg.slice(index + 1)]
  }))
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error)
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** Verify one legacy route. Only transport failures without an HTTP response are soft. */
export async function verifyLegacyArRoute(slug, {
  base = DEFAULT_BASE,
  fetchImpl = globalThis.fetch,
  attempts = DEFAULT_ATTEMPTS,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  retryDelayMs = DEFAULT_RETRY_DELAY_MS,
  sleep = delay,
} = {}) {
  const url = `${base.replace(/\/$/, '')}/ar/match/${encodeURIComponent(slug)}`
  const maxAttempts = Number.isFinite(attempts) ? Math.min(DEFAULT_ATTEMPTS, Math.max(1, Math.floor(attempts))) : DEFAULT_ATTEMPTS
  const requestTimeoutMs = Number.isFinite(timeoutMs) ? Math.min(DEFAULT_TIMEOUT_MS, Math.max(1, Math.floor(timeoutMs))) : DEFAULT_TIMEOUT_MS
  const retryDelayBaseMs = Number.isFinite(retryDelayMs) ? Math.min(DEFAULT_RETRY_DELAY_MS, Math.max(0, Math.floor(retryDelayMs))) : DEFAULT_RETRY_DELAY_MS
  let lastHttpFailure = null
  let lastTransportError = null

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let response
    try {
      response = await fetchImpl(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(requestTimeoutMs),
        headers: { 'cache-control': 'no-cache' },
      })
    } catch (error) {
      lastTransportError = errorMessage(error)
      if (attempt < maxAttempts) await sleep(retryDelayBaseMs * attempt)
      continue
    }

    const contentType = response.headers.get('content-type') || ''
    if (response.status === 404) {
      return {
        slug,
        status: 404,
        finalUrl: response.url || url,
        contentType,
        servesSharedPopup: false,
        ok: false,
        failureType: 'http',
        attempts: attempt,
        error: 'HTTP 404 confirmed; shared route was not found.',
      }
    }

    if (!response.ok) {
      lastHttpFailure = {
        slug,
        status: response.status,
        finalUrl: response.url || url,
        contentType,
        servesSharedPopup: false,
        ok: false,
        failureType: 'http',
        attempts: attempt,
        error: `HTTP ${response.status}; route validation did not succeed.`,
      }
      if (attempt < maxAttempts) await sleep(retryDelayBaseMs * attempt)
      continue
    }

    let body
    try {
      body = await response.text()
    } catch (error) {
      lastHttpFailure = {
        slug,
        status: response.status,
        finalUrl: response.url || url,
        contentType,
        servesSharedPopup: false,
        ok: false,
        failureType: 'response-body',
        attempts: attempt,
        error: `HTTP ${response.status} was received, but the response body could not be read: ${errorMessage(error)}`,
      }
      if (attempt < maxAttempts) await sleep(retryDelayBaseMs * attempt)
      continue
    }

    const servesSharedPopup = body.includes(SHARED_POPUP_MARKER)
    const result = {
      slug,
      status: response.status,
      finalUrl: response.url || url,
      contentType,
      servesSharedPopup,
      ok: response.status >= 200 && response.status < 300 && contentType.toLowerCase().includes('text/html') && servesSharedPopup,
      attempts: attempt,
    }
    if (!result.ok) {
      return {
        ...result,
        failureType: 'content',
        error: 'HTTP response did not contain the expected HTML shared-route content.',
      }
    }
    return result
  }

  if (lastHttpFailure) return { ...lastHttpFailure, attempts: maxAttempts }
  return {
    slug,
    ok: false,
    failureType: 'transport',
    attempts: maxAttempts,
    error: lastTransportError || 'Transport failed without an HTTP response.',
  }
}

export async function verifyLegacyArRoutes(slugs, options = {}) {
  const results = new Array(slugs.length)
  let next = 0
  const worker = async () => {
    while (true) {
      const index = next++
      if (index >= slugs.length) return
      results[index] = await verifyLegacyArRoute(slugs[index], options)
    }
  }
  await Promise.all(Array.from({ length: Math.min(4, slugs.length) }, () => worker()))
  return summarizeLegacyArResults(results, options.base || DEFAULT_BASE)
}

export function summarizeLegacyArResults(results, base = DEFAULT_BASE) {
  const passedCount = results.filter(result => result?.ok).length
  const failed = results.filter(result => !result?.ok)
  const transportFailureCount = failed.filter(result => result?.failureType === 'transport' && result.status === undefined).length
  const hardFailureCount = failed.length - transportFailureCount
  const outcome = hardFailureCount > 0 ? 'blocked' : transportFailureCount > 0 ? 'warning' : 'verified'
  return {
    checkedAt: new Date().toISOString(),
    base: base.replace(/\/$/, ''),
    routeCount: results.length,
    passedCount,
    failedCount: failed.length,
    hardFailureCount,
    transportFailureCount,
    outcome,
    cleanupSafe: outcome === 'verified',
    exitCode: outcome === 'blocked' ? 1 : 0,
    check: CHECK_DESCRIPTION,
    results,
  }
}

/** The string enum keeps workflow routing explicit without adding a workflow input. */
export function writeGithubStepResult(outcome, outputPath = process.env.GITHUB_OUTPUT) {
  if (!outputPath) return
  if (!['verified', 'warning', 'blocked'].includes(outcome)) throw new Error(`Unknown AR route-check outcome: ${outcome}`)
  fs.appendFileSync(outputPath, `result=${outcome}\n`)
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const base = (args.base || DEFAULT_BASE).replace(/\/$/, '')
  const reportPath = path.resolve(ROOT, args.report || 'out/ar-match-live-check.json')
  const slugs = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/legacy-ar-match-slugs.json'), 'utf8'))
  const report = await verifyLegacyArRoutes(slugs, { base })
  fs.mkdirSync(path.dirname(reportPath), { recursive: true })
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
  writeGithubStepResult(report.outcome)

  console.log(`[ar-match-live] ${report.passedCount}/${report.routeCount} legacy AR URLs serve the shared popup; outcome=${report.outcome}; attempts-per-URL<=${DEFAULT_ATTEMPTS}; timeout-per-attempt=${DEFAULT_TIMEOUT_MS}ms`)
  if (report.outcome === 'warning') {
    for (const result of report.results.filter(item => item?.failureType === 'transport')) {
      console.warn(`[ar-match-live] transport warning: ${result.slug}; attempts=${result.attempts}; ${result.error}`)
    }
    console.warn('::warning::AR route checks remain inconclusive after bounded retries. Existing Arabic static files are kept; cleanup is skipped.')
  }
  if (report.outcome === 'blocked') {
    for (const result of report.results.filter(item => !item?.ok && item?.failureType !== 'transport')) {
      console.error(`[ar-match-live] blocked: ${result.slug} ${result.status || ''} ${result.failureType || ''} ${result.error || ''}`)
    }
    console.error('::error::At least one legacy AR route returned an HTTP/content validation failure. No Arabic static files may be removed.')
    process.exitCode = report.exitCode
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main()
}
