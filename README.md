# BttsBet — Plateforme de Pronostics Football IA

Site web de pronostics football **BTTS** (Both Teams To Score) et **Over 2.5** générés par intelligence artificielle.
Code promo `VISION221` pour les bookmakers Linebet et 888starz (bonus 90 000 XOF).

🌐 **Site en production** : [bttsbet.online](https://bttsbet.online)

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
- **Space Grotesk** — titres (display)
- **Inter** — corps de texte
- **JetBrains Mono** — données statistiques, scores

---

## 🎨 Design System — "Quantum Stadium" v15

| Token | Valeur | Usage |
|---|---|---|
| `--color-midnight` | `#0B0E14` | Surface principale (onyx) |
| `--color-gold` | `#FFB800` | Accent primaire (or champagne) |
| `--color-success` | `#00E5A0` | Victoire, gains |
| `--color-ultra` | `#00E0FF` | Data viz, accents tech |
| `--color-lose` | `#FF4D6D` | Pertes |

Voir `src/app/globals.css` pour le système complet (squircle, glassmorphism, gradients, animations).

---

## 📂 Structure du Projet

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Accueil (assemble les sections)
│   │   ├── layout.tsx          # Layout racine (fonts, SEO, PWA)
│   │   ├── globals.css         # Design system Quantum Stadium
│   │   ├── statistiques/       # Dashboard Recharts (NOUVEAU v15)
│   │   ├── bookmakers/         # Comparateur Linebet vs 888starz (NOUVEAU v15)
│   │   ├── blog/               # 6 articles SEO
│   │   ├── bonus-888starz/     # Page conversion 888starz
│   │   ├── code-promo-linebet-senegal/
│   │   ├── prediction-aviator/
│   │   ├── faille-fifa/        # "Value Bets FIFA" (renommé pour conformité)
│   │   ├── historique/
│   │   ├── btts-c-est-quoi/
│   │   ├── cgu, mentions-legales, politique-confidentialite, jouer-responsable
│   │   └── api/route.ts        # API placeholder
│   ├── components/
│   │   ├── bttsbet/            # 20 composants principaux
│   │   │   ├── Hero.tsx             # Hero avec top pronostic du jour
│   │   │   ├── Navbar.tsx           # Navigation sticky premium
│   │   │   ├── FreePredictions.tsx  # Pronostics gratuits (filtres)
│   │   │   ├── WinHistory.tsx       # Historique résultats
│   │   │   ├── StatsDashboard.tsx   # Dashboard Recharts (NOUVEAU)
│   │   │   ├── AviatorVip.tsx       # Stats Aviator (avec disclaimers)
│   │   │   ├── FifaLinebet.tsx      # Value bets FIFA
│   │   │   ├── VipSports, PromoVip, VipUnlockModal
│   │   │   ├── AgeVerification, CookieConsent  # Conformité RGPD/18+
│   │   │   ├── SiteLoader, ScrollProgressBar, ErrorBoundary
│   │   │   └── AnimatedIcons        # Football3D, FloatingParticles
│   │   └── ui/                 # shadcn/ui
│   ├── lib/
│   │   ├── constants.ts        # Config centrale (SITE, AFFILIATE, BOOKMAKERS)
│   │   ├── motionPresets.ts    # Animations Framer Motion réutilisables
│   │   ├── teamLogos.ts
│   │   └── db.ts               # Prisma client
│   ├── hooks/
│   ├── contexts/
│   └── data/
├── public/
│   ├── predictions.json        # 50 pronostics du jour (généré par scraper)
│   ├── win-history.json        # Historique résultats (généré par scraper)
│   ├── predictions-archive/    # Archives quotidiennes
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service worker
│   ├── sitemap.xml, robots.txt
│   ├── og-image.png, logo.png, favicon.svg
│   └── logos/                  # Logos Linebet, 888starz, Android
├── scripts/
│   ├── scraper.js              # Scraper V23 (multi-sources)
│   ├── quick-update-predictions.mjs  # Update ESPN rapide
│   ├── update-win-history.mjs
│   └── generate-sitemap.mjs
├── prisma/schema.prisma        # Schema (User, Post — template)
├── .github/workflows/
│   ├── main.yml                # Push → build → FTP (safe mode, sans clean-slate)
│   ├── scraper.yml             # Cron 06:00 UTC → scraper complet → FTP
│   └── results-update.yml      # Cron 22:00 UTC → update résultats soir → FTP
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

3 workflows GitHub Actions (sans `dangerous-clean-slate` — safe mode) :

| Workflow | Trigger | Rôle |
|---|---|---|
| `main.yml` | Push sur `main` + cron 06:00 UTC | Build + deploy FTP |
| `scraper.yml` | Cron 06:00 UTC | Scraper V23 multi-sources + build + FTP |
| `results-update.yml` | Cron 22:00 UTC | Update résultats du soir + build + FTP |

**Secrets GitHub requis :**
- `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `FTP_SERVER_DIR`
- `API_FOOTBALL_KEY` (pour cross-validation des dates)

---

## 📊 Pipeline de données

Le scraper V23 agrège 6 sources (par priorité) :
1. **Forebet** — pronostics BTTS/Over d'experts
2. **Windrawwin** — pronostics BTTS
3. **ESPN API** — matchs réels (40+ ligues)
4. **API-Football** — cross-validation des dates
5. **Soccerbase** — fixtures HTTP
6. **TheSportsDB** — backup

Modèle statistique : **Poisson calibré** (seuils 0.48 BTTS / 0.49 Over 2.5, corrections +2% / +1%).
Génère 50 pronostics/jour sur 4 jours glissants.

---

## 🔍 SEO

- **Schema.org JSON-LD** : WebSite, Organization, FAQPage, BreadcrumbList, Dataset (sur /statistiques), WebPage (sur /bookmakers)
- **Meta tags** : OpenGraph, Twitter Card, canonical, geo (Sénégal)
- **Sitemap XML** généré automatiquement avant build
- **Prerendering** : export statique HTML pour crawlers
- **Pages légales** : CGU, mentions légales, politique de confidentialité, jeu responsable (lien begambleaware.org)
- **18+** : modal de vérification d'âge + badge dans le Hero

---

## ⚖️ Conformité légale

- ❌ Aucun terme "garanti", "faille", "hack", "predictor", "bot"
- ✅ Disclaimers "provably fair" sur Aviator
- ✅ Disclaimer "value bets statistiques" sur FIFA
- ✅ Transparence résultats (gagnés ET perdus affichés)
- ✅ Modal 18+ obligatoire
- ✅ Bannière cookies RGPD
- ✅ Lien begambleaware.org

---

## 🌍 Domaine

Déployé sur **bttsbet.online** via FTP (CI/CD GitHub Actions).
# trigger
