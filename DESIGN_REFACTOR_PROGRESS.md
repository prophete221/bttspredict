# Progression de la refonte professionnelle globale — BTTSPredict

**Branche de travail** : `redesign/professional-global-2026-11-03`
**Commit de base (origin)** : `71cf295e9d07794ea04b88710d474561cf128b35` — « chore: auto-update data »
**Checkout séparé** : `/workspace/btts-redesign` (worktree Git du clone existant)
**Branche `fix/partner-code-attribution` (`ed20cf69`)** : laissée intacte, non modifiée.
**`main`** : jamais touchée. Aucun merge, aucun déploiement (le workflow `.github/workflows/deploy.yml` ne se déclenche que sur `push: main`, `schedule` et `workflow_dispatch` — un push sur cette branche ne déploie rien).

**Statut au 3 novembre 2026** : phase 0 (audit technique et SEO) terminée. **Aucune modification visuelle n'a été commencée.** Les seuls fichiers ajoutés sont de la documentation (`DESIGN_REFACTOR_PROGRESS.md`, `SEO_AUDIT_BTTSPREDICT_2026-11-03.md`).

---

## 0. Contenu existant repris (préservé)

Le fichier n'existait pas sur la branche cible. Une version existe sur `fix/partner-code-attribution` (commit `ed20cf69`), ajoutée par `8867dc0b`. Son contenu valide est conservé ci-dessous, avant d'être complété par l'audit de la branche cible.

### 0.1 Version d'origine (branche `fix/partner-code-attribution`)

> ## État
> Les changements de refonte sont poussés uniquement sur `fix/partner-code-attribution`, basée sur le commit `81e5d3789f702707d84c67faf662f0b58d7c4724`. Les modes de fichiers d'origine sont conservés. Aucune Pull Request n'a été fusionnée ; `main` et la production n'ont pas été touchés. Le SHA final et le résultat du contrôle Vercel Preview sont communiqués avec la livraison.
>
> ## Travail effectué
> - Refonte du popup cadeau en panneau illustré, sobre et responsive. Les actions Linebet et 1xBet sont séparées visuellement, avec les codes confirmés `VISION221` et `vipbtts`, un bouton de fermeture accessible et une composition adaptée au français, à l'anglais et à l'arabe/RTL.
> - Création d'une navigation de marchés réutilisable et traduite, intégrée à l'accueil et aux principales portes d'entrée des pronostics. Les pages BTTS, Over 2,5, score exact, marché combiné, demain et l'analyse de match sont reliées entre elles.
> - Recomposition des héros, filtres, cartes et appels à l'action sur les pages du jour, le score exact, le marché combiné, le guide BTTS et les deux pages statistiques.
> - Ajout de la page BTTS demain en anglais et en arabe. Son texte précise que les matchs apparaissent au fur et à mesure de la publication des données ; il ne promet pas de filtre de date qui ne serait pas disponible.
> - Les flux de données, filtres de matchs, calculs, liens affiliés, événements de suivi et statuts de résultats existants sont conservés. Les tableaux statistiques continuent d'afficher « Données en préparation » plutôt que des taux inventés.
>
> ## Contrôle et validation
> - Build Next.js réussi ; les 892 pages statiques ont été générées, dont les nouvelles routes EN/AR de BTTS demain.
> - `npx tsc --noEmit` réussi.
> - Tests : 203 réussis sur 29 fichiers.
> - ESLint : aucune erreur ; 4 avertissements `no-location-assign-relative-destination` dans `MobileTabBar.tsx` et `StickyVipBandeau.tsx`.
> - Contrôle visuel automatisé : 48 captures de pages en FR/EN/AR (1440×950 et 375×812) et 6 captures du popup (desktop et 320×568). Toutes les pages contrôlées répondent en 200, sans débordement horizontal ni erreur de console ; le bouton de fermeture du popup fonctionne dans les trois langues. Les planches de contact et captures individuelles sont remises séparément pour revue.
> - `git diff --check` sans erreur.
>
> ## Contrôle du Preview
> Après le dernier push, vérifier que Vercel a créé un déploiement de type Preview pour le SHA final, qu'il est prêt, et que le SHA associé au déploiement correspond exactement au dernier commit de `fix/partner-code-attribution`. Communiquer le SHA complet, le lien direct du Preview et son état dans le retour à l'utilisateur.

