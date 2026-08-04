'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE, AFFILIATE, LEGAL, FAQ_ITEMS, ANDROID_LOGO, TESTIMONIALS, SOCIAL_PROOF, PAYMENT_METHODS, LONASE } from '@/lib/constants'
import { useScrollAnimation } from '@/hooks/useAnimations'
import { staggerContainer, staggerChildFadeUp, subtleHover, fadeInUp } from '@/lib/motionPresets'

function reopenCookieSettings() {
  localStorage.removeItem('bttsbet_cookie_consent')
  window.dispatchEvent(new CustomEvent('cookie-consent-reopen'))
}

export default function Footer() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [ref, isVisible] = useScrollAnimation(0.1)

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Sticky Bottom CTA — Mobile, Linebet primary + VIP scroll */}
      <div className="fixed bottom-0 left-0 right-0 z-30 sticky-cta-bar py-2 px-3 sm:hidden" style={{ paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))' }}>
        <div className="grid grid-cols-2 gap-1.5">
          <a href={AFFILIATE.linebet} rel={AFFILIATE.rel} target="_blank" className="flex items-center justify-center gap-1.5 px-3 py-2.5 min-h-[44px] btn-linebet cta-glow text-[#04150C] text-[11px] font-bold">
            <img src="/logos/linebet-icon.svg" alt="Linebet" className="w-3.5 h-3.5 rounded object-contain flex-shrink-0" loading="lazy"/>
            Linebet 90K XOF
          </a>
          <button onClick={() => scrollToSection('vip')} className="flex items-center justify-center gap-1.5 px-3 py-2.5 min-h-[44px] bg-gold/15 border border-gold/30 rounded-lg text-gold text-[11px] font-bold">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
            VIP
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer ref={ref} id="faq" className="border-t border-edge/40 pt-10 pb-20 sm:pt-10 sm:pb-8 px-4">
        <div className="max-w-[440px] sm:max-w-2xl mx-auto">
          {/* Testimonials — Clean grid */}
          <div className="mb-6">
            <div className="text-center mb-3">
              <span className="text-[10px] font-bold text-success uppercase tracking-[0.15em]">Ils gagnent avec BttsBet</span>
              <h3 className="text-xl font-extrabold text-white mt-2 tracking-tight">
                Témoignages <span className="text-success">vérifiés</span>
              </h3>
            </div>
            <motion.div variants={staggerContainer} initial="hidden" animate={isVisible ? 'visible' : 'hidden'} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TESTIMONIALS.slice(0, 3).map((t, i) => (
                <motion.div key={t.name + t.city} variants={staggerChildFadeUp} whileHover={{ scale: 1.04, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }} whileTap={{ scale: 0.96, transition: { duration: 0.15 } }} style={{ willChange: 'transform, opacity' }} className="bg-panel border border-edge/40 squircle p-4 transition-colors hover:border-gold/15">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-8 h-8 rounded-full bg-gold/8 border border-gold/15 flex items-center justify-center text-gold text-xs font-bold">
                      {t.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-white font-semibold">{t.name}</div>
                      <div className="text-[10px] text-gray-600">{t.city}</div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <svg key={j} width="10" height="10" viewBox="0 0 24 24" fill="#FACC15" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed italic">&laquo; {t.text} &raquo;</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Divider */}
          <div className="divider-premium mb-6" />

          {/* FAQ — Clean accordion */}
          <div className="mb-6">
            <div className="text-center mb-3">
              <span className="text-[10px] font-bold text-gold uppercase tracking-[0.15em]">FAQ</span>
              <h3 className="text-xl font-extrabold text-white mt-2 tracking-tight">
                Questions <span className="text-gold">fréquentes</span>
              </h3>
            </div>
            <motion.div variants={staggerContainer} initial="hidden" animate={isVisible ? 'visible' : 'hidden'} className="space-y-2 max-w-2xl mx-auto">
              {FAQ_ITEMS.slice(0, 4).map((item, i) => (
                <motion.div key={item.q} variants={fadeInUp} className={`v31-faq-sep border border-edge/40 squircle overflow-hidden bg-panel/50 hover:border-gold/15 transition-colors`}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    aria-controls={`faq-answer-${i}`}
                    className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-white/[0.015] transition-colors"
                  >
                    <span className="text-sm text-white font-medium pr-4">{item.q}</span>
                    <motion.svg
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-4 h-4 text-gray-500 flex-shrink-0"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </motion.svg>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        id={`faq-answer-${i}`}
                        role="region"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-3.5 text-sm text-gray-400 leading-relaxed">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Divider */}
          <div className="divider-premium mb-6" />

          {/* Footer Grid — Clean layout */}
          <motion.div variants={staggerContainer} initial="hidden" animate={isVisible ? 'visible' : 'hidden'} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
                  </svg>
                </div>
                <span className="text-base font-extrabold text-white tracking-tight">{SITE.name}</span>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed mb-2">
                Plateforme de pronostics football BTTS & Over 2,5 propulsée par IA.
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                <span className="pastille pastille-green" />
                {SOCIAL_PROOF.members.toLocaleString()}+ parieurs actifs
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-3">Navigation</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-500 hover:text-gold transition-colors">Accueil</button></li>
                <li><button onClick={() => scrollToSection('free-predictions')} className="text-gray-500 hover:text-gold transition-colors">Pronostics</button></li>
                <li><button onClick={() => scrollToSection('vip')} className="text-gray-500 hover:text-gold transition-colors">VIP</button></li>
                <li><button onClick={() => scrollToSection('faq')} className="text-gray-500 hover:text-gold transition-colors">FAQ</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-3">Blog</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="/blog/comment-analyser-match-btts" className="text-gray-500 hover:text-gold transition-colors">Analyse BTTS</a></li>
                <li><a href="/blog/strategie-mise-over-2-5" className="text-gray-500 hover:text-gold transition-colors">Stratégie O2.5</a></li>
                <li><a href="/blog/gestion-bankroll-paris-sportifs" className="text-gray-500 hover:text-gold transition-colors">Bankroll</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-3">Légal & Responsable</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="/mentions-legales" className="text-gold hover:text-gold-light transition-colors font-semibold">Mentions Légales</a></li>
                <li><a href="https://www.begambleaware.org/" className="text-gold hover:text-gold-light transition-colors font-semibold">Jouer Responsable</a></li>
                <li className="flex items-center gap-1 text-gray-500"><span className="text-gold font-extrabold">18+</span> | <span className="text-gray-400">{LONASE.name}</span> | <span className="text-gray-400">Jeu responsable</span></li>
                {LEGAL.links.filter(l => l.label !== 'Mentions Légales' && l.label !== 'Jouer Responsable').map((link) => (
                  <li key={link.label}><a href={link.href} className="text-gray-500 hover:text-gold transition-colors">{link.label}</a></li>
                ))}
                <li>
                  <button onClick={reopenCookieSettings} className="text-gray-500 hover:text-gold transition-colors">
                    Paramètres cookies
                  </button>
                </li>
              </ul>
              {/* WhatsApp Contact */}
              <a href="https://wa.me/221781234567" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 text-xs text-green-500 hover:text-green-400 transition-colors font-semibold">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.317 0-4.474-.698-6.299-1.882l-.44-.293-2.638.887.887-2.638-.293-.44A9.962 9.962 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
                WhatsApp Support
              </a>
            </div>
          </motion.div>

          {/* Disclaimer + Legal + Payment Methods */}
          <div className="border-t border-edge/40 pt-6 mb-4">
            {/* Payment Methods */}
            <div className="flex items-center justify-center gap-3 mb-4">
              {PAYMENT_METHODS.map((method) => (
                <div key={method} className="flex items-center gap-1.5 px-3 py-1.5 bg-panel/50 border border-edge/40 rounded-lg text-gray-400 text-[10px] font-medium">
                  <div className="w-5 h-5 rounded-full bg-gray-600/20 border border-gray-600/30 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  </div>
                  {method}
                </div>
              ))}
            </div>

            <div className="bg-panel/50 squircle p-4 border border-edge/40">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg border border-gold/30 bg-gold/[0.06] flex items-center justify-center text-gold font-extrabold text-xs">
                  18+
                </div>
                <div className="flex-1">
                  <p className="text-[11px] text-gray-500 leading-relaxed mb-1">
                    <strong className="text-gold">Avertissement :</strong> {LEGAL.disclaimer}
                  </p>
                  <p className="text-[11px] text-gray-500 leading-relaxed mb-2">
                    <strong className="text-gold">Jeu responsable :</strong> {LEGAL.responsible}
                  </p>
                  <p className="text-[10px] text-gray-600 leading-relaxed">
                    <strong className="text-gray-500">Légal :</strong> 18+ | {LONASE.name} ({LONASE.description}) | Jeu responsable
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Affiliation Disclaimer — Article 8 compliance */}
          <p className="text-center text-[10px] text-gray-600 mb-2 leading-relaxed">
            Liens d&apos;affiliation — BttsBet est un site informatif indépendant, nous ne prenons pas de paris.
            Les liens vers les bookmakers partenaires sont des liens d&apos;affiliation rémunérés.
            BttsBet n&apos;est pas affilié à, ni exploité par, les sociétés de paris mentionnées sur ce site.
            Les marques et logos appartiennent à leurs propriétaires respectifs.
          </p>

          <div className="text-center text-[11px] text-gray-700">
            {LEGAL.copyright}
          </div>
        </div>
      </footer>
    </>
  )
}
