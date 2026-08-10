# Tâche 004 — Statistiques sourcées

## Valeurs retirées, remplacées ou conservées

### Page `/over-2-5/statistics` — `src/app/over-2-5/statistics/page.tsx`

| # | Fichier:Ligne | Ancienne valeur | Action | Source réelle ou raison |
|---|---|---|---|---|
| 1 | `:48` | `avgGoals: 3.05` (Bundesliga) | Remplacé par `"À VÉRIFIER"` | Aucun appel API ESPN dans le fichier — chiffre codé en dur présenté à tort comme "Source: ESPN Soccer scoreboard" dans le commentaire |
| 2 | `:48` | `over25Rate: 0.58` (Bundesliga) | Remplacé par `"À VÉRIFIER"` | Idem — non sourcé |
| 3 | `:49` | `avgGoals: 3.15` (Eredivisie) | Remplacé par `"À VÉRIFIER"` | Idem |
| 4 | `:49` | `over25Rate: 0.57` (Eredivisie) | Remplacé par `"À VÉRIFIER"` | Idem |
| 5 | `:50` | `avgGoals: 2.90` (2. Bundesliga) | Remplacé par `"À VÉRIFIER"` | Idem |
| 6 | `:50` | `over25Rate: 0.57` (2. Bundesliga) | Remplacé par `"À VÉRIFIER"` | Idem |
| 7 | `:51` | `avgGoals: 3.10` (MLS) | Remplacé par `"À VÉRIFIER"` | Idem |
| 8 | `:51` | `over25Rate: 0.56` (MLS) | Remplacé par `"À VÉRIFIER"` | Idem |
| 9 | `:52` | `avgGoals: 2.85` (Jupiler Pro League) | Remplacé par `"À VÉRIFIER"` | Idem |
| 10 | `:52` | `over25Rate: 0.55` (Jupiler Pro League) | Remplacé par `"À VÉRIFIER"` | Idem |
| 11 | `:53` | `avgGoals: 2.80` (Austrian Bundesliga) | Remplacé par `"À VÉRIFIER"` | Idem |
| 12 | `:53` | `over25Rate: 0.54` (Austrian Bundesliga) | Remplacé par `"À VÉRIFIER"` | Idem |
| 13 | `:54` | `avgGoals: 2.82` (Premier League) | Remplacé par `"À VÉRIFIER"` | Idem |
| 14 | `:54` | `over25Rate: 0.55` (Premier League) | Remplacé par `"À VÉRIFIER"` | Idem |
| 15 | `:55` | `avgGoals: 2.78` (Swiss Super League) | Remplacé par `"À VÉRIFIER"` | Idem |
| 16 | `:55` | `over25Rate: 0.54` (Swiss Super League) | Remplacé par `"À VÉRIFIER"` | Idem |
| 17 | `:56` | `avgGoals: 2.72` (Liga Portugal) | Remplacé par `"À VÉRIFIER"` | Idem |
| 18 | `:56` | `over25Rate: 0.55` (Liga Portugal) | Remplacé par `"À VÉRIFIER"` | Idem |
| 19 | `:57` | `avgGoals: 2.68` (Championship) | Remplacé par `"À VÉRIFIER"` | Idem |
| 20 | `:57` | `over25Rate: 0.56` (Championship) | Remplacé par `"À VÉRIFIER"` | Idem |
| 21 | `:58` | `avgGoals: 2.65` (Scottish Premiership) | Remplacé par `"À VÉRIFIER"` | Idem |
| 22 | `:58` | `over25Rate: 0.53` (Scottish Premiership) | Remplacé par `"À VÉRIFIER"` | Idem |
| 23 | Commentaire `:45-46` | "Source: ESPN Soccer scoreboard (public, no API key) — league avgGoals profile. These are LIFETIME league averages, not invented success rates." | Supprimé | Le commentaire prétendait une source ESPN que le code ne réalise pas |
| 24 | Texte header `:80` | "Données issues des saisons récentes, sources ESPN publiques" | Remplacé par "Les moyennes historiques et taux par ligue ne sont pas affichés tant qu'aucune source vérifiable n'est intégrée au build" | L'ancien texte prétendait une source non prouvée |
| 25 | Texte footer `:111` | "Source : ESPN Soccer scoreboard (données publiques). Moyennes calculées sur les saisons récentes. Taux Over 2,5 = pourcentage de matchs avec ≥ 3 buts." | Remplacé par "Données historiques non disponibles — à intégrer via source vérifiable (ex. API ESPN au build time). Aucune garantie future." | Idem |
| 26 | Meta description `:6` | "Statistiques Over 2,5 mises à jour quotidiennement : taux de matchs avec 3 buts ou plus, historique et performance par ligue. Données publiques ESPN. 18+." | Remplacé par "Liste des ligues couvertes par BTTSPredict pour le marché Over 2,5. Moyennes et taux historiques à intégrer via source vérifiable. 18+." | L'ancienne description prétendait des données ESPN non prouvées |
| 27 | FAQ JSON-LD `:38` | "Historically, the Dutch Eredivisie, German Bundesliga, and Austrian Bundesliga tend to have higher Over 2.5 rates due to their offensive playstyle. BTTSPredict focuses on a curated set of leagues with historically high goal rates." | Remplacé par "BTTSPredict covers a curated set of leagues selected for their historically offensive profile. The exact Over 2.5 rate per league is À VÉRIFIER — to be integrated via a verifiable source at build time. No specific rate is published without a verifiable source." | L'ancien texte présentait une affirmation non sourcée comme fait établi |
| 28 | Conservé : `name` (ligue) | Labels de ligues | Conservé | Ce sont des labels, pas des données statistiques |
| 29 | Conservé : `country` (pays) | Labels de pays | Conservé | Ce sont des labels, pas des données statistiques |