### 0.2 Ce qui reste valable sur la branche cible

| Affirmation d'origine | Vérifié sur `redesign/professional-global-2026-11-03` |
|---|---|
| Popup cadeau refondu (3 langues, actions séparées) | Présent : `src/components/bttsbet/GiftPopup.tsx`, monté dans `src/app/layout.tsx`. |
| Navigation de marchés réutilisable | Présente : `src/components/bttsbet/LocalizedCombinedPredictionsClient.tsx` + liens croisés sur les pages du jour. |
| Page BTTS demain EN/AR | Présente : `src/app/[locale]/btts/predictions/today/page.tsx` et `src/app/btts/predictions/tomorrow/page.tsx`. |
| Aucun taux inventé (état « Données en préparation ») | Toujours appliqué ; les tests `no-invented-data` et `results-integrity` le contrôlent. |
| Build et TypeScript verts | Confirmé sur cette branche (voir §8). |
| Mention « Vercel Preview » | **Obsolète ici** : la production BTTSPredict est un export statique Next.js déployé par FTP vers LWS (`.github/workflows/deploy.yml`, `scripts/ftp-diff.mjs`). Aucun Preview Vercel n'est produit par ce dépôt ; il ne faut pas le promettre à nouveau. |

---

## 1. Inventaire des routes

### 1.1 Volumétrie réelle (mesurée sur le build de cette branche)

