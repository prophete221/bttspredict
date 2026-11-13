# BTTSPredict — Project handover and continuity notes

> Living handover document for ChatGPT and any collaborator taking over the project.
> Update this file whenever a material decision, code change, test, deployment, or blocker occurs.
> Last updated: 2026-11-13 (UTC).

## 1. Project identity

- Repository: `prophete221/bttspredict` (private GitHub repository).
- Production website: https://bttspredict.com
- Product/brand direction: **BTTSPredict / VISION221 PRO ANALYTICS**.
- Product: multilingual football analytics and predictions platform, with free and VIP experiences.
- Main product languages: French, English, Arabic; Arabic must use proper RTL behavior.
- Primary user workflow: mobile-first. The project owner works mainly from Android and does not rely on a desktop computer.

## 2. Working agreement — do not violate

1. **Never commit directly to `main`.** Work on a dedicated feature/fix branch.
2. **Never merge, deploy, or change production resources without the owner's explicit approval.**
3. Do not alter production Cloudflare Workers, D1 data, secrets, DNS, or live configuration as part of ordinary development.
4. Never read, print, copy, or request secret values. It is acceptable to check whether a secret name is configured.
5. Do not trust the README as the sole source of truth. Inspect actual source files, package scripts, migrations, workflows, and deployed configuration.
6. Preserve working SEO pages, URLs, and titles unless a strong, evidence-backed reason and explicit approval justify a change. In particular protect:
   - `/en/btts-and-over-2-5-predictions-today`
   - Other established BTTS / Over 2.5 landing pages.
7. Prefer small, reviewable commits. Before each change, identify affected files and acceptance criteria. After each change, run the relevant tests/build and report exact results.
8. Keep production state and repository state clearly distinguished. A GitHub commit does not prove that Cloudflare has deployed it.
9. Do not claim a task is complete unless the relevant file/commit/test/deployment result has actually been verified.
10. When uncertain, stop before a risky or irreversible action and explain the uncertainty.

## 3. Current GitHub work state

### Active working branch

- Branch: `chatgpt/project-takeover-2026-11-13`
- Created from `main` during the 2026-11-13 session.
- Branch creation succeeded.
- At creation, `package.json` on the branch matched `main` (same blob SHA: `db50e41214caddf1a1067998694b9b8b842baa77`).
- The continuity file itself was committed and successfully re-fetched; GitHub content-write access is verified by commit 73ddd7b81b9c1e4bccfba5ec46060bd1eaf7eab5.
- Do not assume this branch is still based on the latest `main`; re-check both refs before substantial work.

Branch URL: https://github.com/prophete221/bttspredict/tree/chatgpt/project-takeover-2026-11-13

### Before resuming work

- Fetch the latest `main` SHA and active branch SHA.
- Check open pull requests and recent commits.
- Check whether another collaborator has updated the active branch.
- Inspect the real source and workflow state; do not rely only on this note.
- If `main` has moved, decide whether to update/rebase the working branch safely. Do not overwrite concurrent work.

## 4. Cloudflare environment — previously verified, read-only

The Cloudflare connection was successfully authenticated during the 2026-11-13 session. The following resources were discovered:

### Workers

- `bttspredict-vip-production-api`
- `bttspredict-vip-staging-api`
- `bttspredict-github-bridge`

### D1 databases

- `bttspredict-vip-production-db`
- `bttspredict-vip-staging-db`

