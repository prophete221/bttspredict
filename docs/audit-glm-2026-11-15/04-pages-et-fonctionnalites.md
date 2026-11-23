# 04 — Inventaire des pages, fonctionnalités et dépendances internes

> **Audit GLM du dépôt prophete221/bttspredict — 15 novembre 2026**
> Branche main, commit `5fb08ef` — audit statique du code, effectué exclusivement en lecture seule.
> Reconstruit du code : routes FR/en/ar, panneau admin, worker VIP, composants partagés à haut couplage, chaînes critiques, zones fonctionnelles à ne pas modifier sans autorisation, données publiques et scripts du pipeline.

---

## Inventaire des routes du site (reconstruit du code, src/app)

### Pages racine (français — version principale)

| Route | Fichier | Rôle observé | Statut |
| --- | --- | --- | --- |
| `/` | src/app/page.tsx | Accueil, prono du jour, ensemencé au build | Fonctionnelle, baseline SEO gelée (tests/fixtures/seo-protected-baseline.json) |
| `/pronostics` | src/app/pronostics/page.tsx | Pronostics du jour | Fonctionnelle |
| `/historique` | src/app/historique/page.tsx + HistoriquePageContent.tsx + HistoriqueClient.tsx + getWinHistory.ts | Historique vérifié (win-history.json) | Fonctionnelle |
| `/vip` | src/app/vip/page.tsx + layout.tsx + vip.css + VipApplication.tsx, VipClient.tsx, VipWinHistory.tsx, VipJourneyModal.tsx, VipLockedPicks.tsx, VipTelegramInviteCta.tsx | Espace VIP (accès par dépôt partenaire) | Fonctionnelle ; contient 2 flux parallèles morts |
| `/match/[slug]` | src/app/match/[slug]/page.tsx | Page match (SSG, JSON-LD) | Fonctionnelle ; attention getMatchBySlug (B6) |
| `/aviator` | src/app/aviator/page.tsx | Page promo Aviator | Fonctionnelle |
| `/btts/predictions/today` | src/app/btts/predictions/today/page.tsx | Pronos BTTS du jour | Fonctionnelle |
| `/btts/predictions/tomorrow` | src/app/btts/predictions/tomorrow/page.tsx | Pronos BTTS demain | Fonctionnelle |
| `/btts/statistics` | src/app/btts/statistics/page.tsx | Statistiques BTTS | Fonctionnelle ; une des 4 URLs SEO ciblées |
| `/over-2-5/predictions/today` | src/app/over-2-5/predictions/today/page.tsx | Pronos Over 2,5 du jour | Fonctionnelle ; baseline SEO pour /en/... |
| `/over-2-5/statistics` | src/app/over-2-5/statistics/page.tsx | Statistiques Over 2,5 | Fonctionnelle |
| `/btts-and-over-2-5-predictions-today` | src/app/btts-and-over-2-5-predictions-today/page.tsx | Page combinée BTTS + Over 2,5 | Fonctionnelle ; **URL stratégique en version anglaise** |
| `/ai-correct-score-predictions` | src/app/ai-correct-score-predictions/page.tsx + layout.tsx | Score exact IA | Fonctionnelle |
| `/btts-c-est-quoi` | src/app/btts-c-est-quoi/page.tsx | Article SEO | Présente |
| `/guide-que-signifie-btts` | src/app/guide-que-signifie-btts/page.tsx | Article SEO | Présente |
| `/competitions`, `/competitions/[slug]` | src/app/competitions/ | Pages compétitions (useCompetitionFeed) | Présentes |
| `/bonus-888starz` | src/app/bonus-888starz/page.tsx + Star888Client.tsx | Promo 888Starz | Fonctionnelle |
| `/bonus-888starz-btts221` | src/app/bonus-888starz-btts221/page.tsx | Promo BTTS221 | Présente |
| `/code-promo-linebet-senegal` | src/app/code-promo-linebet-senegal/page.tsx + LinebetClient.tsx | Promo Linebet Sénégal | Fonctionnelle |
| `/linebet-promo-code` | src/app/linebet-promo-code/page.tsx | Promo Linebet | Présente |
| `/code-promo-1xbet` | src/app/code-promo-1xbet/page.tsx | Promo 1xBet | Présente |
| `/code-promo-melbet` | src/app/code-promo-melbet/page.tsx | Promo Melbet | Présente |
| `/methodologie` | src/app/methodologie/page.tsx + LocalizedMethodologieClient.tsx | Méthode documentée | Fonctionnelle |
| `/resultats-verifies` | src/app/resultats-verifies/page.tsx + ResultatsClient.tsx + ResultatsLocalizedShell.tsx | Résultats vérifiés | Fonctionnelle |
| `/statistiques` | src/app/statistiques/page.tsx | Statistiques | Présente |
| `/jouer-responsable` | src/app/jouer-responsable/page.tsx | Jeu responsable (360 lignes) | Conforme |
| `/politique-confidentialite` | src/app/politique-confidentialite/page.tsx | Politique RGPD (417 lignes) | Conforme sur le fond, lacunes B20 |
| `/mentions-legales` | src/app/mentions-legales/page.tsx | Mentions légales (332 lignes) | Conforme |
| `/cgu` | src/app/cgu/page.tsx | CGU (465 lignes) | Conforme |
| `/predictions.json` | src/app/predictions.json/route.ts | Route API au build | Redondante (B7) |
| `/ar/match` | src/app/ar/match/page.tsx | Page match arabe | Anomalie de structure : hors du segment [locale] |

