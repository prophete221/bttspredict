# BTTSPredict — implementation notes, 14 November 2026

## Working branch
`redesign/bttspredict-complete-2026-11-14`

Base: current `main` at the time this branch was created. This branch is isolated from production.

## Governing brief
Implementation follows `docs/design/BTTSPREDICT_DESIGN_SYSTEM.md`. The platform brand remains BTTSPredict. VISION221 is only the LINEBET promo code.

## Current implementation stage
- Rebuilt `src/app/bttspredict-design-system.css` as the single global visual layer for the product.
- Unified the visual foundation: midnight/navy surfaces, analytical blue, restrained teal status colors, muted champagne only for VIP emphasis, typography, borders, spacing, focus states and responsive behavior.
- Restyled the desktop navigation rail and top bar, including active states, partner links, collapsed navigation, and the mobile drawer.
- Restyled the homepage hero, live featured match, Match Center cards, trust pillars, methodology steps, league tiles, partner cards, performance dashboard and footer.
- Unified prediction dashboards and match cards, filters, confidence/status labels, market panels, statistics tiles, results and archive surfaces.
- Unified partner promo shells and the dedicated 888Starz page without changing affiliate URLs or copy/registration tracking logic.
- Unified VIP surfaces without changing access approval, account, payment, or entitlement behavior.
- Styled reusable overlays and controls, including gift popup, cookie dialog, language switcher, and mobile CTA surfaces.
- Normalized legacy literal color utility classes used by localized editorial routes.
- Updated only the browser theme-color value in the root layout to match the new palette.

## Explicitly untouched
- Route paths, slugs, redirects, canonical URLs, titles, descriptions, hreflang, Open Graph and structured data.
- Sitemap, robots, feeds, predictions JSON, history JSON, archives, fixtures and team data.
- Prediction models, inputs, probabilities, filters, score estimates and verdict logic.
- Authentication, VIP validation, account state, payment verification, admin tools, Telegram flows and APIs.
- Partner codes, affiliate destinations, query parameters, tracking IDs and conversion events.
- FTP deployment workflow, secrets, hosting, DNS and production resources.

## Validation still required
The GitHub Actions runner issue prevented reliable automated validation in the latest main-branch runs. No claim is made that this redesign has passed TypeScript, lint, tests or production build yet.

Before production:
1. Run the repository's actual checks: TypeScript, Vitest, ESLint and Next.js production build.
2. Compare all route metadata, affiliate destinations and protected functional files against the base commit.
3. Test FR, EN and AR, including Arabic RTL, on narrow Android and desktop widths.
4. Inspect homepage, predictions, match details, results/history/statistics, competitions, all four partner guides and VIP.
5. Verify no horizontal overflow, broken focus states, unreadable cards or hidden legal disclosures.
6. Only after owner approval, merge and deploy through the existing GitHub Actions FTP workflow to bttspredict.com.

This is a progress record, not a production deployment confirmation.
