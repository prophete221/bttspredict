# BTTSPredict — Plan d'Implémentation

> **Date de création :** 2026-08-08
> **Mission :** Transformer BTTSPredict en une plateforme professionnelle, crédible, claire, rapide et rassurante.
> **Scope :** 16 phases, modifications dans ~30 fichiers, 6 fichiers de documentation à produire.

---

## 1. Stack Technique Réelle (vérifiée dans le code)

| Élément | Valeur |
|---------|--------|
| **Framework** | Next.js 16.1.3 (App Router, `output: "export"` — site statique) |
| **React** | 19.2.7 |
| **TypeScript** | 5.x (strict, mais `ignoreBuildErrors: true`) |
| **CSS** | Tailwind CSS 4 + `@tailwindcss/postcss` + `tw-animate-css` |
| **Design system** | ECLIPSE v60 (14 tokens CSS personnalisés) |
| **Fonts** | Poppins (display), Inter (body), JetBrains Mono |
| **Charts** | Recharts 2.15.4 |
| **Animations** | Framer Motion 12.40 |
| **PWA** | `manifest.json` + service worker (désactivé, cache-buster v80) |
| **Hébergement** | FTP vers bttspredict.com (SamKirkland/FTP-Deploy-Action) — migration Cloudflare Pages planifiée |
| **CI/CD** | GitHub Actions, cron `0 4,6,14,22 * * *` (4×/jour), timeout job 30 min |
| **Tests** | ❌ Aucun — ni `vitest`, ni `jest`, aucun fichier `*.test.ts` |
| **Env files** | ❌ Aucun `.env.example`, aucun `.env.local` |
| **Lint** | ESLint 9, mais presque toutes les règles désactivées |

## 2. Système de Routage

Next.js 16 App Router. Toutes les routes vivent dans `src/app/<route>/page.tsx`. Pas de layout imbriqué — chaque page compose elle-même son `Navbar` et son `Footer` (donc la navigation basse doit être placée dans le `RootLayout` pour apparaître sur toutes les pages).

### Routes Existantes (39 routes)

| Catégorie | Routes |
|-----------|--------|
| **Accueil** | `/` |
| **Pronostics** | `/pronostics` ⚠️ (redirige vers `/#free-predictions`), `/over-2-5-predictions`, `/correct-score-predictions`, `/football-predictions-today`, `/betting-tips`, `/league-predictions`, `/team-predictions`, `/match-predictions` |
| **Historique** | `/historique` ⚠️ (placeholder), `/statistiques` ⚠️ (placeholder), `/resultats-verifies` ✅ (seule page réelle) |
| **Méthodologie** | `/methodologie` |
| **VIP** | `/vip` ⚠️ (redirige vers `/#vip`) |
| **Légal** | `/cgu`, `/mentions-legales`, `/politique-confidentialite`, `/jouer-responsable` |
| **Blog** | `/blog` + 6 articles |
| **Affiliation** | `/linebet-promo-code`, `/code-promo-linebet-senegal`, `/bonus-888starz`, `/bookmakers` |
| **Divers** | `/equipe`, `/presse`, `/btts-c-est-quoi`, `/faille-fifa`, `/prediction-aviator` |

## 3. Layouts Globaux

- **Layout racine unique :** `src/app/layout.tsx` — fonts, metadata SEO, scripts cache-buster, GA placeholder.
- **Pas de `<Navbar />` ni `<Footer />` au niveau du layout racine** — chaque page les compose elle-même.
- **`MobileTabBar` n'est monté que sur `/`** (ligne 543 de `src/app/page.tsx`).
- **`CookieConsent` n'est monté que sur `/`** (ligne 549).

> **Action Phase 6 :** Déplacer `MobileTabBar` dans `layout.tsx` (ou créer un wrapper `AppShell`) pour qu'il apparaisse sur toutes les pages. Idem pour `CookieConsent`.

## 4. Composant Actuel de Navigation Basse

`src/components/bttsbet/MobileTabBar.tsx` — 4 onglets (Accueil, Pronos, VIP, Historique).

