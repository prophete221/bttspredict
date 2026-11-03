# Phase 2C — Proposition de diff, West Ham–QPR (1–1)

**Document de revue uniquement — aucun patch applicatif n’est appliqué.** Cette proposition est ancrée sur la branche locale `redesign/professional-global-2026-11-03`, HEAD `149733160d0c9e7796dc36d3f86f80a2284eecf8`, amont local `origin/redesign/professional-global-2026-11-03` à `325526d93c63fc52143741a5b739cf68f7ba0809`. Les modifications documentaires antérieures présentes au début de cette mission sont préservées.

La sélection de l’URL française reste à approuver. Les deux modes d’indexation ci-dessous sont mutuellement exclusifs et **aucun défaut n’est choisi**. Le diff commun ne pourra être implémenté qu’après le choix explicite d’un mode et validation du conflit éventuel de routes à l’export statique.

## Faits contrôlés et limites

- Dans `public/predictions-archive/2026-10-03.json` à `2026-10-08.json`, le même enregistrement West Ham United–Queens Park Rangers apparaît six fois. Les enregistrements ont été comparés structurellement : mêmes valeurs et mêmes champs, à l’ordre des clés JSON près. Ils portent `date: 2026-10-09`, `time: 19:00`, `dataQuality: HIGH`, 8 matchs par équipe, BTTS 64,02 %, Over 2.5 68,38 %, xG 2,27 et 1,25, `finalScore: 1-1`, `status: WON` et `verifiedAt: 2026-10-23T05:42:15.167Z`. Aucun ne contient un champ de fuseau horaire ni l’URL de la source du résultat.
- `public/win-history.json` contient l’entrée locale `history[246]` pour ce match, avec `source: ESPN public`, score final `1-1`, statut `WON` et le même `verifiedAt`. Le registre actuel ne conserve pas `sourceUrl`. Le compte rendu officiel de West Ham et la page ESPN gameId `401880233` sont déjà référencés dans les rapports précédents.
- L’heure officielle documentée est 20:00 BST le 9 octobre 2026, soit 19:00 UTC et 19:00 à Dakar. Cela ne permet pas de déduire le fuseau d’origine du champ `time: 19:00` des snapshots : il reste inconnu.
- `src/lib/matches.ts` limite la lecture des snapshots aux 14 fichiers les plus récents (`slice(-14)`). La page cible ne peut donc pas dépendre uniquement de cette fenêtre pour être conservée.
- `src/app/match/[slug]/page.tsx` génère actuellement les paramètres FR à partir de `getAllMatchSlugs()`; `dynamicParams = false`. `src/app/[locale]/match/[slug]/page.tsx` génère les variantes non-FR à partir de ces slugs. Le test `tests/seo-preservation.test.ts` protège la fonction `generateMetadata` de la route FR; le patch proposé ne change pas son contenu.
- Les cinq URL SEO protégées dans `ETAT_PROJET.md` sont `/en/btts-and-over-2-5-predictions-today`, `/en`, `/en/over-2-5/predictions/today`, `/` et `/en/ai-correct-score-predictions`. Une empreinte de référence a été calculée en lecture seule pour chaque fichier source de page concerné. Le test proposé ajouterait ces empreintes comme garde-fou.

**Ce qui n’a pas été fait :** aucun build du dépôt ou du patch, aucun test des nouveaux tests proposés, aucun lint/TypeScript, aucune modification applicative/donnée, sitemap, canonical existant, `robots.txt`, archive, production, branche `main`, commit ou push. Un mini-projet de routage isolé et le test existant SEO ont été exécutés pendant l’analyse complémentaire; voir la section ci-dessous. Le diff n’a pas été appliqué.

## Stratégie proposée

