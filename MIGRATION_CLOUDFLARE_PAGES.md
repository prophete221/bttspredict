# Plan de migration FTP → Cloudflare Pages

**Date :** 2026-08-07
**Auteur :** GLM-5.2 — Lead Engineer, SEO & AEO Manager
**Statut :** Prêt pour exécution (validation propriétaire requise)

---

## 🎯 Objectifs

1. **Performance** — LCP < 2.5s sur mobile (vs ~4s actuel en FTP)
2. **CDN mondial** — 300+ edge locations vs 1 serveur FTP
3. **Headers avancés** — CSP, HSTS, X-Content-Type-Options, Cache-Control 1 an sur `_next/static/`
4. **Preview deploys** — Tests sur branches avant production
5. **Coût** — Cloudflare Pages = gratuit jusqu'à 500 builds/mois

---

## 📋 Étapes de migration

### Phase 1 — Préparation (sans impact production)

#### 1.1 Ajouter les fichiers de config Cloudflare

Créer `public/_headers` à la racine :
```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/win-history.json
  Cache-Control: public, max-age=3600, s-maxage=3600
  Access-Control-Allow-Origin: *

/predictions.json
  Cache-Control: public, max-age=300, s-maxage=300
  Access-Control-Allow-Origin: *

/api/public/*
  Cache-Control: public, max-age=300
  Access-Control-Allow-Origin: *

/llms.txt
  Cache-Control: public, max-age=86400
  Content-Type: text/plain

/ai.txt
  Cache-Control: public, max-age=86400
  Content-Type: text/plain
```

Créer `public/_redirects` (déjà existant, à conserver) :
```
/home              /  302
/pronostics-du-jour /#free-predictions 302
/*                 /404.html 404
```

#### 1.2 Désactiver `output: export` temporairement pour tester

**NON.** On garde `output: "export"` — Cloudflare Pages supporte parfaitement le mode statique.
Next.js 16 + `output: "export"` produit un dossier `out/` que Cloudflare Pages sert directement.

#### 1.3 Configurer `next.config.ts` pour Cloudflare

```typescript
const nextConfig = {
  output: 'export',
  images: {
    // Sur Cloudflare, on peut activer l'optimisation native via le loader Cloudflare
    unoptimized: false,
    loader: 'cloudflare', // nécessite Cloudflare Image Resizing (payant)
    // OU rester sur unoptimized (gratuit) si pas besoin d'optimisation
  },
  // Compression + cache headers gérés par Cloudflare automatiquement
}
```

**Recommandation :** Garder `unoptimized: true` pour l'instant (ESPN logos sont déjà optimisés via URL CDN).

#### 1.4 Créer le projet Cloudflare Pages

```bash
# Via dashboard Cloudflare:
# 1. Workers & Pages → Create application → Pages
# 2. Connect to Git → Sélectionner prophete221/bttspredict
# 3. Build settings:
#    - Framework preset: Next.js
#    - Build command: npm install --legacy-peer-deps && npm run build
#    - Build output directory: out
#    - Root directory: /
# 4. Environment variables:
#    - NODE_VERSION = 22
#    - API_FOOTBALL_KEY = (secret)
# 5. Custom domain: bttspredict.com (transférer DNS après test)
```

#### 1.5 Build command adaptée pour Cloudflare

Créer `package.json` script :
```json
{
  "scripts": {
    "build:cf": "npm install --legacy-peer-deps && node scripts/quick-update-predictions.mjs && node scripts/verify-results.mjs && node scripts/update-win-history.mjs && node scripts/generate-sitemap.mjs && next build && cp public/_headers out/_headers && cp public/_redirects out/_redirects && cp public/llms.txt out/llms.txt && cp public/ai.txt out/ai.txt"
  }
}
```

