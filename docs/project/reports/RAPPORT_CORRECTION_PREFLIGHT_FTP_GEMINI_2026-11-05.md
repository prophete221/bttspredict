# Correctif du préflight FTP et déploiement Gemini/UI — 5 novembre 2026

## Résultat

Le blocage du préflight a été corrigé de façon ciblée et le correctif Gemini/UI a été déployé sur `main`. Le run [GitHub Actions #42125234994](https://github.com/prophete221/bttspredict/actions/runs/42125234994) a terminé avec succès le 5 novembre 2026 à 23:56:38 UTC. Le code de correction est le commit [`cc08038617a2bfd9d1659ee37f12fc7301c687d2`](https://github.com/prophete221/bttspredict/commit/cc08038617a2bfd9d1659ee37f12fc7301c687d2). Le workflow a ensuite créé le commit automatique de données [`9d809114e60c4e83777665871146525664d53394`](https://github.com/prophete221/bttspredict/commit/9d809114e60c4e83777665871146525664d53394), enfant direct du correctif.

## Cause du blocage et correctif

Le préflight précédent échouait dans `scripts/prepare-stale-match-deletions.mjs` parce qu’une assertion globale refusait tout export courant contenant une page Match déjà terminée. La page `ar/match/agf-vs-braga-2026-11-05.html` était une page historique terminée, mais elle figurait légitimement à la fois dans le manifeste de l’export courant et sur le serveur. Ce veto empêchait le FTP général avant tout transfert; il ne s’agissait pas d’une anomalie de Gemini ni d’une demande de suppression de la page.

Le correctif retire ce veto global et conserve explicitement tout chemin présent dans le manifeste courant avant d’évaluer les suppressions. Le périmètre d’effacement existant reste inchangé : seules les pages Match terminées, absentes de l’export courant et admissibles à la purge EN/AR peuvent être proposées; les pages sous `/match` à la racine ne sont toujours ni inventoriées ni supprimées. Les protections existantes et l’allowlist FTP restent en place.

Fichiers de code/tests modifiés dans le commit `cc080386` :

- `scripts/prepare-stale-match-deletions.mjs`
- `tests/stale-match-prune.test.ts`
- `tests/deployment-security.test.ts`

Le test de régression démontre qu’une page arabe terminée, présente dans le manifeste et l’inventaire FTP, n’est pas supprimée, tandis qu’une page terminée absente reste candidate selon la règle précédente.

## Contrôles et flux public

Le workflow a réussi les tests de régression (50 fichiers Vitest), les 25 tests Python de garde d’enrichissement narratif, lint, vérification TypeScript, validation des données et build statique. Le préflight a lui aussi réussi. Un test comportemental isolé du vrai planificateur et `git diff --check` ont réussi avant le push.

Gemini a produit une réponse structurée pour 22 candidats sur 24. Les 22 réponses étaient des pronostics; les deux candidats sans réponse valide ont été exclus. Le filtre a publié 22 sélections et aucune ligne empirique de repli. Après déploiement, `predictions.json` répond en HTTP 200 et contient 22 lignes; les 22 vérifiées portent `ai_source=gemini-stats-v1`, `ai_model=gemini-3.5-flash-lite`, `ai_response_status=pick` et `modelEngine=gemini-stats-v1`, avec une sélection imbriquée attribuée au même modèle Gemini.

Nuance vérifiée : `empiricalBttsRate` et `empiricalOver25Rate` restent disponibles comme métriques statistiques contextuelles dans le JSON; ils ne sont pas la sélection de pronostic. Le filtre de publication valide la provenance Gemini de chaque sélection et exclut les lignes sans réponse vérifiée. La suppression complète de ces champs contextuels n’a pas été demandée ni effectuée.

## FTP et vérification en production

Le run a utilisé le mode général (`codeOnly=false`) et préparé une allowlist de 1 756 fichiers (54 031 411 octets). Les 635/635 enregistrements de l’état distant ont été conservés; l’inventaire comptait 39 pages EN et 39 AR. Le plan de purge a compté **0 suppression** (0 octet), et le chemin AGF–Braga ne figure pas dans les suppressions.

L’artefact du run confirme `ftpExitCode=0`, `status=success`, 1 759 chemins confirmés et la présence de `ar/match/agf-vs-braga-2026-11-05.html` parmi les chemins transférés. Dans le manifeste précédent, la page mesurait 138 432 octets (empreinte SHA-256 préfixée `a1525aaa31d7f428`); le manifeste de déploiement indique 132 480 octets (empreinte `09b36232807e9814`). Le GET public de la [page AGF–Braga](https://bttspredict.com/ar/match/agf-vs-braga-2026-11-05.html) renvoie HTTP 200 et son empreinte correspond exactement au nouveau manifeste. Le [flux public](https://bttspredict.com/predictions.json) renvoie également HTTP 200. Le déploiement de `.htaccess`, le dépôt des preuves et la notification IndexNow ont réussi.

## Limite locale et décisions

L’installation locale `npm ci` a échoué avec `ENOSPC` car la table d’inodes de l’environnement était saturée, malgré 22 Go libres en capacité disque. Aucun autre worktree ou fichier existant n’a été nettoyé ou modifié. Les dépendances ont été installées et tous les contrôles complets ont réussi dans le runner GitHub Actions; le blocage local n’a donc pas interrompu la validation ni le déploiement.

Aucune décision supplémentaire n’est en attente pour le périmètre autorisé. Aucune modification d’URL, canonical, SEO, garde-fou de sécurité ou autre comportement applicatif n’a été introduite.