1. Copier une fois l’enregistrement historique canonique dans `src/data/retained-match-pages/`, hors de `public/predictions-archive/` et de la purge glissante. Conserver les six dates d’origine comme provenance; les six contenus du match ont été vérifiés identiques.
2. Ajouter un registre de vérification distinct du snapshot de prédiction. Il conserve ESPN, l’URL directe, le résultat structuré, l’horodatage UTC, le fuseau de coup d’envoi, le fuseau du snapshot séparé du fuseau d’affichage, et un statut contrôlé.
3. Créer une route littérale dédiée `/match/west-ham-united-vs-queens-park-rangers-2026-10-09` avec contenu français seulement. Elle lit les deux fichiers conservés et affiche la provenance ESPN et le résultat vérifié. Ne pas injecter le nouvel enregistrement dans `getAllMatchSlugs()`.
4. Exclure explicitement ce slug des générateurs dynamiques FR, EN et AR. Ainsi, la page littérale reste la seule route pour ce match, même si le slug venait un jour à apparaître dans la fenêtre courante. Tous les autres slugs gardent leur génération actuelle.
5. Ne pas modifier `src/app/sitemap.ts`, `public/robots.txt`, les pages protégées ni aucun canonical existant. La route nouvelle aurait un canonical auto-référent propre, pour ne pas hériter du canonical de la racine. Cette ligne n’est qu’une partie du diff proposé et n’a été ajoutée nulle part dans le code actuel.

## Diff commun proposé — ne pas appliquer sans une option robots choisie

Le diff ci-dessous est une **base de proposition**. Il est volontairement incomplet au seul endroit indiqué : la configuration robots doit être complétée par exactement l’option A ou l’option B, et jamais par les deux.

```diff
diff --git a/src/lib/match-page-ssg.ts b/src/lib/match-page-ssg.ts
new file mode 100644
--- /dev/null
+++ b/src/lib/match-page-ssg.ts
@@ -0,0 +1,30 @@
+export const RETAINED_FR_ONLY_MATCH_SLUG =
+  'west-ham-united-vs-queens-park-rangers-2026-10-09'
+
+const RETAINED_FR_ONLY_MATCH_SLUGS = new Set([RETAINED_FR_ONLY_MATCH_SLUG])
+
+/** Fail instead of emitting two static pages for the same slug. */
+export function assertUniqueMatchSlugs(slugs: readonly string[]): void {
+  const seen = new Set<string>()
+  for (const slug of slugs) {
+    if (seen.has(slug)) throw new Error(`Duplicate match slug in SSG input: ${slug}`)
+    seen.add(slug)
+  }
+}
+
+/** Slugs served by the generic [slug] route; retained literal routes stay out. */
+export function getDynamicMatchSlugs(slugs: readonly string[]): string[] {
+  assertUniqueMatchSlugs(slugs)
+  return slugs.filter(slug => !RETAINED_FR_ONLY_MATCH_SLUGS.has(slug))
+}
+
+/** Existing localized route set, less any explicitly French-only retained match. */
+export function getLocalizedMatchStaticParams(
+  slugs: readonly string[],
+  locales: readonly string[],
+): Array<{ locale: string; slug: string }> {
+  const dynamicSlugs = getDynamicMatchSlugs(slugs)
+  return locales
+    .filter(locale => locale !== 'fr')
+    .flatMap(locale => dynamicSlugs.map(slug => ({ locale, slug })))
+}
diff --git a/src/app/match/[slug]/page.tsx b/src/app/match/[slug]/page.tsx
--- a/src/app/match/[slug]/page.tsx
+++ b/src/app/match/[slug]/page.tsx
@@ -8,6 +8,7 @@
 import MatchViewTracker from '@/components/bttsbet/MatchViewTracker'
 import TeamContext from '@/components/bttsbet/TeamContext'
 import { localizedPath, type Locale } from '@/lib/i18n'
+import { getDynamicMatchSlugs } from '@/lib/match-page-ssg'

 interface PageProps {
   params: Promise<{ slug: string }>
@@ -25,7 +26,7 @@
 export const dynamic = 'force-static'

 export async function generateStaticParams() {
-  const slugs = getAllMatchSlugs()
+  const slugs = getDynamicMatchSlugs(getAllMatchSlugs())
   // Si aucune page match n'est disponible, on génère un fallback pour que le build SSG passe
   if (slugs.length === 0) {
     return [{ slug: '_placeholder' }]
diff --git a/src/app/[locale]/match/[slug]/page.tsx b/src/app/[locale]/match/[slug]/page.tsx
--- a/src/app/[locale]/match/[slug]/page.tsx
+++ b/src/app/[locale]/match/[slug]/page.tsx
@@ -3,9 +3,12 @@
 import MatchPage from '@/app/match/[slug]/page'
 import { getAllMatchSlugs, getMatchBySlug } from '@/lib/matches'
 import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'
+import { getLocalizedMatchStaticParams } from '@/lib/match-page-ssg'

 export const dynamicParams = false
 export const dynamic = 'force-static'
-export function generateStaticParams() { return SUPPORTED_LOCALES.filter(locale => locale !== 'fr').flatMap(locale => getAllMatchSlugs().map(slug => ({ locale, slug }))) }
+export function generateStaticParams() {
+  return getLocalizedMatchStaticParams(getAllMatchSlugs(), SUPPORTED_LOCALES)
+}
 export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> { const { locale, slug } = await params; const match = getMatchBySlug(slug); if (!match) return { title: 'Match not found', robots: { index: false, follow: false } }; const title = `${match.home} vs ${match.away} BTTS`; return { title: locale === 'ar' ? `${match.home} ضد ${match.away}` : title, description: locale === 'ar' ? `تحليل مباراة ${match.home} ضد ${match.away} وتوقعات BTTS وOver 2.5.` : `BTTS and Over 2.5 analysis for ${match.home} vs ${match.away}.`, alternates: { canonical: `https://bttspredict.com/${locale}/match/${slug}` } } }
 export default async function LocalizedMatchPage({ params }: { params: Promise<{ locale: string; slug: string }> }) { const { locale, slug } = await params; if (!SUPPORTED_LOCALES.includes(locale as Locale) || locale === 'fr' || !getMatchBySlug(slug)) notFound(); return <MatchPage params={Promise.resolve({ slug })} locale={locale as Locale} /> }