Production Worker previously inspected:
- Worker: `bttspredict-vip-production-api`
- Bound D1 database: `bttspredict-vip-production-db`
- An hourly cron was configured.
- Configured secret names included `ADMIN_PASSWORD`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHANNEL_ID`, and `TELEGRAM_OWNER_CHAT_ID`. **Secret values were not read and must never be exposed.**

Production D1 database was inspected read-only. At that time:
- 3 VIP requests were recorded, all in `approved_pending_telegram`.
- 22 candidate records were present, all `ineligible`.
- Relevant tables included `vip_requests`, `vip_candidates`, `vip_publications`, `vip_publication_runs`, `vip_candidate_sync_state`, and `d1_migrations`.

Important discrepancy previously observed:
- VIP auto-publication policy was `paused-trilingual-required`, while the Worker code expected `verified-auto-v1`.
- Do not enable publication or change this policy without a fresh security/logic audit and explicit owner approval.
- Presence of Telegram secrets does not prove that Telegram notifications are successfully delivered.

All Cloudflare observations above are historical snapshots. Re-check current state before relying on them. Production resources and production D1 data must remain untouched unless separately authorized.

## 5. Product and business direction

The owner has expressed the following intended direction; verify current implementation before changing it:

- Free **VIP Discovery** access for 7 days.
- Paid **VIP Pro** tier.
- Binance/crypto payment with genuine payment verification.
- Telegram notifications and automated activation/expiration only after payment verification.
- A user clicking “I paid” is not proof of payment.
- Goal: increase free registrations and convert suitable users to paid VIP Pro.
- Do not invent payment minimums, bonuses, bookmaker restrictions, or promotional claims.

Historical affiliate references (verify current code and approved partner terms before use):
- Linebet: code `VISION221`, domain `lb-aff.com`, ad `22611` (older APK ad `66803`).
- 1xBet: code `Vipbtts`, domain `reffpa.com`, ad `1599`.
- Melbet: code `Bttswin`, domain `refpa3665.com`, ad `2170`.
- 888Starz: code `btts221`, domain `888ghta.com`.
- Owner previously stated that codes are worldwide. Claims previously authorized: “300% worldwide”, cashback, and weekly bonuses. Do not add unverified terms or imply country limitations.

## 6. Visual and UX direction

The owner wants a coherent redesign, not merely a color swap:

- Premium, trustworthy football analytics product; **not a blog**.
- Dark visual system across the full site.
- Mobile-first, then desktop.
- Clear hierarchy, restrained depth/3D treatment on prediction cards, compact readable content.
- Mobile bottom navigation should be limited to: **ACCUEIL / PRONOSTICS / VIP**.
- Desktop navigation should look intentional and professional.
- French, English, and Arabic must remain coherent; Arabic needs real RTL support.
- Inspect the current UI and shared components before selecting or implementing design tokens.
- Avoid broad visual rewrites that risk existing working routes or SEO.

Historical areas/files to re-inspect (paths may have changed):
- `src/components/bttsbet/ApplicationNavigationShell.tsx`
- `src/components/bttsbet/Navbar.tsx`
- `src/app/vip/page.tsx`
- `VipJourneyModal.tsx`
- `src/contexts/AuthContext.jsx`
- `workers/vip-api/src/index.js`
- `workers/vip-api/wrangler.jsonc`
- `workers/vip-api/migrations/`
- `public/vip-admin/admin.html`
- `public/vip-admin/admin.js`

## 7. SEO and performance guardrails

Historical Search Console snapshot (not necessarily current):
- 3 months: 367 clicks, 3.75k impressions, 9.8% CTR, average position 57.3.
- At a later point, traffic was reported above 20 visits/day, with traffic concentrated on English prediction pages.
- Affiliate dashboard had shown 2 Linebet clicks and 0 signups at that time.

These are historical observations, not current analytics. Before diagnosing a traffic decline, collect fresh analytics/Search Console evidence and compare date ranges, page groups, country, device, impressions, clicks, CTR, and position.

Never change proven page titles, canonical URLs, or slugs casually. The English BTTS/Over 2.5 page listed above is explicitly considered valuable by the owner.

## 8. Known historical technical observations — re-verify

- Firebase authentication context was previously observed in `src/contexts/AuthContext.jsx`, with email/password, Google login, password reset, and Firestore profile support.
- A prior audit reported that `AuthProvider` was not wired into `src/app/layout.tsx` and that login/register routes were not found. This may have changed; inspect current code before acting.
- A previous VIP frontend flow reportedly asked for bookmaker, promo code, registration confirmation, a deposit amount, bookmaker ID, Telegram details, deposit screenshot, and consent. This older flow may conflict with the intended Discovery/Pro subscription model.
- Previous GitHub PR/branch references (including PR #117 and `feat/refonte-complete-nov2026`) are historical. Check current PR state rather than assuming they remain open or unmerged.
- Previous Gemini issue: Python `google-genai` SDK, `GEMINI_API_KEY`, batches of 3; intermittent 503 failures and local empirical fallback. Do not change the prediction pipeline without fresh code/log inspection and tests.

## 9. Working method and handover updates

For each work item, record:

- **Objective:** what outcome is being pursued.
- **Evidence:** exact files, logs, API responses, or metrics inspected.
- **Plan:** smallest safe change and files affected.
- **Implementation:** branch, commit SHA, and changed files.
- **Validation:** commands/tests and exact pass/fail outcomes.
- **Risk:** SEO, user data, payments, auth, security, or production impact.
- **Next step:** one clearly defined next action.

Update this file after every material milestone:
- new branch/PR/commit;
- meaningful code or design decision;
- test/build result;
- discovery of a production/repository mismatch;
- new blocker or resolved blocker;
- deployment only if explicitly authorized and verified.

Keep the latest status near the top of this file so a new conversation can resume quickly.

## 10. Latest checkpoint

As of 2026-11-13:
- GitHub private repository access: verified.
- Working branch creation: verified.
- Cloudflare account connection: verified.
- Cloudflare resource inspection: read-only and verified at the time.
- File-content write on the working branch: **verified** by commit 73ddd7b81b9c1e4bccfba5ec46060bd1eaf7eab5; the file was successfully re-fetched.
- Source changes: none made in this takeover session before this document.
- Merge/deployment/production writes: none performed.

**Immediate next action:** re-fetch current `main`, active branch, open PRs, and actual project structure; then perform a source-grounded audit and make one small, useful, testable change on the working branch. Do not merge or deploy.

## 11. Verified resumption checkpoint — 2026-11-13 (UTC)

- Private repository access is currently working. The installed GitHub connection reports admin, maintain, pull, and push permissions for prophete221/bttspredict.
- The default branch is main; the repository is private and not archived.
- Latest commit found on the repository's recent commit search: 6ac049324bda675345554d405e77b21e4c4a191c (chore: auto-update data, 2026-11-13 13:58:20 UTC).
- A compare of main against chatgpt/project-takeover-2026-11-13 reports: branch is ahead by 1, behind by 0; merge base equals the latest main SHA above. The only branch change is the added CHATGPT_PROJECT_CONTEXT.md (182 lines). No source code changes have been made on this branch.
- package.json has identical blob SHA on main and the working branch: db50e41214caddf1a1067998694b9b8b842baa77.
- The actual root layout imports ApplicationNavigationShell, BottomNavigation, analytics, cookie consent, gift popup, and legacy credential cleanup. The global layout currently contains root metadata; avoid modifying it without a dedicated SEO review.
- The active mobile bottom navigation component currently defines exactly three tabs (home, predictions, VIP) and applies localized paths and Arabic RTL direction. The global navigation shell renders Navbar above the page content.
- The current VIP page source still describes lifetime VIP access after manual owner approval; this is not the same as the previously discussed VIP Discovery 7-day / VIP Pro subscription concept. Treat this as a product-direction mismatch to resolve before implementing any subscription/payment changes.
- Recent repository PR search surfaced work including #126 (competition/Aviator pages with a stated FTP capacity/deployment blocker), #125 (future Gemini picks on homepage), #124 (public Gemini feed extension), and #122 (VIP candidate batch/status with D1 migration). Their live states and checks must be inspected before relying on their descriptions; do not merge or deploy them.
- No Cloudflare resources were modified. No merge or deployment was performed.

### Resumption decision

Continue with a read-only source and workflow audit first. Prioritize understanding the reported traffic decline using current analytics evidence if the owner can provide it or connect the relevant source. Do not make SEO metadata, URL, sitemap, feed, or deployment changes based on guesswork.
### Traffic diagnosis carried forward from the owner's 2026-11-13 report

- Search Console comparison: 28 Oct–3 Nov 2026 = 580 clicks / 4,664 impressions; 4–10 Nov = 611 clicks / 5,029 impressions (+5.3% clicks, +7.8% impressions). Average position moved from 13.37 to 13.94 (slightly worse). This does not establish an overall Google-search traffic decline.
- Daily signal: 113 clicks on 7 Nov versus 65 on 10 Nov; this is a short-window decline worth monitoring, not evidence by itself of a Google penalty.
- Top pages over the reported 28-day period: /en/btts-and-over-2-5-predictions-today (748 clicks / 3,699 impressions), /en/over-2-5/predictions/today (425 clicks), English homepage (390 clicks). Kenya and Nigeria led by clicks; mobile accounted for approximately 90% (1,635 / 1,823 clicks).
- Owner reports no new onsite registrations since launch. Search Console does not measure total website visits or onsite conversion; compare GA4 and/or hosting logs and instrument the visit → signup → VIP request → verified payment funnel before attributing the decline.
- Current VIP page source still advertises lifetime access after manual approval and asks for bookmaker-related information. This creates a mismatch with the owner's desired lower-friction crypto subscription path, but do not implement payments until the product rules, verification source, refund/expiry behavior, and Telegram notification flow are audited.

### Workflow observation from current main

- .github/workflows/deploy.yml triggers on main pushes (with public/** ignored), a 3-hour schedule, three separate daily VIP candidate schedules, manual dispatch, and pull_request checks. Public deployment and private VIP candidate generation are distinct workflow paths. Do not run or dispatch workflows as part of this audit.

## 12. Resumption audit — 2026-11-13 (UTC, second pass)

- Re-read the complete continuity file from `chatgpt/project-takeover-2026-11-13` before proceeding.
- Latest main commit confirmed by repository commit search: `6ac049324bda675345554d405e77b21e4c4a191c` (`chore: auto-update data`, 2026-11-13 13:58:20 UTC).
- GitHub compare `main@6ac049324bda675345554d405e77b21e4c4a191c...chatgpt/project-takeover-2026-11-13` reports the working branch ahead by 3 commits and behind by 0. The only changed path is `CHATGPT_PROJECT_CONTEXT.md` (210 additions); no application source changes are on the takeover branch.
- The working branch exists and is discoverable. The repository branch search shows `main` and the takeover branch among the available branches.
- PRs #126, #125, #124, #123, #122, #121, #120, #119, #118, and #117 were fetched individually and are closed/merged. Older PRs #86 and #56 remain open and have not been updated since August 2026; they should be treated as stale, not as current development activity.
- Main source re-check: `package.json` blob remains `db50e41214caddf1a1067998694b9b8b842baa77`. Root `src/app/layout.tsx` still owns global metadata; no SEO metadata edits are authorized by this audit.
- `.github/workflows/deploy.yml` on main still uses `NEXT_PUBLIC_GA_ID` from GitHub Actions repository variables for the production build. The workflow also runs PR checks; scheduled public deployment and VIP-only candidate paths remain separate. No workflow was dispatched.
- `src/components/bttsbet/AnalyticsLoader.tsx` reads only `NEXT_PUBLIC_GA_ID`; it loads GA only in a production build and only after stored cookie consent has `preferences.analytics === true`. Therefore a GA4 property may exist while collection remains inactive if the variable is absent or consent has not been granted. No GA measurement ID or secret value was read.
- The user's attempted GA4 connection in Windsor.ai failed because Google reported no GA4 properties accessible to `luxxdii@gmail.com`. This is an account/property access issue until proven otherwise; do not create a duplicate GA4 property or change site tracking yet.
- Cloudflare was not re-inspected in this pass because the current task was repository resumption and no Cloudflare change is justified. No Cloudflare resources, production data, DNS, secrets, merges, or deployments were changed.

### Current safe next step

Continue a read-only analytics/authentication funnel audit: verify whether `NEXT_PUBLIC_GA_ID` is configured without exposing any secret values, inspect cookie-consent behavior and signup route/event instrumentation, then identify the correct Google account/property owner for GA4. Do not change code, tracking configuration, SEO metadata, or production until the evidence identifies a minimal fix and the owner approves it.


## 13. Analytics and signup audit — 2026-11-13 (UTC, current pass)

- Re-verified `package.json` on `main` and `chatgpt/project-takeover-2026-11-13`: identical blob SHA `db50e41214caddf1a1067998694b9b8b842baa77`. The working branch remains a documentation-only branch relative to the application source; no production code changes were made.
- Read current `src/components/bttsbet/AnalyticsLoader.tsx`. GA4 is loaded only when `NEXT_PUBLIC_GA_ID` is present at build time, the build is production, and localStorage key `bttsbet_cookie_consent` contains `preferences.analytics === true`. Otherwise the GA disable flag is set. No measurement ID was exposed.
- Read current `CookieConsent.tsx`. First-time visitors are shown a consent panel; Accept enables analytics and advertising, Refuse disables both, and custom preferences are persisted. It dispatches `cookie-consent-changed`, which AnalyticsLoader listens for.
- Read current `src/app/layout.tsx`: it renders AnalyticsLoader and CookieConsent globally. Root metadata and SEO configuration were not changed.
- Read current `src/contexts/AuthContext.jsx`. It defines Firebase email/password registration, login, Google login, password reset, and Firestore profile creation. Firebase configuration is sourced from `VITE_FIREBASE_*` build environment variables. No secret/config values were requested or exposed.
- Important unresolved integration concern: neither the root layout nor `src/app/[locale]/layout.tsx` wraps children in `AuthProvider`. GitHub code search returned no indexed results for `AuthProvider` / `useAuth`; component and route directory listings did not reveal obvious login/register/signup routes. This is a strong indication the Firebase context may be orphaned, but a complete repository-wide reference scan is still required before concluding.
- The GitHub connector does not expose a safe read operation for repository Actions variables in the current tool set. Therefore presence of `NEXT_PUBLIC_GA_ID` and the `VITE_FIREBASE_*` variables remains unverified. Never read secret values; only check whether names are configured.
- No source code, workflow, environment variable, Cloudflare resource, production data, DNS, or secret was changed. No workflow was dispatched; no merge or deployment occurred.

### Next audit steps
1. Complete repository-wide reference scan for `AuthProvider` / `useAuth` and locate any hidden or legacy signup UI.
2. Ask the owner to confirm in GitHub Settings whether the non-secret Actions variable `NEXT_PUBLIC_GA_ID` is present, without sharing its value in chat. Confirm required Firebase environment variable names are configured in the build environment, without exposing values.
3. If auth is genuinely unwired, map the smallest safe route/provider integration proposal; do not implement until existing UI and intended registration flow are understood.


## 14. GA4 configuration confirmation — 2026-11-13

- Owner checked GitHub repository Settings → Secrets and variables → Actions.
- Confirmed `NEXT_PUBLIC_GA_ID` does NOT appear among configured Actions variables (owner explicitly confirmed).
- `VIP_CANDIDATE_API_URL` is present, but it is unrelated and does not substitute for the GA4 Measurement ID.
- Consequence from current source: `AnalyticsLoader.tsx` cannot initialize GA4 because the build-time `NEXT_PUBLIC_GA_ID` value is missing. Analytics also remains consent-gated (`preferences.analytics === true`).
- Next: obtain the GA4 Measurement ID (`G-XXXXXXXXXX`) from the Google Analytics property, then add it as an Actions repository variable named exactly `NEXT_PUBLIC_GA_ID`. Do not paste the ID into source code. Confirm workflow actually injects repository variables into the build environment before deployment; verify after deploy using GA4 Realtime/Tag Assistant and consent acceptance.
- Prior connection blocker: user previously reported Google Analytics said no GA4 accounts were accessible while signed in as `luxxdii@gmail.com`. Therefore first verify the correct Google account has access to the GA4 property, or create a GA4 property if none exists.
- No repository source, Actions variable, secret, production config, or deployment was changed during this confirmation.


## 15. GA4 Web stream created — 2026-11-13

- User created the GA4 account/property and Web data stream named `BTTSPredict Website` for `https://bttspredict.com`.
- User supplied stream ID: `16337488315`. This is the numeric GA4 stream ID, NOT the Measurement ID needed by the site's `NEXT_PUBLIC_GA_ID`.
- GA4 UI currently reports “Aucune donnée reçue au cours des dernières 48 h”; this is expected until the web tag is installed/deployed and receives traffic, and is not by itself evidence of a fault.
- Next required value: retrieve the stream's Measurement ID in format `G-XXXXXXXXXX` from Admin → Data streams → BTTSPredict Website. User should share only that non-secret Measurement ID (never any credentials).
- After obtaining it, add it as GitHub Actions variable `NEXT_PUBLIC_GA_ID` only after verifying the build workflow passes repository variables into the Next.js build environment. Then deploy only with explicit owner approval and verify GA4 Realtime after consenting to analytics.
- No source code, Actions variable, secret, production setting, or deployment changed in this step.


