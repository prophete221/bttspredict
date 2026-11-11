import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import legacyArMatchSlugs from '@/data/legacy-ar-match-slugs.json'
import { loadAllMatches } from '@/lib/matches'
import { getLocalizedMatchStaticParams } from '@/lib/match-page-ssg'

const roots: string[] = []
const cleanupScript = path.resolve('scripts/prepare-ar-match-popup-cleanup.mjs')
const deployGuardScript = path.resolve('scripts/assert-ar-match-popup-deploy.mjs')
const slugs = legacyArMatchSlugs as string[]

function buildRouteReport(options: { routeSlugs?: string[]; base?: string; failedSlug?: string } = {}) {
  const base = options.base ?? 'https://bttspredict.com'
  const routeSlugs = options.routeSlugs ?? slugs
  const results = routeSlugs.map(slug => {
    const ok = slug !== options.failedSlug
    return {
      slug,
      status: ok ? 200 : 503,
      finalUrl: `${base}/ar/match/${encodeURIComponent(slug)}`,
      contentType: 'text/html; charset=utf-8',
      servesSharedPopup: ok,
      ok,
    }
  })
  return {
    checkedAt: new Date().toISOString(),
    base,
    routeCount: slugs.length,
    passedCount: results.filter(result => result.ok).length,
    failedCount: slugs.length - results.filter(result => result.ok).length,
    results,
  }
}

function writeRouteReport(root: string, report = buildRouteReport()) {
  const reportPath = path.join(root, 'routes.json')
  writeFileSync(reportPath, JSON.stringify(report))
  return reportPath
}

function createCleanupPlan(root: string, previousFiles: Record<string, { hash: string; size: number }>, currentFiles: Record<string, { hash: string; size: number }>) {
  const previousManifest = path.join(root, 'previous.json')
  const currentManifest = path.join(root, 'current.json')
  const planPath = path.join(root, 'plan.json')
  const commandsPath = path.join(root, 'cleanup.lftp')
  writeFileSync(previousManifest, JSON.stringify({ version: 2, fileCount: Object.keys(previousFiles).length, files: previousFiles }))
  writeFileSync(currentManifest, JSON.stringify({ version: 2, fileCount: Object.keys(currentFiles).length, files: currentFiles }))
  execFileSync(process.execPath, [cleanupScript, 'plan', `--manifest=${previousManifest}`, `--current-manifest=${currentManifest}`, '--slugs=src/data/legacy-ar-match-slugs.json', `--plan=${planPath}`, `--commands=${commandsPath}`], { encoding: 'utf8' })
  return { planPath, commandsPath }
}

function noopLog(response = '200 NOOP ok.') {
  return `__AR_FTP_NOOP_START__\n${response}\n__AR_FTP_NOOP_END__\n`
}

