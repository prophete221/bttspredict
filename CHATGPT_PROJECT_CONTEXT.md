# Latest checkpoint — 2026-11-14 05:05 UTC

- Resumption verified directly from GitHub: PR #128 is still open/draft, base `main`, head branch `feat/complete-art-direction-promo-vip-2026-11-13`; repository permissions include push. Before this checkpoint the head was `7d31faa1d6d82fc6e2ba088f89929fdecb6986bb`; main/base SHA is `e7943e81faf28fe588a129ee6d3d8e1a52db0f45`. Compare reported 172 commits ahead, 0 behind; 58 files changed.
- Re-read this continuity file from the requested branch. Confirmed the previously reported one-line TypeScript fix was NOT present in `src/app/[locale]/page.tsx`: the component used `t.legal.*` without a component-local `t`. Added `const t = translationsFor(locale)` immediately after locale resolution. Commit: `94e0c2226f7be6c3b8d5ed4f7f441e4bef99f866`; file re-fetched and scoped binding verified.
- Confirmed the sibling-market parsing defect remained in `src/components/bttsbet/FreePredictions.tsx`: duplicate match keys were discarded with `if (!key || matchMap.has(key)) continue`. Replaced that behavior with a merge of distinct `getGeminiPicks` results by market type only. This preserves the strict Gemini source/model/status/abstention validation and does not fabricate picks or probabilities. Commit: `e50fd1ddccb77cddc86829097173ed3034deb767`; file re-fetched and merge logic verified.
- The dashboard data builder `src/lib/btts-today-dashboard-data.ts` already merges validated sibling market rows; the defect was specifically in the separate `FreePredictions.tsx` parser used by the public BTTS/Over and combined pages. The combined filter itself requires both BTTS and Over 2.5 picks.
- SEO spot-check: metadata title, description and canonical for `/btts-and-over-2-5-predictions-today` are unchanged between main and the branch. The visible H1 “BTTS and Over 2.5 Predictions Today” remains unchanged; explanatory copy and filtering changed. The Over 2.5 route metadata/H1 also remains intact in the inspected files. Continue auditing all protected EN landing pages and do not generalize this spot-check to every route.
- Current PR head after these two commits: `e50fd1ddccb77cddc86829097173ed3034deb767`; PR remains draft/open. Combined commit status exposed only Vercel pending; no new GitHub Actions run was returned for the new commit at the time of inspection. No local test runner/build environment has been executed in this session, so the earlier 680/38/16 test result remains unverified and unresolved. No tests have been disabled.
- No merge, production deployment, FTP, Cloudflare, D1, secret, payment, VIP entitlement or production data change. VIP remains out of scope for this public-site phase.

## Validation follow-up — sibling market regression — 2026-11-14 05:05 UTC

- Refined the parser fix into a small pure helper `mergeUniqueMarketPicks<T extends { type: string }>` in `src/lib/gemini-predictions.ts`; `FreePredictions.tsx` now uses this helper when it encounters a repeated match key. This keeps market merging testable and de-duplicates by explicit market type.
- Added a Vitest case to `tests/gemini-predictions.test.ts` using two individually validated source rows (BTTS 0.63 and Over 2.5 0.58). It asserts both market types/probabilities are preserved and a repeated Over row does not create a duplicate. The test is committed but has NOT yet been executed in this session.
- Commits after the prior checkpoint: `ab7af451feb51fe25f2abae1c4510f6d37e1c645` (helper), `3eef4f5ea7ce14c89581511a1d60b9ada9124d30` (parser integration), `4ecdccf4778e657201c874c11f51042d05aca56f` (test).
- Latest CI investigation: previous run `43527590865` job `132237096511` is conclusively marked failure, but GitHub returns an empty step list and the log download returns Azure `BlobNotFound`; no failed test names or step can be recovered from that run. No branch-specific Actions run was returned for the newly pushed commits; Vercel status is pending and is not an Actions/build result.
- Workflow source confirms PR checks are intended to run `npm test`, Python unit tests, `npm run lint`, `npx tsc --noEmit`, and `npm run build -- --webpack`. No deployment runs for pull requests; the FTP deploy job is gated to `main` only.
- Test baseline comparison (38 failures on PR vs main) is still outstanding: this environment has not executed either test suite and historical job logs are unavailable. Do not attribute the 38 failures to this branch or declare them pre-existing without a reproducible main-vs-PR run.

---

# Latest checkpoint — full public-site redesign (2026-11-13 UTC)