## 16. Identifier clarification — 2026-11-13

- User supplied `GTM-NGVK3V3V`. This is a Google Tag Manager container ID (prefix `GTM-`), not a GA4 Measurement ID (prefix `G-`).
- Do not set `NEXT_PUBLIC_GA_ID` to this GTM ID. The existing AnalyticsLoader expects a GA4 measurement ID.
- Next: guide user to GA4 Admin → Data streams → BTTSPredict Website → Measurement ID (format `G-XXXXXXXXXX`). Keep GTM separate; do not configure or inject it unless the project is intentionally migrated to GTM and code/workflow are audited first.
- No code, environment variable, or deployment changed.


## 17. Reprise de l'audit Analytics — 2026-11-13 (UTC)

- Relecture directe de ce fichier sur la branche active avant toute autre intervention.
- Dépôt privé accessible via la connexion GitHub; branche `chatgpt/project-takeover-2026-11-13` confirmée existante.
- Comparaison GitHub actuelle `main...chatgpt/project-takeover-2026-11-13`: branche en avance de 8 commits, en retard de 0; l'unique chemin modifié reste `CHATGPT_PROJECT_CONTEXT.md` (273 ajouts). Aucun changement applicatif n'est présent sur la branche de reprise.
- SHA du dernier commit trouvé sur `main`: `6ac049324bda675345554d405e77b21e4c4a191c` (`chore: auto-update data`, 2026-11-13 13:58:20 UTC). Le merge-base correspond à ce SHA; la branche de travail n'est donc pas en retard sur main à cet instant.
- PR ouvertes détectées: #86 (refactor VIP legacy) et #56 (README); elles sont anciennes et ne concernent pas le suivi Analytics immédiat. Les autres PR récentes avaient été indiquées fermées/mergées dans la section 12.
- Fichiers réels relus sur `main` et la branche de reprise: `src/components/bttsbet/AnalyticsLoader.tsx` (blob `c00b38a337cc2b28288d8d8b6b2b78c58c6fdf1a`), `.github/workflows/deploy.yml` (blob `a1487a27620b4cf93db0ccc0a3bfd29c6c34e78c`), `src/app/layout.tsx` (blob `afdcc7b593a999b7c028f58d47045b4baff8a8ff`), `src/components/bttsbet/CookieConsent.tsx` (blob `2aee11a7e9d10a73a3d6dc927eeae0055f3d374a`). Les blobs des fichiers contrôlés sont identiques entre main et la branche de travail.
- `AnalyticsLoader.tsx` utilise exclusivement `process.env.NEXT_PUBLIC_GA_ID` et le chargement Google tag `gtag/js?id=${GA_ID}`; il ne configure pas un conteneur GTM. Le code exige un build production et le consentement analytique enregistré dans `bttsbet_cookie_consent` avec `preferences.analytics === true`.
- `CookieConsent.tsx` persiste les choix et émet `cookie-consent-changed`; Accepter active analytics, Refuser le désactive, et la personnalisation respecte le choix enregistré.
- `src/app/layout.tsx` monte globalement AnalyticsLoader et CookieConsent. Aucun changement SEO/layout n'a été fait.
- Le workflow `.github/workflows/deploy.yml` injecte bien `${{ vars.NEXT_PUBLIC_GA_ID }}` dans l'environnement des deux étapes de build (build conditionnel PR et build de déploiement). Le chaînon workflow → build est donc déjà présent; la variable de dépôt elle-même avait été déclarée absente par le propriétaire et n'a pas été modifiée.
- Le nombre `16337488315` est l'identifiant numérique du flux Web GA4, et `GTM-NGVK3V3V` est un identifiant de conteneur GTM. Aucun des deux ne peut remplacer la Measurement ID GA4 `G-XXXXXXXXXX` attendue par le code actuel.
- La recherche de code GitHub a renvoyé zéro résultat pour les termes GTM/GA, mais l'index de code du dépôt est signalé indisponible; ces résultats ne prouvent donc pas l'absence de références ailleurs dans le dépôt. Les fichiers actifs ci-dessus ont été vérifiés directement.
- Décision technique recommandée (pas encore appliquée): conserver GA4 direct pour le moment. C'est le chemin déjà implémenté et câblé dans les deux builds; migrer vers GTM imposerait de modifier le chargeur, la gestion du consentement et la configuration du conteneur, avec un risque de double comptage. GTM ne doit pas être injecté en parallèle de GA4 direct.
- Prochaine étape sans modification de production: récupérer la Measurement ID GA4 au format `G-XXXXXXXXXX`; ensuite seulement, confirmer le paramétrage de la variable GitHub Actions (nom uniquement, valeur jamais copiée dans le chat). Déploiement soumis à autorisation explicite et vérification GA4 Realtime après consentement.
- Aucun fichier source, workflow, variable Actions, secret, configuration Cloudflare, donnée de production, merge ou déploiement n'a été modifié pendant cet audit.


