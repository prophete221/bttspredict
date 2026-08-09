# BTTSPredict — Pronostics BTTS & Over 2.5

Plateforme de pronostics football BTTS (Both Teams To Score) et Over 2.5 basés sur un modèle Poisson + xG (Expected Goals). Données ESPN publiques, suivi public vérifiable depuis le 08/08/2026.

## Stack

- **Next.js 16** (App Router, `output: export` — site statique)
- **TypeScript** + **Tailwind CSS v4**
- **framer-motion** (animations)
- **shadcn/ui** (composants UI)
- Déploiement via **GitHub Actions** → **LWS** (FTP)

## Structure du projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx           # Homepage (6 pronos gratuits du jour)
│   ├── vip/page.tsx       # Page VIP (4 tiers + coupon du jour flouté)
│   ├── btts/              # BTTS predictions + statistics
│   ├── bonus-888starz/    # Page code promo 888Starz (pro)
│   ├── code-promo-linebet-senegal/  # Page code promo Linebet (pro)
│   ├── resultats-verifies/  # Historique auditable + Export CSV
│   ├── historique/        # Historique complet vérifié
│   ├── methodologie/      # Méthodologie modèle Poisson
│   ├── sitemap.ts         # Sitemap Next.js natif (12 URLs)
│   └── layout.tsx         # Layout global + metadata + VERSION cache
├── components/
│   ├── bttsbet/           # Composants BTTSPredict (38 fichiers)
│   │   ├── Navbar.tsx     # Navigation 6 liens
│   │   ├── Hero.tsx       # Hero homepage
│   │   ├── FreePredictions.tsx  # Cartes matchs gratuits (filtres + xG)
│   │   ├── PromoVip.tsx   # Coupon VIP du jour (team visible + flouté blur-12px)
│   │   ├── VipCardGlass.tsx  # 4 tiers VIP (Silver/Gold/Elite/Tous)
│   │   ├── Footer.tsx     # Footer (email pro, pas WhatsApp US)
│   │   └── ...
│   └── ui/                # Composants shadcn/ui
├── lib/
│   ├── constants.ts       # Liens affiliés (AFFILIATE.linebet/star888)
│   ├── seo.ts             # checkSeo() anti-récidive (title ≤60, desc ≤150)
│   └── matches.ts         # Chargement matchs SSG
├── hooks/                 # Hooks React (useAnimations, use-mobile, use-toast)
└── app/globals.css        # Variables CSS OR & ÉMERAUDE (#D4AF37 / #10B981)

public/
├── predictions.json       # Pronostics du jour (généré par CI)
├── win-history.json        # Historique vérifié (généré par CI)
├── predictions-archive/    # Archive quotidienne horodatée
└── robots.txt, sitemap.xml, manifest.json, etc.

scripts/
├── quick-update-predictions.mjs  # Génération pronostics (ESPN API)
├── verify-results.mjs             # Vérification post-match (ESPN)
├── update-win-history.mjs         # Mise à jour historique
├── scrape-transfers.mjs           # Transferts joueurs
├── submit-indexnow.mjs            # Indexation Bing IndexNow
├── verify-seo.mjs                 # Audit SEO post-build (title ≤70, desc ≤160)
└── seo-report.mjs                 # Rapport SEO complet
```

## Pages (12 URLs dans le sitemap)

| Route | Description |
|-------|-------------|
| `/` | Homepage — 6 pronos BTTS/Over 2.5 gratuits |
| `/btts/predictions/today` | Pronostics BTTS du jour |
| `/btts/statistics` | Statistiques BTTS par ligue |
| `/resultats-verifies` | Résultats vérifiables + Export CSV |
| `/historique` | Historique complet |
| `/vip` | Programme VIP (4 tiers + coupon flouté) |
| `/methodologie` | Méthodologie modèle Poisson |
| `/btts-c-est-quoi` | Guide BTTS |
| `/code-promo-linebet-senegal` | Code promo Linebet VISION221 |
| `/bonus-888starz` | Code promo 888Starz vision221 |
| `/jouer-responsable` | Jeu responsable |
| `/mentions-legales` | Mentions légales |

## Démarrage

```bash
npm install --legacy-peer-deps
npm run dev      # http://localhost:3000
npm run build    # Build statique → out/
```

## Déploiement

Le déploiement est automatique via GitHub Actions sur push vers `main` :
1. Génération pronostics (ESPN API)
2. Vérification résultats
3. Build statique
4. Déploiement FTP vers LWS

## Codes promo affiliés

- **Linebet** : `VISION221` (majuscules) — Bonus 90 000 XOF
- **888Starz** : `vision221` (minuscules) — Bonus 200%
- Dépôt minimum : 3 000 XOF
- WhatsApp vérification : +1 540 670 4172

## Couleur

- Fond : `#070A14`
- Cartes : `#111827`
- Bordures : `#1F2937`
- Or (CTA principal) : `#D4AF37` → `#B7952E`
- Émeraude (badges/success) : `#10B981` → `#059669`
- WhatsApp : `#25D366`

## 18+ Jeu responsable

BTTSPredict est un site informatif d'affiliation. Il ne prend pas de paris et ne collecte pas de fonds. Aucun gain n'est garanti. Les paris sportifs comportent un risque de perte.