- Owner clarified the actual scope: a complete professional redesign of the public site, not a palette-only pass. Keep protected pages unchanged; defer VIP to a separate phase.
- Active branch: feat/complete-art-direction-promo-vip-2026-11-13; PR #128 remains draft/open and must not be merged or deployed until validation is complete.
- Public homepage: replaced the animated/marquee hero with direct editorial typography and standard links; removed generic trust-pillar block and decorative scroll-progress component. Rewrote FR/EN/AR homepage claims to remove “world’s No.1”, “Master”, “best/reliable/surebets” and similar unsupported language. Partner copy no longer claims the same 300% worldwide offer for every operator.
- Predictions dashboard: new desktop/mobile grid and restrained card system; compact stat cards, filter controls, match cards, probability bars, source/sample metadata, and less decorative status treatment. Removed visible “AI” suffixes and sparkle icon from cards/combo. Kept prediction data, calculations, routes and model inputs unchanged.
- Match center and shared public surfaces: editorial grid, flat cards, clean match details, no 3D transforms or glowing decoration. Extended the shared design layer to verified results, statistics, history, methodology, competitions and match-analysis panels.
- Promo guides: replaced PromoLandingShell with a concise editorial layout: operator/code panel, one primary CTA, APK link, visible affiliate disclosure, short steps, compact FAQ, related guides and mobile sticky actions. Removed animated gradients, floating orbs, animated progress and duplicated trust/offer copy. Rewrote FR/EN/AR copy for 1xBet, Linebet, Melbet and 888Starz; preserved promo codes and affiliate destinations. SEO metadata, canonical URLs and slugs were not edited.
- Removed animated title treatment from history, statistics and methodology headings.
- Protected VIP scope: restored src/app/vip/page.tsx, VipLockedPicks.tsx, VipWinHistory.tsx and vip.css to the current main-branch content. No new VIP implementation is included in this phase. The separate architecture note remains documentation only.
- Updated public design documentation and adjusted static regression assertions for the new promo copy. No tests, lint, TypeScript check or build have been confirmed as passing.
- Latest observed PR run before this checkpoint: GitHub Actions run 43523671484 failed in pull-request-checks; job steps returned empty and logs returned BlobNotFound. Vercel status was failure with build-rate-limit upgrade URL. These are unresolved validation blockers; do not claim the preview is ready.
- No merge, production deployment, Cloudflare Worker/D1 changes, secrets, FTP or production data changes. Main branch remains untouched.
- Next: finish source-level review for all public routes and styles, verify protected VIP files match main, update tests for the new UI, then rerun CI and Vercel preview. Only mark ready when actual tests/build/preview pass.

---

# BTTSPredict — Project handover and continuity notes

> Living handover document for ChatGPT and any collaborator taking over the project.
> Update this file whenever a material decision, code change, test, deployment, or blocker occurs.
> Last updated: 2026-11-13 (UTC).

## Current active checkpoint — PR #128 (2026-11-13 22:12 UTC)

- Active branch: `feat/complete-art-direction-promo-vip-2026-11-13`; PR #128 remains open and draft, targeting `main`.
- Latest verified compare before this checkpoint: branch is ahead of `main`, behind by 0; all work remains isolated from `main`.
- Initial PR head `2e6f4e6f18639619ab55a8d5629f350427ce28e3`: Vercel check succeeded. GitHub Actions run `43503251998` failed in `pull-request-checks`; no steps were exposed and job logs returned 404. Deploy and private VIP jobs were skipped. Do not merge while CI is unresolved.
- Additional source changes made on this branch: global design tokens in `src/app/football-intelligence.css`, browser theme color/color scheme in `src/app/layout.tsx`, and `tests/global-design-system.test.ts`. Latest CSS semantic status-color correction is commit `6d7dbfa4bd2c545d31d5b4fb248e57fafb4ccfce`; earlier commits in this pass: `0b73edada31954fe934789b342282f2b4c9922ec`, `63936661cd6fa588167db5ef8d298b3c5603da76`, `a14f02ecce12d368def210d3603f625085dde9f0`.
- The root layout SEO metadata, canonical, titles, descriptions, and route structure were not changed. No production deploy or merge was performed.
- Validation status for the new design-token work: files were re-fetched from GitHub and the expected tokens/viewport/canonical were checked; automated tests, lint, typecheck and production build have NOT been run in this environment.
- Read-only VIP architecture audit: current `workers/vip-api/src/index.js` still accepts legacy bookmaker-deposit requests (minimum USD 3, proof image, manual review, lifetime-access wording on frontend). Current Worker routes are request/admin operations; no real crypto payment verification or subscription entitlement flow was found in the inspected API. `src/contexts/AuthContext.jsx` is a legacy Firebase context using `import.meta.env`; the current Next root layout does not mount an `AuthProvider`. No Worker, D1, secret, Firebase config, production data, or Cloudflare resource was modified.
- Mobile navigation already has exactly three tabs and localizes their labels; the desktop shell still uses the existing sidebar/topbar and mobile drawer. The global navigation palette has now been aligned to navy/blue/gold, but full layout redesign and responsive visual QA remain open.
- Next actions: inspect remaining page/card/footer styles and affiliate destinations/tracking; design the new VIP auth/entitlement architecture without touching production; request the owner's exact Pro price/billing duration, crypto asset/network, Binance receiving address or supported verification source before implementing payment. Diagnose the PR Actions runner failure; do not bypass checks or merge.



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