- **931 fichiers HTML générés** dans `out/` (build `npm run build`, exit 0).
- **864 pages match** = 288 matchs × 3 langues (`src/app/match/[slug]/page.tsx` + `src/app/[locale]/match/[slug]/page.tsx`).
- **67 pages éditoriales hors match** : 31 à la racine (FR, plus `en.html`, `ar.html`, `404`) + 18 EN + 18 AR.
- **61 URL dans `sitemap.xml`** (les pages match n'y figurent pas).
- **Poids total de `out/`** : 303 Mo ; les pages clés pèsent 48 Ko à 132 Ko de HTML brut.

### 1.2 Routes éditoriales FR (racine = FR, sans préfixe)

| Route | Fichier source | Clics 28 j | Impr. 28 j | CTR | Pos. | Mots | Hreflang |
|---|---|---:|---:|---:|---:|---:|---|
| `/` | `src/app/page.tsx` | 96 | 798 | 12,03 % | 7,54 | 673 | 4 |
| `/btts/predictions/today` | `src/app/btts/predictions/today/page.tsx` | 23 | 187 | 12,30 % | 28,76 | 434 | 4 |
| `/btts/predictions/tomorrow` | `src/app/btts/predictions/tomorrow/page.tsx` | 12 | 297 | 4,04 % | 45,46 | 1 320 | 0 |
| `/over-2-5/predictions/today` | `src/app/over-2-5/predictions/today/page.tsx` | 16 | 127 | 12,60 % | 33,20 | 1 343 | 4 |
| `/btts-and-over-2-5-predictions-today` | idem | 36 | 291 | 12,37 % | 53,93 | 1 373 | 0 |
| `/ai-correct-score-predictions` | `src/app/ai-correct-score-predictions/page.tsx` (+ `layout.tsx`) | 5 | 22 | 22,73 % | 61,64 | 524 | 4 |
| `/resultats-verifies` | idem | 2 | 18 | 11,11 % | 12,00 | 2 528 | 0 |
| `/historique` | idem | 0 | 14 | 0 % | 10,79 | 1 184 | 0 |
| `/methodologie` | idem | 0 | 11 | 0 % | 23,91 | 2 014 | 0 |
| `/statistiques` | idem | 0 | 3 | 0 % | 5,33 | 311 | 0 |
| `/btts/statistics` | idem | 1 | 6 | 16,67 % | 46,67 | 1 462 | 0 |
| `/over-2-5/statistics` | idem | 10 | 59 | 16,95 % | 43,37 | 495 | 0 |
| `/vip` | `src/app/vip/page.tsx` | 1 | 6 | 16,67 % | 3,50 | 1 061 | 0 |
| `/btts-c-est-quoi` | idem | 0 | 22 | 0 % | 15,00 | 618 | 0 |
| `/code-promo-linebet-senegal` | idem | 0 | 205 | 0 % | 16,46 | 770 | 4 |
| `/code-promo-1xbet` | idem | — | — | — | — | 702 | 4 |
| `/code-promo-melbet` | idem | — | — | — | — | 702 | 4 |
| `/bonus-888starz` | idem | 0 | 23 | 0 % | 10,17 | 632 | 4 |
| `/bonus-888starz-btts221` | idem | — | — | — | — | 650 | 4 |
| `/pronostics` | `src/app/pronostics/page.tsx` | — | — | — | — | 434 | 0 |
| `/prediction-aviator` | idem | — | — | — | — | 510 | 0 |
| `/linebet-promo-code` | idem (301 → `/code-promo-linebet-senegal`) | — | — | — | — | 45 | 0 |
| `/cgu`, `/mentions-legales`, `/politique-confidentialite`, `/jouer-responsable` | idem | 0 | 2 / 2 / — / — | 0 % | 3–4,5 | 858–1 823 | 0 |
| `/match/[slug]` | `src/app/match/[slug]/page.tsx` | 7 | 376 (112 URL) | 1,86 % | variable | ~700 | 0 |

`—` = page absente du top des pages de l'export GSC (donc sous le seuil de la table, pas nécessairement zéro).

### 1.3 Routes localisées (EN / AR)

18 pages EN (`/en/...`) et 18 pages AR (`/ar/...`) via `src/app/[locale]/…`, plus `/en` et `/ar` (accueil). Les 21 chemins de `src/app/sitemap.ts` sont dupliqués en EN et AR ; `/btts/predictions/tomorrow`, `/btts/statistics`, `/over-2-5/statistics`, `/btts-c-est-quoi` et `/prediction-aviator` restent FR uniquement.

| Route EN | Clics 28 j | Impr. 28 j | CTR | Pos. | Mots | Hreflang |
|---|---:|---:|---:|---:|---:|---|
| `/en` | 281 | 3 070 | 9,15 % | 26,22 | 491 | 4 |
| `/en/btts-and-over-2-5-predictions-today` | 333 | 1 947 | 17,10 % | 10,08 | 1 226 | **0** |
| `/en/over-2-5/predictions/today` | 279 | 2 621 | 10,64 % | 19,89 | 1 158 | 4 |
| `/en/ai-correct-score-predictions` | 10 | 36 | 27,78 % | 22,25 | 367 | 4 |
| `/en/btts/predictions/today` | 7 | 93 | 7,53 % | 59,73 | 301 | 4 |
| `/en/statistiques` | 1 | 1 | 100 % | 98,00 | 186 | 0 |
| `/en/resultats-verifies` | 0 | 5 | 0 % | 4,40 | 2 382 | 0 |
| `/en/vip` | 0 | 4 | 0 % | 2,50 | 854 | 0 |
| `/ar` | 1 | 6 | 16,67 % | 2,83 | 447 | 4 |
| `/ar/ai-correct-score-predictions` | 1 | 6 | 16,67 % | 4,50 | 328 | 4 |
| `/ar/btts/predictions/today` | 0 | 4 | 0 % | 3,75 | 273 | 4 |

Toutes les autres pages AR/EN ne figurent pas dans l'export (moins de une impression sur 28 jours).

### 1.4 Routes techniques (à ne pas casser)

| Élément | Rôle | Garde-fou |
|---|---|---|
| `/predictions.json` (`src/app/predictions.json/route.ts`) | Flux public consommé par les widgets client | Ne pas renommer ni changer le schéma |
| `/sitemap.xml` (`src/app/sitemap.ts`) | 61 URL + hreflang | Fichier **gelé par test** (`tests/seo-preservation.test.ts`) |
| `/robots.txt` (`public/robots.txt`) | Autorise bots + crawlers IA, bloque `/api/` et `/admin` | Fichier **gelé par test** |
| `/predictions-archive/*.json` + `/predictions-archive/index.html` | Archives quotidiennes ; l'index est déjà `noindex, follow` | Conserver le `noindex` |
| `404.html` + règles `.htaccess` | Redirections 301 legacy (`/linebet-promo-code`, `/over-2-5`, `/correct-score-predictions`, `/blog`, etc.) | Toute URL refondue doit rester servie par une règle existante |
| `_headers`, `sw.js`, `manifest.json` | En-têtes de sécurité, PWA | Ne pas dégrader la CSP |

### 1.5 Fonctionnalités et intégrations à préserver (aucune suppression autorisée)

| Intégration | Emplacement | Statut vérifié |
|---|---|---|
| Authentification + Firebase | `src/contexts/AuthContext.jsx` (importé via `LegacyCredentialCleanup` / VIP), paquet `firebase@12.15.0` | Présent ; **aucun import Firebase ailleurs dans `src/`** sur cette branche (seul `AuthContext.jsx` est en `.jsx`, non couvert par les scans `.ts/.tsx`). À vérifier avant toute modification de l'arbre `contexts/`. |
| Suivi analytics GA4 | `src/components/bttsbet/AnalyticsLoader.tsx`, `NEXT_PUBLIC_GA_ID`, CSP dans `public/.htaccess` | Chargé après consentement (`CookieConsent`) |
| Suivi d'affiliation | `src/lib/affiliateTracking.ts` (canal unique `gtag`) + `MatchViewTracker.tsx` | Ne pas modifier les noms d'événements |
| Liens affiliés | `src/lib/constants.ts` → `AFFILIATE` (1xbet, Melbet, Linebet, 888starz) avec `rel="sponsored nofollow"` | Ne pas toucher aux URL ni à la casse des codes (`Vipbtts`, `Bttswin`, `VISION221`, `btts221`) |
| Codes promo / modales VIP | `VipUnlockModal.tsx`, `PromoVip.tsx`, `GiftPopup.tsx`, `StickyVipBandeau.tsx` | Logique de déverrouillage à conserver |
| Données et calculs | `public/predictions.json`, `public/win-history.json`, `src/lib/predictions.ts`, `predictionQuality.ts`, `vipPredictions.ts` | Lecture seule côté design |
| JSON-LD | `src/lib/seoSchemas.ts` (gelé) + JSON-LD inline dans `src/app/page.tsx` | Conserver FAQPage / WebSite / Organization |
| i18n | `src/lib/i18n.ts` (gelé) + `i18n-extras.ts` + `LanguageSwitcher.tsx` | Aucun texte en dur nouveau |

---

## 2. État mesuré des métadonnées et de l'internationalisation

Contrôle automatisé des 930 pages HTML exportées (404 exclue) :

| Contrôle | Résultat mesuré | Lecture |
|---|---|---|
| `<title>` présent | 930 / 930 | OK |
| Meta description présente | 929 / 930 (seule absente : `/predictions-archive/`, déjà `noindex`) | OK |
| Canonical présent | 929 / 930 | OK |
| `<h1>` présent | 927 / 930 | Manquant sur `/statistiques`, `/en/statistiques`, `/ar/statistiques` |
| `<h1>` multiples | 0 | OK |
| Titles > 60 caractères | 53 pages (9 hors match : pages promo et AR) | Cosmétique, titres gelés par test pour certaines pages |
| Descriptions > 160 caractères | 1 (`/statistiques`, 187 car.) | À corriger sans toucher au contenu classé |
| `<html lang>` | **`fr` sur 930 / 930 pages**, y compris `/en` et `/ar` | **Risque réel** : le `lang` est corrigé côté client par un script inline du `RootLayout` |
| `hreflang` on-page | **26 / 930 pages seulement** | Absent sur `/en/btts-and-over-2-5-predictions-today` (1ʳᵉ page du site) et sur sa jumelle FR |
| Canonical ≠ URL | 69 cas : encodage des accents (équivalent), `/pronostics` → `/btts/predictions/today`, `/linebet-promo-code` → `/code-promo-linebet-senegal`, `404` → `/` | Volontaire et documenté, sauf l'encodage à normaliser un jour |
| Titres dupliqués | 2 paires : (`/pronostics`, `/btts/predictions/today`) et (`/ar/bonus-888starz`, `/ar/bonus-888starz-btts221`) | La première paire est un alias canonicalisé |
| `noindex` | 2 pages (`/predictions-archive/`, `_not-found`) | OK |
| Liens internes EN cassés | 0 | OK |

**Tests de gel SEO à respecter impérativement** (`tests/seo-preservation.test.ts`) : hachage octet par octet de `src/lib/i18n.ts`, `src/lib/seoSchemas.ts`, `src/app/sitemap.ts`, `public/robots.txt`, `scripts/submit-indexnow.mjs`, et hachage des blocs `metadata`/`generateMetadata` de `src/app/layout.tsx`, `src/app/match/[slug]/page.tsx`, `src/app/methodologie/page.tsx`. Toute refonte visuelle doit passer ces 8 tests sans mise à jour de hash.

---

## 3. Données Google Search Console réellement disponibles

Source : export fourni par le propriétaire, `bttspredict.com-Performance-on-Search-2026-11-02(2).zip`, téléchargé le 2 novembre 2026. Filtre déclaré dans `Filtres.csv` : **« Type de recherche : Web (textuel) » / « Date : Les 28 derniers jours »**.

| Jeu de données | Contenu réel | Couverture |
|---|---|---|
| `Graphique.csv` | 28 lignes quotidiennes | **2026-10-04 → 2026-10-31** |
| `Pages.csv` | 147 URL | Agrégat 28 jours (pas de ventilation par jour) |
| `Requêtes.csv` | 293 requêtes | Agrégat 28 jours |
| `Pays.csv` | 153 pays | Agrégat 28 jours |
| `Appareils.csv` | 3 lignes | Agrégat 28 jours |
| `Apparence dans les résultats de recherche.csv` | en-tête seul | Vide |

### 3.1 Le 31 octobre 2026, seule la vue site est disponible

| Métrique du 31/10/2026 | Valeur |
|---|---:|
| Clics | **110** |
| Impressions | **807** |
| CTR | **13,63 %** |
| Position moyenne | **11,1** |

Comparaison mesurée : moyenne des 27 autres jours = 35,9 clics et 320,6 impressions par jour ; le 31 octobre représente donc environ **3,1× la moyenne quotidienne de clics** de la période. Les 7 derniers jours (25–31/10, 472 clics / 4 030 impressions) sont en hausse de **+26 % de clics** par rapport aux 7 jours précédents (18–24/10, 374 clics / 3 335 impressions).

**Ce que l'export ne permet pas** : aucune ventilation par page, par requête, par pays ou par appareil pour la seule journée du 31 octobre. Les chiffres par page et par requête utilisés dans ce document sont des **cumuls 4–31 octobre**, et sont signalés comme tels.

### 3.2 Totaux de la période (28 jours)

- Série quotidienne : **1 080 clics / 9 462 impressions**.
- Somme de la table `Pages.csv` : **1 124 clics / 10 311 impressions** ; somme de `Requêtes.csv` : 599 clics / 5 907 impressions (les requêtes anonymisées et les requêtes non listées expliquent l'écart habituel ; l'écart pages ↔ série quotidienne, lui, n'est pas expliqué par l'export et n'a pas été forcé).

### 3.3 Répartition par langue (somme des URL, 28 jours)

| Langue | Clics | Impressions | Part des clics |
|---|---:|---:|---:|
| EN (`/en/...`) | 913 | 8 011 | 81,2 % |
| FR (racine) | 209 | 2 253 | 18,6 % |
| AR (`/ar/...`) | 2 | 47 | 0,2 % |

### 3.4 Appareils (28 jours)

| Appareil | Clics | Impressions | CTR | Position |
|---|---:|---:|---:|---:|
| Mobile | 974 | 6 854 | 14,21 % | 14,24 |
| Ordinateur | 88 | 2 517 | 3,50 % | 31,87 |
| Tablette | 18 | 91 | 19,78 % | 12,59 |

**90,2 % des clics viennent du mobile** : la refonte doit rester mobile-first et ne peut pas dégrader le rendu 375 px.

### 3.5 Pays (28 jours, top 8)

Kenya 198 clics · Nigeria 128 · Afrique du Sud 61 · Côte d'Ivoire 49 · Ouganda 44 · Cameroun 38 · RD Congo 30 · Zimbabwe 23. À noter : Royaume-Uni 15 clics pour 638 impressions (CTR 2,35 %, position 40,07) et États-Unis 2 clics pour 270 impressions (0,74 %) — gros volumes d'impressions, quasi aucun clic. Sénégal : 15 clics / 241 impressions (6,22 %, position 14,02), alors que le site est édité en français depuis Dakar.

---

## 4. Pages protégées

Règle : **aucune modification d'URL, de canonical, de redirection, de title/description, de H1 principal ni de contenu éditorial classé** sur ces pages sans justification chiffrée et validation explicite du propriétaire.

| Page | Pourquoi elle est protégée (données 28 j) | Ce qui peut évoluer sans risque |
|---|---|---|
| `/en/btts-and-over-2-5-predictions-today` | **1ʳᵉ page du site** : 333 clics, 1 947 impressions, CTR 17,10 %, position 10,08. Meilleur CTR des pages à volume. | Habillage visuel uniquement (conteneur, espacements, cartes), ordre des blocs **au-dessus** du contenu classé inchangé, title/description intacts |
| `/en` | 281 clics, 3 070 impressions — la plus forte exposition du site, position 26,22 donc la plus fragile : c'est la page à **améliorer sans casser**. | Design, densité de liens internes, vitesse |
| `/en/over-2-5/predictions/today` | 279 clics, 2 621 impressions, CTR 10,64 %, position 19,89. | Design et lisibilité des tableaux |
| `/` | 96 clics, 798 impressions, **position 7,54 (meilleure position du site)**, CTR 12,03 %. | Design ; le title/description sont déjà validés par `checkSeo()` |
| `/en/ai-correct-score-predictions` | 10 clics seulement mais CTR 27,78 % et position 22,25 : page à fort potentiel, à ne pas dégrader. | Design, maillage interne |

**Gels techniques complémentaires** : `src/lib/i18n.ts`, `src/lib/seoSchemas.ts`, `src/app/sitemap.ts`, `public/robots.txt`, `scripts/submit-indexnow.mjs` (hachés), ainsi que les blocs `metadata` de `src/app/layout.tsx`, `src/app/match/[slug]/page.tsx` et `src/app/methodologie/page.tsx`.

**Ce qui n'est jamais touché** : les 301 de `public/.htaccess`, les URL existantes, le flux `/predictions.json`, les identifiants GA4/affiliation, la logique Firebase/auth, les données `predictions.json` / `win-history.json`, la CSP.

---

## 5. Risques SEO constatés (mesurés, pas supposés)

| # | Risque | Preuve | Gravité | Traitement proposé |
|---|---|---|---|---|
| R1 | `lang="fr"` sur les 930 pages, y compris `/en` et `/ar` | Audit HTML : 930/930 `lang="fr"` ; correction uniquement par script client | Élevée | Phase 1 : passer `lang`/`dir` côté serveur dans `src/app/[locale]/layout.tsx` — mais le `<html>` est dans `src/app/layout.tsx` (fichier au `metadata` gelé). Nécessite une décision explicite (le hash porte sur les blocs `metadata`, pas sur le JSX `<html>`, à vérifier avant modification). |
| R2 | `hreflang` absent sur 904 pages, dont la page n°1 | 26/930 pages avec `<link rel="alternate" hreflang>` | Élevée | Phase 1 : ajouter `alternates.languages` aux pages à trafic (EN/FR jumelles) sans toucher aux titles |
| R3 | Pages match supprimées après quelques jours → 404 sur des URL indexées | 2 URL de l'export testées renvoient 404 (`…2026-10-10`, `…2026-09-12`) alors que 112 URL match totalisent 376 impressions ; `scripts/prune-archives.mjs` ne conserve que 90 archives | Moyenne | Phase 1 : conserver une page « match terminé » (200) ou rediriger vers l'archive, sans changer la génération des données |
| R4 | Aucune page match dans le sitemap | 61 URL, 0 `/match/` | Faible/Moyenne | Ne rien changer sans mesure : les matchs sont éphémères |
| R5 | Trois pages sans `<h1>` | `/statistiques`, `/en/statistiques`, `/ar/statistiques` | Moyenne | Phase 1 : ajouter un H1 visible, contenu inchangé |
| R6 | Description de 187 caractères sur `/statistiques` (tronquée en SERP) | Audit HTML | Faible | Phase 1, avec validation (page peu trafic : 3 impressions) |
| R7 | Titres > 60 caractères (9 pages hors match : promo 1xbet/Melbet/888starz, AR) | Audit HTML | Faible | Phase 3, après accord : ce sont des pages à 0 clic |
| R8 | `Canonical` non encodé/encodé sur les slugs accentués (69 cas) | Audit HTML | Faible | À normaliser un jour ; aucun impact mesuré aujourd'hui |
| R9 | CTR très faible sur les requêtes tête (`btts predictions` 5,26 % à la position 25,52 ; `btts predictions today` 4,44 % à 30,32) | `Requêtes.csv` | Élevée (opportunité) | Phase 2 : travail éditorial sur la page d'accueil EN et les pages du jour EN, pas sur le design seul |
| R10 | `/en/over-2-5/statistics` renvoie 404 (route inexistante) | Test HTTP : 404 | Faible | Aucun lien interne n'y pointe (vérifié : 0 lien cassé). Laisser tel quel ou créer la route en phase 3 |
| R11 | « Vercel Preview » de la note d'origine n'existe pas pour ce dépôt | `.github/workflows/deploy.yml` (FTP LWS) | — (documentation) | Corrigé au §0.2 |

---

## 6. Pages sans trafic : diagnostic

### 6.1 Pages éditoriales à zéro clic (cumul 28 jours)

| Page | Impressions | Position | Diagnostic réel |
|---|---:|---:|---|
| `/code-promo-linebet-senegal` | **205** | 16,46 | **CTR 0 % avec de vraies impressions** : le problème n'est ni l'indexation ni le contenu, mais la position (page 2) et l'intention. La requête `code promo linebet` pèse 138 impressions à elle seule, à la position 18,66, pour 0 clic. Le titre ne promet pas le code, et la SERP est squattée par la marque elle-même. |
| `/bonus-888starz` | 23 | 10,17 | Position 10 = bas de première page, 0 clic : **problème de titre/description et d'intention** (« bonus » vs « code promo »), pas de contenu (632 mots). |
| `/btts-c-est-quoi` | 22 | 15,00 | Page informative correctement fournie (618 mots) mais **position page 2** : problème de position, pas de contenu. |
| `/historique` | 14 | 10,79 | **Position limite (10,79) + CTR 0** : le snippet ne donne pas de raison de cliquer (pas de chiffre dans le title). |
| `/methodologie` | 11 | 23,91 | **Position trop faible** pour espérer des clics ; page pourtant riche (2 014 mots). Metadata quasi gelée par test. |
| `/statistiques` | 3 | 5,33 | **Absence de demande**, pas un problème de CTR : 3 impressions seulement malgré la position 5. S'y ajoutent un H1 manquant et une description tronquée. |
| `/en/statistiques` | 1 | 98,00 | **Quasi inexistante dans l'index** : 1 impression, position 98, 186 mots, pas de H1. C'est un problème de contenu/indexation, pas de design. |
| `/en/vip` | 4 | 2,50 | **Position excellente, volume nul** : requêtes de marque uniquement. Aucune action SEO à mener. |
| `/vip` | 6 | 3,50 | Idem : la demande « VIP » est une demande de marque, pas une demande de recherche. |
| Pages AR (18) | 47 au total | — | **Absence de marché** : 2 clics en 28 jours sur toute la langue arabe. Ne pas investir en SEO AR avant d'avoir un signal. |

### 6.2 Pages match (112 URL dans l'export)

376 impressions cumulées, **7 clics**, positions souvent entre 1 et 10, et **0 clic sur la majorité** malgré de bonnes positions : ce sont des requêtes « équipe A vs équipe B » à très faible volume, souvent satisfaites sans clic (score déjà affiché). Le vrai problème n'est pas le design : **ces URL disparaissent** (404 constaté sur deux d'entre elles), ce qui détruit le signal accumulé.

### 6.3 Cannibalisation

- `/pronostics` et `/btts/predictions/today` partagent **le même title** ; `/pronostics` est canonicalisé vers la page du jour, donc la cannibalisation est neutralisée — mais le doublon de title subsiste.
- Aucune autre cannibalisation mesurable dans l'export (pas de paire d'URL se disputant la même requête de manière visible). La vraie tension est **FR vs EN** : la page combinée FR est à la position 53,93 quand sa version EN est à 10,08 — ce n'est pas de la cannibalisation, c'est un déficit de pertinence/volume sur les requêtes françaises.

