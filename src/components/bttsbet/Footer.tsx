'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE, AFFILIATE, LEGAL, FAQ_ITEMS, ANDROID_LOGO, TESTIMONIALS, SOCIAL_PROOF } from '@/lib/constants'
import { useScrollAnimation } from '@/hooks/useAnimations'

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
      {/* Sticky Bottom CTA — Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-30 sticky-cta-bar py-2 px-3 sm:hidden">
        <div className="grid grid-cols-2 gap-1.5">
          <a href={AFFILIATE.linebet} rel={AFFILIATE.rel} target="_blank" className="flex items-center justify-center gap-1.5 px-2 py-2.5 btn-linebet text-[#04150C] text-xs font-bold rounded-xl">
            <img src="/logos/linebet-icon.svg" alt="Linebet" className="w-4 h-4 rounded object-contain flex-shrink-0" loading="lazy"/>
            Linebet 150$
          </a>
          <a href={AFFILIATE.star888} rel={AFFILIATE.rel} target="_blank" className="flex items-center justify-center gap-1.5 px-2 py-2.5 btn-star888 text-white text-xs font-bold rounded-xl">
            <img src="/logos/888starz-icon.svg" alt="888starz" className="w-4 h-4 rounded object-contain flex-shrink-0" loading="lazy"/>
            888starz 100%
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer ref={ref} id="faq" className="border-t border-edge/40 pt-16 pb-24 sm:pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Testimonials — Clean grid */}
          <div className="mb-12">
            <div className="text-center mb-6">
              <span className="text-[10px] font-bold text-success uppercase tracking-[0.15em]">Ils gagnent avec BttsBet</span>
              <h3 className="text-xl font-extrabold text-white mt-2 tracking-tight">
                Témoignages <span className="text-success">vérifiés</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TESTIMONIALS.slice(0, 3).map((t, i) => (
                <div key={i} className="bg-panel border border-edge/40 rounded-xl p-4 transition-colors hover:border-emerald/15">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald/8 border border-emerald/15 flex items-center justify-center text-emerald text-xs font-bold">
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
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="divider-premium mb-10" />

          {/* FAQ — Clean accordion */}
          <div className="mb-12">
            <div className="text-center mb-6">
              <span className="text-[10px] font-bold text-emerald uppercase tracking-[0.15em]">FAQ</span>
              <h3 className="text-xl font-extrabold text-white mt-2 tracking-tight">
                Questions <span className="text-emerald">fréquentes</span>
              </h3>
            </div>
            <div className={`space-y-2 max-w-2xl mx-auto stagger-reveal ${isVisible ? 'is-visible' : ''}`}>
              {FAQ_ITEMS.slice(0, 4).map((item, i) => (
                <div key={i} className={`v31-faq-sep border border-edge/40 rounded-xl overflow-hidden bg-panel/50 hover:border-emerald/15 transition-colors`}>
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
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="divider-premium mb-10" />

          {/* Footer Grid — Clean layout */}
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10 stagger-reveal ${isVisible ? 'is-visible' : ''}`}>
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-emerald/10 border border-emerald/20 flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF6B2B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-500 hover:text-emerald transition-colors">Accueil</button></li>
                <li><button onClick={() => scrollToSection('free-predictions')} className="text-gray-500 hover:text-emerald transition-colors">Pronostics</button></li>
                <li><button onClick={() => scrollToSection('vip')} className="text-gray-500 hover:text-emerald transition-colors">VIP</button></li>
                <li><button onClick={() => scrollToSection('faq')} className="text-gray-500 hover:text-emerald transition-colors">FAQ</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-3">Blog</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="/blog/comment-analyser-match-btts" className="text-gray-500 hover:text-emerald transition-colors">Analyse BTTS</a></li>
                <li><a href="/blog/strategie-mise-over-2-5" className="text-gray-500 hover:text-emerald transition-colors">Stratégie O2.5</a></li>
                <li><a href="/blog/gestion-bankroll-paris-sportifs" className="text-gray-500 hover:text-emerald transition-colors">Bankroll</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-3">Légal</h4>
              <ul className="space-y-2 text-xs">
                {LEGAL.links.map((link) => (
                  <li key={link.label}><a href={link.href} className="text-gray-500 hover:text-emerald transition-colors">{link.label}</a></li>
                ))}
                <li>
                  <button onClick={reopenCookieSettings} className="text-gray-500 hover:text-emerald transition-colors">
                    Paramètres cookies
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Disclaimer — Clean */}
          <div className="border-t border-edge/40 pt-6 mb-4">
            <div className="bg-panel/50 rounded-xl p-4 border border-edge/40">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg border border-gold/30 bg-gold/[0.06] flex items-center justify-center text-gold font-extrabold text-xs">
                  18+
                </div>
                <div className="flex-1">
                  <p className="text-[11px] text-gray-500 leading-relaxed mb-1">
                    <strong className="text-gold">Avertissement :</strong> {LEGAL.disclaimer}
                  </p>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    <strong className="text-gold">Jeu responsable :</strong> {LEGAL.responsible}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-[11px] text-gray-700">
            {LEGAL.copyright}
          </div>
        </div>
      </footer>
    </>
  )
}