## 24. Direction artistique et première passe promo/VIP — 2026-11-13

- Nouvelle branche de travail dédiée : `feat/complete-art-direction-promo-vip-2026-11-13`, créée depuis le `main` fusionné `e7943e81faf28fe588a129ee6d3d8e1a52db0f45`. Ne pas fusionner ni publier avant contrôles.
- Document de référence ajouté : `docs/project/design/DIRECTION_ARTISTIQUE_BTTSPREDICT.md`. Il formalise les tokens navy/bleu/or VIP, typographie Inter/Noto Sans Arabic/JetBrains Mono, densité, navigation, responsive, RTL, accessibilité et garde-fous produit.
- Pages promo partagées : conteneur élargi de 3xl à 5xl, langue/direction déclarées sur le shell, espace mobile réservé à la barre sticky, CTA mobile compact « copier le code » + « ouvrir le partenaire », et alignement FAQ compatible RTL.
- Pages promo 888Starz : palette rapprochée du fond navy global, barre sticky mobile ajoutée avec tracking CTA et espace réservé au-dessus de la navigation basse.
- Linebet EN : le texte visible indique désormais que le code VISION221 fonctionne dans le monde entier, cohérent avec la confirmation du propriétaire. Les titres SEO, descriptions SEO, URLs, canonicals et métadonnées des pages existantes n'ont pas été modifiés.
- Tests promo : `tests/promo-affiliate-disclosure.test.ts` étendu pour vérifier les CTA sticky FR/EN/AR et le texte mondial Linebet.
- VIP : tokens CSS alignés sur la palette globale et accent du titre hero aligné sur l'or mat. Le parcours fonctionnel reste encore l'ancien parcours « dépôt bookmaker ≥ 3 USD + capture + approbation manuelle + accès à vie »; il ne doit pas être présenté comme le modèle final.
- Modèle VIP confirmé dans les échanges antérieurs : VIP Discovery gratuit 7 jours, puis VIP Pro payant; paiements crypto directs vers le portefeuille Binance; vérification réelle côté serveur; activation, expiration et renouvellement contrôlés serveur; aucune activation sur simple clic « j'ai payé ».
- Blocages à résoudre avant refonte fonctionnelle VIP : aucun tarif exact ni durée de facturation Pro confirmés; aucun token/réseau, adresse de réception Binance ou identifiant marchand confirmé; aucune API/clé de vérification de paiement disponible. Authentification Firebase existe dans un ancien `AuthContext.jsx`, mais le fournisseur n'est pas monté dans l'app Next actuelle et aucune route login/register n'a été trouvée. Le Worker actuel n'accepte que les demandes manuelles liées aux dépôts bookmakers; aucune table d'abonnement/paiement ni vérification crypto n'existe.
- Ne pas choisir arbitrairement « 10 USDT/mois » ou USDT TRC20 : ces valeurs n'étaient que des exemples discutés, pas des décisions du propriétaire.
- Aucun Worker Cloudflare, D1 production, secret, données VIP, données de pronostics, page SEO ni site en production n'a été modifié. Aucun déploiement n'a été effectué.
- Étapes suivantes : obtenir du propriétaire le tarif/durée VIP Pro et l'actif/réseau/adresse Binance; définir l'authentification réelle; implémenter migration D1 + vérification de transaction + entitlements + expiration/renouvellement + notifications Telegram; refaire ensuite la page VIP et le parcours complet; lancer tests/build/Vercel, puis traiter le blocage GitHub Actions runner avant tout FTP.

## 25. PR #128 resumption and global palette correction — 2026-11-13 (UTC)

