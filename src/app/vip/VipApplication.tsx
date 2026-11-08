'use client'

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { BOOKMAKERS } from '@/lib/constants'
import { copyTextToClipboard } from '@/lib/clipboard'
import { localizedPath, type Locale } from '@/lib/i18n'

type PartnerId = (typeof BOOKMAKERS)[number]['id']
type ContactChannel = 'telegram' | 'whatsapp'
type ApiRecord = Record<string, unknown>
type Receipt = { requestId: string; receiptToken: string; submittedAt: string }

const API_ORIGIN = 'https://bttspredict-vip-production-api.luxxdii.workers.dev'
const REQUESTS_URL = `${API_ORIGIN}/requests`
const RECEIPT_SESSION_KEY = 'bttspredict.vip.application.receipt.v1'
const GUIDE_PATHS: Record<PartnerId, string> = {
  '1xbet': '/code-promo-1xbet',
  linebet: '/code-promo-linebet-senegal',
  melbet: '/code-promo-melbet',
  '888starz': '/bonus-888starz-btts221',
}

const COPY: Record<Locale, {
  title: string; intro: string; choose: string; code: string; copy: string; copied: string
  guide: string; signup: string; registration: string; depositConfirmed: string; deposit: string
  accountId: string; accountHelp: string; proof: string; proofHelp: string; consent: string
  contact: string; telegram: string; whatsapp: string; telegramId: string
  whatsappNumber: string; followupConsent: string; submit: string; submitting: string
  refresh: string; checking: string; unavailable: string; unavailableHelp: string
  submitted: string; received: string; status: string; statusUnavailable: string
  invite: string; inviteNote: string; invalidImage: string; required: string; minimumDeposit: string
  invalidContact: string; requestFailed: string; clipboardUnavailable: string
  noAuto: string; privacy: string; pending: string; statusLabel: string
}> = {
  fr: {
    title: 'Demande d’accès VIP',
    intro: 'Choisis un partenaire, confirme ton inscription et ton dépôt, puis envoie ta demande avec une preuve image. L’accès reste soumis à une validation manuelle.',
    choose: 'Choisir un bookmaker', code: 'Code exact', copy: 'Copier le code', copied: 'Code copié',
    guide: 'Guide existant', signup: 'Ouvrir le site du partenaire', registration: 'Je confirme avoir terminé mon inscription avec ce partenaire.',
    depositConfirmed: 'Je confirme avoir effectué le dépôt indiqué.', deposit: 'Dépôt effectué (USD)',
    accountId: 'Identifiant du compte bookmaker', accountHelp: 'Ne saisis aucun mot de passe, PIN, code OTP ni document d’identité.',
    proof: 'Preuve image du dépôt', proofHelp: 'Image PNG ou JPEG uniquement.',
    consent: 'Je consens à transmettre ces informations et la preuve au service BTTSPredict pour l’examen manuel de ma demande VIP.',
    contact: 'Choisis un canal pour le suivi', telegram: 'Telegram', whatsapp: 'WhatsApp',
    telegramId: 'Identifiant Telegram', whatsappNumber: 'Numéro WhatsApp avec indicatif pays',
    followupConsent: 'J’accepte que BTTSPredict me contacte sur ce canal au sujet de cette demande.',
    submit: 'Envoyer la demande', submitting: 'Envoi en cours…', refresh: 'Actualiser le statut', checking: 'Vérification du statut…',
    unavailable: 'Service de demande indisponible', unavailableHelp: 'Le service n’a pas confirmé la demande. Rien n’a été enregistré dans cette session. Réessaie plus tard.',
    submitted: 'Réception confirmée par le Worker', received: 'Référence de demande', status: 'Statut actuel',
    statusUnavailable: 'La référence est conservée dans cette session, mais le statut ne peut pas être actualisé pour le moment.',
    invite: 'Continuer sur Telegram', inviteNote: 'Invitation privée confirmée par le service.',
    invalidImage: 'Sélectionne une image PNG ou JPEG de 1,4 Mo maximum.', required: 'Complète les champs obligatoires et les confirmations.',
    minimumDeposit: 'Le dépôt déclaré doit être compris entre 3 et 100 000 USD.', invalidContact: 'Saisis un identifiant Telegram valide ou un numéro WhatsApp au format international (+…).',
    requestFailed: 'Le Worker n’a pas confirmé la réception. Aucun reçu n’a été créé dans cette session.', noAuto: 'L’envoi ou le dépôt ne déverrouille pas automatiquement le VIP.',
    clipboardUnavailable: 'Copie automatique impossible : sélectionne et copie le code affiché.',
    privacy: 'Aucun fonds n’est collecté ici.', pending: 'En attente de vérification manuelle.', statusLabel: 'Service de statut',
  },
  en: {
    title: 'VIP access request',
    intro: 'Choose a partner, confirm your registration and deposit, then send your request with an image proof. Access remains subject to manual approval.',
    choose: 'Choose a bookmaker', code: 'Exact code', copy: 'Copy code', copied: 'Code copied',
    guide: 'Existing guide', signup: 'Open partner site', registration: 'I confirm that I completed registration with this partner.',
    depositConfirmed: 'I confirm that I made the stated deposit.', deposit: 'Deposit made (USD)',
    accountId: 'Bookmaker account ID', accountHelp: 'Do not enter a password, PIN, OTP, or identity document.',
    proof: 'Deposit image proof', proofHelp: 'PNG or JPEG image only.',
    consent: 'I consent to sending this information and proof to BTTSPredict for manual review of my VIP request.',
    contact: 'Choose a follow-up channel', telegram: 'Telegram', whatsapp: 'WhatsApp',
    telegramId: 'Telegram username or ID', whatsappNumber: 'WhatsApp number with country code',
    followupConsent: 'I agree that BTTSPredict may contact me on this channel about this request.',
    submit: 'Submit request', submitting: 'Submitting…', refresh: 'Refresh status', checking: 'Checking status…',
    unavailable: 'Request service unavailable', unavailableHelp: 'The service did not confirm the request. Nothing was saved in this session. Please try again later.',
    submitted: 'Receipt confirmed by the Worker', received: 'Request reference', status: 'Current status',
    statusUnavailable: 'The reference is saved in this session, but its status cannot be refreshed right now.',
    invite: 'Continue on Telegram', inviteNote: 'Private invite confirmed by the service.',
    invalidImage: 'Choose a PNG or JPEG image no larger than 1.4 MB.', required: 'Complete the required fields and confirmations.',
    minimumDeposit: 'The declared deposit must be between USD 3 and USD 100,000.', invalidContact: 'Enter a valid Telegram username or WhatsApp number in international format (+…).',
    requestFailed: 'The Worker did not confirm receipt. No receipt was created in this session.', noAuto: 'Submitting a request or making a deposit does not automatically unlock VIP.',
    clipboardUnavailable: 'Automatic copy is unavailable; select and copy the displayed code.',
    privacy: 'No funds are collected here.', pending: 'Awaiting manual review.', statusLabel: 'Status service',
  },
  ar: {
    title: 'طلب الوصول إلى VIP',
    intro: 'اختر شريكاً، وأكّد التسجيل والإيداع، ثم أرسل طلبك مع صورة إثبات. يظل الوصول خاضعاً للموافقة اليدوية.',
    choose: 'اختر شركة مراهنات', code: 'الرمز الدقيق', copy: 'نسخ الرمز', copied: 'تم نسخ الرمز',
    guide: 'الدليل الحالي', signup: 'افتح موقع الشريك', registration: 'أؤكد أنني أكملت التسجيل مع هذا الشريك.',
    depositConfirmed: 'أؤكد أنني أجريت الإيداع المذكور.', deposit: 'الإيداع (دولار أمريكي)',
    accountId: 'معرّف حساب شركة المراهنات', accountHelp: 'لا تدخل كلمة مرور أو PIN أو رمز OTP أو وثيقة هوية.',
    proof: 'صورة إثبات الإيداع', proofHelp: 'صورة PNG أو JPEG فقط.',
    consent: 'أوافق على إرسال هذه المعلومات والإثبات إلى BTTSPredict لمراجعة طلب VIP يدوياً.',
    contact: 'اختر قناة للمتابعة', telegram: 'تيليجرام', whatsapp: 'واتساب',
    telegramId: 'اسم المستخدم أو معرّف تيليجرام', whatsappNumber: 'رقم واتساب مع رمز الدولة',
    followupConsent: 'أوافق على تواصل BTTSPredict معي عبر هذه القناة بخصوص هذا الطلب.',
    submit: 'إرسال الطلب', submitting: 'جارٍ الإرسال…', refresh: 'تحديث الحالة', checking: 'جارٍ التحقق من الحالة…',
    unavailable: 'خدمة الطلب غير متاحة', unavailableHelp: 'لم تؤكد الخدمة الطلب. لم يُحفظ شيء في هذه الجلسة. حاول لاحقاً.',
    submitted: 'أكد Worker استلام الطلب', received: 'مرجع الطلب', status: 'الحالة الحالية',
    statusUnavailable: 'تم حفظ المرجع في هذه الجلسة، لكن لا يمكن تحديث الحالة حالياً.',
    invite: 'المتابعة على تيليجرام', inviteNote: 'أكدت الخدمة الدعوة الخاصة.',
    invalidImage: 'اختر صورة PNG أو JPEG لا تتجاوز 1.4 ميغابايت.', required: 'أكمل الحقول والتأكيدات المطلوبة.',
    minimumDeposit: 'يجب أن يتراوح الإيداع المعلن بين 3 و100000 دولار أمريكي.', invalidContact: 'أدخل معرّف تيليجرام صالحاً أو رقم واتساب بالصيغة الدولية (+…).',
    requestFailed: 'لم يؤكد Worker استلام الطلب. لم يُنشأ إيصال في هذه الجلسة.', noAuto: 'إرسال الطلب أو الإيداع لا يفتح VIP تلقائياً.',
    clipboardUnavailable: 'النسخ التلقائي غير متاح؛ حدّد الرمز الظاهر وانسخه.',
    privacy: 'لا تُجمع أي أموال هنا.', pending: 'بانتظار المراجعة اليدوية.', statusLabel: 'خدمة الحالة',
  },
}

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function receiptFrom(value: ApiRecord): Pick<Receipt, 'requestId' | 'receiptToken'> | null {
  const requestId = value.requestId
  const receiptToken = value.receiptToken
  if (typeof requestId !== 'string' || !/^[0-9a-f-]{36}$/i.test(requestId)) return null
  if (typeof receiptToken !== 'string' || !/^[0-9a-f]{64}$/i.test(receiptToken)) return null
  return { requestId, receiptToken }
}

