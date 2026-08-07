#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
// BttsBet – Générateur de sitemap.xml complet (toutes les pages)
// Usage : node scripts/generate-sitemap.mjs
// Ce script génère un sitemap.xml exhaustif dans /public/sitemap.xml
// incluant toutes les pages SEO, landing pages, blog et pages légales.
// ═══════════════════════════════════════════════════════════════

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SITE_URL = 'https://bttspredict.com'
const TODAY = new Date().toISOString().split('T')[0]

// ─── Pages SEO / Landing Pages ───
const SEO_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'daily', lastmod: TODAY, image: true, imageTitle: 'BTTSPredict — Pronostics BTTS et Over 2.5 basés sur un modèle statistique', imageCaption: 'Pronostics football BTTS et Over 2.5 basés sur un modèle statistique Poisson V3-Reliability.' },
  { path: '/pronostics', priority: '0.95', changefreq: 'daily', lastmod: TODAY, image: true, imageTitle: 'Pronostics BTTS et Over 2.5 du jour', imageCaption: 'Pronostics BTTS et Over 2.5 du jour basés sur un modèle statistique Poisson.' },
  { path: '/pronostics/aujourd-hui', priority: '0.9', changefreq: 'daily', lastmod: TODAY, image: false, imageTitle: '', imageCaption: '' },
  { path: '/historique', priority: '0.9', changefreq: 'daily', lastmod: TODAY, image: true, imageTitle: 'Historique vérifié — Nouveau suivi public', imageCaption: 'Nouveau suivi public des pronostics vérifiés BTTSPredict.' },
  { path: '/methodologie', priority: '0.85', changefreq: 'monthly', lastmod: TODAY, image: false, imageTitle: '', imageCaption: '' },
  { path: '/vip', priority: '0.85', changefreq: 'weekly', lastmod: TODAY, image: true, imageTitle: 'VIP BTTSPredict — Pronostics premium', imageCaption: 'Programme VIP BTTSPredict : pronostics premium et analyses détaillées.' },
  { path: '/resultats-verifies', priority: '0.7', changefreq: 'daily', lastmod: TODAY, image: false, imageTitle: '', imageCaption: '' },
  { path: '/btts-c-est-quoi', priority: '0.7', changefreq: 'monthly', lastmod: '2026-07-06', image: true, imageTitle: 'BTTS (Both Teams To Score) — Guide complet', imageCaption: 'Qu\'est-ce que le BTTS ? Guide explicatif avec FAQ et stratégies' },
  { path: '/code-promo-linebet-senegal', priority: '0.85', changefreq: 'weekly', lastmod: TODAY, image: true, imageTitle: 'Code promo Linebet Sénégal VISION221', imageCaption: 'Bonus Linebet Sénégal avec le code VISION221.' },
  { path: '/bonus-888starz', priority: '0.75', changefreq: 'weekly', lastmod: TODAY, image: true, imageTitle: 'Bonus 888starz — Code promo & inscription', imageCaption: 'Bonus exclusif 888starz avec code promo.' },
  { path: '/prediction-aviator', priority: '0.7', changefreq: 'monthly', lastmod: '2026-07-06', image: true, imageTitle: 'Aviator 2026 — Signaux (informatif)', imageCaption: 'Statistiques Aviator basées sur l\'algorithme Provably Fair. Informatif, non prédictif.' },
  { path: '/faille-fifa', priority: '0.7', changefreq: 'monthly', lastmod: '2026-07-06', image: true, imageTitle: 'Analyses de valeur FIFA (expérimental) Linebet', imageCaption: 'Détection des cotes erronées FIFA — analyses de valeur statistique.' },
  { path: '/equipe', priority: '0.5', changefreq: 'monthly', lastmod: '2026-06-01', image: false, imageTitle: '', imageCaption: '' },
  { path: '/presse', priority: '0.4', changefreq: 'monthly', lastmod: '2026-06-01', image: false, imageTitle: '', imageCaption: '' },
  { path: '/jouer-responsable', priority: '0.5', changefreq: 'yearly', lastmod: '2026-06-01' },
  { path: '/mentions-legales', priority: '0.3', changefreq: 'yearly', lastmod: '2026-06-01' },
  { path: '/cgu', priority: '0.3', changefreq: 'yearly', lastmod: '2026-06-01' },
  { path: '/politique-confidentialite', priority: '0.3', changefreq: 'yearly', lastmod: '2026-06-01' },
]

// ─── Blog articles ───
const BLOG_ARTICLES = [
  { slug: 'comment-analyser-match-btts', priority: '0.7', lastmod: '2026-06-01', title: 'Comment analyser un match pour le BTTS ? Guide complet 2026' },
  { slug: 'strategie-mise-over-2-5', priority: '0.7', lastmod: '2026-05-28', title: 'Stratégie de mise Over 2,5 : optimiser ses gains en 2026' },
  { slug: 'gestion-bankroll-paris-sportifs', priority: '0.7', lastmod: '2026-05-20', title: 'Gestion de bankroll aux paris sportifs : le guide ultime' },
  { slug: 'meilleurs-championnats-btts', priority: '0.7', lastmod: '2026-05-25', title: 'Les 10 meilleurs championnats pour les paris BTTS en 2026' },
  { slug: 'faille-fifa-linebet', priority: '0.9', lastmod: '2026-07-06', title: 'Faille FIFA Linebet : Cotes erronées détectées par IA' },
  { slug: 'guide-linebet-inscription', priority: '0.8', lastmod: '2026-05-15', title: 'Guide complet Linebet : inscription, dépôt et code promo VISION221' },
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

  // SEO / Landing pages
  for (const page of SEO_PAGES) {
    xml += `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="fr-SN" href="${SITE_URL}${page.path}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${page.path}"/>
`
    if (page.image) {
      xml += `    <image:image>
      <image:loc>${SITE_URL}/og-image.png</image:loc>
      <image:title>${escapeXml(page.imageTitle)}</image:title>
      <image:caption>${escapeXml(page.imageCaption)}</image:caption>
    </image:image>
`
    }
    xml += `  </url>\n\n`
  }

  // Blog index
  xml += `  <url>
    <loc>${SITE_URL}/blog</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="fr-SN" href="${SITE_URL}/blog"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/blog"/>
  </url>\n\n`

  // Blog articles
  for (const article of BLOG_ARTICLES) {
    xml += `  <url>
    <loc>${SITE_URL}/blog/${article.slug}</loc>
    <lastmod>${article.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${article.priority}</priority>
    <xhtml:link rel="alternate" hreflang="fr-SN" href="${SITE_URL}/blog/${article.slug}"/>
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

// ─── Write the file ───
const publicDir = path.join(__dirname, '..', 'public')
const outputPath = path.join(publicDir, 'sitemap.xml')

const sitemap = generateSitemap()
fs.writeFileSync(outputPath, sitemap, 'utf-8')

const totalPages = SEO_PAGES.length + 1 + BLOG_ARTICLES.length
console.log(`✅ sitemap.xml generated successfully!`)
console.log(`   📄 ${SEO_PAGES.length} SEO/landing pages`)
console.log(`   📝 ${BLOG_ARTICLES.length} blog articles`)
console.log(`   📊 ${totalPages} total URLs`)
console.log(`   📍 ${outputPath}`)