- Read `CHATGPT_PROJECT_CONTEXT.md` directly from the requested PR branch before source work.
- Verified PR #128: open, draft, target `main`, head branch `feat/complete-art-direction-promo-vip-2026-11-13`, initial head `2e6f4e6f18639619ab55a8d5629f350427ce28e3`, 10 commits at first inspection, 8 changed files at first inspection.
- Compared branch to `main`: base/merge-base `e7943e81faf28fe588a129ee6d3d8e1a52db0f45`; branch ahead by 10 and behind by 0 before this pass's commits.
- PR file audit confirmed first-pass work already present: design guide, promo shell and 888Starz mobile sticky CTAs, worldwide Linebet EN wording, VIP palette adjustment and affiliate disclosure tests. These were not repeated.
- CI run `43503251998` for the initial PR head completed with failure in `pull-request-checks`; job exposed no steps, and fetching logs returned 404 BlobNotFound. The same commit's Vercel status was success. Deploy and private VIP candidate jobs were skipped. This does not prove the new commits' checks and does not justify merging.
- Read current navigation shell, bottom navigation, global CSS, root layout, VIP page/modal, Firebase AuthContext, VIP Worker and Wrangler configuration. Mobile bottom navigation already contains only home/predictions/VIP with FR/EN/AR translations. Desktop currently has a 258px sidebar plus sticky topbar; mobile uses a drawer. The global palette previously remained teal-heavy and the root viewport declared a light color scheme despite dark surfaces.
- Applied global palette alignment in `src/app/football-intelligence.css`: navy surfaces, analytical blue accents, matte VIP gold, semantic green success indicators, and matching text/border tokens. Corrected the fresh-data indicator to remain green rather than blue in follow-up commit `6d7dbfa4bd2c545d31d5b4fb248e57fafb4ccfce`.
- Updated only viewport presentation in `src/app/layout.tsx` to `themeColor #070B12` and `colorScheme dark`; root SEO metadata and canonical were preserved.
- Added `tests/global-design-system.test.ts` to assert core palette tokens, semantic success color, dark browser theme, and preserved canonical.
- Commits from this pass: `0b73edada31954fe934789b342282f2b4c9922ec`, `63936661cd6fa588167db5ef8d298b3c5603da76`, `a14f02ecce12d368def210d3603f625085dde9f0`, `6d7dbfa4bd2c545d31d5b4fb248e57fafb4ccfce`.
- Re-fetched modified source from GitHub and confirmed expected palette tokens, dark viewport settings, canonical preservation and test-file presence. No local test runner was available through the GitHub connector; automated tests/lint/typecheck/build are not claimed as run.
- VIP audit confirms the current API remains a manual bookmaker-deposit request system. The inspected Worker does not implement crypto transaction verification, paid subscription state, payment history, or automatic subscription expiry. Firebase AuthContext is not mounted by the root layout and relies on Vite-style `import.meta.env`, so it cannot be assumed to be ready for the Next.js VIP journey. No production Worker, D1, secrets, Firebase settings, Cloudflare resources or data were changed.
- No merge, production deploy, or change to `main` was performed.

## 26. Footer and RTL polish — 2026-11-13 (UTC)

- Continued work without waiting on VIP payment parameters; payment configuration remains the only owner-dependent implementation blocker.
- Updated `src/components/bttsbet/Footer.tsx` to use the approved navy surface `#0F1622` and border `#283548`, replaced FAQ button physical `text-left` with logical `text-start` for Arabic RTL, and localized the legal navigation aria-label in FR/EN/AR.
- Extended `tests/global-design-system.test.ts` with footer palette, logical alignment and Arabic label assertions.
- Commits for this continuation: `75ef9053b682614f779a8fd568118a822c6a35af` and `93677a7c6590b1f5f28fa534df68a583a88354db`.
- Re-fetched Footer, test, global CSS and root layout from the PR branch and verified the expected source strings; this is source inspection, not execution of the tests.
- Latest PR head at checkpoint: `93677a7c6590b1f5f28fa534df68a583a88354db`; PR #128 remains open/draft, 17 commits, 12 changed files. Compare against main: ahead 17, behind 0. No main changes.
- Latest Vercel status was pending at the time of check. GitHub Actions run `43518343402` failed in the `pull-request-checks` job; GitHub did not expose job steps/logs (logs endpoint returned BlobNotFound). Failed-job rerun was successfully requested; result is not yet known. Deploy and private VIP jobs remain skipped for the PR event.
- No merge, production deployment, FTP, Cloudflare resource, Worker, D1, secret, or production data modification was performed.

## 27. Global dark-theme override and navigation completion — 2026-11-13 (UTC)

