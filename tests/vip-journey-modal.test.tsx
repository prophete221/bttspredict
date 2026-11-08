// @vitest-environment jsdom
import { readFileSync } from 'node:fs'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import VipJourneyModal from '@/app/vip/VipJourneyModal'

const { language } = vi.hoisted(() => ({ language: { current: 'fr' as 'fr' | 'en' | 'ar' } }))

vi.mock('@/components/bttsbet/LanguageSwitcher', () => ({ useLanguage: () => ({ lang: language.current }) }))
vi.mock('@/lib/affiliateTracking', () => ({ trackAffiliateCodeCopy: vi.fn() }))
vi.mock('@/lib/clipboard', () => ({ copyTextToClipboard: vi.fn(async () => true) }))
vi.mock('framer-motion', async () => {
  const React = await import('react')
  const passthrough = (tag: 'div' | 'section') => React.forwardRef<HTMLElement, Record<string, unknown> & { children?: React.ReactNode }>((props, ref) => {
    const { initial: _initial, animate: _animate, exit: _exit, transition: _transition, ...rest } = props
    return React.createElement(tag, { ...rest, ref }, props.children as React.ReactNode)
  })
  return {
    motion: { div: passthrough('div'), section: passthrough('section') },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  }
})

const API = 'https://bttspredict-vip-production-api.luxxdii.workers.dev'
const STORAGE_KEY = 'bttspredict.vip.application.receipt.v1'
type Locale = 'fr' | 'en' | 'ar'

function Harness({ initialOpen = true, onClose }: { initialOpen?: boolean; onClose?: () => void }) {
  const [open, setOpen] = useState(initialOpen)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Ouvrir le parcours</button>
      <VipJourneyModal isOpen={open} onClose={() => { setOpen(false); onClose?.() }} />
    </>
  )
}

function renderHarness(locale: Locale = 'fr', initialOpen = true) {
  language.current = locale
  return render(<Harness initialOpen={initialOpen} />)
}

function stepText(locale: Locale, n: number) {
  return locale === 'en' ? `Step ${n} of 4` : locale === 'ar' ? `الخطوة ${n} من 4` : `Étape ${n} sur 4`
}

function response(body: Record<string, unknown>, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => body }
}

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => { resolve = res; reject = rej })
  return { promise, resolve, reject }
}

async function reachStep3(locale: Locale = 'fr') {
  renderHarness(locale)
  const dialog = screen.getByRole('dialog')
  expect(within(dialog).getByText(stepText(locale, 1))).toBeTruthy()
  fireEvent.click(within(dialog).getByRole('button', { name: /Linebet/ }))
  fireEvent.click(within(dialog).getByRole('button', { name: locale === 'ar' ? 'متابعة' : locale === 'en' ? 'Continue' : 'Continuer' }))
  expect(within(dialog).getByText(stepText(locale, 2))).toBeTruthy()
  fireEvent.click(within(dialog).getByRole('button', { name: /Copie le code promo exact|Copy the exact promo code|انسخ الرمز الترويجي الدقيق/ }))
  await screen.findByText(locale === 'en' ? 'Copied' : locale === 'ar' ? 'تم النسخ' : 'Copié')
  fireEvent.click(within(dialog).getByRole('button', { name: locale === 'ar' ? 'متابعة' : locale === 'en' ? 'Continue' : 'Continuer' }))
  expect(within(dialog).getByText(stepText(locale, 3))).toBeTruthy()
  return dialog
}

async function reachStep4(locale: Locale = 'fr') {
  const dialog = await reachStep3(locale)
  const nextLabel = locale === 'ar' ? 'متابعة' : locale === 'en' ? 'Continue' : 'Continuer'
  const checks = within(dialog).getAllByRole('checkbox')
  fireEvent.click(checks[0])
  fireEvent.change(within(dialog).getByLabelText(locale === 'en' ? 'Confirmed deposit amount (USD)' : locale === 'ar' ? 'مبلغ الإيداع المؤكد (بالدولار)' : 'Montant du dépôt confirmé (USD)'), { target: { value: '3.00' } })
  fireEvent.click(checks[1])
  fireEvent.click(within(dialog).getByRole('button', { name: nextLabel }))
  expect(within(dialog).getByText(stepText(locale, 4))).toBeTruthy()
  return dialog
}

