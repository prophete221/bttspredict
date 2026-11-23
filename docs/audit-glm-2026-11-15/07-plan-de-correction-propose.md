# 07 — Corrections recommandées, classées par priorité

> **Audit GLM du dépôt prophete221/bttspredict — 15 novembre 2026**
> Branche main, commit `5fb08ef` — audit statique du code, effectué exclusivement en lecture seule.
> Trois vagues de recommandations + zones rouges (modifications interdites sans autorisation) + décisions qui appartiennent à ChatGPT et au propriétaire. L'audit présente des faits et des recommandations, pas de décisions.

---

## Principe directeur avant toute correction

L'audit conclut que **les fondations techniques n'appellent aucune refonte** : socle Next.js 16 solide, worker VIP bien sécurisé, pipeline à l'échec fermé, 500 tests, déploiement verrouillé. Le déséquilibre du projet est entre la rigueur du code et la promesse faite à l'utilisateur (taux curaté, conformité incomplète, affirmations invérifiables). Par conséquent :

1. La vague 1 est prioritaire et ne touche pas l'architecture.
2. Aucune refonte visuelle ne doit commencer avant que la vague 1 soit validée et que les décisions de périmètre (ce qui est refait, ce qui est conservé) soient prises par ChatGPT et le propriétaire.
3. Toute intervention sur une page à SEO gelé doit faire passer les tests de préservation SEO à l'identique (voir fichier 06).
4. Les archives publiques (public/predictions-archive/) sont la preuve auditable du produit : ne jamais les supprimer ni les modifier.

## Vague 1 — Transparence et conformité (immédiat, sans refonte)