## 18. Measurement ID GA4 fournie — 2026-11-13

- Le propriétaire a fourni la Measurement ID GA4 du flux BTTSPredict Website: `G-F705Z3L2HT`.
- Cette valeur correspond au format attendu par `AnalyticsLoader.tsx` et doit être utilisée pour la variable GitHub Actions `NEXT_PUBLIC_GA_ID`.
- L'identifiant GTM `GTM-NGVK3V3V` reste distinct et ne doit pas être utilisé dans cette variable.
- La connexion GitHub utilisée ici ne fournit aucune action de lecture/écriture des variables Actions (les actions disponibles couvrent les fichiers, branches et PR; les API sensibles de secrets/paramètres ne sont pas prises en charge). La variable n'a donc pas été créée ni modifiée par cet assistant.
- Action requise côté propriétaire: GitHub → dépôt `prophete221/bttspredict` → Settings → Secrets and variables → Actions → Variables → New repository variable; Name: `NEXT_PUBLIC_GA_ID`; Value: `G-F705Z3L2HT`.
- Après création, aucun déploiement automatique ne doit être lancé manuellement sans approbation explicite. La vérification de présence/absence de l'ancienne variable et les tests GA4 Realtime restent à faire après autorisation de déploiement.
- Aucun code source, workflow, secret, variable Actions ou production modifié dans cette étape.


