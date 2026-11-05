'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BOOKMAKERS } from '@/lib/constants'
import { trackAffiliateAction, trackAffiliateCodeCopy } from '@/lib/affiliateTracking'
import { copyTextToClipboard } from '@/lib/clipboard'
import { localizedPath, type Locale } from '@/lib/i18n'
import { useLanguage } from './LanguageSwitcher'

const WHATSAPP_NUMBER = '15406704172'
type PartnerId = typeof BOOKMAKERS[number]['id']
type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7

const GUIDE_PATHS: Record<PartnerId, string> = {
  '1xbet': '/code-promo-1xbet',
  linebet: '/code-promo-linebet-senegal',
  melbet: '/code-promo-melbet',
  '888starz': '/bonus-888starz-btts221',
}

const LABELS: Record<Locale, {
  title: string; intro: string; step: string; choose: string; priority: string
  copyCode: string; copied: string; guide: string; signup: string
  registerCheck: string; depositCheck: string; depositNote: string
  accountId: string; accountPlaceholder: string; accountHelp: string
  whatsapp: string; whatsappNote: string; openWhatsapp: string; opened: string
  waitTitle: string; waitBody: string; manualGate: string
  back: string; next: string; close: string; locked: string
  noAuto: string; messageTitle: string; messageBody: (brand: string, code: string, id: string) => string
  partnerNames: Record<PartnerId, string>
}> = {
  fr: {
    title: 'Demande d’accès VIP',
    intro: 'L’accès à vie reste verrouillé jusqu’à la confirmation manuelle du propriétaire.',
    step: 'Étape {current} sur 7', choose: 'Choisis un bookmaker', priority: 'Prioritaire',
    copyCode: 'Copie le code promo exact', copied: 'Copié', guide: 'Voir le guide promo', signup: 'Ouvrir le site du bookmaker',
    registerCheck: 'Je confirme avoir terminé l’inscription avec le code exact du guide.',
    depositCheck: 'Je confirme avoir déposé au moins 3 $ sur le compte bookmaker.',
    depositNote: 'Dépôt minimum : 3 $ sur le compte bookmaker. Vérifie les conditions actuelles de l’opérateur. Aucun fonds n’est collecté ici.',
    accountId: 'Identifiant du compte bookmaker', accountPlaceholder: 'Saisis uniquement l’identifiant du compte',
    accountHelp: 'Cet identifiant précède immédiatement l’étape WhatsApp. N’envoie aucun document d’identité, mot de passe, PIN ou code OTP.',
    whatsapp: 'Vérification via WhatsApp', whatsappNote: 'Le bouton prépare un message à relire. Il n’est pas envoyé automatiquement; tu gardes le contrôle de l’envoi.',
    openWhatsapp: 'Ouvrir WhatsApp', opened: 'WhatsApp ouvert dans un nouvel onglet.',
    waitTitle: 'Attendre l’approbation manuelle',
    waitBody: 'Après avoir envoyé ta demande dans WhatsApp, attends la confirmation personnelle du propriétaire. Aucun clic, formulaire ou dépôt ne déverrouille le VIP.',
    manualGate: 'Aucune activation automatique', back: 'Retour', next: 'Continuer', close: 'Fermer', locked: 'Accès verrouillé',
    noAuto: 'Le VIP reste verrouillé jusqu’à la validation personnelle du propriétaire.',
    messageTitle: 'Message prérempli',
    messageBody: (brand, code, id) => `Bonjour BTTSPredict, je demande une vérification manuelle de mon accès VIP à vie. Partenaire : ${brand}. Code promo utilisé : ${code}. Inscription confirmée : oui. Dépôt confirmé : oui. Identifiant de mon compte bookmaker : ${id}. Merci de valider personnellement ma demande.`,
    partnerNames: { '1xbet': '1xBet', linebet: 'Linebet', melbet: 'MelBet', '888starz': '888Starz' },
  },
  en: {
    title: 'VIP access request',
    intro: 'Lifetime access stays locked until the owner manually approves it.',
    step: 'Step {current} of 7', choose: 'Choose a bookmaker', priority: 'Priority',
    copyCode: 'Copy the exact promo code', copied: 'Copied', guide: 'View promo guide', signup: 'Open bookmaker site',
    registerCheck: 'I confirm that I completed registration using the exact code in the guide.',
    depositCheck: 'I confirm that I deposited at least $3 on my bookmaker account.',
    depositNote: 'Minimum deposit: $3 on your bookmaker account. Check the operator’s current terms. No funds are collected here.',
    accountId: 'Bookmaker account ID', accountPlaceholder: 'Enter only the bookmaker account identifier',
    accountHelp: 'This identifier is entered immediately before WhatsApp. Do not send identity documents, passwords, PINs or OTPs.',
    whatsapp: 'WhatsApp verification', whatsappNote: 'The button prepares a message for you to review. It is not sent automatically; you control whether to send it.',
    openWhatsapp: 'Open WhatsApp', opened: 'WhatsApp opened in a new tab.',
    waitTitle: 'Wait for manual approval',
    waitBody: 'After sending your request in WhatsApp, wait for the owner’s personal confirmation. No click, form or deposit unlocks VIP.',
    manualGate: 'No automatic activation', back: 'Back', next: 'Continue', close: 'Close', locked: 'Access locked',
    noAuto: 'VIP remains locked until the owner personally approves the request.',
    messageTitle: 'Prefilled message',
    messageBody: (brand, code, id) => `Hello BTTSPredict, I am requesting a manual review of my lifetime VIP access. Partner: ${brand}. Promo code used: ${code}. Registration confirmed: yes. Deposit confirmed: yes. Bookmaker account ID: ${id}. Please review and approve my request personally.`,
    partnerNames: { '1xbet': '1xBet', linebet: 'Linebet', melbet: 'MelBet', '888starz': '888Starz' },
  },
  ar: {
    title: 'طلب الوصول إلى VIP',
    intro: 'يظل الوصول مدى الحياة مقفلاً حتى موافقة المالك يدوياً.',
    step: 'الخطوة {current} من 7', choose: 'اختر شركة مراهنات', priority: 'أولوية',
    copyCode: 'انسخ الرمز الترويجي الدقيق', copied: 'تم النسخ', guide: 'عرض دليل العرض', signup: 'افتح موقع شركة المراهنات',
    registerCheck: 'أؤكد أنني أكملت التسجيل باستخدام الرمز الدقيق في الدليل.',
    depositCheck: 'أؤكد أنني أودعت 3 دولارات على الأقل في حساب شركة المراهنات.',
    depositNote: 'الحد الأدنى للإيداع: 3 دولارات في حساب شركة المراهنات. تحقق من الشروط الحالية للمشغل. لا تُجمع أي أموال هنا.',
    accountId: 'معرّف حساب شركة المراهنات', accountPlaceholder: 'أدخل معرّف الحساب فقط',
    accountHelp: 'يُدخل هذا المعرّف مباشرة قبل خطوة واتساب. لا ترسل وثائق هوية أو كلمات مرور أو PIN أو رموز OTP.',
    whatsapp: 'التحقق عبر واتساب', whatsappNote: 'يجهّز الزر رسالة لمراجعتها. لا تُرسل تلقائياً؛ أنت تتحكم في إرسالها.',
    openWhatsapp: 'افتح واتساب', opened: 'تم فتح واتساب في علامة تبويب جديدة.',
    waitTitle: 'انتظر الموافقة اليدوية',
    waitBody: 'بعد إرسال الطلب عبر واتساب، انتظر تأكيد المالك شخصياً. لا يؤدي أي نقر أو نموذج أو إيداع إلى فتح VIP.',
    manualGate: 'لا يوجد تفعيل تلقائي', back: 'رجوع', next: 'متابعة', close: 'إغلاق', locked: 'الوصول مقفل',
    noAuto: 'يظل VIP مقفلاً حتى يوافق المالك على الطلب شخصياً.',
    messageTitle: 'رسالة جاهزة',
    messageBody: (brand, code, id) => `مرحباً BTTSPredict، أطلب مراجعة يدوية لوصولي مدى الحياة إلى VIP. الشريك: ${brand}. الرمز المستخدم: ${code}. تم تأكيد التسجيل: نعم. تم تأكيد الإيداع: نعم. معرّف حسابي لدى شركة المراهنات: ${id}. يرجى مراجعة طلبي والموافقة عليه شخصياً.`,
    partnerNames: { '1xbet': '1xBet', linebet: 'Linebet', melbet: 'MelBet', '888starz': '888Starz' },
  },
}

