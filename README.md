# BTTSPredict — Pronostics BTTS & Over 2,5

Plateforme de pronostics football BTTS (Both Teams To Score) et Over 2,5 basés sur un modèle statistique (xG + Poisson lorsque ces données sont disponibles). Données ESPN publiques, suivi public vérifiable depuis le 08/08/2026.

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
│   ├── vip/page.tsx       # Page VIP (carte premium verrouillée + unlock modal)
│   ├── btts/              # BTTS predictions + statistics (spécialisé BTTS)
│   │   ├── predictions/today/        # Dashboard avec AI Combo of the Day
│   │   ├── predictions/tomorrow/
│   │   └── statistics/
│   ├── over-2-5/          # Over 2.5 predictions + statistics (spécialisé Over 2,5)
│   │   ├── predictions/today/
│   │   └── statistics/
│   ├── btts-and-over-2-5-predictions-today/  # Page prédictions combinées
│   ├── ai-correct-score-predictions/   # Page scores exacts (Poisson)
│   ├── bonus-888starz/    # Page code promo 888Starz
│   ├── code-promo-linebet-senegal/  # Page code promo Linebet
│   ├── linebet-promo-code/  # Page redirect 301 → /code-promo-linebet-senegal
│   ├── resultats-verifies/  # Historique auditable
│   ├── historique/        # Historique complet vérifié
│   ├── methodologie/      # Méthodologie modèle statistique + critères qualité Combo
│   ├── sitemap.ts         # Sitemap Next.js natif (18 URLs actives)
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
│   ├── teamLogos.ts       # Résolution logos ESPN
│   └── motionPresets.ts   # Animations framer-motion réutilisables
├── hooks/                 # Hooks React (useAnimations, use-mobile, use-toast)
└── app/globals.css        # Variables CSS Slate Design System v68+

public/
├── predictions.json       # Pronostics du jour (généré par CI)
├── win-history.json       # Historique vérifié (généré par CI)
├── predictions-archive/   # Archive quotidienne horodatée
├── tracking-period.json  # Période de suivi public
├── robots.txt            # Autorise tous les bots + chatbots IA
├── sitemap.xml           # Généré par Next.js (18 URLs)
├── manifest.json         # PWA manifest
├── llms.txt              # Contexte pour LLMs (ChatGPT, Perplexity, Claude)
├── ai.txt                # Contexte pour AI assistants
├── humans.txt            # Équipe et mission
├── .htaccess             # Redirects 301 + routing statique
├── 404.html              # Page 404 custom
└── logo/, logos/         # Logos équipes et bookmakers

