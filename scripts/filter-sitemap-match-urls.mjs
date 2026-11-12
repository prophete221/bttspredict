#!/usr/bin/env node
/**
 * Construit le sitemap publié à partir du sitemap du build et du sitemap distant.
 * Toutes les routes de détail Match sont exclues du sitemap, que leurs pages
 * statiques existent encore ou non. Ce filtre ne supprime aucun fichier du site.
 */
import fs from 'node:fs'
import path from 'node:path'
import { getDakarDateString } from '../src/lib/dakar-date.ts'

const URL_BLOCK_RE = /<url(?:\s[^>]*)?>[\s\S]*?<\/url\s*>/gi
const URLSET_OPEN_RE = /<urlset\b[^>]*>/i
const URLSET_CLOSE_RE = /<\/urlset\s*>/i
const MATCH_ROUTE_PATH_RE = /^\/(?:[a-z]{2}\/)?match(?:\/|\.html?$|$)/iu

function readArgs() {
  const args = Object.fromEntries(process.argv.slice(2).map(arg => {
    const index = arg.indexOf('=')
    return index < 0 ? [arg.replace(/^--/, ''), 'true'] : [arg.slice(2, index), arg.slice(index + 1)]
  }))
  for (const name of ['input', 'previous', 'deletions', 'current-manifest', 'output', 'report']) {
    if (!args[name]) throw new Error(`Argument requis : --${name}=...`)
  }
  return args
}

function getTargetPath(relativePath) {
  const match = relativePath.match(/^(?:en|ar)\/match\/[\p{L}\p{N}_-]+-\d{4}-\d{2}-\d{2}(?:\.html|\/index\.html)$/u)
  if (!match) throw new Error(`Chemin de suppression non Match ou invalide : ${relativePath}`)
  const route = relativePath.replace(/\/index\.html$/, '').replace(/\.html$/, '')
  return `/${route}`
}

function decodeXml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
}

function canonicalSitemapPath(loc) {
  let url
  try {
    url = new URL(decodeXml(loc.trim()))
  } catch {
    return null
  }
  if (!['bttspredict.com', 'www.bttspredict.com'].includes(url.hostname.toLowerCase())) return null
  let pathname
  try {
    pathname = decodeURIComponent(url.pathname)
  } catch {
    return null
  }
  if (pathname.length > 1) pathname = pathname.replace(/\/+$/, '')
  return pathname
}

function isMatchRoutePath(pathname) {
  return MATCH_ROUTE_PATH_RE.test(pathname)
}

function readUrlset(xml, label) {
  const open = URLSET_OPEN_RE.exec(xml)
  const close = URLSET_CLOSE_RE.exec(xml)
  if (!open || !close || close.index < open.index + open[0].length) {
    throw new Error(`${label} n’est pas un document <urlset> valide`)
  }
  const blocks = [...xml.matchAll(URL_BLOCK_RE)].map(match => match[0])
  if (blocks.length === 0) throw new Error(`${label} ne contient aucune entrée <url>`)
  return { prefix: xml.slice(0, open.index + open[0].length), suffix: xml.slice(close.index), blocks }
}

function getBlockPath(block) {
  const loc = block.match(/<loc(?:\s[^>]*)?>([\s\S]*?)<\/loc\s*>/i)
  return loc ? canonicalSitemapPath(loc[1]) : null
}

