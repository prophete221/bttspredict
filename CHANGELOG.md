# Changelog — BTTSPredict

Tous les changements notables du projet BTTSPredict sont documentés ici.
Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).

---

## [2026-08-08] — Refactor Plateforme Pro (16 phases)

### Résumé

Transformation complète de BTTSPredict en plateforme professionnelle, crédible, claire et rassurante. 16 phases exécutées, 6 fichiers de documentation produits, 86 tests automatisés passent.

### Phase 1 — Inspection du projet

- Création de `IMPLEMENTATION_PLAN.md` (plan d'exécution 16 phases, stack technique réelle, routes existantes, sources de données vérifiées par grep).

### Phase 2 — Architecture des routes

- **Supprimé :** `src/app/vip/redirect-client.tsx` (redirigeait vers `/#vip`).
- **Supprimé :** `src/app/pronostics/redirect-client.tsx` (redirigeait vers `/#free-predictions`).
- **Réécrit :** `src/app/vip/page.tsx` — page autonome avec 14 sections (intro, value prop, comparaison niveaux, avantages réels, sports couverts, nombre de pronos, durée, validation, lien historique, conditions, affiliation, FAQ, jeu responsable, CTA final).
- **Réécrit :** `src/app/pronostics/page.tsx` — page autonome avec `FreePredictions` + liens méthodologie/historique/VIP.
- **Créé :** `src/app/pronostics/aujourd-hui/page.tsx` — variante du jour.
- **Réécrit :** `src/app/historique/page.tsx` + `HistoriqueClient.tsx` — n'affiche que le nouveau suivi.
- **Créé :** `ROUTES_AUDIT.md` — audit complet des 39 routes + conformité BottomNavigation.

### Phase 3 — Nouveau système de suivi public

- **Créé :** `public/tracking-period.json` — date de lancement officielle (2026-08-08), modèle V3-Reliability, 8 variables, 4 filtres, 11 ligues HIGH_BTTS, disclaimer obligatoire.
- **Réécrit :** `scripts/update-win-history.mjs` V8 — sépare `newStats` (public, après 2026-08-08) et `legacyStats` (privé, avant 2026-08-08). Le `legacyStats` est conservé pour audit technique mais non affiché publiquement.
- **Modifié :** `public/win-history.json` — structure `{ generatedAt, trackingPeriod, stats (new), history (new), legacyStats (private) }`. Le disclaimer « Volume insuffisant » est affiché si `stats.total < 30`.

### Phase 4 — Page d'accueil simplifiée

- **Réordonné :** Page d'accueil en 8 blocs ordonnés : Value prop (Hero) → Pronostics du jour → Explication courte (HowItWorks) → Accès méthodologie → Accès historique → Bloc VIP court → Jeu responsable → Footer.
- **Supprimé :** `PromoVip`, `VipCardGrid`, `HowToGetVip`, `About` de l'accueil (déplacés vers `/vip`).
- **Ajouté :** Bloc VIP court avec un seul CTA « Découvrir le VIP » → `/vip` + lien secondaire « Voir l'historique vérifié » → `/historique`.
- **Ajouté :** Bloc jeu responsable 18+ sur l'accueil.

### Phase 5 — Page VIP autonome

- **Créé :** `src/app/vip/page.tsx` — 14 sections complètes (voir Phase 2).
- **Déplacé :** `VipCardGrid`, `PromoVip`, `VipSports`, `AviatorVip`, `HowToGetVip` de l'accueil vers `/vip`.
- **Ajouté :** Notice obligatoire avant chaque lien bookmaker : « Lien d'affiliation rémunéré. BTTSPredict ne prend pas de paris et ne collecte pas de fonds. »
- **Créé :** `VIP_PAGE_SPEC.md` — spécification complète de la page /vip (sections, CTA, conformité, tests d'acceptation).

### Phase 6 — BottomNavigation globale

- **Créé :** `src/components/bttsbet/BottomNavigation.tsx` — composant visible sur mobile + desktop, `z-50`, `aria-current="page"` via `usePathname()`, `env(safe-area-inset-bottom)`, 4 onglets (Accueil, Pronos, VIP, Historique).
- **Modifié :** `src/app/layout.tsx` — `BottomNavigation` et `CookieConsent` montés globalement (autour de `{children}`). Cache-buster bumped à `v81-platform-refactor-2026-08-08`.
- **Modifié :** `src/components/bttsbet/CookieConsent.tsx` — repositionné `bottom: calc(64px + env(safe-area-inset-bottom))` pour ne pas chevaucher la `BottomNavigation`.
- **Modifié :** `src/components/bttsbet/StickyCTABar.tsx` — repositionné `bottom: calc(64px + env(safe-area-inset-bottom))`, `z-40` (sous la BottomNavigation).

### Phase 7 — Page /pronostics autonome

- **Réécrit :** `src/app/pronostics/page.tsx` — page complète avec `FreePredictions` + filtres league/type/date + Poisson fallback + états LIVE/UPCOMING/FINISHED.
- **Créé :** `src/app/pronostics/aujourd-hui/page.tsx` — variante du jour.

### Phase 8 — Déduplication et source unique de vérité

- **Créé :** `src/lib/predictions.ts` — bibliothèque partagée avec 9 fonctions :
  - `predictionKey(p, modelVersion)` — clé stable `${matchId}-${market}-${modelVersion}`
  - `normalizeMarket(m)` — normalise BTTS/Over 2.5
  - `getProba(p)` — chaîne de fallback complète (jamais 0)
  - `getConfidence(p)` — jamais 0
  - `getDataQuality(p)` — niveaux 1-5
  - `getTier(p)` — GOLD/STANDARD avec seuils V3
  - `deduplicatePredictions(preds)` — déduplication par clé stable
  - `validatePrediction(p)` — validation champs requis + cohérence vérification
  - `filterByTrackingPeriod(preds, startDate)` — filtre par date de lancement
  - `countPredictions(preds)` — source unique pour tous les compteurs UI

### Phase 9 — Méthodologie réelle + transparence

- **Réécrit :** `src/app/methodologie/page.tsx` — 11 sections : données réelles (ESPN + TheSportsDB), 8 variables (pas 200+), modèle Poisson bivarié avec formules, marchés couverts, filtres de publication, ligues HIGH_BTTS, calibration, limites, gestion données manquantes, suivi nouveau modèle, probabilité ≠ garantie.
- **Créé :** `DATA_TRANSPARENCY.md` — rapport complet de transparence : sources utilisées vs NON utilisées (API-Football, Forebet, Windrawwin, Soccerbase), variables, formules, calibration, limites, gestion données manquantes, audit public, formulations interdites/autorisées.

### Phase 10 — Textes français cohérents

- **Modifié :** `src/components/bttsbet/Hero.tsx` — purge des anglicismes :
  - `Football Predictions Today` → `Pronostics BTTS et Over 2.5`
  - `BTTS, Over 2.5 & Correct Score AI` → `Modèle statistique Poisson V3`
  - `View Today's Predictions` → `Voir les pronostics du jour`
  - `View Verified Results` → `Voir l'historique vérifié`
  - Barre temps réel : « Dernier scan il y a 4h · 50 matchs analysés · 6 résultats vérifiés » → « Suivi public depuis le 2026-08-08 · 11 ligues HIGH_BTTS · Modèle V3-Reliability »

### Phase 11 — SEO

- **Corrigé :** Canonical `/faille-fifa` (était `/analyses-fifa` → 404).
- **Corrigé :** Canonical `/prediction-aviator` (était `/aviator-stats` → 404).
- **Corrigé :** Lien interne cassé `/aviator-stats` → `/prediction-aviator`.
- **Mis à jour :** `scripts/generate-sitemap.mjs` — 25 URLs (était 24). Ajouté `/pronostics`, `/pronostics/aujourd-hui`, `/vip`, `/methodologie`, `/resultats-verifies`. Priorités rebalancées (homepage 1.0, /pronostics 0.95, /historique 0.9).
- **Purgé :** Titres marketing « Faille FIFA / Signaux IA » du sitemap, remplacés par formulations factuelles.

### Phase 12 — Accessibilité

- **Ajouté :** `src/app/globals.css` — règle `@media (prefers-reduced-motion: reduce)` qui désactive animations et transitions.
- **Ajouté :** `src/app/globals.css` — règle `*:focus-visible` avec outline `#5146F5` (contraste AA).
- **Ajouté :** `src/app/globals.css` — classes `.status-won`, `.status-lost`, `.status-pending` avec préfixes textuels `✓`, `✗`, `⏳` (status pas uniquement par couleur).
- **Modifié :** `src/components/bttsbet/FreePredictions.tsx` — `TeamLogo` déjà avait un fallback initials ; ajouté `width`/`height` explicites + `decoding="async"` pour prévenir le CLS.
- **Modifié :** `src/components/bttsbet/FreePredictionsWidget.tsx` — `TeamLogoMini` avait `return null` si pas de logo → ajouté fallback avec initials + `aria-label` + `title`.

### Phase 13 — Cookies + jeu responsable

- **Modifié :** `src/components/bttsbet/CookieConsent.tsx` — monté globalement dans `layout.tsx` (au lieu de `/` uniquement). Repositionné `bottom: calc(64px + env(safe-area-inset-bottom))` pour ne pas chevaucher la `BottomNavigation`.
- **Vérifié :** Page `/jouer-responsable` accessible depuis le footer + la page `/vip` + la page d'accueil (bloc jeu responsable).

### Phase 14 — Performance

- **Modifié :** Toutes les `<img>` des logos équipes ont maintenant `width`/`height` explicites (prévient CLS).
- **Modifié :** `loading="lazy"` + `decoding="async"` sur les images non-critiques.
- **Vérifié :** Pas de scripts bloquants le rendu principal (le GA placeholder `G-XXXXXXXXXX` est asynchrone).

### Phase 15 — Tests automatisés

- **Installé :** `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`.
- **Créé :** `vitest.config.ts` — environnement jsdom, alias `@` → `./src`, include `tests/**/*.{test,spec}.{ts,tsx}`.
- **Créé :** `tests/predictions.test.ts` — 43 tests unitaires (suite `predictions.ts`).
- **Créé :** `tests/acceptance.test.ts` — 43 tests d'acceptation (suites Phase 2/3/4/5/6/8/9/10/11/12/13/14).
- **Ajouté :** Scripts npm `test`, `test:watch`, `test:ci` dans `package.json`.
- **Résultat :** 86/86 tests passent (1.73s).
- **Créé :** `TEST_REPORT.md` — rapport complet des commandes exécutées, tests réussis, erreurs corrigées.

### Phase 16 — Documentation finale

- **Créé :** `IMPLEMENTATION_PLAN.md` (Phase 1).
- **Créé :** `ROUTES_AUDIT.md` (Phase 2).
- **Créé :** `DATA_TRANSPARENCY.md` (Phase 9).
- **Créé :** `VIP_PAGE_SPEC.md` (Phase 5).
- **Créé :** `TEST_REPORT.md` (Phase 15).
- **Créé :** `CHANGELOG.md` (ce fichier, Phase 16).

---

## Critères d'acceptation finaux

| # | Critère | Statut |
|---|---------|--------|
| 1 | `/vip` est une vraie page autonome | ✅ |
| 2 | Page d'accueil contient un accès clair vers `/vip` | ✅ |
| 3 | Toutes les cartes VIP déplacées vers `/vip` | ✅ |
| 4 | Ancien historique négatif non affiché publiquement | ✅ |
| 5 | Nouveau suivi démarre avec date officielle claire | ✅ |
| 6 | Nouveau suivi ne mélange pas ancien/nouveau | ✅ |
| 7 | Historique public affiche uniquement résultats nouveau modèle | ✅ |
| 8 | Statistiques affichent volume réel | ✅ |
| 9 | Faible volume présenté comme insuffisant | ✅ |
| 10 | `/pronostics` ne redirige plus vers `/#free-predictions` | ✅ |
| 11 | BottomNavigation sur toutes les pages | ✅ |
| 12 | 4 onglets : Accueil, Pronos, VIP, Historique | ✅ |
| 13 | Onglet actif identifié | ✅ |
| 14 | Aucun contenu caché par BottomNavigation | ✅ |
| 15 | Compteurs cohérents sur toutes les pages | ✅ |

**Résultat : 15/15 critères validés.**

---

## Statistiques du refactor

- **Fichiers créés :** 14 (BottomNavigation.tsx, predictions.ts, 5 fichiers de doc, 3 pages/route clients, vitest.config.ts, 2 fichiers de tests)
- **Fichiers modifiés :** 12 (layout.tsx, page.tsx, vip/page.tsx, pronostics/page.tsx, historique/page.tsx, methodologie/page.tsx, Hero.tsx, CookieConsent.tsx, StickyCTABar.tsx, FreePredictions.tsx, FreePredictionsWidget.tsx, faille-fifa/page.tsx, prediction-aviator/page.tsx, package.json, globals.css, update-win-history.mjs, generate-sitemap.mjs, index.ts)
- **Fichiers supprimés :** 2 (vip/redirect-client.tsx, pronostics/redirect-client.tsx)
- **Lignes ajoutées :** ~3 500
- **Lignes supprimées :** ~600
- **Tests ajoutés :** 86 tests passants
- **Build :** 37 pages statiques générées avec succès
- **Commits :** 3 (phases 1-7, phases 8-11, phases 12-16)
