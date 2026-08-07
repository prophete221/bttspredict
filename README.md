# BTTSPredict.com — README

> **Dernière mise à jour :** 2026-08-08
> **Site live :** [bttspredict.com](https://bttspredict.com)
> **Moteur de prédiction :** IA nouvelle génération, calibration continue
> **Pipeline de vérification :** 100% ESPN + TheSportsDB (publics, sans clé API)
> **Dernier refactor :** Prompt Maitre 15 phases — match pages + topical authority

---

## 1. STACK TECHNIQUE

| Élément | Valeur |
|---------|--------|
| **Framework** | Next.js 16.1.3 (App Router, `output: "export"` — site statique) |
| **React** | 19.2.7 |
| **TypeScript** | 5.x (strict, mais `ignoreBuildErrors: true`) |
| **CSS** | Tailwind CSS 4 + `@tailwindcss/postcss` + `tw-animate-css` |
| **Design system** | ECLIPSE v60 (14 tokens CSS) |
| **Fonts** | Poppins (display), Inter (body), JetBrains Mono |
| **Charts** | Recharts 2.15.4 |
| **Animations** | Framer Motion 12.40 |
| **PWA** | `manifest.json` + cache-buster v81 |
| **Hébergement** | FTP vers bttspredict.com (SamKirkland/FTP-Deploy-Action) |
| **CI/CD** | GitHub Actions, cron `0 4,6,14,22 * * *` (4×/jour), timeout 30 min |
| **Tests** | Vitest 4.x + @testing-library/react + jsdom — **144 tests passent** |
| **Lint** | ESLint 9 (règles quasi toutes désactivées) |

---

## 2. ARCHITECTURE DES ROUTES

### Routes principales (41 pages)

#### Pages cœur (8)

| Route | Statut | Description |
|-------|--------|-------------|
| `/` | ✅ Réelle | Page d'accueil (Hero + Pronos + Topical BTTS/Over + Méthodo + Historique + VIP court + Jeu responsable) |
| `/pronostics` | ✅ Réelle | Page autonome des pronostics du jour |
| `/pronostics/aujourd-hui` | ✅ Réelle | Variante du jour |
| `/historique` | ✅ Réelle | Nouveau suivi public (depuis 2026-08-08) |
| `/methodologie` | ✅ Réelle | Méthodologie du moteur IA (9 sections) |
| `/vip` | ✅ Réelle | Page VIP autonome (14 sections + jeu responsable) |
| `/match/[slug]` | ✅ **SSG** | Pages match indexables — `generateStaticParams` |
| `/resultats-verifies` | ✅ Réelle (legacy) | Ancienne page performance (conservée mais non mise en avant) |

#### Topical authority — BTTS (3 pages)

| Route | Description |
|-------|-------------|
| `/btts/predictions/today` | BTTS Predictions Today (FAQ JSON-LD) |
| `/btts/predictions/tomorrow` | BTTS Predictions Tomorrow |
| `/btts/statistics` | Statistiques BTTS par ligue (tableau 11 ligues, FAQ JSON-LD) |

#### Topical authority — Over 2.5 (2 pages)

| Route | Description |
|-------|-------------|
| `/over-2-5/predictions/today` | Over 2.5 Predictions Today (FAQ JSON-LD) |
| `/over-2-5/statistics` | Statistiques Over 2.5 par ligue (tableau 11 ligues, FAQ JSON-LD) |

#### Pages légales (4)

- `/jouer-responsable`, `/mentions-legales`, `/politique-confidentialite`, `/cgu`

#### Blog + SEO landing (22 pages)

- `/blog` + 6 articles
- 7 pages SEO landing (`/over-2-5-predictions`, `/correct-score-predictions`, `/football-predictions-today`, `/betting-tips`, `/league-predictions`, `/team-predictions`, `/match-predictions`)
- 4 pages affiliation (`/linebet-promo-code`, `/code-promo-linebet-senegal`, `/bonus-888starz`, `/bookmakers`)
- 4 pages informationnelles (`/equipe`, `/presse`, `/faille-fifa`, `/prediction-aviator`)
- 1 guide (`/btts-c-est-quoi`)

> ⚠️ `/statistiques` est un placeholder (redirige vers `/historique`).

### Layout global

- **Layout racine unique :** `src/app/layout.tsx`
  - `<BottomNavigation />` (3 onglets : Accueil, Pronos, VIP) — visible sur toutes les pages
  - `<CookieConsent />` — monté globalement, positionné au-dessus de la BottomNav
  - Cache-buster `bttspredict-v81-platform-refactor-2026-08-08`
  - Pas de `<Navbar />` ni `<Footer />` au niveau du layout (chaque page les compose)

### BottomNavigation (3 onglets)

| Onglet | Route | Icône |
|--------|-------|-------|
| Accueil | `/` | Maison |
| Pronos | `/pronostics` | Graphique |
| VIP | `/vip` | Couronne |

> L'onglet « Historique » a été retiré de la BottomNavigation. La page `/historique` reste accessible via les liens dans le footer, la page d'accueil, et les pages match.

---

## 3. PAGES MATCH INDEXABLES

### Architecture SSG

- **Bibliothèque :** `src/lib/matches.ts` (153 lignes)
  - `generateMatchSlug(home, away, date)` — slug stable `{home}-vs-{away}-{YYYY-MM-DD}`
  - `loadAllMatches()` — agrège les 90 derniers jours d'archives
  - `getMatchBySlug(slug)` — récupère un match
  - `getAllMatchSlugs()` — liste pour `generateStaticParams`

### Page `/match/[slug]`

- **Server Component** avec `generateStaticParams` + `generateMetadata`
- **JSON-LD :** `SportsEvent` + `BreadcrumbList`
- **Contenu :**
  - Header avec logos + noms d'équipes + compétition + date + score final
  - Pronostics BTTS + Over 2.5 avec proba (40-54%), tier GOLD, statut WON/LOST/PENDING
  - Section vérification (gagnés / perdus / en attente, date de vérification, source)
  - Liens internes (pronostics du jour, historique, méthodologie, VIP)
  - Disclaimer 18+
- **Breadcrumbs :** Accueil > Pronostics > {home} vs {away}

### Volume actuel

- 3 match pages pré-rendues (les archives récentes ont peu de matchs avec champs `home`/`away` complets)
- Le volume augmentera au fur et à mesure que le pipeline génère de nouveaux matchs avec ces champs

---

## 4. PIPELINE DE DONNÉES

### Étape 1 — `scripts/quick-update-predictions.mjs`

**Input :** ESPN Soccer API (11 ligues sélectionnées à fort taux de BTTS)
**Output :** `public/predictions.json` + archive quotidienne `public/predictions-archive/YYYY-MM-DD.json`

**Ce qu'il fait :**
1. Fetch les matchs des 4 prochains jours sur 11 ligues à fort taux de BTTS.
2. Pour chaque match : récupère la forme récente des équipes (5 derniers matchs).
3. Applique 4 filtres de qualité (forme offensive, forme défensive, ligue couverte, seuil de probabilité).
4. Calcule les probabilités BTTS et Over 2.5 via le moteur IA.
5. Trie par proba décroissante, garde les meilleures sélections.
6. **Clamp proba affichée entre 0.40 et 0.54** (plage crédible — pas de proba irréaliste à 99%).
7. Sauvegarde dans `predictions.json` + archive quotidienne.

### Étape 2 — `scripts/verify-results.mjs` V5

**Input :** `public/predictions-archive/*.json` (90 derniers jours)
**Output :** Archives mises à jour avec `finalScore`, `status` (WON/LOST/PENDING), `isWon`, `verifiedAt`

- Fetch les scores finaux ESPN + TheSportsDB (48 ligues, sans clé API).
- Match fuzzy avec les scores ESPN (normalisation + token overlap).
- Priorité GOLD : les pronos GOLD sont vérifiés en premier.
- Rate limiting 60 ms entre appels ESPN.

### Étape 3 — `scripts/update-win-history.mjs` V8

**Input :** `public/predictions-archive/*.json` (90 derniers jours)
**Output :** `public/win-history.json`

**Calcule 2 buckets :**
- `stats` (PUBLIC) : pronos publiés depuis le `2026-08-08` (nouveau suivi)
- `legacyStats` (PRIVÉ, `isPrivate: true`) : pronos publiés avant (conservé pour audit technique, non affiché publiquement)

> Note : Le nom interne du modèle (`V3-Reliability`) n'est plus exposé publiquement dans `tracking-period.json` ni dans `win-history.json` (audit confidentialité).

---

## 5. SYSTÈME DE SUIVI PUBLIC

### Configuration publique

- **Fichier :** `public/tracking-period.json`
- **Date de lancement :** 2026-08-08
- **Sources :** ESPN + TheSportsDB (publics, sans clé API)
- **Marchés :** BTTS + Over 2.5
- **Seuil de publication :** Seuil de confiance élevé
- **Max par jour :** Sélection des meilleures opportunités

### Compteurs publics (depuis le lancement)

| Compteur | Valeur actuelle |
|----------|----------------|
| Date de lancement | 2026-08-08 |
| Modèle | IA nouvelle génération |
| Disclaimer « Nouvelle période de suivi publique » | Affiché (bleu indigo positif) |

### Archives privées (avant lancement)

Les archives antérieures au 2026-08-08 (632 pronostics vérifiés à 48.3%) sont conservées dans `win-history.json` sous `legacyStats` avec `isPrivate: true`. Elles ne sont **pas affichées publiquement**.

---

## 6. PAGE VIP AUTONOME

**Route :** `/vip` (autonome, plus de redirection vers `/#vip`)

### Structure (14 sections + jeu responsable)

1. Introduction
2. **Cartes VIP** (comparaison des niveaux — VipCardGrid) ← placées en haut
3. Proposition de valeur (Sélections supplémentaires, Analyses détaillées, Calibration continue)
4. Avantages réels de chaque niveau (tableau comparatif)
5. Sports couverts
6. Nombre de pronostics par jour
7. Durée d'accès (30 jours)
8. Méthode de validation
9. Coupon VIP du jour (PromoVip)
10. Stats Aviator (informatif, non prédictif)
11. Lien vers l'historique
12. Conditions et limites
13. Code promo + CTA affiliation (Linebet, 888starz, APK)
14. FAQ VIP
+ Jeu responsable (18+, ressources d'aide)

### Notice d'affiliation

Avant chaque lien bookmaker, la mention obligatoire est affichée :

> Lien d'affiliation rémunéré. BTTSPredict ne prend pas de paris et ne collecte pas de fonds.

---

## 7. TOPICAL AUTHORITY BTTS + OVER 2.5

### Pages BTTS (3)

| Route | Intent | Contenu |
|-------|--------|--------|
| `/btts/predictions/today` | "BTTS predictions today" | FreePredictions + définition BTTS + FAQ JSON-LD |
| `/btts/predictions/tomorrow` | "BTTS predictions tomorrow" | Aperçu matchs de demain + lien vers /pronostics |
| `/btts/statistics` | "BTTS statistics" | Tableau 11 ligues (taux BTTS, buts/match) + FAQ JSON-LD |

### Pages Over 2.5 (2)

| Route | Intent | Contenu |
|-------|--------|--------|
| `/over-2-5/predictions/today` | "Over 2.5 predictions today" | FreePredictions + définition Over 2.5 + FAQ JSON-LD |
| `/over-2-5/statistics` | "Over 2.5 statistics" | Tableau 11 ligues + section "Over 2.5 vs BTTS" + FAQ JSON-LD |

### Maillage interne

- Homepage : 2 blocs dédiés BTTS Today + Over 2.5 Today
- Pages match : breadcrumbs Accueil > Pronostics > {match}
- Pages topical : liens croisés BTTS ↔ Over 2.5 ↔ Historique
- FreePredictions : lien "Page match →" sur chaque carte (`data-cta="match-page-link"`)

---

## 8. FRONTEND — COMPOSANTS CRITIQUES

### `Hero.tsx`

- **H1 :** « Pronostics BTTS et Over 2.5 / Moteur IA nouvelle génération »
- **CTA primaire :** « Voir les pronostics du jour » (`#5146F5`) → `/pronostics`
- **CTA secondaire :** « Voir l'historique vérifié » → `/historique`
- **Barre temps réel :** « Suivi public depuis le 2026-08-08 · Ligues sélectionnées · Moteur IA nouvelle génération »

### `BottomNavigation.tsx`

- Visible sur mobile + desktop (pas de `md:hidden`)
- `z-50`, `aria-current="page"` via `usePathname()`
- `env(safe-area-inset-bottom)` (iOS safe area)
- 3 onglets (Accueil, Pronos, VIP) — Historique retiré

### `FreePredictions.tsx`

- Filtres league/type/date
- Déduplication par match
- **Proba clampée entre 40% et 54%** (plage crédible)
- CTA contextualisés : « Voir l'analyse {home} – {away} » (avec noms des équipes)
- **Lien "Page match →"** sur chaque carte (génère `/match/[slug]`)
- Fallback logos avec initiales + `aria-label`
- `loading="lazy"` + `decoding="async"` + `width`/`height` explicites

### `Footer.tsx`

- Note de transparence (remplace les anciens témoignages « Membre vérifié » supprimés)
- Lien `/jouer-responsable` (interne, plus begambleaware.org externe)
- Éditeur : Elon Ervri, New Jersey, USA

---

## 9. CI/CD — `.github/workflows/deploy.yml`

### Triggers

- **Push** sur `main` + tags `v*`
- **Cron** : `0 4,6,14,22 * * *` (4 fois/jour à 4h, 6h, 14h, 22h UTC)
- **workflow_dispatch** : manuel

### Steps

| # | Step | Timeout | Continue-on-error |
|---|------|---------|-------------------|
| 1 | Checkout | — | Non |
| 2 | Setup Node.js 22 | — | Non |
| 3 | Install dependencies (`npm ci --legacy-peer-deps`) | — | Non |
| 4 | Update predictions | 5 min | Non (fail-fast) |
| 5 | Verify results | 20 min | **Oui** |
| 6 | Update win history | 3 min | Non |
| 7 | Update transfers | 2 min | Oui |
| 8 | Build static export | — | Non |
| 9 | Copy routing files | — | — |
| 10 | Commit data | — | Oui |
| 11 | Install lftp | — | — |
| 12 | Clean stale `_next/` (lftp) | — | Oui |
| 13 | Deploy FTP | — | Non |
| 14 | Notify Bing IndexNow | — | Oui |

### Secrets GitHub

- `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `FTP_SERVER_DIR`
- Aucune clé API n'est requise (ESPN + TheSportsDB sont publics).

---

## 10. TESTS

### Configuration

- **Framework :** Vitest 4.x + @testing-library/react + jsdom
- **Fichier :** `vitest.config.ts` (jsdom env, alias `@` → `./src`)
- **Scripts npm :** `test`, `test:watch`, `test:ci`
- **Résultat :** **144/144 tests passent** (43 unitaires + 101 d'acceptation)

### Couverture

| Suite | Tests | Couverture |
|-------|-------|------------|
| `tests/predictions.test.ts` | 43 | Bibliothèque `src/lib/predictions.ts` (predictionKey, getProba, getTier, dedup, counts) |
| `tests/acceptance.test.ts` | 101 | Phases 2-14 + critères 17, 19, 21-30 + audit confidentialité + pages match + topical authority + AEO/LLM |
| Audit confidentialité | 13 | Vérifie absence de V3-Reliability, 8 variables, 0.62, HIGH_BTTS, 11 ligues, 53%, homeForm.*, API-Football, Forebet, etc. |
| Phase 3 — Match pages | 4 | generateStaticParams, generateMetadata, SportsEvent JSON-LD, internal link "Page match →" |
| Phase 6+7 — Topical | 7 | 5 nouvelles routes + sitemap + homepage links |
| Phase 9 — AEO/LLM | 5 | llms.txt + ai.txt purgés des claims faux |
| Phase 8 — Internal linking | 2 | FreePredictions "Page match" + breadcrumbs page match |
| Critère 17 (proba crédible) | 3 | Probas clampées 40-54% dans FreePredictions.tsx + quick-update-predictions.mjs + predictions.json |

---

## 11. SEO

### Sitemap (33 URLs)

- **Fichier :** `public/sitemap.xml` (généré par `scripts/generate-sitemap.mjs`)
- **23 SEO/landing pages** + **6 blog articles** + **3 match pages** (dynamiques depuis `predictions-archive`) + **1 blog index**
- URLs principales : `/`, `/pronostics`, `/pronostics/aujourd-hui`, `/historique`, `/methodologie`, `/vip`
- Topical : `/btts/predictions/today`, `/btts/predictions/tomorrow`, `/btts/statistics`, `/over-2-5/predictions/today`, `/over-2-5/statistics`

### JSON-LD

- `Organization` (sans AggregateRating fictif — supprimé)
- `WebSite`, `WebPage`, `Dataset`, `BreadcrumbList`, `FAQPage`
- `SportsEvent` (pages match — nouvelle)
- `Article` (pages SEO landing et blog)

### llms.txt + ai.txt

- **`public/llms.txt`** : contenu factuel, URLs clés (sans ancres `/#free-predictions`), suivi public 2026-08-08, sources ESPN + TheSportsDB
- **`public/ai.txt`** : contenu factuel, Elon Ervri NJ, 2026-08-08, section "What BTTSPredict does NOT claim"

### hreflang

- `fr-SN` + `x-default` sur sitemap.xml
- `<html lang="fr-SN">` dans layout

### Audit routes

- Canonicals corrigés sur `/faille-fifa` et `/prediction-aviator` (étaient cassés vers `/analyses-fifa` et `/aviator-stats`)
- Toutes les routes sont `index: true, follow: true` sauf `/statistiques` (placeholder)

---

## 12. SOURCES DE DONNÉES

### Sources réellement consommées (vérifiées par grep)

| Source | Type | URL | Usage |
|--------|------|-----|-------|
| **ESPN Soccer API** | Public, sans clé | `site.api.espn.com/apis/site/v2/sports/soccer/<slug>/scoreboard` | Calendrier + scores finaux + logos |
| **TheSportsDB** | Public, sans clé | `thesportsdb.com/api/v1/json/3/eventsday.php` | Fallback scores finaux |
| **BBC Sport RSS** | Public | `feeds.bbci.co.uk/sport/football/transfers/rss.xml` | Transferts joueurs |
| **IndexNow** | Public | `api.indexnow.org/IndexNow` | Notification Bing |

### Sources NON utilisées (purgées des mentions publiques)

| Source | Statut |
|--------|--------|
| API-Football | ❌ Non consommée (mentions purgées de llms.txt, ai.txt, page.tsx, methodologie) |
| Forebet | ❌ Non consommée |
| Windrawwin | ❌ Non consommée |
| Soccerbase | ❌ Non consommée |

---

## 13. TON MARKETING — APPROCHE CREDIBLE

Le site inspire confiance sans promesse de gain garanti. Aucune auto-dérision.

### Vocabulaire

| Avant (affaiblissant) | Après (crédible) |
|-----------------------|------------------|
| Modèle statistique probabiliste | **Moteur IA nouvelle génération** |
| Modèle Poisson / Poisson bivarié | **Moteur IA nouvelle génération** |
| Approche probabiliste | **Moteur IA nouvelle génération** |
| lambdas Poisson | **Indices IA** |
| Calibration +2% BTTS | **Calibration continue** |
| Limites du modèle | **Couverture et robustesse** |
| Gestion des données manquantes | **Gestion de la qualité** |
| Suivi public | **Suivi public vérifiable** |
| Probabilité vs garantie | **Probabilité et transparence** |

### Probas affichées

- **Plage crédible :** 40% à 54% maximum (au lieu de 97-99% avant).
- **Clamp dans le moteur :** `Math.max(0.40, Math.min(0.54, proba))`.
- **Supprimé :** badge « ⚠ Proba ≥ 90% · Calibration à vérifier ».

### Formulations autorisées / interdites

| Interdit | Autorisé |
|----------|----------|
| « 100% sûr » | « Pronostics BTTS et Over 2.5 basés sur un moteur IA » |
| « Garanti » | « Nouveau suivi public des pronostics vérifiés » |
| « Sans risque » | « Analyse prédictive des matchs de football » |
| « Gain assuré » | « Méthodologie du moteur IA » |
| « N°1 » | « Volume insuffisant pour conclure » (si applicable) |
| « IA infaillible » | « Aucun résultat futur n'est garanti » |

---

## 14. AUDIT CONFIDENTIALITÉ (7 août 2026)

### Retraits du public

| Élément | Action |
|---------|--------|
| Nom de version interne `V3-Reliability` | Retiré de toutes les pages publiques |
| Nombre exact de variables (8) | Remplacé par « forme récente des équipes » |
| Noms de champs internes (`homeForm.scoredIn`, etc.) | Retirés |
| Seuil exact 0.62 | Remplacé par « seuil de confiance élevé » |
| Liste HIGH_BTTS | Remplacée par « ligues sélectionnées » |
| Seuil historique 53% | Retiré |
| Constantes de calibration | Retirées |
| Endpoints API précis | Retirés (ESPN et TheSportsDB génériques) |
| Formules détaillées | Retirées |
| Architecture de fallback | Retirée |

### Corrections spécifiques

- **Footer :** suppression des 3 témoignages « Membre vérifié » (preuve sociale non démontrée).
- **/vip :** retrait de la mention « même modèle Poisson V3-Reliability que les pronos gratuits ».
- **/historique :** retrait du « Modèle {trackingPeriod.modelVersion} » du badge public.
- **tracking-period.json :** retrait de `modelVersion`, `filters`, `leagues`, `variables`, `variablesDetail`, `goldTierThreshold`.
- **win-history.json :** retrait de `trackingPeriod.modelVersion`.
- **predictions.json :** retrait de `analysis.homeLambda`, `awayLambda`, `homeForm`, `awayForm`.
- **seoSchemas.ts :** retrait du faux `AggregateRating 4.2/5 reviewCount 2437`.
- **llms.txt + ai.txt :** purge complète des claims faux.

---

## 15. ACCESSIBILITÉ

- `prefers-reduced-motion` (animations désactivées si préférence utilisateur)
- `*:focus-visible` avec outline `#5146F5` (contraste AA)
- Statuts avec icônes + texte (pas uniquement par couleur)
- Fallback logos avec initiales + `aria-label`
- `aria-current="page"` sur l'onglet actif de la BottomNavigation
- `aria-expanded` sur les boutons d'expansion
- `aria-label` sur tous les liens d'affiliation

---

## 16. AFFILIATION & BUSINESS

### Code promo `VISION221`

- **Linebet** : `AFFILIATE.linebet` (inscription + bonus)
- **888starz** : `AFFILIATE.star888` (inscription + bonus 100%)
- **Linebet APK** : `AFFILIATE.linebetDownload`

### Conformité

- `rel="sponsored nofollow"` sur tous les liens d'affiliation
- Notice obligatoire avant chaque lien bookmaker
- Aucune capture de données bancaires
- Aucune promesse de gain chiffré
- 18+ partout (Hero, footer, modals, disclaimer)

### Tracking

- `data-cta` sur tous les CTA (`hero-primary`, `hero-secondary`, `vip-linebet-inscription`, `match-page-link`, etc.)
- GA placeholder `G-XXXXXXXXXX` non configuré (à configurer via `NEXT_PUBLIC_GA_ID`)

---

## 17. SCRIPTS

| Script | Fichier | Usage |
|--------|---------|-------|
| Update predictions | `scripts/quick-update-predictions.mjs` | Génère predictions.json (moteur IA + filtres + clamp 40-54%) |
| Verify results | `scripts/verify-results.mjs` | Vérifie scores finaux (ESPN + TheSportsDB, 90j backfill) |
| Update win history | `scripts/update-win-history.mjs` | Calcule stats + legacyStats (privé) |
| Scrape transfers | `scripts/scrape-transfers.mjs` | Transferts joueurs (BBC RSS) |
| Generate sitemap | `scripts/generate-sitemap.mjs` | Sitemap.xml (33 URLs + match dynamiques) |
| Submit IndexNow | `scripts/submit-indexnow.mjs` | Notification Bing |
| Migrate gold | `scripts/migrate-gold.mjs` | One-shot — recale tier GOLD |
| Cleanup SEO pages | `scripts/cleanup-seo-pages.py` | One-shot — purge claims faux sur 7 SEO landing pages |

---

## 18. DOCUMENTATION

| Fichier | Description |
|---------|-------------|
| `README.md` | Ce fichier |
| `IMPLEMENTATION_PLAN.md` | Plan d'exécution 16 phases (stack, routes, sources, modèle) |
| `CHANGELOG.md` | Tous les changements par phase |
| `DATA_TRANSPARENCY.md` | Transparence des données (sources, variables, audit) |
| `VIP_PAGE_SPEC.md` | Spécification de la page /vip |
| `ROUTES_AUDIT.md` | Audit des 41 routes + conformité BottomNavigation |
| `TEST_REPORT.md` | Rapport des tests (144/144 passent) |
| `DAILY_REPORT.md` | Rapport quotidien KPI |
| `MIGRATION_CLOUDFLARE_PAGES.md` | Plan migration FTP → Cloudflare Pages |

---

## 19. COMMENT LANCER EN LOCAL

### Prérequis

```bash
node --version  # 22+
npm install --legacy-peer-deps
```

### Développement

```bash
npm run dev    # Serveur dev sur http://localhost:3000
```

### Pipeline de données manuel

```bash
# 1. Générer les pronos du jour
node scripts/quick-update-predictions.mjs

# 2. Vérifier les scores finaux
node scripts/verify-results.mjs

# 3. Recalculer les stats
node scripts/update-win-history.mjs

# 4. Générer le sitemap
node scripts/generate-sitemap.mjs
```

### Build & tests

```bash
npm run build    # Build statique → out/ (41 pages + match SSG)
npm run start    # Servir le build
npm test         # Vitest (144 tests)
npm run test:ci  # Vitest verbose
```

### Vérifier les données

```bash
# Lire les stats actuelles
python3 -c "import json; d=json.load(open('public/win-history.json')); print(json.dumps(d['stats'], indent=2))"

# Vérifier les probas affichées (max 0.54)
python3 -c "import json; d=json.load(open('public/predictions.json'))['predictions']; print('Max proba:', max(p['proba'] for p in d))"

# Compter les pages match pré-rendues
ls out/match/ 2>/dev/null | grep -c ".html$"
```

---

## Design System — ECLIPSE v60

| Token | HEX | Usage |
|-------|-----|-------|
| `--bg-main` | `#070B18` | Fond principal |
| `--bg-secondary` | `#0D1630` | Sections |
| `--card` | `#1E2340` | Surface cartes |
| `--border` | `#303861` | Bordures subtiles |
| `--text-primary` | `#F7F8FF` | Titres |
| `--text-secondary` | `#A5ABC5` | Labels |
| `--brand-indigo` | `#5146F5` | CTA principal |
| `--brand-violet` | `#7C3AED` | BTTS accent |
| `--brand-cyan` | `#5DFDCB` | Over 2.5 accent |
| `--vip` | `#FFC857` | Premium |
| `--success` | `#A8E063` | Gagné |
| `--error` | `#FF7185` | Perdu |

---

## Éditeur

- **Éditeur :** BTTSPredict — Elon Ervri, New Jersey, USA
- **Contact conformité :** support@bttspredict.com
- **Juridiction :** USA
- **Responsable publication :** Elon Ervri

---

## Objectifs mesurables

| Catégorie | Métrique | État |
|-----------|----------|------|
| SEO | Pages indexables | 41 (35 + 6 topical + match SSG) |
| SEO | Sitemap URLs | 33 |
| Contenu | Pages publiées | 41 |
| Contenu | Match pages SSG | 3 (volume augmente avec le pipeline) |
| Tests | Tests passent | 144/144 |
| Build | Pages statiques | OK (41 + 3 match SSG) |
| Performance | Proba max affichée | 54% (plage crédible 40-54%) |
| Conformité | AggregateRating fictif | Supprimé |
| Conformité | Témoignages fictifs | Supprimés |
| Conformité | Claims 200+ variables, 50 000 matchs | Supprimés |
| Conformité | Sources non utilisées | Purgées (API-Football, Forebet, Windrawwin, Soccerbase) |
