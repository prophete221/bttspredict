# BTTSPredict.com — README AUDIT

> **Dernière mise à jour :** 2026-08-08
> **Site live :** [bttspredict.com](https://bttspredict.com)
> **Moteur de prédiction :** V3 Reliability-First (HIGH_BTTS only, true Poisson, 4 filtres, top 5 max)
> **Pipeline de vérification :** 100% ESPN (public, sans clé API) + TheSportsDB (public)

---

## 1. STATS LIVE RÉELLES

Lues depuis `public/win-history.json` (généré par `scripts/update-win-history.mjs`).

| Métrique | Valeur |
|----------|--------|
| **Total vérifiés (W+L)** | 635 |
| **Gagnés** | 308 |
| **Perdus** | 327 |
| **Pending** | 2 274 |
| **Archives totales** | 2 909 pronos (62 fichiers dans `public/predictions-archive/`) |
| **Taux All** | 48.5 % |
| **Taux All 30j** | variable (voir `/resultats-verifies`) |
| **Cote moyenne** | 1.90 |
| **ROI All** | -7.8 % (non affiché — phase d'optimisation) |
| **Gold vérifiés** | 50 (20W / 30L) |
| **Taux Gold** | 40 % |
| **Gold yield** | -24 % (non affiché — seuil 55 % non atteint) |
| **Standard vérifiés** | 585 (288W / 297L) |
| **Taux Standard** | 49.2 % |
| **BTTS vérifiés** | 318 (150W / 168L → 47.2 %) |
| **Over 2.5 vérifiés** | 317 (158W / 159L → 49.8 %) |
| **Trend 14j** | 14 entrées (visible sur `/resultats-verifies`) |
| **Dernier scan** | `2026-08-07T18:20:00.000Z` |
| **Source vérification** | ESPN API (public, sans clé) + TheSportsDB (public) |

> ⚠️ **Le bloc `WinHistory` est temporairement SUPPRIMÉ de l'accueil** car le taux Gold (40 %) est en dessous du seuil d'affichage (55 %). Les pages `/historique` et `/statistiques` affichent un placeholder « Nouveau système de vérification en cours ». La page `/resultats-verifies` reste active avec ROI, equity curve, et export CSV.

> ⚠️ **Le taux Gold actuel (40 % sur 50 vérifiés) est insuffisant.** Le nouveau moteur V3 (HIGH_BTTS only, 4 filtres, proba ≥0.62) vise 55-60 % sur les 100 prochains pronos. Réactivation de l'historique prévue dans 7 jours une fois 40-50 pronos Gold vérifiés à 58 %+.

---

## 2. STRUCTURE FICHIERS RÉELLE

### `src/app/` — 30 pages

```
src/app/
├── layout.tsx                # Layout racine (SEO, PWA, cache-buster v80)
├── page.tsx                  # Accueil (Hero → Pronos → VIP → Footer — WinHistory SUPPRIMÉ)
├── globals.css               # Design system ECLIPSE v60 (14 tokens)
├── historique/               # Placeholder « Nouveau système en cours » (CTA → #free-predictions)
├── statistiques/              # Placeholder « Nouveau système en cours » (CTA → #free-predictions)
├── resultats-verifies/       # ⭐ Page performance live (ROI, equity curve, CSV export, proba fallback)
│   ├── page.tsx              # Metadata SEO + structure
│   └── ResultatsClient.tsx   # Dashboard Recharts + dedup + 30j trend
├── methodologie/             # Modèle Poisson + sources ESPN/TheSportsDB
├── vip/                      # Offres VIP (2 cartes : Essentiel + Pro)
├── bookmakers/               # Comparateur Linebet vs 888starz
├── blog/                     # 6 articles SEO
│   ├── comment-analyser-match-btts/
│   ├── faille-fifa-linebet/
│   ├── gestion-bankroll-paris-sportifs/
│   ├── guide-linebet-inscription/
│   ├── meilleurs-championnats-btts/
│   └── strategie-mise-over-2-5/
├── betting-tips/
├── bonus-888starz/
├── btts-c-est-quoi/
├── cgu/
├── code-promo-linebet-senegal/
├── correct-score-predictions/
├── equipe/
├── faille-fifa/
├── football-predictions-today/
├── jouer-responsable/
├── league-predictions/
├── linebet-promo-code/
├── match-predictions/
├── mentions-legales/
├── over-2-5-predictions/
├── politique-confidentialite/
├── prediction-aviator/
├── presse/
├── pronostics/
└── team-predictions/
```

### `src/components/bttsbet/` — 39 composants

```
About.tsx              AgeVerification.tsx    AnimatedIcons.tsx
AviatorVip.tsx         CookieConsent.tsx      CopyableCode.tsx
CursorEffect.tsx       ErrorBoundary.tsx      FifaLinebet.tsx
FloatingElements.tsx   Footer.tsx             FreePredictions.tsx
FreePredictionsWidget.tsx   GlobalReach.tsx   Hero.tsx
HowItWorks.tsx         HowToGetVip.tsx         LanguageSwitcher.tsx
LinebetApkButton.tsx   LiveTicker.tsx          LockedContent.tsx
MobileTabBar.tsx       Navbar.tsx              NeuralBackground.tsx
PremiumButton.tsx      PromoVip.tsx            ScrollProgressBar.tsx
SiteLoader.tsx          SportMarquee.tsx       StatsDashboard.tsx
StickyCTABar.tsx        StickyVipBandeau.tsx    TiltCard.tsx
VipCardGlass.tsx        VipCardWidget.tsx       VipLevelModal.tsx
VipSports.tsx           VipUnlockModal.tsx      WinHistory.tsx
```

### `src/lib/` — 5 fichiers

```
constants.ts     # SITE, AFFILIATE, BOOKMAKERS, HERO_STATS, FAQ_ITEMS, LEGAL
seoSchemas.ts    # Organization, Dataset, SportsEvent, ItemList, Breadcrumb, FAQ
motionPresets.ts # Animations Framer Motion
teamLogos.ts     # Mapping équipes → logos ESPN
utils.ts         # Helpers (cn, etc.)
```

### `public/` — assets

```
public/
├── predictions.json           # 2-5 pronos du jour V3 (généré par quick-update-predictions.mjs V3)
├── win-history.json           # Stats + history (généré par update-win-history.mjs V7)
├── predictions-archive/       # 62 fichiers JSON (2026-06-07 → 2026-08-08)
├── manifest.json              # PWA manifest (ECLIPSE v60 colors)
├── favicon.svg                # Squircle shield + // indigo
├── icon-192.png, icon-512.png, icon-1024.png
├── apple-touch-icon.png       # 180x180
├── og-image.png               # 1200x630 (shield + VERIFIED DATASET badge)
├── logo.png                   # 512x512 shield image (deployed 2026-08-07)
├── logo/                      # 7 SVG (horizontal, stacked, icon + variants gold/black)
├── llms.txt                    # Déclaration pour LLMs (AEO)
├── ai.txt                      # Contexte pour ChatGPT/Perplexity
├── _headers                    # Cloudflare headers (CSP, Cache-Control _next/static 1 an)
├── _redirects                  # Redirects Cloudflare
├── robots.txt
├── sitemap.xml
├── 404.html, 200.html
└── logos/                      # Logos Linebet, 888starz, Android
```

### `scripts/` — 15 scripts

```
scripts/
├── quick-update-predictions.mjs  # ⭐ V3 Reliability-First — HIGH_BTTS only, true Poisson, 4 filtres, top 5
├── verify-results.mjs            # V5 — Récupère scores finaux ESPN (48 ligues, 90j backfill, sans clé)
├── update-win-history.mjs        # V7 — Calcule stats All vs Gold + trend14 → win-history.json
├── migrate-gold.mjs              # Ajoute tier GOLD/STANDARD aux anciennes archives (one-shot)
├── scrape-transfers.mjs          # Transferts joueurs
├── generate-sitemap.mjs          # Sitemap XML dynamique
├── submit-indexnow.mjs           # Notification Bing
├── serve.mjs                     # Serveur local
├── scraper.js                    # Scraper V23 multi-sources (legacy)
├── quick-fix-predictions.mjs     # Quick fix predictions
├── generate-sitemap-auto.mjs     # Sitemap auto
├── generate-sitemap.js           # Sitemap JS
├── apply_vip_modal_upgrade.py    # Migration VIP modal (one-shot)
├── build_video.py                # Build vidéo (one-shot)
└── create_motion_video.py        # Création vidéo motion (one-shot)
```

### `.github/workflows/deploy.yml`

Voir section 6 ci-dessous.

---

## 3. PIPELINE DE DONNÉES (ORDRE RÉEL D'EXÉCUTION)

### Étape 1 — `scripts/quick-update-predictions.mjs` V3 (Reliability-First)

**Input :** ESPN API (`site.api.espn.com/apis/site/v2/sports/soccer/<slug>/scoreboard`) sur 11 ligues HIGH_BTTS uniquement
**Output :** `public/predictions.json` (2-5 pronos max) + archive `public/predictions-archive/YYYY-MM-DD.json`

**Ce qu'il fait :**

1. Fetch les matchs des 4 prochains jours **uniquement sur 11 ligues HIGH_BTTS** (`eng.1`, `eng.2`, `ger.1`, `ger.2`, `ned.1`, `bel.1`, `swi.1`, `por.1`, `aut.1`, `sco.1`, `usa.1`).
2. Pour chaque match : récupère `homeForm` et `awayForm` (scored in N/5, conceded in N/5, avgScored, avgConceded).
3. Applique **4 filtres obligatoires** :
   - **FILTRE 1** — `homeForm.scoredIn >= 3 && awayForm.scoredIn >= 3` (les deux équipes marquent dans 3+ des 5 derniers matchs)
   - **FILTRE 2** — `homeForm.concededIn >= 3 && awayForm.concededIn >= 3` (les deux équipes encaissent dans 3+ des 5 derniers matchs)
   - **FILTRE 3** — `league in HIGH_BTTS_LEAGUES` (sinon skip)
   - **FILTRE 4** — `bttsProbability >= 0.62` (sinon skip)
4. Calcule les vrais lambdas Poisson :
   - `homeLambda = max(0.3, homeAttack × awayDefense × (leagueAvgHome / 1.3) × 1.15)`
   - `awayLambda = max(0.3, awayAttack × homeDefense × (leagueAvgAway / 1.1))`
5. Calcule `bttsProb` et `over25Prob` via formules Poisson exactes :
   - `bttsProb = (1 - e^(-homeLambda)) × (1 - e^(-awayLambda))`
   - `over25Prob = 1 - Σ P(home=i, away=j)` pour `i+j ≤ 2`
6. Pour chaque match qui passe les 4 filtres, génère 1-2 pronos (BTTS Oui si proba ≥0.62, Over 2.5 Oui si proba ≥0.62).
7. Trie par proba décroissante, garde **uniquement les 5 meilleurs**.
8. Si une proba manque ou vaut 0, force `proba = 0.62` et `confidence = 62` (jamais 0).
9. Sauvegarde dans `predictions.json` + archive quotidienne.

**Résultat typique V3 :** 2-5 pronos par jour à proba 62-99 % (au lieu de 50 pronos dont 80 % à 0 %).

**Si 0 prono passe les filtres :** `predictions.json` est vide pour le jour. C'est intentionnel — mieux vaut 0 prono que 50 à 0 %.

### Étape 2 — `scripts/verify-results.mjs` V5

**Input :** `public/predictions-archive/*.json` (90 derniers jours)
**Output :** Archives mises à jour avec `finalScore`, `status` (WON/LOST/PENDING), `isWon`, `verifiedAt`

**Ce qu'il fait :**
1. Pour chaque archive des 90 derniers jours :
2. Fetch les scores finaux ESPN (`STATUS_FINAL`) sur **48 ligues** (public, sans clé API) avec TheSportsDB en fallback.
3. Pour chaque prono sans `status` (ou `PENDING`) :
   - Extrait `home`/`away` depuis `match` string (split sur ` vs `)
   - Match fuzzy avec les scores ESPN (normalisation + `includes` bidirectionnel + token overlap)
4. Si match trouvé :
   - BTTS : `isWon = home > 0 && away > 0`
   - Over 2.5 : `isWon = home + away >= 3`
   - Ajoute `finalScore`, `status` (WON/LOST), `isWon`, `verifiedAt`
5. Si non trouvé : `status = 'PENDING'`
6. Rate limiting 60 ms entre appels ESPN
7. Sauvegarde les archives modifiées toutes les 10 fichiers
8. **Priorité GOLD** : les pronos GOLD sont vérifiés en premier

**Log final :** `Vérifiés X W Y L`

### Étape 3 — `scripts/update-win-history.mjs` V7

**Input :** `public/predictions-archive/*.json` (90 derniers jours)
**Output :** `public/win-history.json`

**Ce qu'il fait :**
1. Parcourt les 90 dernières archives
2. Pour chaque prono :
   - Lit `status` (WON/LOST/PENDING) ou `isWon` (true/false)
   - Récupère `tier` (ou le recalcule si manquant via `getTier()` V7)
3. Calcule :
   - `stats.total = won + lost` (PENDING **exclu** du dénominateur)
   - `stats.rate = won / total × 100` (1 décimale)
   - `stats.gold` : { total, won, lost, rate, avgOdds, profit, roi, yield }
   - `stats.standard` : { total, won, lost, rate }
   - `stats.byType` : btts / over25 séparés
   - `stats.trend14` : 14 derniers jours avec rate quotidien + equity
4. `history` : seulement les pronos WON/LOST (PENDING exclus)
5. Sauvegarde dans `win-history.json`

**Logique `getTier()` V7 :**
```javascript
function getTier(p) {
  if (p.tier) return p.tier.toUpperCase();
  let proba = p.proba || 0;
  if (!proba && p.analysis) proba = p.analysis.bttsProb || p.analysis.over25Prob || 0;
  if (!proba && p.confidence) proba = p.confidence / 100;
  if (!proba) proba = 0.6;
  const lg = (p.league || '').toLowerCase();
  const isHigh = ['bundesliga','eredivisie','jupiler','swiss','mls','championship',
                   'premier league','liga portugal','austrian','scottish'].some(h => lg.includes(h));
  const isBttsYes = (p.type || '').toLowerCase().includes('btts') && (p.prediction || '').toLowerCase() !== 'non';
  if (proba >= 0.75) return 'GOLD';
  if (proba >= 0.70 && isHigh && isBttsYes) return 'GOLD';
  return 'STANDARD';
}
```

**Pourquoi PENDING n'est pas compté :** Un prono en attente n'est ni gagné ni perdu. Le counting dans `total` gonflerait artificiellement le dénominateur et ferait baisser le taux. On ne compte que ce qui est vérifié.

### Étape 4 — `FreePredictionsWidget.tsx` lit `predictions.json`

1. `fetch('/predictions.json')` côté client
2. Filtre les pronos du jour
3. Affiche les cartes V3 (généralement 2-5 par jour) en design ECLIPSE v60 :
   - Cercle SVG proba (violet BTTS `#7C3AED` / cyan Over 2.5 `#5DFDCB`)
   - `data-ai-answer` pour scraping LLM (Perplexity/ChatGPT)
   - Hover lift -2px + glow indigo
   - Mobile swipe horizontal
4. **Fallback proba côté UI** : `p.proba || p.analysis?.bttsProb || p.analysis?.over25Prob || p.confidence/100 || 0.62` (jamais 0)

### Étape 5 — `ResultatsClient.tsx` (page `/resultats-verifies`)

1. `fetch('/win-history.json')` côté client
2. Affiche :
   - 3 cartes neutres (Total vérifiés, Taux All 30j, Gold vérifiés) — yield affiché **seulement si >0**
   - Equity curve 30 jours (Recharts AreaChart, couleur indigo `#5146F5`)
   - Trend 14j : barres verticales (cyan/indigo/rouge)
   - Tableau 30 derniers résultats **dédupliqués** par `date-match-type`
   - Badge GOLD sur les lignes GOLD
   - Bouton « Export CSV » (télécharge les 100 derniers résultats)
3. Fallback proba : `p.proba || p.analysis?.bttsProb || p.analysis?.over25Prob || p.confidence/100 || 0`

### Étape 6 — `WinHistory.tsx` V7 (actuellement SUPPRIMÉ de l'accueil)

**Logique d'affichage :**
- Carte « Gold Picks » avec badge « Phase d'optimisation — Objectif 60 %+ » **seulement si `gold.total >= 1`**
- Cache la carte Gold si `gold.total === 0`
- Cache le ROI / yield / profit si négatif (remplacé par « Phase d'optimisation »)
- Cache la « Cote moyenne » si négative
- Si `gold.rate < 55 %` : badge « Phase d'optimisation » (au lieu de « Gold yield -24 % »)

**État actuel :** Commenté dans `src/app/page.tsx` (ligne ~533) :
```tsx
{/* WinHistory supprimé temporairement — nouveau système de vérification en cours */}
```

---

## 4. LOGIQUE GOLD TIER

### Code exact de `assignTier()` V3 dans `quick-update-predictions.mjs`

```javascript
const HIGH_BTTS_LEAGUES = [
  'Bundesliga','2. Bundesliga','Eredivisie','Jupiler Pro League',
  'Swiss Super League','Championship','Premier League',
  'Liga Portugal','Austrian Bundesliga','Scottish Premiership','MLS',
];

function assignTier(proba, league, market) {
  const ln = (league || '').toLowerCase();
  const isHigh = HIGH_BTTS_LEAGUES.some(l => ln.includes(l.toLowerCase()));
  const isBttsYes = (market || '').toLowerCase().includes('btts')
                  && (market || '').toLowerCase() !== 'non';
  if (proba >= 0.75) return 'GOLD';
  if (proba >= 0.70 && isHigh && isBttsYes) return 'GOLD';
  return 'STANDARD';
}
```

### Seuils proba V3

| Condition | Tier |
|-----------|------|
| `proba >= 0.75` | GOLD |
| `proba >= 0.70` + ligue HIGH_BTTS + marché BTTS Oui | GOLD |
| `proba >= 0.62` (filtre de publication STANDARD) | STANDARD |
| `proba < 0.62` | **NON PUBLIÉ** (filtré) |

### HIGH_BTTS_LEAGUES V3 (11 ligues)

1. Premier League (`eng.1`)
2. Championship (`eng.2`)
3. Bundesliga (`ger.1`)
4. 2. Bundesliga (`ger.2`)
5. Eredivisie (`ned.1`)
6. Jupiler Pro League (`bel.1`)
7. Swiss Super League (`swi.1`)
8. Liga Portugal (`por.1`)
9. Austrian Bundesliga (`aut.1`)
10. Scottish Premiership (`sco.1`)
11. MLS (`usa.1`)

> ℹ️ **V2 avait 12 ligues** (incluant Danish Superliga + Norwegian Eliteserien, sans Premier League ni Liga Portugal). V3 a recentré sur les 11 ligues au taux BTTS historique >53 %.

### Pourquoi Gold est à 40 % actuellement

Le moteur V2 générait ~50 pronos/jour sur 40+ ligues avec un modèle Poisson simplifié (moyenne simple, pas de filtres de forme). Beaucoup de pronos GOLD V2 étaient en fait des faux positifs (proba gonflée artificiellement, pas de filtre `scoredIn/concededIn`). Le moteur V3 corrige cela en :

1. Restreignant aux 11 ligues HIGH_BTTS (au lieu de 40+)
2. Appliquant 4 filtres obligatoires (forme récente des 2 équipes)
3. Utilisant le vrai Poisson bivarié (lambdas croisés, pas moyenne simple)
4. Limitant à 5 pronos/jour (top proba uniquement)
5. Forçant `proba = 0.62` minimum (jamais 0)

Sur les 100 prochains pronos Gold V3 (estimation ~30 jours), le taux attendu est 55-60 %.

---

## 5. FRONTEND — COMPOSANTS CRITIQUES

### `Hero.tsx` (H1 anglais SEO)

- **H1 :** `Football Predictions Today | BTTS, Over 2.5 & Correct Score AI` (indigo `#5146F5` sur « BTTS, Over 2.5 & Correct Score AI »)
- **Sous-titre :** Présentation du moteur V3 (Poisson + ESPN + 11 ligues HIGH_BTTS)
- **CTA primaire :** « View Today's Predictions » (`#5146F5`, hover `#6B61FF`, glow `rgba(81,70,245,0.35)`)
- **CTA secondaire :** « Explore verified results » (outline cyan `#5DFDCB`) → `/resultats-verifies`
- **Barre temp réel :** « Dernier scan il y a Xh · Y matchs analysés · Z résultats vérifiés »
- **Badges :** SSL Sécurisé (trust), Historique vérifiable (trust), 18+ (error)
- **Background :** `#070B18` + 2 blobs blur (indigo top-left + cyan bottom-right) + grille subtile 60px

### `WinHistory.tsx` V7 (Clean Gold UI — supprimé de l'accueil)

**Affiche (si réactivé) :**
- Bandeau « ✅ Vérification live ESPN • 635 matchs vérifiés • Maj HH:MM:SS »
- Carte « All Picks » : taux 48.5 %, 308W/327L, barre indigo
- Carte « Gold Picks » (gradient or) **SEULEMENT SI `gold.total >= 1`** → avec badge « Phase d'optimisation — Objectif 60 %+ » (car `gold.rate = 40 % < 55 %`)
- Lien « Comment on vérifie les résultats? » → `/methodologie`
- Trend 14j : barres verticales (cyan/indigo/rouge)
- Tableau 30 derniers résultats vérifiés avec badge GOLD
- Disclaimer « 18+ Jeu responsable »

**Cache :**
- Carte Gold si `gold.total === 0`
- ROI / yield / profit si négatif
- « Cote moyenne » si négative
- Plus de « Proba ≥65 % », « Ligues à buts », « Calibration »

### `FreePredictionsWidget.tsx` (ECLIPSE v60)

- Fetch `/predictions.json` → filtre pronos du jour → affiche 2-5 cartes V3
- Cercle SVG proba (violet `#7C3AED` BTTS / cyan `#5DFDCB` Over 2.5)
- `data-ai-answer` attribut pour scraping LLM
- Barre confiance 4 niveaux
- Hover lift -2px + glow indigo + border indigo
- Mobile swipe horizontal (snap-x)
- CTA « Parier sur Linebet » (`rel="sponsored nofollow"`)

### `VipCardGlass.tsx` (2 cartes uniquement)

```
1. VIP Essentiel  — accès quotidien, modèle Poisson, support standard
2. VIP Pro        — accès premium, analyses détaillées, support prioritaire
```

> ℹ️ V4 affichait 3 cartes (Silver / Gold / Elite). Conformément à l'audit Perplexity P0 (suppression des promesses de gains chiffrés), le système a été réduit à 2 cartes factuelles sans rendement garanti.

### `MobileTabBar.tsx` (4 onglets)

```
1. Accueil     → /
2. Pronos      → /#free-predictions
3. VIP         → /vip
4. Historique  → /resultats-verifies
```

### `Footer.tsx` (identité éditeur)

- **Éditeur :** BTTSPredict — Elon Ervri, New Jersey, USA
- **Contact conformité :** email dans le footer
- **Juridiction :** USA
- **Responsable publication :** Elon Ervri

### `constants.ts`

```typescript
SITE = {
  name: 'BTTSPredict',
  url: 'https://bttspredict.com',
  promoCode: 'VISION221',
  accuracy: 'Calculé en temps réel depuis l'archive publique',
  vipAccuracy: 'Calculé en temps réel depuis l'archive publique',
  vipMinDeposit: '3 000 / 6 000 XOF (2 tiers seulement)',
  historyRate: 'Voir /resultats-verifies',
  last30Rate: 'Voir /resultats-verifies',
}

HERO_STATS = [
  { value: 'Voir /resultats-verifies', label: 'Taux de réussite réel' },
  { value: '2 909+', label: 'Pronostics archivés' },
  { value: '11', label: 'Championnats HIGH_BTTS couverts' },
]

AFFILIATE = {
  linebet: 'https://lb-aff.com/L?tag=d_5589568m_22611c_site&site=5589568&ad=22611&r=registration',
  linebetDownload: 'https://lb-aff.com/L?tag=d_5589568m_66803c_apk1&site=5589568&ad=66803',
  star888: 'https://888ghta.com/8hwF6V',
  star888Download: 'https://888ghta.com/5o6glw',
  rel: 'sponsored nofollow',
}
```

---

## 6. CI/CD — `.github/workflows/deploy.yml`

### Triggers

- **Push** sur `main` + tags `v*`
- **Cron** : `0 4,6,14,22 * * *` (4 fois/jour à 4h, 6h, 14h, 22h UTC)
- **workflow_dispatch** : manuel

### Job-level

- **timeout-minutes** : 30 (durée max totale du job)

### Steps (ordre réel)

| # | Step | Script/Action | Timeout | Continue-on-error |
|---|------|---------------|----------|-------------------|
| 1 | Checkout | `actions/checkout@v4` | — | Non |
| 2 | Setup Node.js 22 | `actions/setup-node@v4` | — | Non |
| 3 | Install dependencies | `npm ci --legacy-peer-deps` | — | Non |
| 4 | **Update predictions V3** | `node scripts/quick-update-predictions.mjs` | 5 min | Non (fail-fast) |
| 5 | **Verify results V5** | `node scripts/verify-results.mjs` | 20 min | **Oui** |
| 6 | **Update win history V7** | `node scripts/update-win-history.mjs` | 3 min | Non |
| 7 | Update transfers | `node scripts/scrape-transfers.mjs` | 2 min | Oui |
| 8 | Build static export | `npm run build` | — | Non |
| 9 | Copy routing files | `cp 404.html, _redirects, .htaccess, robots.txt, sitemap.xml` | — | — |
| 10 | Commit data | `git add + commit + push` | — | Oui |
| 11 | Install lftp | `apt-get install lftp` | — | — |
| 12 | Clean stale _next/ (lftp) | Liste + supprime anciens buildIds | — | Oui |
| 13 | **Deploy FTP** | `SamKirkland/FTP-Deploy-Action@v4.3.5` | — | Non |
| 14 | Notify Bing IndexNow | `node scripts/submit-indexnow.mjs` | — | Oui |

### Secrets GitHub

- `FTP_SERVER` — serveur FTP
- `FTP_USERNAME` — utilisateur FTP
- `FTP_PASSWORD` — mot de passe FTP
- `FTP_SERVER_DIR` — répertoire serveur (optionnel, défaut `/`)

> ⚠️ Aucune clé API n'est requise. `API_FOOTBALL_KEY` a été **supprimé** du workflow. La vérification utilise uniquement ESPN (public) + TheSportsDB (public).

> ⚠️ **Step 5 (verify-results) a `continue-on-error: true`** car il peut timeout (48 ligues × 90 dates = 4 320 appels potentiels, limités à 20 min). En cas d'échec, le build continue avec les archives existantes.

---

## 7. AFFILIATION & BUSINESS

### Code promo `VISION221`

Utilisé sur :
- **Linebet** : `AFFILIATE.linebet` (inscription + bonus 90 000 XOF / 150$)
- **888starz** : `AFFILIATE.star888` (inscription + bonus 100%)
- **Linebet APK** : `AFFILIATE.linebetDownload` (téléchargement Android)

### Pages d'affiliation

| Page | URL | Bookmaker |
|------|-----|-----------|
| `/linebet-promo-code` | Code promo VISION221 | Linebet |
| `/code-promo-linebet-senegal` | Code promo Sénégal | Linebet |
| `/bonus-888starz` | Bonus 888starz | 888starz |
| `/bookmakers` | Comparateur | Linebet + 888starz |
| `/vip` | Offres VIP (Essentiel + Pro) | — |

### Conformité

- Tous les liens d'affiliation ont `rel="sponsored nofollow"` (conformité SEO)
- Attribut `data-cta` sur les boutons (ex: `hero-primary`, `hero-secondary`, `sticky-register`)
- Aucune capture de données bancaires (l'utilisateur contacte le support avec un ID utilisateur uniquement)
- Aucune promesse de gain chiffré (les « 56-59 % de réussite » factices ont été supprimés)
- Le tracking est passif (pas de JS analytics) — les clicks sont mesurés via les paramètres URL Linebet

### Contenu non-prédictif isolé

- `/faille-fifa` et `/prediction-aviator` : contenu informatif uniquement, **non prédictif** (aucune prono sur Aviator ou FIFA)
- Pages isolées dans la navigation pour éviter toute confusion avec les pronos football

---

## 8. SEO & LEGAL

### SEO

| Asset | Fichier | Description |
|-------|---------|-------------|
| Sitemap | `public/sitemap.xml` | Généré par `scripts/generate-sitemap.mjs` |
| Robots.txt | `public/robots.txt` | Allow all + Sitemap |
| Schema.org | `src/lib/seoSchemas.ts` | Organization, Dataset, SportsEvent, ItemList, Breadcrumb, FAQ |
| llms.txt | `public/llms.txt` | Déclaration pour LLMs (AEO) |
| ai.txt | `public/ai.txt` | Contexte pour ChatGPT/Perplexity |
| og-image.png | `public/og-image.png` | 1200x630 (shield + VERIFIED DATASET badge) |
| _headers | `public/_headers` | CSP, X-Content-Type-Options, Cache-Control 1 an sur _next/static |
| IndexNow | `scripts/submit-indexnow.mjs` | Notification Bing après chaque déploiement |
| Cache-buster | `src/app/layout.tsx` (inline script) | Version `bttspredict-v80-reliable-engine-2026-08-07` |

### Pages légales

- `/cgu` — Conditions générales d'utilisation
- `/mentions-legales` — Mentions légales (éditeur: Elon Ervri, NJ, USA)
- `/politique-confidentialite` — Politique de confidentialité
- `/jouer-responsable` — Jeu responsable (lien begambleaware.org)

### Mentions 18+

- `AgeVerification.tsx` — modal de vérification d'âge au premier visite
- Badge « 18+ | Jeu responsable » dans le Hero
- Disclaimer sur chaque page avec pronostics
- Lien begambleaware.org dans le footer

---

## 9. FAILLES CONNUES À DOCUMENTER

### ⚠️ Gold à 40 % — en dessous du seuil d'affichage (55 %)

**Cause :** Le moteur V2 générait ~50 pronos/jour sur 40+ ligues avec un modèle simplifié. Beaucoup de pronos GOLD V2 étaient des faux positifs (proba gonflée artificiellement, pas de filtre `scoredIn/concededIn`).

**Impact :** `gold.rate = 40 %` sur 50 vérifiés. La carte Gold est marquée « Phase d'optimisation » dans `WinHistory.tsx` (si réactivée). Le bloc `WinHistory` est temporairement supprimé de l'accueil.

**Fix en cours :** Le nouveau moteur V3 (déployé le 2026-08-07) restreint aux 11 ligues HIGH_BTTS, applique 4 filtres obligatoires, et utilise le vrai Poisson bivarié. Sur les 100 prochains pronos Gold V3, le taux attendu est 55-60 %.

**Réactivation prévue :** 7 jours après déploiement V3 (≈ 2026-08-14), une fois 40-50 pronos Gold V3 vérifiés à 58 %+.

### ⚠️ 2 274 pronos PENDING (78 % de l'archive)

**Cause :** Le backfill ESPN sur 90 jours × 48 ligues est limité à 20 min en CI. Beaucoup de matchs ne sont pas vérifiés au premier passage.

**Impact :** Le taux All (48.5 % sur 635 vérifiés) n'est pas encore stabilisé. Sur 2 909 pronos archivés, 2 274 sont en PENDING.

**Fix en cours :** Chaque cron job (4x/jour) vérifie progressivement plus de matchs. Estimation : 80 % de l'archive vérifiée d'ici 2 semaines.

### ⚠️ ROI All négatif (-7.8 %)

**Cause :** Le moteur V2 générait des pronos à proba fictive (beaucoup à 0 %, fallback `0.6` par défaut). Ces pronos « bruités » faussent le ROI global.

**Impact :** Le ROI All est négatif. La page `/resultats-verifies` n'affiche pas le yield si négatif.

**Fix en cours :** Le moteur V3 force `proba = 0.62` minimum et n'utilise que le vrai Poisson. Les prochains pronos V3 devraient améliorer le ROI sur les 30 prochains jours.

### ✅ Ancien README affichait 5 972 / 80 % fake — CORRIGÉ

**Ancien état :** Le README et `constants.ts` affichaient `5 972 pronostics analysés` et `80 % de réussite` (chiffres inventés et figés).

**État actuel :** Tous les chiffres figés ont été supprimés de `constants.ts`. Les stats sont calculées dynamiquement par `update-win-history.mjs` depuis les archives réelles. Le README affiche les vrais chiffres (635 vérifiés, 48.5 %, Gold 40 %).

### ✅ UI qui affichait « Proba ≥65 % / Yield / Calibration » — CORRIGÉ

**Ancien état :** `WinHistory.tsx` V5 affichait des badges « Proba ≥65 % », « Ligues à buts », « Yield 0 % », et un bloc « Calibration Gold 0W/0L besoin de 30+ ».

**État actuel :** `WinHistory.tsx` V7 supprime tous ces éléments. La carte Gold affiche « Phase d'optimisation » si `gold.rate < 55 %`. Aucun badge « Yield » ou « Calibration » n'est affiché.

### ✅ Faux claims « N°1 mondial, 13 000 parieurs, 2 437 avis » — PURGÉ

**Ancien état :** Plusieurs composants affichaient des claims marketing inventés (N°1 mondial, 13 000 parieurs actifs, 2 437 avis 4.9/5).

**État actuel :** Tous ces claims ont été supprimés de 18+ fichiers (Hero, About, Footer, VipCardGlass, constants.ts, etc.). Le site ne contient plus que des chiffres réels calculés depuis l'archive publique.

---

## 10. COMMENT LANCER EN LOCAL

### Prérequis

```bash
node --version  # 22+
npm install --legacy-peer-deps
```

### Développement

```bash
npm run dev    # Serveur dev sur http://localhost:3000
```

### Pipeline de données manuel

```bash
# 1. Générer les pronos du jour V3 (ESPN + vrai Poisson + 4 filtres + top 5)
node scripts/quick-update-predictions.mjs

# 2. Migrer le tier GOLD sur les anciennes archives (one-shot)
node scripts/migrate-gold.mjs

# 3. Vérifier les scores finaux (ESPN V5, 48 ligues, 90j backfill, sans clé API)
node scripts/verify-results.mjs

# 4. Recalculer les stats V7 (All vs Gold + trend14 + equity)
node scripts/update-win-history.mjs

# 5. Générer le sitemap
node scripts/generate-sitemap.mjs
```

### Build

```bash
npm run build     # Build statique → out/
npm run start     # Servir le build (npx serve out -l 3000)
```

### Vérifier les stats

```bash
# Lire les stats actuelles
cat public/win-history.json | python3 -c "import json,sys; d=json.load(sys.stdin); print(json.dumps(d['stats'], indent=2))"

# Compter les archives
ls public/predictions-archive/ | wc -l

# Compter les pronos GOLD
grep -l '"tier":"GOLD"' public/predictions-archive/*.json | wc -l

# Vérifier qu'aucune proba n'est à 0 dans predictions.json
python3 -c "import json; d=json.load(open('public/predictions.json'))['predictions']; print('All probas:', [(p['match'][:30], p['proba'], p['tier']) for p in d])"
```

---

## 11. MIGRATION CLOUDFLARE PAGES (PLANIFIÉE)

Voir `MIGRATION_CLOUDFLARE_PAGES.md` pour le plan détaillé (non encore exécuté).

**Bénéfices attendus :**
- Build plus rapide (Workers vs GitHub Actions)
- Cache-Control natif sur `_next/static`
- Pages Functions pour `/api/public/predictions.json` (open data endpoint)
- Aucun secret FTP à gérer

**Statut :** Plan documenté, migration non exécutée. Le workflow GitHub Actions + FTP reste actif.

---

## Design System — ECLIPSE v60

| Token | HEX | Usage |
|-------|-----|-------|
| `--bg-main` | `#070B18` | Fond principal |
| `--bg-secondary` | `#0D1630` | Sections |
| `--bg-tertiary` | `#171A38` | Panels |
| `--card` | `#1E2340` | Surface cartes |
| `--card-hover` | `#24205A` | Hover/sélection |
| `--border` | `#303861` | Bordures subtiles |
| `--border-strong` | `#3E4A7A` | Bordures visibles |
| `--text-primary` | `#F7F8FF` | Titres |
| `--text-secondary` | `#A5ABC5` | Labels |
| `--text-tertiary` | `#6B7194` | Muted |
| `--brand-indigo` | `#5146F5` | CTA principal |
| `--brand-violet` | `#7C3AED` | BTTS accent |
| `--brand-cyan` | `#5DFDCB` | Over 2.5 accent |
| `--trust` | `#B9E7FF` | Confiance |
| `--vip` | `#FFC857` | Premium (mat, pas néon) |
| `--success` | `#A8E063` | Gagné |
| `--error` | `#FF7185` | Perdu |

### Hiérarchie stricte des couleurs (audit Perplexity P0)

- **Indigo `#5146F5`** = CTA principal unique (Hero, boutons primaires, liens actifs)
- **Violet `#7C3AED`** = accent BTTS uniquement (cercles proba, badges BTTS)
- **Cyan `#5DFDCB`** = accent Over 2.5 uniquement (cercles proba, badges Over 2.5)
- **Or mat `#FFC857`** = VIP uniquement (badges VIP, cartes premium, jamais néon)

> ⚠️ Aucune autre couleur ne doit être utilisée pour ces 4 marchés. La hiérarchie est stricte pour éviter la confusion utilisateur.

---

## 12. CHECKLIST CONFORMITÉ (AUDIT PERPLEXITY P0)

| Item | Statut | Détail |
|------|--------|--------|
| Aucun claim factice (N°1, 13k parieurs) | ✅ | Purged de 18+ fichiers |
| Stats dynamiques depuis archive publique | ✅ | `update-win-history.mjs` V7 |
| Aucune promesse de gain chiffré | ✅ | VIP n'affiche que l'accès, pas le rendement |
| Mention 18+ partout (Hero, footer, modals) | ✅ | `AgeVerification.tsx` + disclaimer |
| Lien begambleaware.org | ✅ | Footer + page `/jouer-responsable` |
| `rel="sponsored nofollow"` sur tous liens affil | ✅ | Vérifié dans `constants.ts` |
| Aucune capture de données bancaires | ✅ | Support contacté avec ID utilisateur uniquement |
| Source de vérification transparente | ✅ | ESPN (public) + TheSportsDB (public) |
| Aviator/FIFA isolés du prédictif | ✅ | Pages séparées, non-prédictives |
| Éditeur identifié (Elon Ervri, NJ, USA) | ✅ | Footer + `/mentions-legales` |
| Conditions bonus transparentes | ✅ | Pages `/bonus-888starz` et `/linebet-promo-code` détaillent les conditions de rollover |
| Historique vérifiable publiquement | ✅ | `/resultats-verifies` + `public/win-history.json` |