### Page `/btts/statistics` — `src/app/btts/statistics/page.tsx`

| # | Fichier:Ligne | Ancienne valeur | Action | Source réelle ou raison |
|---|---|---|---|---|
| 1 | `:43` | `bttsRate: '57%'` (Eredivisie) | Remplacé par `"À VÉRIFIER"` | Aucun appel API ESPN dans le fichier — chiffre codé en dur présenté à tort comme "Taux historique BTTS approximatif par ligue (données publiques, ordre indicatif)" |
| 2 | `:43` | `avgGoals: '3.15'` (Eredivisie) | Remplacé par `"À VÉRIFIER"` | Idem |
| 3 | `:43` | `note: 'Ligue offensive, BTTS fréquent'` (Eredivisie) | Supprimé | Note présentait une opinion comme fait — colonne supprimée du tableau |
| 4 | `:44` | `bttsRate: '58%'` (Bundesliga) | Remplacé par `"À VÉRIFIER"` | Idem |
| 5 | `:44` | `avgGoals: '3.05'` (Bundesliga) | Remplacé par `"À VÉRIFIER"` | Idem |
| 6 | `:44` | `note: 'Pressing haut, beaucoup de buts'` (Bundesliga) | Supprimé | Idem |
| 7-33 | `:45-53` | 9 × `bttsRate`, 9 × `avgGoals`, 9 × `note` | Remplacés par `"À VÉRIFIER"` (taux + buts) ou supprimés (note) | Idem pour toutes les 9 ligues restantes |
| 34 | Commentaire `:41` | "Taux historique BTTS approximatif par ligue (données publiques, ordre indicatif)" | Supprimé | Le commentaire prétendait des données publiques sans preuve |
| 35 | Texte header `:76` | "Taux historique approximatif de Both Teams To Score sur les principales ligues couvertes par BTTSPredict. Ces statistiques sont indicatives et basées sur des données publiques." | Remplacé par "Liste des ligues couvertes par BTTSPredict pour le marché BTTS (Both Teams To Score). Les taux historiques et moyennes de buts par ligue ne sont pas affichés tant qu'aucune source vérifiable n'est intégrée au build." | Idem |
| 36 | Texte footer `:110` | "Ces taux sont des moyennes historiques indicatives calculées sur plusieurs saisons. Ils ne préjugent pas des résultats futurs. BTTSPredict sélectionne les ligues avec un taux historique supérieur à 53% pour ses pronostics BTTS." | Remplacé par "Données historiques non disponibles — à intégrer via source vérifiable (ex. API ESPN au build time). Aucune garantie future." | Idem — la mention "supérieur à 53%" reposait sur des chiffres non sourcés |
| 37 | Section "Comment lire" `:120` | "Un taux de 55% signifie que, sur 100 matchs de cette ligue, environ 55 se sont terminés avec les deux équipes ayant marqué" | Remplacé par "Les valeurs exactes par ligue seront affichées une fois une source vérifiable intégrée au build" | L'exemple "55%" reprenait un chiffre non sourcé |
| 38 | Section "Comment lire" `:123` | "Une moyenne de 2.80+ indique une ligue offensive" | Remplacé par "Les valeurs exactes seront affichées une fois une source vérifiable intégrée au build" | Idem |
| 39 | Meta description `:7` | "Statistiques BTTS mises à jour quotidiennement : taux de réussite, historique et performance par ligue. Données publiques ESPN." | Remplacé par "Liste des ligues couvertes par BTTSPredict pour le marché BTTS. Taux et moyennes historiques à intégrer via source vérifiable. Aucune garantie future. 18+." | L'ancienne description prétendait des données ESPN non prouvées |
| 40 | openGraph description `:12` | "Statistiques BTTS par ligue. Taux historique de Both Teams To Score. 18+." | Remplacé par "Liste des ligues couvertes pour le marché BTTS. Données historiques à intégrer via source vérifiable." | Idem |
| 41 | FAQ JSON-LD `:35` | "Historically, the Dutch Eredivisie, German Bundesliga, and English Championship tend to have higher BTTS rates. BTTSPredict focuses on a curated set of leagues with historically high BTTS rates to maximize prediction quality." | Remplacé par "BTTSPredict covers a curated set of leagues selected for their historically offensive profile. The exact BTTS rate per league is À VÉRIFIER — to be integrated via a verifiable source at build time. No specific rate is published without a verifiable source." | L'ancien texte présentait une affirmation non sourcée comme fait établi |
| 42 | H2 `:81` "Taux BTTS par ligue" | Renommé en "Ligues couvertes" | Renommé | Le H2 parlait de "taux" mais les taux ne sont plus affichés |
| 43 | `<th>` "Note" | Colonne supprimée | Supprimée | La colonne "Note" contenait des opinions non sourcées (ex: "Pressing haut, beaucoup de buts") |
| 44 | Conservé : `league` | Labels de ligues | Conservé | Ce sont des labels, pas des données statistiques |

