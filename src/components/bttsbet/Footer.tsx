'use client'

import { useState } from 'react'
import { useLanguage } from './LanguageSwitcher'
import { localizedPath, translationsFor } from '@/lib/i18n'
import { motion } from 'framer-motion'
import { LEGAL, FAQ_ITEMS, LONASE } from '@/lib/constants'
import { useScrollAnimation } from '@/hooks/useAnimations'
//import { staggerContainer, fadeInUp } from '@/lib/motionPresets'

export default function Footer() {
  const ref = null as any
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { lang } = useLanguage()
  const t = translationsFor(lang)
  const legalLinks = lang === 'fr'
    ? [{ label: 'CGU', href: '/cgu' }, { label: 'Mentions légales', href: '/mentions-legales' }, { label: 'Confidentialité', href: '/politique-confidentialite' }, { label: 'Jouer responsable', href: '/jouer-responsable' }]
    : lang === 'en'
      ? [{ label: 'Terms', href: '/cgu' }, { label: 'Legal notice', href: '/mentions-legales' }, { label: 'Privacy', href: '/politique-confidentialite' }, { label: 'Play responsibly', href: '/jouer-responsable' }]
      : [{ label: 'الشروط', href: '/cgu' }, { label: 'الإشعار القانوني', href: '/mentions-legales' }, { label: 'الخصوصية', href: '/politique-confidentialite' }, { label: 'العب بمسؤولية', href: '/jouer-responsable' }]

  return (
    <>
      <footer ref={ref} id="faq" className="border-t pt-10 pb-20 sm:pb-8 px-4" style={{ borderColor: '#B8FF1A', backgroundColor: '#071018' }}>
        <div className="max-w-[440px] sm:max-w-2xl mx-auto">
          {/* Note de transparence (remplace les témoignages non vérifiables) */}
          <motion.div initial="hidden" className="mb-6">
            <div className="text-center mb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#B8FF1A]">{t.common.transparency}</span>
            </div>
            <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#0D1A20', border: '1px solid rgba(244, 247, 251, 0.08)' }}>
              <p className="text-[11px] text-[#B7C4C1] leading-relaxed">
                {lang === 'fr' ? (
                  <>BTTSPredict ne publie pas de témoignages clients. Notre engagement de transparence repose sur un <a href={localizedPath('/resultats-verifies', lang)} className="text-[#B8FF1A] underline">historique vérifiable publiquement</a>, une <a href={localizedPath('/methodologie', lang)} className="text-[#B8FF1A] underline">méthodologie documentée</a> et un suivi public lancé le 2026-08-08. Aucun résultat futur n’est garanti.</>
                ) : lang === 'en' ? (
                  <>BTTSPredict does not publish customer testimonials. Our transparency commitment is based on a <a href={localizedPath('/resultats-verifies', lang)} className="text-[#B8FF1A] underline">publicly verifiable history</a>, a <a href={localizedPath('/methodologie', lang)} className="text-[#B8FF1A] underline">documented method</a> and public tracking. No future result is guaranteed.</>
                ) : (
                  <>لا تنشر BTTSPredict شهادات العملاء. تعتمد الشفافية على <a href={localizedPath('/resultats-verifies', lang)} className="text-[#B8FF1A] underline">سجل عام موثق</a> و<a href={localizedPath('/methodologie', lang)} className="text-[#B8FF1A] underline">منهجية موثقة</a> وتتبع علني. لا توجد ضمانات لأي نتيجة مستقبلية.</>
                )}
              </p>
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div initial="hidden" className="mb-6">
            <div className="text-center mb-3">
              <h3 className="text-sm font-bold text-papier">{t.common.faq}</h3>
            </div>
            <div className="space-y-2">
              {(lang === 'fr' ? FAQ_ITEMS.slice(0, 4) : t.faqItems).map((item, i) => (
                <div key={item.q} className="rounded-xl overflow-hidden" style={{ backgroundColor: '#0D1A20', border: '1px solid rgba(244, 247, 251, 0.08)' }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i} className="w-full text-left px-4 py-3 text-xs font-semibold text-papier">
                    {item.q}
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-3 text-[11px] text-[#B8FF1A] leading-relaxed">{item.a}</div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Legal links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {legalLinks.map(link => (
              <a key={link.label} href={localizedPath(link.href, lang)} className="text-center text-[10px] text-[#B7C4C1] hover:text-[#B8FF1A] transition-colors py-2">
                {link.label}
              </a>
            ))}
          </div>

          {/* Legal text */}
          <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: '#0D1A20' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#B8FF1A] font-extrabold text-xs">18+</span>
              <span className="text-[10px] text-[#B7C4C1]">| {LONASE.name} | {t.common.responsible}</span>
            </div>
            <p className="text-[10px] text-[#B7C4C1] leading-relaxed">
              <strong className="text-[#B8FF1A]">{t.common.warning} :</strong> {lang === 'fr' ? LEGAL.disclaimer : t.legal.risk + ' ' + t.legal.noGuarantee + ' ' + t.legal.eighteen}
            </p>
          </div>

          {/* Email pro contact (signal de confiance humain — v65 supprime WhatsApp US) */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <a
              href="mailto:contact@bttspredict.com"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
              style={{
                backgroundColor: 'rgba(75, 182, 135, 0.08)',
                color: '#B8FF1A',
                border: '1px solid rgba(75, 182, 135, 0.2)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              contact@bttspredict.com
            </a>
          </div>

          {/* Réseaux sociaux (v65: WhatsApp US supprimé — email pro suffit) */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <a href="https://twitter.com/bttspredict" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="opacity-60 hover:opacity-100 transition-opacity">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#B7C4C1"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://www.facebook.com/bttspredict" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="opacity-60 hover:opacity-100 transition-opacity">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#B7C4C1"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073"/></svg>
            </a>
            <a href="https://www.instagram.com/bttspredict" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="opacity-60 hover:opacity-100 transition-opacity">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#B7C4C1"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/bttspredict" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="opacity-60 hover:opacity-100 transition-opacity">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#B7C4C1"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://www.youtube.com/@bttspredict" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="opacity-60 hover:opacity-100 transition-opacity">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#B7C4C1"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>

          {/* Affiliation disclaimer */}
          <p className="text-center text-[10px] text-[#B7C4C1] mb-2 leading-relaxed">
            {t.common.affiliate} {lang === 'fr' ? 'Les liens vers les bookmakers partenaires sont des liens d’affiliation rémunérés. BTTSPredict n’est pas affilié aux sociétés de paris mentionnées.' : ''}
          </p>

          {/* Identité éditeur — aligné avec LocalBusiness Schema.org (Dakar, Sénégal) */}
          <div className="text-center text-[10px] text-[#B7C4C1] mt-3 space-y-1">
            <div>{t.common.publisher} · Contact conformité: {' '}
              <a href="mailto:contact@bttspredict.com" className="underline hover:text-[#B7C4C1]">contact@bttspredict.com</a>
            </div>
            <div>{t.legal.noGuarantee} — 18+ {t.common.responsible}</div>
          </div>

          <div className="text-center text-[10px] text-[#5D7880] mt-2">
            {LEGAL.copyright}
          </div>
        </div>
      </footer>
    </>
  )
}