**Problèmes actuels :**
- `md:hidden` → invisible sur desktop (ciblage mobile uniquement).
- Monté uniquement sur `/`.
- Les actions « Pronos » et « VIP » scrollent vers `#free-predictions` / `#vip` au lieu de naviguer vers `/pronostics` et `/vip`.
- `z-40` (peut être masqué par `StickyCTABar` qui est en `z-50`).

> **Action Phase 6 :** Renommer en `BottomNavigation`, le rendre global, visible sur toutes les tailles d'écran, `z-50`, avec `aria-current="page"` et `env(safe-area-inset-bottom)`.

## 5. Composants de Cartes de Pronostics

- **`FreePredictions.tsx`** (page d'accueil, ~650 lignes) — gros composant avec filtres league/type/date, deduplication par match, Poisson fallback, états LIVE/UPCOMING/FINISHED.
- **`FreePredictionsWidget.tsx`** (widget compact pour pages SEO) — 4 cartes swipeables, cercle SVG proba, `data-ai-answer` pour LLMs.

**Champs affichés par carte :** match, league, date/time, type (BTTS/Over 2.5), prediction (Oui/Non), proba, confidence, homeLogo, awayLogo, tier.

> **Action Phase 7 :** Créer `src/app/pronostics/page.tsx` autonome (pas de redirect) qui utilise `FreePredictions` + ajoute états loading/vide/erreur + déduplication stricte.

## 6. Composants et Sections VIP

Composants existants :
- `VipCardGlass.tsx` — 2 cartes rendues (VIP Essentiel + VIP Pro) via `VipCardGrid`. Variantes `silver`/`gold`/`elite` (mais `elite` non utilisé).
- `VipCardWidget.tsx` — bannière compacte.
- `VipUnlockModal.tsx` — modal débloquage (hash local, pas de serveur).
- `VipLevelModal.tsx` — 4 niveaux (Silver/Gold/Elite/All) mais `Elite` et `All` jamais déclenchés.
- `PromoVip.tsx` — coupon du jour avec matchs floutés.
- `VipSports.tsx` — sélecteur 6 sports avec accuracies hardcodées.
- `StickyVipBandeau.tsx` — importé mais pas rendu.
- `AviatorVip.tsx` — importé mais pas rendu.
- `StickyCTABar.tsx` — barre collante mobile après 60 % scroll.

> **Action Phase 5 :** Créer `/vip` autonome regroupant tous ces composants + supprimer `VipCardGrid` et `PromoVip` de l'accueil (ne garder qu'un seul bloc court avec CTA « Découvrir le VIP »).

## 7. Fichiers qui Gèrent les Statistiques

- **`scripts/update-win-history.mjs`** (V7) — calcule `public/win-history.json` depuis `predictions-archive/`.
- **`src/lib/seoSchemas.ts`** `buildDatasetJsonLd()` — lit `win-history.json` côté build.
- **`src/components/bttsbet/StatsDashboard.tsx`** — dashboard Recharts (non monté).
- **`src/components/bttsbet/WinHistory.tsx`** (V7) — non monté.
- **`src/app/resultats-verifies/ResultatsClient.tsx`** — seule page active consommant `win-history.json`.

> **Action Phase 3 :** Créer un fichier `public/tracking-period.json` qui définit la date de lancement officielle du nouveau suivi. Le filtre « nouveau suivi uniquement » s'appliquera dans `update-win-history.mjs` et dans la nouvelle page `/historique`.

## 8. Fichiers qui Gèrent l'Historique

- **Archives :** `public/predictions-archive/YYYY-MM-DD.json` (62 fichiers, 2 909 pronos).
- **Stats agrégées :** `public/win-history.json` (635 vérifiés, 48.5 %, Gold 40 %).
- **Pages :** `/historique` (placeholder), `/statistiques` (placeholder), `/resultats-verifies` (réelle).

> **Action Phase 3 :** Créer une nouvelle page `/historique` qui ne lit QUE les pronostics postérieurs à `tracking-period.startDate`. L'ancien `/resultats-verifies` reste accessible mais n'est pas mis en avant (sera déprécié une fois le nouveau suivi mature).

