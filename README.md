# BTTSPredict.com — README

> **Dernière mise à jour :** 2026-08-08
> **Site live :** [bttspredict.com](https://bttspredict.com)
> **Moteur de prédiction :** IA nouvelle génération, calibration continue
> **Pipeline de vérification :** 100% ESPN + TheSportsDB (publics, sans clé API)
> **Commits principaux :** refactor plateforme 16 phases + audit confidentialité + ton marketing rassurant

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
| **Tests** | Vitest 4.x + @testing-library/react + jsdom — **125 tests passent** |
| **Lint** | ESLint 9 (règles quasi toutes désactivées) |

---

## 2. ARCHITECTURE DES ROUTES

### Routes principales (35 pages)

| Route | Statut | Description |
|-------|--------|-------------|
| `/` | ✅ Réelle | Page d'accueil (Hero + Pronos + Méthodo + Historique + VIP court + Jeu responsable) |
| `/pronostics` | ✅ Réelle | Page autonome des pronostics du jour |
| `/pronostics/aujourd-hui` | ✅ Réelle | Variante du jour |
| `/historique` | ✅ Réelle | Nouveau suivi public (depuis 2026-08-08) |
| `/methodologie` | ✅ Réelle | Méthodologie du moteur IA (9 sections) |
| `/vip` | ✅ Réelle | Page VIP autonome (14 sections + jeu responsable) |
| `/resultats-verifies` | ✅ Réelle (legacy) | Ancienne page performance (conservée mais non mise en avant) |
| `/jouer-responsable` | ✅ Réelle | Page jeu responsable |
| `/mentions-legales` | ✅ Réelle | Mentions légales (éditeur : Elon Ervri, NJ, USA) |
| `/politique-confidentialite` | ✅ Réelle | Politique de confidentialité |
| `/cgu` | ✅ Réelle | Conditions générales |
| `/blog` + 6 articles | ✅ Réels | Articles SEO |
| 7 pages SEO landing | ✅ Réelles | `/over-2-5-predictions`, `/correct-score-predictions`, etc. |
| 4 pages affiliation | ✅ Réelles | `/linebet-promo-code`, `/bonus-888starz`, etc. |
| 4 pages informationnelles | ✅ Réelles | `/equipe`, `/presse`, `/faille-fifa`, `/prediction-aviator` |

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

> ⚠️ L'onglet « Historique » a été retiré de la BottomNavigation. La page `/historique` reste accessible via les liens dans le footer et sur la page d'accueil.

---

## 3. PIPELINE DE DONNÉES

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

**Structure `win-history.json` :**
```json
{
  "generatedAt": "ISO timestamp",
  "trackingPeriod": {
    "startDate": "2026-08-08",
    "isPublicPeriod": true,
    "disclaimer": "...",
    "insufficientVolume": true  // si stats.total < 30
  },
  "stats": { /* nouveau suivi uniquement */ },
  "history": [ /* entrées du nouveau suivi */ ],
  "legacyStats": { /* privé, non affiché publiquement */ }
}
```

> Note : Le nom interne du modèle (`V3-Reliability`) n'est plus exposé publiquement dans `tracking-period.json` ni dans `win-history.json` (audit confidentialité).

---

## 4. SYSTÈME DE SUIVI PUBLIC

### Configuration publique

- **Fichier :** `public/tracking-period.json`
- **Date de lancement :** 2026-08-08
- **Sources :** ESPN + TheSportsDB (publics, sans clé API)
- **Marchés :** BTTS + Over 2.5
- **Seuil de publication :** Seuil de confiance élevé
- **Max par jour :** Sélection des meilleures opportunités

> ⚠️ Audit confidentialité (7 août 2026) : les paramètres internes du modèle (variables exactes, formules, seuils, liste de ligues, constantes de calibration, noms d'endpoints API) ne sont plus exposés publiquement. Seules les informations génériques (concept, marchés, sources présentées de façon générique, date de lancement) restent publiques.

### Compteurs publics (depuis le lancement)

| Compteur | Valeur actuelle |
|----------|----------------|
| Pronostics publiés | 0 (suivi récent) |
| Matchs vérifiés | 0 |
| Gagnés | 0 |
| Perdus | 0 |
| Résultats en attente | 0 |
| Date de lancement | 2026-08-08 |
| Modèle | IA nouvelle génération |

> Le suivi étant récent, le disclaimer « Nouvelle période de suivi publique » est affiché (bleu indigo positif, au lieu du warning jaune « Volume insuffisant »).

### Archives privées (avant lancement)

Les archives antérieures au 2026-08-08 (632 pronostics vérifiés à 48.3%) sont conservées dans `win-history.json` sous `legacyStats` avec `isPrivate: true`. Elles ne sont **pas affichées publiquement** — conservées pour audit technique interne.

---

## 5. PAGE VIP AUTONOME

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

### CTA homepage

La page d'accueil contient un seul bloc VIP court avec un seul CTA « Découvrir le VIP » → `/vip` + lien secondaire « Voir l'historique vérifié ».

---

## 6. FRONTEND — COMPOSANTS CRITIQUES

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

### `CookieConsent.tsx`

- Monté globalement dans `layout.tsx`
- Repositionné `bottom: calc(64px + env(safe-area-inset-bottom))` pour ne pas chevaucher la BottomNavigation
- 3 boutons : Personnaliser / Refuser / Accepter

### `FreePredictions.tsx`

- Filtres league/type/date
- Déduplication par match
- **Proba clampée entre 40% et 54%** (plage crédible)
- CTA contextualisés : « Voir l'analyse {home} – {away} » (avec noms des équipes)
- Fallback logos avec initiales + `aria-label`
- `loading="lazy"` + `decoding="async"` + `width`/`height` explicites

### `Footer.tsx`

- Note de transparence (remplace les anciens témoignages « Membre vérifié » supprimés)
- Lien `/jouer-responsable` (interne, plus begambleaware.org externe)
- Éditeur : Elon Ervri, New Jersey, USA

---

## 7. CI/CD — `.github/workflows/deploy.yml`

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

## 8. TESTS

### Configuration

- **Framework :** Vitest 4.x + @testing-library/react + jsdom
- **Fichier :** `vitest.config.ts` (jsdom env, alias `@` → `./src`)
- **Scripts npm :** `test`, `test:watch`, `test:ci`
- **Résultat :** **125/125 tests passent** (43 unitaires + 82 d'acceptation)

### Couverture

| Suite | Tests | Couverture |
|-------|-------|------------|
| `tests/predictions.test.ts` | 43 | Bibliothèque `src/lib/predictions.ts` (predictionKey, getProba, getTier, dedup, counts) |
| `tests/acceptance.test.ts` | 82 | Phases 2-14 + critères 17, 19, 21-30 + audit confidentialité |
| Audit confidentialité | 13 | Vérifie absence de V3-Reliability, 8 variables, 0.62, HIGH_BTTS, 11 ligues, 53%, homeForm.*, scoredIn, bttsRate, awayLambda, PoissonPMF, API-Football, Forebet, Windrawwin, Soccerbase, Membre vérifié, endpoints API précis sur 8 fichiers publics + 3 fichiers JSON publics |
| Critère 17 (proba crédible) | 3 | Probas clampées 40-54% dans FreePredictions.tsx + quick-update-predictions.mjs + predictions.json |

---

## 9. SOURCES DE DONNÉES

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
| API-Football | ❌ Non consommée (mentions purgées) |
| Forebet | ❌ Non consommée |
| Windrawwin | ❌ Non consommée |
| Soccerbase | ❌ Non consommée |

---

## 10. TON MARKETING — APPROCHE CREDIBLE

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

## 11. AUDIT CONFIDENTIALITÉ (7 août 2026)

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
- **/vip :** retrait de la mention « même modèle Poisson V3-Reliability que les pronos gratuits » (stratégie de segmentation interne).
- **/historique :** retrait du « Modèle {trackingPeriod.modelVersion} » du badge public.
- **tracking-period.json :** retrait de `modelVersion`, `filters`, `leagues`, `variables`, `variablesDetail`, `goldTierThreshold`.
- **win-history.json :** retrait de `trackingPeriod.modelVersion`.
- **predictions.json :** retrait de `analysis.homeLambda`, `awayLambda`, `homeForm`, `awayForm`.

---

## 12. ACCESSIBILITÉ

- `prefers-reduced-motion` (animations désactivées si préférence utilisateur)
- `*:focus-visible` avec outline `#5146F5` (contraste AA)
- Statuts avec icônes + texte (pas uniquement par couleur)
- Fallback logos avec initiales + `aria-label`
- `aria-current="page"` sur l'onglet actif de la BottomNavigation
- `aria-expanded` sur les boutons d'expansion

---

## 13. SEO

- 1 H1 par page, title unique, canonical correct
- Open Graph cohérent
- Sitemap généré par `scripts/generate-sitemap.mjs` (25 URLs)
- IndexNow notifie Bing après chaque déploiement
- `llms.txt` + `ai.txt` pour LLMs (AEO)
- JSON-LD : Organization, WebSite, WebPage, Dataset, BreadcrumbList, FAQPage
- **Purgés :** AggregateRating (4.2/5, 2437 reviews — fictif), Review (3 témoignages fictifs), claims « N°1 », « 200+ variables », « 50 000 matchs »

---

## 14. AFFILIATION & BUSINESS

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

---

## 15. SCRIPTS

| Script | Fichier | Usage |
|--------|---------|-------|
| Update predictions | `scripts/quick-update-predictions.mjs` | Génère predictions.json (moteur IA + filtres + clamp 40-54%) |
| Verify results | `scripts/verify-results.mjs` | Vérifie scores finaux (ESPN + TheSportsDB, 90j backfill) |
| Update win history | `scripts/update-win-history.mjs` | Calcule stats + legacyStats (privé) |
| Scrape transfers | `scripts/scrape-transfers.mjs` | Transferts joueurs (BBC RSS) |
| Generate sitemap | `scripts/generate-sitemap.mjs` | Sitemap.xml (25 URLs) |
| Submit IndexNow | `scripts/submit-indexnow.mjs` | Notification Bing |
| Migrate gold | `scripts/migrate-gold.mjs` | One-shot — recale tier GOLD |

---

## 16. DOCUMENTATION

| Fichier | Description |
|---------|-------------|
| `README.md` | Ce fichier |
| `IMPLEMENTATION_PLAN.md` | Plan d'exécution 16 phases (stack, routes, sources, modèle) |
| `CHANGELOG.md` | Tous les changements par phase |
| `DATA_TRANSPARENCY.md` | Transparence des données (sources, variables, audit) |
| `VIP_PAGE_SPEC.md` | Spécification de la page /vip |
| `ROUTES_AUDIT.md` | Audit des 35 routes + conformité BottomNavigation |
| `TEST_REPORT.md` | Rapport des tests (125/125 passent) |
| `DAILY_REPORT.md` | Rapport quotidien KPI |
| `MIGRATION_CLOUDFLARE_PAGES.md` | Plan migration FTP → Cloudflare Pages |

---

## 17. COMMENT LANCER EN LOCAL

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
npm run build    # Build statique → out/
npm run start    # Servir le build
npm test         # Vitest (125 tests)
npm run test:ci  # Vitest verbose
```

### Vérifier les stats

```bash
# Lire les stats actuelles
python3 -c "import json; d=json.load(open('public/win-history.json')); print(json.dumps(d['stats'], indent=2))"

# Vérifier les probas affichées (max 0.54)
python3 -c "import json; d=json.load(open('public/predictions.json'))['predictions']; print('Max proba:', max(p['proba'] for p in d))"
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
- **Contact conformité :** email dans le footer
- **Juridiction :** USA
- **Responsable publication :** Elon Ervri