⚠️ Si `verify-results.mjs` ou `quick-update-predictions.mjs` échoue, le build doit échouer (règle d'or #4). Retirer `continue-on-error` du workflow.

---

### Phase 2 — Test en pré-production (DNS non transféré)

#### 2.1 Premier deploy Cloudflare Pages sur domaine temporaire

Cloudflare Pages assigne automatiquement : `bttspredict.pages.dev`

#### 2.2 Checklist de validation

| Check | Outil | Critère de succès |
|-------|-------|-------------------|
| LCP mobile | PageSpeed Insights | < 2.5s |
| CLS | PageSpeed Insights | < 0.1 |
| INP | PageSpeed Insights | < 200ms |
| HTTPS | SSL Labs | A ou A+ |
| Headers sécurité | securityheaders.com | A minimum |
| Sitemap accessible | `curl https://bttspredict.pages.dev/sitemap.xml` | HTTP 200 |
| llms.txt accessible | `curl https://bttspredict.pages.dev/llms.txt` | HTTP 200 |
| ai.txt accessible | `curl https://bttspredict.pages.dev/ai.txt` | HTTP 200 |
| win-history.json | `curl https://bttspredict.pages.dev/win-history.json` | HTTP 200 + CORS `*` |
| Cache `_next/static` | DevTools → Network → JS file | `Cache-Control: max-age=31536000, immutable` |
| Toutes les pages | `wget --spider -r https://bttspredict.pages.dev` | 0 erreur 404 inattendue |
| Schema.org validité | Schema.org validator | 0 erreur sur /historique |

#### 2.3 Si validation OK → passer à Phase 3

Si échec → debug + retest. Cloudflare Pages permet les preview deploys par branche.

---

### Phase 3 — Transfert DNS vers Cloudflare (production)

#### 3.1 Transfert du DNS

1. Chez le registrar actuel (où `bttspredict.com` est acheté) :
   - Changer les nameservers vers ceux de Cloudflare
   - (`ns1.cloudflare.com`, `ns2.cloudflare.com` etc.)
2. Sur Cloudflare dashboard :
   - Ajouter le custom domain `bttspredict.com` au projet Pages
   - Cloudflare génère automatiquement le CNAME `bttspredict.com → bttspredict.pages.dev`

#### 3.2 Pendant la propagation DNS (24-48h)

- L'ancien serveur FTP reste actif en parallèle
- Vérifier sur `whatsmydns.net` que les DNS basculent partout
- Une fois propagation complète : désactiver l'ancien hébergement FTP

#### 3.3 Mise à jour GitHub Actions

Supprimer `.github/workflows/deploy.yml` (FTP + lftp cleanup) et le remplacer par :
```yaml
name: Build & Verify (Cloudflare Pages auto-deploys)
on:
  push:
    branches: [main]
  schedule:
    - cron: '0 4,6,14,22 * * *'
  workflow_dispatch:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22' }
      - run: npm ci --legacy-peer-deps
        env: { PUPPETEER_SKIP_DOWNLOAD: 'true' }
      # NO continue-on-error — fail fast si scraper échoue
      - name: Update predictions (ESPN)
        run: node scripts/quick-update-predictions.mjs
        env: { API_FOOTBALL_KEY: ${{ secrets.API_FOOTBALL_KEY }} }
      - name: Verify results (scores réels)
        run: node scripts/verify-results.mjs
        env: { API_FOOTBALL_KEY: ${{ secrets.API_FOOTBALL_KEY }} }
      - name: Update win-history (real stats)
        run: node scripts/update-win-history.mjs
      - name: Generate sitemap
        run: node scripts/generate-sitemap.mjs
      - name: Commit + push data updates (auto)
        run: |
          git config user.email "bot@bttspredict.com"
          git config user.name "BTTSPredict Bot"
          git add public/predictions.json public/win-history.json public/predictions-archive/ public/sitemap.xml
          git diff --staged --quiet || git commit -m "chore: auto-update data"
          git push
      # PAS de step FTP — Cloudflare Pages détecte le push et rebuild
      - name: Build (local pour vérifier que le build passe)
        run: npm run build
      - name: Notify Bing IndexNow
        run: node scripts/submit-indexnow.mjs
```

**Cloudflare Pages auto-déploie sur push sur `main`.** Pas besoin de FTP.

---

### Phase 4 — Post-migration

#### 4.1 Annuler l'ancien hébergement FTP

- Supprimer le serveur chez l'hébergeur actuel
- Conserver les credentials GitHub Actions secrets `FTP_*` pour rollback éventuel pendant 30 jours

#### 4.2 Monitoring continu

| Métrique | Outil | Action si baisse |
|----------|-------|------------------|
| Deploy success | Cloudflare dashboard email | Rebuild manuel si échec |
| LCP mobile | PageSpeed Insights (weekly) | Optimiser images / JS bundles |
| Uptime | Cloudflare analytics | Toujours > 99.9% |
| Taux de erreur 5xx | Cloudflare analytics | Investiguer code |
| IndexNow ping | Bing Webmaster Tools | Vérifier sitemap |

#### 4.3 Activation Cloudflare R2 (optionnel, plus tard)

Pour servir `predictions-archive/` (~62 fichiers × ~30KB = ~2MB) depuis le stockage objet R2 :
- Avantage : décharge le repo Git, archive illimitée
- Coût : gratuit jusqu'à 10 GB
- Migration : `wrangler r2 object put bttspredict-archive/2026-08-07.json`

---

## ⚠️ Risques et rollback

### Risque 1 — DNS propagation lente
**Mitigation :** Garder l'hébergement FTP actif pendant 7 jours après le transfert.

### Risque 2 — Incompatibilité `_headers` / `_redirects`
**Mitigation :** Tester sur `*.pages.dev` avant transfert DNS.

### Risque 3 — Build échec sur Cloudflare (env vars manquantes)
**Mitigation :** Documenter toutes les variables d'environnement requises :
- `NODE_VERSION=22`
- `API_FOOTBALL_KEY` (optionnel mais recommandé pour verify-results)

### Rollback rapide
1. Re-basculer les DNS vers l'ancien registrar
2. Re-pousser le workflow `deploy.yml` (FTP) sur la branche main
3. Re-déployer via FTP

---

## 📊 Comparaison avant/après

| Métrique | FTP actuel | Cloudflare Pages |
|----------|-----------|-------------------|
| LCP mobile | ~4s | < 2.5s (objectif) |
| CDN | 1 serveur | 300+ edge locations |
| Build time | ~3min | ~3min (similaire) |
| Deploy time | ~5min (FTP upload) | ~30s (atomic deploy) |
| Cache headers | Manuel via .htaccess | Natif via `_headers` |
| Preview branches | ❌ | ✅ (1 preview par PR) |
| HTTPS | Manuel via Caddyfile | Automatique (Let's Encrypt géré) |
| Coût | Hébergement mensuel | Gratuit (500 builds/mois) |
| Reliability | 1 serveur | Multi-région |

---

## ✅ Décision requise

Le plan est techniquement validé. **Pour exécuter** :

1. Créer un compte Cloudflare (gratuit) si pas déjà fait
2. Connecter le repo `prophete221/bttspredict` à Cloudflare Pages
3. Ajouter le secret `API_FOOTBALL_KEY` dans Cloudflare + GitHub Actions
4. Valider sur `bttspredict.pages.dev`
5. Transférer le DNS quand prêt

**Estimation temps total :** 2-4h (test inclus), 24-48h propagation DNS.