## 9. Sources de Données et Appels API

### Sources réellement consommées (vérifiées par grep)

| Source | Type | URL | Utilisée par |
|--------|------|-----|-------------|
| **ESPN Soccer API** | Public, sans clé | `site.api.espn.com/apis/site/v2/sports/soccer/<slug>/scoreboard?dates=<YYYYMMDD>` | `quick-update-predictions.mjs`, `verify-results.mjs`, `scraper.js` |
| **ESPN CDN (logos)** | Public | `a.espncdn.com/i/teamlogos/soccer/500/<teamId>.png` | `teamLogos.ts` |
| **TheSportsDB v3** | Public, sans clé | `thesportsdb.com/api/v1/json/3/eventsday.php?d=<ISO>&s=Soccer` | `verify-results.mjs` |
| **BBC Sport RSS** | Public | `feeds.bbci.co.uk/sport/football/transfers/rss.xml` | `scrape-transfers.mjs` |
| **IndexNow (Bing)** | Public | `api.indexnow.org/IndexNow` | `submit-indexnow.mjs` |
| **flagcdn** | Public | `flagcdn.com/w80/<code>.png` | `quick-fix-predictions.mjs` |

### Sources PRÉTENDUES mais NON consommées (à purger)

- **API-Football** — référencée dans `llms.txt` et commentaires, mais `API_FOOTBALL_KEY` n'est pas configurée. À supprimer de toutes les mentions publiques.
- **Forebet** — uniquement dans `scraper.js` (legacy, non appelé en production).
- **Windrawwin** — uniquement dans `scraper.js` (legacy).
- **Soccerbase** — uniquement dans `scraper.js` (legacy).

> **Action Phase 9 :** Purger toutes les mentions « API-Football », « Forebet », « Windrawwin », « Soccerbase » des fichiers publics (`llms.txt`, `ai.txt`, `methodologie/page.tsx`, `seoSchemas.ts`). Remplacer par « ESPN + TheSportsDB ».

## 10. Modèles ou Calculs Statistiques Réellement Exécutés

### Modèle Poisson Bivarié (`scripts/quick-update-predictions.mjs`)

```javascript
// 1. Forme récente des équipes (5 derniers matchs)
homeForm = { scoredIn, concededIn, avgScored, avgConceded }
awayForm = { scoredIn, concededIn, avgScored, avgConceded }

// 2. Lambdas Poisson (intensités attendues)
homeLambda = max(0.3, homeAttack × awayDefense × (leagueAvgHome / 1.3) × 1.15)
awayLambda = max(0.3, awayAttack × homeDefense × (leagueAvgAway / 1.1))

// 3. Probabilités Poisson exactes
bttsProb    = (1 - e^-homeLambda) × (1 - e^-awayLambda)
over25Prob  = 1 - Σ_{i+j ≤ 2} PoissonPMF(i, homeLambda) × PoissonPMF(j, awayLambda)
```

### Filtres de Publication V3 (4 filtres obligatoires)

1. `homeForm.scoredIn >= 3 && awayForm.scoredIn >= 3` (les 2 équipes marquent dans 3+/5 derniers matchs)
2. `homeForm.concededIn >= 3 && awayForm.concededIn >= 3` (les 2 équipes encaissent dans 3+/5 derniers matchs)
3. League ∈ HIGH_BTTS_LEAGUES (11 ligues)
4. `bttsProb >= 0.62` (seuil de publication)

### Variables Réellement Utilisées

- 4 variables de forme par équipe : `scoredIn`, `concededIn`, `avgScored`, `avgConceded`
- 4 variables de ligue : `bttsRate`, `avgGoals`, `homeFactor`, `awayFactor`
- **Total : 8 variables par match** (pas 200+, pas 50+)

> **Action Phase 9 :** Dans `methodologie/page.tsx`, remplacer « 200+ variables » par « jusqu'à 8 variables selon les données disponibles pour le match ».

### Seuils GOLD Tier

