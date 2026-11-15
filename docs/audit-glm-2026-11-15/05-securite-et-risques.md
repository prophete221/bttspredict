# 05 — Risques techniques et points sensibles

> **Audit GLM du dépôt prophete221/bttspredict — 15 novembre 2026**
> Branche main, commit `5fb08ef` — audit statique du code, effectué exclusivement en lecture seule.
> Fiche thématique : points forts et faiblesses de sécurité, registre des 24 risques priorisés, systèmes sensibles (VIP, accès, paiement, affiliation).

---

## 1. Points forts constatés (source : section 5.1)

Le worker VIP (workers/vip-api, 4 modules, 1 999 lignes) est la partie la mieux sécurisée du projet et dépasse ce qu'on observe habituellement sur ce type de site. L'endpoint interne de synchronisation /internal/vip-candidates/sync n'accepte que des jetons OIDC émis par GitHub Actions pour ce dépôt précis : vérification cryptographique de la signature JWT RS256 contre les clés publiques GitHub (JWKS avec rafraîchissement), contrôle de l'émetteur, de l'audience, du sujet, de l'identifiant du dépôt, du propriétaire, de la branche (refs/heads/main) et du workflow émetteur, plus une fenêtre de validité temporelle stricte. Un attaquant ne peut pas forger un tel jeton.

L'authentification administrateur est correctement conçue : mot de passe d'au moins 16 caractères fourni par variable d'environnement, jetons de session de 32 octets aléatoires stockés uniquement en haché SHA-256 en base, durée de vie d'une heure, révocation à la déconnexion, limitation à 5 échecs de connexion par fenêtre de 15 minutes par IP (hachée), et réponses d'erreur minimales. Les soumissions de demandes VIP sont plafonnées (5 par 15 minutes par IP, 20 demandes actives, 5 Mo de preuves cumulés) par des requêtes SQL atomiques ; les images de preuve sont validées par signature de fichier PNG/JPEG et plafonnées en dimensions. La politique CORS n'autorise que l'origine bttspredict.com. Le panneau d'administration public (public/vip-admin/admin.js) construit son DOM exclusivement avec textContent et replaceChildren — aucune injection HTML n'est possible — et conserve le jeton en sessionStorage avec validation de format.

La gestion des secrets est saine : le scan complet du dépôt ne révèle aucune clé API, aucun mot de passe ni aucun jeton en dur ; toutes les intégrations (Gemini, Odds-API, FTP, Telegram, administrateur) lisent des variables d'environnement ou des secrets GitHub. Le .gitignore exclut correctement .env* et *.pem, et aucun fichier d'environnement n'est committé. La clé IndexNow présente dans le code est un jeton public par conception du protocole. Le déploiement FTP est remarquablement verrouillé : diff par empreintes, allowlist explicite de commandes put, zéro suppression globale (le script prepare-stale-match-deletions.mjs produit délibérément zéro suppression), sauvegarde et restauration automatique de robots.txt et sitemap.xml, quota et temporisation anti-flood, et les 36 suppressions AR historiques ont été exécutées uniquement après vérification HTTP et FTP de chaque fichier, sous allowlist de préfixe.

---

## 2. Faiblesses et résidus de risque (source : section 5.2)

Cinq faiblesses concrètes ont été identifiées, classées par importance. La première est le contournement systématique de la vérification TLS sur le canal FTP : set ssl:verify no dans les scripts lftp et ssl_ctx.check_hostname=False dans ftp-inventory.py, pour un serveur dont le certificat n'est manifestement pas aligné. Les identifiants FTP (secrets GitHub) transitent donc sur une connexion chiffrée mais non authentifiée, ce qui rend théoriquement possible une attaque de l'intercepteur sur le canal de déploiement — c'est-à-dire sur le contenu public du site. La deuxième est l'incohérence de nommage qui maintient le test test_ftp_inventory.py hors de la CI : les workflows Python discoverent avec le motif *_test.py alors que ce fichier s'appelle test_*.py ; ses trois tests ne s'exécutent donc jamais.