- Audited the full global stylesheet and found later legacy rules from 2026-11-05 overriding the newer navy system: they forced `html/body` to light mode, changed page text to dark, and reset navigation to teal/red. Earlier token edits alone were therefore insufficient.
- Added a final authoritative dark-theme layer at the end of `src/app/football-intelligence.css`: restores dark color-scheme and navy surfaces, updates shared design tokens, sets the analytical blue active navigation state, and keeps VIP navigation gold. Desktop/mobile brand glows now use blue.
- Updated `Navbar.tsx`: partner navigation links now expose `aria-current="page"` when their guide is active, and the desktop topbar page context displays the active partner brand rather than the generic workspace label.
- Expanded `tests/global-design-system.test.ts` to guard the final dark override, blue/gold navigation, footer RTL treatment, and active partner route semantics.
- Commits in this batch: `38a197bd24c566aa700a572c507d0254df2ce293`, `12db3ae9483ca25bdfe1642bcff85eba8035ba59`, `f703b499ac6129cfce1dfc88cd6df14ad2746d78`, `16e64bfba83297d2491bf1a343f130b039a3212b`, `3f996f6db1d273ef05bc5b037e433253d28c4b7b`, `1ba67aa6750381a0f3adc742fa64fc0ca43b6c33`, `877343c02e5e9b3247d4fd9417fd0beae6280833`.
- Source re-fetch verified the final CSS override exists after legacy rules, dark color-scheme declarations appear later than the old light-mode declarations, partner links contain `aria-current`, and the test source contains assertions for these changes. Tests/build have NOT been executed in this session.
- The last inspected CI run `43518343402` has failed `pull-request-checks`; the rerun was accepted but remains failed on inspection. GitHub's job-step response was empty and job-log endpoint returned BlobNotFound, so the failure cause cannot be established from available evidence. No new PR-triggered Actions run was returned for the latest head; Vercel was pending at last check.
- Latest code head at this checkpoint before this context commit: `877343c02e5e9b3247d4fd9417fd0beae6280833`. PR #128 remains open/draft, not merged. Main remains untouched; no production deployment, FTP, Cloudflare Worker/D1, secrets, or production data changed.
- VIP rebuild is still pending: current live UI/API contains the legacy bookmaker deposit/proof/lifetime-access workflow. Do not relabel it as Discovery/Pro or enable a crypto-payment claim until the new auth/entitlement/payment workflow is implemented and the owner's Pro price, billing period, asset, network, and public receiving address are confirmed.

## 28. Homepage, prediction and VIP visual convergence — 2026-11-13 (UTC)

- Continued the global art direction beyond navigation: found later legacy CSS blocks that had reintroduced white card surfaces and older teal/red accents on home, BTTS dashboard, match analysis and promo guides.
- Added a final surface layer to `src/app/football-intelligence.css` for the homepage hero, match center cards, BTTS dashboard panels/filters, prediction and match-detail cards, partner promo shells, 888Starz page, and 1xBet gift panel. Surfaces now use the shared navy panels, muted text, analytical-blue active states, and the existing green semantic status.
- Added a final VIP CSS layer to `src/app/vip/vip.css` to neutralize red accents in the late overrides and align the flow, steps, locked previews, FAQ and video frame with champagne gold and navy.
- Added test assertions for the final home/dashboard/promo surface layer and the VIP gold layer in `tests/global-design-system.test.ts`.
- Commits in this batch: `ed0467f3cbb1dabbfef9485c5eadfcedfbc1014f`, `621eb005f7148250d6b756b45f0753915e7482b9`, `dfd2c3834e77929720a1e260abaa91e0431c8449`.
- This remains source-level work only. No browser screenshot, local npm test, lint, TypeScript check, or production build has been executed. Do not claim the rendered result is visually verified until the deployment preview is inspected.
- VIP workflow itself is still the old bookmaker-deposit/manual-review process. The color redesign does not imply the Discovery/Pro authentication or crypto billing is implemented.

## 29. Mobile navigation accessibility and CI follow-up — 2026-11-13 (UTC)

- Improved the mobile navigation drawer in `Navbar.tsx`: opening moves focus to the close control; Escape closes the drawer; Tab/Shift+Tab are contained within the dialog; closing restores focus to the menu trigger. A guard prevents initial desktop render from stealing focus.
- Extended the navigation test assertions for focus trapping and focus restoration.
- Commits: `22190a21d719930e36364600dee37ec2526db803`, `878b928e827294927e8af93ee959e8868ef9a8f4`, `3926eaf7a61665250bb3bffb82be3060263d18a5`, `c47d32f0f1c903bb2e96741ac3eae8afc1a8e5c0`.
- Re-read `.github/workflows/deploy.yml`: PR checks run `npm test`, Python unit tests, `npm run lint`, `npx tsc --noEmit`, then `npm run build -- --webpack`. The latest observed run `43519345629` ended with `pull-request-checks` failure; GitHub returned no step summaries and its job-log download returned BlobNotFound. A failed-job rerun request was accepted, but the observed job state still showed failure at the last poll. Root cause remains unknown; do not claim tests passed.
- Latest PR branch code head before this continuity update: `878b928e827294927e8af93ee959e8868ef9a8f4` (context commit follows). PR #128 remains draft/open, not merged; Vercel was pending. No production deployment or main-branch change.

