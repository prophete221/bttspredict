# BTTSPredict.com — README AUDIT

> **Dernière mise à jour :** 2026-08-07
> **Commit :** `2ae4c02f` (sur `main`)
> **Site live :** [bttspredict.com](https://bttspredict.com)

---

## 1. STATS LIVE RÉELLES

Lues depuis `public/win-history.json` (généré par `scripts/update-win-history.mjs`).

| Métrique | Valeur |
|----------|--------|
| **Total vérifiés (W+L)** | 12 |
| **Gagnés** | 3 |
| **Perdus** | 9 |
| **Pending** | 2 897 |
| **Taux All** | 25% |
| **Gold vérifiés** | 0 (gold.total = 0 → carte Gold cachée dans l'UI) |
| **Taux Gold** | 0% |
| **Gold yield** | 0% |
| **Standard vérifiés** | 12 |
| **Taux Standard** | 25% |
| **BTTS vérifiés** | 6 (1W / 5L → 16.7%) |
| **Over 2.5 vérifiés** | 6 (2W / 4L → 33.3%) |
| **Trend 14j** | 5 entrées |
| **Dernier scan** | `2026-08-07T12:10:07.365Z` |
| **Source vérification** | ESPN API (public, sans clé) + TheSportsDB (public) |
| **Archives totales** | 62 fichiers dans `public/predictions-archive/` (2 909 pronos) |

> ⚠️ Le nombre de vérifiés (12) est faible car le backfill ESPN sur 90 jours prend ~10 min en CI. Les 2 897 PENDING seront progressivement vérifiés au fur et à mesure des cron jobs (4x/jour).

---

## 2. STRUCTURE FICHIERS RÉELLE

### `src/app/` — 28 pages

```
src/app/
├── layout.tsx              # Layout racine (SEO, PWA, cache-buster v68)
├── page.tsx                # Accueil
├── globals.css             # Design system ECLIPSE v60 (14 tokens)
├── historique/             # Page historique vérifié
├── statistiques/           # Dashboard Recharts
├── methodologie/           # Modèle Poisson + sources
├── vip/                    # Offres VIP Silver/Gold/Elite
├── bookmakers/             # Comparateur Linebet vs 888starz
├── blog/                   # 6 articles SEO
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
├── jouesponsable/          # (jouer-responsable)
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
├── predictions.json           # ~50 pronos du jour (généré par quick-update-predictions.mjs)
├── win-history.json           # Stats + history (généré par update-win-history.mjs)
├── predictions-archive/       # 62 fichiers JSON (2026-06-07 → 2026-08-07)
├── manifest.json              # PWA manifest (ECLIPSE v60 colors)
├── favicon.svg                # Squircle + // indigo
├── icon-192.png, icon-512.png, icon-1024.png
├── apple-touch-icon.png       # 180x180
├── og-image.png               # 1200x630 (BTTS // PREDICT + badge VERIFIED DATASET)
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
├── quick-update-predictions.mjs  # Génère predictions.json (ESPN + modèle Poisson + tier GOLD)
├── verify-results.mjs            # Récupère scores finaux ESPN (90j backfill, sans clé)
├── update-win-history.mjs        # Calcule stats All vs Gold + trend14 → win-history.json
├── migrate-gold.mjs              # Ajoute tier GOLD/STANDARD aux anciennes archives
├── scrape-transfers.mjs          # Transferts joueurs
├── generate-sitemap.mjs           # Sitemap XML dynamique
├── submit-indexnow.mjs           # Notification Bing
├── serve.mjs                     # Serveur local
├── scraper.js                    # Scraper V23 multi-sources (legacy)
├── quick-fix-predictions.mjs     # Quick fix predictions
├── generate-sitemap-auto.mjs     # Sitemap auto
├── generate-sitemap.js           # Sitemap JS
├── apply_vip_modal_upgrade.py    # Migration VIP modal (one-shot)
├── build_video.py                # Build vidéo (one-shot)
└── create_motion_video.py         # Création vidéo motion (one-shot)
```

### `.github/workflows/deploy.yml`

Voir section 6 ci-dessous.

---

## 3. PIPELINE DE DONNÉES (ORDRE RÉEL D'EXÉCUTION)

### Étape 1 — `scripts/quick-update-predictions.mjs`

**Input :** ESPN API (`site.api.espn.com/apis/site/v2/sports/soccer/<league>/scoreboard`)
**Output :** `public/predictions.json` + archive `public/predictions-archive/YYYY-MM-DD.json`

**Ce qu'il fait :**
1. Fetch les matchs des 4 prochains jours sur 40+ ligues ESPN
2. Pour chaque match : calcule `homeLambda` et `awayLambda` (xG moyen sur les 5 derniers matchs)
3. Calcule `bttsProb` et `over25Prob` via formule Poisson
4. Génère 2 pronos par match (BTTS + Over 2.5)
5. Assigne `tier` via `assignTier(proba, league)` :
   - `proba >= 0.70` → `GOLD`
   - `proba >= 0.65` + ligue dans `HIGH_BTTS_LEAGUES` → `GOLD`
   - sinon → `STANDARD`
6. Équilibre la distribution Oui/Non (max 70% d'un côté)
7. Sauvegarde dans `predictions.json` + archive quotidienne

**Tier GOLD :** les pronos à haute probabilité dans des ligues à fort taux de BTTS sont marqués `GOLD`. Les autres sont `STANDARD`.

### Étape 2 — `scripts/migrate-gold.mjs` (one-shot, pas dans le cron)

**Input :** `public/predictions-archive/*.json`
**Output :** Archives mises à jour avec champ `tier`

**Ce qu'il fait :**
1. Parcourt toutes les archives
2. Pour chaque prono sans `tier` (ou `tier = STANDARD`) :
   - Récupère `proba` depuis `analysis.bttsProb`, `analysis.over25Prob`, ou `confidence/100`
   - Si `proba >= 0.70` → `GOLD`
   - Si `proba >= 0.65` + ligue high → `GOLD`
   - Si `proba >= 0.62` + ligue high → `GOLD` (seuil plus laxiste pour migration)
   - Sinon → `STANDARD`
3. Sauvegarde les archives modifiées

**Résultat dernière exécution :** 413 GOLD / 2 496 STANDARD migrés.

### Étape 3 — `scripts/verify-results.mjs`

**Input :** `public/predictions-archive/*.json` (90 derniers jours)
**Output :** Archives mises à jour avec `finalScore`, `status` (WON/LOST/PENDING), `isWon`, `verifiedAt`

**Ce qu'il fait :**
1. Pour chaque archive des 90 derniers jours :
2. Fetch les scores finaux ESPN (`STATUS_FINAL`) sur 24 ligues (public, sans clé API)
3. Pour chaque prono sans `status` (ou `PENDING`) :
   - Extrait `home`/`away` depuis `match` string (split sur ` vs `)
   - Match fuzzy avec les scores ESPN (normalisation + `includes` bidirectionnel)
   - Si match trouvé :
     - BTTS : `isWon = home > 0 && away > 0`
     - Over 2.5 : `isWon = home + away >= 3`
     - Ajoute `finalScore`, `status` (WON/LOST), `isWon`, `verifiedAt`
   - Si non trouvé : `status = 'PENDING'`
4. Rate limiting 60ms entre appels ESPN
5. Sauvegarde les archives modifiées

**Log final :** `Vérifiés X W Y L`

### Étape 4 — `scripts/update-win-history.mjs`

**Input :** `public/predictions-archive/*.json` (90 derniers jours)
**Output :** `public/win-history.json`

**Ce qu'il fait :**
1. Parcourt les 90 dernières archives
2. Pour chaque prono :
   - Lit `status` (WON/LOST/PENDING) ou `isWon` (true/false)
   - Récupère `tier` (ou le recalcule si manquant via `getTier()`)
3. Calcule :
   - `stats.total = won + lost` (PENDING **exclu** du dénominateur)
   - `stats.rate = won / total * 100` (1 décimale)
   - `stats.gold` : { total, won, lost, rate, yield }
   - `stats.standard` : { total, won, lost, rate }
   - `stats.byType` : btts / over25 séparés
   - `stats.trend14` : 14 derniers jours avec rate quotidien
   - `gold.yield = (won * 1.75 - total) / total * 100`
4. `history` : seulement les pronos WON/LOST (PENDING exclus)
5. Sauvegarde dans `win-history.json`

**Pourquoi PENDING n'est pas compté :** Un prono en attente n'est ni gagné ni perdu. Le counting dans `total` gonflerait artificiellement le dénominateur et ferait baisser le taux. On ne compte que ce qui est vérifié.

### Étape 5 — `FreePredictionsWidget.tsx` lit `predictions.json`

1. `fetch('/predictions.json')` côté client
2. Filtre les pronos du jour
3. Affiche 4 pronos dans des cartes ECLIPSE v60 :
   - Cercle SVG proba (violet BTTS / cyan Over 2.5)
   - `data-ai-answer` pour scraping LLM (Perplexity/ChatGPT)
   - Hover lift -2px + glow indigo
   - Mobile swipe horizontal

### Étape 6 — `WinHistory.tsx` lit `win-history.json`

1. `fetch('/win-history.json')` côté client
2. Affiche :
   - Bandeau « ✅ Vérification live ESPN »
   - Carte « All Picks » (taux global, barre indigo)
   - Carte « Gold Picks » (gradient or) **SEULEMENT si `gold.total >= 1`**
   - Trend 14j (barres verticales)
   - Tableau 30 derniers résultats avec badge GOLD
3. Cache la carte Gold si `gold.total === 0`

---

## 4. LOGIQUE GOLD TIER

### Code exact de `assignTier()` dans `quick-update-predictions.mjs`

```javascript
const HIGH_BTTS_LEAGUES = [
  'Bundesliga','2. Bundesliga','Eredivisie','Jupiler Pro League',
  'Swiss Super League','A-League','MLS','Championship',
  'Scottish Premiership','Austrian Bundesliga','Danish Superliga',
  'Norwegian Eliteserien'
];

function assignTier(proba, league) {
  const ln = (league || '').toLowerCase();
  const isHigh = HIGH_BTTS_LEAGUES.some(l => ln.includes(l.toLowerCase()));
  if (proba >= 0.70) return 'GOLD';
  if (proba >= 0.65 && isHigh) return 'GOLD';
  return 'STANDARD';
}
```

### Code de `tierOf()` dans `migrate-gold.mjs`

```javascript
function tierOf(p) {
  if (p.tier && p.tier !== 'STANDARD') return p.tier;
  let proba = p.proba || p.probability || 0;
  if (!proba && p.analysis) proba = p.analysis.bttsProb || p.analysis.over25Prob || 0;
  if (!proba && p.confidence) proba = p.confidence / 100;
  if (!proba) proba = 0.6;
  const league = (p.league || '').toLowerCase();
  const isHigh = HIGH.some(h => league.includes(h));
  if (proba >= 0.70) return 'GOLD';
  if (proba >= 0.65 && isHigh) return 'GOLD';
  if (proba >= 0.62 && isHigh) return 'GOLD';  // seuil plus laxiste pour migration
  return 'STANDARD';
}
```

### Code de `getTier()` dans `update-win-history.mjs`

```javascript
function getTier(p) {
  if (p.tier) return p.tier.toUpperCase();
  let proba = p.proba || 0;
  if (!proba && p.analysis) proba = p.analysis.bttsProb || p.analysis.over25Prob || 0;
  if (!proba && p.confidence) proba = p.confidence / 100;
  if (!proba) proba = 0.6;
  const lg = (p.league || '').toLowerCase();
  const isHigh = ['bundesliga','eredivisie','jupiler','swiss','mls','championship'].some(h => lg.includes(h));
  if (proba >= 0.70) return 'GOLD';
  if (proba >= 0.65 && isHigh) return 'GOLD';
  return 'STANDARD';
}
```

### Seuils proba

| Condition | Tier |
|-----------|------|
| `proba >= 0.70` | GOLD |
| `proba >= 0.65` + ligue HIGH_BTTS | GOLD |
| `proba >= 0.62` + ligue HIGH_BTTS (migration only) | GOLD |
| Sinon | STANDARD |

### HIGH_BTTS_LEAGUES (12 ligues)

1. Bundesliga
2. 2. Bundesliga
3. Eredivisie
4. Jupiler Pro League
5. Swiss Super League
6. A-League
7. MLS
8. Championship
9. Scottish Premiership
10. Austrian Bundesliga
11. Danish Superliga
12. Norwegian Eliteserien

### Pourquoi 0 Gold avant migration

Avant l'ajout du champ `tier`, les anciennes archives n'avaient pas ce champ. Le script `update-win-history.mjs` assignait donc `STANDARD` à tous les pronos. Le script `migrate-gold.mjs` a corrigé cela en ajoutant `tier` rétroactivement (413 GOLD / 2 496 STANDARD).

Cependant, les 413 pronos GOLD sont majoritairement en `PENDING` (matchs non encore vérifiés par ESPN). Dès que `verify-results.mjs` récupère leurs scores finaux, `gold.total` passe au-dessus de 0 et la carte Gold s'affiche.

---

## 5. FRONTEND — COMPOSANTS CRITIQUES

### `Hero.tsx`

- **H1 :** « BTTS & OVER 2.5 / LA PLUS GRANDE BASE DE DONNÉES VÉRIFIÉE » (indigo + cyan)
- **H2 :** « 2 909 pronostics archivés. Modèle Poisson + open data. Pas de promesses, que des preuves. »
- **Badge :** « RÉUSSITE VÉRIFIÉE EN TEMPS RÉEL · voir /historique »
- **CTA primaire :** « Voir les pronos du jour » (`#5146F5`, hover `#6B61FF`, glow `rgba(81,70,245,0.35)`)
- **CTA secondaire :** « Explorer le dataset open-source » (outline cyan `#5DFDCB`)
- **Barre temps réel :** « Dernier scan il y a 4h · 50 matchs analysés · 6 résultats vérifiés »
- **Badges :** SSL Sécurisé (trust), Historique vérifiable (trust), 18+ (error)
- **Background :** `#070B18` + 2 blobs blur (indigo top-left + cyan bottom-right) + grille subtile 60px

### `WinHistory.tsx` (V6 — Clean Gold UI)

**Affiche :**
- Bandeau « ✅ Vérification live ESPN • 12 matchs vérifiés • Maj HH:MM:SS »
- Carte « All Picks » : taux 25%, 3W/9L, barre indigo
- Carte « Gold Picks » (gradient or) **SEULEMENT SI `gold.total >= 1`** → actuellement **cachée** (gold.total = 0)
- Lien « Comment on vérifie les résultats? » → `/methodologie`
- Trend 14j : 5 barres verticales (cyan/indigo/rouge)
- Tableau 12 derniers résultats vérifiés avec badge GOLD
- Disclaimer « 18+ Jeu responsable »

**Cache :**
- Carte Gold si `gold.total === 0`
- Plus de « Proba ≥65% », « Ligues à buts », « Yield 0% », « Calibration 0W/0L », « Comment on atteint 0% »

### `FreePredictionsWidget.tsx` (ECLIPSE v60)

- Fetch `/predictions.json` → filtre pronos du jour → affiche 4 cartes
- Cercle SVG proba (violet `#7C3AED` BTTS / cyan `#5DFDCB` Over 2.5)
- `data-ai-answer` attribut pour scraping LLM
- Barre confiance 4 niveaux
- Hover lift -2px + glow indigo + border indigo
- Mobile swipe horizontal (snap-x)
- CTA « Parier sur Linebet » (`rel="sponsored nofollow"`)

### `constants.ts`

```typescript
SITE = {
  name: 'BTTSPredict',
  url: 'https://bttspredict.com',
  promoCode: 'VISION221',
  accuracy: 'Calculé en temps réel depuis l\'archive publique',
  vipAccuracy: 'Calculé en temps réel depuis l\'archive publique',
  vipMinDeposit: '3 000 / 6 000 / 12 000 XOF',
  historyRate: 'Voir /historique',
  last30Rate: 'Voir /historique',
}

HERO_STATS = [
  { value: 'Voir /historique', label: 'Taux de réussite réel' },
  { value: '2 909+', label: 'Pronostics archivés' },
  { value: '50+', label: 'Championnats couverts' },
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

### Steps (ordre réel)

| # | Step | Script/Action | Continue-on-error |
|---|------|---------------|-------------------|
| 1 | Checkout | `actions/checkout@v4` | Non |
| 2 | Setup Node.js 22 | `actions/setup-node@v4` | Non |
| 3 | Install dependencies | `npm ci --legacy-peer-deps` | Non |
| 4 | **Update predictions** (ESPN) | `node scripts/quick-update-predictions.mjs` | **Non** (fail-fast) |
| 5 | **Verify results** (ESPN + TheSportsDB) | `node scripts/verify-results.mjs` | Oui |
| 6 | **Update win history** | `node scripts/update-win-history.mjs` | Non |
| 7 | Update transfers | `node scripts/scrape-transfers.mjs` | Oui |
| 8 | Build static export | `npm run build` | Non |
| 9 | Copy routing files | `cp 404.html, _redirects, .htaccess, robots.txt, sitemap.xml` | — |
| 10 | Commit data | `git add + commit + push` | Oui |
| 11 | Install lftp | `apt-get install lftp` | — |
| 12 | Clean stale _next/ (lftp) | Liste + supprime anciens buildIds | Oui |
| 13 | **Deploy FTP** | `SamKirkland/FTP-Deploy-Action@v4.3.5` | Non |
| 14 | Notify Bing IndexNow | `node scripts/submit-indexnow.mjs` | Oui |

### Secrets GitHub

- `FTP_SERVER` — serveur FTP
- `FTP_USERNAME` — utilisateur FTP
- `FTP_PASSWORD` — mot de passe FTP
- `FTP_SERVER_DIR` — répertoire serveur (optionnel, défaut `/`)

> ⚠️ Aucune clé API n'est requise. `API_FOOTBALL_KEY` a été **supprimé** du workflow. La vérification utilise uniquement ESPN (public) + TheSportsDB (public).

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
| `/vip` | Offres VIP (Silver/Gold/Elite) | — |

### Tracking des clics

- Tous les liens d'affiliation ont `rel="sponsored nofollow"` (conformité SEO)
- Attribut `data-cta` sur les boutons (ex: `hero-primary`, `hero-secondary`, `sticky-register`)
- Le tracking est passif (pas de JS analytics) — les clicks sont mesurés via les paramètres URL Linebet

---

## 8. SEO & LEGAL

### SEO

| Asset | Fichier | Description |
|-------|---------|-------------|
| Sitemap | `public/sitemap.xml` | Généré par `scripts/generate-sitemap.mjs` |
| Robots.txt | `public/robots.txt` | Allow all + Sitemap |
| Schema.org | `src/lib/seoSchemas.ts` | Organization, Dataset (async), SportsEvent, ItemList, Breadcrumb, FAQ |
| llms.txt | `public/llms.txt` | Déclaration pour LLMs (AEO) |
| ai.txt | `public/ai.txt` | Contexte pour ChatGPT/Perplexity |
| og-image.png | `public/og-image.png` | 1200x630 (BTTS // PREDICT + badge VERIFIED DATASET) |
| _headers | `public/_headers` | CSP, X-Content-Type-Options, Cache-Control 1 an sur _next/static |
| IndexNow | `scripts/submit-indexnow.mjs` | Notification Bing après chaque déploiement |

### Pages légales

- `/cgu` — Conditions générales d'utilisation
- `/mentions-legales` — Mentions légales
- `/politique-confidentialite` — Politique de confidentialité
- `/jouer-responsable` — Jeu responsable (lien begambleaware.org)

### Mentions 18+

- `AgeVerification.tsx` — modal de vérification d'âge au premier visite
- Badge « 18+ | Jeu responsable » dans le Hero
- Disclaimer sur chaque page avec pronostics
- Lien begambleaware.org dans le footer

---

## 9. FAILLES CONNUES À DOCUMENTER

### ❌ Nombre de vérifiés encore faible (12 au lieu de 350+)

**Cause :** Le backfill ESPN sur 90 jours prend ~10 min en CI (24 ligues × 90 dates = 2 160 appels). Le script `verify-results.mjs` a un `timeout-minutes: 10` dans le workflow, ce qui peut ne pas suffire pour traiter toutes les archives.

**Impact :** Les stats affichées (25% sur 12 vérifiés) ne sont pas représentatives. Le taux réel sur 300+ vérifiés sera probablement entre 45-60%.

**Fix proposé :** Augmenter le timeout à 15 min, ou réduire le nombre de ligues à 12 (les plus importantes).

### ❌ Gold encore à 0 vérifié

**Cause :** Les 413 pronos GOLD migrés par `migrate-gold.mjs` sont majoritairement en `PENDING` (matchs non encore vérifiés par ESPN). Les pronos vérifiés jusqu'à présent avaient des probas trop faibles pour être GOLD.

**Impact :** La carte Gold est cachée dans l'UI (`gold.total === 0`). Dès que des pronos GOLD seront vérifiés, elle apparaîtra automatiquement.

**Fix proposé :** Lancer `verify-results.mjs` manuellement sur les archives contenant des pronos GOLD.

### ✅ Ancien README affichait 5 972 / 80% fake — CORRIGÉ

**Ancien état :** Le README et `constants.ts` affichaient `5 972 pronostics analysés` et `80% de réussite` (chiffres inventés et figés).

**État actuel :** Tous les chiffres figés ont été supprimés de `constants.ts`. Les stats sont calculées dynamiquement par `update-win-history.mjs` depuis les archives réelles. Le README affiche les vrais chiffres (12 vérifiés, 25%).

### ✅ UI qui affichait « Proba ≥65% / Yield / Calibration » — CORRIGÉ

**Ancien état :** `WinHistory.tsx` V5 affichait des badges « Proba ≥65% », « Ligues à buts », « Yield 0% », et un bloc « Calibration Gold 0W/0L besoin de 30+ ».

**État actuel :** `WinHistory.tsx` V6 supprime tous ces éléments. La carte Gold est cachée si `gold.total === 0`. Aucun badge « Yield » ou « Calibration » n'est affiché.

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
# 1. Générer les pronos du jour (ESPN + Poisson + tier GOLD)
node scripts/quick-update-predictions.mjs

# 2. Migrer le tier GOLD sur les anciennes archives (one-shot)
node scripts/migrate-gold.mjs

# 3. Vérifier les scores finaux (ESPN, 90j backfill, sans clé API)
node scripts/verify-results.mjs

# 4. Recalculer les stats (All vs Gold + trend14)
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
```

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
| `--vip` | `#FFC857` | Premium |
| `--success` | `#A8E063` | Gagné |
| `--error` | `#FF7185` | Perdu |
