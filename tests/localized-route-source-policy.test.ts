import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { ARABIC_PROMO_PATHS } from '@/lib/arabic-promo-routes'
import { getStaticLocalesForPath } from '@/lib/locale-route-policy'

const appRoot = path.resolve(process.cwd(), 'src/app')
const localizedRoot = path.join(appRoot, '[locale]')

function collectPages(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name)
    return entry.isDirectory() ? collectPages(fullPath) : entry.name === 'page.tsx' ? [fullPath] : []
  })
}

function routeForPage(filePath: string): string {
  const relativeDirectory = path.relative(localizedRoot, path.dirname(filePath))
  if (!relativeDirectory || relativeDirectory === '.') return '/'
  return `/${relativeDirectory.split(path.sep).join('/')}`
}

describe('génération des routes localisées', () => {
  it('fait passer chaque page [locale] par la politique statique commune', () => {
    const pages = collectPages(localizedRoot)
    expect(pages.length).toBeGreaterThan(0)
    for (const filePath of pages) {
      const source = fs.readFileSync(filePath, 'utf8')
      const route = routeForPage(filePath)
      const isPromo = (ARABIC_PROMO_PATHS as readonly string[]).includes(route)
      expect(source, `${route} must declare generateStaticParams`).toContain('generateStaticParams')
      expect(source, `${route} must use the locale route policy`).toMatch(/getStaticLocale(?:sForPath|Params)/)
      expect(getStaticLocalesForPath(route), route).toEqual(isPromo ? ['en', 'ar'] : ['en'])
    }
  })

  it('ne conserve aucune route explicite src/app/ar hors des promos localisées', () => {
    expect(fs.existsSync(path.join(appRoot, 'ar'))).toBe(false)
  })
})
