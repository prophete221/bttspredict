# Transparence des Données — BTTSPredict

> **Date de création :** 2026-08-08
> **Modèle en production :** V3-Reliability
> **Date de lancement du nouveau suivi public :** 2026-08-08

---

## 1. Système de suivi public

BTTSPredict a lancé le 8 août 2026 une nouvelle période de suivi public. Tous les pronostics publiés à partir de cette date sont enregistrés, horodatés et évalués après le résultat officiel du match.

### Engagement de transparence

- **Immutabilité :** Un pronostic publié n'est jamais modifié rétroactivement. Si une correction est nécessaire (typo, mauvais match), une nouvelle version est créée dans le journal interne avec un identifiant distinct.
- **Vérification indépendante :** Les scores finaux sont récupérés depuis ESPN et TheSportsDB, deux sources publiques accessibles sans clé API. Aucune vérification manuelle n'est effectuée.
- **Comptage honnête :** Les pronostics en statut PENDING (match non encore joué ou score non vérifié) ne sont pas comptabilisés dans les taux. Le dénominateur ne contient que les pronostics réellement vérifiés (WON ou LOST).
- **Volume affiché :** Le volume de pronostics vérifiés est toujours affiché à côté du taux. Pendant les premières semaines, un disclaimer « Volume insuffisant » est affiché si le total est inférieur à 30.

### Sources de données

| Source | Type | URL | Usage |
|--------|------|-----|-------|
| ESPN Soccer API | Public, sans clé | `site.api.espn.com/apis/site/v2/sports/soccer/<slug>/scoreboard` | Calendrier + scores finaux + logos |
| TheSportsDB v3 | Public, sans clé | `thesportsdb.com/api/v1/json/3/eventsday.php` | Fallback scores finaux |
| BBC Sport RSS | Public | `feeds.bbci.co.uk/sport/football/transfers/rss.xml` | Transferts joueurs (informationnel) |
| IndexNow | Public | `api.indexnow.org/IndexNow` | Notification Bing |

### Sources NON utilisées (et faussement prétendues dans d'anciennes versions)

| Source | Statut | Action |
|--------|--------|--------|
| API-Football | ❌ Non consommée | `API_FOOTBALL_KEY` jamais configurée — mentions purgées |
| Forebet | ❌ Non consommée | Uniquement dans `scraper.js` legacy (non appelé en production) |
| Windrawwin | ❌ Non consommée | Uniquement dans `scraper.js` legacy |
| Soccerbase | ❌ Non consommée | Uniquement dans `scraper.js` legacy |

---

## 2. Variables réellement utilisées