export default function VipUnlockModal({
  isOpen,
  onClose,
  title,
}: {
  isOpen: boolean
  onClose: () => void
  title?: string
}) {
  const { lang } = useLanguage()
  const copy = LABELS[lang]
  const modalRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  const [step, setStep] = useState<Step>(1)
  const [selectedBookmaker, setSelectedBookmaker] = useState<PartnerId | null>(null)
  const [registrationConfirmed, setRegistrationConfirmed] = useState(false)
  const [depositConfirmed, setDepositConfirmed] = useState(false)
  const [accountId, setAccountId] = useState('')
  const [copied, setCopied] = useState(false)
  const [whatsappOpened, setWhatsappOpened] = useState(false)

  const resetForm = useCallback(() => {
    setStep(1)
    setSelectedBookmaker(null)
    setRegistrationConfirmed(false)
    setDepositConfirmed(false)
    setAccountId('')
    setCopied(false)
    setWhatsappOpened(false)
  }, [])

  const close = useCallback(() => {
    resetForm()
    onCloseRef.current()
  }, [resetForm])

  useEffect(() => { onCloseRef.current = onClose }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', handleKeyDown)
    window.setTimeout(() => modalRef.current?.querySelector<HTMLElement>('button:not([disabled]), a[href], input')?.focus(), 0)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, close])

  const partner = selectedBookmaker ? BOOKMAKERS.find((item) => item.id === selectedBookmaker) : undefined
  const selectPartner = (id: PartnerId) => {
    setSelectedBookmaker(id)
    setRegistrationConfirmed(false)
    setDepositConfirmed(false)
    setAccountId('')
    setCopied(false)
    setWhatsappOpened(false)
  }

  const copyCode = async () => {
    if (!partner) return
    const ok = await copyTextToClipboard(partner.promoCode)
    if (!ok) return
    trackAffiliateCodeCopy(partner.id, 'vip-access-flow')
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const openWhatsApp = () => {
    if (!partner || accountId.trim().length < 3) return
    const message = copy.messageBody(copy.partnerNames[partner.id], partner.promoCode, accountId.trim())
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    trackAffiliateAction(partner.id, 'whatsapp_click', 'vip-manual-review')
    window.open(url, '_blank', 'noopener,noreferrer')
    setWhatsappOpened(true)
  }

  const canContinue =
    (step === 1 && Boolean(partner)) ||
    (step === 2 && Boolean(partner) && copied) ||
    (step === 3 && registrationConfirmed) ||
    (step === 4 && depositConfirmed) ||
    (step === 5 && accountId.trim().length >= 3) ||
    (step === 6 && whatsappOpened)

  const back = () => step === 1 ? close() : setStep((step - 1) as Step)
  const next = () => {
    if (!canContinue || step >= 7) return
    setStep((step + 1) as Step)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(event) => { if (event.target === event.currentTarget) close() }}
          style={{ backgroundColor: 'rgba(5, 10, 17, 0.88)', backdropFilter: 'blur(8px)' }}
        >
          <motion.section
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="vip-access-title"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
            initial={{ scale: 0.97, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, y: 12 }}
            transition={{ duration: 0.18 }}
            className="vip-access-flow relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl"
            style={{ background: 'linear-gradient(155deg, #182331 0%, #0d141d 100%)', border: '1px solid rgba(127,162,198,.3)', boxShadow: '0 24px 80px rgba(0,0,0,.65)', color: '#F2F6FA' }}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" onClick={close} aria-label={copy.close} className="vip-access-flow__close">×</button>
            <div className="p-5 sm:p-7">
              <div className="flex items-start gap-3 pr-9">
                <span className="vip-access-flow__badge" aria-hidden="true">
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <div>
                  <h2 id="vip-access-title" className="text-lg sm:text-xl font-bold">{title || copy.title}</h2>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: '#AAB7C5' }}>{copy.intro}</p>
                </div>
              </div>

              <div className="mt-5" aria-label={copy.step.replace('{current}', String(step))}>
                <div className="flex items-center justify-between text-[11px] font-semibold" style={{ color: '#B9C6D4' }}>
                  <span>{copy.step.replace('{current}', String(step))}</span>
                  <span>{Math.round((step / 7) * 100)}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,.09)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${(step / 7) * 100}%`, background: 'linear-gradient(90deg,#6FA8FF,#34D399)' }} />
                </div>
              </div>

              <div className="mt-5 min-h-[230px]" aria-live="polite">
                {step === 1 && (
                  <div>
                    <h3 className="text-sm font-bold">1. {copy.choose}</h3>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {BOOKMAKERS.map((item, index) => (
                        <button
                          key={item.id} type="button" aria-pressed={selectedBookmaker === item.id}
                          onClick={() => selectPartner(item.id)}
                          className="vip-access-flow__partner"
                          style={{ borderColor: selectedBookmaker === item.id ? '#7DB5FF' : 'rgba(255,255,255,.12)', background: selectedBookmaker === item.id ? 'rgba(125,181,255,.12)' : 'rgba(255,255,255,.035)' }}
                        >
                          <img src={item.logoFull} alt="" width={48} height={34} />
                          <span className="vip-access-flow__partner-name">{copy.partnerNames[item.id]}</span>
                          {index < 2 && <span className="vip-access-flow__priority">{copy.priority}</span>}
                          {selectedBookmaker === item.id && <span aria-hidden="true" className="vip-access-flow__check">✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && partner && (
                  <div>
                    <h3 className="text-sm font-bold">2. {copy.copyCode}</h3>
                    <p className="mt-1 text-xs" style={{ color: '#AAB7C5' }}>{copy.partnerNames[partner.id]}</p>
                    <button type="button" onClick={copyCode} className="vip-access-flow__code">
                      <span className="font-mono text-xl font-black tracking-wider">{partner.promoCode}</span>
                      <span className="text-xs font-bold">{copied ? copy.copied : copy.copyCode}</span>
                    </button>
                    <a className="vip-access-flow__text-link" href={localizedPath(GUIDE_PATHS[partner.id], lang)} target="_blank" rel="noopener noreferrer">{copy.guide} ↗</a>
                  </div>
                )}

                {step === 3 && partner && (
                  <div>
                    <h3 className="text-sm font-bold">3. {lang === 'en' ? 'Confirm registration' : lang === 'ar' ? 'تأكيد التسجيل' : 'Confirmer l’inscription'}</h3>
                    <p className="mt-2 text-xs leading-relaxed" style={{ color: '#AAB7C5' }}>{copy.registerCheck}</p>
                    <a className="vip-access-flow__text-link" href={partner.signupLink} target="_blank" rel="sponsored nofollow noopener noreferrer">{copy.signup} · {copy.partnerNames[partner.id]} ↗</a>
                    <label className="vip-access-flow__checkrow"><input type="checkbox" checked={registrationConfirmed} onChange={(event) => setRegistrationConfirmed(event.target.checked)} /> <span>{copy.registerCheck}</span></label>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <h3 className="text-sm font-bold">4. {lang === 'en' ? 'Confirm deposit' : lang === 'ar' ? 'تأكيد الإيداع' : 'Confirmer le dépôt'}</h3>
                    <p className="mt-2 text-xs leading-relaxed" style={{ color: '#AAB7C5' }}>{copy.depositNote}</p>
                    <label className="vip-access-flow__checkrow"><input type="checkbox" checked={depositConfirmed} onChange={(event) => setDepositConfirmed(event.target.checked)} /> <span>{copy.depositCheck}</span></label>
                  </div>
                )}

                {step === 5 && (
                  <div>
                    <h3 className="text-sm font-bold">5. {copy.accountId}</h3>
                    <label htmlFor="vip-bookmaker-account-id" className="vip-access-flow__field-label">{copy.accountId}</label>
                    <input
                      id="vip-bookmaker-account-id" type="text" autoComplete="off" spellCheck={false}
                      maxLength={80} value={accountId} placeholder={copy.accountPlaceholder}
                      onChange={(event) => setAccountId(event.target.value)}
                      className="vip-access-flow__input"
                    />
                    <p className="mt-2 text-[11px] leading-relaxed" style={{ color: '#AAB7C5' }}>{copy.accountHelp}</p>
                  </div>
                )}

                {step === 6 && partner && (
                  <div>
                    <h3 className="text-sm font-bold">6. {copy.whatsapp}</h3>
                    <p className="mt-2 text-xs leading-relaxed" style={{ color: '#AAB7C5' }}>{copy.whatsappNote}</p>
                    <div className="vip-access-flow__summary"><span>{copy.partnerNames[partner.id]}</span><span>{partner.promoCode}</span><span className="truncate">{accountId.trim()}</span></div>
                    <button type="button" onClick={openWhatsApp} className="vip-access-flow__whatsapp">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.5 4.1 1.6 5.9L.2 24l6.5-1.7a11.9 11.9 0 0 0 5.4 1.3h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.1-3.5-8.3ZM12.2 21.6c-1.7 0-3.3-.5-4.7-1.3l-.3-.2-3.8 1 1-3.7-.2-.4a9.7 9.7 0 0 1-1.5-5.2c0-5.3 4.3-9.6 9.6-9.6 2.6 0 5 1 6.8 2.8a9.6 9.6 0 0 1 2.8 6.8c0 5.3-4.3 9.6-9.7 9.6Zm5.3-7.2c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.1-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2.1 3.2 5.1 4.5.7.3 1.2.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4s-.2-.2-.6-.4Z"/></svg>
                      {copy.openWhatsapp}
                    </button>
                    {whatsappOpened && <p className="mt-2 text-xs" style={{ color: '#86EFAC' }}>{copy.opened}</p>}
                  </div>
                )}

                {step === 7 && (
                  <div>
                    <h3 className="text-sm font-bold">7. {copy.waitTitle}</h3>
                    <p className="mt-2 text-xs leading-relaxed" style={{ color: '#AAB7C5' }}>{copy.waitBody}</p>
                    <div className="vip-access-flow__manual">
                      <span aria-hidden="true">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-3.6 8-10V5l-8-3-8 3v7c0 6.4 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
                      </span>
                      <strong>{copy.manualGate}</strong>
                      <small>{copy.noAuto}</small>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 border-t pt-4" style={{ borderColor: 'rgba(255,255,255,.1)' }}>
                <button type="button" onClick={step === 1 ? close : back} className="vip-access-flow__secondary">{step === 1 ? copy.close : copy.back}</button>
                {step < 7 ? (
                  <button type="button" disabled={!canContinue} onClick={next} className="vip-access-flow__primary" style={{ opacity: canContinue ? 1 : 0.48 }}>{copy.next} <span aria-hidden="true">→</span></button>
                ) : <button type="button" onClick={close} className="vip-access-flow__primary">{copy.close}</button>}
              </div>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
