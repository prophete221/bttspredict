# BTTSPredict — Pronostics BTTS & Over 2,5

Plateforme de pronostics football BTTS (Both Teams To Score) et Over 2,5 basés sur un modèle Poisson + xG (Expected Goals). Données ESPN publiques, suivi public vérifiable depuis le 08/08/2026.

**URL de production** : https://bttspredict.com

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
│   ├── page.tsx           # Homepage — Pronostics BTTS et Over 2,5 du jour
│   ├── vip/page.tsx       # Page VIP (carte 3D verrouillée + unlock modal)
│   ├── btts/              # BTTS predictions + statistics (spécialisé BTTS)
│   │   ├── predictions/today/
│   │   ├── predictions/tomorrow/
│   │   └── statistics/
│   ├── over-2-5/          # Over 2.5 predictions + statistics (spécialisé Over 2,5)
│   │   ├── predictions/today/
│   │   └── statistics/
│   ├── bonus-888starz/    # Page code promo 888Starz (pro)
│   ├── code-promo-linebet-senegal/  # Page code promo Linebet (pro)
│   ├── resultats-verifies/  # Historique auditable + Export CSV
│   ├── historique/        # Historique complet vérifié
│   ├── methodologie/      # Méthodologie modèle Poisson
│   ├── sitemap.ts         # Sitemap Next.js natif (14 URLs)
│   └── layout.tsx         # Layout global + metadata + cache-busting
├── components/
│   ├── bttsbet/           # Composants BTTSPredict
│   │   ├── Navbar.tsx     # Navigation
│   │   ├── Hero.tsx       # Hero homepage
│   │   ├── FreePredictions.tsx  # Cartes matchs gratuits (BTTS + Over 2,5)
│   │   ├── PromoVip.tsx   # Carte VIP verrouillée
│   │   ├── VipUnlockModal.tsx  # Modal déverrouillage (instructions + vérif ID)
│   │   ├── Footer.tsx     # Footer (liens légaux + sociaux)
│   │   └── ...
│   └── ui/                # Composants shadcn/ui
├── lib/
│   ├── constants.ts       # Liens affiliés (AFFILIATE.linebet/star888)
│   ├── seo.ts             # checkSeo() anti-récidive (title ≤60, desc ≤150)
│   └── matches.ts         # Chargement matchs SSG
├── hooks/                 # Hooks React (useAnimations, use-mobile, use-toast)
└── app/globals.css        # Variables CSS Midnight Obsidian v90

public/
├── predictions.json       # Pronostics du jour (généré par CI)
├── win-history.json       # Historique vérifié (généré par CI)
├── predictions-archive/   # Archive quotidienne horodatée
├── tracking-period.json  # Période de suivi public
├── robots.txt            # Autorise tous les bots + chatbots IA
├── sitemap.xml           # Généré par Next.js (14 URLs)
├── manifest.json         # PWA manifest
├── llms.txt              # Contexte pour LLMs (ChatGPT, Perplexity, Claude)
├── ai.txt                # Contexte pour AI assistants
├── humans.txt            # Équipe et mission
├── .htaccess             # Redirects 301 + routing statique
├── 404.html              # Page 404 custom
└── logo/, logos/         # Logos équipes et bookmakers

