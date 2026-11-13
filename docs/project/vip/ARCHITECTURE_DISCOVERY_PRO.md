# VIP Discovery / Pro — architecture de migration

Date: 2026-11-13  
Statut: audit et architecture proposés, aucune migration ni activation de paiement exécutée.

## 1. État réel du système actuel

- Le frontend `src/app/vip/VipJourneyModal.tsx` envoie une demande de validation manuelle avec bookmaker, identifiant bookmaker, dépôt déclaré, capture d'écran et identifiant Telegram.
- Le Worker `workers/vip-api/src/index.js` expose `POST /requests`, le suivi de demande et les routes d'administration. Il n'expose pas d'API de souscription payante ni de vérification crypto.
- La migration D1 `0001_initial.sql` définit `vip_requests.deposit_usd` avec un minimum de 3 USD et stocke une preuve image. Les statuts sont `pending_review`, `approved_pending_telegram`, `rejected`.
- La validation actuelle est une revue humaine; le code de santé du Worker indique explicitement que Telegram n'est pas activé automatiquement.
- `src/contexts/AuthContext.jsx` contient déjà Firebase Auth (email/mot de passe et Google) et un profil Firestore, mais lit les variables Vite `import.meta.env.VITE_FIREBASE_*`. Le layout Next `src/app/layout.tsx` ne monte pas cet AuthProvider.
- Le profil Firestore contient des champs `isVip` et `vipExpiry`, mais un champ client Firestore ne doit jamais être l'autorité pour déverrouiller du contenu VIP.

## 2. Modèle cible

### Discovery
- Essai gratuit unique de 7 jours par compte Firebase UID.
- L'activation doit être faite côté serveur et protégée contre les doubles clics, les appels répétés et la création de plusieurs comptes d'essai pour le même UID.
- Date de début et date d'expiration stockées côté D1; l'accès cesse automatiquement à l'expiration.

### VIP Pro
- Abonnement payant avec durée et montant configurés explicitement.
- L'accès est activé uniquement après confirmation serveur du paiement; un formulaire, une capture, une déclaration ou une transaction non confirmée ne donne aucun droit.
- Chaque renouvellement crée un événement de paiement et prolonge l'entitlement à partir de la date de fin actuelle si l'abonnement est encore actif.
- Historique consultable par le membre et audit administratif.
- Notification Telegram uniquement après activation ou événement confirmé.

## 3. Source de vérité et sécurité

- Firebase Auth peut servir à identifier le membre si la configuration réelle du projet Firebase est confirmée.
- Le navigateur transmet un Firebase ID token au Worker; le Worker doit vérifier sa signature, issuer, audience, expiration et UID avant toute opération.
- D1 devient l'autorité pour les droits: le frontend ne décide jamais à partir de `userProfile.isVip`.
- Les routes VIP privées vérifient l'entitlement dans D1 à chaque requête ou via une vérification serveur à durée de cache très courte.
- Les secrets Firebase Admin, Binance ou fournisseur blockchain restent dans les secrets Cloudflare; jamais dans le navigateur, Git ou les réponses API.
- L'indexation d'une transaction doit être idempotente avec unicité du réseau + hash de transaction; gérer confirmations, montant exact, actif, adresse de destination, expiration et transactions réutilisées.
- Les paiements entrants doivent être vérifiés par une source API/on-chain fiable ou un webhook signé; ne jamais se fier à une capture d'écran.

## 4. Tables D1 proposées

- `vip_entitlements`: UID, plan, statut, début, expiration, source, timestamps.
- `vip_trials`: UID unique, début, expiration, statut; garantit un seul Discovery par compte.
- `vip_payment_intents`: ID, UID, montant attendu, actif, réseau, adresse de réception, référence, expiration, statut.
- `vip_payments`: ID, intent, UID, hash, réseau, actif, montant observé, confirmations, statut, date de vérification.
- `vip_entitlement_events`: journal append-only des activations, expirations, renouvellements, remboursements/annulations et actions admin.
- Conserver les tables historiques `vip_requests` et les routes de l'ancien parcours pendant la migration; désactiver l'ancien parcours public seulement après bascule vérifiée et plan de conservation des demandes existantes.

## 5. Déploiement par étapes

1. Confirmer les variables Firebase et la méthode d'authentification existante; rendre le client Firebase compatible Next sans remplacer le projet réel.
2. Ajouter validation Firebase ID token côté Worker et tests unitaires de jetons invalides/expirés.
3. Ajouter migrations D1 et endpoints d'entitlement; tester en environnement de préproduction, sans toucher à la base de production.
4. Ajouter le Discovery 7 jours et vérifier l'unicité UID + expiration.
5. Ajouter le parcours de paiement Pro après choix définitif du rail Binance/on-chain et implémentation de la vérification.
6. Ajouter le portail membre, historique, renouvellement, notifications Telegram et journal d'audit.
7. Migrer les anciens accès manuels après inventaire et règles de transition; ne pas convertir automatiquement les anciennes demandes en abonnements.
8. Tester fraude, rejeu de webhook, hash dupliqué, sous-paiement, surpaiement, paiement tardif, expiration, renouvellement et indisponibilité fournisseur.

## 6. Paramètres propriétaire encore indispensables

Aucun tarif ou paramètre crypto n'est inventé. Avant l'implémentation de la vérification Pro, confirmer:
- Prix VIP Pro et devise de facturation.
- Durée de l'abonnement et politique de renouvellement.
- Rail de paiement: Binance Pay ou transfert on-chain.
- Si on-chain: actif exact, réseau exact et adresse publique de réception.
- Source de vérification: API Binance Pay, fournisseur blockchain/indexeur ou nœud/API déjà utilisé.
- Politique en cas de paiement partiel, excédentaire ou reçu après expiration.

Ne jamais demander une clé privée, seed phrase, mot de passe Binance ou code 2FA.

## 7. Garde-fous

- Aucun Worker, D1, secret ou service de production n'a été modifié par cet audit.
- Aucun paiement ou droit VIP n'a été activé.
- L'ancien parcours à dépôt bookmaker ne doit pas être présenté comme le nouveau VIP Pro.
- Le nouveau modèle ne doit pas être publié avant tests de sécurité, vérification réelle et contrôle des droits côté serveur.