---

## 7. Tâches de refonte

### Phase 0 — Audit (terminée)

- [x] Inventaire des routes, composants, métadonnées, traductions, fonctionnalités
- [x] Analyse de l'export GSC (28 jours + journée du 31/10)
- [x] Identification des pages protégées et des pages sans trafic
- [x] Build, tests, lint, TypeScript de référence
- [x] Documentation (`DESIGN_REFACTOR_PROGRESS.md`, `SEO_AUDIT_BTTSPREDICT_2026-11-03.md`)

### Phase 1 — Corrections SEO sûres (à valider avant exécution)

1. `lang`/`dir` corrects côté serveur pour `/en` et `/ar` (R1).
2. `hreflang` sur les pages à trafic, en commençant par `/en/btts-and-over-2-5-predictions-today` et `/btts-and-over-2-5-predictions-today` (R2).
3. H1 manquants sur les trois pages statistiques, sans changer le contenu (R5).
4. Politique de rétention des pages match : conserver une page 200 ou rediriger (R3).
5. Normalisation canonique des slugs accentués (R8, non bloquant).

### Phase 2 — Refonte visuelle progressive (après validation)

Ordre imposé par les données, du plus sûr au plus sensible :

1. **Pages hors trafic d'abord** : `/cgu`, `/mentions-legales`, `/politique-confidentialite`, `/jouer-responsable`, `/statistiques`, `/methodologie` — aucun clic à perdre.
2. **Pages match** : design uniquement, aucune URL modifiée.
3. **Pages promo** (1xbet, Melbet, Linebet, 888starz) : attention, `/code-promo-linebet-senegal` a 205 impressions à défendre ; design seulement, titles intacts en attendant la phase 2 éditoriale.
4. **Pages du jour FR** : design + lisibilité des tableaux.
5. **Pages protégées EN** (`/en`, `/en/btts-and-over-2-5-predictions-today`, `/en/over-2-5/predictions/today`, `/en/ai-correct-score-predictions`) **en dernier**, avec capture avant/après et contrôle des métadonnées au diff.
6. **Accueil FR `/`** : dernier lot, position 7,54 à ne pas perdre.

