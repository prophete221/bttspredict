# Design progress — design/refonte-2026-11

## Status

Milestone 1 — visual system + shell. Not merged. Production FTP (`main`) untouched.

## Done

- `src/app/shell.css`: calmer tokens (background, text, single blue accent, flat surfaces).
- Body class `ds-shell` on the root layout.
- Navbar: flat bar, quieter promo chip, language as FR / EN / AR, simpler mobile drawer (no glow cards).
- Bottom navigation: one active color, no motion glow.
- Footer: duplicate legal link grid removed (links remain in the legal column). FAQ, 18+, affiliation and publisher kept.
- `vercel.json`: Next.js framework hint only. Does not change the GitHub Actions FTP workflow.

## Not done

- Interior pages (predictions, VIP, promos, legal) still use the previous page layouts.
- No production deploy.

## Vercel

Checked 2026-11-03: the GitHub repo has no deployment records and no webhooks. This environment has no Vercel credentials, so a Preview URL cannot be created from here until a Vercel token is provided or the repo is connected in the Vercel dashboard. FTP on `main` is unchanged.
