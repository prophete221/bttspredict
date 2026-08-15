# BTTSPredict

**BTTSPredict** est une plateforme statique internationale consacrée aux prédictions **BTTS**, **Over 2,5** et **score exact** sur des matchs de football internationaux. Le site publie des sélections horodatées, un historique public des résultats et un espace VIP avec des combinés quotidiens fondés sur des cotes bookmaker vérifiées.

> BTTSPredict est un site informatif et d’affiliation. Il ne prend pas de paris, ne collecte pas de fonds et ne garantit aucun résultat futur. Les paris sportifs comportent un risque financier ; l’utilisateur doit jouer de manière responsable et respecter l’âge légal applicable.

## Vue d’ensemble technique

| Élément | Implémentation actuelle |
|---|---|
| Framework | Next.js 16 avec App Router et TypeScript |
| Rendu | Export statique vers `out/` pour hébergement FTP |
| Style | Tailwind CSS v4 et styles globaux dans `src/app/globals.css` |
| Interface | React, Framer Motion et composants réutilisables dans `src/components/` |
| Internationalisation | Français par défaut, anglais sous `/en/` et arabe sous `/ar/` avec support RTL |
| Fuseau métier | `Africa/Dakar` pour les dates de matchs et les données quotidiennes |
| Données | Fichiers JSON versionnés dans `public/` et `public/predictions-archive/` |
| Déploiement | GitHub Actions puis transfert FTP vers l’hébergement LWS |
| Tests | Vitest, ESLint et vérification TypeScript |

## Démarrage local

Le projet nécessite Node.js 22 ou une version compatible avec la configuration du dépôt.

```bash
npm ci --legacy-peer-deps
npm run dev
```

