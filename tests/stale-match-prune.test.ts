import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { generateMatchSlug } from '@/lib/match-slug'

const sourceScript = path.resolve('scripts/prepare-stale-match-deletions.mjs')
const tempRoots: string[] = []

function runFixture(currentPath = 'match/today-upcoming-vs-opponent-2026-11-04.html') {
  const root = mkdtempSync(path.join(tmpdir(), 'btts-match-prune-'))
  tempRoots.push(root)
  const publicDir = path.join(root, 'public')
  mkdirSync(path.join(publicDir, 'predictions-archive'), { recursive: true })
  const oldSlug = 'old-match-vs-team-2026-10-01'
  const finishedTodaySlug = generateMatchSlug('Today Finished', 'Opponent', '2026-11-04')
  const liveTodaySlug = generateMatchSlug('Today Live', 'Opponent', '2026-11-04')
  const upcomingTodaySlug = generateMatchSlug('Today Upcoming', 'Opponent', '2026-11-04')
  writeFileSync(path.join(publicDir, 'predictions.json'), JSON.stringify({
    free: [
      { home: 'Today Finished', away: 'Opponent', date: '2026-11-04', time: '06:00' },
      { home: 'Today Live', away: 'Opponent', date: '2026-11-04', time: '09:00' },
      { home: 'Today Upcoming', away: 'Opponent', date: '2026-11-04', time: '12:00' },
    ],
  }))

  const paths = [
    `match/${oldSlug}.html`,
    `en/match/${oldSlug}.html`,
    `ar/match/${oldSlug}/index.html`,
    `match/${finishedTodaySlug}.html`,
    `match/${liveTodaySlug}.html`,
    `match/${upcomingTodaySlug}.html`,
    'match/future-unlisted-vs-team-2026-11-05.html',
    'assets/old-logo.svg',
    'predictions-archive/2026-10-01.json',
    '.htaccess',
    'robots.txt',
    'sitemap.xml',
  ]
  const inventory = path.join(root, 'remote-inventory.tsv')
  writeFileSync(inventory, paths.map((name, index) => `${name}\tF\t${index + 10}`).join('\n') + '\n')
  const currentManifest = path.join(root, 'deploy-manifest.json')
  writeFileSync(currentManifest, JSON.stringify({ files: { [currentPath]: { hash: 'abc', size: 1 } } }))
  const output = path.join(root, 'stale-match-pages.json')
  const review = path.join(root, 'orphan-review.json')
  const commands = path.join(root, 'stale-match-delete.lftp')

  execFileSync(process.execPath, [
    '--experimental-strip-types',
    sourceScript,
    `--inventory=${inventory}`,
    `--current-manifest=${currentManifest}`,
    `--output=${output}`,
    `--review=${review}`,
    `--delete-commands=${commands}`,
    `--public-dir=${publicDir}`,
    '--now=2026-11-04T10:00:00.000Z',
  ], { cwd: path.resolve('.'), encoding: 'utf8' })

  return {
    paths,
    output: JSON.parse(readFileSync(output, 'utf8')),
    review: JSON.parse(readFileSync(review, 'utf8')),
    commands: readFileSync(commands, 'utf8'),
    finishedTodaySlug,
    liveTodaySlug,
    upcomingTodaySlug,
  }
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) rmSync(root, { recursive: true, force: true })
})

describe('safe stale-match deletion planning', () => {
  it('targets only finished EN/AR Match HTML absent from the current export', () => {
    const result = runFixture()
    const deletedPaths = result.output.deletions.map((item: { path: string }) => item.path)
    expect(deletedPaths).toEqual([
      'ar/match/old-match-vs-team-2026-10-01/index.html',
      'en/match/old-match-vs-team-2026-10-01.html',
    ])
    expect(result.output.timezone).toBe('Africa/Dakar')
    expect(result.output.today).toBe('2026-11-04')
    expect(result.output.deletionCount).toBe(2)
    expect(result.commands).toContain('rm -f "ar/match/')
    expect(result.commands).toContain('rm -f "en/match/')
    expect(result.commands).not.toContain('rm -f "match/')
    expect(result.commands).not.toContain('assets/')
    expect(result.commands).not.toContain('.htaccess')
  })

  it('preserves French root Match pages, active matches, protected files and prediction archives', () => {
    const result = runFixture()
    const deletedPaths = result.output.deletions.map((item: { path: string }) => item.path)
    for (const protectedPath of [
      'match/old-match-vs-team-2026-10-01.html',
      `match/${result.finishedTodaySlug}.html`,
      `match/${result.upcomingTodaySlug}.html`,
      `match/${result.liveTodaySlug}.html`,
      'match/future-unlisted-vs-team-2026-11-05.html',
      '.htaccess', 'robots.txt', 'sitemap.xml', 'predictions-archive/2026-10-01.json',
    ]) expect(deletedPaths).not.toContain(protectedPath)
    expect(result.review.candidates).toContainEqual(expect.objectContaining({ path: 'match/old-match-vs-team-2026-10-01.html', category: 'match-root-out-of-scope' }))
    expect(result.review.candidates).toContainEqual(expect.objectContaining({ path: `match/${result.finishedTodaySlug}.html`, category: 'match-root-out-of-scope' }))
    expect(result.review.candidates).toContainEqual(expect.objectContaining({ path: 'assets/old-logo.svg', category: 'non-match-unverified' }))
    expect(result.review.candidates).toContainEqual(expect.objectContaining({ path: 'predictions-archive/2026-10-01.json', category: 'non-match-unverified' }))
  })

  it('fails closed if the current export contains a finished Match HTML page', () => {
    expect(() => runFixture('match/old-match-vs-team-2026-10-01.html')).toThrow(/page Match terminée/)
  })

  it('does not produce deletions if the remote inventory is empty', () => {
    const root = mkdtempSync(path.join(tmpdir(), 'btts-match-prune-empty-'))
    tempRoots.push(root)
    const inventory = path.join(root, 'empty.tsv')
    const manifest = path.join(root, 'manifest.json')
    writeFileSync(inventory, '')
    writeFileSync(manifest, JSON.stringify({ files: {} }))
    expect(() => execFileSync(process.execPath, [
      '--experimental-strip-types', sourceScript,
      `--inventory=${inventory}`,
      `--current-manifest=${manifest}`,
      `--output=${path.join(root, 'stale.json')}`,
      `--review=${path.join(root, 'review.json')}`,
      `--delete-commands=${path.join(root, 'delete.lftp')}`,
      `--public-dir=${path.join(root, 'public')}`,
      '--now=2026-11-04T10:00:00.000Z',
    ], { cwd: path.resolve('.'), encoding: 'utf8', stdio: 'pipe' })).toThrow()
  })
})