### Segment [locale] (en, ar — miroirs traduits)

Le layout src/app/[locale]/layout.tsx exclut `fr` de generateStaticParams pour éviter les doublons d'URL. Les miroirs suivants existent : page d'accueil, `/historique`, `/vip`, `/match/[slug]`, `/aviator`, `/btts/predictions/today`, `/over-2-5/predictions/today`, `/btts-and-over-2-5-predictions-today`, `/ai-correct-score-predictions`, `/bonus-888starz`, `/bonus-888starz-btts221`, `/competitions` (+ `[slug]`), `/code-promo-linebet-senegal`, `/code-promo-1xbet`, `/code-promo-melbet`, `/methodologie`, `/resultats-verifies`, `/statistiques`, `/jouer-responsable`, `/politique-confidentialite`, `/mentions-legales`, `/cgu`.

Constat important : ces miroirs ne sont pas ensemencés de données au build (B8) — le HTML exporté en anglais et en arabe manque du contenu prédictif.

### Panneau d'administration et worker VIP

- Panneau : public/vip-admin/admin.html + admin.js + admin.css (statique, servit par le site ; DOM construit exclusivement avec textContent/replaceChildren).
- Worker : workers/vip-api (index.js 702 lignes + vip-candidates.js, vip-publisher.js, vip-publication-config.js, vip-risk.js).
- Base D1 : 7 migrations (0001_initial, 0002_real_applications, 0003_private_invite_links, 0004_application_consent, 0005_vip_candidates, 0006_vip_publications, 0007_vip_publication_batches).
- Endpoint interne : /internal/vip-candidates/sync (jeton OIDC GitHub Actions vérifié cryptographiquement).

## Composants et bibliothèques partagés à haut couplage

Modifier ces fichiers sans analyse d'impact risque de casser plusieurs pages à la fois.

### Composants (src/components/bttsbet)