## Pages contrôlées

### `/btts/statistics`
- ✅ Métadonnées mises à jour (title conservé, description neutralisée)
- ✅ Tableau n'affiche plus aucun chiffre non sourcé — uniquement le nom de la ligue + "À VÉRIFIER"
- ✅ Colonne "Note" supprimée (opinions non sourcées)
- ✅ FAQ JSON-LD neutralisée (aucune affirmation non sourcée)
- ✅ Section "Comment lire" neutralisée
- ✅ Footer ne prétend plus "Données publiques ESPN"
- ✅ Aucune mention de "53%" ou autre seuil inventé

### `/over-2-5/statistics`
- ✅ Métadonnées mises à jour (description neutralisée)
- ✅ Tableau n'affiche plus aucun chiffre non sourcé — uniquement ligue + pays + "À VÉRIFIER"
- ✅ FAQ JSON-LD neutralisée
- ✅ Header ne prétend plus "Source ESPN"
- ✅ Footer ne prétend plus "Source ESPN"
- ✅ Commentaire de code "Source: ESPN Soccer scoreboard" supprimé

### Vérification HTML rendu
```
=== btts/statistics — visible td cells ===
  - 'Eredivisie (Pays-Bas)'
  - 'À VÉRIFIER'
  - 'À VÉRIFIER'
  - 'Bundesliga (Allemagne)'
  - 'À VÉRIFIER'
  - 'À VÉRIFIER'
  [...]
=== over-2-5/statistics — visible td cells ===
  - 'Bundesliga'
  - 'Allemagne'
  - 'À VÉRIFIER'
  - 'À VÉRIFIER'
  [...]
```

