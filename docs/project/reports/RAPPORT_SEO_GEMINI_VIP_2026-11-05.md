# Rapport — SEO, marchés VIP verrouillés et correction Gemini

**État prépublication (5 novembre 2026, 14:36 UTC) :** `origin/main` est toujours `83da0ff05335b4414c136105fd649be431afcf9e`; le run #1050 a été annulé avant build et FTP. La nouvelle correction des retries, ses tests, le README mis à jour et ce supplément sont locaux; aucun nouveau commit ni push n’a encore été créé. Le propriétaire a autorisé un seul déploiement après vérifications finales.

## État observé avant le premier correctif (5 novembre 2026 — historique)

- `https://bttspredict.com/robots.txt` et `https://bttspredict.com/sitemap.xml` répondaient en HTTP 200 lors de la vérification. Le sitemap en ligne contenait 61 URL uniques; les 61 réponses vérifiées étaient HTTP 200 sans redirection. Les alternatives linguistiques étaient présentes et les routes protégées `/`, `/en`, `/en/btts-and-over-2-5-predictions-today`, `/en/over-2-5/predictions/today` et `/en/ai-correct-score-predictions` figuraient dans le sitemap.
- Le sitemap source et ses URL/canonicals ont été laissés inchangés, puisqu’aucune lacune n’a été trouvée. Dans la correction locale, `public/robots.txt` conservait `Allow: /`, les exclusions `/api/` et `/admin`, et l’adresse du sitemap; la directive `Host: https://bttspredict.com` a été retirée. Cette modification locale n’était pas encore en production à ce stade; la préférence de domaine est appliquée par les redirections 301 HTTPS/non-www de `.htaccess`.
- La vérification locale `scripts/verify-seo.mjs` a relevé une description de 187 caractères sur `statistiques.html` (limite interne : 160). Aucun titre, texte, URL, canonical ou redirect de cette page n’a été modifié; une décision séparée est nécessaire si une correction éditoriale est souhaitée.
- La source `public/predictions.json` ne contenait pas de clé VIP. L’endpoint exporté incluait seulement un tableau `vipPreview` vide; le champ est retiré de la réponse publique par précaution. Le teaser prévu affiche des libellés génériques seulement, sans affiche, sélection, cote, signal ni probabilité.

## Sources

