import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { BLOG_ARTICLES, SITE } from '../data/constants'

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tous')

  const categories = ['Tous', ...new Set(BLOG_ARTICLES.map((a) => a.category))]
  const filtered = selectedCategory === 'Tous'
    ? BLOG_ARTICLES
    : BLOG_ARTICLES.filter((a) => a.category === selectedCategory)

  return (
    <>
      <Helmet>
        <title>Blog & Stratégies BTTS, Over 2.5 | {SITE.name}</title>
        <meta name="description" content="Articles de fond sur les paris BTTS, Over 2.5, gestion de bankroll et stratégies avancées. Guides complets par l'IA BttsBet." />
        <link rel="canonical" href={`${SITE.url}/blog`} />
        <meta property="og:title" content={`Blog & Stratégies | ${SITE.name}`} />
        <meta property="og:description" content="Guides complets sur les paris BTTS, Over 2.5 et gestion de bankroll." />
        <meta property="og:url" content={`${SITE.url}/blog`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${SITE.url}/og-image.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Blog & Stratégies | ${SITE.name}`} />
        <meta name="twitter:description" content="Guides complets sur les paris BTTS, Over 2.5 et gestion de bankroll." />
        <meta name="twitter:image" content={`${SITE.url}/og-image.png`} />
      </Helmet>
    <div className="min-h-screen pt-8 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Blog & <span className="bg-gradient-to-r from-emerald to-gold bg-clip-text text-transparent">Stratégies</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Articles de fond sur les paris BTTS, Over 2.5, gestion de bankroll et stratégies avancées pour maximiser vos gains.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-emerald to-gold text-dark-900'
                  : 'glass text-gray-300 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                to={`/blog/${article.slug}`}
                className="glass rounded-2xl overflow-hidden hover:bg-white/[0.07] transition-all group block"
              >
                {/* Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-dark-700 to-dark-600 flex items-center justify-center">
                  <span className="text-5xl">{article.image}</span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs text-gold font-semibold uppercase tracking-wider">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{article.readTime} de lecture</span>
                  </div>

                  <h2 className="text-lg font-bold text-white mb-3 group-hover:text-emerald transition-colors leading-snug">
                    {article.title}
                  </h2>

                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="mt-4 text-xs text-gray-500">{article.date}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    </>
  )
}
