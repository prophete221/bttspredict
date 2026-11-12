import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  summarizeLegacyArResults,
  verifyLegacyArRoute,
  writeGithubStepResult,
} from '../scripts/verify-ar-match-popup-live.mjs'

const marker = 'data-ar-match-shared-popup="true"'
const url = 'https://bttspredict.com/ar/match/example-vs-team-2026-11-22'
const tempRoots: string[] = []

function response(status: number, body = marker) {
  return {
    status,
    ok: status >= 200 && status < 300,
    url,
    headers: { get: (name: string) => name.toLowerCase() === 'content-type' ? 'text/html; charset=utf-8' : null },
    text: async () => body,
  }
}

function githubOutput(outcome: string) {
  const root = mkdtempSync(path.join(tmpdir(), 'ar-route-output-'))
  tempRoots.push(root)
  const outputPath = path.join(root, 'output')
  writeGithubStepResult(outcome, outputPath)
  return readFileSync(outputPath, 'utf8')
}

const noDelay = async () => undefined
const options = { timeoutMs: 100, retryDelayMs: 0, sleep: noDelay }

afterEach(() => {
  vi.restoreAllMocks()
  for (const root of tempRoots.splice(0)) rmSync(root, { recursive: true, force: true })
})

describe('legacy Arabic route live verification retries', () => {
  it('recovers from a transient transport error and accepts the next valid 200 response', async () => {
    const fetchImpl = vi.fn()
      .mockRejectedValueOnce(new TypeError('fetch failed'))
      .mockResolvedValueOnce(response(200))

    const result = await verifyLegacyArRoute('example-vs-team-2026-11-22', { ...options, fetchImpl })
    const report = summarizeLegacyArResults([result])

    expect(fetchImpl).toHaveBeenCalledTimes(2)
    expect(result).toMatchObject({ ok: true, status: 200, servesSharedPopup: true, attempts: 2 })
    expect(report).toMatchObject({ outcome: 'verified', cleanupSafe: true, exitCode: 0, passedCount: 1 })
  })

  it('aborts each request on timeout and caps the total attempts at three', async () => {
    const fetchImpl = vi.fn((_url: RequestInfo | URL, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
      const signal = init?.signal as AbortSignal
      if (signal.aborted) {
        reject(new Error('request timed out'))
        return
      }
      signal.addEventListener('abort', () => reject(new Error('request timed out')), { once: true })
    }))
    const result = await verifyLegacyArRoute('example-vs-team-2026-11-22', {
      ...options,
      fetchImpl,
      attempts: 99,
      timeoutMs: 5,
    })

    expect(fetchImpl).toHaveBeenCalledTimes(3)
    expect(fetchImpl.mock.calls.every(([, init]) => init?.signal instanceof AbortSignal)).toBe(true)
    expect(result).toMatchObject({ ok: false, failureType: 'transport', attempts: 3 })
  })

  it('treats a confirmed 404 as a hard block and does not retry or authorize cleanup', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(response(404, 'Not found'))
    const result = await verifyLegacyArRoute('example-vs-team-2026-11-22', { ...options, fetchImpl })
    const report = summarizeLegacyArResults([result])

    expect(fetchImpl).toHaveBeenCalledTimes(1)
    expect(result).toMatchObject({ ok: false, status: 404, failureType: 'http' })
    expect(report).toMatchObject({ outcome: 'blocked', cleanupSafe: false, exitCode: 1, hardFailureCount: 1 })
  })

  it('treats incorrect shared-route content as a hard block even when the server returns 200', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(response(200, '<html><body>Different route</body></html>'))
    const result = await verifyLegacyArRoute('example-vs-team-2026-11-22', { ...options, fetchImpl })
    const report = summarizeLegacyArResults([result])

    expect(result).toMatchObject({ ok: false, status: 200, servesSharedPopup: false, failureType: 'content' })
    expect(report).toMatchObject({ outcome: 'blocked', cleanupSafe: false, exitCode: 1, hardFailureCount: 1 })
  })

  it('turns persistent transport failures without an HTTP status into a warning that skips cleanup without failing the run', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError('fetch failed'))
    const result = await verifyLegacyArRoute('example-vs-team-2026-11-22', {
      ...options,
      fetchImpl,
      attempts: 99,
    })
    const report = summarizeLegacyArResults([result])

    expect(fetchImpl).toHaveBeenCalledTimes(3)
    expect(result).toMatchObject({ ok: false, failureType: 'transport', attempts: 3 })
    expect(result.status).toBeUndefined()
    expect(report).toMatchObject({
      outcome: 'warning',
      cleanupSafe: false,
      exitCode: 0,
      transportFailureCount: 1,
      hardFailureCount: 0,
    })
    expect(githubOutput(report.outcome)).toBe('result=warning\n')

    const workflow = readFileSync('.github/workflows/deploy.yml', 'utf8')
    expect(workflow).toContain("steps.ar-route-check.outputs.result == 'verified'")
    expect(workflow).toContain("steps.ar-route-check.outputs.result == 'warning'")
  })

  it('writes only the fixed workflow outcome enum', () => {
    expect(githubOutput('blocked')).toBe('result=blocked\n')
    const root = mkdtempSync(path.join(tmpdir(), 'ar-route-output-invalid-'))
    tempRoots.push(root)
    expect(() => writeGithubStepResult('unexpected', path.join(root, 'output'))).toThrow(/Unknown AR route-check outcome/)
  })
})