✅ Aucune cellule de tableau ne contient un chiffre non sourcé. Chaque valeur statistique est "À VÉRIFIER".

## Recompte liens affiliés

### Inventaire exhaustif — 20 liens actifs dans 11 fichiers

| # | Fichier | Ligne | `rel` complet | `sponsored` | `nofollow` | `noopener` | `noreferrer` |
|---|---|---|---|---|---|---|---|
| 1 | `src/app/vip/page.tsx` | 408 | `noopener noreferrer nofollow sponsored` | ✅ | ✅ | ✅ | ✅ |
| 2 | `src/app/vip/page.tsx` | 416 | `noopener noreferrer nofollow sponsored` | ✅ | ✅ | ✅ | ✅ |
| 3 | `src/app/vip/VipClient.tsx` | 297 | `noopener noreferrer nofollow sponsored` | ✅ | ✅ | ✅ | ✅ |
| 4 | `src/app/vip/VipClient.tsx` | 308 | `noopener noreferrer nofollow sponsored` | ✅ | ✅ | ✅ | ✅ |
| 5 | `src/app/vip/VipClient.tsx` | 388 | `noopener noreferrer nofollow sponsored` | ✅ | ✅ | ✅ | ✅ |
| 6 | `src/app/vip/VipClient.tsx` | 399 | `noopener noreferrer nofollow sponsored` | ✅ | ✅ | ✅ | ✅ |
| 7 | `src/app/code-promo-linebet-senegal/LinebetClient.tsx` | 269 | `noopener noreferrer nofollow sponsored` | ✅ | ✅ | ✅ | ✅ |
| 8 | `src/app/code-promo-linebet-senegal/LinebetClient.tsx` | 291 | `noopener noreferrer nofollow sponsored` | ✅ | ✅ | ✅ | ✅ |
| 9 | `src/app/bonus-888starz/Star888Client.tsx` | 267 | `noopener noreferrer nofollow sponsored` | ✅ | ✅ | ✅ | ✅ |
| 10 | `src/app/bonus-888starz/Star888Client.tsx` | 289 | `noopener noreferrer nofollow sponsored` | ✅ | ✅ | ✅ | ✅ |
| 11 | `src/components/bttsbet/FreePredictionsWidget.tsx` | 78 | `sponsored nofollow noopener` | ✅ | ✅ | ✅ | ❌ |
| 12 | `src/components/bttsbet/HowToGetVip.tsx` | 150 | `sponsored noopener` | ✅ | ❌ | ✅ | ❌ |
| 13 | `src/components/bttsbet/LinebetApkButton.tsx` | 12 | `sponsored noopener` | ✅ | ❌ | ✅ | ❌ |
| 14 | `src/components/bttsbet/PremiumButton.tsx` | 76 | `sponsored nofollow` | ✅ | ✅ | ❌ | ❌ |
| 15 | `src/components/bttsbet/StickyCTABar.tsx` | 96 | `sponsored noopener` | ✅ | ❌ | ✅ | ❌ |
| 16 | `src/components/bttsbet/VipCardWidget.tsx` | 60 | `sponsored noopener` | ✅ | ❌ | ✅ | ❌ |
| 17 | `src/components/bttsbet/VipLevelModal.tsx` | 281 | `sponsored noopener` | ✅ | ❌ | ✅ | ❌ |
| 18 | `src/components/bttsbet/VipLevelModal.tsx` | 290 | `sponsored noopener` | ✅ | ❌ | ✅ | ❌ |
| 19 | `src/components/bttsbet/VipUnlockModal.tsx` | 288 | `sponsored noopener` | ✅ | ❌ | ✅ | ❌ |
| 20 | `src/components/bttsbet/VipUnlockModal.tsx` | 295 | `sponsored noopener` | ✅ | ❌ | ✅ | ❌ |