function submitFormForTest(dialog: HTMLElement) {
  const form = dialog.querySelector('form')!
  // Constraint-validation UI is browser-native; the filled values and the
  // component's own validation still execute in this JSDOM test.
  vi.spyOn(form, 'reportValidity').mockReturnValue(true)
  fireEvent.submit(form)
}

beforeEach(() => {
  sessionStorage.clear()
  vi.stubGlobal('fetch', vi.fn())
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:vip-local-preview')
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  document.body.style.overflow = ''
})

describe('parcours VIP à quatre étapes, interactions localisées', () => {
  it.each([
    ['fr', 'Continuer', 'Retour'] as const,
    ['en', 'Continue', 'Back'] as const,
    ['ar', 'متابعة', 'رجوع'] as const,
  ])('sélectionne un partenaire et permet progression/retour en %s', async (locale, next, back) => {
    renderHarness(locale)
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText(stepText(locale, 1))).toBeTruthy()
    const linebet = within(dialog).getByRole('button', { name: /Linebet/ })
    fireEvent.click(linebet)
    expect(linebet.getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(within(dialog).getByRole('button', { name: next }))
    expect(within(dialog).getByText(stepText(locale, 2))).toBeTruthy()
    expect(within(dialog).getByText('Linebet')).toBeTruthy()
    fireEvent.click(within(dialog).getByRole('button', { name: back }))
    expect(within(dialog).getByText(stepText(locale, 1))).toBeTruthy()
    expect(within(dialog).getByRole('button', { name: /Linebet/ }).getAttribute('aria-pressed')).toBe('true')
    expect(fetch).not.toHaveBeenCalled()
  })

  it.each([
    ['fr', 'Continuer', 'Copie le code promo exact'] as const,
    ['en', 'Continue', 'Copy the exact promo code'] as const,
    ['ar', 'متابعة', 'انسخ الرمز الترويجي الدقيق'] as const,
  ])('valide la copie, les confirmations et le dépôt minimal avant l’étape 4 en %s', async (locale, next, copyLabel) => {
    const dialog = await reachStep3(locale)
    const continueButton = within(dialog).getByRole('button', { name: next }) as HTMLButtonElement
    expect(continueButton.disabled).toBe(true)
    const checks = within(dialog).getAllByRole('checkbox')
    fireEvent.click(checks[0])
    fireEvent.change(within(dialog).getByLabelText(locale === 'en' ? 'Confirmed deposit amount (USD)' : locale === 'ar' ? 'مبلغ الإيداع المؤكد (بالدولار)' : 'Montant du dépôt confirmé (USD)'), { target: { value: '2.99' } })
    fireEvent.click(checks[1])
    expect(continueButton.disabled).toBe(true)
    fireEvent.change(within(dialog).getByLabelText(locale === 'en' ? 'Confirmed deposit amount (USD)' : locale === 'ar' ? 'مبلغ الإيداع المؤكد (بالدولار)' : 'Montant du dépôt confirmé (USD)'), { target: { value: '3' } })
    expect(continueButton.disabled).toBe(false)
    fireEvent.click(continueButton)
    expect(within(dialog).getByText(stepText(locale, 4))).toBeTruthy()
    expect(within(dialog).getByLabelText(locale === 'en' ? 'Bookmaker account ID' : locale === 'ar' ? 'معرّف حساب شركة المراهنات' : 'Identifiant du compte bookmaker')).toBeTruthy()
    expect(within(dialog).queryByRole('button', { name: copyLabel })).toBeNull()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('valide type et taille du fichier, garde l’aperçu local et bloque un formulaire incomplet', async () => {
    const dialog = await reachStep4()
    const proof = within(dialog).getByLabelText('Capture après confirmation du dépôt') as HTMLInputElement
    const invalid = new File(['not an image'], 'notes.txt', { type: 'text/plain' })
    fireEvent.change(proof, { target: { files: [invalid] } })
    expect(within(dialog).getByRole('alert').textContent).toContain('PNG ou JPEG')
    expect((within(dialog).getByRole('button', { name: 'Envoyer ma demande' }) as HTMLButtonElement).disabled).toBe(true)

    const tooLarge = new File([new Uint8Array(12 * 1024 * 1024 + 1)], 'large.png', { type: 'image/png' })
    fireEvent.change(proof, { target: { files: [tooLarge] } })
    expect(within(dialog).getByRole('alert').textContent).toContain('taille maximale')
    expect(fetch).not.toHaveBeenCalled()

    const image = new File([new Uint8Array([137, 80, 78, 71])], 'deposit.png', { type: 'image/png' })
    fireEvent.change(proof, { target: { files: [image] } })
    expect(within(dialog).getByTestId('vip-proof-preview')).toBeTruthy()
    expect(within(dialog).getByText(/Aperçu local uniquement/)).toBeTruthy()
    expect((within(dialog).getByRole('button', { name: 'Envoyer ma demande' }) as HTMLButtonElement).disabled).toBe(false)
    expect(fetch).not.toHaveBeenCalled()
  })

  it.each([
    ['PNG', 'deposit.png', 'image/png', new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])],
    ['JPEG', 'deposit.jpg', 'image/jpeg', new Uint8Array([255, 216, 255, 217])],
  ] as const)('garde les champs saisis lors d’un échec d’aperçu et d’un type invalide (%s)', async (_format, name, type, bytes) => {
    const dialog = await reachStep4()
    const account = within(dialog).getByLabelText('Identifiant du compte bookmaker') as HTMLInputElement
    const telegram = within(dialog).getByLabelText('Nom d’utilisateur Telegram') as HTMLInputElement
    const proofInput = within(dialog).getByLabelText('Capture après confirmation du dépôt') as HTMLInputElement
    fireEvent.change(account, { target: { value: 'account-kept' } })
    fireEvent.change(telegram, { target: { value: '@kept_user' } })

    const syntheticImage = new File([bytes], name, { type })
    fireEvent.change(proofInput, { target: { files: [syntheticImage] } })
    const preview = within(dialog).getByTestId('vip-proof-preview').querySelector('img')!
    expect(preview.getAttribute('src')).toBe('blob:vip-local-preview')
    fireEvent.error(preview)
    expect(within(dialog).getByRole('alert').textContent).toContain('Le navigateur ne peut pas lire')
    expect(account.value).toBe('account-kept')
    expect(telegram.value).toBe('@kept_user')
    expect(proofInput.files?.[0]).toBe(syntheticImage)
    expect((within(dialog).getByRole('button', { name: 'Envoyer ma demande' }) as HTMLButtonElement).disabled).toBe(true)

    fireEvent.change(proofInput, { target: { files: [syntheticImage] } })
    expect(within(dialog).queryByRole('alert')).toBeNull()
    expect((within(dialog).getByRole('button', { name: 'Envoyer ma demande' }) as HTMLButtonElement).disabled).toBe(false)
    expect(account.value).toBe('account-kept')
    expect(telegram.value).toBe('@kept_user')

    fireEvent.change(proofInput, { target: { files: [new File(['not an image'], 'wrong.txt', { type: 'text/plain' })] } })
    expect(within(dialog).getByRole('alert').textContent).toContain('PNG ou JPEG')
    expect(account.value).toBe('account-kept')
    expect(telegram.value).toBe('@kept_user')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('autorise les aperçus blob uniquement dans la politique CSP VIP', () => {
    const htaccess = readFileSync('public/.htaccess', 'utf8')
    const vipPolicy = htaccess.split('\n').find((line) => line.includes('Content-Security-Policy') && line.includes('env=vip_api_csp'))
    const generalPolicy = htaccess.split('\n').find((line) => line.includes('Content-Security-Policy') && line.includes('env=!vip_api_csp'))
    expect(vipPolicy).toContain("img-src 'self' blob:")
    expect(generalPolicy).not.toContain("img-src 'self' blob:")
  })
})

describe('gestion du focus modal', () => {
  it('confine Tab/Shift+Tab dans le modal et restaure le focus au déclencheur à la fermeture', async () => {
    renderHarness('fr', false)
    const opener = screen.getByRole('button', { name: 'Ouvrir le parcours' })
    opener.focus()
    fireEvent.click(opener)
    const dialog = screen.getByRole('dialog')
    await waitFor(() => expect(document.activeElement).toBe(dialog.querySelector('.vip-access-flow__close')))
    const focusable = [...dialog.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    const last = focusable[focusable.length - 1]
    last.focus()
    fireEvent.keyDown(window, { key: 'Tab' })
    expect(document.activeElement).toBe(focusable[0])
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(last)

    fireEvent.keyDown(window, { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(document.activeElement).toBe(opener)
  })

  it('conserve la fermeture au clic sur le fond et restaure le focus', async () => {
    renderHarness('fr', false)
    const opener = screen.getByRole('button', { name: 'Ouvrir le parcours' })
    opener.focus()
    fireEvent.click(opener)
    const dialog = screen.getByRole('dialog')
    fireEvent.click(dialog.parentElement!)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(document.activeElement).toBe(opener)
  })
})

describe('transport strictement simulé vers l’API de production', () => {
  it('ne lit aucun statut et n’affiche aucun reçu tant qu’aucune demande n’a été soumise', async () => {
    const dialog = await reachStep4()
    expect(within(dialog).queryByRole('heading', { name: 'Résumé et statut de ta demande' })).toBeNull()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('envoie uniquement via le fetch mocké, affiche le reçu puis le lien de suivi approuvé', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock
      .mockResolvedValueOnce(response({ ok: true, requestId: 'VIP-TEST-42', receiptToken: 'mock-receipt-token', status: 'pending_review', telegramInviteMode: 'manual-approval-private-status', telegramEnabled: false, inviteSent: false, ownerAlertSent: false, createdAt: '2026-11-08T10:00:00.000Z' }) as unknown as Response)
      .mockResolvedValueOnce(response({ ok: true, requestId: 'VIP-TEST-42', status: 'pending_review', inviteReady: false, inviteLink: null, inviteExpiresAt: null, telegramInviteMode: 'manual-approval-private-status', telegramEnabled: false, inviteSent: false, createdAt: '2026-11-08T10:00:00.000Z' }) as unknown as Response)
      .mockResolvedValueOnce(response({ ok: true, requestId: 'VIP-TEST-42', status: 'pending_review', inviteReady: false, inviteLink: null, inviteExpiresAt: null, telegramInviteMode: 'manual-approval-private-status', telegramEnabled: false, inviteSent: false, createdAt: '2026-11-08T10:00:00.000Z' }) as unknown as Response)
      .mockResolvedValueOnce(response({ ok: true, requestId: 'VIP-TEST-42', status: 'approved_pending_telegram', inviteReady: true, inviteLink: 'https://t.me/+MockInvite_42', inviteExpiresAt: 1790000000, telegramInviteMode: 'manual-approval-private-status', telegramEnabled: false, inviteSent: false, createdAt: '2026-11-08T10:00:00.000Z', reviewedAt: '2026-11-08T10:30:00.000Z' }) as unknown as Response)

    const dialog = await reachStep4()
    fireEvent.change(within(dialog).getByLabelText('Identifiant du compte bookmaker'), { target: { value: 'account-123' } })
    fireEvent.change(within(dialog).getByLabelText('Nom d’utilisateur Telegram'), { target: { value: '@test_user' } })
    const proof = new File([new Uint8Array([137, 80, 78, 71])], 'deposit.png', { type: 'image/png' })
    fireEvent.change(within(dialog).getByLabelText('Capture après confirmation du dépôt'), { target: { files: [proof] } })
    fireEvent.click(within(dialog).getByRole('checkbox'))
    submitFormForTest(dialog)

    await screen.findByText(/VIP-TEST-42/)
    const submittedDialog = screen.getByRole('dialog')
    expect(within(submittedDialog).getByRole('heading', { name: 'Résumé et statut de ta demande' })).toBeTruthy()
    expect(within(submittedDialog).getByText('Référence')).toBeTruthy()
    expect(within(submittedDialog).getByText('Statut')).toBeTruthy()
    expect(within(submittedDialog).getByText('En attente d’examen')).toBeTruthy()
    expect(within(submittedDialog).getByRole('button', { name: 'Actualiser le statut de la demande' })).toBeTruthy()
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3))
    expect(sessionStorage.getItem(STORAGE_KEY)).toContain('VIP-TEST-42')
    const post = fetchMock.mock.calls[0]
    expect(post[0]).toBe(`${API}/requests`)
    expect((post[1] as RequestInit).method).toBe('POST')
    const body = (post[1] as RequestInit).body as FormData
    expect(body.get('partner')).toBe('linebet')
    expect(body.get('accountIdentifier')).toBe('account-123')
    expect(body.get('depositUsd')).toBe('3')
    expect(body.get('registrationConfirmed')).toBe('on')
    expect(body.get('depositConfirmed')).toBe('on')
    expect(body.get('consent')).toBe('yes')
    expect(body.get('proof')).toBeInstanceOf(File)
    expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([
      `${API}/requests`,
      `${API}/requests/VIP-TEST-42/status`,
      `${API}/requests/VIP-TEST-42/status`,
    ])

    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Actualiser le statut de la demande' }))
    const invite = await screen.findByRole('link', { name: /Ouvrir Telegram et rejoindre le canal VIP/ })
    expect(invite.getAttribute('href')).toBe('https://t.me/+MockInvite_42')
    expect(within(screen.getByRole('dialog')).getByText('Approuvée — accès Telegram en attente')).toBeTruthy()
    expect(fetchMock).toHaveBeenCalledTimes(4)
    expect(String(fetchMock.mock.calls[3][0])).toBe(`${API}/requests/VIP-TEST-42/status`)
    expect(fetchMock.mock.calls.every(([url]) => String(url).startsWith(API))).toBe(true)
  })

  it('restaure un reçu sauvegardé et actualise son statut sans créer de nouvelle demande', async () => {
    const fetchMock = vi.mocked(fetch)
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ requestId: 'VIP-RESTORED-7', receiptToken: 'mock-restored-token' }))
    fetchMock
      .mockResolvedValueOnce(response({ ok: true, requestId: 'VIP-RESTORED-7', status: 'pending_review', inviteReady: false, inviteLink: null, inviteExpiresAt: null, telegramInviteMode: 'manual-approval-private-status', telegramEnabled: false, inviteSent: false, createdAt: '2026-11-08T10:00:00.000Z' }) as unknown as Response)
      .mockResolvedValueOnce(response({ ok: true, requestId: 'VIP-RESTORED-7', status: 'approved_pending_telegram', inviteReady: true, inviteLink: 'https://t.me/+RestoredInvite_7', inviteExpiresAt: 1790000000, telegramInviteMode: 'manual-approval-private-status', telegramEnabled: false, inviteSent: false, createdAt: '2026-11-08T10:00:00.000Z', reviewedAt: '2026-11-08T10:30:00.000Z' }) as unknown as Response)

    renderHarness('fr')
    const dialog = screen.getByRole('dialog')
    expect(await within(dialog).findByRole('heading', { name: 'Résumé et statut de ta demande' })).toBeTruthy()
    expect(within(dialog).getByText('VIP-RESTORED-7')).toBeTruthy()
    expect(within(dialog).getByText('En attente d’examen')).toBeTruthy()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Actualiser le statut de la demande' }))
    expect(await within(dialog).findByText('Approuvée — accès Telegram en attente')).toBeTruthy()
    expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([
      `${API}/requests/VIP-RESTORED-7/status`,
      `${API}/requests/VIP-RESTORED-7/status`,
    ])
    expect(fetchMock.mock.calls.every(([, init]) => (init as RequestInit).method !== 'POST')).toBe(true)
  })

  it.each([
    ['fr', 'Identifiant du compte bookmaker', 'Nom d’utilisateur Telegram', 'Capture après confirmation du dépôt', 'Envoi…'] as const,
    ['en', 'Bookmaker account ID', 'Telegram username', 'Screenshot after deposit confirmation', 'Sending…'] as const,
    ['ar', 'معرّف حساب شركة المراهنات', 'اسم المستخدم على تيليغرام', 'لقطة شاشة بعد تأكيد الإيداع', 'جارٍ الإرسال…'] as const,
  ])('annonce un envoi localisé et ignore les soumissions répétées avant réponse (%s)', async (locale, accountLabel, telegramLabel, proofLabel, pendingLabel) => {
    const fetchMock = vi.mocked(fetch)
    const pendingRequest = deferred<Response>()
    fetchMock
      .mockReturnValueOnce(pendingRequest.promise)
      .mockResolvedValueOnce(response({ ok: false }, 503) as unknown as Response)

    const dialog = await reachStep4(locale)
    fireEvent.change(within(dialog).getByLabelText(accountLabel), { target: { value: 'account-123' } })
    fireEvent.change(within(dialog).getByLabelText(telegramLabel), { target: { value: '@test_user' } })
    fireEvent.change(within(dialog).getByLabelText(proofLabel), { target: { files: [new File([new Uint8Array([137, 80, 78, 71])], 'deposit.png', { type: 'image/png' })] } })
    fireEvent.click(within(dialog).getByRole('checkbox'))
    const form = dialog.querySelector('form')!
    vi.spyOn(form, 'reportValidity').mockReturnValue(true)
    fireEvent.submit(form)

    const submitButton = dialog.querySelector('button[type="submit"]') as HTMLButtonElement
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    expect(submitButton.disabled).toBe(true)
    expect(submitButton.getAttribute('aria-busy')).toBe('true')
    expect(form.getAttribute('aria-busy')).toBe('true')
    expect(submitButton.querySelector('svg.animate-spin')).toBeTruthy()
    expect(within(dialog).getByRole('status').textContent).toContain(pendingLabel)

    fireEvent.submit(form)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    pendingRequest.resolve(response({ ok: true, requestId: 'VIP-ASYNC', receiptToken: 'mock-token', status: 'pending_review', telegramInviteMode: 'manual-approval-private-status', telegramEnabled: false, inviteSent: false, ownerAlertSent: false }) as unknown as Response)
    expect(await screen.findByText(/VIP-ASYNC/)).toBeTruthy()
    await waitFor(() => expect(fetchMock.mock.calls.filter(([url]) => String(url) === `${API}/requests`)).toHaveLength(1))
  })

  it('ne reste pas bloqué après validation ou erreur réseau et autorise une nouvelle tentative', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(response({ ok: false }, 500) as unknown as Response)
    const dialog = await reachStep4()
    const account = within(dialog).getByLabelText('Identifiant du compte bookmaker')
    const telegram = within(dialog).getByLabelText('Nom d’utilisateur Telegram')
    fireEvent.change(account, { target: { value: 'account-123' } })
    fireEvent.change(telegram, { target: { value: 'bad' } })
    fireEvent.change(within(dialog).getByLabelText('Capture après confirmation du dépôt'), { target: { files: [new File([new Uint8Array([137, 80, 78, 71])], 'deposit.png', { type: 'image/png' })] } })
    fireEvent.click(within(dialog).getByRole('checkbox'))
    const form = dialog.querySelector('form')!
    vi.spyOn(form, 'reportValidity').mockReturnValue(true)
    const submitButton = dialog.querySelector('button[type="submit"]') as HTMLButtonElement

    fireEvent.submit(form)
    expect(within(dialog).getByRole('alert').textContent).toContain('Indique ton nom Telegram')
    expect(fetchMock).not.toHaveBeenCalled()
    expect(submitButton.disabled).toBe(false)
    expect(form.getAttribute('aria-busy')).toBe('false')

    fireEvent.change(telegram, { target: { value: '@test_user' } })
    fireEvent.submit(form)
    expect(await screen.findByText('Le service n’a pas confirmé l’enregistrement. Vérifie les champs et réessaie.')).toBeTruthy()
    await waitFor(() => expect(submitButton.disabled).toBe(false))
    expect(submitButton.getAttribute('aria-busy')).toBe('false')
    expect(form.getAttribute('aria-busy')).toBe('false')

    fireEvent.submit(form)
    expect(await screen.findByText('Le service n’a pas confirmé l’enregistrement. Vérifie les champs et réessaie.')).toBeTruthy()
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
    expect(submitButton.disabled).toBe(false)
  })

  it.each([
    [409, 'Une demande est déjà en cours'],
    [429, 'Trop de demandes ont été envoyées'],
    [500, 'Le service n’a pas confirmé'],
  ])('affiche l’erreur contrôlée HTTP %i sans appel réseau réel', async (status, message) => {
    const fetchMock = vi.mocked(fetch)
    fetchMock.mockResolvedValueOnce(response({ ok: false }, status) as unknown as Response)
    const dialog = await reachStep4()
    fireEvent.change(within(dialog).getByLabelText('Identifiant du compte bookmaker'), { target: { value: 'account-123' } })
    fireEvent.change(within(dialog).getByLabelText('Nom d’utilisateur Telegram'), { target: { value: 'test_user' } })
    fireEvent.change(within(dialog).getByLabelText('Capture après confirmation du dépôt'), { target: { files: [new File([new Uint8Array([1])], 'deposit.png', { type: 'image/png' })] } })
    fireEvent.click(within(dialog).getByRole('checkbox'))
    submitFormForTest(dialog)
    expect((await screen.findByRole('alert')).textContent).toContain(message)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0]).toBe(`${API}/requests`)
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('signale une erreur de suivi simulée après le reçu sans requête extérieure', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock
      .mockResolvedValueOnce(response({ ok: true, requestId: 'VIP-TEST-ERR', receiptToken: 'mock-token', status: 'pending_review', telegramInviteMode: 'manual-approval-private-status', telegramEnabled: false, inviteSent: false, ownerAlertSent: false }) as unknown as Response)
      .mockResolvedValueOnce(response({ ok: false }, 503) as unknown as Response)
      .mockResolvedValueOnce(response({ ok: false }, 503) as unknown as Response)
    const dialog = await reachStep4()
    fireEvent.change(within(dialog).getByLabelText('Identifiant du compte bookmaker'), { target: { value: 'account-123' } })
    fireEvent.change(within(dialog).getByLabelText('Nom d’utilisateur Telegram'), { target: { value: 'test_user' } })
    fireEvent.change(within(dialog).getByLabelText('Capture après confirmation du dépôt'), { target: { files: [new File([new Uint8Array([1])], 'deposit.png', { type: 'image/png' })] } })
    fireEvent.click(within(dialog).getByRole('checkbox'))
    submitFormForTest(dialog)
    expect(await screen.findByText(/VIP-TEST-ERR/)).toBeTruthy()
    expect(await screen.findByText('Le statut n’a pas pu être confirmé. Réessaie dans quelques instants.')).toBeTruthy()
    expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([
      `${API}/requests`,
      `${API}/requests/VIP-TEST-ERR/status`,
      `${API}/requests/VIP-TEST-ERR/status`,
    ])
    expect(fetchMock.mock.calls.every(([url]) => String(url).startsWith(API))).toBe(true)
  })
})