La troisième faiblesse est le matching flou de verify-results.mjs (lignes 53 à 79) : la normalisation retire notamment les mots united et city, si bien que Manchester United et Manchester City se réduisent toutes deux à manchester, et le rattrapage par recouvrement de jetons peut attribuer un score au mauvais club homonyme. Un script correctif one-shot (recalculate-non-verdicts.mjs) documente qu'un incident de verdicts inversés a déjà eu lieu avant le 28 septembre 2026 ; aucun test ne couvre cette fonction. La quatrième est l'absence d'en-têtes Content-Security-Policy et Strict-Transport-Security dans public/_headers, ainsi que trois scripts inline dans le layout racine (dont un purgeur de service worker avec location.reload), qui rendent une CSP stricte impossible sans refactorisation. La cinquième est résiduelle : le Caddyfile committé expose un reverse proxy piloté par paramètre de requête (XTransformPort) — artefact d'environnement de développement qui ne doit jamais être déployé face à Internet — et le worker est exposé sur son domaine workers.dev par défaut (workers_dev: true), ce qui est acceptable mais superflu : la liaison au domaine principal réduirait la surface.

Enfin, la résistance à l'injection de contenu dans les JSON-LD est incomplète : les 43 usages de dangerouslySetInnerHTML injectent des données sérialisées sans échappement de la séquence </script> ; le contenu provient du pipeline interne (noms d'équipes et de ligues), donc le risque réel est faible, mais un échappement systématique de < éliminerait la classe entière de risque.

---

## 3. Registre des risques priorisés (source : section 10)

Le tableau ci-dessous consolide les 24 constats principaux, classés par criticité. La criticité combine l'impact utilisateur (transparence, conformité), l'impact sécurité et l'impact maintenance. Les références de fichiers sont relatives à la racine du dépôt.

Tableau 2 — Registre des risques (criticité décroissante)

