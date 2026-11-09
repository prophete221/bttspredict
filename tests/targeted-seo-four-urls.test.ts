import { afterEach, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  buildLftpCommands,
  classifyRemoteAsset,
  createTargetedPlan,
  validateUploadPaths,
} from '../scripts/targeted-seo-four-urls.mjs'

const targets = [
  { url: '/ar/historique', file: 'ar/historique.html', canonical: 'https://bttspredict.com/ar/historique', body: 'عرض توقعات اليوم' },
  { url: '/en/historique', file: 'en/historique.html', canonical: 'https://bttspredict.com/en/historique', body: 'View today' },
  { url: '/btts/statistics', file: 'btts/statistics.html', canonical: 'https://bttspredict.com/btts/statistics', body: 'BTTSPredict ne publie pas de pourcentages par ligue' },
  { url: '/politique-confidentialite', file: 'politique-confidentialite.html', canonical: 'https://bttspredict.com/politique-confidentialite', body: 'Politique de confidentialité' },
]
const pagePaths = targets.map(({ file }) => file).sort()
const temporaryDirectories: string[] = []

function createFixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bttspredict-targeted-seo-'))
  temporaryDirectories.push(dir)
  fs.mkdirSync(path.join(dir, '_next/static/chunks'), { recursive: true })
  fs.mkdirSync(path.join(dir, '_next/static/css'), { recursive: true })
  fs.mkdirSync(path.join(dir, '_next/static/media'), { recursive: true })
  fs.writeFileSync(path.join(dir, '_next/static/chunks/page-new.js'), 'console.log("page")')
  fs.writeFileSync(path.join(dir, '_next/static/css/app.css'), 'body{font-family:url("../media/font.woff2")}')
  fs.writeFileSync(path.join(dir, '_next/static/media/font.woff2'), 'font-bytes')
  for (const target of targets) {
    const page = `<html lang="fr"><head><link rel="canonical" href="${target.canonical}"><meta name="robots" content="index, follow"><link rel="stylesheet" href="/_next/static/css/app.css"></head><body><script src="/_next/static/chunks/page-new.js"></script>${target.body}</body></html>`
    const fullPath = path.join(dir, target.file)
    fs.mkdirSync(path.dirname(fullPath), { recursive: true })
    fs.writeFileSync(fullPath, page)
  }
  return dir
}

afterEach(() => {
  for (const dir of temporaryDirectories.splice(0)) fs.rmSync(dir, { recursive: true, force: true })
})

describe('targeted four-URL deploy guard', () => {
  it('limits publication to the exact four HTML routes and their missing static dependencies', async () => {
    const outDir = createFixture()
    const fetchImpl: typeof fetch = async (input) => {
      const requestUrl = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
      const pathname = new URL(requestUrl).pathname
      if (pathname === '/_next/static/css/app.css') {
        return new Response(fs.readFileSync(path.join(outDir, '_next/static/css/app.css')), { status: 200 })
      }
      return new Response('not found', { status: 404 })
    }
    const plan = await createTargetedPlan({ outDir, fetchImpl })
    expect(plan.pagePaths).toEqual(pagePaths)
    expect(plan.uploadAssetPaths).toEqual(['_next/static/chunks/page-new.js', '_next/static/media/font.woff2'])
    expect(plan.uploadPaths).toEqual([...plan.uploadAssetPaths, ...pagePaths])
    expect(plan.referencedAssetCount).toBe(3)
    expect(plan.identicalRemoteAssets.map((asset) => asset.localPath)).toEqual(['_next/static/css/app.css'])
    expect(validateUploadPaths(plan.uploadPaths)).toBe(true)

    const ar = fs.readFileSync(path.join(outDir, 'ar/historique.html'), 'utf8')
    const en = fs.readFileSync(path.join(outDir, 'en/historique.html'), 'utf8')
    expect(ar).toContain('<html lang="ar" dir="rtl">')
    expect(en).toContain('<html lang="en">')
  })

  it('rejects protected, match, VIP, global and data files from the transfer plan', () => {
    const allowed = [...pagePaths, '_next/static/chunks/page-new.js']
    expect(() => validateUploadPaths([...allowed, 'public/predictions.json'])).toThrow(/hors allowlist|Donnée publique/)
    expect(() => validateUploadPaths([...allowed, 'en/match/example.html'])).toThrow(/hors allowlist|Match\/VIP/)
    expect(() => validateUploadPaths([...allowed, 'ar/vip/index.html'])).toThrow(/hors allowlist|Match\/VIP/)
    expect(() => validateUploadPaths([...allowed, 'sitemap.xml'])).toThrow(/hors allowlist|Fichier global/)
    expect(() => validateUploadPaths(pagePaths.slice(1))).toThrow(/quatre pages HTML/)
  })

  it('refuses to overwrite an existing shared asset whose bytes differ', () => {
    expect(classifyRemoteAsset({ status: 404, localSha256: 'a', remoteSha256: '' })).toBe('missing')
    expect(classifyRemoteAsset({ status: 200, localSha256: 'a', remoteSha256: 'a' })).toBe('identical')
    expect(() => classifyRemoteAsset({ status: 200, localSha256: 'new', remoteSha256: 'old' })).toThrow(/hash différent/)
    expect(() => classifyRemoteAsset({ status: 403, localSha256: 'a', remoteSha256: '' })).toThrow(/inattendue/)
  })

  it('generates only exact put commands and never a mirror or delete', () => {
    const paths = [...pagePaths, '_next/static/chunks/page-new.js']
    const commands = buildLftpCommands(paths, { assetPaths: ['_next/static/chunks/page-new.js'], pagePaths })
    const executableCommands = commands.split('\n').filter((line) => !line.trim().startsWith('#')).join('\n')
    expect(executableCommands).toContain("put '_next/static/chunks/page-new.js' -o './_next/static/chunks/page-new.js'")
    for (const page of pagePaths) expect(executableCommands).toContain(`put '${page}' -o './${page}'`)
    expect(executableCommands).not.toMatch(/^\s*(?:rm|mirror|delete)\b/im)
    expect(() => buildLftpCommands([...paths, 'win-history.json'], { assetPaths: [], pagePaths })).toThrow()
  })
})