scripts/
├── quick-update-predictions.mjs  # Génération pronostics (ESPN API + Poisson v92 real-data)
├── enrich_predictions.py         # Enrichissement Gemini par lots (champs ai_*)
├── verify-results.mjs             # Vérification post-match (ESPN)
├── update-win-history.mjs         # Mise à jour historique
├── scrape-transfers.mjs          # Transferts joueurs
├── submit-indexnow.mjs            # Indexation Bing IndexNow
├── verify-seo.mjs                 # Audit SEO post-build (title ≤70, desc ≤160)
└── seo-report.mjs                 # Rapport SEO complet
```

## Pages du site — 18 URLs canoniques (sitemap)

La source de vérité est `src/app/sitemap.ts`. Le XML public contient 18 entrées actives, avec les pages de pronostics, les pages éditoriales, les pages légales et les pages affiliées distinctes.

| Route | Description | Priorité | Fréquence |
|-------|-------------|----------|-----------|
| `/` | Homepage — Pronostics BTTS et Over 2,5 du jour | 1.0 | daily |
| `/btts/predictions/today` | Pronostics BTTS du jour + analyse Gemini | 0.9 | daily |
| `/over-2-5/predictions/today` | Pronostics Over 2,5 du jour | 0.9 | daily |
| `/btts-and-over-2-5-predictions-today` | Prédictions combinées BTTS + Over 2.5 | 0.9 | daily |
| `/ai-correct-score-predictions` | Scores exacts calculés par Poisson | 0.85 | daily |
| `/resultats-verifies` | Résultats vérifiés | 0.85 | daily |
| `/historique` | Historique complet vérifié | 0.85 | daily |
| `/vip` | Combinés VIP verrouillés et déblocage | 0.9 | daily |
| `/statistiques` | Page statistiques générale | 0.75 | monthly |
| `/methodologie` | Méthodologie du modèle statistique | 0.8 | monthly |
| `/cgu` | Conditions générales d’utilisation | 0.3 | yearly |
| `/politique-confidentialite` | Politique de confidentialité | 0.3 | yearly |
| `/mentions-legales` | Mentions légales | 0.3 | yearly |
| `/jouer-responsable` | Jeu responsable — ressources d’aide | 0.5 | yearly |
| `/btts-c-est-quoi` | Guide BTTS — définition et exemples | 0.75 | monthly |
| `/code-promo-linebet-senegal` | Code promo Linebet Sénégal | 0.95 | weekly |
| `/bonus-888starz` | Page historique code promo 888Starz | 0.9 | weekly |
| `/bonus-888starz-btts221` | Page dédiée au code `btts221` | 0.95 | daily |

## Pages additionnelles (hors sitemap)

| Route | Description |
|-------|-------------|
| `/btts/predictions/tomorrow` | Pronostics BTTS de demain |
| `/match/[slug]` | Page match détaillée (SSG, matchs pré-générés dynamiquement) |
| `/cgu` | Conditions générales d'utilisation |
| `/politique-confidentialite` | Politique de confidentialité |
| `/statistiques` | Page placeholder (statistiques en cours de compilation) |
| `/linebet-promo-code` | Page redirect 301 → `/code-promo-linebet-senegal` |
| `/predictions.json` | Route JSON (prédictions du jour) |
| `/sitemap.xml` | Sitemap XML généré par Next.js (16 URLs) |
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
| `/pronostics` | Alias public, canonical vers `/btts/predictions/today` |
| `/pronostics/aujourd'hui` | `/pronostics` |
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
- `https://bttspredict.com/sitemap.xml` (18 URLs canoniques)

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
npm test         # Tests Vitest
npm run lint     # ESLint
```

## Déploiement

Le déploiement est automatique via GitHub Actions (`.github/workflows/deploy.yml`) sur push vers `main` :

1. Sur une PR vers `main`, le job de contrôle teste le commit de la PR avec tests, lint, typecheck et build ; aucun FTP n’est lancé.
2. Sur push vers `main`, tag `v*`, planification ou lancement manuel, le job de déploiement utilise Node.js 22 et `npm ci --legacy-peer-deps`.
3. Génération des pronostics (`scripts/quick-update-predictions.mjs`) depuis ESPN + TheSportsDB et validation du timestamp/coup d’envoi.
4. Enrichissement Gemini (`scripts/enrich_predictions.py`) par lots de quatre matchs ; l’étape est tolérante à l’absence de clé ou à un échec de modèle.
5. Vérification des résultats, mise à jour de l’historique et des transferts.
6. Validation du dataset, build statique, copie des fichiers de routage et commit des données générées.
7. Nettoyage prudent des anciens dossiers `_next/`, puis miroir FTP vers la racine LWS via `lftp` sans suppression générale (`--delete` absent).
8. Notification IndexNow après un déploiement réussi.

Cron : `0 */4 * * *` (six exécutions quotidiennes, toutes les quatre heures, en UTC).

## Codes promo affiliés

- **Linebet** : `VISION221` (majuscules)
- **888Starz — parcours VIP et page dédiée** : `btts221` (minuscules)
- **Page historique `/bonus-888starz`** : conserve son contenu promotionnel historique `VISION221` ; ne pas confondre cette page avec la page dédiée `/bonus-888starz-btts221`.
- Dépôt minimum : à vérifier sur les sites officiels des bookmakers
- WhatsApp vérification : +1 540 670 4172

⚠ **Avertissement** : Les conditions et montants des bonus bookmakers peuvent évoluer. BTTSPredict ne présente plus de montants fixes ("90 000 XOF", "Bonus 200%") comme garantis — voir les mentions légales et les pages affiliées pour les formulations conditionnelles.

## Palette de couleurs (Slate Design System)

| Token | Couleur | Usage |
|---|---|---|
| `bg` | `#071018` | Fond principal |
| `surface` | `#0D1A20` | Cartes et panneaux |
| `border` | `#5D7880` | Bordures et séparateurs |
| `text` | `#F5F8F3` | Texte principal |
| `textSec` | `#B7C4C1` | Texte secondaire |
| Success / CTA | `#34D399` | État positif et données validées |
| Data / IA / Gold | `#B8FF1A` | Pronostics, IA et accents premium |
| Warning | `#B8FF1A` | Indicateur secondaire Over 2.5 |
| Danger | `#FF7B7B` | Erreur et qualité LOW |

## Conformité et anti-hallucination

### Données non sourcées
- Toutes les valeurs statistiques sans source vérifiable sont marquées **"À VÉRIFIER"** dans l'UI
- Les pages `/btts/statistics` et `/over-2-5/statistics` n'affichent aucun chiffre non sourcé
- Aucun taux de réussite inventé pour les sports VIP
- Aucune cote bookmaker artificielle (suppression de la colonne P/L basée sur cote 1.75 fixe)
- Aucune promesse temporelle ("dans 7 jours", "100+ matchs vérifiés")

### Affirmations éditoriales alignées avec le moteur
- Le terme "modèle IA nouvelle génération", "50+ variables", "calibration mensuelle", "entraîné sur 2023-2025" ont été supprimés du site
- Le terme "experts" est remplacé par "modèle statistique"
- Aucune référence à blessures/météo/H2H comme données systématiquement utilisées
- Le AI Combo of the Day est explicitement décrit comme sélection déterministe (pas Gemini)

### Placeholders désactivés
- **Google Analytics** : désactivé par défaut — activé uniquement si `NEXT_PUBLIC_GA_ID` est défini dans l'environnement de build (env-gating)
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
