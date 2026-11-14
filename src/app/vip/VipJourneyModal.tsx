'use client'

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BOOKMAKERS } from '@/lib/constants'
import { trackAffiliateCodeCopy } from '@/lib/affiliateTracking'
import { copyTextToClipboard } from '@/lib/clipboard'
import { localizedPath, type Locale } from '@/lib/i18n'
import { useLanguage } from '@/components/bttsbet/LanguageSwitcher'
import { isValidTelegramInvite, VipTelegramInviteCta } from './VipTelegramInviteCta'

type PartnerId = typeof BOOKMAKERS[number]['id']
type Step = 1 | 2 | 3 | 4
type Receipt = { requestId: string; receiptToken: string }
type RequestStatus = {
  requestId: string
  status: string
  createdAt: string | null
  reviewedAt: string | null
  inviteReady: boolean
  inviteLink: string | null
  inviteExpiresAt: number | null
}
type DecodedProof = { image: CanvasImageSource; width: number; height: number; dispose: () => void }

const API = 'https://bttspredict-vip-production-api.luxxdii.workers.dev'
const MAX_PROOF_BYTES = 1_400_000
const STORAGE_KEY = 'bttspredict.vip.application.receipt.v1'
const GUIDE_PATHS: Record<PartnerId, string> = {
  '1xbet': '/code-promo-1xbet',
  linebet: '/code-promo-linebet-senegal',
  melbet: '/code-promo-melbet',
  '888starz': '/bonus-888starz-btts221',
}

