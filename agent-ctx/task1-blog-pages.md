# Task: Create 6 SEO Blog Article Pages for BttsBet

## Summary
Created 6 server component blog pages under `/src/app/blog/` with proper SEO metadata, JSON-LD structured data, breadcrumbs, rich French content (800-1200+ words each), CTAs, internal links, and dark theme styling.

## Pages Created

### 1. `/blog/guide-linebet-inscription/page.tsx`
- Title: "Guide Complet Linebet : Inscription, Dépôt et Code Promo VISION221"
- Category: Guide (emerald badge)
- Content: Step-by-step registration, deposit methods (Mobile Money, crypto, cards), promo code VISION221 usage, navigation guide, tips for African users (CFA Franc), withdrawal methods
- Internal links: strategie-mise-over-2-5, faille-fifa-linebet, gestion-bankroll-paris-sportifs

### 2. `/blog/gestion-bankroll-paris-sportifs/page.tsx`
- Title: "Gestion de Bankroll aux Paris Sportifs : Le Guide Ultime 2026"
- Category: Stratégie (gold badge)
- Content: Bankroll definition, 1-5% rule with table, unit sizing, flat betting vs percentage betting, Kelly criterion with formula, common fatal errors, practical month example with 50,000 FCFA
- Internal links: strategie-mise-over-2-5, guide-linebet-inscription

### 3. `/blog/meilleurs-championnats-btts/page.tsx`
- Title: "Les 10 Meilleurs Championnats pour les Paris BTTS en 2026"
- Category: Analyse (royal badge)
- Content: Full ranking table with BTTS rates and goals/match, detailed analysis of top 3 (Bundesliga, Eredivisie, Premier League), summaries of remaining 7, why some leagues are better, practical tips
- Internal links: strategie-mise-over-2-5, comment-analyser-match-btts, gestion-bankroll-paris-sportifs

### 4. `/blog/strategie-mise-over-2-5/page.tsx`
- Title: "Stratégie de Mise Over 2,5 : Optimiser ses Gains en 2026"
- Category: Stratégie (gold badge)
- Content: Understanding Over 2.5 market, statistical approach (xG, averages, defensive stats), target leagues and teams, BTTS + Over 2.5 combination strategy, live betting strategies, common pitfalls
- Internal links: meilleurs-championnats-btts, gestion-bankroll-paris-sportifs

### 5. `/blog/comment-analyser-match-btts/page.tsx`
- Title: "Comment Analyser un Match pour le BTTS ? Guide Complet 2026"
- Category: Guide (emerald badge)
- Content: 6 key factors (xG, defensive stats, H2H, motivation, injuries, AI), how AI helps, practical BTTS checklist with criteria scoring
- Internal links: meilleurs-championnats-btts, strategie-mise-over-2-5

### 6. `/blog/faille-fifa-linebet/page.tsx`
- Title: "Faille FIFA Linebet : Comment Détecter les Cotes Erronées en 2026"
- Category: FIFA (purple badge)
- Content: FIFA market anomaly explanation, how odds are calculated, 4-step value bet detection method, AI scanning, risk management rules, FIFA vs real football comparison, responsible gambling disclaimer
- Internal links: gestion-bankroll-paris-sportifs, comment-analyser-match-btts, guide-linebet-inscription

## Technical Implementation
- All pages are **Server Components** (no 'use client')
- Each page exports **Next.js Metadata** with title, description, openGraph, twitter, canonical URL, keywords
- Each page has **JSON-LD** structured data: Article schema + BreadcrumbList
- Breadcrumb navigation: Accueil > Blog > Article Title
- **CTA section** at bottom with links to "/" (pronostics) and Linebet affiliate with rel="sponsored nofollow"
- Dark theme styling matching BttsBet: bg-dark-900, text-white, emerald/gold/purple accents
- Bebas Neue font for headings, Inter for body (via CSS variables)
- Import Navbar and Footer from '@/components/bttsbet'
- Static generation compatible (output: export)
- All pages verified: 200 status codes, clean compilation