1. **Rendre le taux public défendable** (traite B16, risque 1) : publier à côté du taux curaté le taux brut calculé sur les archives (pertes incluses), et joindre à history-exclusions.json une justification par entrée (date, match, motif). Si certaines exclusions tiennent à des erreurs de source avérées, elles doivent être vérifiables publiquement. Conserver l'archive comme preuve — c'est déjà le cas et c'est précieux.
2. **Compléter la politique de confidentialité** (traite B20, risque 2) : sections Google Analytics (consenti, IP anonymisée), flux VIP (nature des données, finalité, worker destinataire, rétention 7 jours, droits d'accès et de suppression via le canal de contact), clés localStorage utilisées. Porter les versions anglaise et arabe au niveau de la version française (traite B21).
3. **Monter AgeVerification dans le layout racine** (traite B19, risque 3) — le composant est prêt — et supprimer ou corriger les composants morts à risque (VipSports et sa cote fabriquée, HowToGetVip et son taux inventé) pour éliminer le risque de réactivation.
4. **Assumer ou corriger la règle VIP opposée au gratuit** (traite B17, risque 5) : soit documenter explicitement dans la page VIP que les sélections premium sont construites en contraste avec le flux public, soit supprimer la contrainte du prompt et laisser l'analyse décider.

## Vague 2 — Sécurité et fiabilité (court terme)

1. **Réparer la chaîne TLS du FTP** (traite B4, risque 4) : installer le certificat correct côté LWS ou épingler son empreinte, puis activer ssl:verify et check_hostname ; à défaut, documenter le risque accepté et passer par SFTP/SSH si disponible.
2. **Corriger fuzzyMatch** (traite B2, risque 7) : ne pas retirer united/city de la normalisation, exiger un recouvrement de deux jetons ou une distance de Levenshtein bornée, ajouter un test matriciel (Manchester United/Manchester City, RCD Mallorca/Real Mallorca, etc.).
3. **Brancher test_ftp_inventory.py en CI** (traite B3, risque 14) : renommer en ftp_inventory_test.py ou ajuster le motif de découverte ; ajouter un test du matching de scores.
4. **Ajouter CSP et HSTS** dans _headers (traite B11, risque 19) et déplacer les trois scripts inline du layout vers des fichiers (ou au minimum documenter l'exception) ; échapper `<` dans tous les JSON.stringify injectés en JSON-LD (traite B10).
5. **Retirer le Caddyfile** du dépôt ou le placer hors périmètre de déploiement (B12) ; lier le worker au domaine principal plutôt qu'au domaine workers.dev (B13).

## Vague 3 — Hygiène et performance (planifié)

1. **Purger le dépôt** (risque 16) : retirer skills/ et les .pyc de l'historique (git rm + filtre d'historique ou répertoire dédié), archiver les scripts one-shot, viser un dépôt sous 40 Mo.
2. **Élaguer le frontend** (risques 13, 15, 17) : supprimer les ~33 composants morts, AuthContext.jsx et les dépendances fantômes, décider du sort de seoSchemas.ts (brancher ou supprimer avec son test de gel), retirer next-intl ou adopter réellement next-intl.
3. **Réduire le CSS** (risque 8) : reconstruire globals.css autour des classes réellement utilisées (l'audit fournit la liste des classes mortes), fusionner les 5 feuilles globales, charger les polices Poppins via next/font/local ou retirer les références.
4. **Harmoniser FR/en/ar** (traite B8, risque 20) : ensemencement au build sur les deux segments ; unifier la définition des tiers et clés entre src/lib/predictions.ts et les scripts (une source unique importée par le pipeline, comme le promet le commentaire du code).
5. **Corrections ciblées** : useCountUp (B1), cache de getMatchBySlug (B6), suppression de la route predictions.json redondante (B7), IndexNow URLs supprimées et branchement de verify-seo.mjs (risque 24).

## Zones rouges : ce qui ne doit pas être modifié sans autorisation explicite

1. **/en/btts-and-over-2-5-predictions-today** — URL stratégique déclarée par le propriétaire (fichier 06).
2. Les 4 pages du fixture seo-protected-baseline.json (accueil FR/EN, /en/over-2-5/predictions/today, page combinée EN) — titles, descriptions, canonicals, hreflang gelés par tests.
3. Les 4 URLs vérifiées en production (/ar/historique, /en/historique, /btts/statistics, /politique-confidentialite) — contenus et CTA localisés vérifiés par scripts.
4. Le schéma de public/predictions.json, win-history.json et history-exclusions.json — toute modification change le produit public et le taux affiché.
5. Les archives publiques (public/predictions-archive/) — preuve auditable du produit.
6. Le worker VIP (workers/vip-api), ses 7 migrations D1 et le panneau admin — système monétisé et sécurisé ; modification = risque de casser l'accès payant.
7. Le workflow .github/workflows/deploy.yml dans son ensemble (cron, concurrence, OIDC, FTP) — c'est l'infrastructure de publication.
8. La chaîne d'affiliation (affiliateTracking.ts, attributs rel, codes promo, disclaimers) — conformité et revenus.
9. Les composants à haut couplage listés au fichier 04 (Navbar, Footer, Shell, CookieConsent, AnalyticsLoader, MatchCenter, FreePredictions, i18n.ts, matches.ts, constants.ts...).
10. Toute URL, redirection, titre SEO, métadonnée et contenu stratégique — conformément aux instructions du propriétaire.

## Décisions qui appartiennent à ChatGPT et au propriétaire (l'audit ne tranche pas)

- Quelles pages sont refaites et lesquelles sont conservées (l'audit présente des faits, pas des décisions).
- Le sort de seoSchemas.ts (brancher partout vs supprimer avec son test).
- Le sort des deux flux VIP parallèles morts (VipApplication.tsx, VipClient.tsx) et du contexte AuthContext.jsx.
- L'adoption ou le retrait de next-intl.
- Assumer ou corriger la règle VIP opposée au gratuit (vague 1, point 4).
- L'ordre exact des vagues 2 et 3 selon les priorités commerciales.
- La stratégie CSS (reconstruction de globals.css vs fusion progressive des 5 feuilles).
- Tout ce qui touche aux mécanismes de publication (FTP, worker, workflow) — tests préalables obligatoires hors production.

---

## Conclusion de l'audit (source : section 12)

Ce dépôt est celui d'un projet réel, activement maintenu et, sur le plan de l'ingénierie, nettement au-dessus de la moyenne de sa catégorie : authentification worker sérieuse, pipeline à l'échec fermé, tests abondants, déploiement verrouillé, culture explicite de la donnée non inventée. Les fondations techniques n'appellent aucune refonte.

Le déséquilibre se situe ailleurs : entre la rigueur du code et la promesse faite à l'utilisateur. Le produit affiche un taux de réussite construit après curation des pertes, une fiabilité pondérée par des constantes, des étiquettes xG approximatives et des affirmations commerciales invérifiables, pendant que la conformité RGPD et la vérification d'âge — pourtant techniquement prêtes — restent incomplètes. Pour un site dont le modèle économique repose sur la confiance d'un public de parieurs, cette asymétrie est le principal risque du projet, bien plus que toute faiblesse technique recensée. Les recommandations de la vague 1 (section 11) traitent l'essentiel de ce déséquilibre en quelques jours de travail, sans toucher à l'architecture.
