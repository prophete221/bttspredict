import { describe, expect, it } from 'vitest'
import { assertHistoryJsonOnlyPlan, buildTransferReport, buildUploadPlan } from '../scripts/prepare-ftp-upload-allowlist.mjs'

const manifest = (files: Record<string, string>) => ({
  fileCount: Object.keys(files).length,
  files: Object.fromEntries(Object.entries(files).map(([name, hash], index) => [name, { hash, size: index + 1 }])),
})

const diffStats = (paths: string[], {
  codeOnly = true,
  historyJsonMode = false,
  excluded = [],
}: { codeOnly?: boolean; historyJsonMode?: boolean; excluded?: string[] } = {}) => ({
  schemaVersion: 2,
  changedCount: paths.length,
  codeOnlyMode: codeOnly,
  historyJsonMode,
  remoteManifestMustNotBePublished: codeOnly,
  newPaths: paths,
  changedPaths: [],
  missingOnRemote: [],
  codeOnlyExcludedPaths: excluded,
})

describe('validated FTP upload allowlist', () => {
  it('emits exact put commands only for differential paths and keeps protected roots/data out of code-only', () => {
    const input = manifest({
      'index.html': 'home',
      'unchanged.css': 'unchanged',
      '.htaccess': 'htaccess',
      'robots.txt': 'robots',
      'sitemap.xml': 'sitemap',
      'predictions.json': 'predictions',
      'win-history.json': 'wins',
      'history-exclusions.json': 'history-exclusions',
      'transfers.json': 'transfers',
      'vip-combos.json': 'vip',
      'team-context.json': 'team-context',
      'predictions-archive/2026-11-04.json': 'archive',
      'team-media/crest.jpg': 'media',
      'partners/partner-page.html': 'partner',
      '_next/static/chunks/app/[locale]/predictions.json/route.js': 'code-chunk',
      'predeploy-backups/sitemap.xml': 'backup',
      'deploy-manifest.json': 'manifest',
      'remote-inventory.tsv': 'inventory',
    })
    const dataPaths = [
      'history-exclusions.json', 'predictions-archive/2026-11-04.json', 'predictions.json',
      'team-context.json', 'transfers.json', 'vip-combos.json', 'win-history.json',
    ]
    const paths = [
      'index.html', '.htaccess', 'robots.txt', 'sitemap.xml',
      ...dataPaths, 'team-media/crest.jpg', 'partners/partner-page.html',
      '_next/static/chunks/app/[locale]/predictions.json/route.js',
      'predeploy-backups/sitemap.xml', 'deploy-manifest.json', 'remote-inventory.tsv',
    ]
    const plan = buildUploadPlan(input, { codeOnly: true, diffStats: diffStats(paths, { excluded: dataPaths }) })
    const script = plan.commands.join('\n')
    expect(plan.uploadPaths).toEqual([
      '_next/static/chunks/app/[locale]/predictions.json/route.js',
      'index.html',
      'partners/partner-page.html',
      'team-media/crest.jpg',
    ])
    expect(plan.diffFileCount).toBe(paths.length)
    expect(plan.excludedDataPaths).toEqual(dataPaths.slice().sort())
    expect(plan.excludedProtectedPaths).toEqual(['.htaccess'])
    expect(plan.explicitRootFiles.map(file => file.path)).toEqual(['robots.txt', 'sitemap.xml'])
    expect(plan.excludedInternalPaths).toEqual(['deploy-manifest.json', 'predeploy-backups/sitemap.xml', 'remote-inventory.tsv'])
    expect(script).toContain('set cmd:fail-exit yes')
    expect(script).toContain('lcd out')
    expect(script).toContain("mkdir -pf '_next/static/chunks/app/[locale]/predictions.json'")
    expect(script).toContain("put '_next/static/chunks/app/[locale]/predictions.json/route.js' -o './_next/static/chunks/app/[locale]/predictions.json/route.js'")
    expect(script).toContain("put 'index.html' -o './index.html'")
    expect(script).toContain("put 'robots.txt' -o './robots.txt'")
    expect(script).toContain("put 'sitemap.xml' -o './sitemap.xml'")
    expect(script).not.toContain('.htaccess')
    expect(script).not.toContain('predictions-archive')
    expect(script).not.toContain("put 'predictions.json'")
    expect(script).not.toContain('deploy-manifest.json')
    expect(script).not.toContain("put 'unchanged.css'")
    expect(plan.remoteManifestUpdated).toBe(false)
    expect(plan.commands.at(-1)).toBe('bye')
    expect(plan.commands.indexOf("put 'robots.txt' -o './robots.txt'")).toBeGreaterThan(
      plan.commands.indexOf("put 'team-media/crest.jpg' -o './team-media/crest.jpg'"),
    )
  })

  it('allows exactly the two forced history JSON files in targeted code-only mode', () => {
    const historyPaths = ['history-exclusions.json', 'win-history.json']
    const excludedPaths = [
      'predictions-archive/old.json', 'predictions.json', 'team-context.json',
      'transfers.json', 'vip-combos.json',
    ]
    const paths = ['index.html', ...historyPaths, ...excludedPaths]
    const stats = diffStats(paths, { historyJsonMode: true, excluded: excludedPaths })
    const plan = buildUploadPlan(manifest({
      '.htaccess': 'htaccess',
      'robots.txt': 'robots',
      'sitemap.xml': 'sitemap',
      'index.html': 'code',
      'history-exclusions.json': 'exclusions',
      'win-history.json': 'history',
      'predictions.json': 'predictions',
      'predictions-archive/old.json': 'archive',
      'team-context.json': 'context',
      'transfers.json': 'transfers',
      'vip-combos.json': 'vip',
    }), { codeOnly: true, historyJsonMode: true, diffStats: stats })

    expect(plan.uploadPaths).toEqual(['history-exclusions.json', 'index.html', 'win-history.json'])
    expect(plan.uploadPaths.filter(path => /^(?:predictions|win-history|history-exclusions|transfers|vip-combos|team-context)\.json$/.test(path) || path.startsWith('predictions-archive/')))
      .toEqual(historyPaths)
    expect(plan.excludedDataPaths).toEqual(excludedPaths)
    expect(plan.remoteManifestUpdated).toBe(false)
    expect(plan.commands).toContain("put 'history-exclusions.json' -o './history-exclusions.json'")
    expect(plan.commands).toContain("put 'win-history.json' -o './win-history.json'")
    expect(assertHistoryJsonOnlyPlan(plan, stats)).toBe(true)
    const unsafePlan = {
      ...plan,
      uploadPaths: [...plan.uploadPaths, 'predictions.json'],
      commands: [...plan.commands, "put 'predictions.json' -o './predictions.json'"],
      uploadFileCount: plan.uploadFileCount + 1,
      commandCount: plan.commandCount + 1,
    }
    expect(() => assertHistoryJsonOnlyPlan(unsafePlan, stats)).toThrow(/seuls win-history\.json et history-exclusions\.json/)

    const withoutWinHistory = diffStats(['history-exclusions.json'], { historyJsonMode: true })
    expect(() => buildUploadPlan(manifest({
      '.htaccess': 'htaccess', 'robots.txt': 'robots', 'sitemap.xml': 'sitemap',
      'history-exclusions.json': 'exclusions', 'win-history.json': 'history',
    }), { codeOnly: true, historyJsonMode: true, diffStats: withoutWinHistory })).toThrow(/exactement win-history\.json et history-exclusions\.json/)
  })

  it('filters code-only data even if a malformed diff includes it, while retaining media and JSON-named app chunks', () => {
    const plan = buildUploadPlan(manifest({
      '.htaccess': 'htaccess',
      'robots.txt': 'robots',
      'sitemap.xml': 'sitemap',
      'team-media/crest.jpg': 'media',
      '_next/static/chunks/app/predictions.json/route.js': 'chunk',
      'predictions.json': 'data',
      'predictions-archive/old.json': 'archive',
    }), { codeOnly: true, diffStats: diffStats(['team-media/crest.jpg', '_next/static/chunks/app/predictions.json/route.js', 'predictions.json', 'predictions-archive/old.json'], { excluded: ['predictions.json', 'predictions-archive/old.json'] }) })
    expect(plan.uploadPaths).toContain('team-media/crest.jpg')
    expect(plan.uploadPaths).toContain('_next/static/chunks/app/predictions.json/route.js')
    expect(plan.uploadPaths).not.toContain('predictions.json')
    expect(plan.uploadPaths).not.toContain('predictions-archive/old.json')
  })

  it('preserves dollar signs literally in valid Next.js App Router paths', () => {
    const plan = buildUploadPlan(manifest({
      '.htaccess': 'htaccess',
      'robots.txt': 'robots',
      'sitemap.xml': 'sitemap',
      'ar/___next.$d$locale.__PAGE__.txt': 'next page marker',
    }), { codeOnly: true, diffStats: diffStats(['ar/___next.$d$locale.__PAGE__.txt']) })
    const script = plan.commands.join('\n')
    expect(script).toContain("put 'ar/___next.$d$locale.__PAGE__.txt' -o './ar/___next.$d$locale.__PAGE__.txt'")
    expect(plan.uploadPaths).toContain('ar/___next.$d$locale.__PAGE__.txt')
  })

  it('includes protected data in a full-mode differential script but keeps htaccess and roots separate', () => {
    const paths = ['predictions.json', 'predictions-archive/old.json']
    const plan = buildUploadPlan(manifest({
      '.htaccess': 'htaccess',
      'robots.txt': 'robots',
      'sitemap.xml': 'sitemap',
      'predictions.json': 'data',
      'predictions-archive/old.json': 'archive',
    }), { codeOnly: false, diffStats: diffStats(paths, { codeOnly: false }) })
    expect(plan.uploadPaths).toContain('predictions.json')
    expect(plan.uploadPaths).toContain('predictions-archive/old.json')
    expect(plan.commands.join('\n')).not.toContain('.htaccess')
    expect(plan.commands.at(-2)).toContain('deploy-manifest.json')
    expect(plan.remoteManifestUpdated).toBe(true)
  })

  it('rejects missing/invalid diff inputs, unsafe paths, and missing explicit root files', () => {
    expect(() => buildUploadPlan({ files: {} }, { codeOnly: true })).toThrow(/vide/)
    const small = manifest({ '.htaccess': 'h', 'robots.txt': 'r', 'sitemap.xml': 's', 'index.html': 'home' })
    expect(() => buildUploadPlan(small, { codeOnly: true })).toThrow(/transfert intégral refusé/)
    expect(() => buildUploadPlan(small, { codeOnly: true, diffStats: diffStats(['../outside.js']) })).toThrow(/Chemin non relatif/)
    expect(() => buildUploadPlan(manifest({ '../outside.js': 'x', '.htaccess': 'h', 'robots.txt': 'r', 'sitemap.xml': 's' }), { codeOnly: true, diffStats: diffStats(['../outside.js']) })).toThrow(/Chemin non relatif/)
    expect(() => buildUploadPlan(manifest({ 'bad;bye': 'x', '.htaccess': 'h', 'robots.txt': 'r', 'sitemap.xml': 's' }), { codeOnly: true, diffStats: diffStats(['bad;bye']) })).toThrow(/Caractère de commande/)
    expect(() => buildUploadPlan(manifest({ 'index.html': 'x', '.htaccess': 'h', 'robots.txt': 'r' }), { codeOnly: true, diffStats: diffStats([]) })).toThrow(/sitemap.xml/)
  })

  it('records the exact diff paths and overall LFTP return code after success or failure', () => {
    const plan = buildUploadPlan(manifest({
      '.htaccess': 'htaccess',
      'robots.txt': 'robots',
      'sitemap.xml': 'sitemap',
      'index.html': 'home',
      'unchanged.css': 'unchanged',
    }), { codeOnly: true, diffStats: diffStats(['index.html']) })
    const success = buildTransferReport(plan, 'put: index.html\nSTOR robots.txt', 0)
    expect(success.status).toBe('success')
    expect(success.ftpExitCode).toBe(0)
    expect(success.confirmedUploadedPaths).toEqual(['index.html', 'robots.txt', 'sitemap.xml'])
    expect(success.observedTransferLogLines).toEqual(['put: index.html', 'STOR robots.txt'])
    expect(success.explicitRootFiles.map(file => file.result)).toEqual(['confirmed-by-command-exit', 'confirmed-by-command-exit'])
    expect(success.remoteManifestUpdated).toBe(false)

    const failure = buildTransferReport(plan, 'put: index.html\n550 permission denied', 1)
    expect(failure.status).toBe('failed')
    expect(failure.confirmedUploadedPaths).toEqual([])
    expect(failure.explicitRootFiles.map(file => file.result)).toEqual(['not-confirmed', 'not-confirmed'])
  })
})