| Composant | Utilisé par | Risque si modifié |
| --- | --- | --- |
| ApplicationNavigationShell, Navbar, Footer, BottomNavigation, NavigationContext, LanguageSwitcher | Toutes les pages | Navigation/casse globale du site |
| CookieConsent, AnalyticsLoader | Toutes les pages | Conformité RGPD et chargement de GA — modification à valeur juridique |
| ErrorBoundary | Enveloppement systématique | Perte de la gestion d'erreur |
| MatchCenter, MatchDashboardTabs, MatchAnalyticsCharts, SimpleCharts, TeamLogo, TeamContext, ShareAnalysisButton, MatchViewTracker | Pages match, dashboard, pronostics | Casse le cœur du produit |
| BttsTodayDashboard | /btts/predictions/today + variantes | Casse la page principale BTTS |
| FreePredictions, LocalizedCombinedPredictionsClient | Pages de pronostics trilingues | Casse le flux public |
| WinHistory (composant), historyDisplay (lib) | /historique, /resultats-verifies | Casse l'affichage de l'historique |
| VipTelegramInviteCta, VipButtons, MissingMarketVipLink | Page VIP et CTA dispersés | Casse l'entonnoir VIP monétisé |
| LocalizedLegalPage | Pages légales en/ar | Casse les 4 pages légales x 2 langues |
| LocalizedPromoClient, PromoLandingShell, BookmakerCardLinks | Toutes pages promo | Casse la monétisation affiliation |
| Hero | Accueil | Casse la baseline SEO de l'accueil |

### Bibliothèques (src/lib)

`matches.ts`, `predictions.ts`, `i18n.ts` + `i18n-extras.ts` (système i18n maison trilingue — dictionnaires dupliqués dans chaque composant : une clé changée doit être cherchée partout), `constants.ts` (tiers et clés — doit rester aligné avec scripts/), `public-calendar.ts`, `match-slug.ts`, `match-page-ssg.ts`, `match-verification-registry.ts`, `team-context.ts`, `teamLogos.ts` + `teamLogoOverrides.ts` + `src/utils/teamLogos.js`, `gemini-predictions.ts`, `vipPredictions.ts`, `vipWinHistory.ts`, `seo.ts`, `promo-faq.ts`, `affiliateTracking.ts`, `dakar-date.ts`, `match-center-window.ts`, `matchMetricLabels.ts`, `predictionPresentation.ts`, `predictionQuality.ts`, `btts-today-dashboard-data.ts`, `btts-today-dashboard-stats.ts`, `competition-pages.ts`, `matchPageLogos.ts`, `clipboard.ts`, `motionPresets.ts`, `utils.ts`.

Attention : `seoSchemas.ts` (437 lignes) est déconnecté de tout import mais gelé par un test d'empreinte — toute décision (brancher ou supprimer) doit inclure la suppression du test correspondant.

## Dépendances entre pages, composants et fonctionnalités (chaînes critiques)

1. **Layout racine → tout** : src/app/layout.tsx importe les 5 feuilles CSS globales (654 Ko), monte le purgeur de service worker (3 scripts inline), Navbar/Footer/Shell. Toute erreur ici rend le site entier indisponible.
2. **predictions.json → tout le produit** : public/predictions.json alimente FreePredictions, MatchCenter, le dashboard BTTS today, les archives. Toute modification du schéma casse le pipeline, les pages et les tests (predictions-validation.test.ts, public-data-boundary.test.ts).
3. **history-exclusions.json → update-win-history.mjs → win-history.json → /historique et /vip** : la chaîne du taux public. Modifier un maillon change le taux affiché (B16).
4. **deploy.yml → pipeline → FTP → site** : tout le cycle (ESPN → Gemini → vérification → build → FTP LWS → IndexNow) est piloté par ce workflow. Les déploiements sont sérialisés par groupes de concurrence (public/VIP).
5. **Worker VIP ↔ sync-vip-candidates.mjs ↔ OIDC ↔ D1 ↔ admin.html** : le flux VIP complet. La modification d'un seul maillon (schéma D1, jetons, prompts) désynchronise le circuit candidat → approbation → publication.
6. **i18n.ts + dictionnaires par composant** : trois langues dupliquées localement dans chaque composant — divergences garanties si modifications non coordonnées (cf. B21).
7. **tests/seo-preservation.test.ts + fixtures/seo-protected-baseline.json** : gèlent titles, descriptions, canonicals et hreflang de 4 pages. Toute refonte visuelle de ces pages doit faire passer ces tests à l'identique.
8. **affiliateTracking.ts + pages promo** : le tracking d'affiliation couvre toutes les pages de monétisation ; les attributs rel=sponsored nofollow noopener noreferrer sont vérifiés par des tests (affiliate-consistency.test.ts, affiliate-link-consolidation.test.ts).

