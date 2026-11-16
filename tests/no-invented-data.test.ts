import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { humanMatchDataAvailabilityLabel, matchDataAvailability } from '@/lib/predictionQuality'
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

  it('FreePredictions.tsx n\'affiche que les picks Gemini et aucune sélection locale', () => {
    const source = readSource('src/components/bttsbet/FreePredictions.tsx')
    // Les deux marchés viennent exclusivement du filtre de décisions Gemini.
    expect(source).toContain('const preds = getGeminiPicks(p)')
    expect(source).not.toMatch(/computeBtts|computeOver25|local_decision|apply_local_fallback/i)
    expect(source).toMatch(/bttsPred \? \(bttsPred\.prediction/)
    expect(source).toMatch(/over25Pred \? \(over25Pred\.prediction/)
    expect(source).toContain('<MissingMarketVipLink locale={lang} market="BTTS" />')
    expect(source).toContain('<MissingMarketVipLink locale={lang} market="Over 2.5" />')
    // Compteurs bruts descriptifs : aucun seuil ne classe ni ne filtre le pick.
    expect(source).toContain('observedMatchCountLabel')
    expect(source).toContain('matchCountHome: typeof p.matchCountHome')
    expect(source).toContain('matchCountAway: typeof p.matchCountAway')
    expect(source).not.toContain('humanMatchDataAvailabilityLabel')
    expect(source).not.toContain('matchDataAvailability')
    expect(source).not.toMatch(/predictionQuality\s*\(|homeLambda|awayLambda|xgHome|xgAway|reliabilityScore/)
    expect(source).toContain('if (preds.length === 0) continue')
    expect(source).toContain('analysisHeading')
    // Anciens libellés robotiques absents
    expect(source).not.toContain('Pronostic IA')
    expect(source).not.toContain('BTTSPredict AI')
    // URL interne, tracking et CTA affiliés conservés
    expect(source).toContain('generateMatchSlug')
    expect(source).toContain("import BookmakerCardLinks from './BookmakerCardLinks'")
    expect(source).toContain('placement="free-predictions-partner-rail"')
    expect(source).not.toContain('placement="free-prediction-card"')
    const partnerLinks = readSource('src/components/bttsbet/BookmakerCardLinks.tsx')
    expect(partnerLinks).toContain('rel="sponsored nofollow noopener noreferrer"')
    expect(partnerLinks).toContain("trackAffiliateAction(id, 'signup_cta_click', placement")
  })

  it('conserve le parcours VIP live de référence sans le mockup local', () => {
    const page = readSource('src/app/vip/page.tsx')
    const journey = readSource('src/app/vip/VipJourneyModal.tsx')
    const localized = readSource('src/app/[locale]/vip/page.tsx')

    expect(page).toContain("import VipJourneyModal from './VipJourneyModal'")
    expect(page).toContain('<VipJourneyModal')
    expect(page).toContain('VIP_PARTNERS')
    expect(page).not.toContain('Aperçu local non connecté')
    expect(page).not.toContain('Essai Gold')
    expect(page).not.toContain('trialPrice')
    expect(journey).toContain('const API =')
    expect(journey).toContain('Demande d’accès VIP')
    expect(journey).not.toContain('aucun envoi')
    expect(localized).toContain("getStaticLocaleParams('/vip')")
    expect(localized).toContain("if (locale !== 'en') notFound()")
  })

  it('match/[slug]/page.tsx n\'affiche plus de date de source codée en dur ni d\'anglicismes', () => {
    const source = readSource('src/app/match/[slug]/page.tsx')

    expect(source).not.toMatch(/depuis le 2026-08-08/)
    expect(source).not.toMatch(/Public tracking since 2026-08-08/)
    expect(source).not.toMatch(/'unavailable'/)
    expect(source).not.toContain('moteur IA')
    expect(source).not.toMatch(/— BTTSPredict AI/)
    expect(source).not.toMatch(/copy\.(?:lambdaLabel|lambdaHint|xgTotalLabel|modelSource)\b/)
    expect(source).not.toMatch(/match\.(?:homeLambda|awayLambda|xgHome|xgAway|xgTotal)\b/)
    // Vraie date de publication branchée depuis les données
    expect(source).toContain('match.lastUpdated')
    expect(source).toContain('verified[0]?.verifiedAt || match.lastUpdated')
    // SEO intact : H1, JSON-LD, canonical présents
    expect(source).toContain('BreadcrumbList')
    expect(source).toContain('SportsEvent')
    expect(source).toContain('bttspredict.com/match/')
  })

  it('le bandeau de preuve d’accueil est tiré du suivi public et lié à l’historique', () => {
    const dashboard = readSource('src/components/bttsbet/PerformanceDashboard.tsx')
    const translations = readSource('src/lib/i18n.ts')

    expect(dashboard).toContain('<ArchiveSummaryCards summary={archiveSummary} lang={lang} />')
    expect(dashboard).toContain("localizedPath('/historique', lang)")
    expect(translations).toContain('perfProof:')
    expect(translations).toContain('Aucun résultat Score exact vérifié à ce jour')
    expect(translations).toContain('No exact-score results verified yet')
    expect(translations).toContain('لم تُوثّق أي نتائج للنتيجة الدقيقة حتى الآن')
  })

  it('la méthodologie indique que la couverture publique n’est pas exhaustive en FR/EN/AR', () => {
    const french = readSource('src/app/methodologie/page.tsx')
    const localized = readSource('src/app/methodologie/LocalizedMethodologieClient.tsx')

    expect(french).toContain('Le flux public ne représente pas le calendrier complet des championnats.')
    expect(french).toContain('Une rencontre n&apos;apparaît comme pronostic que si un pick valide existe')
    expect(french).not.toMatch(/Gemini/i)
    expect(french).not.toMatch(/\bxG\b/i)
    expect(localized).toContain('The public feed is not a complete fixture schedule.')
    expect(localized).toContain('لا تمثل البيانات العامة جدولاً كاملاً للمباريات.')
    expect(localized).not.toMatch(/Gemini/i)
    expect(localized).not.toContain('National-team competitions and friendlies are excluded')
    expect(localized).not.toContain('تُستبعد مسابقات المنتخبات الوطنية والمباريات الودية')
  })

  it('les copies publiques n’affirment plus un modèle local ni une couverture 50+ non démontrée', () => {
    const constants = readSource('src/lib/constants.ts')
    const guide = readSource('src/app/btts-c-est-quoi/page.tsx')
    const tomorrow = readSource('src/app/btts/predictions/tomorrow/page.tsx')
    const translations = readSource('src/lib/i18n.ts')

    expect(constants).not.toContain('50+')
    expect(constants).not.toContain('modèle statistique est calibré')
    expect(constants).toContain('Onze compétitions sont configurées')
    expect(guide).not.toContain('lambda')
    expect(guide).not.toContain('expected goals (xG)')
    expect(guide).not.toContain("rate: '~58%'")
    expect(guide).toContain('Les sélections BTTS publiques sont affichées après leurs contrôles de validation.')
    expect(guide).not.toMatch(/Gemini/i)
    expect(tomorrow).not.toContain('modèle statistique')
    expect(tomorrow).toContain('picks publics disponibles')
    expect(tomorrow).toContain('Pronostics BTTS de demain')
    expect(tomorrow).toContain('initialLocale="fr" dayOffset={1} marketFilter="btts"')
    expect(tomorrow).not.toContain('BTTS Predictions Tomorrow')
    expect(translations).not.toContain('expected goals (λ) modelled from available data')
    expect(translations).not.toContain('Statistical model + ESPN data')
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
  it('les labels décrivent uniquement les données de contexte, sans qualifier la confiance du pick', () => {
    expect(humanMatchDataAvailabilityLabel('sufficient')).toBe('Données de matchs récentes disponibles')
    expect(humanMatchDataAvailabilityLabel('limited')).toBe('Échantillon de matchs limité')
    expect(humanMatchDataAvailabilityLabel('insufficient')).toBe('Historique de matchs insuffisant')
    expect(matchDataAvailability({ xgHome: 1.6, awayLambda: 1.2, proba: 0.71 })).toBe('insufficient')
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
