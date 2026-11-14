# BTTSPredict — Design System & Product Brief (AUTHORITATIVE)

Status: source of truth for the fresh redesign. This document supersedes all previous mockups, screenshots, design prompts, local prototypes, and visual work produced before 2026-11-14.

## 1. Brand and commercial objective

- Official and only platform brand: **BTTSPredict**.
- **VISION221 is ONLY the LINEBET promo code.** It is not a brand, product name, slogan, signature, design system, or platform identity.
- The primary commercial objective is to generate more new registrations for every bookmaker partner, then measure attributable outbound clicks and registrations where partner reporting permits.
- Partners must all remain present: LINEBET, 1xBet, MelBet, 888Starz.
- Commercial priority: LINEBET and 1xBet first; MelBet and 888Starz second. Do not hide or remove secondary partners.

## 2. Approved partner codes

| Partner | Exact promo code | Priority |
|---|---|---|
| LINEBET | VISION221 | Primary |
| 1xBet | vipbtts | Primary |
| MelBet | Bttswin | Secondary |
| 888Starz | btts221 | Secondary |

Codes are case-sensitive display values: preserve exactly as listed here unless the current verified integration explicitly requires a different casing. Preserve existing affiliate destination URLs, query parameters, tracking IDs, and attribution logic. Never fabricate or replace partner URLs.

## 3. Conversion-first experience

Every relevant partner placement should make these items immediately understandable:
1. bookmaker identity;
2. verified offer/benefit, with no invented terms;
3. exact promo code, easy to copy;
4. clear registration CTA that uses the existing approved affiliate destination;
5. short, transparent explanation of how to apply the code, only when verified.

Design for the path: visitor → partner comparison/details → copy promo code → click registration link → partner registration. Track each measurable step without claiming partner registration success unless a reliable partner callback/report confirms it.

No dark patterns, fake countdowns, fake scarcity, fabricated testimonials, guaranteed winnings, misleading bonuses, or invented eligibility/minimum deposit/rollover terms.

## 4. Visual direction — create from zero

Build a new visual language; do not imitate the previous Cue design or reuse its screenshots, generated mockups, local components, CSS, tokens, or page composition.

Desired character:
- premium, credible football analytics product, not a generic betting blog;
- deep midnight/navy foundation with restrained analytical blue accents;
- muted warm metallic accent only for carefully selected VIP or partner emphasis, never as a second brand identity;
- strong typography hierarchy, consistent spacing, clean grids, crisp contrast and restrained depth;
- match and prediction cards must prioritize legibility, fixture identity, kickoff, market, confidence/evidence labels, and action;
- avoid excessive gradients, glowing borders, noisy backgrounds, oversized slogans, and decorative 3D effects that reduce clarity.

Create original design tokens, components, and page compositions after auditing the current functional architecture. Do not copy old styling simply because it is already in the repository.

## 5. Responsive navigation and languages

- Mobile-first; validate at narrow Android widths before desktop.
- Mobile bottom navigation: exactly **ACCUEIL / PRONOSTICS / VIP** (localized equivalents for EN/AR).
- Desktop navigation: compact, intentional, accessible.
- Preserve French, English, and Arabic.
- Arabic must use correct RTL direction, alignment, logical spacing, and mirrored navigation where appropriate; do not merely translate labels.

## 6. Scope

Design and implement a coherent system across:
- homepage;
- predictions listing and match details;
- statistics, history, results, competitions;
- partner promotional pages and partner comparison/selection;
- VIP discovery and VIP pages;
- shared navigation, footer, dialogs, forms, and empty/loading/error states.

This is a visual/product redesign, not authorization to rewrite business logic.

## 7. Non-negotiable preservation rules

- Keep all existing production routes, slugs, SEO titles, descriptions, canonical URLs, structured data, sitemap and feed behavior unchanged unless the owner separately approves a documented change.
- Especially protect established high-performing pages including `/en/btts-and-over-2-5-predictions-today`.
- Preserve prediction inputs, calculations, filters, market mapping, score estimates, historical results and data pipelines.
- Preserve authentication, VIP entitlements, payment verification, account data, APIs, database schemas/migrations, Telegram automation, and admin functions.
- Preserve affiliate URLs, query parameters, IDs, and tracking behavior.
- Do not change secrets, environment variables, production resources, Cloudflare, DNS, or deployment workflows as part of design work.
- Never replace real data with hardcoded demo predictions in production components.

## 8. Required workflow

1. Start from branch `rebuild/vision221-premium-design-2026-11-14`, created from `main`.
2. Read the current source only to understand routes, contracts, data, and behavior. Existing source is not a visual reference.
3. Build a new design system and new design reference files first. Use this document as the governing product brief.
4. Make small, reviewable changes. Keep business logic separate from presentation.
5. Compare route/metadata/affiliate/prediction behavior against `main`.
6. Run available lint, typecheck, unit tests, and production build; report exact results, including failures and skipped checks.
7. Produce a real accessible preview on a non-production environment. Do not invent a preview URL.
8. Provide mobile and desktop screenshots and a route checklist to the owner.
9. Stop and wait for explicit owner approval before merging or deploying to production.

## 9. Acceptance criteria

- BTTSPredict is the only platform brand in all visible branding.
- VISION221 appears only as the LINEBET promo code, not as a signature or site identity.
- All four bookmakers and their exact codes are visible in the appropriate partner journeys.
- Registration CTAs preserve each verified affiliate destination and attribution parameters.
- New design is visibly distinct from the abandoned Cue mockup.
- Mobile navigation has exactly three tabs; FR/EN/AR and Arabic RTL remain correct.
- Existing SEO, prediction, account, VIP and payment behavior is preserved.
- Preview is usable on the owner's Android phone; no production deployment without approval.
