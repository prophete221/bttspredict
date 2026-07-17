import { motion } from 'framer-motion'
import { SITE, AFFILIATE } from '../data/constants'
import { useScrollAnimation } from '../hooks/useAnimations'
import TiltCard from './TiltCard'

export default function PromoBanner() {
  const [ref, isVisible] = useScrollAnimation()

  return (
    <section ref={ref} id="bonus" className="section-spacing px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95, rotateX: 8 }}
          animate={isVisible ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ transformOrigin: 'center bottom' }}
        >
          <TiltCard maxTilt={5}>
            <div className="card-3d card-shadow p-8 sm:p-10 relative overflow-hidden rounded-xl bg-dark-700 border border-dark-600">
              {/* Accent line top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald via-gold to-emerald" />

              <div className="text-center">
                {/* Logo placeholder */}
                <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>
                  </svg>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                  Bonus Exclusif Linebet
                </h2>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Inscrivez-vous avec le code promo{' '}
                  <span className="text-gold font-bold">{SITE.promoCode}</span>
                  {' '}et recevez jusqu'à <span className="text-emerald font-bold">150$</span> sur le premier dépôt
                </p>

                {/* Promo code display */}
                <div className="inline-flex items-center gap-3 bg-dark-900/60 border border-dark-600 rounded-xl px-6 py-3 mb-6 glass-3d">
                  <span className="text-xs text-gray-500">Code :</span>
                  <span className="text-gold font-mono font-bold text-xl tracking-widest animate-pulse-neon">{SITE.promoCode}</span>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4">
                  <a
                    href={AFFILIATE.linebet}
                    rel={AFFILIATE.rel}
                    target="_blank"
                    className="px-8 py-4 btn-emerald text-dark-900 font-bold rounded-xl text-base hover:shadow-lg hover:shadow-emerald/30 transition-all hover:brightness-110 w-full sm:w-auto hover-lift"
                  >
                    S'inscrire sur Linebet
                  </a>
                  <a
                    href={AFFILIATE.linebetDownload}
                    rel={AFFILIATE.rel}
                    target="_blank"
                    className="px-8 py-4 border border-white/10 text-white font-semibold rounded-xl text-base hover:bg-white/5 transition-all w-full sm:w-auto"
                  >
                    Télécharger l'App
                  </a>
                </div>

                <p className="text-xs text-gray-600">
                  Bonus soumis aux conditions de mise (mise x5, cote minimale 1,40). Offre limitée dans le temps.
                </p>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  )
}
