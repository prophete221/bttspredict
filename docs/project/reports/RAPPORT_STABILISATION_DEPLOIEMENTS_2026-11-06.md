# Stabilisation des échecs de déploiement — 6 novembre 2026

## Résultat

Le dépôt était sur `main`, au commit distant `a3d2a33fdfa6c806122640f83e28465089317b10`. Le correctif local est le commit [`24383c3fa2f6fc7b513aad8bc65d6458ce77b011`](https://github.com/prophete221/bttspredict/commit/24383c3fa2f6fc7b513aad8bc65d6458ce77b011), intitulé `test: isolate live history regression fixture`. Il n’a pas été poussé. Aucun workflow GitHub n’a été déclenché par cette mission et aucune action de production n’a été effectuée.

## Causes établies

- [Run #1060](https://github.com/prophete221/bttspredict/actions/runs/42112873446), sur `50ff7516`, a échoué à l’étape **Prepare safe FTP state and targeted Match cleanup**, pas aux tests Gemini. Le préflight a refusé la page `ar/match/agf-vs-braga-2026-11-05.html` parce qu’elle était terminée, alors qu’elle figurait dans l’export courant. Le planificateur s’est arrêté avant tout transfert FTP. Cette régression avait déjà été corrigée dans [`cc080386`](https://github.com/prophete221/bttspredict/commit/cc08038617a2bfd9d1659ee37f12fc7301c687d2), qui conserve les pages terminées présentes dans l’export courant. [Le run #1061](https://github.com/prophete221/bttspredict/actions/runs/42125234994) a ensuite réussi, y compris les tests, le build, le préflight, l’allowlist et le transfert FTP.
- [Run #1062](https://github.com/prophete221/bttspredict/actions/runs/42142810505), planifié sur `a3d2a33f`, a achevé les mises à jour ESPN/Gemini et les contrôles de données, puis a échoué à `npm test`. L’unique échec était `tests/live-consistency.test.ts`: il exigeait au moins deux entrées du match Heidenheim–Osnabrück du 8 août dans `public/win-history.json`, mais l’historique généré pendant ce run n’en contenait plus (`expected 0 to be greater than or equal to 2`). Le test lisait donc le jeu public glissant au lieu de tester uniquement la normalisation qu’il était censé couvrir. Le pipeline ne conserve et ne calcule que les 90 dernières archives (`prune-archives.mjs` et `update-win-history.mjs`); lorsqu’une nouvelle archive fait sortir celle du 8 août de cette fenêtre, l’assertion fixe devient fausse. Ce n’était pas un échec de Gemini ni une validation de données invalide.

## Correctif minimal

Seul `tests/live-consistency.test.ts` a été modifié. Le test installe maintenant, dans un répertoire temporaire, deux entrées contrôlées (marchés BTTS et Over 2.5, score 4–3), avec le nom `Osnabrück` accentué, puis redirige le répertoire courant vers cette fixture. Il continue ainsi de vérifier le rapprochement insensible aux accents et la normalisation des marchés, indépendamment de la rotation des données publiques. La fixture et le mock sont nettoyés après le test.

Aucun code de production, workflow, réglage FTP, garde Gemini, données publiques, URL, canonical ou contenu SEO n’a changé.

## Vérifications locales

- Test ciblé : 2 tests réussis.
- Vitest complet : 50 fichiers réussis; 391 tests réussis, 16 ignorés.
- Tests Python prévus par le workflow : 25 réussis.
- `npm run lint` : 0 erreur; 5 avertissements non bloquants dans les fichiers de navigation/VIP, hors du fichier modifié.
- `tsc --noEmit` : réussi.
- `git diff --check` : réussi.
- Build statique local non lancé : le changement ne touche qu’un test et le prébuild peut réécrire des données publiques; le build de production du run #1061 avait déjà réussi.

## Décision en attente

Le commit correctif et ce rapport sont uniquement locaux sur `main`. Le dépôt local est en avance de deux commits sur `origin/main` (le correctif, puis ce rapport). Ne pas pousser sans autorisation explicite : une modification de test n’est pas exclue par `paths-ignore: public/**`, donc pousser vers `main` déclencherait le workflow de déploiement. L’autorisation de pousser et celle de lancer un déploiement doivent être obtenues avant toute action distante.