| Condition | Tier |
|-----------|------|
| `proba >= 0.75` | GOLD |
| `proba >= 0.70` + ligue HIGH_BTTS + BTTS Oui | GOLD |
| `proba >= 0.62` | STANDARD |
| `proba < 0.62` | NON PUBLIÉ |

## 11. Composants de Cookies

`src/components/bttsbet/CookieConsent.tsx` — 3 types (essential/analytics/advertising), 3 boutons (Personnaliser/Refuser/Accepter), stockage `localStorage['bttsbet_cookie_consent']`.

> **Action Phase 13 :** Le monter dans le `RootLayout` au lieu de `/` uniquement, et s'assurer qu'il ne chevauche pas la `BottomNavigation` (z-index + positionnement).

## 12. Fichiers SEO

- `public/llms.txt` — déclaration pour LLMs (à purger des sources non consommées).
- `public/ai.txt` — contexte ChatGPT/Perplexity (à purger aussi).
- `public/robots.txt` — Allow all + sitemap.
- `public/sitemap.xml` — généré par `generate-sitemap.mjs` (à mettre à jour avec `/pronostics`, `/vip`, `/historique` réelles).
- `public/_headers` — CSP, Cache-Control (Cloudflare).
- `public/_redirects` — redirects Cloudflare.
- `src/lib/seoSchemas.ts` — JSON-LD builders (Organization, Dataset, SportsEvent, ItemList, Breadcrumb, FAQ, Article).
- `src/lib/constants.ts` — `SITE`, `AFFILIATE`, `BOOKMAKERS`, `NAV_LINKS`, `HERO_STATS`, `FAQ_ITEMS`, `TESTIMONIALS`, `SOCIAL_PROOF`, `LEGAL`.
- `scripts/submit-indexnow.mjs` — ping Bing (28 URLs, manque `/resultats-verifies`).

> **Action Phase 11 :** Mettre à jour sitemap, IndexNow, llms.txt, ai.txt avec les nouvelles routes réelles. Purger les claims « N°1 », « 2 437 avis », « 13 000 parieurs ».

## 13. Scripts de Build, Lint et Test

| Script | Commande | Statut |
|--------|----------|--------|
| `dev` | `next dev -p 3000 \| tee dev.log` | ✅ OK |
| `build` | `next build` (NODE_OPTIONS=--max-old-space-size=4096) | ✅ OK |
| `start` | `npx serve out -l 3000` | ✅ OK |
| `lint` | `eslint .` | ⚠️ règles désactivées |
| `test` | ❌ absent | **À créer** |

> **Action Phase 15 :** Installer `vitest` + `@testing-library/react` + `jsdom`, créer `npm test`, écrire tests pour `/`, `/pronostics`, `/historique`, `/vip`, déduplication, cohérence compteurs, fallback logos, états loading/vide/erreur.

## 14. Variables d'Environnement Nécessaires

| Variable | Statut | Usage |
|----------|--------|-------|
| `FTP_SERVER` | ✅ GitHub Secret | Déploiement FTP |
| `FTP_USERNAME` | ✅ GitHub Secret | Déploiement FTP |
| `FTP_PASSWORD` | ✅ GitHub Secret | Déploiement FTP |
| `FTP_SERVER_DIR` | ✅ GitHub Secret | Répertoire serveur |
| `API_FOOTBALL_KEY` | ❌ Non configurée | À supprimer — ESPN + TheSportsDB suffisent |
| `NEXT_PUBLIC_GA_ID` | ❌ Placeholder `G-XXXXXXXXXX` | À configurer ou supprimer |

> **Action :** Créer `.env.example` documentant les 4 variables FTP + `NEXT_PUBLIC_GA_ID` optionnel.

---

## Plan d'Exécution (16 Phases)

### Phase 1 ✅ — Inspection + ce fichier (`IMPLEMENTATION_PLAN.md`)