function main() {
  const args = readArgs()
  const inputPath = path.resolve(args.input)
  const previousPath = path.resolve(args.previous)
  const deletionPath = path.resolve(args.deletions)
  const manifestPath = path.resolve(args['current-manifest'])
  const outputPath = path.resolve(args.output)
  const reportPath = path.resolve(args.report)
  const now = args.now ? new Date(args.now) : new Date()
  if (Number.isNaN(now.getTime())) throw new Error('Valeur --now invalide')
  const today = getDakarDateString(now)

  const built = readUrlset(fs.readFileSync(inputPath, 'utf8'), 'Le sitemap généré par le build')
  const previous = readUrlset(fs.readFileSync(previousPath, 'utf8'), 'Le sitemap distant sauvegardé')
  const deletionReport = JSON.parse(fs.readFileSync(deletionPath, 'utf8'))
  if (!Array.isArray(deletionReport.deletions)) throw new Error('Rapport de suppression invalide')
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  if (!manifest.files || typeof manifest.files !== 'object') throw new Error('Manifeste courant invalide')

  const currentMatchPaths = new Set(Object.keys(manifest.files)
    .filter(relativePath => /^(?:en|ar)\/match\/[\p{L}\p{N}_-]+-\d{4}-\d{2}-\d{2}(?:\.html|\/index\.html)$/u.test(relativePath))
    .map(getTargetPath))
  const fileDeletionPaths = new Set(deletionReport.deletions.map(item => {
    if (!item || item.status !== 'finished' || typeof item.path !== 'string') {
      throw new Error('Chaque URL sitemap à retirer doit provenir d’un fichier Match réellement supprimé et terminé')
    }
    const target = getTargetPath(item.path)
    if (currentMatchPaths.has(target)) throw new Error(`Le plan de suppression vise une page Match présente dans l’export : ${item.path}`)
    return target
  }))

  const builtPathToBlock = new Map()
  const excludedMatchPaths = new Set()
  for (const block of built.blocks) {
    const target = getBlockPath(block)
    if (!target) continue
    if (isMatchRoutePath(target)) {
      excludedMatchPaths.add(target)
      continue
    }
    if (!builtPathToBlock.has(target)) builtPathToBlock.set(target, block)
  }

  const outputBlocks = []
  const removedUrlPaths = new Set()
  const updatedBuildPaths = new Set()
  let retainedPreviousUrlCount = 0
  for (const block of previous.blocks) {
    const target = getBlockPath(block)
    if (target && isMatchRoutePath(target)) {
      excludedMatchPaths.add(target)
      if (fileDeletionPaths.has(target)) removedUrlPaths.add(target)
      continue
    }

    const builtBlock = target ? builtPathToBlock.get(target) : null
    if (builtBlock && !updatedBuildPaths.has(target)) {
      outputBlocks.push(builtBlock)
      updatedBuildPaths.add(target)
    } else {
      outputBlocks.push(block)
      retainedPreviousUrlCount += 1
    }
  }

  let addedBuildUrlCount = 0
  for (const [target, block] of builtPathToBlock) {
    if (updatedBuildPaths.has(target)) continue
    outputBlocks.push(block)
    updatedBuildPaths.add(target)
    addedBuildUrlCount += 1
  }

  let removedAlternateCount = 0
  const output = `${built.prefix}\n${outputBlocks.map(block => block.replace(/<xhtml:link\b[^>]*\/?\s*>/gi, link => {
    const href = link.match(/\bhref\s*=\s*(["'])(.*?)\1/i)
    if (!href) return link
    const alternatePath = canonicalSitemapPath(href[2])
    if (!alternatePath || !isMatchRoutePath(alternatePath)) return link
    excludedMatchPaths.add(alternatePath)
    removedAlternateCount += 1
    return ''
  })).join('\n')}\n${built.suffix}`

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, output, 'utf8')
  const removedPathsSorted = [...removedUrlPaths].sort()
  const excludedMatchPathsSorted = [...excludedMatchPaths].sort()
  const report = {
    generatedAt: now.toISOString(),
    timezone: 'Africa/Dakar',
    today,
    removedUrlCount: removedPathsSorted.length,
    removedUrlPaths: removedPathsSorted,
    excludedMatchUrlCount: excludedMatchPathsSorted.length,
    excludedMatchUrlPaths: excludedMatchPathsSorted,
    removedAlternateCount,
    replacedWithBuildUrlCount: updatedBuildPaths.size - addedBuildUrlCount,
    addedBuildUrlCount,
    retainedPreviousUrlCount,
    currentExportFileCount: Object.keys(manifest.files).length,
    fileDeletionTargetsNotInSitemap: [...fileDeletionPaths].filter(target => !removedUrlPaths.has(target)).sort(),
    policy: 'Toutes les routes Match (/match, /en/match, /ar/match et autres locales) sont exclues du sitemap, y compris les alternates, indépendamment de la présence des fichiers. Ce filtre ne supprime aucun fichier et conserve les autres routes selon le sitemap du build et le sitemap distant.',
  }
  fs.mkdirSync(path.dirname(reportPath), { recursive: true })
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
  console.log(`[sitemap-match-filter] Dakar=${today}; URL de fichiers supprimés retirées=${removedPathsSorted.length}; URL Match exclues=${excludedMatchPathsSorted.length}; URL de build mises à jour=${report.replacedWithBuildUrlCount}; autres URL distantes conservées=${retainedPreviousUrlCount}`)
}

try {
  main()
} catch (error) {
  console.error(`[sitemap-match-filter] Refus : ${error instanceof Error ? error.message : String(error)}`)
  process.exitCode = 1
}