- [Yandex — annonce de 2018 sur la directive `Host`](https://yandex.ru/blog/webmaster/301-y-redirekt-polnostyu-zamenil-direktivu-host) : Yandex indique que la directive peut être supprimée ou laissée, car son robot l’ignore désormais, et que les redirections 301 doivent sélectionner le miroir principal.
- [Yandex — documentation `robots.txt`](https://yandex.com/support/webmaster/en/controlling-robot/robots-txt) : règles de disponibilité et directives prises en charge, notamment `Disallow`, `Sitemap` et `Allow`.
- [Google — spécification robots.txt](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec) : champs pris en charge par Google (`user-agent`, `allow`, `disallow`, `sitemap`) et limites d’application par hôte/protocole/port.
- Contrôles en ligne du [robots.txt](https://bttspredict.com/robots.txt) et du [sitemap](https://bttspredict.com/sitemap.xml).

## Premier état de tests et décisions en attente (historique, avant correction Gemini #937)

- Tests ciblés du teaser, des routes et de la frontière des données VIP : 26 tests réussis avant l’ajout du contrôle de l’endpoint public.
- Tests complets : 384 tests JavaScript/TypeScript et 12 tests Python réussis avant le dernier changement de l’endpoint; `npx tsc --noEmit` réussi; ESLint n’a signalé aucune erreur et un avertissement préexistant dans `BottomNavigation.tsx`.
- Build Next.js : réussi, 184 pages générées. L’audit SEO séparé a signalé la description de 187 caractères de `/statistiques` (hors échec du build); elle n’a pas été modifiée.
- À ce stade antérieur, commit final, résultat Gemini, exécution GitHub Actions et mise en ligne restaient à faire; les suppléments ci-dessous consignent l’avancement ultérieur.


## Supplément — validation prépublication (5 novembre 2026, 13:06 UTC)

### Portée appliquée

Le propriétaire a confirmé que tous les autres marchés restent verrouillés. Le commit source `18693ccb28bcb8fff3d8921a7829f17cffe3640f` (`fix: add locked VIP teasers and harden Gemini enrichment`), parent `cc76cd051cf9882c14c6869f05ab465756f63039`, ajoute exactement deux libellés de marchés VIP génériques et verrouillés dans les cartes gratuites FR/EN/AR. Le bouton ouvre le formulaire VIP existant; la validation manuelle du propriétaire reste obligatoire. Aucun choix futur VIP, cote, probabilité ou métadonnée de pronostic VIP n’est ajouté aux données publiques.

L’endpoint `/predictions.json` retire désormais aussi le champ vide `vipPreview`; son export est limité aux informations publiques de base, aux pronostics gratuits et aux statistiques. La directive `Host` a été retirée de `robots.txt`, tandis que `Allow: /`, les exclusions `/api/` et `/admin` et la déclaration du sitemap sont conservées. Le sitemap source reste inchangé : le contrôle public a trouvé 61 URL uniques, sans doublon, toutes les routes vérifiées répondant en HTTP 200. Aucun changement d’URL, canonical ou contenu éditorial n’a été fait. La description de `/statistiques`, longue de 187 caractères selon le contrôle local, demeure inchangée faute de justification Search Console dans cette mission.

Gemini demeure le moteur principal, avec les deux IDs recommandés par les réponses du fournisseur dans le diagnostic antérieur : `gemini-3.5-flash-lite`, puis `gemini-3.8-flash`. Aucun autre fournisseur n’est ajouté. Une réponse Gemini valide, y compris une abstention, est conservée; le fallback empirique local intervient uniquement en l’absence de réponse Gemini exploitable. Si des erreurs fournisseur surviennent et qu’aucun enrichissement n’est appliqué, le script écrit d’abord le fallback, émet un avertissement avec les codes API, puis sort en erreur; le workflow conserve son `continue-on-error` pour permettre les autres étapes. La clé Gemini n’a pas été lue ni modifiée dans cette mission.

### Vérifications locales

- Vitest : **47 fichiers réussis, 385 tests réussis**. Les nouveaux tests vérifient les deux seuls marchés génériques par carte, les libellés FR/EN/AR, l’ouverture du formulaire et la validation manuelle, le montage sur les variantes de cartes gratuites, ainsi que l’absence de clés VIP dans l’export JSON.
- Python : **12 tests réussis**, incluant réussite Gemini, abstention conservée, fallback après erreur fournisseur et IDs de modèle attendus.
- `npx tsc --noEmit` : réussi. ESLint : aucune erreur; un avertissement préexistant pour directive inutilisée dans `BottomNavigation.tsx:22`.
- `npm run build -- --webpack` : réussi, **184 pages statiques** générées. Le postbuild n’a nettoyé aucun fichier. L’optimiseur CSS signale des sélecteurs Tailwind arbitraires non échappés déjà présents dans `src/app/globals.css`; avertissement non bloquant.
- Vérification du JSON exporté : 37 pronostics gratuits; aucune clé `vip`, `vipPreview`, `vipPredictions`, `vipCount` ou `ai_exact_score`. `out/robots.txt` conserve le sitemap et ne contient plus de directive `Host`.
- `git diff --check` : réussi. Le HTML initial des routes gratuites n’inclut pas les cartes, qui sont montées par les composants clients après hydratation; la couverture du composant et des points de montage a été vérifiée par les tests et la source.

### État avant le premier push de cette mission (5 novembre, 13:06 UTC — historique)

Au moment de cette mise à jour, le commit source existe localement mais n’est pas encore poussé. Le dernier run GitHub Actions observé, `42013125937`, s’est terminé avec succès sur l’ancien commit `6d2e8a34…`; il ne contenait pas ce correctif. Aucun run de cette mission n’est encore lancé. Le push autorisé de la branche `main` doit déclencher une seule exécution complète; le build distant, le résultat Gemini, le transfert et les contrôles publics restent à confirmer. La cause d’une éventuelle limite de quota Gemini après remplacement de la clé appartient au projet fournisseur et n’est pas établie par les tests locaux.


## Supplément — journal exact du run #937 et correction Gemini (5 novembre 2026)

### Faits confirmés par le journal fourni

- Le run GitHub Actions **#937** (ID `41133809785`, commit `407c7180767d879496178d58465d1eb7348476d2`) a terminé avec succès en 2 h 24 min 59 s. Son étape Gemini a duré **2 min 04 s**.
- `gemini-flash-lite-latest` a traité 40 pronostics en lots séquentiels de 3 (dernier lot d’un match). Une erreur 503 est apparue sur le lot 13–15, puis le retry du même modèle a réussi. Le journal confirme **40/40** décisions Gemini et **2** fallbacks empiriques locaux.
- Le run #937 et le run annulé **#1049** (`42037614558`, commit `dd54e40a3b00a762c084ab1c571bd2750f513360`) ont tous deux installé `google-genai 2.34.0`. Le journal fourni ensuite pour #1049 indique **0/37** décisions Gemini, **24** erreurs fournisseur 503, puis l’activation du fallback local sur les 37 matchs. Le step Gemini a terminé en erreur, mais `continue-on-error` a laissé le workflow poursuivre le build et la préparation FTP. Le run a été annulé avant le transfert des fichiers; aucun déploiement FTP de cette révision n’est confirmé.
- La cause d’une différence de disponibilité du service ou de compte API entre ces exécutions n’est pas établie. La clé n’a pas été consultée ni modifiée.

### Correction adoptée

La méthode est ramenée au chemin effectivement attesté par #937 : `gemini-flash-lite-latest` comme **unique** modèle Gemini; lots de 3, `MAX_RETRIES=2`, délai de retry de 5 s, attente 20 s pour les réponses de limitation de débit, budget d’enrichissement de 420 s et timeout GitHub de 10 min restent inchangés. Le SDK est épinglé à `google-genai==2.34.0`, la version observée au run #937, et les sorties Python sont rendues non bufferisées afin que les prochains logs montrent les tentatives avant la fin de l’étape. Le fallback empirique demeure local et n’intervient que si Gemini ne fournit pas de résultat exploitable; une abstention Gemini utilisable est conservée. Aucun autre fournisseur n’est ajouté.

À l’état de la première note de correction, le patch aligné sur #937 était encore local et non publié; ce constat est historique. Les contrôles et l’extension complète du README sont consignés plus bas. Le résultat Gemini du prochain run, le commit de données, le transfert FTP et le site public restent à vérifier jusqu’à la fin de cette publication.


### Contrôles de cette révision (5 novembre 2026, avant publication)

- Python : **13 tests réussis**, dont le test simulant un 503 transitoire puis un retry réussi sur le même alias Gemini.
- Vitest : **47 fichiers et 385 tests réussis**.
- `npx tsc --noEmit` : réussi. ESLint : **0 erreur**; un avertissement existant pour une directive `eslint-disable` inutilisée dans `src/components/bttsbet/BottomNavigation.tsx:22`.
- `npm run build -- --webpack` : réussi, **184 pages statiques** générées. Les avertissements CSS Tailwind présents dans `src/app/globals.css` restent non bloquants.
- README : documentation complète du fonctionnement source-confirmé — parcours, routes, données, vérification des résultats, workflow/FTP, locales/SEO, affiliation, VIP et teaser — avec le repère #937. Aucun contenu SEO, URL ou canonical du site n’a été modifié.
- Commit source poussé sur `main` : `5a82d16c1bd60f23b326d017a81356a5df940b6f` (`fix(gemini): restore run 937 method and document current site`); le bit exécutable historique de `scripts/enrich_predictions.py` est préservé. Le commit de rapport prépublication est `83da0ff05335b4414c136105fd649be431afcf9e`.
- `git diff --check` : réussi. Résultat du push et du run #1050 détaillé ci-dessous; le rendu public n’a pas reçu les fichiers de cette révision.

## Supplément — résultat final du run #1050 (5 novembre 2026)

- Le push unique a envoyé les commits `5a82d16c1bd60f23b326d017a81356a5df940b6f` et `83da0ff05335b4414c136105fd649be431afcf9e` sur `main`. Il a déclenché un seul run principal, **#1050**, ID `42042448424`, HEAD `83da0ff05335b4414c136105fd649be431afcf9e`.
- Le journal complet indique **Gemini applied 0/37**, **39 erreurs fournisseur 503** avec l’unique alias `gemini-flash-lite-latest`, puis `local fallback on 37 matches`. Le step s’est affiché comme réussi grâce à `continue-on-error`, bien que le script ait signalé l’absence de tout enrichissement Gemini.
- La finalisation, la vérification des résultats, l’agrégation d’historique et les exclusions publiques ont réussi; les tests de régression, tests Python, lint et typecheck ont également réussi. L’étape `Update open licensed team context` était active puis a été annulée. La cause de l’annulation n’est pas établie.
- Après cette annulation, validation finale, build statique, correction `lang`, commit des données, manifeste, préflight et allowlist FTP, transfert FTP, `.htaccess` et IndexNow ont tous été ignorés. Aucun commit de données n’a été créé; le SHA distant `main` demeure `83da0ff05335b4414c136105fd649be431afcf9e`.
- **Déploiement : non effectué.** Le site en production n’a pas reçu le teaser ni le changement Gemini de cette révision; la dernière publication confirmée demeure le run #1041 dans le suivi existant. La vérification de la proposition Perplexity sur un « nouveau site » est suspendue jusqu’à une publication autorisée et un contrôle public.
- Au moment de la consignation initiale du résultat #1050, aucun nouvel essai, changement de fournisseur ou correction de méthode n’avait été lancé; la correction autorisée ultérieurement est détaillée ci-dessous.

## Audit des affirmations publiques et corrections C/F (5 novembre 2026, 14:50 UTC)

Vérification faite sur le site réellement en ligne avant toute édition. Les valeurs ci-dessous proviennent des pages publiques et des fichiers `predictions.json` / `win-history.json` servis en production.

- **C — confirmé.** L'accueil affichait « Modèle + xG » dans la bande de signaux du hero, et la carte « Analyse structurée » annonçait « Forme, buts, BTTS, xG et modèle statistique ». Or la méthodologie indique que les λ sont estimés à partir des buts récents et ne sont pas des xG fournis par un tiers; dans `predictions.json`, `xgHome`/`xgAway` sont égaux aux λ du modèle. Correction appliquée : « Forme récente + λ » (FR), « Recent form + λ » (EN), « اللياقة الحديثة + λ » (AR), avec une infobulle précisant que λ est modélisé sur la forme récente sans flux xG tiers; le pilier d'analyse parle désormais de forme récente, buts marqués/encaissés et buts attendus (λ).
- **D — prémisse fausse, non modifié.** La section « Des résultats consultables » affiche déjà 476 matchs terminés, 381 gagnés, 95 perdus et 80,0 % en production. Le texte « Suivi en cours de constitution » ne s'applique qu'à la ligne **Score exact**, qui n'a effectivement aucune archive vérifiée. Remplacer ce libellé par les chiffres globaux aurait introduit une affirmation inexacte; il est conservé tel quel.
- **E — déjà en place, non modifié.** `/statistiques` affiche « Dernière mise à jour des données : 5 nov. 2026, 11:36 », calculée depuis `generatedAt` de `win-history.json` (`StatistiquesClient.tsx`, variable `updatedLabel`). Aucun ajout nécessaire.
- **F — confirmé.** La page méthodologie affirmait exclure les compétitions « internationales » alors que 13 des 37 pronostics publics du 5 novembre étaient en UEFA Conference League (7) et UEFA Europa League (6). La section 6 distingue maintenant les coupes européennes de clubs, incluses lorsque les données des deux équipes sont suffisantes, des compétitions de sélections nationales, matchs amicaux et coupes nationales atypiques, qui restent exclues.
- **Non retenu.** « Plateforme N°1 Mondiale » et « surbets » restent inchangés sur décision explicite du propriétaire (options A et B non approuvées). Aucune URL, canonical, redirection, métadonnée ou copie SEO protégée n'a été modifiée.

### Validation de cette révision
- `npm test` : **47 fichiers, 385 tests réussis**. L'empreinte i18n figée de `tests/seo-preservation.test.ts` a été mise à jour pour la seule copie approuvée (pilier d'analyse), avec commentaire daté; le garde-fou reste actif sur tout le reste.
- `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover` : tests Gemini/fallback réussis.
- `npx tsc --noEmit` : réussi. ESLint : 0 erreur, un avertissement préexistant (`BottomNavigation.tsx:22`).
- `npm run build -- --webpack` : réussi, 184 pages; l'export contient « Forme récente + λ » (FR/EN/AR) et ne contient plus « Modèle + xG »; la méthodologie contient la nouvelle politique UEFA.
- Export public : `robots.txt` sans directive `Host`, sitemap inchangé à 61 URL, `predictions.json` sans champ VIP et les trois pages de pronostics ne contiennent aucun libellé VIP dans le HTML initial.
