import { cleanup, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { isValidTelegramInvite, VipTelegramInviteCta } from '../src/app/vip/VipTelegramInviteCta'

afterEach(cleanup)

const inviteLink = 'https://t.me/+TEST_SINGLE_USE_TOKEN'
const approvedProps = {
  status: 'approved_pending_telegram', inviteReady: true, inviteLink,
  lang: 'fr' as const, label: 'Rejoindre le VIP sur Telegram',
}

describe('VipTelegramInviteCta', () => {
  it('renders only for an approved request with a ready, valid individual invite URL', () => {
    const { rerender } = render(<VipTelegramInviteCta {...approvedProps} />)
    const link = screen.getByRole('link', { name: approvedProps.label })
    expect(link).toHaveAttribute('href', inviteLink)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    rerender(<VipTelegramInviteCta {...approvedProps} status="pending_review" />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    rerender(<VipTelegramInviteCta {...approvedProps} inviteReady={false} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    rerender(<VipTelegramInviteCta {...approvedProps} inviteLink={null} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it.each([
    'https://example.com/not-telegram', 'http://t.me/+NOT_SECURE',
    'https://t.me/public_channel', 'https://t.me.evil.example/+TOKEN',
    'javascript:alert(1)', 'https://t.me/+TOKEN?redirect=other',
  ])('rejects a non-individual or invalid URL: %s', value => {
    expect(isValidTelegramInvite(value)).toBe(false)
    render(<VipTelegramInviteCta {...approvedProps} inviteLink={value} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it.each([
    ['fr', 'Rejoindre le VIP sur Telegram'], ['en', 'Join VIP on Telegram'],
    ['ar', 'انضم إلى VIP عبر تيليغرام'],
  ] as const)('renders the %s label with its locale direction', (lang, label) => {
    const { container } = render(<VipTelegramInviteCta {...approvedProps} lang={lang} label={label} />)
    expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    expect(container.querySelector('.vip-access-flow__invite-link')).toHaveAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
  })

  it('keeps the CTA and its text constrained and wrappable on narrow screens', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8')
    expect(css).toMatch(/\.vip-access-flow__invite-link\s*\{[^}]*min-width:\s*0/)
    expect(css).toMatch(/\.vip-access-flow__telegram-cta\s*\{[^}]*max-width:\s*100%/)
    expect(css).toMatch(/\.vip-access-flow__telegram-cta\s*\{[^}]*flex-wrap:\s*nowrap/)
    expect(css).toMatch(/\.vip-access-flow__telegram-cta\s+span\s*\{[^}]*overflow-wrap:\s*anywhere/)
    expect(css).toMatch(/@media\s*\(max-width:\s*480px\)[\s\S]*?\.vip-access-flow__telegram-cta\s*\{[^}]*width:\s*100%/)
  })

  it('maintains WCAG AA contrast for its small white label in default and hover gradients', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8')
    const base = css.match(/\.vip-access-flow__telegram-cta\s*\{([^}]+)\}/)?.[1] || ''
    const hover = css.match(/\.vip-access-flow__telegram-cta:hover\s*\{([^}]+)\}/)?.[1] || ''
    for (const rule of [base, hover]) {
      const colors = rule.match(/#[0-9A-Fa-f]{6}/g)?.slice(0, 2) || []
      expect(colors).toHaveLength(2)
      for (const color of colors) {
        const components = [1, 3, 5].map(i => parseInt(color.slice(i, i + 2), 16) / 255)
          .map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
        const luminance = components.reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0)
        expect(1.05 / (luminance + 0.05)).toBeGreaterThanOrEqual(4.5)
      }
    }
  })
})