## 19. Variable GitHub Actions ajoutée — confirmation du propriétaire — 2026-11-13

- Le propriétaire confirme avoir ajouté la variable de dépôt GitHub Actions `NEXT_PUBLIC_GA_ID`.
- Valeur attendue selon l'étape précédente: Measurement ID GA4 `G-F705Z3L2HT`. Cette valeur n'a pas été relue depuis GitHub; la présence, le nom exact, la portée (repository variable) et la valeur restent donc confirmés par déclaration du propriétaire, pas par vérification indépendante.
- Le workflow `.github/workflows/deploy.yml` avait déjà été relu et transmet `vars.NEXT_PUBLIC_GA_ID` aux étapes de build concernées.
- Prochaine étape: avant tout déploiement, effectuer une dernière vérification du workflow et obtenir une autorisation explicite du propriétaire. Après un déploiement autorisé, accepter le consentement Analytics sur le site puis vérifier la réception dans GA4 Realtime / Tag Assistant.
- Aucun workflow n'a été lancé, aucun déploiement, merge, changement de code, secret ou ressource de production n'a été effectué à la suite de cette confirmation.


## 20. PR de mise en service GA4 bloquée par les contrôles — 2026-11-13 (UTC)

- Après confirmation du propriétaire que la variable GitHub Actions `NEXT_PUBLIC_GA_ID` a été ajoutée, création de la PR #127: https://github.com/prophete221/bttspredict/pull/127.
- PR basée sur `main`, branche source `chatgpt/project-takeover-2026-11-13`; comparaison avant ouverture: 11 commits d'avance, 0 en retard, un seul fichier modifié (`CHATGPT_PROJECT_CONTEXT.md`), aucune modification du code applicatif.
- L'intention de déploiement est strictement `code-only`, pour éviter les tâches de mise à jour des pronostics et le pipeline privé VIP du mode `full`.
- Le workflow PR #1153 (run ID `43492348400`) a échoué presque immédiatement: job `pull-request-checks` en échec avec zéro étape exposée et aucun runner assigné. Les jobs `deploy` et VIP ont été ignorés comme prévu sur un événement pull_request.
- Une tentative de relance des jobs en échec a été acceptée, mais le second essai a également échoué immédiatement sans étapes; les logs de job ne sont pas récupérables via les actions GitHub actuellement disponibles.
- Le statut Vercel du commit de tête était encore `pending` au dernier contrôle. La PR était ouverte et signalée mergeable par GitHub, mais les contrôles n'étaient pas validés.
- Décision de sécurité: ne pas fusionner et ne pas déployer tant que l'échec des contrôles GitHub et le statut Vercel ne sont pas clarifiés. Aucun workflow de déploiement, FTP, mise à jour de pronostics, synchronisation VIP, merge, changement SEO, modification de code source ou changement Cloudflare n'a été effectué.
- Étape suivante: examiner le run #1153 dans GitHub Actions et le contrôle Vercel de la PR #127; déterminer pourquoi le job échoue avant la première étape et pourquoi Vercel reste en attente. Une fois les contrôles validés, fusionner en squash avec un titre de commit contenant `[code-only]`, puis surveiller le déploiement et vérifier GA4 Realtime après consentement analytique.

