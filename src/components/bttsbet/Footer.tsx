'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SITE, AFFILIATE, LEGAL, FAQ_ITEMS, TESTIMONIALS, SOCIAL_PROOF, LONASE } from '@/lib/constants'
import { useScrollAnimation } from '@/hooks/useAnimations'
import { staggerContainer, staggerChildFadeUp, fadeInUp } from '@/lib/motionPresets'

export default function Footer() {
  const [ref, isVisible] = useScrollAnimation()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      <footer ref={ref} id="faq" className="border-t pt-10 pb-20 sm:pb-8 px-4" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
        <div className="max-w-[440px] sm:max-w-2xl mx-auto">
          {/* Testimonials */}
          <motion.div variants={staggerContainer} initial="hidden" animate={isVisible ? 'visible' : 'hidden'} className="mb-6">
            <div className="text-center mb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#10B981]">Ils utilisent BTTSPredict</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TESTIMONIALS.slice(0, 3).map((t) => (
                <motion.div key={t.name + t.city} variants={staggerChildFadeUp} className="rounded-xl p-4" style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(59, 130, 246,0.1)', color: '#10B981' }}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{t.name}</div>
                      <div className="text-[10px] text-[#5a5a5a]">{t.city} · Membre vérifié</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#a0a0a0] italic leading-relaxed">« {t.text} »</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div variants={staggerContainer} initial="hidden" animate={isVisible ? 'visible' : 'hidden'} className="mb-6">
            <div className="text-center mb-3">
              <h3 className="text-sm font-bold text-white">Questions fréquentes</h3>
            </div>
            <div className="space-y-2">
              {FAQ_ITEMS.slice(0, 4).map((item, i) => (
                <motion.div key={item.q} variants={fadeInUp} className="rounded-xl overflow-hidden" style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i} className="w-full text-left px-4 py-3 text-xs font-semibold text-white">
                    {item.q}
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-3 text-[11px] text-[#a0a0a0] leading-relaxed">{item.a}</div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Legal links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {[
              { label: 'CGU', href: '/cgu' },
              { label: 'Mentions légales', href: '/mentions-legales' },
              { label: 'Confidentialité', href: '/politique-confidentialite' },
              { label: 'Jouer responsable', href: 'https://www.begambleaware.org/' },
            ].map(link => (
              <a key={link.label} href={link.href} className="text-center text-[10px] text-[#5a5a5a] hover:text-[#10B981] transition-colors py-2">
                {link.label}
              </a>
            ))}
          </div>

          {/* Legal text */}
          <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: '#0F172A' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#10B981] font-extrabold text-xs">18+</span>
              <span className="text-[10px] text-[#5a5a5a]">| {LONASE.name} | Jeu responsable</span>
            </div>
            <p className="text-[10px] text-[#5a5a5a] leading-relaxed">
              <strong className="text-[#a0a0a0]">Avertissement :</strong> {LEGAL.disclaimer}
            </p>
          </div>

          {/* Affiliation disclaimer */}
          <p className="text-center text-[10px] text-[#5a5a5a] mb-2 leading-relaxed">
            Liens d'affiliation — BTTSPredict est un site informatif indépendant, nous ne prenons pas de paris.
            Les liens vers les bookmakers partenaires sont des liens d'affiliation rémunérés.
            BTTSPredict n'est pas affilié à, ni exploité par, les sociétés de paris mentionnées.
          </p>

          <div className="text-center text-[10px] text-[#3a3a3a]">
            {LEGAL.copyright}
          </div>
        </div>
      </footer>
    </>
  )
}