| N | Criticité | Constat | Localisation |
| --- | --- | --- | --- |
| 1 | CRITIQUE | Taux de réussite public (79,4 %) construit après reclassement de 546 exclusions sans justification par entrée ; journées affichées à 100 % dont les pertes restent dans les archives | scripts/update-win-history.mjs:343-347 ; public/history-exclusions.json ; deploy.yml:249-275 |
| 2 | CRITIQUE | Politique de confidentialité muette sur GA4 et sur le flux VIP (identifiant bookmaker, dépôt, Telegram/WhatsApp, capture de dépôt vers le worker) ; rétention 7 jours absente de la page légale | src/app/politique-confidentialite/page.tsx ; src/app/vip/VipJourneyModal.tsx:26,63 |
| 3 | CRITIQUE | Vérification d'âge jamais montée sur un site d'affiliation de paris en ligne | src/components/bttsbet/AgeVerification.tsx (0 import) |
| 4 | ÉLEVÉ | FTPS sans vérification de certificat sur tout le canal de déploiement (MITM possible sur le contenu public) | scripts/ftp-safe-preflight.lftp:1 ; scripts/ftp-inventory.py:87-92 ; deploy.yml |
| 5 | ÉLEVÉ | Sélections VIP contraintes à l'issue opposée du pick gratuit, quelle que soit la preuve — différenciation commerciale présentée comme analyse | scripts/enrich_vip_candidates.py:220 ; scripts/vip-candidate-source.mjs:222 |
| 6 | ÉLEVÉ | Pages légales en/ar réduites à 4 paragraphes, incompatibles avec le niveau FR sur un site trilingue | src/components/bttsbet/LocalizedLegalPage.tsx |
| 7 | ÉLEVÉ | Matching flou des scores retire united/city et accepte le recouvrement de jetons — risque de WON/LOST attribués au mauvais club ; incident historique documenté, aucun test | scripts/verify-results.mjs:53-79 |
| 8 | ÉLEVÉ | 654 Ko de CSS global par page dont environ 56 % de classes mortes (5 générations de design empilées) | src/app/globals.css et layout.tsx:4-8 |
| 9 | MOYEN | Affirmations commerciales invérifiables affichées (« N°1 Mondiale », « 300 % worldwide confirmé », bonus 300 % posé en fait dans FAQ JSON-LD) | src/lib/i18n.ts:46,129 ; src/lib/promo-faq.ts |
| 10 | MOYEN | Étiquette xG affichée pour des buts moyens observés ; fiabilité pondérée avec constante H2H arbitraire (10 % du score) | scripts/quick-update-predictions.mjs:689-691,720-729 |
| 11 | MOYEN | Cotes VIP fabriquées (12-30 pseudo-aléatoires, badge Live) dans un composant mort réactivable ; « taux 69-81 % » dans un autre composant mort | src/components/bttsbet/VipSports.tsx:52-70 ; HowToGetVip.tsx:69 |
| 12 | MOYEN | Historique VIP n'affichant que des gagnants (biais de survie) sur la page monétisée | src/app/vip/VipWinHistory.tsx:78,117 |
| 13 | MOYEN | AuthContext Firebase mort et cassé (syntaxe Vite sous Next), entraînant 7 dépendances fantômes | src/contexts/AuthContext.jsx:19-24 ; package.json |
| 14 | MOYEN | test_ftp_inventory.py jamais exécuté en CI (motif *_test.py vs test_*.py) | .github/workflows/deploy.yml:69,392 |
| 15 | MOYEN | Environ 33 composants morts (dont 2 flux VIP parallèles) et seoSchemas.ts (437 lignes) déconnecté mais gelé par test | src/components/bttsbet/ ; src/lib/seoSchemas.ts |
| 16 | MOYEN | Dossier skills/ (60 Mo d'outils IA) et .pyc committés ; dépôt de 208 Mo | skills/ ; scripts/__pycache__ |
| 17 | MOYEN | next-intl installé mais jamais importé ; i18n maison trilingue dupliquée par composant | package.json ; src/lib/i18n.ts |
| 18 | MOYEN | JSON-LD injecté sans échappement de </script> (43 usages) — risque faible, données internes | src/components/bttsbet/FreePredictions.tsx:605 ; match/[slug]/page.tsx:879 |
| 19 | MOYEN | Absence de CSP et HSTS ; 3 scripts inline dans le layout racine dont un purgeur avec reload forcé | public/_headers ; src/app/layout.tsx:142-167 |
| 20 | MOYEN | Divergence SSG FR/en/ar : contenu prédictif absent du HTML exporté en anglais et arabe | src/app/[locale]/btts/predictions/today/page.tsx |
| 21 | FAIBLE | Bug de double animation useCountUp (dépendance hasAnimated) | src/hooks/useAnimations.ts:104 |
| 22 | FAIBLE | getMatchBySlug relit toutes les archives à chaque appel ; import script/page croisé | src/lib/matches.ts:17,321-333 |
| 23 | FAIBLE | Route predictions.json redondante (double écriture de out/predictions.json) | src/app/predictions.json/route.ts |
| 24 | FAIBLE | IndexNow soumet une dizaine d'URLs supprimées du site ; verify-seo.mjs non branché en CI | scripts/submit-indexnow.mjs ; scripts/verify-seo.mjs |

---

## 4. Systèmes sensibles : VIP, accès, paiement, affiliation

1. **Accès VIP** : conditionné à un dépôt d'au moins 3 USD chez un bookmaker affilié avec preuve de dépôt (identifiant bookmaker, montant, contact Telegram/WhatsApp, capture d'écran envoyés au worker Cloudflare personnel ; rétention 7 jours annoncée uniquement dans la modale). Circuit : candidats générés en privé (.private/, droits 0600) → sync OIDC → approbation manuelle → publication programmée aux heures de Dakar.
2. **Worker VIP** : la partie la mieux sécurisée du projet (OIDC vérifié cryptographiquement, sessions hachées, rate limiting SQL, CORS restreint, preuves plafonnées). Sa modification peut casser l'accès payant : zone rouge (fichier 07).
3. **Affiliation** : liens 1xBet, Melbet, Linebet, 888Starz avec rel=sponsored nofollow noopener noreferrer partout, disclaimers 18+ et jeu responsable systématiques, tracking sans données personnelles avant consentement. Conforme et testée — zone à préserver.
4. **Consentement RGPD** : chaîne réelle (CookieConsent granulaire refusant par défaut, GA4 chargé seulement avec consentement, IP anonymisée). Lacunes documentées au fichier 02 (B19-B21).
5. **Admin** : mot de passe ≥16 caractères par variable d'environnement, jetons de session hachés SHA-256, panel public construit sans injection HTML possible.
