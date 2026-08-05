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
      <footer ref={ref} id="faq" className="border-t pt-10 pb-20 sm:pb-8 px-4" style={{ borderColor: '#00C49A', backgroundColor: '#0D1117' }}>
        <div className="max-w-[440px] sm:max-w-2xl mx-auto">
          {/* Testimonials */}
          <motion.div variants={staggerContainer} initial="hidden" animate={isVisible ? 'visible' : 'hidden'} className="mb-6">
            <div className="text-center mb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#00C49A]">Ils utilisent BTTSPredict</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TESTIMONIALS.slice(0, 3).map((t) => (
                <motion.div key={t.name + t.city} variants={staggerChildFadeUp} className="rounded-xl p-4" style={{ backgroundColor: '#161B22', border: '1px solid rgba(240, 242, 245, 0.08)' }}>
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(0, 196, 154,0.1)', color: '#00C49A' }}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{t.name}</div>
                      <div className="text-[10px] text-[#A8B3C2]">{t.city} · Membre vérifié</div>
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
                <motion.div key={item.q} variants={fadeInUp} className="rounded-xl overflow-hidden" style={{ backgroundColor: '#161B22', border: '1px solid rgba(240, 242, 245, 0.08)' }}>
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
              <a key={link.label} href={link.href} className="text-center text-[10px] text-[#A8B3C2] hover:text-[#00C49A] transition-colors py-2">
                {link.label}
              </a>
            ))}
          </div>

          {/* Legal text */}
          <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: '#161B22' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#00C49A] font-extrabold text-xs">18+</span>
              <span className="text-[10px] text-[#A8B3C2]">| {LONASE.name} | Jeu responsable</span>
            </div>
            <p className="text-[10px] text-[#A8B3C2] leading-relaxed">
              <strong className="text-[#a0a0a0]">Avertissement :</strong> {LEGAL.disclaimer}
            </p>
          </div>

          {/* WhatsApp contact — numéro cliquable (signal de confiance humain) */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <a
              href="https://wa.me/15406704172"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
              style={{
                backgroundColor: 'rgba(0, 196, 154, 0.08)',
                color: '#00C49A',
                border: '1px solid rgba(0, 196, 154, 0.2)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp : +1 540 670 4172
            </a>
            <a
              href="mailto:support@bttspredict.com"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
              style={{
                backgroundColor: 'rgba(255, 215, 0, 0.08)',
                color: '#FFD700',
                border: '1px solid rgba(255, 215, 0, 0.2)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              support@bttspredict.com
            </a>
          </div>

          {/* Affiliation disclaimer */}
          <p className="text-center text-[10px] text-[#A8B3C2] mb-2 leading-relaxed">
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