function extractStatus(value: ApiRecord): ApiRecord {
  if (isRecord(value.application)) return value.application
  if (isRecord(value.status)) return value.status
  return value
}

function validTelegramInvite(status: ApiRecord): string | null {
  if (
    status.status !== 'approved_pending_telegram' ||
    status.inviteReady !== true ||
    status.telegramInviteMode !== 'manual-approval-private-status' ||
    status.telegramEnabled !== false ||
    status.inviteSent !== false
  ) return null

  const candidate = status.inviteLink
  if (typeof candidate !== 'string') return null
  try {
    const url = new URL(candidate)
    if (url.protocol !== 'https:' || url.hostname !== 't.me' || url.username || url.password || url.port) return null
    if (!/^\/(?:\+[A-Za-z0-9_-]+|joinchat\/[A-Za-z0-9_-]+)\/?$/.test(url.pathname)) return null
    return url.href
  } catch {
    return null
  }
}

async function readJson(response: Response): Promise<ApiRecord> {
  const value: unknown = await response.json()
  if (!isRecord(value)) throw new Error('invalid-response')
  return value
}

class ApiResponseError extends Error {
  constructor(readonly statusCode: number) {
    super('worker-rejected-request')
  }
}

export default function VipApplication({ lang }: { lang: Locale }) {
  const copy = COPY[lang]
  const [partnerId, setPartnerId] = useState<PartnerId | ''>('')
  const [registrationConfirmed, setRegistrationConfirmed] = useState(false)
  const [depositConfirmed, setDepositConfirmed] = useState(false)
  const [depositUsd, setDepositUsd] = useState('')
  const [accountId, setAccountId] = useState('')
  const [proof, setProof] = useState<File | null>(null)
  const [consent, setConsent] = useState(false)
  const [contactChannel, setContactChannel] = useState<ContactChannel | ''>('')
  const [contactIdentifier, setContactIdentifier] = useState('')
  const [contactConsent, setContactConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(false)
  const [serviceUnavailable, setServiceUnavailable] = useState(false)
  const [statusUnavailable, setStatusUnavailable] = useState(false)
  const [error, setError] = useState('')
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [inviteUrl, setInviteUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const partner = useMemo(() => BOOKMAKERS.find((item) => item.id === partnerId), [partnerId])

  const refreshStatus = useCallback(async (savedReceipt: Receipt) => {
    setCheckingStatus(true)
    setStatusUnavailable(false)
    try {
      const response = await fetch(`${REQUESTS_URL}/${encodeURIComponent(savedReceipt.requestId)}/status`, {
        method: 'GET',
        headers: { Accept: 'application/json', Authorization: `Bearer ${savedReceipt.receiptToken}` },
        cache: 'no-store',
      })
      if (!response.ok) throw new Error('status-unavailable')
      const body = await readJson(response)
      const status = extractStatus(body)
      setStatusMessage(typeof status.status === 'string' ? status.status : '')
      setInviteUrl(validTelegramInvite(status))
      setServiceUnavailable(false)
    } catch {
      setInviteUrl(null)
      setStatusUnavailable(true)
    } finally {
      setCheckingStatus(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    try {
      const saved = sessionStorage.getItem(RECEIPT_SESSION_KEY)
      if (!saved) return () => { cancelled = true }
      const parsed: unknown = JSON.parse(saved)
      if (!isRecord(parsed) || typeof parsed.requestId !== 'string' || !/^[0-9a-f-]{36}$/i.test(parsed.requestId)
        || typeof parsed.receiptToken !== 'string' || !/^[0-9a-f]{64}$/i.test(parsed.receiptToken)
        || typeof parsed.submittedAt !== 'string') return () => { cancelled = true }
      const restored = { requestId: parsed.requestId, receiptToken: parsed.receiptToken, submittedAt: parsed.submittedAt }
      queueMicrotask(() => { if (!cancelled) setReceipt(restored) })
    } catch {
      // Storage can be disabled; never manufacture a receipt when it cannot be read.
    }
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!receipt) return
    const timeout = window.setTimeout(() => { void refreshStatus(receipt) }, 0)
    return () => window.clearTimeout(timeout)
  }, [receipt, refreshStatus])

  const handlePartnerChange = (value: string) => {
    const selected = BOOKMAKERS.find((item) => item.id === value)
    setPartnerId(selected?.id ?? '')
    setCopied(false)
  }

  const copyCode = async () => {
    if (!partner) return
    try {
      const copiedSuccessfully = await copyTextToClipboard(partner.promoCode)
      if (!copiedSuccessfully) {
        setError(copy.clipboardUnavailable)
        return
      }
      setError('')
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setError(COPY[lang].unavailableHelp)
    }
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setServiceUnavailable(false)
    if (!partner || !registrationConfirmed || !depositConfirmed || !consent || !proof || !accountId.trim() || !contactChannel) {
      setError(copy.required)
      return
    }
    const amount = Number(depositUsd)
    if (!Number.isFinite(amount) || amount < 3 || amount > 100_000) {
      setError(copy.minimumDeposit)
      return
    }
    if ((proof.type !== 'image/png' && proof.type !== 'image/jpeg') || proof.size < 1 || proof.size > 1_400_000) {
      setError(copy.invalidImage)
      return
    }
    const cleanedContact = contactIdentifier.trim().replace(/^@/, '')
    const validContact = contactChannel === 'telegram'
      ? /^[A-Za-z0-9_]{5,32}$/.test(cleanedContact)
      : /^\+[1-9][0-9]{7,14}$/.test(cleanedContact)
    if (!contactConsent || !validContact) {
      setError(validContact ? copy.required : copy.invalidContact)
      return
    }
    if (accountId.trim().length > 80) {
      setError(copy.required)
      return
    }

    setSubmitting(true)
    setInviteUrl(null)
    try {
      const body = new FormData()
      body.set('partner', partner.id)
      body.set('promoCode', partner.promoCode)
      body.set('registrationConfirmed', 'on')
      body.set('depositConfirmed', 'on')
      body.set('depositUsd', String(amount))
      body.set('accountIdentifier', accountId.trim())
      body.set('proof', proof, proof.name)
      body.set('consent', 'yes')
      body.set('contactChannel', contactChannel)
      body.set('contactConsent', 'yes')
      if (contactChannel === 'telegram') body.set('telegramUsername', cleanedContact)
      if (contactChannel === 'whatsapp') {
        body.set('whatsappPhone', cleanedContact)
        body.set('whatsappConsent', 'yes')
      }

      const response = await fetch(REQUESTS_URL, { method: 'POST', body, headers: { Accept: 'application/json' } })
      const result = await readJson(response)
      const identifiers = receiptFrom(result)
      if (!response.ok) throw new ApiResponseError(response.status)
      if (result.ok !== true || !identifiers) throw new Error('not-confirmed')

      const confirmedReceipt = { ...identifiers, submittedAt: new Date().toISOString() }
      setReceipt(confirmedReceipt)
      setStatusMessage('')
      try {
        sessionStorage.setItem(RECEIPT_SESSION_KEY, JSON.stringify(confirmedReceipt))
      } catch {
        // The confirmation remains visible for this page view even if storage is unavailable.
      }
    } catch (failure) {
      setServiceUnavailable(!(failure instanceof ApiResponseError) || failure.statusCode >= 500)
      setStatusUnavailable(false)
      setError(failure instanceof ApiResponseError && failure.statusCode < 500 ? copy.requestFailed : '')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="vip-application" className="vipx-application vipx-shell" aria-labelledby="vip-application-title" style={{ scrollMarginTop: '96px' }}>
      <header className="vipx-application__header">
        <span className="vipx-eyebrow"><i aria-hidden="true" />BTTSPredict VIP</span>
        <h2 id="vip-application-title">{copy.title}</h2>
        <p>{copy.intro}</p>
      </header>

      {receipt && (
        <div className="vipx-application__receipt" role="status" aria-live="polite">
          <strong>{copy.submitted}</strong>
          <span>{copy.received}: <code>{receipt.requestId}</code></span>
          <span>{copy.noAuto}</span>
          {statusMessage && <span>{copy.status}: <code>{statusMessage}</code></span>}
          {statusUnavailable && <span className="vipx-application__warning">{copy.statusUnavailable}</span>}
          <button type="button" className="vipx-btn vipx-btn--ghost vipx-btn--sm" onClick={() => void refreshStatus(receipt)} disabled={checkingStatus}>
            {checkingStatus ? copy.checking : copy.refresh}
          </button>
          {inviteUrl && <div className="vipx-application__invite"><p>{copy.inviteNote}</p><a className="vipx-btn vipx-btn--gold" href={inviteUrl} target="_blank" rel="noopener noreferrer">{copy.invite} ↗</a></div>}
        </div>
      )}

      {serviceUnavailable && (
        <div className="vipx-application__unavailable" role="alert">
          <strong>{copy.unavailable}</strong><p>{copy.unavailableHelp}</p>
        </div>
      )}

      <form className="vipx-application__form" onSubmit={submit} noValidate>
        <div className="vipx-application__field">
          <label htmlFor="vip-application-partner">{copy.choose}</label>
          <select id="vip-application-partner" value={partnerId} onChange={(event) => handlePartnerChange(event.target.value)} required>
            <option value="">—</option>
            {BOOKMAKERS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </div>

        {partner && <div className="vipx-application__partner-info">
          <div className="vipx-application__code"><span>{partner.name} · {copy.code}</span><strong>{partner.promoCode}</strong><button type="button" className="vipx-btn vipx-btn--ghost vipx-btn--sm" onClick={() => void copyCode()}>{copied ? copy.copied : copy.copy}</button></div>
          <div className="vipx-application__links">
            <a href={localizedPath(GUIDE_PATHS[partner.id], lang)} target="_blank" rel="noopener noreferrer">{copy.guide} ↗</a>
            <a href={partner.signupLink} target="_blank" rel="sponsored nofollow noopener noreferrer">{copy.signup} ↗</a>
          </div>
        </div>}

        <label className="vipx-application__check"><input type="checkbox" checked={registrationConfirmed} onChange={(event) => setRegistrationConfirmed(event.target.checked)} required /><span>{copy.registration}</span></label>
        <label className="vipx-application__check"><input type="checkbox" checked={depositConfirmed} onChange={(event) => setDepositConfirmed(event.target.checked)} required /><span>{copy.depositConfirmed}</span></label>

        <div className="vipx-application__grid">
          <div className="vipx-application__field">
            <label htmlFor="vip-application-deposit">{copy.deposit}</label>
            <input id="vip-application-deposit" type="number" min="3" max="100000" step="0.01" inputMode="decimal" value={depositUsd} onChange={(event) => setDepositUsd(event.target.value)} required />
          </div>
          <div className="vipx-application__field">
            <label htmlFor="vip-application-account">{copy.accountId}</label>
            <input id="vip-application-account" type="text" autoComplete="off" maxLength={80} value={accountId} onChange={(event) => setAccountId(event.target.value)} required />
            <small>{copy.accountHelp}</small>
          </div>
        </div>

        <div className="vipx-application__field">
          <label htmlFor="vip-application-proof">{copy.proof}</label>
          <input id="vip-application-proof" type="file" accept="image/png,image/jpeg" onChange={(event) => setProof(event.target.files?.[0] ?? null)} required />
          <small>{copy.proofHelp}</small>
        </div>

        <fieldset className="vipx-application__contact">
          <legend>{copy.contact}</legend>
          <div className="vipx-application__contact-options">
            <label><input type="radio" name="vip-followup-channel" value="telegram" checked={contactChannel === 'telegram'} onChange={() => { setContactChannel('telegram'); setContactIdentifier(''); setContactConsent(false) }} required />{copy.telegram}</label>
            <label><input type="radio" name="vip-followup-channel" value="whatsapp" checked={contactChannel === 'whatsapp'} onChange={() => { setContactChannel('whatsapp'); setContactIdentifier(''); setContactConsent(false) }} required />{copy.whatsapp}</label>
          </div>
          {contactChannel && <>
            <div className="vipx-application__field">
              <label htmlFor="vip-application-contact">{contactChannel === 'telegram' ? copy.telegramId : copy.whatsappNumber}</label>
              <input id="vip-application-contact" type={contactChannel === 'whatsapp' ? 'tel' : 'text'} autoComplete="off" maxLength={contactChannel === 'telegram' ? 33 : 16} value={contactIdentifier} onChange={(event) => setContactIdentifier(event.target.value)} required />
            </div>
            <label className="vipx-application__check"><input type="checkbox" checked={contactConsent} onChange={(event) => setContactConsent(event.target.checked)} required /><span>{copy.followupConsent}</span></label>
          </>}
        </fieldset>

        <label className="vipx-application__check vipx-application__check--consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required /><span>{copy.consent}</span></label>
        <p className="vipx-application__note">{copy.privacy} {copy.noAuto}</p>
        {error && <p className="vipx-application__error" role="alert">{error}</p>}
        <button type="submit" className="vipx-btn vipx-btn--gold vipx-application__submit" disabled={Boolean(receipt) || submitting || checkingStatus}>
          {submitting ? copy.submitting : copy.submit}<span aria-hidden="true">→</span>
        </button>
      </form>
    </section>
  )
}
