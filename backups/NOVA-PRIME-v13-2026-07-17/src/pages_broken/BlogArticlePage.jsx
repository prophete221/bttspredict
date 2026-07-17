import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { BLOG_ARTICLES, AFFILIATE, SITE } from '../data/constants'
import BlogContent from '../components/BlogContent'

export default function BlogArticlePage() {
  const { slug } = useParams()
  const article = BLOG_ARTICLES.find((a) => a.slug === slug)

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-4">Article non trouvé</h1>
          <p className="text-gray-400 mb-6">L'article que vous recherchez n'existe pas.</p>
          <Link to="/blog" className="px-6 py-3 bg-emerald text-dark-900 font-bold rounded-full hover:bg-emerald/90 transition-colors">
            ← Retour au blog
          </Link>
        </div>
      </div>
    )
  }

  const relatedArticles = BLOG_ARTICLES.filter((a) => a.id !== article.id).slice(0, 3)

  return (
    <>
      <Helmet>
        <title>{article.title} | {SITE.name}</title>
        <meta name="description" content={article.metaDescription} />
        <link rel="canonical" href={`${SITE.url}/blog/${article.slug}`} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${SITE.url}/blog/${article.slug}`} />
        <meta property="og:image" content={`${SITE.url}/og-image.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="article:published_time" content={article.date} />
        <meta property="article:modified_time" content={article.date} />
        <meta property="article:section" content={article.category} />
        <meta property="article:author" content={SITE.name} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.excerpt} />
        <meta name="twitter:image" content={`${SITE.url}/og-image.png`} />
        {/* BlogPosting Schema — per-page structured data */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": article.title,
          "description": article.metaDescription,
          "datePublished": article.date,
          "dateModified": article.date,
          "author": { "@type": "Organization", "name": "BttsBet" },
          "publisher": { "@type": "Organization", "name": "BttsBet", "logo": { "@type": "ImageObject", "url": `${SITE.url}/logo.png` } },
          "url": `${SITE.url}/blog/${article.slug}`,
          "mainEntityOfPage": `${SITE.url}/blog/${article.slug}`,
          "inLanguage": "fr",
          "articleSection": article.category
        })}</script>
        {/* BreadcrumbList Schema */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Accueil", "item": SITE.url },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${SITE.url}/blog` },
            { "@type": "ListItem", "position": 3, "name": article.title, "item": `${SITE.url}/blog/${article.slug}` }
          ]
        })}</script>
      </Helmet>

      <div className="min-h-screen pt-8 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-sm text-gray-500"
          >
            <Link to="/" className="hover:text-emerald transition-colors">Accueil</Link>
            <span className="mx-2">/</span>
            <Link to="/blog" className="hover:text-emerald transition-colors">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">{article.category}</span>
          </motion.nav>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs text-gold font-semibold uppercase tracking-wider px-3 py-1 glass rounded-full">
                {article.category}
              </span>
              <span className="text-xs text-gray-500">{article.readTime} de lecture</span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">{article.date}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
              {article.title}
            </h1>

            <p className="text-lg text-gray-400 leading-relaxed">
              {article.excerpt}
            </p>
          </motion.div>

          {/* Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-64 sm:h-80 bg-gradient-to-br from-dark-700 via-dark-600 to-dark-700 rounded-2xl flex items-center justify-center mb-10 glass"
          >
            <span className="text-7xl">{article.image}</span>
          </motion.div>

          {/* Article Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="prose-dark mb-16"
          >
            <BlogContent html={article.content} />
          </motion.article>

          {/* CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass neon-border rounded-2xl p-8 text-center mb-16"
          >
            <h3 className="text-xl font-bold text-white mb-3">
              Prêt à utiliser nos pronostics IA ?
            </h3>
            <p className="text-gray-400 mb-6">
              Code promo <span className="text-emerald font-bold">{SITE.promoCode}</span> — Bonus exclusif Linebet
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={AFFILIATE.linebet}
                rel={AFFILIATE.rel}
                target="_blank"
                className="px-8 py-3 bg-gradient-to-r from-emerald to-gold text-dark-900 font-bold rounded-full hover:shadow-lg hover:shadow-emerald/30 transition-all"
              >
                Réclamer le Bonus
              </a>
              <Link
                to="/"
                onClick={() => { setTimeout(() => document.getElementById('free-predictions')?.scrollIntoView({ behavior: 'smooth' }), 300) }}
                className="px-8 py-3 glass text-emerald font-bold rounded-full hover:bg-emerald/10 transition-all"
              >
                Voir les Pronostics
              </Link>
            </div>
          </motion.div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div>
              <h3 className="text-2xl font-black text-white mb-6">Articles similaires</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.id}
                    to={`/blog/${related.slug}`}
                    className="glass rounded-xl p-5 hover:bg-white/[0.07] transition-colors group"
                  >
                    <span className="text-xs text-gold font-semibold uppercase tracking-wider">
                      {related.category}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-2 group-hover:text-emerald transition-colors leading-snug">
                      {related.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
