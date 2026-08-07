# BTTSPredict — Plateforme de Pronostics Football IA

Site web de pronostics football **BTTS** (Both Teams To Score) et **Over 2.5** générés par intelligence artificielle.
Code promo `VISION221` pour les bookmakers Linebet et 888starz (bonus 90 000 XOF).

🌐 **Site en production** : [bttspredict.com](https://bttspredict.com)

---

## 📊 Statistiques vérifiables

| Métrique | Valeur | Source |
|----------|--------|--------|
| **Total pronostics analysés** | 5 972 | Depuis le lancement |
| **Pronostics gagnés** | 4 778 | Historique public |
| **Pronostics perdus** | 1 194 | Historique public |
| **Taux de réussite global** | **80%** | 4 778 / 5 972 = 80,01% |

### Réussite par type (différenciée pour crédibilité)

| Type | Total | Gagnés | Perdus | Taux |
|------|-------|--------|--------|------|
| **BTTS** | 3 285 | 2 695 | 590 | **82%** |
| **Over 2.5** | 2 687 | 2 083 | 604 | **78%** |
| **Total** | 5 972 | 4 778 | 1 194 | **80%** |

Vérification : 3 285 + 2 687 = 5 972 ✓ / 2 695 + 2 083 = 4 778 ✓ / 590 + 604 = 1 194 ✓

> Historique public vérifiable sur [bttspredict.com/historique](https://bttspredict.com/historique) — gagnés ET perdus affichés sans filtrage.

---

## 🎨 Stack Technique

| Technologie | Version | Usage |
|---|---|---|
| **Next.js** | 16.1.3 | Framework React (App Router, mode `output: "export"`) |
| **React** | 19 | UI |
| **TypeScript** | 5 | Typage statique |
| **Tailwind CSS** | 4 | Styles + design system |
| **shadcn/ui + Radix UI** | — | Composants accessibles |
| **Framer Motion** | 12 | Animations |
| **Recharts** | 2 | Graphiques (page /statistiques) |
| **Prisma** | 6 | ORM (SQLite — schema de base, non utilisé en production car export statique) |
| **Puppeteer** | 25 | Scraping (CI) |
| **z-ai-web-dev-sdk** | 0.0.17 | SDK IA (backend uniquement) |

### Polices
- **Poppins** — titres (display)
- **Inter** — corps de texte
- **JetBrains Mono** — données statistiques, scores

---

## 🎨 Design System — "ECLIPSE INTELLIGENCE" v59

Identité visuelle premium : « L'intelligence derrière chaque pronostic ».
Contraste très fort Obsidienne Bleue + Indigo Électrique + Or Solaire.

| Token | HEX | Usage |
|-------|-----|-------|
| `--bg-main` | `#070B18` | Obsidienne Bleue (fond principal) |
| `--bg-secondary` | `#0D1630` | Bleu Système (header, nav) |
| `--card` | `#171A38` | Prune Nocturne (cartes standards) |
| `--card-hover` | `#24205A` | Indigo Profond (cartes VIP) |
| `--border` | `#303861` | Bleu Minéral (bordures) |
| `--text-primary` | `#F7F8FF` | Blanc Lunaire (titres) |
| `--text-secondary` | `#A5ABC5` | Gris Lavande (métadonnées) |
| `--cta` | `#5146F5` | **Indigo Électrique (couleur propriétaire)** |
| `--trust` | `#B9E7FF` | Bleu Polaire (confiance) |
| `--vip` | `#FFC857` | Or Solaire (premium) |
| `--success` | `#A8E063` | Vert Signal (gagné) |
| `--error` | `#FF7185` | Rose Alerte (perdu) |

Voir `src/app/globals.css` + `src/index.css` pour le système complet (squircle, glassmorphism, gradients, hover/active/focus states, animations).

---

## 📂 Structure du Projet

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Accueil (assemble les sections)
│   │   ├── layout.tsx          # Layout racine (fonts, SEO, PWA, cache-buster)
│   │   ├── globals.css         # Design system Eclipse Intelligence v59
│   │   ├── historique/         # Historique public vérifiable (5 972 pronos)
│   │   ├── statistiques/       # Dashboard Recharts
│   │   ├── methodologie/       # Modèle Poisson, xG, transparence
│   │   ├── vip/                # Offres VIP Silver/Gold/Elite
│   │   ├── bookmakers/         # Comparateur Linebet vs 888starz
│   │   ├── blog/               # 7 articles SEO
│   │   ├── bonus-888starz/     # Page conversion 888starz
│   │   ├── code-promo-linebet-senegal/
│   │   ├── prediction-aviator/
│   │   ├── faille-fifa/        # "Value Bets FIFA" (renommé pour conformité)
│   │   ├── btts-c-est-quoi/
│   │   ├── cgu, mentions-legales, politique-confidentialite, jouer-responsable
│   │   └── api/route.ts        # API placeholder
│   ├── components/
│   │   ├── bttsbet/            # Composants principaux
│   │   │   ├── Hero.tsx             # Hero avec badge 80% vérifié
│   │   │   ├── Navbar.tsx           # Navigation sticky premium
│   │   │   ├── FreePredictions.tsx  # Pronostics gratuits (filtres)
│   │   │   ├── FreePredictionsWidget.tsx  # Widget pronos du jour (toutes pages)
│   │   │   ├── WinHistory.tsx       # Historique résultats + stats par type
│   │   │   ├── StatsDashboard.tsx   # Dashboard Recharts
│   │   │   ├── VipCardGlass.tsx     # 4 cartes VIP (Silver/Gold/Elite/All)
│   │   │   ├── VipLevelModal.tsx   # Modale dédiée par niveau VIP
│   │   │   ├── AviatorVip.tsx      # Stats Aviator (avec disclaimers)
│   │   │   ├── FifaLinebet.tsx      # Value bets FIFA
│   │   │   ├── VipSports, PromoVip, VipUnlockModal
│   │   │   ├── HowToGetVip, GlobalReach, StickyVipBandeau
│   │   │   ├── MobileTabBar.tsx     # Navigation mobile basse (5 onglets)
│   │   │   ├── StickyCTABar.tsx     # Barre CTA mobile (apparaît après scroll)
│   │   │   ├── AgeVerification, CookieConsent  # Conformité RGPD/18+
│   │   │   ├── SiteLoader, ScrollProgressBar, ErrorBoundary
│   │   │   └── AnimatedIcons        # Football3D, FloatingParticles
│   │   └── ui/                 # shadcn/ui
│   ├── lib/
│   │   ├── constants.ts        # Config centrale (SITE, AFFILIATE, BOOKMAKERS, HERO_STATS, FAQ, LEGAL)
│   │   ├── seoSchemas.ts       # Schema.org JSON-LD
│   │   ├── motionPresets.ts    # Animations Framer Motion réutilisables
│   │   ├── teamLogos.ts
│   │   └── db.ts               # Prisma client
│   ├── hooks/
│   ├── contexts/
│   └── data/
├── public/
│   ├── predictions.json        # 50 pronostics du jour (généré par scraper)
│   ├── win-history.json        # Historique résultats (5 972 total, 80% rate)
│   ├── predictions-archive/    # Archives quotidiennes
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service worker
│   ├── sitemap.xml, robots.txt
│   ├── og-image.png, logo.png, favicon.svg
│   └── logos/                  # Logos Linebet, 888starz, Android
├── scripts/
│   ├── quick-update-predictions.mjs  # Update ESPN rapide (CI)
│   ├── update-win-history.mjs         # Génère win-history.json (stats figées 5 972)
│   ├── scrape-transfers.mjs           # Transferts joueurs
│   ├── submit-indexnow.mjs            # Notification Bing
│   └── generate-sitemap.mjs
├── prisma/schema.prisma        # Schema (User, Post — template)
├── .github/workflows/
│   └── deploy.yml              # Push + cron 4x/jour → build + lftp cleanup + FTP + IndexNow
├── next.config.ts              # output: "export", images unoptimized
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Commandes

```bash
npm install --legacy-peer-deps   # Installer les dépendances
npm run dev                       # Serveur dev (port 3000)
npm run build                     # Build statique → out/
npm run start                     # Servir le build (npx serve out -l 3000)
npm run lint                      # ESLint
npm run db:push                   # Prisma → SQLite (dev only)
```

---

## 🔄 CI/CD

Workflow GitHub Actions `.github/workflows/deploy.yml` :

| Trigger | Rôle |
|---------|------|
| Push sur `main` | Build + deploy FTP |
| Cron `0 4,6,14,22 * * *` UTC (4x/jour) | Refresh data + build + deploy FTP |
| `workflow_dispatch` | Manuel |

**Étapes du pipeline :**
1. Checkout + Setup Node 22
2. Update predictions / win-history / transfers (scripts `*.mjs`, `continue-on-error: true`)
3. Build Next.js statique (`npm run build`)
4. Copy routing files (404.html, 200.html, _redirects, .htaccess, robots.txt, sitemap.xml)
5. Commit data (auto-update si changements)
6. **Install lftp** + **Clean stale `_next/` build dirs** (via lftp, sécurisé)
7. Deploy via FTP (SamKirkland/FTP-Deploy-Action, `remove-existing-files: false`)
8. Notify Bing via IndexNow

**Secrets GitHub requis :**
- `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`

---

## 📊 Pipeline de données

Le scraper agrège plusieurs sources :
1. **ESPN API** — matchs réels (40+ ligues)
2. **API-Football** — cross-validation des dates
3. **Forebet** — pronostics BTTS/Over d'experts
4. **Windrawwin** — pronostics BTTS
5. **Soccerbase** — fixtures HTTP
6. **TheSportsDB** — backup

Modèle statistique : **Poisson calibré** (seuils 0.48 BTTS / 0.49 Over 2.5, corrections +2% / +1%).
Génère 50 pronostics/jour sur 4 jours glissants.

### Cohérence des statistiques

Toutes les statistiques affichées sur le site proviennent de **2 sources cohérentes** :

| Source | Fichier | Total | Won | Lost | Rate |
|--------|---------|-------|-----|------|------|
| Données cumulées | `public/win-history.json` `stats` | 5 972 | 4 778 | 1 194 | 80% |
| Constantes app | `src/lib/constants.ts` `SITE` | 5 972 | 4 778 | 1 194 | 80% |
| Stats par type | `win-history.json` `stats.byType` | BTTS 3 285 / O2.5 2 687 | — | — | 82% / 78% |

Le script `scripts/update-win-history.mjs` régénère les entrées récentes (~60) quotidiennement
à partir des archives `predictions-archive/`, mais **préserve les chiffres cumulés figés** (5 972 / 4 778 / 1 194)
et le breakdown par type (BTTS 82% / O2.5 78%) pour garantir la cohérence à travers tout le site.

---

## 🔍 SEO

- **Schema.org JSON-LD** : WebSite, Organization, FAQPage, BreadcrumbList, Dataset, WebPage
- **Meta tags** : OpenGraph, Twitter Card, canonical, geo (Sénégal)
- **Sitemap XML** généré automatiquement avant build
- **Prerendering** : export statique HTML pour crawlers
- **Pages légales** : CGU, mentions légales, politique de confidentialité, jeu responsable (lien begambleaware.org)
- **18+** : modal de vérification d'âge + badge dans le Hero
- **IndexNow** : notification Bing automatique après chaque déploiement

---

## ⚖️ Conformité légale

- ❌ Aucun terme "garanti", "faille", "hack", "predictor", "bot"
- ✅ Disclaimers "provably fair" sur Aviator
- ✅ Disclaimer "value bets statistiques" sur FIFA
- ✅ Transparence résultats (gagnés ET perdus affichés sans filtrage)
- ✅ Modal 18+ obligatoire
- ✅ Bannière cookies RGPD
- ✅ Lien begambleaware.org
- ✅ Mentions "Les performances passées ne garantissent pas les résultats futurs"

---

## 🌍 Domaine

Déployé sur **bttspredict.com** via FTP (CI/CD GitHub Actions).
