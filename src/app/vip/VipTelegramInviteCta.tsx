'use client'

import type { Locale } from '@/lib/i18n'

type VipTelegramInviteCtaProps = {
  status: string | undefined
  inviteReady: boolean
  inviteLink: string | null
  lang: Locale
  label: string
}

export function isValidTelegramInvite(value: unknown): value is string {
  return typeof value === 'string' && /^https:\/\/t\.me\/(?:\+|joinchat\/)[A-Za-z0-9_-]+$/.test(value)
}

function TelegramLogo() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="vip-access-flow__telegram-logo">
      <circle cx="12" cy="12" r="12" fill="#24A1DE" />
      <path d="M20.46 5.18 17.98 18.1c-.19.92-.75 1.15-1.52.72l-4.2-3.09-2.03 1.95c-.23.23-.42.42-.86.42l.3-4.3 7.83-7.07c.34-.3-.07-.47-.52-.17l-9.68 6.1-4.17-1.3c-.91-.28-.93-.91.19-1.35l16.3-6.29c.76-.28 1.43.18 1.18 1.46Z" fill="white" />
    </svg>
  )
}

export function VipTelegramInviteCta({ status, inviteReady, inviteLink, lang, label }: VipTelegramInviteCtaProps) {
  if (status !== 'approved_pending_telegram' || inviteReady !== true || !isValidTelegramInvite(inviteLink)) return null

  return (
    <div className="vip-access-flow__invite-link" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <a className="vip-access-flow__telegram-cta" href={inviteLink} target="_blank" rel="noopener noreferrer">
        <TelegramLogo />
        <span>{label}</span>
      </a>
    </div>
  )
}