## 30. Design specification and latest CI retry — 2026-11-13 (UTC)

- Extended `docs/project/design/DIRECTION_ARTISTIQUE_BTTSPREDICT.md` with the final cascade rules, navy/blue/gold surface treatment, partner route context, mobile drawer focus management, and preview validation requirements.
- Latest code/document commit before this checkpoint: `0694797ff8134909f5c7c64850778621157403f0`.
- Latest PR-triggered workflow run observed: `43519773319`, job `pull-request-checks` concluded failure; deploy and VIP candidate jobs skipped as expected for a PR. GitHub exposed no job-step summaries, no artifacts, and prior job log downloads returned BlobNotFound. A rerun of the failed job was accepted; latest poll still showed the previous failure. Cause remains unverified.
- Vercel preview status for the latest head was pending. Do not report a successful preview, visual QA, test suite, lint, typecheck, or production build.
- PR #128 remains open and draft, 36 commits ahead of main and 0 behind; no merge and no deployment.

## 31. Focus trap coverage and current validation attempt — 2026-11-13 (UTC)

- Completed the mobile drawer focusable selector so links, buttons, inputs, selects, textareas and explicit tabindex controls are all included in keyboard focus cycling.
- Added a matching static assertion to `tests/global-design-system.test.ts`.
- Reviewed the PR patches for the global stylesheet, VIP stylesheet, Navbar, footer, promo shell, tests and root layout. No SEO title, description, canonical, route or prediction-data changes were found in the inspected patches; root layout change remains limited to browser dark-mode metadata.
- Source re-fetch confirms the focus selector and test assertion are present.
- Latest head before this checkpoint: `87b1a386d21c69dfee0ae4f6ec358f3e5f804393`. A fresh PR workflow run `43519980753` was queued at last poll; Vercel was pending. Await results before calling validation successful.

## 32. Residual outer-shell palette cleanup — 2026-11-13 (UTC)

- A final cascade review found the legacy teal page canvas still applied to homepage, over-2.5, exact-score, match-analysis and BTTS dashboard outer containers, plus the FAQ/footer shell.
- Added a final CSS override to place those outer shells on the approved `#070B12` background and keep footer text on the global text token.
- Extended the global design-system test to assert the outer page and footer shell rules.
- Commits: `929e3914b9dd70153fb6757046b18b1c7ed541ef`, `aaa5a4f36e4e300a49b5a30e06db2693b9cce01a`.
- Source inspection only; no screenshot or browser verification yet. The most recent known CI failure remains unresolved because job summaries/logs are unavailable through GitHub; a later PR run may be needed to validate this final patch.

## 33. VIP Discovery / Pro migration architecture — 2026-11-13 (UTC)

- Added `docs/project/vip/ARCHITECTURE_DISCOVERY_PRO.md` based on a fresh inspection of the existing Firebase Auth context, root Next layout, VIP Worker routes and D1 `0001_initial.sql`.
- Confirmed the current VIP request model still requires a bookmaker deposit of at least USD 3 and proof image, with manual owner review; no paid entitlement or real crypto verification endpoints exist.
- Confirmed a Firebase Auth implementation exists but uses Vite `import.meta.env.VITE_FIREBASE_*` variables and its provider is not mounted by the Next root layout. Existing Firestore `isVip` must not be trusted as server authorization.
- The architecture proposes Firebase ID token verification in the Worker, D1-authoritative entitlements, one-time 7-day Discovery trial, idempotent payment intents/transaction hashes, expiry/renewal ledger and Telegram notifications only after confirmed entitlement.
- No auth provider, D1 migration, Worker endpoint, Firebase config, Binance integration, secret or production resource was changed. The doc lists owner inputs required before the payment rail can be implemented.
- Architecture doc commit: `64e86a3739ac76a857a0dc183559ad67d9be583f`.

## 34. GA4 production-only activation — 2026-11-13 (UTC)

