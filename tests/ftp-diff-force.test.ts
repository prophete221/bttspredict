import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

const tempRoots: string[] = []
const sourceScript = path.resolve(process.cwd(), 'scripts/ftp-diff.mjs')

function makeFixture() {
  const root = mkdtempSync(path.join(tmpdir(), 'btts-ftp-diff-'))
  tempRoots.push(root)
  const scriptsDir = path.join(root, 'scripts')
  const outDir = path.join(root, 'out')
  mkdirSync(scriptsDir, { recursive: true })
  mkdirSync(outDir, { recursive: true })
  const script = path.join(scriptsDir, 'ftp-diff.mjs')
  copyFileSync(sourceScript, script)
  return { root, outDir, script }
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) rmSync(root, { recursive: true, force: true })
})

describe('ftp-diff forced paths', () => {
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
})
