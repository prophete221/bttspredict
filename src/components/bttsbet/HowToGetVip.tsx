'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AFFILIATE, SITE } from '@/lib/constants'

/**
 * HowToGetVip — Section "Comment obtenir le VIP" en 4 étapes claires
 * + Mini FAQ VIP + bouton "Essai VIP 1 jour"
 */
const STEPS = [
  {
    num: '1',
    title: "Inscris-toi sur Linebet ou 888starz",
    desc: "Crée ton compte avec le code promo VISION221 pour débloquer le bonus de 90 000 XOF (150$).",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    cta: { label: "S'inscrire sur Linebet", href: AFFILIATE.linebet, color: 'emerald' as const },
  },
  {
    num: '2',
    title: 'Effectue ton dépôt selon le niveau VIP',
    desc: "Le dépôt minimum sur Linebet est de 200 XOF. Pour activer le VIP BTTSPredict : Silver = 3 000 XOF, Gold = 6 000 XOF, Elite = 12 000 XOF, Tous = 12 000 XOF (1 mois). Dépose via Wave, Orange Money, Free Money ou carte bancaire.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    num: '3',
    title: 'Envoie ta preuve via WhatsApp',
    desc: "Envoie une capture d'écran de ton inscription + dépôt au +1 540 670 4172. Notre équipe vérifie ton compte.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    cta: { label: 'WhatsApp Support', href: 'https://wa.me/15406704172', color: 'emerald' as const },
  },
  {
    num: '4',
    title: 'VIP activé en moins de 30 minutes',
    desc: "Ton accès VIP est activé manuellement par notre équipe. Tu reçois confirmation par WhatsApp et tu accèdes aux pronostics premium immédiatement.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
]

const VIP_FAQ = [
  {
    q: "Quelle est la durée d'accès VIP ?",
    a: "L'accès VIP est valable 30 jours à partir de l'activation. Tu peux le renouveler en gardant ton compte Linebet/888starz actif avec le code VISION221.",
  },
  {
    q: "Qu'est-ce qui est inclus dans le VIP ?",
    a: "Accès à 20+ pronostics premium par jour (BTTS, Over 2.5, value bets FIFA), historique complet, cotes détaillées, et support WhatsApp prioritaire 24/7.",
  },
  {
    q: "Quels sports sont couverts par le VIP ?",
    a: "6 sports : Football (BTTS + Over 2.5), Tennis (ATP/WTA/Grand Chelem), NBA, NFL, UFC/MMA, et Handball. Taux de réussite 69-81% selon le sport.",
  },
  {
    q: "Combien de pronostics VIP par jour ?",
    a: "20 à 30 pronostics premium par jour selon le calendrier sportif, contre 6 pronostics gratuits. Tous validés manuellement par notre équipe d'analystes.",
  },
  {
    q: "Le VIP est-il garanti ?",
    a: "Non. Aucun résultat n'est garanti — les paris sportifs comportent des risques. Notre taux VIP (69-81%) reflète nos performances passées vérifiables, pas une garantie future.",
  },
]

export default function HowToGetVip() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <section id="how-to-get-vip" className="py-12 sm:py-16 px-4" style={{ background: 'rgba(12, 12, 16, 0.4)' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="eyebrow">🔓 Accès VIP</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-3">
            Comment <span className="text-gold">obtenir le VIP</span> ?
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            4 étapes simples pour débloquer 20+ pronostics premium par jour. Activation en moins de 30 minutes.
          </p>
          {/* Badge portée mondiale */}
          <div
            className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-[11px]"
            style={{
              background: 'rgba(168, 162, 158, 0.06)',
              border: '1px solid rgba(168, 162, 158, 0.20)',
              color: '#A8A29E',
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            Disponible dans tous les pays où Linebet et 888starz sont accessibles légalement
          </div>
        </div>

        {/* 4 étapes */}
        <div className="space-y-3 mb-10">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex gap-4 p-4 rounded-xl"
              style={{ background: 'rgba(12, 12, 16, 0.6)', border: '1px solid rgba(168, 162, 158, 0.08)' }}
            >
              {/* Numéro + icône */}
              <div className="flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
                  style={{
                    background: 'linear-gradient(135deg, #A8A29E, #C4BFBB)',
                    color: '#050507',
                  }}
                >
                  {step.num}
                </div>
              </div>

              {/* Contenu */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ color: '#A8A29E' }}>{step.icon}</span>
                  <h3 className="text-white font-bold text-sm sm:text-base">{step.title}</h3>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
                {step.cta && (
                  <a
                    href={step.cta.href}
                    target={step.cta.href.startsWith('http') ? '_blank' : undefined}
                    rel="sponsored noopener"
                    className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                    style={{
                      background: step.cta.color === 'emerald'
                        ? 'linear-gradient(135deg, #A8A29E, #1F8A70)'
                        : '#A8A29E',
                      color: '#050507',
                    }}
                  >
                    {step.cta.label} →
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bouton Essai VIP 1 jour */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-10 p-5 rounded-xl text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(168, 162, 158, 0.08), rgba(168, 162, 158, 0.08))',
            border: '1px solid rgba(168, 162, 158, 0.25)',
          }}
        >
          <div className="text-2xl mb-2">⏱️</div>
          <h3 className="text-white font-bold text-lg mb-1">Essai VIP 1 jour</h3>
          <p className="text-gray-400 text-xs mb-4 max-w-sm mx-auto">
            Pas sûr ? Teste l'accès VIP pendant 24h avec 5 pronostics premium. Aucun engagement.
          </p>
          <a
            href="https://wa.me/15406704172?text=Bonjour%20BTTSPredict%2C%20je%20souhaite%20tester%20l%27essai%20VIP%201%20jour"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all"
            style={{
              background: 'linear-gradient(135deg, #A8A29E, #D94F30)',
              color: '#050507',
              boxShadow: '0 4px 20px rgba(168, 162, 158, 0.3)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
            </svg>
            Demander l'essai VIP gratuit
          </a>
        </motion.div>

        {/* Mini FAQ VIP */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 text-center">FAQ VIP — Questions fréquentes</h3>
          <div className="space-y-2">
            {VIP_FAQ.map((item, i) => (
              <div
                key={i}
                className="rounded-lg overflow-hidden"
                style={{ background: 'rgba(12, 12, 16, 0.6)', border: '1px solid #0C0C10' }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="text-white text-sm font-medium pr-3">{item.q}</span>
                  <span
                    className="flex-shrink-0 transition-transform"
                    style={{
                      transform: openFaq === i ? 'rotate(180deg)' : 'none',
                      color: '#A8A29E',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-4 pb-4"
                  >
                    <p className="text-gray-400 text-xs leading-relaxed">{item.a}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
