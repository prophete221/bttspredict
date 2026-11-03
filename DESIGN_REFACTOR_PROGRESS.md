# Progression de la refonte du design

## État

Les changements de refonte sont poussés uniquement sur `fix/partner-code-attribution`, basée sur le commit `81e5d3789f702707d84c67faf662f0b58d7c4724`. Les modes de fichiers d’origine sont conservés. Aucune Pull Request n’a été fusionnée; `main` et la production n’ont pas été touchés. Le SHA final et le résultat du contrôle Vercel Preview sont communiqués avec la livraison.

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

## Contrôle du Preview

Après le dernier push, vérifier que Vercel a créé un déploiement de type Preview pour le SHA final, qu’il est prêt, et que le SHA associé au déploiement correspond exactement au dernier commit de `fix/partner-code-attribution`. Communiquer le SHA complet, le lien direct du Preview et son état dans le retour à l’utilisateur.