scripts/
├── quick-update-predictions.mjs  # Génération pronostics (ESPN API + Poisson v91)
├── verify-results.mjs             # Vérification post-match (ESPN)
├── update-win-history.mjs         # Mise à jour historique
├── scrape-transfers.mjs          # Transferts joueurs
├── submit-indexnow.mjs            # Indexation Bing IndexNow
├── verify-seo.mjs                 # Audit SEO post-build (title ≤70, desc ≤160)
└── seo-report.mjs                 # Rapport SEO complet
```

## Pages du site — 14 URLs canoniques (sitemap)

| Route | Description | Priorité | Fréquence |
|-------|-------------|----------|-----------|
| `/` | Homepage — Pronostics BTTS et Over 2,5 du jour | 1.0 | daily |
| `/btts/predictions/today` | Pronostics BTTS du jour — les deux équipes marquent | 0.9 | daily |
| `/over-2-5/predictions/today` | Pronostics Over 2,5 du jour — au moins 3 buts | 0.9 | daily |
| `/btts/statistics` | Statistiques BTTS par ligue | 0.85 | monthly |
| `/over-2-5/statistics` | Statistiques Over 2,5 par ligue | 0.85 | monthly |
| `/resultats-verifies` | Résultats vérifiés + Export CSV | 0.85 | daily |
| `/historique` | Historique complet vérifié | 0.85 | daily |
| `/vip` | Programme VIP (carte 3D + coupon verrouillé) | 0.9 | daily |
| `/methodologie` | Méthodologie modèle Poisson | 0.8 | monthly |
| `/btts-c-est-quoi` | Guide BTTS — définition et exemples | 0.75 | monthly |
| `/code-promo-linebet-senegal` | Code promo Linebet VISION221 | 0.95 | weekly |
| `/bonus-888starz` | Code promo 888Starz vision221 | 0.9 | weekly |
| `/jouer-responsable` | Jeu responsable — ressources d'aide | 0.5 | yearly |
| `/mentions-legales` | Mentions légales | 0.3 | yearly |

## Pages additionnelles (hors sitemap)

| Route | Description |
|-------|-------------|
| `/btts/predictions/tomorrow` | Pronostics BTTS de demain |
| `/match/[slug]` | Page match détaillée (SSG, 13+ matchs pré-générés) |
| `/cgu` | Conditions générales d'utilisation |
| `/politique-confidentialite` | Politique de confidentialité |
| `/statistiques` | Page placeholder (à supprimer — rediriger vers `/btts/statistics`) |
| `/linebet-promo-code` | Page redirect 301 → `/code-promo-linebet-senegal` |
| `/predictions.json` | Route JSON (prédictions du jour) |
| `/sitemap.xml` | Sitemap XML généré par Next.js |
| `/404.html` | Page 404 personnalisée |

## Redirects 301 (`.htaccess`)

| Ancienne URL | Redirigée vers |
|---|---|
| `http://*` | `https://*` (HTTPS forcé) |
| `www.bttspredict.com` | `bttspredict.com` (non-www) |
| `/linebet-promo-code` | `/code-promo-linebet-senegal` |
| `/betting-tips` | `/` |
| `/bookmakers` | `/` |
| `/correct-score-predictions` | `/` |
| `/football-predictions-today` | `/` |
| `/league-predictions` | `/` |
| `/match-predictions` | `/` |
| `/over-2-5-predictions` | `/` |
| `/team-predictions` | `/` |
| `/pronostics` | `/` |
| `/pronostics/aujourd-hui` | `/` |
| `/prediction-aviator` | `/` |
| `/faille-fifa` | `/` |
| `/blog` | `/` |
| `/blog/*` | `/` |
| `/presse` | `/` |
| `/equipe` | `/` |
| `/over-2-5` | `/` |
| `/over-2-5/*` | `/` |

## Liens internes (navigation)

### Navbar
- Logo → `/`
- 6 liens : Accueil, Pronostics BTTS, Statistiques BTTS, Résultats vérifiés, VIP, Code promo Linebet

### Footer
- Liens légaux : `/cgu`, `/mentions-legales`, `/politique-confidentialite`, `/jouer-responsable`
- Liens internes : `/historique`, `/methodologie`

## Liens affiliés (20 liens, tous avec `rel="sponsored nofollow noopener noreferrer"`)

### Linebet
- **Inscription** : `https://lb-aff.com/L?tag=d_5589568m_22611c_site&site=5589568&ad=22611&r=registration`
- **Téléchargement APK** : `https://lb-aff.com/L?tag=d_5589568m_66803c_apk1&site=5589568&ad=66803`
- **Liens sociaux Linebet** :
  - `https://vision221.lineorgs.com/`
  - `https://linebet.press/vision221`
  - `https://linebetop.com/en?promocode=VISION221`