### Phase 2 — Architecture des routes
- Supprimer `src/app/pronostics/redirect-client.tsx`, créer `src/app/pronostics/page.tsx` autonome.
- Supprimer `src/app/vip/redirect-client.tsx`, créer `src/app/vip/page.tsx` autonome.
- Créer `src/app/pronostics/aujourd-hui/page.tsx` (variante du jour).
- Réécrire `src/app/historique/page.tsx` (nouveau suivi uniquement).
- Créer `ROUTES_AUDIT.md`.

### Phase 3 — Nouveau système de suivi
- Créer `public/tracking-period.json` avec `startDate: 2026-08-08`, `modelVersion: 'V3-Reliability'`.
- Modifier `update-win-history.mjs` pour calculer 2 buckets : `legacyStats` (avant startDate) et `newStats` (après).
- Réécrire `win-history.json` avec structure `trackingPeriod`, `newStats`, `legacyStats` (privé).
- Réécrire `/historique` pour n'afficher QUE `newStats`.

### Phase 4 — Page d'accueil simplifiée
- Réordonner les 8 blocs : Value prop → Pronos du jour → Explication analyse → Méthodo → Historique → Bloc VIP court → Jeu responsable → Footer.
- Supprimer `PromoVip`, `VipCardGrid`, `HowToGetVip` de l'accueil (déplacés vers `/vip`).
- Remplacer par un seul bloc VIP court avec CTA « Découvrir le VIP » → `/vip`.
- Remplacer les grands % par : Pronostics publiés, Matchs vérifiés, Résultats en attente, Date de lancement, Dernière mise à jour, Version du modèle.

### Phase 5 — Page `/vip` autonome
- Créer `src/app/vip/page.tsx` (client) avec 14 sections (intro, value prop, comparaison niveaux, avantages réels, sports couverts, nombre de pronos, durée, validation, lien historique, conditions, affiliation, FAQ, jeu responsable, CTA final).
- Déplacer `VipCardGrid`, `PromoVip`, `VipSports`, `AviatorVip`, `HowToGetVip`, `VipLevelModal` vers `/vip`.
- Ajouter mention « Lien d'affiliation rémunéré. BTTSPredict ne prend pas de paris et ne collecte pas de fonds. » avant chaque lien bookmaker.
- Créer `VIP_PAGE_SPEC.md`.

### Phase 6 — `BottomNavigation` globale
- Créer `src/components/bttsbet/BottomNavigation.tsx` (visible desktop+mobile, `z-50`, `aria-current="page"`, `env(safe-area-inset-bottom)`).
- Déplacer dans `src/app/layout.tsx` (autour de `{children}`).
- Ajouter `padding-bottom: env(safe-area-inset-bottom) + 72px` sur `<main>` global.
- 4 onglets : Accueil → `/`, Pronos → `/pronostics`, VIP → `/vip`, Historique → `/historique`.
- Supprimer `MobileTabBar.tsx` (ou le garder en legacy mais non importé).

### Phase 7 — Page `/pronostics` autonome
- Page complète avec filtres (league, type, date), cartes, états (loading, vide, erreur, données anciennes, match annulé, match en attente).
- Libellés contextuels : « Voir l'analyse SC Cambuur – Excelsior », « Comprendre cette probabilité ».
- Indicateur de calibration si proba > 90 %.
- Pas de « sûr », « certain », « garanti ».

### Phase 8 — Déduplication + source unique
- Clé stable : `${matchId}-${market}-${modelVersion}`.
- Fonction `deduplicatePredictions()` partagée dans `src/lib/predictions.ts`.
- Tous les compteurs viennent de `win-history.json` (et non hardcodés).
- Tests Vitest pour vérifier la cohérence.

### Phase 9 — Méthodologie réelle
- Réécrire `src/app/methodologie/page.tsx` avec sources réelles (ESPN + TheSportsDB), 8 variables (pas 200+), modèle Poisson bivarié, 4 filtres, gestion données manquantes, limites du modèle.
- Créer `DATA_TRANSPARENCY.md`.

### Phase 10 — Textes français cohérents
- Purger Anglicismes : « Football Predictions Today », « Betting Tips », « View Verified Results », « View Today's Predictions », « Explore verified results ».
- Remplacer par : « Pronostics du jour », « Conseils de paris », « Voir l'historique vérifié », « Voir les pronostics du jour ».
- Corriger les phrases dupliquées (« taux réel vérifiable vérifiée »).