## 21. Première correction du consentement GA4 — 2026-11-13

- Commit de correction : `5fd8049381b23d1c131f89d944664056f2985c2a`.
- Fichier modifié : `src/components/bttsbet/CookieConsent.tsx` uniquement.
- Le panneau de consentement restaure désormais les préférences déjà enregistrées lorsqu'il s'affiche ou est rouvert pour personnalisation. Avant, l'interface repartait visuellement des valeurs par défaut, ce qui pouvait induire l'utilisateur en erreur sur ses choix enregistrés.
- Le texte FR/EN/AR précise désormais que les cookies analytiques et publicitaires ne sont activés qu'après accord explicite. L'ancien texte laissait entendre que continuer à naviguer valait acceptation.
- Correctif complémentaire : un consentement JSON illisible ou sans objet `preferences` est maintenant invalidé, puis le bandeau est réaffiché au lieu de considérer à tort qu'un choix existe. Commit : `0d1774c403ce1e5432abacaf478a27ada8516a23`.
- Le mécanisme GA4 existant reste en opt-in ; aucun GTM, aucun changement d'identifiant, aucune modification SEO.
- Validation après commit : fichier relu sur la branche et deux changements attendus confirmés. Contrôles GitHub Actions pas encore apparus au moment du relevé ; statut Vercel en attente.
- Aucun merge, aucun déploiement en production, aucune modification de `main`.
- Prochaine étape : attendre les contrôles du commit, corriger toute erreur de lint/typecheck/test, puis poursuivre la vérification GA4 et le déploiement code-only seulement lorsque les contrôles sont verts.