Le modèle V3-Reliability utilise **8 variables par match** (et non 200+ comme prétendu dans d'anciennes versions du site) :

### Variables par équipe (8 au total)

| # | Variable | Description |
|---|----------|-------------|
| 1 | `homeForm.scoredIn` | Nb de matchs (sur 5) où l'équipe à domicile a marqué |
| 2 | `homeForm.concededIn` | Nb de matchs (sur 5) où l'équipe à domicile a encaissé |
| 3 | `homeForm.avgScored` | Moyenne buts marqués à domicile sur 5 derniers matchs |
| 4 | `homeForm.avgConceded` | Moyenne buts encaissés à domicile sur 5 derniers matchs |
| 5 | `awayForm.scoredIn` | Nb de matchs (sur 5) où l'équipe à l'extérieur a marqué |
| 6 | `awayForm.concededIn` | Nb de matchs (sur 5) où l'équipe à l'extérieur a encaissé |
| 7 | `awayForm.avgScored` | Moyenne buts marqués à l'extérieur sur 5 derniers matchs |
| 8 | `awayForm.avgConceded` | Moyenne buts encaissés à l'extérieur sur 5 derniers matchs |

### Variables de ligue (constantes de calibration)

| Variable | Description |
|----------|-------------|
| `bttsRate` | Taux historique de BTTS dans la ligue |
| `avgGoals` | Moyenne de buts par match dans la ligue |
| `homeFactor` | Avantage du terrain à domicile |
| `awayFactor` | Désavantage du terrain à l'extérieur |

> Ces 4 variables sont des constantes par ligue, pas des variables par match. Elles sont définies dans `LEAGUE_PROFILES` du script `quick-update-predictions.mjs`.

---

## 3. Calcul des probabilités

### Modèle Poisson bivarié

Le modèle suppose que le nombre de buts marqués par chaque équipe suit une loi de Poisson indépendante. Les intensités (lambdas) sont calculées à partir de la forme récente des équipes.

```
homeLambda = max(0.3, homeAttack × awayDefense × (leagueAvgHome / 1.3) × 1.15)
awayLambda = max(0.3, awayAttack × homeDefense × (leagueAvgAway / 1.1))
```

Où :
- `homeAttack = homeForm.avgScored`
- `homeDefense = homeForm.avgConceded`
- `awayAttack = awayForm.avgScored`
- `awayDefense = awayForm.avgConceded`
- `leagueAvgHome = profile.avgGoals × 0.55` (~55% des buts sont marqués à domicile)
- `leagueAvgAway = profile.avgGoals × 0.45`

### Probabilités Poisson exactes

```
# BTTS = P(home ≥ 1 AND away ≥ 1) — assuming independence
bttsProb = (1 - e^(-homeLambda)) × (1 - e^(-awayLambda))

# Over 2.5 = 1 - P(total ≤ 2) = 1 - Σ_{i+j ≤ 2} P(home=i, away=j)
over25Prob = 1 - Σ_{i=0}^{2} Σ_{j=0}^{2-i} PoissonPMF(i, homeLambda) × PoissonPMF(j, awayLambda)
```

### Formules Poisson

```
PoissonPMF(k, λ) = (e^(-λ) × λ^k) / k!
```

---

## 4. Filtres de publication V3

Un prono n'est publié que si les 4 filtres suivants sont satisfaits simultanément :

1. **Filtre forme offensive** — `homeForm.scoredIn >= 3 && awayForm.scoredIn >= 3`
2. **Filtre forme défensive** — `homeForm.concededIn >= 3 && awayForm.concededIn >= 3`
3. **Filtre ligue HIGH_BTTS** — League ∈ {11 ligues listées dans tracking-period.json}
4. **Filtre probabilité** — `bttsProb >= 0.62` (seuil de publication)

Si aucun match ne passe les 4 filtres un jour donné, aucun prono n'est publié. C'est intentionnel.

---

## 5. Calibration et contrôle qualité

### Automatisation

- Le modèle est exécuté automatiquement 4 fois par jour via GitHub Actions (cron `0 4,6,14,22 * * *` UTC).
- Le contrôle qualité est entièrement automatisé :
  - Vérification automatique des 4 filtres avant publication.
  - Force `proba = 0.62` si la probabilité est manquante (jamais 0).
  - Limite de 5 pronos par jour (top proba).
  - Archive quotidienne horodatée (immutabilité rétroactive).
  - Vérification post-match via ESPN + TheSportsDB (sans clé API).

### Validation humaine

❌ **Il n'y a pas de validation humaine de chaque pronostic.** Le modèle est exécuté automatiquement sans intervention humaine. Toute mention d'une « validation humaine » dans d'anciennes versions du site était erronée et a été corrigée.

### Calibration des ligues HIGH_BTTS

Les 11 ligues HIGH_BTTS sont sélectionnées sur la base de leur taux historique de BTTS > 53% (calculé sur les saisons 2023-2025). Les coefficients `bttsRate`, `avgGoals`, `homeFactor`, `awayFactor` sont des estimations basées sur des données publiques ESPN et peuvent être ajustées au fil du temps sans rétroactivité sur les pronos déjà publiés.

---

## 6. Limites du modèle

| Limite | Détail |
|--------|--------|
| Blessures / suspensions | ❌ Non prises en compte |
| Transferts récents | ❌ Non pris en compte (informations affichées mais non utilisées dans le modèle) |
| Météo | ❌ Non prise en compte |
| Enjeu sportif | ❌ Non pris en compte (finale, relégation, etc.) |
| Indépendance des buts | ⚠️ Supposée (simplification) |
| Échantillon de forme | 5 derniers matchs (variance élevée) |
| Couverture | 11 ligues HIGH_BTTS uniquement |
| Marchés | BTTS et Over 2.5 uniquement (pas de score exact, double chance, handicap) |

---

## 7. Gestion des données manquantes

| Cas | Comportement |
|-----|--------------|
| Forme d'une équipe indisponible | Match filtré (non publié) |
| Ligue non HIGH_BTTS | Match filtré |
| Probabilité < 0.62 | Prono filtré |
| Probabilité manquante après calcul | Force `proba = 0.62` (jamais 0) |
| Score final non vérifiable (ESPN + TheSportsDB) | Statut PENDING (non comptabilisé) |
| Prono PENDING | Exclu du dénominateur (ni gagné ni perdu) |

---

## 8. Suivi du nouveau modèle

### Date de lancement

- **Date officielle :** 2026-08-08
- **Modèle :** V3-Reliability
- **Fichier de configuration :** `public/tracking-period.json`

### Compteurs publics (depuis le lancement)

Les compteurs sont calculés dynamiquement par `scripts/update-win-history.mjs` V8 et stockés dans `public/win-history.json` :

| Compteur | Description |
|----------|-------------|
| `stats.archivedTotal` | Pronostics publiés depuis le lancement |
| `stats.total` | Pronostics vérifiés (WON + LOST) |
| `stats.won` | Pronostics gagnés |
| `stats.lost` | Pronostics perdus |
| `stats.pending` | Pronostics en attente de vérification |
| `stats.rate` | Taux de réussite = won / total × 100 |
| `stats.gold.*` | Mêmes compteurs pour le tier GOLD |
| `stats.byType.btts.*` | Mêmes compteurs pour le marché BTTS |
| `stats.byType.over25.*` | Mêmes compteurs pour le marché Over 2.5 |
| `stats.trend14` | 14 derniers jours avec taux et equity |

### Volume insuffisant

Pendant les premières semaines, si `stats.total < 30`, le site affiche le disclaimer :

> Nouvelle période de suivi lancée le 2026-08-08. Les résultats sont publiés et vérifiés progressivement. Le volume actuel est encore insuffisant pour évaluer statistiquement la performance du modèle. Aucun résultat futur n'est garanti.

### Archives privées (avant le lancement)

Les archives antérieures au 2026-08-08 sont conservées dans `win-history.json` sous la clé `legacyStats` avec `isPrivate: true`. Elles ne sont pas affichées publiquement. Elles sont conservées pour :
- Audit technique interne
- Conformité réglementaire
- Analyse comparative du modèle V2 vs V3
- Debugging

---

## 9. Formulation à éviter

BTTSPredict s'engage à ne jamais utiliser les formulations suivantes :

| Formulation | Raison |
|-------------|--------|
| « 100% sûr » | Aucune probabilité n'est certaine |
| « Garanti » | Aucun gain n'est garanti |
| « Sans risque » | Les paris sportifs comportent un risque de perte |
| « Gain assuré » | Aucun gain n'est assuré |
| « Meilleur modèle » | Aucune comparaison documentée |
| « Taux réel » sans volume | Le taux n'a pas de sens sans volume suffisant |
| « Historique complet » si nouveau suivi | Le nouveau suivi vient de commencer |
| « Pronostic fiable » comme garantie | Fiabilité ≠ garantie |
| « Rentable » sans données vérifiables | Rentabilité non prouvée |
| « N°1 » | Aucun classement vérifiable |
| « IA infaillible » | Aucune IA n'est infaillible |

### Formulations acceptées

| Formulation | Usage |
|-------------|-------|
| « Pronostics BTTS et Over 2.5 basés sur un modèle statistique » | Description factuelle |
| « Nouveau suivi public des pronostics vérifiés » | Transparence |
| « Analyse probabiliste des matchs de football » | Description factuelle |
| « Méthodologie du modèle statistique » | Transparence |
| « Volume insuffisant pour conclure » | Honnêteté |
| « Aucun résultat futur n'est garanti » | Disclaimer obligatoire |

---

## 10. Audit et vérification

### Comment vérifier les données publiques

1. **Accès à l'archive publique :** `https://bttspredict.com/win-history.json` — contient les compteurs et l'historique du nouveau suivi.
2. **Accès à la configuration :** `https://bttspredict.com/tracking-period.json` — contient la date de lancement et les paramètres du modèle.
3. **Accès aux pronostics du jour :** `https://bttspredict.com/predictions.json` — contient les pronostics publiés aujourd'hui.
4. **Vérification indépendante :** Pour chaque prono vérifié WON/LOST, le score final est inclus (`finalScore`). Vous pouvez comparer avec ESPN ou TheSportsDB.

### Limites de l'audit

- Les archives quotidiennes (`predictions-archive/YYYY-MM-DD.json`) sont publiques sur GitHub : `https://github.com/prophete221/bttspredict/tree/main/public/predictions-archive`.
- Le script `verify-results.mjs` est open-source et peut être ré-exécuté pour vérifier les résultats.
- Aucune donnée n'est chiffrée ou masquée — tout est transparent.

---

## 11. Conformité

- ✅ 18+ : Vérification d'âge au premier visite (`AgeVerification.tsx`)
- ✅ Jeu responsable : Lien begambleaware.org dans le footer + page `/jouer-responsable`
- ✅ Affiliation : Tous les liens d'affiliation ont `rel="sponsored nofollow"`
- ✅ Mentions légales : Éditeur identifié (Elon Ervri, New Jersey, USA)
- ✅ Pas de collecte de fonds : BTTSPredict ne prend pas de paris
- ✅ Pas de données bancaires : L'utilisateur contacte le support avec un ID utilisateur uniquement
- ✅ Aucune fausse promesse de gain
- ✅ Volume affiché à côté des taux
- ✅ Disclaimer « Volume insuffisant » si < 30 vérifiés
