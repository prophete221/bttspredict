import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { WHY_LINEBET, TESTIMONIALS, SEO_BLOCK, AFFILIATE, SITE, HOW_IT_WORKS } from '../data/constants'
import { useScrollAnimation, use3DScrollEntrance } from '../hooks/useAnimations'
import TiltCard from './TiltCard'

// ─── SVG Icons ───
const icons = {
  target: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  chart: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>
    </svg>
  ),
  globe: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
    </svg>
  ),
  gift: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>
    </svg>
  ),
  cash: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>
    </svg>
  ),
  phone: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  ),
  live: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>
    </svg>
  ),
  bolt: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  scan: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/>
    </svg>
  ),
  filter: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  bet: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
    </svg>
  ),
  check: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
}

// ─── Animated Counter Hook ───
function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) { setCount(0); return }
    let startTime = null
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [target, duration, start])
  return count
}

// ─── Stats Section ───
export function StatsSection() {
  const [ref, isVisible] = useScrollAnimation()

  const precisionCount = useCountUp(78, 2200, isVisible)
  const predictionsCount = useCountUp(15000, 2500, isVisible)
  const championnatsCount = useCountUp(50, 2000, isVisible)

  const stats = [
    { animatedValue: `~${precisionCount}%`, label: 'Précision historique', desc: 'Sur plus de 15 000 pronostics analysés', icon: 'check', color: 'emerald' },
    { animatedValue: `${predictionsCount.toLocaleString()}+`, label: 'Pronostics analysés', desc: 'Base de données en croissance continue', icon: 'chart', color: 'emerald' },
    { animatedValue: `${championnatsCount}+`, label: 'Championnats couverts', desc: 'Europe, Afrique, Amérique et Asie', icon: 'globe', color: 'emerald' },
  ]

  return (
    <section ref={ref} className="section-spacing px-4 bg-dark-800">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: 6 }}
          animate={isVisible ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ transformOrigin: 'center bottom' }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Des résultats <span className="text-emerald neon-glow">vérifiables</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">Notre IA fournit des résultats transparents basés sur des données historiques vérifiables.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ transformOrigin: 'center bottom' }}
            >
              <TiltCard className="h-full">
                <div className="card card-3d p-6 text-center h-full stat-card-animated">
                  <div className="w-14 h-14 bg-emerald/10 rounded-2xl flex items-center justify-center text-emerald mx-auto mb-4">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={isVisible ? { scale: 1, rotate: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.15, type: 'spring', stiffness: 200 }}
                    >
                      {icons[stat.icon]}
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.15 }}
                    className="text-3xl font-extrabold text-white mb-1 stat-value-animated"
                  >
                    {stat.animatedValue}
                  </motion.div>
                  <div className="text-white font-semibold text-sm mb-1">{stat.label}</div>
                  <div className="text-gray-500 text-xs">{stat.desc}</div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Promo Code + Bonus - Animated Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ transformOrigin: 'center bottom' }}
        >
          <div className="card card-3d p-5 sm:p-6 stat-card-animated overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold flex-shrink-0">
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={isVisible ? { scale: 1, rotate: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.8, type: 'spring', stiffness: 200 }}
                  >
                    {icons.gift}
                  </motion.div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Code promo exclusif</div>
                  <div className="font-bold text-xl tracking-wider promo-code-shimmer">VISION221</div>
                </div>
              </div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={isVisible ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 1.0, type: 'spring', stiffness: 150 }}
                className="flex items-center gap-3"
              >
                <div className="text-right">
                  <div className="text-emerald font-extrabold text-2xl">150$</div>
                  <div className="text-gray-500 text-xs">Bonus Linebet</div>
                </div>
                <motion.div
                  animate={isVisible ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── How It Works ───
export function HowItWorks() {
  const [ref, isVisible] = useScrollAnimation()

  const stepIcons = ['scan', 'filter', 'bet']

  return (
    <section ref={ref} className="section-spacing px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: 6 }}
          animate={isVisible ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ transformOrigin: 'center bottom' }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Comment ça <span className="text-emerald">marche</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">De l'analyse IA à votre pari en 3 étapes simples.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {HOW_IT_WORKS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.95, rotateX: 8 }}
              animate={isVisible ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ transformOrigin: 'center bottom' }}
            >
              <TiltCard className="h-full">
                <div className="relative card card-3d p-6 text-center h-full">
                  {/* Step Number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-emerald to-emerald-dark text-dark-900 rounded-lg flex items-center justify-center text-xs font-extrabold shadow-lg shadow-emerald/25">
                    {step.step}
                  </div>

                  <div className="w-16 h-16 bg-emerald/10 rounded-2xl flex items-center justify-center text-emerald mx-auto mb-5">
                    {icons[stepIcons[i]]}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>

                  {/* Connector line (desktop only) */}
                  {i < 2 && (
                    <div className="hidden sm:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-dark-600" />
                  )}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Why Linebet ───
export function WhyLinebet() {
  const [ref, isVisible] = useScrollAnimation()

  const linebetIcons = ['gift', 'chart', 'cash', 'phone', 'live', 'bolt']

  return (
    <section ref={ref} className="section-spacing px-4 bg-dark-800">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: 6 }}
          animate={isVisible ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ transformOrigin: 'center bottom' }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Pourquoi <span className="text-gold">Linebet</span> ?
          </h2>
          <p className="text-gray-400">Une plateforme recommandée pour parier avec nos pronostics.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHY_LINEBET.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.95, rotateX: 8 }}
              animate={isVisible ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ transformOrigin: 'center bottom' }}
            >
              <TiltCard className="h-full">
                <div className="card card-3d p-5 h-full">
                  <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold mb-4">
                    {icons[item.icon]}
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href={AFFILIATE.linebet}
            rel={AFFILIATE.rel}
            target="_blank"
            className="inline-block px-8 py-4 bg-gradient-to-r from-gold to-gold-dark text-dark-900 font-bold rounded-xl hover:shadow-lg hover:shadow-gold/30 btn-gold transition-all hover:brightness-110 hover-lift"
          >
            S'inscrire avec le code {SITE.promoCode}
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ───
export function Testimonials() {
  const [ref, isVisible] = useScrollAnimation()

  return (
    <section ref={ref} className="section-spacing px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: 6 }}
          animate={isVisible ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ transformOrigin: 'center bottom' }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ce que disent nos <span className="text-emerald">utilisateurs</span>
          </h2>
          {/* Follower counter */}
          <div className="inline-flex items-center gap-2 bg-emerald/10 border border-emerald/20 rounded-full px-4 py-1.5 mt-2">
            <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse" />
            <span className="text-xs text-emerald font-medium">2 400+ parieurs suivent BttsBet ce mois-ci</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.95, rotateX: 8 }}
              animate={isVisible ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ transformOrigin: 'center bottom' }}
            >
              <TiltCard className="h-full">
                <div className="card card-3d p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    {/* Avatar with initials */}
                    <div className="w-10 h-10 bg-emerald/15 rounded-full flex items-center justify-center text-emerald text-sm font-bold flex-shrink-0">
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{t.name}</div>
                      <div className="text-gray-500 text-xs">{t.city}</div>
                    </div>
                    <div className="ml-auto flex items-center gap-0.5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <span key={j} className="text-gold text-xs">★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">"{t.text}"</p>
                  <div className="text-gray-600 text-[10px] mt-3 italic">Témoignage utilisateur — résultats individuels, non garantis</div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Blog Preview (Cards) ───
