#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
// BttsBet – Générateur de sitemap.xml automatique
// Usage : node scripts/generate-sitemap.js
// Ce script lit les articles de constants.js et génère
// un sitemap.xml complet dans /public/sitemap.xml
// ═══════════════════════════════════════════════════════════════

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SITE_URL = 'https://bttsbet.online'
const TODAY = new Date().toISOString().split('T')[0]

// ─── Articles du blog (synchronisé avec constants.js) ───
const BLOG_ARTICLES = [
  {
    slug: 'comment-analyser-match-btts',
    date: '2026-06-01',
    title: 'Comment analyser un match pour le BTTS ? Guide complet 2026',
  },
  {
    slug: 'strategie-mise-over-2-5',
    date: '2026-05-28',
    title: 'Stratégie de mise Over 2,5 : optimiser ses gains en 2026',
  },
  {
    slug: 'meilleurs-championnats-btts',
    date: '2026-05-25',
    title: 'Les 10 meilleurs championnats pour les paris BTTS en 2026',
  },
  {
    slug: 'gestion-bankroll-paris-sportifs',
    date: '2026-05-20',
    title: 'Gestion de bankroll aux paris sportifs : le guide ultime',
  },
  {
    slug: 'guide-linebet-inscription',
    date: '2026-05-15',
    title: 'Guide complet Linebet : inscription, dépôt et code promo VISION221',
  },
]

// ─── Pages statiques (NO hash URLs — Google ignores # fragments in sitemaps) ───
const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'daily', lastmod: TODAY },
  { path: '/blog', priority: '0.8', changefreq: 'weekly', lastmod: TODAY },
  { path: '/mentions-legales', priority: '0.3', changefreq: 'yearly', lastmod: '2026-06-01' },
  { path: '/politique-confidentialite', priority: '0.3', changefreq: 'yearly', lastmod: '2026-06-01' },
  { path: '/jouer-responsable', priority: '0.4', changefreq: 'yearly', lastmod: '2026-06-01' },
  { path: '/cgu', priority: '0.3', changefreq: 'yearly', lastmod: '2026-06-01' },
]

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function generateSitemap() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

`

  // Pages statiques
  for (const page of STATIC_PAGES) {
    xml += `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="fr" href="${SITE_URL}${page.path}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${page.path}"/>
`
    if (page.path === '/') {
      xml += `    <image:image>
      <image:loc>${SITE_URL}/og-image.png</image:loc>
      <image:title>BttsBet – Pronostics BTTS &amp; Over 2,5 par IA</image:title>
      <image:caption>Pronostics football BTTS et Over 2,5 générés par intelligence artificielle</image:caption>
    </image:image>
`
    }
    xml += `  </url>\n\n`
  }

  // Articles du blog (NO news:news — not in Google News, causes GSC errors)
  for (const article of BLOG_ARTICLES) {
    xml += `  <url>
    <loc>${SITE_URL}/blog/${article.slug}</loc>
    <lastmod>${article.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="fr" href="${SITE_URL}/blog/${article.slug}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/blog/${article.slug}"/>
    <image:image>
      <image:loc>${SITE_URL}/og-image.png</image:loc>
      <image:title>${escapeXml(article.title)}</image:title>
    </image:image>
  </url>\n\n`
  }

  xml += `</urlset>`

  return xml
}

// ─── Écrire le fichier ───
const publicDir = path.join(__dirname, '..', 'public')
const outputPath = path.join(publicDir, 'sitemap.xml')

const sitemap = generateSitemap()
fs.writeFileSync(outputPath, sitemap, 'utf-8')

console.log(`✅ sitemap.xml généré avec succès !`)
console.log(`   📄 ${STATIC_PAGES.length} pages statiques`)
console.log(`   📝 ${BLOG_ARTICLES.length} articles de blog`)
console.log(`   📍 ${outputPath}`)