diff --git a/src/data/retained-match-pages/west-ham-united-vs-queens-park-rangers-2026-10-09.json b/src/data/retained-match-pages/west-ham-united-vs-queens-park-rangers-2026-10-09.json
new file mode 100644
--- /dev/null
+++ b/src/data/retained-match-pages/west-ham-united-vs-queens-park-rangers-2026-10-09.json
@@ -0,0 +1,78 @@
+{
+  "schemaVersion": 1,
+  "slug": "west-ham-united-vs-queens-park-rangers-2026-10-09",
+  "sourceArchiveFiles": [
+    "public/predictions-archive/2026-10-03.json",
+    "public/predictions-archive/2026-10-04.json",
+    "public/predictions-archive/2026-10-05.json",
+    "public/predictions-archive/2026-10-06.json",
+    "public/predictions-archive/2026-10-07.json",
+    "public/predictions-archive/2026-10-08.json"
+  ],
+  "snapshotTimeZone": null,
+  "record": {
+    "id": "westhamu-vs-queenspa-2026-10-09",
+    "match": "West Ham United vs Queens Park Rangers",
+    "home": "West Ham United",
+    "away": "Queens Park Rangers",
+    "league": "Championship",
+    "date": "2026-10-09",
+    "type": "BTTS",
+    "prediction": "Oui",
+    "proba": 0.6402,
+    "bttsProbDisplay": "64.02%",
+    "over25ProbDisplay": "68.38%",
+    "confidence": 64,
+    "time": "19:00",
+    "matchSemantic": "westhamu-vs-queenspa-2026-10-09",
+    "source": "poisson-v92-real-data",
+    "homeLogo": "https://a.espncdn.com/i/teamlogos/soccer/500/371.png",
+    "awayLogo": "https://a.espncdn.com/i/teamlogos/soccer/500/334.png",
+    "tier": "GOLD",
+    "reliabilityScore": 86.76,
+    "dataQuality": "HIGH",
+    "dataSource": "ESPN_TEAM_SCHEDULE",
+    "matchCountHome": 8,
+    "matchCountAway": 8,
+    "h2hAvailable": false,
+    "xgHome": 2.27,
+    "xgAway": 1.25,
+    "xgTotal": 3.52,
+    "formBTTS": 40,
+    "analysis": "West Ham United (8 matchs réels, xG 2.27) vs Queens Park Rangers (8 matchs réels, xG 1.25). xG cumulé 3.52, BTTS 64.0%, Over 2.5 68.4%. Fiabilité 86.76%. Qualité données: HIGH.",
+    "analysisData": {
+      "bttsProb": 0.6402,
+      "over25Prob": 0.6838,
+      "homeLambda": 2.27,
+      "awayLambda": 1.25,
+      "xgTotal": 3.52
+    },
+    "estimatedCote": 1.56,
+    "estimatedCoteOver": 1.46,
+    "predictions": [
+      {
+        "type": "BTTS",
+        "prediction": "Oui",
+        "confidence": 64,
+        "bttsProb": 0.6402,
+        "homeLambda": 2.27,
+        "awayLambda": 1.25
+      },
+      {
+        "type": "Over 2.5",
+        "prediction": "Oui",
+        "confidence": 68,
+        "over25Prob": 0.6838,
+        "homeLambda": 2.27,
+        "awayLambda": 1.25
+      }
+    ],
+    "bttsProb": 0.6402,
+    "over25Prob": 0.6838,
+    "homeLambda": 2.27,
+    "awayLambda": 1.25,
+    "status": "WON",
+    "finalScore": "1-1",
+    "verifiedAt": "2026-10-23T05:42:15.167Z"
+  }
+}
diff --git a/src/lib/match-verification-registry.ts b/src/lib/match-verification-registry.ts
new file mode 100644
--- /dev/null
+++ b/src/lib/match-verification-registry.ts
@@ -0,0 +1,51 @@
+import { z } from 'zod'
+
+const DATE = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
+const CLOCK = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/)
+const IANA_TIME_ZONE = z.string().refine(value => {
+  try {
+    new Intl.DateTimeFormat('en', { timeZone: value })
+    return true
+  } catch {
+    return false
+  }
+}, 'Expected a valid IANA time-zone identifier')
+
+const MatchVerificationRecordSchema = z.object({
+  id: z.string().min(1),
+  matchDate: DATE,
+  homeTeam: z.string().min(1),
+  awayTeam: z.string().min(1),
+  competition: z.string().min(1),
+  source: z.string().min(1),
+  sourceUrl: z.string().url(),
+  result: z.object({
+    homeGoals: z.number().int().nonnegative(),
+    awayGoals: z.number().int().nonnegative(),
+    display: z.string().min(1),
+  }).strict().superRefine((result, ctx) => {
+    if (result.display !== `${result.homeGoals}-${result.awayGoals}`) {
+      ctx.addIssue({ code: 'custom', message: 'Display score must match the structured score' })
+    }
+  }),
+  verifiedAt: z.string().datetime(),
+  status: z.enum(['pending', 'verified', 'disputed', 'rejected']),
+  kickoff: z.object({ time: CLOCK, timeZone: IANA_TIME_ZONE }).strict(),
+  snapshot: z.object({ time: CLOCK.nullable(), timeZone: IANA_TIME_ZONE.nullable() }).strict(),
+  display: z.object({ time: CLOCK, timeZone: IANA_TIME_ZONE }).strict(),
+}).strict()
+
+export const MatchVerificationRegistrySchema = z.object({
+  schemaVersion: z.literal(1),
+  records: z.array(MatchVerificationRecordSchema).superRefine((records, ctx) => {
+    const seen = new Set<string>()
+    records.forEach((record, index) => {
+      if (seen.has(record.id)) {
+        ctx.addIssue({ code: 'custom', path: [index, 'id'], message: `Duplicate match verification id: ${record.id}` })
+      }
+      seen.add(record.id)
+    })
+  }),
+}).strict()
+
+export type MatchVerificationRecord = z.infer<typeof MatchVerificationRecordSchema>
diff --git a/src/data/match-verification-registry.json b/src/data/match-verification-registry.json
new file mode 100644
--- /dev/null
+++ b/src/data/match-verification-registry.json
@@ -0,0 +1,20 @@
+{
+  "schemaVersion": 1,
+  "records": [
+    {
+      "id": "west-ham-united-vs-queens-park-rangers-2026-10-09",
+      "matchDate": "2026-10-09",
+      "homeTeam": "West Ham United",
+      "awayTeam": "Queens Park Rangers",
+      "competition": "Championship",
+      "source": "ESPN public",
+      "sourceUrl": "https://www.espn.com/soccer/match/_/gameId/401880233/queens-park-rangers-west-ham-united",
+      "result": { "homeGoals": 1, "awayGoals": 1, "display": "1-1" },
+      "verifiedAt": "2026-10-23T05:42:15.167Z",
+      "status": "verified",
+      "kickoff": { "time": "20:00", "timeZone": "Europe/London" },
+      "snapshot": { "time": "19:00", "timeZone": null },
+      "display": { "time": "19:00", "timeZone": "Africa/Dakar" }
+    }
+  ]
+}
diff --git a/src/app/match/west-ham-united-vs-queens-park-rangers-2026-10-09/page.tsx b/src/app/match/west-ham-united-vs-queens-park-rangers-2026-10-09/page.tsx
new file mode 100644
--- /dev/null
+++ b/src/app/match/west-ham-united-vs-queens-park-rangers-2026-10-09/page.tsx
@@ -0,0 +1,61 @@
+import type { Metadata } from 'next'
+import verificationData from '@/data/match-verification-registry.json'
+import retainedMatch from '@/data/retained-match-pages/west-ham-united-vs-queens-park-rangers-2026-10-09.json'
+import { MatchVerificationRegistrySchema } from '@/lib/match-verification-registry'
+
+export const dynamic = 'force-static'
+
+const registry = MatchVerificationRegistrySchema.parse(verificationData)
+const verification = registry.records.find(record => record.id === retainedMatch.slug)
+if (!verification) throw new Error(`Missing verification record for ${retainedMatch.slug}`)
+
+export const metadata: Metadata = {
+  title: 'West Ham United 1–1 Queens Park Rangers — résultat vérifié',
+  description: 'Pronostic BTTS archivé, données du match et résultat final 1–1 vérifié par ESPN.',
+  alternates: {
+    canonical: 'https://bttspredict.com/match/west-ham-united-vs-queens-park-rangers-2026-10-09',
+    languages: {},
+  },
+  // Compléter uniquement par l’option A ou l’option B après décision.
+}
+
+export default function WestHamQprRetainedMatchPage() {
+  const snapshot = retainedMatch.record
+  return (
+    <main lang="fr">
+      <article>
+        <h1>West Ham United – Queens Park Rangers : 1–1</h1>
+        <p>{verification.competition} · 9 octobre 2026</p>
+        <p>
+          Coup d’envoi : {verification.kickoff.time} ({verification.kickoff.timeZone}),
+          soit {verification.display.time} à {verification.display.timeZone}.
+        </p>
+        <p>
+          Le snapshot d’origine indique {verification.snapshot.time} sans fuseau documenté;
+          cette heure n’est pas utilisée pour inférer son fuseau.
+        </p>
+        <section aria-labelledby="prediction-title">
+          <h2 id="prediction-title">Pronostic archivé</h2>
+          <p>BTTS : {snapshot.prediction} · {snapshot.bttsProbDisplay}</p>
+          <p>Over 2,5 : Oui · {snapshot.over25ProbDisplay}</p>
+          <p>
+            Qualité des données : {snapshot.dataQuality} · {snapshot.matchCountHome} matchs
+            analysés par équipe · xG : {snapshot.xgHome} – {snapshot.xgAway}
+          </p>
+          <p>{snapshot.analysis}</p>
+        </section>
+        <section aria-labelledby="verification-title">
+          <h2 id="verification-title">Résultat vérifié</h2>
+          <p>
+            Score final : {verification.result.display} · Pronostic BTTS :
+            {snapshot.status === 'WON' ? ' gagné' : ' statut à vérifier'}.
+          </p>
+          <p>
+            Source : {verification.source} · Vérifié le {verification.verifiedAt}.
+          </p>
+          <p><a href={verification.sourceUrl}>Consulter la fiche ESPN du match</a></p>
+        </section>
+      </article>
+    </main>
+  )
+}
diff --git a/tests/retained-match-page.test.ts b/tests/retained-match-page.test.ts
new file mode 100644
--- /dev/null
+++ b/tests/retained-match-page.test.ts
@@ -0,0 +1,88 @@
+import { createHash } from 'node:crypto'
+import { existsSync, readFileSync } from 'node:fs'
+import { resolve } from 'node:path'
+import { describe, expect, it } from 'vitest'
+import verificationData from '@/data/match-verification-registry.json'
+import retainedMatch from '@/data/retained-match-pages/west-ham-united-vs-queens-park-rangers-2026-10-09.json'
+import {
+  getDynamicMatchSlugs,
+  getLocalizedMatchStaticParams,
+  RETAINED_FR_ONLY_MATCH_SLUG,
+} from '@/lib/match-page-ssg'
+import { MatchVerificationRegistrySchema } from '@/lib/match-verification-registry'
+import { getAllMatchSlugs } from '@/lib/matches'
+
+const PROTECTED_ROUTE_SOURCE_HASHES = {
+  '/en/btts-and-over-2-5-predictions-today': ['src/app/[locale]/btts-and-over-2-5-predictions-today/page.tsx', '34c06e41ff61105945bcc4bfa708a86827000f8b595d484b856913d149b69689'],
+  '/en': ['src/app/[locale]/page.tsx', '20b38d4e5703745098eec123ae3dca778af7b29aa3f495e824df2e91ae6b013b'],
+  '/en/over-2-5/predictions/today': ['src/app/[locale]/over-2-5/predictions/today/page.tsx', '86577a56d83d53b7cf5a2cabca75a1fed756c814ee1fc1866914c263a9324be0'],
+  '/': ['src/app/page.tsx', '912e5fa124c67baa41c40f3eb32a7d95d009b2dbc99cceee6ac9f0c5d169254d'],
+  '/en/ai-correct-score-predictions': ['src/app/[locale]/ai-correct-score-predictions/page.tsx', '5f356fa7b3be84c98a58aa007d49d139ac0136a5369e1cd9b38163f3ab758c64'],
+} as const
+
+const sha256 = (value: string) => createHash('sha256').update(value).digest('hex')
+const sourceSlugs = getAllMatchSlugs()
+const dynamicSlugs = getDynamicMatchSlugs(sourceSlugs)
+
+describe('retained West Ham–QPR page', () => {
+  it('keeps each existing dynamic slug once and excludes the dedicated slug', () => {
+    expect(new Set(sourceSlugs).size).toBe(sourceSlugs.length)
+    expect(dynamicSlugs).toEqual(sourceSlugs.filter(slug => slug !== RETAINED_FR_ONLY_MATCH_SLUG))
+    expect(dynamicSlugs).not.toContain(RETAINED_FR_ONLY_MATCH_SLUG)
+    expect(() => getDynamicMatchSlugs([...sourceSlugs, sourceSlugs[0]])).toThrow(/Duplicate match slug/)
+  })
+
+  it('generates exactly one FR URL for the retained slug and no EN/AR parameters', () => {
+    const dedicatedPath = `/match/${RETAINED_FR_ONLY_MATCH_SLUG}`
+    const frPaths = [...dynamicSlugs.map(slug => `/match/${slug}`), dedicatedPath]
+    expect(frPaths.filter(path => path === dedicatedPath)).toHaveLength(1)
+    const frGeneratorSource = readFileSync(resolve('src/app/match/[slug]/page.tsx'), 'utf8')
+    const localizedGeneratorSource = readFileSync(resolve('src/app/[locale]/match/[slug]/page.tsx'), 'utf8')
+    expect(frGeneratorSource).toContain('getDynamicMatchSlugs(getAllMatchSlugs())')
+    expect(localizedGeneratorSource).toContain('getLocalizedMatchStaticParams(getAllMatchSlugs(), SUPPORTED_LOCALES)')
+
+    const localized = getLocalizedMatchStaticParams(sourceSlugs, ['en', 'ar'])
+    expect(localized.some(param => param.slug === RETAINED_FR_ONLY_MATCH_SLUG)).toBe(false)
+    expect(new Set(localized.map(param => `${param.locale}:${param.slug}`)).size).toBe(localized.length)
+    expect(localized).toEqual(['en', 'ar'].flatMap(locale =>
+      dynamicSlugs.map(slug => ({ locale, slug })),
+    ))
+    expect(existsSync(resolve('src/app/match', RETAINED_FR_ONLY_MATCH_SLUG, 'page.tsx'))).toBe(true)
+  })
+
+  it('preserves the archived snapshot and the source-backed verified result', () => {
+    const registry = MatchVerificationRegistrySchema.parse(verificationData)
+    const record = registry.records.find(entry => entry.id === retainedMatch.slug)
+    expect(record).toMatchObject({
+      source: 'ESPN public',
+      sourceUrl: 'https://www.espn.com/soccer/match/_/gameId/401880233/queens-park-rangers-west-ham-united',
+      status: 'verified',
+      result: { homeGoals: 1, awayGoals: 1, display: '1-1' },
+      verifiedAt: '2026-10-23T05:42:15.167Z',
+      kickoff: { time: '20:00', timeZone: 'Europe/London' },
+      snapshot: { time: '19:00', timeZone: null },
+      display: { time: '19:00', timeZone: 'Africa/Dakar' },
+    })
+    expect(retainedMatch.sourceArchiveFiles).toHaveLength(6)
+    expect(retainedMatch.snapshotTimeZone).toBeNull()
+    expect(retainedMatch.record).toMatchObject({
+      dataQuality: 'HIGH', matchCountHome: 8, matchCountAway: 8,
+      finalScore: '1-1', status: 'WON', verifiedAt: '2026-10-23T05:42:15.167Z',
+    })
+    const dedicatedPageSource = readFileSync(
+      resolve('src/app/match', RETAINED_FR_ONLY_MATCH_SLUG, 'page.tsx'),
+      'utf8',
+    )
+    expect(dedicatedPageSource).toContain('MatchVerificationRegistrySchema.parse(verificationData)')
+    expect(dedicatedPageSource).toContain('{verification.result.display}')
+    expect(dedicatedPageSource).toContain('{verification.source}')
+    expect(dedicatedPageSource).toContain('{verification.sourceUrl}')
+    expect(dedicatedPageSource).not.toContain('{snapshot.finalScore}')
+  })
+})
+
+describe('five protected SEO routes', () => {
+  it.each(Object.entries(PROTECTED_ROUTE_SOURCE_HASHES))('does not regress %s', (_route, [file, expected]) => {
+    expect(sha256(readFileSync(resolve(file), 'utf8'))).toBe(expected)
+  })
+})
```

### Alternatives robots — choisir exactement une

Dans `metadata` de la nouvelle page littérale, ajouter **une seule** des variantes suivantes. L’autre variante doit être absente du patch final. La configuration commune propose un canonical propre à la nouvelle URL, sans toucher au sitemap ni aux canonicals des routes existantes.

**Option A — indexable**

```ts
robots: {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
},
```

La page serait indexable, mais resterait hors sitemap tant qu’une éventuelle modification du sitemap n’a pas reçu une validation distincte. Aucun sitemap n’est proposé ici.

**Option B — `noindex, follow`**

```ts
robots: {
  index: false,
  follow: true,
  googleBot: {
    index: false,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
},
```

La page resterait accessible en 200, ne serait pas indexable et resterait hors sitemap. Aucune règle `robots.txt` ne serait ajoutée.

## Vérifications complémentaires — analyse en lecture seule

- **Collision de route :** un mini-projet temporaire, hors du dépôt, a été construit avec Next.js 16.1.3 en mode export statique (`--webpack`). Le manifeste distingue `/match/[slug]` (avec `/match/existing-match`) et la route littérale `/match/west-ham-united-vs-queens-park-rangers-2026-10-09`; compilation et génération des pages du mini-projet réussies (5/5). Cela confirme qu’une route littérale et `[slug]` peuvent coexister dans cette forme. Ce n’est pas un build du patch complet : le conflit d’autres segments/layouts propres à l’application reste à vérifier après validation. Une première tentative temporaire a échoué avant compilation car Turbopack refusait un lien `node_modules` sortant de `/tmp`; le déplacement du bac à sable sous `/workspace` a résolu cette contrainte. Le dossier temporaire a été supprimé.
- **Exclusion EN/AR et autres matchs :** `getAllMatchSlugs()` retourne les clés d’une `Map`, donc les slugs produits par ce chargeur sont uniques. Le helper proposé ne retire qu’une chaîne exacte — le slug conservé — et garde l’ordre de tous les autres. La fonction localisée produit le produit cartésien actuel des locales non-FR et des slugs restants. Le test proposé compare ce résultat à la liste attendue et vérifie l’intégration des deux générateurs. L’inspection des 14 fichiers actuellement lus (21 octobre–3 novembre) ne trouve aucun enregistrement du candidat.
- **Provenance :** la page proposée importe séparément le snapshot conservé et le registre parsé; le score rendu vient de `verification.result.display`, tandis que source, URL et date viennent du même `verification`. Le texte historique/prédictif vient du fichier de rétention. Une assertion source est ajoutée au test proposé pour empêcher l’usage accidentel de `snapshot.finalScore` comme score vérifié.
- **Rétention :** le nouveau chemin `src/data/retained-match-pages/...json` est hors du répertoire lu par `loadAllMatches()` et hors de `public/predictions-archive/`. `scripts/prune-archives.mjs` ne supprime que les anciens fichiers JSON datés dans `public/predictions-archive/` (il garde 90 fichiers). La page littérale proposée importe le fichier dédié; elle ne dépend donc ni de cette purge ni de `slice(-14)`.
- **Pages protégées :** les cinq empreintes recalculées correspondent aux valeurs consignées dans le test proposé; aucun fichier applicatif n’est modifié. Le test existant `npm test -- tests/seo-preservation.test.ts` a été exécuté : **8 tests réussis** (incluant les empreintes de sitemap/robots et métadonnées protégées déjà en place). Les nouveaux tests restent non exécutés, car ils ne sont présents que dans le diff documentaire.

## Tests à exécuter seulement après validation

Le fichier de test proposé couvre :

- unicité des slugs SSG et échec explicite en cas de doublon d’entrée;
- exactement une route FR pour le slug retenu, zéro paramètre localisé EN/AR;
- conservation à l’identique de la génération de chaque autre slug courant;
- conservation de la copie historique, du résultat, de la source et de l’horodatage vérifié;
- distinction explicite entre `kickoff.timeZone`, `snapshot.timeZone` et `display.timeZone`, avec le fuseau du snapshot nul/inconnu;
- empreintes de référence des cinq fichiers source des pages SEO protégées. Le test existant `tests/seo-preservation.test.ts` doit également rester inchangé et passer, notamment son contrôle de sitemap et de métadonnées existantes.

Après approbation, dans un checkout jetable, faire `npm test -- tests/retained-match-page.test.ts tests/seo-preservation.test.ts`, puis `npx tsc --noEmit`, et un `npm run build` uniquement si son effet sur `public/` et `out/` est isolé et autorisé. Inspecter l’export pour confirmer le seul fichier HTML retenu, le statut/metadata attendus, l’absence des variantes EN/AR et l’absence de collision entre la route littérale et `[slug]`. Ces commandes **n’ont pas été exécutées** dans cette mission.

## Décisions requises avant toute implémentation

1. Valider ou refuser la seule page FR `/match/west-ham-united-vs-queens-park-rangers-2026-10-09`.
2. Choisir A (indexable) **ou** B (`noindex, follow`), sans valeur par défaut.
3. Confirmer la conservation dédiée hors des archives glissantes et le schéma `kickoff` / `snapshot` / `display` du registre.
4. Approuver le test de gel des cinq pages SEO et l’exécution ultérieure des tests/build dans un environnement isolé.

Ce document est la seule proposition de code. Il ne constitue pas une implémentation. Les modifications des quatre rapports documentent ce statut sans modifier leurs sections antérieures; le rapport Phase 1 demeure intact.


## Addendum — décision et résultat de l’implémentation locale, 3 novembre 2026

L’autorisation a validé la route FR seulement, la conservation dédiée, le filtre du slug pour les générateurs FR/EN/AR, le canonical auto-référent uniquement sur la nouvelle page, `noindex, follow` et l’absence d’ajout au sitemap. Le code se trouve désormais dans les chemins listés dans `ETAT_PROJET.md` et le dernier addendum de `JOURNAL_PROJET.md`; les choix restés ouverts dans le texte original sont donc résolus pour cette seule page.

Le build Next.js complet et les vérifications locales ont réussi : 933 pages statiques générées; les tests totaux ont passé (30 fichiers, 211 tests), TypeScript et ESLint sans erreur. Dans l’export frais, le HTML français affichait le résultat 1–1, `ESPN public`, le lien de source ESPN, le canonical exact et `noindex, follow`; aucune route EN/AR ni entrée de sitemap pour le slug. Les empreintes des cinq pages SEO protégées ont passé leurs assertions. Les 93 JSON publics sont inchangés; les sorties `out/` et `.next/` préexistantes ont été restaurées après vérification. Aucun déploiement, commit ou push.

**Correction du diff de revue :** son en-tête de hunk de page annonçait 61 lignes alors que le contenu en comptait 71; l’application initiale a tronqué le JSX et les premiers tests/TypeScript l’ont détecté. Le fichier de page a été complété et le lookup du registre typé avant le succès final. Le diff original ci-dessus reste un artefact historique de revue, pas un patch à appliquer une seconde fois. Revue du diff et éventuelle autorisation de push encore attendues.