export function BlogSection() {
  const [ref, isVisible] = useScrollAnimation()

  return (
    <section ref={ref} id="blog" className="section-spacing px-4 bg-dark-800">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: 6 }}
          animate={isVisible ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ transformOrigin: 'center bottom' }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Blog & <span className="text-gold">Stratégies</span>
          </h2>
          <p className="text-gray-400">Articles de fond pour améliorer vos paris sportifs.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              slug: 'comment-analyser-match-btts',
              title: 'Comment analyser un match pour le BTTS ?',
              excerpt: 'Découvrez les critères essentiels pour identifier les meilleures opportunités BTTS.',
              category: 'Stratégie',
              icon: '📊',
            },
            {
              slug: 'strategie-mise-over-2-5',
              title: 'Stratégie de mise Over 2,5 : optimiser ses gains',
              excerpt: 'Maîtrisez la gestion de bankroll et les techniques avancées pour l\'Over 2.5.',
              category: 'Stratégie',
              icon: '🎯',
            },
            {
              slug: 'gestion-bankroll-paris-sportifs',
              title: 'Gestion de bankroll : le guide ultime',
              excerpt: 'Apprenez à gérer votre capital comme un professionnel des paris sportifs.',
              category: 'Formation',
              icon: '💰',
            },
          ].map((article, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.95, rotateX: 8 }}
              animate={isVisible ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ transformOrigin: 'center bottom' }}
            >
              <TiltCard className="h-full">
                <a
                  href={`/blog/${article.slug}`}
                  className="card card-3d p-6 group block h-full"
                >
                  <div className="text-3xl mb-4">{article.icon}</div>
                  <span className="text-xs text-gold font-semibold uppercase tracking-wider">
                    {article.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2 mb-3 group-hover:text-emerald transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{article.excerpt}</p>
                </a>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/5 transition-all text-sm hover-lift"
          >
            Voir tous les articles →
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── SEO Block ───
export function SeoBlock() {
  const [ref, isVisible] = useScrollAnimation()

  return (
    <section ref={ref} className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, rotateX: 4 }}
          animate={isVisible ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ transformOrigin: 'center bottom' }}
          className="prose-dark"
        >
          <h2 className="text-2xl font-extrabold text-emerald mb-6">{SEO_BLOCK.title}</h2>
          {SEO_BLOCK.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
