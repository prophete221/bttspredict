# 08 — Tests effectués, résultats et éléments non vérifiés

> **Audit GLM du dépôt prophete221/bttspredict — 15 novembre 2026**
> Branche main, commit `5fb08ef` — audit statique du code, effectué exclusivement en lecture seule.
> Méthodologie des 4 passes, périmètre exact, état de la suite de tests du projet, vérifications effectuées avec preuves, éléments non vérifiés, recommandations de vérification avant intervention.

---

## Méthodologie de l'audit (ce qui a été fait)

L'audit du 15 novembre 2026 a été réalisé exclusivement en lecture seule (clone du dépôt, git log, lecture de fichiers — aucun push, aucun commit, aucune modification) sur la branche main au commit 5fb08ef. La méthode est une lecture directe du code, volontairement indépendante de la documentation : le README (36 Ko), les rapports de projet (GLM_TASK_00x, docs/project/reports) et les commentaires n'ont été utilisés qu'a posteriori, comme éléments de comparaison.

Les constats ont été établis en quatre passes :

1. **Inventaire statistique complet** des fichiers par extension et par volume (2 131 entrées d'arborescence, 1 669 fichiers, 462 dossiers, 95,2 Mo).
2. **Lecture intégrale des fichiers critiques de sécurité** : worker vip-api (1 999 lignes), panneau d'administration, contexte d'authentification, scripts FTP, workflows GitHub Actions.
3. **Lecture systématique, dossier par dossier** : bibliothèques (src/lib), pages et composants (src/app, src/components/bttsbet), scripts, tests.
4. **Vérification croisée des affirmations sensibles sur les données publiques elles-mêmes** : win-history.json, history-exclusions.json, archives de prédictions (ex. la perte Bayer Leverkusen - Marseille du 5 novembre retracée dans l'archive mais absente de l'historique affiché).

## État de la suite de tests du projet (constatée, non exécutée)

- **85 fichiers Vitest, environ 500 tests, 2 325 assertions** (4,7 par test en moyenne), couvrant : intégrité des pronostics, garde-fous anti-invention (no-invented-data.test.ts), frontière public/privé (public-data-boundary.test.ts), sécurité de déploiement (deployment-security.test.ts, ftp-action-state.test.ts), worker VIP (vip-worker-production.test.ts, vip-publisher.test.ts...), nombreuses régressions UI.
- Tests Python sérieux bien branchés : enrich_predictions_test.py (23 tests), enrich_vip_candidates_test.py (16 tests).
- **Deux trous notables** : le matching flou de verify-results.mjs n'est pas testé (cf. incident Manchester, B2) ; test_ftp_inventory.py ne tourne jamais en CI (B3).
- **Important** : les tests n'ont PAS été exécutés pendant l'audit (audit statique, sans installation des dépendances ni exécution) ; les chiffres ci-dessus sont constatés par lecture du code des tests, pas par exécution.

## Vérifications effectuées (avec preuve dans le code)

| Vérification | Résultat | Preuve |
| --- | --- | --- |
| Absence de secrets committés | Confirmée (scan complet du dépôt) | Toutes les clés via variables d'environnement/secrets GitHub ; .gitignore exclut .env* et *.pem |
| Vérification OIDC du worker | Confirmée | workers/vip-api — vérification signature JWT RS256 contre JWKS GitHub, émetteur, audience, sujet, dépôt, branche refs/heads/main, workflow |
| Sessions admin hachées | Confirmée | Jetons 32 octets stockés en SHA-256, TTL 1 h, 5 échecs/15 min/IP |
| Sanitisation du DOM admin | Confirmée | public/vip-admin/admin.js — textContent/replaceChildren uniquement |
| Politique CORS | Confirmée | Origine bttspredict.com uniquement |
| Garde-fous anti-invention | Confirmée | no-invented-data.test.ts interdit par inspection de source les motifs de fabrication connus |
| Échec fermé Gemini | Confirmée | mark_no_gemini_pick efface tout pick avant appel ; validate-predictions.mjs --require-gemini |
| Déploiement FTP sans suppression massive | Confirmée | prepare-stale-match-deletions.mjs produit délibérément zéro suppression ; allowlist explicite de commandes put |
| Effet des exclusions sur le taux public | Confirmée | 546 entrées ; journées à 100 % (31/10 : 22/22 ; 03/11 : 8/8 ; 05/11 : 11/11 ; 07/11 : 24/24) précisément celles dont les pertes sont exclues ; archive du 05/11 conserve la perte Bayer Leverkusen - Marseille (BTTS Oui, 0-1, LOST, GOLD) absente de l'historique affiché |
| Graphe d'imports des composants morts | Confirmée | ~33 fichiers de src/components/bttsbet et src/app/vip non importés par aucune page |
| Classes CSS mortes | Confirmée par analyse statique | ~56 % des 752 classes de premier niveau de globals.css non référencées ; 497 doublons entre fichiers |

## Éléments NON vérifiés (hors périmètre d'un audit statique)

1. **Aucune exécution du site en production** : ni navigation réelle, ni rendu navigateur, ni test responsive, ni mesure Lighthouse/WebPageTest.
2. **Aucun appel réseau rejoué** vers ESPN, Gemini, TheSportsDB, IndexNow : les comportements d'API sont déduits du code.
3. **Secrets GitHub** : contenu non observable (noms des secrets vus dans les workflows, valeurs inaccessibles).
4. **Configuration Cloudflare réelle** (routing, règles, variables du worker) et **contenu de la base D1** : non observés.
5. **Serveur FTP LWS** : certificat réel, état du filesystem distant, quotas — non observés (le constat TLS vient des scripts, pas du serveur).
6. **Aucun audit de vulnérabilités des dépendances** (npm audit, scanners) n'a été lancé — l'audit statique ne couvre pas les CVE.
7. **Tests non exécutés** : les 500 tests n'ont pas été lancés ; leur santé est constatée par lecture, pas par exécution.
8. **Comportement à l'exécution des dépendances** (Next 16.1.3, React 19, Tailwind v4) : couvert uniquement indirectement.
9. **Le build n'a pas été rejoué** : la chaîne de génération du HTML exporté n'a pas été reproduite localement.

## Recommandations de vérification avant toute intervention

1. Exécuter la suite de tests complète (Vitest + Python) sur la branche main pour établir l'état vert/rouge réel de départ.
2. Lancer un build local (`npm run build`) et un audit npm avant de toucher aux dépendances.
3. Faire une mesure Lighthouse de base (mobile + desktop) des pages stratégiques pour avoir une référence avant refonte CSS.
4. Vérifier l'état réel du certificat FTP côté LWS (scripts/check-ftp-tls.py existe — le brancher).
5. Avant chaque modification d'une page protégée : confirmer que tests/seo-preservation.test.ts et les fixtures passent à l'identique.

## Statut de ce transfert d'audit

Les documents déposés dans docs/audit-glm-2026-11-15/ sont une redistribution intégrale du rapport d'audit du 15 novembre 2026 : aucune information technique n'a été supprimée ni résumée au point de perdre des détails ; les fichiers 01 à 08 réorganisent le contenu du rapport intégral (fichier 00) par thème, en ajoutant uniquement des éléments de contexte demandés par le propriétaire (inventaire des pages, distinction confirmé/hypothèse, zones protégées, baseline SEO gelée). L'audit lui-même est statique et daté : toute évolution du code après le commit 5fb08ef n'est pas couverte.

---

## Périmètre, sources et méthodologie d'origine (source : section 2)

## 2.1 Périmètre

L'audit couvre l'intégralité du dépôt prophete221/bttspredict au 15 novembre 2026 : 2 131 entrées d'arborescence, dont 1 669 fichiers répartis dans 462 dossiers, pour une taille totale de fichiers de 95,2 Mo (101 Mo extraits). Dix autres dépôts du compte ont été recensés (bttspredictonline, btts2027, prophetebeta, heybro, etc.) mais ne font pas l'objet de ce rapport. Le périmètre fonctionnel couvre le frontend Next.js, les scripts de génération de prédictions (Node et Python), le pipeline CI/CD GitHub Actions, le déploiement FTP, le worker Cloudflare de l'espace VIP, les données publiques JSON et les tests automatisés.

## 2.2 Méthodologie

La méthode est une lecture directe du code, volontairement indépendante de la documentation : le README (36 Ko), les rapports de projet (GLM_TASK_00x, docs/project/reports) et les commentaires n'ont été utilisés qu'a posteriori, comme éléments de comparaison. Les constats ont été établis en quatre passes : (1) inventaire statistique complet des fichiers par extension et par volume ; (2) lecture intégrale des fichiers critiques de sécurité (worker vip-api, panneau d'administration, contexte d'authentification, scripts FTP, workflows) ; (3) lecture systématique, dossier par dossier, des bibliothèques (src/lib), des pages et composants (src/app, src/components/bttsbet), des scripts et des tests ; (4) vérification croisée des affirmations sensibles sur les données publiques elles-mêmes (win-history.json, history-exclusions.json, archives de prédictions). Chaque problème cité dans ce rapport est adossé à un fichier et, dans la mesure du possible, à une ligne.

## 2.3 Limites

L'audit est statique : aucune exécution du site en production n'a été effectuée, aucun appel réseau vers les API tierces n'a été rejoué, et le comportement réel des dépendances à l'exécution n'est couvert qu'indirectement. Les éléments invisibles au code (configuration Cloudflare réelle, secrets GitHub, contenu de la base D1, serveur FTP LWS) n'ont pas été observés. Les conclusions portent sur le code committé, qui est la seule source observable.