### Synthèse corrigée (vs rapport Tâche 003 qui était incohérent)

| Catégorie | Compte exact | Fichiers |
|---|---|---|
| **Liens complets** (4 attributs : `sponsored nofollow noopener noreferrer`) | **10** | `vip/page.tsx` (×2), `vip/VipClient.tsx` (×4), `code-promo-linebet-senegal/LinebetClient.tsx` (×2), `bonus-888starz/Star888Client.tsx` (×2) |
| **Liens incomplets** | **10** | Voir détails ci-dessous |
| **Total** | **20** | 11 fichiers |

### Détail des 10 liens incomplets

| # | Fichier | Ligne | `rel` actuel | Attribut(s) manquant(s) |
|---|---|---|---|---|
| 1 | `FreePredictionsWidget.tsx` | 78 | `sponsored nofollow noopener` | `noreferrer` |
| 2 | `HowToGetVip.tsx` | 150 | `sponsored noopener` | `nofollow`, `noreferrer` |
| 3 | `LinebetApkButton.tsx` | 12 | `sponsored noopener` | `nofollow`, `noreferrer` |
| 4 | `PremiumButton.tsx` | 76 | `sponsored nofollow` | `noopener`, `noreferrer` |
| 5 | `StickyCTABar.tsx` | 96 | `sponsored noopener` | `nofollow`, `noreferrer` |
| 6 | `VipCardWidget.tsx` | 60 | `sponsored noopener` | `nofollow`, `noreferrer` |
| 7 | `VipLevelModal.tsx` | 281 | `sponsored noopener` | `nofollow`, `noreferrer` |
| 8 | `VipLevelModal.tsx` | 290 | `sponsored noopener` | `nofollow`, `noreferrer` |
| 9 | `VipUnlockModal.tsx` | 288 | `sponsored noopener` | `nofollow`, `noreferrer` |
| 10 | `VipUnlockModal.tsx` | 295 | `sponsored noopener` | `nofollow`, `noreferrer` |

### Comptes par attribut manquant
- **8 liens manquent `nofollow`** : HowToGetVip, LinebetApkButton, StickyCTABar, VipCardWidget, VipLevelModal (×2), VipUnlockModal (×2)
- **9 liens manquent `noreferrer`** : tous les 8 ci-dessus + FreePredictionsWidget
- **1 lien manque `noopener`** : PremiumButton (a `nofollow` mais pas `noopener`)

### Statut conformité
- ❌ **Aucun des 20 liens n'est conforme au standard complet** (`sponsored nofollow noopener noreferrer`) — seuls 10 le sont
- ⚠ **10 liens sont incomplets** :
  - 1 lien manque 1 attribut (noreferrer)
  - 8 liens manquent 2 attributs (nofollow + noreferrer)
  - 1 lien manque 2 attributs (noopener + noreferrer)
- ✅ Tous les 20 liens ont au moins `sponsored`
- ✅ Tous les 20 liens ont au moins `noopener` ou `nofollow` (un des deux au minimum)

### Note sur `AFFILIATE.rel`
`src/lib/constants.ts:31` définit `rel: 'sponsored nofollow'` mais cette propriété n'est jamais utilisée dans le codebase (`grep -rn "AFFILIATE.rel" src/` retourne 0 résultat). C'est une propriété morte, pas un lien actif.

### Recommendation
- **P0 avant expansion commerciale** : harmoniser les 10 liens incomplets vers `rel="sponsored nofollow noopener noreferrer"`. À traiter dans une tâche séparée (cette Tâche 004 ne modifie pas les liens affiliés, conformément à la consigne).
- Les 8 liens sans `nofollow` sont prioritaires — un crawl SEO verrait ces liens comme "do-follow sponsored".

## Tests finaux