### Phase 3 — Design system

- `src/app/globals.css` fait **8 114 lignes** avec 12 occurrences de `.page-design` : consolidation en jetons (couleurs, espacements, typographie) sans renommer les classes utilisées par les 65 composants de `src/components/bttsbet/`.
- Header/footer/navigation : un seul composant par rôle, pas de duplication FR/EN/AR.
- Aucune nouvelle dépendance UI.

---

## 8. Tests et vérifications de référence

Mesuré sur `71cf295e` + documentation, le 3 novembre 2026 :

| Vérification | Résultat |
|---|---|
| `npm run build` | **Succès** — 932 entrées de routes, 931 fichiers HTML, exit 0 |
| `npm test` | **203 tests réussis / 29 fichiers**, exit 0 |
| `npx tsc --noEmit` | **Succès**, exit 0 |
| `npm run lint` | **Aucune erreur, aucun avertissement** (contrairement aux 4 avertissements notés sur `fix/…`) |
| Tests de gel SEO | 8/8 verts (`tests/seo-preservation.test.ts`) |
| Liens internes EN cassés | 0 |
| Poids de `out/` | 303 Mo |

**Checklist à repasser après chaque lot visuel :**

- [ ] `npm run build` vert, nombre de pages HTML ≥ 931
- [ ] `npm test` : 203 tests verts, dont les 8 de `seo-preservation` **sans mise à jour de hash**
- [ ] `npx tsc --noEmit` et `npm run lint` propres
- [ ] Diff des balises `<title>`, `<meta name="description">`, `<link rel="canonical">`, `hreflang`, `lang` sur les 5 pages protégées : **aucun changement non validé**
- [ ] `public/.htaccess` inchangé (301 legacy)
- [ ] Aucune URL ajoutée/supprimée dans `src/app/**/page.tsx`
- [ ] Contrôle visuel 375 px et 1440 px, FR + EN + AR (RTL)
- [ ] Aucun lien affilié, code promo, event GA4 ou logique VIP modifié
- [ ] Aucun `git push` sur `main`, aucun merge

---

## 9. Journal

| Date | Action | Résultat |
|---|---|---|
| 2026-11-03 | Création du worktree séparé sur `redesign/professional-global-2026-11-03` (`71cf295e`) | OK, branche `fix/…` intacte |
| 2026-11-03 | Audit HTML des 930 pages exportées | 5 risques mesurés (R1, R2, R5, R6, R7) |
| 2026-11-03 | Analyse de l'export GSC fourni (28 j, 04→31/10) | 1 080 clics / 9 462 impressions ; 31/10 = 110 clics, 807 impr., 13,63 %, pos. 11,1 |
| 2026-11-03 | Build, tests, lint, tsc de référence | Tous verts |
| 2026-11-03 | Rédaction des documents d'audit | **Aucune modification visuelle effectuée** |
