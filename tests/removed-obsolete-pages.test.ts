import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const removedPaths = [
  'src/app/prediction-aviator',
  'src/app/prediction-aviator/page.tsx',
  'src/app/faille-fifa',
  'src/components/bttsbet/AviatorVip.tsx',
  'src/components/bttsbet/FifaLinebet.tsx',
  'public/logos/sport-aviator.svg',
  'public/faille-fifa.html',
  'public/faille-fifa.txt',
]

describe('retrait des anciennes pages Aviator et Faille FIFA', () => {
  it.each(removedPaths)('ne conserve pas %s dans les sources/publics locaux', path => {
    expect(existsSync(path)).toBe(false)
  })

  it('ne réexporte pas les composants dédiés via le barrel partagé', () => {
    const source = readFileSync('src/components/bttsbet/index.ts', 'utf8')
    expect(source).not.toContain('AviatorVip')
    expect(source).not.toContain('FifaLinebet')
  })

  it('ne soumet plus les URLs retirées via IndexNow', () => {
    const source = readFileSync('scripts/submit-indexnow.mjs', 'utf8')
    expect(source).not.toContain('https://bttspredict.com/prediction-aviator')
    expect(source).not.toContain('https://bttspredict.com/faille-fifa')
    expect(source).not.toContain('https://bttspredict.com/blog/faille-fifa-linebet')
  })

  it('préserve la redirection Faille FIFA déjà configurée, sans en créer une nouvelle', () => {
    const source = readFileSync('public/.htaccess', 'utf8')
    expect(source).toContain('RewriteRule ^faille-fifa/?$ / [R=301,L]')
  })

  it('garde les deux anciennes pages absentes du sitemap', () => {
    const source = readFileSync('src/app/sitemap.ts', 'utf8')
    expect(source).not.toContain('prediction-aviator')
    expect(source).not.toContain('faille-fifa')
  })
})
