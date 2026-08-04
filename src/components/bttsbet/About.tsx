'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useAnimations'
import { staggerContainer, staggerChildFadeUp } from '@/lib/motionPresets'

const STATS = [
  { value: '2 437+', label: 'Parieurs actifs', icon: '👥' },
  { value: '7', label: 'Pays principaux', icon: '🌍' },
  { value: '2026', label: 'Année de création', icon: '🚀' },
  { value: '50 000+', label: 'Matchs analysés', icon: '📊' },
]

const COUNTRIES = [
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳' },
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
]

const ROADMAP = [
  {
    quarter: 'Q4 2026',
    title: 'Application mobile native',
    description: 'App iOS + Android avec notifications push pour les pronostics en direct et lancement des matchs.',
    status: 'in-progress',
  },
  {
    quarter: 'Q1 2027',
    title: 'API data pour tipsters',
    description: 'API publique pour permettre aux tipsters et développeurs tiers d\'intégrer nos pronostics IA dans leurs propres applications.',
    status: 'planned',
  },
  {
    quarter: 'Q2 2027',
    title: 'Nouveaux bookmakers africains',
    description: 'Intégration avec les principaux bookmakers locaux africains au-delà de Linebet et 888starz.',
    status: 'planned',
  },
  {
    quarter: 'Q3 2027',
    title: 'Espace membre premium',
    description: 'Dashboard personnalisé avec historique complet, suivi de bankroll, et alertes value bet personnalisées.',
    status: 'planned',
  },
]

const STATUS_LABELS = {
  'in-progress': { label: 'En cours', class: 'badge-mint' },
  'planned': { label: 'Planifié', class: 'badge-neutral' },
}

export default function About() {
  const [ref, isVisible] = useScrollAnimation()

  return (
    <section ref={ref} id="about" className="section-pad overflow-x-hidden">
      <div className="max-w-[440px] sm:max-w-2xl mx-auto">
        {/* ── ABOUT ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="eyebrow">À propos</span>
          <h2 className="section-title mt-3 mb-4">
            Le moteur de décision IA
            <br />
            des parieurs <span className="text-success">pros africains</span>
          </h2>
          <p className="section-subtitle max-w-[440px] sm:max-w-2xl mx-auto">
            BttsBet n'est pas un site affilié de plus. C'est une plateforme produit qui connecte
            les parieurs sérieux — au Sénégal, en Côte d'Ivoire, au Mali et au-delà — aux
            meilleurs bookmakers (Linebet, 888starz) via des pronostics IA transparents et fiables.
          </p>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12"
        >
          {STATS.map((stat, i) => (
            <motion.div key={stat.label} variants={staggerChildFadeUp} className="stat-tile">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">{stat.value}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-medium mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Countries */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="squircle-lg p-6 mb-12"
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h3 className="text-lg font-bold text-white">Présence panafricaine</h3>
            <span className="text-xs text-gray-500">{COUNTRIES.length} pays · expansion continue</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map(country => (
              <div key={country.code} className="flag-chip">
                <span className="text-base">{country.flag}</span>
                <span>{country.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── ROADMAP ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="eyebrow">Roadmap</span>
          <h2 className="section-title mt-3 mb-4">
            Les prochaines <span className="text-success">étapes</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Notre vision à long terme : devenir la référence du pari sportif IA en Afrique.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 gap-4"
        >
          {ROADMAP.map((item, i) => {
            const status = STATUS_LABELS[item.status as keyof typeof STATUS_LABELS]
            return (
              <motion.div
                key={item.title}
                variants={staggerChildFadeUp}
                className="squircle p-5 hover:border-success/30 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <span className="text-[10px] font-mono text-success font-bold uppercase tracking-widest">
                      {item.quarter}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">{item.title}</h3>
                  </div>
                  <span className={`badge ${status.class} text-[9px]`}>{status.label}</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
