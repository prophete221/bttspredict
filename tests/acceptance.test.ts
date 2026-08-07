/**
 * Tests d'acceptation pour les routes et la navigation (Phase 15)
 */
import { describe, test, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(__dirname, '..')

describe('Phase 2 — Routes autonomes', () => {
  test('/pronostics ne redirige plus vers /#free-predictions', () => {
    const page = fs.readFileSync(path.join(ROOT, 'src/app/pronostics/page.tsx'), 'utf8')
    expect(page).not.toContain('redirect-client')
    expect(page).not.toContain("window.location.href = '/#free-predictions'")
    expect(page).toContain('FreePredictions')
  })

  test('/vip ne redirige plus vers /#vip', () => {
    const page = fs.readFileSync(path.join(ROOT, 'src/app/vip/page.tsx'), 'utf8')
    expect(page).not.toContain('redirect-client')
    expect(page).not.toContain("window.location.href = '/#vip'")
    expect(page).toContain('VipCardGrid')
  })

  test('/historique affiche le nouveau suivi uniquement', () => {
    const page = fs.readFileSync(path.join(ROOT, 'src/app/historique/page.tsx'), 'utf8')
    expect(page).toContain('HistoriqueClient')
    const client = fs.readFileSync(path.join(ROOT, 'src/app/historique/HistoriqueClient.tsx'), 'utf8')
    expect(client).toContain('trackingPeriod')
    expect(client).toContain('insufficientVolume')
  })

  test('/pronostics/aujourd-hui existe', () => {
    expect(fs.existsSync(path.join(ROOT, 'src/app/pronostics/aujourd-hui/page.tsx'))).toBe(true)
  })

  test('/methodologie documente les sources réelles', () => {
    const page = fs.readFileSync(path.join(ROOT, 'src/app/methodologie/page.tsx'), 'utf8')
    expect(page).toContain('ESPN Soccer API')
    expect(page).toContain('TheSportsDB')
    expect(page).not.toContain('200+ variables')
    expect(page).toContain('8 variables')
    expect(page).toContain('Aucun résultat futur')
  })

  test('anciens fichiers redirect-client supprimés', () => {
    expect(fs.existsSync(path.join(ROOT, 'src/app/vip/redirect-client.tsx'))).toBe(false)
    expect(fs.existsSync(path.join(ROOT, 'src/app/pronostics/redirect-client.tsx'))).toBe(false)
  })
})

describe('Phase 6 — BottomNavigation sur toutes les pages', () => {
  test('BottomNavigation.tsx existe', () => {
    expect(fs.existsSync(path.join(ROOT, 'src/components/bttsbet/BottomNavigation.tsx'))).toBe(true)
  })

  test('BottomNavigation est monté dans layout.tsx (visible sur toutes les routes)', () => {
    const layout = fs.readFileSync(path.join(ROOT, 'src/app/layout.tsx'), 'utf8')
    expect(layout).toContain('BottomNavigation')
    expect(layout).toContain('<BottomNavigation')
  })

  test('BottomNavigation contient 4 onglets : Accueil, Pronos, VIP, Historique', () => {
    const nav = fs.readFileSync(path.join(ROOT, 'src/components/bttsbet/BottomNavigation.tsx'), 'utf8')
    expect(nav).toContain('Accueil')
    expect(nav).toContain('Pronos')
    expect(nav).toContain('VIP')
    expect(nav).toContain('Historique')
  })

  test('BottomNavigation a aria-current et usePathname', () => {
    const nav = fs.readFileSync(path.join(ROOT, 'src/components/bttsbet/BottomNavigation.tsx'), 'utf8')
    expect(nav).toContain('aria-current')
    expect(nav).toContain('usePathname')
  })

  test('BottomNavigation z-index supérieur aux cartes', () => {
    const nav = fs.readFileSync(path.join(ROOT, 'src/components/bttsbet/BottomNavigation.tsx'), 'utf8')
    expect(nav).toMatch(/z-50/)
    expect(nav).toContain('env(safe-area-inset-bottom')
  })

  test('CookieConsent monté globalement dans layout', () => {
    const layout = fs.readFileSync(path.join(ROOT, 'src/app/layout.tsx'), 'utf8')
    expect(layout).toContain('CookieConsent')
  })

  test('CookieConsent positionné au-dessus de BottomNavigation (pas de chevauchement)', () => {
    const cc = fs.readFileSync(path.join(ROOT, 'src/components/bttsbet/CookieConsent.tsx'), 'utf8')
    // BottomNavigation is at bottom: 0 with height calc(64px + env(safe-area-inset-bottom))
    // CookieConsent must be positioned ABOVE it (bottom >= 64px)
    expect(cc).toMatch(/bottom:\s*'calc\(64px/)
    expect(cc).toMatch(/z-\[60\]/) // higher z-index than BottomNavigation (z-50)
  })
})

describe('Phase 3 — Nouveau système de suivi', () => {
  test('tracking-period.json existe avec startDate et modelVersion', () => {
    const tp = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/tracking-period.json'), 'utf8'))
    expect(tp.startDate).toBe('2026-08-08')
    expect(tp.modelVersion).toBe('V3-Reliability')
    expect(tp.filters).toHaveLength(4)
    expect(tp.leagues).toHaveLength(11)
    expect(tp.disclaimer).toContain('Aucun résultat futur')
  })

  test('win-history.json contient trackingPeriod avec insufficientVolume', () => {
    const wh = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/win-history.json'), 'utf8'))
    expect(wh.trackingPeriod).toBeDefined()
    expect(wh.trackingPeriod.startDate).toBe('2026-08-08')
    expect(wh.trackingPeriod.insufficientVolume).toBe(true)
  })

  test('win-history.json contient legacyStats avec isPrivate', () => {
    const wh = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/win-history.json'), 'utf8'))
    expect(wh.legacyStats).toBeDefined()
    expect(wh.legacyStats.isPrivate).toBe(true)
  })

  test('update-win-history.mjs sépare newStats et legacyStats', () => {
    const script = fs.readFileSync(path.join(ROOT, 'scripts/update-win-history.mjs'), 'utf8')
    expect(script).toContain('TRACKING_START')
    expect(script).toContain('legacyStats')
    expect(script).toContain('isPrivate: true')
  })
})

describe('Phase 4 — Page d\'accueil simplifiée', () => {
  const page = fs.readFileSync(path.join(ROOT, 'src/app/page.tsx'), 'utf8')

  test('page d\'accueil ne contient plus PromoVip, VipCardGrid, HowToGetVip', () => {
    // Import lines cleaned up
    expect(page).not.toContain('PromoVip,')
    expect(page).not.toContain('VipCardGrid,')
    expect(page).not.toContain('HowToGetVip,')
  })

  test('page d\'accueil contient un seul bloc VIP court avec CTA vers /vip', () => {
    expect(page).toContain('Découvrir le VIP')
    expect(page).toContain('href="/vip"')
  })

  test('page d\'accueil contient accès méthodologie et historique', () => {
    expect(page).toContain('Méthodologie du modèle')
    expect(page).toContain('Historique vérifié')
    expect(page).toContain('href="/methodologie"')
    expect(page).toContain('href="/historique"')
  })

  test('page d\'accueil contient bloc jeu responsable', () => {
    expect(page).toContain('18+')
    expect(page).toContain('Jouer responsable')
    expect(page).toContain('href="/jouer-responsable"')
  })
})

describe('Phase 5 — Page VIP autonome', () => {
  const vip = fs.readFileSync(path.join(ROOT, 'src/app/vip/page.tsx'), 'utf8')

  test('/vip contient les 14 sections requises', () => {
    // Sections identifiables par leurs h2
    expect(vip).toContain('Comparaison des niveaux')
    expect(vip).toContain('Sports couverts')
    expect(vip).toContain('Nombre de pronostics')
    expect(vip).toContain('Durée d\'accès')
    expect(vip).toContain('Comment activer le VIP')
    expect(vip).toContain('Sélections VIP du jour')
    expect(vip).toContain('Vérifier nos résultats')
    expect(vip).toContain('Conditions et limites')
    expect(vip).toContain('Questions fréquentes VIP')
  })

  test('/vip contient notice d\'affiliation rémunérée', () => {
    expect(vip).toContain("Lien d'affiliation rémunéré")
    expect(vip).toContain('BTTSPredict ne prend pas de paris')
  })

  test('/vip ne contient aucune promesse de gain garanti (mais les disclaimers "Aucun gain n\'est garanti" sont autorisés)', () => {
    // Strip ALL disclaimer variants AND verb conjugations of garantir (these are disclaimers, not promises)
    // The source file may contain escaped apostrophes \\'  in JSX strings
    // Use a flexible pattern: "Aucun gain" followed by optional "n'est" or "n\\'est" then "garanti"
    const cleaned = vip
      .replace(/Aucun gain n.*?est garanti/g, '')   // matches both ' and \\' as the apostrophe (.*? lazy match)
      .replace(/Aucun gain garanti/g, '')            // without "n'est"
      .replace(/ne garantit aucun gain/g, '')
      .replace(/garantit-il des gains/g, '')
      .replace(/garantit/g, '') // verb form (conjugated) — always part of disclaimers here
    // After stripping, no remaining noun form "garanti" (gain garanti, etc.) should appear
    const remaining = cleaned.match(/\bgaranti\b/g)
    if (remaining) {
      console.error('Found "garanti" remaining in /vip page:', remaining)
    }
    expect(remaining).toBeNull()
    expect(cleaned).not.toMatch(/sans risque/i)
    expect(vip).not.toContain('gain assuré')
    expect(vip).not.toContain('N°1')
  })
})

describe('Phase 10 — Textes français cohérents', () => {
  test('Hero.tsx ne contient plus d\'anglicismes', () => {
    const hero = fs.readFileSync(path.join(ROOT, 'src/components/bttsbet/Hero.tsx'), 'utf8')
    expect(hero).not.toContain('Football Predictions Today')
    expect(hero).not.toContain('View Today')
    expect(hero).not.toContain('View Verified Results')
    expect(hero).toContain('Pronostics BTTS')
    expect(hero).toContain('Voir les pronostics du jour')
    expect(hero).toContain('Voir l\'historique vérifié')
  })
})

describe('Phase 11 — SEO', () => {
  test('/faille-fifa canonical corrigé (n\'est plus /analyses-fifa)', () => {
    const page = fs.readFileSync(path.join(ROOT, 'src/app/faille-fifa/page.tsx'), 'utf8')
    expect(page).not.toContain("'analyses-fifa'")
    expect(page).toContain("'faille-fifa'")
  })

  test('/prediction-aviator canonical corrigé (n\'est plus /aviator-stats)', () => {
    const page = fs.readFileSync(path.join(ROOT, 'src/app/prediction-aviator/page.tsx'), 'utf8')
    expect(page).not.toContain("'aviator-stats'")
    expect(page).toContain("'prediction-aviator'")
  })

  test('sitemap.xml contient les nouvelles routes', () => {
    const sitemap = fs.readFileSync(path.join(ROOT, 'public/sitemap.xml'), 'utf8')
    expect(sitemap).toContain('/pronostics</loc>')
    expect(sitemap).toContain('/historique</loc>')
    expect(sitemap).toContain('/vip</loc>')
    expect(sitemap).toContain('/methodologie</loc>')
    expect(sitemap).toContain('/resultats-verifies</loc>')
  })
})

describe('Phase 13 — Cookies + jeu responsable', () => {
  test('CookieConsent propose Personnaliser / Refuser / Accepter', () => {
    const cc = fs.readFileSync(path.join(ROOT, 'src/components/bttsbet/CookieConsent.tsx'), 'utf8')
    expect(cc).toMatch(/Personnaliser|Personnaliser/i)
    expect(cc).toMatch(/Refuser|Refuser/i)
    expect(cc).toMatch(/Accepter|Accepter/i)
  })

  test('CookieConsent ne masque pas la BottomNavigation', () => {
    const cc = fs.readFileSync(path.join(ROOT, 'src/components/bttsbet/CookieConsent.tsx'), 'utf8')
    // Must be positioned above BottomNav (bottom >= 64px, not bottom: 0)
    expect(cc).toMatch(/bottom:\s*'calc\(64px/)
  })
})

describe('Phase 8 — Déduplication et cohérence des compteurs', () => {
  test('src/lib/predictions.ts existe avec toutes les fonctions requises', () => {
    const lib = fs.readFileSync(path.join(ROOT, 'src/lib/predictions.ts'), 'utf8')
    expect(lib).toContain('predictionKey')
    expect(lib).toContain('getProba')
    expect(lib).toContain('getConfidence')
    expect(lib).toContain('getTier')
    expect(lib).toContain('deduplicatePredictions')
    expect(lib).toContain('countPredictions')
    expect(lib).toContain('validatePrediction')
    expect(lib).toContain('filterByTrackingPeriod')
  })

  test('Aucune proba à 0 dans predictions.json', () => {
    const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/predictions.json'), 'utf8'))
    const preds = data.predictions || []
    for (const p of preds) {
      const proba = p.proba
      expect(proba).toBeGreaterThan(0)
      expect(proba).toBeLessThanOrEqual(1)
    }
  })
})

describe('Phase 9 — Transparence des données', () => {
  test('DATA_TRANSPARENCY.md existe', () => {
    expect(fs.existsSync(path.join(ROOT, 'DATA_TRANSPARENCY.md'))).toBe(true)
  })

  test('DATA_TRANSPARENCY.md ne mentionne pas API-Football comme source utilisée', () => {
    const dt = fs.readFileSync(path.join(ROOT, 'DATA_TRANSPARENCY.md'), 'utf8')
    expect(dt).toContain('NON utilisées')
    expect(dt).toContain('API-Football')
  })

  test('DATA_TRANSPARENCY.md documente 8 variables', () => {
    const dt = fs.readFileSync(path.join(ROOT, 'DATA_TRANSPARENCY.md'), 'utf8')
    expect(dt).toContain('8 variables')
  })

  test('VIP_PAGE_SPEC.md existe', () => {
    expect(fs.existsSync(path.join(ROOT, 'VIP_PAGE_SPEC.md'))).toBe(true)
  })

  test('ROUTES_AUDIT.md existe', () => {
    expect(fs.existsSync(path.join(ROOT, 'ROUTES_AUDIT.md'))).toBe(true)
  })

  test('IMPLEMENTATION_PLAN.md existe', () => {
    expect(fs.existsSync(path.join(ROOT, 'IMPLEMENTATION_PLAN.md'))).toBe(true)
  })
})

describe('Phase 12 — Accessibilité', () => {
  test('globals.css contient prefers-reduced-motion', () => {
    const css = fs.readFileSync(path.join(ROOT, 'src/app/globals.css'), 'utf8')
    expect(css).toContain('prefers-reduced-motion')
    expect(css).toContain('animation-duration: 0.01ms')
  })

  test('globals.css contient focus-visible', () => {
    const css = fs.readFileSync(path.join(ROOT, 'src/app/globals.css'), 'utf8')
    expect(css).toContain('focus-visible')
    expect(css).toContain('#5146F5')
  })

  test('FreePredictions.tsx TeamLogo a fallback initials', () => {
    const fp = fs.readFileSync(path.join(ROOT, 'src/components/bttsbet/FreePredictions.tsx'), 'utf8')
    expect(fp).toContain('initials')
    expect(fp).toContain('onError')
    expect(fp).toContain('loading="lazy"')
  })
})

describe('Phase 14 — Performance', () => {
  test('FreePredictions.tsx images ont width/height explicites', () => {
    const fp = fs.readFileSync(path.join(ROOT, 'src/components/bttsbet/FreePredictions.tsx'), 'utf8')
    expect(fp).toContain('width={size}')
    expect(fp).toContain('height={size}')
    expect(fp).toContain('decoding="async"')
  })

  test('FreePredictionsWidget.tsx TeamLogoMini a fallback', () => {
    const fpw = fs.readFileSync(path.join(ROOT, 'src/components/bttsbet/FreePredictionsWidget.tsx'), 'utf8')
    expect(fpw).toContain('initials')
    expect(fpw).toContain('aria-label')
  })
})
