import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE, AFFILIATE, LEGAL, FAQ_ITEMS } from '../data/constants'

// Cookie settings reopen — event-based
function reopenCookieSettings() {
  localStorage.removeItem('bttsbet_cookie_consent')
  window.dispatchEvent(new CustomEvent('cookie-consent-reopen'))
}

export default function Footer() {
  const [openFaq, setOpenFaq] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <>
      {/* Sticky Bottom CTA (Mobile) — pb-safe for cookie consent overlap */}
      <div className="fixed bottom-0 left-0 right-0 z-30 glass-strong border-t border-white/5 py-2 px-4 sm:hidden">
        <div className="flex gap-2">
          <a
            href={AFFILIATE.linebet}
            rel={AFFILIATE.rel}
            target="_blank"
            className="flex-1 text-center px-4 py-3 bg-gradient-to-r from-emerald to-emerald-dark text-dark-900 font-bold rounded-xl text-sm"
          >
            Bonus {SITE.promoCode}
          </a>
          <a
            href={AFFILIATE.linebetDownload}
            rel={AFFILIATE.rel}
            target="_blank"
            className="flex-1 text-center px-4 py-3 border border-white/10 text-white font-semibold rounded-xl text-sm"
          >
            Télécharger
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer id="faq" className="bg-dark-900 border-t border-edge/30 pt-12 pb-24 sm:pb-10 px-4">
        <div className="max-w-5xl mx-auto">
          {/* ── FAQ Section ── */}
          <div className="mb-12">
            <h3 className="text-lg font-extrabold text-white mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>
              QUESTIONS <span className="text-emerald">FRÉQUENTES</span>
            </h3>
            <div className="space-y-2">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="border border-edge/30 rounded-lg overflow-hidden bg-panel/30">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    aria-controls={`faq-answer-${i}`}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-panel/50 transition-colors"
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
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-3 text-sm text-gray-400 leading-relaxed">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* ── Footer Grid ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg bg-emerald/20 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                    <path d="M2 12h20"/>
                  </svg>
                </div>
                <span className="text-lg font-extrabold text-white">{SITE.name}</span>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed">
                Plateforme de pronostics football BTTS & Over 2,5 propulsée par IA.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Navigation</h4>
              <ul className="space-y-1.5 text-xs">
                <li><Link to="/" className="text-gray-500 hover:text-emerald transition-colors">Accueil</Link></li>
                <li><Link to="/" onClick={() => { if (location.pathname === '/') { document.getElementById('free-predictions')?.scrollIntoView({ behavior: 'smooth' }) } else { navigate('/'); setTimeout(() => document.getElementById('free-predictions')?.scrollIntoView({ behavior: 'smooth' }), 300) }}} className="text-gray-500 hover:text-emerald transition-colors">Pronostics</Link></li>
                <li><Link to="/" onClick={() => { if (location.pathname === '/') { document.getElementById('vip')?.scrollIntoView({ behavior: 'smooth' }) }}} className="text-gray-500 hover:text-emerald transition-colors">VIP</Link></li>
                <li><Link to="/" onClick={() => { if (location.pathname === '/') { document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }) }}} className="text-gray-500 hover:text-emerald transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* Blog — using React Router Link for client-side navigation */}
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Blog</h4>
              <ul className="space-y-1.5 text-xs">
                <li><Link to="/blog/comment-analyser-match-btts" className="text-gray-500 hover:text-emerald transition-colors">Analyse BTTS</Link></li>
                <li><Link to="/blog/strategie-mise-over-2-5" className="text-gray-500 hover:text-emerald transition-colors">Stratégie O2.5</Link></li>
                <li><Link to="/blog/gestion-bankroll-paris-sportifs" className="text-gray-500 hover:text-emerald transition-colors">Bankroll</Link></li>
                <li><Link to="/blog" className="text-gray-500 hover:text-emerald transition-colors">Tous les articles →</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Légal</h4>
              <ul className="space-y-1.5 text-xs">
                {LEGAL.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-gray-500 hover:text-emerald transition-colors">{link.label}</Link>
                  </li>
                ))}
                {/* Cookie settings — RGPD compliance */}
                <li>
                  <button
                    onClick={reopenCookieSettings}
                    className="text-gray-500 hover:text-emerald transition-colors"
                  >
                    Paramètres cookies
                  </button>
                </li>
              </ul>
              {/* WhatsApp */}
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-xs"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="border-t border-edge/30 pt-6 mb-4">
            <div className="bg-panel/30 rounded-lg p-4">
              <p className="text-[11px] text-gray-600 leading-relaxed mb-1.5">
                <strong className="text-gray-500">Avertissement :</strong> {LEGAL.disclaimer}
              </p>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                <strong className="text-gray-500">Jeu responsable :</strong> {LEGAL.responsible}
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-[11px] text-gray-700">
            {LEGAL.copyright}
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={SITE.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 sm:bottom-6 right-6 z-50 w-11 h-11 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20 transition-all hover:scale-110"
        aria-label="Contactez-nous sur WhatsApp"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    </>
  )
}