## 22. CI: build de production ajouté à tous les contrôles PR — 2026-11-13 (UTC)

- Relecture du workflow réel `.github/workflows/deploy.yml` et comparaison avec les exécutions récentes.
- Constat : le job `pull-request-checks` exécutait tests Python/Node, lint et typecheck, mais l'étape `Build static export` était conditionnée à une branche de données publique très spécifique (`work/public-upcoming-picks-20261109`). La plupart des PR ne validaient donc pas le build Next.js de production.
- Correction sur la branche de travail : retrait de cette condition uniquement pour l'étape `Build static export`. Chaque PR doit maintenant compiler le site avec le même build `npm run build -- --webpack` et transmettre `vars.NEXT_PUBLIC_GA_ID`.
- Les étapes de collecte, enrichissement Gemini et validation de données restent conditionnées à la branche dédiée; elles ne sont pas rendues générales. Le déploiement reste interdit depuis une branche PR.
- Commit : `35432dc1d5cbf19b90b436830c4182e905d9fd04`.
- Vérification de l'historique Actions : les jobs de production sur `main` ont démarré normalement avec runners GitHub valides (ex. run #1156, runner ID 1000002732). Les jobs PR #1153 à #1157 échouent en 1–2 secondes avec `runner_id=0`, aucun runner et aucune étape. Cela isole le problème aux exécutions pull_request / attribution de runner, mais ne permet pas d'identifier la cause de configuration exacte depuis les APIs disponibles.
- Vercel pour le commit précédent est maintenant `success`; le nouveau commit doit recevoir son propre contrôle.
- Aucun merge, aucun déploiement de production, aucun changement de `main`, aucune modification des données publiques/privées ou de Cloudflare.
- Prochaine étape : vérifier le statut du nouveau commit et le comportement du runner PR; demander au propriétaire de vérifier les paramètres Actions si le runner reste non assigné. Ne pas contourner les contrôles ni fusionner tant que le build et les contrôles ne sont pas validés.