- Audited `AnalyticsLoader.tsx`: GA4 already loads directly through `gtag.js`, but previously gated only by `NODE_ENV === 'production'`, which is also true for production-mode preview builds. The code also relied on `NEXT_PUBLIC_GA_ID` being set in Actions variables.
- Changed the loader to require an explicit `NEXT_PUBLIC_GA_ENABLED === 'true'` flag in addition to production build mode and saved analytics consent.
- Updated `.github/workflows/deploy.yml`: PR build sets `NEXT_PUBLIC_GA_ENABLED: 'false'`; main production deployment sets it to `'true'` and uses the existing known GA4 measurement ID `G-F705Z3L2HT` as a fallback if the repository variable is absent.
- Added a test assertion for consent gating and production/PR workflow separation.
- GTM container `GTM-NGVK3V3V` is not added here; the site uses one direct GA4 loader, avoiding accidental double initialization. Do not inject a second GA4 tag through GTM without deliberately switching the implementation.
- No GitHub Actions variable/secret settings, Vercel settings, analytics account, production deployment, or live site was changed. Actual event receipt still requires a successful main deployment and the visitor's analytics consent.
- Commits: `ecc8e4e394cbc9c54adbf1c8290d2906f3f3df92`, `e37ac33c8c8713dbcd265ba3823d66b35ffd16bd`, `f4b05c74d12e0d6cf04569820c2ce1aced3ab007`.

## 35. GA4 consent integration verification — 2026-11-13 (UTC)

- Inspected `CookieConsent.tsx` to confirm it uses the same storage key as `AnalyticsLoader.tsx`, persists `preferences.analytics`, and dispatches `cookie-consent-changed` after the user saves preferences.
- Added static test assertions connecting the cookie consent component to the GA4 loader, in addition to the production-only workflow flag checks.
- No tracking request was sent from this source inspection; event collection remains dependent on successful production deployment and user consent.
- Commit: `f13a3b563655407b40855bdb2951fc723ac80af6`.

## 36. VIP public-page transition to Discovery / Pro preview — 2026-11-13 (UTC)

- Replaced the public VIP page's lifetime/bookmaker-deposit messaging and four-step bookmaker proof wizard with a three-language Discovery 7-day / VIP Pro plan preview.
- Removed the old `VipJourneyModal` from the public page; the plan CTA buttons are intentionally disabled until account authentication, D1 entitlements and verified payment are implemented. The page explicitly says no payment is currently accepted and tells visitors not to make bookmaker deposits for BTTSPredict access.
- Replaced old manual-review CTAs in `VipLockedPicks.tsx` and `VipWinHistory.tsx` with navigation to the new plan section.
- Removed the old walkthrough video from the public VIP hero because it demonstrated the obsolete bookmaker-deposit process; replaced it with a Discovery / VIP Pro membership-card preview in the approved champagne-gold style.
- Added responsive plan-card styling and regression assertions preventing lifetime/deposit claims or reintroduction of the old modal/video.
- Files: `src/app/vip/page.tsx`, `src/app/vip/VipLockedPicks.tsx`, `src/app/vip/VipWinHistory.tsx`, `src/app/vip/vip.css`, `tests/global-design-system.test.ts`.
- Commits: `7deb82837a7d1fb1f953f1e50eb05336a75134ae`, `edca57765ce4724ed94a9b1a1673114647bab446`, `d0a0a7670c9a3f425083698714a14798849b2eeb`, `730578574380e8d3ee7b5a370e8ead3e2c81e14a`, `84d1c0d0a86f55b54354eefef3aed90f9d690a42`, `1ce59042b5706e8c15a50a3b966c32d93c2832f1`, `dd705ece4b16fa6993475ca6081bdd089c9f4e3a`, `2e226c0f9059c9341ebf1cc15483390a893b3ad8`, `ce4a4717b1d42a1dafc37988fda57595c8e53962`, `e69d469d4dc2813fa75563f5d3d598b4d6f013d6`, `a49370dfd67320b4cc198d6d38952d0316f03653`, `bf2625dd79f35f4449af25a182ec74a1c429cd33`.
- The legacy Worker routes, D1 tables and modal source file are retained but are no longer imported by the public VIP page; do not delete old request data or deploy the new page until the replacement backend and migration are ready.
- No account, payment, entitlement or production access has been activated. Price, subscription duration and crypto rail remain unconfigured.

## 37. VIP preview validation status — 2026-11-13 (UTC)

