# API VIP de production

Le Worker `bttspredict-vip-production-api` utilise une D1 dédiée : `bttspredict-vip-production-db` (`2401349b-8c84-42c8-b6b2-9bc7d024f505`). Il ne réutilise ni la base ni les sessions de staging.

## Configuration

- Origine autorisée : `https://bttspredict.com`.
- API prévue par la page VIP et l’administration : `https://bttspredict-vip-production-api.luxxdii.workers.dev`.
- `workers.dev` activé pour ce seul Worker; URLs de prévisualisation désactivées. Aucune modification DNS du domaine `.com` n’est nécessaire.
- Secrets runtime Cloudflare : `ADMIN_PASSWORD` (au moins 16 caractères) et `TELEGRAM_BOT_TOKEN`. Ne jamais les placer dans GitHub Actions, le frontend ou les fichiers du dépôt.
- `TELEGRAM_CHANNEL_ID` est nécessaire pour créer les invitations du canal VIP existant. `TELEGRAM_OWNER_CHAT_ID` est facultatif pour les alertes privées de nouvelles demandes. Ces identifiants ne sont pas inclus dans le dépôt.

## Canal Telegram non configuré

Sans `TELEGRAM_CHANNEL_ID`, la connexion admin, la consultation des demandes, leur refus et la revue des candidats restent disponibles. Une tentative d’approbation échoue avant tout appel Telegram et avant tout changement de statut : la demande reste `pending_review`, sans lien ni accès accordé. L’interface explique l’échec et permet de réessayer après configuration. Aucun message, post ou invitation n’est envoyé par la mise en service.

## Stockage et traitement privé

Appliquer les migrations `0001` à `0005` dans l’ordre et conserver le journal `d1_migrations`. Les preuves restent dans D1, inaccessibles sans session admin. Le cron horaire `0 * * * *` exécute uniquement la purge des données expirées.

L’analyse VIP est séparée de l’enrichisseur public : `enrich_vip_candidates.py` lit le flux gratuit existant et écrit seulement dans `.private/`. Le générateur et le Worker exigent une probabilité estimée de 70–78 %, des taux empiriques d’au moins 70 % au global et pour chaque équipe, les échantillons minimaux, une source fraîche et une confiance élevée. Aucun candidat n’est fabriqué si ces critères ne sont pas remplis.

La synchronisation CI vers D1 utilise l’identité OIDC du workflow de production, uniquement pour ses exécutions planifiées ou manuelles autorisées. La variable GitHub Actions `VIP_CANDIDATE_API_URL` désigne l’API ci-dessus. Une décision sur un candidat ne publie rien et n’envoie rien sur Telegram.

## Contrôles de mise en service

1. Exécuter les tests JavaScript/Python, le lint, le contrôle TypeScript et le build local; limiter le diff aux composants VIP et à leur backend privé.
2. Publier le Worker avec sa liaison D1, puis configurer ses secrets runtime et son sous-domaine existant.
3. Vérifier uniquement en lecture : `/health`, CORS et protection des routes admin. Ne pas créer de demande, de candidat, de post ou d’invitation pour tester la production.
4. Publier le site seulement après ces contrôles. Pour une livraison de code sans rafraîchissement des pronostics publics, conserver le marqueur `[code-only]` dans le commit intégré à `main`.