## 23. Fusion de la correction cookies/CI et blocage du déploiement FTP — 2026-11-13 (UTC)

- PR #127 fusionnée dans `main` le 2026-11-13 à 20:21 UTC.
- Commit de merge sur `main`: `e7943e81faf28fe588a129ee6d3d8e1a52db0f45`.
- Message de merge contient explicitement `[code-only]`; le workflow a donc ignoré les étapes de rafraîchissement, pruning, enrichissement Gemini et traitement VIP. Le code modifié est limité à `.github/workflows/deploy.yml`, `src/components/bttsbet/CookieConsent.tsx` et ce fichier de continuité.
- Contrôle Vercel de la branche PR : succès (preview/build). Ce n'est pas une confirmation du déploiement FTP de production.
- Déploiement de production non réalisé : le workflow `Build & Deploy to bttspredict.com` a été déclenché sur `main` (run #1159, ID `43500738436`) puis a échoué avant la première étape, avec `runner_id=0`, `runner_name` vide et `steps=[]`. Deux tentatives de relance ont reproduit le même échec (attempt 2 et 3). Aucun transfert FTP n'a commencé; le site live n'est donc pas confirmé mis à jour.
- Les jobs de la PR échouaient également avant la première étape avec `runner_id=0`. L'API de statut GitHub indiquait « All Systems Operational » au relevé de 20:21 UTC; ne pas attribuer sans preuve le problème à une panne globale GitHub.
- Hypothèses à vérifier côté compte/dépôt : limite de minutes Actions / spending limit, quota de concurrence ou paramètres d'accès/runner. Le compte propriétaire possède les permissions admin du dépôt; les outils connectés ne donnent pas accès aux réglages de facturation ni à la configuration des runners.
- Ne pas lancer de déploiement FTP manuel ni contourner le contrôle : les identifiants FTP sont des secrets GitHub non accessibles au connecteur.
- Prochaine étape obligatoire : le propriétaire vérifie GitHub Settings > Billing & licensing > Usage (Actions minutes/spending limit) et Repository Settings > Actions > General (permissions/runner access). Une fois le blocage levé, relancer le run #1159; vérifier succès du build, préflight FTP, allowlist `codeOnly=true`, transfert FTP, puis contrôler les pages live et GA4 Realtime après consentement.
- Aucun changement SEO, aucun changement de données publiques/privées, aucune suppression d'archives et aucune mise à jour des ressources Cloudflare.
