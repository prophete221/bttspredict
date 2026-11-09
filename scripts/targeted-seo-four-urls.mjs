#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { rewriteHtmlTag } from './fix-html-lang.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const TARGETS = [
  { urlPath: '/ar/historique', file: 'ar/historique.html', canonical: 'https://bttspredict.com/ar/historique', locale: 'ar' },
  { urlPath: '/en/historique', file: 'en/historique.html', canonical: 'https://bttspredict.com/en/historique', locale: 'en' },
  { urlPath: '/btts/statistics', file: 'btts/statistics.html', canonical: 'https://bttspredict.com/btts/statistics', locale: 'fr' },
  { urlPath: '/politique-confidentialite', file: 'politique-confidentialite.html', canonical: 'https://bttspredict.com/politique-confidentialite', locale: 'fr' },
]
const TARGET_PAGE_PATHS = TARGETS.map(({ file }) => file).sort()
const STATIC_PREFIX = '/_next/static/'
const USER_AGENT = 'BTTSPredict-targeted-four-url-deploy/1.0'

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex')
}

function normalizeHtmlAssetReferences(html) {
  return html
    .replace(/\\u002f/gi, '/')
    .replace(/\\\//g, '/')
    .replace(/\\\\/g, '/')
}

function safeLocalAssetPath(urlPath) {
  let decoded
  try {
    decoded = decodeURIComponent(urlPath)
  } catch {
    throw new Error(`URL d’asset mal encodée : ${urlPath}`)
  }
  if (!decoded.startsWith(STATIC_PREFIX)) throw new Error(`Asset hors de _next/static : ${urlPath}`)
  const rel = decoded.slice(1)
  if (path.posix.normalize(rel) !== rel || rel.includes('..') || rel.includes('\\')) {
    throw new Error(`Chemin d’asset non sûr : ${urlPath}`)
  }
  return rel
}

function assetUrlPathFromReference(raw, baseUrl) {
  const ref = raw.trim().replace(/[),.;]+$/g, '').replace(/\\+$/g, '')
  if (!ref || ref.startsWith('data:') || ref.startsWith('blob:')) return null
  let parsed
  try {
    parsed = new URL(ref, baseUrl)
  } catch {
    return null
  }
  if (parsed.origin !== baseUrl.origin || !parsed.pathname.startsWith(STATIC_PREFIX)) return null
  return parsed.pathname
}

