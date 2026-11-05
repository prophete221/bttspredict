# Rapport — SEO, marchés VIP verrouillés et correction Gemini

**État :** validation locale en cours; aucun commit ni déploiement issu de cette mission à ce stade.

## Faits vérifiés

- `https://bttspredict.com/robots.txt` et `https://bttspredict.com/sitemap.xml` répondaient en HTTP 200 lors de la vérification. Le sitemap en ligne contenait 61 URL uniques; les 61 réponses vérifiées étaient HTTP 200 sans redirection. Les alternatives linguistiques étaient présentes et les routes protégées `/`, `/en`, `/en/btts-and-over-2-5-predictions-today`, `/en/over-2-5/predictions/today` et `/en/ai-correct-score-predictions` figuraient dans le sitemap.
- Le sitemap source et ses URL/canonicals ont été laissés inchangés, puisqu’aucune lacune n’a été trouvée. `robots.txt` conservait `Allow: /`, les exclusions `/api/` et `/admin`, et l’adresse du sitemap. La directive `Host: https://bttspredict.com` a été retirée; la préférence de domaine est déjà appliquée par les redirections 301 HTTPS/non-www de `.htaccess`.
- La vérification locale `scripts/verify-seo.mjs` a relevé une description de 187 caractères sur `statistiques.html` (limite interne : 160). Aucun titre, texte, URL, canonical ou redirect de cette page n’a été modifié; une décision séparée est nécessaire si une correction éditoriale est souhaitée.
- La source `public/predictions.json` ne contenait pas de clé VIP. L’endpoint exporté incluait seulement un tableau `vipPreview` vide; le champ est retiré de la réponse publique par précaution. Le teaser prévu affiche des libellés génériques seulement, sans affiche, sélection, cote, signal ni probabilité.

## Sources

- [Yandex — annonce de 2018 sur la directive `Host`](https://yandex.ru/blog/webmaster/301-y-redirekt-polnostyu-zamenil-direktivu-host) : Yandex indique que la directive peut être supprimée ou laissée, car son robot l’ignore désormais, et que les redirections 301 doivent sélectionner le miroir principal.
- [Yandex — documentation `robots.txt`](https://yandex.com/support/webmaster/en/controlling-robot/robots-txt) : règles de disponibilité et directives prises en charge, notamment `Disallow`, `Sitemap` et `Allow`.
- [Google — spécification robots.txt](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec) : champs pris en charge par Google (`user-agent`, `allow`, `disallow`, `sitemap`) et limites d’application par hôte/protocole/port.
- Contrôles en ligne du [robots.txt](https://bttspredict.com/robots.txt) et du [sitemap](https://bttspredict.com/sitemap.xml).

## Tests et décisions en attente

- Tests ciblés du teaser, des routes et de la frontière des données VIP : 26 tests réussis avant l’ajout du contrôle de l’endpoint public.
- Tests complets : 384 tests JavaScript/TypeScript et 12 tests Python réussis avant le dernier changement de l’endpoint; `npx tsc --noEmit` réussi; ESLint n’a signalé aucune erreur et un avertissement préexistant dans `BottomNavigation.tsx`.
- Build Next.js : réussi, 184 pages générées. Le contrôle SEO post-build reste en échec sur la description de 187 caractères de `/statistiques`.
- Commit final, résultat Gemini, exécution GitHub Actions et contrôles de mise en ligne : à renseigner après la publication autorisée.


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

### État avant push et décisions

Au moment de cette mise à jour, le commit source existe localement mais n’est pas encore poussé. Le dernier run GitHub Actions observé, `42013125937`, s’est terminé avec succès sur l’ancien commit `6d2e8a34…`; il ne contenait pas ce correctif. Aucun run de cette mission n’est encore lancé. Le push autorisé de la branche `main` doit déclencher une seule exécution complète; le build distant, le résultat Gemini, le transfert et les contrôles publics restent à confirmer. La cause d’une éventuelle limite de quota Gemini après remplacement de la clé appartient au projet fournisseur et n’est pas établie par les tests locaux.