## Pages et zones constatées fonctionnelles (à ne pas modifier sans autorisation)

Constat établi par lecture du code et des tests du projet ; aucune vérification de production n'a été effectuée (voir fichier 08).

- Accueil FR/EN (baseline SEO gelée : titles, canonicals, hreflang vérifiés par tests).
- **/en/btts-and-over-2-5-predictions-today** — URL stratégique explicite (cf. fichier 06).
- /en/over-2-5/predictions/today — baseline SEO gelée.
- Dashboard BTTS today et Match Center — suivi honnête des statuts WON/LOST/vérification en cours, ErrorBoundary, aria-current/aria-live, prefers-reduced-motion.
- /historique et /resultats-verifies — affichage cohérent avec win-history.json.
- Le pipeline de données lui-même (échec fermé, garde-fous anti-invention testés) — ne pas « améliorer » le modèle sans décision produit.
- Le worker VIP et son authentification — la partie la mieux sécurisée du projet ; ne pas toucher sans analyse.
- Pages légales françaises — substantielles (332 à 465 lignes) ; à compléter (B20), pas à refondre.
- La chaîne d'affiliation existante (rel=sponsored, disclaimers, tracking) — conforme et testée.

## Données publiques et fichiers de données (périmètre protégé)

| Fichier | Rôle | Particularité |
| --- | --- | --- |
| public/predictions.json (261 Ko) | Flux public des pronos | Sanitisé avant et après build |
| public/win-history.json | Historique vérifié affiché | Taux curaté via exclusions (B16) |
| public/history-exclusions.json (546 entrées) | Exclusions du taux public | Sans justification par entrée — sensible |
| public/predictions-archive/*.json (63 fichiers, 2026-08-18 → 2026-11-15) | Archives quotidiennes | Preuve publique auditable — ne jamais supprimer |
| public/team-context.json, transfers.json | Contexte équipes | Générés par scripts |
| public/vip-combos.json | Stub « indisponible » | Remplacé à la construction |
| public/manifest.json, sw.js, _headers, robots.txt, llms.txt, ai.txt | PWA, SEO, protocoles | À préserver ; _headers à enrichir (CSP/HSTS) |
| public/ba48253f4d8544b3a93cc49a1498381a.txt | Jeton IndexNow | Public par conception du protocole |

## Scripts du pipeline principaux (workflows de génération des pronostics)

`quick-update-predictions.mjs` (ESPN, 942 lignes, cœur du modèle), `enrich_predictions.py` (Gemini, 668 lignes, échec fermé), `verify-results.mjs` (scores finis ESPN + TheSportsDB), `verdict.mjs` (pure, testée), `update-win-history.mjs` (historique v4 + exclusions), `public-predictions.mjs`, `sanitize-public-data.mjs`, `prune-archives.mjs`, `finalize-predictions.mjs`, `validate-predictions.mjs`, `filter-gemini-current-picks.mjs`, côté VIP : `vip-candidate-source.mjs`, `sync-vip-candidates.mjs`, `enrich_vip_candidates.py`, `update-vip-combos.mjs` ; côté déploiement : `prepare-ftp-deploy-plan.mjs`, `ftp-diff.mjs`, `ftp-inventory.py`, `ftp-safe-preflight.lftp`, `prepare-ftp-upload-allowlist.mjs`, `validate-ftp-deploy-state.mjs`, `check-ftp-tls.py`, `prepare-stale-match-deletions.mjs` (produit délibérément zéro suppression) ; côté SEO : `submit-indexnow.mjs`, `verify-seo.mjs`, `targeted-seo-four-urls.mjs`, `filter-sitemap-match-urls.mjs`, `fix-html-lang.mjs`, `fix-og-titles.py`.