function collectHtmlAssetPaths(html, baseUrl) {
  const normalized = normalizeHtmlAssetReferences(html)
  const found = new Set()
  const referencePattern = /\/_next\/static\/[^\s"'`<>?#)]+/g
  for (const match of normalized.matchAll(referencePattern)) {
    const urlPath = assetUrlPathFromReference(match[0], baseUrl)
    if (urlPath) found.add(urlPath)
  }
  return found
}

function collectCssAssetPaths(css, cssUrl, baseUrl) {
  const found = new Set()
  const pattern = /url\(\s*(["']?)(.*?)\1\s*\)/g
  for (const match of css.matchAll(pattern)) {
    const raw = match[2].trim()
    if (!raw || raw.startsWith('data:') || raw.startsWith('blob:')) continue
    let parsed
    try {
      parsed = new URL(raw, cssUrl)
    } catch {
      continue
    }
    if (parsed.origin === baseUrl.origin && parsed.pathname.startsWith(STATIC_PREFIX)) found.add(parsed.pathname)
  }
  return found
}

function collectTargetAssets(outDir, baseUrl) {
  const candidateUrls = new Set()
  for (const target of TARGETS) {
    const file = path.join(outDir, target.file)
    if (!fs.existsSync(file)) throw new Error(`Export statique absent pour ${target.urlPath}: ${file}`)
    const html = fs.readFileSync(file, 'utf8')
    const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1]
    if (canonical !== target.canonical) throw new Error(`Canonique inattendue pour ${target.urlPath}: ${canonical || 'absente'}`)
    const robots = html.match(/<meta[^>]*name="robots"[^>]*content="([^"]+)"/i)?.[1]
    if (!robots || !/\bindex\b/i.test(robots) || !/\bfollow\b/i.test(robots) || /noindex|nofollow/i.test(robots)) {
      throw new Error(`La page ${target.urlPath} n’est pas explicitement index/follow`)
    }
    const htmlTag = html.match(/<html[^>]*>/i)?.[0] || ''
    if (!htmlTag.includes(`lang="${target.locale}"`)) throw new Error(`Langue HTML incorrecte pour ${target.urlPath}: ${htmlTag}`)
    if (target.locale === 'ar' && !/\bdir="rtl"/.test(htmlTag)) throw new Error('Direction RTL absente de /ar/historique')
    if (target.urlPath === '/btts/statistics') {
      if (html.includes('Données en préparation') || !html.includes('BTTSPredict ne publie pas de pourcentages par ligue')) {
        throw new Error('Le contenu validé de /btts/statistics est absent ou contient encore un placeholder')
      }
    }
    if (target.urlPath === '/en/historique' && !html.includes('View today')) throw new Error('Le CTA anglais de /en/historique est absent')
    if (target.urlPath === '/ar/historique' && !html.includes('عرض توقعات اليوم')) throw new Error('Le CTA arabe de /ar/historique est absent')
    for (const urlPath of collectHtmlAssetPaths(html, baseUrl)) candidateUrls.add(urlPath)
  }

  // CSS can reference local fonts/media not repeated in HTML. Walk only those
  // directly referenced CSS files and add their local _next/static dependencies.
  const pendingCss = [...candidateUrls].filter((urlPath) => urlPath.toLowerCase().endsWith('.css'))
  const visitedCss = new Set()
  while (pendingCss.length) {
    const cssPath = pendingCss.pop()
    if (visitedCss.has(cssPath)) continue
    visitedCss.add(cssPath)
    const rel = safeLocalAssetPath(cssPath)
    const localFile = path.join(outDir, rel)
    if (!fs.existsSync(localFile)) throw new Error(`Asset CSS référencé mais absent de l’export: ${rel}`)
    const css = fs.readFileSync(localFile, 'utf8')
    const cssUrl = new URL(cssPath, baseUrl)
    for (const dep of collectCssAssetPaths(css, cssUrl, baseUrl)) {
      if (!candidateUrls.has(dep)) candidateUrls.add(dep)
      if (dep.toLowerCase().endsWith('.css') && !visitedCss.has(dep)) pendingCss.push(dep)
    }
  }

  return [...candidateUrls].sort().map((urlPath) => {
    const localPath = safeLocalAssetPath(urlPath)
    const absolutePath = path.join(outDir, localPath)
    if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
      throw new Error(`Asset référencé mais absent de l’export: ${localPath}`)
    }
    const bytes = fs.readFileSync(absolutePath)
    return { urlPath, localPath, sha256: sha256(bytes), size: bytes.length }
  })
}

function escapeLftp(value) {
  if (typeof value !== 'string' || !value || value.startsWith('/') || value.includes('..') || /[\r\n'";`]/.test(value)) {
    throw new Error(`Chemin refusé par l’allowlist FTP : ${String(value)}`)
  }
  return `'${value}'`
}

export function validateUploadPaths(paths) {
  if (!Array.isArray(paths) || new Set(paths).size !== paths.length) throw new Error('Liste FTP invalide ou contenant des doublons')
  const pagePaths = paths.filter((p) => TARGET_PAGE_PATHS.includes(p)).sort()
  if (JSON.stringify(pagePaths) !== JSON.stringify(TARGET_PAGE_PATHS)) throw new Error('Les quatre pages HTML autorisées doivent être présentes exactement une fois')
  for (const rel of paths) {
    if (!TARGET_PAGE_PATHS.includes(rel) && !rel.startsWith('_next/static/')) throw new Error(`Chemin hors allowlist SEO : ${rel}`)
    if (/^(?:predictions|win-history|history-exclusions|transfers|vip-combos|team-context)\.json$/.test(rel) || rel.startsWith('predictions-archive/')) {
      throw new Error(`Donnée publique interdite dans le transfert : ${rel}`)
    }
    if (/(^|\/)(?:match|vip)(?:\/|\.|$)/i.test(rel)) throw new Error(`Chemin Match/VIP interdit dans le transfert : ${rel}`)
    if (rel === 'robots.txt' || rel === 'sitemap.xml' || rel === '.htaccess' || rel === 'deploy-manifest.json') {
      throw new Error(`Fichier global interdit dans le transfert : ${rel}`)
    }
    escapeLftp(rel)
  }
  return true
}

export function classifyRemoteAsset({ status, localSha256, remoteSha256 }) {
  if (status === 404) return 'missing'
  if (status !== 200) throw new Error(`Réponse HTTP inattendue pendant la vérification d’asset: ${status}`)
  if (remoteSha256 !== localSha256) throw new Error('Un asset référencé existe avec un hash différent; refus d’écraser une ressource partagée')
  return 'identical'
}

async function inspectRemoteAsset(asset, baseUrl, fetchImpl) {
  const url = new URL(asset.urlPath, baseUrl)
  let response
  try {
    response = await fetchImpl(url, {
      redirect: 'follow',
      cache: 'no-store',
      headers: { 'User-Agent': USER_AGENT, 'Cache-Control': 'no-cache' },
    })
  } catch (error) {
    throw new Error(`Vérification distante impossible pour ${asset.urlPath}: ${error.message}`)
  }
  if (response.status === 404) return { ...asset, remote: 'missing' }
  if (response.status !== 200) throw new Error(`HTTP ${response.status} pour l’asset ${asset.urlPath}; arrêt sans transfert`)
  const remoteSha256 = sha256(Buffer.from(await response.arrayBuffer()))
  const state = classifyRemoteAsset({ status: response.status, localSha256: asset.sha256, remoteSha256 })
  return { ...asset, remote: state }
}

/**
 * @param {string[]} uploadPaths
 * @param {{ assetPaths?: string[], pagePaths?: string[] }} [options]
 */
export function buildLftpCommands(uploadPaths, { assetPaths = [], pagePaths = TARGET_PAGE_PATHS } = {}) {
  validateUploadPaths(uploadPaths)
  if (JSON.stringify([...pagePaths].sort()) !== JSON.stringify(TARGET_PAGE_PATHS)) throw new Error('L’allowlist des pages de destination ne correspond pas aux quatre URL autorisées')
  const allowedAssets = new Set(uploadPaths.filter((p) => p.startsWith('_next/static/')))
  if (assetPaths.some((p) => !allowedAssets.has(p))) throw new Error('Une ressource mentionnée n’est pas dans l’allowlist FTP')
  const dirs = [...new Set(uploadPaths.map((p) => path.posix.dirname(p)).filter((p) => p !== '.'))]
    .sort((a, b) => a.split('/').length - b.split('/').length || a.localeCompare(b))
  const assetOrder = uploadPaths.filter((p) => p.startsWith('_next/static/')).sort()
  const pageOrder = TARGET_PAGE_PATHS
  const commands = [
    '# Exact allowlist: 4 authorized HTML pages plus only their previously missing _next/static dependencies.',
    '# No mirror, delete, data files, Match pages, VIP pages, sitemap, robots.txt, or .htaccess.',
    'set ssl:verify no',
    'set cmd:fail-exit yes',
    'set net:timeout 60',
    'set net:max-retries 3',
    'lcd out',
    ...dirs.map((dir) => `mkdir -pf ${escapeLftp(dir)}`),
    ...assetOrder.map((rel) => `put ${escapeLftp(rel)} -o ${escapeLftp(`./${rel}`)}`),
    ...pageOrder.map((rel) => `put ${escapeLftp(rel)} -o ${escapeLftp(`./${rel}`)}`),
    'bye',
  ]
  return `${commands.join('\n')}\n`
}

function createBackupCommands() {
  return [
    '# Download only the four HTML files that will be replaced, for rollback.',
    'set ssl:verify no',
    'set cmd:fail-exit yes',
    'set net:timeout 60',
    'set net:max-retries 2',
    ...TARGET_PAGE_PATHS.map((rel) => `get ${escapeLftp(rel)} -o ${escapeLftp(`out/targeted-seo-backup/${rel}`)}`),
    'bye',
  ].join('\n') + '\n'
}

function createRollbackCommands() {
  return [
    '# Restore only the four saved HTML files; no deletions or data writes.',
    'set ssl:verify no',
    'set cmd:fail-exit yes',
    'set net:timeout 60',
    'set net:max-retries 3',
    'lcd out/targeted-seo-backup',
    ...TARGET_PAGE_PATHS.map((rel) => `put ${escapeLftp(rel)} -o ${escapeLftp(`./${rel}`)}`),
    'bye',
  ].join('\n') + '\n'
}

export async function createTargetedPlan({ outDir, baseUrl = 'https://bttspredict.com', fetchImpl = fetch }) {
  const resolvedOutDir = path.resolve(outDir)
  const resolvedBase = new URL(baseUrl)
  if (resolvedBase.protocol !== 'https:' || resolvedBase.hostname !== 'bttspredict.com') {
    throw new Error('Le préflight d’assets est limité à https://bttspredict.com')
  }
  for (const target of TARGETS.filter(({ locale }) => locale === 'en' || locale === 'ar')) {
    const file = path.join(resolvedOutDir, target.file)
    const html = fs.readFileSync(file, 'utf8')
    const rewritten = rewriteHtmlTag(html, target.locale)
    if (rewritten !== null) fs.writeFileSync(file, rewritten)
  }

  const assets = collectTargetAssets(resolvedOutDir, resolvedBase)
  const inspectedAssets = []
  for (const asset of assets) inspectedAssets.push(await inspectRemoteAsset(asset, resolvedBase, fetchImpl))
  const assetPaths = inspectedAssets.filter((asset) => asset.remote === 'missing').map((asset) => asset.localPath).sort()
  const pagePaths = [...TARGET_PAGE_PATHS]
  const uploadPaths = [...assetPaths, ...pagePaths]
  validateUploadPaths(uploadPaths)
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    targetUrls: TARGETS.map(({ urlPath, canonical }) => ({ urlPath, canonical })),
    pagePaths,
    referencedAssetCount: inspectedAssets.length,
    identicalRemoteAssets: inspectedAssets.filter((asset) => asset.remote === 'identical').map(({ localPath, sha256 }) => ({ localPath, sha256 })),
    uploadAssetPaths: assetPaths,
    uploadPaths,
    uploadBytes: [...inspectedAssets.filter((asset) => asset.remote === 'missing'), ...TARGETS.map((target) => ({ localPath: target.file, size: fs.statSync(path.join(resolvedOutDir, target.file)).size }))]
      .reduce((sum, item) => sum + item.size, 0),
    assetChecks: inspectedAssets.map(({ urlPath, localPath, sha256: hash, size, remote }) => ({ urlPath, localPath, sha256: hash, size, remote })),
  }
}

export async function verifyLiveTargetedPlan({ plan, outDir, baseUrl = 'https://bttspredict.com', fetchImpl = fetch }) {
  validateUploadPaths(plan.uploadPaths)
  const base = new URL(baseUrl)
  const failures = []
  for (const target of TARGETS) {
    const url = new URL(target.urlPath, base)
    url.searchParams.set('__targeted_deploy_check', Date.now().toString())
    const response = await fetchImpl(url, {
      redirect: 'follow',
      cache: 'no-store',
      headers: { 'User-Agent': USER_AGENT, 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
    })
    if (response.status !== 200) {
      failures.push(`${target.urlPath}: HTTP ${response.status}`)
      continue
    }
    const html = await response.text()
    const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1]
    const robots = html.match(/<meta[^>]*name="robots"[^>]*content="([^"]+)"/i)?.[1] || ''
    if (canonical !== target.canonical) failures.push(`${target.urlPath}: canonique inattendue (${canonical || 'absente'})`)
    if (!/\bindex\b/i.test(robots) || !/\bfollow\b/i.test(robots) || /noindex|nofollow/i.test(robots)) failures.push(`${target.urlPath}: robots non index/follow`)
    if (target.urlPath === '/btts/statistics' && (html.includes('Données en préparation') || !html.includes('BTTSPredict ne publie pas de pourcentages par ligue'))) {
      failures.push('/btts/statistics: contenu corrigé non visible')
    }
    if (target.urlPath === '/en/historique' && !html.includes('View today')) failures.push('/en/historique: CTA anglais absent')
    if (target.urlPath === '/ar/historique' && !html.includes('عرض توقعات اليوم')) failures.push('/ar/historique: CTA arabe absent')
    if (target.urlPath === '/politique-confidentialite' && html.includes('Ouvrir Linebet')) failures.push('/politique-confidentialite: un module promotionnel semble encore présent')
  }
  for (const asset of plan.assetChecks) {
    const response = await fetchImpl(new URL(asset.urlPath, base), {
      redirect: 'follow', cache: 'no-store', headers: { 'User-Agent': USER_AGENT, 'Cache-Control': 'no-cache' },
    })
    if (response.status !== 200) {
      failures.push(`${asset.urlPath}: HTTP ${response.status} après transfert`)
      continue
    }
    const remoteSha = sha256(Buffer.from(await response.arrayBuffer()))
    if (remoteSha !== asset.sha256) failures.push(`${asset.urlPath}: hash distant différent après transfert`)
  }
  if (failures.length) throw new Error(`Vérification de production échouée:\n- ${failures.join('\n- ')}`)
  return { verifiedPages: TARGETS.length, verifiedAssets: plan.assetChecks.length }
}