| Gate | Commande | Résultat |
|---|---|---|
| `npm ci` | (déjà exécuté en Tâche 001, non modifié) | ✅ Succès |
| `npm test` | `npx vitest run` | ✅ **34/34 réussis** (2 test files, 0 échec) |
| `npm run lint` | `npx eslint .` | ✅ **0 erreur, 0 warning** (exit code 0) |
| `npm run build` | `npx next build` | ✅ Succès — 36 routes générées (16 HTML + 13 match SSG + sitemap + predictions.json + 2 routes Over 2,5 + autres) |
| `git diff --check` | `git diff --check` | ✅ Aucun whitespace error |
| `git status --short` | `git status --short` | 2 fichiers modifiés (M) + 1 fichier non suivi (`GLM_TASK_003_REPORT.md` créé en Tâche 003) |

### Vérification HTML rendu post-build
- ✅ Aucune cellule de tableau des pages statistiques ne contient un chiffre non sourcé
- ✅ Toutes les cellules statistiques affichent "À VÉRIFIER"
- ✅ Les noms de ligues et pays sont conservés (labels, pas données statistiques)
- ✅ Les métadonnées ne prétendent plus "Données publiques ESPN" sans preuve
- ✅ Les FAQ JSON-LD ne présentent plus d'affirmations non sourcées comme faits établis

## Diff exact

### Fichiers modifiés (Tâche 004)

| Fichier | Insertions | Suppressions |
|---|---|---|
| `src/app/btts/statistics/page.tsx` | +44/-44 | Modifications : constante `LEAGUE_STATS` (retrait `bttsRate`, `avgGoals`, `note`), tableau HTML (cellules "À VÉRIFIER", colonne "Note" supprimée), header, footer, section "Comment lire", metadata description, openGraph description, FAQ JSON-LD |
| `src/app/over-2-5/statistics/page.tsx` | +47/-37 | Modifications : constante `LEAGUES_OVER_25` (retrait `avgGoals`, `over25Rate`), tableau HTML (cellules "À VÉRIFIER"), header, footer, metadata description, FAQ JSON-LD, commentaire de code |

**Total Tâche 004** : 2 fichiers modifiés, +91/-81 lignes.

### `git diff` complet (résumé)

```diff
src/app/btts/statistics/page.tsx:
  - Metadata description: "Données publiques ESPN" → "à intégrer via source vérifiable"
  - openGraph description: idem
  - LEAGUE_STATS: 11 × {league, bttsRate, avgGoals, note} → 11 × {league}
  - Table cells: bttsRate/avgGoals → "À VÉRIFIER"
  - Table column "Note": supprimée
  - Header paragraph: "Taux historique approximatif... données publiques" → "Liste des ligues... source vérifiable"
  - Footer paragraph: "Ces taux sont des moyennes historiques... supérieur à 53%" → "Données historiques non disponibles... source vérifiable"
  - Section "Comment lire": exemples "55%" et "2.80+" → "valeurs exactes seront affichées une fois source vérifiable"
  - H2 "Taux BTTS par ligue" → "Ligues couvertes"
  - FAQ JSON-LD answer: "Historically, the Dutch Eredivisie, German Bundesliga..." → "BTTSPredict covers a curated set... À VÉRIFIER..."

src/app/over-2-5/statistics/page.tsx:
  - Metadata description: "Statistiques Over 2,5 mises à jour quotidiennement... Données publiques ESPN" → "Liste des ligues... à intégrer via source vérifiable"
  - Comment: "Source: ESPN Soccer scoreboard..." → "Tâche 004 : statistiques non sourcées..."
  - LEAGUES_OVER_25: 11 × {name, country, avgGoals, over25Rate} → 11 × {name, country}
  - Table cells: avgGoals.toFixed(2) / (over25Rate * 100).toFixed(0) + '%' → "À VÉRIFIER"
  - Header paragraph: "Moyenne de buts... sources ESPN publiques" → "Liste des ligues... source vérifiable"
  - Footer paragraph: "Source : ESPN Soccer scoreboard..." → "Données historiques non disponibles..."
  - FAQ JSON-LD answer: "Historically, the Dutch Eredivisie, German Bundesliga, and Austrian Bundesliga tend to have higher Over 2.5 rates..." → "BTTSPredict covers a curated set... À VÉRIFIER..."
```