const LABELS: Record<Locale, {
  title: string; intro: string; step: string; choose: string; priority: string
  copyCode: string; copied: string; guide: string; signup: string
  registerCheck: string; depositCheck: string; depositTitle: string; depositNote: string
  accountId: string; accountPlaceholder: string; accountHelp: string
  telegramTitle: string; telegramHelp: string; proofTitle: string; proofHelp: string; proofLocal: string; removeProof: string
  consent: string; privacy: string; submit: string; submitting: string; close: string; back: string; next: string
  waitTitle: string; requestSummary: string; pendingStatus: string; approvedStatus: string; rejectedStatus: string
  refresh: string; refreshing: string; refreshed: string; refreshError: string
  invite: string; inviteExpiry: string; submitError: string; duplicateError: string; rateError: string
  proofTypeError: string; proofSizeError: string; proofDimensionsError: string; proofDecodeError: string; proofCompressError: string
  partnerNames: Record<PartnerId, string>
}> = {
  fr: {
    title: 'Demande d’accès VIP',
    intro: 'Choisis ton bookmaker, utilise le code promo, confirme ton dépôt, puis envoie ta preuve et ton identifiant Telegram pour vérification.',
    step: 'Étape {current} sur 4', choose: 'Choisis un bookmaker', priority: 'Prioritaire',
    copyCode: 'Copie le code promo exact', copied: 'Copié', guide: 'Voir le guide promo', signup: 'Créer mon compte',
    registerCheck: 'Je confirme avoir terminé l’inscription avec le code promo choisi.',
    depositCheck: 'Je confirme avoir effectué le dépôt indiqué (minimum 3 $).',
    depositTitle: 'Montant du dépôt confirmé (USD)',
    depositNote: 'Effectue le dépôt chez le bookmaker, pas auprès de BTTSPredict. Vérifie les conditions actuelles de l’opérateur.',
    accountId: 'Identifiant du compte bookmaker', accountPlaceholder: 'Saisis l’identifiant de ton compte',
    accountHelp: 'Saisis uniquement l’identifiant du compte — jamais un mot de passe, PIN, code OTP ou pièce d’identité.',
    telegramTitle: 'Nom d’utilisateur Telegram', telegramHelp: 'Indique ton nom Telegram, avec ou sans @, pour le suivi de ta demande et l’accès privé après approbation.',
    proofTitle: 'Capture après confirmation du dépôt', proofHelp: 'Image PNG ou JPEG. Masque les informations inutiles. N’envoie jamais de mot de passe, PIN, code OTP, pièce d’identité ou données de carte.',
    proofLocal: 'Aperçu local uniquement; la capture sera envoyée avec ta demande.', removeProof: 'Retirer',
    consent: 'J’accepte que ces informations soient utilisées uniquement pour examiner ma demande VIP. Elles sont visibles par l’administration et supprimées au plus tard après 7 jours.',
    privacy: 'Votre demande est examinée avant l’activation de l’accès VIP. BTTSPredict ne collecte aucun dépôt.',
    submit: 'Envoyer ma demande', submitting: 'Envoi…', close: 'Fermer', back: 'Retour', next: 'Continuer',
    waitTitle: 'Suivi de ta demande', requestSummary: 'Résumé et statut de ta demande', pendingStatus: 'Ta demande est enregistrée et attend une vérification manuelle. L’accès VIP n’est pas encore activé.',
    approvedStatus: 'Ta demande a été validée. Ouvre ton lien privé individuel ci-dessous.', rejectedStatus: 'La demande n’a pas été validée. Garde ta référence si tu as une question.',
    refresh: 'Actualiser le statut de la demande', refreshing: 'Actualisation…', refreshed: 'Le statut a été actualisé.', refreshError: 'Le statut n’a pas pu être confirmé. Réessaie dans quelques instants.',
    invite: 'Rejoindre le VIP sur Telegram', inviteExpiry: 'Lien personnel limité à une place et valable pendant une durée limitée.',
    submitError: 'Le service n’a pas confirmé l’enregistrement. Vérifie les champs et réessaie.', duplicateError: 'Une demande est déjà en cours pour ce bookmaker et cet identifiant.', rateError: 'Trop de demandes ont été envoyées récemment. Réessaie plus tard.',
    proofTypeError: 'La capture doit être une image PNG ou JPEG.', proofSizeError: 'Le fichier dépasse la taille maximale autorisée. Choisis une image plus petite.',
    proofDimensionsError: 'Les dimensions de cette image sont trop grandes.', proofDecodeError: 'Le navigateur ne peut pas lire cette capture. Enregistre-la en PNG ou JPEG puis réessaie.',
    proofCompressError: 'Impossible de compresser la capture sous 1,4 Mo. Choisis une image plus petite.',
    partnerNames: { '1xbet': '1xBet', linebet: 'Linebet', melbet: 'MelBet', '888starz': '888Starz' },
  },
  en: {
    title: 'VIP access request',
    intro: 'Choose a bookmaker, use its promo code, confirm your deposit, then send your proof and Telegram username for review.',
    step: 'Step {current} of 4', choose: 'Choose a bookmaker', priority: 'Priority',
    copyCode: 'Copy the exact promo code', copied: 'Copied', guide: 'View promo guide', signup: 'Create my account',
    registerCheck: 'I confirm that I completed registration with the selected promo code.',
    depositCheck: 'I confirm that I made the stated deposit (minimum $3).',
    depositTitle: 'Confirmed deposit amount (USD)',
    depositNote: 'Make the deposit with the bookmaker, not BTTSPredict. Check the operator’s current terms.',
    accountId: 'Bookmaker account ID', accountPlaceholder: 'Enter your account ID',
    accountHelp: 'Enter only the account ID — never a password, PIN, OTP or identity document.',
    telegramTitle: 'Telegram username', telegramHelp: 'Enter your Telegram username, with or without @, for request follow-up and private access after approval.',
    proofTitle: 'Screenshot after deposit confirmation', proofHelp: 'PNG or JPEG image. Hide unnecessary information. Never send a password, PIN, OTP, identity document or card details.',
    proofLocal: 'Local preview only; the screenshot is sent with your request.', removeProof: 'Remove',
    consent: 'I agree that this information is used only to review my VIP request. It is visible to the administration and deleted within 7 days.',
    privacy: 'Your request is reviewed before VIP access is activated. BTTSPredict does not collect deposits.',
    submit: 'Send my request', submitting: 'Sending…', close: 'Close', back: 'Back', next: 'Continue',
    waitTitle: 'Request status', requestSummary: 'Application summary and status', pendingStatus: 'Your request is recorded and waiting for manual review. VIP access is not active yet.',
    approvedStatus: 'Your request was approved. Open your individual private link below.', rejectedStatus: 'The request was not approved. Keep your reference if you have a question.',
    refresh: 'Refresh request status', refreshing: 'Refreshing…', refreshed: 'The status was refreshed.', refreshError: 'The status could not be confirmed. Please try again shortly.',
    invite: 'Join VIP on Telegram', inviteExpiry: 'Personal link limited to one person and valid for a limited time.',
    submitError: 'The service did not confirm the request. Check the fields and try again.', duplicateError: 'A request for this bookmaker and account ID is already in progress.', rateError: 'Too many requests were sent recently. Please try again later.',
    proofTypeError: 'The screenshot must be a PNG or JPEG image.', proofSizeError: 'The file exceeds the maximum allowed size. Choose a smaller image.',
    proofDimensionsError: 'This image’s dimensions are too large.', proofDecodeError: 'The browser cannot read this screenshot. Save it as PNG or JPEG and try again.',
    proofCompressError: 'The screenshot could not be compressed below 1.4 MB. Choose a smaller image.',
    partnerNames: { '1xbet': '1xBet', linebet: 'Linebet', melbet: 'MelBet', '888starz': '888Starz' },
  },
  ar: {
    title: 'طلب الوصول إلى VIP',
    intro: 'اختر شركة مراهنات، واستخدم رمزها الترويجي، وأكّد الإيداع، ثم أرسل الإثبات واسم المستخدم على تيليغرام للمراجعة.',
    step: 'الخطوة {current} من 4', choose: 'اختر شركة مراهنات', priority: 'أولوية',
    copyCode: 'انسخ الرمز الترويجي الدقيق', copied: 'تم النسخ', guide: 'عرض دليل العرض', signup: 'أنشئ حسابي',
    registerCheck: 'أؤكد أنني أكملت التسجيل باستخدام الرمز الترويجي المختار.',
    depositCheck: 'أؤكد أنني أودعت المبلغ المذكور (الحد الأدنى 3 دولارات).',
    depositTitle: 'مبلغ الإيداع المؤكد (بالدولار)',
    depositNote: 'أودع لدى شركة المراهنات، وليس لدى BTTSPredict. تحقق من الشروط الحالية للمشغل.',
    accountId: 'معرّف حساب شركة المراهنات', accountPlaceholder: 'أدخل معرّف حسابك',
    accountHelp: 'أدخل معرّف الحساب فقط — لا ترسل كلمة مرور أو PIN أو رمز OTP أو وثيقة هوية.',
    telegramTitle: 'اسم المستخدم على تيليغرام', telegramHelp: 'أدخل اسم المستخدم على تيليغرام، مع @ أو بدونها، لمتابعة الطلب والوصول الخاص بعد الموافقة.',
    proofTitle: 'لقطة شاشة بعد تأكيد الإيداع', proofHelp: 'صورة PNG أو JPEG. أخفِ المعلومات غير الضرورية. لا ترسل كلمة مرور أو PIN أو رمز OTP أو وثيقة هوية أو بيانات بطاقة.',
    proofLocal: 'معاينة محلية فقط؛ تُرسل الصورة مع الطلب.', removeProof: 'إزالة',
    consent: 'أوافق على استخدام هذه المعلومات حصراً لمراجعة طلب VIP. يراها فريق الإدارة وتحذف خلال 7 أيام.',
    privacy: 'تتم مراجعة طلبك قبل تفعيل الوصول إلى VIP. لا تجمع BTTSPredict أي إيداعات.',
    submit: 'أرسل طلبي', submitting: 'جارٍ الإرسال…', close: 'إغلاق', back: 'رجوع', next: 'متابعة',
    waitTitle: 'حالة الطلب', requestSummary: 'ملخص الطلب وحالته', pendingStatus: 'تم تسجيل طلبك وهو بانتظار المراجعة اليدوية. لم يتم تفعيل وصول VIP بعد.',
    approvedStatus: 'تمت الموافقة على طلبك. افتح رابطك الخاص أدناه.', rejectedStatus: 'لم تتم الموافقة على الطلب. احتفظ بالمرجع إذا كان لديك سؤال.',
    refresh: 'حدّث حالة الطلب', refreshing: 'جارٍ التحديث…', refreshed: 'تم تحديث الحالة.', refreshError: 'تعذر تأكيد الحالة. حاول مجدداً بعد قليل.',
    invite: 'انضم إلى VIP عبر تيليغرام', inviteExpiry: 'رابط شخصي يسمح بانضمام شخص واحد وصالح لمدة محدودة.',
    submitError: 'لم تؤكد الخدمة تسجيل الطلب. تحقق من الحقول وحاول مجدداً.', duplicateError: 'يوجد طلب قيد المعالجة لهذا المشغل ومعرّف الحساب.', rateError: 'تم إرسال طلبات كثيرة مؤخراً. حاول مرة أخرى لاحقاً.',
    proofTypeError: 'يجب أن تكون لقطة الشاشة بصيغة PNG أو JPEG.', proofSizeError: 'يتجاوز الملف الحجم الأقصى المسموح. اختر صورة أصغر.',
    proofDimensionsError: 'أبعاد هذه الصورة كبيرة جداً.', proofDecodeError: 'تعذر على المتصفح قراءة هذه الصورة. احفظها بصيغة PNG أو JPEG ثم حاول مجدداً.',
    proofCompressError: 'تعذر ضغط الصورة إلى أقل من 1.4 ميغابايت. اختر صورة أصغر.',
    partnerNames: { '1xbet': '1xBet', linebet: 'Linebet', melbet: 'MelBet', '888starz': '888Starz' },
  },
}