function parseArgs(argv) {
  const result = { _: [] }
  for (const arg of argv) {
    if (!arg.startsWith('--')) result._.push(arg)
    else {
      const index = arg.indexOf('=')
      if (index < 0) result[arg.slice(2)] = true
      else result[arg.slice(2, index)] = arg.slice(index + 1)
    }
  }
  return result
}

async function runCli() {
  const args = parseArgs(process.argv.slice(2))
  const command = args._[0]
  const outDir = path.resolve(args['out-dir'] || path.join(ROOT, 'out'))
  if (command === 'plan') {
    const plan = await createTargetedPlan({ outDir, baseUrl: args['base-url'] || 'https://bttspredict.com' })
    validateUploadPaths(plan.uploadPaths)
    const planFile = path.resolve(args.plan || path.join(outDir, 'targeted-seo-transfer-plan.json'))
    const uploadFile = path.resolve(args.upload || path.join(outDir, 'targeted-seo-upload.lftp'))
    const backupFile = path.resolve(args.backup || path.join(outDir, 'targeted-seo-backup.lftp'))
    const rollbackFile = path.resolve(args.rollback || path.join(outDir, 'targeted-seo-rollback.lftp'))
    fs.writeFileSync(planFile, JSON.stringify(plan, null, 2) + '\n')
    fs.writeFileSync(uploadFile, buildLftpCommands(plan.uploadPaths, { assetPaths: plan.uploadAssetPaths, pagePaths: plan.pagePaths }))
    fs.writeFileSync(backupFile, createBackupCommands())
    fs.writeFileSync(rollbackFile, createRollbackCommands())
    for (const page of plan.pagePaths) fs.mkdirSync(path.dirname(path.join(outDir, 'targeted-seo-backup', page)), { recursive: true })
    console.log(`[targeted-seo] allowlist validée: ${plan.pagePaths.length} pages exactes + ${plan.uploadAssetPaths.length} assets manquants; ${plan.referencedAssetCount - plan.uploadAssetPaths.length} assets identiques déjà publiés; ${plan.uploadBytes} octets à envoyer.`)
    console.log(`[targeted-seo] fichiers planifiés :\n${plan.uploadPaths.map((p) => `  ${p}`).join('\n')}`)
    return
  }
  if (command === 'verify-live') {
    const planFile = path.resolve(args.plan || path.join(outDir, 'targeted-seo-transfer-plan.json'))
    const plan = JSON.parse(fs.readFileSync(planFile, 'utf8'))
    const result = await verifyLiveTargetedPlan({ plan, outDir, baseUrl: args['base-url'] || 'https://bttspredict.com' })
    console.log(`[targeted-seo] vérification production réussie: ${result.verifiedPages} pages et ${result.verifiedAssets} assets.`)
    return
  }
  throw new Error('Usage: node scripts/targeted-seo-four-urls.mjs plan|verify-live [--out-dir=out] [--base-url=https://bttspredict.com]')
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli().catch((error) => {
    console.error(`[targeted-seo] arrêt sûr : ${error.message}`)
    process.exit(1)
  })
}
