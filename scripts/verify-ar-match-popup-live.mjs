#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = Object.fromEntries(process.argv.slice(2).map(arg => {
  const index = arg.indexOf('=')
  return index < 0 ? [arg.replace(/^--/, ''), 'true'] : [arg.slice(2, index), arg.slice(index + 1)]
}))
const base = (args.base || 'https://bttspredict.com').replace(/\/$/, '')
const reportPath = path.resolve(ROOT, args.report || 'out/ar-match-live-check.json')
const slugs = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/legacy-ar-match-slugs.json'), 'utf8'))
const results = new Array(slugs.length)
let next = 0

async function worker() {
  while (true) {
    const index = next++
    if (index >= slugs.length) return
    const slug = slugs[index]
    const url = `${base}/ar/match/${encodeURIComponent(slug)}`
    try {
      const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(30000), headers: { 'cache-control': 'no-cache' } })
      const contentType = response.headers.get('content-type') || ''
      const body = await response.text()
      const servesSharedPopup = body.includes('data-ar-match-shared-popup="true"')
      results[index] = {
        slug,
        status: response.status,
        finalUrl: response.url,
        contentType,
        servesSharedPopup,
        ok: response.ok && contentType.toLowerCase().includes('text/html') && servesSharedPopup,
      }
    } catch (error) {
      results[index] = { slug, ok: false, error: error instanceof Error ? error.message : String(error) }
    }
  }
}

await Promise.all(Array.from({ length: Math.min(4, slugs.length) }, () => worker()))
const report = {
  checkedAt: new Date().toISOString(),
  base,
  routeCount: slugs.length,
  passedCount: results.filter(result => result?.ok).length,
  failedCount: results.filter(result => !result?.ok).length,
  check: 'Each legacy /ar/match/<slug> must return HTML containing the shared popup marker before AR static files can be removed.',
  results,
}
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
console.log(`[ar-match-live] ${report.passedCount}/${report.routeCount} legacy AR URLs serve the shared popup`)
if (report.failedCount) {
  for (const result of results.filter(item => !item?.ok)) console.error(`[ar-match-live] failed: ${result.slug} ${result.status || ''} ${result.error || ''}`)
  process.exitCode = 1
}
