import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const ARABIC_PROMO_PATHS = new Set([
  '/code-promo-1xbet',
  '/code-promo-linebet-senegal',
  '/code-promo-melbet',
  '/bonus-888starz',
  '/bonus-888starz-btts221',
])

function lstatIfPresent(target) {
  try {
    return fs.lstatSync(target)
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') return null
    throw error
  }
}

function assertInside(root, target) {
  const relative = path.relative(root, target)
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`Chemin hors de l’export refusé : ${target}`)
  }
}

/** Walk only real files and directories; never follow a symlink from the export tree. */
function htmlFilesUnder(directory, root) {
  const stat = lstatIfPresent(directory)
  if (!stat || stat.isSymbolicLink()) return []
  assertInside(root, directory)
  if (stat.isFile()) return directory.endsWith('.html') ? [directory] : []
  if (!stat.isDirectory()) return []

  const files = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name)
    assertInside(root, entryPath)
    if (entry.isDirectory()) files.push(...htmlFilesUnder(entryPath, root))
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(entryPath)
  }
  return files
}

function routeForHtml(file, root) {
  assertInside(root, file)
  const relative = path.relative(root, file).split(path.sep).join('/')
  let route = `/${relative}`
  if (route.endsWith('/index.html')) route = route.slice(0, -'/index.html'.length) || '/'
  else route = route.replace(/\.html$/, '')
  return route
}

function withoutLocale(route) {
  return route.replace(/^\/(?:en|ar)(?=\/|$)/, '') || '/'
}

function isPromoHtml(file, root) {
  return ARABIC_PROMO_PATHS.has(withoutLocale(routeForHtml(file, root)))
}

function promoRouteForArtifact(name) {
  const withoutExtension = name.replace(/\.(?:html|txt)$/i, '')
  return ARABIC_PROMO_PATHS.has(`/${withoutExtension}`) ? `/${withoutExtension}` : null
}

/** Remove a path without ever traversing a symlink target. */
function removeTreeSafely(target, root) {
  assertInside(root, target)
  const stat = lstatIfPresent(target)
  if (!stat) return
  if (stat.isSymbolicLink() || !stat.isDirectory()) {
    fs.unlinkSync(target)
    return
  }
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    removeTreeSafely(path.join(target, entry.name), root)
  }
  fs.rmdirSync(target)
}

function stripArabicAlternates(root) {
  let strippedFileCount = 0
  for (const file of htmlFilesUnder(root, root)) {
    if (isPromoHtml(file, root)) continue
    const html = fs.readFileSync(file, 'utf8')
    const cleaned = html.replace(
      /<link\b(?=[^>]*\brel=["']alternate["'])(?=[^>]*\bhreflang=["']ar["'])[^>]*>\s*/giu,
      '',
    )
    if (cleaned !== html) {
      fs.writeFileSync(file, cleaned)
      strippedFileCount++
    }
  }
  return strippedFileCount
}

function sanitizePromoDirectory(directory, route, root, removedRoutes) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name)
    assertInside(root, entryPath)
    if (entry.isSymbolicLink()) {
      removeTreeSafely(entryPath, root)
      continue
    }
    if (entry.isDirectory()) {
      for (const file of htmlFilesUnder(entryPath, root)) removedRoutes.push(routeForHtml(file, root))
      removeTreeSafely(entryPath, root)
      continue
    }
    if (entry.isFile() && entry.name.endsWith('.html')) {
      if (routeForHtml(entryPath, root) !== `/ar${route}`) {
        removedRoutes.push(routeForHtml(entryPath, root))
        removeTreeSafely(entryPath, root)
      }
    }
    // Direct non-HTML files are Next's static route payloads; keep them for the
    // exact promo route. Nested directories and nested HTML routes are removed.
  }
}

export function pruneArabicNonPromo(root) {
  const outputRoot = path.resolve(root)
  const outputStat = lstatIfPresent(outputRoot)
  if (!outputStat || !outputStat.isDirectory() || outputStat.isSymbolicLink()) {
    throw new Error(`Répertoire d’export absent, invalide ou symbolique : ${outputRoot}`)
  }
  if (path.resolve(fs.realpathSync(outputRoot)) !== outputRoot) {
    throw new Error(`Racine d’export non canonique refusée : ${outputRoot}`)
  }

  const arabicRoot = path.join(outputRoot, 'ar')
  const arabicStat = lstatIfPresent(arabicRoot)
  const removedRoutes = []
  if (arabicStat?.isSymbolicLink()) {
    // Do not inspect or traverse the symlink target.
    fs.unlinkSync(arabicRoot)
  } else if (arabicStat?.isDirectory()) {
    for (const entry of fs.readdirSync(arabicRoot, { withFileTypes: true })) {
      const entryPath = path.join(arabicRoot, entry.name)
      assertInside(outputRoot, entryPath)
      const promoRoute = !entry.isSymbolicLink() ? promoRouteForArtifact(entry.name) : null
      if (promoRoute && entry.isDirectory()) {
        sanitizePromoDirectory(entryPath, promoRoute, outputRoot, removedRoutes)
        continue
      }
      if (promoRoute && entry.isFile()) continue

      for (const file of htmlFilesUnder(entryPath, outputRoot)) removedRoutes.push(routeForHtml(file, outputRoot))
      removeTreeSafely(entryPath, outputRoot)
    }
    if (fs.readdirSync(arabicRoot).length === 0) fs.rmdirSync(arabicRoot)
  } else if (arabicStat) {
    removeTreeSafely(arabicRoot, outputRoot)
  }

  const strippedAlternateFileCount = stripArabicAlternates(outputRoot)
  return {
    removedRoutes: [...new Set(removedRoutes)].sort(),
    keptPromoRoutes: [...ARABIC_PROMO_PATHS].map(route => `/ar${route}`).sort(),
    strippedAlternateFileCount,
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const args = process.argv.slice(2)
  const positional = args.filter(arg => !arg.startsWith('--'))
  const options = args.filter(arg => arg.startsWith('--'))
  const expectedRoot = path.resolve(process.cwd(), 'out')
  const requestedRoot = path.resolve(positional[0] || 'out')
  if (positional.length > 1 || options.length > 0 || requestedRoot !== expectedRoot) {
    throw new Error('Usage refusé : ce script post-build accepte uniquement le répertoire local « out » et aucune option d’écriture.')
  }
  const result = pruneArabicNonPromo(expectedRoot)
  console.log(`Export arabe : ${result.removedRoutes.length} route(s) non promo retirée(s), ${result.strippedAlternateFileCount} fichier(s) hreflang nettoyé(s).`)
}
