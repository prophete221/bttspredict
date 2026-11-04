import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { generateMatchSlug } from '@/lib/match-slug'

const sourceScript = path.resolve('scripts/filter-sitemap-match-urls.mjs')
const tempRoots: string[] = []
const oldSlug = 'west-ham-united-vs-queens-park-rangers-2026-10-09'

function runFilter(deletions: Array<{ path: string; status: string }>, currentPaths: string[] = []) {
  const root = mkdtempSync(path.join(tmpdir(), 'btts-sitemap-filter-'))
  tempRoots.push(root)
  const builtPath = path.join(root, 'built-sitemap.xml')
  const previousPath = path.join(root, 'remote-sitemap.xml')
  const reportPath = path.join(root, 'stale-match-pages.json')
  const outputPath = path.join(root, 'sitemap.xml')
  const filterReportPath = path.join(root, 'sitemap-filter-report.json')
  const manifestPath = path.join(root, 'deploy-manifest.json')
  const oldUntrackedSlug = 'manual-delete-vs-team-2026-10-05'
  const finishedTodaySlug = generateMatchSlug('Today Finished', 'Opponent', '2026-11-04')
  const liveTodaySlug = generateMatchSlug('Today Live', 'Opponent', '2026-11-04')
  const upcomingTodaySlug = generateMatchSlug('Today Upcoming', 'Opponent', '2026-11-04')

  const built = [
    '<?xml version="1.0" encoding="UTF-8"?>\n',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n',
    '  <url><loc>https://bttspredict.com/</loc><lastmod>2026-11-04</lastmod><changefreq>daily</changefreq><priority>1</priority></url>\n',
    '  <url><loc>https://bttspredict.com/en/btts-and-over-2-5-predictions-today</loc><lastmod>2026-11-04</lastmod><changefreq>daily</changefreq><priority>0.97</priority></url>\n',
    '  <url><loc>https://bttspredict.com/new-build-route</loc><lastmod>2026-11-04</lastmod><priority>0.8</priority></url>\n',
    '</urlset>\n',
  ].join('')
  const previous = [
    '<?xml version="1.0" encoding="UTF-8"?>\n',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n',
    '  <url><loc>https://bttspredict.com/</loc><lastmod>2026-10-01</lastmod><changefreq>weekly</changefreq><priority>1</priority></url>\n',
    '  <url><loc>https://bttspredict.com/en/btts-and-over-2-5-predictions-today</loc><lastmod>2026-10-01</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>\n',
    `  <url><loc>https://bttspredict.com/match/${oldSlug}</loc><lastmod>2026-10-23</lastmod><xhtml:link rel="alternate" hreflang="en" href="https://bttspredict.com/en/match/${oldSlug}" /></url>\n`,
    `  <url><loc>https://bttspredict.com/en/match/${oldSlug}/</loc><lastmod>2026-10-23</lastmod><xhtml:link rel="alternate" hreflang="fr" href="https://bttspredict.com/match/${oldSlug}" /></url>\n`,
    `  <url><loc>https://bttspredict.com/ar/match/${oldSlug}/</loc><lastmod>2026-10-23</lastmod><xhtml:link rel="alternate" hreflang="fr" href="https://bttspredict.com/match/${oldSlug}" /></url>\n`,
    `  <url><loc>https://bttspredict.com/ar/match/${oldUntrackedSlug}</loc><lastmod>2026-10-05</lastmod><priority>0.8</priority></url>\n`,
    `  <url><loc>https://bttspredict.com/match/${finishedTodaySlug}</loc><lastmod>2026-11-04</lastmod><priority>0.8</priority></url>\n`,
    '  <url><loc>https://bttspredict.com/legacy-valid-route</loc><lastmod>2026-10-23</lastmod><priority>0.8</priority></url>\n',
    `  <url><loc>https://bttspredict.com/match/${liveTodaySlug}</loc><lastmod>2026-11-04</lastmod><priority>0.8</priority></url>\n`,
    `  <url><loc>https://bttspredict.com/match/${upcomingTodaySlug}</loc><lastmod>2026-11-04</lastmod><priority>0.8</priority></url>\n`,
    '  <url><loc>https://bttspredict.com/match/future-vs-team-2026-11-05</loc><lastmod>2026-11-04</lastmod><priority>0.9</priority></url>\n',
    `  <url><loc>https://external.example/match/${oldSlug}</loc><lastmod>2026-10-23</lastmod></url>\n`,
    '</urlset>\n',
  ].join('')
  writeFileSync(builtPath, built)
  writeFileSync(previousPath, previous)
  writeFileSync(reportPath, JSON.stringify({ deletions }))
  writeFileSync(manifestPath, JSON.stringify({ files: Object.fromEntries(currentPaths.map(path => [path, { hash: 'current', size: 1 }])) }))
  execFileSync(process.execPath, [
    sourceScript,
    `--input=${builtPath}`,
    `--previous=${previousPath}`,
    `--deletions=${reportPath}`,
    `--current-manifest=${manifestPath}`,
    `--output=${outputPath}`,
    `--report=${filterReportPath}`,
    '--now=2026-11-04T10:00:00.000Z',
  ], { cwd: path.resolve('.'), encoding: 'utf8' })
  return {
    built,
    previous,
    output: readFileSync(outputPath, 'utf8'),
    builtAfter: readFileSync(builtPath, 'utf8'),
    filterReport: JSON.parse(readFileSync(filterReportPath, 'utf8')),
    oldSlug,
    oldUntrackedSlug,
    liveTodaySlug,
    upcomingTodaySlug,
    finishedTodaySlug,
  }
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) rmSync(root, { recursive: true, force: true })
})

