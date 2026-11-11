import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

const tempRoots: string[] = []
const sourceScript = path.resolve(process.cwd(), 'scripts/ftp-diff.mjs')
const sourceProtectedRoutes = path.resolve(process.cwd(), 'scripts/protected-promo-routes.mjs')

function makeFixture() {
  const root = mkdtempSync(path.join(tmpdir(), 'btts-ftp-diff-'))
  tempRoots.push(root)
  const scriptsDir = path.join(root, 'scripts')
  const outDir = path.join(root, 'out')
  mkdirSync(scriptsDir, { recursive: true })
  mkdirSync(outDir, { recursive: true })
  const script = path.join(scriptsDir, 'ftp-diff.mjs')
  copyFileSync(sourceScript, script)
  copyFileSync(sourceProtectedRoutes, path.join(scriptsDir, 'protected-promo-routes.mjs'))
  return { root, outDir, script }
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) rmSync(root, { recursive: true, force: true })
})

describe('ftp-diff forced paths', () => {
  it('excludes data and archives from code-only transfer without filtering code chunks', () => {
    const { root, outDir, script } = makeFixture()
    const files = {
      'index.html': 'new code page\n',
      'predictions.json': 'new predictions data\n',
      'predictions-archive/2026-11-04.json': 'new historical archive\n',
      'team-context.json': 'new team data\n',
      'team-media/crest.jpg': 'new team image asset\n',
      '_next/static/chunks/app/predictions.json/route-123.js': 'new application code\n',
      'robots.txt': 'User-agent: *\nAllow: /\n',
      'sitemap.xml': '<urlset></urlset>\n',
    }
    const previousFiles: Record<string, { hash: string; size: number }> = {}
    let previousTotalBytes = 0
    for (const [rel, content] of Object.entries(files)) {
      const fullPath = path.join(outDir, rel)
      mkdirSync(path.dirname(fullPath), { recursive: true })
      writeFileSync(fullPath, content)
      const previousBytes = Buffer.from(`previous ${content}`)
      previousFiles[rel] = {
        hash: createHash('sha256').update(previousBytes).digest('hex').slice(0, 16),
        size: previousBytes.length,
      }
      previousTotalBytes += previousBytes.length
    }
    writeFileSync(
      path.join(outDir, 'deploy-manifest.prev.json'),
      JSON.stringify({ version: 2, fileCount: Object.keys(previousFiles).length, totalBytes: previousTotalBytes, files: previousFiles }),
    )

    execFileSync(
      process.execPath,
      [script, 'prepare', '--require-prev', '--code-only', '--force-path=robots.txt', '--force-path=sitemap.xml'],
      { cwd: root, encoding: 'utf8' },
    )

    const stats = JSON.parse(readFileSync(path.join(outDir, 'deploy-diff-stats.json'), 'utf8'))
    const deployList = readFileSync(path.join(outDir, 'deploy-list.txt'), 'utf8')
    expect(stats.codeOnlyMode).toBe(true)
    expect(stats.remoteManifestMustNotBePublished).toBe(true)
    expect(stats.codeOnlyExcludedPaths).toEqual([
      'predictions-archive/2026-11-04.json',
      'predictions.json',
      'team-context.json',
    ])
    expect(stats.changedCount).toBe(5)
    expect(stats.changedPaths).toHaveLength(5)
    expect(stats.bytesToAdd).toBe(
      Buffer.byteLength(files['index.html'])
      + Buffer.byteLength(files['team-media/crest.jpg'])
      + Buffer.byteLength(files['_next/static/chunks/app/predictions.json/route-123.js'])
      + Buffer.byteLength(files['robots.txt'])
      + Buffer.byteLength(files['sitemap.xml']),
    )
    expect(deployList).toContain('^index\\.html$')
    expect(deployList).toContain('team-media/crest\\.jpg')
    expect(deployList).toContain('predictions\\.json/route-123\\.js')
    expect(deployList).toContain('^robots\\.txt$')
    expect(deployList).toContain('^sitemap\\.xml$')
    expect(deployList).not.toContain('predictions-archive')
    expect(deployList).not.toContain('^predictions\\.json$')
    expect(deployList).not.toContain('^team-context\\.json$')
  })

  it('forces only the two history JSON paths in targeted code-only mode', () => {
    const { root, outDir, script } = makeFixture()
    const files = {
      'index.html': 'current code page\n',
      'history-exclusions.json': '{"entries":[]}\n',
      'win-history.json': '{"history":[]}\n',
      'predictions.json': '{"predictions":[]}\n',
      'transfers.json': '{"transfers":[]}\n',
      'vip-combos.json': '{"combos":[]}\n',
      'team-context.json': '{"teams":[]}\n',
      'predictions-archive/old.json': '{"archive":[]}\n',
    }
    const previousFiles: Record<string, { hash: string; size: number }> = {}
    let previousTotalBytes = 0
    for (const [rel, content] of Object.entries(files)) {
      const fullPath = path.join(outDir, rel)
      mkdirSync(path.dirname(fullPath), { recursive: true })
      const bytes = Buffer.from(content)
      writeFileSync(fullPath, bytes)
      const previousBytes = ['history-exclusions.json', 'win-history.json'].includes(rel)
        ? bytes
        : Buffer.from(`previous ${content}`)
      previousFiles[rel] = {
        hash: createHash('sha256').update(previousBytes).digest('hex').slice(0, 16),
        size: previousBytes.length,
      }
      previousTotalBytes += previousBytes.length
    }
    writeFileSync(
      path.join(outDir, 'deploy-manifest.prev.json'),
      JSON.stringify({ version: 2, fileCount: Object.keys(previousFiles).length, totalBytes: previousTotalBytes, files: previousFiles }),
    )

    execFileSync(process.execPath, [
      script, 'prepare', '--require-prev', '--code-only', '--history-json-only',
      '--force-path=history-exclusions.json', '--force-path=win-history.json',
    ], { cwd: root, encoding: 'utf8' })

    const stats = JSON.parse(readFileSync(path.join(outDir, 'deploy-diff-stats.json'), 'utf8'))
    const deployList = readFileSync(path.join(outDir, 'deploy-list.txt'), 'utf8')
    expect(stats.codeOnlyMode).toBe(true)
    expect(stats.historyJsonMode).toBe(true)
    expect(stats.remoteManifestMustNotBePublished).toBe(true)
    expect(stats.codeOnlyExcludedPaths).toEqual([
      'predictions-archive/old.json', 'predictions.json', 'team-context.json', 'transfers.json', 'vip-combos.json',
    ])
    expect(stats.changedCount).toBe(3)
    expect(stats.changedPaths).toEqual(['index.html', 'history-exclusions.json', 'win-history.json'])
    expect(deployList).toContain('^history-exclusions\\.json$')
    expect(deployList).toContain('^win-history\\.json$')
    expect(deployList).not.toContain('predictions-archive')
    expect(deployList).not.toContain('^predictions\\.json$')
    expect(deployList).not.toContain('^transfers\\.json$')
  })

  it('fails closed when a forced history JSON path is missing from out', () => {
    const { root, outDir, script } = makeFixture()
    const content = Buffer.from('current page\n')
    writeFileSync(path.join(outDir, 'index.html'), content)
    writeFileSync(path.join(outDir, 'deploy-manifest.prev.json'), JSON.stringify({
      version: 2,
      fileCount: 1,
      totalBytes: content.length,
      files: { 'index.html': { hash: createHash('sha256').update('old page\n').digest('hex').slice(0, 16), size: 9 } },
    }))
    expect(() => execFileSync(process.execPath, [
      script, 'prepare', '--require-prev', '--code-only', '--history-json-only',
      '--force-path=history-exclusions.json', '--force-path=win-history.json',
    ], { cwd: root, encoding: 'utf8' })).toThrow(/fichier absent de out\/|non-zero exit code/)
  })

  it('includes unchanged required root files and counts their bytes', () => {
    const { root, outDir, script } = makeFixture()
    const files = {
      '.htaccess': 'routing rules\n',
      'robots.txt': 'User-agent: *\nAllow: /\n',
      'sitemap.xml': '<urlset></urlset>\n',
    }
    const previousFiles: Record<string, { hash: string; size: number }> = {}
    let totalBytes = 0

    for (const [rel, content] of Object.entries(files)) {
      const bytes = Buffer.from(content)
      writeFileSync(path.join(outDir, rel), bytes)
      previousFiles[rel] = {
        hash: createHash('sha256').update(bytes).digest('hex').slice(0, 16),
        size: bytes.length,
      }
      totalBytes += bytes.length
    }

    writeFileSync(
      path.join(outDir, 'deploy-manifest.prev.json'),
      JSON.stringify({ version: 2, fileCount: Object.keys(previousFiles).length, totalBytes, files: previousFiles }),
    )

    execFileSync(
      process.execPath,
      [
        script,
        'prepare',
        '--require-prev',
        '--force-path=.htaccess',
        '--force-path=robots.txt',
        '--force-path=sitemap.xml',
      ],
      { cwd: root, encoding: 'utf8' },
    )

    const stats = JSON.parse(readFileSync(path.join(outDir, 'deploy-diff-stats.json'), 'utf8'))
    const deployList = readFileSync(path.join(outDir, 'deploy-list.txt'), 'utf8')
    expect(stats.changedCount).toBe(3)
    expect(stats.changedPathCount).toBe(3)
    expect(stats.newPathCount).toBe(0)
    expect(stats.bytesToAdd).toBe(totalBytes)
    expect(stats.changedPaths).toEqual(['.htaccess', 'robots.txt', 'sitemap.xml'])
    expect(deployList).toBe('^\\.htaccess$\n^robots\\.txt$\n^sitemap\\.xml$\n')
  })

  it('deploys only the approved English Linebet copy and preserves other promo routes', () => {
    const { root, outDir, script } = makeFixture()
    const current = {
      '.htaccess': 'routing rules\n',
      'robots.txt': 'User-agent: *\nAllow: /\n',
      'sitemap.xml': '<urlset></urlset>\n',
      'index.html': 'current home\n',
      'code-promo-linebet-senegal.html': 'unchanged French page\n',
      'en/code-promo-linebet-senegal.html': 'local clicked page\n',
      'en/code-promo-linebet-senegal.txt': 'local clicked sidecar\n',
      'en/code-promo-linebet-senegal/__next._full.txt': 'local clicked RSC\n',
      'ar/code-promo-1xbet.html': 'unapproved local variant\n',
      'en/bonus-888starz.html': 'unapproved local bonus page\n',
      '_next/static/chunks/app/[locale]/code-promo-linebet-senegal/page-abc.js': 'shared code chunk\n',
    }
    const previousFiles: Record<string, { hash: string; size: number }> = {}
    let previousTotalBytes = 0
    const writePrevious = (rel: string, value: string) => {
      const bytes = Buffer.from(value)
      previousFiles[rel] = { hash: createHash('sha256').update(bytes).digest('hex').slice(0, 16), size: bytes.length }
      previousTotalBytes += bytes.length
    }
    for (const [rel, value] of Object.entries(current)) {
      const fullPath = path.join(outDir, rel)
      mkdirSync(path.dirname(fullPath), { recursive: true })
      writeFileSync(fullPath, value)
      const protectedPath = rel.startsWith('ar/code-promo-1xbet') || rel.startsWith('en/bonus-888starz')
      const approvedLinebetPath = rel === 'en/code-promo-linebet-senegal.html'
        || rel === 'en/code-promo-linebet-senegal.txt'
        || rel.startsWith('en/code-promo-linebet-senegal/')
      const absentOnLive = rel === 'ar/code-promo-1xbet.html'
      if (!absentOnLive) {
        const previous = protectedPath || approvedLinebetPath
          ? `published ${value}`
          : rel === '_next/static/chunks/app/[locale]/code-promo-linebet-senegal/page-abc.js'
            ? 'old shared code chunk\n'
            : value
        writePrevious(rel, previous)
      }
    }
    writePrevious('en/bonus-888starz/__next.live-only.txt', 'published sidecar not in local build\n')
    writeFileSync(path.join(outDir, 'deploy-manifest.prev.json'), JSON.stringify({
      version: 2,
      fileCount: Object.keys(previousFiles).length,
      totalBytes: previousTotalBytes,
      files: previousFiles,
    }))

    execFileSync(process.execPath, [script, 'manifest'], { cwd: root, encoding: 'utf8' })
    const manifest = JSON.parse(readFileSync(path.join(outDir, 'deploy-manifest.json'), 'utf8')) as { fileCount: number; totalBytes: number; files: Record<string, { hash: string; size: number }> }
    expect(manifest.files['en/code-promo-linebet-senegal.html'].hash).toBe(createHash('sha256').update(current['en/code-promo-linebet-senegal.html']).digest('hex').slice(0, 16))
    expect(manifest.files['en/code-promo-linebet-senegal.txt'].hash).toBe(createHash('sha256').update(current['en/code-promo-linebet-senegal.txt']).digest('hex').slice(0, 16))
    expect(manifest.files['en/code-promo-linebet-senegal/__next._full.txt'].hash).toBe(createHash('sha256').update(current['en/code-promo-linebet-senegal/__next._full.txt']).digest('hex').slice(0, 16))
    expect(manifest.files['en/bonus-888starz.html'].hash).toBe(previousFiles['en/bonus-888starz.html'].hash)
    expect(manifest.files['en/bonus-888starz/__next.live-only.txt'].hash).toBe(previousFiles['en/bonus-888starz/__next.live-only.txt'].hash)
    expect(manifest.files['ar/code-promo-1xbet.html']).toBeUndefined()
    expect(manifest.fileCount).toBe(Object.keys(manifest.files).length)
    expect(manifest.totalBytes).toBe(Object.values(manifest.files).reduce((sum, file) => sum + file.size, 0))

    execFileSync(process.execPath, [script, 'prepare', '--require-prev'], { cwd: root, encoding: 'utf8' })
    const stats = JSON.parse(readFileSync(path.join(outDir, 'deploy-diff-stats.json'), 'utf8'))
    const deployList = readFileSync(path.join(outDir, 'deploy-list.txt'), 'utf8')
    expect(stats.newPaths).toEqual([])
    expect(stats.changedPaths).toHaveLength(4)
    expect(stats.changedPaths).toEqual(expect.arrayContaining([
      '_next/static/chunks/app/[locale]/code-promo-linebet-senegal/page-abc.js',
      'en/code-promo-linebet-senegal.html',
      'en/code-promo-linebet-senegal.txt',
      'en/code-promo-linebet-senegal/__next._full.txt',
    ]))
    expect(deployList).toContain('^en/code-promo-linebet-senegal\\.html$')
    expect(deployList).toContain('^en/code-promo-linebet-senegal\\.txt$')
    expect(deployList).toContain('code-promo-linebet-senegal/page-abc')
    expect(deployList).not.toContain('^code-promo-linebet-senegal\\.html$')
    expect(deployList).not.toContain('ar/code-promo-1xbet')
    expect(deployList).not.toContain('en/bonus-888starz')
  })

})
