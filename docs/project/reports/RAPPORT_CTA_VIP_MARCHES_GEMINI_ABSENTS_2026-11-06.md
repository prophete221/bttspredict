# CTA VIP pour les marchés sans décision Gemini — 6 novembre 2026

## Résultat

Le lien localisé « Débloquer VIP » remplace maintenant le tiret quand aucune décision Gemini valide n’existe pour un marché. Il mène à la page VIP, sans inventer de pronostic, cote ou troisième marché verrouillé. Les picks Gemini déjà présents restent inchangés.

## Correction et vérifications

Le fallback est dans [`FreePredictions.tsx`](../../../src/components/bttsbet/FreePredictions.tsx) et [`BttsTodayDashboard.tsx`](../../../src/components/bttsbet/BttsTodayDashboard.tsx), avec le composant localisé [`MissingMarketVipLink.tsx`](../../../src/components/bttsbet/MissingMarketVipLink.tsx). Le teaser conserve ses deux marchés actuels.

Vitest complet : 53 fichiers, 409 tests réussis et 16 ignorés; tests ciblés VIP/Gemini : 19 réussis. ESLint : aucune erreur et cinq avertissements existants hors des fichiers modifiés. TypeScript et les 25 tests Python réussissent. Le build local avait généré 154 pages avant un manque d’inodes du sandbox au moment d’écrire `.next/trace-build`; le build statique GitHub a ensuite réussi complètement.

## Déploiement et production

Un seul push fast-forward a été fait sur `main`. Le run automatique [#1066](https://github.com/prophete221/bttspredict/actions/runs/42187311925) a réussi : tests, lint, typage, build, préflight et FTP. Les étapes ESPN/Gemini, mise à jour des pronostics et pruning ont été ignorées.

L’artefact de transfert confirme `codeOnly=true`, `historyJsonMode=false`, 1 428 fichiers autorisés (42 931 289 octets) et FTP réussi. Aucun JSON de données ni archive n’était dans l’allowlist; zéro suppression de fichier et zéro URL retirée du sitemap. Les deux fichiers racine `robots.txt` et `sitemap.xml` ont été confirmés par l’étape dédiée; `.htaccess` a utilisé son transfert protégé séparé.

Les trois pages de production répondent HTTP 200. Chaque version contient 16 liens avec le bon libellé et la bonne destination, ainsi que 24 badges de teaser (12 cartes × 2 marchés) : [français](/over-2-5/predictions/today), [anglais](/en/over-2-5/predictions/today) et [arabe](/ar/over-2-5/predictions/today). Aucune troisième option verrouillée n’a été ajoutée.

## Données, faits et recommandation

Les empreintes de `win-history.json` et `history-exclusions.json` en production correspondent aux fichiers locaux. Le JSON `predictions.json` diffère en binaire, mais son diff structurel se limite à deux champs racine : le dépôt contient `analysisEngine: gemini-stats-v1`, la production contient un `disclaimer`. La date, `lastUpdated` et les 28 entrées de chacune des listes `free` et `predictions` sont identiques. Ce fichier n’était pas dans l’allowlist #1066 et n’a pas été modifié par ce run.

**Faits :** le run #1066 a abouti; les CTA sont vérifiés en HTML en français, anglais et arabe; aucune donnée ni archive n’a été téléversée. **Hypothèse :** aucune en attente sur le déploiement. **Recommandation :** laisser l’écart de métadonnées de `predictions.json` intact, sauf demande distincte de normalisation.

## Commits et état

Le correctif UI est le commit `ba1bc0c6989b4da03f4d0f4b57e7322544cdc5d0`; la tête publiée par le push unique est `b02049b8aa69aa0eb027b7867e904bd046904bef`. Le rapport avait été inclus au push; cette mise à jour finale consigne les résultats de production localement uniquement, sans second push ni second run.