## Données historiques préservées

Vérification par `git diff HEAD` :

| Fichier | Statut |
|---|---|
| `public/win-history.json` | ✅ Inchangé |
| `public/predictions-archive/**` | ✅ Inchangé |
| `public/tracking-period.json` | ✅ Inchangé |
| `public/predictions.json` | ✅ Inchangé |

```bash
$ git diff HEAD -- public/win-history.json public/predictions-archive/ public/tracking-period.json public/predictions.json
(empty output)
```

✅ **Aucune donnée historique modifiée.**

## Verdict : READY FOR RE-MERGE REVIEW

### Conditions de blocage Tâche 003 — vérification

| Condition | Statut |
|---|---|
| Page Over 2,5 statistics contient des valeurs codées en dur présentées comme données ESPN | ✅ CORRIGÉ — toutes les valeurs non sourcées remplacées par "À VÉRIFIER" |
| Page BTTS statistics utilise le même modèle (57%, avgGoals) | ✅ CORRIGÉ — toutes les valeurs non sourcées remplacées par "À VÉRIFIER" |
| Rapport incohérent (10 vs 9 liens incomplets) | ✅ CORRIGÉ — recompte exact : 10 liens complets + 10 liens incomplets = 20 total |
| Liens "conformes" déclarés à tort | ✅ CORRIGÉ — verdict explicite : "Aucun des 20 liens n'est conforme au standard complet, seuls 10 le sont" |

### Conditions préservées
- ❌ `AuthContext.jsx` non supprimé (conformément à la consigne — documenté comme module mort à traiter séparément)
- ❌ `ignoreBuildErrors: true` non modifié (conformément à la consigne)
- ❌ Routes, sitemap, données historiques, archives non modifiés
- ❌ Liens affiliés non modifiés (conformément à la consigne — uniquement recomptés et documentés)
- ❌ Aucun nouvel appel API, secret, scraping ou dépendance créée

### Confirmation
- ❌ Aucun merge effectué
- ❌ Aucun push effectué (branche locale `chore/master-prompt-execution` maintenue)
- ❌ Aucun déploiement déclenché
- ✅ Audit en lecture seule + 2 fichiers modifiés uniquement
- ✅ Aucune donnée historique modifiée
- ✅ Aucune invention de chiffre, source, traduction, disponibilité ou résultat
- ✅ Aucune règle ESLint désactivée
- ✅ Aucun test affaibli
- ✅ Aucun placeholder chargé en production

### Risques résiduels non bloquants

| # | Risque | Action recommandée |
|---|---|---|
| R1 | 10 liens affiliés incomplets (manquent `nofollow` et/ou `noreferrer` et/ou `noopener`) | Tâche d'harmonisation séparée vers `rel="sponsored nofollow noopener noreferrer"` — ne pas modifier dans cette tâche |
| R2 | Bonus bookmakers non sourcés ("90 000 XOF", "Bonus 200%", etc.) | À vérifier sur sites officiels bookmakers |
| R3 | `AuthContext.jsx` module mort + placeholder Firebase | Tâche séparée |
| R4 | `typescript.ignoreBuildErrors: true` | Rapport TypeScript séparé |
| R5 | Routes `/statistiques` et `/linebet-promo-code/page.tsx` fantômes | Tâche de nettoyage séparée |
| R6 | Vrai ID Google Analytics | `NEXT_PUBLIC_GA_ID` à définir dans GitHub Secrets |
| R7 | Intégration future d'un vrai appel API ESPN au build time pour calculer `avgGoals`, `over25Rate`, `bttsRate` depuis `public/predictions-archive/` | Tâche technique séparée (nécessite design du script de build) |

---

*Rapport Tâche 004 généré le 2026-08-10. Aucun push, aucun merge, aucun déploiement. En attente de validation du chef de projet.*