describe('sitemap de build avec retraits Match strictement ciblés', () => {
  it('met à jour les URL générées, conserve les autres URL distantes et retire seulement les URL dont les fichiers Match sont supprimés', () => {
    const result = runFilter([
      { path: `en/match/${oldSlug}.html`, status: 'finished' },
      { path: `ar/match/${oldSlug}/index.html`, status: 'finished' },
    ])
    expect(result.output).toContain('<loc>https://bttspredict.com/</loc><lastmod>2026-11-04</lastmod><changefreq>daily</changefreq>')
    expect(result.output).not.toContain('<loc>https://bttspredict.com/</loc><lastmod>2026-10-01</lastmod>')
    expect(result.output).toContain('<loc>https://bttspredict.com/en/btts-and-over-2-5-predictions-today</loc><lastmod>2026-11-04</lastmod>')
    expect(result.output).toContain('https://bttspredict.com/new-build-route')
    expect(result.output).toContain('https://bttspredict.com/legacy-valid-route')
    expect(result.output).toContain(`https://bttspredict.com/match/${result.oldSlug}`)
    expect(result.output).not.toContain(`https://bttspredict.com/en/match/${result.oldSlug}`)
    expect(result.output).not.toContain(`https://bttspredict.com/ar/match/${result.oldSlug}`)
    expect(result.output).toContain(`https://bttspredict.com/ar/match/${result.oldUntrackedSlug}`)
    expect(result.output).toContain(`https://bttspredict.com/match/${result.finishedTodaySlug}`)
    expect(result.output).toContain(`https://bttspredict.com/match/${result.liveTodaySlug}`)
    expect(result.output).toContain(`https://bttspredict.com/match/${result.upcomingTodaySlug}`)
    expect(result.output).toContain('https://bttspredict.com/match/future-vs-team-2026-11-05')
    expect(result.output).toContain(`https://external.example/match/${result.oldSlug}`)
    expect(result.output).toContain('</urlset>')
    expect(result.builtAfter).toBe(result.built)
    expect(result.filterReport.timezone).toBe('Africa/Dakar')
    expect(result.filterReport.today).toBe('2026-11-04')
    expect(result.filterReport.removedUrlCount).toBe(2)
    expect(result.filterReport.removedUrlPaths).toEqual([
      `/ar/match/${result.oldSlug}`,
      `/en/match/${result.oldSlug}`,
    ])
    expect(result.filterReport.addedBuildUrlCount).toBe(1)
    expect(result.filterReport.retainedPreviousUrlCount).toBe(8)
  })

  it('refuse un fichier déclaré supprimable qui n’est pas marqué terminé', () => {
    expect(() => runFilter([
      { path: `en/match/${oldSlug}.html`, status: 'upcoming' },
    ])).toThrow()
  })

  it('refuse toute suppression demandée sur le root /match hors périmètre', () => {
    expect(() => runFilter([
      { path: `match/${oldSlug}.html`, status: 'finished' },
    ])).toThrow(/hors périmètre|invalide/)
  })

  it('refuse un plan de suppression qui vise encore une page du build courant', () => {
    expect(() => runFilter([
      { path: `en/match/${oldSlug}.html`, status: 'finished' },
    ], [`en/match/${oldSlug}.html`])).toThrow()
  })
})
