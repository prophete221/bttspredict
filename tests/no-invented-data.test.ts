import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { humanMethodLabel } from '@/lib/predictionQuality'
import { statusLabel, confidenceLabel } from '@/lib/predictionPresentation'

/**
 * Gardes anti-régression du chantier audit-conversion-batch.
 * Règle absolue du propriétaire : ne jamais réintroduire de probabilité par
 * défaut 0.62, de lambda inventée 1.3/1.1, de clamp artificiel 40-54 %, ni de
 * contenu gratuit dans l'espace VIP. Ces tests lisent le code source réellement
 * branché : si le pattern interdit revient, le test casse.
 */
function readSource(relativePath: string): string {
  return readFileSync(resolve(__dirname, '..', relativePath), 'utf8')
}

describe('no invented data — fallbacks interdits', () => {
  it('FreePredictions.tsx n\'invente plus de lambda ni de clamp de probabilité', () => {
    const source = readSource('src/components/bttsbet/FreePredictions.tsx')

    expect(source).not.toMatch(/\?\?\s*1\.3\b/) // lambda domicile inventée
    expect(source).not.toMatch(/\?\?\s*1\.1\b/) // lambda extérieur inventée
    expect(source).not.toMatch(/Math\.max\(40,\s*Math\.min\(54/) // clamp confiance 40-54 %
    expect(source).not.toMatch(/Math\.max\(0\.40,\s*Math\.min\(0\.54/) // clamp probabilité
    expect(source).not.toMatch(/\b0\.62\b/) // probabilité par défaut
  })

  it('FreePredictions.tsx n\'affiche un état insuffisant que sur données réellement insuffisantes', () => {
    const source = readSource('src/components/bttsbet/FreePredictions.tsx')
    // Le calcul d'un marché manquant exige des lambdas réels
    expect(source).toMatch(/homeLambda != null && awayLambda != null \? computeBtts/)
    expect(source).toMatch(/homeLambda != null && awayLambda != null \? computeOver25/)
    // Libellés humains branchés
    expect(source).toContain('humanMethodLabel')
    expect(source).toContain('predictionQuality')
    expect(source).toContain('analysisHeading')
    // Anciens libellés robotiques absents
    expect(source).not.toContain('Pronostic IA')
    expect(source).not.toContain('BTTSPredict AI')
    // URL interne, tracking et CTA affiliés conservés
    expect(source).toContain('generateMatchSlug')
    expect(source).toContain("import BookmakerCardLinks from './BookmakerCardLinks'")
    expect(source).toContain('placement="free-prediction-card"')
    const partnerLinks = readSource('src/components/bttsbet/BookmakerCardLinks.tsx')
    expect(partnerLinks).toContain('rel="sponsored nofollow noopener noreferrer"')
    expect(partnerLinks).toContain("trackAffiliateAction(id, 'signup_cta_click', placement")
  })

  it('la page VIP ne lit pas le flux public et garde les aperçus génériques verrouillés', () => {
    const source = readSource('src/app/vip/page.tsx')
    const lockedPicks = readSource('src/app/vip/VipLockedPicks.tsx')
    const unlockModal = readSource('src/components/bttsbet/VipUnlockModal.tsx')

    expect(source).not.toContain("fetch('/predictions.json'")
    expect(source).not.toContain('onlyVipFixtures')
    expect(source).not.toContain('vipPreview')
    expect(source).toContain('<VipLockedPicks')
    expect(lockedPicks).toContain('Aucun match, choix, cote ou signal réel n’est affiché ici.')
    expect(lockedPicks).toContain('No real fixture, pick, odds or signal is shown here.')
    expect(lockedPicks).toContain('لا تُعرض هنا أي مباراة أو اختيار أو احتمالات أو إشارات حقيقية.')
    expect(unlockModal).toContain('role="dialog"')
    expect(unlockModal).toContain('L’accès à vie reste verrouillé jusqu’à la confirmation manuelle du propriétaire.')
    expect(unlockModal).toContain('Lifetime access stays locked until the owner manually approves it.')
    expect(unlockModal).toContain('يظل الوصول مدى الحياة مقفلاً حتى موافقة المالك يدوياً.')
    expect(unlockModal).toContain('It is not sent automatically')
    expect(unlockModal).toContain('لا تُرسل تلقائياً')
  })

  it('match/[slug]/page.tsx n\'affiche plus de date de source codée en dur ni d\'anglicismes', () => {
    const source = readSource('src/app/match/[slug]/page.tsx')

    expect(source).not.toMatch(/depuis le 2026-08-08/)
    expect(source).not.toMatch(/Public tracking since 2026-08-08/)
    expect(source).not.toMatch(/'unavailable'/)
    expect(source).not.toContain('moteur IA')
    expect(source).not.toMatch(/— BTTSPredict AI/)
    // Vraie date de publication branchée depuis les données
    expect(source).toContain('match.lastUpdated')
    expect(source).toContain('verified[0]?.verifiedAt || match.lastUpdated')
    // SEO intact : H1, JSON-LD, canonical présents
    expect(source).toContain('BreadcrumbList')
    expect(source).toContain('SportsEvent')
    expect(source).toContain('bttspredict.com/match/')
  })

  it('matches.ts expose la date de publication réelle du snapshot', () => {
    const source = readSource('src/lib/matches.ts')

    expect(source).toMatch(/lastUpdated\?:/)
    expect(source).toMatch(/snapshotPublishedAt/)
  })

  it('le pipeline quotidien ne publie aucune sélection VIP', () => {
    const source = readSource('scripts/quick-update-predictions.mjs')
    expect(source).not.toContain('vipPreview')
    expect(source).not.toContain('vipCount')
    expect(source).not.toContain('publicVipFixture')
    expect(source).toContain('no VIP data')
  })

  it('i18n remplace « Fiabilité » par « Qualité des données » dans les 3 langues', () => {
    const source = readSource('src/lib/i18n.ts')

    expect(source).toContain("mcReliability: 'Qualité des données'")
    expect(source).toContain("mcReliability: 'Data quality'")
    expect(source).toContain('mcReliability')
    expect(source).not.toContain("mcReliability: 'Fiabilité'")
    expect(source).not.toContain("mcReliability: 'Reliability'")
  })
})

describe('no invented data — libellés humains (runtime)', () => {
  it('les niveaux de qualité parlent en langage humain, sans pourcentage', () => {
    expect(humanMethodLabel('reliable')).toBe('Basé sur les données récentes')
    expect(humanMethodLabel('limited')).toBe('Données limitées')
    expect(humanMethodLabel('insufficient')).toBe('Données insuffisantes')
  })

  it('les statuts gagné/perdu/en attente restent honnêtes', () => {
    expect(statusLabel('WON')).toBe('Gagné')
    expect(statusLabel('LOST')).toBe('Perdu')
    expect(statusLabel('PENDING')).toBe('En attente')
    expect(statusLabel(undefined)).toBe('En attente')
  })

  it('une confiance absente n\'est jamais présentée comme un pourcentage', () => {
    expect(confidenceLabel(undefined)).toBe('Données insuffisantes')
    expect(confidenceLabel(Number.NaN)).toBe('Données insuffisantes')
  })
})

describe('no invented data — payload réel (public/predictions.json)', () => {
  it('le payload public réel ne contient ni preview ni compteur VIP', () => {
    const raw = readFileSync(resolve(__dirname, '..', 'public', 'predictions.json'), 'utf8')
    const payload = JSON.parse(raw) as Record<string, unknown>
    expect(payload).not.toHaveProperty('vip')
    expect(payload).not.toHaveProperty('vipPreview')
    expect(payload).not.toHaveProperty('vipPredictions')
    expect(payload.stats).not.toHaveProperty('vipCount')
    const serialized = JSON.stringify(payload)
    expect(serialized).not.toContain('vipPreview')
    expect(serialized).not.toContain('vipPredictions')
    expect(serialized).not.toContain('vipCount')
    const publicRows = [
      ...((payload.free as Array<Record<string, unknown>>) ?? []),
      ...((payload.predictions as Array<Record<string, unknown>>) ?? []),
    ]
    for (const row of publicRows) {
      expect(row.vip).not.toBe(true)
      expect(row.isVip).not.toBe(true)
      expect(String(row.tier || '').toUpperCase()).not.toBe('VIP')
    }
  })
})