Le serveur de développement est disponible sur [http://localhost:3000](http://localhost:3000).

| Commande | Fonction |
|---|---|
| `npm run dev` | Lance Next.js en mode développement sur le port 3000 |
| `npm run build` | Génère le build statique dans `out/` |
| `npm run start` | Sert le dossier `out/` localement sur le port 3000 |
| `npm test` | Exécute la suite Vitest en mode ponctuel |
| `npm run test:watch` | Lance Vitest en mode interactif |
| `npm run test:ci` | Exécute Vitest avec un rapport détaillé |
| `npm run lint` | Exécute ESLint sur le dépôt |
| `npx tsc --noEmit` | Vérifie les types TypeScript sans produire de fichiers |

## Structure du dépôt

```text
src/
  app/                  Pages App Router, layouts, metadata et routes dynamiques
  components/           Composants d’interface partagés, dashboard et VIP
  hooks/                Hooks React réutilisables
  lib/                  Internationalisation, dates Dakar et constantes métier
public/
  predictions.json      Jeu de prédictions courant exposé publiquement
  vip-combos.json       Combinés VIP du jour
  win-history.json      Historique public des résultats
  transfers.json        Données de transferts publiées
  predictions-archive/  Archives quotidiennes des prédictions
  robots.txt             Directives pour les robots
  sitemap.xml            Sitemap public
scripts/
  quick-update-predictions.mjs  Génération et mise à jour des prédictions
  update-vip-combos.mjs         Génération des combinés VIP à partir des cotes
  verify-results.mjs             Vérification des matchs terminés
  update-win-history.mjs         Mise à jour de l’historique
  validate-predictions.mjs      Validation du schéma des données
  scrape-transfers.mjs          Mise à jour des transferts
.github/workflows/
  deploy.yml             Génération quotidienne, tests, build et déploiement FTP
```

## Routes principales

Les routes françaises historiques restent disponibles sans préfixe. Les versions anglaise et arabe utilisent respectivement `/en/` et `/ar/`.

| Route | Rôle |
|---|---|
| `/` | Accueil de la plateforme |
| `/btts/predictions/today` | Pronostics BTTS du jour |
| `/over-2-5/predictions/today` | Pronostics Over 2,5 du jour |
| `/ai-correct-score-predictions` | Prédictions de score exact |
| `/match/[slug]` | Fiche détaillée d’un match généré statiquement |
| `/vip` | Dashboard VIP et combinés du jour |
| `/historique` | Historique des résultats vérifiés |
| `/statistiques` | Statistiques publiques |
| `/methodologie` | Méthodologie et limites du système |
| `/code-promo-linebet-senegal` | Page affiliée Linebet |
| `/bonus-888starz` | Page affiliée 888Starz |
| `/sitemap.xml` | Sitemap généré pour l’indexation |
| `/robots.txt` | Directives d’exploration |
| `/predictions.json` | Données publiques du jour |

Les routes dynamiques de match utilisent des slugs normalisés et sont générées par `generateStaticParams`. Les caractères accentués des noms d’équipes sont pris en charge, notamment `Fürth` et `Vitória`.

## Internationalisation et dates

Le français constitue la langue par défaut. Les dictionnaires sont centralisés dans `src/lib/i18n.ts`, tandis que les pages localisées sont générées sous `/en/` et `/ar/`. L’interface arabe applique le sens de lecture RTL sans dupliquer la logique métier.

Toutes les dates qui influencent le comportement visible du produit utilisent le fuseau **`Africa/Dakar`**, centralisé dans `src/lib/dakar-date.ts`. Cela concerne notamment la séparation entre matchs du jour et matchs à venir, les indications « aujourd’hui » et « demain », les statuts du ticker et la date des combinés VIP.

## Données de prédictions

Le fichier `public/predictions.json` constitue le jeu courant publié par le site. Les archives quotidiennes sont conservées sous `public/predictions-archive/` afin de permettre la vérification historique.

Le validateur `scripts/validate-predictions.mjs` contrôle notamment les dates ISO, les champs obligatoires et, dans le workflow de production, la présence d’un horodatage `lastUpdated`. Les prédictions affichées comme celles du jour doivent correspondre à la date métier de Dakar ; les matchs futurs restent dans les sections à venir.

Les sources et résultats sont traités avec prudence : une donnée indisponible n’est pas remplacée par une valeur fictive, une statistique non vérifiable n’est pas présentée comme une précision réelle et les résultats gagnés comme perdus restent représentés dans l’historique public.

## Combinés VIP du jour

Le générateur `scripts/update-vip-combos.mjs` produit `public/vip-combos.json`. Il utilise les matchs du jour, filtre les marchés **à temps réglementaire** et ne retient que les sélections compatibles avec le pipeline de cotes bookmaker configuré.

| Carte | Libellé affiché |
|---|---|
| Cible proche de 2 | `Combiné cote 2 du jour · [date]` |
| Cible proche de 5 | `Combiné cote 5 du jour · [date]` |

Les cotes affichées sont les cotes reçues du fournisseur configuré, et non des estimations calculées artificiellement. La source actuelle est **Odds-API.io** lorsque la clé serveur est disponible. La clé ne doit jamais être placée dans le code ou dans `public/`.

En cas de réponse HTTP 429 après une récupération valide, le générateur conserve uniquement les combinés vérifiés du même jour et dont les deux cibles sont présentes. Il ne réutilise jamais une donnée d’une journée précédente. Si aucune donnée valide n’est disponible, le dashboard affiche un état indisponible explicite.

## Déblocage VIP et WhatsApp

Le déblocage VIP est géré par `src/components/bttsbet/VipUnlockModal.tsx`. Le parcours demande le bookmaker et le **Player ID**, effectue une vérification locale et redirige ensuite vers WhatsApp. Le message généré inclut le bookmaker, l’ID joueur saisi et le code promo sélectionné.

| Partenaire | Code promo |
|---|---|
| Linebet | `VISION221` |
| 888Starz | `vision221` |

Les conditions commerciales, les bonus et les dépôts minimums doivent être vérifiés directement auprès du partenaire. Ils peuvent évoluer et ne constituent pas une garantie de gain.

## Pipeline GitHub Actions et déploiement

Le workflow `.github/workflows/deploy.yml` est déclenché sur les changements de `main` et contrôle séparément les pull requests. Une pull request exécute les tests, le lint, le typecheck et le build sans déclencher de transfert FTP de production.

Sur `main`, le workflow effectue les opérations suivantes :

1. Installe les dépendances avec `npm ci --legacy-peer-deps`.
2. Met à jour les prédictions depuis les sources publiques configurées.
3. Enrichit les données lorsque les secrets correspondants sont disponibles.
4. Génère les combinés VIP depuis les cotes bookmaker configurées.
5. Vérifie les résultats terminés et met à jour l’historique.
6. Met à jour les transferts lorsque la source est disponible.
7. Valide `public/predictions.json`.
8. Construit l’export statique avec `npm run build`.
9. Copie les fichiers de routage nécessaires dans `out/`.
10. Committe les données générées lorsqu’elles ont changé.
11. Nettoie de manière prudente les anciens répertoires de build `_next/` sur le serveur FTP.
12. Transfère `out/` vers l’hébergement LWS.
13. Notifie IndexNow après le déploiement.

Les secrets sont configurés dans GitHub Actions et ne doivent pas être ajoutés au dépôt. Les noms actuellement utilisés par le workflow incluent notamment `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `ODDS_API_KEY` et les identifiants nécessaires aux sources optionnelles.

## SEO, accessibilité et fichiers publics

Les métadonnées sont définies dans les layouts et pages App Router. Les routes prioritaires disposent de titres localisés, de données structurées lorsque nécessaire et d’alternatives textuelles pour les logos et images. Les fichiers publics suivants participent à l’exploration et au contexte du site :

| Fichier | Fonction |
|---|---|
| `public/robots.txt` | Règles pour les robots d’exploration |
| `public/sitemap.xml` | Liste des URLs canoniques publiées |
| `public/llms.txt` | Contexte synthétique destiné aux assistants IA |
| `public/ai.txt` | Informations complémentaires pour les systèmes IA |
| `public/manifest.json` | Métadonnées d’installation et d’interface |

Après une modification de route ou de metadata, vérifier le build statique et les fichiers générés dans `out/` avant déploiement.

## Tests et vérifications recommandées

Avant une pull request, exécuter les contrôles suivants :

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
git diff --check
```

Pour une modification touchant les dates, vérifier au minimum un environnement navigateur dont le fuseau diffère de Dakar. Pour une modification du générateur VIP, vérifier la date du payload, la présence des deux cibles, les marchés à temps réglementaire et le comportement sur réponse HTTP 429.

## Limites et responsabilité

BTTSPredict ne fournit pas de conseil financier personnalisé et ne promet pas de performance future. Les probabilités, scores exacts, marchés BTTS et marchés Over 2,5 sont des estimations produites à partir des données disponibles au moment de la publication. Une absence de donnée doit rester visible comme telle plutôt qu’être remplacée par une affirmation non vérifiable.

## Références

[1]: https://nextjs.org/docs "Documentation officielle Next.js"
[2]: https://nextjs.org/docs/app/building-your-application/deploying/static-exports "Next.js — Static Exports"
[3]: https://docs.github.com/en/actions "Documentation GitHub Actions"
[4]: https://www.odds-api.io/ "Odds-API.io"
[5]: https://www.bttspredict.com/ "BTTSPredict — site public"

## Licence et propriété

Le code applicatif et la marque BTTSPredict sont propriétaires. Les données publiques utilisées par les scripts doivent respecter les conditions des sources correspondantes. Aucune partie de ce README ne constitue une garantie de résultat de pari.
