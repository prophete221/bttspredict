import { motion } from 'framer-motion'
import { SITE } from '../../data/constants'
import TiltCard from '../TiltCard'

export default function LockedCoupons() {
  const coupons = [
    {
      title: 'BTTS Premium',
      subtitle: 'Les deux équipes marquent (BTTS)',
      color: 'emerald',
      matches: [
        { league: 'Premier League', match: 'Man City vs Chelsea', time: '15:30' },
        { league: 'La Liga', match: 'Real Madrid vs Atletico', time: '18:00' },
        { league: 'Serie A', match: 'Juventus vs AC Milan', time: '20:45' },
      ],
    },
    {
      title: 'Over 2,5 Premium',
      subtitle: 'Plus de 2,5 buts',
      color: 'gold',
      matches: [
        { league: 'Bundesliga', match: 'Bayern vs Dortmund', time: '15:30' },
        { league: 'Ligue 1', match: 'PSG vs Lyon', time: '21:00' },
        { league: 'Eredivisie', match: 'Ajax vs PSV', time: '18:45' },
      ],
    },
  ]

  return (
    <section id="vip" className="section-spacing px-4 bg-dark-800">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Pronostics <span className="text-gold">Premium</span>
          </h2>
          <p className="text-gray-400">Accédez aux pronostics VIP validés par notre IA via WhatsApp.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {coupons.map((coupon, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.95, rotateX: 8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ transformOrigin: 'center bottom' }}
            >
              <TiltCard maxTilt={5}>
                <div className="card-3d card relative overflow-hidden">
                  {/* Lock Overlay */}
                  <div className="absolute inset-0 bg-dark-900/70 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                    <div className="w-16 h-16 bg-dark-600 rounded-2xl flex items-center justify-center mb-4">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </div>
                    <p className="text-white font-bold text-lg mb-1">Pronostics Premium</p>
                    <p className="text-gray-400 text-sm mb-6">Rejoignez le groupe VIP WhatsApp pour débloquer</p>
                    <a
                      href={SITE.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 btn-emerald text-dark-900 font-bold rounded-xl hover:brightness-110 transition-all hover-lift"
                    >
                      Rejoindre le VIP
                    </a>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        coupon.color === 'emerald' ? 'bg-emerald/10 text-emerald' : 'bg-gold/10 text-gold'
                      }`}>
                        {coupon.color === 'emerald' ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">{coupon.title}</h3>
                        <p className="text-xs text-gray-500">{coupon.subtitle}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {coupon.matches.map((m, j) => (
                        <div key={j} className="bg-dark-900/50 rounded-lg p-3 flex items-center justify-between">
                          <div>
                            <div className="text-xs text-gray-500">{m.league}</div>
                            <div className="text-white font-medium text-sm">{m.match}</div>
                          </div>
                          <div className="text-gray-500 text-xs">{m.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