function proofMime(file: File): 'image/png' | 'image/jpeg' | null {
  const type = String(file.type || '').toLowerCase()
  if (type === 'image/png') return 'image/png'
  if (type === 'image/jpeg' || type === 'image/jpg') return 'image/jpeg'
  if (!type && /\.png$/i.test(file.name)) return 'image/png'
  if ((!type || type === 'image/jpg') && /\.jpe?g$/i.test(file.name)) return 'image/jpeg'
  return null
}

function decodeWithImageElement(file: File): Promise<DecodedProof> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => resolve({
      image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      dispose: () => {
        URL.revokeObjectURL(url)
        image.onload = null
        image.onerror = null
        image.removeAttribute('src')
      },
    })
    image.onerror = () => {
      URL.revokeObjectURL(url)
      image.onload = null
      image.onerror = null
      reject(new Error('proof_decode'))
    }
    image.src = url
  })
}

async function decodeProof(file: File): Promise<DecodedProof> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file)
      return {
        image: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        dispose: () => bitmap.close(),
      }
    } catch { /* Mobile browsers can reject createImageBitmap; use an object-URL image fallback. */ }
  }
  return decodeWithImageElement(file)
}

function canvasJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('proof_compress')), 'image/jpeg', quality)
  })
}

async function prepareProof(file: File): Promise<File> {
  const mime = proofMime(file)
  if (!mime) throw new Error('proof_type')
  if (file.size < 1 || file.size > 12 * 1024 * 1024) throw new Error('proof_size')
  const source = file.type === mime ? file : new File([file], file.name || 'vip-proof', { type: mime })
  if (source.size <= MAX_PROOF_BYTES) return source

  const decoded = await decodeProof(source)
  try {
    const pixels = decoded.width * decoded.height
    if (!decoded.width || !decoded.height || pixels > 40_000_000) throw new Error('proof_dimensions')
    let scale = Math.min(1, 1800 / Math.max(decoded.width, decoded.height), Math.sqrt(10_000_000 / pixels))
    let quality = 0.86
    const canvas = document.createElement('canvas')
    for (let attempt = 0; attempt < 24; attempt += 1) {
      canvas.width = Math.max(1, Math.round(decoded.width * scale))
      canvas.height = Math.max(1, Math.round(decoded.height * scale))
      const context = canvas.getContext('2d', { alpha: false })
      if (!context) throw new Error('proof_compress')
      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(decoded.image, 0, 0, canvas.width, canvas.height)
      const blob = await canvasJpeg(canvas, quality)
      if (blob.size <= MAX_PROOF_BYTES) return new File([blob], 'vip-request-proof.jpg', { type: 'image/jpeg' })
      if (quality > 0.62) quality -= 0.08
      else {
        scale *= 0.82
        quality = 0.84
      }
    }
    throw new Error('proof_compress')
  } finally {
    decoded.dispose()
  }
}

