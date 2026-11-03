# Progression de la refonte du design

## État

Les changements sont réalisés localement sur `fix/partner-code-attribution`, à partir du commit `81e5d3789f702707d84c67faf662f0b58d7c4724`. Aucun changement n’a été poussé, fusionné dans `main` ou déployé en production. L’aperçu Vercel demandé reste à créer après autorisation explicite du push de cette branche.

## Travail effectué

- Refonte du popup cadeau en panneau illustré, sobre et responsive. Les actions Linebet et 1xBet sont séparées visuellement, avec les codes confirmés `VISION221` et `vipbtts`, un bouton de fermeture accessible et une composition adaptée au français, à l’anglais et à l’arabe/RTL.
- Création d’une navigation de marchés réutilisable et traduite, intégrée à l’accueil et aux principales portes d’entrée des pronostics. Les pages BTTS, Over 2,5, score exact, marché combiné, demain et l’analyse de match sont reliées entre elles.
- Recomposition des héros, filtres, cartes et appels à l’action sur les pages du jour, le score exact, le marché combiné, le guide BTTS et les deux pages statistiques.
- Ajout de la page BTTS demain en anglais et en arabe. Son texte précise que les matchs apparaissent au fur et à mesure de la publication des données; il ne promet pas de filtre de date qui ne serait pas disponible.
- Les flux de données, filtres de matchs, calculs, liens affiliés, événements de suivi et statuts de résultats existants sont conservés. Les tableaux statistiques continuent d’afficher « Données en préparation » plutôt que des taux inventés.

## Contrôle et validation

- Build Next.js réussi; les 892 pages statiques ont été générées, dont les nouvelles routes EN/AR de BTTS demain.
- `npx tsc --noEmit` réussi.
- Tests: 203 réussis sur 29 fichiers.
- ESLint: aucune erreur; 4 avertissements `no-location-assign-relative-destination` dans `MobileTabBar.tsx` et `StickyVipBandeau.tsx`.
- Contrôle visuel automatisé: 48 captures de pages en FR/EN/AR (1440×950 et 375×812) et 6 captures du popup (desktop et 320×568). Toutes les pages contrôlées répondent en 200, sans débordement horizontal ni erreur de console; le bouton de fermeture du popup fonctionne dans les trois langues. Les planches de contact et captures individuelles sont remises séparément pour revue.
- `git diff --check` sans erreur.

## À faire après autorisation

Créer le commit et pousser uniquement `fix/partner-code-attribution` afin de générer un nouvel aperçu Vercel. Cette étape n’est pas effectuée tant que l’autorisation explicite n’a pas été donnée. Aucun merge dans `main` et aucun déploiement production ne sont prévus.