### Phase 11 — SEO
- 1 H1 par page, title unique, canonical correct, Open Graph cohérent.
- Purger claims « N°1 », « 2 437 avis », « 13 000 parieurs ».
- Mettre à jour sitemap + IndexNow avec nouvelles routes.
- Créer `src/lib/seo.ts` centralisant les metadatas.

### Phase 12 — Accessibilité
- Focus visible partout, contrastes AA, `prefers-reduced-motion`.
- Fallback logos : initiales + nom équipe si image externe ne charge pas.
- Statuts pas uniquement par couleur (texte + icône).
- Test 320 / 375 / 390 / 768 / 1024 / desktop large.

### Phase 13 — Cookies + jeu responsable
- `CookieConsent` dans le `RootLayout` (toutes les pages).
- Z-index < BottomNavigation.
- Page `/jouer-responsable` accessible depuis BottomNav (menu PLUS) + footer + VIP + blocs affiliation.

### Phase 14 — Performance
- Lazy-load images non critiques (`loading="lazy"`).
- `width`/`height` sur toutes les images (CLS).
- Fallback logos.
- Pas de scripts bloquants.

### Phase 15 — Tests
- Installer `vitest`, `@testing-library/react`, `jsdom`.
- Créer `npm test` + `npm run test:ci`.
- Tests : rendu routes, présence BottomNav, onglet actif, accès directs, déduplication, cohérence compteurs, fallback logos, états, accessibilité clavier, métadatas SEO, responsive, build prod, lint.
- Créer `TEST_REPORT.md`.

### Phase 16 — Documentation finale
- `CHANGELOG.md` — tous les changements.
- `IMPLEMENTATION_PLAN.md` ✅ (ce fichier).
- `DATA_TRANSPARENCY.md`.
- `VIP_PAGE_SPEC.md`.
- `ROUTES_AUDIT.md`.
- `TEST_REPORT.md`.

---

## Critères d'Acceptation (vérification finale)

| # | Critère | Vérification |
|---|---------|--------------|
| 1 | `/vip` est une vraie page autonome | `curl /vip` retourne HTML, pas une redirection |
| 2 | Accueil contient un accès clair vers `/vip` | bloc « Découvrir le VIP » visible |
| 3 | Toutes les cartes VIP déplacées vers `/vip` | `grep VipCard src/app/page.tsx` retourne 0 |
| 4 | Ancien historique négatif non affiché publiquement | `/historique` ne montre que `newStats` |
| 5 | Nouveau suivi démarre avec date officielle claire | `tracking-period.json` lisible |
| 6 | Nouveau suivi ne mélange pas ancien/nouveau | `update-win-history.mjs` filtre par `startDate` |
| 7 | Historique public affiche uniquement résultats nouveau modèle | page `/historique` lit `newStats` uniquement |
| 8 | Statistiques affichent volume réel | pas de « 100+ bientôt » |
| 9 | Faible volume présenté comme insuffisant | texte « volume insuffisant » si < 30 vérifiés |
| 10 | `/pronostics` ne redirige plus | `curl /pronostics` retourne HTML |
| 11 | BottomNavigation sur toutes les pages | `grep BottomNavigation` dans `layout.tsx` |
| 12 | 4 onglets : Accueil, Pronos, VIP, Historique | vérification composant |
| 13 | Onglet actif identifié | `aria-current="page"` |
| 14 | Aucun contenu caché par BottomNav | `padding-bottom` global |
| 15 | Compteurs cohérents sur toutes les pages | tests automatisés |

---

## Note sur l'Intégrité

Ce plan ne revendique aucune fonctionnalité, source de données, variable, validation humaine ou modèle qui n'existe pas réellement dans le code. Toutes les sources listées (ESPN, TheSportsDB) ont été vérifiées par inspection du code. Les sources « prétendues mais non consommées » (API-Football, Forebet, Windrawwin, Soccerbase) seront purgées dans la Phase 9.