- Re-fetched the VIP page, locked-picks component, history component, VIP CSS and regression tests after the public transition. Source inspection confirms: no lifetime wording, no $3 bookmaker deposit, no manual-review copy, no old modal import, no old walkthrough video, Discovery/Pro cards present, disabled CTAs, and clear no-payment-yet copy.
- The new VIP preview does not activate any account or entitlement. Old Worker endpoints, D1 request data and the orphaned modal source remain retained for historical compatibility until the replacement backend migration is ready.
- PR workflow run `43520868377` failed in `pull-request-checks`; rerunning the failed job was accepted but the latest poll still showed failure. Job step summaries were empty and the log download returned BlobNotFound, so the failing step/root cause is still unknown.
- Vercel preview was pending at the last status poll. No visual preview has been inspected, no tests/build have been confirmed green, and no production deployment or merge has occurred.


## 38. Reprise du chantier refonte publique — 2026-11-13 (UTC, 23:31)

### Portée et état réel
- La PR #128 reste ouverte en brouillon, base `main`, head `feat/complete-art-direction-promo-vip-2026-11-13`.
- Dernier head confirmé : `cfcc720ff8489446dedf8b26cbfff7fb22a2278d`; 171 commits, 58 fichiers modifiés.
- La page VIP et son CSS sont strictement identiques à `main` sur le head actuel. Le chantier VIP est donc bien exclu de cette refonte publique; il sera repris séparément.
- Aucun merge ni déploiement de production effectué.

### Corrections complémentaires apportées après la première passe
- Guides 888Starz : retrait du bloc de vérification répétitif, ajout navigation/footer partagés sur les routes localisées, suppression de l'ancien habillage CSS glass/gradient, correction du main landmark et du chevauchement avec la bottom navigation mobile.
- Guides Linebet/1xBet/Melbet : retrait du composant de vérification dupliqué, alignement des shells sur le fond navy commun et ajout du footer partagé aux guides localisés.
- Résumés promo : suppression de formulations répétées « worldwide » pour 1xBet/Melbet; wording du fallback Linebet clarifié pour ne pas répéter de promesse bonus non vérifiée.
- Statistiques BTTS : retrait du second flux de pronostics qui dupliquait la page et clarification du titre en « Compétitions suivies · BTTS ».
- Statistiques Over 2.5 : remplacement des sections vides par une liste des compétitions réellement configurées, sans inventer de pourcentages de réussite; liens vers les pronostics du jour et la couverture BTTS.
- Pronostics BTTS demain : retrait du titre animé, du texte explicatif répétitif et du CTA en doublon; filtrage explicite du flux sur le marché BTTS.
- Résultats archivés : retrait du flux de pronostics dupliqué et réécriture des textes FR/EN/AR pour ne pas prétendre à une vérification ESPN universelle si la source n'est pas établie sur chaque ligne.
- Historique, statistiques et pages de compétition : application du shell éditorial partagé; cartes de compétition/statistiques aplaties et débarrassées des ombres/effets décoratifs.
- Les slugs, URLs SEO et données de pronostics n'ont pas été volontairement changés par ces retouches.

### Validation technique — état à 23:31 UTC
- GitHub Actions run `43527590865` sur le head `cfcc720...` : job `pull-request-checks` en échec; jobs `deploy` et génération VIP ignorés.
- Le job GitHub ne fournit pas de steps et le téléchargement des logs retourne `BlobNotFound`; cause racine CI toujours inconnue.
- Statut Vercel pour ce head : failure avec indication `build-rate-limit` (limite de builds du compte), pas un résultat de build applicatif.
- Aucun résultat vert de lint/typecheck/tests/build n'a été obtenu. Aucun contrôle visuel complet du preview n'a été fait.
- Le statut Vercel précédemment marqué success concernait un autre head/état; ne pas le présenter comme validation du head actuel.

### Prochaines tâches obligatoires avant de déclarer prêt
1. Continuer la refonte des pages publiques restantes : accueil, flux pronostics, détail match, résultats, historique, statistiques, compétitions et toutes les pages promo.
2. Auditer les styles hérités et les cartes de match réellement rendues, sans remplacer les données ou les composants fonctionnels à l'aveugle.
3. Vérifier FR/EN/AR, RTL, responsive mobile/desktop, navigation clavier et accessibilité.
4. Contrôler toutes les métadonnées, slugs, canonicals, liens internes et paramètres affiliés sans les modifier.
5. Résoudre ou obtenir des logs exploitables pour le job CI; relancer les tests, lint, typecheck et build jusqu'à obtention de résultats verts.
6. Inspecter le preview Vercel après rétablissement de la capacité de build; ne pas confondre l'URL preview avec le site en production.
7. Garder la PR en brouillon et ne pas fusionner/déployer sans nouvelle vérification complète.