### 888Starz
- **Inscription** : `https://888ghta.com/8hwF6V`
- **Téléchargement APK** : `https://888ghta.com/5o6glw`

### Composants utilisant ces liens
| Composant | Lien(s) |
|---|---|
| `src/app/vip/page.tsx` | Linebet inscription + APK, 888Starz inscription + APK |
| `src/app/vip/VipClient.tsx` | 4 liens (Linebet + 888Starz, inscription + APK) |
| `src/app/code-promo-linebet-senegal/LinebetClient.tsx` | 2 liens Linebet |
| `src/app/bonus-888starz/Star888Client.tsx` | 2 liens 888Starz |
| `src/components/bttsbet/PremiumButton.tsx` | 1 lien générique (href en prop) |
| `src/components/bttsbet/FreePredictionsWidget.tsx` | 1 lien Linebet |
| `src/components/bttsbet/StickyCTABar.tsx` | 1 lien Linebet |
| `src/components/bttsbet/VipCardWidget.tsx` | 1 lien Linebet |
| `src/components/bttsbet/VipLevelModal.tsx` | 2 liens (Linebet + 888Starz) |
| `src/components/bttsbet/VipUnlockModal.tsx` | 2 liens (Linebet + 888Starz) |
| `src/components/bttsbet/LinebetApkButton.tsx` | 1 lien Linebet APK |
| `src/components/bttsbet/HowToGetVip.tsx` | 1 lien Linebet (dynamique) |

## Liens externes (sociaux et contact)

### Réseaux sociaux (Footer)
- **X (Twitter)** : `https://twitter.com/bttspredict`
- **Facebook** : `https://www.facebook.com/bttspredict`
- **Instagram** : `https://www.instagram.com/bttspredict`
- **LinkedIn** : `https://www.linkedin.com/company/bttspredict`
- **YouTube** : `https://www.youtube.com/@bttspredict`

### Contact
- **Email** : `mailto:contact@bttspredict.com`
- **WhatsApp** : `https://wa.me/15406704172` (vérification VIP)

### Sources de données
- **ESPN Soccer API** : `https://site.api.espn.com/apis/site/v2/sports/soccer/`
- **TheSportsDB** : `https://www.thesportsdb.com/`
- **ESPN team logos** : `https://a.espncdn.com/i/teamlogos/soccer/500/`

## Liens SEO et crawlers

### Sitemap
- `https://bttspredict.com/sitemap.xml` (14 URLs canoniques)

### robots.txt
Autorise **tous les bots** :
- **Moteurs** : Googlebot, Bingbot, DuckDuckBot, Baiduspider, YandexBot, Slurp, Sogou, Exabot, PetalBot
- **Sociaux** : Twitterbot, LinkedInBot, FacebookBot, TelegramBot, WhatsApp, Discordbot, Pinterest, Applebot
- **Chatbots IA** : GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Perplexity-User, Bytespider, Meta-ExternalAgent, Meta-ExternalFetcher, CCBot, Amazonbot, Applebot-Extended, cohere-ai, Google-Extended, GoogleOther
- **SEO tools** : semrushbot, AhrefsBot, MJ12bot, DotBot, ImagesiftBot, Diffbot

### IndexNow
- Clé : `ba48253f4d8544b3a93cc49a1498381a`
- Fichier de vérification : `public/ba48253f4d8544b3a93cc49a1498381a.txt`

### Fichiers contextuels pour LLMs
- `public/llms.txt` — Contexte pour ChatGPT, Perplexity, Claude, Gemini
- `public/ai.txt` — Contexte pour AI assistants
- `public/humans.txt` — Équipe et mission

## Démarrage

```bash
npm install --legacy-peer-deps
npm run dev      # http://localhost:3000
npm run build    # Build statique → out/
npm test         # Tests Vitest (34 tests)
npm run lint     # ESLint
```

## Déploiement

Le déploiement est automatique via GitHub Actions (`.github/workflows/deploy.yml`) sur push vers `main` :

