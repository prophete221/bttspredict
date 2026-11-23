# 06 — Diagnostic SEO et performances

> **Audit GLM du dépôt prophete221/bttspredict — 15 novembre 2026**
> Branche main, commit `5fb08ef` — audit statique du code, effectué exclusivement en lecture seule.
> Fiche thématique : baseline SEO gelée par le projet, URL stratégique /en/btts-and-over-2-5-predictions-today, constats SEO et performance chiffrés.

---

## Baseline SEO gelée par le projet lui-même (à respecter lors de toute refonte)

Le dépôt contient déjà son propre mécanisme de protection SEO, que toute intervention doit respecter :

- **tests/seo-preservation.test.ts** + **tests/fixtures/seo-protected-baseline.json** : gèlent title, description, canonical et hreflang de 4 pages.
- **tests/targeted-seo-four-urls.test.ts** + **scripts/targeted-seo-four-urls.mjs** : vérifient en production 4 URLs ciblées (contenu, RTL arabe, CTA localisés).
- **tests/new-pages-sitemap.test.ts**, **tests/sitemap-match-filter.test.ts** + **scripts/filter-sitemap-match-urls.mjs** : contrôlent le sitemap.
- **scripts/verify-seo.mjs** : vérification SEO globale (non branchée en CI — constat 24 du registre des risques).
- **tests/seo-preservation.test.ts** interdit aussi la régression des attributs lang (scripts/fix-html-lang.mjs corrige au build).

### Pages dont le SEO est gelé par le fixture seo-protected-baseline.json

| Clé | URL | Title gelé | Canonical gelé |
| --- | --- | --- | --- |
| home_fr | `/` | BTTSPredict — Pronostics BTTS du jour et Over 2,5 | https://bttspredict.com |
| home_en | `/en` | BTTS Predictions Today & Over 2.5 \| BTTSPredict | https://bttspredict.com/en |
| btts_over25_en | `/en/btts-and-over-2-5-predictions-today` | BTTS and Over 2.5 Predictions Today \| BTTSPredict | https://bttspredict.com/en/btts-and-over-2-5-predictions-today |
| over25_today_en | `/en/over-2-5/predictions/today` | Over 2.5 Predictions Today — Goal Analysis \| BTTSPredict | https://bttspredict.com/en/over-2-5/predictions/today |

Hreflang gelé sur les homes : ar → /ar, en → /en, fr → /, x-default → /.

### Les 4 URLs vérifiées en production par targeted-seo-four-urls.mjs

1. `/ar/historique` — direction RTL obligatoire (`dir="rtl"`), CTA arabe `عرض توقعات اليوم`.
2. `/en/historique` — CTA anglais « View today » obligatoire.
3. `/btts/statistics` (FR).
4. `/politique-confidentialite` (FR).

## URL stratégique explicite

**/en/btts-and-over-2-5-predictions-today** (src/app/[locale]/btts-and-over-2-5-predictions-today/page.tsx, sorti en /en/btts-and-over-2-5-predictions-today.html) est déclarée stratégique par le propriétaire du projet. Consignes associées, quel que soit le futur plan de refonte :

- Ne pas modifier l'URL, le slug, le title, la description, le canonical ni le contenu stratégique de cette page sans autorisation explicite du propriétaire.
- Une modernisation visuelle de cette page ne doit passer qu'après validation du fixture seo-protected-baseline.json inchangé (tests verts).
- Ne pas rediriger, fusionner ou renommer cette route même si elle paraît dupliquée avec `/btts-and-over-2-5-predictions-today` (FR) — la coexistence FR/EN est structurelle (segment [locale]).
- Les métadonnées de l'ensemble du site (titres, descriptions, hreflang, sitemap, robots.txt, llms.txt, ai.txt) sont hors périmètre de toute mission de design.

## Constats SEO issus de l'audit

1. **Divergence SSG FR vs en/ar (B8)** : le contenu prédictif manque du HTML exporté en anglais et en arabe — c'est le plus gros levier SEO de l'audit, avec un gain réel sans changement d'URL.
2. **IndexNow soumet des URLs supprimées** (risque 24, FAIBLE) et verify-seo.mjs n'est pas branché en CI : le filet SEO n'est pas complètement automatisé.
3. **JSON-LD** : chaque page redéfinit ses schémas localement (seoSchemas.ts centralisé mais déconnecté) ; FAQPage pose le bonus de 300 % comme un fait — à assumer ou corriger (risque 9).
4. **Attributs d'affiliation** : rel=sponsored nofollow noopener noreferrer partout, vérifié par tests — point fort à préserver.
5. **Polices Poppins** committées mais jamais chargées via next/font/local : la police de marque est remplacée par une police système (incohérence visuelle, pas d'impact SEO direct).

## Performance : constats chiffrés

1. **654 Ko de CSS global chargés sur chaque page** (globals.css 434 Ko dont ~56 % de classes mortes ; football-intelligence.css 90 Ko ; bttspredict-design-system.css 48 Ko ; matchday-ui.css 48 Ko ; bttspredict-rebuild.css 35 Ko), plus vip.css (87 Ko) sur la page VIP. 497 classes définies en doublon entre fichiers ; 5 générations de design empilées (préfixes fi-, hp-, bp-, vipx-, btp-).
2. **Dépôt de 208 Mo** (skills/ 60 Mo, 653 fichiers Markdown de rapports, .pyc) pour moins de 20 Mo de code utile : impact clonage + quota Actions à chaque checkout.
3. **getMatchBySlug** relit toutes les archives à chaque appel, plusieurs fois par page de match (B6).
4. **Polices non chargées** : 4 fichiers woff2 Poppins committés sans next/font/local (ni gain de police de marque, ni optimisation de chargement).
5. **Route predictions.json redondante** : double écriture du même chemin de sortie (B7).
6. **Aucun audit de performance exécuté** (Lighthouse, WebPageTest, mesures réseau réelles) : hors périmètre d'un audit statique — à faire avant toute décision de refonte CSS.
