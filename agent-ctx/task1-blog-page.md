# Task 1: Blog Listing Page

## Summary
Created a server-side rendered blog listing page at `/home/z/my-project/src/app/blog/page.tsx` for the BttsBet football predictions site.

## What was done
- Created `src/app/blog/page.tsx` as a **Server Component** (no `'use client'`)
- Exported `Metadata` with:
  - Title: "Blog – Pronostics BTTS & Over 2,5 | BttsBet"
  - French description about football betting tips
  - Canonical URL: `https://bttsbet.online/blog`
  - OpenGraph and Twitter card metadata
- Listed 6 blog articles with cards linking to the specified slugs
- Used dark theme styling (bg-dark-900, text-white, text-emerald, text-gold accents)
- Imported `Navbar` and `Footer` from `@/components/bttsbet`
- Added JSON-LD structured data for:
  - `Blog` schema with 6 `BlogPosting` entries
  - `BreadcrumbList` schema
- Each card includes: title, short description (2-3 lines), date, category badge, and "Lire l'article →" link
- Page is entirely in French
- Added breadcrumb navigation with proper ARIA labels
- Uses Bebas Neue for headings and Inter for body text
- Compatible with `output: "export"` static generation

## Issues encountered
- Pre-existing `motion-utils` package was broken (missing `wrap.mjs`), fixed by reinstalling via npm
- Turbopack panic after `bun install` corrupted node_modules state
- These were pre-existing infrastructure issues, not caused by the blog page code

## Verification
- Blog page returns HTTP 200 when dev server is running
- Correct title, meta description, canonical URL, and JSON-LD data confirmed in rendered HTML
- All 6 article links present and correct