1. Checkout `main`
2. Setup Node.js 22
3. `npm ci --legacy-peer-deps`
4. Génération pronostics (`scripts/quick-update-predictions.mjs` — ESPN API)
5. Vérification résultats (`scripts/verify-results.mjs`)
6. Mise à jour historique (`scripts/update-win-history.mjs`)
7. Build statique (`npm run build`)
8. Copy routing files (`.htaccess`, `404.html`, `robots.txt`, `sitemap.xml`)
9. Commit data (auto-update predictions, win-history, transfers)
10. Déploiement FTP vers LWS via `lftp`

Cron : `0 4,6,14,22 * * *` (4 mises à jour quotidiennes à 04h, 06h, 14h, 22h UTC)

## Codes promo affiliés

- **Linebet** : `VISION221` (majuscules)
- **888Starz** : `vision221` (minuscules)
- Dépôt minimum : 3 000 XOF — **À VÉRIFIER** sur les sites officiels des bookmakers
- WhatsApp vérification : +1 540 670 4172

⚠ **Avertissement** : Les bonus bookmakers ("90 000 XOF", "Bonus 200%", "mise x5") affichés sur le site sont des claims non sourcés. À vérifier sur les sites officiels Linebet et 888Starz avant publication commerciale.

## Palette de couleurs (Midnight Obsidian v90)

| Token | Couleur | Usage |
|---|---|---|
| `--bg-main` | `#07111A` | Fond principal (dark) |
| `--card` | `#102333` | Cartes |
| `--border` | `#1C3546` | Bordures |
| `--text-primary` | `#F2F7F5` | Texte principal |
| `--text-secondary` | `#B5C4C9` | Texte secondaire |
| `--text-tertiary` | `#7F969E` | Texte tertiaire |
| Baobab (CTA) | `#C7F464` | CTA principal (Linebet vert clair) |
| Data | `#63D6FF` | Données, IA |
| Copper | `#FF9F5A` | VIP/888Starz (rouge clair) |
| Success | `#7BE495` | Succès |
| Warning | `#FFD166` | Avertissement |
| Danger | `#FF7A7A` | Erreur |
| Gold | `#FFD700` | Premium VIP |

## Conformité et anti-hallucination

### Données non sourcées
- Toutes les valeurs statistiques sans source vérifiable sont marquées **"À VÉRIFIER"** dans l'UI
- Les pages `/btts/statistics` et `/over-2-5/statistics` n'affichent aucun chiffre non sourcé
- Aucun taux de réussite inventé pour les sports VIP

### Placeholders désactivés
- **Google Analytics** : `G-XXXXXXXXXX` désactivé via env-gating (`NEXT_PUBLIC_GA_ID` à définir dans GitHub Secrets)
- **Firebase** : `AIzaSyDemoKeyReplaceMeWithYourOwn` dans `AuthContext.jsx` (module mort non importé, non chargé en production)

### Liens affiliés
- **20/20 liens** avec `rel="sponsored nofollow noopener noreferrer"` (4 attributs complets)
- Disclosure visible sur toutes les pages affiliées : "Lien d'affiliation rémunéré. BTTSPredict ne prend pas de paris et ne collecte pas de fonds."

## 18+ Jeu responsable

BTTSPredict est un site informatif d'affiliation. Il ne prend pas de paris et ne collecte pas de fonds. Aucun gain n'est garanti. Les paris sportifs comportent un risque de perte. Jouez de manière responsable.

Ressources d'aide : `/jouer-responsable`

## Documentation

- `GLM_MASTER_EXECUTION_REPORT.md` — Rapport d'exécution complet (Tâches 001-002)
- `GLM_TASK_003_REPORT.md` — Audit pré-merge
- `GLM_TASK_004_REPORT.md` — Statistiques sourcées
- `GLM_TASK_005_REPORT.md` — Harmonisation liens affiliés

## Licence

Données ESPN publiques. Code propriétaire BTTSPredict. Aucune garantie future. 18+.
