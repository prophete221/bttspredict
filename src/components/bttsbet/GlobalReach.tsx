'use client'

import { motion } from 'framer-motion'

/**
 * GlobalReach — Section "Portée mondiale, racines panafricaines"
 * Deux sous-blocs :
 *  - Monde : parieurs dans pays où Linebet est disponible
 *  - Afrique de l'Ouest : focus Sénégal, CI, Mali, BF, Cameroun, Nigeria, France
 */
const GLOBAL_STATS = [
  { value: '13 000+', label: 'Parieurs actifs' },
  { value: '50+', label: 'Championnats couverts' },
  { value: '4', label: 'Continents' },
  { value: '4,2/5', label: 'Note moyenne (2 437 avis)' },
]

const REGIONS = [
  { name: 'Europe de l\'Est', countries: 'Russie, Ukraine, Pologne, Roumanie, Bulgarie', icon: '🌍' },
  { name: 'Afrique', countries: 'Sénégal, Côte d\'Ivoire, Mali, Burkina Faso, Cameroun, Nigeria', icon: '🌍' },
  { name: 'Amérique latine', countries: 'Brésil, Argentine, Colombie, Mexique, Pérou', icon: '🌍' },
  { name: 'Asie', countries: 'Inde, Bangladesh, Pakistan, Indonésie, Philippines', icon: '🌍' },
]

const PANAFRICAN_PRESENCE = [
  { country: 'Sénégal', city: 'Dakar', flag: '🇸🇳', users: '3 200+' },
  { country: 'Côte d\'Ivoire', city: 'Abidjan', flag: '🇨🇮', users: '2 100+' },
  { country: 'Mali', city: 'Bamako', flag: '🇲🇱', users: '1 800+' },
  { country: 'Burkina Faso', city: 'Ouagadougou', flag: '🇧🇫', users: '1 500+' },
  { country: 'Cameroun', city: 'Douala', flag: '🇨🇲', users: '1 900+' },
  { country: 'Nigeria', city: 'Lagos', flag: '🇳🇬', users: '1 600+' },
  { country: 'France', city: 'Paris', flag: '🇫🇷', users: '900+' },
]

export default function GlobalReach() {
  return (
    <section id="global-reach" className="py-12 sm:py-16 px-4" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="eyebrow">🌍 Présence internationale</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-papier mt-3 mb-3">
            Portée mondiale, <span className="text-emerald">racines panafricaines</span>
          </h2>
          <p className="text-cendre text-sm max-w-md mx-auto">
            BTTSPredict accompagne les parieurs dans tous les pays où Linebet et 888starz sont accessibles légalement.
          </p>
        </div>

        {/* Stats globales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          {GLOBAL_STATS.map((stat, i) => (
            <div
              key={i}
              className="text-center p-4 rounded-xl"
              style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(22, 199, 163, 0.08)' }}
            >
              <div className="text-2xl font-bold" style={{ color: '#16C7A3' }}>{stat.value}</div>
              <div className="text-[10px] text-cendre mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Bloc Monde — régions Linebet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <h3 className="text-xl font-bold text-papier mb-4 flex items-center gap-2">
            <span style={{ color: '#16C7A3' }}>🌐</span>
            Disponible dans le monde entier
          </h3>
          <p className="text-cendre text-xs mb-4 leading-relaxed">
            BTTSPredict est accessible à tous les parieurs résidant dans les pays où Linebet et 888starz sont légalement disponibles. Notre plateforme couvre 4 continents et 50+ championnats.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {REGIONS.map((region, i) => (
              <div
                key={i}
                className="p-4 rounded-lg"
                style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid #0F172A' }}
              >
                <div className="text-sm font-bold text-papier mb-1">{region.name}</div>
                <div className="text-[11px] text-cendre leading-relaxed">{region.countries}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bloc Afrique de l'Ouest — focus panafricain */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-papier mb-4 flex items-center gap-2">
            <span style={{ color: '#16C7A3' }}>🌍</span>
            Présence panafricaine
          </h3>
          <p className="text-cendre text-xs mb-4 leading-relaxed">
            BTTSPredict a été fondé avec une mission panafricaine : démocratiser l&apos;accès à des pronostics football transparents et fiables pour les parieurs d&apos;Afrique de l&apos;Ouest et centrale.
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {PANAFRICAN_PRESENCE.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid #0F172A' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.flag}</span>
                  <div>
                    <div className="text-sm font-semibold text-papier">{item.country}</div>
                    <div className="text-[10px] text-cendre">{item.city}</div>
                  </div>
                </div>
                <div className="text-xs font-bold" style={{ color: '#16C7A3' }}>{item.users}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Vision roadmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 p-5 rounded-xl text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(22, 199, 163, 0.05), rgba(22, 199, 163, 0.05))',
            border: '1px solid rgba(22, 199, 163, 0.15)',
          }}
        >
          <div className="text-2xl mb-2">🎯</div>
          <h3 className="text-papier font-bold text-base mb-2">Notre vision</h3>
          <p className="text-cendre text-xs leading-relaxed max-w-sm mx-auto">
            Devenir la référence mondiale du pari sportif IA sur BTTS et Over 2.5, en imposant un standard de transparence inégalé dans l&apos;industrie.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