function assertDeployment(planPath: string, statsPath: string, commitMessage = 'fix: code-only') {
  return execFileSync(process.execPath, [deployGuardScript, `--plan=${planPath}`, `--diff-stats=${statsPath}`], {
    encoding: 'utf8',
    env: { ...process.env, DEPLOY_COMMIT_MESSAGE: commitMessage },
  })
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

describe('shared Arabic Match route', () => {
  it('retains every unique dated legacy URL and identifies only the exact unavailable record', () => {
    const matches = loadAllMatches(90)
    expect(new Set(slugs).size).toBe(slugs.length)
    expect(slugs.length).toBe(36)
    expect(slugs.every(slug => /^[\p{L}\p{N}_-]+-\d{4}-\d{2}-\d{2}$/u.test(slug))).toBe(true)
    expect(slugs.filter(slug => !matches.has(slug))).toEqual(['st-louis-city-sc-vs-lafc-2026-11-20'])
  })

  it('exports localized static match pages only in English and preserves the Arabic rewrite before fallbacks', () => {
    const candidates = [...loadAllMatches(90).values()]
    const params = getLocalizedMatchStaticParams(candidates, ['en'], new Date('2026-11-10T12:00:00.000Z'))
    expect(params.every(param => param.locale === 'en')).toBe(true)
    expect(params.length).toBeGreaterThan(0)

    const localizedPage = readFileSync('src/app/[locale]/match/[slug]/page.tsx', 'utf8')
    expect(localizedPage).toContain("getLocalizedMatchStaticParams([...loadAllMatches().values()], ['en'])")
    const htaccess = readFileSync('public/.htaccess', 'utf8')
    const arabicRewrite = htaccess.indexOf('RewriteRule ^ar/match/[^/]+-[0-9]{4}-[0-9]{2}-[0-9]{2}/?$ /ar/match.html [L]')
    const staticHtml = htaccess.indexOf('RewriteRule \\.html$ - [L]')
    expect(arabicRewrite).toBeGreaterThan(0)
    expect(arabicRewrite).toBeLessThan(staticHtml)
    expect(htaccess).not.toContain('RewriteRule ^en/match/')
    expect(htaccess).not.toMatch(/^RewriteRule \^match\/[^ ]+ \/match\.html/m)
  })

  it('loads published histories and team context without fabricating unavailable fields', () => {
    const route = readFileSync('src/app/ar/match/page.tsx', 'utf8')
    const component = readFileSync('src/components/bttsbet/ArabicMatchPopup.tsx', 'utf8')
    expect(route).toContain('getVerifiedHistoryForMatch')
    expect(route).toContain('loadTeamContext()')
    expect(route).toContain('...legacyArMatchSlugs')
    expect(route).not.toContain('Données publiques manquantes')
    expect(component).toContain('data-ar-match-shared-popup="true"')
    expect(component).toContain('بيانات المباراة غير متاحة')
    expect(component).toContain('لا توجد معلومات منشورة لهذا الرابط حالياً. لم تتم إضافة بيانات بديلة.')
    expect(component).not.toContain('dangerouslySetInnerHTML')
  })
})

describe('exact Arabic static Match cleanup allowlist', () => {
  it('builds candidates only from the 36 known slugs and local manifests, with no pre-route deletes', () => {
    const root = mkdtempSync(path.join(tmpdir(), 'btts-ar-match-cleanup-'))
    roots.push(root)
    const route = slugs[0]
    const candidatePaths = [
      `ar/match/${route}.html`,
      `ar/match/${route}.txt`,
      `ar/match/${route}/__next._index.txt`,
    ]
    const previousFiles: Record<string, { hash: string; size: number }> = Object.fromEntries([
      ...candidatePaths.map((name, index) => [name, { hash: `old-${index}`, size: index + 10 }]),
      ['ar/match/not-known-2026-11-22.html', { hash: 'unknown', size: 30 }],
      ['ar/match/index.html', { hash: 'index', size: 20 }],
      [`en/match/${route}.html`, { hash: 'en', size: 40 }],
      ['ar/match.html', { hash: 'shared', size: 50 }],
    ])
    const previousManifest = path.join(root, 'previous.json')
    const currentManifest = path.join(root, 'current.json')
    const planPath = path.join(root, 'plan.json')
    const commandsPath = path.join(root, 'cleanup.lftp')
    writeFileSync(previousManifest, JSON.stringify({ version: 2, fileCount: Object.keys(previousFiles).length, files: previousFiles }))
    writeFileSync(currentManifest, JSON.stringify({ version: 2, fileCount: 1, files: { 'ar/match.html': { hash: 'shared-current', size: 60 } } }))

    execFileSync(process.execPath, [cleanupScript, 'plan', `--manifest=${previousManifest}`, `--current-manifest=${currentManifest}`, '--slugs=src/data/legacy-ar-match-slugs.json', `--plan=${planPath}`, `--commands=${commandsPath}`], { encoding: 'utf8' })
    const plan = JSON.parse(readFileSync(planPath, 'utf8'))
    expect(plan.routeCount).toBe(36)
    expect(plan.candidateCount).toBe(3)
    expect(plan.candidates.map((item: { path: string }) => item.path).sort()).toEqual(candidatePaths.sort())
    expect(plan.deletionCount).toBe(0)
    expect(plan.deletions).toEqual([])
    expect(plan.presenceVerified).toBe(false)
    expect(readFileSync(commandsPath, 'utf8')).toBe('')

    const presenceCommands = path.join(root, 'presence.lftp')
    execFileSync(process.execPath, [cleanupScript, 'presence-commands', `--plan=${planPath}`, `--commands=${presenceCommands}`], { encoding: 'utf8' })
    const presenceCommandText = readFileSync(presenceCommands, 'utf8')
    expect(presenceCommandText).toContain('quote NOOP')
    expect(presenceCommandText).toContain('__AR_FTP_NOOP_START__')
    expect(presenceCommandText.match(/quote SIZE/g)).toHaveLength(3)
    expect(presenceCommandText).not.toContain('rm -f')
    expect(presenceCommandText).not.toContain('*')

    const presenceLog = path.join(root, 'presence.log')
    writeFileSync(presenceLog, noopLog() + plan.candidates.map((item: { path: string }, index: number) => [
      `__AR_SIZE_START_${index}__`,
      index === 1 ? '550 File not found' : `213 ${1000 + index}`,
      `__AR_SIZE_END_${index}__`,
    ].join('\n')).join('\n') + '\n')
    const routeReportPath = writeRouteReport(root)
    execFileSync(process.execPath, [cleanupScript, 'confirm-presence', `--plan=${planPath}`, `--log=${presenceLog}`, `--commands=${commandsPath}`, `--route-report=${routeReportPath}`, '--ftp-exit-code=0'], { encoding: 'utf8' })
    const confirmed = JSON.parse(readFileSync(planPath, 'utf8'))
    const expectedDeletes = plan.candidates.filter((_: unknown, index: number) => index !== 1)
    expect(confirmed.presenceVerified).toBe(true)
    expect(confirmed.presenceFtpNoopVerified).toBe(true)
    expect(confirmed.routeVerification.routeCount).toBe(36)
    expect(confirmed.presenceNoOpVerified).toBe(false)
    expect(confirmed.deletionCount).toBe(2)
    expect(confirmed.deletions.map((item: { path: string }) => item.path)).toEqual(expectedDeletes.map((item: { path: string }) => item.path))
    const statsPath = path.join(root, 'diff-stats.json')
    writeFileSync(statsPath, JSON.stringify({ newPathCount: 1 }))
    expect(() => assertDeployment(planPath, statsPath)).toThrow()
    expect(assertDeployment(planPath, statsPath, 'fix: [lws-files=100]')).toContain('[LWS quota exact]')
    const deleteCommands = readFileSync(commandsPath, 'utf8')
    expect(deleteCommands).toBe(expectedDeletes.map((item: { path: string }) => `rm -f '${item.path}'`).join('\n') + '\n')
    expect(deleteCommands).not.toContain('rm -r')
    expect(deleteCommands).not.toContain('*')
    expect(deleteCommands).not.toContain('ar/match/not-known')
    expect(deleteCommands).not.toContain('ar/match.html')

    const postCheck = path.join(root, 'post-cleanup.lftp')
    execFileSync(process.execPath, [cleanupScript, 'post-cleanup-commands', `--plan=${planPath}`, `--commands=${postCheck}`], { encoding: 'utf8' })
    expect(readFileSync(postCheck, 'utf8').match(/quote SIZE/g)).toHaveLength(2)
    const postLog = path.join(root, 'post-cleanup.log')
    const confirmedPlan = JSON.parse(readFileSync(planPath, 'utf8'))
    writeFileSync(postLog, confirmedPlan.deletions.map((_: unknown, index: number) => [
      `__AR_SIZE_START_${index}__`, '550 File not found', `__AR_SIZE_END_${index}__`,
    ].join('\n')).join('\n') + '\n')
    execFileSync(process.execPath, [cleanupScript, 'verify-absent', `--plan=${planPath}`, `--log=${postLog}`], { encoding: 'utf8' })
    expect(JSON.parse(readFileSync(planPath, 'utf8')).postCleanupVerified).toBe(true)
  })

  it('accepts a zero-candidate no-op only with an exact FTP response and all 36 live routes, and generates no delete', () => {
    const root = mkdtempSync(path.join(tmpdir(), 'btts-ar-match-empty-noop-'))
    roots.push(root)
    const { planPath, commandsPath } = createCleanupPlan(root,
      { 'ar/match.html': { hash: 'old-shared', size: 50 } },
      { 'ar/match.html': { hash: 'new-shared', size: 60 } },
    )
    const plan = JSON.parse(readFileSync(planPath, 'utf8'))
    expect(plan.candidateCount).toBe(0)
    const presenceCommands = path.join(root, 'presence.lftp')
    execFileSync(process.execPath, [cleanupScript, 'presence-commands', `--plan=${planPath}`, `--commands=${presenceCommands}`], { encoding: 'utf8' })
    const commandText = readFileSync(presenceCommands, 'utf8')
    expect(commandText).toContain('quote NOOP')
    expect(commandText).not.toContain('quote SIZE')
    expect(commandText).not.toContain('rm -f')
    expect(commandText).not.toContain('*')

    const logPath = path.join(root, 'presence.log')
    writeFileSync(logPath, noopLog())
    const routeReportPath = writeRouteReport(root)
    execFileSync(process.execPath, [cleanupScript, 'confirm-presence', `--plan=${planPath}`, `--log=${logPath}`, `--commands=${commandsPath}`, `--route-report=${routeReportPath}`, '--ftp-exit-code=0'], { encoding: 'utf8' })
    const confirmed = JSON.parse(readFileSync(planPath, 'utf8'))
    expect(confirmed.presenceVerified).toBe(true)
    expect(confirmed.presenceFtpExitCode).toBe(0)
    expect(confirmed.presenceFtpNoopVerified).toBe(true)
    expect(confirmed.presenceSizeCheckCount).toBe(0)
    expect(confirmed.presenceNoOpVerified).toBe(true)
    expect(confirmed.routeVerification.results).toHaveLength(36)
    expect(confirmed.candidates).toEqual([])
    expect(confirmed.deletions).toEqual([])
    expect(confirmed.deletionCount).toBe(0)
    expect(readFileSync(commandsPath, 'utf8')).toBe('')

    const statsPath = path.join(root, 'diff-stats.json')
    writeFileSync(statsPath, JSON.stringify({ newPathCount: 0 }))
    expect(assertDeployment(planPath, statsPath)).toContain('no-op prouvé')
    const postCheck = path.join(root, 'post-cleanup.lftp')
    execFileSync(process.execPath, [cleanupScript, 'post-cleanup-commands', `--plan=${planPath}`, `--commands=${postCheck}`], { encoding: 'utf8' })
    expect(readFileSync(postCheck, 'utf8')).toBe('')
    const postLog = path.join(root, 'post-cleanup.log')
    writeFileSync(postLog, '')
    execFileSync(process.execPath, [cleanupScript, 'verify-absent', `--plan=${planPath}`, `--log=${postLog}`], { encoding: 'utf8' })
    const finalPlan = JSON.parse(readFileSync(planPath, 'utf8'))
    expect(finalPlan.postCleanupVerified).toBe(true)
    expect(finalPlan.postCleanupVerifiedCount).toBe(0)
  })

  it.each([
    ['FTP exit code nonzero', '1', buildRouteReport(), noopLog()],
    ['only 35 route reports', '0', buildRouteReport({ routeSlugs: slugs.slice(0, 35) }), noopLog()],
    ['FTP NOOP response ambiguous', '0', buildRouteReport(), noopLog('200 NOOP ok.\n200 duplicate reply')],
  ])('blocks an empty candidate plan when %s', (_reason, ftpExitCode, routeReport, log) => {
    const root = mkdtempSync(path.join(tmpdir(), 'btts-ar-match-empty-fail-'))
    roots.push(root)
    const { planPath, commandsPath } = createCleanupPlan(root,
      { 'ar/match.html': { hash: 'old-shared', size: 50 } },
      { 'ar/match.html': { hash: 'new-shared', size: 60 } },
    )
    const presenceCommands = path.join(root, 'presence.lftp')
    execFileSync(process.execPath, [cleanupScript, 'presence-commands', `--plan=${planPath}`, `--commands=${presenceCommands}`], { encoding: 'utf8' })
    const logPath = path.join(root, 'presence.log')
    writeFileSync(logPath, log)
    const routeReportPath = writeRouteReport(root, routeReport)
    expect(() => execFileSync(process.execPath, [cleanupScript, 'confirm-presence', `--plan=${planPath}`, `--log=${logPath}`, `--commands=${commandsPath}`, `--route-report=${routeReportPath}`, `--ftp-exit-code=${ftpExitCode}`], { encoding: 'utf8', stdio: 'pipe' })).toThrow()
    expect(readFileSync(commandsPath, 'utf8')).toBe('')
    const unconfirmed = JSON.parse(readFileSync(planPath, 'utf8'))
    expect(unconfirmed.presenceVerified).toBe(false)
    expect(unconfirmed.deletionCount).toBe(0)
  })

  it('rejects a traversal path under ar/match before writing any cleanup plan', () => {
    const root = mkdtempSync(path.join(tmpdir(), 'btts-ar-match-traversal-'))
    roots.push(root)
    const previousManifest = path.join(root, 'previous.json')
    const currentManifest = path.join(root, 'current.json')
    const planPath = path.join(root, 'plan.json')
    const commandsPath = path.join(root, 'cleanup.lftp')
    writeFileSync(previousManifest, JSON.stringify({ version: 2, fileCount: 1, files: { 'ar/match/../keep.html': { hash: 'unsafe', size: 10 } } }))
    writeFileSync(currentManifest, JSON.stringify({ version: 2, fileCount: 1, files: { 'ar/match.html': { hash: 'shared', size: 20 } } }))
    expect(() => execFileSync(process.execPath, [cleanupScript, 'plan', `--manifest=${previousManifest}`, `--current-manifest=${currentManifest}`, '--slugs=src/data/legacy-ar-match-slugs.json', `--plan=${planPath}`, `--commands=${commandsPath}`], { encoding: 'utf8', stdio: 'pipe' })).toThrow()
    expect(() => readFileSync(commandsPath, 'utf8')).toThrow()
  })

  it('fails closed on an ambiguous FTP response and leaves the cleanup command file empty', () => {
    const root = mkdtempSync(path.join(tmpdir(), 'btts-ar-match-presence-fail-'))
    roots.push(root)
    const route = slugs[0]
    const filePath = `ar/match/${route}.html`
    const previousManifest = path.join(root, 'previous.json')
    const currentManifest = path.join(root, 'current.json')
    const planPath = path.join(root, 'plan.json')
    const commandsPath = path.join(root, 'cleanup.lftp')
    const logPath = path.join(root, 'presence.log')
    writeFileSync(previousManifest, JSON.stringify({ version: 2, fileCount: 1, files: { [filePath]: { hash: 'old', size: 10 } } }))
    writeFileSync(currentManifest, JSON.stringify({ version: 2, fileCount: 1, files: { 'ar/match.html': { hash: 'shared', size: 20 } } }))
    execFileSync(process.execPath, [cleanupScript, 'plan', `--manifest=${previousManifest}`, `--current-manifest=${currentManifest}`, '--slugs=src/data/legacy-ar-match-slugs.json', `--plan=${planPath}`, `--commands=${commandsPath}`], { encoding: 'utf8' })
    writeFileSync(logPath, `${noopLog()}__AR_SIZE_START_0__\n500 Unknown FTP response\n__AR_SIZE_END_0__\n`)
    const routeReportPath = writeRouteReport(root)
    expect(() => execFileSync(process.execPath, [cleanupScript, 'confirm-presence', `--plan=${planPath}`, `--log=${logPath}`, `--commands=${commandsPath}`, `--route-report=${routeReportPath}`, '--ftp-exit-code=0'], { encoding: 'utf8', stdio: 'pipe' })).toThrow()
    expect(readFileSync(commandsPath, 'utf8')).toBe('')
    const plan = JSON.parse(readFileSync(planPath, 'utf8'))
    expect(plan.presenceVerified).toBe(false)
    expect(plan.deletionCount).toBe(0)
  })
})