function readReceipt(): Receipt | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null') as Partial<Receipt> | null
    return value && typeof value.requestId === 'string' && value.requestId && typeof value.receiptToken === 'string' && value.receiptToken
      ? { requestId: value.requestId, receiptToken: value.receiptToken }
      : null
  } catch {
    return null
  }
}

function parseDepositUsd(value: string): number {
  return Number(value.trim().replace(',', '.'))
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
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)
  const restoredRef = useRef(false)
  const [restoredReceipt] = useState<Receipt | null>(() => readReceipt())
  const [step, setStep] = useState<Step>(restoredReceipt ? 4 : 1)
  const [selectedBookmaker, setSelectedBookmaker] = useState<PartnerId | null>(null)
  const [registrationConfirmed, setRegistrationConfirmed] = useState(false)
  const [depositConfirmed, setDepositConfirmed] = useState(false)
  const [depositUsd, setDepositUsd] = useState('')
  const [accountId, setAccountId] = useState('')
  const [telegramUsername, setTelegramUsername] = useState('')
  const [contactConsent, setContactConsent] = useState(false)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [proofPreviewUrl, setProofPreviewUrl] = useState('')
  const [proofError, setProofError] = useState('')
  const [copied, setCopied] = useState(false)
  const [copiedPartnerId, setCopiedPartnerId] = useState<PartnerId | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isSubmittingRef = useRef(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [receipt, setReceipt] = useState<Receipt | null>(restoredReceipt)
  const [requestStatus, setRequestStatus] = useState<RequestStatus | null>(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusError, setStatusError] = useState(false)

  const partner = selectedBookmaker ? BOOKMAKERS.find((item) => item.id === selectedBookmaker) : undefined

  useEffect(() => { onCloseRef.current = onClose }, [onClose])
  useEffect(() => () => {
    if (proofPreviewUrl) URL.revokeObjectURL(proofPreviewUrl)
  }, [proofPreviewUrl])

  const refreshStatus = useCallback(async (savedReceipt: Receipt, announce = true) => {
    setIsRefreshing(true)
    setStatusError(false)
    setStatusMessage('')
    try {
      const response = await fetch(`${API}/requests/${encodeURIComponent(savedReceipt.requestId)}/status`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${savedReceipt.receiptToken}` },
        credentials: 'omit',
        cache: 'no-store',
      })
      const result = await response.json().catch(() => ({})) as Record<string, unknown>
      if (!response.ok || result.ok !== true || result.requestId !== savedReceipt.requestId || typeof result.status !== 'string'
        || typeof result.inviteReady !== 'boolean' || result.telegramInviteMode !== 'manual-approval-private-status'
        || result.telegramEnabled !== false || result.inviteSent !== false
        || (result.inviteReady && (result.status !== 'approved_pending_telegram' || !isValidTelegramInvite(result.inviteLink)))
        || (!result.inviteReady && result.inviteLink !== null)) throw new Error('status_unavailable')
      setRequestStatus({
        requestId: savedReceipt.requestId,
        status: result.status,
        createdAt: typeof result.createdAt === 'string' ? result.createdAt : null,
        reviewedAt: typeof result.reviewedAt === 'string' ? result.reviewedAt : null,
        inviteReady: result.inviteReady,
        inviteLink: result.inviteReady && isValidTelegramInvite(result.inviteLink) ? result.inviteLink : null,
        inviteExpiresAt: Number.isFinite(Number(result.inviteExpiresAt)) ? Number(result.inviteExpiresAt) : null,
      })
      if (announce) setStatusMessage(copy.refreshed)
    } catch {
      setStatusError(true)
      setStatusMessage(copy.refreshError)
    } finally {
      setIsRefreshing(false)
    }
  }, [copy])

  useEffect(() => {
    if (!isOpen) {
      restoredRef.current = false
      return
    }
    if (restoredRef.current || !receipt) return
    restoredRef.current = true
    void refreshStatus(receipt, false)
  }, [isOpen, receipt, refreshStatus])

  useEffect(() => {
    if (!isOpen) return
    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current()
      if (event.key !== 'Tab') return

      const focusable = [...(modalRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) || [])].filter((element) => !element.hasAttribute('hidden') && element.getAttribute('aria-hidden') !== 'true')
      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement
      if (event.shiftKey && (active === first || !modalRef.current?.contains(active))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (active === last || !modalRef.current?.contains(active))) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    const focusTimer = window.setTimeout(() => modalRef.current?.querySelector<HTMLElement>('button:not([disabled]), a[href], input:not([disabled])')?.focus(), 0)
    return () => {
      window.clearTimeout(focusTimer)
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      const previouslyFocused = previouslyFocusedRef.current
      if (previouslyFocused?.isConnected) previouslyFocused.focus()
      previouslyFocusedRef.current = null
    }
  }, [isOpen])

  const selectPartner = (id: PartnerId) => {
    setSelectedBookmaker(id)
    setRegistrationConfirmed(false)
    setDepositConfirmed(false)
    setDepositUsd('')
    setAccountId('')
    setTelegramUsername('')
    setContactConsent(false)
    setProofFile(null)
    setProofPreviewUrl('')
    setProofError('')
    setCopied(false)
    setCopiedPartnerId(null)
    setStatusMessage('')
  }

  const copyCode = async () => {
    if (!partner) return
    const ok = await copyTextToClipboard(partner.promoCode)
    if (!ok) {
      setStatusError(true)
      setStatusMessage(copy.submitError)
      return
    }
    trackAffiliateCodeCopy(partner.id, 'vip-access-flow')
    setCopiedPartnerId(partner.id)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const canContinue =
    (step === 1 && Boolean(partner)) ||
    (step === 2 && Boolean(partner) && copiedPartnerId === partner?.id) ||
    (step === 3 && registrationConfirmed && depositConfirmed && parseDepositUsd(depositUsd) >= 3 && parseDepositUsd(depositUsd) <= 100_000)

  const goBack = () => {
    if (step === 1) onCloseRef.current()
    else setStep((step - 1) as Step)
  }

  const next = () => {
    if (!canContinue || step >= 4) return
    setStep((step + 1) as Step)
    setStatusError(false)
    setStatusMessage('')
  }

  const handleProofChange = (file: File | null) => {
    setProofFile(file)
    setProofError('')
    if (!file) {
      setProofPreviewUrl('')
      return
    }
    if (!proofMime(file)) {
      setProofError(copy.proofTypeError)
      setProofPreviewUrl('')
      return
    }
    if (file.size > 12 * 1024 * 1024) {
      setProofError(copy.proofSizeError)
      setProofPreviewUrl('')
      return
    }
    setProofPreviewUrl(URL.createObjectURL(file))
  }

  const submitRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (step !== 4 || !partner || receipt || isSubmittingRef.current) return
    const form = event.currentTarget
    if (!form.reportValidity()) return
    const account = accountId.trim()
    const handle = telegramUsername.trim().replace(/^@/, '')
    if (account.length < 1 || account.length > 80 || /[\x00-\x1f\x7f]/.test(account)) {
      setStatusError(true)
      setStatusMessage(copy.submitError)
      return
    }
    if (!/^[A-Za-z0-9_]{5,32}$/.test(handle)) {
      setStatusError(true)
      setStatusMessage(copy.telegramHelp)
      return
    }
    if (!contactConsent || !proofFile || !proofMime(proofFile)) {
      setStatusError(true)
      setStatusMessage(!proofFile ? copy.proofTypeError : copy.submitError)
      return
    }

    isSubmittingRef.current = true
    setIsSubmitting(true)
    setStatusError(false)
    setStatusMessage(copy.submitting)
    try {
      const proof = await prepareProof(proofFile)
      const data = new FormData()
      data.set('partner', partner.id)
      data.set('promoCode', partner.promoCode)
      data.set('accountIdentifier', account)
      data.set('depositUsd', String(parseDepositUsd(depositUsd)))
      data.set('registrationConfirmed', 'on')
      data.set('depositConfirmed', 'on')
      data.set('contactChannel', 'telegram')
      data.set('telegramUsername', handle)
      data.set('consent', 'yes')
      data.set('contactConsent', 'yes')
      data.set('proof', proof, proof.name || 'vip-request-proof.jpg')

      const response = await fetch(`${API}/requests`, {
        method: 'POST',
        body: data,
        credentials: 'omit',
        cache: 'no-store',
      })
      const result = await response.json().catch(() => ({})) as Record<string, unknown>
      if (!response.ok || result.ok !== true || typeof result.requestId !== 'string' || typeof result.receiptToken !== 'string'
        || result.status !== 'pending_review' || result.telegramInviteMode !== 'manual-approval-private-status'
        || result.telegramEnabled !== false || result.inviteSent !== false || typeof result.ownerAlertSent !== 'boolean') {
        const message = response.status === 413 ? copy.proofSizeError
          : response.status === 409 ? copy.duplicateError
            : response.status === 429 ? copy.rateError
              : copy.submitError
        setStatusError(true)
        setStatusMessage(message)
        return
      }

      const savedReceipt = { requestId: result.requestId, receiptToken: result.receiptToken }
      setReceipt(savedReceipt)
      try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(savedReceipt)) } catch { /* Keep the reference visible for this session. */ }
      setRequestStatus({
        requestId: result.requestId,
        status: 'pending_review',
        createdAt: typeof result.createdAt === 'string' ? result.createdAt : new Date().toISOString(),
        reviewedAt: null,
        inviteReady: false,
        inviteLink: null,
        inviteExpiresAt: null,
      })
      setProofFile(null)
      setProofPreviewUrl('')
      setStatusMessage(result.ownerAlertSent
        ? `${copy.pendingStatus} · Référence : ${result.requestId}`
        : `${copy.pendingStatus} · Référence : ${result.requestId}`)
      await refreshStatus(savedReceipt, false)
    } catch (error) {
      const message = error instanceof Error && error.message === 'proof_type' ? copy.proofTypeError
        : error instanceof Error && error.message === 'proof_size' ? copy.proofSizeError
          : error instanceof Error && error.message === 'proof_dimensions' ? copy.proofDimensionsError
            : error instanceof Error && error.message === 'proof_decode' ? copy.proofDecodeError
              : error instanceof Error && error.message === 'proof_compress' ? copy.proofCompressError
                : copy.submitError
      setStatusError(true)
      setStatusMessage(message)
    } finally {
      isSubmittingRef.current = false
      setIsSubmitting(false)
    }
  }

  const statusLabel = requestStatus?.status === 'pending_review'
    ? lang === 'en' ? 'Pending review' : lang === 'ar' ? 'قيد المراجعة' : 'En attente d’examen'
    : requestStatus?.status === 'approved_pending_telegram'
      ? lang === 'en' ? 'Approved — Telegram access pending' : lang === 'ar' ? 'مقبول — بانتظار وصول تيليغرام' : 'Approuvée — accès Telegram en attente'
      : requestStatus?.status === 'rejected'
        ? lang === 'en' ? 'Rejected' : lang === 'ar' ? 'مرفوض' : 'Refusée'
        : requestStatus?.status || (lang === 'en' ? 'Loading…' : lang === 'ar' ? 'جارٍ التحميل…' : 'Chargement…')
  const statusCopy = requestStatus?.status === 'approved_pending_telegram' ? copy.approvedStatus
    : requestStatus?.status === 'rejected' ? copy.rejectedStatus
      : copy.pendingStatus
  const formatDate = (value: string | null) => {
    if (!value) return '—'
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(lang === 'ar' ? 'ar' : lang === 'en' ? 'en' : 'fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(event) => { if (event.target === event.currentTarget) onCloseRef.current() }}
          style={{ backgroundColor: 'rgba(5, 10, 17, 0.88)', backdropFilter: 'blur(8px)' }}
        >
          <motion.section
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="vip-access-title"
            aria-describedby="vip-access-intro"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
            data-testid="vip-access-flow"
            data-flow-steps="4"
            initial={{ scale: 0.97, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, y: 12 }}
            transition={{ duration: 0.18 }}
            className="vip-access-flow relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl"
            style={{ background: 'linear-gradient(155deg, #182331 0%, #0d141d 100%)', border: '1px solid rgba(127,162,198,.3)', boxShadow: '0 24px 80px rgba(0,0,0,.65)', color: '#F2F6FA' }}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" onClick={() => onCloseRef.current()} aria-label={copy.close} className="vip-access-flow__close">×</button>
            <div className="p-5 sm:p-7">
              <div className="flex items-start gap-3 pr-9">
                <span className="vip-access-flow__badge" aria-hidden="true">
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <div>
                  <h2 id="vip-access-title" className="text-lg sm:text-xl font-bold">{title || copy.title}</h2>
                  <p id="vip-access-intro" className="mt-1 text-xs leading-relaxed" style={{ color: '#AAB7C5' }}>{copy.intro}</p>
                </div>
              </div>

              <div className="mt-5" aria-label={copy.step.replace('{current}', String(step))}>
                <div className="flex items-center justify-between text-[11px] font-semibold" style={{ color: '#B9C6D4' }}>
                  <span>{copy.step.replace('{current}', String(step))}</span>
                  <span>{Math.round((step / 4) * 100)}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,.09)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${(step / 4) * 100}%`, background: 'linear-gradient(90deg,#6FA8FF,#34D399)' }} />
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
                    {statusMessage && <p className="vip-access-flow__message" role="status">{statusMessage}</p>}
                  </div>
                )}

                {step === 3 && partner && (
                  <div>
                    <h3 className="text-sm font-bold">3. {lang === 'en' ? 'Confirm registration and deposit' : lang === 'ar' ? 'تأكيد التسجيل والإيداع' : 'Confirme l’inscription et le dépôt'}</h3>
                    <a className="vip-access-flow__text-link" href={partner.signupLink} target="_blank" rel="sponsored nofollow noopener noreferrer">{copy.signup} · {copy.partnerNames[partner.id]} ↗</a>
                    <label className="vip-access-flow__checkrow"><input type="checkbox" checked={registrationConfirmed} onChange={(event) => setRegistrationConfirmed(event.target.checked)} /> <span>{copy.registerCheck}</span></label>
                    <label className="vip-access-flow__field-label" htmlFor="vip-deposit-usd">{copy.depositTitle}</label>
                    <input
                      id="vip-deposit-usd" type="text" inputMode="decimal" pattern="[0-9]+([,.][0-9]{1,2})?" required
                      value={depositUsd} placeholder="3.00" onChange={(event) => setDepositUsd(event.target.value)}
                      className="vip-access-flow__input"
                    />
                    <p className="mt-2 text-[11px] leading-relaxed" style={{ color: '#AAB7C5' }}>{copy.depositNote}</p>
                    <label className="vip-access-flow__checkrow"><input type="checkbox" checked={depositConfirmed} onChange={(event) => setDepositConfirmed(event.target.checked)} /> <span>{copy.depositCheck}</span></label>
                  </div>
                )}

                {step === 4 && !receipt && partner && (
                  <form id="vip-request-form" onSubmit={submitRequest} aria-busy={isSubmitting}>
                    <h3 className="text-sm font-bold">4. {lang === 'en' ? 'Telegram, account ID and proof' : lang === 'ar' ? 'تيليغرام ومعرّف الحساب والإثبات' : 'Telegram, identifiant et capture'}</h3>
                    <label htmlFor="vip-bookmaker-account-id" className="vip-access-flow__field-label">{copy.accountId}</label>
                    <input
                      id="vip-bookmaker-account-id" name="accountIdentifier" type="text" autoComplete="off" spellCheck={false}
                      minLength={1} maxLength={80} required value={accountId} placeholder={copy.accountPlaceholder}
                      onChange={(event) => setAccountId(event.target.value)} className="vip-access-flow__input"
                    />
                    <p className="mt-2 text-[11px] leading-relaxed" style={{ color: '#AAB7C5' }}>{copy.accountHelp}</p>

                    <label htmlFor="vip-telegram-username" className="vip-access-flow__field-label">{copy.telegramTitle}</label>
                    <input
                      id="vip-telegram-username" name="telegramUsername" type="text" autoComplete="off" spellCheck={false}
                      minLength={5} maxLength={33} pattern="@?[A-Za-z0-9_]{5,32}" required value={telegramUsername}
                      placeholder="@ton_nom" onChange={(event) => setTelegramUsername(event.target.value)} className="vip-access-flow__input"
                    />
                    <p className="mt-2 text-[11px] leading-relaxed" style={{ color: '#AAB7C5' }}>{copy.telegramHelp}</p>

                    <label htmlFor="vip-proof-file" className="vip-access-flow__field-label">{copy.proofTitle}</label>
                    <input
                      id="vip-proof-file" name="proof" type="file" accept="image/png,image/jpeg" required
                      onChange={(event) => handleProofChange(event.currentTarget.files?.[0] || null)}
                      className="vip-access-flow__file"
                    />
                    <p className="mt-2 text-[11px] leading-relaxed" style={{ color: '#AAB7C5' }}>{copy.proofHelp}</p>
                    {proofFile && proofPreviewUrl && (
                      <div className="vip-access-flow__proof" data-testid="vip-proof-preview">
                        <img src={proofPreviewUrl} alt={lang === 'en' ? 'Local preview of deposit screenshot' : lang === 'ar' ? 'معاينة محلية لصورة الإيداع' : 'Aperçu local de la capture du dépôt'} onError={() => setProofError(copy.proofDecodeError)} />
                        <div className="vip-access-flow__proof-copy">
                          <strong>{proofFile.name || copy.proofTitle}</strong>
                          <small>{copy.proofLocal}</small>
                        </div>
                        <button type="button" className="vip-access-flow__remove-proof" onClick={() => {
                          setProofFile(null)
                          setProofPreviewUrl('')
                          setProofError('')
                          const input = document.querySelector<HTMLInputElement>('#vip-proof-file')
                          if (input) input.value = ''
                        }}>{copy.removeProof}</button>
                      </div>
                    )}
                    {proofError && <p className="vip-access-flow__message" role="alert">{proofError}</p>}
                    <label className="vip-access-flow__checkrow"><input type="checkbox" required checked={contactConsent} onChange={(event) => setContactConsent(event.target.checked)} /> <span>{copy.consent}</span></label>
                    <p className="mt-2 text-[11px] leading-relaxed" style={{ color: '#AAB7C5' }}>{copy.privacy}</p>
                    {statusMessage && !isSubmitting && <p className="vip-access-flow__message" role="alert" data-error={String(statusError)}>{statusMessage}</p>}
                  </form>
                )}

                {step === 4 && receipt && (
                  <section className="vip-access-flow__status" aria-labelledby="vip-request-status-title">
                    <h3 id="vip-request-status-title" className="text-sm font-bold">{copy.requestSummary}</h3>
                    <p className="mt-2 text-xs leading-relaxed" style={{ color: '#AAB7C5' }}>{statusCopy}</p>
                    <dl className="vip-access-flow__receipt">
                      <div><dt>{lang === 'en' ? 'Reference' : lang === 'ar' ? 'المرجع' : 'Référence'}</dt><dd>{receipt.requestId}</dd></div>
                      <div><dt>{lang === 'en' ? 'Status' : lang === 'ar' ? 'الحالة' : 'Statut'}</dt><dd>{statusLabel}</dd></div>
                      <div><dt>{lang === 'en' ? 'Submitted' : lang === 'ar' ? 'تاريخ الإرسال' : 'Envoyée le'}</dt><dd>{formatDate(requestStatus?.createdAt || null)}</dd></div>
                      <div><dt>{lang === 'en' ? 'Reviewed' : lang === 'ar' ? 'تاريخ المراجعة' : 'Examinée le'}</dt><dd>{formatDate(requestStatus?.reviewedAt || null)}</dd></div>
                    </dl>
                    {statusMessage && <p className="vip-access-flow__message" role="status" data-error={String(statusError)}>{statusMessage}</p>}
                    <button type="button" onClick={() => void refreshStatus(receipt)} disabled={isRefreshing} aria-busy={isRefreshing} className="vip-access-flow__refresh">
                      {isRefreshing ? copy.refreshing : copy.refresh}
                    </button>
                    {requestStatus?.status === 'approved_pending_telegram' && requestStatus.inviteReady && isValidTelegramInvite(requestStatus.inviteLink) && (
                      <div className="vip-access-flow__invite">
                        <VipTelegramInviteCta status={requestStatus.status} inviteReady={requestStatus.inviteReady} inviteLink={requestStatus.inviteLink} lang={lang} label={copy.invite} />
                        <small>{Number.isFinite(Number(requestStatus.inviteExpiresAt)) && Number(requestStatus.inviteExpiresAt) > 0
                          ? `${copy.inviteExpiry} ${formatDate(new Date(Number(requestStatus.inviteExpiresAt) * 1000).toISOString())}`
                          : copy.inviteExpiry}</small>
                      </div>
                    )}
                  </section>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 border-t pt-4" style={{ borderColor: 'rgba(255,255,255,.1)' }}>
                <button type="button" onClick={receipt ? () => onCloseRef.current() : goBack} className="vip-access-flow__secondary">{receipt ? copy.close : step === 1 ? copy.close : copy.back}</button>
                {step === 4 && !receipt && isSubmitting && <span className="sr-only" role="status" aria-live="polite">{copy.submitting}</span>}
                {step < 4 ? (
                  <button type="button" disabled={!canContinue} onClick={next} className="vip-access-flow__primary" style={{ opacity: canContinue ? 1 : 0.48 }}>{copy.next} <span aria-hidden="true">→</span></button>
                ) : receipt ? (
                  <span className="vip-access-flow__manual-label">{copy.waitTitle}</span>
                ) : (
                  <button type="submit" form="vip-request-form" disabled={isSubmitting || !proofFile || Boolean(proofError)} aria-busy={isSubmitting} className="vip-access-flow__primary" style={{ opacity: isSubmitting || !proofFile || Boolean(proofError) ? 0.58 : 1 }}>
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        <span>{copy.submitting}</span>
                      </span>
                    ) : copy.submit}
                    <span aria-hidden="true">→</span>
                  </button>
                )}
              </div>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
